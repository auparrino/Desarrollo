"""Profundización tierras fiscales: métricas espaciales por departamento.

Uso: python -I pipeline/tierra/fiscal_espacial.py <repo_root>

Lee capas ya descargadas en data/raw/ y escribe
data/interim/tierra/_metricas_departamento.parquet y fiscal_poligonos.gpkg.
No toca build.py.
"""
import sys, json, warnings
from pathlib import Path
import pandas as pd, geopandas as gpd
from shapely import make_valid, union_all
from shapely.geometry import shape

warnings.filterwarnings("ignore")
ROOT = Path(sys.argv[1])
RAW = ROOT / "data/raw"
T = RAW / "tierra"
OUT = ROOT / "data/interim/tierra"
OUT.mkdir(parents=True, exist_ok=True)
EA = "ESRI:102033"  # South America Albers Equal Area


def load(p, **kw):
    g = gpd.read_file(p, **kw)
    if g.crs is None:
        g = g.set_crs(4326)
    g = g.to_crs(4326)
    g["geometry"] = g.geometry.apply(lambda x: make_valid(x) if x is not None else None)
    g = g[g.geometry.notna() & ~g.geometry.is_empty]
    # quedarse con la parte poligonal
    g = g.explode(index_parts=False)
    g = g[g.geom_type.isin(["Polygon", "MultiPolygon"])]
    return g


def area_ha(g):
    return g.to_crs(EA).area / 1e4


def per_dep(layer, deps, col):
    """Área (ha) de `layer` dentro de cada departamento (sin disolver solapes internos)."""
    if layer.empty:
        return pd.Series(dtype=float, name=col)
    ov = gpd.overlay(deps[["cod_dep", "geometry"]], layer[["geometry"]], how="intersection", keep_geom_type=True)
    ov["a"] = area_ha(ov)
    return ov.groupby("cod_dep")["a"].sum().rename(col)


def dissolve_parts(g):
    u = union_all(g.to_crs(EA).geometry.values)
    d = gpd.GeoDataFrame(geometry=[u], crs=EA).explode(index_parts=False).to_crs(4326)
    return d


deps = gpd.read_file(ROOT / "web/public/data/departamentos.geojson").to_crs(4326)
deps["geometry"] = deps.geometry.apply(make_valid)
deps["sup_dep_ha"] = area_ha(deps)
m = deps[["cod_dep", "provincia", "departamento", "sup_dep_ha"]].set_index("cod_dep")

# ---------- máscaras (no fiscales "disponibles" o ya contadas) ----------
prot = load(RAW / "ign_area_protegida.json")
urb = load(T / "ign/ign_areas_de_asentamientos_y_edificios_020105.json")
agua = load(T / "ign/ign_areas_de_aguas_continentales_perenne.json")
sal = load(T / "ign/ign_edafologia_salina.json")
print("máscaras", len(prot), len(urb), len(agua), len(sal), flush=True)
m = m.join(per_dep(dissolve_parts(prot), deps, "sup_protegida_ha"))
m = m.join(per_dep(dissolve_parts(urb), deps, "sup_urbana_ha"))
m = m.join(per_dep(dissolve_parts(agua), deps, "sup_agua_ha"))
m = m.join(per_dep(dissolve_parts(sal), deps, "sup_salinas_ha"))
mask_all = dissolve_parts(pd.concat([prot[["geometry"]], urb[["geometry"]], agua[["geometry"]], sal[["geometry"]]]))
m = m.join(per_dep(mask_all, deps, "sup_mascara_union_ha"))
print("máscaras ok", flush=True)

# ---------- polígonos fiscales / estatales ----------
polys = []

# Neuquén: catastro provincial (ArcGIS REST Informacion/MapServer 2 y 3)
NQ = T / "provincias/neuquen"
URL_NQ = "https://catastro.neuquen.gov.ar/nqn_ide/rest/services/Informacion/MapServer"
rue = pd.concat([load(NQ / f"nqn_rue_{o}.geojson") for o in (0, 1000, 2000)])
rui_f = load(NQ / "nqn_rui_fiscal.geojson")
rui_nf = pd.concat([load(NQ / f"nqn_rui_nofiscal_{o}.geojson") for o in (0, 2000)])
ejidos = load(NQ / "nqn_ejidos.geojson")
TIT = {"FISCO PROVINCIAL": "Provincia del Neuquén", "FISCO MUNICIPAL": "Municipio", "FISCO NACIONAL": "Estado Nacional"}
for src, g, capa in ((rue, rue, 3), (rui_f, rui_f, 2)):
    f = g[g["FISCALIDAD"].isin(TIT)].copy()
    f["origen"] = "catastro_neuquen_" + f["TIPO_PARCELA"].str.lower().str.replace(" ", "_")
    f["titular"] = f["FISCALIDAD"].map(TIT)
    f["provincia"] = "Neuquén"
    f["detalle"] = f["PAR_NOMENCLATURA"].astype(str) + " | " + f["DEPARTAMENTO"].astype(str) + " | " + f["PROCEDENCIA"].fillna("").astype(str)
    f["fuente"] = f"{URL_NQ}/{capa} (campo FISCALIDAD, descargado 21/10/2026)"
    polys.append(f[["origen", "titular", "provincia", "detalle", "fuente", "geometry"]])
nq_all_parcels = pd.concat([rue[["geometry"]], rui_f[["geometry"]], rui_nf[["geometry"]], ejidos[["geometry"]]])
print("neuquén parcelas", len(rue), len(rui_f), len(rui_nf), len(ejidos), flush=True)

# Tierra del Fuego: tierras fiscales provinciales (WFS)
tdf = load(T / "provincias/tdf/tdf_tierras_fiscales_provinciales.geojson")
tdf["origen"] = "catastro_tdf_" + tdf["clas_titul"].str.lower().str.replace(r"[^a-z]+", "_", regex=True).str.strip("_")
tdf["titular"] = "Provincia de Tierra del Fuego"
tdf["provincia"] = "Tierra del Fuego"
tdf["detalle"] = tdf["clas_titul"].astype(str) + " | partida " + tdf["partida"].astype(str)
tdf["fuente"] = "https://tiles.tierradelfuego.gob.ar/geoserver/wfs geonode:tierras_fiscales_provinciales"
polys.append(tdf[["origen", "titular", "provincia", "detalle", "fuente", "geometry"]])

# Salta: parcelas cuyo nombre de finca contiene 'FISCAL' (titularidad actual NO confirmada)
sa = load(T / "provincias/salta/salta_parcelas_finca_fiscal.geojson")
sa["origen"] = "catastro_salta_nombre_finca_fiscal"
sa["titular"] = "no informado (nombre histórico de lote fiscal)"
sa["provincia"] = "Salta"
sa["detalle"] = "finca " + sa["finca"].astype(str) + " | catastro " + sa["catastro"].astype(str) + " | depto " + sa["departa"].astype(str) + " | " + sa["categoria"].astype(str)
sa["fuente"] = "https://geoportal.salta.gob.ar/geoserver/wfs geonode:fc_parcelas_v20 CQL finca ILIKE '%fiscal%'"
polys.append(sa[["origen", "titular", "provincia", "detalle", "fuente", "geometry"]])

# Nación: Reservas Naturales de la Defensa
FIX = {"µ": "Á", "¡": "í", "¢": "ó"}
rnd = load(T / "nacion/rnd_reservas_naturales_defensa.geojson")
for c in ("fna", "nam"):
    rnd[c] = rnd[c].apply(lambda s: "".join(FIX.get(ch, ch) for ch in s) if isinstance(s, str) else s)
rnd["origen"] = "nacion_reserva_natural_defensa"
rnd["titular"] = "Estado Nacional - Ministerio de Defensa (" + rnd["adm"].astype(str) + ")"
rnd["provincia"] = rnd["provincia"]
rnd["detalle"] = rnd["fna"] + " | " + rnd["sdp"].astype(str) + " | ara declarada " + rnd["ara"].astype(str) + " ha"
rnd["fuente"] = "https://geo.ambiente.gob.ar/geoserver/ows areas_protegidas:reserva_natural_defensa"
polys.append(rnd[["origen", "titular", "provincia", "detalle", "fuente", "geometry"]])

# (La capa ORSNA "predios aeropuertos" publica puntos, no polígonos: va a inmuebles_estado.geojson)

P = gpd.GeoDataFrame(pd.concat(polys, ignore_index=True), crs=4326)
P["superficie_ha"] = area_ha(P).round(2)
# asignar departamento por punto representativo
rp = gpd.GeoDataFrame(P[[]].copy(), geometry=P.representative_point(), crs=4326)
j = gpd.sjoin(rp, deps[["cod_dep", "geometry"]], how="left", predicate="within")
P["cod_dep"] = j["cod_dep"].groupby(level=0).first()
P = P[["origen", "titular", "superficie_ha", "fuente", "provincia", "cod_dep", "detalle", "geometry"]]
P.to_file(OUT / "fiscal_poligonos.gpkg", layer="fiscal_poligonos", driver="GPKG")
print(P.groupby("origen")["superficie_ha"].agg(["count", "sum"]).round(0).to_string(), flush=True)

# ---------- métricas por departamento ----------
# cada catastro se mide solo dentro de su provincia (evita bordes que cruzan el límite IGN)
cat_parts, catfm_parts = [], []
for pref, prov in (("catastro_neuquen", "Neuquén"), ("catastro_tdf", "Tierra del Fuego, Antártida e Islas del Atlántico Sur")):
    dp = deps[deps.provincia == prov]
    cd = dissolve_parts(P[P.origen.str.startswith(pref)])
    cat_parts.append(per_dep(cd, dp, "sup_fiscal_catastro_ha"))
    # parte del catastro fiscal que queda fuera de las máscaras (para calibrar el complemento)
    cfm = gpd.overlay(cd, mask_all, how="difference")
    catfm_parts.append(per_dep(cfm, dp, "sup_fiscal_catastro_fuera_mascara_ha"))
m = m.join(pd.concat(cat_parts)).join(pd.concat(catfm_parts))
nac_cat = P[P.origen.str.startswith("catastro_neuquen") & (P.titular == "Estado Nacional")]
m = m.join(per_dep(dissolve_parts(nac_cat), deps, "sup_catastro_fisco_nacional_ha"))
for o, col in (("nacion_reserva_natural_defensa", "sup_rnd_ha"),
               ("catastro_salta_nombre_finca_fiscal", "sup_salta_finca_fiscal_ha")):
    m = m.join(per_dep(dissolve_parts(P[P.origen == o]), deps, col))

# Neuquén: superficie sin parcela ni ejido y fuera de máscaras (probable fiscal sin mensura) [J]
nq_deps = deps[deps.provincia == "Neuquén"]
cover = dissolve_parts(pd.concat([nq_all_parcels, mask_all]))
nq = gpd.overlay(nq_deps[["cod_dep", "geometry"]], cover, how="difference")
nq["a"] = area_ha(nq)
m = m.join(nq.groupby("cod_dep")["a"].sum().rename("sup_sin_parcela_catastro_ha"))
# cobertura parcelaria total de Neuquén (para control)
m = m.join(per_dep(dissolve_parts(nq_all_parcels), nq_deps, "sup_parcelada_nqn_ha"))

m = m.fillna({c: 0.0 for c in m.columns if c.startswith("sup_") and c != "sup_dep_ha"})
m.reset_index().to_parquet(OUT / "_metricas_departamento.parquet", index=False)
print(m[m.provincia.isin(["Neuquén", "Tierra del Fuego, Antártida e Islas del Atlántico Sur"])].round(0).to_string())
