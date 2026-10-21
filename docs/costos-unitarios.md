# Costos unitarios para Argentina (2023–2026)

> **Para qué sirve.** Reúne los costos unitarios argentinos que necesita la app para estimar cuánto cuesta cada instrumento de `docs/politicas-territoriales.md`: ciudad nueva, traslado de la capital, ciudades intermedias, repoblamiento de pueblos y polos productivos. Los costos internacionales de referencia (Nusantara, Putrajaya, Brasília) están en ese documento y aquí no se repiten. La versión para la máquina está en `web/src/model/unitCosts.json`, con los mismos ids.
>
> **Fecha base:** octubre de 2026. **Tipo de cambio:** oficial del BNA, billete venta, promedio mensual, tomado de `api.argentinadatos.com/v1/cotizaciones/dolares/oficial`. Cada monto en pesos se convirtió con el promedio **del mes de su fecha de precios**. Los montos publicados en USD se toman tal cual, en USD corrientes de su año.
>
> **Niveles de evidencia:**
> - **[O]** oficial o licitación;
> - **[E]** estudio;
> - **[A]** prensa, aviso o fuente secundaria;
> - **[J]** juicio o derivación propia, con el cálculo explicado.
>
> Cuando no hay fuente, el valor es `null`.

## 0. Tipos de cambio usados (ARS por USD, promedio mensual BNA venta)

| Mes | TC | Mes | TC | Mes | TC |
|---|---|---|---|---|---|
| 2021-12 | 107,5 | 2023-11 | 369,5 | 2025-08 | 1.340,6 |
| 2022-02 | 112,0 | 2023 (promedio) | 308,3 | 2025-11 | 1.453,7 |
| 2022-07 | 135,2 | 2024-08 | 961,2 | 2026-01 | 1.472,7 |
| 2022-12 | 179,6 | 2025-02 | 1.077,8 | 2026-03 | 1.416,3 |
| 2023-03 | 210,2 | 2025-03 | 1.088,4 | 2026-04 | 1.406,2 |
| 2023-04 | 223,0 | 2025-04 | 1.140,9 | 2026-06 | 1.469,6 |
| 2023-10 | 367,9 | 2025-05 | 1.166,3 | 2026-10 (base) | 1.537,9 |

**Advertencia.** Hasta diciembre de 2023 el oficial estaba sobrevaluado, con una brecha cercana al 100 % con el paralelo. Los montos de 2022–2023 convertidos al oficial **sobrestiman** el costo en dólares de hoy, a veces hasta el doble (RN38 2023, Jáchal 2023, Mendoza 2022, Santa Fe 2023). Desde 2024 la brecha es chica. Para los valores en USD de 2010–2013 no se aplicó ajuste por inflación de EE. UU., salvo en el §8, donde se indica.

---

## 1. Vivienda

| Concepto | Unidad | Bajo | Central | Alto | Fecha | TC | Fuente | Ev. |
|---|---|---|---|---|---|---|---|---|
| Vivienda económica, costo de obra (id `vivienda_m2`) | USD/m² | 950 | 1.100 | 1.500 | 2025–2026 | ver fila | ver detalle | [O] |
| · IPV Mendoza, 56 viviendas CEPA en la ex playa San Agustín: $3.200 M; 55,9 m² (52,9 cubiertos). No incluye urbanización, que hace el municipio | USD/m² | | 948 | | feb-2025 | 1.077,8 | [Los Andes 24/2/2025](https://www.losandes.com.ar/sociedad/el-ipv-hizo-el-llamado-licitacion-laconstruccion-56-viviendas-la-ex-playa-san-agustin-n5939568) | [O] |
| · Centro de Ingenieros de Mendoza, vivienda económica tradicional de 61 m² | USD/m² | | 1.025 | | may-2026 | 1.370 (BNA comprador, el del informe) | [Informe 113](https://www.elsol.com.ar/wp-content/uploads/2026/05/INFORME-72-COSTO-CONSTR-MAY-2026-docx.pdf) | [E] |
| · UTN FRVT (CECCDU), unifamiliar de 2 dormitorios y 85 m²: $1.764.030/m² con IVA, gastos generales y beneficio | USD/m² | | 1.200 | | jun-2026 | 1.469,6 | [UTN FRVT jun-2026](https://frvt.utn.edu.ar/wp-content/uploads/2026/07/Costo-x-M2-de-vivienda-Mes-Junio-2026-Version-PDF.pdf) | [E] |
| · APYMECO, costo directo sin IVA (edificio de referencia de PB + 9 pisos) | USD/m² | | | 1.503 | jun-2026 | implícito ~1.500 | [La Voz de San Justo 8/8/2026](https://www.lavozdesanjusto.com.ar/construir-en-la-argentina-volvio-a-encarecerse-el-costo-del-m2-supero-los-225-millones-y-rozo-maximos-en-dolares) | [A] |
| Vivienda social terminada, por unidad, sin terreno (`vivienda_social_unidad`) | USD/viv. | 53.000 | 66.000 | 73.000 | 2025 | 1.077,8–1.088,4 | IPV Mendoza ($57,1 M por vivienda); DPVyU Santa Fe, Lic. 02/25 Zenón Pereyra ($933,3 M / 13 viviendas de 2 dormitorios, base mar-2025) y Lic. 05/25 Carlos Pellegrini ($950,0 M / 12) | [O]* |
| Superficie de la vivienda social (`vivienda_social_m2_sup`) | m² | 53 | 60 | 64 | 2022–2025 | – | CEPA 52,9 cubiertos / 55,9 totales y Andina 53,1 / 59,5 ([Mendoza 2025](https://elconstructor.com/mendoza-licita-la-construccion-de-viviendas-para-general-alvear-y-junin)). Casa Propia, 63 m² ([Entre Ríos 2022](https://www.analisisdigital.com.ar/provinciales/2022/08/05/licitaran-nuevas-viviendas-para-san-jose-de-feliciano-y-aldea-san-antonio)) y unos 64 m² de referencia para el monto financiable (Santa Fe) | [O] |
| Rehabilitación de una vivienda desocupada de 60 m² (`rehab_vivienda`) | USD/viv. | 14.400 | 28.800 | 46.800 | jun-2026 | 1.469,6 | Derivado: 20 %, 40 % y 65 % del costo de obra nueva UTN (1.200 USD/m² × 60 m²). El porcentaje sale de los rubros que se reponen en el presupuesto UTN: revoques 19 %, aberturas 13 %, cubiertas 11 %, instalaciones 20 %, pintura 6 %. Contraste: [OneEstimate 2026](https://oneestimate.ai/es/blog/costos-construccion-por-m2-argentina-2026) da 740–950 USD/m² para refacciones [A] | [J] |

\* Los montos de Santa Fe vienen del texto de los pliegos que devolvió el buscador. El PDF de `santafe.gob.ar` no se pudo descargar porque el servidor respondió 503 o cortó la conexión. Las superficies de esos prototipos no se verificaron.

**Lectura.** El costo de obra de la vivienda social ronda **USD 950–1.200/m²** y el de la unidad terminada, **USD 53.000–73.000** sin terreno ni redes. La cifra de «USD 30.000 por vivienda social con servicios» (Bekerman) que trae `politicas-territoriales.md` §6.2(c) **queda desactualizada**: hoy la obra sola cuesta el doble.

**Stock disponible para rehabilitar.** El Censo 2022 registra 2.084.013 viviendas desocupadas, de las cuales 1.193.034 son «ociosas» (`viv_desocupadas` y `viv_desocupadas_ociosas` en `data/interim/censo_servicios/servicios_departamento.csv`). No se encontró un programa argentino con costos de rehabilitación.

## 2. Urbanización del suelo

| Concepto | Unidad | Bajo | Central | Alto | Fecha | TC | Fuente | Ev. |
|---|---|---|---|---|---|---|---|---|
| Obras por lote, sin tierra (`urbanizacion_lote`) | USD/lote | 2.500 | 7.200 | 19.500 | 2023–2026 | ver fila | ver detalle | [O] |
| · Programa Río Negro Suelo Urbano, Cinco Saltos: 130 lotes con agua, energía y alumbrado por $436,2 M | USD/lote | 2.503 | | | ago-2025 | 1.340,6 | [rionegro.gov.ar](https://rionegro.gov.ar/articulo/55088/suelo-urbano-se-licitaran-servicios-para-130-lotes-de-cinco-saltos) | [O] |
| · Mismo programa, Cipolletti: 181 lotes por $744,2 M | USD/lote | 2.792 | | | ene-2026 | 1.472,7 | [Noticias NQN 30/1/2026](https://www.noticiasnqn.com.ar/amp/noticias/2026/01/30/327434-en-febrero-licitan-los-servicios-para-181-lotes-en-cipolletti) | [A] |
| · Plan DHI: USD 7.200 de obras por lote de 300–400 m² (electricidad, agua, gas, cloaca e infraestructura) | USD/lote | | 7.200 | | 2023 | USD | Plan DHI p. 40 (`plan-dhi-resumen.md` §2.1) | [O] |
| · Ronconi, Casazza y Reese (2018), prototipo de 200 lotes de 250 m² en el sur del GBA: agua 1,6 + cloaca 5,8 + pavimento 9,8 + electricidad 1,6 + gas 2,0 = 20,8 USD/m² de lote. No incluye pluviales | USD/lote | | 5.200 | | 2013 | USD de la fuente | [EURE 44(133):5-28, tabla 6](https://mail.eure.cl/index.php/eure/article/download/2169/1107/16000) | [E] |
| · IPVU Las Ovejas: 40 lotes de 375 m² por $255 M. La etapa actual es preparación del terreno y el alcance no está claro | USD/lote | | 4.500 | | mar-2026 | 1.416,3 | [Noticias NQN 17/3/2026](https://www.noticiasnqn.com.ar/amp/noticias/2026/03/17/329569-inician-obras-para-40-lotes-con-servicios-en-las-ovejas) | [A] |
| · Cuenca Intermedia, Neuquén: «inversión inicial» de más de $17.000 M para una primera etapa de 569 lotes de 160 m² o más. Si el monto cubriera los 1.700 lotes, serían USD 6.500 por lote | USD/lote | | | 19.500 | sep-2026 | 1.535,0 | [Noticias NQN 10/9/2026](https://www.noticiasnqn.com.ar/noticias/2026/09/10/351944-neuquen-avanza-con-1700-lotes-con-servicios-cuando-estaran-listos) | [A] |
| Por hectárea bruta (`urbanizacion_ha`) | USD/ha | 42.000 | 122.000 | 330.000 | – | – | Lote × 17 lotes/ha bruta (60 % vendible, lotes de 350 m²). Contraste: Ronconi et al. da 20,8 × 6.000 m² vendibles = 125.000 USD/ha (USD 2013) | [J] |

**Sin datos verificables:**
- **ProCreAr Desarrollos Urbanísticos.** Solo aparecen montos de licitación en pesos y sin fecha, y el tope de crédito por lote ($3 M en 2023), que no es un costo.
- **Libertun de Duren.** No trae costos de redes por lote. Su resultado es de gasto de operación (§8).
- **CIPPEC 2018.** Da densidades, no costos.

## 3. Infraestructura troncal

### 3.1 Rutas

| Concepto | Unidad | Bajo | Central | Alto | Fecha | TC | Fuente | Ev. |
|---|---|---|---|---|---|---|---|---|
| Ruta nueva pavimentada de 2 carriles (`ruta_km`) | USD/km | 800.000 | 1.100.000 | 1.550.000 | 2023–2024 | ver fila | ver detalle; el central es [J] | [O] |
| · Neuquén RP62, paso Carirriñe: 10 km de pavimento con reconstrucción de obra básica y gaviones, $1.675,1 M | USD/km | 0,80 M | | | mar-2023 | 210,2 | [Noticias NQN 22/3/2023](https://www.noticiasnqn.com.ar/noticias/2023/03/22/274476-se-licitar-la-pavimentacin-de-la-ruta-del-paso-carirrie) | [O] |
| · Neuquén RP62 a Lolog: «más de 5 km», $7.434,5 M (base agosto) | USD/km | | | ≤1,55 M | ago-2024 | 961,2 | [Noticias NQN 7/11/2024](https://www.noticiasnqn.com.ar/noticias/2024/11/07/304908-este-lunes-se-licita-la-pavimentacion-de-la-ruta-62-a-lolog) | [O] |
| Duplicación de calzada o autovía (`ruta_duplicacion_km`) | USD/km | 900.000 | 2.100.000 | 2.400.000 | 2023–2025 | ver fila | ver detalle | [O] |
| · Neuquén RP67, «ruta petrolera»: 19 km adjudicados a Pose–Coarco por $24.772,6 M | USD/km | 0,90 M | | | nov-2025 | 1.453,7 | [Noticias NQN 21/11/2025](https://www.noticiasnqn.com.ar/noticias/2025/11/21/323676-el-gobierno-adjudico-la-duplicacion-de-la-ruta-provincial-67-el-acceso-clave-a-la-zona-petrolera) | [O] |
| · RN34, acceso a Salta–El Cuarteadero (Jujuy): unos 27 km (km 1149–1176) por $65.000 M, Panedile | USD/km | | 2,1 M | | abr-2025 | 1.140,9 | [Diario Panorama](https://www.diariopanorama.com/noticia/513221/obra-necesaria-jujuy-confirmo-retoma-trabajos-sobre-ruta-34) | [A] |
| · RN38 Monteros–Famaillá (DNV): 21,2 km por $18.412,7 M, con 9 puentes y 2 distribuidores | USD/km | | | 2,36 M | oct-2023 | 367,9 (sobrevaluado) | [El Heraldo 24/10/2023](https://www.elheraldo.com.ar/noticias/interes-general/con-una-inversion-de-18-mil-millones-transformaran-la-ruta-nacional-38-en-autopista) | [O] |
| Repavimentación (`ruta_repavimentacion_km`) | USD/km | 200.000 | 200.000 | 200.000 | mar-2025 | 1.088,4 | Neuquén RP6, Rincón de los Sauces–Crucero Catriel: 54 km por $11.682 M ([Noticias NQN 11/7/2025](https://www.noticiasnqn.com.ar/noticias/2025/07/11/316799-neuquen-licita-la-repavimentacion-de-la-ruta-6-entre-rincon-de-los-sauces-y-crucero-catriel)) | [O] |

**Vacío.** No se encontró una licitación de ruta nueva en llanura pampeana con longitud informada. Los dos casos de ruta nueva son de cordillera y sesgan el valor hacia arriba.

### 3.2 Transporte eléctrico

Fuente principal: Secretaría de Energía, [*Plan Nacional de Expansión del Transporte Eléctrico 2035*](https://www.argentina.gob.ar/sites/default/files/se_see_ampliacion_transporte_electrico_.pdf), diciembre de 2022 [O], con montos estimados en USD.

| Concepto | Unidad | Bajo | Central | Alto | Fecha | Fuente | Ev. |
|---|---|---|---|---|---|---|---|
| Línea de 132 kV (`linea_132kv_km`) | USD/km | 230.000 | 330.000 | 540.000 | dic-2022 | Plan 2035, cap. 2. Líneas solas: San Luis–Realicó, 90 km, USD 21 M (0,23); Arrecifes–Salto–Pergamino, 31 km, USD 7,75 M (0,25). Líneas con sus ET: Esquel–Los Perales, 481 km, USD 160,25 M (0,33); Formosa–Pirané–Ibarreta, 189 km, USD 85,4 M (0,45); Piedrabuena–San Julián, 120 km, USD 65,2 M (0,54) | [O] |
| · Contraste San Juan: ET Ullum + ET Albardón/Chimbas + 18 km de línea de doble terna, $15.464 M | USD | | 13,3 M en total | | may-2025 | [Diario de Cuyo 7/5/2025](https://www.diariodecuyo.com.ar/economia/orrego-firmo-el-contrato-para-una-obra-clave-una-inversion-que-apunta-a-la-transformacion-energetica-de-san-juan-1728282.html) | [O] |
| Línea de 500 kV, incluidas sus ET (`linea_500kv_km`) | USD/km | 500.000 | 1.180.000 | 2.960.000 | 2022–2026 | Central: Plan de ampliación de 2025, 16 obras, USD 6.600 M para 5.610 km ([El Economista](https://eleconomista.com.ar/energia/privados-rescate-red-electrica-gobierno-licita-una-obra-us-800-millones-n98718)). Alto: AMBA I, 270 km más la ET Plomer, por USD 800 M (Res. SE 202/2026; [Marval](https://www.marval.com/publicacion/proyecto-de-transmision-electrica-amba-i-licitacion-17676)). Bajo: LEAT Bahía Blanca–Choele Choel, USD 174 M (Plan 2035), sobre unos 345 km de traza; la longitud es estimación propia [J] | [O] |
| ET nueva de 132 kV (`estacion_transformadora`) | USD | 17,2 M | 24,2 M | 32,3 M | dic-2022 | Plan 2035: ET General Pico Sur 17,16; ET Catamarca (Santa Fe) 22,0; ET Mendoza Norte 26,4; ET Santa Ana 32,33 | [O] |
| ET nueva de 500/132 kV (`estacion_transformadora_500`) | USD | 80 M | 86 M | 92,3 M | dic-2022 | Plan 2035: Nueva ET Espinillo 80; ET Comodoro Rivadavia Oeste, 450 MVA, 92,3. Un transformador adicional de 300 MVA en una ET existente cuesta unos USD 6,5 M | [O] |

### 3.3 Agua

| Concepto | Unidad | Bajo | Central | Alto | Fecha | TC | Fuente | Ev. |
|---|---|---|---|---|---|---|---|---|
| Acueducto troncal regional de agua potable, con toma, bombeo y ramales prorrateados (`acueducto_km`) | USD/km | 900.000 | 1.040.000 | 2.690.000 | 2023–2025 | ver fila | ver detalle | [O] |
| · Santa Fe–Córdoba: USD 441 M (Plan DHI p. 198–199) para 144 km de troncal + 345 km de ramales, 410.000 a 450.000 habitantes | USD/km | 0,90 M | | | 2023 | USD | [El Constructor 22/5/2024](https://elconstructor.com/avanza-la-obra-del-acueducto-santa-fe-cordoba) (longitudes) | [O] |
| · Santa Fe–Córdoba, bloques B y C: $165.723 M para 43 km de troncal y más de 110 km con ramales (Fondo Saudí) | USD/km | | 1,04 M | | nov-2025 | 1.453,7 | [La Voz de San Justo 17/11/2025](https://www.lavozdesanjusto.com.ar/avanza-el-acueducto-santa-fe-cordoba-con-la-licitacion-de-dos-nuevos-tramos) | [A] |
| · Acueducto del Desarrollo Formoseño: USD 1.217,3 M según la SSRH, para 452 km de troncal de 1,70 m de diámetro, con bombeo de 6, 3 y 1,5 m³/s, más riego de 40.000 ha. Financiamiento CAF de USD 200 M (Dto. 538/2023) | USD/km | | | 2,69 M | 2023 | USD | [La Nación](https://www.lanacion.com.ar/economia/campo/la-obra-del-siglo-el-ambicioso-proyecto-que-podria-transformar-a-todo-el-campo-de-formosa-nid2039675/) / [A24 26/10/2023](https://www.a24.com/pymes/aprueban-financiamiento-usd-200-millones-acueducto-formosa-n1237094/amp) | [A] |
| · Referencia de bajo caudal: acueducto ganadero Monte Comán–La Horqueta (Mendoza), 291 km por $2.102,7 M | USD/km | 0,04 M | | | dic-2022 | 179,6 | [Sitio Andino 1/12/2022](https://www.sitioandino.com.ar/politica/acueducto-monte-coman-la-horqueta-tres-oferentes-pugnan-la-obra-n5641638) | [O] |
| Planta potabilizadora (`planta_potabilizadora_m3dia`) | USD por m³/día | 224 | 443 | 1.850 | 2021–2023 | ver fila | ver detalle | [O] |
| · Santa Fe, ampliación de 8.000 a 14.000 m³/h (+144.000 m³/día) por más de $11.900 M (PROARSA) | | 224 | | | nov-2023 | 369,5 (sobrevaluado) | [argentina.gob.ar/node/408775](https://www.argentina.gob.ar/node/408775) | [O] |
| · Ficha del Plan Nacional del Agua: nueva planta Santa Fe de 6.250 m³/h (150.000 m³/día), USD 66,5 M, para 396.274 habitantes | | | 443 | | s/f | USD | [Ficha 33](https://www.argentina.gob.ar/sites/default/files/33_planta_potabilizadora_santa_fe_0.pdf) | [O] |
| · Vedia (BA), 150 m³/h, $309,3 M | | | 799 | | dic-2021 | 107,5 | [gba.gob.ar](https://gba.gob.ar/infraestructura/noticias/provincia_licit%C3%B3_la_obra_de_planta_potabilizadora_para_vedia) | [O] |
| · General Alvear (BA), 100 m³/h, $496,1 M | | | | 1.846 | feb-2022 | 112,0 | resultado de búsqueda gba.gob.ar | [O] |

**Lectura.**
- Hay una **economía de escala muy marcada**: una planta de 150.000 m³/día cuesta unos USD 450 por m³/día y una de 2.400 m³/día, unos USD 1.850.
- Con 250 l/hab/día, el central da unos **USD 110 por habitante**.
- No se encontró ninguna obra de ENOHSA o AySA de 2024–2026 que informe a la vez capacidad y monto.

### 3.4 Ferrocarril de carga

| Concepto | Unidad | Bajo | Central | Alto | Fecha | Fuente | Ev. |
|---|---|---|---|---|---|---|---|
| Vía nueva (`ferrocarril_km`) | USD/km | 2,4 M | 2,6 M | 2,9 M | 2019–2020 | Tren Norpatagónico, tramos nuevos. Contralmirante Cordero–Añelo: 68 km por USD 200 M. Cutral Co–Añelo: 90 km por USD 230 M ([Río Negro 13/12/2020](https://www.rionegro.com.ar/?p=1608580), estimación de ADI-NQN). Otra fuente da 90 km por USD 220 M ([LM Neuquén](https://www.lmneuquen.com/una-primera-escala-el-tren-vaca-muerta-n597016)) | [A] |
| Renovación de vía (`ferrocarril_renovacion_km`) | USD/km | 0,8 M | 0,9 M | 1,4 M | 2019–2020 | Norpatagónico: USD 570 M para recuperar 700 km ([argentina.gob.ar/node/93019](https://www.argentina.gob.ar/node/93019)). Belgrano Cargas, CMEC: USD 816 M para 911 km. San Martín, CRCC: USD 2.603 M para 1.813 km ([Bichos de Campo 11/12/2020](https://bichosdecampo.com/china-saco-la-billetera-para-darle-una-mano-a-alberto-aportara-financiamiento-por-mas-de-3400-m-us-para-continuar-las-obras-del-belgrano-cargas-y-poner-a-punto-al-ferrocarril-san-martin)) | [A] |

Son estimaciones de anuncio, no contratos cerrados, y quedan fuera de la ventana 2023–2026. Faltan datos de Trenes Argentinos Cargas posteriores a 2023.

## 4. Equipamiento social

| Concepto | Unidad | Bajo | Central | Alto | Fecha | TC | Fuente | Ev. |
|---|---|---|---|---|---|---|---|---|
| Escuela nueva, costo por alumno (`escuela_por_alumno`) | USD/alumno | 9.600 | 11.500 | 48.500 | 2022–2026 | ver fila | ver detalle | [O] |
| · ProA Villa del Totoral (Córdoba): $2.500 M, 180 alumnos, 1.596 m², 4 aulas y 3 talleres. Fecha no verificada, gestión Llaryora (2024–2026) | | 9.600 (1.080/m²) | | | ~2025 | 1.450 [J] | La Voz (vía buscador) | [A] |
| · Escuela 4-209, San Martín (Mendoza), secundaria: $310 M, 1.300 m², más de 200 alumnos | | | 11.500 (1.764/m²) | | jul-2022 | 135,2 (sobrevaluado) | [mendoza.gov.ar](https://www.mendoza.gov.ar/prensa/obras-publicas-construira-la-nueva-escuela-4-209-blanca-nelida-gutierrez-de-san-martin/) | [O] |
| · Escuela 77, El Alamito (Neuquén), primaria rural: $2.200 M, 770 m², 32 alumnos | | | | 48.500 (2.017/m²) | mar-2026 | 1.416,3 | [Noticias NQN 30/3/2026](https://www.noticiasnqn.com.ar/noticias/2026/03/30/330222-inician-la-construccion-del-nuevo-edificio-de-la-escuela-77-en-el-alamito) | [O] |
| Escuela, costo por m² (`escuela_m2`) | USD/m² | 1.080 | 1.760 | 2.020 | ídem | | ídem | [O] |
| Hospital, costo por cama (`hospital_por_cama`) | USD/cama | 144.000 | 301.000 | 371.000 | 2022–2025 | ver fila | ver detalle | [O] |
| · Hospital San Roque, Jáchal: $5.500 M, 82 camas | | | 301.000 | | abr-2023 | 223,0 (sobrevaluado) | [Los Andes 28/4/2023](https://www.losandes.com.ar/politica/con-mas-camas-y-prestaciones-medicas-inauguraron-el-nuevo-hospital-de-jachal) | [O] |
| · Hospital Ramón Carrillo, San Martín de los Andes: USD 26 M, 70 camas, 11.391 m² (163 m² por cama y 2.283 USD/m²) | | | | 371.000 | oct-2022 | USD | [Noticias NQN 11/10/2022](https://www.noticiasnqn.com.ar/amp/noticias/2022/10/11/267165-se-inaugur-el-nuevo-hospital-de-san-martn-de-los-andes) | [O] |
| · Referencia regional: Hospital Nacional de Itauguá (Paraguay), USD 150 M para 1.039 camas | | 144.000 | | | sep-2025 | USD | [La Nación PY](https://www.lanacion.com.py/pais/2025/09/25/nuevo-hospital-en-itaugua-costara-usd-150-millones-y-contara-con-1039-camas/) | [A] |
| Camas por 1.000 habitantes (`camas_por_1000`) | camas | 3,19 | 3,36 | 4,99 | 2020 / 2022 / 2017 | – | Banco Mundial WDI SH.MED.BEDS.ZS (API, consultada 21/10/2026). Hay un quiebre de serie en 2018; el valor de «5 camas por 1.000» que repite la prensa corresponde a 2017 | [O] |
| Proporción de población de 6 a 17 años (`share_edad_escolar`) | fracción | 0,1884 | 0,1902 | 0,1902 | Censo 2022 | – | pob_6a12 + pob_13a17 = 8.676.309, dividido por 45.618.784 (viviendas particulares) o por 46,04 M (población total) | [O] |

**Lectura.**
- Una escuela urbana de tamaño normal cuesta **USD 10.000–12.000 por alumno**, con 6–9 m² por alumno.
- Las escuelas rurales chicas multiplican ese costo por 4 o 5.
- En hospitales, el rango es de **USD 150.000 a 370.000 por cama**, según la complejidad.
- Con 3,36 camas por 1.000 habitantes, una ciudad de 100.000 habitantes necesita unas 336 camas, que cuestan unos **USD 100 M** con el valor central.

## 5. Edificios públicos y traslado de la capital

| Concepto | Unidad | Bajo | Central | Alto | Fecha | Fuente | Ev. |
|---|---|---|---|---|---|---|---|
| Dotación de la APN, Poder Ejecutivo sin empresas (`empleados_apn_total`) | personas | 184.202 | 184.202 | 271.696 | jun-2026 | [INDEC, Dotación de personal de la APN, jun-2026](https://www.indec.gob.ar/uploads/informesdeprensa/dotacion_personal_apn_07_2643CA191EA2.pdf). APN 184.202: centralizada 37.884, descentralizada 111.381, desconcentrada 21.187 y otros entes 13.750. Con empresas y sociedades suma 271.696. El 6,0 % menos que un año antes. No incluye los poderes Legislativo y Judicial | [O] |
| Empleados nacionales en CABA (`empleados_apn_caba`) | personas | 65.000 | 74.000 | 136.558 | 2020 / 2026 | [ITEP-INAP vol. 3 n° 2 (mar-2021)](https://www.argentina.gob.ar/sites/default/files/2019/04/itep_vol3_num2_2021_ok.pdf), datos BIEP: CABA tiene 136.558 puestos, el **35,3 %** del empleo nacional (con FF. AA. y de seguridad); la provincia de Buenos Aires tiene el 26,4 %. La administración central pesa el 16,6 % de la dotación del AMBA. Bajo: 35,3 % × 184.202 [J]. Central: 40 %, porque el personal civil se concentra más [J] | [J] |
| Superficie de oficina por empleado (`m2_por_empleado`) | m² | 8 | 12 | 16 | 2017 | [AABE, Manual de Estándares de Espacios de Trabajo](https://argentina.gob.ar/sites/default/files/aabe_manualdeestandares_0.pdf): 8 m² de superficie de piso por persona (Código de Edificación de CABA, art. 4.7.2.1), con 21–25 % de espacios colaborativos. Los valores central y alto son superficie bruta, con eficiencia de planta de 0,67 y 0,5 [J] | [O] |
| Construcción de oficinas públicas (`oficina_m2`) | USD/m² | 1.350 | 1.820 | 2.270 | 2025–2026 | APYMECO, oct-2025: 1.358 de costo directo ([iProfesional](https://www.iprofesional.com/realestate/444758-el-dato-cual-es-el-costo-de-construccion-por-metro-cuadrado-en-dolares-en-argentina)). Central: 1.503 × 1,21 de IVA [J]. Alto: además × 1,25 de gastos generales, beneficio y honorarios [J]. CAMARCO, ago-2025: «no menos de USD 1.500/m²» en CABA [A]. No se encontraron licitaciones de edificios administrativos | [J] |
| Congreso y Corte Suprema | USD | null | null | null | – | No se encontró ninguna estimación | – |
| Traslado a Viedma, 1987 (`traslado_viedma_1987`) | USD | 1.500 M | 2.300 M | 20.000 M | 1987–1989 | **No se encontraron los documentos originales del ENTECAP** ni un presupuesto oficial. Prensa: el gobierno hablaba de USD 1.500–2.000 M y la oposición de 15.000–20.000 M (`politicas-territoriales.md` §1.2). TN, vía [Contexto Tucumán](https://www.contextotucuman.com/nota/327849/el-gobernador-de-chubut-quiere-trasladar-la-capital-federal-a-la-patagonia-es-una-oportunidad-.html): USD 2.300 M. Diario Río Negro: obras por unos USD 20 M efectivamente ejecutadas | [A] |

**Orden de magnitud de las oficinas** *[J, a modo de ejemplo]*: 74.000 empleos × 12 m² × USD 1.820/m² ≈ **USD 1.600 M**. Esa cifra no incluye terreno, viviendas, equipamiento social, Congreso ni Corte. Con los valores bajos (65.000 × 8 × 1.350) da USD 700 M; con los altos (136.558 × 16 × 2.270), USD 5.000 M.

## 6. Mudanza e incentivos

| Concepto | Unidad | Bajo | Central | Alto | Fecha | TC | Fuente | Ev. |
|---|---|---|---|---|---|---|---|---|
| Mudanza de un hogar a unos 1.000 km (`mudanza_hogar`) | USD/hogar | 400 | 1.000 | 1.660 | abr-2026 | 1.406,2 | [Roomix 16/4/2026](https://roomix.ai/blog/guia-mudanza-argentina-2026): CABA–Mendoza (1.000 km) entre $1,0 y 1,8 M, sin carga ni descarga. Bajo: [cuantomecuesta.com](https://cuantomecuesta.com/ar/mudanza/), CABA–Córdoba (700 km) a $300–500 mil, escalado a 1.000 km [J]. Alto: $1,8 M × 1,3 por carga, descarga y seguro [J] | [A] |
| Subsidio de Zona Fría por usuario (`subsidio_zona_fria_hogar_anio`) | USD/hogar/año | 56 | 129 | null | 2023 / 2026 | 308,3 (promedio 2023) | Bajo: [Secretaría de Energía, Informe Régimen Zona Fría (feb-2024)](https://www.argentina.gob.ar/sites/default/files/informe_regimen_zona_fria.pdf): pagos de 2023 por $74.416 MM a 4,3 M usuarios, de un padrón de 9,4 M (recargo del 5,44 % sobre el PIST). Central: la Ley 27.828 (Dto. 1161/2026) busca ahorrar unos USD 400 M por año ([Palabras del Derecho](https://www.palabrasdelderecho.com.ar/articulo/7052/El-Gobierno-promulgo-la-ley-que-reforma-el-regimen-de-Zonas-Frias-)) y deja sin descuento a unos 3,1 M hogares ([iProfesional](https://www.iprofesional.com/energia/437970-millones-de-usuarios-de-gas-en-alerta-por-fuerte-aumento-en-2026)) [J] | [O] |
| Tarifa diferencial (eléctrica o regional) | USD/hogar/año | null | null | null | – | – | No se encontró el costo por hogar | – |

**Incentivos de radicación encontrados.** Son cualitativos y no aparecen como valores en el JSON:
- **Tierra del Fuego, Ley 19.640.** Cuesta alrededor de USD 1.070 M por año (Fundar 2023; `politicas-territoriales.md` §3.3). El Banco Mundial lo calificó de régimen «fallido» y le asignó más de USD 1.000 M por año ([Hoy Día](https://hoydia.com.ar/economia/banco-mundial-tierra-del-fuego/amp/)).
- **Adicional salarial por zona.** El personal de casas particulares de las provincias patagónicas cobra un 30–31 % más sobre el salario mínimo ([iProfesional jul-2026](https://www.iprofesional.com/legales/456222-empleada-domestica-quienes-deben-cobrar-un-31-mas)). Los docentes de Tierra del Fuego cobran un 100 % de zona desfavorable, también sobre la antigüedad (Ley provincial 922/2013; [Chequeado](https://chequeado.com/el-explicador/docentes-en-tierra-del-fuego-las-razones-del-conflicto/)).
- **Programas provinciales de repoblamiento con monto por familia:** no se encontró ninguno.

## 7. Precio de la tierra rural por región

| Región (id) | Bajo | Central | Alto | Fecha | Fuente | Ev. |
|---|---|---|---|---|---|---|
| Zona núcleo: Pergamino, Rojas, Colón (`tierra_ha_nucleo`) | 14.000 | 17.900 | 20.000 | ene–jul 2026 | [BCR, Informativo Semanal 2257 (21/8/2026)](https://www.bcr.com.ar/es/print/pdf/node/117220), con datos de Márgenes Agropecuarios: USD 17.900 de promedio, récord nominal; el piso fue USD 13.950 en 2021. El alquiler es de unos USD 570/ha, con una renta bruta del 3,17 %. Los campos premium llegan a USD 20.000 ([Bichos de Campo](https://bichosdecampo.com/repunta-la-demanda-de-campos-premium-en-plena-zona-nucleo-los-precios-escalan-un-10-y-alcanzan-los-20-000-dolares-por-hectarea/), CAIR) | [E] |
| Oeste bonaerense y norte de La Pampa (`tierra_ha_oeste_bonaerense`) | 9.800 | 13.800 | 15.800 | dic-2025 | Arrendamiento MAGyP de 14 qq de soja, 442 USD/ha ([Márgenes y Resultados dic-2025](https://www.magyp.gob.ar/sitio/areas/analisis_economico/margenes/_archivos/000001_Informes%20de%20M%C3%A1rgenes%20y%20Resultados/202500_2025/251200_Margenes%20Resultados%20(Diciembre%202025).pdf), cuadro 2), capitalizado al 4,5 %, al 3,2 % (renta BCR) y al 2,8 % | [J] |
| Agrícola extrapampeana: norte de Córdoba, Santiago del Estero, Chaco (`tierra_ha_extrapampeana`) | 4.250 | 5.000 | 6.300 | abr-2023 / dic-2025 | [AgroLatam 20/4/2023](https://www.agrolatam.com/actualidad/se-reactiva-la-demanda-de-campos-agricolas-los-precios-que-se-negocian-por-hectarea-en-cordoba-y-chaco), según el corredor H. Ramos: USD 5.000 ±15 %. Alto: arrendamiento MAGyP de NEA Oeste y Santiago (253 USD/ha) al 4 % [J] | [A] |
| NEA (`tierra_ha_nea`) | 700 | 5.000 | 6.500 | 2023 | Bajo: monte sin desmontar, USD 700–2.000, más unos USD 1.000/ha para ponerlo en producción (AgroLatam). Central: agrícola chaqueño (AgroLatam). Alto: Plan DHI p. 157, Misiones (chacras periurbanas). Corrientes periurbano (DHI, USD 40.000) queda fuera por atípico | [A] |
| NOA (`tierra_ha_noa`) | 700 | 5.000 | 10.000 | 2023 | Monte y agrícola de Santiago del Estero (AgroLatam). Alto: DHI p. 157, Salta y Valle de Lerma. Jujuy periurbano según el DHI: USD 15.250 | [A] |
| Valles irrigados de la Patagonia (`tierra_ha_patagonia_valle`) | 5.000 | 8.500 | 30.000 | 2023–2026 | Bajo: Valle Medio del río Negro, tierra sistematizada para riego, USD 5.000–6.000; con monte, USD 1.000–2.000 ([Río Negro 22/4/2026](https://www.rionegro.com.ar/rural/la-patagonia-a-la-que-se-le-prohibia-crecer-el-precio-de-la-tierra-en-los-valles-del-rio-negro-empieza-a-cerrar-una-brecha-historica-4547903/?amp=1)). Central: DHI, Alto Valle de Río Negro (8.500); el Valle Inferior del río Negro, según el DHI, vale 6.425. Alto: DHI, VIRCh (30.000) | [O] |
| Meseta patagónica (`tierra_ha_patagonia_meseta`) | 4 | 30 | 56 | s/f | Solo avisos: estancias de 260.000–870.000 ha en Río Negro a USD 4–5/ha; estancia ovina de 21.500 ha en Esquel por USD 1,2 M (USD 56/ha). El central es [J] | [A] |
| Oasis de Cuyo (`tierra_ha_cuyo_oasis`) | 8.000 | 20.000 | 24.000 | 2023 / s/f | Bajo: finca de 150 ha con viñedo, tres pozos y derecho de riego en Palmira, por USD 1,2 M (aviso). Central: DHI, Mendoza (20.000). Alto: viñedo de 101 ha en San Carlos (Valle de Uco) por USD 2,4 M, con plantación incluida (aviso) | [A] |
| Secano de Cuyo (`tierra_ha_cuyo_secano`) | 100 | 775 | 6.000 | s/f | CAIR y Sociedad Rural de San Luis: «de 100 a 6.000 USD/ha» según ubicación (vía buscador). El central es la media geométrica [J]. El alto corresponde a tierra agrícola de San Luis | [A] |

**Contraste con el Plan DHI (p. 157).**
- Los valores del DHI son de **chacras periurbanas** de 2 a 10 ha en cinturones verdes. Por eso, en las regiones extrapampeanas resultan entre 1,5 y 10 veces más altos que la tierra agrícola extensiva: Corrientes 40.000 frente a unos 5.000; Jujuy 15.250 frente a 5.000; Alto Valle de Neuquén 57.500 frente a 8.500 en Río Negro.
- Para el **costo de suelo rural de una ciudad o un loteo cerca de un ejido** conviene usar los valores DHI. Ojo: los USD 4.800 de tierra por lote del Plan DHI equivalen a unos 13,7 USD/m², es decir, **unos USD 137.000/ha neta**. Eso es precio de suelo urbano y supera de 2 a 20 veces la columna de chacras. El presupuesto de lotes del DHI supone, entonces, comprar suelo ya urbano o periurbano consolidado, o bien incluye un margen amplio.
- Para **expropiar campos o crear polos agrícolas**, los valores de esta tabla.
- Lo que se halló coincide con el DHI en el Valle Inferior del río Negro (6.425 frente a 5.000–6.000 en el Valle Medio en 2026) y en Misiones.

**No se pudieron consultar en abierto:**
- Compañía Argentina de Tierras;
- la tabla de valores de la tierra de Márgenes Agropecuarios (requiere suscripción; se usó la cita de BCR);
- el relevamiento de Reporte Inmobiliario;
- CREA.

INTA no publica valores de la tierra.

## 8. Costos de operación

| Concepto | Unidad | Bajo | Central | Alto | Fecha | Fuente | Ev. |
|---|---|---|---|---|---|---|---|
| Gasto municipal en servicios por habitante (`servicios_municipales_hab_anio`) | USD 2025/hab/año | 65 | 75 | 81 | 2010 (ajustado) | Datos de replicación de Libertun de Duren y Guerrero Compeán (2016) ([BID Open Data, doi:10.60966/kyqvaojp](https://data.iadb.org/dataset/data-associated-with-growing-resources-for-growing-cities-density-and-the-c)), procesados por nosotros. Mediana del gasto en sanidad, electricidad, agua, residuos y áreas verdes, para 5.177 municipios de Brasil en 2010: **43,8 USD** con 9.000–12.000 hab/km² urbanos, **51,3** con 5.000–7.000 y **54,9** con 1.000–2.000 (USD 2010). Se llevó a USD 2025 con el IPC de EE. UU. (×1,48) [J] | [E] |
| Mantenimiento de la infraestructura (`mantenimiento_infra_pct_anual`) | % de la inversión por año | 1 | 2 | 3 | 2019 | [Rozenberg y Fay, *Beyond the Gap* (Banco Mundial, 2019)](https://openknowledge.worldbank.org/handle/10986/31291): para electricidad, 3 % del costo de inversión por año (rango 1–6 %); para defensas costeras, 1 %; en transporte, el mantenimiento a 15 años cuesta tanto como la inversión nueva, y omitirlo encarece el sistema un 50 %. El central es [J] | [E] |

**Notas sobre Libertun de Duren:**
- El mínimo de gasto per cápita está cerca de **9.000 hab/km² (90 hab/ha)**.
- El gasto sigue bajando en Brasil por encima de 12.000 hab/km², hasta unos 38 USD con más de 20.000 hab/km².
- Las series de Chile y México del dataset tienen unidades que no se pudieron interpretar (dan valores per cápita de 0 a 27), así que **solo se usa Brasil**.
- Pasar de 50 a 90 hab/ha ahorra alrededor del 15 % del gasto en servicios.
- El gasto municipal total per cápita en Brasil fue de 435–970 USD de 2010, según la densidad.

## 9. Polos productivos

| Concepto | Unidad | Bajo | Central | Alto | Fecha | Fuente | Ev. |
|---|---|---|---|---|---|---|---|
| Urbanización de un parque industrial (`parque_industrial_ha`) | USD/ha | 120.000 | 206.000 | 1.000.000 | 2023–2026 | **No se encontró ninguna licitación con costo por hectárea**: los ANR del Decreto 915/10 y del programa ArriBA Parques son montos en pesos por solicitud. Bajo: `urbanizacion_ha` central. Central: Plan DHI, 20,6 USD/m² de redes × 10.000 [J]. Alto: precio de lotes en el Parque Industrial Pilar, 70–100 USD/m² en avisos de argenprop sin fecha, que incluye tierra y margen [A] | [J] |
| Empleo por hectárea en parques industriales (`empleos_por_ha_industrial`) | empleos/ha | 1,5 | 8,2 | 9,6 | 2016 | RENPI, Informes N° 1 por provincia (jun-2020): [Buenos Aires](https://argentina.gob.ar/sites/default/files/informe_no_1_-_buenos_aires_.pdf) (56.074 empleos, 90 parques de 64,9 ha promedio, 82 % ocupado), [Córdoba](https://argentina.gob.ar/sites/default/files/informe_no_1_-_cordoba_0.pdf) (5.221; 17 × 37,4 ha; 77 %) y [NEA](https://argentina.gob.ar/sites/default/files/informe_no_1_-_region_nea.pdf) (1.910; 23 × 54,8 ha; 52 %). Sobre la superficie ocupada, la densidad es de 11,7, 10,7 y 2,9. Cálculo propio | [J] |
| Costo fiscal anual por empleo de regímenes de promoción (`costo_fiscal_empleo_anio`) | USD/empleo/año | 17.000 | 51.000 | 126.000 | 1983–2023 | Bajo: promoción LR-CAT-SL-SJ, USD 461.000 acumulados por puesto (Dagnino Pastore para el CEM, 1999) repartidos en 27 años [J]. Central: estimación oficial de USD 1.620 M por año (1993) / 31.700 empleos netos [J]. Alto: Tierra del Fuego, USD 1.070 M por año / 8.500 empleos electrónicos (Fundar 2023), cota superior. Todo en `politicas-territoriales.md` §3.3 | [J] |

**Regímenes más baratos: sin datos para calcular el costo por empleo.**
- **Ley 27.264 (PyMEs).** No se encontró ninguna estimación del costo por empleo.
- **Economía del Conocimiento.** El cupo fiscal fue de $195.000 M en 2025, unos USD 150 M ([Dólar Hoy](https://dolarhoy.com/economia/estado-aumenta-inversion-en-economia-del-conocimiento-195-000m-2025321132953)). Falta el dato oficial de empleo en las empresas beneficiarias, así que no se calcula.
- **Parques industriales provinciales.** Exenciones de Ingresos Brutos e inmobiliario, sin evaluación pública del costo por puesto.

## 10. Macro y demografía

| Concepto | Valor | Fuente | Ev. |
|---|---|---|---|
| PBI en USD corrientes (`pbi_usd`) | USD 683.098 M (2025); USD 638.365 M (2024) | Banco Mundial WDI NY.GDP.MKTP.CD (API, 21/10/2026) | [O] |
| Personas por hogar (`personas_por_hogar`) | **2,863** = 45.618.784 personas en viviendas particulares / 15.932.302 hogares | Censo 2022, verificado en `data/interim/censo_servicios/servicios_departamento.csv`. **Corrección:** `politicas-territoriales.md` §6.2(a) usa 2,56 al dividir por 17,8 M, que son viviendas (17.783.029) y no hogares. Con 2,86, el lote DHI cuesta unos **USD 4.200 por habitante** y no 4.700 | [O] |

## 11. Vacíos principales y próximos pasos

1. **Índice CAC.** La CAC no publica un costo por m² en dólares, solo variaciones. Se usaron UTN FRVT, el Centro de Ingenieros de Mendoza y APYMECO.
2. **Ruta nueva en llanura** con longitud informada (Vialidad Nacional, Dirección de Vialidad de Buenos Aires, Córdoba, Santa Fe). La Lic. 37/2025 de la RP96 de Santa Fe ($39.161 M) no informa longitud.
3. **ENOHSA, AySA y PROARSA:** falta una obra 2024–2026 con capacidad y monto.
4. **Empleados de la APN en CABA:** lo ideal es el dato directo de la BIEP actual. El último encontrado es de diciembre de 2020.
5. **Viedma:** el presupuesto original del ENTECAP y la Ley 23.512 con sus anexos no aparecen en línea.
6. **Tierra rural:** faltan relevamientos regionales abiertos (CAIR/Incair, Compañía Argentina de Tierras) para la meseta y el secano cuyano.
7. **Costo de urbanizar un parque industrial:** habría que pedir pliegos a la red de parques de Córdoba o a ArriBA Parques.
