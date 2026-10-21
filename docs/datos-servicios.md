# Servicios, vivienda y equipamiento por departamento

Este documento describe los datos que sirven para evaluar si las ciudades existentes pueden **absorber población**. Incluye las redes, el stock de viviendas, la tenencia, el hacinamiento, el NBI, los barrios populares, el equipamiento de salud y educación, y las proyecciones de población. La unidad es el **departamento**, identificado con el código INDEC de 5 dígitos (`cod_dep`), igual que en `web/public/data/departamentos.geojson`: 529 departamentos, con las comunas de CABA codificadas 02007 a 02105.

Scripts (no tocan `build.py`):

```
python3 -I pipeline/censo_servicios/parse_indec.py data/raw/censo_servicios/indec_cuadros \
        data/interim/censo_servicios/indec_cuadros_departamento.csv
python3 -I pipeline/censo_servicios/build_servicios.py .
```

## 1. Fuentes

| Tema | Fuente y URL | Fecha | Licencia | Crudo |
|---|---|---|---|---|
| Hogares, agua, cloaca, combustible, tenencia, internet, viviendas por condición de ocupación, población en viviendas particulares | INDEC, Censo 2022, resultados definitivos, cuadros por provincia y departamento. Índice: https://www.indec.gob.ar/indec/web/Nivel4-Tema-2-41-165. Archivos `https://www.indec.gob.ar/ftp/cuadros/poblacion/c2022_<prov>_{hogares_c1..c7, vivienda_c1..c3, pob_c1..c7}_<n>.xlsx` y los de total país `c2022_tp_*.xlsx` | Base definitiva (archivos reemplazados el 27/9/2024) | INDEC no declara una licencia explícita. Es información estadística pública y se cita "INDEC, CNPHV 2022, resultados definitivos". | `data/raw/censo_servicios/indec_cuadros/` (426 xlsx) |
| NBI 2022 (control) | INDEC, `https://www.indec.gob.ar/ftp/cuadros/sociedad/serie_nbi_2022.xlsx` (solo provincias) | 2024 | ídem | `data/raw/censo_servicios/nbi/` |
| NBI y hacinamiento por departamento | Poblaciones (CONICET/UCA), "Indicadores del Censo Nacional de Población, Hogares y Viviendas, 2022" (https://poblaciones.org/@257701), procesados desde la base REDATAM del INDEC. Los descargó el agente de Poblaciones. | 2024-10-17 | CC BY 4.0 | `data/raw/poblaciones/censo_2022/indicadores_hogares_departamentos_2022_wkt.csv`, `indicadores_personas_radios_2022.csv` |
| Viviendas y población por radio | INDEC, radios censales 2022 (`rc2022.csv`, ya en el repo) | 2022 | ídem INDEC | `data/raw/rc2022.csv` |
| Barrios populares | RENABAP, Secretaría de Integración Socio Urbana, datos.gob.ar `registro-nacional-de-barrios-populares`: `https://archivo.infraestructura.gob.ar/dataset/ssisu/20231205_info_publica.geojson`, `..._datos_barrios.csv`, `..._referencias.csv` | corte 05/12/2023 | CC BY 4.0 | `data/raw/censo_servicios/renabap/` |
| Establecimientos de salud | REFES/SISA (Ministerio de Salud), georreferenciados por Poblaciones, "Establecimientos de salud, 2022" (https://poblaciones.org/@147401). La última actualización es del 14/11/2025, con fuente SISA versión 2025. | 2025 | CC BY 4.0 | `data/raw/poblaciones/salud_2022/` y el diccionario en `poblaciones/metadatos/` |
| Establecimientos educativos | Padrón oficial y Relevamiento Anual del Ministerio de Educación, georreferenciados por Poblaciones, "Establecimientos educativos, 2024" (https://poblaciones.org/@225201). Matrícula 2023. | 2024 | CC BY 4.0 | `data/raw/poblaciones/educacion_2024/` |
| Universidades | IGN, capa WFS `ign:puntos_de_ciencia_y_educacion_020602` ("Universidad"), `https://wms.ign.gob.ar/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=ign:puntos_de_ciencia_y_educacion_020602&outputFormat=application/json` | descargada el 21/10/2026 | No la verifiqué en el servicio. El IGN pide citar la fuente. | `data/raw/censo_servicios/universidades/` |
| Proyecciones | INDEC, "Estimaciones de población por departamento 2022-2035" (`ftp/cuadros/poblacion/base_estimaciones_pob_deptos_2022_2035.csv`, xlsx y pdf metodológico) y "Proyecciones por jurisdicción 2022-2040" (`ftp/cuadros/poblacion/proyecciones_jurisdicciones_2022_2040_base.csv`), ambas con base en el Censo 2022 | 2025 | ídem INDEC | `data/raw/censo_servicios/proyecciones/` |

Qué no conseguí:
- **No hay camas por establecimiento.** El REFES publicado no trae la cantidad de camas, así que solo se puede contar establecimientos con internación por categoría de riesgo.
- **No usé REDATAM.** La base `bases_censo2022_RedatamX.zip` responde con HTML en lugar del zip, y los cuadros xlsx alcanzaron para todo lo pedido salvo NBI y hacinamiento, que vienen de Poblaciones.

## 2. Tabla `servicios_departamento.csv` (529 filas × 82 columnas)

Tiene una fila por departamento del geojson de la app. **94021 (Islas del Atlántico Sur)** y **94028 (Antártida Argentina)** quedan con NA en las variables de hogares porque INDEC no publica hogares para ellos.

### 2.1 Conteos (INDEC, cuadros por departamento)

| Columna | Definición | Cuadro |
|---|---|---|
| `hogares` | Total de hogares en viviendas particulares. Excluye a la población en situación de calle. | hogares c4 |
| `hog_agua_red` | Hogares cuya procedencia del agua es "Red pública (agua corriente)", con cualquier forma de provisión | hogares c2 (hoja por depto) |
| `hog_cloaca` | Hogares con desagüe del inodoro "A red pública (cloaca)" | hogares c3 (hoja por depto) |
| `hog_gas_red_cocina` | Hogares que usan principalmente **gas de red para cocinar**. Es el único dato de gas de red por departamento que publica el censo 2022. | hogares c4 |
| `hog_electricidad_cocina`, `hog_garrafa_cocina`, `hog_lena_carbon_cocina` | Otros combustibles para cocinar | hogares c4 |
| `hog_internet` | Hogares con "internet en la vivienda" | hogares c7 (hoja por depto) |
| `hog_propia`, `hog_propia_escritura`, `hog_alquilada`, `hog_cedida_trabajo`, `hog_prestada`, `hog_otra_tenencia` | Régimen de tenencia de la vivienda | hogares c6 |
| `viv_total`, `viv_part`, `viv_colectivas` | Viviendas: total, particulares y colectivas | vivienda c1 |
| `viv_part_con_personas` | Viviendas particulares con personas presentes el día del censo (= ocupadas) | vivienda c1 |
| `viv_vacaciones`, `viv_oficina`, `viv_alquiler_venta`, `viv_construccion`, `viv_moradores_ausentes`, `viv_otra_situacion` | Viviendas particulares **sin personas presentes**, según el motivo | vivienda c1 |
| `viv_part_ocupadas` | Viviendas particulares ocupadas (control: igual a `viv_part_con_personas`) | vivienda c2 |
| `pob_viv_part` | Población en viviendas particulares | pob c4 |
| `departamento_indec` | Nombre según INDEC | |

### 2.2 Conteos de otras fuentes

| Columna | Definición | Fuente |
|---|---|---|
| `hog_nbi` | Hogares con al menos un indicador NBI | Poblaciones/REDATAM |
| `hog_hacinamiento` | Hogares con más de 2 personas por cuarto | Poblaciones/REDATAM |
| `hog_hacinamiento_critico` | Hogares con más de 3 personas por cuarto (= NBI 3) | Poblaciones/REDATAM |
| `hog_total_poblaciones` | Total de hogares según Poblaciones (control: igual a `hogares` en los 527 departamentos) | Poblaciones |
| `pob_6a12`, `pob_13a17` | Población de 6 a 12 y de 13 a 17 años en hogares familiares, suma de radios | Poblaciones |
| `pob_total_radios`, `viv_total_radios` | Suma de `POB_TOT_P` y `VIV_TOT_P` de `rc2022.csv`: población y viviendas **particulares** | INDEC radios |
| `pob_est_2022`, `pob_est_2025`, `pob_est_2030`, `pob_est_2035` | Población estimada al 1 de julio (ambos sexos). Está conciliada demográficamente, no es el conteo censal: el total país 2022 da 46.135.579. | INDEC estimaciones por departamento |
| `crec_est_2022_2035_pct` | 100 × (pob_est_2035 / pob_est_2022 − 1) | |
| `renabap_barrios`, `renabap_familias`, `renabap_viviendas`, `renabap_superficie_ha` | Barrios populares cuyo punto interior cae en el departamento, con la suma de familias y viviendas aproximadas y de la superficie | RENABAP |
| `salud_con_internacion` | Establecimientos con internación (todas las tipologías, geriátricos incluidos) | REFES |
| `salud_con_internacion_general` | Con internación general (tipología 6) | REFES |
| `salud_alto_riesgo_ti` | Con internación de alto riesgo con terapia intensiva, general o especializada (categorías 1 y 2) | REFES |
| `salud_internacion_publico` | Con internación del sector público | REFES |
| `salud_sin_internacion`, `salud_sin_internacion_publico` | Sin internación (CAPS, consultorios, laboratorios, etc.): total y públicos | REFES |
| `escuelas_total` | Establecimientos (CUE-anexo) de educación común de nivel inicial, primario o secundario, o superior no universitario | Padrón |
| `escuelas_inicial`, `escuelas_primaria`, `escuelas_secundaria`, `institutos_superior_no_univ` | Establecimientos que ofrecen cada nivel (un CUE-anexo puede contar en varios) | Padrón |
| `matricula_primaria`, `matricula_secundaria` | Matrícula 2023 | Padrón |
| `universidades_sedes` | Sedes y facultades universitarias (puntos IGN) | IGN |

### 2.3 Indicadores derivados: numerador y denominador

| Columna | Numerador | Denominador |
|---|---|---|
| `personas_por_hogar` | `pob_viv_part` | `hogares` |
| `pct_agua_red` | `hog_agua_red` | `hogares` |
| `pct_cloaca` | `hog_cloaca` | `hogares` |
| `pct_gas_red` | `hog_gas_red_cocina`: gas de red como combustible principal para cocinar. Es un proxy de conexión a la red de gas y la subestima levemente. | `hogares` |
| `pct_internet` | `hog_internet` | `hogares` |
| `pct_hacinamiento` | `hog_hacinamiento` (>2 personas por cuarto) | `hogares` |
| `pct_hacinamiento_critico` | `hog_hacinamiento_critico` (>3 personas por cuarto) | `hogares` |
| `pct_nbi` | `hog_nbi` | `hogares` |
| `pct_propietarios` | `hog_propia` | `hogares` |
| `pct_inquilinos` | `hog_alquilada` | `hogares` |
| `pct_tenencia_precaria` | `hog_prestada + hog_otra_tenencia` | `hogares` |
| `viv_desocupadas` | `viv_part − viv_part_con_personas`, es decir, todas las viviendas particulares sin personas presentes | |
| `viv_desocupadas_ociosas` | `viv_vacaciones + viv_alquiler_venta + viv_otra_situacion`. Excluye las que están en construcción, las usadas como oficina o consultorio y las de moradores ausentes. | |
| `pct_viv_desocupadas` | `viv_desocupadas` | `viv_part` |
| `pct_viv_ociosas` | `viv_desocupadas_ociosas` | `viv_part` |
| `renabap_familias_por_100_hogares` | 100 × `renabap_familias`. Las fuentes y fechas difieren, así que es un orden de magnitud. | `hogares` |
| `salud_sin_int_por_10mil` | 10.000 × `salud_sin_internacion` | `pob_total_radios` |
| `salud_con_int_por_100mil` | 100.000 × `salud_con_internacion` | `pob_total_radios` |
| `escuelas_primaria_por_1000_6a12` | 1.000 × `escuelas_primaria` | `pob_6a12` |
| `escuelas_secundaria_por_1000_13a17` | 1.000 × `escuelas_secundaria` | `pob_13a17` |
| `alumnos_por_escuela_primaria` | `matricula_primaria` | `escuelas_primaria` |

Los porcentajes de servicios usan como denominador el total de hogares, sin excluir casos "ignorados", porque los cuadros 2022 no tienen esa categoría.

### 2.4 Otras tablas

- `proyecciones_departamento.csv`: `cod_dep, departamento, anio (2022–2035), pob_estimada`. Cubre 528 departamentos; falta 94021.
- `proyecciones_provincia.csv`: `cod_prov, anio (2022–2040), pob_proyectada`, con la suma de sexos y edades. Los valores "-" se tomaron como 0.
- `indec_cuadros_departamento.csv`: salida intermedia de `parse_indec.py`, con los conteos INDEC y sus totales de control.

## 3. Capas de puntos y polígonos (EPSG:4326)

A cada elemento se le asigna `cod_dep` por punto en polígono contra `departamentos.geojson`. Si cae fuera del polígono (costa o límites simplificados), se toma el departamento más cercano a menos de 5 km. El campo `asignacion_dep` dice cuál de los dos métodos se usó, y no quedó ningún elemento sin asignar. Fuera de CABA, la asignación coincide con el código que trae Poblaciones en el 98 % de las escuelas y el 98,6 % de los establecimientos con internación. Poblaciones usa la codificación 2010 de comunas, así que CABA no se compara.

| Archivo | Elementos | Campos |
|---|---|---|
| `equipamiento_salud.geojson` | 34.818 puntos: 6.532 con internación (3.035 de tipología 3, geriátricos), 24.246 sin internación y 4.040 complementarios. No incluye farmacias. | `codigo_refes, nombre, clase` (con_internacion/sin_internacion/complementario), `internacion` (bool), `tipologia_cod, tipologia, categoria_cod, categoria, sector` (Público/Privado), `dependencia, localidad, departamento_refes, origen_geo` (SISSA o Poblaciones), `cod_dep, asignacion_dep` |
| `escuelas.geojson` | 51.880 puntos (CUE-anexo únicos) | `cue_anexo, nombre, sector` (Estatal/Privado), `ambito` (Urbano/Rural), `localidad, inicial, primaria, secundaria, superior_no_univ` (bool), `matricula_<nivel>, internet, cod_dep, asignacion_dep` |
| `universidades.geojson` | 1.132 puntos | `gid_ign, nombre, tipo` (Universidad, Universidad Nacional, Universidad Católica, etc.), `nombre_corto, fuente, cod_dep, asignacion_dep` |
| `renabap.geojson` | 6.467 multipolígonos | Todos los campos RENABAP (`id_renabap, nombre_barrio, provincia, departamento, localidad, cantidad_viviendas_aproximadas, cantidad_familias_aproximada`, servicios, `titulo_propiedad, clasificacion_barrio, superficie_m2`) más `cod_dep, asignacion_dep` |

Etiquetas de salud:
- El diccionario de Poblaciones define la categoría de internación (1 a 4) y la tipología de internación (1, 2, 4, 5 y 6).
- La **tipología 3 no figura en el diccionario**. La rotulé "tercera edad (inferido)" porque los nombres son residencias geriátricas.
- Para los establecimientos sin internación no hay diccionario. La tipología 1/2/3 se rotuló "diagnóstico / diagnóstico y tratamiento / tratamiento (inferido)" según los nombres: laboratorios, CAPS y consultorios, kinesiología y centros de día.
- Las ~20 categorías sin internación quedan solo con su código.

Alcance de escuelas: solo la educación común de nivel inicial, primario, secundario y superior no universitario que publica Poblaciones. Las modalidades especial y de adultos no están.

## 4. Validación: totales nacionales frente a lo publicado por INDEC

| Variable | Suma de departamentos | Publicado por INDEC (total país) | Diferencia |
|---|---|---|---|
| Hogares | 15.932.302 | 15.932.302 (hogares c2/c4/c6/c7) | 0 |
| Hogares con agua de red | 13.548.033 (85,03 %) | 13.548.033 | 0 |
| Hogares con cloaca | 9.759.115 (61,25 %) | 9.759.115 | 0 |
| Hogares que cocinan con gas de red | 8.390.189 (52,66 %) | 8.390.191 | −2: Mártires (Chubut) y Guachipas (Salta) figuran "///" y se cargaron como 0; los totales provinciales implican 1 hogar en cada uno |
| Hogares con internet en la vivienda | 12.185.954 (76,49 %) | 12.185.954 | 0 |
| Propietarios / inquilinos | 10.462.087 / 3.341.956 | 10.462.087 / 3.341.956 | 0 |
| Viviendas totales | 17.794.946 | 17.794.949 | −3 viviendas colectivas de Antártida Argentina, que no está en el cuadro provincial |
| Viviendas particulares | 17.783.029 | 17.783.029 | 0 |
| Viviendas particulares sin personas presentes | 2.084.013 (11,7 %) | 2.084.013 (17.783.029 − 15.699.016) | 0 |
| Población en viviendas particulares | 45.618.787 (pob c4); 45.618.784 en `rc2022` | 45.618.787 | 0 (−3 en radios) |
| Hogares con NBI | 1.074.291 (6,74 %) | 1.074.293 (serie_nbi_2022, 6,7 %) | −2 |
| Hacinamiento crítico (NBI 3) | 412.490 | 412.500 | −10 |
| RENABAP barrios / familias | 6.467 / 1.237.795 | 6.467 barrios en el CSV oficial | 0 |
| Proyección 2022 (deptos / provincias) | 46.135.579 / 46.135.579 | | consistentes entre sí |

Controles internos:
- En los 527 departamentos con datos, el total de hogares de cada hoja por departamento (agua, cloaca, internet) coincide con el de los cuadros "según departamento".
- Poblaciones y el INDEC coinciden en hogares, propietarios, inquilinos y hogares sin agua de red.
- El "sin cloaca" de Poblaciones (6.045.195) es igual a hogares − cloaca − hogares sin baño (127.992).

Errores de INDEC corregidos al parsear:
- En `c2022_bsas_hogares_c7_2.xlsx`, la hoja 7.2.130 está titulada "Tres de Febrero" pero es **Tres Lomas**. Se identificó por el total de hogares.
- Algunos nombres de hoja traen variantes: "Lezana" por Lezama, "Nueve De Julio" y "Coronel De Marina L.Rosales".

## 5. Propuesta de indicadores de capacidad de absorción

La idea es estimar cuánta población adicional puede recibir un departamento o ciudad intermedia **sin inversión desproporcionada**. Se combinan cuatro dimensiones. Todos los indicadores salen de columnas de `servicios_departamento.csv`.

1. **Cobertura de redes**, donde la infraestructura ya está tendida:
   - `pct_agua_red`, `pct_cloaca` y `pct_gas_red`, y su mínimo como cuello de botella. La cloaca es la limitante típica: la mediana departamental es 47 %, contra 88 % de agua.
   - Brecha: `hogares − hog_cloaca` = conexiones faltantes. Una red con alta cobertura indica capacidad de densificar, aunque no mide la capacidad remanente de las plantas (dato que falta).
   - `pct_internet` como proxy de conectividad para el trabajo remoto.
2. **Stock de vivienda disponible**:
   - `viv_desocupadas_ociosas`: vacaciones, en alquiler o venta y otra situación. Son 1,19 millones en el país.
   - `pct_viv_ociosas`. Distingue los destinos turísticos, como La Costa con 64 %, del stock urbano movilizable.
   - Capacidad inmediata ≈ `viv_desocupadas_ociosas × personas_por_hogar`, limitada a las viviendas en localidades con red. Conviene excluir o ponderar a la baja los departamentos con `viv_vacaciones` alto, porque ese stock es estacional.
   - Las restricciones: `pct_hacinamiento` y `pct_tenencia_precaria` (demanda interna sin resolver) y `renabap_familias_por_100_hogares` (déficit habitacional informal). Un departamento con mucho hacinamiento o muchas familias en barrios populares tiene que absorber primero su propio déficit.
3. **Salud**:
   - `salud_sin_int_por_10mil` para la atención primaria.
   - `salud_con_int_por_100mil` y `salud_alto_riesgo_ti`: si hay al menos un establecimiento con terapia intensiva en el departamento o a menos de 60 minutos. El tiempo se puede cruzar con `access_health_2020.tif`.
   - Sin camas no se puede medir la ocupación. El sustituto es contar establecimientos con internación general (`salud_con_internacion_general`), sin geriátricos.
4. **Educación**:
   - `escuelas_primaria_por_1000_6a12` y `escuelas_secundaria_por_1000_13a17`.
   - `alumnos_por_escuela_primaria`: un tamaño medio bajo sugiere cupo ocioso, sobre todo en lo urbano. Hay que cruzarlo con `ambito`.
   - `universidades_sedes` + `institutos_superior_no_univ`: oferta terciaria como atractor.

Índice sintético sugerido:
- Normalizar cada indicador por percentiles entre departamentos, de 0 a 1, invirtiendo los que son déficit (hacinamiento, NBI, RENABAP).
- Promediar por dimensión y luego entre dimensiones con pesos explícitos, por ejemplo redes 0,35, vivienda 0,30, salud 0,20 y educación 0,15.
- Reportar aparte la **capacidad absoluta**, en personas: stock ocioso × personas por hogar. Un porcentaje alto en un departamento chico no equivale a capacidad grande.
- Para "ciudades intermedias", filtrar por tamaño con `pob_est_2022` o por aglomerado (BAHRA) y por `crec_est_2022_2035_pct`. Las ciudades que el INDEC ya proyecta en crecimiento necesitan capacidad para su propia dinámica.

Limitaciones:
- El departamento mezcla población urbana y rural. Los porcentajes de red del total del departamento subestiman la cobertura de la ciudad cabecera; los radios (Poblaciones `indicadores_hogares_radios_2022.csv`) permiten recalcular por aglomerado.
- RENABAP es de 2023, el REFES de 2025, el padrón de 2024 y el censo de 2022.
- La red de gas se aproxima por el combustible para cocinar.
