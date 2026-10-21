# Datos de agua subterránea: arsénico, fluoruro y recursos/recarga

Este documento cubre los datos para completar el factor **F02 "Calidad del agua (arsénico)"**, hoy `disponible: false` en `web/src/model/criteria.ts`, y para un factor nuevo de agua subterránea. Los datos se descargaron y verificaron el 21-10-2026. Todavía no están integrados: `pipeline/build.py` no se modificó.

Datos crudos en `data/raw/agua_subterranea/` (5,7 GB) y recortes en `data/interim/agua_subterranea/`. Ambas carpetas están en `.gitignore`. El recorte cubre lon −74..−53 y lat −56..−21, en EPSG:4326.

## 1. Resumen de fuentes

| Capa | Fuente | Variable | Resolución | Estado |
|---|---|---|---|---|
| Arsénico | Podgorski & Berg 2020, Eawag | P(As > 10 µg/L); también > 5 y > 50 | 30″ (≈1 km) | Descargado y recortado |
| Fluoruro | Podgorski & Berg 2022, Eawag | P(F > 1,5 mg/L) | 7,5″ (≈250 m) | Descargado y recortado |
| Recursos y recarga de agua subterránea | WHYMAP GWR, BGR & UNESCO | Tipo de acuífero × clase de recarga (mm/año) | 1:25.000.000 (vector) | Descargado y recortado |
| Mediciones de As usadas por el modelo | Podgorski & Berg 2020, `data.zip` | As (µg/L) promediado por píxel de 1 km² | Puntos | Extraído |

No evalué los datos de SEGEMAR, del Ministerio de Salud, de la SSRH, de CYTED/IBEROARSEN ni de Navoni et al. En una búsqueda web no encontré un mapa hidrogeológico nacional de SEGEMAR descargable en formato vectorial. Durante la sesión, el proxy registró fallas de conexión con `sigam.segemar.gov.ar`, así que su disponibilidad no se pudo confirmar.

## 2. Arsénico: Podgorski & Berg (2020)

- **Artículo:** Podgorski, J. & Berg, M. (2020). Global threat of arsenic in groundwater. *Science* 368(6493), 845–850. doi:[10.1126/science.aba1510](https://doi.org/10.1126/science.aba1510)
- **Dataset:** Podgorski, J. & Berg, M. (2020). *Data for: Global threat of arsenic in groundwater* (Version 1.0). Eawag. doi:[10.25678/0001ZT](https://doi.org/10.25678/0001ZT)
- **Página:** https://opendata.eawag.ch/dataset/global-threat-of-arsenic-in-groundwater
- **Archivos usados (URL exactas):**
  - `maps.zip` (3.975.063.669 bytes): https://opendata.eawag.ch/dataset/96c10d69-078b-4db9-88d7-6c169826d91a/resource/81801478-47ba-41fb-8bea-280632526053/download/maps.zip
  - `data.zip`: https://opendata.eawag.ch/dataset/96c10d69-078b-4db9-88d7-6c169826d91a/resource/f4d3a55b-018a-402b-9cda-7c5784828461/download/data.zip
  - `readme.txt`: https://opendata.eawag.ch/dataset/96c10d69-078b-4db9-88d7-6c169826d91a/resource/f2a9aa6a-1f2c-4e9b-865b-8996e02d8086/download/readme.txt
  - Los SHA-256 de los zip están en `data/raw/agua_subterranea/sha256_maps.txt`.
- **Licencia:** el dataset no declara licencia (en la API CKAN, `license_id` es `null`). La página de copyright de ERIC/open (https://opendata.eawag.ch/disclaimer/copyright, copia en `data/raw/agua_subterranea/eawag_opendata_copyright.html`) dice:
  - los metadatos son de dominio público;
  - los datos de investigación sin licencia explícita son de dominio público si no los alcanza la ley suiza de derecho de autor;
  - si los alcanza, rigen las limitaciones de esa ley.

  **No hay una licencia abierta explícita.** Hay que citar el artículo y el DOI del dataset. Antes de redistribuir los rasters, por ejemplo en `web/public/data`, conviene confirmarlo con el autor (joel.podgorski@eawag.ch). Publicar puntajes agregados por celda H3 es un uso derivado de menor riesgo, aunque igual hay que confirmarlo.
- **Modelo:**
  - random forest con 11 predictores geoambientales;
  - entrenado con más de 50.000 mediciones agregadas a píxeles de 1 km²;
  - AUC = 0,89 según el artículo.
  - Para Argentina, la tabla S1 lista 685 mediciones, de las cuales el 59,9 % supera 10 µg/L (refs. Nicolli, Smedley, Blarasin, Auge, Zabala et al. 2016 y Morgada et al. 2008/IBEROARSEN).
  - La población potencialmente afectada en Argentina es de 2,39 a 3,43 millones, según el umbral de probabilidad.
- **Umbrales del artículo:**
  - 0,57: sensibilidad igual a especificidad;
  - 0,72: VPP igual a VPN.

  Con esos dos umbrales se generaron los mapas de población afectada (Fig. 4).

### Archivos recortados

| Archivo | Variable | Tipo | Nodata |
|---|---|---|---|
| `as_prob_gt10ugL_podgorski2020_arg.tif` | P(As > 10 µg/L), 0–1 (resultado principal, Fig. 2) | float32 | NaN |
| `as_prob_gt5ugL_podgorski2020_arg.tif` | P(As > 5 µg/L), fig. S9 | float32 | NaN |
| `as_prob_gt50ugL_podgorski2020_arg.tif` | P(As > 50 µg/L), fig. S10 | float32 | NaN |
| `arsenico_puntos_podgorski2020_arg.gpkg` (capa `arsenico_puntos`) | 637 puntos: `As_ppb` (µg/L), `en_arg` (dentro de una provincia del IGN), `p_gt10` (valor del raster) | — | — |

El original es float64 con nodata −1,7e308. Lo convertí a float32 con NaN. La grilla es de 2520 × 4200 celdas de 0,0083333° y queda alineada con la grilla de 30″ de `build.py` con un desfase menor que 1e-5°. El CSV original tiene 16 filas corruptas, con un número de columnas distinto de 54, que descarté.

### Verificación en Argentina

La máscara de Argentina son las provincias del IGN, recortadas al bbox.

- **Cobertura:** 98,8 % del territorio.
- **P(As > 10):**
  - media 0,40;
  - percentiles 10, 50 y 90: 0,18, 0,36 y 0,72;
  - 13 % del área con p ≤ 0,2, 61 % con p entre 0,2 y 0,5, 20 % entre 0,5 y 0,8, y 5,8 % con p ≥ 0,8;
  - 20 % del área con p ≥ 0,57 y 10 % con p ≥ 0,72.
- **Valores en ciudades:**

  | Ciudad | P(As > 10) |
  |---|---|
  | Mendoza | 0,06 |
  | Bariloche | 0,17 |
  | Posadas | 0,23 |
  | Neuquén | 0,24 |
  | CABA | 0,33 |
  | Río Cuarto | 0,38 |
  | Santa Rosa | 0,43 |
  | La Plata | 0,51 |
  | Rosario | 0,60 |
  | Santiago del Estero | 0,68 |

  El patrón concuerda con el conocido para la llanura chaco-pampeana.
- **Contraste con las 586 mediciones dentro de Argentina:**

  | Rango de p | Mediciones | Fracción medida > 10 µg/L |
  |---|---|---|
  | p < 0,2 | 122 | 0 % |
  | 0,2 a 0,5 | 56 | 14 % |
  | 0,5 a 0,8 | 100 | 43 % |
  | p ≥ 0,8 | 307 | 97 % |

  **Ojo:** son datos de entrenamiento. El acuerdo es optimista y no sirve como validación independiente.

## 3. Fluoruro: Podgorski & Berg (2022)

- **Artículo:** Podgorski, J. & Berg, M. (2022). Global analysis and prediction of fluoride in groundwater. *Nature Communications* 13, 4232. doi:[10.1038/s41467-022-31940-x](https://doi.org/10.1038/s41467-022-31940-x). El artículo es CC BY 4.0.
- **Dataset:** Podgorski, J. & Berg, M. (2022). *Data for: Global analysis and prediction of fluoride in groundwater* (Version 1.0). Eawag. doi:[10.25678/0006GQ](https://doi.org/10.25678/0006GQ)
- **Archivos (URL exactas):**
  - `maps.zip` (2.032.052.312 bytes): https://opendata.eawag.ch/dataset/2012f6f6-afb5-4c30-b032-89f28d0acd93/resource/840629ab-1899-4754-a2aa-827fe479a5ef/download/maps.zip
  - `readme.txt`: https://opendata.eawag.ch/dataset/2012f6f6-afb5-4c30-b032-89f28d0acd93/resource/25d6dc05-8d74-460a-ac0f-323ff3d070ce/download/readme.txt
- **Licencia del dataset:** igual que la del arsénico. No declara licencia y rige la política de copyright de ERIC/open.
- **Modelo:**
  - random forest con 402.452 pozos y manantiales de 77 países;
  - AUC = 0,90;
  - píxel de 250 m.

  Los datos crudos de entrenamiento no son públicos.
- **Archivo recortado:** `f_prob_gt1p5mgL_podgorski2022_arg.tif`.
  - Contiene P(F > 1,5 mg/L) **en porcentaje entero, 0–100**: hay que dividir por 100.
  - Es uint8 con nodata 255, en una grilla de 10080 × 16800 celdas de 0,0020833°.
  - Para la grilla de 30″ hay que agregarlo con la media de 4 × 4 píxeles.
- **Verificación:**
  - Cobertura en Argentina: 98,2 %. Hay huecos con nodata; por ejemplo, Ushuaia da 255.
  - Media 0,26; percentiles 10, 50 y 90: 0,11, 0,26 y 0,39.
  - Solo el 2,5 % del área tiene p ≥ 0,5.
  - Santa Rosa da 0,42, Posadas 0,37 y CABA 0,14.

## 4. Agua subterránea: WHYMAP "Groundwater Resources of the World" (BGR & UNESCO)

- **Página:** https://www.whymap.org/whymap/EN/Maps_Data/Gwr/gwr_node_en.html
- **Descarga (URL exacta):** https://download.bgr.de/bgr/grundwasser/whymap/shp/WHYMAP_GWR_v1.zip (27,7 MB). El paquete incluye shapefiles, la documentación `metadata_WHYMAP_GWR_v1.0.pdf` y las condiciones de uso.
- **Cita obligatoria (metadato):** "WHYMAP GWR © BGR & UNESCO 2015".
- **Referencia:** BGR & UNESCO (2008): *Groundwater Resources of the World 1 : 25 000 000*. Hannover, Paris. Versión digital 1.0 del 01-04-2015.
- **Licencia:**
  - El paquete trae las *General Standard Terms and Conditions* de BGR. Su artículo 3 otorga un derecho de uso simple y **restringe hacer accesible al público** los datos o derivados, "salvo que otras normas dispongan lo contrario (en particular GeoNutzV)".
  - No encontré en el paquete una declaración explícita de licencia abierta.
  - El catálogo GDI-DE, registro `29949f35-6fe1-4775-bc97-62274a30c70b`, no respondió durante la sesión.
  - **Antes de publicar derivados, verificar con BGR.**
- **Escala:** 1:25.000.000. La nota de uso de BGR aclara que es un mapa indicativo (*Hinweiskarte*) y que no sirve para planificación a escala media ni para sitios puntuales.
- **Recarga:** se modeló con WaterGAP 2.1f para el período 1961–1990 (Döll et al. 2006).

### Archivo recortado: `whymap_gwr_arg.gpkg`

**Capa `GW_aquifers_v1_poly`:** 141 polígonos.

| Campo | Contenido |
|---|---|
| `HYGEO2` | Código original |
| `tipo` | Tipo de acuífero |
| `clase` | Descripción de la clase |
| `recarga_min_mm` | Recarga mínima (mm/año) |
| `recarga_max_mm` | Recarga máxima (mm/año) |
| `ICE`, `CONTINENT` | Campos originales |

| HYGEO2 | Tipo | Recarga (mm/año) | % del área de Argentina |
|---|---|---|---|
| 11 | Cuenca sedimentaria mayor | < 2 (muy baja) | 1,0 |
| 12 | Cuenca mayor | 2–20 (baja) | 9,7 |
| 13 | Cuenca mayor | 20–100 (media) | 18,3 |
| 14 | Cuenca mayor | 100–300 (alta) | 13,7 |
| 15 | Cuenca mayor | > 300 (muy alta) | 0 (solo fuera del país, dentro del bbox) |
| 22 | Estructura hidrogeológica compleja | < 20 | 5,5 |
| 23 | Estructura compleja | 20–100 | 1,4 |
| 24 | Estructura compleja | 100–300 | 0,7 |
| 25 | Estructura compleja | > 300 | — |
| 33 | Acuíferos locales y someros | < 100 | 43,4 |
| 34 | Acuíferos locales y someros | > 100 | 6,2 |

**Otras capas:**
- `salineGW_v1_poly`: agua subterránea salina con más de 5 g/L de sólidos totales disueltos. Cubre el 23,3 % del área argentina.
- `lowRainfall_v1_poly`: precipitación menor que 200 mm/año. Cubre el 10 %.

La capa de sobreexplotación (`overexploit`) no tiene elementos en el bbox.

WHYMAP **no mide productividad del acuífero**, como caudal de pozo o transmisividad. Mide el tipo de ambiente hidrogeológico y la recarga modelada. El BGS (MacDonald et al. 2012) da productividad solo para África y no cubre Argentina.

## 5. Propuesta para F02: calidad del agua (arsénico)

- **Variable:** `as_p10`, la probabilidad de As > 10 µg/L. Es la media de P(As > 10) por celda H3 res 6, agregada como los demás rasters en `build.py` (función de agregación por celda).
- **Función de valor:** `{ kind: "decreasing", a: 0.2, b: 0.8 }`.
  - Vale 1 con p ≤ 0,2, 0 con p ≥ 0,8 y es lineal entre ambos valores.
  - Sobre Argentina da un puntaje medio de 0,66. El 13 % del área obtiene 1 y el 5,8 % obtiene 0.
  - Una alternativa más vinculada al artículo es usar a = 0,2 y b = 0,72, donde 0,72 es el umbral de VPP igual a VPN.
- **Umbral normativo:**
  - OMS (GDWQ): 10 µg/L.
  - Código Alimentario Argentino, art. 982: 10 µg/L, con plazos de adecuación prorrogados (no lo verifiqué en esta sesión).

  Por eso conviene la capa > 10 µg/L y no la > 50 µg/L. La capa > 50 µg/L sirve como variante de sensibilidad o como restricción blanda; por ejemplo, P(As > 50) ≥ 0,5.
- **Evidencia:** ["N", "E", "J"].
  - El umbral de 10 µg/L es una norma.
  - El mapa es un modelo empírico.
  - Los cortes 0,2 y 0,8 son juicio experto.
- **Matiz necesario:** la probabilidad describe el **agua subterránea no tratada**. Una ciudad de 500.000 habitantes probablemente se abastezca de agua superficial o trate el agua (ósmosis inversa, coagulación). Por eso F02 debería pesar menos cuando R13 o F01 indican un río suficiente. Una opción es el factor compuesto `score = max(fn(as_p10), 1 si q_rio25·0,2 ≥ demanda)`, análogo al `max()` de F01. Si no, el factor penaliza dos veces a la Pampa por un riesgo que se mitiga con fuente superficial.
- **Fluoruro (opcional):** se puede formar un F02 compuesto como `min(fn_As, fn_F)`, con `fn_F = decreasing(0.2, 0.6)` sobre P(F > 1,5 mg/L), que es juicio experto. Así F02 pasaría a llamarse "Calidad del agua subterránea (As, F)". En Argentina el fluoruro casi nunca supera p = 0,5, así que cambiaría poco el resultado. Lo más simple es dejarlo como capa informativa.

## 6. Propuesta de factor nuevo: F16 "Recurso de agua subterránea"

- **Grupo:** `agua`.
- **Peso sugerido:** 0,04, descontado proporcionalmente del resto. Es juicio experto.
- **Variable:** la clase WHYMAP `HYGEO2` dominante por celda H3. Se rasteriza en la grilla de 30″ y se toma la moda, o el puntaje medio.
- **Función de valor:** por tabla (`piecewise` o lookup). Es juicio experto (J): combina la recarga con el tipo de acuífero.

  | HYGEO2 | Puntaje |
  |---|---|
  | 15, 25 | 1,0 |
  | 14 | 0,9 |
  | 24, 34 | 0,7 |
  | 13 | 0,6 |
  | 23 | 0,4 |
  | 33 | 0,3 |
  | 12 | 0,2 |
  | 22 | 0,1 |
  | 11 | 0,0 |

- **Salinidad:** si la celda está en `salineGW_v1_poly` (más de 5 g/L de sólidos totales disueltos), el puntaje se multiplica por 0,3. Ese corte también es juicio experto.
- **Evidencia:** ["E", "J"]. **Refs:** WHYMAP GWR (BGR & UNESCO 2008/2015) y Döll et al. 2006.
- **Uso alternativo:** como término adicional dentro del `max()` de F01 en lugar de un factor separado, porque representa una fuente alternativa de abastecimiento. Hay que evitar sumar la recarga a la aridez: ambas derivan de la precipitación y tienen una correlación alta.

## 7. Limitaciones

1. **Son probabilidades modeladas, no mediciones.**
   - El As tiene una alta heterogeneidad vertical y lateral a menos de 1 km, según el estrato del acuífero (Pampeano frente a Puelche) y la profundidad del pozo.
   - El modelo no distingue profundidad.
   - Los autores advierten que "solo un análisis real de la calidad del agua subterránea puede determinar de manera definitiva" si es apta, por la heterogeneidad a menos de 1 km que no se puede modelar, y que la dependencia de la profundidad requeriría estudios por cuenca.
2. **Validación optimista en Argentina.** Los 586 puntos son de entrenamiento. Además se concentran en la llanura chaco-pampeana, así que Patagonia, Cuyo y el NOA andino tienen poco o ningún dato local y su predicción es una extrapolación.
3. **Agua subterránea frente a agua de red.** El factor mide peligro geogénico, no la calidad del agua distribuida.
4. **Resolución y escala.**
   - El As tiene 1 km, adecuado para H3 res 6 (≈36 km²).
   - WHYMAP es 1:25.000.000: los polígonos tienen bordes de decenas de km y el 43 % del país cae en una sola clase (33). Discrimina poco.
5. **Recarga ≠ productividad.** WHYMAP no informa caudales explotables ni profundidad del nivel freático. Su recarga se modeló con WaterGAP 2.1f para 1961–1990, el mismo modelo hidrológico que sustenta los caudales de HydroRIVERS, con sus sesgos en zonas áridas.
6. **Licencias no abiertas explícitamente.**
   - Eawag: no declara licencia y rige la ley suiza.
   - BGR: sus condiciones restringen la difusión pública de derivados.

   Hay que verificarlas antes de publicar rasters o derivados en la web (ver §2 y §4).
7. **Fuentes nacionales pendientes.** No se integraron datos de SEGEMAR, SSRH, el Ministerio de Salud (mapa de riesgo de HACRE) ni relevamientos provinciales. Serían la fuente preferible para calibrar o reemplazar el mapa global en la llanura pampeana.
8. **Fluoruro:** tiene huecos de nodata (255), por ejemplo en Tierra del Fuego, y sus datos de entrenamiento no son públicos.

## 8. Reproducción

Los recortes se hicieron con rasterio leyendo directamente del zip, sin descomprimirlo, con lecturas por ventana (`/vsizip/…/maps.zip/maps/<archivo>.tif` y `rasterio.windows.from_bounds(-74, -56, -53, -21)`).

- **Arsénico:** de float64 a float32, con nodata NaN.
- **Fluoruro:** se dejó uint8, con nodata 255.
- **Salida:** GeoTIFF con compresión deflate y tiles de 512.
- **WHYMAP:** los shapefiles se recortaron al bbox con `geopandas` (`intersection` con el bbox, previo `make_valid`).
- **Puntos:** se filtraron las filas del CSV con 54 campos y luego el bbox.
- **Verificación:** se hizo con rasterio y geopandas, enmascarando con `data/raw/ign_provincia.json` (requiere `OGR_GEOJSON_MAX_OBJ_SIZE=0`).
