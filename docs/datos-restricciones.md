# Datos de restricciones y factores ambientales/geológicos

Capas que hoy figuran como "sin datos" en la app, descargadas el **21/10/2026** y preparadas para integrarse en `pipeline/build.py`. `build.py` **no fue modificado**.

- **Crudos:** `data/raw/restricciones/` (en `.gitignore`).
- **Limpios:** `data/interim/restricciones/`, todo en EPSG:4326.
  - Los vectoriales tienen geometrías reparadas con `make_valid` y en 2D.
  - Los rasters `*_30s.tif` ya están en la grilla común: 30″, lon −74..−53, lat −56..−21, 2520 × 4200 px, el mismo `TRANSFORM` que `build.py`.
- **Script de limpieza:** se ejecutó desde el scratchpad de la sesión y no quedó en el repo. Si hace falta reproducir la limpieza, conviene moverlo a `pipeline/restricciones.py`. Los pasos están descritos en cada capa.

## Resumen

| # | Capa | Archivo limpio | Fuente | Uso sugerido |
|---|---|---|---|---|
| 1 | Suelos INTA: **índice de productividad** (no hay capacidad de uso) | `suelos_inta.gpkg`, `suelos_ip_30s.tif` | INTA, vía WFS del Ministerio de Ambiente | Factor |
| 2 | OTBN, Ley 26.331 | `otbn.gpkg`, `otbn_30s.tif` | Ministerio de Ambiente, OTBN Nacional 2023 | I–II excluyen; III penaliza |
| 3 | Inventario Nacional de Glaciares | `glaciares.gpkg` (2 capas), `glaciares_30s.tif` | IANIGLA / Ministerio de Ambiente | Restricción con buffer de 1 km |
| 4 | Peligro volcánico: ranking de riesgo relativo | `volcanes.gpkg` (2 capas) | SEGEMAR-OAVV 2024, más Smithsonian GVP | Restricción por radio según nivel |
| 5 | Fallas activas cuaternarias | `fallas_cuaternarias.gpkg` (3 capas) | SEGEMAR (SIGAM) 1:250.000, más GEM GAF-DB | Restricción por buffer y factor |
| 6 | Susceptibilidad a deslizamientos | `deslizamientos_nasa_30s.tif` | NASA GSFC (Stanley & Kirschbaum 2017, versión 2023) | Factor; clase 5 puede restringir |
| 7 | Sitios Ramsar | `ramsar.gpkg` | Ministerio de Ambiente / APN | Penaliza (ya parcialmente en `area_protegida`) |

Servicios WFS que funcionaron:

- **Ministerio de Ambiente:** `https://geo.ambiente.gob.ar/geoserver/ows`. Capabilities en `data/raw/restricciones/amb_caps.xml`.
- **SEGEMAR SIGAM:** `https://sigam.segemar.gob.ar/geoserver217/ows`. Capabilities en `segemar_caps.xml`. Ojo: es `.gob.ar`; el dominio viejo `sigam.segemar.gov.ar` corta la conexión.

Consultas usadas: `?service=WFS&version=2.0.0&request=GetFeature&typeNames=<capa>&outputFormat=application/json&srsName=EPSG:4326`.

No accesibles desde este entorno: `geointa.inta.gob.ar` y `visor.geointa.inta.gob.ar` (TLS cortado o 502 del gateway), `www.glaciaresargentinos.gob.ar` y `www.segemar.gov.ar` (connection reset).

---

## 1. Suelos INTA: índice de productividad

- **Fuente:** INTA, *Atlas de Suelos de la República Argentina* (Instituto de Suelos, CIRN; capa "Suelos 1:500.000 anidada"), republicado por el Ministerio de Ambiente.
- **Capa WFS:** `suelo:suelos_1_500_arg_inta_anida_4326`.
- **URL exacta:** `https://geo.ambiente.gob.ar/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=suelo:suelos_1_500_arg_inta_anida_4326&outputFormat=application/json&srsName=EPSG:4326`.
- **Escala:** 1:500.000. En Neuquén, Mendoza, San Juan, La Rioja, Chubut y Santa Cruz es 1:1.000.000. Nivel de reconocimiento, con unidades taxonómicas a nivel de subgrupo.
- **Fecha:** base de mediados de los 1990 (Atlas INTA 1990/1995), digitalización posterior. El servicio no publica fecha de actualización.
- **Licencia:** la declarada por el servicio de Ambiente (AccessConstraints): "Creative Commons. Esta licencia es una licencia libre". Hay que citar a INTA.
- **Variable usada:** `ind_prod`, el **índice de productividad** (IP) de la unidad cartográfica, de 0 a 100 (Riquier, Bramao y Cornet, adaptado por INTA). La **capacidad de uso (clases I–VIII) no está** en esta capa ni en ningún servicio accesible: GeoINTA, que la publica por provincia, no respondió. El IP es el sustituto. El campo `limit_ppal` (limitante principal) complementa la lectura.
- **Conteos:**
  - 7.783 polígonos, en las 23 provincias.
  - Dentro de Argentina, el 98,6 % de los píxeles tiene IP. El resto es agua (1,2 %) o no tiene dato (0,2 %).
  - IP = 0 en el 2,2 % de los píxeles.
  - Percentiles 10/25/50/75/90 del IP: 6 / 15 / 28 / 51 / 72.

**Campos de `suelos_inta.gpkg`** (capa `suelos_inta`):

| Campo | Descripción |
|---|---|
| `provincia` | Provincia (mayúsculas, sin acentos) |
| `simbc` | Símbolo de la unidad cartográfica |
| `tipo_uc` | Tipo de unidad: Consociación, Asociación, Complejo, Agua, Roca, Salinas, Médanos… |
| `ind_prod` | **Índice de productividad 0–100** (int16) |
| `limit_ppal`, `limit_secu`, `limit_terc` | Limitantes principal, secundaria y terciaria (Climática, Drenaje deficiente, Alcalinidad, Erosión hídrica/eólica, Pendientes, "No apto agricultura"…) |
| `orden_sue1`, `sgrup_sue1`, `porc_sue1` | Orden, subgrupo y % del suelo dominante |
| `drenaje_s1`, `profund_s1`, `alcalin_s1`, `erhidr_s1`, `ereoli_s1`, `anegab_s1` | Atributos del suelo dominante |
| `leyenda` | Orden de suelo para la leyenda |
| `no_agricola` | `True` si `ind_prod == 0` (roca, agua, salinas, médanos o no apto) |

**`suelos_ip_30s.tif`** (uint8): IP de 0 a 100. 254 = agua (lagunas, ríos, diques). 255 = sin dato. Se rasterizó por el centro de celda.

**Limitaciones:**

- El IP es de la **unidad cartográfica**, no de cada suelo. En complejos y asociaciones mezcla componentes.
- El IP está pensado para uso agropecuario de secano. Mide aptitud agrícola, no aptitud urbana.
- La escala es heterogénea (1:500k o 1:1M). Los límites provinciales muestran saltos.
- `provincia` está en mayúsculas y sin tildes. `limit_ppal` trae errores de tipeo de origen ("No apto agrricultura").

**Uso en la app:**

- Como **factor de costo de oportunidad**, no como restricción. Urbanizar suelo de alta productividad consume un recurso escaso.
- Penalizar las celdas con IP medio ≥ 65, que es aproximadamente el cuartil superior y corresponde a la Pampa Húmeda (clases I–II).
- Las celdas con IP ≤ 10 no se penalizan por este criterio, aunque suelen tener otras limitantes.
- Agregación H3 sugerida: media del IP excluyendo 254/255, más la fracción de píxeles con IP ≥ 65.

---

## 2. OTBN: Ordenamiento Territorial de Bosques Nativos (Ley 26.331)

- **Fuente:** Ministerio de Ambiente de la Nación, Dirección Nacional de Bosques, *OTBN a nivel nacional*. Consolida los OTBN aprobados por ley en cada provincia.
- **Capa WFS:** `bosques:otbn_nacional`.
- **URL exacta:** `https://geo.ambiente.gob.ar/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=bosques:otbn_nacional&outputFormat=application/json&srsName=EPSG:4326`.
- **Descarga alternativa:** según el metadato, `https://geo.ambiente.gob.ar/documentos/sinia/bosque_OTBN/OTBN_Nacional_2023.rar`. No se usó.
- **Fecha:** versión 2023. Cada provincia tiene la fecha de su norma, de 2008 (Salta) a 2022 (Santa Fe, Santa Cruz y Tierra del Fuego).
- **Escala:** heterogénea, la de cada OTBN provincial (en general 1:250.000 a 1:100.000).
- **Licencia:** CC (licencia libre), según el servicio de Ambiente. Hay que citar al Ministerio de Ambiente y a las autoridades provinciales.
- **Procesamiento:**
  - El GeoJSON crudo pesa 1,35 GB en una sola línea. Se partió por feature (`data/raw/restricciones/otbn_split/`) y se procesó de a uno.
  - Las geometrías del gpkg se simplificaron parte por parte con tolerancia de 0,0001° (unos 10 m), mucho menor que la celda de 30″ (unos 900 m), y se repararon con `make_valid`.
  - Algunos polígonos tienen más de 100.000 huecos. En ellos se rellenaron los huecos menores a 2·10⁻⁵ grados² (unos 0,2 km², subpíxel): sin eso, `make_valid` tardaba decenas de minutos por polígono.
  - Por ese paso, 3 de los 66 multipolígonos quedan con partes que se tocan o solapan (`is_valid = False`). Si se van a hacer operaciones de overlay, aplicar `make_valid` antes.
  - **El raster `otbn_30s.tif` se generó a partir de las geometrías originales**, sin simplificar ni rellenar.
- **Conteos:**
  - 66 multipolígonos: una fila por provincia y categoría.
  - 23 provincias. CABA no tiene OTBN.
  - Córdoba y Santa Fe no tienen categoría III.
  - Santa Cruz solo tiene I y II.
  - Superficie por categoría, calculada sobre `otbn_30s.tif`: I = 112 mil km², II = 323 mil km², III = 103 mil km². El total es de unos 539 mil km² (53,9 Mha), coherente con las ~53,6 Mha que informa la Nación.

**Campos de `otbn.gpkg`** (capa `otbn`):

| Campo | Descripción |
|---|---|
| `provincia` | Provincia |
| `categoria` | `I`, `II` o `III` |
| `cat_num` | 1, 2 o 3 |
| `color` | rojo (I: muy alto valor de conservación, no se transforma), amarillo (II: mediano valor, uso sostenible, sin desmonte), verde (III: bajo valor, puede transformarse parcial o totalmente con autorización) |
| `fecha_norma` | Fecha de la ley u ordenamiento provincial |
| `autoridad` | Autoridad local de aplicación |

**`otbn_30s.tif`** (uint8):

- Valores: 1 = I, 2 = II, 3 = III, 0 = sin OTBN.
- Se tomó el centro de la celda.
- En solapes se impone la categoría más restrictiva: I > II > III.

**Limitaciones:**

- Las metodologías provinciales son heterogéneas. Algunas provincias zonifican todo el bosque potencial y otras solo los remanentes.
- Las actualizaciones provinciales posteriores a 2023 no están.
- La categoría III **no** implica que el bosque ya fue desmontado.
- La ley exige la evaluación de impacto ambiental (EIA) y una audiencia pública también para la categoría III.

**Uso en la app:**

- Categorías **I y II: restricción.** Excluyen la celda si la fracción de píxeles en I+II es ≥ 50 %, o con cualquier fracción en un modo estricto.
- Categoría **III: factor de penalización** proporcional a la fracción de la celda.
- Agregación H3: fracción de píxeles con `otbn_30s` en {1, 2} y fracción con valor 3.

---

## 3. Inventario Nacional de Glaciares (Ley 26.639)

- **Fuente:** IANIGLA-CONICET y Ministerio de Ambiente, *Inventario Nacional de Glaciares*, nivel 1.
- **Capas WFS:**
  - `dgarh:ing_sin_ias`: ING continental, sin las islas del Atlántico Sur. Inventario completo publicado en 2018, con imágenes de 2004 a 2016.
  - `dgarh:glaciares_andes_deserticos`: *Actualización Andes Desérticos 2024*, con imágenes Sentinel-2 de 2019 a 2021, en Jujuy, Salta, Catamarca, Tucumán, La Rioja y San Juan.
- **URLs exactas:** `https://geo.ambiente.gob.ar/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=dgarh:ing_sin_ias&outputFormat=application/json&srsName=EPSG:4326`. Para la actualización, la misma URL con `typeNames=dgarh:glaciares_andes_deserticos`.
- **Escala:** mapeo sobre imágenes de 2,5 a 10 m (SPOT, ALOS, CBERS, Sentinel-2). La superficie mínima es de 0,01 km² (1 ha).
- **Licencia:** CC (licencia libre), según el servicio de Ambiente. Hay que citar a IANIGLA y al ING.
- **Conteos:**
  - `ing_continental`: 18.062 polígonos, 5.767 km². Se descartó 1 geometría vacía. Por tipo:
    - manchones de nieve / glaciaretes: 5.994;
    - glaciares de escombros activos: 5.609;
    - glaciares descubiertos: 3.017;
    - glaciares de escombros inactivos: 2.468;
    - glaciares cubiertos: 581;
    - glaciares cubiertos con glaciar de escombros: 392.
  - `andes_deserticos_2024`: 3.380 polígonos, 250 km².
- **Grilla:** 35.317 celdas de 30″ tocadas por algún polígono dentro de Argentina.

**Campos** (las dos capas de `glaciares.gpkg`):

| Campo | Descripción |
|---|---|
| `provincia`, `cuenca`, `subcuenca`, `codigo_cue` | Ubicación hidrográfica. Se corrigió el mojibake de origen ("NeuquÃƒÂ©n" → "Neuquén") |
| `id_local` | Código ING (G + lon + O + lat + S) |
| `id_glims` | Id GLIMS (solo en `ing_continental`) |
| `tipo_geofo` | GD descubierto, GC cubierto, GCGE cubierto con glaciar de escombros, GEA/GEI glaciar de escombros activo/inactivo, GE glaciar de escombros (2024), MN manchón de nieve/glaciarete, ND no determinado |
| `tipo_desc` | Descripción de `tipo_geofo` |
| `clas_prima` | Clasificación primaria GLIMS (5 valle, 6 montaña, 7 glaciarete, 9 glaciar de escombros…) |
| `area_km2` | Superficie según el ING |
| `h_max_tota`, `h_media_to`, `h_min_tota` | Altitudes en m (vacías en gran parte de la actualización 2024) |
| `img_ba_f`, `img_ba_s` | Fecha y sensor de la imagen base |
| `fuente` | Inventario de origen |

**`glaciares_30s.tif`** (uint8): 1 si la celda toca algún polígono de cualquiera de las dos capas (`all_touched`).

**Limitaciones:**

- El **ambiente periglacial** protegido por la ley **no está mapeado como polígono**. El ING solo incluye las geoformas con hielo; los glaciares de escombros son su proxy.
- En Andes Desérticos conviven dos fechas. La actualización 2024 no reemplaza los polígonos de 2018 uno por uno. Para restricciones, usar la **unión** de ambas capas, que es lo conservador.
- No se incluyen las islas del Atlántico Sur ni la Antártida.

**Uso en la app:**

- **Restricción.** Se excluye cualquier glaciar o glaciar de escombros con un **buffer de 1 km**.
- Para H3: excluir la celda si el polígono más el buffer cubre más del 10 %. Una alternativa es aplicar `distance ≤ 1 km` desde el centroide en ESRI:102033.
- En la práctica coincide casi siempre con la restricción de altitud y pendiente ya existente. Su valor es legal y comunicacional.

---

## 4. Peligro volcánico: ranking de riesgo relativo (SEGEMAR-OAVV)

- **Fuente principal:** SEGEMAR, Observatorio Argentino de Vigilancia Volcánica. Elissondo, M. y Farías, C. (2024), *Riesgo Volcánico Relativo en Territorio Argentino*, Serie Contribuciones Técnicas Peligrosidad Geológica n.º 28, IGRM-SEGEMAR.
  - Repositorio: `https://repositorio.segemar.gov.ar/handle/308849217/4417`.
  - Metodología: NVEWS del USGS (Ewert et al. 2005, 2018).
- **Capa WFS:** `sigam:e2.5M.VolcanesRiesgoRelativo`.
- **URL exacta:** `https://sigam.segemar.gob.ar/geoserver217/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=sigam:e2.5M.VolcanesRiesgoRelativo&outputFormat=application/json&srsName=EPSG:4326`.
- **Fecha:** 03/04/2024. **Escala:** 1:2.500.000; un punto por sistema volcánico.
- **Licencia:** propiedad de SEGEMAR, bajo Creative Commons Argentina con reconocimiento de autoría (AccessConstraints del servicio).
- **Conteos:**
  - 65 puntos. 38 son continentales y tienen ranking. Los otros 27 están en la Antártida y las Sandwich del Sur: solo tienen índice de peligrosidad, no de riesgo.
  - Por nivel de riesgo, en los 38 continentales:

| Nivel de riesgo | Volcanes |
|---|---|
| **Muy alto** (6) | Copahue, Planchón-Peteroa, Lanín, Laguna del Maule, Cerro Blanco, Tupungatito |
| **Alto** (4) | Maipo, San José, Socompa, Tromen |
| **Moderado** (8) | Lastarria, Domuyo, Tuzgle, Pali Aike, Payún Matrú, Overo, Huanquihue, Llullaillaco |
| Bajo (11) | Viedma, Cueros de Purulla, Ojos del Salado, El Fraile, El Cóndor, Tres Cruces, Infiernillo, Cordón del Azufre, Falso Azufre, Bayo Gorbea, Laguna Blanca |
| Muy bajo (9) | Peinado, Aracar, Tipas, Antofagasta, Sierra Nevada, Incahuasi, Escorial, El Solo, Salar de Arizaro |

El ranking anterior (Elissondo et al. 2016, tabla 2 de Garcia y Badi 2021, *Volcanica* 4(S1)) tenía 2 volcanes de riesgo muy alto, 6 de alto, 9 de moderado y 21 de bajo. **Se usa el de 2024.**

**Campos de `volcanes.gpkg`, capa `segemar_riesgo_relativo_2024`:**

| Campo | Descripción |
|---|---|
| `codigo`, `nombre` | Id SEGEMAR y nombre del sistema volcánico |
| `orden_rvr` | Posición en el ranking (1 = mayor riesgo; nulo fuera del continente) |
| `indice_peligrosidad`, `nivel_de_peligrosidad` | IP (15 factores, de 1 a 18) y su clase |
| `indice_exposicion`, `nivel_de_exposicion` | IE (9–10 factores) y su clase |
| `riesgo_relativo`, `nivel_de_riesgo` | Riesgo = IP × IE, y su clase: Muy alto, Alto, Moderado, Bajo, Muy bajo, No evaluado |
| `riesgo_relativo_aviacion` | Componente de riesgo para la aviación |
| `unrest` | Señales de *unrest* históricas (0–3) |
| `ambito` | `continental` / `antartida_sandwich` |
| `lon`, `lat`, `fecha`, `referencia` | Coordenadas, fecha y URL de la publicación |

**Capa complementaria `gvp_holocenos_region`:**

- Contiene 104 volcanes holocenos de Smithsonian GVP (*Volcanoes of the World*), entre 76,5° y 50° O y entre 58° y 18° S. 65 de ellos son chilenos.
- Sirve porque las erupciones de volcanes chilenos (Cordón Caulle 2011, Chaitén 2008, Hudson 1991, Calbuco 2015) afectan a Argentina por la ceniza.
- Fuente: `https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows`, capa `GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes`.
- Licencia: uso libre con cita (Global Volcanism Program, Smithsonian Institution).
- Campos: `Volcano_Number`, `Volcano_Name`, `Country`, `Primary_Volcano_Type`, `Last_Eruption_Year`, `Elevation`, `Tectonic_Setting`, `Major_Rock_Type`.

**Limitaciones:**

- Es un ranking **relativo** para priorizar el monitoreo. No es un mapa de peligro: no tiene zonas de lava, lahares ni caída de tefra.
- Los puntos son aproximados: el cráter activo o el centroide del campo volcánico.
- Los volcanes chilenos no tienen ranking en esta fuente. El ranking chileno de SERNAGEOMIN 2023 no se descargó.
- Los mapas de peligro de volcán individual del SEGEMAR (Copahue, Lanín, Planchón-Peteroa…) existen como PDF y no se integraron.

**Uso en la app:**

- **Restricción por radio desde el punto:**
  - riesgo **Muy alto**: 30 km;
  - **Alto**: 20 km;
  - **Moderado**: 10 km.
- Los volcanes de riesgo bajo o muy bajo y los GVP chilenos no excluyen. Pueden **penalizar** con un decaimiento lineal hasta 50 km, o 100 km a sotavento (al este) para la ceniza.
- Los radios son una simplificación de la zona proximal: flujos piroclásticos y lahares hasta 10–30 km en los estratovolcanes andinos. Medir en ESRI:102033.

---

## 5. Fallas activas cuaternarias

- **Fuente principal:** SEGEMAR (SIGAM), *Deformaciones Cuaternarias 250K*. Es la base de neotectónica de las hojas 1:250.000, con fichas por estructura.
- **Capa WFS:** `sigam:e250K.DeformCuater`.
- **URL exacta:** `https://sigam.segemar.gob.ar/geoserver217/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=sigam:e250K.DeformCuater&outputFormat=application/json&srsName=EPSG:4326`.
- **Escala:** 1:250.000. **Fecha:** en curso; ver `fecha_actualizacion` por traza.
- **Licencia:** propiedad de SEGEMAR, bajo CC Argentina con reconocimiento.
- **Conteos:**
  - 1.674 trazas de 655 estructuras.
  - Actividad: 995 comprobadas y 679 probables.
  - Último movimiento: 38 históricas, 154 holocenas (menos de 11 ka) y 1.482 cuaternarias (menos de 2,6 Ma).
  - Tipos: fallas inversas (675), con bloque hundido desconocido (522), normales (103), anticlinales (86)…

**Campos de `fallas_cuaternarias.gpkg`, capa `segemar_250k`:**

| Campo | Descripción |
|---|---|
| `id_estructura`, `nombre`, `tipo_estructura` | Estructura: falla, grupo, sistema o zona de fallas, pliegues |
| `id_traza`, `nombre_trazas`, `tipo_traza` | Traza y cinemática: Inversa, Normal, Transcurrente Dextral/Sinestral, Anticlinal… |
| `actividad` | Comprobada / Probable |
| `edad_ultimo_mov` | Histórico / Holoceno (<11 ka) / Cuaternario (<2.6 Ma) |
| `edad_cod` | 1 = histórico, 2 = holoceno, 3 = cuaternario |
| `tipo_tasa`, `tasa` | Tipo de tasa y rango (< 1, 1–5 o > 5 mm/año; la mayoría "Desconocida") |
| `sismicidad`, `fecha_actualizacion`, `ficha` | Texto de sismicidad asociada, fecha y ficha descriptiva |

**Capas complementarias:**

- `segemar_2500k_regional` (`sigam:e2.5M.DeformCuater`): 183 trazas regionales, con estructuras submarinas y antárticas y mismos campos.
- `gem_gaf`: 181 trazas de la **GEM Global Active Faults Database**, recortadas a 76°–50° O y 58°–15° S. En Argentina provienen sobre todo de SARA (153).
  - Fuente: `https://raw.githubusercontent.com/GEMScienceTools/gem-global-active-faults/master/geojson/gem_active_faults_harmonized.geojson`.
  - Licencia: CC BY-SA 4.0.
  - Cita: Styron y Pagani (2020), *Earthquake Spectra* 36(1_suppl).
  - Campos: `catalog_id`, `catalog_name`, `name`, `slip_type`, `net_slip_rate` (tupla en texto "(valor,min,max)" en mm/año), `average_dip`, `dip_dir`, `activity_confidence`.

**Limitaciones:**

- La cobertura de SEGEMAR es la de las hojas ya compiladas. Es muy buena en Cuyo, el NOA y las Sierras Pampeanas, y menor en partes de Patagonia.
- Una zona sin trazas no implica ausencia de fallas.
- La posición es de 1:250.000, con incertidumbre de cientos de metros.
- GEM es mucho más grueso: 181 trazas contra 1.674.
- El peligro sísmico regional ya entra en la app por la PGA de GEM (`v2023_1_pga_475`). Esta capa agrega el peligro de **ruptura superficial**.

**Uso en la app:**

- **Restricción:** buffer de **2 km** a cada lado de las trazas con `edad_cod ≤ 2` (histórico u holoceno) y `actividad = 'Comprobada'`.
- **Penalización:** con buffer de 5 km para el resto de las trazas cuaternarias.
- Medir en ESRI:102033.
- Usar GEM solo donde SEGEMAR no tenga cobertura.

---

## 6. Susceptibilidad a deslizamientos (NASA)

- **Fuente:** NASA Goddard, *Global Landslide Susceptibility Map*. Stanley, T. y Kirschbaum, D. B. (2017), "A heuristic approach to global landslide susceptibility mapping", *Natural Hazards* 87, 145–164. Versión del archivo: 27/02/2023.
- **URL exacta:** `https://gpm.nasa.gov/sites/default/files/downloads/global-landslide-susceptibility-map-2-27-23.tif` (33 MB).
- **Escala:** raster de 30″ (unos 1 km), global hasta 60° S, en EPSG:4326.
- **Licencia:** dominio público (obra del gobierno de EE. UU.). Hay que citar el artículo.
- **Valores originales:** int8, 127 = nodata. Clases: 1 muy baja, 2 baja, 3 moderada, 4 alta, 5 muy alta. 0 = agua o no evaluado.
- **Procesamiento:** remuestreo por vecino más cercano a la grilla común. El origen difiere apenas 0,00006°, unos 7 m.
- **Distribución dentro de Argentina:**

| Clase | % de píxeles |
|---|---|
| 1, muy baja | 68,3 |
| 2, baja | 17,2 |
| 3, moderada | 8,7 |
| 4, alta | 4,2 |
| 5, muy alta | 1,4 |
| 0, agua o no evaluado | 0,2 |

**`deslizamientos_nasa_30s.tif`** (uint8): valores 0–5; 255 = nodata.

**Limitaciones:**

- Es un modelo heurístico global con pendiente, geología, fallas, rutas y pérdida de bosque. No es un inventario.
- Está correlacionado con la pendiente, que ya es una restricción en la app.
- No representa los aluviones de piedemonte de forma específica.
- El SIGAM tiene puntos de eventos de movimientos de ladera (`sigam:PeligrosidadMovimientosLadera`, 321 puntos). Se descargaron en `raw/restricciones/` pero no se limpiaron.

**Uso en la app:**

- **Factor.** Agregación H3: media de la clase más fracción de píxeles en clase ≥ 4.
- Penalizar proporcionalmente.
- Como **restricción** opcional: fracción en clase 5 ≥ 25 % de la celda.

---

## 7. Sitios Ramsar (opcional)

- **Fuente:** Ministerio de Ambiente y APN, *Sitios Ramsar de la Argentina*. Designación por la Convención de Ramsar, Ley 23.919, Res. SAyDS 776/2014.
- **Capa WFS:** `areas_protegidas:sitios_ramsar`.
- **URL exacta:** `https://geo.ambiente.gob.ar/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=areas_protegidas:sitios_ramsar&outputFormat=application/json&srsName=EPSG:4326`.
- **Licencia:** CC (licencia libre), según el servicio. **Fecha:** el servicio no la publica. Incluye designaciones de 1992 a 2024 (campo `a_desig`).
- **Conteos:** 24 sitios.
- **Campos:**
  - `id_sr` (n.º Ramsar), `fna` (nombre completo), `nam` (nombre);
  - `a_desig` y `a_ampl` (año de designación y de ampliación);
  - `ara` (superficie en ha), `tap` (categorías UICN de las áreas que contiene);
  - `caa`, `jurisdic`, `provincia`, `ecoregion`.

**Limitaciones:** el servicio tiene 24 sitios designados entre 1992 y 2024. Verificar contra el listado oficial de Ramsar si se usan como restricción. Los límites son los declarados al designar el sitio.

**Uso en la app:**

- Los sitios Ramsar ya entran parcialmente vía `ign:area_protegida`, que `build.py` trata como uso múltiple y solo penaliza. Esta capa los completa con los límites oficiales.
- Mantenerlos como **factor de penalización**, no como exclusión, porque admiten asentamientos existentes.

**Humedales en general:**

- Ambiente publica `recursos_acuaticos:regiones_subregiones_humedales` y varias unidades de paisaje de humedales a nivel local, pero no un inventario nacional de humedales en polígonos: el Inventario Nacional de Humedales está incompleto.
- No se descargaron.

---

## Capas que no se consiguieron o quedaron parciales

| Capa | Estado | Motivo |
|---|---|---|
| Capacidad de uso de suelos (clases I–VIII) | **No conseguida**; se usa el índice de productividad | No está en la capa nacional de Ambiente. GeoINTA (`geointa.inta.gob.ar`, `visor.geointa.inta.gob.ar`), que la publica por provincia, no respondió desde este entorno (TLS cortado o 502 del gateway) |
| Ambiente periglacial (polígonos) | **No existe** como capa | El ING solo mapea geoformas; la ley no tiene una delimitación cartográfica del periglacial |
| Mapas de peligro de volcán individual | No integrados | Solo están como PDF o imagen en el repositorio de SEGEMAR |

## Archivos

```
data/raw/restricciones/
  amb_caps.xml, segemar_caps.xml          capabilities WFS
  amb_suelos_inta.geojson                 1
  amb_otbn_nacional.geojson, otbn_split/  2
  amb_ing_sin_ias.geojson, amb_glaciares_andes_deserticos.geojson   3
  segemar_e2.5M.VolcanesRiesgoRelativo.geojson (+ ...EvaluacionPeligrosidad, ...EvaluacionExposicion,
    PeligroVolcanes), gvp_holocene.json, amb_volcanes.geojson       4
  segemar_e250K.DeformCuater.geojson, segemar_e2.5M.DeformCuater.geojson, gem_active_faults.geojson  5
  nasa_landslide_susceptibility_2-27-23.tif, segemar_PeligrosidadMovimientosLadera.geojson           6
  amb_sitios_ramsar.geojson               7
data/interim/restricciones/
  suelos_inta.gpkg, suelos_ip_30s.tif
  otbn.gpkg, otbn_30s.tif
  glaciares.gpkg (ing_continental, andes_deserticos_2024), glaciares_30s.tif
  volcanes.gpkg (segemar_riesgo_relativo_2024, gvp_holocenos_region)
  fallas_cuaternarias.gpkg (segemar_250k, segemar_2500k_regional, gem_gaf)
  deslizamientos_nasa_30s.tif
  ramsar.gpkg
```
