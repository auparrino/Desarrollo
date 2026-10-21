"""Construye la grilla H3 de aptitud territorial de Argentina.

Entrada: data/raw (ver sources.py / download.py).
Salida:  web/public/data/
    cells.bin / cells.json   atributos por celda H3 (columnar, float32 little-endian)
    departamentos.geojson    límites simplificados + censo 2010/2022
    provincias.geojson       límites simplificados
    capas/*.geojson          rutas, ferrocarril, alta tensión, áreas protegidas, ríos
    fuentes.json             catálogo de fuentes con citas y licencias

Todas las rasters se remuestrean a una grilla común de 30" (~1 km) sobre el
rectángulo de Argentina continental, se enmascaran con el área de estudio y
cada píxel se asigna a su celda H3; los atributos de celda son agregados
(media, suma o fracción) de los píxeles que contiene.
"""
from __future__ import annotations

import json
import os
import time
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
import rasterio
from h3ronpy import vector as h3v
import h3
from rasterio.enums import Resampling
from rasterio.features import rasterize
from rasterio.transform import from_origin
from rasterio.warp import reproject
from rasterio.windows import from_bounds
from scipy.spatial import cKDTree
from shapely import STRtree
from shapely.geometry import box

from sources import SOURCES

os.environ.setdefault("OGR_GEOJSON_MAX_OBJ_SIZE", "0")

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
OUT = ROOT / "web" / "public" / "data"

H3_RES = 6
# Grilla común: 30 segundos de arco sobre Argentina continental.
WEST, EAST, SOUTH, NORTH = -74.0, -53.0, -56.0, -21.0
STEP = 1 / 120
WIDTH = round((EAST - WEST) / STEP)
HEIGHT = round((NORTH - SOUTH) / STEP)
TRANSFORM = from_origin(WEST, NORTH, STEP, STEP)
# Proyección equivalente para distancias y áreas (South America Albers Equal Area Conic).
CRS_M = "ESRI:102033"

T0 = time.time()

# Capitales provinciales y CABA (lat, lon aproximadas del centro; BAHRA/IGN).
CAPITALES = {
    "Ciudad Autónoma de Buenos Aires": (-34.6037, -58.3816), "La Plata": (-34.9214, -57.9545),
    "San Fernando del Valle de Catamarca": (-28.4696, -65.7795), "Resistencia": (-27.4606, -58.9839),
    "Rawson": (-43.3002, -65.1023), "Córdoba": (-31.4167, -64.1833), "Corrientes": (-27.4692, -58.8306),
    "Paraná": (-31.7413, -60.5115), "Formosa": (-26.1849, -58.1731), "San Salvador de Jujuy": (-24.1858, -65.2995),
    "Santa Rosa": (-36.6167, -64.2833), "La Rioja": (-29.4131, -66.8558), "Mendoza": (-32.8895, -68.8458),
    "Posadas": (-27.3671, -55.8961), "Neuquén": (-38.9516, -68.0591), "Viedma": (-40.8135, -62.9967),
    "Salta": (-24.7859, -65.4117), "San Juan": (-31.5375, -68.5364), "San Luis": (-33.2950, -66.3356),
    "Río Gallegos": (-51.6230, -69.2168), "Santa Fe": (-31.6333, -60.7000), "Santiago del Estero": (-27.7951, -64.2615),
    "Ushuaia": (-54.8019, -68.3030), "San Miguel de Tucumán": (-26.8083, -65.2176),
}

ESTRICTA = r"Parque|Monumento|Integral|Estricta|Intangible|Reserva Nacional|Natural Silvestre"


def log(msg: str) -> None:
    print(f"[{time.time() - T0:6.1f}s] {msg}", flush=True)


def raw(key: str, **fmt) -> Path:
    return RAW / SOURCES[key]["file"].format(**fmt)


# ---------------------------------------------------------------- rasters

def warp(path: Path, resampling=Resampling.average, scale: float = 1.0) -> np.ndarray:
    """Lee la ventana de Argentina de un raster y la remuestrea a la grilla común."""
    with rasterio.open(path) as src:
        pad = 0.5
        win = from_bounds(WEST - pad, SOUTH - pad, EAST + pad, NORTH + pad, src.transform)
        win = win.round_offsets().round_lengths()
        data = src.read(1, window=win, boundless=True, masked=True).astype("float32")
        arr = data.filled(np.nan)
        if src.nodata is not None and not np.isnan(src.nodata):
            arr[arr == np.float32(src.nodata)] = np.nan
        # algunos productos usan valores extremos no declarados como nodata
        arr[np.abs(arr) > 1e30] = np.nan
        dst = np.full((HEIGHT, WIDTH), np.nan, dtype="float32")
        reproject(
            arr,
            dst,
            src_transform=src.window_transform(win),
            src_crs=src.crs,
            src_nodata=np.nan,
            dst_transform=TRANSFORM,
            dst_crs="EPSG:4326",
            dst_nodata=np.nan,
            resampling=resampling,
        )
    return dst * scale


def slope_percent(dem: np.ndarray) -> np.ndarray:
    lat = NORTH - (np.arange(HEIGHT) + 0.5) * STEP
    dy = STEP * 110_574.0
    dx = STEP * 111_320.0 * np.cos(np.radians(lat))[:, None]
    gy, gx = np.gradient(dem)
    return 100.0 * np.hypot(gx / dx, gy / dy)


# ---------------------------------------------------------------- área de estudio

def study_area() -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    """Provincias IGN restringidas a la Argentina continental + Tierra del Fuego.

    Se excluyen del análisis el sector antártico y las islas del Atlántico Sur
    (Malvinas, Georgias, Sandwich), sin administración efectiva argentina y sin
    datos censales; siguen dibujándose en el mapa como territorio nacional.
    """
    prov = gpd.read_file(raw("provincias"))[["in1", "nam", "geometry"]]
    prov = prov.rename(columns={"in1": "cod_prov", "nam": "provincia"})
    parts = prov.explode(index_parts=False)
    c = parts.geometry.representative_point()
    keep = (c.y > SOUTH) & ~((c.x > -62.5) & (c.y < -50.5)) & (c.x < EAST)
    analysis = parts[keep].dissolve(by=["cod_prov", "provincia"]).reset_index()
    return prov, analysis


# ---------------------------------------------------------------- censo

CABA_2010 = {f"02{n:03d}": f"02{7 * n:03d}" for n in range(1, 16)}
# Grupos comparables 2010→2022 (cambios de límites departamentales).
GROUPS = {
    "06218": "G_CHASCOMUS", "06466": "G_CHASCOMUS", "06217": "G_CHASCOMUS",
    "94008": "G_RIOGRANDE", "94011": "G_RIOGRANDE", "94007": "G_RIOGRANDE",
    "94015": "G_USHUAIA", "94014": "G_USHUAIA",
}


def census() -> pd.DataFrame:
    def load(key: str, col: str, year: int) -> pd.Series:
        df = pd.read_csv(raw(key), usecols=["cod_prov", "cod_dep", col], dtype=str, encoding="utf-8-sig")
        df["dep"] = df.cod_prov.str.zfill(2) + df.cod_dep.str.zfill(3)
        if year == 2010:
            df["dep"] = df.dep.replace(CABA_2010)
        return df.assign(pob=df[col].astype(float)).groupby("dep").pob.sum()

    p22 = load("censo2022", "POB_TOT_P", 2022)
    p10 = load("censo2010", "B_POB_TOT", 2010)
    df = pd.DataFrame({"pob2022": p22}).join(pd.DataFrame({"pob2010": p10}), how="outer").fillna(0)
    df["grupo"] = [GROUPS.get(d, d) for d in df.index]
    g = df.groupby("grupo")[["pob2010", "pob2022"]].sum()
    rate = (g.pob2022 / g.pob2010.replace(0, np.nan)) ** (1 / 12.0) - 1  # mayo 2010 → mayo 2022
    df["crec_anual"] = df.grupo.map(rate)
    # en grupos con cambios de límites, la población 2010 del grupo se reparte entre los
    # departamentos actuales en proporción a su población 2022
    grouped = df.grupo.str.startswith("G_")
    share = df.pob2022 / df.grupo.map(g.pob2022)
    df.loc[grouped, "pob2010"] = (df.grupo.map(g.pob2010) * share)[grouped]
    df.loc[df.index.isin(["06217", "94007", "94014"]), "pob2022"] = np.nan  # códigos solo 2010
    return df.dropna(subset=["pob2022"])


# ---------------------------------------------------------------- agregación

class Agg:
    """Agrega valores de píxel por celda H3 (las celdas son `uniq`, índice `inv`)."""

    def __init__(self, inv: np.ndarray, n: int, sel: np.ndarray):
        self.inv, self.n, self.sel = inv, n, sel

    def _flat(self, arr: np.ndarray) -> np.ndarray:
        return arr.ravel()[self.sel]

    def mean(self, arr: np.ndarray) -> np.ndarray:
        v = self._flat(arr)
        ok = np.isfinite(v)
        s = np.bincount(self.inv[ok], v[ok], minlength=self.n)
        c = np.bincount(self.inv[ok], minlength=self.n)
        with np.errstate(invalid="ignore", divide="ignore"):
            return np.where(c > 0, s / c, np.nan)

    def sum(self, arr: np.ndarray) -> np.ndarray:
        v = np.nan_to_num(self._flat(arr))
        return np.bincount(self.inv, v, minlength=self.n)

    def frac(self, cond: np.ndarray) -> np.ndarray:
        v = self._flat(cond).astype(float)
        return np.bincount(self.inv, v, minlength=self.n) / np.bincount(self.inv, minlength=self.n)

    def quantile_over(self, arr: np.ndarray, q: float) -> np.ndarray:
        v = self._flat(arr)
        df = pd.DataFrame({"c": self.inv, "v": v}).dropna()
        out = np.full(self.n, np.nan)
        r = df.groupby("c").v.quantile(q)
        out[r.index.values] = r.values
        return out


def degree_days(tavg: list[np.ndarray]) -> tuple[np.ndarray, np.ndarray]:
    """Grados-día anuales de calefacción (base 18 °C) y refrigeración (base 18 °C)
    a partir de medias mensuales (aproximación: subestima cuando la temperatura
    diaria oscila alrededor de la base; ver docs/metodologia.md)."""
    days = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    hdd = sum(d * np.maximum(0, 18 - t) for d, t in zip(days, tavg))
    cdd = sum(d * np.maximum(0, t - 18) for d, t in zip(days, tavg))
    return hdd, cdd


# ---------------------------------------------------------------- vectores

def distances_km(points_m: gpd.GeoSeries, features: gpd.GeoDataFrame) -> np.ndarray:
    geoms = features.to_crs(CRS_M).geometry.values
    tree = STRtree(geoms)
    idx = tree.query_nearest(points_m.values, return_distance=True, all_matches=False)
    (pi, gi), d = idx
    out = np.full(len(points_m), np.nan)
    out[pi] = d / 1000.0
    return out


def simplify_out(gdf: gpd.GeoDataFrame, tol: float, path: Path, cols: list[str], precision: int = 4) -> None:
    g = gdf[cols + ["geometry"]].copy()
    g["geometry"] = g.geometry.simplify(tol, preserve_topology=True)
    g = g[~g.geometry.is_empty]
    path.parent.mkdir(parents=True, exist_ok=True)
    g.to_file(path, driver="GeoJSON", COORDINATE_PRECISION=precision)
    log(f"  {path.relative_to(ROOT)}: {path.stat().st_size / 1e6:.2f} MB")


# ---------------------------------------------------------------- main

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    prov_all, area = study_area()
    log("área de estudio lista")

    mask = rasterize(
        [(g, 1) for g in area.geometry], out_shape=(HEIGHT, WIDTH), transform=TRANSFORM, fill=0, dtype="uint8"
    ).astype(bool)
    sel = np.flatnonzero(mask.ravel())
    rows, cols = np.divmod(sel, WIDTH)
    lat = NORTH - (rows + 0.5) * STEP
    lon = WEST + (cols + 0.5) * STEP
    cells = np.asarray(h3v.coordinates_to_cells(lat, lon, H3_RES)).astype(np.uint64)
    uniq, inv = np.unique(cells, return_inverse=True)
    npx = np.bincount(inv)
    agg = Agg(inv, len(uniq), sel)
    log(f"{mask.sum():,} píxeles → {len(uniq):,} celdas H3 res {H3_RES}")

    C: dict[str, np.ndarray] = {}

    # --- relieve
    dem = warp(raw("elevacion"))
    C["elev"] = agg.mean(dem)
    slope = slope_percent(dem)
    C["pend_media"] = agg.mean(slope)
    C["frac_pend_ok"] = agg.frac(slope <= 15)
    del dem, slope
    log("relieve")

    # --- clima
    bio = {n: warp(raw("clima_bio", n=n)) for n in (1, 5, 6, 12, 15)}
    C["t_media"] = agg.mean(bio[1])
    C["t_max_cal"] = agg.mean(bio[5])
    C["t_min_fri"] = agg.mean(bio[6])
    C["prec"] = agg.mean(bio[12])
    C["prec_estac"] = agg.mean(bio[15])
    del bio
    tavg = [warp(raw("clima_tavg", mm=f"{m:02d}")) for m in range(1, 13)]
    hdd, cdd = degree_days(tavg)
    C["hdd18"], C["cdd18"] = agg.mean(hdd), agg.mean(cdd)
    del tavg, hdd, cdd
    srad = sum(warp(raw("radiacion", mm=f"{m:02d}")) for m in range(1, 13)) / 12
    C["ghi"] = agg.mean(srad / 3600.0)  # kJ m-2 d-1 → kWh m-2 d-1
    del srad
    C["aridez"] = agg.mean(warp(raw("aridez"), scale=1e-4))
    log("clima")

    # --- riesgos
    C["pga475"] = agg.mean(warp(raw("sismicidad")))
    flood = warp(raw("inundacion"), resampling=Resampling.nearest)
    C["frac_inund100"] = agg.frac(np.nan_to_num(flood) > 0)
    del flood
    log("riesgos")

    # --- accesibilidad, energía
    acc = warp(raw("accesibilidad"), resampling=Resampling.average)
    acc[acc < 0] = np.nan
    C["t_ciudad"] = agg.mean(acc)
    del acc
    hc = warp(raw("salud"), resampling=Resampling.average)
    hc[hc < 0] = np.nan
    C["t_salud"] = agg.mean(hc)
    del hc
    C["viento100"] = agg.mean(warp(raw("viento"), resampling=Resampling.average))
    log("accesibilidad y viento")

    # --- población (WorldPop 2020 reescalado a nivel de píxel a los totales
    #     departamentales del Censo 2022: reparto dasimétrico que conserva el total)
    deps = gpd.read_file(raw("departamentos"))[["in1", "nam", "geometry"]].rename(
        columns={"in1": "cod_dep", "nam": "departamento"}
    )
    dep_list = sorted(deps.cod_dep.unique())
    dep_num = {d: i + 1 for i, d in enumerate(dep_list)}
    dep_r = rasterize(
        [(g, dep_num[c]) for g, c in zip(deps.geometry, deps.cod_dep)], out_shape=(HEIGHT, WIDTH),
        transform=TRANSFORM, fill=0, dtype="int32",
    )
    wp = np.nan_to_num(warp(raw("worldpop"), resampling=Resampling.nearest))
    cen = census()
    flat_dep = dep_r.ravel()[sel]
    flat_wp = wp.ravel()[sel]
    wp_dep = np.bincount(flat_dep, flat_wp, minlength=len(dep_list) + 1)
    cen_dep = np.zeros(len(dep_list) + 1)
    for d, i in dep_num.items():
        cen_dep[i] = cen.pob2022.get(d, 0.0)
    with np.errstate(invalid="ignore", divide="ignore"):
        fac = np.where(wp_dep > 0, cen_dep / wp_dep, 0.0)
    C["pob"] = np.bincount(inv, flat_wp * fac[flat_dep], minlength=len(uniq))
    sin_px = [dep_list[i - 1] for i in range(1, len(cen_dep)) if cen_dep[i] > 0 and wp_dep[i] == 0]
    log(f"población: WorldPop {flat_wp.sum():,.0f} → censo {C['pob'].sum():,.0f} "
        f"(censo total {cen.pob2022.sum():,.0f}; deptos sin píxeles: {sin_px})")
    # departamento de la celda = el de mayor cantidad de píxeles
    key = inv.astype(np.int64) * (len(dep_list) + 1) + flat_dep
    k, cnt = np.unique(key, return_counts=True)
    kc, kd = np.divmod(k, len(dep_list) + 1)
    best = pd.DataFrame({"c": kc, "d": kd, "n": cnt}).sort_values("n").drop_duplicates("c", keep="last")
    dep_of_cell = np.zeros(len(uniq), dtype=int)
    dep_of_cell[best.c.values] = best.d.values
    del wp, dep_r

    # --- calidad del agua subterránea (probabilidades modeladas)
    C["as_prob"] = agg.mean(warp(raw("arsenico")))
    f = warp(raw("fluoruro"), resampling=Resampling.average)
    f[f > 100] = np.nan  # 255 = sin dato; valores en %
    C["f_prob"] = agg.mean(f / 100.0)
    del f
    log("arsénico y fluoruro")

    # --- áreas protegidas: estrictas (parques, monumentos, reservas integrales) se
    #     tratan como restricción; las de uso múltiple (biosfera, Ramsar, paisaje,
    #     uso múltiple) solo penalizan, porque admiten asentamientos.
    ap = gpd.read_file(raw("areas_protegidas"))
    ap["categoria"] = np.where(
        ap.fna.fillna("").str.contains(ESTRICTA, case=False, regex=True) & ~ap.fna.fillna("").str.contains(
            "Uso M[uú]ltiple|Biósfera|Biosfera|RAMSAR|Paisaje", case=False, regex=True), "estricta", "uso_multiple")
    for cat in ("estricta", "uso_multiple"):
        geoms = [g for g, c in zip(ap.geometry, ap.categoria) if g is not None and c == cat]
        r = rasterize([(g, 1) for g in geoms], out_shape=(HEIGHT, WIDTH), transform=TRANSFORM, fill=0, dtype="uint8")
        C[f"frac_ap_{cat}"] = agg.frac(r.astype(bool))
    del r
    log("áreas protegidas")

    # --- geometría de celdas
    latlng = np.array([h3.cell_to_latlng(h3.int_to_str(int(c))) for c in uniq])
    centers = gpd.GeoSeries(gpd.points_from_xy(latlng[:, 1], latlng[:, 0]), crs="EPSG:4326")
    centers_m = centers.to_crs(CRS_M)

    dep_code = np.array([dep_list[i - 1] if i > 0 else "00000" for i in dep_of_cell])

    # población en un radio de 50 km
    xy = np.c_[centers_m.x.values, centers_m.y.values]
    tree = cKDTree(xy)
    nbrs = tree.query_ball_point(xy, r=50_000)
    pob = C["pob"]
    C["pob_50km"] = np.array([pob[n].sum() for n in nbrs])
    C["crec_dep"] = pd.Series(dep_code).map(cen.crec_anual).values * 100

    # --- tenencia de la tierra (escala departamental)
    cna = pd.read_csv(raw("tenencia_cna2018"), dtype={"cod_dep": str}).set_index("cod_dep")
    dep_s = pd.Series(dep_code)
    C["pct_fiscal_eap"] = dep_s.map(cna.pct_fiscal).values
    C["pct_dep_en_eap"] = dep_s.map(cna.pct_departamento_en_eap.clip(upper=100)).values
    rntr = pd.read_csv(raw("extranjerizacion"), dtype={"cod_dep": str})
    # el PDF del RNTR repite Ituzaingó (18084) con 0 %: se conserva el valor no nulo
    rntr = rntr[rntr.nivel == "departamento"].groupby("cod_dep")[["pct_extranjerizado"]].max()
    C["pct_extranjero"] = dep_s.map(rntr.pct_extranjerizado).values
    # comunidades indígenas: distancia a la más cercana con coordenadas
    ci = pd.read_csv(raw("comunidades_indigenas"), sep=";", encoding="utf-8-sig", dtype=str)
    ci.columns = [c.strip().replace(" ", "") for c in ci.columns]
    for c in ("comunidad_latitud", "comunidad_longitud"):
        ci[c] = pd.to_numeric(ci[c].str.replace(",", ".", regex=False), errors="coerce")
    ci = ci.dropna(subset=["comunidad_latitud", "comunidad_longitud"])
    ci_pts = gpd.GeoDataFrame(ci, geometry=gpd.points_from_xy(ci.comunidad_longitud, ci.comunidad_latitud), crs=4326)
    C["d_comunidad"] = distances_km(centers_m, ci_pts)
    # --- empleo registrado (CEP XXI / SIPA): puestos 2022 del departamento repartidos
    #     entre sus celdas según la población, luego sumados en 50 km
    emp = pd.read_csv(raw("empleo"), dtype={"cod_dep": str}).set_index("cod_dep")
    pob_dep_cells = pd.Series(C["pob"]).groupby(dep_s).transform("sum").values
    share = np.where(pob_dep_cells > 0, C["pob"] / np.maximum(pob_dep_cells, 1), 0)
    puestos_cell = dep_s.map(emp.puestos_priv_2022).fillna(0).values * share
    C["empleo_50km"] = np.array([puestos_cell[n].sum() for n in nbrs])
    C["emp_crec"] = dep_s.map(emp.tasa_anual_2014_2022).values
    C["salario_rel"] = dep_s.map(emp.salario_rel_nac_priv_2022).values
    proy = gpd.read_file(raw("proyectos"))
    motores = proy[
        proy.tipo.isin(["mineria_litio", "mineria_cobre", "mineria_metalifera"]) & proy.etapa_norm.isin(["construccion", "desarrollo", "operacion"])
        | (proy.tipo == "hidrocarburos_vaca_muerta")
        | proy.tipo.str.startswith("energia") & proy.etapa_norm.isin(["construccion", "desarrollo"])
    ]
    mxy = np.c_[motores.to_crs(CRS_M).geometry.x.values, motores.to_crs(CRS_M).geometry.y.values]
    C["n_proyectos_100km"] = np.array([len(x) for x in cKDTree(mxy).query_ball_point(xy, r=100_000)])
    C["d_parque_ind"] = distances_km(centers_m, proy[proy.tipo == "parque_industrial"])
    # --- servicios y capacidad de absorción (Censo 2022 por departamento)
    sv = pd.read_csv(raw("servicios"), dtype={"cod_dep": str}).set_index("cod_dep")
    for col, src in [("pct_agua_red", "pct_agua_red"), ("pct_cloaca", "pct_cloaca"), ("pct_internet", "pct_internet"),
                     ("pct_nbi", "pct_nbi"), ("pct_viv_ociosas", "pct_viv_ociosas"),
                     ("salud_int_100mil", "salud_con_int_por_100mil"), ("crec_proy_2035", "crec_est_2022_2035_pct")]:
        C[col] = dep_s.map(sv[src]).values
    viv_cell = dep_s.map(sv.viv_desocupadas_ociosas).fillna(0).values * share
    C["viv_ociosas_50km"] = np.array([viv_cell[n].sum() for n in nbrs])
    C["d_universidad"] = distances_km(centers_m, gpd.read_file(raw("universidades")))
    sal = gpd.read_file(raw("establecimientos_salud"))
    # hospital = internación general (tipología 6 del REFES); se excluyen geriátricos y especializados
    C["d_hospital"] = distances_km(centers_m, sal[sal.internacion.astype(bool) & (pd.to_numeric(sal.tipologia_cod, errors="coerce") == 6)])
    log(f"empleo: {emp.puestos_priv_2022.sum():,.0f} puestos; {len(motores)} proyectos motores")
    log(f"tenencia: CNA {cna.shape[0]} deptos, RNTR {rntr.shape[0]}, {len(ci_pts)} comunidades con coordenadas")
    log("población 50 km")

    # --- distancias a infraestructura
    rutas = gpd.read_file(raw("rutas_nacionales"))
    rutas_pav = rutas[rutas.rst == 1]
    ffcc = gpd.read_file(raw("ferrocarril"))
    ffcc_op = ffcc[ffcc.fun == 6]
    at = gpd.read_file(raw("lineas_electricas"), columns=["ten", "fun"])
    at = at[at.ten == 6]
    puertos = gpd.read_file(raw("puertos"))
    rios = gpd.read_file(raw("rios"), bbox=(WEST, SOUTH, EAST, NORTH), columns=["DIS_AV_CMS", "ORD_CLAS"])
    rios10 = rios[rios.DIS_AV_CMS >= 10]
    rios100 = rios[rios.DIS_AV_CMS >= 100]
    locs = gpd.read_file(raw("localidades"))

    C["d_ruta"] = distances_km(centers_m, rutas_pav)
    C["d_ffcc"] = distances_km(centers_m, ffcc_op)
    C["d_alta_tension"] = distances_km(centers_m, at)
    C["d_puerto"] = distances_km(centers_m, puertos)
    C["d_rio10"] = distances_km(centers_m, rios10)
    C["d_rio100"] = distances_km(centers_m, rios100)
    C["d_localidad"] = distances_km(centers_m, locs)
    # caudal medio máximo de los ríos a menos de 25 km (oferta superficial potencial)
    rios1 = rios[rios.DIS_AV_CMS >= 1].to_crs(CRS_M)
    pi, ri = STRtree(rios1.geometry.values).query(centers_m.values, predicate="dwithin", distance=25_000)
    q = pd.Series(rios1.DIS_AV_CMS.values[ri]).groupby(pi).max()
    C["q_rio25"] = np.zeros(len(uniq))
    C["q_rio25"][q.index.values] = q.values
    # centralidad para una capital: distancia media de la población del país a la celda
    # (ponderada por población, con las celdas H3 como origen) y distancia a la capital
    # provincial más lejana (equidad de acceso desde todas las provincias)
    # origen: población agregada a celdas padre H3 res 4 (~1.800 km²), centroides ponderados
    parent = np.array([h3.str_to_int(h3.cell_to_parent(h3.int_to_str(int(c)), 4)) for c in uniq])
    g = pd.DataFrame({"p": parent, "w": C["pob"], "x": xy[:, 0] * C["pob"], "y": xy[:, 1] * C["pob"]}).groupby("p").sum()
    g = g[g.w > 0]
    src = np.c_[g.x / g.w, g.y / g.w]
    ws = (g.w / g.w.sum()).values
    dmed = np.empty(len(uniq))
    for k in range(0, len(uniq), 500):
        d = np.sqrt(((xy[k:k + 500, None, :] - src[None, :, :]) ** 2).sum(-1))
        dmed[k:k + 500] = d @ ws / 1000.0
    C["d_media_pob"] = dmed
    caps = gpd.GeoSeries(gpd.points_from_xy([c[1] for c in CAPITALES.values()], [c[0] for c in CAPITALES.values()]),
                         crs="EPSG:4326").to_crs(CRS_M)
    cxy = np.c_[caps.x.values, caps.y.values]
    C["d_max_capital"] = np.sqrt(((xy[:, None, :] - cxy[None, :, :]) ** 2).sum(-1)).max(1) / 1000.0
    # distancia al núcleo de una metrópoli: celdas con ≥10.000 hab. en regiones con ≥1 M hab. en 50 km
    core = (C["pob"] >= 10_000) & (C["pob_50km"] >= 1_000_000)
    C["d_metro"] = cKDTree(xy[core]).query(xy)[0] / 1000.0
    # distancia al centro del AMBA (Plaza de Mayo)
    amba = gpd.GeoSeries(gpd.points_from_xy([-58.3702], [-34.6083]), crs="EPSG:4326").to_crs(CRS_M).iloc[0]
    C["d_amba"] = centers_m.distance(amba).values / 1000.0
    log("distancias")

    C["frac_tierra"] = npx / np.nanmax(npx)

    # ------------------------------------------------------------ export celdas
    keep = npx >= 1  # se conservan también las celdas costeras pequeñas para no perder población
    order = list(C.keys())
    meta_cols = []
    buf = bytearray()
    lo = (uniq[keep] & 0xFFFFFFFF).astype("<u4")
    hi = (uniq[keep] >> 32).astype("<u4")
    buf += lo.tobytes() + hi.tobytes()
    prov_codes = sorted(set(d[:2] for d in dep_code))
    dep_list = sorted(set(dep_code))
    dep_idx = pd.Series(dep_code).map({d: i for i, d in enumerate(dep_list)}).values.astype("<u2")[keep]
    buf += dep_idx.tobytes()
    if len(buf) % 4:
        buf += b"\0" * (4 - len(buf) % 4)
    for k in order:
        arr = C[k][keep].astype("<f4")
        meta_cols.append({"id": k, "offset": len(buf), "min": float(np.nanmin(arr)), "max": float(np.nanmax(arr))})
        buf += arr.tobytes()
    (OUT / "cells.bin").write_bytes(bytes(buf))

    dep_names = deps.set_index("cod_dep").departamento.to_dict()
    prov_names = prov_all.set_index("cod_prov").provincia.to_dict()
    meta = {
        "h3_res": H3_RES,
        "n": int(keep.sum()),
        "layout": {"h3_lo": 0, "h3_hi": int(keep.sum()) * 4, "dep_idx": int(keep.sum()) * 8},
        "columns": meta_cols,
        "departamentos": [
            {"cod": d, "nombre": dep_names.get(d, d), "provincia": prov_names.get(d[:2], d[:2])} for d in dep_list
        ],
        "provincias": {c: prov_names.get(c, c) for c in prov_codes},
        "generado": time.strftime("%Y-%m-%d"),
    }
    (OUT / "cells.json").write_text(json.dumps(meta, ensure_ascii=False))
    log(f"cells.bin {len(buf) / 1e6:.1f} MB, {keep.sum():,} celdas")

    # ------------------------------------------------------------ export vectores
    d = deps.merge(cen, left_on="cod_dep", right_index=True, how="left")
    d["provincia"] = d.cod_dep.str[:2].map(prov_names)
    d["area_km2"] = d.to_crs(CRS_M).area / 1e6
    d["densidad"] = d.pob2022 / d.area_km2
    d["crec_anual"] = d.crec_anual * 100
    for c in ("pob2010", "pob2022"):
        d[c] = d[c].round()
    for c in ("area_km2", "densidad", "crec_anual"):
        d[c] = d[c].round(3)
    simplify_out(d, 0.01, OUT / "departamentos.geojson",
                 ["cod_dep", "departamento", "provincia", "pob2010", "pob2022", "area_km2", "densidad", "crec_anual"])
    simplify_out(prov_all, 0.01, OUT / "provincias.geojson", ["cod_prov", "provincia"])
    capas = OUT / "capas"
    simplify_out(rutas_pav.assign(ruta=rutas_pav.rtn), 0.005, capas / "rutas.geojson", ["ruta"])
    simplify_out(ffcc_op.assign(nombre=ffcc_op.fna), 0.005, capas / "ferrocarril.geojson", ["nombre"])
    simplify_out(at, 0.005, capas / "alta_tension.geojson", [])
    simplify_out(ap.assign(nombre=ap.fna), 0.005, capas / "areas_protegidas.geojson", ["nombre", "categoria"])
    ci_out = ci_pts.assign(nombre=ci_pts.comunidad_nombre.str.strip(), pueblo=ci_pts.comunidad_pueblo.str.strip(),
                           relevamiento=ci_pts.relevamiento_estado.str.strip())
    simplify_out(ci_out, 0, capas / "comunidades_indigenas.geojson", ["nombre", "pueblo", "relevamiento"])
    simplify_out(motores.assign(nombre=motores.nombre, etapa=motores.etapa_norm), 0, capas / "proyectos.geojson",
                 ["nombre", "tipo", "etapa"])
    simplify_out(rios100.assign(caudal=rios100.DIS_AV_CMS.round(0)), 0.01, capas / "rios.geojson", ["caudal"])
    # localidades de referencia para nombrar lugares: solo las que están en celdas con
    # ≥3.000 hab. (pueblos y ciudades reconocibles), una por celda
    cell_pop = pd.Series(C["pob"], index=uniq)
    lc = np.asarray(h3v.coordinates_to_cells(locs.lat_gd.astype(float).values, locs.long_gd.astype(float).values, H3_RES)).astype(np.uint64)
    locs = locs.assign(pob_celda=cell_pop.reindex(lc).fillna(0).values.round(), _c=lc)
    locs = locs.assign(_simple=(locs.tipo_asent != "Localidad simple").astype(int))
    ref = locs[(locs.pob_celda >= 3000) & ~locs.fna.str.match(r"(?i)^(barrio|villa \d|b°)")]
    ref = ref.sort_values(["_c", "_simple", "fna"]).drop_duplicates("_c")
    ref = gpd.GeoDataFrame(ref, geometry=gpd.points_from_xy(ref.long_gd.astype(float), ref.lat_gd.astype(float)), crs=4326)
    # nombre visible: el aglomerado (ciudad) si existe, si no la localidad
    ref = ref.assign(nombre=ref.nom_aglo.where(ref.nom_aglo.fillna("").str.len() > 0, ref.fna))
    simplify_out(ref.assign(provincia=ref.nom_pcia), 0, capas / "localidades.geojson",
                 ["nombre", "provincia", "pob_celda"])

    (OUT / "fuentes.json").write_text(
        json.dumps({k: {kk: v[kk] for kk in ("cita", "licencia", "url")} for k, v in SOURCES.items()},
                   ensure_ascii=False, indent=1)
    )
    log("listo")


if __name__ == "__main__":
    main()
