"""Incentivos MUNICIPALES a la radicación de personas y empresas.

Toma las filas relevadas a mano en `incentivos_municipales_datos.py` (cada una con
fuente), les asigna código de gobierno local INDEC 2022, cod_dep y lat/lon, y escribe:
  data/interim/incentivos/municipales.csv
  data/interim/incentivos/municipales_cobertura.csv
Geocodificación: API Georef (apis.datos.gob.ar), con caché local; cod_dep por punto en
polígono sobre web/public/data/departamentos.geojson (en Buenos Aires, partido = departamento).
Ver docs/incentivos-municipales.md.
"""
import csv, json, sys, time, urllib.parse, urllib.request, os
from shapely.geometry import shape, Point

csv.field_size_limit(10**9)
REPO = '/home/user/Desarrollo'
OUT = f'{REPO}/data/interim/incentivos'
WORK = os.path.dirname(os.path.abspath(__file__))
CACHE = f'{OUT}/.georef_cache_municipales.json'

cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}

def georef(nombre, prov):
    key = f'{nombre}|{prov}'
    if key in cache:
        return cache[key]
    q = urllib.parse.urlencode({'nombre': nombre, 'provincia': prov, 'max': 10, 'exacto': 'true'})
    url = f'https://apis.datos.gob.ar/georef/api/municipios?{q}'
    with urllib.request.urlopen(url, timeout=60) as r:
        d = json.load(r)
    res = d.get('municipios', [])
    if not res:
        q = urllib.parse.urlencode({'nombre': nombre, 'provincia': prov, 'max': 10})
        with urllib.request.urlopen(f'https://apis.datos.gob.ar/georef/api/municipios?{q}', timeout=60) as r:
            res = json.load(r).get('municipios', [])
    cache[key] = res
    json.dump(cache, open(CACHE, 'w'), ensure_ascii=False, indent=0)
    time.sleep(0.2)
    return res

import openpyxl
_wb = openpyxl.load_workbook(f'{REPO}/data/raw/indec/c2022_codigos_gobiernos_locales.xlsx', read_only=True)
gl = {r[2]: {'prov_cod': r[0], 'prov': r[1], 'cod_gl': r[2], 'nombre': r[3], 'cat': r[4]}
      for r in list(_wb.worksheets[0].iter_rows(values_only=True))[1:] if r[2]}
pob = {r['Código']: r for r in csv.DictReader(open(f'{REPO}/data/raw/poblaciones/limites/municipios_wkt.csv'))}
deps = json.load(open(f'{REPO}/web/public/data/departamentos.geojson'))['features']
dep_shapes = [(f['properties']['cod_dep'], shape(f['geometry'])) for f in deps]
dep_codes = {c for c, _ in dep_shapes}

def cod_dep_for(lat, lon, cod_gl):
    if cod_gl and cod_gl.startswith('06'):  # Buenos Aires: partido = departamento
        c = '06' + cod_gl[3:6]
        if c in dep_codes:
            return c
    p = Point(lon, lat)
    for c, s in dep_shapes:
        if s.contains(p):
            return c
    best = min(dep_shapes, key=lambda cs: cs[1].distance(p))
    return best[0]

def locate(nombre, prov, cod_override=None):
    cod = cod_override
    lat = lon = None
    if not cod:
        res = georef(nombre, prov)
        if len(res) != 1:
            exact = [m for m in res if m['nombre'].lower() == nombre.lower()]
            res = exact or res
        if res:
            m = res[0]
            cod = m['id']
            lat, lon = m['centroide']['lat'], m['centroide']['lon']
        else:  # fallback: nombre exacto en el listado INDEC
            cands = [k for k, v in gl.items() if v['nombre'].lower() == nombre.lower() and v['prov'] == prov]
            if len(cands) != 1:
                raise SystemExit(f'sin match: {nombre} {prov} {cands}')
            cod = cands[0]
    # preferir el centroide de la localidad cabecera (los ejidos patagonicos son enormes)
    lk = f'LOC|{cod}'
    if lk not in cache:
        q = urllib.parse.urlencode({'municipio': cod, 'max': 50})
        with urllib.request.urlopen(f'https://apis.datos.gob.ar/georef/api/localidades?{q}', timeout=60) as r:
            cache[lk] = json.load(r)['localidades']
        json.dump(cache, open(CACHE, 'w'), ensure_ascii=False, indent=0)
    locs = cache[lk]
    nom = gl[cod]['nombre'].lower().split(' - ')[0]
    best = [l for l in locs if l['nombre'].lower() == nom] or [l for l in locs if nom in l['nombre'].lower()]
    if best:
        lat, lon = best[0]['centroide']['lat'], best[0]['centroide']['lon']
    elif cod in pob:
        lat = float(pob[cod]['Latitud del centroide'])
        lon = float(pob[cod]['Longitud del centroide'])
    elif lat is None:
        res = georef(gl[cod]['nombre'], prov)
        ms = [x for x in res if x['id'] == cod]
        if ms:
            lat, lon = ms[0]['centroide']['lat'], ms[0]['centroide']['lon']
        else:  # localidad homonima
            q = urllib.parse.urlencode({'nombre': gl[cod]['nombre'], 'provincia': prov, 'max': 5})
            with urllib.request.urlopen(f'https://apis.datos.gob.ar/georef/api/localidades?{q}', timeout=60) as r:
                loc = json.load(r)['localidades']
            lat, lon = loc[0]['centroide']['lat'], loc[0]['centroide']['lon']
    if cod not in gl:
        raise SystemExit(f'codigo {cod} no esta en INDEC: {nombre}')
    return cod, cod_dep_for(lat, lon, cod), round(lat, 5), round(lon, 5)

sys.path.insert(0, WORK)
from incentivos_municipales_datos import ROWS, COBERTURA

cols = ['id', 'municipio', 'provincia', 'cod_gobierno_local', 'cod_dep', 'lat', 'lon', 'nombre_programa',
        'norma', 'vigencia_estado', 'tipo', 'beneficiario', 'requisitos', 'intensidad', 'cupo',
        'fuente_url', 'fecha_fuente', 'verificado']
out = []
for i, r in enumerate(ROWS, 1):
    cod, dep, lat, lon = locate(r['geo'][0], r['geo'][1], r.get('cod'))
    if r.get('latlon'):  # localidad especifica dentro del municipio
        lat, lon = r['latlon']
    row = {k: r.get(k, '') for k in cols}
    row.update(id=f'MUN{i:03d}', municipio=r['municipio'], provincia=r['provincia'],
               cod_gobierno_local=cod, cod_dep=dep, lat=lat, lon=lon)
    assert row['vigencia_estado'] in ('vigente', 'vencido', 'incierto'), row
    assert row['tipo'] in ('lotes', 'vivienda', 'tasas', 'parque_industrial', 'subsidio', 'otro'), row
    assert row['beneficiario'] in ('personas', 'empresas', 'profesionales'), row
    assert row['verificado'] in ('si', 'parcial', 'no'), row
    assert row['fuente_url'].startswith('http'), row
    out.append(row)
with open(f'{OUT}/municipales.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    w.writerows(out)

ccols = ['municipio', 'cod_dep', 'tiene_incentivo', 'resumen', 'fuente_url']
cout = []
for c in COBERTURA:
    cod, dep, lat, lon = locate(c['geo'][0], c['geo'][1], c.get('cod'))
    assert c['tiene_incentivo'] in ('si', 'no', 'sin_info')
    cout.append({'municipio': c['municipio'], 'cod_dep': dep, 'tiene_incentivo': c['tiene_incentivo'],
                 'resumen': c['resumen'], 'fuente_url': c.get('fuente_url', '')})
with open(f'{OUT}/municipales_cobertura.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=ccols)
    w.writeheader()
    w.writerows(cout)

# chequeo de geocodificacion
for r in out:
    print(r['id'], r['municipio'], r['provincia'], r['cod_gobierno_local'], gl[r['cod_gobierno_local']]['nombre'], r['cod_dep'], r['lat'], r['lon'])
print('---')
for c, src in zip(cout, COBERTURA):
    cod, dep, lat, lon = locate(src['geo'][0], src['geo'][1], src.get('cod'))
    print(c['municipio'], cod, gl[cod]['nombre'], dep, c['tiene_incentivo'])
