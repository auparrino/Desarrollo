# Propiedad de la tierra en Argentina: fuentes abiertas y tierra a disposición del Estado

Fecha de relevamiento: 21/10/2026. Los datos descargados están en `data/raw/tierra/`, que está en `.gitignore`. Los scripts de extracción están en `pipeline/tierra/`.

Este informe responde a dos preguntas:

1. ¿Qué tierra es del Estado (nacional, provincial o municipal) y podría usarse para fundar ciudades nuevas?
2. ¿Qué restricciones legales, éticas y de ocupación hay sobre esa tierra?

Todas las cifras salen de archivos descargados y procesados en esta sesión o de páginas leídas directamente. Si una cifra viene de un tercero, se indica la fuente.

---

## 1. Resumen ejecutivo

- **No existe un catastro nacional abierto de tierras fiscales.** El dominio originario de la tierra y de los recursos es de las provincias (arts. 121 y 124 CN). Cada provincia tiene su propio catastro y casi ninguna publica la condición dominial (fiscal o privada) en un WFS abierto. De las provincias que revisé, solo **Tierra del Fuego** publica una capa `tierras_fiscales_provinciales` descargable.
- **La mejor fuente homogénea a escala departamental es el CNA 2018 (INDEC).** Clasifica la superficie de las parcelas de las explotaciones agropecuarias (EAP) por tipo de dominio (privado o fiscal) y por régimen de tenencia. Bajé los cuadros C3.1, C3.2 y C3.3 de las 23 provincias y armé `cna2018_tenencia_departamento.csv` (512 departamentos, código INDEC de 5 dígitos). A nivel país, la superficie **fiscal** dentro de las EAP con límites definidos es de **5.190.746 ha (3,35 %)** sobre 154,8 millones de ha.
  - Limitación crítica: el CNA **solo mide tierra fiscal ocupada por productores agropecuarios**. La tierra fiscal vacante (meseta, montaña, reservas sin uso) no aparece. Es una **cota inferior** de la tierra fiscal.
- **AABE (Estado Nacional).** El inventario completo (SIENA/RENABE, con polígonos y WFS) **no es público**. Sí se puede bajar:
  - el listado JSON de subastas de la AABE: 370 inmuebles, todos con coordenadas;
  - el anexo del Decreto 950/2024: 57 renglones que suman 309 inmuebles "innecesarios", muchos ferroviarios y militares.
- **Extranjerización (RNTR, Ley 26.737).** El último corte publicado es de agosto de 2025, en PDF por departamento. Lo convertí a CSV con código INDEC: 13.262.725,64 ha extranjeras sobre 266.643.212,84 ha rurales (**4,97 %**). **31 departamentos superan el 15 %**.
- **Comunidades indígenas (Ley 26.160).** El listado de Mininterior (noviembre de 2025) trae 1.801 comunidades. **978 tienen el relevamiento territorial culminado**, todas con coordenada de punto. **No hay polígonos abiertos de los territorios relevados**: el INAI publica solo mapas en PDF.
- **RENABAP.** 6.467 barrios populares con polígono (≈ 68.420 ha). Son tierra ocupada y deben excluirse de cualquier tierra "disponible".

---

## 2. Fuentes relevadas

Leyenda de la columna "Descarga": ✅ descargado · ⚠️ parcial o derivado · ❌ no disponible o no accesible.

### 2.1 CNA 2018: régimen de tenencia por departamento (INDEC) ✅ ← fuente principal

| Campo | Detalle |
|---|---|
| URL | Sistema de consultas: `https://consultascna2018.indec.gob.ar/`. Los cuadros se obtienen con un POST a `https://consultascna2018.indec.gob.ar/ver_cuadro_estadistico_cna` con `cuadro=121` (C3.1), `155` (C3.2) o `156` (C3.3), `cuadro_descripcion=<id>` y `provincia=<código INDEC>`, o `0` para el total por provincia. Para listar los cuadros: POST a `/listado_cuadros` con `criterio=nombre:null:string#id_categoria_cuadro:2:string#tags:null:string`. |
| Documento metodológico | `https://www.indec.gob.ar/ftp/cuadros/economia/cna2018_resultados_definitivos.pdf` (descargado en `literatura/`) |
| Formato | Tablas HTML; el botón "Descargar xls" las exporta del lado del cliente. Guardé el HTML crudo (`cna2018/html/`, 72 archivos) y lo convertí a CSV. |
| Cobertura y resolución | 23 provincias (CABA no tiene EAP), 512 departamentos o partidos. Solo cuenta superficie de EAP. |
| Variables | **C3.1**: superficie (ha) de parcelas por tipo de dominio y régimen. Privado: propiedad, sucesión indivisa, arrendamiento, aparcería, ocupación con permiso, comodato, ocupación de hecho, concesión, contrato accidental, usufructo y otros. Fiscal: arrendamiento, aparcería, ocupación con permiso, comodato, ocupación de hecho, concesión, contrato accidental, usufructo y otros. Más una columna "sin discriminar". **C3.2**: cantidad de parcelas con la misma apertura. **C3.3**: cantidad (unidades, **no hectáreas**) de terrenos sin límites definidos (TSL) por dominio: comunal o comunero, comunidad de pueblos originarios, otras tierras fiscales, parques o reservas, privadas. |
| Licencia | INDEC no declara una licencia explícita en el sistema. Es información estadística pública; hay que citar "INDEC, CNA 2018, resultados definitivos". |
| Calidad | Pasa los controles: en los 512 departamentos la suma de las categorías es igual al total (tolerancia 0,1 %), y la suma por provincia coincide con el total provincial. El sitio mezcla formatos numéricos (`1.234,5`, y a veces `0.59` o `2.000` con punto decimal); el parser lo resuelve y la suma de control lo valida. En C3.2, "s" significa secreto estadístico. |
| Limitaciones | (1) No incluye tierra fiscal fuera de EAP. (2) Las EAP se asignan al departamento de su sede, por lo que la superficie EAP puede superar la del departamento (por ejemplo, Mártires, en Chubut, tiene 107 %). (3) Los TSL no tienen superficie: son típicos de campos comuneros, tierras indígenas y fiscales del NOA y del Chaco, y quedan subrepresentados en hectáreas. (4) La fecha de corte de la tenencia es el 31/12/2017. (5) Para La Rioja y Chos Malal, el CNA usa códigos distintos de los del IGN/INDEC 2022; los remapeé (ver §3). |

Sitio complementario `https://cna2018.indec.gob.ar/`: no respondió desde el proxy (empty reply / 503).

### 2.2 CNA 2002: régimen de tenencia (MAGyP / datos.gob.ar) ✅

- URL: `https://datos.magyp.gob.ar/dataset/69bc0e07-74bf-4a18-ba02-5af6439a55b2/resource/89625cb6-6d91-42d0-875e-5fc27602edf3/download/cna2002rtt.csv` (ficha en datos.gob.ar: `regimenes-tenencia-tierra-segun-censo-nacional-agropecuario-2002`).
- Formato: CSV, 526 departamentos. La columna `link` es el código INDEC sin el cero inicial (por ejemplo, `6007`).
- Variables: `sup_total`, `sup_priv`, `sup_fisc`, `rt2001`–`rt2009` (propiedad, sucesión indivisa, arrendamiento, aparcería, contrato accidental, ocupación con permiso, ocupación de hecho, otros) y sus porcentajes. Diccionario en `referencias.csv` (latin-1).
- Licencia: CC-BY-4.0.
- Limitaciones: `-1` significa sin dato; `sup_fisc = -1` en 193 de 526 departamentos. El CNA 2002 no cubrió bien todas las provincias. La descripción de `por_supfisc` en el diccionario tiene un error de copia (dice "privadas"). Sirve para comparar con 2018, con cautela.

### 2.3 AABE: inmuebles del Estado Nacional ⚠️

| Recurso | URL | Estado |
|---|---|---|
| Listado de subastas (JSON) | `https://www.argentina.gob.ar/bienesdelestado/listado` (endpoint que usa la página `/bienesdelestado/ventas-bienes-inmuebles`) | ✅ `aabe/aabe_subastas_listado.json` |
| Anexo del Decreto 950/2024 (IF-2024-104278637-APN-AABE#JGM) | `https://www.argentina.gob.ar/normativa/405669_dec950_pdf/archivo` (página: `https://www.argentina.gob.ar/normativa/nacional/norma-405669/texto`) | ✅ PDF de 60 páginas, convertido a `aabe/decreto_950_2024_anexo_inmuebles.csv` |
| SIENA (sistema de inmuebles con polígonos y WFS "Producción-Proxy") | `https://siena.bienesdelestado.gob.ar/` | ❌ conexión reseteada. Según la wiki de la AABE, el WFS es de uso interno con perfil de usuario. |
| Wiki AABE | `https://wiki.bienesdelestado.gob.ar/` | ❌ 502 desde el proxy |
| Catálogo en datos.gob.ar | — | ❌ No hay dataset de la AABE (la búsqueda "AABE" e "inmuebles" en la API CKAN no devuelve nada relevante) |

- **Listado de subastas**: 370 registros, todos `tipo_aabe = aabe-inmueble` y `subtipo_aabe = venta`. Campos: `nid`, `title`, `estado` (finalizado 211, desierta 7, vacío 152 = vigentes o futuras), `latitud`, `longitud`, `fecha_subasta`, `superficie`, `precio_subasta`, `tipo_moneda`, `url`, `localidad`, `departamento`, `provincia`, `calle`, `numero`, `tipo_inmueble`.
  - Distribución: CABA 170, Buenos Aires 76, Santa Fe 44, Córdoba 23, Mendoza 10, resto ≤ 9.
  - `superficie` parece estar en **m²**. No está documentado; lo infiero por los valores (por ejemplo, Campos Salles 1565: 5.189).
  - El registro más grande, "Campo Potreros de Cordillera" (Malargüe), tiene 130.927.163 en esa unidad, lo que da ≈ 13.093 ha si son m².
  - Es una muestra sesgada: solo lo que la AABE pone en venta, sobre todo urbano.
- **Decreto 950/2024**: 57 renglones con 309 inmuebles en total. Columnas: `orden`, `domicilio`, `cantidad_inmuebles`, `localidad`, `departamento_partido`, `provincia`, `cie` (Código de Identificación del Inmueble del SIENA) y, cuando se pudo extraer del croquis, `croquis_superficie_m2`, `croquis_lat` y `croquis_lon` (solo 7 renglones).
  - Incluye cuadros de estación ferroviaria (líneas Roca, Sarmiento, San Martín, Urquiza y Belgrano) y predios militares (por ejemplo, el Polígono de Tiro Gral. Belgrano en Tucumán y el Batallón de Ingenieros Blindados 2 en Entre Ríos). El más grande es la **Estancia de Llaucha (Mendoza, RN 40): 51.068.095 m² ≈ 5.107 ha**.
- Licencia: el contenido de argentina.gob.ar está bajo CC BY 4.0 (según el pie del sitio).
- Limitaciones: según Infobae (15/04/2024), el propio Estado no conoce con exactitud su inventario: la AABE registraba 11.432 bienes y Vialidad 10.105 propios. El universo completo del RENABE **no es descargable**; hay que pedirlo por acceso a la información pública (Ley 27.275).

### 2.4 Tierras de Defensa y Fuerzas Armadas ⚠️

- **IGN WFS** `https://wms.ign.gob.ar/geoserver/ows`, capa `ign:instalacion_militar_SU001`: ✅ `ign/ign_instalacion_militar_SU001.json`. Son 152 **puntos** con los campos `fna`, `gna`, `nam`, `fdc` (fuente: Ejército 73, FAA 13, Armada 8, imagen satelital, etc.). **No tiene polígonos ni superficie**, así que sirve para ubicar, no para medir. Licencia: no la verifiqué en el servicio; el IGN pide citar la fuente.
- **Tierra del Fuego** `geonode:instalacion_militar_tdf`: 4 puntos.
- No encontré un inventario abierto del Ministerio de Defensa. Algunos predios aparecen en el Decreto 950/2024 y en resoluciones de la AABE (por ejemplo, la Res. 59/2026, que desafecta inmuebles a pedido de Defensa). Las cifras de prensa (por ejemplo, 13.360 ha de la Guarnición Militar Córdoba, según Perfil) **no están verificadas** con datos oficiales.

### 2.5 Tierras ferroviarias (ADIF / Trenes Argentinos) ⚠️

- **IGN WFS** `ign:puntos_de_transporte_ferroviario_AN070`: ✅ `ign/ign_puntos_de_transporte_ferroviario_AN070.json`. Son 2.672 puntos (estación 2.500, apeadero 75, desvío 39…). El campo `fun` toma los valores 2 (1.926), 6 (640) y 4 (106). Probablemente indica el estado de funcionamiento, pero **no verifiqué el diccionario**; hay que confirmarlo con el catálogo de objetos del IGN antes de usarlo como "estación en desuso".
- La red ferroviaria (`ign_lineas_de_transporte_ferroviario_AN010.json`) ya estaba en `data/raw/`.
- **No hay un inventario abierto de inmuebles ferroviarios** de ADIF. Las desafectaciones salen en el Boletín Oficial caso por caso (por ejemplo, la Res. 827/2026 del MECON, playa de Cañada de Gómez, ≈ 132.100 m²) y en el anexo del Decreto 950/2024.

### 2.6 Tierras fiscales provinciales ⚠️

| Provincia | Fuente | Resultado |
|---|---|---|
| **Tierra del Fuego** | WFS `https://tiles.tierradelfuego.gob.ar/geoserver/wfs`, capa `geonode:tierras_fiscales_provinciales` (Fees y AccessConstraints: NONE) | ✅ `provincias/tdf/tdf_tierras_fiscales_provinciales.geojson`: 174 multipolígonos con `partida`, `departamen`, `sec`, `mzo`, `par`, `rem`, `clas_titul`. **Superficie geodésica calculada: 759.432 ha** (Ushuaia: tierras fiscales sin mensura 609.447 ha, Estado provincial 15.096 ha, espacio público 18.711 ha; Río Grande: sin mensura 82.639 ha, Estado provincial 32.976 ha, espacio público 513 ha). La capa no distingue Tolhuin. También bajé el parcelario rural (1.235 polígonos, sin campo de dominio), los ejidos urbanos (3) y la comunidad Rafaela Ishton (1 polígono, 34.952 ha). |
| **Río Negro** | IDERN, WFS `https://idern.rionegro.gov.ar/geoserver/wfs` | ❌ El GetCapabilities responde, pero sin capas públicas (0 FeatureTypes; el WMS tampoco expone ninguna). Cifra de prensa: según el Diario Río Negro (27/04/2026), citando al director de Tierras y a Catastro, de 20.301.300 ha provinciales unas **4 millones de ha están ocupadas y sin regularizar** y **2.368.100 ha no tienen mensura** (concentradas en la Meseta de Somuncurá, Trapal Co, El Cuy y Bajo de Santa Rosa). |
| **Santa Cruz** | SITU, WFS `https://situ.santacruz.gob.ar/geoserver/ows` | ⚠️ Responde con 121 capas, pero ninguna es catastral ni de tierras fiscales (`fisc:depend_fisc` son dependencias de la Fiscalía). |
| La Pampa | `https://geoidelp.lapampa.gob.ar/geoserver/p_la_pampa/wfs` (listado en IDE Patagonia) | ❌ conexión reseteada desde el proxy |
| Neuquén, Chubut, Salta, Misiones, Chaco, Corrientes, Formosa | — | ❌ No encontré endpoints WFS verificados de tierras fiscales. Probé hosts candidatos y ninguno respondió desde el proxy; **no confirmé que existan**. Para ubicarlos, usar el buscador de geoservicios de IDERA (`https://www.idera.gob.ar/index.php/servicios/geoservicios`), que este entorno no pudo consultar. |

Literatura con cifras:

- **Marcelo Sili, "La última frontera / Problemática de las tierras fiscales en la Patagonia"** (PDF de 2006, `literatura/sili_problematica_tierras_fiscales_patagonia.pdf`). Para la **Meseta Central** (zona que el autor dice que ocupa ≈ 60 % del territorio provincial; por el contexto, la Región Sur de Río Negro) estima que las tierras fiscales son ≈ 30 % de la superficie (**3.400.000 ha**), con **1.620 ocupantes fiscales** de unas 2.000 ha promedio cada uno, bajo permiso precario y pago de pastaje.
- **Sili 2012**, "Las tierras fiscales en la Patagonia argentina: un viejo problema" (`literatura/sili_2012_tierras_fiscales_patagonia.pdf`).
- **ATE (2022)**, "Concentración y extranjerización de la tierra en la Argentina" (`literatura/ate_2022_concentracion_extranjerizacion.pdf`), 23 páginas. Es de divulgación y sindical; sus cifras históricas (por ejemplo, 5.473.033 ha fiscales patagónicas rematadas por la ley de 1882) no fueron contrastadas.

### 2.7 Registro Nacional de Tierras Rurales (Ley 26.737) ✅

- URL de la página: `https://www.argentina.gob.ar/justicia/tierrasrurales/datos/extranjerizacion-departamento` ("Última actualización: agosto de 2025").
- Archivo: `https://www.argentina.gob.ar/sites/default/files/2021/02/extranjerizacion_por_departamento_pdf.pdf`. Es un PDF que sale de un xlsx ("ReportProvinciaTerritorioSubprovincial", impreso el 21/08/2025).
- Derivado: `rntr/rntr_extranjerizacion_departamento_2025-08.csv` con las columnas `nivel` (pais/provincia/departamento), `cod_prov`, `cod_dep` (INDEC), `provincia`, `departamento`, `sup_rural_ha`, `sup_extranjera_ha`, `pct_extranjerizado` y `match_ign` (exacto/aprox). Son 1 fila país, 23 provincias y 513 departamentos.
  - Asigné código a los 513 departamentos: 14 por similitud de nombre (revisada a mano) y 8 con alias manual.
  - Hay un duplicado de origen: "ituzaingo" en Corrientes, con 0 ha.
- Validación: la suma de los departamentos coincide con cada provincia (diferencia < 1 ha) y la suma de las provincias da el total nacional (13.262.725,65 ha).
- Resultados: **4,97 %** a nivel nacional; **31 departamentos > 15 %**. Los más altos son San Carlos (Salta) 59,82 %, Molinos (Salta) 57,79 %, General Lamadrid (La Rioja) 56,70 %, Lácar (Neuquén) 54,17 %, Campana (Buenos Aires) 50,27 % e Iguazú (Misiones) 39,95 %. Ninguna provincia supera el 15 %; la más alta es Salta, con 11,40 %.
- La página "Extranjerización por provincia" no tiene archivo descargable: solo el texto "en ninguna provincia se supera dicho porcentaje".
- Licencia: CC BY 4.0 (argentina.gob.ar).
- Limitaciones:
  - La "superficie rural" del RNTR (266,6 millones de ha) **no es** la superficie de las EAP del CNA (154,8 millones de ha).
  - En el PDF los nombres vienen sin tildes y abreviados.
  - Algunos departamentos tienen superficie rural 0 (los partidos urbanos del GBA).
  - Hay terceros con otras cifras (por ejemplo, el Observatorio de Tierras habla de 44 departamentos). El libro del RNTR en SAIJ devolvió 403.

### 2.8 Comunidades indígenas y relevamiento territorial (Ley 26.160, INAI) ✅ (puntos) / ❌ (polígonos)

| Recurso | URL | Contenido |
|---|---|---|
| Listado actual (Mininterior, 12/11/2025) | `http://datos.mininterior.gob.ar/dataset/6a702e6f-3292-44fe-804f-16b8dee008c1/resource/3c2137d5-46d3-40cf-9e01-ee406746b27a/download/listado-de-comunidades-indigenas-20251112.csv` (ficha en datos.gob.ar: `listado-de-comunidades-indigenas-con-personeria-juridica-y-o-relevamiento-territorial`) | CSV con `;`, UTF-8 con BOM, coma decimal. **1.801 comunidades**; `relevamiento_estado`: Culminado 978, No corresponde 823. Los 978 culminados traen lat/lon. Incluye `departamento_id` INDEC de 5 dígitos, pueblo, personería, número y fecha de resolución INAI y resolución recurrida. Licencia CC-BY-4.0. **Ojo**: algunos nombres de columna tienen espacios ("provincia _nombre", "comunidad_zona _localizacion"). |
| Histórico (Justicia, 23/02/2024) | `https://datos.jus.gob.ar/dataset/32967733-0d1b-4246-a8ef-e9b84ad33b1f/resource/f9b57566-3e7c-4449-b984-49a26897eb77/download/listado-comunidades-indigenas-20240223.csv` | 1.878 comunidades. Estados: Culminado 989, Sin relevar 612, Iniciado 146, En trámite 127. Coordenadas decimales en 1.020. Sirve para ver las comunidades **sin relevar o en trámite**, que el listado de 2025 ya no muestra. |
| Agregado propio | `indigenas/comunidades_por_departamento_mininterior_202511.csv` | 228 departamentos con `comunidades_listadas` y `comunidades_relevamiento_culminado`. |
| Mapas INAI (09/2024) | `https://www.argentina.gob.ar/sites/default/files/2020/11/mapaterritorios092024.pdf` (también `mapacomunidades092024.pdf` y `mapapueblos092024.pdf`; página `https://www.argentina.gob.ar/derechoshumanos/inai/mapa`) | PDF exportados de ArcMap. **No son vectoriales utilizables**. Los polígonos de territorio relevado (ReTeCI) **no están publicados en formato abierto**. |

Limitaciones:

- El punto ubica a la comunidad, no su territorio. El radio de influencia hay que tomarlo como un supuesto.
- Hay comunidades no inscriptas que no figuran en el listado.
- Que el relevamiento esté "culminado" no implica que haya título.

### 2.9 RENABAP: barrios populares ✅

- URL: `https://archivo.infraestructura.gob.ar/dataset/ssisu/20231205_info_publica.geojson` (también `.gpkg`, `_datos_barrios.csv` y `_referencias.csv`; ficha en datos.gob.ar: `registro-nacional-de-barrios-populares`).
- Formato: GeoJSON con 6.467 multipolígonos (CRS84) más un CSV de atributos.
- Variables: `id_renabap`, `nombre_barrio`, `provincia`, `departamento` y `localidad` (**como texto; no trae código INDEC**), viviendas y familias aproximadas, década o año de creación, servicios (energía, cloacas, agua, cocina, calefacción), `titulo_propiedad` (SI 5, NO 6.462), `clasificacion_barrio` y `superficie_m2` (en total ≈ 68.420 ha).
- Licencia: Creative Commons Attribution.
- Limitaciones: es un corte de 12/2023. El departamento viene como texto, así que conviene hacer un join espacial con `ign_departamento.json`.

### 2.10 Otros recursos útiles descargados

- `ign/ign_areas_de_asentamientos_y_edificios_020105.json`: plantas urbanas del IGN/INDEC, 3.350 polígonos. Sirve como máscara de suelo ya urbanizado.
- `cna2002/` (ver §2.2).
- El dataset NAF de la SAGyP ("Tenencia de la tierra de los Núcleos de Agricultura Familiar", `datos-tenencia-tierra-nafs.csv`) existe en datos.gob.ar con licencia CC-BY-4.0, pero **no lo descargué**.

---

## 3. Tabla limpia: `data/raw/tierra/cna2018_tenencia_departamento.csv`

512 filas (todos los departamentos con EAP; faltan las 15 comunas de CABA y Antártida e Islas del Atlántico Sur) y 32 columnas.

| Columna | Definición |
|---|---|
| `cod_dep` | Código INDEC de 5 dígitos, compatible con `in1` de `ign_departamento.json` (512/512 coinciden) |
| `cod_dep_cna` | Código tal como lo publica el CNA. Difiere en 4 casos: 46006→46056 Ángel Vicente Peñaloza, 46068→46028 General Felipe Varela, 46198→46098 Vinchina, 58022→58042 Chos Malal |
| `provincia`, `departamento`, `nombre_ign` | Nombres |
| `sup_total_ha` | Superficie total de parcelas de EAP con límites definidos (C3.1) |
| `sup_propiedad_ha` | Privado – propiedad |
| `sup_sucesion_indivisa_ha` | Privado – sucesión indivisa |
| `sup_arrendamiento_ha` | Arrendamiento privado más arrendamiento fiscal |
| `sup_arrendamiento_privado_ha` | Solo arrendamiento privado |
| `sup_privado_total_ha` | Suma de los 11 regímenes de dominio privado |
| **`sup_fiscal_ha`** | **Suma de los 9 regímenes de dominio FISCAL de C3.1**: arrendamiento, aparcería, ocupación con permiso, comodato, ocupación de hecho, concesión, contrato accidental, usufructo y otros |
| `sup_fiscal_ocupacion_hecho_ha` | Fiscal – ocupación de hecho |
| `sup_fiscal_ocupacion_permiso_ha` | Fiscal – ocupación con permiso (el permiso precario típico de los "fiscaleros" patagónicos) |
| `sup_fiscal_arrendamiento_ha`, `sup_fiscal_concesion_ha` | Fiscal – arrendamiento y concesión |
| `sup_fiscal_otras_formas_ha` | Fiscal – aparcería, comodato, contrato accidental, usufructo y otros |
| `sup_privado_ocupacion_hecho_ha` | Ocupación de hecho sobre tierra privada |
| `sup_sin_discriminar_ha` | Sin discriminar |
| `pct_fiscal`, `pct_propiedad`, `pct_arrendamiento` | Porcentaje sobre `sup_total_ha` |
| `parcelas_total`, `parcelas_fiscales` | Cantidad de parcelas (C3.2). `parcelas_fiscales_con_secreto = 1` indica que alguna celda fiscal era "s" (secreto estadístico) y se sumó como 0 |
| `tsl_total`, `tsl_fiscales`, `tsl_comunidad_pueblos_originarios`, `tsl_otras_tierras_fiscales`, `tsl_privadas` | Cantidad de terrenos sin límites definidos (C3.3, unidades). `tsl_fiscales` = comunal o comunero + comunidad de pueblos originarios + otras tierras fiscales + parques o reservas |
| `sup_departamento_ign_ha` | Superficie geodésica del polígono IGN (WGS84) |
| `pct_departamento_en_eap` | `sup_total_ha / sup_departamento_ign_ha`. Puede superar 100, porque las EAP se asignan por sede |

**Categoría usada para "fiscal".** En C3.1 es el "Tipo de dominio = FISCAL", con todos sus regímenes. No incluye la ocupación de hecho sobre tierra privada ni los TSL, que no tienen hectáreas. Los TSL fiscales van aparte, como conteo.

**Cifras clave (calculadas del CSV).**

Fiscal por provincia, en ha y en porcentaje de la superficie EAP:

| Provincia | Superficie fiscal (ha) | % de la superficie EAP |
|---|---|---|
| Chubut | 1.029.651 | 6,1 % |
| Neuquén | 904.788 | 24,0 % |
| Formosa | 844.597 | 19,0 % |
| Río Negro | 589.977 | 5,2 % |
| Santiago del Estero | 578.420 | 9,4 % |
| Chaco | 295.268 | 5,1 % |
| Jujuy | 228.766 | 14,9 % |
| Misiones | 133.498 | 7,2 % |
| Mendoza | 120.721 | 2,0 % |
| Salta | 81.878 | 1,9 % |
| Santa Cruz | 46.458 | 0,4 % |
| Corrientes | 37.294 | 0,6 % |

Departamentos con más hectáreas fiscales:

| Departamento | Superficie fiscal (ha) | % de la superficie EAP |
|---|---|---|
| Bermejo (Formosa) | 313.599 | 50,7 % |
| Añelo (Neuquén) | 310.781 | 47,7 % |
| Gastre (Chubut) | 253.041 | 19,5 % |
| Patiño (Formosa) | 250.753 | 14,4 % |
| Copo (Santiago del Estero) | 191.423 | 54,0 % |
| Languiñeo (Chubut) | 177.095 | 16,8 % |
| Matacos (Formosa) | 170.235 | 97,1 % |
| Cushamen (Chubut) | 157.099 | 18,4 % |
| Pehuenches (Neuquén) | 148.309 | 63,3 % |
| Valcheta (Río Negro) | 144.284 | 9,9 % |

El dato de Santa Cruz (0,4 %) muestra el sesgo de la fuente: casi toda la tierra fiscal santacruceña está **fuera** de las EAP. Por ejemplo, en Deseado solo el 42 % del departamento está en EAP.

---

## 4. Qué se puede medir y qué no

| Pregunta | ¿Se puede? | Con qué |
|---|---|---|
| Porcentaje de tierra agropecuaria en dominio fiscal por departamento | **Sí** | CNA 2018 (C3.1) |
| Tierra fiscal **ocupada** por pobladores (con permiso o de hecho) | **Sí**, por departamento, en ha | CNA 2018 (`sup_fiscal_ocupacion_*`) |
| Tierra fiscal **vacante** (fuera de EAP) | **No directamente**. Hay un proxy débil: `100 − pct_departamento_en_eap`, que mezcla tierra fiscal vacante, áreas protegidas, urbano, lagos, salinas y EAP asignadas a otro departamento | CNA + IGN. Solo en TDF hay un polígono oficial |
| Polígonos de tierra fiscal provincial | Solo **Tierra del Fuego** | WFS de TDF |
| Inmuebles del Estado Nacional (inventario completo) | **No** (SIENA/RENABE cerrado) | Solo subastas de la AABE (370 puntos) y el Decreto 950/2024 (309 inmuebles) |
| Inmuebles militares | Ubicación en puntos (152), sin superficie | IGN |
| Inmuebles ferroviarios en desuso | Estaciones en puntos (2.672). El estado depende del código `fun`, que no verifiqué. Sin inventario de ADIF | IGN, Decreto 950 |
| Porcentaje extranjerizado por departamento | **Sí** (agosto de 2025) | RNTR |
| Comunidades indígenas con relevamiento | **Sí**, en puntos (978 culminados) | Mininterior 2025 |
| Territorio indígena relevado (polígono o ha) | **No** (solo mapa PDF del INAI) | — |
| Barrios populares (tierra ocupada) | **Sí**, en polígonos | RENABAP |
| Titularidad parcela por parcela (fiscal o privada) | **No** a escala nacional. Hay catastros provinciales abiertos sin campo de dominio (por ejemplo, el parcelario rural de TDF) | — |

---

## 5. Indicadores propuestos para la app

Todos se pueden unir por `cod_dep` (INDEC de 5 dígitos) con `ign_departamento.json`.

| Indicador | Fórmula | Fuente | Uso en el score |
|---|---|---|---|
| `pct_fiscal_eap` | `sup_fiscal_ha / sup_total_ha` | CNA 2018 | Disponibilidad de suelo público (+). Es un piso, no el total |
| `ha_fiscal_eap` | `sup_fiscal_ha` | CNA 2018 | Escala absoluta de tierra pública rural |
| `pct_fiscal_ocupada` | `(fiscal_ocupacion_permiso + fiscal_ocupacion_hecho) / sup_fiscal_ha` | CNA 2018 | **Alerta social** (−): tierra fiscal con pobladores que tienen derechos posesorios |
| `pct_dep_fuera_eap` | `100 − min(100, pct_departamento_en_eap)` | CNA + IGN | Proxy de tierra sin uso agropecuario (posible fiscal vacante). Usar solo como pista y cruzarlo con áreas protegidas (`ign_area_protegida.json`) |
| `tsl_fiscales` | Conteo de TSL comunales, indígenas, fiscales o parques | CNA 2018 | Alerta: presencia de tierras sin mensura o comunales |
| `n_inmuebles_aabe_Xkm` | Cantidad de subastas de la AABE vigentes o futuras (o renglones del Decreto 950) a menos de X km del sitio candidato | AABE | Tierra nacional disponible para la venta (+) |
| `dist_estacion_ferroviaria_km` | Distancia a la estación más cercana (y a una con `fun` de "no operativa", una vez validado el código) | IGN | Posibles playas ferroviarias desafectables |
| `dist_instalacion_militar_km` | Distancia a la instalación militar más cercana | IGN | Contexto (predios de Defensa) |
| `pct_extranjerizado` | `sup_extranjera_ha / sup_rural_ha` | RNTR 2025 | Contexto o restricción. Si supera 15 %, hay restricción a nuevas adquisiciones extranjeras (si la ley está vigente) |
| `n_comunidades_relevamiento` | Comunidades con relevamiento culminado en el departamento, o a menos de X km | Mininterior 2025 | **Restricción fuerte** (consulta previa, ver §6) |
| `n_comunidades_total` | Incluye "sin relevar" y "en trámite" (archivo de 2024) | Justicia 2024 | Restricción fuerte |
| `ha_barrios_populares` | Superficie RENABAP en el departamento (join espacial) | RENABAP | Tierra ocupada; excluirla |
| `ha_fiscal_poligono` | Hectáreas de polígono fiscal provincial dentro del radio | WFS TDF (ampliable a otras provincias) | Disponibilidad real (+), solo donde exista |

Recomendación de uso: tratar `pct_fiscal_eap` y los inmuebles de la AABE como **señales de oportunidad**, y la presencia indígena, los barrios populares y la ocupación fiscal como **restricciones o banderas**, no como pesos compensables. Una ciudad nueva sobre tierra fiscal ocupada o indígena no es "tierra disponible".

---

## 6. Advertencias legales

1. **Dominio originario provincial (arts. 121 y 124 CN).** Desde 1994 los recursos naturales son de dominio originario de las provincias, y las tierras fiscales rurales son mayormente provinciales. El Estado Nacional solo dispone de lo que está registrado a su nombre (SIENA/RENABE). Una ciudad nueva sobre tierra fiscal provincial requiere ley o decreto provincial y, normalmente, la creación de un municipio o comuna según la constitución provincial.
2. **Ley 26.160 (emergencia territorial indígena).** Ordenó relevar los territorios y suspendió los desalojos. Según los fundamentos de un proyecto de ley de 2026 en la HCDN, el **DNU 1083/2024 dio por finalizada la emergencia** sin que el relevamiento estuviera completo, y hay proyectos para derogarlo y prorrogar la ley hasta 2029. **No pude confirmar si se sancionaron.** Sea cual sea el estado de la 26.160, siguen vigentes:
   - el **art. 75 inc. 17 CN**, que reconoce la posesión y propiedad comunitaria de las tierras que ocupan tradicionalmente;
   - el **Convenio 169 de la OIT** (Ley 24.071), que exige consulta previa, libre e informada;
   - el art. 18 del Código Civil y Comercial.

   Un relevamiento "culminado" documenta la ocupación, pero no otorga título. Que una comunidad no tenga relevamiento no significa que no tenga derechos.
3. **Ley 26.737 (tierras rurales).** Limita la titularidad extranjera al 15 % por departamento, provincia y país, con un máximo de 1.000 ha en la zona núcleo o su equivalente, y prohíbe la adquisición extranjera de inmuebles que contengan o sean ribereños de cuerpos de agua permanentes. El art. 154 del DNU 70/2023 la derogó. Su vigencia **cambió varias veces en octubre de 2026**: el 1/10 la Corte revocó un fallo de la Cámara de La Plata, y el 9/10 dictó una cautelar interina que suspende el art. 154 y repone provisoriamente los límites. Hay que verificar el estado al momento de usarla. Es relevante si los inversores o pobladores de una ciudad nueva son extranjeros.
4. **Tierras fiscales ocupadas por pobladores ("fiscaleros").** En la Patagonia, el NOA y el Chaco hay miles de ocupantes con permiso precario o posesión de décadas, con derecho a adjudicación según las leyes provinciales. Por ejemplo, la Ley 5705 de Río Negro prevé prórrogas de ocupación y adjudicación tras cinco años. El CNA muestra que en Neuquén, Formosa, Chubut y Río Negro buena parte de la tierra fiscal en EAP está **ocupada**. Esa tierra no está vacante: tiene poseedores con derechos (prescripción adquisitiva, arts. 1897 y siguientes del CCyC, cuando la tierra es privada; regímenes de adjudicación provinciales cuando es fiscal).
5. **Bienes del Estado Nacional.** Su venta o transferencia requiere declararlos "innecesarios" y desafectarlos (Decreto 1382/2012, Decreto 2670/2015 y Decreto 950/2024). Las cesiones a provincias y municipios para urbanización existen, pero requieren un acto administrativo específico.
6. **Áreas protegidas y bosques.** La Ley 26.331 de bosques nativos y la Ley 22.351 de parques nacionales restringen el uso del suelo aunque la tierra sea fiscal. Hay que cruzar los datos con `ign_area_protegida.json` (ya disponible en `data/raw/`).
7. **Zonas de seguridad de frontera.** El Decreto-Ley 15.385/44 exige autorización previa para adquirir inmuebles en zona de frontera, lo que afecta a gran parte de la Patagonia andina, Misiones, Formosa y Salta. No relevé datos geográficos de esta zona.

---

## 7. Pendientes y recomendaciones

- Pedir por **acceso a la información pública** (Ley 27.275):
  - a la AABE, el extracto del RENABE/SIENA con CIE, superficie, jurisdicción, estado de ocupación y polígono;
  - a ADIF, el inventario de inmuebles ferroviarios sin uso operativo;
  - al INAI, los polígonos del ReTeCI. Por la sensibilidad de estos datos, conviene pedirlos con fines agregados.
- Ampliar la búsqueda de catastros provinciales abiertos con el buscador de geoservicios de IDERA, que no se pudo consultar desde este entorno. Hay que confirmar las capas con GetCapabilities antes de usarlas.
- Confirmar el diccionario del campo `fun` del IGN (estaciones).
- Repetir el proceso del CNA 2018 con los cuadros de tipo jurídico del productor o de escala de extensión, si se quiere medir la **concentración de la tierra**: la fuente es el mismo sistema de consultas, categoría 1.

---

## 8. Archivos

```
data/raw/tierra/
├── cna2018_tenencia_departamento.csv        # tabla limpia (512 × 32)
├── cna2018/c31_raw.csv c32_raw.csv c33_raw.csv   # cuadros C3.x parseados (provincias + deptos)
├── cna2018/html/c3{1,2,3}_provNN.html        # HTML crudo del sistema de consultas INDEC (72)
├── cna2002/cna2002rtt.csv referencias.csv
├── aabe/aabe_subastas_listado.json           # 370 subastas AABE con lat/lon
├── aabe/decreto_950_2024_anexo.pdf/.txt
├── aabe/decreto_950_2024_anexo_inmuebles.csv # 57 renglones / 309 inmuebles
├── rntr/rntr_extranjerizacion_departamento.pdf/.txt
├── rntr/rntr_extranjerizacion_departamento_2025-08.csv
├── indigenas/comunidades_indigenas_mininterior_20251112.csv
├── indigenas/comunidades_indigenas_jus_20240223.csv
├── indigenas/comunidades_por_departamento_mininterior_202511.csv
├── indigenas/inai_mapa{comunidades,pueblos,territorios}092024.pdf
├── renabap/barrios.geojson barrios_datos.csv referencias.csv
├── ign/ign_instalacion_militar_SU001.json ign_puntos_de_transporte_ferroviario_AN070.json
├── ign/ign_areas_de_asentamientos_y_edificios_020105.json
├── provincias/tdf/tdf_tierras_fiscales_provinciales.geojson (+ parcelario rural, ejidos, militar, comunidad)
└── literatura/ (Sili 2006 y 2012, ATE 2022, INDEC CNA 2018 resultados definitivos)
pipeline/tierra/parse_cna.py build_cna.py parse_rntr.py d950.py
```

---

## 9. Profundización (21/10/2026)

Esta sección amplía el relevamiento en cuatro líneas: catastros provinciales, cifras oficiales por provincia, inmuebles del Estado Nacional y una estimación de tierra probablemente fiscal por complemento. Todo lo que es estimación propia está marcado **[J]**. Scripts nuevos (no se tocó `build.py`):

- `pipeline/tierra/fiscal_espacial.py`: máscaras, polígonos fiscales y métricas por departamento.
- `pipeline/tierra/fiscal_estimacion.py`: inmuebles nacionales, calibración y estimación por departamento.
- `pipeline/tierra/fiscal_provincias.py`: tabla de cifras por provincia.

Se corren en ese orden con `python -I <script> <raíz del repo>`.

### 9.1 Resultado principal

| Indicador (país, sin Antártida, Islas del Atlántico Sur ni CABA; 277,9 Mha) | Hectáreas | % |
|---|---|---|
| Fiscal dentro de EAP (CNA 2018) | 5.190.745 | 1,9 % |
| **Bajo**: documentado = max(fiscal en EAP, catastro fiscal) + Estado Nacional con superficie | 7.536.716 | 2,7 % |
| **Central [J]**: bajo + fracción calibrada del residuo fuera de EAP | 47.301.379 | 17,0 % |
| **Alto [J]** | 73.130.007 | 26,3 % |

- **Hallazgo nuevo: el catastro de Neuquén publica la fiscalidad parcela por parcela.** Expone el servicio ArcGIS REST `https://catastro.neuquen.gov.ar/nqn_ide/rest/services/Informacion/MapServer`, con el campo `FISCALIDAD` (FISCO PROVINCIAL, MUNICIPAL, NACIONAL, NO FISCAL o NO SE PUEDE DETERMINAR). Es el primer catastro provincial con titularidad abierta después del de Tierra del Fuego.
  - Hay **2.084.240 ha fiscales en parcelas rurales**: 2.011.752 provinciales, 50.860 nacionales y 8.550 municipales en la capa rural extensiva, más 13.709 en la rural intensiva.
  - Frente a eso, el CNA 2018 registra 904.787 ha fiscales en EAP en Neuquén. **Aun dentro de lo mensurado, el CNA capta menos de la mitad de la tierra fiscal.**
  - Además hay 2.431.800 ha **sin parcela ni ejido** fuera de las áreas protegidas y del agua. Es probablemente tierra fiscal sin mensura [J], equivalente a la categoría "tierras fiscales sin mensura" de la capa de TDF.
  - Suma: ≈ 4,5 Mha, es decir **48 % de la provincia**. Es coherente con el "50 % de la superficie provincial son tierras fiscales" que publicó La Nación (1998).
- **La calibración converge.** La proporción del residuo fuera de EAP que resulta fiscal es **0,729 en Neuquén y 0,734 en Tierra del Fuego (Isla Grande)**, medida en dos catastros independientes (`_calibracion_catastro.csv`).
- **Validación contra cifras oficiales.**
  - Río Negro: estimación central de 5,25 Mha (rango 0,59–6,64), contra 4,8 Mha de "tierras denominadas fiscales" (Legislatura, 2014). Además hay 2,37 Mha sin mensura y 4 Mha ocupadas sin regularizar (Dirección de Tierras y Catastro, 2026).
  - Jujuy: central de 0,96 Mha (alto 1,66), contra 1,28 Mha de tierras fiscales rurales del convenio de la Ley 5030.
  - Salta: las parcelas del catastro llamadas "FISCAL 14" y "FISCAL 55" suman 621.733 ha, contra las 643.000 ha oficiales de los ex lotes fiscales 14 y 55.

### 9.2 Catastros e IDE provinciales (línea 1)

Método: el buscador de IDERA está alojado en `https://opendata.fi.uncoma.edu.ar/IDERA/TableroWFSProvincias.html` (tablero del 03/10/2026, enlazado desde `idera.gob.ar/index.php/servicios/geoservicios`). Extraje sus tablas embebidas, que listan 3.992 capas WFS provinciales con atributos, y las guardé en `data/raw/tierra/idera/idera_tablero_wfs_provincias_capas.txt`. Busqué en nombres y atributos las palabras fiscal, titular, dominio, tierras, colonia y parcela, y después probé cada candidato en vivo.

| Provincia | Servicio | Capa / atributo | Resultado |
|---|---|---|---|
| **Neuquén** | ArcGIS REST `catastro.neuquen.gov.ar/nqn_ide/rest/services/Informacion/MapServer/2` (rural intensiva) y `/3` (rural extensiva), `Fiscalidad/MapServer/0`, `IDE/Catastro/MapServer` (WFS) | `FISCALIDAD`, `TIPO_PARCELA`, `INFO_TITULO`, `PROCEDENCIA` | ✅ Descargué 2.975 parcelas rurales extensivas, 1.337 rurales intensivas fiscales, 3.602 rurales intensivas no fiscales y 68 ejidos (`data/raw/tierra/provincias/neuquen/`). Las parcelas urbanas fiscales salen de las estadísticas del servicio: provincial 2.431 ha, municipal 3.019 ha y nacional 403 ha. El servidor resetea conexiones; hay que usar reintentos |
| **Tierra del Fuego** | WFS `geonode:tierras_fiscales_provinciales` | `clas_titul` | ✅ Ya estaba descargada. Medida dentro de la provincia: 759.168 ha, de las cuales 691.815 son "sin mensura" |
| **Río Negro** | IDERN `idern.rionegro.gov.ar/geoserver` | `geonode:par_tit_estatal`: **parcelas de titularidad estatal** con `TITULAR1`, `OCUPANTE`, `POSEEDOR`, `ADJUDICATA` y `CONCESIONA`. También `SUELO_URBANO`, con `Titula` | ❌ La capa existe en el catálogo de IDERA, pero el GeoServer devuelve un error interno (`relation "public.gf_rule_limits" does not exist`) en todo GetFeature y GetMap. La API GeoNode no la lista como pública. Hay que pedirla a la IDERN o a la Agencia de Recaudación Tributaria |
| **Salta** | `geoportal.salta.gob.ar/geoserver/wfs`, `geonode:fc_parcelas_v20` (315.533 parcelas) | sin campo de dominio. Hay `finca`, `categoria` y `catastro` | ⚠️ Filtré con `finca ILIKE '%fiscal%'`: 630 parcelas que suman 3.526.657 ha. Destacan "FISCAL 63", una parcela de 2,38 Mha en Los Andes, y "FISCAL 14" y "FISCAL 55" en Rivadavia. **El nombre indica el origen como lote fiscal, no la titularidad actual** (los lotes 14 y 55 están en proceso de titulación a favor de comunidades y criollos) |
| Chubut | `sit.chubut.gov.ar/geoserver/wfs`: `Chubut:ParcelasRurales` (`TIPO_PARCELA`, `COLONIA`, `SUP_MENSURA`; **sin titular**) | — | ❌ 503 / connection reset desde el proxy. Aunque respondiera, la capa no informa el dominio |
| La Pampa | `geoidelp.lapampa.gob.ar/geoserver/p_dirg_catastro` (parcelario por sección, `cca`, `pda`, `tpa`, `ara`) | sin dominio | ❌ connection reset |
| Córdoba | IDECOR `idecor:parcelas` | valuación, sin dominio | ✅ responde, sin titularidad |
| Chaco | `idechaco.gob.ar/geoserver/idechaco` (998 capas): solo asentamientos con campo `dominio` | — | ❌ 503 |
| Santa Cruz (SITU), Corrientes, Catamarca (`nodoide`, detrás de Cloudflare), Mendoza (`atmgis`/`siat`: no resuelven), San Juan, San Luis, La Rioja, Jujuy, Formosa, Santiago del Estero, Misiones | — | — | ❌ No hay capas de dominio en el tablero de IDERA. Los hosts candidatos responden 502 o no resuelven |

### 9.3 Cifras oficiales por provincia (línea 2) → `fiscal_provincias.csv`

| Provincia | Cifra | Año | Fuente |
|---|---|---|---|
| Río Negro | 4.800.000 ha "denominadas fiscales" | 2014 | Legislador J. Ocampos, ANBariloche 05/05/2014 |
| Río Negro | 4.000.000 ha ocupadas sin regularizar y 2.368.100 ha sin mensura | 2026 | Diario Río Negro 27/04/2026 (Dir. de Tierras y Catastro) |
| Río Negro (Meseta / Región Sur) | 3.400.000 ha (~30 % de la región) | 2006 | Sili (2006) |
| Patagonia | 2.500.000 ha (fiscal en EAP, base CNA 2002) | 2012 | Sili y Li (2012) |
| Neuquén | 50 % de la superficie provincial | 1998 | La Nación |
| Neuquén | 2.084.240 ha en parcelas rurales fiscales y ~5.850 ha urbanas | 2026 | catastro provincial (cálculo propio) |
| Mendoza | 792.000 ha sin regularizar (> 5 % de la provincia) | 2012 | Gobierno de Mendoza (prensa). Según el BO, no hay inventario completo |
| Jujuy | 1.283.300 ha fiscales rurales y 15.583 parcelas urbanas a regularizar a favor de comunidades | 1996/2000 | Ley 5030 y protocolo, citados en el informe de la SDH (2023) |
| Salta | 643.000 ha (ex lotes fiscales 14 y 55) | 2020 | Memo del Estado Nacional sobre la sentencia de la Corte IDH Lhaka Honhat |
| Tierra del Fuego | 759.168 ha | 2026 | WFS provincial (cálculo propio) |
| Chubut, Santa Cruz, La Pampa, San Juan, San Luis, La Rioja, Catamarca, Formosa, Chaco, Santiago del Estero, Corrientes, Misiones | **sin cifra oficial encontrada** | — | Se buscaron informes de las direcciones de tierras (IACyFR de Chubut, CAP de Santa Cruz, institutos de colonización de Chaco y Formosa) y las leyes de tierras: ninguna publica un total. Santiago del Estero: unos 24.000 poseedores expuestos a desalojo (Defensor del Pueblo, citado por FLACSO) |

La Ley 279 de Río Negro fue reemplazada por la Ley 5705 (2023), reglamentada por el Decreto 423/2025. No encontré pedidos de acceso a la información pública ya respondidos con cifras de superficie fiscal. El CSV también incluye el fiscal en EAP del CNA por provincia, las superficies de catastro y la estimación central de este trabajo, para poder compararlas.

### 9.4 Inmuebles del Estado Nacional (línea 3) → `inmuebles_estado.geojson`

- **AABE / RENABE / SIENA.**
  - La API CKAN de datos.gob.ar no tiene ningún dataset de inmuebles del Estado: probé "inmuebles", "bienes del estado", "AABE", "RENABE", "SIENA", "inmuebles del estado", "tierras fiscales" y "catastro", y ninguna búsqueda devuelve resultados relevantes.
  - Los hosts `siena.`, `visor.`, `mapa.`, `geo.` y `datos.bienesdelestado.gob.ar` no responden desde el proxy.
  - Los informes presupuestarios de la AABE de 2023 y 2024 (`data/raw/tierra/aabe/memorias/`) no informan superficie total.
  - El inventario sigue siendo cerrado. En el archivo se incluyen las 370 subastas y los 57 renglones del Decreto 950/2024, de los cuales 18 son ferroviarios y 7 tienen croquis con superficie.
- **Defensa.**
  - Hallazgo: **18 polígonos de Reservas Naturales de la Defensa** (WFS de Ambiente, `areas_protegidas:reserva_natural_defensa`), con **390.620 ha declaradas**. Las más grandes son Uspallata (215.375 ha), Estancia Los Manantiales en San Juan (121.400 ha) y La Calera (13.628 ha).
  - Las 152 instalaciones militares del IGN son solo puntos y no incluyen Campo de Mayo.
  - Cifras sin geometría: Campo de Mayo, 5.000 ha (El País 2018, vía Wikipedia); terrenos del Ejército en Córdoba, 13.360 ha (HCDN 4985-D-2025).
  - La UAI de Defensa (Informe 08/2020) cuenta 84 inmuebles desafectados, sin superficie.
  - No encontré la superficie total de las Fuerzas Armadas ni datos de Magdalena, Puerto Belgrano o Holmberg.
- **Ferrocarriles.** Hay 3.287 estaciones de la IDE de Transporte (`idera:Estacion_Ferroviaria`), con `linea` y `gna`. No tienen atributo de uso ni de superficie, y ADIF no publica un inventario. Nota técnica: el certificado de `ide.transporte.gob.ar` no envía la cadena intermedia, así que agregué el intermedio "YR2" de Let's Encrypt (`http://yr2.i.lencr.org/`) a una copia del bundle de CA. La verificación TLS siguió activa.
- **INTA.**
  - 381 unidades (WFS `geo-nodo07.inta.gob.ar`, `geonode:unidades_inta_01`): 46 EEA, 15 centros regionales y 319 AER. Las columnas `point_x` y `point_y` del servicio están corridas, pero la geometría es correcta.
  - Superficie de 23 campos según el plan INTA/AABE (Bichos de Campo, 20/11/2024): 30.874 ha, de las cuales 27.019 se proponen para desafectar. Se cargaron en 18 EEA y en 5 registros sin geometría.
  - Hay una segunda lista de unas 100.000 ha, que incluye 45.149 ha en la AER Santa Victoria Oeste (Salta), y un documento de diciembre de 2025 que habla de 42.000 ha.
- **Aeropuertos (ORSNA).** La capa "predios aeropuertos" de datos.gob.ar publica 55 **puntos**, no polígonos, así que no tienen superficie.
- **Universidades nacionales.** No encontré un dataset de campos universitarios con superficie. Las capas `mardis_universidadesnacionales` y `mineduc_universitarioestatal` solo ubican sedes.

Campos del archivo: `categoria` (militar, aabe, ferroviario, inta, aeroportuario), `subcategoria`, `nombre`, `titular`, `superficie_ha`, `superficie_origen`, `estado`, `provincia`, `fuente`, `url` y `cod_dep`. Son 4.327 registros; 57 no tienen geometría porque solo hay cifras de prensa o renglones del Decreto 950 sin croquis.

### 9.5 Tierra probablemente fiscal por complemento (línea 4) → `fiscal_departamento.csv`

**Supuesto.** En las zonas áridas, la superficie del departamento que no está en EAP, no es urbana, no es agua o salina y no es área protegida tiende a ser fiscal o a tener una situación dominial irregular.

**Evidencia a favor.**

1. Por definición, el CNA solo censa EAP con producción. La tierra fiscal vacante queda afuera (INDEC, metodología). Sili y Li (2012) estiman 2,5 Mha fiscales patagónicas "ocupadas", pero aclaran que millones de hectáreas más siguen siendo provinciales.
2. Los dos catastros con titularidad abierta dan la misma proporción: **0,73** en Neuquén y en TDF.
3. Las 2,37 Mha sin mensura de Río Negro (2026) están en las zonas con menos EAP (Somuncurá, El Cuy).

**Evidencia en contra.**

1. Campos privados abandonados en la meseta patagónica.
   - Federación de Sociedades Rurales de Chubut: el 40 % de los establecimientos de la meseta central están inactivos. Fuente: Bichos de Campo, "Si queremos mantener la soberanía sobre la Patagonia…".
   - FIAS (Santa Cruz) habla de campos "en situación de abandono" (Bichos de Campo, 16/08/2026).
   - Esos campos son privados, pero ya no son EAP.
2. Campos comuneros e indivisos (condominios privados) en La Rioja, Catamarca y Santiago del Estero. Aparecen en el CNA como TSL sin hectáreas.
3. Las EAP se asignan al departamento de la sede, lo que genera falsos residuos y falsos negativos entre departamentos vecinos.
4. Tierras indígenas con relevamiento o con título comunitario.

**Fórmula [J].** Para cada departamento:

- `residuo = max(0, sup_dep − EAP − (protegidas ∪ urbano ∪ agua perenne ∪ salinas))`.
- `documentado = max(fiscal_EAP, catastro_fiscal) + nacional_fuera_de_catastro`, donde "nacional" suma RND, INTA, subastas vigentes de la AABE y Decreto 950.
- `estimación = documentado + f × residuo_neto`, con `residuo_neto = residuo − catastro fiscal que excede el fiscal en EAP`.

Valores de `f` (bajo / central / alto):

- Patagonia: 0 / **0,731** (media de la calibración) / 0,95.
- Árido y norte (Mendoza, San Juan, La Rioja, Catamarca, Salta, Jujuy, Formosa, Chaco, Santiago del Estero, La Pampa, San Luis, Tucumán): 0 / 0,366 (la mitad del valor patagónico, porque pesan los campos comuneros) / 0,731.
- Región húmeda: 0 / 0,10 / 0,25.

Casos especiales:

- **Neuquén**: la estimación central es catastro fiscal más la superficie sin parcela fuera de máscaras.
- **TDF**: la estimación central es la capa provincial.
- **Salta**: en el central y el alto, el piso es max(documentado, parcelas "finca FISCAL").
- Antártida, Islas del Atlántico Sur y CABA no tienen estimación.

Por región (estimación central): Patagonia 20,8 Mha (26 %), árido y norte 24,7 Mha (21 %), húmeda 1,8 Mha (2 %).

| Provincia | Fiscal en EAP (CNA) | Catastro fiscal | Estado Nacional | Bajo | **Central [J]** | Alto [J] | % central |
|---|---|---|---|---|---|---|---|
| Santa Cruz | 46.458 | — | 15 | 46.473 | 6.581.258 | 8.533.350 | 27 % |
| Salta | 81.878 | — | 0 | 81.878 | 5.790.661 | 8.062.436 | 37 % |
| Río Negro | 589.976 | — | 321 | 589.976 | 5.247.910 | 6.639.342 | 26 % |
| Neuquén | 904.787 | 2.079.714 | 52.125 | 2.130.460 | 4.562.261 | 5.417.197 | 48 % |
| Chubut | 1.029.651 | — | 8.690 | 1.038.341 | 3.605.635 | 4.372.546 | 16 % |
| Santiago del Estero | 578.420 | — | 7.475 | 585.895 | 3.090.697 | 5.595.499 | 23 % |
| Mendoza | 120.721 | — | 233.505 | 354.226 | 2.688.817 | 5.023.406 | 18 % |
| Catamarca | 3.497 | — | 0 | 3.497 | 2.676.167 | 5.348.839 | 26 % |
| San Juan | 10.737 | — | 124.171 | 134.908 | 2.121.233 | 4.107.561 | 24 % |
| La Rioja | 4.489 | — | 0 | 4.489 | 2.100.613 | 4.196.732 | 23 % |
| Formosa | 844.597 | — | 0 | 844.597 | 1.687.896 | 2.531.198 | 22 % |
| Chaco | 295.268 | — | 0 | 295.268 | 1.622.976 | 2.950.680 | 16 % |
| La Pampa | 71.122 | — | 3.752 | 74.874 | 1.187.940 | 2.301.005 | 8 % |
| Jujuy | 228.764 | — | 0 | 228.764 | 957.208 | 1.664.398 | 18 % |
| Tierra del Fuego (Isla Grande) | 67.648 | 755.336 | 0 | 755.336 | 755.336 | 762.882 | 36 % |
| Buenos Aires | 80.238 | — | 6.669 | 86.907 | 624.719 | 1.431.426 | 2 % |
| San Luis | 1.454 | — | 1.011 | 2.465 | 494.114 | 985.762 | 7 % |
| Córdoba | 23.049 | — | 19.398 | 42.447 | 341.161 | 789.230 | 2 % |
| Santa Fe | 27.362 | — | 6.587 | 33.949 | 318.088 | 744.293 | 2 % |
| Tucumán | 2.330 | — | 4.885 | 7.215 | 290.307 | 573.396 | 13 % |
| Misiones | 133.500 | — | 8.420 | 141.920 | 214.650 | 323.750 | 7 % |
| Corrientes | 37.294 | — | 6.300 | 43.593 | 191.860 | 414.258 | 2 % |
| Entre Ríos | 7.505 | — | 1.733 | 9.238 | 149.872 | 360.821 | 2 % |

Departamentos con mayor estimación central: Los Andes, Salta (2,37 Mha, la parcela "FISCAL 63"); Deseado, Santa Cruz (2,34 Mha); Rivadavia, Salta (1,14 Mha); Río Chico, Santa Cruz (1,05 Mha); 25 de Mayo, Río Negro (0,98 Mha); Malargüe, Mendoza (0,97 Mha); Antofagasta de la Sierra, Catamarca (0,88 Mha).

### 9.6 Limitaciones

1. **La estimación central y la alta son modelos [J], no inventarios.** La calibración se basa en dos provincias patagónicas, y el factor del norte no está calibrado. Santa Cruz y Chubut probablemente están sobreestimadas por los campos privados abandonados. Para Santa Cruz conviene leer el rango completo.
2. El residuo resta las áreas protegidas completas. Algunas incluyen estancias privadas en EAP, como Península Valdés, y eso subestima el residuo. Algunas RND también están en la capa IGN de protegidas (por ejemplo, Punta Delgada y Primeros Pinos): en esos casos quedan fuera del residuo y se cuentan solo como superficie nacional.
3. La superficie EAP se asigna por sede: hay departamentos con EAP mayor al 100 % (residuo 0) y vecinos con residuo inflado.
4. El catastro de Neuquén no es una foto oficial de "tierra disponible": las parcelas fiscales incluyen permisos de ocupación y concesiones hidrocarburíferas, y la superficie "sin parcela" es una inferencia [J].
5. En Salta, el nombre "FISCAL" de la finca no prueba la titularidad actual. Por eso no entra en la estimación baja.
6. El INTA se asigna al departamento de la sede de la EEA, no al del campo. Las superficies del INTA y de los predios militares sin geometría vienen de prensa o de documentos internos filtrados.
7. Las tierras fiscales **no están vacantes**: cruzar siempre con ocupantes (CNA: `sup_fiscal_ocupacion_permiso_ha` y `sup_fiscal_ocupacion_hecho_ha`, incluidas en el CSV), comunidades indígenas (§2.8) y barrios del RENABAP.

### 9.7 Archivos nuevos

```
data/interim/tierra/
├── fiscal_departamento.csv      # 529 deptos; columnas pedidas + auxiliares (region, sup_eap_ha, máscaras, residuo_ha,
│                                #  sup_sin_parcela_catastro_ha, sup_rnd_ha, sup_inta_ha, sup_aabe_ha, sup_salta_finca_fiscal_ha, ocupación fiscal, tsl)
├── fiscal_poligonos.gpkg        # capa fiscal_poligonos: 3.756 polígonos (Neuquén, TDF, Salta 'finca FISCAL', RND);
│                                #  origen, titular, superficie_ha, fuente, provincia, cod_dep, detalle
├── inmuebles_estado.geojson     # 4.327 registros nacionales (militar, aabe, ferroviario, inta, aeroportuario)
├── fiscal_provincias.csv        # 85 filas: provincia, jurisdiccion, hectareas_fiscales, pct_superficie_provincial, anio, tipo_cifra, fuente, url, nota
├── _calibracion_catastro.csv    # ratio fiscal/residuo en Neuquén y TDF
└── _metricas_departamento.parquet
data/raw/tierra/
├── provincias/neuquen/          # nqn_rue_*.geojson, nqn_rui_fiscal.geojson, nqn_rui_nofiscal_*.geojson, nqn_ejidos.geojson, nqn_fiscalidad_stats_depto.json
├── provincias/salta/salta_parcelas_finca_fiscal.geojson
├── nacion/                      # rnd_reservas_naturales_defensa, orsna_predios_aeropuertos_sna, inta_unidades, transporte_estacion_ferroviaria, defensa/uai_defensa_inf08_2020_inmuebles.pdf
├── ign/ign_areas_de_aguas_continentales_perenne.json, ign_edafologia_salina.json
├── aabe/memorias/aabe_2023.pdf, aabe_2024.pdf
└── idera/idera_tablero_wfs_provincias_capas.txt
```

### 9.8 Pedidos de acceso a la información sugeridos (Ley 27.275 y leyes provinciales)

- **IDERN / ART Río Negro**: exportar la capa `par_tit_estatal`. Ya existe en su GeoServer.
- **IACyFR Chubut**: agregar el atributo de dominio a `Chubut:ParcelasRurales`.
- **Consejo Agrario Provincial de Santa Cruz**: el registro de tierras fiscales.
- **Catastro de Salta**: un campo de titular (fiscal o privado) en `fc_parcelas_v20`.
- **AABE**: el extracto del RENABE con CIE, superficie y polígono.
- **Ministerio de Defensa**: el inventario de inmuebles asignados a las Fuerzas Armadas, con superficie.
- **ADIF**: los inmuebles ferroviarios sin uso operativo.
