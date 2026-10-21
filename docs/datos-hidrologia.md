# Hidrología superficial: caudales observados y corrección de HydroRIVERS

Este documento describe:

- de dónde salen los caudales observados;
- cuánto se aparta HydroRIVERS de ellos;
- cómo se corrige el caudal medio de cada tramo (`pipeline/hidro_correccion.py`);
- qué limitaciones tiene esa corrección.

Complementa la sección de limitaciones de [`metodologia.md`](metodologia.md), donde se señalaba la sospecha sobre el río Chubut.

## 1. Fuentes

### 1.1 Caudales observados: BDHI / SNIH

- **Base de Datos Hidrológica Integrada (BDHI)**, publicada por el Sistema Nacional de Información Hídrica de la Secretaría de Infraestructura y Política Hídrica: <https://snih.hidricosargentina.gob.ar/>.
- **Acceso.** Se usan los servicios JSON que consume el visor (`Filtros.aspx`):
  - `Filtros.aspx/LeerEstaciones`: 1.439 estaciones con coordenadas y área de cuenca.
  - `MuestraDatos.aspx/LeerListaAsociaciones`: variables que mide cada estación.
  - `MuestraDatos.aspx/LeerDatosHistoricos`: series. Recibe POST JSON `{fechaDesde, fechaHasta, estacion, codigo, validados}` con fechas `AAAA-MM-DD`.
- **Variables.** Código 101, *Caudal Medio Diario* (m³/s). Cuando una estación no tiene serie diaria se usa el código 102, *Caudal Medio Mensual*.
- **Descarga.** Lo hace `pipeline/hidro_bdhi.py` (21 de octubre de 2026): 455 estaciones con caudal, de las que 440 tienen al menos un año completo.
  - Las series quedan en `data/raw/hidro/bdhi/diarios/`.
  - El resumen de todas las estaciones está en `data/raw/hidro/bdhi_resumen.csv`.
- **Estadísticos por estación.** Se usa solo la serie de la propia estación, sin rellenar huecos.
  - **Años completos:** los que tienen al menos 330 días con dato (o 11 meses, si la serie es mensual).
  - **Módulo:** media de las medias anuales de los años completos.
  - **Q95:** caudal superado el 95 % de los días, es decir, el percentil 5 de los caudales diarios de esos años. Solo existe para series diarias.
  - **Qmín:** mínimo diario o mensual.
  - **Período:** primer y último año completo. La columna `n_anios` cuenta los años completos, porque el período puede tener huecos.
- **Tabla.** `data/raw/hidro/estaciones_caudal.csv` tiene 387 estaciones con al menos 5 años completos.
  - La columna `rio_objetivo` marca las 104 estaciones que están sobre los ríos principales pedidos.
  - Para cada estación, el campo `url` remite al visor y al servicio. El visor no tiene enlaces permanentes por estación, porque la selecciona con cookies; la estación se identifica por su código BDHI.

Algunos módulos sirven de control de consistencia con valores conocidos. Todos salen de la BDHI y se calcularon aquí:

| Río y estación | Módulo | Período |
|---|---:|---|
| Paraná en Corrientes | 17.116 m³/s | 1904–2025 |
| Uruguay en Paso de los Libres | 4.498 m³/s | 1909–2025 |
| Negro en Primera Angostura | 801 m³/s | 1928–2025 |
| Santa Cruz en Charles Fuhr | 736 m³/s | 1956–2025 |

**No se usaron módulos de literatura.** Se buscaron publicaciones con tablas de módulos para el río Grande de Tierra del Fuego y para el Suquía aguas abajo de San Roque. No se encontró ninguna cifra con fuente primaria verificable, así que esos tramos quedan sin dato en lugar de usar valores secundarios (por ejemplo, enciclopedias). Tampoco se usó GRDC: para las estaciones argentinas, la fuente primaria es la BDHI.

### 1.2 Caudal modelado: HydroRIVERS v1.0

- **Referencia:** Lehner, B. y Grill, G. (2013). Global river hydrography and network routing: baseline data and new approaches to study the world's large river systems. *Hydrological Processes*, 27(15), 2171–2186. <https://doi.org/10.1002/hyp.9740>.
- **Origen de `DIS_AV_CMS`.** Según la documentación técnica (<https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf>, §2.2), es un caudal medio de largo plazo **1971–2000**. Se obtuvo reduciendo a escala las capas de escorrentía y caudal de 0,5° del modelo global **WaterGAP 2.2**.
- **Advertencia de la propia documentación.** Señala incertidumbres significativas "en áreas dominadas por escorrentía nival o glaciar, grandes humedales o condiciones áridas y semiáridas". Esas tres situaciones abundan en Argentina.

## 2. Validación de HydroRIVERS

**Script:** `pipeline/hidro_correccion.py`. **Salida:** `data/raw/hidro/validacion_hydrorivers.csv`, con una fila por estación.

### 2.1 Emparejamiento estación–tramo

1. **Candidatos.** Son los tramos de HydroRIVERS a ≤ 5 km de la estación. Las distancias se miden en ESRI:102033.
2. **Puntaje** (menor es mejor): |log₁₀(Qmod/Qobs)| + |log₁₀(UPLAND_SKM/área BDHI)| + 0,1·dist/5 km. El término de área solo se suma si la BDHI informa el área.
3. **Aceptación.** Qmod/Qobs debe estar dentro de un orden de magnitud (0,1–10). Como excepción, también se acepta si el área BDHI coincide con UPLAND_SKM a ±25 %: en ese caso el tramo es inequívoco aunque el sesgo supere 10×. Esto pasó en 11 estaciones, casi todas serranas de Córdoba y del NOA.
4. **Asignación voraz por puntaje.** Cada tramo recibe una sola estación. Esto evita que, por ejemplo, la estación del río Gualjaina se asigne al tramo del Chubut.
5. **Exclusiones** (lista `EXCLUIR` y filtro de canales):
   - brazos parciales del Paraná: Chapetón por brazos e Isla Pati;
   - el Paraná en Túnel Subfluvial, que mide solo el cauce principal;
   - canales y acequias.
6. **Emparejamiento manual** (lista `MANUAL`). Cuatro estaciones están sobre el cauce principal pero tienen sesgos de más de 10×, y la regla automática las descartaría. Son justamente los casos que más importan:
   - Desaguadero en Arco del Desaguadero y en Salto de la Tosca;
   - Salado-Chadileuvú en Canalejas;
   - Atuel en Carmensa.

   Se asignan al tramo más cercano entre los que tienen ≥ 90 % del área de aporte máxima a ≤ 5 km.

**Resultado:** de 387 estaciones, 355 quedaron emparejadas (340 por orden de magnitud, 11 por área y 4 manuales). La razón modelo/observado se resume así:

| Módulo observado | Estaciones | Mediana mod/obs | Dentro de ±25 % | Dentro de 0,5–2× |
|---|---:|---:|---:|---:|
| ≥ 100 m³/s | 53 | 1,02 | 57 % | 87 % |
| 10–100 m³/s | 144 | 1,02 | 27 % | 64 % |
| < 10 m³/s | 158 | 0,83 | 18 % | 46 % |
| Todas | 355 | 0,96 | 28 % | 59 % |

Los grandes ríos alóctonos están bien representados. Los errores grandes se dan en dos situaciones:

- **Sobrestimación** en ríos de meseta y llanura árida, con pérdidas por infiltración y evaporación, usos consuntivos y regulación.
- **Subestimación** en cuencas serranas pequeñas (sierras de Córdoba y San Luis, NOA). Allí la celda de 0,5° de WaterGAP no resuelve la precipitación orográfica.

### 2.2 Ríos principales ordenados por sesgo

Para cada río, la estación de mayor sesgo se elige entre las que tienen ≥ 10 años completos. La "referencia" es la estación de ≥ 10 años con mayor área de aporte. Ambas son estaciones BDHI. La razón es modelo/observado: más de 1 indica que el modelo sobrestima.

| Río | Estación de mayor sesgo | Período | Módulo obs. (m³/s) | HydroRIVERS (m³/s) | Modelo/obs. | Estación de referencia (código, período) | Modelo/obs. en referencia |
|---|---|---|---:|---:|---:|---|---:|
| Desaguadero | Arco del Desaguadero | 2010–2024 | 0,168 | 107,9 | **642** | Canalejas (11452, 1988–2025) | 15,2 |
| Tercero (Ctalamochita) | Embalse | 1914–1983 | 27,2 | 1,82 | **0,067** | Bell Ville (14223, 1939–1980) | 0,31 |
| Atuel | Carmensa | 1986–2025 | 6,99 | 82,8 | **11,8** | Carmensa (11453, 1986–2025) | 11,8 |
| Chubut | Chubut – Ameghino | 1993–2025 | 42,4 | 327,2 | **7,72** | Valle Inferior (12295, 1993–2025) | 7,21 |
| Salado del Norte (Juramento) | Pinto | 2009–2025 | 10,6 | 79,1 | **7,43** | Salado – RP 70 (13216, 1954–2025) | 3,23 |
| Cuarto (Chocancharava) | Tincunaco | 1962–1980 | 3,45 | 0,57 | **0,17** | Tincunaco (14206, 1962–1980) | 0,17 |
| Deseado | Ruta Provincial Nº 39 | 2005–2025 | 1,43 | 6,53 | **4,57** | ídem (12824) | 4,57 |
| Senguer | Los Molinos | 1987–2025 | 46,8 | 205,6 | **4,40** | Los Molinos (12297, 1987–2025) | 4,40 |
| Colorado | Pichi Mahuida | 1919–2024 | 124,9 | 54,7 | **0,44** | Pichi Mahuida (11801, 1919–2024) | 0,44 |
| Bermejo | Balapuca | 1972–2022 | 90,3 | 39,9 | **0,44** | El Colorado (12602, 1969–2024) | 1,02 |
| Neuquén | Dique Ballester | 1991–2025 | 185,5 | 360,8 | 1,95 | Dique Ballester (12096) | 1,95 |
| Corrientes | Paso Lucero | 1970–2024 | 175,5 | 258,7 | 1,47 | Los Laureles (13821, 1977–2022) | 1,17 |
| Dulce | El Sauce | 1926–1966 | 83,5 | 122,1 | 1,46 | El Sauce (10801) | 1,46 |
| Paraguay | Puerto Bermejo | 1910–2023 | 3.890 | 5.487 | 1,41 | Puerto Bermejo (12401) | 1,41 |
| San Juan | Km 47,3 | 1955–2010 | 58,6 | 44,1 | 0,75 | Dique de la Roza (11209, 1910–1988) | 0,75 |
| Santa Cruz | Charles Fuhr | 1956–2025 | 735,8 | 560,7 | 0,76 | Charles Fuhr (12802) | 0,76 |
| Gualeguay | Rosario del Tala | 1993–2025 | 138,2 | 179,1 | 1,29 | Rosario del Tala (13004) | 1,29 |
| Negro | Paso Córdova | 1923–2025 | 883,0 | 1.103 | 1,25 | Primera Angostura (11809, 1928–2025) | 1,09 |
| Limay | Paso Flores | 2006–2020 | 229,9 | 286,0 | 1,24 | Paso Limay (11804, 1904–1989) | 0,84 |
| Mendoza | Guido | 1957–2025 | 44,3 | 53,3 | 1,20 | Cacheuta (11412, 1910–1989) | 1,10 |
| Paraná | Timbúes | 1905–2023 | 15.680 | 18.635 | 1,19 | Timbúes (13316) | 1,19 |
| Pilcomayo | Fortín Nuevo Pilcomayo | 1950–1966 | 160,9 | 185,9 | 1,16 | ídem (12601) | 1,16 |
| Tunuyán | Valle de Uco | 1955–2025 | 26,8 | 24,4 | 0,91 | ídem (11419) | 0,91 |
| Uruguay | Paso de los Libres | 1909–2025 | 4.498 | 4.924 | 1,09 | ídem (13802) | 1,09 |
| Primero (Suquía) | Dique San Roque | 1927–1980 | 9,70 | 9,06 | 0,93 | ídem (14215) | 0,93 |
| Diamante | Los Reyunos | 1917–1980 | 36,2 | 34,8 | 0,96 | ídem (11409) | 0,96 |
| Iguazú | Puerto Andresito | 1985–2025 | 1.706 | 1.758 | 1,03 | ídem (13448) | 1,03 |
| Gallegos | Blanco | 1993–2023 | 28,1 | 28,6 | 1,02 | ídem (12818) | 1,02 |

Hay también series cortas, de menos de 10 años:

| Río | Estación | Período | Módulo obs. (m³/s) | HydroRIVERS (m³/s) | Modelo/obs. |
|---|---|---|---:|---:|---:|
| Desaguadero | Salto de la Tosca | 2019–2025 | 0,002 | 159,0 | ≈ 80.000 |
| Salado (Buenos Aires) | RP 41 | 2017–2023 | 158,9 | 650,6 | 4,09 |
| Chubut | Trelew | 2019–2025 | 24,3 | 238,4 | 9,80 |
| Chico (Santa Cruz) | RN 3 | 2017–2025 | 21,4 | 46,2 | 2,15 |

**El caso del Chubut** confirma la sospecha. HydroRIVERS da 238 m³/s en el valle inferior (UPLAND 94.124 km²), pero se observan:

| Estación | Período | Módulo |
|---|---|---:|
| Valle Inferior | 1993–2025 | 33,0 m³/s |
| Trelew | 2019–2025 | 24,3 m³/s |
| Los Altares | 1944–2025 | 47,0 m³/s |

El modelo hace crecer el caudal aguas abajo a medida que suma área de meseta. Esa área no aporta, y el área que la BDHI considera activa es de 29.400–31.681 km².

**Estaciones sobre ríos principales que la regla automática no pudo emparejar:**

| Estación | Río | Módulo obs. | Motivo |
|---|---|---:|---|
| Puente Camino del Buen Pasto | Senguer | 19,6 m³/s | El cauce principal del modelo pasa a más de 5 km |
| Monte Comán | Diamante | 7,3 m³/s | El tramo más cercano tiene 0,19 m³/s: el modelo enruta el Diamante inferior por otro lado |
| Puesto Ugalde | Atuel | 2,26 m³/s | Ídem: 0,20 m³/s en el tramo más cercano |
| Gualjaina | Gualjaina, afluente del Chubut | 12,8 m³/s | Su tramo da 10,1×, apenas fuera del límite |

El top 15 de todas las estaciones, no solo las de ríos principales, se obtiene ordenando `validacion_hydrorivers.csv` por |log₁₀(razon_mod_obs)|. Lo dominan arroyos serranos de Córdoba, San Luis y el NOA, con razones de 0,03 a 0,12, más el Desaguadero y el Calchaquí, que llegan a 8–9×.

## 3. Método de corrección

**Script:** `pipeline/hidro_correccion.py`. **Salida:** `data/interim/hydrorivers_corregido.parquet`.

Se aplica un **factor multiplicativo por tramo**, f = Qobs/Qmod, propagado por la red de HydroRIVERS (`NEXT_DOWN`), que queda contenida en la cuenca (`MAIN_RIV`):

| Situación del tramo | Factor | `METODO` |
|---|---|---|
| Tramo con estación | f de la estación. `DIS_CORR_CMS` = módulo observado (reemplazo directo) | `observado` |
| Con estación aguas arriba y aguas abajo en su camino de flujo | log f interpolado linealmente en log(UPLAND_SKM) entre ambas | `interpolado` |
| Solo con estación aguas abajo (afluentes y cabeceras) | f de la primera estación aguas abajo | `estacion_aguas_abajo` |
| Solo con estación aguas arriba (tramos inferiores) | f de la estación aguas arriba de mayor área, mantenido hasta la desembocadura | `estacion_aguas_arriba` |
| Sin estación en su camino de flujo | f = 1 | `sin_dato` |

El factor se acota entre 10⁻⁴ y 10. Además:

- `ESTACION` es la estación que gobierna el tramo: la más cercana en área en los tramos interpolados.
- `Q95_CORR_CMS` = `DIS_CORR_CMS` · (Q95/módulo) de esa estación. Es un caudal de estiaje orientativo.

**Columnas del parquet:** `HYRIV_ID`, `MAIN_RIV`, `DIS_AV_CMS`, `DIS_CORR_CMS`, `FACTOR`, `ESTACION`, `geometry` (EPSG:4326), más `Q95_CORR_CMS` y `METODO`. Abarca 273.922 tramos en el rectángulo 76°–52° O y 20°–56,5° S, que incluye las cabeceras limítrofes.

**Efecto dentro de Argentina** (133.657 tramos):

| Tramos | Con corrección (f ≠ 1) | Sin dato |
|---|---:|---:|
| Todos | 53 % | 47 %: sobre todo cauces pequeños de cuencas sin aforo |
| Con DIS_AV_CMS ≥ 10 m³/s | 89 % | 11 % |

Hay 10.142 tramos que superan el umbral de R13 (8,7 m³/s, equivalente a 1,74 m³/s con el 20 % del caudal). Tras la corrección:

- 1.458 lo pierden y 511 lo ganan, y quedan 9.195;
- con Q95 corregido, solo 2.619 tramos superan ese umbral.

**Cuencas relevantes que quedan sin dato** (f = 1):

- **Río Grande de Tierra del Fuego.** Las estaciones BDHI 14600 y 14607 solo miden altura.
- **Cuencas de la pampa bonaerense.** Algunas tienen desagüe propio: Arrecifes aguas abajo, Vallimanca y Las Flores, Quequén, Sauce Grande.
- **Ríos andinos que drenan a Chile.** Por ejemplo, Futaleufú, Pico y Puelo.
- **Cauces que terminan en Mar Chiquita.** Los ríos Segundo y Dulce, aguas abajo de las últimas estaciones.

**Integración en `build.py`.** Basta con reemplazar `DIS_AV_CMS` por `DIS_CORR_CMS`. Se recomienda también usar `Q95_CORR_CMS` (o una fracción de `DIS_CORR_CMS`) para la restricción de abastecimiento.

**Reproducción:**

```
python pipeline/hidro_bdhi.py            # descarga, unos 30 min; con --solo-resumen recalcula sin descargar
python pipeline/hidro_correccion.py      # validación y parquet, unos 5 s
```

## 4. Limitaciones

1. **Regulación por represas.** El módulo observado aguas abajo de los embalses refleja la operación, no el régimen natural.
   - Ejemplos: Florentino Ameghino en el Chubut; El Chocón y la cadena del Limay; Cerros Colorados y Ballester en el Neuquén; El Nihuil en el Atuel; Agua del Toro y Los Reyunos en el Diamante; Río Tercero; San Roque.
   - La regulación casi no cambia el módulo, salvo por la evaporación del embalse. En cambio, eleva el caudal mínimo y el Q95 respecto del régimen natural.
   - Varias series mezclan años previos y posteriores a las represas. Por ejemplo, Paso de Indios va de 1903 a 2025.
2. **Usos consuntivos.** Los mayores sesgos (Desaguadero, Atuel inferior, Chubut inferior, Salado del Norte, Senguer) combinan riego y pérdidas naturales.
   - **Lado observado.** Mide lo que realmente queda en el cauce. Es lo que importa para un uso nuevo, pero el agua ya está asignada a usuarios existentes, así que el caudal corregido no es caudal disponible.
   - **Lado del modelo.** La documentación de HydroRIVERS no aclara si el caudal es natural o descuenta extracciones. La comparación no separa error del modelo de efecto antrópico.
3. **Q95 frente al caudal medio.** En ríos de régimen torrencial o nival, el Q95 es una fracción pequeña del módulo:
   - Gualeguay: 2,7 frente a 138 m³/s;
   - Salado en RP 70: 5,7 frente a 132 m³/s;
   - Corrientes en Los Laureles: 15,9 frente a 271 m³/s;
   - Desaguadero y Deseado: 0.

   Un criterio de abastecimiento basado en el módulo sobrestima la garantía. El Q95 de la tabla es el percentil diario de la serie completa, no de un año seco.
4. **Desfase temporal.** HydroRIVERS representa 1971–2000. Cada estación tiene su propio período, de 5 a 122 años. Las tendencias recientes no se corrigen: la sequía de la cuenca del Plata de 2019–2023 y la reducción de caudales nivales en Cuyo y la Patagonia desde 2010.
5. **Propagación del factor.**
   - Asignar a un afluente el factor de la estación aguas abajo supone que el sesgo es homogéneo en la cuenca. En ríos alóctonos, el sesgo se concentra en el tramo de pérdidas y no en las cabeceras: los afluentes andinos del Chubut quedan subestimados.
   - Mantener el factor aguas abajo de la última estación ignora pérdidas o aportes posteriores.
   - La interpolación en log(área) no conserva la masa entre confluencias.
6. **Topología del modelo.**
   - En el Desaguadero, el Diamante inferior y el Atuel pampeano, HydroRIVERS enruta los cauces de forma distinta a la real, y algunas estaciones quedan a más de 5 km del cauce modelado.
   - El área UPLAND_SKM incluye superficies endorreicas o que no aportan. En el Chubut es de 94.124 km², frente a 31.681 km² en la BDHI.
7. **Cauces múltiples.** En el Paraná medio e inferior y en el Delta, el caudal se reparte entre brazos y planicie. Se usan solo las estaciones que integran el total: Corrientes, Chapetón y Timbúes. Timbúes (15.680 m³/s) da menos que Chapetón (17.193 m³/s), aguas arriba, lo que sugiere que la sección de Timbúes no integra todo el caudal. Por eso conviene leer su factor (0,84) con cautela.
8. **Calidad de las series.** Se usaron datos validados y no validados de la BDHI (`validados=false` en el servicio), sin rellenar huecos y sin control propio de calidad, más allá de descartar valores negativos o −999.
