# Construye data/interim/incentivos/{incentivos.csv, incentivos_departamento.csv,
# zonas_francas.geojson, contribuciones_zona_27541.csv}
import csv, json, os
from collections import defaultdict
import geopandas as gpd
from shapely.geometry import Point

ROOT = "/home/user/Desarrollo"
OUT = f"{ROOT}/data/interim/incentivos"
os.makedirs(OUT, exist_ok=True)
VER = "2026-10-21"

deps = gpd.read_file(f"{ROOT}/web/public/data/departamentos.geojson")
deps["prov"] = deps["cod_dep"].str[:2]
ALL = sorted(deps["cod_dep"])
BYPROV = defaultdict(list)
for c in ALL:
    BYPROV[c[:2]].append(c)
NAME = dict(zip(deps["cod_dep"], deps["departamento"]))

def d(*codes):
    for c in codes:
        assert c in NAME, c
    return list(codes)

PATAGONIA_23272 = ["42", "58", "62", "26", "78", "94"]  # + Patagones 06602
PATAGONES = "06602"
PUNA_JUJ = d("38007", "38049", "38077", "38084", "38112")  # Cochinoca, Rinconada, Sta Catalina, Susques, Yavi
GBA24 = d("06028","06035","06091","06260","06270","06274","06371","06408","06410","06412",
          "06427","06434","06490","06515","06539","06560","06568","06658","06749","06756",
          "06760","06805","06840","06861")
# Tercer cinturón (aproximación propia, ver doc)
GBA3 = d("06441","06098","06245","06252","06638","06364","06525","06648","06778","06134",
         "06119","06126","06882","06266","06497","06329")

# ---------------------------------------------------------------- Anexo I Ley 27.541
# (zona, nombre, puntos IVA, [cod_dep], precision)
Z = []
def z(n, nombre, pts, codes, prec="exacto"):
    Z.append((n, nombre, pts, codes, prec))
z(1, "Ciudad Autónoma de Buenos Aires", 0.00, BYPROV["02"])
z(2, "Gran Buenos Aires", 0.00, GBA24, "aproximado (24 partidos)")
z(3, "Tercer cinturón del GBA", 0.65, GBA3, "aproximado (lista propia)")
z(5, "Bs. As. - Patagones", 2.20, [], "ver zona 6")
z(6, "Bs. As. - Carmen de Patagones", 3.00, [PATAGONES], "aproximado (partido entero con valor de zona 6)")
z(8, "Bs. As. - Villarino", 2.20, d("06875"))
z(4, "Resto de Buenos Aires", 1.45, [c for c in BYPROV["06"] if c not in GBA24 + GBA3 + [PATAGONES, "06875"]])
z(9, "Gran Catamarca", 5.70, d("10049", "10112", "10063"), "aproximado (Capital, Valle Viejo, F. M. Esquiú)")
z(10, "Resto de Catamarca", 6.50, [c for c in BYPROV["10"] if c not in ("10049", "10112", "10063")])
z(11, "Ciudad de Corrientes", 7.30, d("18021"))
for n, nm, c in [(23, "Esquina", "18049"), (24, "Sauce", "18175"), (25, "Curuzú Cuatiá", "18035"), (26, "Monte Caseros", "18112")]:
    z(n, f"Corrientes - {nm}", 5.70, d(c))
z(27, "Resto de Corrientes", 7.30, [c for c in BYPROV["18"] if c not in ("18021", "18049", "18175", "18035", "18112")])
z(12, "Formosa - Ciudad de Formosa", 8.05, d("34014"), "aproximado (departamento Formosa)")
z(85, "Resto de Formosa", 8.85, [c for c in BYPROV["34"] if c != "34014"])
z(28, "Gran Resistencia", 7.30, d("22140"), "aproximado (departamento San Fernando)")
z(14, "Resto de Chaco", 8.85, [c for c in BYPROV["22"] if c != "22140"])
cba = {"14028": (7, "Cruz del Eje", 3.80), "14154": (13, "Sobremonte", 5.70), "14112": (15, "Río Seco", 5.70),
       "14175": (16, "Tulumba", 5.70), "14070": (17, "Minas", 3.80), "14077": (18, "Pocho", 3.80),
       "14126": (19, "San Alberto", 3.80), "14133": (20, "San Javier", 3.80), "14014": (21, "Gran Córdoba", 1.45)}
for c, (n, nm, p) in cba.items():
    z(n, f"Córdoba - {nm}", p, d(c), "aproximado (Capital)" if c == "14014" else "exacto")
z(22, "Resto de Córdoba", 2.20, [c for c in BYPROV["14"] if c not in cba])
z(29, "Chubut - Rawson - Trelew", 5.70, d("26077"))
z(30, "Resto de Chubut", 6.50, [c for c in BYPROV["26"] if c != "26077"])
er = {"30028": (31, "Federación", 5.70), "30042": (32, "Feliciano", 5.70), "30084": (33, "Paraná", 2.20)}
for c, (n, nm, p) in er.items():
    z(n, f"Entre Ríos - {nm}", p, d(c))
z(34, "Resto de Entre Ríos", 3.00, [c for c in BYPROV["30"] if c not in er])
z(35, "Jujuy - Ciudad de Jujuy", 7.30, d("38021"), "aproximado (Dr. Manuel Belgrano)")
z(36, "Resto de Jujuy", 8.05, [c for c in BYPROV["38"] if c != "38021"])
lp = {"42063": (37, "Chicalcó"), "42049": (38, "Chalileo"), "42112": (39, "Puelén"), "42091": (40, "Limay Mahuida"),
      "42042": (41, "Curacó"), "42084": (42, "Lihuel Calel")}
for c, (n, nm) in lp.items():
    z(n, f"La Pampa - {nm}", 3.80, d(c))
z(43, "La Pampa - Santa Rosa y Toay", 2.20, d("42021", "42140"))
z(44, "Resto de La Pampa", 3.00, [c for c in BYPROV["42"] if c not in list(lp) + ["42021", "42140"]])
z(45, "Ciudad de La Rioja", 5.70, d("46014"))
z(46, "Resto de La Rioja", 6.50, [c for c in BYPROV["46"] if c != "46014"])
GMZA = d("50007", "50021", "50028", "50049", "50063", "50070")
z(47, "Gran Mendoza", 3.00, GMZA, "aproximado (6 departamentos)")
z(48, "Resto de Mendoza", 3.80, [c for c in BYPROV["50"] if c not in GMZA])
z(49, "Misiones - Posadas", 7.30, d("54028"))
z(50, "Resto de Misiones", 8.05, [c for c in BYPROV["54"] if c != "54028"])
z(51, "Ciudad Neuquén / Plottier (y Centenario, Cutral Có, Plaza Huincul)", 3.00, d("58035"),
  "mixto: Confluencia incluye zonas 51-52 (3,00) y 53-54 (6,50); se asigna 3,00")
z(55, "Resto de Neuquén", 3.80, [c for c in BYPROV["58"] if c != "58035"])
z(57, "Río Negro - Viedma", 3.00, d("62007"))
z(58, "Río Negro - Alto Valle", 3.00, d("62042"), "aproximado (General Roca)")
RN_SUR = d("62056", "62091", "62049")
z(56, "Río Negro sur hasta paralelo 42", 6.50, RN_SUR, "incierto (Ñorquinco, 25 de Mayo, 9 de Julio)")
z(59, "Resto de Río Negro", 3.80, [c for c in BYPROV["62"] if c not in ["62007", "62042"] + RN_SUR])
z(60, "Gran Salta", 7.30, d("66028"), "aproximado (Capital)")
z(61, "Resto de Salta", 8.05, [c for c in BYPROV["66"] if c != "66028"])
GSJ = d("70028", "70077", "70084", "70042", "70098", "70070")
z(62, "Gran San Juan", 3.80, GSJ, "aproximado (6 departamentos)")
z(63, "Resto de San Juan", 5.70, [c for c in BYPROV["70"] if c not in GSJ])
z(64, "Ciudad de San Luis", 3.00, d("74056"), "aproximado (Juan Martín de Pueyrredón)")
z(65, "Resto de San Luis", 3.80, [c for c in BYPROV["74"] if c != "74056"])
z(66, "Santa Cruz - Caleta Olivia", 6.50, d("78014"), "aproximado (Deseado)")
z(67, "Santa Cruz - Río Gallegos", 6.50, d("78021"), "aproximado (Güer Aike)")
z(68, "Resto de Santa Cruz", 7.30, [c for c in BYPROV["78"] if c not in ("78014", "78021")])
sf = {"82049": (69, "General Obligado"), "82098": (70, "San Javier"), "82077": (72, "9 de Julio"), "82133": (73, "Vera")}
for c, (n, nm) in sf.items():
    z(n, f"Santa Fe - {nm}", 5.70, d(c))
z(71, "Santa Fe y Santo Tomé", 2.20, d("82063"), "aproximado (La Capital)")
z(74, "Resto de Santa Fe", 2.20, [c for c in BYPROV["82"] if c not in list(sf) + ["82063"]])
z(75, "Ciudad de Sgo. del Estero y La Banda", 8.05, d("86049", "86035"))
for n, nm, c in [(76, "Ojo de Agua", "86126"), (77, "Quebrachos", "86140"), (78, "Rivadavia", "86154")]:
    z(n, f"Sgo. del Estero - {nm}", 5.70, d(c))
z(84, "Resto de Sgo. del Estero", 8.85, [c for c in BYPROV["86"] if c not in ("86049", "86035", "86126", "86140", "86154")])
z(79, "Tierra del Fuego - Río Grande", 6.50, d("94008"))
z(80, "Tierra del Fuego - Ushuaia", 6.50, d("94015"))
z(81, "Resto de Tierra del Fuego", 7.30, d("94011", "94021", "94028"))
GTUC = d("90084", "90119", "90105", "90014", "90063")
z(82, "Gran Tucumán", 5.70, GTUC, "aproximado (5 departamentos)")
z(83, "Resto de Tucumán", 6.50, [c for c in BYPROV["90"] if c not in GTUC])

zrows, seen = [], {}
for n, nm, p, codes, prec in Z:
    for c in codes:
        assert c not in seen, (c, n, seen.get(c))
        seen[c] = n
        zrows.append({"cod_dep": c, "departamento": NAME[c], "zona_anexo": n, "zona_nombre": nm,
                      "puntos_iva": f"{p:.2f}", "precision_mapeo": prec})
missing = [c for c in ALL if c not in seen]
assert not missing, missing
with open(f"{OUT}/contribuciones_zona_27541.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(zrows[0]))
    w.writeheader(); w.writerows(sorted(zrows, key=lambda r: r["cod_dep"]))
pts = {r["cod_dep"]: float(r["puntos_iva"]) for r in zrows}

# ---------------------------------------------------------------- Zonas francas
ZF = [  # nombre, provincia, localidad, lat, lon, estado
    ("Zona Franca La Plata", "Buenos Aires", "Ensenada", -34.858, -57.915, "operativa"),
    ("Zona Franca Bahía Blanca - Coronel Rosales", "Buenos Aires", "Bahía Blanca / Coronel Rosales", -38.780, -62.290, "operativa"),
    ("Zona Franca de Córdoba", "Córdoba", "Córdoba", -31.390, -64.130, "operativa"),
    ("Zona Franca de Comodoro Rivadavia", "Chubut", "Comodoro Rivadavia", -45.864, -67.480, "operativa"),
    ("Zona Franca de Concepción del Uruguay", "Entre Ríos", "Concepción del Uruguay", -32.483, -58.230, "operativa"),
    ("Zona Franca de Perico", "Jujuy", "Perico", -24.383, -65.113, "operativa"),
    ("Zona Franca de General Pico", "La Pampa", "General Pico", -35.660, -63.757, "operativa"),
    ("Zona Franca de Mendoza", "Mendoza", "Luján de Cuyo", -33.035, -68.880, "operativa"),
    ("Zona Franca de Puerto Iguazú", "Misiones", "Puerto Iguazú", -25.598, -54.574, "operativa"),
    ("Zona Franca Zapala", "Neuquén", "Zapala", -38.900, -70.065, "operativa"),
    ("Zona Franca Salta", "Salta", "General Güemes", -24.668, -65.047, "operativa"),
    ("Zona Franca Río Gallegos", "Santa Cruz", "Río Gallegos", -51.623, -69.216, "operativa"),
    ("Zona Franca Santafesina", "Santa Fe", "Villa Constitución", -33.228, -60.330, "operativa"),
    ("Zona Franca Justo Daract", "San Luis", "Justo Daract", -33.860, -65.183, "operativa"),
    ("Zona Franca La Quiaca", "Jujuy", "La Quiaca", -22.103, -65.597, "en construcción"),
    ("Zona Franca de Río Negro", "Río Negro", "Sierra Grande", -41.606, -65.355, "en desarrollo"),
    ("Zona Franca Caleta Olivia", "Santa Cruz", "Caleta Olivia", -46.440, -67.528, "en construcción"),
]
feats, zf_deps = [], []
for nm, prov, loc, lat, lon, est in ZF:
    pt = Point(lon, lat)
    hit = deps[deps.contains(pt)]
    cod = hit["cod_dep"].iloc[0] if len(hit) else None
    if cod is None:  # punto costero fuera del polígono simplificado: depto más cercano
        cod = deps.loc[deps.distance(pt).idxmin(), "cod_dep"]
    zf_deps.append(cod)
    feats.append({"type": "Feature", "geometry": {"type": "Point", "coordinates": [lon, lat]},
                  "properties": {"nombre": nm, "provincia": prov, "localidad": loc, "estado": est,
                                 "cod_dep": cod, "departamento": NAME[cod],
                                 "precision_coord": "aproximada (centro de la localidad o área portuaria, ±5 km)",
                                 "norma": "Ley 24.331 (1994)" + (" ; preexistente Ley 5.142 (1907)" if "La Plata" in nm else ""),
                                 "fuente": "CFI, Facilitación de Comercio - Zonas Francas, Informe final (2023)",
                                 "fuente_url": "https://cfi.org.ar/assets/docs/Zonas_Francas.pdf",
                                 "verificado_fecha": VER}})
with open(f"{OUT}/zonas_francas.geojson", "w", encoding="utf-8") as f:
    json.dump({"type": "FeatureCollection", "features": feats}, f, ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- Incentivos
def prov(*ps):
    return ("provincias", list(ps))

I = []
def inc(**k):
    k.setdefault("costo_fiscal_usd_anio", "")
    k.setdefault("evidencia_efectividad", "")
    k.setdefault("vigencia_hasta", "")
    k.setdefault("verificado_fecha", VER)
    I.append(k)

AFIP = "https://biblioteca.afip.gob.ar/dcp/"
GT = "https://www.argentina.gob.ar/sites/default/files/informe_sobre_gastos_tributarios._anos_2024-2026.pdf"

# ===== NACIONALES
inc(id="N01", nombre="Régimen fiscal y aduanero especial de Tierra del Fuego (régimen general)", nivel="nacional",
    norma="Ley 19.640 (1972)", vigencia_estado="vigente", vigencia_hasta="",
    tipo="impositivo|aduanero", beneficiario="empresas|hogares", alcance=("departamentos", d("94008", "94011", "94015")),
    intensidad="Exención de IVA en operaciones dentro del área y de Ganancias; liberación de derechos de importación (Área Aduanera Especial: Isla Grande)",
    costo_fiscal_usd_anio="1307",
    evidencia_efectividad="[O] población de 13.527 (1970) a ~190.000 (2022); 54,5% de residentes nacidos en otra provincia; sin contrafáctico (ver politicas-territoriales.md §3.3). Costo incluye N02",
    fuente_url=AFIP + "LEY_C_019640_1972_05_16 ; " + GT)
inc(id="N02", nombre="Tierra del Fuego: subrégimen de promoción industrial (prórroga)", nivel="nacional",
    norma="Decreto 727/2021 (mod. Decreto 111/2025; Res. SIyC 19-20/2026 y 152/2026)", vigencia_estado="vigente", vigencia_hasta="2038-12-31",
    tipo="impositivo|aduanero", beneficiario="empresas", alcance=("departamentos", d("94008", "94011", "94015")),
    intensidad="Mantiene beneficios de Ley 19.640 a proyectos industriales hasta 2038 (prorrogable 15 años); aporte al FAMP-Fueguina del 15% del beneficio de IVA, reducido a 0% en enero de 2026 por cambios arancelarios que restan competitividad",
    evidencia_efectividad="[O] ~8.500 empleos en electrónica (Fundar 2023); USD ~126.000 por puesto y año como cota superior [D]",
    fuente_url=AFIP + "DEC_C_000727_2021_10_22 ; https://www.boletinoficial.gob.ar/detalleAviso/primera/337574/20260120")
inc(id="N03", nombre="Promoción industrial y no industrial de La Rioja, Catamarca, San Luis y San Juan", nivel="nacional",
    norma="Ley 22.021 (1979), Ley 22.702 (1982), Ley 22.973 (1983); Decretos 2054/92, 804/96, 1553/98, 2334/06, 699/2010",
    vigencia_estado="vencido", vigencia_hasta="2012-12-31",
    tipo="impositivo", beneficiario="empresas", alcance=prov("46", "10", "74", "70"),
    intensidad="Exención/diferimiento de Ganancias e IVA; Dto. 699/2010 extendió 2 años con tope de 45% del beneficio. Quedan beneficios residuales en IVA",
    costo_fiscal_usd_anio="159",
    evidencia_efectividad="[O] +31.728 empleos industriales 1973-1993; USD 461.000 por puesto acumulado (CEM 1999, actor interesado); San Luis sostuvo empleo industrial tras 2012 (Karamaneff & Salvia 2019)",
    fuente_url=AFIP + "DEC_C_000699_2010_05_20 ; " + GT)
inc(id="N04", nombre="Promoción industrial general (régimen de 1977)", nivel="nacional",
    norma="Ley 21.608 (1977)", vigencia_estado="incierto", vigencia_hasta="",
    tipo="impositivo", beneficiario="empresas", alcance=("pais", []),
    intensidad="incierto: no se verificó el texto ni su estado; sin nuevas aprobaciones conocidas",
    fuente_url="")
inc(id="N05", nombre="Incremento del 22% de deducciones personales de Ganancias en zona patagónica", nivel="nacional",
    norma="Ley de Ganancias art. 30 (t.o. 2019); derogado por Ley 27.743 art. 71 (2024)", vigencia_estado="derogado", vigencia_hasta="2024-07-08",
    tipo="impositivo", beneficiario="trabajadores", alcance=prov(*PATAGONIA_23272), extra_deps=[PATAGONES],
    intensidad="+22% sobre deducciones personales (ganancia no imponible, cargas de familia, deducción especial) para empleados y jubilados de la Región Patagónica (Ley 23.272)",
    costo_fiscal_usd_anio="73",
    evidencia_efectividad="Sin evaluación. Gasto tributario 2024: $67.024 M; 'no vigente' en 2025-2026 (DNIAF)",
    fuente_url=AFIP + "LEY_C_027743_2024_06_27 ; " + GT)
inc(id="N06", nombre="Reembolsos adicionales a exportaciones por puertos patagónicos", nivel="nacional",
    norma="Ley 23.018 (1983); restablecido por Decreto 2229/2015; derogado por DNU 1199/2016", vigencia_estado="derogado", vigencia_hasta="2016-11-29",
    tipo="aduanero", beneficiario="empresas",
    alcance=("departamentos", d("62077", "26007", "26021", "78014", "78042", "78007", "78021", "94008", "94015")),
    intensidad="Reembolso adicional de ~8% (Puerto Madryn, San Antonio Oeste) a ~13% (Ushuaia) del valor FOB según el puerto [A, prensa]",
    evidencia_efectividad="Sin evaluación encontrada",
    fuente_url="https://www.argentina.gob.ar/normativa/nacional/disposicion-62-2016-268508/texto ; https://www.infocampo.com.ar/?p=113651")

# Asignaciones familiares por zona (Decreto 1668/2012, vigente según montos ANSES 2026)
MZA_AF = d("50049", "50063", "50126", "50119", "50091", "50105", "50077", "50070", "50084")
AF1 = BYPROV["42"] + BYPROV["62"] + BYPROV["58"] + d("34007", "34063", "34028") + MZA_AF + d("66126")
AF3 = d("10028") + PUNA_JUJ + d("38028") + d("66105", "66161", "66133", "66056")
afurl = "https://www.boletinoficial.gob.ar/detalleAviso/primera/75609/20120913 ; " + AFIP + "LEY_C_024714_1996_10_02"
inc(id="N07", nombre="Asignaciones familiares diferenciales - Zona 1", nivel="nacional",
    norma="Ley 24.714 (1996); Decreto 1668/2012 Anexo I; montos Res. ANSES 283/2026", vigencia_estado="vigente",
    tipo="salarial", beneficiario="hogares", alcance=("departamentos", AF1),
    intensidad="Asignación por hijo igual a la general en el 1er tramo de ingresos y mayor en los tramos altos (2012: $179 vs $90 en el tramo superior); Mendoza y Orán solo en ciertos distritos (mapeo a departamento entero, aproximado)",
    fuente_url=afurl)
inc(id="N08", nombre="Asignaciones familiares diferenciales - Zona 2 (Chubut)", nivel="nacional",
    norma="Ley 24.714 (1996); Decreto 1668/2012 Anexo I", vigencia_estado="vigente",
    tipo="salarial", beneficiario="hogares", alcance=prov("26"),
    intensidad="Asignación por hijo ~2,2 veces la general en el 1er tramo (2012: $733 vs $340)",
    fuente_url=afurl)
inc(id="N09", nombre="Asignaciones familiares diferenciales - Zona 3 (Puna y norte de Salta)", nivel="nacional",
    norma="Ley 24.714 (1996); Decreto 1668/2012 Anexo I", vigencia_estado="vigente",
    tipo="salarial", beneficiario="hogares", alcance=("departamentos", AF3),
    intensidad="Asignación por hijo ~2 veces la general en el 1er tramo (2012: $680 vs $340); octubre 2026: hasta $168.837 en zonas 3-4 vs $78.304 general [A, prensa]. Antofagasta de la Sierra solo actividad minera; Gral. San Martín excepto Tartagal",
    fuente_url=afurl + " ; https://www.econoblog.com.ar/?p=159160")
inc(id="N10", nombre="Asignaciones familiares diferenciales - Zona 4 (Santa Cruz y Tierra del Fuego)", nivel="nacional",
    norma="Ley 24.714 (1996); Decreto 1668/2012 Anexo I", vigencia_estado="vigente",
    tipo="salarial", beneficiario="hogares", alcance=prov("78", "94"),
    intensidad="Asignación por hijo ~2,2 veces la general en el 1er tramo (2012: $733 vs $340); AUH en zona diferencial $203.565 vs $156.588 general (oct. 2026) [A]",
    fuente_url=afurl)
inc(id="N11", nombre="Bonificación por zona austral en jubilaciones y pensiones", nivel="nacional",
    norma="Ley 19.485 (1972), mod. Ley 23.675 y Decreto 1472/2008 art. 15", vigencia_estado="vigente",
    tipo="salarial", beneficiario="hogares", alcance=prov(*PATAGONIA_23272), extra_deps=[PATAGONES],
    intensidad="Coeficiente 1,40 (+40%) sobre el haber previsional; la CSJN (2019) resolvió que no se reduce por topes",
    evidencia_efectividad="Sin evaluación encontrada",
    fuente_url="https://rest.hcdn.gob.ar/web/proyectos/289571/adjuntos/104156 ; https://www.diariojudicial.com/news-81538-adicional-del-fin-del-mundo")
inc(id="N12", nombre="Adicional por zona desfavorable en salarios", nivel="nacional",
    norma="Sin norma general: convenios colectivos y estatutos del empleo público", vigencia_estado="incierto",
    tipo="salarial", beneficiario="trabajadores", alcance=prov(*PATAGONIA_23272),
    intensidad="incierto: el porcentaje varía por convenio y estatuto; la Ley 24.714 art. 3 excluye estos importes 'zonales' del cálculo de topes",
    fuente_url=AFIP + "LEY_C_024714_1996_10_02")
ZF_ORIG = BYPROV["58"] + BYPROV["62"] + BYPROV["26"] + BYPROV["78"] + BYPROV["94"] + BYPROV["42"] + [PATAGONES] + d("50077") + PUNA_JUJ + d("66105")
inc(id="N13", nombre="Régimen de Zona Fría: bonificación automática (Patagonia, Malargüe, Puna)", nivel="nacional",
    norma="Ley 25.565 art. 75 inc. a (2002); Ley 27.637 (2021); Ley 27.828 y Decreto 1161/2026", vigencia_estado="vigente", vigencia_hasta="2031-12-31",
    tipo="tarifario", beneficiario="hogares", alcance=("departamentos", ZF_ORIG),
    intensidad="Hasta oct. 2026: 50% del cuadro tarifario pleno de gas. Desde la Ley 27.828: bonificación sobre el precio del gas en PIST, con monto a fijar por el PEN (no se verificó el nuevo porcentaje). ~940.000 usuarios (2023). Puna mapeada a departamentos con usuarios (aproximado)",
    costo_fiscal_usd_anio="",
    evidencia_efectividad="Sin evaluación. Fondo fiduciario autofinanciado con recargo de hasta 7,5% sobre el PIST; pagos 2023: $74.416 M para todo el régimen",
    fuente_url=AFIP + "LEY_C_025565_2002_03_06 ; " + AFIP + "LEY_C_027828_2026_09_24 ; https://www.argentina.gob.ar/sites/default/files/informe_regimen_zona_fria.pdf")
ZF_AMP = d("14007", "14014", "14035", "14042", "14056", "14063", "14084", "14098", "14119", "14133", "14147", "14161", "14182") \
    + d("70063", "70007", "70028", "70042", "70070", "70077", "70084", "70098") + [c for c in BYPROV["50"] if c != "50077"]
inc(id="N14", nombre="Régimen de Zona Fría ampliado (subzonas IIIa a VI), focalizado desde 2026", nivel="nacional",
    norma="Ley 27.637 art. 4 (2021), derogado por Ley 27.828 art. 3 (2026); nuevo art. 75 inc. b Ley 25.565", vigencia_estado="vigente", vigencia_hasta="2031-12-31",
    tipo="tarifario", beneficiario="hogares", alcance=("departamentos", ZF_AMP),
    intensidad="2021-2026: 30% de descuento automático (50% para vulnerables), 231 departamentos y ~3,37 M usuarios. Desde oct. 2026: solo hogares del Régimen de Subsidios Focalizados con ingresos de hasta 3 CBT, ReNaBaP, veteranos o CUD. Lista parcial: Córdoba (13), San Juan (8) y Mendoza (17); faltan 94 partidos de Buenos Aires y departamentos de Santa Fe, San Luis, Salta y La Rioja",
    costo_fiscal_usd_anio="300",
    evidencia_efectividad="Sin evaluación. Costo de la ampliación ~USD 300-400 M/año según prensa [A]",
    fuente_url=AFIP + "LEY_C_027637_2021_06_24 ; https://www.losandes.com.ar/espacio-de-marca/ecogas-informa-sobre-el-nuevo-regimen-de-zona-fria")
inc(id="N15", nombre="Exención del impuesto a los combustibles líquidos en la zona sur", nivel="nacional",
    norma="Ley 23.966 Tít. III art. 7 inc. d (t.o. 1998; mod. Ley 27.209 de 2015)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas|hogares", alcance=prov("58", "42", "62", "26", "78", "94"), extra_deps=[PATAGONES, "50077"],
    intensidad="Exención del impuesto para el consumo en la zona; el gasoil paga un monto fijo diferencial menor (actualizado trimestralmente)",
    costo_fiscal_usd_anio="394",
    evidencia_efectividad="Sin evaluación. Gasto tributario 2026: $541.543 M (0,05% PBI)",
    fuente_url="https://www.boletinoficial.gob.ar/pdf/aviso/primera/340229/20260401 ; " + GT)
inc(id="N16", nombre="Zonas francas", nivel="nacional",
    norma="Ley 24.331 (1994)", vigencia_estado="vigente",
    tipo="aduanero|impositivo", beneficiario="empresas", alcance=("puntos", sorted(set(zf_deps))),
    intensidad="Mercadería fuera del territorio aduanero general: sin derechos de importación ni impuestos nacionales mientras permanece en la zona. 14 operativas y 3 en construcción (CFI 2023). Ver zonas_francas.geojson",
    evidencia_efectividad="[O] Predominan el almacenaje y la logística; el objetivo exportador industrial 'no ha sido concretado' (CFI 2023)",
    fuente_url=AFIP + "LEY_C_024331_1994_05_18 ; https://cfi.org.ar/assets/docs/Zonas_Francas.pdf")
inc(id="N17", nombre="Régimen de Incentivo para Grandes Inversiones (RIGI)", nivel="nacional",
    norma="Ley 27.742 Tít. VII (2024); Decreto 105/2026 (prórroga)", vigencia_estado="vigente", vigencia_hasta="2027-07-08",
    tipo="impositivo|aduanero", beneficiario="empresas", alcance=("pais", []),
    intensidad="Para inversiones mayores a USD 200 M: Ganancias al 25%, amortización acelerada, exención de derechos de importación y exportación, estabilidad fiscal y cambiaria por 30 años. El plazo de adhesión vence el 8/7/2027. Proyectos aprobados (oct. 2026, ~25 por ~USD 60.000 M): Río Negro, Neuquén, San Juan, Catamarca, Salta, Mendoza, Buenos Aires, Santa Fe, Jujuy y La Pampa",
    evidencia_efectividad="Demasiado reciente para evaluar; concentración en minería e hidrocarburos [O]",
    fuente_url=AFIP + "LEY_C_027742_2024_06_27 ; https://www.iprofesional.com/negocios/466279-cuales-son-los-10-proyectos-mas-grandes-del-rigi-y-cuanto-dinero-invertiran")
inc(id="N18", nombre="Régimen de Promoción de la Economía del Conocimiento", nivel="nacional",
    norma="Ley 27.506 (2019), mod. Ley 27.570 (2020)", vigencia_estado="vigente", vigencia_hasta="2029-12-31",
    tipo="contribuciones laborales|impositivo", beneficiario="empresas", alcance=("pais", []),
    intensidad="Bono de hasta 70% de contribuciones patronales (80% por nuevas contrataciones de residentes de 'zonas desfavorables o provincias de menor desarrollo relativo', art. 9 inc. e); reducción de Ganancias del 60%, 40% o 20% según tamaño",
    costo_fiscal_usd_anio="358",
    evidencia_efectividad="Sin evaluación del componente territorial",
    fuente_url=AFIP + "LEY_C_027506_2019_05_22 ; " + GT)
inc(id="N19", nombre="Régimen PyME: impuesto a los débitos y créditos a cuenta de Ganancias", nivel="nacional",
    norma="Ley 27.264 (2016)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=("pais", []),
    intensidad="Cómputo del impuesto al cheque como pago a cuenta de Ganancias (100% micro y pequeñas, 60% medianas manufactureras). El art. 11 prevé un diferencial de 5% a 15% para economías regionales",
    costo_fiscal_usd_anio="766",
    fuente_url=AFIP + "LEY_C_027264_2016_07_13 ; " + GT)
inc(id="N20", nombre="Régimen PyME: bonificación especial de tasa en regiones rezagadas y Plan Belgrano", nivel="nacional",
    norma="Ley 27.264 art. 42 (mod. Ley 24.467 art. 3) (2016)", vigencia_estado="incierto",
    tipo="crédito", beneficiario="empresas", alcance=prov("38", "66", "90", "10", "46", "86", "22", "34", "54", "18"),
    intensidad="incierto: bonificación de tasa de monto reglamentario para provincias del Plan Belgrano y regiones con desempleo mayor o PBG menor a la media",
    fuente_url=AFIP + "LEY_C_027264_2016_07_13")
inc(id="N21", nombre="Régimen PyME: compensación a MiPyMEs de zonas de frontera", nivel="nacional",
    norma="Ley 27.264 art. 10 (2016)", vigencia_estado="incierto",
    tipo="impositivo", beneficiario="empresas", alcance=("pais", []),
    intensidad="incierto: es una facultad del PEN y no se encontró la reglamentación ni las zonas definidas",
    fuente_url=AFIP + "LEY_C_027264_2016_07_13")
inc(id="N22", nombre="Crédito fiscal de IVA por contribuciones patronales según zona geográfica", nivel="nacional",
    norma="Decreto 814/2001 Anexo I (derogado por Ley 27.541 art. 26); Ley 27.541 art. 21 y Anexo I (2019)", vigencia_estado="vigente",
    tipo="contribuciones laborales", beneficiario="empresas", alcance=("departamentos", [c for c in ALL if pts[c] > 0]),
    intensidad="Entre 0 y 8,85 puntos de la nómina computables como crédito de IVA (sobre una contribución de 18% o 20,4%). Máximo en Formosa, Chaco y Santiago del Estero fuera de las capitales; 0 en CABA y el GBA. Ver contribuciones_zona_27541.csv",
    costo_fiscal_usd_anio="656",
    evidencia_efectividad="Sin evaluación causal encontrada. Gasto tributario 2026: $901.934 M (0,09% PBI)",
    fuente_url=AFIP + "LEY_C_027541_2019_12_21 ; https://biblioteca.afip.gob.ar/pdfp/ley_27541_A1.pdf ; " + GT)
inc(id="N23", nombre="Régimen de Promoción de Generación de Empleo en el Norte Grande", nivel="nacional",
    norma="Decreto 191/2021 (prórroga Decreto 899/2021)", vigencia_estado="vencido", vigencia_hasta="2025-06-30",
    tipo="contribuciones laborales", beneficiario="empresas",
    alcance=prov("10", "22", "18", "34", "38", "46", "54", "66", "86", "90"),
    intensidad="Reducción de contribuciones por nuevas altas (abril 2021 a junio 2022): mujeres 80%, 55% y 30%; varones 70%, 45% y 20% en años 1, 2 y 3; mitad a tiempo parcial; solo en ramas productoras de bienes (Anexo I CLAE)",
    costo_fiscal_usd_anio="0.6",
    evidencia_efectividad="Sin evaluación encontrada; gasto tributario 2025: $777 M y 2026: 0. El pedido mencionaba un 'Decreto 191/2023', que no existe: la norma es de 2021",
    fuente_url=AFIP + "DEC_C_000191_2021_03_23 ; " + GT)
inc(id="N24", nombre="Régimen de Incentivo a la Formalización Laboral (RIFL)", nivel="nacional",
    norma="Ley 27.802 Tít. XX (2026); Decreto 315/2026", vigencia_estado="vigente", vigencia_hasta="2027-04-30",
    tipo="contribuciones laborales", beneficiario="empresas", alcance=("pais", []),
    intensidad="Contribuciones de 5% (2% SIPA, FNE y AAFF + 3% INSSJP) durante 48 meses por nuevas altas de personas sin empleo registrado; altas dentro de 1 año desde mayo de 2026. Sin diferencial geográfico",
    fuente_url=AFIP + "LEY_C_027802_2026_02_27")
inc(id="N25", nombre="Régimen de Incentivo para Medianas Inversiones (RIMI)", nivel="nacional",
    norma="Ley 27.802 Tít. XXIII (2026); Decreto 242/2026", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=("pais", []),
    intensidad="Amortización acelerada en Ganancias (bienes muebles en 2 cuotas, obras con vida útil al 60%) para inversiones PyME desde USD 150.000 (micro) realizadas en los primeros 2 años. Sin diferencial geográfico",
    fuente_url=AFIP + "LEY_C_027802_2026_02_27")
inc(id="N26", nombre="ProCreAr (crédito y vivienda)", nivel="nacional",
    norma="Decreto 902/2012; disuelto por Decreto 1018/2024 y Res. MEcon 764/2025", vigencia_estado="derogado", vigencia_hasta="2024-11-15",
    tipo="vivienda|crédito", beneficiario="hogares", alcance=("pais", []),
    intensidad="Créditos subsidiados y desarrollos urbanísticos; los créditos ya otorgados siguen a cargo del Banco Hipotecario. No se verificó prioridad geográfica explícita",
    fuente_url="https://www.ambito.com/economia/oficial-el-gobierno-disolvio-el-programa-procrear-y-habilito-las-hipotecas-divisibles-n6081413")
inc(id="N27", nombre="Programa Casa Propia - Construir Futuro", nivel="nacional",
    norma="Res. MDTyH 16/2021; prórroga Res. 227/2023 (2024-2026)", vigencia_estado="incierto", vigencia_hasta="2026-12-31",
    tipo="vivienda", beneficiario="hogares", alcance=("pais", []),
    intensidad="Construcción de viviendas y créditos; formalmente prorrogado hasta 2026, sin evidencia de ejecución en 2024-2026",
    fuente_url="https://eleconomista.com.ar/actualidad/viviendas-gobierno-extendio-programa-casa-propia-n63215")
inc(id="N28", nombre="Zonas y áreas de frontera: tierras fiscales para radicación de pobladores", nivel="nacional",
    norma="Ley 18.575 (1970) y Decreto-Ley 15.385/44", vigencia_estado="incierto",
    tipo="tierra", beneficiario="hogares|empresas", alcance=("pais", []),
    intensidad="incierto: la norma orienta la adjudicación de tierras fiscales a la radicación de pobladores en zona de frontera; no se verificaron programas activos ni la delimitación vigente",
    fuente_url="")

# ===== PROVINCIALES
inc(id="P_CBA_01", nombre="Córdoba: Promoción Industrial y Desarrollo de Clústeres (PyMEs)", nivel="provincial",
    norma="Ley 10.792 (2021); Decreto 549/2022", vigencia_estado="vigente",
    tipo="impositivo|contribuciones laborales|tarifario", beneficiario="empresas", alcance=prov("14"),
    intensidad="Exención por 10 años del incremento de IIBB, de Sellos e Inmobiliario; subsidio por 5 años por nuevo trabajador y de 25% al 10% del consumo eléctrico incremental; 15 años para clústeres y radicaciones nuevas en parques",
    evidencia_efectividad="Sin evaluación; cupo fiscal 2025 ampliado a $160.000 M [A]",
    fuente_url="https://legislaturacba.gob.ar/wp-content/uploads/2021/12/22-12-2021-PROMOCI%C3%93N-INDUSTRIAL-Y-DESARROLLO-DE-CL%C3%9ASTER-PRODUCTIVOS-DE-C%C3%93RDOBA-LEY-10.792.pdf")
inc(id="P_CBA_02", nombre="Córdoba: beneficios incrementados por radicación en el Norte u Oeste provincial", nivel="provincial",
    norma="Ley 10.792 arts. 26-27 (2021)", vigencia_estado="vigente",
    tipo="impositivo|contribuciones laborales|tarifario", beneficiario="empresas",
    alcance=("departamentos", d("14133", "14126", "14077", "14070", "14028", "14049", "14168", "14175", "14154", "14112")),
    intensidad="Exenciones de IIBB, Sellos e Inmobiliario por 15 años (en lugar de 10); subsidio por empleo por 7 años ($5.000 / $3.500 / $2.500 nominales de 2021) y eléctrico por 7 años",
    fuente_url="https://legislaturacba.gob.ar/wp-content/uploads/2021/12/22-12-2021-PROMOCI%C3%93N-INDUSTRIAL-Y-DESARROLLO-DE-CL%C3%9ASTER-PRODUCTIVOS-DE-C%C3%93RDOBA-LEY-10.792.pdf")
inc(id="P_CBA_03", nombre="Córdoba: exención de IIBB a la industria radicada", nivel="provincial",
    norma="Código Tributario y Ley Impositiva anual de Córdoba (2026)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("14"),
    intensidad="Exención de IIBB para establecimientos industriales radicados en la provincia, salvo ventas a consumidor final [A]",
    fuente_url="https://www.iprofesional.com/impuestos/465606-reforma-tributaria-que-provincias-eximen-agro-y-industria")
inc(id="P_SFE_01", nombre="Santa Fe: Régimen de Promoción Industrial", nivel="provincial",
    norma="Ley 8.478 (1979); Decreto 3856/79; Decreto 1361/22", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("82"),
    intensidad="Exención de impuestos provinciales hasta 10 años; prioridad a PyMEs y a radicación en parques industriales (Dto. 1361/22)",
    fuente_url="https://www.santafe.gob.ar/index.php/web/content/download/3695/21078/file/Descargar%20Documento.doc")
inc(id="P_SFE_02", nombre="Santa Fe: exención de IIBB a la industria con tope de facturación", nivel="provincial",
    norma="Ley Impositiva anual de Santa Fe (2026)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("82"),
    intensidad="Exención para industrias con ingresos de hasta $1.300 M (2026); por encima, 1,5% [A]",
    fuente_url="https://www.iprofesional.com/impuestos/465606-reforma-tributaria-que-provincias-eximen-agro-y-industria")
inc(id="P_SFE_03", nombre="Santa Fe: apoyo provincial al repoblamiento de pueblos ('Bienvenidos a mi Pueblo')", nivel="provincial",
    norma="Convenio provincia, comunas y Fundación Es Vicis (sin ley)", vigencia_estado="incierto",
    tipo="vivienda|tierra", beneficiario="hogares", alcance=("departamentos", d("82105")),
    intensidad="Financiamiento provincial de 20 viviendas en Colonia Belgrano (más de $14 M nominales) en terrenos cedidos por la comuna, a cambio de radicación y trabajo; otras comunas del sur santafesino en convocatoria [A]",
    evidencia_efectividad="[A] 20.000 familias se postularon para 20 viviendas; no hay evaluación de permanencia",
    fuente_url="https://www.santafe.gob.ar/noticias/noticia/258274/")
inc(id="P_ER_01", nombre="Entre Ríos: Promoción y Desarrollo Industrial", nivel="provincial",
    norma="Ley 11.071 y su reglamentación", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("30"),
    intensidad="Exención de IIBB (actividad industrial del proyecto, sin ventas a consumidor final), Automotor, Sellos e Inmobiliario por un mínimo de 10 años, prorrogable 5 [A]",
    fuente_url="https://www.elheraldo.com.ar/noticias/interes-general/aseguran-que-la-nueva-ley-de-promocion-industrial-tendra-importantes-beneficios-fiscales")
inc(id="P_ER_02", nombre="Entre Ríos: exención de IIBB a la industria hasta un tope", nivel="provincial",
    norma="Ley Impositiva de Entre Ríos (2026)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("30"),
    intensidad="Exenta hasta $1.430 M de facturación anual; luego 1% y 1,5% [A]",
    fuente_url="https://www.iprofesional.com/impuestos/465606-reforma-tributaria-que-provincias-eximen-agro-y-industria")
inc(id="P_ER_03", nombre="Entre Ríos: Régimen de emprendedurismo joven y arraigo rural", nivel="provincial",
    norma="Ley 10.394 (2015)", vigencia_estado="incierto",
    tipo="crédito", beneficiario="hogares", alcance=prov("30"),
    intensidad="incierto: promoción de emprendimientos de jóvenes de 18 a 40 años con objetivo de arraigo rural; no se verificaron montos ni ejecución",
    fuente_url="")
inc(id="P_BA_01", nombre="Buenos Aires: Régimen de Promoción Industrial", nivel="provincial",
    norma="Ley 13.656 (2007); Decreto 523/08 (orden de prioridad regional)", vigencia_estado="incierto",
    tipo="impositivo", beneficiario="empresas", alcance=prov("06"),
    intensidad="Exención de impuestos provinciales con prioridad regional (Anexo II Dto. 523/08). Una copia oficial la anota 'derogada por Ley 15.510'; no se pudo confirmar",
    fuente_url="https://normas.gba.gob.ar/documentos/B3z1kKhj.html")
inc(id="P_NQN_01", nombre="Neuquén: Ley de Promoción Industrial", nivel="provincial",
    norma="Ley 378 y modificatorias", vigencia_estado="vigente",
    tipo="impositivo|tierra", beneficiario="empresas", alcance=prov("58"),
    intensidad="Exención de impuestos provinciales; venta de tierra pública a precio preferencial; infraestructura",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/neuquen-normativa-e-incentivos.pdf")
inc(id="P_NQN_02", nombre="Neuquén: Invierta en Neuquén", nivel="provincial",
    norma="Ley 3502 (2025)", vigencia_estado="vigente", vigencia_hasta="2027",
    tipo="impositivo", beneficiario="empresas", alcance=prov("58"),
    intensidad="Exención de IIBB, Inmobiliario y Sellos hasta 10 años y estabilidad fiscal por 10 años; adhesión en 2 años desde la vigencia (+1 de prórroga) [A]",
    fuente_url="https://www.noticiasnqn.com.ar/noticias/2025/04/25/312558-neuquen-aprobo-la-ley-invierta-en-neuquen-para-atraer-inversiones-y-generar-empleo-genuino")
inc(id="P_RN_01", nombre="Río Negro: Promoción Económica e Industrial", nivel="provincial",
    norma="Ley 5766 (2025)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("62"),
    intensidad="Exención de IIBB de hasta 100% por 3 años (10 a 15 en parques); 50% de Sellos; Inmobiliario hasta 10 años; bono fiscal de hasta 20% de la inversión (40% si la empresa es liderada por mujeres)",
    fuente_url="https://rionegro.gov.ar/articulo/54497/mas-inversion-y-empleo-conoce-los-beneficios-para-invertir-en-rio-negro")
inc(id="P_RN_02", nombre="Río Negro: Parques industriales y logísticos; régimen del Parque Industrial de Viedma", nivel="provincial",
    norma="Ley 5767 (2025); Ley 5769 (2024) y Decreto 528/2025", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=("parques", d("62007")),
    intensidad="Beneficios ampliados para radicación en parques (hasta 15 años); régimen de competitividad propio para Viedma",
    fuente_url="https://rionegro.gov.ar/articulo/54497/mas-inversion-y-empleo-conoce-los-beneficios-para-invertir-en-rio-negro")
inc(id="P_RN_03", nombre="Río Negro: adjudicación en venta de tierras fiscales", nivel="provincial",
    norma="Ley 5705 (2023), mod. Ley 5739; Decreto 423/2025; Ley 5596 (2022, plantas urbanas de comisiones de fomento)", vigencia_estado="vigente",
    tipo="tierra", beneficiario="hogares|empresas", alcance=prov("62"),
    intensidad="Adjudicación individual en venta de parcelas fiscales, con requisitos de ocupación y explotación; no es un incentivo de radicación explícito",
    fuente_url="https://servicios-publico.jusrionegro.gov.ar/adminweb/web/archivos/7589c1fa-ad6a-482e-a638-a7d3718d4466.pdf")
inc(id="P_CHU_01", nombre="Chubut: Invierta en Chubut", nivel="provincial",
    norma="Ley IX N° 80", vigencia_estado="vigente",
    tipo="impositivo|tarifario|crédito", beneficiario="empresas", alcance=prov("26"),
    intensidad="Exención de IIBB por 10 años y de Sellos por 5 años; subsidio de hasta 25% al consumo de gas por 5 años y de hasta 15% al eléctrico; bonificación de tasa de hasta 40%",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/chubut-incentivos.pdf")
inc(id="P_CHU_02", nombre="Chubut: Régimen de estímulo para el desarrollo de las actividades económicas", nivel="provincial",
    norma="Ley VII N° 4", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("26"),
    intensidad="Reducción o exención de tributos provinciales hasta 20 años (adhesión) o 25 años (otros actos), prorrogable 10; creación de parques y zonas industriales",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/chubut-normativa-e-incentivos.pdf")
inc(id="P_CHU_03", nombre="Chubut: exención de IIBB y Sellos a la construcción de viviendas", nivel="provincial",
    norma="Ley XXIV N° 124 (2026)", vigencia_estado="incierto", vigencia_hasta="2027-06-30",
    tipo="impositivo|vivienda", beneficiario="empresas|hogares", alcance=prov("26"),
    intensidad="Exención total de IIBB y Sellos por 3 años para obras residenciales iniciadas tras la vigencia; adhesión hasta el 30/6/2027 [A, sin texto oficial]",
    fuente_url="https://hoydia.com.ar/hoypais/chubut-eliminara-ingresos-brutos-para-construir-viviendas/")
inc(id="P_SCZ_01", nombre="Santa Cruz: Sistema Provincial de Promoción y Desarrollo Industrial", nivel="provincial",
    norma="Ley 3092 (2009), ampliada por Ley 4011 (2026)", vigencia_estado="vigente",
    tipo="impositivo|crédito", beneficiario="empresas", alcance=prov("78"),
    intensidad="Exención de tributos provinciales hasta 10 años (15 en actividades prioritarias); reintegro de hasta 40% de la inversión (texto de 2009). La Ley 4011 agrega sectores, financiamiento y estabilidad de 30 años (texto no verificado)",
    fuente_url="https://www.marval.com/Publicacion/nueva-ley-de-promocion-industrial-en-la-provincia-de-santa-cruz-8434")
inc(id="P_LPA_01", nombre="La Pampa: Promoción Económica", nivel="provincial",
    norma="Ley 2870; Decreto 266/2016", vigencia_estado="vigente",
    tipo="crédito|impositivo", beneficiario="empresas", alcance=prov("42"),
    intensidad="Préstamos de fomento, exenciones tributarias, venta de inmuebles del Estado y subsidios por tiempo determinado (montos no especificados)",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/la-pampa-normativa-e-incentivos.pdf")
inc(id="P_MZA_01", nombre="Mendoza: Promoción de Inversiones para el Desarrollo Sostenible en zonas turísticas", nivel="provincial",
    norma="Ley 9.584 (2024)", vigencia_estado="vigente",
    tipo="impositivo|crédito", beneficiario="empresas",
    alcance=("departamentos", d("50049", "50105", "50077", "50091", "50056")),
    intensidad="Exención impositiva, estabilidad fiscal y aportes reembolsables o no reembolsables (fondo de hasta 1% de IIBB, ~USD 11 M en 2025) para Uspallata, Precordillera norte, sur del Macizo de San Rafael, Huayquerías y La Payunia (departamentos aproximados)",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/mendoza-incentivos.pdf")
inc(id="P_MZA_02", nombre="Mendoza: IIBB reducido para la industria y exenciones en parques industriales", nivel="provincial",
    norma="Ley Impositiva de Mendoza (2026)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("50"),
    intensidad="Alícuota industrial de 0,5%, 1% o 1,5% según condiciones; exenciones específicas en parques [A]",
    fuente_url="https://www.iprofesional.com/impuestos/465606-reforma-tributaria-que-provincias-eximen-agro-y-industria")
inc(id="P_SJ_01", nombre="San Juan: Certificado de Mano de Obra Formal e Industrial (CEMOFI)", nivel="provincial",
    norma="incierto (programa provincial)", vigencia_estado="incierto",
    tipo="contribuciones laborales", beneficiario="empresas", alcance=prov("70"),
    intensidad="Bono de crédito fiscal de $3.000.000 por año por cada nuevo empleo industrial registrado en 2025 [A]; la industria paga IIBB del 1,5% sin exención general",
    fuente_url="https://www.iprofesional.com/impuestos/465606-reforma-tributaria-que-provincias-eximen-agro-y-industria")
inc(id="P_SL_01", nombre="San Luis: nuevo régimen de promoción industrial (proyecto 2026)", nivel="provincial",
    norma="Proyecto de ley 2026 (sin sanción confirmada)", vigencia_estado="incierto",
    tipo="impositivo|tierra", beneficiario="empresas", alcance=prov("74"),
    intensidad="Bono fiscal de hasta 100% para inversores y acceso a terrenos fiscales; reintegros de IVA compras en comercio exterior [A]",
    fuente_url="https://www.sitioandino.com.ar/economia/san-luis-y-otra-promocion-industrial-que-ofrece-inversores-n5634304")
inc(id="P_SL_02", nombre="San Luis: Régimen de Promoción a la Inversión Turística", nivel="provincial",
    norma="Ley VIII-1087-2022; Decreto 3208-SGG-ST-2023", vigencia_estado="vigente",
    tipo="impositivo|tierra", beneficiario="empresas", alcance=prov("74"),
    intensidad="Hasta 15 años (+2): exención de hasta 100% de IIBB, Inmobiliario, Automotores y Sellos; donación de inmuebles con cargo de invertir 30% en infraestructura",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/san-luis-normativa-e-incentivos.pdf")
inc(id="P_CAT_01", nombre="Catamarca: Promoción Industrial", nivel="provincial",
    norma="Ley 2968 (mod. Ley 468 y Ley 5760 de 2022); Ley 5238 (promoción económica)", vigencia_estado="incierto",
    tipo="impositivo", beneficiario="empresas", alcance=prov("10"),
    intensidad="incierto: exenciones de IIBB (sin ventas a consumidor final) y Sellos; la industria paga IIBB de 1,5% en 2026, con exención general anunciada desde 2027 [A]",
    fuente_url="https://digesto.catamarca.gob.ar/digesto/crearpdf/ley/468 ; https://www.iprofesional.com/impuestos/465606-reforma-tributaria-que-provincias-eximen-agro-y-industria")
inc(id="P_CAT_02", nombre="Catamarca: incentivos fiscales al turismo", nivel="provincial",
    norma="Ley 5.267 art. 3 y arts. 13 y ss.; Decreto 1846/2011", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("10"),
    intensidad="Exención de IIBB por ventas hasta 10 años para emprendimientos turísticos nuevos; Sellos en la etapa de inversión",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/catamarca-normativa-e-incentivos.pdf")
inc(id="P_LR_01", nombre="La Rioja: Régimen de Promoción de Inversiones en Actividades Productivas", nivel="provincial",
    norma="Ley 8.300 (2009)", vigencia_estado="vigente",
    tipo="impositivo|crédito|tierra", beneficiario="empresas", alcance=prov("46"),
    intensidad="Devolución de hasta 30% de la inversión en equipos e inmuebles; reintegro de hasta 50% de la infraestructura; exención de tributos provinciales hasta 15 años; subsidio de hasta 50% de la tasa; compra o comodato de bienes del Estado",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/la-rioja-normativa-e-incentivos.pdf")
inc(id="P_FOR_01", nombre="Formosa: exención de IIBB y Sellos a call centers y centros de datos", nivel="provincial",
    norma="Ley 1608", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("34"),
    intensidad="100% de exención los primeros 4 años, decreciente hasta 20% en el año 8",
    fuente_url="https://m.formosa.gob.ar/modulos/upsti/templates/media/ley1608.pdf")
inc(id="P_FOR_02", nombre="Formosa: exención de IIBB a la producción de bienes (industria)", nivel="provincial",
    norma="Código Fiscal (mod. Ley 1669, 2018)", vigencia_estado="incierto",
    tipo="impositivo", beneficiario="empresas", alcance=prov("34"),
    intensidad="incierto: exención para la industria manufacturera según reglamentación, sin ventas a consumidor final ni construcción [A]",
    fuente_url="https://blogdelcontador.com.ar/news-13561-ley-1669-formosa-modificaciones-al-codigo-fiscal-y-ley-impositiva-2018")
inc(id="P_CHA_01", nombre="Chaco: Régimen de Radicación y Promoción Industrial", nivel="provincial",
    norma="Ley 937-I y Ley 1861 (extensión a turismo)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("22"),
    intensidad="Cuatro regímenes (general, sectorial, de fomento y especial). El de fomento se orienta a micro y pequeñas empresas con impacto en 'empleo y arraigo poblacional'; porcentajes no verificados",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/chaco-incentivos.pdf")
inc(id="P_COR_01", nombre="Corrientes: Régimen de Promoción de Inversiones", nivel="provincial",
    norma="Ley 5.470", vigencia_estado="vigente",
    tipo="impositivo|tierra|tarifario", beneficiario="empresas", alcance=prov("18"),
    intensidad="Estabilidad fiscal por 10 años (+5); exención de IIBB, Sellos y tasas de registro; compra de inmuebles fiscales a 10 años; tarifas eléctricas de fomento. Los municipios adheridos pueden eximir Inmobiliario",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/corrientes-incentivos.pdf")
inc(id="P_MIS_01", nombre="Misiones: alícuota reducida de IIBB para la industria", nivel="provincial",
    norma="Régimen de alícuota reducida (prórroga hasta 30/04/2026)", vigencia_estado="incierto", vigencia_hasta="2026-04-30",
    tipo="impositivo", beneficiario="empresas", alcance=prov("54"),
    intensidad="Alícuota reducida para industrias en Convenio Multilateral; no se verificó una prórroga posterior",
    fuente_url="https://economis.com.ar/misiones-prorroga-la-alicuota-reducida-de-ingresos-brutos-para-la-industria-hasta-abril-de-2026/")
inc(id="P_SAL_01", nombre="Salta: Promoción y Estabilidad Fiscal para la Generación de Empleo", nivel="provincial",
    norma="Ley 8.086 (2018)", vigencia_estado="vigente",
    tipo="impositivo|tierra", beneficiario="empresas", alcance=prov("66"),
    intensidad="Exención de tributos provinciales hasta 5 años (4 en ampliaciones), +4 años en zonas declaradas prioritarias; certificados de crédito fiscal de hasta 40% de la inversión; comodato de bienes fiscales hasta 20 años",
    fuente_url="https://www.consejosalta.org.ar/wp-content/uploads/LEY-8086.pdf")
inc(id="P_JUJ_01", nombre="Jujuy: Promoción de Inversiones y Empleo", nivel="provincial",
    norma="Ley 5.922 (2016), mod. Ley 6.336", vigencia_estado="vigente",
    tipo="impositivo|contribuciones laborales|crédito", beneficiario="empresas", alcance=prov("38"),
    intensidad="Hasta 10 años: exención o reducción de IIBB y Sellos; reintegro de hasta 30% de la inversión; reintegros sobre Ganancias de 30% a 60% (50% a 80% en zonas francas); prioridad a zonas de menor desarrollo y zonas francas",
    fuente_url="https://www.consejosalta.org.ar/wp-content/uploads/LEY-J-5922.pdf")
inc(id="P_SDE_01", nombre="Santiago del Estero: Sistema Provincial de Promoción y Desarrollo Industrial", nivel="provincial",
    norma="Ley 6.750; Decretos 1333/05 y 1888/07", vigencia_estado="vigente",
    tipo="impositivo|crédito", beneficiario="empresas", alcance=prov("86"),
    intensidad="Devolución de hasta 30% de la inversión; reintegro de hasta 50% de la infraestructura; exención de IIBB, Inmobiliario y Sellos hasta 10 años; subsidio de hasta 50% de la tasa",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/santiago-del-estero-normativa-e-incentivos.pdf")
inc(id="P_SDE_02", nombre="Santiago del Estero: departamentos de interés turístico de la Ley 6.750", nivel="provincial",
    norma="Ley 6.750", vigencia_estado="vigente",
    tipo="impositivo|crédito", beneficiario="empresas", alcance=("departamentos", d("86147", "86084", "86126", "86063", "86154", "86056")),
    intensidad="Préstamos de fomento a la inversión turística en Río Hondo, Guasayán, Ojo de Agua, Choya, Rivadavia y Copo",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/santiago-del-estero-normativa-e-incentivos.pdf")
inc(id="P_TUC_01", nombre="Tucumán: alícuota diferencial de IIBB para turismo y reducción por empleo industrial", nivel="provincial",
    norma="Decreto 1998/3 (ME) 2023; Ley 9.767 (Sellos)", vigencia_estado="vigente",
    tipo="impositivo", beneficiario="empresas", alcance=prov("90"),
    intensidad="IIBB de 1,5% para prestadores turísticos registrados; exención de Sellos en concesiones turísticas desde USD 150.000; reducción progresiva de IIBB a la industria según empleo [A]",
    fuente_url="https://www.argentina.gob.ar/sites/default/files/tucuman-incentivos.pdf")
inc(id="P_RIGI_ADH", nombre="Adhesiones provinciales al RIGI (estabilidad y límites a tributos locales)", nivel="provincial",
    norma="Leyes provinciales de adhesión a la Ley 27.742 (2024-2026)", vigencia_estado="incierto",
    tipo="impositivo", beneficiario="empresas",
    alcance=prov("10", "14", "18", "22", "26", "30", "38", "50", "62", "66", "70", "74", "90"),
    intensidad="Las jurisdicciones adheridas no crean tributos locales nuevos sobre los proyectos RIGI; algunas suman exenciones propias. La lista de adheridas varía según la fuente y la fecha (5 a 13 provincias)",
    fuente_url="https://www.marval.com/publicacion/adhesion-de-provincias-al-rigi-alcance-y-estatus-actual-17200")

# ---------------------------------------------------------------- escribir
fields = ["id", "nombre", "nivel", "norma", "vigencia_estado", "vigencia_hasta", "tipo", "beneficiario",
          "alcance_tipo", "alcance_codigos", "intensidad", "costo_fiscal_usd_anio", "evidencia_efectividad",
          "fuente_url", "verificado_fecha"]
rows, rel = [], []
for k in I:
    at, codes = k["alcance"]
    codes = list(codes) + k.get("extra_deps", [])
    if at == "provincias" and k.get("extra_deps"):
        # provincias + departamentos sueltos: se codifican como departamentos para no perder Patagones/Malargüe
        at = "departamentos"
        codes = [c for p in k["alcance"][1] for c in BYPROV[p]] + k["extra_deps"]
    r = {f: k.get(f, "") for f in fields}
    r["alcance_tipo"] = at
    r["alcance_codigos"] = "|".join(codes)
    rows.append(r)
    if at == "provincias":
        exp = [c for p in codes for c in BYPROV[p]]
    elif at in ("departamentos", "puntos", "parques"):
        exp = codes
    else:
        exp = []  # alcance país: no se expande (constante en todo el territorio)
    for c in sorted(set(exp)):
        assert c in NAME, (k["id"], c)
        rel.append({"cod_dep": c, "incentivo_id": k["id"]})

with open(f"{OUT}/incentivos.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(rows)
with open(f"{OUT}/incentivos_departamento.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["cod_dep", "incentivo_id"]); w.writeheader()
    w.writerows(sorted(rel, key=lambda r: (r["cod_dep"], r["incentivo_id"])))
print(len(rows), "incentivos;", len(rel), "relaciones;", len(feats), "zonas francas")
print("ZF deptos:", [(f["properties"]["nombre"], f["properties"]["cod_dep"], f["properties"]["departamento"]) for f in feats])
