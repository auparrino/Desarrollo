"""Limpia las capas de restricciones descargadas en data/raw/restricciones/ y escribe
versiones EPSG:4326 en data/interim/restricciones/. Uso: python3 -I limpiar.py [capa ...]"""
import os, sys, json
os.environ.setdefault("OGR_GEOJSON_MAX_OBJ_SIZE", "0")
from pathlib import Path
import numpy as np, pandas as pd, geopandas as gpd, rasterio
from rasterio.features import rasterize
from rasterio.transform import from_origin
from rasterio.warp import reproject, Resampling
from shapely import make_valid, force_2d

ROOT = Path(__file__).resolve().parents[2]
R = ROOT / "data" / "raw" / "restricciones"
O = ROOT / "data" / "interim" / "restricciones"
O.mkdir(parents=True, exist_ok=True)
WEST, EAST, SOUTH, NORTH = -74.0, -53.0, -56.0, -21.0
STEP = 1 / 120
W, H = round((EAST - WEST) / STEP), round((NORTH - SOUTH) / STEP)
T = from_origin(WEST, NORTH, STEP, STEP)
PROF = dict(driver="GTiff", width=W, height=H, count=1, crs="EPSG:4326", transform=T,
            compress="deflate", tiled=True, blockxsize=256, blockysize=256)


def fix_txt(s):
    """Arregla mojibake UTF-8 leído como latin-1 (una o dos veces)."""
    if not isinstance(s, str):
        return s
    for _ in range(3):
        t = None
        for enc in ("cp1252", "latin-1"):
            try:
                t = s.encode(enc).decode("utf-8")
                break
            except (UnicodeEncodeError, UnicodeDecodeError):
                pass
        if t is None or t == s:
            break
        s = t
    return s


def valid(g):
    g = g[g.geometry.notna() & ~g.geometry.is_empty].copy()
    g["geometry"] = force_2d(make_valid(g.geometry.values))
    return g.set_crs(4326, allow_override=True)


def polys(g):
    """Deja solo partes poligonales (make_valid puede generar GeometryCollections)."""
    g = g.explode(index_parts=False)
    g = g[g.geom_type.isin(["Polygon", "MultiPolygon"])]
    return g.dissolve(by=g.index, as_index=True) if g.index.duplicated().any() else g


def write_tif(name, arr, dtype, nodata, desc):
    p = O / name
    with rasterio.open(p, "w", dtype=dtype, nodata=nodata, **PROF) as dst:
        dst.write(arr.astype(dtype), 1)
        dst.update_tags(DESCRIPCION=desc)
    print("  ->", p, np.unique(arr, return_counts=True) if arr.dtype.kind in "iu" else "")


def report(name, g):
    print(f"  -> {name}: {len(g)} filas, CRS {g.crs.to_epsg()}, bounds {np.round(g.total_bounds, 3)}, "
          f"válidas {g.geometry.is_valid.mean():.4f}, campos {[c for c in g.columns if c != 'geometry']}")


def suelos():
    g = valid(gpd.read_file(R / "amb_suelos_inta.geojson"))
    keep = ["provincia", "simbc", "tipo_uc", "ind_prod", "limit_ppal", "limit_secu", "limit_terc",
            "orden_sue1", "sgrup_sue1", "porc_sue1", "drenaje_s1", "profund_s1", "alcalin_s1",
            "erhidr_s1", "ereoli_s1", "anegab_s1", "leyenda"]
    g = polys(g[keep + ["geometry"]])
    g["ind_prod"] = g.ind_prod.astype("int16")
    # IP = 0 en unidades no agrícolas (roca, agua, salinas, médanos) o sin evaluar
    g["no_agricola"] = (g.ind_prod == 0)
    g = g.reset_index(drop=True)
    g.to_file(O / "suelos_inta.gpkg", layer="suelos_inta", driver="GPKG")
    report("suelos_inta.gpkg", g)
    agua = g.tipo_uc.isin(["Agua"]) | g.orden_sue1.isin(["Lagunas", "Rio", "Dique"])
    shapes = [(geom, int(v)) for geom, v in zip(g.geometry, g.ind_prod.where(~agua, 254))]
    a = rasterize(shapes, out_shape=(H, W), transform=T, fill=255, dtype="uint8")
    write_tif("suelos_ip_30s.tif", a, "uint8", 255,
              "Indice de productividad INTA (0-100); 254=agua; 255=sin dato")


MIN_HUECO = 2e-5  # grados² (~0,2 km²): huecos menores se rellenan; son subpíxel a 30" (~0,8 km²)


def simplify_part(p, tol=0.0001):
    """Simplifica un polígono anillo por anillo. Algunos polígonos del OTBN tienen >100.000
    huecos y simplify(preserve_topology)/make_valid sobre ellos tardan decenas de minutos;
    en esos casos se rellenan los huecos menores a MIN_HUECO."""
    import shapely
    if shapely.get_num_interior_rings(p) < 500:
        return shapely.simplify(p, tol, preserve_topology=True)
    holes = np.array(p.interiors, dtype=object)
    holes = holes[shapely.area(shapely.polygons(holes)) >= MIN_HUECO]
    sh = shapely.simplify(p.exterior, tol)
    hs = [h for h in shapely.simplify(holes, tol) if shapely.get_num_coordinates(h) >= 4] if len(holes) else []
    return shapely.Polygon(sh, hs)


def otbn():
    """El GeoJSON pesa 1,35 GB: se parte antes con split_otbn.py (un archivo por feature
    en raw/restricciones/otbn_split/) y se procesa de a uno para no agotar la memoria."""
    import pyogrio
    files = sorted((R / "otbn_split").glob("f*.geojson"))
    n = len(files)
    dst = O / "otbn.gpkg"
    done = len(pyogrio.read_dataframe(dst, read_geometry=False)) if dst.exists() else 0  # reanudable
    for i in range(done, n):
        g = pyogrio.read_dataframe(files[i])
        g = g.rename(columns={"fna": "provincia", "cam": "categoria", "dct": "fecha_norma", "sag": "autoridad"})
        g["provincia"] = g.provincia.replace({"Entre Rios": "Entre Ríos"})
        g["cat_num"] = g.categoria.map({"I": 1, "II": 2, "III": 3}).astype("int8")
        g["color"] = g.cat_num.map({1: "rojo", 2: "amarillo", 3: "verde"})
        g["fecha_norma"] = g.fecha_norma.astype(str).str[:10]
        g = g[["provincia", "categoria", "cat_num", "color", "fecha_norma", "autoridad", "geometry"]]
        # simplificación a ~10 m (muy por debajo de la celda de 30", ~900 m), parte por parte:
        # simplificar el multipolígono entero con preserve_topology es O(n²) en partes.
        import shapely
        parts = shapely.get_parts(g.geometry.values)
        parts = np.array([simplify_part(p) for p in parts], dtype=object)
        parts = shapely.make_valid(parts)
        parts = shapely.get_parts(parts)
        parts = parts[np.isin(shapely.get_type_id(parts), [3, 6])]
        parts = shapely.get_parts(parts)
        parts = parts[~shapely.is_empty(parts)]
        g = gpd.GeoDataFrame(g.drop(columns="geometry"), geometry=[shapely.MultiPolygon(list(parts))], crs=4326)
        g.to_file(dst, layer="otbn", driver="GPKG", mode="a" if i else "w")
        print(f"  {i+1}/{n} {g.provincia.iloc[0]} {g.categoria.iloc[0]}", flush=True)
        del g
    a = np.zeros((H, W), "uint8")
    masks = {c: np.zeros((H, W), bool) for c in (1, 2, 3)}
    for i in range(n):  # el raster sale de las geometrías originales (sin simplificar ni rellenar)
        g = pyogrio.read_dataframe(files[i])
        c = {"I": 1, "II": 2, "III": 3}[g.cam.iloc[0]]
        masks[c] |= rasterize(((x, 1) for x in g.geometry), out_shape=(H, W), transform=T, fill=0, dtype="uint8") == 1
    for c in (3, 2, 1):  # I pisa a II pisa a III en solapes
        a[masks[c]] = c
    inf = pyogrio.read_info(dst, force_total_bounds=True)
    print(f"  -> otbn.gpkg: {inf['features']} filas, {inf['crs']}, bounds {np.round(inf['total_bounds'], 3)}, campos {list(inf['fields'])}")
    write_tif("otbn_30s.tif", a, "uint8", 0, "OTBN categoria por centro de celda: 1=I rojo, 2=II amarillo, 3=III verde (I>II>III en solapes); 0=sin OTBN")


GLAC_TIPO = {"GD": "glaciar descubierto", "GC": "glaciar cubierto", "GCGE": "glaciar cubierto con glaciar de escombros",
             "GEA": "glaciar de escombros activo", "GEI": "glaciar de escombros inactivo", "GE": "glaciar de escombros",
             "MN": "manchón de nieve / glaciarete", "PNLG": "otro", "ND": "no determinado"}


def glaciares():
    g = valid(gpd.read_file(R / "amb_ing_sin_ias.geojson"))
    keep = ["provincia", "cuenca", "subcuenca", "codigo_cue", "id_local", "id_glims", "tipo_geofo", "nombre_com",
            "clas_prima", "area", "h_max_tota", "h_media_to", "h_min_tota", "img_ba_f", "img_ba_s"]
    g = polys(g[keep + ["geometry"]])
    for c in ["provincia", "cuenca", "subcuenca", "nombre_com"]:
        g[c] = g[c].map(fix_txt)
    g["provincia"] = g.provincia.replace({"Cubut": "Chubut", "SANTA CRUZ": "Santa Cruz"})
    g["tipo_desc"] = g.tipo_geofo.map(GLAC_TIPO)
    g["area_km2"] = pd.to_numeric(g.pop("area"), errors="coerce")
    g["fuente"] = "ING nivel 1 (IANIGLA-MAyDS)"
    g = g.reset_index(drop=True)
    g.to_file(O / "glaciares.gpkg", layer="ing_continental", driver="GPKG")
    report("glaciares.gpkg:ing_continental", g)
    a = valid(gpd.read_file(R / "amb_glaciares_andes_deserticos.geojson"))
    keepa = ["provincia", "cuenca", "subcuenca", "codigo_cue", "id_local", "tipo_geofo", "nombre_com", "clas_prima",
             "area", "h_max_tota", "h_media_to", "h_min_tota", "img_ba_f", "img_ba_s"]
    a = polys(a[keepa + ["geometry"]])
    for c in ["provincia", "cuenca", "subcuenca", "nombre_com"]:
        a[c] = a[c].map(fix_txt)
    a["tipo_desc"] = a.tipo_geofo.map(GLAC_TIPO)
    a["area_km2"] = pd.to_numeric(a.pop("area"), errors="coerce")
    a["img_ba_f"] = a.img_ba_f.astype(str)
    a["fuente"] = "ING actualización Andes Desérticos 2024"
    a = a.reset_index(drop=True)
    a.to_file(O / "glaciares.gpkg", layer="andes_deserticos_2024", driver="GPKG")
    report("glaciares.gpkg:andes_deserticos_2024", a)
    allg = pd.concat([g.geometry, a.geometry])
    m = rasterize(((x, 1) for x in allg), out_shape=(H, W), transform=T, fill=0, dtype="uint8", all_touched=True)
    write_tif("glaciares_30s.tif", m, "uint8", 255, "1 = celda tocada por algun poligono del ING (all_touched), 0 = no")


def volcanes():
    v = gpd.read_file(R / "segemar_e2.5M.VolcanesRiesgoRelativo.geojson").drop(columns=["id"])
    v["nombre"] = v.nombre.str.strip()
    v["lon"], v["lat"] = v.geometry.x.round(4), v.geometry.y.round(4)
    v["ambito"] = np.where(v.orden_rvr.notna(), "continental", "antartida_sandwich")
    v["orden_rvr"] = v.orden_rvr.astype("Int16")
    v = v.sort_values(["orden_rvr", "codigo"]).reset_index(drop=True)
    v.to_file(O / "volcanes.gpkg", layer="segemar_riesgo_relativo_2024", driver="GPKG")
    report("volcanes.gpkg:segemar_riesgo_relativo_2024", v)
    gvp = gpd.read_file(R / "gvp_holocene.json")
    gvp = gvp.cx[-76.5:-50, -58:-18]
    cols = ["Volcano_Number", "Volcano_Name", "Country", "Primary_Volcano_Type", "Last_Eruption_Year",
            "Elevation", "Tectonic_Setting", "Major_Rock_Type"]
    cols = [c for c in cols if c in gvp.columns]
    gvp = gvp[cols + ["geometry"]].set_crs(4326, allow_override=True).reset_index(drop=True)
    gvp.to_file(O / "volcanes.gpkg", layer="gvp_holocenos_region", driver="GPKG")
    report("volcanes.gpkg:gvp_holocenos_region", gvp)


def fallas():
    d = gpd.read_file(R / "segemar_e250K.DeformCuater.geojson")
    keep = ["id_estructura", "tipo_estructura", "nombre", "nombre_trazas", "id_traza", "tipo_traza", "actividad",
            "edad_ultimo_mov", "tipo_tasa", "tasa", "sismicidad", "fecha_actualizacion", "ficha"]
    d = valid(d[keep + ["geometry"]]).reset_index(drop=True)
    d["edad_cod"] = d.edad_ultimo_mov.map({"Histórico": 1, "Holoceno (<11 ka)": 2, "Cuaternario (<2.6 Ma)": 3}).astype("int8")
    d.to_file(O / "fallas_cuaternarias.gpkg", layer="segemar_250k", driver="GPKG")
    report("fallas_cuaternarias.gpkg:segemar_250k", d)
    d2 = gpd.read_file(R / "segemar_e2.5M.DeformCuater.geojson")
    d2 = valid(d2[keep + ["geometry"]]).reset_index(drop=True)
    d2.to_file(O / "fallas_cuaternarias.gpkg", layer="segemar_2500k_regional", driver="GPKG")
    report("fallas_cuaternarias.gpkg:segemar_2500k_regional", d2)
    gem = gpd.read_file(R / "gem_active_faults.geojson").cx[-76:-50, -58:-18]
    gem = valid(gem[["catalog_id", "catalog_name", "name", "slip_type", "net_slip_rate", "average_dip",
                     "dip_dir", "activity_confidence", "geometry"]]).reset_index(drop=True)
    gem.to_file(O / "fallas_cuaternarias.gpkg", layer="gem_gaf", driver="GPKG")
    report("fallas_cuaternarias.gpkg:gem_gaf", gem)


def deslizamientos():
    src_p = R / "nasa_landslide_susceptibility_2-27-23.tif"
    dst = np.full((H, W), 255, "uint8")
    with rasterio.open(src_p) as s:
        reproject(rasterio.band(s, 1), dst, src_nodata=127, dst_nodata=255, dst_transform=T,
                  dst_crs="EPSG:4326", resampling=Resampling.nearest)
    write_tif("deslizamientos_nasa_30s.tif", dst, "uint8", 255,
              "NASA Global Landslide Susceptibility (Stanley & Kirschbaum 2017, version 2023-02-27): "
              "1=muy baja 2=baja 3=moderada 4=alta 5=muy alta; 0=agua/sin evaluar; 255=nodata")


def ramsar():
    g = valid(gpd.read_file(R / "amb_sitios_ramsar.geojson").drop(columns=["id"]))
    g = polys(g).reset_index(drop=True)
    g.to_file(O / "ramsar.gpkg", layer="sitios_ramsar", driver="GPKG")
    report("ramsar.gpkg", g)


TODAS = dict(suelos=suelos, otbn=otbn, glaciares=glaciares, volcanes=volcanes, fallas=fallas,
             deslizamientos=deslizamientos, ramsar=ramsar)
if __name__ == "__main__":
    for k in (sys.argv[1:] or TODAS):
        print("==", k, flush=True)
        TODAS[k]()
