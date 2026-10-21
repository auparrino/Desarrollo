"""Limpieza de datos economicos: empleo formal (CEP XXI / SIPA), salarios,
establecimientos productivos y proyectos productivos georreferenciados.

Entrada : data/raw/economia/**  (descargado segun docs/datos-economia.md)
Salida  : data/interim/economia/*

Uso: python3 -I pipeline/economia.py
No toca build.py ni web/public/data.
"""
from __future__ import annotations

import json
import re
import subprocess
import unicodedata
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data/raw/economia"
OUT = ROOT / "data/interim/economia"
OUT.mkdir(parents=True, exist_ok=True)
DEPTOS = ROOT / "web/public/data/departamentos.geojson"

# Codigos CEP (SIPA) que cambiaron respecto de la geometria de la app.
# 06217 Chascomus (incluye Lezama 06466, creado en 2009) -> 06218
# 94007 Rio Grande (incluye Tolhuin 94011)               -> 94008
# 94014 Ushuaia                                           -> 94015
REMAP = {"06217": "06218", "94007": "94008", "94014": "94015"}

ANIO_MIN_COMPLETO, ANIO_MAX_COMPLETO = 2014, 2022  # 2023 llega solo a noviembre


def cod5(s: pd.Series) -> pd.Series:
    out = s.astype("Int64").astype(str).str.zfill(5)
    return out.replace(REMAP)


def norm(s) -> str:
    if s is None or (isinstance(s, float) and np.isnan(s)):
        return ""
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


# ---------------------------------------------------------------- CEP XXI
def leer_cep(nombre: str, valor: str) -> pd.DataFrame:
    sub = "puestos" if nombre.startswith("puestos") else "salarios"
    d = pd.read_csv(RAW / "cep" / sub / f"{nombre}.csv")
    d = d[d.codigo_departamento_indec.notna()].copy()
    d["cod_dep"] = cod5(d.codigo_departamento_indec)
    d["fecha"] = pd.to_datetime(d.fecha)
    d.loc[d[valor] == -99, valor] = np.nan  # secreto estadistico (1-2 puestos)
    return d.drop(columns=["codigo_departamento_indec", "id_provincia_indec"])


def ipc() -> pd.Series:
    s = pd.read_csv(RAW / "indec/ipc_nacional_nivel_general.csv", parse_dates=["indice_tiempo"])
    return s.set_index("indice_tiempo")["ipc_nivel_general_nacional"]


def empleo_departamento() -> pd.DataFrame:
    series = {
        "puestos_priv": ("puestos_depto_priv", "puestos"),
        "puestos_tot_emp": ("puestos_depto_tot_emp", "puestos"),
        "puestos_pub": ("puestos_depto_pub", "puestos"),
        "puestos_total": ("puestos_depto_total", "puestos"),
        "salario_medio_priv": ("w_mean_depto_priv", "w_mean"),
        "salario_mediano_priv": ("w_median_depto_priv", "w_median"),
        "salario_medio_pub": ("w_mean_depto_pub", "w_mean"),
        "salario_medio_total": ("w_mean_depto_total", "w_mean"),
    }
    m = None
    for col, (f, v) in series.items():
        d = leer_cep(f, v).rename(columns={v: col})
        m = d if m is None else m.merge(d, on=["cod_dep", "fecha"], how="outer")

    # salario relativo al promedio nacional ponderado del mismo mes (sin deflactar)
    w = m.dropna(subset=["salario_medio_priv", "puestos_priv"])
    nac = (w.salario_medio_priv * w.puestos_priv).groupby(w.fecha).sum() / w.puestos_priv.groupby(w.fecha).sum()
    m["salario_rel_nac_priv"] = m.salario_medio_priv / m.fecha.map(nac)

    # salario real en pesos de noviembre de 2023 (IPC INDEC, base dic-2016; desde 2017)
    p = ipc()
    base = p.loc["2023-11-01"]
    m["salario_real_priv_nov2023"] = m.salario_medio_priv * base / m.fecha.map(p)
    m.loc[m.fecha < "2017-01-01", "salario_real_priv_nov2023"] = np.nan

    m["anio"] = m.fecha.dt.year
    cols = [c for c in m.columns if c not in ("cod_dep", "fecha", "anio")]
    a = m.groupby(["cod_dep", "anio"])[cols].mean()
    a["meses"] = m.groupby(["cod_dep", "anio"]).fecha.nunique()
    a = a.reset_index()
    for c in [c for c in cols if c.startswith("puestos")]:
        a[c] = a[c].round(1)
    for c in [c for c in cols if c.startswith("salario_") and "rel" not in c]:
        a[c] = a[c].round(0)
    a["salario_rel_nac_priv"] = a.salario_rel_nac_priv.round(3)
    return a, m


def sectores(nivel: str) -> pd.DataFrame:
    f = "puestos_depto_priv_por_clae2" if nivel == "clae2" else "puestos_depto_priv_por_letra"
    d = leer_cep(f, "puestos")
    d["anio"] = d.fecha.dt.year
    a = d.groupby(["cod_dep", "anio", nivel]).puestos.mean().round(1).reset_index()
    return a


# ---------------------------------------------------------------- indicadores
def indicadores(anual: pd.DataFrame, mensual: pd.DataFrame, letra: pd.DataFrame,
                clae2: pd.DataFrame, pob: pd.DataFrame) -> pd.DataFrame:
    p = anual.pivot(index="cod_dep", columns="anio", values="puestos_priv")
    ind = pd.DataFrame(index=p.index)
    for y in (2014, 2019, 2022):
        ind[f"puestos_priv_{y}"] = p[y]
    # 2023 y su comparacion con 2019 usando solo enero-noviembre en ambos anios
    mm = mensual[mensual.fecha.dt.month <= 11]
    en = mm.assign(anio=mm.fecha.dt.year).groupby(["cod_dep", "anio"]).puestos_priv.mean().unstack()
    ind["puestos_priv_2023_ene_nov"] = en[2023].round(1)

    y0, y1 = ANIO_MIN_COMPLETO, ANIO_MAX_COMPLETO
    ind["var_pct_2014_2022"] = (100 * (p[y1] / p[y0] - 1)).round(2)
    ind["tasa_anual_2014_2022"] = (100 * ((p[y1] / p[y0]) ** (1 / (y1 - y0)) - 1)).round(3)
    ind["var_pct_2019_2023_ene_nov"] = (100 * (en[2023] / en[2019] - 1)).round(2)
    nac0, nac1 = p[y0].sum(), p[y1].sum()
    ind["var_pct_nacional_2014_2022"] = round(100 * (nac1 / nac0 - 1), 2)
    ind["dif_vs_nacional_pp"] = (ind.var_pct_2014_2022 - ind.var_pct_nacional_2014_2022).round(2)

    # shift-share 2014-2022 con CLAE2 (celdas suprimidas = 0)
    c = clae2[clae2.anio.isin([y0, y1])].pivot_table(index=["cod_dep", "clae2"], columns="anio",
                                                         values="puestos", aggfunc="sum").fillna(0)
    gi = c.groupby(level="clae2").sum()
    gi = gi[y1] / gi[y0] - 1
    gn = c[y1].sum() / c[y0].sum() - 1
    e0 = c[y0]
    g_i = c.index.get_level_values("clae2").map(gi).to_numpy()
    ss = pd.DataFrame({
        "ss_efecto_nacional": e0 * gn,
        "ss_efecto_estructural": e0 * (np.nan_to_num(g_i) - gn),
        "ss_efecto_competitivo": c[y1] - e0 * (1 + np.nan_to_num(g_i)),
    }).groupby(level="cod_dep").sum()
    base = c[y0].groupby(level="cod_dep").sum()
    ss["ss_competitivo_pct_base"] = (100 * ss.ss_efecto_competitivo / base.replace(0, np.nan)).round(2)
    ind = ind.join(ss.round(1))

    # especializacion sectorial 2022: cociente de localizacion (LQ) por letra
    l = letra[letra.anio == y1].pivot_table(index="cod_dep", columns="letra", values="puestos",
                                            aggfunc="sum").fillna(0)
    lq = (l.div(l.sum(axis=1), axis=0)) / (l.sum(axis=0) / l.sum().sum())
    for k in ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "M", "N"]:
        if k in lq:
            ind[f"lq_{k}"] = lq[k].round(3)

    # sector CLAE2 de mayor especializacion (LQ con al menos 100 puestos) y diversificacion
    k2 = clae2[clae2.anio == y1].pivot_table(index="cod_dep", columns="clae2", values="puestos",
                                             aggfunc="sum").fillna(0)
    sh = k2.div(k2.sum(axis=1), axis=0)
    lq2 = sh / (k2.sum(axis=0) / k2.sum().sum())
    lq2 = lq2.where(k2 >= 100)
    ok = lq2.notna().any(axis=1)
    ind["clae2_especializacion"] = lq2[ok].idxmax(axis=1)
    ind["lq_clae2_especializacion"] = lq2.max(axis=1).round(2)
    ind["clae2_principal"] = k2.idxmax(axis=1)
    ind["share_clae2_principal"] = sh.max(axis=1).round(3)
    ind["hhi_clae2"] = (sh ** 2).sum(axis=1).round(4)

    s = anual[anual.anio == y1].set_index("cod_dep")
    ind["salario_medio_priv_2022"] = s.salario_medio_priv
    ind["salario_rel_nac_priv_2022"] = s.salario_rel_nac_priv
    s17 = anual[anual.anio == 2017].set_index("cod_dep").salario_real_priv_nov2023
    ind["var_pct_salario_real_2017_2022"] = (100 * (s.salario_real_priv_nov2023 / s17 - 1)).round(2)
    ind["share_publico_2022"] = (s.puestos_pub / s.puestos_total).round(3)

    ind = ind.join(pob[["pob2022"]])
    ind["puestos_priv_cada_1000hab_2022"] = (1000 * ind.puestos_priv_2022 / ind.pob2022).round(1)
    return ind.reset_index()


# ---------------------------------------------------------------- establecimientos
def establecimientos() -> pd.DataFrame:
    e = pd.read_csv(RAW / "cep/establecimientos/distribucion_establecimientos_productivos_sexo.csv",
                    usecols=["anio", "lat", "lon", "clae6", "in_departamentos", "empleo"])
    e["cod_dep"] = e.in_departamentos.astype(str).str.zfill(5).replace(REMAP)
    e["rango"] = e.empleo.str.slice(3)
    t = e.pivot_table(index=["cod_dep", "anio"], columns="rango", values="clae6", aggfunc="count").fillna(0)
    t.columns = [f"estab_{c.replace('-', '_').replace('+', '_mas')}" for c in t.columns]
    t["estab_total"] = t.sum(axis=1)
    t["estab_200_mas"] = t.get("estab_200_499", 0) + t.get("estab_500_mas", 0)
    e["clae2"] = e.clae6 // 10000
    ind = e[e.clae2 <= 33].groupby(["cod_dep", "anio"]).size().rename("estab_agro_mineria_industria")
    t = t.join(ind).fillna(0).astype(int).reset_index()
    # grandes establecimientos como puntos (200+ empleados), utiles para "polos" existentes
    g = e[(e.anio == 2022) & e.empleo.str.startswith(("d.", "e."))]
    g = g[["lat", "lon", "clae6", "cod_dep", "rango"]]
    g.to_csv(OUT / "establecimientos_grandes_2022.csv", index=False)
    return t


# ---------------------------------------------------------------- proyectos
def etapa_mineria(x: str) -> str:
    x = norm(x)
    if x in ("produccion", "reingenieria"):
        return "operacion"
    if x == "construccion":
        return "construccion"
    if x in ("factibilidad", "prefactibilidad", "evaluacion economica preliminar"):
        return "desarrollo"
    if x.startswith("exploracion") or x == "prospeccion":
        return "exploracion"
    return "otra"


def mineria(nombre_xlsx: str, tipo_default: str, url: str) -> gpd.GeoDataFrame:
    m = pd.read_excel(RAW / "mineria" / nombre_xlsx, sheet_name=0)
    m.columns = [norm(c).replace(" ", "_") for c in m.columns]
    m = m.dropna(subset=["latitud", "longitud"])
    mineral = m.mineral_principal.astype(str).str.strip()
    if tipo_default == "mineria_metalifera":
        tipo = np.select([mineral.eq("Litio"), mineral.eq("Cobre")], ["mineria_litio", "mineria_cobre"],
                         "mineria_metalifera")
    else:
        tipo = tipo_default
    op = m.get("controlante_1", m.get("operador"))
    df = pd.DataFrame({
        "nombre": m.nombre.astype(str).str.strip(), "tipo": tipo, "subtipo": mineral,
        "etapa": m.estado.astype(str).str.strip(), "etapa_norm": m.estado.map(etapa_mineria),
        "operador": op, "lat": m.latitud.astype(float), "lon": m.longitud.astype(float),
        "precision": "punto_proyecto",
        "fuente": "Secretaria de Mineria - SIACAM, Cartera de proyectos mineros", "fuente_url": url,
    })
    if tipo_default == "mineria_metalifera":
        a = pd.read_csv(RAW / "mineria/anuncios_inversion_siacam.csv")
        a.columns = [c.strip() for c in a.columns]
        a["k"] = a.Proyecto.map(norm)
        inv = a.groupby("k")["Dólares"].sum()
        df["inversion_anunciada_usd"] = df.nombre.map(norm).map(inv)
    return gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs=4326)


def hidrocarburos() -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    c = gpd.read_file(RAW / "energia/sig_planosbase_concesiones_explotacion.geojson").to_crs(4326)
    c["geometry"] = c.geometry.make_valid()
    w = gpd.read_file(RAW / "energia/sig_pozos_noconvencionales_shale.geojson").to_crs(4326)
    vm = w[w.formacion.str.lower().str.strip() == "vaca muerta"]
    j = gpd.sjoin(vm[["idpozo", "tipoestado", "geometry"]], c[["id_concesion", "geometry"]],
                  predicate="within", how="inner")
    n = j.groupby("id_concesion").size().rename("pozos_vaca_muerta")
    act = j[j.tipoestado.fillna("").str.contains("Extracci", case=False)].groupby("id_concesion").size()
    c = c.merge(n, left_on="id_concesion", right_index=True, how="left")
    c["pozos_vaca_muerta_en_extraccion"] = c.id_concesion.map(act)
    c[["pozos_vaca_muerta", "pozos_vaca_muerta_en_extraccion"]] = c[["pozos_vaca_muerta", "pozos_vaca_muerta_en_extraccion"]].fillna(0).astype(int)
    c["observaciones"] = c.observaciones.fillna("").str.replace("<br>", " ", regex=False)
    c["participacion"] = c.participacion.fillna("").str.replace("<br>", " ", regex=False).str.strip()
    c.to_file(OUT / "concesiones_hidrocarburos.geojson", driver="GeoJSON")
    rp = c.copy()
    rp["geometry"] = c.to_crs(5345).representative_point().to_crs(4326)  # POSGAR 2007 / Argentina 5
    df = pd.DataFrame({
        "nombre": rp.areapermisoconcesion, "tipo": np.where(rp.pozos_vaca_muerta > 0, "hidrocarburos_vaca_muerta",
                                                            "hidrocarburos"),
        "subtipo": np.where(rp.pozos_vaca_muerta > 0, "no convencional (Vaca Muerta)", "area de explotacion"),
        "etapa": rp.estadodearea, "etapa_norm": "operacion", "operador": rp.empresa_operadora,
        "pozos_vaca_muerta": rp.pozos_vaca_muerta,
        "pozos_vaca_muerta_en_extraccion": rp.pozos_vaca_muerta_en_extraccion,
        "precision": "punto_interior_area",
        "fuente": "Secretaria de Energia - SIG (WFS planosbase_concesiones_explotacion; pozos_noconvencionales_shale)",
        "fuente_url": "https://sig.energia.gob.ar/wmspubmap",
    })
    pts = gpd.GeoDataFrame(df, geometry=rp.geometry.values, crs=4326)
    pts["lon"], pts["lat"] = pts.geometry.x.round(5), pts.geometry.y.round(5)
    return pts, vm


RENOV_TEC = {"Eólica": "energia_eolica", "Fotovoltaica": "energia_solar",
             "Hidroeléctrica (Menor a 50 Mw)": "energia_hidro_pequena", "Biogas": "energia_biogas",
             "Biomasa": "energia_biomasa"}
OBRA_TEC = {"SOLAR": "energia_solar", "SOLAR CON ALMACENAMIENTO": "energia_solar", "EÓLICA": "energia_eolica",
            "EÓLICO CON ALMACENAMIENTO": "energia_eolica", "BIOGÁS": "energia_biogas", "BIOMASA": "energia_biomasa",
            "PAH": "energia_hidro_pequena", "HI": "energia_hidro", "BRS": "energia_biogas"}


def renovables() -> gpd.GeoDataFrame:
    c = gpd.read_file(RAW / "energia/sig_visor_centrales_unificacion.geojson").to_crs(4326)
    c = c[c.tecnologia_etiqueta.isin(RENOV_TEC)]
    a = gpd.GeoDataFrame({
        "nombre": c.nombre, "tipo": c.tecnologia_etiqueta.map(RENOV_TEC), "subtipo": c.tecnologia_maquinas,
        "etapa": "en operacion (MEM)", "etapa_norm": "operacion", "operador": c.nombre_agente,
        "precision": "punto_central",
        "fuente": "Secretaria de Energia - SIG, capa visor_centrales_unificacion (fuente: CAMMESA)",
        "fuente_url": "https://sig.energia.gob.ar/wmspubmap",
    }, geometry=c.geometry.values, crs=4326)
    o = gpd.read_file(RAW / "energia/sig_renovables_vi_visor_obras_renovar.geojson").to_crs(4326)
    est = o.estado.fillna("").str.strip()
    b = gpd.GeoDataFrame({
        "nombre": o.proyecto, "tipo": o.tecnologia.map(OBRA_TEC).fillna("energia_renovable"),
        "subtipo": o.tecnologia, "etapa": est.replace("", "sin dato"),
        "etapa_norm": est.map({"En Construcción": "construccion", "Finalizado": "operacion",
                               "No iniciado": "desarrollo"}).fillna("sin dato"),
        "ronda": o.ronda.replace("", None), "potencia_mw": o.potencia_mw, "precision": "punto_obra",
        "fuente": "Secretaria de Energia - SIG, capa renovables_vi_visor_obras_renovar (RenovAr / MATER)",
        "fuente_url": "https://sig.energia.gob.ar/wmspubmap",
    }, geometry=o.geometry.values, crs=4326)
    r = pd.concat([a, b], ignore_index=True)
    r["lon"], r["lat"] = r.geometry.x.round(5), r.geometry.y.round(5)
    return gpd.GeoDataFrame(r, geometry="geometry", crs=4326)


def parques_industriales() -> gpd.GeoDataFrame:
    ods = RAW / "parques_industriales/base-rempi-para-publicar.ods"
    tmp = Path("/tmp/claude-0/renpi")
    tmp.mkdir(parents=True, exist_ok=True)
    x = tmp / "base-rempi-para-publicar.xlsx"
    if not x.exists():
        subprocess.run(["soffice", "--headless", "--convert-to", "xlsx", "--outdir", str(tmp), str(ods)],
                       check=True, capture_output=True)
    p = pd.read_excel(x)
    p.columns = [norm(c).replace(" ", "_") for c in p.columns]
    b = json.load(open(ROOT / "data/raw/ign_localidad_bahra.json"))["features"]
    bah = pd.DataFrame([f["properties"] for f in b])
    bah["kp"], bah["kl"] = bah.nom_pcia.map(norm), bah.fna.map(norm)
    bah["lat"], bah["lon"] = bah.lat_gd.astype(float), bah.long_gd.astype(float)
    bah = bah.drop_duplicates(["kp", "kl"])
    prov_fix = {"ciudad autonoma de buenos aires": "ciudad autonoma de buenos aires", "caba": "ciudad autonoma de buenos aires",
                "tierra del fuego": "tierra del fuego antartida e islas del atlantico sur"}
    p["kp"] = p.provincia.map(norm).replace(prov_fix)
    p["kl"] = p.localidad.map(norm)
    q = p.merge(bah[["kp", "kl", "lat", "lon", "cod_depto"]], on=["kp", "kl"], how="left")
    # segundo intento: nombre de localidad contenido / igual a nombre de departamento BAHRA
    q["precision"] = None
    q.loc[q.lat.notna(), "precision"] = "localidad_bahra"
    # segundo intento: API Georef (datos.gob.ar), respuestas guardadas en data/raw
    cache_f = RAW / "parques_industriales/georef_localidades_cache.json"
    cache = json.loads(cache_f.read_text()) if cache_f.exists() else {}
    import urllib.parse
    import urllib.request
    for i in q[q.lat.isna()].index:
        key = f"{q.at[i, 'localidad']}|{q.at[i, 'provincia']}"
        if key not in cache:
            u = "https://apis.datos.gob.ar/georef/api/localidades?" + urllib.parse.urlencode(
                {"nombre": str(q.at[i, "localidad"]), "provincia": str(q.at[i, "provincia"]), "max": 1})
            try:
                with urllib.request.urlopen(u, timeout=30) as r:
                    cache[key] = json.load(r)
            except Exception as ex:  # sin red: se deja sin coordenadas
                cache[key] = {"error": str(ex)}
        loc = cache[key].get("localidades") or []
        if loc:
            q.loc[i, ["lat", "lon"]] = [loc[0]["centroide"]["lat"], loc[0]["centroide"]["lon"]]
            q.at[i, "precision"] = "localidad_georef"
    cache_f.write_text(json.dumps(cache, ensure_ascii=False, indent=1))
    miss = q.lat.isna()
    dep = bah.assign(kd=bah.nom_depto.map(norm)).groupby(["kp", "kd"])[["lat", "lon"]].mean()
    for i in q[miss].index:
        k = (q.at[i, "kp"], q.at[i, "kl"])
        if k in dep.index:
            q.loc[i, ["lat", "lon"]] = dep.loc[k].values
            q.at[i, "precision"] = "centroide_localidades_del_departamento"
    q.loc[q.precision.isna() & q.lat.notna(), "precision"] = "localidad_bahra"
    q.drop(columns=["kp", "kl"]).to_csv(OUT / "parques_industriales_renpi.csv", index=False)
    q = q[q.lat.notna()]
    df = pd.DataFrame({
        "nombre": q.nombre_del_agrupamiento.str.strip(), "tipo": "parque_industrial",
        "subtipo": q.caracter, "etapa": "inscripto RENPI", "etapa_norm": "operacion",
        "registro": q.registro_n, "localidad": q.localidad, "lat": q.lat, "lon": q.lon,
        "precision": q.precision,
        "fuente": "Ministerio de Economia - Registro Nacional de Parques Industriales (RENPI); "
                  "geocodificado por localidad con BAHRA (IGN/INDEC)",
        "fuente_url": "https://cdn.produccion.gob.ar/cdn-secind/rempi-datos-abiertos/base-rempi-para-publicar.ods",
    })
    return gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.lon, df.lat), crs=4326)


def main() -> None:
    dep = gpd.read_file(DEPTOS)[["cod_dep", "departamento", "provincia", "pob2022", "geometry"]].to_crs(4326)
    nombres = dep.set_index("cod_dep")[["departamento", "provincia"]]
    nombres.loc["02000"] = ["Ciudad Autonoma de Buenos Aires (total)", "Ciudad Autónoma de Buenos Aires"]
    pob = dep.set_index("cod_dep")[["pob2022"]].copy()
    pob.loc["02000"] = dep[dep.cod_dep.str.startswith("02")].pob2022.sum()

    anual, mensual = empleo_departamento()
    anual = anual.join(nombres, on="cod_dep")
    lead = ["cod_dep", "departamento", "provincia", "anio", "meses"]
    anual = anual[lead + [c for c in anual.columns if c not in lead]]
    anual.to_csv(OUT / "empleo_departamento.csv", index=False)

    letra = sectores("letra")
    clae2 = sectores("clae2")
    letra.to_csv(OUT / "empleo_departamento_letra.csv", index=False)
    clae2.to_csv(OUT / "empleo_departamento_clae2.csv", index=False)
    dic = pd.read_csv(RAW / "cep/diccionario_clae2.csv")
    dic.to_csv(OUT / "diccionario_clae2.csv", index=False)

    ind = indicadores(anual, mensual, letra, clae2, pob)
    d2 = dic.set_index("clae2").clae2_desc
    ind["clae2_especializacion_desc"] = ind.clae2_especializacion.map(d2)
    ind["clae2_principal_desc"] = ind.clae2_principal.map(d2)

    est = establecimientos()
    est.to_csv(OUT / "establecimientos_departamento.csv", index=False)
    e22 = est[est.anio == 2022].set_index("cod_dep")
    # CABA: establecimientos vienen por comuna; se agregan a 02000 para unir con SIPA
    caba = e22[e22.index.str.startswith("02")].sum(numeric_only=True)
    e22.loc["02000"] = caba
    ind = ind.join(e22.drop(columns="anio").add_suffix("_2022"), on="cod_dep")

    # proyectos
    mm = mineria("cartera_metaliferos_litio_siacam.xlsx", "mineria_metalifera",
                 "https://www.mecon.gob.ar/dataset/Cartera-de-Proyectos-Mineros-Metaliferos-y-Litio-del-SIACAM.xlsx")
    nm = mineria("cartera_no_metaliferos_siacam.xlsx", "mineria_no_metalifera",
                 "https://www.mecon.gob.ar/dataset/Cartera-de-Proyectos-Mineros-No-Metaliferos-y-Roca-de-Aplicacion-del-SIACAM.xlsx")
    hc, vm_pozos = hidrocarburos()
    rn = renovables()
    pi = parques_industriales()
    pr = pd.concat([mm, hc, rn, pi], ignore_index=True)
    pr = gpd.GeoDataFrame(pr, geometry="geometry", crs=4326)
    pr["empleo_estimado"] = None  # ninguna fuente oficial abierta publica empleo por proyecto
    pr["empleo_fuente"] = None
    j = gpd.sjoin(pr, dep[["cod_dep", "geometry"]], predicate="within", how="left").drop(columns="index_right")
    j = j[~j.index.duplicated()]
    j["cod_dep_metodo"] = np.where(j.cod_dep.notna(), "dentro", None)
    falta = j.cod_dep.isna()
    if falta.any():  # costa afuera o en el borde: departamento mas cercano
        nn = gpd.sjoin_nearest(j.loc[falta, ["geometry"]].to_crs(5345), dep[["cod_dep", "geometry"]].to_crs(5345),
                               how="left", distance_col="d")
        nn = nn[~nn.index.duplicated()]
        j.loc[falta, "cod_dep"] = nn.cod_dep
        j.loc[falta, "cod_dep_metodo"] = "mas_cercano_" + (nn.d / 1000).round(1).astype(str) + "km"
    j = j.join(nombres, on="cod_dep")
    j.insert(0, "id", [f"{t[:4]}-{i:04d}" for i, t in enumerate(j.tipo)])
    cols = ["id", "nombre", "tipo", "subtipo", "etapa", "etapa_norm", "lat", "lon", "cod_dep", "departamento",
            "provincia", "cod_dep_metodo", "empleo_estimado", "empleo_fuente", "operador", "potencia_mw", "ronda",
            "inversion_anunciada_usd", "pozos_vaca_muerta", "pozos_vaca_muerta_en_extraccion", "registro",
            "localidad", "precision", "fuente", "fuente_url", "geometry"]
    j = j[cols]
    j.to_file(OUT / "proyectos.geojson", driver="GeoJSON")
    j.drop(columns="geometry").to_csv(OUT / "proyectos.csv", index=False)
    nmj = gpd.sjoin(nm, dep[["cod_dep", "geometry"]], predicate="within", how="left").drop(columns="index_right")
    nmj.to_file(OUT / "proyectos_mineria_no_metalifera.geojson", driver="GeoJSON")

    # agregados de proyectos por departamento
    g = j.groupby(["cod_dep", "tipo"]).size().unstack(fill_value=0).add_prefix("n_")
    ind = ind.join(g, on="cod_dep")
    vmd = gpd.sjoin(vm_pozos[["idpozo", "geometry"]], dep[["cod_dep", "geometry"]], predicate="within")
    ind = ind.join(vmd.groupby("cod_dep").size().rename("pozos_vaca_muerta"), on="cod_dep")
    ind = ind.join(nombres, on="cod_dep")
    lead = ["cod_dep", "departamento", "provincia"]
    ind = ind[lead + [c for c in ind.columns if c not in lead]]
    ind.to_csv(OUT / "indicadores_empleo_departamento.csv", index=False)

    print("empleo_departamento", anual.shape, "indicadores", ind.shape, "proyectos", j.shape)
    print(j.tipo.value_counts().to_string())
    print("proyectos sin cod_dep:", j.cod_dep.isna().sum())


if __name__ == "__main__":
    main()
