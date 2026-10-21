"""Arma las tablas limpias de servicios, vivienda y equipamiento por departamento.

Entradas (data/raw):
  interim/censo_servicios/indec_cuadros_departamento.csv (salida de parse_indec.py), poblaciones/censo_2022/*,
  poblaciones/salud_2022/*, poblaciones/educacion_2024/*, censo_servicios/renabap/*,
  censo_servicios/universidades/*, censo_servicios/proyecciones/*, rc2022.csv
Salidas (data/interim/censo_servicios):
  servicios_departamento.csv, equipamiento_salud.geojson, escuelas.geojson,
  universidades.geojson, renabap.geojson, proyecciones_departamento.csv,
  proyecciones_provincia.csv

Uso: python3 -I pipeline/censo_servicios/build_servicios.py <raiz_repo>
"""
import csv
import sys
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
RAW = ROOT / 'data/raw'
CS = RAW / 'censo_servicios'
PB = RAW / 'poblaciones'
OUT = ROOT / 'data/interim/censo_servicios'
OUT.mkdir(parents=True, exist_ok=True)
csv.field_size_limit(10**9)

deps = gpd.read_file(ROOT / 'web/public/data/departamentos.geojson')[['cod_dep', 'departamento', 'provincia', 'geometry']]
deps = deps.to_crs(4326)
deps_m = deps.to_crs(5346)  # POSGAR 2007 / faja 4 (para distancias aproximadas)


def asignar_dep(g, max_m=5000):
    """Asigna cod_dep por punto en polígono; si cae fuera (costa, límites simplificados)
    usa el departamento más cercano hasta max_m metros."""
    g = g.to_crs(4326)
    pts = g.copy()
    pts['geometry'] = g.geometry if (g.geom_type == 'Point').all() else g.geometry.representative_point()
    j = gpd.sjoin(pts[['geometry']], deps[['cod_dep', 'geometry']], how='left', predicate='within')
    j = j[~j.index.duplicated()]
    out = j['cod_dep'].copy()
    metodo = pd.Series(np.where(out.notna(), 'within', None), index=g.index, dtype=object)
    miss = out.isna()
    if miss.any():
        pm = pts.loc[miss, ['geometry']].to_crs(5346)
        nn = gpd.sjoin_nearest(pm, deps_m[['cod_dep', 'geometry']], how='left', max_distance=max_m, distance_col='d')
        nn = nn[~nn.index.duplicated()]
        out.loc[nn.index] = nn['cod_dep']
        metodo.loc[nn.index[nn['cod_dep'].notna()]] = 'nearest<=5km'
    return out, metodo


# ---------------------------------------------------------------- salud
dic_tip_int = {'1': 'Con internación especializada en maternidad/materno infantil',
               '2': 'Con internación especializada en otras especialidades',
               '3': 'Con internación especializada en tercera edad (inferido; sin etiqueta en el diccionario)',
               '4': 'Con internación especializada en pediatría',
               '5': 'Con internación especializada en salud mental',
               '6': 'Con internación general'}
dic_cat_int = {'1': 'Alto riesgo con terapia intensiva',
               '2': 'Alto riesgo con terapia intensiva especializada',
               '3': 'Mediano riesgo con internación con cuidados especiales',
               '4': 'Bajo riesgo con internación simple'}
dic_tip_sin = {'1': 'Sin internación de diagnóstico (inferido)',
               '2': 'Sin internación de diagnóstico y tratamiento (inferido)',
               '3': 'Sin internación de tratamiento (inferido)'}
dic_sector = {'1': 'Público', '2': 'Privado'}
dic_dep = {'1': 'FFAA/Seguridad', '2': 'Mixta', '3': 'Municipal', '4': 'Mutual', '5': 'Nacional',
           '6': 'Obra social', '7': 'Privado', '8': 'Provincial', '9': 'Servicio Penitenciario Federal',
           '10': 'Servicio Penitenciario Provincial', '11': 'Universitario privado',
           '12': 'Universitario público', '13': 'Otros'}

frames = []
for f, clase in [('con_internacion', 'con_internacion'), ('sin_internacion', 'sin_internacion'),
                 ('complementarios', 'complementario')]:
    d = pd.read_csv(PB / f'salud_2022/{f}.csv', dtype=str)
    d.columns = [c.strip() for c in d.columns]
    d['clase'] = clase
    frames.append(d)
s = pd.concat(frames, ignore_index=True)
s = pd.DataFrame({
    'codigo_refes': s['Código'], 'nombre': s['Nombre'].str.strip(), 'clase': s['clase'],
    'internacion': s['clase'].eq('con_internacion'),
    'tipologia_cod': s.get('Tipología'), 'categoria_cod': s['Categoría'],
    'sector': s['Sector'].map(dic_sector), 'dependencia': s['Dependencia'].map(dic_dep),
    'localidad': s['Localidad'], 'departamento_refes': s['Departamento'],
    'origen_geo': s['Origen georreferenciamiento'],
    'lat': pd.to_numeric(s['Latitud'], errors='coerce'), 'lon': pd.to_numeric(s['Longitud'], errors='coerce')})
s['tipologia'] = np.where(s.clase == 'con_internacion', s.tipologia_cod.map(dic_tip_int),
                          np.where(s.clase == 'sin_internacion', s.tipologia_cod.map(dic_tip_sin), None))
s['categoria'] = np.where(s.clase == 'con_internacion', s.categoria_cod.map(dic_cat_int), None)
s = s.dropna(subset=['lat', 'lon'])
gs = gpd.GeoDataFrame(s, geometry=gpd.points_from_xy(s.lon, s.lat), crs=4326)
gs['cod_dep'], gs['asignacion_dep'] = asignar_dep(gs)
gs.drop(columns=['lat', 'lon']).to_file(OUT / 'equipamiento_salud.geojson', driver='GeoJSON')

# ---------------------------------------------------------------- escuelas
niveles = {'inicial_comun': 'inicial', 'primarias_comun': 'primaria', 'secundarias_comun': 'secundaria',
           'superior': 'superior_no_univ'}
esc = {}
for f, niv in niveles.items():
    d = pd.read_csv(PB / f'educacion_2024/{f}.csv', dtype=str)
    d.columns = [c.strip() for c in d.columns]
    mcol = [c for c in d.columns if c.startswith('Matrícula') and 'varones' not in c][0]
    for _, r in d.iterrows():
        k = r['CUE Anexo']
        e = esc.setdefault(k, {'cue_anexo': k, 'nombre': r['Nombre del establecimiento'],
                               'sector': {'1': 'Estatal', '2': 'Privado'}.get(r.get('Sector'), r.get('Sector')),
                               'ambito': {'1': 'Urbano', '2': 'Rural'}.get(r.get('Ámbito'), r.get('Ámbito')),
                               'localidad': r.get('Localidad'), 'lat': r['Latitud'], 'lon': r['Longitud'],
                               'inicial': False, 'primaria': False, 'secundaria': False, 'superior_no_univ': False})
        e[niv] = True
        e[f'matricula_{niv}'] = pd.to_numeric(r[mcol], errors='coerce')
        if 'Dispone de conexión a internet' in r and pd.notna(r['Dispone de conexión a internet']):
            e['internet'] = {'1': True, '2': False}.get(r['Dispone de conexión a internet'])
e = pd.DataFrame(list(esc.values()))
e['lat'] = pd.to_numeric(e.lat, errors='coerce'); e['lon'] = pd.to_numeric(e.lon, errors='coerce')
e = e.dropna(subset=['lat', 'lon'])
ge = gpd.GeoDataFrame(e.drop(columns=['lat', 'lon']), geometry=gpd.points_from_xy(e.lon, e.lat), crs=4326)
ge['cod_dep'], ge['asignacion_dep'] = asignar_dep(ge)
ge.to_file(OUT / 'escuelas.geojson', driver='GeoJSON')

# ---------------------------------------------------------------- universidades (IGN)
gu = gpd.read_file(CS / 'universidades/ign_universidades_020602.json').to_crs(4326)
gu = gu.rename(columns={'fna': 'nombre', 'gna': 'tipo', 'nam': 'nombre_corto', 'sag': 'fuente', 'gid': 'gid_ign'})
gu = gu[['gid_ign', 'nombre', 'tipo', 'nombre_corto', 'fuente', 'geometry']]
gu['cod_dep'], gu['asignacion_dep'] = asignar_dep(gu)
gu.to_file(OUT / 'universidades.geojson', driver='GeoJSON')

# ---------------------------------------------------------------- RENABAP
gr = gpd.read_file(CS / 'renabap/20231205_info_publica.geojson').to_crs(4326)
gr['cod_dep'], gr['asignacion_dep'] = asignar_dep(gr)
gr.to_file(OUT / 'renabap.geojson', driver='GeoJSON')
ren = gr.groupby('cod_dep').agg(renabap_barrios=('id_renabap', 'count'),
                                renabap_familias=('cantidad_familias_aproximada', 'sum'),
                                renabap_viviendas=('cantidad_viviendas_aproximadas', 'sum'),
                                renabap_superficie_ha=('superficie_m2', lambda x: x.sum() / 1e4))

# ---------------------------------------------------------------- censo (INDEC + Poblaciones + radios)
ind = pd.read_csv(OUT / 'indec_cuadros_departamento.csv', dtype={'cod_dep': str})
pob = pd.read_csv(PB / 'censo_2022/indicadores_hogares_departamentos_2022_wkt.csv', dtype=str, engine='python')
pob = pob.loc[:, ~pob.columns.duplicated()]
pob = pd.DataFrame({
    'cod_dep': pob['Código de departamento.'].str.zfill(5),
    'hog_nbi': pd.to_numeric(pob['Hogares con al menos un indicador NBI']),
    'hog_hacinamiento': pd.to_numeric(pob['Hogares con hacinamiento (más de 2 personas por cuarto)']),
    'hog_hacinamiento_critico': pd.to_numeric(pob['Hogares con hacinamiento crítico (más de 3 personas por cuarto)']),
    'hog_total_poblaciones': pd.to_numeric(pob['Total de hogares'])})
rc = pd.read_csv(RAW / 'rc2022.csv', usecols=['cod_prov', 'cod_dep', 'POB_TOT_P', 'VIV_TOT_P'],
                 dtype={'cod_prov': str, 'cod_dep': str}, encoding='utf-8-sig')
rc['cod_dep'] = rc.cod_prov.str.zfill(2) + rc.cod_dep.str.zfill(3)
rc = rc.groupby('cod_dep')[['POB_TOT_P', 'VIV_TOT_P']].sum().rename(
    columns={'POB_TOT_P': 'pob_total_radios', 'VIV_TOT_P': 'viv_total_radios'})

# proyecciones
pr = pd.read_csv(CS / 'proyecciones/base_estimaciones_pob_deptos_2022_2035.csv', sep=';', encoding='utf-8-sig', dtype=str)
pr['pob'] = pd.to_numeric(pr['Población'].str.strip().replace('-', '0'))
prd = pr.groupby(['Código departamento', 'Nombre departamento', 'Fecha'], as_index=False)['pob'].sum()
prd.columns = ['cod_dep', 'departamento', 'anio', 'pob_estimada']
prd['cod_dep'] = prd.cod_dep.str.zfill(5); prd['anio'] = prd.anio.astype(int)
prd.sort_values(['cod_dep', 'anio']).to_csv(OUT / 'proyecciones_departamento.csv', index=False)
pj = pd.read_csv(CS / 'proyecciones/proyecciones_jurisdicciones_2022_2040_base.csv', sep=';', dtype=str)
pj.columns = [c.strip() for c in pj.columns]; pj = pj.apply(lambda c: c.str.strip())
pj['pob'] = pd.to_numeric(pj.Poblacion.replace('-', '0'))
pjp = pj.groupby(['Jurisdiccion', 'Fecha'], as_index=False)['pob'].sum()
pjp.columns = ['cod_prov', 'anio', 'pob_proyectada']
pjp['cod_prov'] = pjp.cod_prov.str.zfill(2); pjp['anio'] = pjp.anio.astype(int)
pjp.sort_values(['cod_prov', 'anio']).to_csv(OUT / 'proyecciones_provincia.csv', index=False)
pw = prd.pivot(index='cod_dep', columns='anio', values='pob_estimada')[[2022, 2025, 2030, 2035]]
pw.columns = [f'pob_est_{c}' for c in pw.columns]

# equipamiento por departamento
sal = gs.dropna(subset=['cod_dep'])
eq = pd.DataFrame({
    'salud_con_internacion': sal[sal.clase == 'con_internacion'].groupby('cod_dep').size(),
    'salud_con_internacion_general': sal[(sal.clase == 'con_internacion') & (sal.tipologia_cod == '6')].groupby('cod_dep').size(),
    'salud_alto_riesgo_ti': sal[(sal.clase == 'con_internacion') & sal.categoria_cod.isin(['1', '2'])].groupby('cod_dep').size(),
    'salud_internacion_publico': sal[(sal.clase == 'con_internacion') & (sal.sector == 'Público')].groupby('cod_dep').size(),
    'salud_sin_internacion': sal[sal.clase == 'sin_internacion'].groupby('cod_dep').size(),
    'salud_sin_internacion_publico': sal[(sal.clase == 'sin_internacion') & (sal.sector == 'Público')].groupby('cod_dep').size(),
    'escuelas_total': ge.groupby('cod_dep').size(),
    'escuelas_inicial': ge[ge.inicial].groupby('cod_dep').size(),
    'escuelas_primaria': ge[ge.primaria].groupby('cod_dep').size(),
    'escuelas_secundaria': ge[ge.secundaria].groupby('cod_dep').size(),
    'institutos_superior_no_univ': ge[ge.superior_no_univ].groupby('cod_dep').size(),
    'matricula_primaria': ge.groupby('cod_dep')['matricula_primaria'].sum(min_count=1),
    'matricula_secundaria': ge.groupby('cod_dep')['matricula_secundaria'].sum(min_count=1),
    'universidades_sedes': gu.groupby('cod_dep').size(),
})

t = deps[['cod_dep', 'departamento', 'provincia']].copy()
t = (t.merge(ind.drop(columns=['prov_slug', 'hog_tot_ten', 'hogares_v2', 'hog_tot_agua', 'hog_tot_desague', 'hog_tot_internet']),
             on='cod_dep', how='left')
     .merge(pob, on='cod_dep', how='left').merge(rc, on='cod_dep', how='left')
     .merge(pw, on='cod_dep', how='left').merge(ren, on='cod_dep', how='left')
     .merge(eq, on='cod_dep', how='left'))
cnt = [c for c in list(ren.columns) + list(eq.columns) if not c.startswith('matricula')]
t[cnt] = t[cnt].fillna(0)
for c in cnt:
    if c != 'renabap_superficie_ha':
        t[c] = t[c].astype(int)

H = t.hogares
pct = lambda a, b: (100 * a / b).round(2)
t['personas_por_hogar'] = (t.pob_viv_part / H).round(3)
t['pct_agua_red'] = pct(t.hog_agua_red, H)
t['pct_cloaca'] = pct(t.hog_cloaca, H)
t['pct_gas_red'] = pct(t.hog_gas_red_cocina, H)
t['pct_internet'] = pct(t.hog_internet, H)
t['pct_hacinamiento'] = pct(t.hog_hacinamiento, H)
t['pct_hacinamiento_critico'] = pct(t.hog_hacinamiento_critico, H)
t['pct_nbi'] = pct(t.hog_nbi, H)
t['pct_propietarios'] = pct(t.hog_propia, H)
t['pct_inquilinos'] = pct(t.hog_alquilada, H)
t['pct_tenencia_precaria'] = pct(t.hog_prestada + t.hog_otra_tenencia, H)
t['viv_desocupadas'] = t.viv_part - t.viv_part_con_personas
t['viv_desocupadas_ociosas'] = t.viv_vacaciones + t.viv_alquiler_venta + t.viv_otra_situacion
t['pct_viv_desocupadas'] = pct(t.viv_desocupadas, t.viv_part)
t['pct_viv_ociosas'] = pct(t.viv_desocupadas_ociosas, t.viv_part)
P = t.pob_total_radios
t['renabap_familias_por_100_hogares'] = (100 * t.renabap_familias / H).round(2)
t['salud_sin_int_por_10mil'] = (1e4 * t.salud_sin_internacion / P).round(3)
t['salud_con_int_por_100mil'] = (1e5 * t.salud_con_internacion / P).round(3)
t['escuelas_primaria_por_1000_6a12'] = np.nan  # se completa abajo con población por edad
# población de 6-12 y 13-17 años (Poblaciones, por radio, en hogares familiares)
pp = pd.read_csv(PB / 'censo_2022/indicadores_personas_radios_2022.csv', dtype=str,
                 usecols=['Código de radio.', 'Población de 6 a 12 años.', 'Población de 13 a 17 años.'])
pp['cod_dep'] = pp['Código de radio.'].str.zfill(9).str[:5]
pp = pp.assign(p612=pd.to_numeric(pp['Población de 6 a 12 años.']),
               p1317=pd.to_numeric(pp['Población de 13 a 17 años.'])).groupby('cod_dep')[['p612', 'p1317']].sum()
t = t.merge(pp.rename(columns={'p612': 'pob_6a12', 'p1317': 'pob_13a17'}), on='cod_dep', how='left')
t['escuelas_primaria_por_1000_6a12'] = (1e3 * t.escuelas_primaria / t.pob_6a12).round(3)
t['escuelas_secundaria_por_1000_13a17'] = (1e3 * t.escuelas_secundaria / t.pob_13a17).round(3)
t['alumnos_por_escuela_primaria'] = (t.matricula_primaria / t.escuelas_primaria.replace(0, np.nan)).round(1)
t['crec_est_2022_2035_pct'] = (100 * (t.pob_est_2035 / t.pob_est_2022 - 1)).round(2)
t = t.sort_values('cod_dep')
for c in t.columns:  # conteos como enteros (con NA para los 2 departamentos sin datos censales de hogares)
    if (c.startswith(('hog', 'viv_', 'pob_', 'matricula')) or c == 'hogares') and t[c].dropna().mod(1).eq(0).all():
        t[c] = t[c].astype('Int64')
t.to_csv(OUT / 'servicios_departamento.csv', index=False)
print('servicios_departamento:', t.shape)
print('salud:', len(gs), gs.cod_dep.isna().sum(), 'sin depto'); print('escuelas:', len(ge), ge.cod_dep.isna().sum())
print('universidades:', len(gu), gu.cod_dep.isna().sum()); print('renabap:', len(gr), gr.cod_dep.isna().sum())
