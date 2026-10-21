"""Validación y corrección del caudal medio de HydroRIVERS con caudales observados.

Entradas
  data/raw/HydroRIVERS_v10_sa_shp/HydroRIVERS_v10_sa.shp   (DIS_AV_CMS, WaterGAP 2.2, 1971-2000)
  data/raw/hidro/estaciones_caudal.csv                     (módulos observados, BDHI/SNIH)

Salidas
  data/raw/hidro/validacion_hydrorivers.csv   una fila por estación: tramo asociado y razón modelo/observado
  data/interim/hydrorivers_corregido.parquet  HYRIV_ID, MAIN_RIV, DIS_AV_CMS, DIS_CORR_CMS, FACTOR,
                                              ESTACION, geometry (+ Q95_CORR_CMS, METODO, DIST_EST_KM)

Método (detalle en docs/datos-hidrologia.md)
  1. Emparejamiento estación-tramo: tramos a <= 5 km de la estación; se elige el que minimiza
     |log10(Qmod/Qobs)| + |log10(UPLAND/area)| (si la estación informa área) + 0,1·dist/5 km.
     Se acepta si Qmod/Qobs está dentro de un orden de magnitud (0,1-10) o si el área de aporte
     de la BDHI coincide con UPLAND_SKM a +-25 %. Asignación voraz por puntaje: un tramo admite
     una sola estación. Se excluyen brazos parciales del Paraná y canales (EXCLUIR) y se fuerzan
     cuatro estaciones del Desaguadero y el Atuel verificadas sobre el cauce principal (MANUAL).
  2. Factor por estación: f = Qobs / Qmod en el tramo emparejado.
  3. Propagación por la red (NEXT_DOWN), dentro de la misma cuenca (MAIN_RIV):
     - tramo con estación aguas arriba y aguas abajo en su camino de flujo: log(f) interpolado
       linealmente en log(UPLAND_SKM) entre ambas estaciones;
     - solo estación aguas abajo (afluentes y cabeceras): f de la primera estación aguas abajo;
     - solo estación aguas arriba (tramos inferiores): f de la estación aguas arriba con mayor
       área de aporte (se mantiene el factor hacia la desembocadura);
     - sin estación en la cuenca: f = 1 (sin corrección; METODO = "sin_dato").
  4. DIS_CORR_CMS = DIS_AV_CMS · f. En el tramo de cada estación, DIS_CORR_CMS = módulo observado.
     Q95_CORR_CMS = DIS_CORR_CMS · (Q95/módulo) de la estación que gobierna el tramo.

Uso: python pipeline/hidro_correccion.py
"""
from __future__ import annotations

from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
HR = ROOT / "data" / "raw" / "HydroRIVERS_v10_sa_shp" / "HydroRIVERS_v10_sa.shp"
EST = ROOT / "data" / "raw" / "hidro" / "estaciones_caudal.csv"
VAL = ROOT / "data" / "raw" / "hidro" / "validacion_hydrorivers.csv"
OUT = ROOT / "data" / "interim" / "hydrorivers_corregido.parquet"

BBOX = (-76.0, -56.5, -52.0, -20.0)   # Argentina con margen (incluye cuencas altas limítrofes)
CRS_M = "ESRI:102033"                 # South America Albers Equal Area Conic (metros)
RADIO_M = 5000.0
FMIN, FMAX = 1e-4, 10.0               # límites de seguridad del factor

# Estaciones verificadas sobre el cauce principal cuyo sesgo supera un orden de magnitud
# (ríos secados por riego o pérdidas). La regla automática las rechazaría; se asocian al tramo de
# cauce principal más cercano (tramos con >= 90 % del área de aporte máxima a <= 5 km).
MANUAL = {
    11424: "Desaguadero en Arco del Desaguadero: cauce principal a 0,04 km",
    11605: "Desaguadero en Salto de la Tosca: cauce principal a 3,2 km",
    11452: "Salado-Chadileuvú (Desaguadero) en Canalejas: cauce principal a 0,2 km",
    11453: "Atuel en Carmensa: cauce principal a 0,5 km",
}

# Estaciones que miden solo un brazo del cauce o el canal principal de un río con planicie
# de inundación: su caudal no es el del tramo de HydroRIVERS (que representa el río entero).
EXCLUIR = {
    13000: "brazo (Paraná, Chapetón - brazo principal); se usa Chapetón total 13005",
    13006: "brazo (Paraná, Riacho Zapata)",
    13007: "brazo (Paraná, río Colorado en Chapetón)",
    13807: "brazo (Paraná, brazo principal en Isla Pati)",
    13809: "brazo (Paraná, brazo secundario en Isla Pati)",
    13050: "Paraná en Túnel Subfluvial: solo cauce principal, parte del caudal pasa por la planicie",
}


def leer_rios() -> gpd.GeoDataFrame:
    cols = ["HYRIV_ID", "NEXT_DOWN", "MAIN_RIV", "UPLAND_SKM", "DIS_AV_CMS", "ORD_CLAS", "DIST_DN_KM"]
    g = gpd.read_file(HR, bbox=BBOX, columns=cols, engine="pyogrio")
    return g[cols + ["geometry"]]


def leer_estaciones() -> gpd.GeoDataFrame:
    e = pd.read_csv(EST)
    e = e[e["modulo_m3s"].notna() & (e["modulo_m3s"] > 0)].copy()
    e["excluida"] = e["codigo"].map(EXCLUIR)
    canal = (e["rio"].fillna("") + "|" + e["estacion"].fillna("")).str.contains(
        r"(?i)(?:^|\|)\s*(?:canal|acequia|zanja)\b")
    e.loc[canal & e["excluida"].isna(), "excluida"] = "canal o acequia (obra de derivación, no cauce natural)"
    return gpd.GeoDataFrame(e, geometry=gpd.points_from_xy(e["lon"], e["lat"]), crs="EPSG:4326")


def emparejar(rios: gpd.GeoDataFrame, est: gpd.GeoDataFrame) -> pd.DataFrame:
    rm = rios[["HYRIV_ID", "MAIN_RIV", "UPLAND_SKM", "DIS_AV_CMS", "geometry"]].to_crs(CRS_M)
    em = est.to_crs(CRS_M)
    buf = em.copy()
    buf["geometry"] = em.geometry.buffer(RADIO_M)
    cand = gpd.sjoin(buf, rm, predicate="intersects", how="left")
    cand = cand[cand["HYRIV_ID"].notna()].copy()
    pts = em.geometry.reindex(cand.index)
    lineas = rm.set_index("HYRIV_ID").geometry.loc[cand["HYRIV_ID"].astype("int64")].values
    cand["dist_km"] = pts.distance(gpd.GeoSeries(lineas, index=cand.index, crs=CRS_M)).values / 1000
    cand["razon"] = cand["DIS_AV_CMS"] / cand["modulo_m3s"]
    area = cand["area_km2"].where(cand["area_km2"] > 0)
    cand["razon_area"] = cand["UPLAND_SKM"] / area
    lq = np.abs(np.log10(cand["razon"].clip(lower=1e-6)))
    la = np.abs(np.log10(cand["razon_area"])).fillna(0)
    cand["score"] = lq + la + 0.1 * cand["dist_km"] / (RADIO_M / 1000)
    # Regla principal: caudal dentro de un orden de magnitud. Excepción: si el área de aporte
    # informada por la BDHI coincide con UPLAND_SKM a +-25 %, el tramo es inequívoco y se acepta
    # aunque el sesgo supere 10x (p. ej. ríos serranos de Córdoba).
    cand["ok"] = cand["razon"].between(0.1, 10) | cand["razon_area"].between(0.8, 1.25)
    cand["ok"] &= cand["excluida"].isna()
    cand = cand.reset_index().rename(columns={"index": "idx_est"})
    # Asignación voraz por puntaje: cada tramo recibe a lo sumo una estación; la que pierde un
    # tramo pasa a su siguiente candidato aceptable.
    usados, elegidos = set(), {}
    cand["criterio"] = np.where(cand["razon"].between(0.1, 10), "orden_de_magnitud", "area_+-25%")
    man = cand[cand["codigo"].isin(MANUAL)].copy()
    man = man[man["UPLAND_SKM"] >= 0.9 * man.groupby("idx_est")["UPLAND_SKM"].transform("max")]
    man = man.sort_values("dist_km").groupby("idx_est").head(1)   # cauce principal más cercano
    for i, r in man.iterrows():
        elegidos[r["idx_est"]] = i
        usados.add(r["HYRIV_ID"])
        cand.loc[i, ["ok", "criterio"]] = [True, "manual_cauce_principal"]
    for i, r in cand[cand["ok"]].sort_values("score").iterrows():
        if r["idx_est"] in elegidos or r["HYRIV_ID"] in usados:
            continue
        elegidos[r["idx_est"]] = i
        usados.add(r["HYRIV_ID"])
    resto = cand[~cand["idx_est"].isin(elegidos)].sort_values("score").groupby("idx_est").head(1)
    mejor = pd.concat([cand.loc[list(elegidos.values())], resto])
    mejor["ok"] = mejor.index.isin(list(elegidos.values()))
    # estaciones sin ningún tramo a 5 km
    sin = pd.DataFrame(est.drop(index=mejor["idx_est"]).drop(columns="geometry"))
    sin = sin.reset_index().rename(columns={"index": "idx_est"})
    val = pd.concat([pd.DataFrame(mejor.drop(columns="geometry")), sin], ignore_index=True)
    val["emparejada"] = val["ok"].fillna(False).astype(bool)
    # referencia: razón contra el cauce de mayor área de aporte a <= 5 km (para estaciones rechazadas)
    princ = cand.sort_values("UPLAND_SKM", ascending=False).groupby("idx_est").head(1).set_index("idx_est")
    val["razon_cauce_mayor"] = val["idx_est"].map(princ["razon"])
    val["area_dudosa"] = val["razon_area"].notna() & ~val["razon_area"].between(0.5, 2)
    val.loc[val["HYRIV_ID"].isna(), "motivo"] = "sin tramo a <= 5 km"
    val.loc[val["HYRIV_ID"].notna() & ~val["ok"].fillna(False).astype(bool), "motivo"] = \
        "ningún tramo libre a <= 5 km dentro de un orden de magnitud"
    val.loc[val["excluida"].notna(), "motivo"] = val["excluida"]
    val.loc[~val["emparejada"], "criterio"] = None
    val.loc[val["codigo"].isin(MANUAL), "motivo"] = val["codigo"].map(MANUAL)
    val["factor_obs_mod"] = 1 / val["razon"]
    keep = ["codigo", "estacion", "rio", "rio_objetivo", "lat", "lon", "area_km2", "modulo_m3s", "q95_m3s",
            "periodo", "n_anios", "HYRIV_ID", "MAIN_RIV", "UPLAND_SKM", "DIS_AV_CMS", "dist_km",
            "razon_area", "area_dudosa", "razon", "factor_obs_mod", "razon_cauce_mayor", "emparejada", "criterio", "motivo"]
    val = val[keep].rename(columns={"razon": "razon_mod_obs", "DIS_AV_CMS": "dis_av_cms_mod",
                                    "UPLAND_SKM": "upland_skm_mod"})
    for c in ["dist_km", "razon_area", "razon_mod_obs", "factor_obs_mod", "upland_skm_mod", "razon_cauce_mayor"]:
        val[c] = val[c].astype(float).round(3)
    return val.sort_values("razon_mod_obs", ascending=False)


def propagar(rios: gpd.GeoDataFrame, val: pd.DataFrame) -> pd.DataFrame:
    ok = val[val["emparejada"]].copy()
    ids = rios["HYRIV_ID"].to_numpy()
    pos = pd.Series(np.arange(len(ids)), index=ids)
    nd = rios["NEXT_DOWN"].map(pos).fillna(-1).astype(int).to_numpy()
    area = rios["UPLAND_SKM"].to_numpy(float)
    n = len(ids)
    g_est = np.full(n, -1)                     # estación en el tramo (índice en ok)
    ok = ok.reset_index(drop=True)
    for i, h in enumerate(ok["HYRIV_ID"].astype("int64")):
        g_est[pos[h]] = i
    logf = np.log(ok["factor_obs_mod"].clip(FMIN, FMAX).to_numpy())

    # 1) primera estación aguas abajo: recorrer de la desembocadura hacia arriba
    orden_dn = np.argsort(rios["DIST_DN_KM"].to_numpy())
    dn = np.full(n, -1)
    for r in orden_dn:
        dn[r] = g_est[r] if g_est[r] >= 0 else (dn[nd[r]] if nd[r] >= 0 else -1)
    # 2) estación aguas arriba con mayor área: recorrer de cabeceras hacia abajo
    up = np.full(n, -1)
    up_area = np.zeros(n)
    for r in orden_dn[::-1]:
        if g_est[r] >= 0:
            up[r], up_area[r] = g_est[r], area[r]
        d = nd[r]
        if d >= 0 and up[r] >= 0 and up_area[r] > up_area[d] and g_est[d] < 0:
            up[d], up_area[d] = up[r], up_area[r]

    est_area = ok["upland_skm_mod"].to_numpy(float)
    f = np.ones(n)
    metodo = np.array(["sin_dato"] * n, dtype=object)
    gob = np.full(n, -1)
    a_dn = np.where(dn >= 0, est_area[np.maximum(dn, 0)], np.nan)
    a_up = np.where(up >= 0, est_area[np.maximum(up, 0)], np.nan)
    both = (dn >= 0) & (up >= 0) & (dn != up)
    w = np.zeros(n)
    with np.errstate(divide="ignore", invalid="ignore"):
        w[both] = ((np.log(area[both]) - np.log(a_up[both])) / (np.log(a_dn[both]) - np.log(a_up[both])))
    w = np.clip(np.nan_to_num(w), 0, 1)
    lf = np.zeros(n)
    lf[both] = (1 - w[both]) * logf[up[both]] + w[both] * logf[dn[both]]
    metodo[both] = "interpolado"
    gob[both] = np.where(w[both] >= 0.5, dn[both], up[both])
    solo_dn = (dn >= 0) & ~both
    lf[solo_dn] = logf[dn[solo_dn]]
    metodo[solo_dn] = "estacion_aguas_abajo"
    gob[solo_dn] = dn[solo_dn]
    solo_up = (up >= 0) & (dn < 0)
    lf[solo_up] = logf[up[solo_up]]
    metodo[solo_up] = "estacion_aguas_arriba"
    gob[solo_up] = up[solo_up]
    en_est = g_est >= 0
    lf[en_est] = logf[g_est[en_est]]
    metodo[en_est] = "observado"
    gob[en_est] = g_est[en_est]
    f = np.exp(lf)

    q95r = (ok["q95_m3s"] / ok["modulo_m3s"]).to_numpy(float)
    nombre = (ok["estacion"] + " (" + ok["rio"].fillna("") + ", BDHI " + ok["codigo"].astype(str) + ")").to_numpy()
    out = rios[["HYRIV_ID", "MAIN_RIV", "DIS_AV_CMS"]].copy()
    out["DIS_CORR_CMS"] = out["DIS_AV_CMS"] * f
    out.loc[en_est, "DIS_CORR_CMS"] = ok["modulo_m3s"].to_numpy()[g_est[en_est]]
    out["FACTOR"] = f
    out["ESTACION"] = np.where(gob >= 0, nombre[np.maximum(gob, 0)], None)
    out["Q95_CORR_CMS"] = np.where(gob >= 0, out["DIS_CORR_CMS"] * q95r[np.maximum(gob, 0)], np.nan)
    out["METODO"] = metodo
    out["geometry"] = rios.geometry.values
    return gpd.GeoDataFrame(out, geometry="geometry", crs=rios.crs)


def main():
    rios = leer_rios()
    est = leer_estaciones()
    val = emparejar(rios, est)
    VAL.parent.mkdir(parents=True, exist_ok=True)
    val.to_csv(VAL, index=False)
    m = val[val["emparejada"]]
    print(f"estaciones: {len(val)}  emparejadas: {len(m)}")
    print(f"razón mod/obs mediana {m['razon_mod_obs'].median():.2f}; "
          f">2x: {(m['razon_mod_obs'] > 2).sum()}  <0.5x: {(m['razon_mod_obs'] < 0.5).sum()}")
    cor = propagar(rios, val)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    cor.to_parquet(OUT, index=False)
    print(cor["METODO"].value_counts().to_string())
    print(f"-> {OUT}")


if __name__ == "__main__":
    main()
