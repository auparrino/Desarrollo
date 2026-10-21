"""Cifras oficiales / documentadas de superficie fiscal por provincia.

Uso: python -I pipeline/tierra/fiscal_provincias.py <repo_root>
Escribe data/interim/tierra/fiscal_provincias.csv. Cada fila tiene fuente y URL;
las filas derivadas por cálculo propio llevan [J] en 'nota'.
"""
import sys
from pathlib import Path
import pandas as pd, geopandas as gpd

ROOT = Path(sys.argv[1])
OUT = ROOT / "data/interim/tierra"
T = ROOT / "data/raw/tierra"
COLS = ["provincia", "jurisdiccion", "hectareas_fiscales", "pct_superficie_provincial", "anio", "tipo_cifra", "fuente", "url", "nota"]
rows = []
R = lambda **k: rows.append({c: k.get(c) for c in COLS})

# --- literatura, prensa con fuente oficial, normas
R(provincia="Río Negro", jurisdiccion="provincial", hectareas_fiscales=4800000, anio=2014, tipo_cifra="tierras 'denominadas fiscales' (declaración en la Legislatura)",
  fuente="ANBariloche, 05/05/2014, citando al legislador Jorge Ocampos", url="https://www.anbariloche.com.ar/noticias/2014/05/05/42233-presentan-iniciativa-para-evitar-especulaciones-sobre-tierras-fiscales",
  nota="cifra política, sin método publicado")
R(provincia="Río Negro", jurisdiccion="provincial", hectareas_fiscales=4000000, pct_superficie_provincial=19.7, anio=2026, tipo_cifra="fiscal ocupada sin regularizar",
  fuente="Diario Río Negro, 27/04/2026, con datos del director de Tierras (Diego Lawrie) y del Sistema Provincial de Catastro",
  url="https://www.rionegro.com.ar/politica/en-rio-negro-4-millones-de-hectareas-fiscales-siguen-en-proceso-de-regularizacion/",
  nota="el 19,7 % es sobre 20.301.300 ha (superficie provincial, no fiscal)")
R(provincia="Río Negro", jurisdiccion="provincial", hectareas_fiscales=2368100, pct_superficie_provincial=11.7, anio=2026, tipo_cifra="fiscal sin mensura",
  fuente="Diario Río Negro, 27/04/2026 (Dirección de Tierras y Catastro)", url="https://www.rionegro.com.ar/politica/en-rio-negro-4-millones-de-hectareas-fiscales-siguen-en-proceso-de-regularizacion/",
  nota="concentrada en Meseta de Somuncurá, Trapal Co, El Cuy y Bajo de Santa Rosa")
R(provincia="Río Negro", jurisdiccion="provincial", hectareas_fiscales=3400000, anio=2006, tipo_cifra="fiscal en la Meseta Central / Región Sur (~30 % de esa región)",
  fuente="Sili, M. 'Problemática de las tierras fiscales en la Patagonia argentina' (2006)", url="https://www.marcelosili.com/wp-content/uploads/2019/05/Problematica-de-las-tierras-fiscales-en-la-Patagonia.pdf",
  nota="1.620 ocupantes fiscales, ~2.000 ha promedio")
R(provincia="Patagonia (5 provincias)", jurisdiccion="provincial", hectareas_fiscales=2500000, anio=2012, tipo_cifra="fiscal ocupada (base CNA 2002); '85 % de las tierras fiscales del país'",
  fuente="Sili, M. y Li, S. 'Las tierras fiscales en la Patagonia argentina: un viejo problema' (2012)", url="https://www.marcelosili.com/wp-content/uploads/2019/05/TIERRAS-patagonia-SILI-LI-20-sept-2012.pdf",
  nota="es tierra fiscal dentro de EAP: no incluye la vacante")
R(provincia="Neuquén", jurisdiccion="provincial", pct_superficie_provincial=50.0, anio=1998, tipo_cifra="tierras fiscales (% de la superficie provincial); 8,5 % adicional de Parques Nacionales",
  fuente="La Nación, 13/06/1998 'Neuquén surge como vergel en el inmenso desierto patagónico'", url="https://www.lanacion.com.ar/economia/campo/neuquen-surge-como-vergel-en-el-inmenso-desierto-patagonico-nid199573",
  nota="sin fuente primaria citada; 50 % de 9,43 Mha ≈ 4,7 Mha [J]")
R(provincia="Mendoza", jurisdiccion="provincial", hectareas_fiscales=792000, pct_superficie_provincial=5.0, anio=2012, tipo_cifra="superficie sin regularizar (proyecto de regularización de tierras fiscales)",
  fuente="Gobierno de Mendoza, prensa 07/06/2012", url="https://www.mendoza.gov.ar/prensa/lanzaran-el-proyecto-regularizacion-de-tierras-fiscales-y-desarrollo-productivo/",
  nota="'más del 5 %'; no es el total fiscal. Un BO de Mendoza reconoce que la provincia no tiene inventario completo de tierras fiscales")
R(provincia="Jujuy", jurisdiccion="provincial", hectareas_fiscales=1283300, anio=2000, tipo_cifra="tierras fiscales rurales a regularizar a favor de comunidades aborígenes (más 15.583 parcelas fiscales urbanas)",
  fuente="Convenio Nación-Provincia (Ley 5030 de 1996 y protocolo 2000), citado en Informe de la Comisión sobre violencia institucional en Jujuy (SDH, 2023)",
  url="https://elsubmarinojujuy.com.ar/wp-content/uploads/Informe-Comision-Violencia-Institucional-Jujuy.pdf",
  nota="departamentos Cochinoca, Yavi, Tumbaya, Rinconada, Santa Catalina, Susques, Humahuaca, Tilcara, Santa Bárbara y Valle Grande; 20.233 familias")
R(provincia="Salta", jurisdiccion="provincial", hectareas_fiscales=643000, anio=2020, tipo_cifra="ex lotes fiscales 14 y 55 (matrículas 175 y 5557, Rivadavia)",
  fuente="Memo del Estado Nacional sobre la sentencia Corte IDH Lhaka Honhat vs. Argentina (06/02/2020)", url="https://argentina.gob.ar/sites/default/files/memo_lhaka_honhat.docx.pdf",
  nota="400.000 ha a comunidades indígenas y 243.000 ha a familias criollas; en proceso de titulación")
R(provincia="Santiago del Estero", jurisdiccion="provincial", tipo_cifra="sin cifra de hectáreas; ~24.000 poseedores expuestos a desalojo (Defensor del Pueblo)",
  fuente="FLACSO Andes, tesis sobre MOCASE (1990-2012)", url="https://repositorio.flacsoandes.edu.ec/handle/10469/8473",
  nota="'la población rural santiagueña habita, mayoritariamente, en tierras fiscales'")
for p, n in (("Chubut", "IACyFR (Ley XVII n.º 57) no publica total; sit.chubut.gov.ar (ParcelasRurales, sin campo de dominio) no respondió"),
             ("Santa Cruz", "Consejo Agrario Provincial no publica total; SITU sin capa catastral"),
             ("La Pampa", "geoidelp.lapampa.gob.ar con parcelario sin dominio; conexión reseteada"),
             ("San Juan", "Área de Tierras y Colonias Fiscales tiene base georreferenciada interna (colonia Sarmiento); sin total publicado"),
             ("San Luis", "Ley 313 de tierras fiscales; sin total publicado"),
             ("La Rioja", "sin total publicado; predominan campos comuneros (condominios privados)"),
             ("Catamarca", "sin total publicado; Ley 3070 de campos comuneros; nodoide.catamarca.gob.ar detrás de Cloudflare"),
             ("Formosa", "Instituto de Colonización y Tierras Fiscales (Ley 113) sin total publicado"),
             ("Chaco", "Instituto de Colonización sin total publicado; idechaco.gob.ar no respondió"),
             ("Corrientes", "geoportal sin capa catastral"),
             ("Misiones", "sin total publicado (Ley 100 de regularización, ~50.000 expedientes); ~500.000 ha protegidas")):
    R(provincia=p, jurisdiccion="provincial", tipo_cifra="no se encontró cifra oficial de superficie fiscal", fuente="búsqueda web y geoservicios (21/10/2026)", nota=n)

# --- nacionales con superficie
R(provincia="Nación (INTA)", jurisdiccion="nacional", hectareas_fiscales=30874, anio=2024, tipo_cifra="23 campos de la 1.ª etapa del plan de desafectación (27.019 ha a la AABE)",
  fuente="Bichos de Campo, 20/11/2024 (documento interno INTA)", url="https://bichosdecampo.com/inmobiliaria-inta-el-gobierno-de-milei-quiere-vender-27-mil-hectareas-productivas-ubicadas-en-22-campos-experimentales-del-instituto-tecnologico",
  nota="2.ª lista: ~100.000 ha más, 45.149 ha en AER Santa Victoria Oeste (Salta)")
R(provincia="Nación (INTA)", jurisdiccion="nacional", hectareas_fiscales=42000, anio=2025, tipo_cifra="campos INTA relevados: 17.000 ha en desuso + 25.000 ha en uso a analizar",
  fuente="Bichos de Campo, 15/12/2025", url="https://bichosdecampo.com/un-documento-retoma-el-feroz-ajuste-que-se-pretende-para-el-inta-retiro-voluntario-cierre-de-11-centros-regionales-menos-lineas-de-trabajo-y-la-venta-de-42-000-hectareas-de-campos-experimentales/")
rnd = gpd.read_file(T / "nacion/rnd_reservas_naturales_defensa.geojson")
R(provincia="Nación (Defensa)", jurisdiccion="nacional", hectareas_fiscales=float(rnd["ara"].sum()), anio=2023, tipo_cifra="18 Reservas Naturales de la Defensa (superficie declarada)",
  fuente="Ministerio de Ambiente, WFS areas_protegidas:reserva_natural_defensa", url="https://geo.ambiente.gob.ar/geoserver/ows",
  nota="incluye Uspallata 215.375 ha y Estancia Los Manantiales 121.400 ha")
R(provincia="Nación (Defensa)", jurisdiccion="nacional", hectareas_fiscales=5000, tipo_cifra="Guarnición Campo de Mayo", fuente="El País 08/12/2018 vía es.wikipedia", url="https://es.wikipedia.org/wiki/Campo_de_Mayo")
R(provincia="Nación (Defensa)", jurisdiccion="nacional", hectareas_fiscales=13360, anio=2025, tipo_cifra="terrenos del Ejército en Córdoba (posible venta)",
  fuente="HCDN, proyecto de resolución 4985-D-2025", url="https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4985-D-2025.pdf")
R(provincia="Nación (Defensa)", jurisdiccion="nacional", tipo_cifra="84 inmuebles desafectados de Defensa (7 MinDef, 50 Ejército, 11 Armada, 16 FAA); sin superficie",
  anio=2020, fuente="UAI Ministerio de Defensa, Informe 08/2020", url="https://www.argentina.gob.ar/sites/default/files/inf.def_.08-2020_inmuebles_fd.pdf")

# --- cifras calculadas en esta sesión
cna = pd.read_csv(T / "cna2018_tenencia_departamento.csv")
for p, g in cna.groupby("provincia"):
    R(provincia=p, jurisdiccion="provincial", hectareas_fiscales=round(g["sup_fiscal_ha"].sum()), anio=2018,
      tipo_cifra="fiscal dentro de EAP (cota inferior)", fuente="INDEC, CNA 2018, cuadro C3.1 (procesado)",
      url="https://consultascna2018.indec.gob.ar/", nota="solo tierra fiscal usada por productores")
P = gpd.read_file(OUT / "fiscal_poligonos.gpkg")
for o, g in P.groupby("origen"):
    if not o.startswith("catastro_"):
        continue
    prov = g["provincia"].iloc[0].replace("Tierra del Fuego", "Tierra del Fuego, Antártida e Islas del Atlántico Sur") if g["provincia"].iloc[0] == "Tierra del Fuego" else g["provincia"].iloc[0]
    R(provincia=prov, jurisdiccion="provincial", hectareas_fiscales=round(g["superficie_ha"].sum()), anio=2026,
      tipo_cifra=f"catastro: {o} (titular: {', '.join(sorted(g['titular'].unique()))})", fuente=g["fuente"].iloc[0].split(" (")[0],
      url=g["fuente"].iloc[0].split(" ")[0], nota="superficie calculada del polígono (Albers equivalente) [J]" + (" — titularidad actual NO confirmada" if "salta" in o else ""))
# Neuquén urbano (estadística del servicio Fiscalidad/MapServer/0)
import json
st = json.load(open(T / "provincias/neuquen/nqn_fiscalidad_stats_depto.json"))
urb = {}
for f in st["features"]:
    a = f["attributes"]
    if a["TIPO_PARCELA"] == "URBANA":
        urb[a["FISCALIDAD"]] = urb.get(a["FISCALIDAD"], 0) + a["A"] / 1e4
for k, v in urb.items():
    R(provincia="Neuquén", jurisdiccion="provincial" if "NACIONAL" not in k else "nacional", hectareas_fiscales=round(v), anio=2026,
      tipo_cifra=f"catastro: parcelas urbanas {k}", fuente="Catastro Neuquén, Fiscalidad/MapServer/0 (outStatistics)",
      url="https://catastro.neuquen.gov.ar/nqn_ide/rest/services/Fiscalidad/MapServer/0", nota="suma de SHAPE.AREA (POSGAR faja 2)")
d = pd.read_csv(OUT / "fiscal_departamento.csv", dtype={"cod_dep": str})
for p, g in d.groupby("provincia"):
    if g["estimacion_fiscal_ha_central"].notna().any():
        R(provincia=p, jurisdiccion="provincial+nacional", hectareas_fiscales=round(g["estimacion_fiscal_ha_central"].sum()),
          pct_superficie_provincial=round(100 * g["estimacion_fiscal_ha_central"].sum() / g.loc[g["estimacion_fiscal_ha_central"].notna(), "sup_dep_ha"].sum(), 1),
          anio=2026, tipo_cifra="estimación central por complemento (este trabajo)", fuente="fiscal_departamento.csv",
          nota=f"[J] rango {round(g['estimacion_fiscal_ha_bajo'].sum()):,}–{round(g['estimacion_fiscal_ha_alto'].sum()):,} ha".replace(",", "."))
pd.DataFrame(rows, columns=COLS).to_csv(OUT / "fiscal_provincias.csv", index=False)
print(len(rows), "filas")
