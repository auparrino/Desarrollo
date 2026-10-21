# Parámetros de beneficios para el análisis costo-beneficio (VAN, TIR, B/C)

> **Para qué sirve.** Reúne los parámetros con fuente que necesita la app para estimar los **beneficios** de los instrumentos de `docs/politicas-territoriales.md` (ciudad nueva, traslado de la capital, ciudades intermedias, repoblamiento, polos productivos). Es la contraparte de `docs/costos-unitarios.md`. La versión para la máquina está en `web/src/model/benefitParams.json`, con los mismos ids.
>
> **Fecha base:** octubre de 2026. **Tipo de cambio:** oficial BNA venta, promedio mensual (`api.argentinadatos.com`): 2026-07 = 1.508,7; 2026-10 = 1.537,9. Los valores publicados en USD se toman tal cual, en USD corrientes de su año.
>
> **Niveles de evidencia:**
> - **[E]** estudio causal o empírico;
> - **[O]** dato oficial;
> - **[A]** fuente secundaria (prensa, avisos, think tanks);
> - **[J]** juicio o derivación propia, con el cálculo explicado.
>
> Si no hay fuente, el valor es `null` o se explica la derivación.

---

## 1. Tasa social de descuento y horizonte

| id | Bajo | Central | Alto | Fuente | Ev. |
|---|---|---|---|---|---|
| `tasa_descuento` (real, anual) | 6 % | **12 %** | 12 % | Res. SPE 110/1996, Anexo I: «La tasa de interés o descuento social a utilizar será del 12 %» ([texto](https://www.argentina.gob.ar/normativa/nacional/norma-37536/texto)) | [O] |
| `horizonte_anios` | 30 | **40** | 50 | Guía ex post de la DNIP (nov-2022): el ejemplo evalúa un aeropuerto con 40 años de vida útil ([PDF](https://www.argentina.gob.ar/sites/default/files/if-2022-116518616-apn-dnipjgm-canexo.pdf)) | [J] |

- **Vigencia del 12 %.** El sitio de normativa marca la Res. 110/96 como derogada por la Res. 13/01. No se encontró ninguna norma posterior con otro valor. El capítulo XI del Digesto de MECON (`economia.gob.ar/digesto/pdf/cap11.pdf`) repite el 12 %, pero no se pudo descargar: el servidor respondió 503 y tiene la cadena TLS incompleta.
- **Otras referencias:**
  - La misma guía DNIP de 2022 descuenta al **10 % real** en su ejemplo.
  - Mendoza adoptó **11,9 %** con el método de Harberger ([Informe metodológico TSD, 2023](https://www.mendoza.gov.ar/wp-content/uploads/sites/90/2023/06/Informe-Metodologico-Tasa-Social-de-Descuento.pdf)). Su tabla comparativa da 10–12 % para el BID y el Banco Mundial, como «tasa administrativa convencional», y 6 % para Chile.
  - El BID (Campos, Serebrisky y Suárez-Alemán 2016, *Tasa de descuento social y evaluación de proyectos*) discute la tasa sin fijar un valor único.
- **El valor bajo (6 %)** sirve para la sensibilidad intergeneracional. Con el 12 %, los beneficios que llegan después del año 25 pesan menos del 6 % de su valor nominal, y eso castiga a las ciudades nuevas, que maduran en 30–40 años (§9).
- **Horizonte.** No hay uno normativo. Se recomienda 40 años con valor residual, y 30 y 50 como sensibilidad.

## 2. Productividad

### 2.1 PBG per cápita por provincia (`pbg_pc_provincia`)

- **Fuente.** Índice de VAB per cápita relativo de 2022 (Argentina = 100) de [Argendata/Fundar](https://argendata.fund.ar/data/CRECIM/provincia_pib_pc_relativo.csv). Se construye sobre CEPAL-MECON, *Desagregación provincial del valor agregado bruto de la Argentina, base 2004* (LC/TS.2022/196, [ficha](https://www.cepal.org/es/publicaciones/47900-desagregacion-provincial-valor-agregado-bruto-la-argentinabase-2004)).
- **Conversión a USD.** El índice se multiplica por el **PIB per cápita de 2025 del Banco Mundial (USD 14.898)**. El promedio del índice ponderado por la población del Censo 2022 da 100,2, así que la escala es consistente.
- **Supuestos.** Se mantiene la estructura provincial de 2022. Además, el índice es de VAB a precios básicos y se aplica al PIB, que incluye los impuestos netos.
- **Datos no usados.** MECON-CEPAL ya tiene tabulados hasta 2023 (preliminares, citados por UCA-ODSA 2024), pero no se encontró el archivo descargable. CEPAL y el repositorio del BID bloquean la descarga automática (Cloudflare).

| Cód. | Provincia | Índice 2022 | USD/hab | | Cód. | Provincia | Índice 2022 | USD/hab |
|---|---|---|---|---|---|---|---|---|
| 02 | CABA | 295,2 | 43.981 | | 50 | Mendoza | 74,3 | 11.072 |
| 06 | Buenos Aires | 84,1 | 12.525 | | 54 | Misiones | 47,7 | 7.107 |
| 10 | Catamarca | 69,0 | 10.278 | | 58 | Neuquén | 231,8 | 34.529 |
| 14 | Córdoba | 102,8 | 15.316 | | 62 | Río Negro | 84,8 | 12.630 |
| 18 | Corrientes | 51,7 | 7.696 | | 66 | Salta | 58,4 | 8.698 |
| 22 | Chaco | 61,4 | 9.146 | | 70 | San Juan | 75,1 | 11.193 |
| 26 | Chubut | 138,0 | 20.554 | | 74 | San Luis | 91,5 | 13.625 |
| 30 | Entre Ríos | 91,2 | 13.585 | | 78 | Santa Cruz | 167,3 | 24.928 |
| 34 | Formosa | 48,2 | 7.185 | | 82 | Santa Fe | 102,7 | 15.295 |
| 38 | Jujuy | 64,0 | 9.541 | | 86 | Santiago del Estero | 84,2 | 12.549 |
| 42 | La Pampa | 134,8 | 20.080 | | 90 | Tucumán | 52,6 | 7.841 |
| 46 | La Rioja | 65,7 | 9.794 | | 94 | Tierra del Fuego | 245,5 | 36.581 |

**Advertencia.** En las provincias petroleras y mineras (Neuquén, Santa Cruz, Chubut) y en Tierra del Fuego, el PBG per cápita sobrestima el ingreso de los residentes, porque buena parte de la renta se va de la provincia. Para medir el beneficio de un habitante adicional conviene usar salarios (§2.2) y no el PBG.

### 2.2 Salarios y producto por trabajador

| id | Bajo | Central | Alto | Unidad | Fuente | Ev. |
|---|---|---|---|---|---|---|
| `salario_priv_registrado_usd_anio` | 14.556 (mediana) | **19.447** (media) | 19.447 | USD/año, 13 sueldos | SIPA jul-2026: media $2.256.861 y mediana $1.689.227 por mes ([informe](https://www.argentina.gob.ar/sites/default/files/trabajoregistrado_2607_informe.pdf)); × 13 / 1.508,7. No incluye contribuciones patronales | [O] |
| `salario_rel_provincia` (objeto) | | ver JSON | | índice, país = 1 | `data/interim/economia/indicadores_empleo_departamento.csv`: `salario_medio_priv_2022` ponderado por `puestos_priv_2022`. Rango: Santiago del Estero 0,63 a Santa Cruz 1,62; CABA 1,39 | [O] |
| `vab_por_ocupado_usd` | | **33.100** | | USD/ocupado | PIB 2025 USD 683.098 M / (45,0 % × 45,85 M = 20,6 M ocupados). Incluye a los informales | [J] |
| `tasa_empleo` | 0,45 | **0,45** | 0,45 | ocupados/hab | EPH T2-2026: empleo 45,0 %, actividad 48,9 %, desocupación 7,9 %, informalidad 45 % ([comunicado](https://www.entrerios.gov.ar/dgec/wp-content/uploads/2026/09/Comunicado-EPH-T2-2026.pdf)) | [O] |
| `puestos_priv_registrados_por_hab` | 0,10 | **0,14** | 0,27 | puestos/hab | CSV del repo: 6,39 M puestos / 45,6 M habitantes (2022) | [O] |

- **Salario y producto.** El salario registrado (USD 19.400) representa un 59 % del producto por ocupado. Para valorar un empleo **formal** nuevo, se recomienda usar el salario × (1 + contribuciones) como cota baja del producto, y el producto por ocupado de la provincia como cota alta: `pbg_pc_provincia / tasa_empleo`.

## 3. Economías de aglomeración

| id | Bajo | Central | Alto | Ev. |
|---|---|---|---|---|
| `elasticidad_aglomeracion` | 0,01 | **0,03** | 0,05 | [E] |

| Estudio | Resultado |
|---|---|
| Combes & Gobillon 2015, *Handbook of Regional and Urban Economics* 5A:247–348, doi:10.1016/B978-0-444-59517-1.00005-2 ([HAL](https://halshs.archives-ouvertes.fr/halshs-01071761)) | 0,04–0,07 sin controlar el *sorting*. Instrumentar baja la estimación un 10–20 %. Con efectos fijos individuales queda en torno a 0,02. Usan 0,03 como ejemplo: duplicar el tamaño da +2,1 %. China: 0,10–0,12; India: 0,09–0,12 |
| Duranton 2016, *JRS* 56(2):210–238, doi:10.1111/jors.12239 | Colombia: elasticidad del salario a la población urbana de **~0,05**, más fuerte en el sector informal |
| Gómez-Lobo, Sánchez González, González Mejía y Calatayud 2022, BID IDB-WP-01324 ([ficha](https://publications.iadb.org/en/agglomeration-and-congestion-latin-america)) | América Latina: 0,05 en la base. **Baja al controlar la congestión** (TomTom) |
| Quintero & Roberts 2023, *JUE* 136:103573, doi:10.1016/j.jue.2023.103573 (antes WB PRWP 8560, 2018) | En 16 países de ALC, la variación residual se explica por externalidades de capital humano y acceso a mercados, **no por densidad** |
| Grover & Maloney 2022, WB PRWP 9977 «Proximity without Productivity» | Elasticidad del salario: Chile 0,017; Etiopía 0,052; Indonesia 0,057. La elasticidad de la productividad física (TFPQ) es nula o negativa en los países de menor ingreso: son «aglomeraciones estériles» |
| Argentina | No se encontró una estimación con microdatos de la EPH. Hay trabajos agregados sobre aglomeración y crecimiento provincial entre 1981 y 2007, sin una elasticidad comparable |

**Uso.** El beneficio de aglomeración de una ciudad que pasa de N₀ a N₁ habitantes es Δln(productividad) = ε · ln(N₁/N₀), aplicado a la masa salarial. **No se debe sumar** el beneficio en la ciudad receptora sin restar la pérdida en la de origen: en el AMBA, la elasticidad juega en sentido contrario. El valor neto puede ser cercano a cero o negativo, salvo que se descongestione (§6).

## 4. Multiplicadores de empleo local

| id | Bajo | Central | Alto | Ev. |
|---|---|---|---|---|
| `multiplicador_transable` (empleos no transables por empleo transable) | 0,84 | **1,6** | 2,5 | [E] |
| `multiplicador_publico` (empleos privados por empleo público trasladado) | 0,0 | **1,0** | 1,4 | [E] |

**Empleo transable:**
- **Moretti 2010**, *AER P&P* 100(2):373–377, doi:10.1257/aer.100.2.373 ([PDF del autor](https://eml.berkeley.edu/~moretti/multipliers.pdf), paginado 1–7).
  - 1,59 empleos no transables por cada empleo manufacturero.
  - **2,5 por empleo calificado** y 1,0 por empleo no calificado.
  - **4,9 en alta tecnología** (maquinaria, computación, equipos eléctricos y profesionales).
  - *Corrección:* el 2,5 corresponde a los empleos calificados, no a la alta tecnología.
- **van Dijk** (Oxford, Economics WP 771): 0,84 con un instrumento alternativo para EE. UU.
- **Argentina:** Zaratiegui 2019, tesis de maestría de la UdeSA ([hdl:10908/18473](https://repositorio.udesa.edu.ar/jspui/handle/10908/18473)). Encuentra unos **4** empleos no transables por cada transable, con EPH e instrumento *shift-share*. Es una tesis sin referato, así que no se usa como central.
- **México:** Hernández y Rojas (2000–2010), entre 1,8 y 2,6, de los cuales entre 1 y 1,5 son formales [A, visto en un resumen].

**Empleo público:**
- **Faggio & Overman 2014**, *JUE* 79:91–107, doi:10.1016/j.jue.2013.05.002. En Inglaterra, cada empleo público suma +0,5 no transables y resta −0,4 transables, sin efecto sobre el empleo privado total. En 1999–2007 hay desplazamiento (*crowding-out*). De ahí sale el valor bajo de 0.
- **Becker, Heblich & Sturm 2021**, *JUE* 122:103291, doi:10.1016/j.jue.2020.103291. En Bonn, algo más de 1 empleo en servicios y −0,2 en la industria, por cada empleo público. Es el valor central.
- **Faggio, Schlüter & vom Berge 2025**, *RSUE* 111:104084, doi:10.1016/j.regsciurbeco.2025.104084. En el traslado a Berlín, 1,3–1,4, muy localizado (a menos de 300 m). Es el valor alto.
- **América Latina:** Corbi, Papaioannou & Surico 2019, *RES* 86(5):1901–1934, doi:10.1093/restud/rdy069. En Brasil, USD 30.000 más de gasto municipal generan 1 empleo público y unos 3 privados, con un costo de unos USD 8.000 por empleo y año. El shock es de **gasto** por transferencias, no de traslado de oficinas, así que no es comparable de forma directa.

**Uso.** Los multiplicadores locales son una **cota superior** del efecto nacional (Moretti 2010): buena parte del empleo creado se reubica desde otras ciudades. En un ACB nacional, el beneficio por empleo inducido debe ser el **diferencial** entre el salario y el costo de oportunidad (el salario de reserva o el empleo previo), no el salario bruto.

## 5. Suelo y captura de plusvalías

| id | Bajo | Central | Alto | Unidad | Ev. |
|---|---|---|---|---|---|
| `valor_lote_urbano_m2_intermedia` | 17 | **40** | 110 | USD/m² | [A] |
| `captura_plusvalia_frac` | 0,05 | **0,10** | 0,30 | fracción de la valorización | [O] |

**Lotes urbanos.** No hay un relevamiento sistemático de lotes en ciudades intermedias: el Reporte Inmobiliario y Zonaprop publican departamentos. Se usaron **avisos de oferta** de 2026 (Mercado Libre y Argenprop), dividiendo el precio por la superficie:

| Ciudad | USD/m² |
|---|---|
| Río Cuarto | 17,5 / 37 / 103 |
| Venado Tuerto | 29 / 116 |
| Tandil | 88 |
| Gran Córdoba (Mendiolaza, La Calera) | 55–97 |

- El central de 40 es juicio [J].
- **Contraste [O]:** el Plan DHI imputa USD 4.800 de tierra por lote, unos 13,7 USD/m² (`costos-unitarios.md` §7).
- **Tierra rural:** USD 5.000–20.000/ha, es decir 0,5–2 USD/m² (`tierra_ha_*` de unitCosts.json). El salto de rural a lote urbano es de **20 a 80 veces**.
- **Smolka 2013**, *Implementing Value Capture in Latin America*, Lincoln Institute ([PDF](https://www.lincolninst.edu/sites/default/files/pubfiles/implementing-value-capture-in-latin-america-full_1.pdf)), p. 6: el «multiplicador urbano» del suelo habilitado frente al rural en la periferia «es típicamente mayor que 4:1». Ese número compara contra tierra periurbana, que ya incorpora expectativas.

**Captura de plusvalías:**
- **Ley 14.449** (provincia de Buenos Aires), art. 50: contribución obligatoria **mínima del 10 %** de la valorización. Los hechos generadores del art. 46 son el paso de rural a urbano, el cambio de uso, la mayor edificabilidad y las obras públicas sin contribución por mejoras. Fuentes: [CELS, Guías de la Ley de Hábitat 2017](https://www.cels.org.ar/web/wp-content/uploads/2017/12/Guias_ley_habitat.pdf) y Smolka 2013, p. 17. Trenque Lauquen (Ord. 3808/2011) exige ceder el 12 % de los lotes de cada nuevo loteo.
- **Colombia**, Ley 388/1997: 30–50 % de la plusvalía (Smolka 2013, p. 16). Es el valor alto.
- **Recaudación efectiva baja:** Montevideo obtuvo USD 3,8 M en 2011, el 2,5 % de su inversión. La contribución por mejoras es menos del 1 % de los ingresos locales en la región (Smolka). El valor bajo de 5 % es juicio [J].
- **Compra previa de la tierra.** Si el Estado compra la tierra a valor rural antes de anunciar el proyecto, como las *Development Corporations* británicas o Usme en Bogotá, la captura puede acercarse al 100 % de la valorización. En ese caso se recomienda modelar la valorización completa como beneficio fiscal.

**Fórmula sugerida.** Plusvalía = (valor_lote_urbano_m2 − valor rural/m²) × m² vendibles. Con 60 % de superficie vendible: (40 − 1,5) × 6.000 ≈ USD 230.000 por hectárea bruta, contra un costo de urbanización de USD 122.000/ha (`urbanizacion_ha`). El beneficio fiscal es `captura_plusvalia_frac` × plusvalía. **Cuidado con la doble cuenta:** la plusvalía capitaliza los mismos beneficios (empleo, accesibilidad) que se cuentan aparte. En un ACB social se usa la plusvalía **o** los flujos, no ambos. La captura es una transferencia, salvo por el costo marginal de los fondos públicos.

## 6. Congestión y sobreconcentración en el AMBA

| id | Bajo | Central | Alto | Unidad | Ev. |
|---|---|---|---|---|---|
| `costo_congestion_amba_usd_anio` | 1,7 × 10⁹ | **1,7 × 10⁹** | 2,9 × 10⁹ | USD/año | [E] |
| `costo_marginal_hab_amba` | 112 | **224** | 450 | USD/hab/año | [J] |

- **Fuente [E].** Calatayud, Sánchez González, Bedoya Maya, Giraldez y Márquez 2021, BID, *Congestión urbana en América Latina y el Caribe: características, costos y mitigación* ([ficha](https://publications.iadb.org/es/congestion-urbana-en-america-latina-y-el-caribe-caracteristicas-costos-y-mitigacion); [blog BID](https://blogs.iadb.org/transporte/es/cuanto-nos-cuesta-la-congestion-en-america-latina-y-el-caribe/)).
  - Buenos Aires: **USD 1.700 M en 2019**, cerca del **1,1 % del PIB metropolitano**, unos USD 112 por habitante.
  - Se mide solo el tiempo perdido, con datos de Google y TomTom.
  - El PDF está detrás de Cloudflare: las cifras vienen del blog y de la prensa que lo cita.
- **Alto [J].** El 1,1 % aplicado a un PIB del AMBA de alrededor del 39 % del PIB de 2025. Ese 39 % sale de §2.1: CABA aporta un 20 % del VAB y los 24 partidos del GBA, unos 19 puntos.
- **Costo marginal [J].** No se halló una estimación publicada del costo marginal de infraestructura o transporte de un habitante adicional en una megaciudad frente a una ciudad intermedia en Argentina. Por eso se usa:
  - **bajo:** el costo medio de congestión por habitante;
  - **central:** 2 veces el medio, el costo marginal social con elasticidad unitaria del tiempo de viaje al volumen;
  - **alto:** 4 veces el medio, en una red cerca de su capacidad.
- **Contexto [A].** CEPAL (Thomson y Bull 2002) estimó que el transporte urbano consume un 3,5 % del PIB regional y que el valor del tiempo de viaje suma otro 3 %. No es un dato específico del AMBA.
- **Gasto municipal.** El costo por habitante de los servicios municipales según la densidad está en `servicios_municipales_hab_anio` de unitCosts.json (Libertun de Duren). No alcanza para separar megaciudad de ciudad intermedia.

## 7. Presión tributaria (retorno fiscal)

| id | Bajo | Central | Alto | Ev. |
|---|---|---|---|---|
| `presion_tributaria` (Nación + provincias + municipios, % del PIB) | 26,7 % | **27,6 %** | 29 % | [A] |

- **IARAF (N. Argañaraz):** presión efectiva consolidada de 27,6 % en 2025, cerca de 29 % en 2024 y 26,7 % proyectado para 2026 ([Infobae 13/7/2026](https://www.infobae.com/economia/2026/07/13/la-presion-tributaria-es-la-mas-baja-de-los-ultimos-20-anos-por-la-reduccion-de-las-retenciones-a-la-exportacion/)).
- **Por nivel de gobierno:** provincias ~5 % y municipios ~1,1 % del PIB (IARAF vía prensa). La Nación pasó de 22,8 % en 2024 a 21,9 % en 2025 ([PwC Economic GPS 135](https://www.pwc.com.ar/es/egps/economic-gps-135.pdf)).
- No se pudo bajar la serie oficial de la Dirección Nacional de Investigaciones y Análisis Fiscal (MECON).
- **Uso.** Retorno fiscal ≈ presión × Δ producto **neto** (no bruto) atribuible al proyecto. Un empleo trasladado desde el AMBA no genera recaudación nueva: solo cuenta el diferencial de productividad.

## 8. Beneficios sociales: vivienda y tiempo

| id | Bajo | Central | Alto | Unidad | Ev. |
|---|---|---|---|---|---|
| `alquiler_vivienda_60m2_usd_mes` | 396 | **715** | 1.096 | USD/mes | [A] |
| `valor_tiempo_no_trabajo_usd_hora` | 0,57 | **0,82** | 2,6 | USD/h | [J] |
| `valor_tiempo_trabajo_usd_hora` | 8,7 | **11,5** | 11,5 | USD/h | [J] |

**Alquiler (valor locativo).**
- **Fuente:** relevamiento de Reporte Inmobiliario, vía [La Nación 2/8/2026](https://www.lanacion.com.ar/propiedades/casas-y-departamentos/alquileres-cuanto-cuesta-alquilar-un-y-un-tres-ambientes-en-el-interior-del-pais-nid02082026/), para 11 ciudades del interior.
- **Unidad:** una vivienda de 60 m² y 2 dormitorios es un **3 ambientes**.
- **Valores:**
  - **central:** la mediana de 3 ambientes, $1.077.780 (Salta);
  - **alto:** Neuquén, $1.653.750, sin contar Bariloche;
  - **bajo:** 2 ambientes en Tucumán, $597.000;
  - todo al tipo de cambio de jul-2026, 1.508,7.
- **Advertencias:**
  - Son precios de oferta y no se aclara si incluyen expensas.
  - Son capitales provinciales: en ciudades de 50.000 a 150.000 habitantes el valor será menor.
  - Para la CABA, Zonaprop da $886.527 por un 2 ambientes.
- **Uso:** el valor locativo anual (unos USD 8.600) es la **disposición a pagar** por una vivienda adicional que cubre déficit. Contra el costo de USD 66.000 por vivienda social (unitCosts.json), da un rendimiento bruto de alrededor del 13 % anual, antes de mantenimiento y vacancia.

**Valor del tiempo.** Se sigue Banco Mundial TRN-15 (Mackie, Nellthorp & Laird 2005, *Valuation of Time Savings*, [PDF](https://assets.publishing.service.gov.uk/media/57a08ca6e5274a27b2001323/C21-trn-15-EENote2.pdf), tabla 2):
- **Tiempo no laboral de adultos:** 0,3 × ingreso del hogar por persona y por hora. Con el ingreso per cápita familiar de la EPH del T2-2026 (media $688.496 y mediana $500.000 por mes, según la prensa sobre el informe del INDEC del 1/10/2026), 173 horas y un tipo de cambio de 1.450, da **0,82 USD/h** (0,57 con la mediana).
- **Tiempo de trabajo:** salario × 1,33. Con el salario del SIPA, da 11,5 USD/h.
- **Valor oficial.** No se encontró un valor oficial argentino (Vialidad Nacional, Ministerio de Transporte o DNIP).

## 9. Curvas de ocupación de ciudades nuevas

**Datos (población lograda / población meta):**

| Caso | Inicio | Meta | Datos | Fracción | Fuente | Ev. |
|---|---|---|---|---|---|---|
| Harlow (new town británica, satélite de Londres) | 1947 (4.500 hab.) | 60.000, luego 80.000 (1952) y 90.000 (1966) | 53.680 en 1961; 78.087 en 1971 | **67 % a 14 años; 98 % a 24** (sobre 80.000) | [British History Online, VCH Essex 8](https://prod.british-history.ac.uk/node/55020) | [O] |
| Milton Keynes | 1967 (40.000 hab.) | 250.000 | 211.062 en 2011 (wards urbanos); 264.349 en 2021 (área urbana, ONS) | 16 % al inicio; **84 % a 44 años** | [TCPA](https://www.tcpa.org.uk/wp-content/uploads/2021/11/Milton_Keynes.pdf); Wikipedia/ONS | [O] |
| Brasília (Distrito Federal) | 1960 | 500.000 para 2000 | 141.742 en 1960; 546.015 en 1970 (537.492 en una tabla revisada); 1.601.094 en 1991 | **28 % al inicio; >100 % a 10 años** | [IBGE 1972](https://biblioteca.ibge.gov.br/visualizacao/periodicos/190/ibge_inf_1972_n29_n36.pdf) | [O] |
| Putrajaya | 1995 | 320.000 | 68.361 en 2010; 109.202 en 2020 | **21 % a 15 años; 34 % a 25** | Censos DOSM (vía Wikipedia); auditoría nacional en politicas-territoriales | [O] |
| Sejong | 2012 (incluye a la población previa de Yeongi, unos 80.000) | 500.000 para 2030; 800.000 para 2040 | 204.088 en 2015; 353.933 en 2020; 392.471 en 2025 | 78 % de 500.000 (49 % de 800.000) **a 13 años** | [citypopulation.de](https://citypopulation.de/en/southkorea/admin/29__sejong/) (censo de registros) | [O] |
| Egipto, 1.ª generación (1977–1982) | | 0,5–2,1 M | 10 de Ramadán 12,7 %; Sadat 13,5 %; 15 de Mayo 20,2 %; El Obour 13,7 % | **13–20 % a 42–47 años** | [ECES 2026, Economic Lens 20](https://eces.org.eg/wp-content/uploads/2026/07/ECONOMIC-LENS-Issue-20-En.pdf) (CAPMAS 1/1/2024) | [O] |
| Egipto, New Cairo y 4.ª generación | ~2000 / 2015+ | 4 M / 6,5 M | New Cairo 8,0 %; Nueva Capital Administrativa 0,5 % | **8 % a ~24 años; <1 % a 9** | ECES 2026 | [O] |
| La Plata | 1882 | sin meta explícita | 10.407 en 1884; ~65.600 en 1890 (partido); 60.991 en 1895 (partido) y 38.574 (ciudad) | Auge en 8 años y caída en la crisis de 1890 | politicas-territoriales.md; fuentes secundarias de la UNLP | [A] |
| Tierra del Fuego (Ley 19.640) | 1972 | sin meta | 13.527 (1970); 27.358 (1980); 69.369 (1991); 101.079 (2001); 127.205 (2010); 185.732 (2022) | ×14 en 52 años | INDEC, vía [IPIEC](https://ipiec.tierradelfuego.gob.ar/wp-content/uploads/2024/09/1_Estadistica_Poblacion-1-ultimo.pdf) | [O] |
| Ciudad Guayana | 1961 | **no verificada** (la cifra de 2,5 M para 2020 de Wikipedia no aparece en Rodwin 1969) | 704.585 en el municipio Caroní (2011, INE) | – | Wikipedia [A]; la serie censal 1961–1990 no se pudo verificar | [A] |

**Escenarios (fracción de la meta según los años desde el inicio de las obras) [J]:**

| Escenario | 0 | 10 | 20 | 30 | 40 | Casos que lo anclan |
|---|---|---|---|---|---|---|
| `ocupacion_optimista` | 0 | 0,60 | 0,90 | 1,00 | 1,00 | Harlow, Brasília: satélite con empleo o capital con mandato fuerte; La Plata y Tierra del Fuego como casos con ancla |
| `ocupacion_base` | 0 | 0,20 | 0,40 | 0,55 | 0,70 | Putrajaya (21 % a 15 años y 34 % a 25) por debajo; Sejong y Milton Keynes por encima |
| `ocupacion_pesimista` | 0 | 0,03 | 0,08 | 0,12 | 0,15 | Ciudades nuevas egipcias sin ancla de empleo |

- **Interpolación.** Se recomienda interpolar linealmente y mantener el valor de 40 años después de ese plazo.
- **Población previa.** En los casos que arrancan con una población existente (Milton Keynes, Sejong, Brasília con ciudades satélite), la curva sobreestima lo logrado «desde cero». Para un proyecto argentino junto a una ciudad base, conviene sumar la población previa aparte.
- **Criterio de asignación.** La lectura de `politicas-territoriales.md` §4 se mantiene: el escenario depende sobre todo del **ancla de empleo** (G01) y de la **ciudad base** (K03), no del diseño urbano.

## 10. Evaluaciones costo-beneficio de ciudades nuevas o capitales

| Caso | Tipo | Resultado | Fuente | Ev. |
|---|---|---|---|---|
| Brasília | Ex post, modelo espacial con rutas como variación exógena | Ganancia de bienestar agregada del **2,8 %**: 3/4 por comercio y 1/4 por menor costo de migrar; rango regional de 1 a 15 %. El beneficio viene de la **red vial**, no de la ciudad en sí | Morten & Oliveira 2024, *AEJ: Applied* 16(2):389–421, doi:10.1257/app.20180487 | [E] |
| Nusantara (Bappenas) | Ex ante oficial | **+0,1 % del PIB real nacional** (de 5,0 a 5,1 % de crecimiento, unos IDR 15 billones) y +0,2 % de inflación; más tarde se habló de 0,1–0,2 % (B. Brodjonegoro, 26/6/2019) | [Okezone 26/6/2019](https://economy.okezone.com/read/2019/06/26/470/2071201/pembangunan-ibu-kota-baru-sumbang-0-1-pertumbuhan-ekonomi?page=all); [Bisnis 21/8/2019](https://ekonomi.bisnis.com/read/20190821/9/1139068/pindah-ibu-kota-ke-kalimantan-dipercaya-naikkan-pdb) | [A] (dato oficial reportado por la prensa) |
| Nusantara (académico) | Ex ante, modelo espacial dinámico | Trasladar unos 60.000 funcionarios **reduce el crecimiento y el bienestar nacionales**. El PBG de Kalimantan Oriental sube un 109 % y su población un 64 %. El argumento es regional, no de eficiencia | Rothenberg, Rafols, Wang & Jiang 2025, CPR WP 278, Syracuse ([ficha](https://surface.syr.edu/cpr/515/)) | [E] (working paper) |
| Sejong (KDI) | – | **No se encontró una evaluación costo-beneficio del KDI.** Un estudio coreano de 2019 (diferencias en diferencias y *shift-share* sobre empleo) no halla un efecto negativo significativo sobre las ciudades vecinas, pero sí una pérdida de ventaja comparativa | Resultado de búsqueda; no verificado en el texto | [A] |
| Tierra del Fuego (Fundar) | Diagnóstico fiscal, no un ACB | Costo fiscal del subrégimen industrial: **USD 1.070 M por año (0,22 % del PIB)**; la estimación oficial es de USD 1.567 M. La electrónica tiene unos 8.500 puestos y genera un 75 % del VAB promovido. Cumplió el objetivo poblacional (×14), pero no hay cuantificación de beneficios netos | [Fundar 2023, Doc. 1](https://fund.ar/wp-content/uploads/2023/06/Fundar_DOC1_Diagnostico_TDF.pdf) | [O] |
| New towns británicas | – | El TCPA sostiene que nunca se hizo una evaluación adecuada (ver politicas-territoriales.md) | – | [A] |

**Lectura para el modelo.** La única evaluación causal ex post (Brasília) atribuye el beneficio a la reducción de costos de comercio y migración, del orden del 3 % del bienestar. La evaluación estructural de Nusantara da un efecto nacional **negativo**. La cifra oficial de Bappenas (+0,1 % del PIB) es un efecto de demanda de corto plazo durante la construcción, no un beneficio social. En la app, el beneficio de «trasladar la capital» se debería modelar como la suma de cuatro componentes, no como un porcentaje del PIB:
1. accesibilidad (horas ahorradas × valor del tiempo);
2. multiplicador del empleo público neto de desplazamiento;
3. descongestión del AMBA;
4. valor locativo de las viviendas nuevas.

## 11. Pendientes

1. Serie oficial de MECON-CEPAL de VAB provincial 2023 (xlsx) y serie de presión tributaria de la DNIAF.
2. Archivo PDF del BID sobre congestión, para leer el % del PIB del AMBA y los costos indirectos.
3. Un relevamiento sistemático de precios de lotes en ciudades intermedias (colegios de martilleros, catastros).
4. Valor del tiempo oficial argentino, si existe en la DNIP o en Vialidad.
5. Serie censal de Ciudad Guayana entre 1961 y 1990, y meta del plan CVG-MIT (Rodwin 1969).
6. Evaluación del KDI sobre Sejong, en coreano.

## Revisión de octubre de 2026 (uso por funcionarios)

Cambios hechos después de probar la herramienta como la usaría un ministro:

1. **Salario del destino por mercado de trabajo, no por provincia.** Antes se usaba el salario promedio de la provincia: dos sitios vecinos a ambos lados de un límite (Villa Manzano, Neuquén, y Mainqué, Río Negro) daban resultados 16 veces distintos. Ahora se usa el salario privado de los departamentos a ≤ 50 km, ponderado por sus puestos de trabajo (CEP XXI 2022, `web/src/model/economiaDep.json`). El AMBA se calcula igual (CABA más 24 partidos, ponderado por puestos: ≈ 1,12 veces el promedio nacional). Ponderarlo por residentes daría ≈ 0,97, porque gran parte del empleo de CABA lo ocupan residentes del conurbano.
2. **Solo una parte de la brecha salarial es efecto del lugar** (`fraccion_brecha_causal`, central 0,5; rango 0,3–0,7). Combes, Duranton y Gobillon (2008) y Glaeser y Maré (2001) muestran que entre un tercio y la mitad de las diferencias salariales entre regiones se debe a quién trabaja en cada lugar. Sin este ajuste, los sueldos petroleros de Vaca Muerta se atribuían a cualquiera que se mudara a Neuquén.
3. **Polos con adicionalidad nacional** (`adicionalidad_nacional_empleo`, central 0,25). Antes se tomaba la mitad del producto del polo por un multiplicador local de 1,6. Los multiplicadores locales (Moretti) no se trasladan a escala nacional, porque buena parte del empleo se desplaza desde otras regiones (Kline y Moretti 2014; HM Treasury, *Additionality Guide*). Ahora solo cuenta como producción nueva el 25 % de los empleos. Además, el lado fiscal suma el costo de los incentivos a las empresas (10 años por empleo creado), y el parque industrial se urbaniza por etapas en lugar de construirse entero el primer año.
4. **Plazo de recupero estable.** El recupero es el primer año desde el cual el saldo acumulado descontado queda positivo hasta el final del horizonte. Los plazos menores a 5 años se muestran como "en menos de 5 años": ocurren cuando casi toda la inversión se necesitaría igual en el AMBA, por ejemplo al fortalecer ciudades intermedias.
5. **Costo de construcción regional** (Res. SH 8/2021, Casa Propia; `docs/costo-construccion-regional.md`). Se aplica a la edificación: vivienda, urbanización, escuelas, hospitales, oficinas, plantas y parques. Chubut ×1,26, Santa Cruz ×1,38, Tierra del Fuego ×1,59. Cada tarjeta muestra qué parte del costo depende del lugar.

### Ficha para gabinete

Cada sitio del modo simple tiene una ficha imprimible (`web/src/ui/panels/Ficha.tsx`, cálculos en `web/src/model/brief.ts`):

- **Inversión por mandato de 4 años:** escenario "lo más probable". La conexión se hace en 5 años y el resto acompaña la ocupación.
- **Quién paga:** responsable principal de cada rubro según las competencias habituales. Educación y salud son provinciales (Ley 24.049).
- **Si no se hace nada:** proyección del INDEC 2022–2035 por departamento (`web/src/model/proyecciones.json`). El AMBA pierde unas 98.000 personas y el país suma unas 983.000.
- **Misma inversión pública, otro instrumento, en la misma zona:** ciudades y pueblos existentes se toman de la celda más cercana que corresponde al instrumento.
- **Empleo necesario frente al existente:** incluye los sectores principales y los proyectos a ≤ 100 km.
- **Origen probable de la gente:** modelo de gravedad orientativo, sin calibrar con datos de migración.
- **Hoja de ruta institucional:** art. 3 de la Constitución Nacional, Ley 21.499, Convenio 169 de la OIT, Ley 25.675, Ley 26.331, Ley 24.156 y RIGI.
- **Riesgos con su mitigación.**

El botón **Presentar** deja el mapa y una lámina con los cinco mejores lugares, para proyectar en una reunión.

### Segunda pasada (octubre de 2026)

- **Orden de los lugares:** se puede ordenar por aptitud, por economía (saldo para el país) o combinado, que es la opción predeterminada y suma los dos puestos. También hay una tabla comparativa imprimible de los seis primeros.
- **Tesoro:** la ficha muestra lo que el Estado pone y lo que recupera en valor presente. La plata por mandato separa la inversión pública de la que pagan los hogares y la expresa como porcentaje del PBI por año.
- **Punto de equilibrio:** la ficha calcula qué fracción de la meta tiene que llegar en 30 años para que el saldo dé cero, escalando la curva de ocupación (`escalaOcupacion`). Si con más gente no alcanza, calcula qué salario relativo haría falta en la zona.
- **Origen regional:** con `origen: "region"` el resultado se calcula suponiendo que la gente viene de la misma región. La región de origen se aproxima como 5 veces el entorno de 50 km. En ese caso no hay diferencia de productividad ni congestión evitada.
- **Capital:**
  - Los empleos públicos trasladados (74.000 agentes, con un multiplicador público de 1) se descuentan del riesgo de falta de trabajo.
  - Se suma el Congreso, la Corte y los tribunales federales: 200.000 m², orden de magnitud a verificar.
- **Inundación:** el umbral de exclusión R03 baja de 50 % a 40 % de la celda. La función F09 llega a 0 con 40 % inundable en lugar de 100 %.
- **Calendario de hitos** por instrumento y **efecto político:** quién gana y quién pierde población, con la aclaración de que ni las bancas ni la coparticipación cambian solas.

### Retardo inicial y techo de empleo (casos concretos)

- **Retardo inicial:** las curvas de ocupación empiezan después de un retardo: 3 años en ciudad nueva y capital (primero hay que construir la conexión y la primera etapa), 2 en polos y 1 al ampliar ciudades o pueblos existentes. Antes la gente llegaba desde el año 1, con las obras sin hacer.
- **Empleo para los que llegan:** los puestos que ya existen están ocupados por quienes viven en la zona. Para los recién llegados queda la mitad del crecimiento normal del empleo (ritmo 2014–2022, con un tope de 3 % anual), más los puestos públicos trasladados en el caso de la capital (`empleoFaltante` en `web/src/model/labor.ts`). Si falta más del 20 %, el plan muestra cuánta gente llegaría con el trabajo disponible.
- **Casos concretos:** `docs/casos-concretos.md` (lo genera `web/scripts/casos.ts`) desarrolla un caso por instrumento con los mismos cálculos que la ficha.
