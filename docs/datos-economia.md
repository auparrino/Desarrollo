# Datos económicos: dónde hay (o habrá) trabajo

Este documento describe las capas de empleo, salarios y proyectos productivos. Se usan en los cinco
instrumentos de la app: ciudad nueva, traslado de capital, ciudades intermedias receptoras,
repoblamiento de pueblos y polos productivos.

- Script: `pipeline/economia.py`. Se ejecuta con `python3 -I pipeline/economia.py`. Es independiente
  de `build.py` y no lo modifica.
- Datos crudos: `data/raw/economia/`.
- Datos limpios: `data/interim/economia/`.
- Clave territorial: `cod_dep`, el código INDEC de departamento de 5 dígitos, igual al de
  `web/public/data/departamentos.geojson`. Los proyectos traen además `lat` y `lon` en WGS84.

Ninguna cifra de este documento ni de las tablas fue estimada a mano. Todo sale de las fuentes
listadas o se calcula a partir de ellas con el script.

---

## 1. Fuentes

| # | Dataset | Organismo | URL exacta | Licencia | Cobertura descargada |
|---|---|---|---|---|---|
| 1 | Puestos de trabajo asalariados registrados por departamento: privados, total empresas, públicos y total | CEP XXI, Ministerio de Economía (SIPA) | `https://cdn.produccion.gob.ar/cdn-cep/datos-por-departamento/puestos/puestos_depto_priv.csv`, `…/puestos_depto_tot_emp.csv`, `…/puestos_depto_pub.csv`, `…/puestos_depto_total.csv` | CC BY 4.0 (datos abiertos del Ministerio) | Mensual, de enero de 2014 a noviembre de 2023 |
| 2 | Puestos privados por departamento y sector, según letra y CLAE a 2 dígitos | CEP XXI | `…/puestos/puestos_depto_priv_por_letra.csv`, `…/puestos/puestos_depto_priv_por_clae2.csv` | CC BY 4.0 | Mensual, 2014-01 a 2023-11 |
| 3 | Salario bruto promedio y mediano por departamento | CEP XXI | `…/salarios/w_mean_depto_priv.csv`, `w_median_depto_priv.csv`, `w_mean_depto_pub.csv`, `w_mean_depto_total.csv`, `w_mean_depto_priv_letra.csv`, `w_mean_depto_priv_clae2.csv` | CC BY 4.0 | Mensual, 2014-01 a 2023-11 |
| 4 | Metodologías y diccionarios | CEP XXI | `…/puestos/Metodologia.pdf`, `…/salarios/Metodologia.pdf`, `https://cdn.produccion.gob.ar/cdn-cep/datos-por-departamento/diccionario_cod_depto.csv`, `…/diccionario_clae2.csv` | CC BY 4.0 | — |
| 5 | Distribución geográfica de los establecimientos productivos | CEP XXI | `https://cdn.produccion.gob.ar/cdn-cep/establecimientos-productivos/distribucion_establecimientos_productivos_sexo.csv` | CC BY 4.0 | 2021 y 2022; un punto por establecimiento con rango de empleo |
| 6 | Cartera de proyectos mineros metalíferos y de litio | Secretaría de Minería, SIACAM | `https://www.mecon.gob.ar/dataset/Cartera-de-Proyectos-Mineros-Metaliferos-y-Litio-del-SIACAM.xlsx` | CC BY 4.0 | 235 proyectos con coordenadas y estado |
| 7 | Cartera de proyectos mineros no metalíferos y rocas de aplicación | SIACAM | `https://www.mecon.gob.ar/dataset/Cartera-de-Proyectos-Mineros-No-Metaliferos-y-Roca-de-Aplicacion-del-SIACAM.xlsx` | CC BY 4.0 | 704 filas; 699 tienen coordenadas |
| 8 | Anuncios de inversión minera | SIACAM | `https://www.mecon.gob.ar/dataset/Anuncios-de-inversion.csv` | CC BY 4.0 | 55 anuncios desde diciembre de 2019 |
| 9 | Empleo minero por rubro y empleo en litio por provincia | SIACAM | `https://www.mecon.gob.ar/dataset/Empleo-rubro-prov.csv`, `https://www.mecon.gob.ar/dataset/Tablero-Litio/Empleo-litio.csv` | CC BY 4.0 | Mensual desde 2007, a nivel provincia o país |
| 10 | Concesiones de explotación de hidrocarburos (polígonos) | Secretaría de Energía, SIG | WFS `https://sig.energia.gob.ar/wmspubmap?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=planosbase_concesiones_explotacion&SRSNAME=EPSG:4326&OUTPUTFORMAT=application/json;%20subtype=geojson` | CC BY 4.0 (catálogo datos.gob.ar, dataset `produccion-hidrocarburos-concesiones-de-explotacion`) | 300 áreas |
| 11 | Pozos no convencionales de shale (Capítulo IV y Adjunto IV) | Secretaría de Energía, SIG | mismo WFS, `TYPENAME=pozos_noconvencionales_shale` | CC BY 4.0 | 3532 pozos, de los cuales 3448 son de la formación Vaca Muerta |
| 12 | Cuencas de shale prospectivas (EIA) | Secretaría de Energía, SIG | mismo WFS, `TYPENAME=prospective_shale_basins_argentina` | CC BY 4.0 | polígonos |
| 13 | Centrales de generación del MEM | Secretaría de Energía, SIG, con datos de CAMMESA | mismo WFS, `TYPENAME=visor_centrales_unificacion` | CC BY 4.0 | 474 centrales, de las cuales 246 son renovables |
| 14 | Obras de centrales renovables (RenovAr, MATER y otras) | Secretaría de Energía, SIG | mismo WFS, `TYPENAME=renovables_vi_visor_obras_renovar` | CC BY 4.0 | 136 obras con potencia y estado |
| 15 | Registro Nacional de Parques Industriales (RENPI) | Secretaría de Industria y Comercio | `https://cdn.produccion.gob.ar/cdn-secind/rempi-datos-abiertos/base-rempi-para-publicar.ods` | CC BY 4.0 | 362 agrupamientos, sin coordenadas |
| 16 | IPC nacional, nivel general (base diciembre de 2016 = 100) | INDEC, a través de la API de Series de Tiempo | `https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&format=csv&limit=1000&start_date=2014-01-01` | CC BY 4.0 | 2016-12 a 2026-08 |
| 17 | Geocodificación de los parques industriales | IGN e INDEC (BAHRA), API Georef | `data/raw/ign_localidad_bahra.json` (ya estaba en el repo) y `https://apis.datos.gob.ar/georef/api/localidades` | CC BY 4.0 | — |

Las URLs de CEP XXI se obtuvieron del índice oficial `da_urls.rda` del paquete R
[`CEProduccionXXI/DatosAbiertosCEP`](https://github.com/CEProduccionXXI/DatosAbiertosCEP). Los
datasets de SIACAM, Energía y RENPI se encontraron con la API CKAN de `datos.gob.ar`
(`/api/3/action/package_search`). Todos esos datasets declaran licencia Creative Commons
Attribution 4.0. Cita sugerida: «Fuente: CEP XXI, Ministerio de Economía, en base a SIPA», o el
organismo que corresponda.

### Notas de descarga (octubre de 2026)

- **La serie CEP por departamento termina en noviembre de 2023.** El encabezado `Last-Modified`
  del CDN indica el 15 de marzo de 2024. El CEP no siguió actualizando esta serie, así que no hay
  datos de 2024 a 2026 por departamento en esta fuente.
- **`datos.energia.gob.ar` no responde desde este entorno** (la conexión se reinicia). Por eso las
  capas de Energía se bajaron de su servicio WFS oficial (`sig.energia.gob.ar`), que publica los
  mismos datasets.
  - Ese servidor no envía el certificado intermedio *Sectigo Public Server Authentication CA DV R36*.
    Se tomó ese intermedio de la base pública CCADB de Mozilla y se lo agregó a una copia del
    bundle de CA. La verificación TLS quedó activa en todo momento.
  - No se pudo bajar el dataset «Proyectos Mineros (Ubicación aproximada)» de Energía, que también
    está alojado en `datos.energia.gob.ar`. La cartera de SIACAM lo reemplaza y trae coordenadas
    más precisas.
- **El portal `datos.produccion.gob.ar` devuelve 403 desde este entorno.** No fue necesario, porque
  los archivos están en el CDN.
- **Pobreza y NBI quedaron fuera a propósito**, para no duplicar el trabajo del agente que revisa
  la plataforma Poblaciones. Si Poblaciones no los cubre, la fuente es INDEC (NBI por departamento
  del Censo 2010). Las tasas de pobreza por ingresos de la EPH solo existen para 31 aglomerados y no
  por departamento.

---

## 2. Archivos limpios y variables (`data/interim/economia/`)

### `empleo_departamento.csv`: panel anual por departamento (5041 filas, 505 departamentos, 2014 a 2023)

Cada valor es el **promedio de los meses disponibles del año**. El año 2023 cubre solo de enero a
noviembre (`meses = 11`).

| Columna | Descripción |
|---|---|
| `cod_dep`, `departamento`, `provincia`, `anio`, `meses` | Identificación del departamento y cantidad de meses promediados |
| `puestos_priv` | Puestos asalariados registrados del sector privado |
| `puestos_tot_emp` | Puestos del sector privado más los de empresas públicas |
| `puestos_pub` | Puestos del sector público en sentido amplio |
| `puestos_total` | Todos los puestos asalariados registrados |
| `salario_medio_priv`, `salario_mediano_priv`, `salario_medio_pub`, `salario_medio_total` | Remuneración bruta mensual en pesos corrientes (incluye el SAC en los meses en que se paga) |
| `salario_rel_nac_priv` | Salario medio privado del departamento dividido por el promedio nacional del mismo mes, ponderado por puestos. No necesita deflactor |
| `salario_real_priv_nov2023` | Salario medio privado en pesos de noviembre de 2023, deflactado con el IPC del INDEC. Solo existe desde 2017, porque el IPC nacional empieza en diciembre de 2016 |

Ajustes de código aplicados:

| Código CEP | Código usado | Departamento | Qué cubre |
|---|---|---|---|
| 06217 | 06218 | Chascomús | Incluye Lezama (06466) |
| 94007 | 94008 | Río Grande | Incluye Tolhuin (94011) |
| 94014 | 94015 | Ushuaia | — |

**La Ciudad de Buenos Aires va como `02000`.** El CEP no la desagrega por comuna porque los códigos
postales no coinciden con las comunas. La población usada para CABA es la suma de las 15 comunas.

Las celdas con 1 o 2 puestos vienen marcadas con `-99` por secreto estadístico y se tratan como
dato faltante. Ese tratamiento afecta sobre todo a la apertura sectorial de los departamentos
chicos.

### `empleo_departamento_letra.csv` y `empleo_departamento_clae2.csv`

Formato largo, con las columnas `cod_dep, anio, letra|clae2, puestos`. Son los puestos privados
promedio anuales por sector. Las descripciones están en `diccionario_clae2.csv`, con las columnas
`clae2, clae2_desc, letra, letra_desc`.

### `indicadores_empleo_departamento.csv`: una fila por departamento (505)

| Grupo | Columnas |
|---|---|
| Nivel | `puestos_priv_2014`, `_2019`, `_2022`, `puestos_priv_2023_ene_nov`, `pob2022`, `puestos_priv_cada_1000hab_2022` |
| Dinámica | `var_pct_2014_2022`, `tasa_anual_2014_2022`, `var_pct_2019_2023_ene_nov` (compara los mismos meses), `var_pct_nacional_2014_2022` (+1,85 %), `dif_vs_nacional_pp` |
| Shift-share 2014–2022, con CLAE2 | `ss_efecto_nacional`, `ss_efecto_estructural` (mezcla sectorial), `ss_efecto_competitivo` (dinamismo propio del lugar), `ss_competitivo_pct_base` |
| Especialización 2022 | `lq_A` … `lq_N`: cociente de localización por letra. A = agro, B = minas y canteras, C = industria, D = energía, F = construcción, G = comercio, H = transporte, I = hotelería, J = información, K = finanzas, M = servicios profesionales, N = servicios de apoyo |
| Especialización CLAE2 | `clae2_especializacion` y su `_desc`: el CLAE2 con mayor cociente de localización entre los que tienen al menos 100 puestos. También `lq_clae2_especializacion`, `clae2_principal` y su `_desc`, `share_clae2_principal` y `hhi_clae2` (concentración; 1 − HHI mide la diversificación) |
| Salario | `salario_medio_priv_2022`, `salario_rel_nac_priv_2022`, `var_pct_salario_real_2017_2022`, `share_publico_2022` |
| Establecimientos 2022 | `estab_total_2022`, `estab_1_9_2022`, `estab_10_49_2022`, `estab_50_199_2022`, `estab_200_499_2022`, `estab_500_mas_2022`, `estab_200_mas_2022`, `estab_agro_mineria_industria_2022` (CLAE ≤ 33) |
| Proyectos en el departamento | `n_mineria_litio`, `n_mineria_cobre`, `n_mineria_metalifera`, `n_hidrocarburos`, `n_hidrocarburos_vaca_muerta`, `n_energia_*`, `n_parque_industrial`, `pozos_vaca_muerta` |

Algunos resultados que salen de los datos:

- Entre 2014 y 2022 el empleo privado registrado nacional creció 1,85 %. 304 de los 497
  departamentos con dato crecieron más que el promedio.
- Entre los departamentos con al menos 5000 puestos en 2014, los que más crecieron son Famaillá
  (+44 %) y Monteros (+40 %), en Tucumán, y Cainguás (+29 %), en Misiones.
- Los saltos más grandes en departamentos mineros chicos son Iglesia, San Juan (+86 %), Los Andes,
  Salta (+80 %), y Cochinoca, Jujuy (+68 %).

### `establecimientos_departamento.csv`

Columnas `cod_dep, anio (2021|2022), estab_<rango>, estab_total, estab_200_mas,
estab_agro_mineria_industria`.

Esta fuente sí viene por comuna en CABA (`02007` … `02105`); usa los códigos viejos de Chascomús y
Tierra del Fuego, que se ajustan igual que en el SIPA. En los indicadores se suman en `02000`
para poder unirlas con el SIPA.

### `establecimientos_grandes_2022.csv`

Puntos `lat, lon, clae6, cod_dep, rango`. Son los establecimientos con 200 empleados o más en 2022.
Las coordenadas vienen redondeadas por el CEP a 3 decimales, unos 100 m.

### `proyectos.geojson` y `proyectos.csv`: 1226 puntos

Cada punto trae:

- **Identificación y clasificación:** `id`, `nombre`, `tipo`, `subtipo`, `etapa` (texto original),
  `etapa_norm` (`exploracion`, `desarrollo`, `construccion`, `operacion`, `otra` o `sin dato`).
- **Ubicación:** `lat`, `lon`, `cod_dep`, `departamento`, `provincia`, `cod_dep_metodo`.
  - `cod_dep_metodo` vale `dentro` cuando el punto cae dentro del departamento. Vale
    `mas_cercano_Xkm` en 16 casos: 14 concesiones costa afuera en la cuenca Austral y el golfo San
    Jorge, Yacyretá–Añá Cuá y Carrizal.
- **Empleo:** `empleo_estimado` y `empleo_fuente`.
- **Atributos según el tipo:** `operador`, `potencia_mw`, `ronda`, `inversion_anunciada_usd`,
  `pozos_vaca_muerta`, `pozos_vaca_muerta_en_extraccion`, `registro`, `localidad`.
- **Origen:** `precision`, `fuente`, `fuente_url`.

| `tipo` | n | Origen | `precision` |
|---|---|---|---|
| `mineria_litio` | 66 | SIACAM | punto del proyecto |
| `mineria_cobre` | 39 | SIACAM | punto del proyecto |
| `mineria_metalifera` (oro, plata, uranio, plomo y otros) | 130 | SIACAM | punto del proyecto |
| `hidrocarburos_vaca_muerta` | 73 | Concesiones con al menos un pozo de la formación Vaca Muerta dentro | punto interior del área |
| `hidrocarburos` | 227 | Otras concesiones de explotación | punto interior del área |
| `energia_solar`, `energia_eolica`, `energia_hidro_pequena`, `energia_biogas`, `energia_biomasa`, `energia_hidro` | 382 | Centrales renovables en operación (CAMMESA) y obras RenovAr | punto de la central o de la obra |
| `parque_industrial` | 309 | RENPI | localidad de BAHRA o de Georef |

- **Etapas mineras:**
  - Producción y Reingeniería pasan a `operacion`.
  - Construcción pasa a `construccion`.
  - Factibilidad, Prefactibilidad y Evaluación Económica Preliminar pasan a `desarrollo`.
  - Exploración y Prospección pasan a `exploracion`.
  - Cese de operaciones pasa a `otra`.
- **Obras renovables:** las que no tienen estado en la fuente quedan como `sin dato`.
- **Inversión anunciada:** se completó en 26 proyectos mineros. Se cruzó el nombre exacto, ya
  normalizado, del archivo de anuncios de SIACAM.
- **Empleo estimado:** `empleo_estimado` queda **vacío en todos los proyectos**. Ninguna de las
  fuentes oficiales abiertas publica empleo por proyecto. SIACAM publica empleo minero y de litio
  solo por provincia o rubro (fuente 9). No se completó con cifras de prensa ni de informes de
  empresas, para no meter datos no verificados. Si se cargan más adelante, hay que indicar el
  origen en `empleo_fuente`.

### Otros archivos

- **`concesiones_hidrocarburos.geojson`:** 300 polígonos con operador, participación, estado,
  `pozos_vaca_muerta` y `pozos_vaca_muerta_en_extraccion`. Este último cuenta los pozos con estado
  «Extracción Efectiva».
- **`proyectos_mineria_no_metalifera.geojson`:** 699 canteras y proyectos no metalíferos con
  coordenadas, la mayoría en producción. Van aparte para no saturar la capa principal.
- **`parques_industriales_renpi.csv`:** el RENPI completo, con coordenadas y precisión.
  - 304 parques se ubicaron por coincidencia exacta con BAHRA y 45 con la API Georef.
  - 4 se ubicaron en el centroide del departamento homónimo.
  - 9 no se pudieron ubicar y no están en `proyectos.geojson`.

---

## 3. Propuesta de indicadores para la app

Los indicadores se calculan sobre la grilla o los departamentos que ya usa la app. Entre paréntesis
va la columna o el archivo de donde salen.

1. **Dinamismo del empleo formal.**
   - Variable principal: `ss_competitivo_pct_base`, el crecimiento propio del lugar sin el efecto
     nacional ni el de su mezcla sectorial.
   - Alternativas más simples: `tasa_anual_2014_2022` o `dif_vs_nacional_pp`.
   - Conviene sumar `var_pct_2019_2023_ene_nov` como señal reciente.
   - Uso: a las ciudades intermedias receptoras les suma un dinamismo alto. Un dinamismo negativo
     es una alerta para el repoblamiento.
2. **Demanda laboral de proyectos a menos de X km.**
   - Cálculo: para cada celda o localidad, contar o ponderar los proyectos de `proyectos.geojson`
     dentro de radios de 30, 60 y 100 km, que son distancias razonables de commuting y de rotación
     en campamento.
   - Ponderación por etapa: `operacion` = 1, `construccion` = 1, `desarrollo` = 0,5,
     `exploracion` = 0,2. Esta escala es una propuesta de la app, no un dato de la fuente.
   - Tipos que conviene separar: litio, cobre, Vaca Muerta, energías renovables y parques
     industriales.
   - Si después se completa `empleo_estimado` con una fuente verificada, se reemplaza el conteo
     ponderado por la suma de empleo.
   - Para Vaca Muerta, usar `pozos_vaca_muerta_en_extraccion` del área como intensidad.
3. **Empleo formal existente al alcance.**
   - Cálculo: suma de `estab_200_mas` (o de los puntos de `establecimientos_grandes_2022.csv`) a
     menos de X km.
   - Ventaja: ubica el trabajo donde está el establecimiento, no donde vive el trabajador.
4. **Tasa de empleo formal privado** (`puestos_priv_cada_1000hab_2022`). Mide la
   profundidad del mercado formal en el lugar de residencia.
5. **Calidad salarial** (`salario_rel_nac_priv_2022`, `var_pct_salario_real_2017_2022`).
6. **Especialización y riesgo de monocultivo.**
   - Columnas: `lq_*`, `clae2_especializacion_desc`, `hhi_clae2`.
   - Lectura para polos productivos: un cociente de localización alto en B o D marca un polo
     extractivo o energético existente. Un HHI alto indica vulnerabilidad ante el ciclo.
7. **Dependencia del empleo público** (`share_publico_2022`). Sirve como
   contexto para el traslado de capital, porque el efecto del traslado es mayor donde el empleo
   público pesa poco.
8. **Brecha entre oferta y demanda.** Cruzar la demanda de proyectos a menos de X km con la
   población en edad activa y el empleo formal existente (indicadores 2 y 4). Así se ven los lugares
   con proyectos pero poco mercado laboral local, candidatos a ciudad nueva o a polo con vivienda.

Combinaciones sugeridas por instrumento:

| Instrumento | Indicadores |
|---|---|
| Ciudades intermedias receptoras | 1 + 3 + 4 + 5 |
| Repoblamiento de pueblos | 2, con radio de 30 a 60 km, + 1 |
| Polos productivos | 2 + 6 + 8 |
| Ciudad nueva | 2 + 8 |
| Traslado de capital | 7 + 3 |

---

## 4. Limitaciones

- **La informalidad no está en el SIPA.** Las series cubren solo el empleo asalariado registrado:
  - No incluyen a los asalariados no registrados.
  - No incluyen a los cuentapropistas, monotributistas ni al servicio doméstico.
  - La informalidad es muy desigual entre regiones (la EPH la mide por aglomerado), así que el empleo
    real está subestimado y en distinto grado según la región. El índice sirve para comparar
    dinámicas, no niveles absolutos de trabajo.
- **Ubicación del empleo.**
  - La serie de **puestos por departamento** del CEP ubica cada puesto según el **domicilio del
    trabajador**, tomado de SINTyS y AFIP y asignado por código postal. No usa la sede de la
    empresa. Por eso mide dónde vive la gente con empleo formal, no dónde está el trabajo.
    - En polos con commuting o con rotación de campamento (Añelo y Confluencia en Vaca Muerta, los
      salares de la Puna) muchos trabajadores figuran en la ciudad dormitorio o en otra provincia.
  - El **sector** se asigna por la actividad principal declarada por la empresa en el formulario
    F.883 de AFIP. Una empresa con sede en CABA y operaciones mineras en la Puna clasifica todos sus
    puestos según su actividad principal.
  - La **sede declarada sesga** las fuentes que usan el domicilio fiscal, como la facturación por
    departamento. También sesga la nómina de empresas con sede en CABA o en el Gran Buenos Aires.
  - La capa de **establecimientos** usa la sucursal real, pero solo informa rangos de empleo y cubre
    2021 y 2022.
- **El código postal no distingue comunas.** Por eso CABA va como un único `02000`.
- **Desactualización.** La serie por departamento termina en noviembre de 2023. No refleja la
  evolución del empleo posterior ni el arranque de proyectos más nuevos.
  Conviene buscar en el futuro una serie provincial más nueva del SIPA para corregir niveles.
- **Secreto estadístico.** Los valores `-99` (1 o 2 puestos) quedan como faltantes. En
  departamentos con menos de unos 100 puestos, las variaciones porcentuales son muy volátiles: por
  ejemplo, Susques pasa de 5,7 a 23,1 puestos, +305 %. Antes de mapear, conviene filtrar por un
  piso de puestos.
- **Pluriempleo.** Se cuentan puestos, no personas.
- **El salario incluye el SAC.** El promedio de 2023 no tiene diciembre, por lo que el nivel nominal
  y el real de ese año no se comparan directamente con años completos.
- **Proyectos.**
  - No hay empleo por proyecto en fuentes oficiales.
  - La etapa minera es la que informa SIACAM a la fecha de descarga.
  - Las concesiones de hidrocarburos van representadas por un punto interior: un área puede medir
    cientos de km², así que para medir distancias conviene usar el polígono
    (`concesiones_hidrocarburos.geojson`).
  - Las obras de RenovAr tienen muchos estados vacíos.
  - Un proyecto puede aparecer dos veces: como obra y, una vez terminado, como central del MEM. No
    se deduplicó por falta de una clave común.
  - Los parques industriales están ubicados por localidad, no por el predio.
- **Pozos.** La capa de pozos de shale es la que publica el SIG. Puede no incluir los pozos
  perforados más recientemente ni los de formaciones tight.
