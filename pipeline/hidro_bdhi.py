"""Descarga caudales observados de la Base de Datos Hidrológica Integrada (BDHI).

Fuente: Sistema Nacional de Información Hídrica (SNIH), Secretaría de Infraestructura
y Política Hídrica, https://snih.hidricosargentina.gob.ar/ . Se usan los mismos
servicios JSON que consume el visor web (Filtros.aspx/LeerEstaciones,
MuestraDatos.aspx/LeerListaAsociaciones y MuestraDatos.aspx/LeerDatosHistoricos).

Salidas:
  data/raw/hidro/bdhi/estaciones.json      metadatos de todas las estaciones
  data/raw/hidro/bdhi/asociaciones.json    variables medidas por estación
  data/raw/hidro/bdhi/diarios/<cod>.csv    caudal medio diario (código 101)
  data/raw/hidro/bdhi_resumen.csv          estadísticos por estación (todas)

Uso: python pipeline/hidro_bdhi.py [--solo-resumen]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import pandas as pd
import requests

BASE = "https://snih.hidricosargentina.gob.ar"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "raw" / "hidro" / "bdhi"
DIARIOS = OUT / "diarios"
COD_QMD = 101  # Caudal medio diario (m3/s)
COD_QMM = 102  # Caudal medio mensual (m3/s)
HOY = dt.date.today()


def post(path: str, payload: dict | None = None, timeout: int = 300):
    r = requests.post(f"{BASE}/{path}", data=json.dumps(payload) if payload else "",
                      headers={"Content-Type": "application/json; charset=utf-8"},
                      timeout=timeout)
    r.raise_for_status()
    return r.json()["d"]


def ms2date(s: str) -> dt.datetime:
    ms = int(re.search(r"-?\d+", s).group())
    return dt.datetime(1970, 1, 1) + dt.timedelta(milliseconds=ms)


def metadatos():
    OUT.mkdir(parents=True, exist_ok=True)
    fe, fa = OUT / "estaciones.json", OUT / "asociaciones.json"
    if not fe.exists():
        fe.write_text(json.dumps(post("Filtros.aspx/LeerEstaciones"), ensure_ascii=False))
    if not fa.exists():
        fa.write_text(json.dumps(post("MuestraDatos.aspx/LeerListaAsociaciones"), ensure_ascii=False))
    return json.loads(fe.read_text()), json.loads(fa.read_text())


def descargar_serie(cod: int, desde: int, codigo: int = COD_QMD) -> Path:
    f = DIARIOS / f"{cod}.csv" if codigo == COD_QMD else DIARIOS / f"{cod}_mensual.csv"
    if f.exists():
        return f
    filas = []
    hasta = HOY.year
    for y0 in range(max(desde, 1900), hasta + 1, 10):
        y1 = min(y0 + 9, hasta)
        payload = {"fechaDesde": f"{y0}-01-01", "fechaHasta": f"{y1}-12-31",
                   "estacion": str(cod), "codigo": str(codigo), "validados": "false"}
        for intento in range(3):
            try:
                d = post("MuestraDatos.aspx/LeerDatosHistoricos", payload)
                break
            except Exception as e:  # noqa: BLE001
                if intento == 2:
                    print(f"  ! {cod} {y0}-{y1}: {e}", file=sys.stderr)
                    d = {"Mediciones": []}
        for m in d.get("Mediciones") or []:
            filas.append((ms2date(m["FechaHora"]).strftime("%Y-%m-%d"), m["Medicion"],
                          (m.get("Calificador") or "").strip(), m.get("Validado")))
    df = pd.DataFrame(filas, columns=["fecha", "q", "calif", "validado"]).drop_duplicates("fecha")
    DIARIOS.mkdir(parents=True, exist_ok=True)
    df.to_csv(f, index=False)
    return f


def estadisticos(f: Path, mensual: bool = False) -> dict | None:
    df = pd.read_csv(f)
    if df.empty:
        return None
    df = df[(df["q"] >= 0) & (df["q"] != -999)].copy()
    if df.empty:
        return None
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["anio"] = df["fecha"].dt.year
    n = df.groupby("anio")["q"].agg(["mean", "count", "min"])
    umbral = 11 if mensual else 330
    comp = n[n["count"] >= umbral]
    if len(comp) == 0:
        return None
    valid = df[df["anio"].isin(comp.index)]
    return {
        "modulo_m3s": round(float(comp["mean"].mean()), 3),
        "q95_m3s": None if mensual else round(float(np.percentile(valid["q"], 5)), 3),
        "qmin_m3s": round(float(valid["q"].min()), 3),
        "anio_ini": int(comp.index.min()),
        "anio_fin": int(comp.index.max()),
        "n_anios": int(len(comp)),
        "base": "mensual" if mensual else "diario",
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo-resumen", action="store_true")
    ap.add_argument("--hilos", type=int, default=6)
    a = ap.parse_args()
    est, asoc = metadatos()
    est = {e["Codigo"]: e for e in est}
    series: dict[int, dict[int, int]] = {}
    for x in asoc:
        if x["Codigo"] in (COD_QMD, COD_QMM) and x["Estacion"] in est:
            y = ms2date(x["Desde"]).year
            d = series.setdefault(x["Estacion"], {})
            d[x["Codigo"]] = min(d.get(x["Codigo"], 9999), y)
    print(f"{len(series)} estaciones con caudal")
    if not a.solo_resumen:
        def tarea(item):
            cod, d = item
            if COD_QMD in d:
                descargar_serie(cod, d[COD_QMD], COD_QMD)
            # La serie mensual solo se descarga si no hay diaria (o vino vacía).
            fd = DIARIOS / f"{cod}.csv"
            if COD_QMM in d and (not fd.exists() or fd.stat().st_size < 100):
                descargar_serie(cod, d[COD_QMM], COD_QMM)
            return cod
        with ThreadPoolExecutor(a.hilos) as ex:
            for i, _ in enumerate(ex.map(tarea, series.items()), 1):
                if i % 25 == 0:
                    print(f"  {i}/{len(series)}")
    filas = []
    for cod, d in series.items():
        e = est[cod]
        s = None
        fd, fm = DIARIOS / f"{cod}.csv", DIARIOS / f"{cod}_mensual.csv"
        if fd.exists():
            s = estadisticos(fd)
        if s is None and fm.exists():
            s = estadisticos(fm, mensual=True)
        if s is None:
            continue
        filas.append({"codigo": cod, "estacion": e["Descripcion"].strip(), "rio": (e["Rio"] or "").strip(),
                      "lat": -abs(e["Latitud"]), "lon": -abs(e["Longitud"]),
                      "area_km2": e["Area"] if e["Area"] and e["Area"] > 0 else None,
                      "cuenca_bdhi": e["Cuenca"], "red": e["Red"], **s})
    res = pd.DataFrame(filas).sort_values(["rio", "estacion"])
    res.to_csv(OUT.parent / "bdhi_resumen.csv", index=False)
    print(f"resumen: {len(res)} estaciones -> {OUT.parent / 'bdhi_resumen.csv'}")
    tabla_estaciones(res)


def _norm(s: str) -> str:
    import unicodedata
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower().strip()
    return re.sub(r"\s+", " ", s)


def rio_objetivo(rio: str, lat: float, lon: float) -> str | None:
    """Asigna la estación a uno de los ríos principales pedidos (None si es otro río)."""
    r = _norm(rio)
    simples = {"parana": "Paraná", "uruguay": "Uruguay", "paraguay": "Paraguay", "bermejo": "Bermejo",
               "pilcomayo": "Pilcomayo", "dulce": "Dulce", "primero": "Primero (Suquía)",
               "suquia": "Primero (Suquía)", "tercero": "Tercero (Ctalamochita)", "cuarto": "Cuarto (Chocancharava)",
               "desaguadero": "Desaguadero", "mendoza": "Mendoza", "san juan": "San Juan", "atuel": "Atuel",
               "diamante": "Diamante", "tunuyan": "Tunuyán", "negro": "Negro", "limay": "Limay",
               "neuquen": "Neuquén", "chubut": "Chubut", "senguerr": "Senguer", "senguer": "Senguer",
               "deseado": "Deseado", "santa cruz": "Santa Cruz", "gallegos": "Gallegos", "iguazu": "Iguazú",
               "corriente": "Corrientes", "corrientes": "Corrientes", "gualeguay": "Gualeguay",
               "juramento": "Salado del Norte (Juramento)"}
    if r in simples:
        if r == "negro" and lat > -37:   # río Negro del Chaco / NEA
            return None
        return simples[r]
    if r == "colorado" and lat < -36:
        return "Colorado"
    if r == "chico" and lat < -48:
        return "Chico (Santa Cruz)"
    if r == "grande" and lat < -53:
        return "Grande (Tierra del Fuego)"
    if r == "salado":
        if lat < -34 and lon > -61.5:
            return "Salado (Buenos Aires)"
        if -32 < lat and -65 < lon < -60:
            return "Salado del Norte (Juramento)"
    return None


def tabla_estaciones(res: pd.DataFrame, min_anios: int = 5):
    """Escribe data/raw/hidro/estaciones_caudal.csv (estaciones con >= min_anios años completos)."""
    t = res[res["n_anios"] >= min_anios].copy()
    t["rio_objetivo"] = [rio_objetivo(r, la, lo) for r, la, lo in zip(t["rio"], t["lat"], t["lon"])]
    t["periodo"] = t["anio_ini"].astype(str) + "-" + t["anio_fin"].astype(str)
    t["fuente"] = ("BDHI - Sistema Nacional de Información Hídrica, Secretaría de Infraestructura y "
                   "Política Hídrica; caudal medio " + t["base"] + " (código " +
                   np.where(t["base"] == "diario", "101", "102") + "), módulo = media de años con >= " +
                   np.where(t["base"] == "diario", "330 días", "11 meses") + " con dato")
    t["url"] = ("https://snih.hidricosargentina.gob.ar/Filtros.aspx (estación " + t["codigo"].astype(str) +
                "; servicio MuestraDatos.aspx/LeerDatosHistoricos)")
    cols = ["codigo", "estacion", "rio", "rio_objetivo", "lat", "lon", "area_km2", "modulo_m3s", "q95_m3s",
            "qmin_m3s", "periodo", "n_anios", "base", "fuente", "url"]
    t = t[cols].sort_values(["rio_objetivo", "rio", "estacion"], na_position="last")
    t.to_csv(OUT.parent / "estaciones_caudal.csv", index=False)
    print(f"tabla: {len(t)} estaciones ({t['rio_objetivo'].notna().sum()} en ríos objetivo) -> "
          f"{OUT.parent / 'estaciones_caudal.csv'}")


if __name__ == "__main__":
    main()
