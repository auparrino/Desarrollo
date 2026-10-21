# Poblaciones (ODSA-UCA / CONICET): repositorio, API y capas para la grilla H3

Poblaciones (https://poblaciones.org) es la plataforma abierta de datos espaciales de población de
la Argentina. La desarrollan el Observatorio de la Deuda Social Argentina (UCA) y el CONICET. Este
documento cuenta qué hay en el código abierto, dónde están los datos, cómo se descargan y qué capas
conviene sumar a nuestra grilla H3 (res. 6, ~36 km²).

- Datos crudos descargados: `data/raw/poblaciones/` (fuera de git por `.gitignore`).
- Todas las URLs y llamadas de este documento se probaron con `curl` el 21/10/2026. Al lado de cada
  una figura el código HTTP obtenido. Las rutas que no aparecen acá no se probaron.

---

## 1. Repositorios

| Repositorio | Contenido | Licencia |
|---|---|---|
| [`poblaciones/poblaciones`](https://github.com/poblaciones/poblaciones) | Aplicación completa: backend PHP (`services/`), frontend Vue (`frontend/`) y esquema MySQL (`startup/dbscript-v4.9.sql`). Versión v5.6, último commit del 20/10/2026. | GPL-3.0 |
| [`poblaciones/tools`](https://github.com/poblaciones/tools) | Herramientas en C# y Python: `data-pack-manager` (administra geografías y regiones), `bcup` (backup y restore incremental de MySQL), `address-coder`, `wikimapia-getter` y `stress-tester`. | GPL-3.0 |
| [`poblaciones/data-packs`](https://github.com/poblaciones/data-packs) | Solo un README. Apunta a un zip externo, el *datapack* de Argentina. | GPL-3.0 |

**El repositorio no trae datos.** El SQL de `startup/` solo crea el esquema: 95 tablas y algunas
filas de configuración. La cartografía de base (geografías como radios, departamentos y provincias,
y las regiones de recorte) se distribuye aparte, en el datapack
`https://poblaciones.org/guias/poblaciones_arg_v5.4.zip` (HTTP 200, 1,30 GB, modificado el
02/06/2026). Es un volcado MySQL que se restaura con `bcup.py` y no lo descargamos. **Los
indicadores temáticos (las "cartografías" que suben los usuarios) no están en ningún repositorio:
viven en la base de producción y se obtienen por la API.**

Clones locales de solo lectura (fuera del repo): `/home/user/poblaciones-src`,
`/home/user/poblaciones-tools` y `/home/user/poblaciones-data-packs`.

## 2. Arquitectura

- **Backend.** PHP 7.4 sobre Silex/Symfony (`services/routes/*.php` → `services/src/services/...`),
  con MySQL 5.7 y una caché en disco (`services/storage`). Python 3 se usa para convertir a SPSS,
  Stata y R (`services/py/`).
- **Frontend.** SPA en Vue con Leaflet o Google Maps. Pide los tiles de datos y los JSON a la API.
- **Modelo de datos.**
  - *Work* ("cartografía"): una publicación con metadatos, autores y licencia. Tiene un id `w`.
  - *Dataset*: una tabla dentro del work. Tiene un id `d`.
  - *Metric* ("indicador"): tiene un id `l` y una o más *versions* (años), cada una con un id `v`.
  - *Level*: el nivel geográfico de una versión. Tiene un id `a`.
  - *Variables*: las variables de un nivel.
- **Geografía.** Cada dataset está georreferenciado de una de dos formas:
  - contra una geografía de base: Provincias, Departamentos o Radios censales (1991, 2001, 2010 y
    2022);
  - por coordenadas, como puntos ("Ubicaciones") o polígonos propios ("Zonas").
- **Servidores en producción** (según `GetConfiguration`):
  - `https://mapa.poblaciones.org`: visor (`/map/`). Su `/services/GetTransactionServer` devuelve
    `{"Server":"https://datos-poblaciones.conicet.gov.ar"}`.
  - **`https://datos-poblaciones.conicet.gov.ar`: servidor dinámico. Es la API real.**
  - `epu.poblaciones.org`, `kula.poblaciones.org` y `mapa-poblaciones.conicet.gov.ar`: servidores
    estáticos de tiles.
- **Delimitaciones disponibles** (las "boundaries", `GetFabBoundaries`):
  - Provincias (b=1, v=26), Municipios (2/20) y Gobiernos locales (19/21).
  - Regiones (3/3), Departamentos (4/25) y Regiones y zonas sanitarias (6/6).
  - Códigos postales (8/8), Regiones judiciales (20/22), Circunscripciones judiciales (21/23) y
    Regiones educativas (26/31).
  - Aglomerados (9/19), Zonas del conurbano (23/27), Barrios (10/10) y Localidades (11/24).
  - Climas (14/14), Climas agrupados (17/17), Eco-regiones (15/15), Sistemas de cuencas (18/18) y
    Cuencas (16/16).

## 3. Cómo acceder a los datos

### 3.1 Requisitos prácticos (todo esto se observó en las pruebas)

- **Hace falta un User-Agent de navegador.** Con el UA por defecto de curl, `mapa.poblaciones.org`
  responde `405 Method Not Allowed` (lo devuelve Cloudflare). Con un UA tipo Chrome y
  `Referer: https://mapa.poblaciones.org/map/` funciona.
- **Las llamadas `/services/...` van a `https://datos-poblaciones.conicet.gov.ar`.** Contra
  `mapa.poblaciones.org/services/GetConfiguration` la respuesta fue 405, y contra
  `poblaciones.org/services/...` fue 404 (es el sitio WordPress).
- **El servidor es inestable.** Hubo resets de conexión frecuentes (curl 35) y una vez devolvió una
  página HTML genérica del CONICET en lugar de JSON. Conviene usar `--retry 5 --retry-all-errors` y
  validar que la respuesta sea JSON.
- **La generación de archivos nuevos falló de forma intermitente.** Hacia el final de la sesión,
  `StartDatasetDownload` respondía `500. Se ha producido un error en el servidor.` para datasets que
  no estaban en caché (los laborales 2022 y 2001-2010). Los que ya estaban generados siguieron
  respondiendo `{"done":true}`.
- **`robots.txt` de `datos-poblaciones.conicet.gov.ar` dice `Disallow: /`.** Hay que descargar con
  bajo volumen, solo lo necesario y con caché local. Para descargas masivas, escribir a
  contacto@poblaciones.org.

### 3.2 Endpoints probados

`S = https://datos-poblaciones.conicet.gov.ar`

| Endpoint | Para qué | Resultado |
|---|---|---|
| `https://mapa.poblaciones.org/services/GetTransactionServer` | Descubre el servidor dinámico | 200 JSON |
| `S/services/GetConfiguration` | Firmas de caché (`Signatures.FabMetrics=2466`, `Boundary=91`) y servidores | 200 JSON |
| `S/services/metrics/GetFabMetrics?w=2466` | **Catálogo completo de indicadores públicos** por grupo temático, con versión, work, niveles y variables | 200 JSON (211 KB) |
| `S/services/metrics/GetFabIndicators?w=2466` | Catálogo en el formato del panel nuevo | 200 JSON (186 KB) |
| `S/services/metrics/GetFabBoundaries?w=91` | Catálogo de delimitaciones, con ítems, población y superficie | 200 JSON (826 KB) |
| `S/services/metrics/GetSelectedMetric?l={metricId}` | **Resuelve indicador → versiones → niveles → `Dataset.Id`**, con etiquetas de valores y cortes | 200 JSON |
| `S/services/works/GetWork?w={workId}` | Metadatos del work: autores, fecha, resumen y **licencia** (JSON), URL `poblaciones.org/@{w}` y ARK | 200 JSON |
| `S/services/metadata/GetMetadataPdf?m={metadataId}&w={workId}` | Ficha de metadatos en PDF: metodología, fuentes y licencia | 200 PDF |
| `S/services/metadata/GetWorkMetadataDictionary?m={metadataId}&w={workId}&d={datasetId}` | **Diccionario de datos** (códigos → etiquetas) | 200 XLSX (openpyxl falla por `showZeroes`; se lee el XML interno) |
| `S/services/download/StartDatasetDownload?t={tipo}&d={datasetId}&w={workId}` | Inicia la generación del archivo. Devuelve `{"done":true}` o `{"done":false,"key":...}` | 200 JSON (a veces 500) |
| `S/services/download/StepDatasetDownload?k={key}` | Avanza la generación de a 5.000 filas por paso | 200 JSON |
| `S/services/download/GetDatasetFile?t={tipo}&d={datasetId}&w={workId}` | **Descarga el archivo** | 200 `text/csv` |
| `S/services/download/StartBoundaryDownload?b={id}&v={ver}&t=cw` → `StepBoundaryDownload?k=` → `GetBoundaryFile?b=&v=&t=cw` | Delimitación con geometría | 200 CSV+WKT |
| `S/services/frontend/Search?q=hospital` | Buscador | **500** (también con `&f=`) |
| `S/services/frontend/metrics/GetSummary?l=3401&v=560301&a=598201&r=79070` | Resumen por región | **500**. Sin `r` pide una delimitación espacial |

**Tipos de archivo (`t`)**, según `services/src/services/common/BaseDownloadManager.php`:

- La primera letra es el formato: `c` CSV, `x` XLSX, `s` SPSS, `z` SPSS comprimido, `t` Stata,
  `r` R, `h` Shapefile (zip) y `g` GeoPackage.
- La segunda letra, opcional, agrega la geometría: `w` como WKT o `g` como GeoJSON.
- Probados: `c` y `cw` funcionan. **`g` (GPKG) falló con 500 en el paso Step** (RENABAP 2023), así
  que usamos `cw`.
- Los CSV llegan con cabecera `charset=ISO-8859-1`, pero **el contenido es UTF-8**.

### 3.3 Receta reproducible

```bash
S=https://datos-poblaciones.conicet.gov.ar
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
c(){ curl -sS --retry 5 --retry-all-errors --retry-delay 3 -A "$UA" -H Referer:https://mapa.poblaciones.org/map/ "$@"; }
# 1) catálogo
c "$S/services/metrics/GetFabMetrics?w=2466" > fab_metrics.json
# 2) indicador -> dataset
c "$S/services/metrics/GetSelectedMetric?l=6001" | jq '.Versions[] | {v:.Version.Name, w:.Work.Id, levels:[.Levels[]|{n:.Name,d:.Dataset.Id}]}'
# 3) generar y descargar (repetir Step mientras done=false)
r=$(c "$S/services/download/StartDatasetDownload?t=c&d=296201&w=147401")
while ! grep -q '"done":true' <<<"$r"; do k=$(grep -oE '"key":"[a-f0-9]+"' <<<"$r"|cut -d'"' -f4); r=$(c "$S/services/download/StepDatasetDownload?k=$k"); done
c -o con_internacion.csv "$S/services/download/GetDatasetFile?t=c&d=296201&w=147401"
```

Los CSV traen siempre estas columnas al final:

- `Código de provincia`, `Nombre de provincia`, `Código de departamento` y `Nombre de departamento`;
- `Código de radio`, que es el radio 2022 donde cae el punto;
- según el caso, `Latitud`/`Longitud` o el centroide y la superficie en km².

Esto permite unir los datos sin geoprocesar.

**Ojo con los códigos de CABA.** En el Censo 2022 la Comuna 1 es `02007` (las comunas avanzan de a
7). En los establecimientos de salud figura `02001`. Hay que homologar contra el `cod_dep` de
nuestro `departamentos.geojson` antes de cualquier unión por departamento.

## 4. Inventario

El catálogo público (`GetFabMetrics`) tiene **48 works, 11 grupos temáticos y 630 combinaciones de
indicador × versión × nivel**. Está aplanado en `data/raw/poblaciones/catalogo_indicadores.csv`. Los
`dataset_id` resueltos están en `datasets_clave.csv` (153 filas) y los metadatos y licencias de 23
works, en `works_metadatos.csv`.

Licencias:

- **BY** = CC BY 4.0: `licenseCommercial=1`, `licenseOpen=always`.
- **BY-NC** = CC BY-NC 4.0: `licenseCommercial=0`.

El mapeo sale de `frontend/src/common/components/MpLicense.vue`.

### 4.1 Censo y condiciones de vida

| Capa | work / metric | Geografía | Año | Variables principales | dataset_id (radio · depto · prov) | Licencia |
|---|---|---|---|---|---|---|
| Totales poblacionales | w 344701 / l 627601, 627701, 627801 | Radio, Depto, Prov | 1991, 2001, 2010, 2022 | Población total y en viviendas particulares; hogares; viviendas particulares ocupadas, **desocupadas** y colectivas | 2022: **571301** · 571401 · 571501. 2010: 571601 · 571701 · 571801 | BY |
| Indicadores de hogares, Censo 2022 | w 257701 / l 3401 NBI, 6301 agua, 3701 excretas/cloaca, 6201 gas, 6801 hacinamiento, 6701 calidad constructiva, 6401 tenencia, 6601 bienes, 6501 jefatura | Radio, Depto, Prov | 2022 | Ver 5.1 (40 variables de conteo) | **434401** · 434701 · 434601 | BY |
| Indicadores de personas, Censo 2022 | w 257701 / l 12201 densidad, 8501 y 12301 edades, 8601 asistencia, 8701 nivel educativo, 137701 cobertura de salud, 137601 jubilaciones | Radio, Depto, Prov | 2022 | Población por edad y sexo, cobertura de salud, nivel educativo y jubilación | **434501** · 434801 · 434901 | BY |
| Indicadores censales 2010, 2001 y 1991 | w 3701, 3601, 3501 (mismos metric ids) | Radio, Depto, Prov | 2010, 2001, 1991 | Iguales a los de 2022, para ver la evolución | Hogares 2010: 8301 · 12001 · 11801. Hogares 2001: 8401 · 12101 · 11901 | BY |
| Laborales 2022 | w 228601 / l 328601 actividad, 328701 desocupación, 328801 empleo | Radio, Depto, Prov | 2022 | Tasas por tramo de edad | 443801 · 438601 · 438501 (**la descarga dio 500**) | BY |
| Laborales 2001-2010 | w 148801 | Radio, Depto, Prov | 2001, 2010 | Iguales | 2010: 301201 · 301601 · 301501 | BY |
| Estratificación socioeconómica | w 324001 / l 180701 | Radio | 2022 (también 2010) | Segmento socioeconómico del radio | 547301 (2010: 178701) | BY |
| Pobreza crónica | w 42901 / l 82301 (CIPPEC, PNUD, ODSA, CEDLAS) | Radio, Depto, Prov | 2010 | Nivel de incidencia | 86601 · 93301 · 89401 | **BY-NC** |
| Riesgo de exclusión e inseguridad alimentaria | w 8401, 7201 | Radio | 2010 | Incidencia | resolver con `GetSelectedMetric?l=13001` y `l=18401` | (sin verificar) |
| Déficit habitacional | w 9801 / l 14401 (IIGG-UBA) | Radio, Depto | 2010 | Hogares con algún déficit | 24701 · 24601 | BY |
| Déficit educativo | w 297801 / l 575101, 575301 | Radio, Depto, Prov | 2001, 2010, 2022 | No asistencia (4-18 años); adultos sin secundario | resolver con `l=575101` | BY |
| Proyecciones de población | w 353101 / l 628001 (base 2022), 627901 (base 2010) | Depto, Prov | 2024, 2027, 2030, 2033 | Población proyectada | Depto: 597701 (2024), 597501 (2027), 597301 (2030), 597101 (2033) | BY |
| Entorno urbano | w 83301 / l 137101 alumbrado, 137201 transporte a <300 m, 137301 residuos, 137401 pavimento, 181401 teléfono público | Radio, Depto, Prov | 2001, 2010 | Hogares con cada servicio | 2010: 146001 · 148401 · 148501 | BY |
| Vulnerabilidad sanitaria | w 319801 / l 40201 (Fundación Bunge y Born) | Radio | 2022-2025 | Índice | 528001 | BY |

### 4.2 Equipamientos georreferenciados (puntos)

| Capa | work / metric | Año | Registros descargados | Variables | dataset_id | Licencia |
|---|---|---|---|---|---|---|
| Salud con internación (REFES) | w 147401 / l 6001 | 2022, actualizado al 14/11/2025 | 6.532 | Tipología (general, maternidad, pediatría, salud mental…), **Categoría** (1 alto riesgo con terapia intensiva … 4 bajo riesgo), Sector, Dependencia | **296201** (depto 310001, prov 310101) | BY |
| Salud sin internación (CAPS, laboratorios…) | w 147401 / l 6101 | 2022 | 24.246 | Tipología, Categoría, Sector, Dependencia | **296301** | BY |
| Salud complementarios | w 147401 / l 5901 | 2022 | 4.040 | Categoría, Sector, Dependencia | **295901** | BY |
| Farmacias | w 147401 / l 5801 (hay versión 2025, w 311101) | 2022 | 12.903 | Categoría, Sector, Dependencia | **295801** (2025: 515401) | BY |
| Escuelas primarias comunes | w 225201 / l 3801 | 2024 | 22.753 | Sector, ámbito, confesional, **matrícula**, secciones, egresados, internet, electricidad y precisión del georreferenciamiento | **431401** | BY |
| Secundarias comunes | l 5501 | 2024 | 13.691 | Iguales, más técnica y artística | **431801** | BY |
| Nivel inicial común | l 5001 | 2024 | 21.307 | Iguales | **432101** | BY |
| Nivel superior | l 5101 | 2024 | 4.214 | Tipo de formación, matrícula | **432601** | BY |
| Educación especial, de jóvenes y adultos, EIB | l 5201, 5301, 5401, 5601, 5701, 139101 | 2024 | — | Conteos | ver `GetSelectedMetric` | BY |
| Centros de desarrollo infantil | w 53201 / l 97501 | 2020 | — | — | — | — |
| Infraestructura cultural (SINCA) y deportiva | w 145401, 166101 | 2022-2023 | — | Bibliotecas, cines, clubes… | — | — |
| Puntos OSM | w 6301 | 2019 | — | Bancos, correo, policía, culto | — | — |
| Transporte SUBE | w 130201 | 2021 | — | Redes de colectivo y tren; uso por radio | — | BY |

**Los conteos del PDF son de 2022 y no coinciden con los descargados.** El PDF de metadatos dice
1.657 establecimientos con internación. El CSV actual trae 6.532, con códigos únicos y todos con
coordenadas. El work se actualizó el 14/11/2025. Hay que tratarlo como un snapshot y guardar la
fecha de descarga.

### 4.3 Hábitat, asentamientos y tierras

| Capa | work / metric | Geometría | Año | Variables | dataset_id | Licencia |
|---|---|---|---|---|---|---|
| **Barrios populares (RENABAP)** | w 191801 / l 280001, 265801 | Polígonos ("Zonas") | 2023 (y 2022) | Familias, año y década de creación, tipología, **situación dominial** y acceso a electricidad, cloaca, agua y gas | **383501** (2022: 247901) | BY |
| Asentamientos informales (RENABAP 2018) | w 3401 / l 4801 | Polígonos | 2018 | Familias, precariedad | 111701 | BY |
| Factores de riesgo en barrios populares | w 207701 / l 443801, 448101, 448501 | Puntos o zonas | 2024 | Basurales, microbasurales y zonas inundables | ver `l=448501` | **BY-NC** |
| Zonas inundables | w 160301 / l 390701 | Radio | 2001, 2010 | Población por nivel de incidencia | 348201 (2010) | BY |
| Basurales y rellenos sanitarios | w 286401 / l 561101 | Puntos | 2022 | — | ver `l=561101` | BY |
| Urbanizaciones cerradas | w 115501 / l 10901 | Polígonos | 2022 | Countries y barrios cerrados | ver `l=10901` | BY |
| Elevación, precipitaciones y temperatura | w 167401 | Radio, Depto | 2010-2023 | Población por categoría | ver `l=378001` | BY |

**Sin catastro ni tierras fiscales.** Poblaciones no publica catastro, parcelas ni tierras fiscales.
Lo único cercano es la *situación dominial* de los barrios RENABAP. Para tierras siguen valiendo las
fuentes de `docs/propiedad-tierra.md` (RNTR, CNA).

### 4.4 Delimitaciones con geometría

- Se pueden bajar con `GetBoundaryFile` (`t=cw`): municipios, gobiernos locales, localidades,
  aglomerados, cuencas, eco-regiones y el resto de las delimitaciones de la sección 2.
- Probado con **Municipios** (b=2, v=20): 1.205 polígonos y 21,6 MB.
- Los **radios censales 2022** con geometría salen del dataset de totales en formato `cw`
  (d=571301): 66.422 polígonos y 109,5 MB.

## 5. Archivos descargados (`data/raw/poblaciones/`)

| Archivo | Filas × cols | Clave | Notas |
|---|---|---|---|
| `salud_2022/con_internacion.csv` | 6.532 × 23 | `Código` (REFES) | `Latitud`/`Longitud`, `Código de radio`. Diccionario en `metadatos/diccionario_con_internacion.xlsx` |
| `salud_2022/sin_internacion.csv` | 24.246 × 23 | idem | |
| `salud_2022/complementarios.csv` | 4.040 × 22 | idem | |
| `salud_2022/farmacias.csv` | 12.903 × 22 | idem | |
| `educacion_2024/primarias_comun.csv` | 22.753 × 42 | `CUE Anexo` | Matrícula, secciones, precisión del georreferenciamiento |
| `educacion_2024/secundarias_comun.csv` | 13.691 × 44 | idem | |
| `educacion_2024/inicial_comun.csv` | 21.307 × 41 | idem | |
| `educacion_2024/superior.csv` | 4.214 × 23 | idem | |
| `censo_2022/totales_poblacionales_radios_2022.csv` | 66.422 × 17 | `Código de radio censal` (9 dígitos) | Población, hogares, viviendas ocupadas y desocupadas, centroide, km² |
| `censo_2022/totales_poblacionales_radios_2022_wkt.csv` | 66.422 × 18 | idem | Agrega `Geometría en WKT` (EPSG:4326) |
| `censo_2022/indicadores_hogares_radios_2022.csv` | 66.422 × 51 | `Código de radio.` | 40 conteos de hogares: NBI, agua, cloaca, gas, hacinamiento, techo, piso, tenencia… |
| `censo_2022/indicadores_personas_radios_2022.csv` | 66.422 × 70 | idem | Edad × sexo, cobertura de salud, educación, jubilación |
| `censo_2022/indicadores_hogares_departamentos_2022_wkt.csv` | 527 × 50 | `Código de departamento.` | Con WKT de los departamentos |
| `habitat/renabap_2023_wkt.csv` | 6.467 × 22 | `ID Renabap` | Polígonos WKT; las etiquetas vienen en texto |
| `limites/municipios_wkt.csv` | 1.205 × 9 | `Código` (6 dígitos) | WKT |
| `catalogo_indicadores.csv`, `datasets_clave.csv`, `works_metadatos.csv` | — | — | Catálogo e ids. `fab_*.json`, `selected/`, `works/` y `config.json` son las respuestas crudas |
| `metadatos/salud_2022_metadatos.pdf` | — | — | Metodología REFES y licencia |

Controles rápidos sobre los radios 2022:

- La población total suma **45.617.344**. INDEC publica 46,04 M incluyendo viviendas colectivas y
  personas en situación de calle; esta columna no las cubre del todo.
- Viviendas particulares desocupadas: **2.084.013**.
- 6,7 % de los hogares tienen NBI, 15,0 % no tienen agua de red para beber o cocinar y 37,9 % no
  tienen cloaca.
- **La superficie de los radios varía mucho.** La mediana es 0,20 km², el percentil 90 es 61 km², el
  percentil 99 es 722 km² y el máximo, 16.637 km². 8.422 radios son más grandes que un hexágono de
  res. 6. Por eso la agregación no puede asignar cada radio a una celda por su centroide.

## 6. Licencia y forma de citar

- **Código:** GPL-3.0 o posterior, © 2018-2023 CONICET y UCA.
- **Datos:** cada work declara su licencia. Casi todos son **CC BY 4.0**. Hay excepciones
  **CC BY-NC 4.0** que no sirven para usos comerciales: *Pobreza crónica* (w 42901) y *Factores de
  riesgo en barrios populares* (w 207701). Hay que revisar `GetWork` de cada capa antes de usarla.
- **Atribución.** Se cita al autor del work, el título, Poblaciones y el enlace estable o ARK, y
  también la fuente primaria (REFES y SISA del Ministerio de Salud, Ministerio de Educación, INDEC,
  RENABAP). Ejemplos:
  - De Grande, P. y Salvia, A. (2024). *Indicadores del Censo Nacional de Población, Hogares y
    Viviendas, 2022*. Poblaciones, ODSA-UCA/CONICET. https://poblaciones.org/@257701 ·
    ark:/26680/257701. Fuente: INDEC. CC BY 4.0.
  - Pedicino, J. y De Grande, P. (2022, act. 2025). *Establecimientos de salud, 2022*. Poblaciones.
    https://poblaciones.org/@147401 · ark:/26680/147401. Fuente: REFES/SISA, Ministerio de Salud de
    la Nación. CC BY 4.0.
  - De Grande, P. y Pedicino, J. (2024). *Establecimientos educativos, 2024*. Poblaciones.
    https://poblaciones.org/@225201. Fuente: Ministerio de Educación (Padrón y Relevamiento Anual).
    CC BY 4.0.
  - RENABAP y TECHO (2023). *Registro Nacional de Barrios Populares (RENABAP, 2023)*. Poblaciones.
    https://poblaciones.org/@191801. CC BY 4.0.

## 7. Propuesta de integración a la grilla H3 (res. 6)

Hoy `pipeline/build.py` hace tres cosas que importan para esta integración:

- reparte la población de WorldPop a los totales **departamentales** del Censo 2022;
- mide la accesibilidad a salud con un raster global (`t_salud`);
- no tiene ninguna variable de servicios ni de vulnerabilidad social.

Poblaciones permite bajar todo eso al **radio censal**, unas 100 veces más fino en zonas urbanas.
Propongo un script independiente, `pipeline/poblaciones.py` (con el mismo patrón que
`economia.py`), que escriba `data/interim/poblaciones/*.parquet` con clave `h3` y que `build.py`
lea de forma opcional.

### 7.1 Variables de radio (conteos): reparto dasimétrico con WorldPop

Aplica al Censo 2022: totales de 571301, hogares de 434401 y personas de 434501.

1. Rasterizar los polígonos de radio de `totales_poblacionales_radios_2022_wkt.csv` sobre la misma
   grilla de píxeles que ya usa `build.py` (`TRANSFORM`, `HEIGHT`, `WIDTH`), con un índice entero por
   radio. Hay radios más chicos que un píxel. Para esos se asigna el píxel que contiene el centroide
   (`Latitud`/`Longitud del centroide`), así ningún radio queda sin píxeles.
2. Para cada radio *r* y píxel *p* de ese radio, calcular el peso
   `w_p = WP_p / Σ_{p∈r} WP_p`. Si un radio tiene WorldPop 0, se reparte en partes iguales entre sus
   píxeles.
3. Para cada variable de conteo *X*, asignar `X_p = X_r · w_p` y sumar a la celda con `Agg.sum`, o
   con `np.bincount(inv, ...)`. Así se conserva el total nacional.
4. **Las tasas se calculan después de agregar:**
   `tasa_celda = Σ numerador / Σ denominador`, nunca como promedio de tasas. Con eso, la población del
   radio pondera sola.
5. Como subproducto, `pob_radio` reemplaza o valida el `pob` actual, que se calibra por departamento.

Variables propuestas:

| Variable en la celda | Numerador / denominador (columnas de Poblaciones) | Uso en el modelo |
|---|---|---|
| `frac_nbi` | `Hogares con al menos un indicador NBI` / `Total de hogares` | Vulnerabilidad y prioridad de origen de la redistribución |
| `frac_sin_agua_red` | `Hogares sin agua para beber y cocinar proveniente de red pública` / hogares | Factor de servicios: déficit de agua de red |
| `frac_sin_cloaca` | `Hogares sin cloaca` / hogares | Factor de servicios: déficit cloacal |
| `frac_sin_gas_red` | `Hogares con garrafa o leña…` / hogares | Factor energía |
| `frac_hacinamiento` | `Hogares con hacinamiento (más de 2 personas por cuarto)` / hogares | Presión habitacional |
| `frac_inquilinos` | `Hogares inquilinos de la vivienda` / hogares | Mercado de vivienda |
| `viv_desocupadas` y `frac_viv_desocupadas` | `Viviendas particulares desocupadas` / `Total de viviendas particulares` | **Stock disponible para recibir población.** Clave para el Simulador |
| `frac_solo_salud_publica` | `Solo salud pública` / población | Demanda sobre el sistema público |
| `pob_0_17`, `pob_65_mas` | conteos | Demanda de escuelas y de salud |
| `tasa_desocupacion` | dataset 443801. Hay que reintentar, porque la descarga dio 500 | Mercado laboral |

Hay una cosa más que conviene guardar: la **cobertura de servicios en las celdas sin población**.
Ahí la tasa queda indefinida, se guarda NaN y la función de valor la trata como "sin servicio".

Para variables categóricas de radio (estrato 2022 en 547301, pobreza crónica en 86601 con licencia
BY-NC, zonas inundables 2010 en 348201) se usa la **moda ponderada por población**, o la fracción de
población por categoría, con los mismos pesos `X_r · w_p`.

### 7.2 Equipamientos (puntos)

Aplica a salud (296201, 296301, 295901, 295801) y educación (431401, 431801, 432101, 432601).

1. Convertir lat/lon a celda con `h3v.coordinates_to_cells(lat, lon, H3_RES)`, como ya se hace con
   las localidades. Con eso se calculan los conteos por celda:
   - `n_hosp`, y también `n_hosp_alto_riesgo` (Categoría 1-2, con terapia intensiva);
   - `n_caps`, contando los sin internación de tipología de atención primaria;
   - `n_farmacias`;
   - `n_esc_prim`, `n_esc_sec` y `n_inst_sup`;
   - `matricula_prim`, `matricula_sec` y `matricula_sup`, sumando `Matrícula`.
2. Calcular la distancia al más cercano con la misma `distances_km` y cKDTree en `CRS_M` que usa
   `build.py`:
   - `d_hosp_km` y `d_hosp_ti_km` (con terapia intensiva);
   - `d_esc_sec_km`;
   - `d_inst_sup_km`.
   Estas distancias complementan o reemplazan a `t_salud`, con un umbral sugerido, por ejemplo
   hospital con internación a 30 km o menos y escuela secundaria a 10 km o menos.
3. Calcular la oferta relativa en un radio de 50 km, con el mismo `query_ball_point` que
   `pob_50km`:
   - `hosp_por_100k_50km = Σ n_hosp / Σ pob · 1e5`;
   - `matricula_sec / pob_13_17` como proxy de saturación o capacidad educativa.
4. Filtrar los puntos con baja precisión (`Precisión del georreferenciamiento` ≠ `PRECISA` en
   educación) o marcarlos con una bandera.

### 7.3 Polígonos (RENABAP 2023, dataset 383501)

- Rasterizar los polígonos sobre la grilla de píxeles y calcular `frac_renabap` (fracción de
  superficie de la celda) con `agg.frac`, igual que las áreas protegidas.
- Asignar `familias_renabap` a la celda de su centroide. Si el barrio cruza celdas, repartir por
  superficie.
- Contar por celda los barrios con situación dominial "NO" y los que no tienen cloaca ni agua de
  red, como señal de déficit para el diagnóstico.
- En el modelo funciona como **indicador de demanda habitacional en el origen**, no como
  restricción.

### 7.4 Departamentos y municipios

- **Proyecciones 2024-2033** (597701 a 597101). Agregar `crec_proy_dep` junto a `crec_dep` (que
  compara 2010 y 2022) para el Simulador.
- **Municipios** (`limites/municipios_wkt.csv`). Asignar a cada celda su gobierno local por mayoría
  de píxeles, con el mismo método que `dep_of_cell`, para fichas y filtros.

### 7.5 Orden sugerido y controles

1. Censo 2022 por radio (7.1), que da el mayor valor y tiene licencia BY. Agrega 10 variables.
2. Salud y educación (7.2): distancias y conteos.
3. RENABAP (7.3) y proyecciones (7.4).
4. Controles:
   - que la suma por celda de población, hogares y viviendas reproduzca los totales nacionales
     (dentro del 0,1 %);
   - que la tasa de NBI y la de cloaca por provincia, recalculadas desde las celdas, coincidan con
     el nivel Provincias de Poblaciones (434601);
   - registrar en `docs/auditoria-datos.md` la fecha de descarga y las licencias.
5. Caché: no volver a descargar si el archivo existe. Respetar `robots.txt`, con bajo volumen y
   reintentos con espera.
