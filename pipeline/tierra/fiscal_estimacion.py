"""Profundización tierras fiscales: estimación por departamento, inmuebles del Estado
nacional y cifras oficiales por provincia.

Uso: python -I pipeline/tierra/fiscal_estimacion.py <repo_root>
Requiere haber corrido antes pipeline/tierra/fiscal_espacial.py.
Salidas en data/interim/tierra/: fiscal_departamento.csv, inmuebles_estado.geojson,
fiscal_provincias.csv.
"""
import sys, json, warnings
from pathlib import Path
import numpy as np, pandas as pd, geopandas as gpd

warnings.filterwarnings("ignore")
ROOT = Path(sys.argv[1])
T = ROOT / "data/raw/tierra"
OUT = ROOT / "data/interim/tierra"
EA = "ESRI:102033"

m = pd.read_parquet(OUT / "_metricas_departamento.parquet")
cna = pd.read_csv(T / "cna2018_tenencia_departamento.csv", dtype={"cod_dep": str})
m = m.merge(cna[["cod_dep", "sup_total_ha", "sup_fiscal_ha", "sup_fiscal_ocupacion_permiso_ha",
                 "sup_fiscal_ocupacion_hecho_ha", "tsl_fiscales"]], on="cod_dep", how="left")
deps = gpd.read_file(ROOT / "web/public/data/departamentos.geojson").to_crs(4326)

# ------------------------------------------------------------------ inmuebles nacionales
feats = []


def add(gdf, **cols):
    g = gdf.copy()
    for k, v in cols.items():
        g[k] = v(g) if callable(v) else v
    feats.append(g)


KEEP = ["categoria", "subcategoria", "nombre", "titular", "superficie_ha", "superficie_origen",
        "estado", "provincia", "fuente", "url", "geometry"]

mil = gpd.read_file(T / "ign/ign_instalacion_militar_SU001.json").to_crs(4326)
add(mil, categoria="militar", subcategoria="instalacion_militar_ign", nombre=lambda g: g["fna"],
    titular="Estado Nacional - Ministerio de Defensa", superficie_ha=np.nan, superficie_origen=None,
    estado=None, provincia=None, fuente=lambda g: "IGN WFS ign:instalacion_militar_SU001 (fdc: " + g["fdc"].fillna("").astype(str) + ")",
    url="https://wms.ign.gob.ar/geoserver/ows")

FIX = {"µ": "Á", "¡": "í", "¢": "ó"}
rnd = gpd.read_file(T / "nacion/rnd_reservas_naturales_defensa.geojson").to_crs(4326)
rnd["fna"] = rnd["fna"].apply(lambda s: "".join(FIX.get(c, c) for c in s))
add(rnd, categoria="militar", subcategoria="reserva_natural_defensa", nombre=lambda g: g["fna"],
    titular=lambda g: "Estado Nacional - Ministerio de Defensa (" + g["adm"] + ")",
    superficie_ha=lambda g: g["ara"].astype(float), superficie_origen="declarada (campo ara)",
    estado=lambda g: "RND creada " + g["a_cr"].astype(str) + " (" + g["sdp"] + ")", provincia=lambda g: g["provincia"],
    fuente="Ministerio de Ambiente, WFS areas_protegidas:reserva_natural_defensa", url="https://geo.ambiente.gob.ar/geoserver/ows")

# predios militares con superficie de prensa / parlamento, sin geometría verificada
prensa = gpd.GeoDataFrame([
    dict(nombre="Guarnición Militar Campo de Mayo", provincia="Buenos Aires", superficie_ha=5000.0,
         superficie_origen="prensa (El País, 08/12/2018, citado en es.wikipedia 'Campo de Mayo')",
         url="https://es.wikipedia.org/wiki/Campo_de_Mayo"),
    dict(nombre="Terrenos del Ejército, Guarnición Militar Córdoba", provincia="Córdoba", superficie_ha=13360.0,
         superficie_origen="proyecto de resolución HCDN 4985-D-2025 (pedido de informes por posible venta)",
         url="https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4985-D-2025.pdf"),
], geometry=[None, None], crs=4326)
add(prensa, categoria="militar", subcategoria="predio_militar_cifra_prensa", titular="Estado Nacional - Ejército Argentino",
    estado="sin geometría: ubicar con el CIE/SIENA", fuente="ver superficie_origen")

ap = gpd.read_file(T / "nacion/orsna_predios_aeropuertos_sna.geojson").to_crs(4326)
ap["superficie_ha"] = np.nan  # la capa "predios" publica puntos (MultiPoint), no polígonos
add(ap, categoria="aeroportuario", subcategoria="aeropuerto_sna", nombre=lambda g: g["nombre2"],
    titular=lambda g: "Estado Nacional (" + g["concesiona"].fillna("") + ", explotador " + g["explotador"].fillna("") + ")",
    superficie_origen=None, estado=lambda g: g["concesiona"], provincia=lambda g: g["provincia"],
    fuente="ORSNA vía IDE Transporte, orsna:_3.4.4.5_SNA_jun17.view", url="https://datos.gob.ar/dataset/transporte-predios-aeropuertos")

# INTA: unidades (puntos) + superficie de los 23 campos de la 1.ª etapa del plan de desafectación (Bichos de Campo 20/11/2024)
inta = gpd.read_file(T / "nacion/inta_unidades.geojson").to_crs(4326)
INTA_HA = {  # institucion IGN/INTA -> (total_ha, a_vender_ha)
    "E.E.A. ANGUIL": (3752, 3285), "E.E.A. BALCARCE": (2430, 1980), "E.E.A. LEALES": (1484, 1285),
    "E.E.A. MANFREDI": (1282, 1120), "E.E.A. MARCOS JUAREZ": (1028, 895), "E.E.A. CONCEPCION DEL URUGUAY": (1152, 980),
    "E.E.A. SAN LUIS": (1011, 921), "E.E.A. SANTIAGO DEL ESTERO": (7475, 6505), "E.E.A. PARANA": (303, 269),
    "E.E.A. PERGAMINO": (326, 272), "E.E.A. SAN PEDRO": (115, 101), "E.E.A. RECONQUISTA": (1301, 1245),
    "E.E.A. RAFAELA": (486, 428), "E.E.A. CHUBUT": (153, None), "E.E.A. HILARIO ASCASUBI": (102, None),
    "E.E.A. JUNIN": (56, 50), "E.E.A. BORDENAVE": (602, 502), "E.E.A. MENDOZA": (82, 72),
}
URL_INTA = "https://bichosdecampo.com/inmobiliaria-inta-el-gobierno-de-milei-quiere-vender-27-mil-hectareas-productivas-ubicadas-en-22-campos-experimentales-del-instituto-tecnologico"
inta["superficie_ha"] = inta["institucio"].map(lambda k: INTA_HA.get(k, (np.nan,))[0])
inta["a_vender"] = inta["institucio"].map(lambda k: INTA_HA.get(k, (np.nan, np.nan))[1])
TIPO = {1: "centro_regional", 2: "estacion_experimental", 3: "agencia_extension", 4: "centro_investigacion"}
add(inta, categoria="inta", subcategoria=lambda g: g["tipo"].map(TIPO), nombre=lambda g: g["institucio"],
    titular="Estado Nacional - INTA",
    superficie_origen=lambda g: np.where(g["superficie_ha"].notna(), "plan INTA/AABE 1.ª etapa (prensa, 20/11/2024); Paraná suma 2 campos", None),
    estado=lambda g: np.where(g["a_vender"].notna(), "propuesto a desafectar: " + g["a_vender"].astype("Int64").astype(str) + " ha", None),
    provincia=None, fuente=lambda g: np.where(g["superficie_ha"].notna(), "INTA geo-nodo07 geonode:unidades_inta_01 + " + URL_INTA, "INTA geo-nodo07 geonode:unidades_inta_01"),
    url="https://geo-nodo07.inta.gob.ar/geoserver/wfs")
sin_punto = gpd.GeoDataFrame([
    dict(nombre="Campo forestal INTA El Bolsón", provincia="Río Negro", superficie_ha=2636.0),
    dict(nombre="Campo forestal INTA Manuel Belgrano", provincia="Misiones", superficie_ha=2239.0),
    dict(nombre="Colonia Ortiz Basualdo (Ayacucho), INTA", provincia="Buenos Aires", superficie_ha=1044.0),
    dict(nombre="Colonia Ferrari (Maipú), INTA", provincia="Buenos Aires", superficie_ha=1815.0),
    dict(nombre="INTA, AER Santa Victoria Oeste (2.ª lista)", provincia="Salta", superficie_ha=45149.0),
], geometry=[None] * 5, crs=4326)
add(sin_punto, categoria="inta", subcategoria="campo_inta_sin_geometria", titular="Estado Nacional - INTA",
    superficie_origen="plan INTA/AABE (prensa, 20/11/2024)", estado="sin geometría", fuente=URL_INTA, url=URL_INTA)

# AABE: subastas (superficie en m² según inferencia del relevamiento anterior)
sub = pd.DataFrame(json.load(open(T / "aabe/aabe_subastas_listado.json")))
sub = sub[pd.to_numeric(sub.latitud, errors="coerce").notna()]
sub = gpd.GeoDataFrame(sub, geometry=gpd.points_from_xy(sub.longitud.astype(float), sub.latitud.astype(float)), crs=4326)
sub["superficie_ha"] = pd.to_numeric(sub["superficie"], errors="coerce") / 1e4
add(sub, categoria="aabe", subcategoria="subasta_aabe", nombre=lambda g: g["title"] + " - " + g["calle"].fillna("") + " " + g["numero"].fillna("").astype(str),
    titular="Estado Nacional - AABE", superficie_origen="campo superficie /10.000 (m² inferido, no documentado)",
    estado=lambda g: g["estado"].replace("", "vigente o futura"), provincia=lambda g: g["provincia"],
    fuente="argentina.gob.ar/bienesdelestado/listado", url=lambda g: g["url"])

d950 = pd.read_csv(T / "aabe/decreto_950_2024_anexo_inmuebles.csv")
geom = [None if pd.isna(a) else gpd.points_from_xy([b], [a])[0] for a, b in zip(d950.croquis_lat, d950.croquis_lon)]
d950 = gpd.GeoDataFrame(d950, geometry=geom, crs=4326)
d950["superficie_ha"] = d950["croquis_superficie_m2"] / 1e4
ferro = d950["domicilio"].str.contains("Estación|Estacion|Línea|Ramal", case=False)
add(d950, categoria=lambda g: np.where(ferro, "ferroviario", "aabe"), subcategoria="decreto_950_2024_innecesario",
    nombre=lambda g: g["domicilio"] + " (" + g["cantidad_inmuebles"].astype(str) + " inmuebles, CIE " + g["cie"].astype(str) + ")",
    titular="Estado Nacional (declarado innecesario)", superficie_origen=lambda g: np.where(g["superficie_ha"].notna(), "croquis del anexo", None),
    estado=lambda g: np.where(g.geometry.isna(), "sin geometría (" + g["localidad"] + ", " + g["departamento_partido"] + ")", "con croquis"),
    provincia=lambda g: g["provincia"].str.title(), fuente="Decreto 950/2024, anexo IF-2024-104278637-APN-AABE#JGM",
    url="https://www.argentina.gob.ar/normativa/nacional/norma-405669/texto")

est = gpd.read_file(T / "nacion/transporte_estacion_ferroviaria.geojson").to_crs(4326)
def _fix(x):
    try:
        return x.encode("latin-1").decode("utf-8") if isinstance(x, str) and "Ã" in x else x
    except UnicodeError:
        return x
for c in ("gna", "nam", "fna", "nombre", "linea"):
    est[c] = est[c].map(_fix)
add(est, categoria="ferroviario", subcategoria=lambda g: "estacion_" + g["gna"].fillna("").str.lower(),
    nombre=lambda g: g["fna"].fillna(g["nombre"]), titular="Estado Nacional (ADIF/Trenes Argentinos; dominio a verificar)",
    superficie_ha=np.nan, superficie_origen=None, estado=lambda g: g["linea"], provincia=None,
    fuente="Secretaría de Transporte, IDE idera:Estacion_Ferroviaria (sin atributo de uso)", url="https://ide.transporte.gob.ar/geoserver/idera/wfs")

I = gpd.GeoDataFrame(pd.concat([f[[c for c in KEEP if c in f.columns]] for f in feats], ignore_index=True), crs=4326)
for c in KEEP:
    if c not in I.columns:
        I[c] = None
I = I[KEEP]
rp = I[I.geometry.notna()].copy()
rp["geometry"] = rp.geometry.representative_point()
j = gpd.sjoin(rp, deps[["cod_dep", "provincia", "geometry"]].rename(columns={"provincia": "prov_dep"}), how="left", predicate="within")
j = j[~j.index.duplicated()]
I["cod_dep"] = j["cod_dep"]
I["provincia"] = I["provincia"].fillna(j["prov_dep"])
I.to_file(OUT / "inmuebles_estado.geojson", driver="GeoJSON")
print(I.groupby(["categoria", "subcategoria"]).agg(n=("nombre", "size"), ha=("superficie_ha", "sum")).round(0).to_string())

# superficie nacional por departamento (solo la que tiene geometría y superficie; RND y aeropuertos con área de polígono)
nac_inta = I[(I.categoria == "inta") & I.superficie_ha.notna() & I.cod_dep.notna()].groupby("cod_dep")["superficie_ha"].sum()
nac_aabe = I[(I.subcategoria == "subasta_aabe") & (I.estado == "vigente o futura") & I.cod_dep.notna()].groupby("cod_dep")["superficie_ha"].sum()
nac_d950 = I[(I.subcategoria == "decreto_950_2024_innecesario") & I.superficie_ha.notna() & I.cod_dep.notna()].groupby("cod_dep")["superficie_ha"].sum()
m = m.set_index("cod_dep")
m["sup_inta_ha"] = nac_inta
m["sup_aabe_ha"] = nac_aabe.add(nac_d950, fill_value=0)
m = m.fillna({"sup_inta_ha": 0, "sup_aabe_ha": 0})
m["sup_estado_nacional_ha"] = m[["sup_rnd_ha", "sup_catastro_fisco_nacional_ha", "sup_inta_ha", "sup_aabe_ha"]].sum(axis=1)

# ------------------------------------------------------------------ estimación por complemento
PAT = {"Neuquén", "Río Negro", "Chubut", "Santa Cruz", "Tierra del Fuego, Antártida e Islas del Atlántico Sur"}
ARIDO_NORTE = {"Mendoza", "San Juan", "La Rioja", "Catamarca", "Salta", "Jujuy", "Formosa", "Chaco",
               "Santiago del Estero", "La Pampa", "San Luis", "Tucumán"}


def region(p):
    return "patagonia" if p in PAT else ("arido_norte" if p in ARIDO_NORTE else "humeda")


m["region"] = m["provincia"].map(region)
m["sup_eap_ha"] = m["sup_total_ha"].fillna(0)
m["sup_fiscal_eap_ha"] = m["sup_fiscal_ha"].fillna(0)
m["sup_fuera_eap_ha"] = (m["sup_dep_ha"] - m["sup_eap_ha"]).clip(lower=0)
m["residuo_ha"] = (m["sup_fuera_eap_ha"] - m["sup_mascara_union_ha"]).clip(lower=0)

# --- calibración con catastros que informan fiscalidad (Neuquén y TDF)
cal = []
for p in ("Neuquén", "Tierra del Fuego, Antártida e Islas del Atlántico Sur"):
    s = m[(m.provincia == p) & ~m.index.isin(["94021", "94028"])]  # TDF: solo Isla Grande
    fiscal_cat = s["sup_fiscal_catastro_fuera_mascara_ha"].sum() + s["sup_sin_parcela_catastro_ha"].sum()
    fuera = max(fiscal_cat - s["sup_fiscal_eap_ha"].sum(), 0)
    cal.append((p, s["sup_dep_ha"].sum(), s["sup_eap_ha"].sum(), s["sup_fiscal_eap_ha"].sum(), s["sup_fiscal_catastro_fuera_mascara_ha"].sum(),
                s["sup_sin_parcela_catastro_ha"].sum(), s["residuo_ha"].sum(), fuera / max(s["residuo_ha"].sum(), 1)))
cal = pd.DataFrame(cal, columns=["provincia", "sup_ha", "eap_ha", "fiscal_eap_ha", "fiscal_catastro_fuera_mascara_ha", "sin_parcela_ha", "residuo_ha", "ratio_fiscal_fuera_eap_sobre_residuo"])
print(cal.round(3).to_string())
cal.to_csv(OUT / "_calibracion_catastro.csv", index=False)

# Fracción del residuo que se supone fiscal [J]. Bajo = 0 (solo lo documentado).
# Patagonia: central = ratio medio observado en Neuquén+TDF (fuera de máscaras); alto = 0,95.
# Árido/norte: central = la mitad del ratio patagónico; alto = el ratio patagónico. Húmeda: 0,10 / 0,25.
r = cal["ratio_fiscal_fuera_eap_sobre_residuo"].clip(upper=0.95)
F = {"patagonia": (0.0, float(r.mean()), 0.95),
     "arido_norte": (0.0, 0.5 * float(r.mean()), float(r.mean())),
     "humeda": (0.0, 0.10, 0.25)}
print("factores", {k: tuple(round(x, 3) for x in v) for k, v in F.items()})

con_cat = m["provincia"].isin(["Neuquén", "Tierra del Fuego, Antártida e Islas del Atlántico Sur"])
nac_extra = m["sup_estado_nacional_ha"] - m["sup_catastro_fisco_nacional_ha"]  # lo nacional que no está en catastro
doc = np.maximum(m["sup_fiscal_eap_ha"], m["sup_fiscal_catastro_ha"]) + nac_extra
# Salta: parcelas con nombre de finca 'FISCAL' (lotes fiscales históricos; titularidad actual no confirmada).
# No entran en 'bajo'; en central/alto se toma max(documentado, finca fiscal) como piso antes de sumar residuo.
doc_sa = np.maximum(doc, m["sup_salta_finca_fiscal_ha"] + nac_extra)
# residuo que queda después de restar lo fiscal catastral que ya está fuera de EAP
res_adj = (m["residuo_ha"] - (m["sup_fiscal_catastro_ha"] - m["sup_fiscal_eap_ha"]).clip(lower=0)).clip(lower=0)
fb = m["region"].map(lambda k: F[k][0]); fc = m["region"].map(lambda k: F[k][1]); fa = m["region"].map(lambda k: F[k][2])
m["estimacion_fiscal_ha_bajo"] = doc + fb * res_adj
res_sa = (res_adj - (m["sup_salta_finca_fiscal_ha"] - m["sup_fiscal_eap_ha"]).clip(lower=0)).clip(lower=0)
m["estimacion_fiscal_ha_central"] = doc_sa + fc * res_sa
m["estimacion_fiscal_ha_alto"] = doc_sa + fa * res_sa
# Neuquén: el catastro cubre el territorio; lo no parcelado fuera de máscaras se toma como fiscal sin mensura [J]
nq = m["provincia"] == "Neuquén"
m.loc[nq, "estimacion_fiscal_ha_central"] = (np.maximum(m["sup_fiscal_eap_ha"], m["sup_fiscal_catastro_ha"]) + m["sup_sin_parcela_catastro_ha"] + nac_extra)[nq]
m.loc[nq, "estimacion_fiscal_ha_alto"] = np.maximum(m.loc[nq, "estimacion_fiscal_ha_central"],
                                                    (m["sup_fiscal_catastro_ha"] + m["sup_sin_parcela_catastro_ha"] + nac_extra + m["sup_fiscal_eap_ha"])[nq])
# TDF: la capa provincial ya incluye 'tierras fiscales sin mensura'
tdf = m["provincia"] == "Tierra del Fuego, Antártida e Islas del Atlántico Sur"
m.loc[tdf, "estimacion_fiscal_ha_central"] = doc[tdf]
for c in ("estimacion_fiscal_ha_bajo", "estimacion_fiscal_ha_central", "estimacion_fiscal_ha_alto"):
    m[c] = np.minimum(m[c], m["sup_dep_ha"])
# Antártida e Islas del Atlántico Sur y CABA: fuera del alcance (sin EAP, régimen especial)
excl = m.index.isin(["94021", "94028"]) | (m["provincia"] == "Ciudad Autónoma de Buenos Aires")
m.loc[excl, ["estimacion_fiscal_ha_bajo", "estimacion_fiscal_ha_central", "estimacion_fiscal_ha_alto"]] = np.nan
m["estimacion_fiscal_ha_alto"] = np.maximum(m["estimacion_fiscal_ha_alto"], m["estimacion_fiscal_ha_central"])
m["estimacion_fiscal_ha_bajo"] = np.minimum(m["estimacion_fiscal_ha_bajo"], m["estimacion_fiscal_ha_central"])


def metodo(row):
    if row["provincia"] == "Neuquén":
        return ("[J] bajo = max(fiscal EAP, catastro fiscal) + nacional fuera de catastro; central = bajo + superficie sin parcela "
                "ni ejido fuera de máscaras (fiscal sin mensura probable); alto = catastro + sin parcela + fiscal EAP")
    if row["provincia"].startswith("Tierra del Fuego"):
        return "[J] bajo = central = max(fiscal EAP, capa tierras fiscales provinciales) + nacional; alto suma fracción patagónica del residuo"
    if row["cod_dep"] in ("94021", "94028") or row["provincia"].startswith("Ciudad"):
        return "sin estimación: Antártida/Islas del Atlántico Sur o CABA (fuera de alcance)"
    f = F[row["region"]]
    extra = " Salta: piso = max(documentado, parcelas 'finca FISCAL') en central/alto." if row["provincia"] == "Salta" else ""
    return (f"[J] complemento: documentado (max(fiscal EAP, catastro) + nacional) + f x residuo; residuo = sup dep - EAP - "
            f"(protegidas ∪ urbano ∪ agua ∪ salinas); región {row['region']}: f bajo/central/alto = {f[0]:.2f}/{f[1]:.2f}/{f[2]:.2f}.{extra}")


def fuentes(row):
    s = ["CNA 2018 C3.1 (INDEC)", "IGN: departamentos, áreas protegidas, asentamientos, aguas perennes, salinas"]
    if row["provincia"] == "Neuquén":
        s.append("Catastro Neuquén ArcGIS REST Informacion/MapServer/2-3 (FISCALIDAD)")
    if row["provincia"].startswith("Tierra del Fuego"):
        s.append("WFS TDF geonode:tierras_fiscales_provinciales")
    if row["sup_rnd_ha"] > 0: s.append("Ambiente: Reservas Naturales de la Defensa")
    if row["sup_salta_finca_fiscal_ha"] > 0: s.append("Catastro Salta geonode:fc_parcelas_v20 (finca ILIKE fiscal)")
    if row["sup_inta_ha"] > 0: s.append("INTA unidades + plan INTA/AABE 2024 (prensa)")
    if row["sup_aabe_ha"] > 0: s.append("AABE subastas vigentes / Decreto 950/2024")
    return "; ".join(s)


m = m.reset_index()
m["metodo"] = m.apply(metodo, axis=1)
m["fuentes"] = m.apply(fuentes, axis=1)
m.loc[m["sup_total_ha"].isna(), "metodo"] = m["metodo"] + " | sin dato CNA (EAP=0)"
cols = ["cod_dep", "provincia", "departamento", "sup_dep_ha", "sup_fiscal_eap_ha", "sup_fuera_eap_ha", "sup_fiscal_catastro_ha",
        "sup_estado_nacional_ha", "estimacion_fiscal_ha_bajo", "estimacion_fiscal_ha_central", "estimacion_fiscal_ha_alto",
        "metodo", "fuentes",
        # columnas auxiliares (trazabilidad)
        "region", "sup_eap_ha", "sup_mascara_union_ha", "sup_protegida_ha", "sup_urbana_ha", "sup_agua_ha", "sup_salinas_ha",
        "residuo_ha", "sup_sin_parcela_catastro_ha", "sup_rnd_ha", "sup_inta_ha", "sup_aabe_ha",
        "sup_salta_finca_fiscal_ha", "sup_fiscal_ocupacion_permiso_ha", "sup_fiscal_ocupacion_hecho_ha", "tsl_fiscales"]
out = m[cols].copy()
num = [c for c in cols if c.startswith(("sup_", "estimacion_", "residuo"))]
out[num] = out[num].round(0)
out.sort_values("cod_dep").to_csv(OUT / "fiscal_departamento.csv", index=False)
print(out.groupby("provincia")[["sup_dep_ha", "sup_fiscal_eap_ha", "sup_fiscal_catastro_ha", "sup_estado_nacional_ha",
                                "estimacion_fiscal_ha_bajo", "estimacion_fiscal_ha_central", "estimacion_fiscal_ha_alto"]].sum().round(0).to_string())
print("TOTAL", out[["sup_dep_ha", "sup_fiscal_eap_ha", "estimacion_fiscal_ha_bajo", "estimacion_fiscal_ha_central", "estimacion_fiscal_ha_alto"]].sum().round(0).to_dict())
