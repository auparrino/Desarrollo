# Instrumentos de política territorial: revisión de evidencia sobre qué funciona (foco Argentina)

Fecha de elaboración: 21 de octubre de 2026.

> **Relación con otros documentos.** Este texto complementa a `docs/revision-bibliografica.md`, que cubre el **método** (MCDA-SIG, restricciones R01–R14, factores F01–F15, pesos) y una tabla de criterios de localización de capitales y ciudades nuevas (§3 de ese documento: Brasília/Informe Belcher, Sejong con pesos explícitos, Nusantara, Astana, Amaravati, New Minia, Xiong'an, Viedma, Madrid). Aquí **no se repiten** esos criterios. El foco es otro: **qué resultados tuvo cada instrumento** (población lograda, costo, plazos, efectos medidos) y qué implica eso para modelarlo en la app. El resumen del Plan DHI está en `docs/plan-dhi-resumen.md`.

---

## 0. Resumen ejecutivo

1. **Traslado de capitales.** Ninguna capital nueva del siglo XX logró **desconcentrar** de forma medible la ciudad primada de la que se separó. Lagos, Karachi, Yakarta, El Cairo, Seúl, Dar es Salaam y Río siguieron siendo los centros económicos.
   - Lo que sí está documentado con evidencia causal es más acotado:
     - el estatus de capital **hace crecer a la ciudad que lo recibe** y la pérdida de ese estatus la hace decaer (Bai & Jia, China 1000–2000);
     - el empleo público trasladado genera **alrededor de 1 empleo privado local por cada empleo público**, concentrado en servicios y muy localizado (Bonn: Becker et al. 2021; Berlín: Faggio et al. 2025; Reino Unido: Faggio 2019);
     - las rutas construidas hacia una capital nueva producen ganancias de bienestar por comercio y migración (Brasília: Morten & Oliveira 2024).
   - Las capitales **aisladas** respecto de la población se asocian a más corrupción y peor gobernanza (Campante & Do 2014; Campante, Do & Guimaraes 2019).
   - Casi todas las capitales nuevas tardaron **décadas** en alcanzar su población objetivo, o no la alcanzaron: Putrajaya llegó al 34 % en 2020, la Nueva Capital Administrativa de Egipto está en torno al 0,5 % y Dodoma tardó 46 años en recibir al gobierno.
2. **Ciudades nuevas.** La tasa de éxito, medida como población lograda sobre población planificada, es baja fuera de dos contextos:
   - **(a)** satélites de una metrópoli en expansión, con conexión de transporte y empleo propio (new towns británicas, La Plata);
   - **(b)** ciudades con un ancla económica fuerte (Ushuaia y Río Grande con la Ley 19.640, Ciudad Guayana con la siderurgia).

   Las 19 ciudades nuevas egipcias con datos tienen entre el 0,05 % y el 20 % de su población meta, incluso las fundadas hace 40 años (ECES 2026). El factor de fracaso más repetido es **la falta de empleo local**.
3. **Polos y regímenes de promoción.** La evidencia causal internacional es mixta:
   - **Positiva:**
     - los efectos manufactureros de la TVA persistieron tras el fin de los subsidios (Kline & Moretti 2014);
     - el Zonenrandgebiet alemán tuvo efectos persistentes (von Ehrlich & Seidel 2018);
     - las zonas económicas chinas (Lu, Wang & Zhu 2019);
     - los subsidios a la inversión de las Regional Selective Assistance del Reino Unido, pero solo en firmas pequeñas (Criscuolo et al. 2019).
   - **Negativa o neutra:** las ganancias regionales a menudo se compensan con pérdidas en otras regiones (Kline & Moretti 2014; von Ehrlich & Seidel 2018).

   En Argentina:
   - la **promoción industrial** de La Rioja, Catamarca, San Luis y San Juan generó unos 31.700 empleos industriales netos entre 1973 y 1993, con un costo fiscal estimado de **USD 461.000 por puesto**. Esa cifra es acumulada, con intereses, y viene de un estudio encargado por un actor interesado (CEM 1999);
   - la **Ley 19.640** multiplicó por 14 la población de Tierra del Fuego (13.527 habitantes en 1970 y unos 190.000 en 2022). Hoy cuesta alrededor de **USD 1.070 M por año (0,22 % del PBI)** según Fundar (2023).
4. **Repoblamiento rural.** No se encontró **ninguna evaluación causal** de programas de repoblamiento de pequeños pueblos. Hay contrafácticos demográficos (España), tasas de permanencia (Japón: 57,5 % se queda en el municipio) y cifras autodeclaradas por municipios y fundaciones (Italia, Argentina). El objetivo japonés de equilibrar los flujos hacia Tokio falló 11 años seguidos.
5. **Migración interna en Argentina.**
   - El 15,8 % de la población nativa vive en una provincia distinta de la de nacimiento (Censo 2022), contra el 20,9 % en 2010 (INDEC 2024). La movilidad interprovincial **está cayendo**.
   - Los destinos con mayor proporción de no nativos son Tierra del Fuego (54,5 %), Santa Cruz (41,8 %), Neuquén (28,1 %) y San Luis (28,0 %). Los tres primeros son provincias de economía extractiva o promovida. San Luis es el caso más claro de política de promoción.
   - **No se encontró una elasticidad migración-salario estimada con métodos creíbles para Argentina.** La evidencia internacional confirma que el ingreso esperado importa (Kennan & Walker 2011) y que las variables laborales pesan cuando se controla la restricción de crédito (Aroca & Maloney 2005).
6. **Implicancia central para la app.** Cada instrumento necesita su propia unidad de análisis y su propio indicador de éxito. Un mismo mapa de "aptitud" no sirve para todos.
   - El factor de mayor peso en los instrumentos que buscan atraer población es el **empleo o la base económica**, que hoy no figura entre F01 y F15.
   - En el instrumento capital, el factor de mayor peso es la **centralidad poblacional**, que entra en tensión con el objetivo de desconcentrar.

### Convenciones de esta revisión

Se usan las mismas reglas de verificación que en `revision-bibliografica.md` §1:
- DOI comprobados contra Crossref u OpenAlex;
- informes leídos en el sitio del organismo;
- **[no verificado]** cuando no se pudo confirmar una cifra que suele citarse.

Las etiquetas de evidencia se adaptan a la pregunta "¿funciona?":

| Etiqueta | Significado |
|---|---|
| **[E]** | Evidencia empírica causal o cuasi-experimental publicada con revisión de pares (diferencias en diferencias, regresión discontinua, variables instrumentales, controles sintéticos o grupos de comparación creíbles) |
| **[O]** | Evidencia observacional o descriptiva con datos oficiales (censos, auditorías, series estadísticas). Muestra qué pasó, no por qué |
| **[A]** | Anécdota, prensa, fuente secundaria (Wikipedia, notas periodísticas) o cifra autodeclarada por el promotor. Sirve como orden de magnitud, no como evidencia |
| **[J]** | Juicio de esta revisión, a calibrar |
| **[D]** | Derivación aritmética propia a partir de cifras citadas |

---

## 1. Traslado de capitales

### 1.1 Casos internacionales

La tabla resume los resultados. Los criterios de localización detallados de Brasília, Sejong, Nusantara y Astana ya están en `revision-bibliografica.md` §3.

| Caso | Motivos declarados | Criterios de localización | Costo | Población objetivo frente a lograda | Plazos | Efecto sobre la desconcentración |
|---|---|---|---|---|---|---|
| **Brasília** (Brasil) | Integrar el interior y ocupar el Centro-Oeste. Mandato constitucional desde 1891 | Comisión Cruls (1892) e Informe Belcher (1954–55); ver revision-bibliografica §3 | Unos **12,3 % del PBI de 1959**, acumulado en 4 años; unos USD 1.500 M de 1960. La atribución de la estimación es contradictoria (Gudin o Café Filho) [A] | Diseñada para **500.000** habitantes. Hoy tiene **más de 2,5 M** (Salim & Negara 2019) [O]. La mayoría vive en ciudades satélite y no en el Plano Piloto [A] | Mandato en 1891, construcción entre 1956 y 1960 e inauguración en 1960. Los ministerios terminaron de trasladarse en la década de 1970 [A] | Río y São Paulo siguieron siendo los centros económicos [O]. Efecto medido: las rutas radiales hacia Brasília generaron ganancias de bienestar del 2,8 %, de las cuales una cuarta parte se debe a la reducción del costo de migrar, con rangos regionales de 1 a 15 % (**Morten & Oliveira 2024**) [E] |
| **Astana** (Kazajistán) | Riesgo sísmico de Almaty, cercanía a China, presencia estatal en el norte | "32 criterios" [no verificado en primaria] | **[no verificado]** | Pasó de unos 280.000 habitantes (1997) a más de 1,3 M en la actualidad [A] | Decreto del 20/10/1997 y traslado efectivo el 10/12/1997 [A] | Almaty sigue siendo el centro económico [A] |
| **Abuja** (Nigeria) | Neutralidad étnica y religiosa, y centralidad frente a Lagos | Panel Aguda (1975): **ubicación central y escasa población**. Decreto 6/1976 | **[no verificado]** | Plan maestro IPA (1979): **1,6 M de habitantes, ampliable a 3,2 M**; la fase 1 preveía 230.000 personas en 4.000 ha (FCDA) [O] | Del decreto de 1976 al traslado del gobierno en diciembre de 1991, **15 años** [A] | Lagos siguió siendo la mayor metrópoli y el centro económico [A] |
| **Putrajaya** (Malasia) | Descongestionar Kuala Lumpur y construir una "ciudad jardín inteligente" | Cercanía a Kuala Lumpur (unos 25 km) y al corredor tecnológico MSC [A] | Unos USD 8.100 M [A] | Meta de **320.000** habitantes (NIES) [O]. La auditoría nacional registra **109.202 en 2020**, contra una meta de 281.000 para ese año: **34 % de la meta original** [O] | De 1995 a 1999, cuando se trasladó la oficina del primer ministro [A] | Kuala Lumpur conserva la función económica [A] |
| **Naypyidaw** (Myanmar) | Centralidad y seguridad del régimen; motivos no transparentes | No publicados | Unos USD 4.000 M, sin cifra oficial [A] | El territorio de la unión tenía 1,16 M de habitantes (censo 2014), pero la ciudad está muy subocupada [A] | Traslado sorpresivo en 2005–2006 [A] | Yangón pasó de 3,97 M (1983) a 7,36 M (2014): **no hubo desconcentración** [A] |
| **Canberra** (Australia) | Compromiso entre Sídney y Melbourne | Constitución, s.125: dentro de Nueva Gales del Sur y a no menos de 100 millas de Sídney | **[no verificado]** | Diseñada como ciudad jardín para **50.000–85.000** habitantes. Hoy tiene **más de 400.000** (Salim & Negara 2019, citando a Roberts 2014) [O] | Fundada en 1913, Parlamento en 1927. Los ministerios terminaron de trasladarse **a fines de los años cincuenta** [O] | Lecciones de Roberts (2014): una autoridad de desarrollo bien gestionada, densidad suficiente, diversificación más allá del sector público y buena conexión con otras ciudades [O] |
| **Washington** (EE. UU.) | Compromiso político entre Norte y Sur (Residence Act de 1790) | Sitio sobre el Potomac elegido por el Ejecutivo | **[no verificado]** | Creció lento durante el siglo XIX [A] | Ley de 1790 y Congreso instalado en 1800 [A] | No es comparable: Nueva York nunca fue desplazada |
| **Sejong** (Corea del Sur) | Equilibrio nacional y dispersión desde Seúl | Pesos explícitos: equilibrio nacional 0,36, accesibilidad 0,24, etc. (revision-bibliografica §3) | Se suele citar KRW 22,5 billones **[no verificado]** | Meta original de **500.000 para 2030**, luego **800.000 para 2040**. Población real: unos 390.000–400.000 (2025–2026) [A] | Ley de 2004 anulada por la Corte Constitucional y reformulada en 2005 como "ciudad administrativa". Los ministerios se trasladan desde 2012 | La región capital siguió ganando población: más de 418.000 ingresos en 2024 [A]. Persiste la ocupación comercial baja, y en 2025 se fue un ministerio [A] |
| **Nusantara** (Indonesia) | Hundimiento, congestión y escasez hídrica de Yakarta; desarrollo fuera de Java | 7 criterios de Bappenas (revision-bibliografica §3) | **IDR 485,2 billones (USD 34.000 M)**. El Estado cubre **alrededor del 19 %** (Bappenas, citado en Salim & Negara 2019) [O] | Traslado de **1,5 M de personas** (Bappenas). Proyección académica de 1,7–1,9 M para 2045 [A]. En marzo de 2026 trabajaban allí **unos 2.000 funcionarios** [A] | Anuncio en 2019, Ley 3/2022 y meta de traslado completo de funcionarios en 2028–2029 [A] | Demasiado temprano para medir |
| **Nueva Capital Administrativa** (Egipto) | Descongestionar El Cairo y razones de seguridad del régimen [A] | No publicados | **USD 45.000–58.000 M** según la prensa [A] | Meta de **6,5 M** (500.000 en la fase I). Población actual: **unos 30.000 (0,5 %)** (ECES 2026, con datos de CAPMAS 2024) [O] | Anuncio en 2015 y traslado de ministerios desde 2023 [A] | Los empleados viajan a diario desde El Cairo y no se mudan (ECES 2026) [O] |
| **Dodoma** (Tanzania) | Centralidad e ideal de igualdad regional | Ubicación central | Unos £186 M en 1973, con un horizonte de 10 años [A] | Ciudad de tamaño medio; la región supera los 2,4 M de habitantes [A, la cifra urbana no está verificada] | Decidido en 1973; el gobierno se trasladó entre 2016 y 2019 con Magufuli: **46 años de demora** [A] | Dar es Salaam sigue siendo el centro comercial [A] |
| **Belmopán** (Belice) | El huracán Hattie (1961) destruyó cerca del 75 % de Ciudad de Belice | Sitio interior y elevado, elegido en 1962 | **[no verificado]** | **20.754 habitantes (2022)**. Se describe como "atrasada" respecto del plan; la meta de 30.000 **[no verificado]** [A] | Construcción desde 1967 y fundación en 1970 [A] | Ciudad de Belice siguió siendo la mayor ciudad [A] |
| **Islamabad** (Pakistán) | Clima y vulnerabilidad de Karachi; cercanía al cuartel general del Ejército (Rawalpindi) y a Cachemira [A] | Plan maestro de Doxiadis (1960), con Rawalpindi como **ciudad base** | **[no verificado]** | El Territorio Capital tiene más de 2 M de habitantes [A] | Decisión en 1959 y funcionamiento desde mediados de los sesenta [A] | Karachi sigue siendo la metrópoli económica [A] |

**Lecciones comparadas [O/J]:**

1. **Los plazos se miden en décadas.** De la decisión al traslado completo pasaron 15 años en Abuja, unos 45 en Canberra, 46 en Dodoma y más de 10 en Brasília. Una capital que no se materializa dentro de un mandato **depende de la continuidad política**. Esa es exactamente la falla de Viedma (§1.2).
2. **La población supera la meta solo donde hay una ciudad base o una región en crecimiento** (Brasília y Canberra superaron su diseño original). Donde la capital es un enclave administrativo sin economía propia, la población queda muy por debajo de la meta: Putrajaya llegó al 34 %, la capital egipcia al 0,5 % y Belmopán sigue lejos.
3. **Trasladar oficinas no traslada hogares** si no hay vivienda, servicios ni empleo para el resto de la familia (ECES 2026 sobre Egipto). El tiempo de viaje diario desde la ciudad vieja compite con la mudanza.
4. **El financiamiento público es minoritario en los proyectos recientes**: Nusantara cubre el 19 % con presupuesto estatal. Esto ata el éxito a la demanda privada, que es justamente lo que falta.

### 1.2 Argentina: el proyecto Viedma–Carmen de Patagones (Ley 23.512) y otras propuestas

**Proyecto Patagonia (1986–1989).**
- **Anuncio.** Alfonsín lo anunció el 15 de abril de 1986 y al día siguiente habló en Viedma («al sur, al mar y al frío»).
- **Ley 23.512.** Se sancionó el 27 de mayo de 1987. Declaró Capital Federal al distrito Viedma–Carmen de Patagones–Guardia Mitre y previó la **cesión de unas 490.000 ha** por Río Negro y Buenos Aires (Wille 2026, *La Nación*) [A].
- **ENTECAP.** El Ente para la Construcción de la Nueva Capital fue creado por decreto.
- **Motivos.** Según Sordoni (2021), que cita a Roulet (1987):
  - descentralizar el poder demográfico, económico y político del AMBA;
  - orientar el país hacia la Patagonia, el Atlántico Sur, Malvinas y la Antártida;
  - reformar el Estado («Segunda República»).
- **Escala buscada.** Una investigadora entrevistada por *La Nación* (Menazzi, CONICET) dice que se pensaba en una ciudad **pequeña o mediana, al estilo de Bonn**, no en una Brasília (Wille 2026) [A].

**Costo [A].** No hubo un cálculo público verificable.
- El gobierno hablaba de **USD 1.500–2.000 M** y la oposición de **USD 15.000–20.000 M**.
- Otra versión de prensa menciona **USD 2.300 M en 12 años**.
- La entrevistada citada por *La Nación* afirma que «no existía un cálculo real».
- Según *La Nueva Provincia* (citado en Wikipedia), el ENTECAP llegó a tener 110 agentes y gastó **USD 22 M en sueldos** sin construir la capital.

**Por qué fracasó [O/A].** Las fuentes coinciden en cinco factores:
1. **Contexto macroeconómico.** El Plan Austral se agotó, llegó la hiperinflación y Alfonsín entregó el poder anticipadamente en 1989 (Sordoni 2021).
2. **Pérdida de capital político.** La derrota en las elecciones de septiembre de 1987 se considera el fin efectivo del proyecto (Wille 2026). A eso se sumaron los levantamientos carapintadas y las huelgas generales.
3. **Comunicación y bloqueo.** El anuncio fue sorpresivo y no hubo una narrativa oficial preparada. La prensa porteña y los grupos económicos aplicaron una «política de bloqueo» (Oszlak y O'Donnell), con descalificaciones como «faraónico» e «innecesario», que terminaron en indiferencia (Sordoni 2021).
4. **Diseño y gestión.** Críticos internos (Aguirre, Garzón) sostienen que el ENTECAP diseñó un proyecto demasiado caro, dilató la obra con estudios y maquetas y desechó edificios existentes. Alfonsín reconoció después que su «mayor error» fue no mudarse a Viedma «aunque sea en carpa» (Infobae 2025).
5. **Cambio de paradigma.** Menem disolvió el ENTECAP por el **Decreto 1256/89** (noviembre de 1989), con un programa de «menos Estado» (Sordoni 2021). Las cesiones provinciales tenían plazos de caducidad de 5 años.

**Vigencia de la ley.** Es **controvertida**:
- Sordoni (2021) la da por «aún vigente».
- La Ley 26.939 (Digesto Jurídico, 2014) no la incluyó en ningún anexo, ni como vigente ni como no vigente, lo que la dejó en un «limbo jurídico» según Wikipedia.
- Infobae (2014) afirma que quedó derogada.

**Lección para la app [J].** El fracaso **no fue de localización**. El sitio cumplía los criterios de agua, clima y bisagra entre la Pampa y la Patagonia (revision-bibliografica §6). Fue de **sostenibilidad política y fiscal**. Ningún MCDA captura eso, así que la app debe mostrar el plazo y el costo junto a la aptitud.

**Otras propuestas argentinas** (Sordoni 2021, salvo indicación):

| Propuesta | Año | Impulsor | Argumento | Resultado |
|---|---|---|---|---|
| Argirópolis (isla Martín García) | 1850 | Sarmiento | Capital de una confederación rioplatense | Texto programático |
| **Rosario** | Leyes de 1868, 1869 y 1873 | Congreso | Puerto, ferrocarril, centralidad y base comercial (Roulet 1987) | Vetos de Mitre (1868) y Sarmiento (1869 y 1873) |
| Villa María y Villanueva (Córdoba) | 1871 | Congreso | **Centralidad geográfica** | Vetada |
| Río Cuarto o Río Tercero (Córdoba) | Siglo XX (Perón y Aramburu, según Rinero 2009) | Ejecutivo | Contrapeso demográfico a Buenos Aires | Sin avance |
| Campo de Mayo | 2001 | Diputados | Descongestión (a 30 km de la CABA) | Archivada |
| **Santiago del Estero** | 2014 | Cristina Fernández y Julián Domínguez | Nexo NOA–NEA, «equidistante entre el Pacífico y el Atlántico», corazón del MERCOSUR; «las colonias tienen sus capitales en los puertos» | Archivada. Una encuesta de Equis dio 44 % de apoyo [A] |
| **Norte Grande** (sin sitio) | 2023 | Plan DHI, p. 309 | «Equidistante de las principales ciudades de los países limítrofes». Pide estudio de viabilidad, reforma constitucional y traslado por etapas | Sin costo ni plazo (plan-dhi-resumen §2.4) |
| "Capitales alternas" y Gabinete Federal | 2020 | Ley del Congreso; número **[no verificado]** | 24 ciudades sede de reuniones de gabinete (Río Cuarto, Comodoro Rivadavia, Río Grande, La Banda, etc.). El art. 6 permite trasladar organismos | Vigente según *Tiempo Argentino* (12/11/2020). **Es una desconcentración simbólica, no un traslado** [A] |

Las propuestas del siglo XIX y casi todas las del XX eran **pampeanas y litoraleñas**, y su argumento era la centralidad y la base urbana. Viedma fue la primera en anteponer la geopolítica y la ocupación del territorio (Sordoni 2021). Santiago del Estero y el Norte Grande retoman la centralidad, pero **continental** (MERCOSUR) y no poblacional.

### 1.3 Evidencia empírica sobre los efectos de las capitales

| Estudio | Diseño | Resultado | Lectura para Argentina | Nivel |
|---|---|---|---|---|
| **Bai & Jia** (2023, *REStat*; doi:10.1162/rest_a_01091) | Panel de prefecturas chinas entre los años 1000 y 2000. Los cambios de capital provincial por cambios de régimen sirven de variación | Ganar el estatus de capital provincial hizo crecer la población y la urbanización; **perderlo las redujo y la ventaja no persistió**. Canales: empleo público e **infraestructura de transporte** | La capital **concentra** en la ciudad receptora. El efecto dura mientras dura el estatus. No hay evidencia de que desconcentre el sistema nacional | [E] |
| **Becker, Heblich & Sturm** (2021, *JUE* 122:103291; doi:10.1016/j.jue.2020.103291) | Bonn como capital de la RFA desde 1949, frente a ciudades de control | Aumento grande del empleo público, pero efecto **modesto** en el privado: cada empleo público destruye unos 0,2 empleos industriales y crea algo más de 1 en otros sectores privados | Multiplicador neto cercano a 1 | [E] |
| **Faggio, Schlüter & vom Berge** (2025, *RSUE* 111:104084; doi:10.1016/j.regsciurbeco.2025.104084) | Traslado del gobierno de Bonn a Berlín en 1999 | **Multiplicador local de 1,3–1,4** en empleo privado, sobre todo en servicios. El efecto es muy localizado (más fuerte **dentro de los 300 m** del sitio) y aparece al año | El beneficio es intraurbano y no regional | [E] |
| **Faggio** (2019, *JUE* 111:53–75; doi:10.1016/j.jue.2019.03.001) | Dispersión de unos 25.000 puestos de la administración británica (Lyons Review, 2004) | A corto plazo sube el empleo privado en servicios y baja en manufactura, con desplazamiento de firmas cercanas. La prensa cita unos 11 empleos privados por cada 10 públicos; **ese ratio no se verificó en el resumen**. A largo plazo no hay un efecto claro sobre el empleo total (declaraciones de la autora) | Trasladar organismos (capitales alternas) tiene efectos chicos y locales | [E] |
| **Morten & Oliveira** (2024, *AEJ: Applied* 16(2):389–421; doi:10.1257/app.20180487) | Rutas radiales construidas hacia Brasília como variación plausiblemente exógena | 2,8 % de ganancia de bienestar: 3/4 por comercio y 1/4 por menor costo de migrar. Rango regional de 1 a 15 % | **El canal de largo plazo es la red de transporte**, no la ciudad en sí | [E] |
| **Campante & Do** (2014, *AER* 104(8):2456–81; doi:10.1257/aer.104.8.2456) | Estados de EE. UU. | Las capitales **aisladas** de la población se asocian robustamente a **más corrupción**, menos cobertura de prensa, menos participación electoral, más dinero en campañas y peores bienes públicos | **Una capital lejos de la población reduce la rendición de cuentas.** Es un costo de las propuestas "geopolíticas" | [E] (asociación robusta, no un experimento) |
| **Campante, Do & Guimaraes** (2019, *AEJ: Applied* 11(3):298–337; doi:10.1257/app.20170111) | Datos de países | Los conflictos surgen más cerca de la capital. Las capitales aisladas se asocian a peor gobernanza, **solo en países poco democráticos** | En democracia el riesgo es la rendición de cuentas, no la insurrección | [E/O] |
| **Ades & Glaeser** (1995, *QJE* 110(1):195–227; doi:10.2307/2118515) | Corte transversal de países | La primacía urbana depende de la política. Las dictaduras tienen ciudades centrales **50 % más grandes** | La concentración en el AMBA tiene raíces político-institucionales (capital, puerto, aduana) | [E/O] |
| **Dascher** (2000, *Public Choice* 105:373–392; doi:10.1023/a:1005151611464) | Corte transversal de capitales | La geografía política se relaciona con el tamaño de la capital (sin resumen disponible; no se leyó el texto) | — | [O] |

**Síntesis [J].** La evidencia sólida apoya tres afirmaciones:
- **(i)** una capital nueva hace crecer a su ciudad, con multiplicadores de empleo privado cercanos a 1;
- **(ii)** la infraestructura de conexión que la acompaña tiene efectos medibles y duraderos;
- **(iii)** la ubicación lejos de la población tiene costos de gobernanza.

**No hay evidencia** de que una capital nueva reduzca la primacía de la metrópoli de origen. Para el objetivo «desconcentrar el AMBA», una capital nueva es un instrumento **caro y de efecto incierto**.

### 1.4 Criterios de localización específicos de una capital y cómo medirlos

Estos criterios se **suman** a las restricciones R01–R14 y a los factores F01–F14 de revision-bibliografica §4 (agua, riesgos, clima, suelo), que siguen aplicando a la ciudad física.

| ID | Criterio | Fundamento | Variable y cálculo con datos | Fuente de datos | Función de valor sugerida |
|---|---|---|---|---|---|
| **K01** | **Centralidad respecto de la población** | Campante & Do 2014: el aislamiento empeora la rendición de cuentas. Históricamente fue el argumento de Rosario, Villa María y Río Cuarto | **Distancia logarítmica media (ALD)** de la población al sitio candidato *c*: ALD_c = Σᵢ sᵢ · ln(d_ic), donde sᵢ es la proporción de población del radio o departamento *i* y d_ic la distancia en km, o mejor, el tiempo de viaje. Campante & Do usan ALD y un índice centrado de concentración espacial (CISC) derivado de ella | INDEC Censo 2022 por radio o departamento; red vial OSM | Lineal decreciente entre el mínimo y el máximo nacional de ALD [J] |
| **K02** | **Accesibilidad desde todas las provincias** (equidad) | Federalismo; lección de Canberra sobre la conexión (Roberts 2014). Morten & Oliveira muestran el valor de la red | (a) **Minimax**: el máximo, entre las 24 capitales provinciales, del tiempo de viaje terrestre al sitio. (b) Tiempo medio ponderado por población. (c) Vuelos directos posibles: distancia al aeropuerto con capacidad para pistas ≥ 2.500 m | OSM + OSRM; ORSNA/ANAC (aeropuertos) | (a) L↓ entre 8 h y 30 h; (b) L↓ [J] |
| **K03** | **Ciudad base existente** | Islamabad–Rawalpindi, Putrajaya–Kuala Lumpur y Canberra (lento sin base). El fracaso de las ciudades egipcias sin base económica. La La Plata de 1882 estaba a 60 km de Buenos Aires | Población del aglomerado más grande a ≤ 30 km (o ≤ 45 min) del sitio; presencia de universidad nacional, hospital de alta complejidad y aeropuerto | INDEC (aglomerados); SISA; SPU | Trapezoidal: 0 si < 50.000; 1 entre 150.000 y 800.000; decreciente por encima de 1,5 M, porque se absorbería en la metrópoli y no desconcentraría [J] |
| **K04** | **Integración territorial y rezago** (simbolismo redistributivo) | Objetivos de Viedma, el Norte Grande y Sejong (equilibrio nacional con peso 0,36) | Índice compuesto de la región receptora: PBG per cápita relativo, NBI, densidad del sistema urbano ("vacío" sin ciudades de 100.000 habitantes o más) y distancia al AMBA. Es una variante de F15 de revision-bibliografica | INDEC (NBI 2022), CEPAL/CFI (PBG), PET | Lineal; **peso político explícito** con análisis de sensibilidad [J] |
| **K05** | **Simbolismo y geopolítica** | Viedma (Atlántico Sur, Antártida); Norte Grande (MERCOSUR, países limítrofes) | No es medible de forma objetiva. Proxies opcionales: distancia a la costa atlántica, distancia media a las capitales de países limítrofes (Plan DHI), distancia al centroide del MERCOSUR | Cartografía IGN | **No se pondera en el modelo base.** Es un escenario alternativo, porque entra en conflicto con K01 [J] |
| **K06** | **Tierra fiscal disponible** | Criterio indonesio de tierra estatal. Viedma requería cesiones provinciales con plazo de caducidad | Hectáreas de tierra fiscal (nacional o provincial) contigua de 30.000 ha o más dentro de 30 km | AABE; catastros provinciales | Booleana más lineal [J] |
| **K07** | **Viabilidad del plazo** | §1.1: los traslados tardan entre 15 y 46 años | No es espacial. Se reporta junto al ranking: costo estimado (§6) y fases | — | Advertencia, no factor |

**Tensión fundamental [J].** En Argentina, la población está concentrada en el AMBA y la región pampeana. Un sitio que minimiza K01 caerá cerca del eje Buenos Aires–Rosario–Córdoba, como las propuestas del siglo XIX. Un sitio que maximiza K04 o K05 (Patagonia, Norte Grande) aumenta el aislamiento, que según Campante & Do tiene costos de gobernanza. La app debe **mostrar la frontera de Pareto** entre K01 y K04, en lugar de un único óptimo. Pesos sugeridos: §6.2.

---

## 2. Ciudades nuevas (new towns)

### 2.1 Casos

| Caso | Tipo | Meta | Resultado | Factor explicativo principal | Nivel |
|---|---|---|---|---|---|
| **New towns británicas** (New Towns Act de 1946) | Satélites de Londres y de otras metrópolis, impulsados por una *Development Corporation* pública | Unas 32 ciudades | Muchas cumplieron su escala, como Milton Keynes. El TCPA sostiene que **nunca se hizo una evaluación adecuada** del programa (evidencia escrita al Parlamento, 2008). Revisión de DCLG y Oxford Brookes: *Transferable Lessons from the New Towns* (2006) | Corporaciones con poder de expropiación y **compra de tierra a valor de uso previo** (captura de plusvalías); empleo trasladado junto con la población; conexión ferroviaria con la metrópoli (Forsyth 2019, *TPR* 90(3); doi:10.3828/tpr.2019.17) | [O] |
| **Ciudad Guayana** (Venezuela, 1961) | Polo de crecimiento basado en recursos: hierro, aluminio e hidroelectricidad. Planificada por la CVG con el Joint Center MIT-Harvard | Proyecciones de varios millones (2,5 M para 2020 según Wikipedia) **[no verificado en Rodwin 1969]** | Cerca de 1 M de habitantes (2022) [A] | Ancla industrial estatal, que la hizo dependiente de la CVG y vulnerable a la crisis venezolana | [A] |
| **Songdo** (Corea, 2003–) | Distrito internacional de negocios en una zona económica franca | **265.611** habitantes para 2030 (IFEZ) | **167.346** en el censo 2020 (unos 186.000 según otra fuente). Pocos residentes extranjeros: unos 1.900 [A] | A 40–60 min de Seúl, conectado por metro. Instituciones internacionales como el GCF | [O/A] |
| **Lavasa** (India, 2000s) | Ciudad privada de montaña | 200.000–300.000 habitantes permanentes | Insolvencia: el NCLT admitió la petición el 30/8/2018 y la ciudad se vendió a Darwin Platform en 2023 [A] | Suspensión de permisos ambientales, conflictos de tierras y dependencia de un solo desarrollador privado | [A] |
| **Konza Technopolis** (Kenia, 2008–) | "Silicon Savannah" a 60 km de Nairobi | Unas 185.000 personas | Muy atrasada: la fase 1 debía terminar en 2018 [A]. Estudiada por el INTI y en Keeton & Provoost (2019) | Infraestructura troncal lenta, ancla de empleo débil y gobernanza | [A] |
| **King Abdullah Economic City** (Arabia Saudita, 2005) | Ciudad privada con puerto | **2 M** | Unos 7.000–10.000 en 2018 [A]: **cerca del 0,5 %** [D] | Puerto exitoso pero con poca demanda residencial; competencia de Yeda | [A] |
| **Ciudades nuevas egipcias** (NUCA desde 1979: 49 ciudades y 27 M de capacidad) | Ciudades en el desierto para descongestionar el valle del Nilo | Sadat: 1,5 M; 10 de Ramadán: 2,1 M; New Cairo: 4 M | Sadat **13,5 %**, 10 de Ramadán **12,7 %**, New Cairo **8,0 %**, El Obour 13,7 %, 15 de Mayo 20,2 %. Las de cuarta generación están por debajo del 1 % (**ECES 2026**, con datos de CAPMAS, 1/1/2024) | **El empleo no se desconcentró al ritmo de la vivienda.** En el primer trimestre de 2026 El Cairo tenía unas 15.000 vacantes publicadas, frente a unas 240 en seis gobernaciones con ciudades nuevas | [O] |
| **Eko Atlantic** (Lagos, Nigeria) | Ciudad privada sobre tierra ganada al mar | 250.000 residentes | Casi vacía en 2025 [A] | Orientada a sectores de altos ingresos y desconectada del resto de Lagos | [A] |
| **Xiong'an** (China, 2017–) | Ciudad nueva estatal para desconcentrar funciones no capitales de Pekín | Capacidad sostenible estimada de unos 2,65 M por límite hídrico (revision-bibliografica §3) | Traslado dirigido de empresas estatales y universidades; población actual **[no verificado]** | Mandato estatal centralizado | [A] |
| **Ordos-Kangbashi** (China, 2003–) | Distrito nuevo financiado por la renta del carbón | 1 M (plan de 2003) | Capacidad de 300.000 en 2010; unos 120.000–153.000 habitantes después de 2017 [A] | La burbuja inmobiliaria y la renta del carbón anticiparon la oferta a la demanda. Se recuperó en parte con el traslado de escuelas y oficinas públicas | [A] |
| **La Plata** (1882) | Capital provincial nueva tras la federalización de Buenos Aires (1880) | Capital provincial | 10.407 habitantes en el censo de 1884 (78 % extranjeros) y unos 65.000 en 1890. Tercera ciudad del país en el censo de 1895 [O/A] | **Funciones de capital desde 1884**, puerto, ferrocarril, a 60 km de Buenos Aires y en plena inmigración masiva | [O] |
| **Ushuaia y Río Grande** (Ley 19.640, 1972) | Ciudades promovidas por un régimen fiscal y aduanero | Ocupación soberana | **Tierra del Fuego pasó de 13.527 (1970) a unos 190.000 (2022)**. El 54,5 % de sus residentes nativos nació en otra provincia (INDEC 2024) [O] | **Empleo industrial subsidiado**: la electrónica tiene unos 8.500 puestos, con el 70 % en Río Grande (Fundar 2023; SSPMicro 2022) | [O] |

### 2.2 Tasas de éxito y factores de fracaso

**Escala del fenómeno [O].**
- Keeton & Provoost (2019, *To Build a City in Africa*, nai010/INTI) inventarían **148 ciudades nuevas africanas entre 1960 y 2017**.
- Si todas las anunciadas hasta 2018 cumplieran su meta, alojarían a unos **77 M de personas en 2030**, cerca del 10 % de la población urbana del continente.
- Su crítica central: atienden a empresas internacionales y a sectores medios y altos, e ignoran a la mayoría urbana y los riesgos ecológicos.
- Moser (2015, *Dialogues in Human Geography* 5(1):31–35; doi:10.1177/2043820614565867) y Shepard (2015, *Ghost Cities of China*; doi:10.5040/9781350220386) documentan el mismo patrón en Asia.

**Métrica.** Una revisión narrativa (EuroGeoJournal 2022) concluye que **no hay medidas armonizadas de éxito** de ciudades nuevas. Peiser & Forsyth (eds., 2021, *New Towns for the Twenty-First Century*, Penn Press; doi:10.9783/9780812297317) son la referencia comparada más amplia. **No se encontró una publicación específica del Lincoln Institute** con tasas de éxito; Peiser y Forsyth (Harvard GSD) son lo más cercano, y la atribución al Lincoln Institute queda **[no verificada]**.

**Tasa empírica [D].** Con los casos de este documento que tienen meta y población medidas (19 ciudades egipcias, Putrajaya, Songdo, KAEC, la Nueva Capital Administrativa, Belmopán y Ordos), la **mediana de cumplimiento está por debajo del 15 %**. Solo superan el 60 % Songdo y los casos con ciudad base o ancla (Brasília, Canberra, La Plata, Tierra del Fuego). La muestra tiene sesgo de selección: incluye casos célebres por sus problemas.

**Factores de fracaso** (de mayor a menor recurrencia en las fuentes) [O/J]:
1. **Empleo.** No hay ancla económica o el empleo sigue concentrado en la metrópoli (Egipto, KAEC, Konza, la Nueva Capital Administrativa). Contraejemplos: Tierra del Fuego, Ciudad Guayana y las new towns británicas, donde las industrias se trasladaron junto con la población.
2. **Conectividad.** Si queda muy lejos, falta acceso al mercado; si queda muy cerca, el tiempo de viaje sustituye a la mudanza (empleados de la Nueva Capital Administrativa que viajan desde El Cairo; Eko Atlantic, desconectada de Lagos).
3. **Gobernanza y financiamiento.**
   - Los proyectos privados con un único desarrollador son frágiles (Lavasa, KAEC, Eko Atlantic).
   - Una autoridad pública de desarrollo con control del suelo funciona mejor (Development Corporations británicas; Roberts 2014 sobre Canberra).
4. **Mercado de vivienda desalineado.** Se produce oferta para ingresos altos o especulación (Ordos, la Nueva Capital Administrativa) en lugar de vivienda para la demanda real de la región (Keeton & Provoost 2019).
5. **Ambiente y suelo.** Permisos ambientales (Lavasa), turberas y pantanos (Nusantara), capacidad hídrica (Xiong'an).

**Charter cities (Romer).**
- **Propuesta.** Romer (2010, *Technologies, Rules, and Progress: The Case for Charter Cities*, CGD, 3/3/2010) propone ciudades nuevas con **reglas** (instituciones) distintas, al estilo de las zonas económicas especiales chinas, como vía para adoptar mejores normas.
- **Experiencia.**
  - En Madagascar no avanzó: cayó Ravalomanana en 2009, en parte por la oposición a ceder tierras a extranjeros [A].
  - En Honduras (ZEDE) Romer se retiró por falta de transparencia y garantías democráticas [A]. Próspera (Roatán) siguió con fuerte conflicto legal y social, y Romer declaró que «perdió el rumbo» [A].
- **Evidencia de impacto.** No hay. Es una **propuesta teórica sin casos evaluables** [A].

---

## 3. Redistribución hacia ciudades intermedias, polos y regímenes de promoción

### 3.1 Polos de crecimiento: teoría y balance

- **Teoría.** Perroux (1955, «Note sur la notion de pôle de croissance», *Économie Appliquée* 8; sin DOI, **[no verificado en primaria]**) define el polo como una industria motriz en un espacio económico abstracto. Boudeville (1966, *Problems of Regional Economic Planning*, Edinburgh UP) lo traslada al espacio geográfico.
- **Revisiones críticas.** Darwent (1969, *Environment and Planning A* 1(1):5–31; doi:10.1068/a010005) y Parr (1999, *Urban Studies* 36(7):1195–1215; doi:10.1080/0042098993187) concluyen que la estrategia se aplicó con:
  - demasiados polos;
  - horizontes demasiado cortos;
  - polos mal elegidos (sin base urbana).

  Los efectos de derrame hacia la región ("trickle-down") fueron débiles en general [O].
- **Lección.** Ciudad Guayana es el ejemplo latinoamericano canónico: creció, pero como enclave dependiente de empresas estatales.

### 3.2 Place-based policies: evidencia causal internacional

| Estudio | Política | Resultado | Nivel |
|---|---|---|---|
| **Kline & Moretti** (2014, *QJE* 129(1):275–331; doi:10.1093/qje/qjt034) | Tennessee Valley Authority (1933–), comparada con autoridades propuestas pero no aprobadas | El empleo agrícola subió y **se revirtió** al terminar los subsidios. El manufacturero **siguió creciendo** después (aglomeración). La inversión directa en infraestructura rindió más que su costo, pero **las ganancias de aglomeración se compensaron con pérdidas en el resto del país** | [E] |
| **Kline & Moretti** (2014, *Annual Review of Economics* 6:629–662; doi:10.1146/annurev-economics-080213-041024) | Marco de bienestar | Las políticas basadas en el lugar se justifican ante fallas locales específicas. Si no, solo redistribuyen | [E, teoría y revisión] |
| **Neumark & Simpson** (2015, *Handbook of Regional and Urban Economics* 5:1197–1287; doi:10.1016/B978-0-444-59531-7.00018-1) | Revisión: zonas empresariales, incentivos discrecionales, clusters, universidades, infraestructura | Las zonas empresariales tienen efectos en general débiles o nulos, con excepciones. La infraestructura de gran escala (TVA) muestra más evidencia positiva. Advierten sobre la captura por los propietarios de la tierra. *El DOI está verificado; esta síntesis no se contrastó con el texto en esta revisión.* | [E, revisión] |
| **Busso, Gregory & Kline** (2013, *AER* 103(2):897–947; doi:10.1257/aer.103.2.897) | Empowerment Zones de EE. UU. | Más empleo y salarios locales, **sin aumento de población** ni del costo de vida. Costos de eficiencia modestos | [E] |
| **von Ehrlich & Seidel** (2018, *AEJ: Policy* 10(4):344–374; doi:10.1257/pol.20160395) | Zonenrandgebiet (franja limítrofe con Alemania oriental) | **Efectos persistentes** sobre la densidad económica después del fin del subsidio, gracias a una base fiscal más alta y más inversión pública local. Hubo relocalización desde áreas vecinas y **capitalización en la renta del suelo** | [E] |
| **Becker, Egger & von Ehrlich** (2010, *JPubE* 94(9–10):578–590; doi:10.1016/j.jpubeco.2010.06.006) | Fondos estructurales de la UE (Objetivo 1) | Efecto positivo sobre el crecimiento del PBI per cápita, sin efecto sobre el empleo. No se leyó el resumen en esta revisión; se cita por su resultado ampliamente conocido **[verificar]** | [E] |
| **Criscuolo, Martin, Overman & Van Reenen** (2019, *AER* 109(1):48–85; doi:10.1257/aer.20160034) | Regional Selective Assistance (Reino Unido) | Un subsidio máximo 10 p.p. mayor eleva **un 10 %** el empleo manufacturero, **solo en firmas pequeñas**. Las grandes toman el subsidio sin aumentar su actividad | [E] |
| **Lu, Wang & Zhu** (2019, *AEJ: Policy* 11(3):325–360; doi:10.1257/pol.20160272) | Zonas económicas especiales chinas | Efectos positivos en inversión, empleo, productividad y salarios, explicados por la entrada neta de firmas. Beneficio neto de unos USD 15.620 M en 3 años | [E] |
| **Glaeser & Gottlieb** (2008, *BPEA* 2008(1):155–253; doi:10.1353/eca.0.0005) | Revisión | Escepticismo: subsidiar lugares en declive mueve actividad sin un claro beneficio nacional. *El DOI está verificado; esta síntesis no se contrastó con el texto en esta revisión.* | [E, revisión] |
| **Austin, Glaeser & Summers** (2018, *BPEA* 2018(1):151–255; doi:10.1353/eca.2018.0002) | Revisión del "heartland" de EE. UU. | Sugieren focalizar en el **empleo** (subsidios al empleo) en zonas con alta inactividad, donde la respuesta laboral es mayor | [E, revisión] |
| **Banco Mundial, WDR 2009** *Reshaping Economic Geography* (doi:10.1596/978-0-8213-7607-2) | Marco de densidad, distancia y división | Secuencia recomendada: (1) **instituciones espacialmente neutrales** (servicios básicos universales); (2) **infraestructura conectiva**; (3) **intervenciones focalizadas** solo en el tercer escalón y para divisiones profundas. La concentración económica es compatible con la convergencia en niveles de vida | [O, síntesis] |

**Lectura conjunta [J].**
1. Las políticas basadas en el lugar **pueden** generar efectos persistentes cuando crean una base industrial o fiscal que se sostiene sola (TVA, Zonenrandgebiet). Para la Argentina, el equivalente es San Luis (§3.3).
2. El efecto nacional neto suele ser **cercano a cero**, porque la actividad se relocaliza.
3. La infraestructura de conexión tiene mejor evidencia que los subsidios (TVA, Brasília).
4. **Atraer población** es un objetivo distinto a crear empleo: las Empowerment Zones crearon empleo sin aumentar la población.

### 3.3 Argentina: regímenes de promoción

**Promoción industrial en La Rioja (Ley 22.021/79), Catamarca y San Luis (Ley 22.702/82) y San Juan (Ley 22.973/83).**

El antecedente es el Acta de Reparación Histórica (1973). El régimen se extendió hasta fines de 2012 (Decreto 69/97). Fuente principal: Karamaneff & Salvia (2019, *Estado Abierto* 3, INAP/UCA), que reproducen datos del Consejo Empresario Mendocino (CEM 1999).

| Indicador | Catamarca | La Rioja | San Luis | San Juan | Total |
|---|---|---|---|---|---|
| Empleo industrial en 1973 | 1.994 | 1.750 | 4.661 | 8.388 | 16.793 |
| Empleo industrial en 1993 | 6.525 | 6.611 | 22.658 | 12.727 | 48.521 |
| Diferencia | +4.531 | +4.861 | **+17.997** | +4.339 | **+31.728** |
| Resto urbano del país | | | | | −517.312 |
| Proyectos presentados | 100–300 | 100–300 | **más de 1.000** | 100–300 | |

**Resultados por dimensión:**
- **Población [O].** San Luis **revirtió su histórica expulsión de población**: creció 27,8 % en el período intercensal frente al 14,7 % nacional. Su PBG creció 227 % entre 1983 y 1991, y la industria pasó a superar el 50 % del PBG en 2000. Hoy el 28 % de su población nativa nació en otra provincia, el cuarto valor del país (INDEC 2024).
- **Costo fiscal [A/O].** El estudio de Dagnino Pastore y Asociados para el CEM (*La Nación*, 29/8/1999) estimó **$461.000 por puesto creado**, equivalentes a USD con la convertibilidad 1 a 1: **USD 332.000 en Catamarca y USD 513.200 en San Luis**. El costo total previsto era de USD 32.600 M entre 1983 y 2010, que incluye un 8 % anual de interés sobre unos USD 18.000 M nominales.
  - **Advertencia:** el CEM representaba a empresarios de Mendoza, que competían con las provincias promovidas. La cifra incluye intereses imputados y cuenta solo el empleo directo.
  - Otra estimación oficial previó un costo de USD 870 M (1989) a USD 1.620 M (1993) por año.
- **Permanencia [O].** Karamaneff & Salvia (2019), con datos de la EPH para 2005–2017 y una regresión logística, **descartan la hipótesis de las "fábricas con ruedas"** para San Luis: el empleo industrial asalariado se sostuvo después de 2012. Bianchi (2013) afirmaba que menos del 10 % de las industrias se quedó.
  - Matiz: en el aglomerado San Luis–El Chorrillo la tasa de ocupación cayó del 54,8 % (2005) al 45,1 % (2017) y el desempleo subió levemente.
  - La literatura explica el éxito relativo de San Luis por la **ubicación** (corredor bioceánico, cercanía a los mercados) y por la **capacidad estatal** (Ministerio de Industria, burocracia especializada).
- **Lectura [J].** Es la mejor aproximación local a un polo con efectos persistentes. El costo por empleo es alto y el diseño **no es un experimento**: no hay un contrafáctico creíble.

**Ley 19.640 (Tierra del Fuego, 1972).**
- **Población [O].** Pasó de 13.527 habitantes (1970) a 27.358 (1980), 69.369 (1991) y unos 190.000 (2022), según IPIEC e INDEC. El crecimiento intercensal es el mayor del país durante 50 años.
- **Costo fiscal [O].** El subrégimen industrial cuesta **USD 1.070 M, 0,22 % del PBI** (Fundar 2023, Hallak et al., 14/6/2023). La estimación oficial para todo el régimen es de **USD 1.567 M por año**.
- **Empleo [O].** La electrónica tiene unos 8.500 puestos.
- **Costo por empleo [D].** Unos **USD 126.000 por puesto de la electrónica y por año**, calculado como 1.070 / 8.500. Es una cota superior, porque el costo cubre todo el subrégimen industrial y no solo la electrónica.
- **Efecto neto nacional.** Según la prensa que cita a Fundar, el régimen implicaría una pérdida neta de empleo a nivel nacional **[A, no verificado en el documento]**.
- **Lectura [J].** Es el caso argentino más claro de **población movilizada por un instrumento**. También es el más caro por empleo y el que tiene más dependencia: no hay evidencia de que la población se sostuviera sin el régimen.

**Patagonia, otros instrumentos.** La revisión no encontró evaluaciones cuantitativas. Entre los instrumentos están los reembolsos por puertos patagónicos y las zonas francas. El crecimiento de Neuquén (28,1 % de nacidos en otra provincia) responde sobre todo a los hidrocarburos (Vaca Muerta), no a un régimen de promoción [J].

---

## 4. Repoblamiento rural y de pequeños pueblos

| País o programa | Instrumento | Evidencia de resultados | Nivel |
|---|---|---|---|
| **España ("España vaciada")** | Plan de 130 medidas ante el reto demográfico (2021), incentivos fiscales autonómicos (IRPF, ITPAJD) y leyes de impacto demográfico, como la de Castilla-La Mancha | **No hay evaluaciones causales.** Las proyecciones contrafácticas de cohortes-componentes (revista *AGER*) muestran **declive y envejecimiento rural sostenidos hasta 2050** pese a décadas de políticas. Los municipios de menos de 10.000 habitantes ganaron unos 100.000 habitantes netos en 2020 por la pandemia (INE, vía *Público*), con riesgo de reversión. El Gobierno de Aragón cita una revisión sobre "incentivos fiscales para la fijación de población" que no se pudo leer | [O/A] |
| **Japón** | (a) **Furusato nōzei** (2008): donaciones a municipios con deducción fiscal, que **transfieren recursos, no personas**. (b) **Chiiki Okoshi Kyōryokutai**: cuerpos de revitalización con contrato de hasta 3 años. (c) Estrategia *Chihō Sōsei* (2014) | (b) Encuesta del MIC (abril de 2026, vía ISVD): de 8.762 ex miembros con mandato terminado entre 2020 y 2025, **el 57,5 % se quedó en el municipio** y el 12,8 % en uno vecino (70,3 % en total). (c) La meta de **equilibrar los flujos hacia Tokio para 2020** se pospuso a 2024 y luego a 2027. En 2024 persistía un ingreso neto de **135.843 personas**: **11 años seguidos de incumplimiento** (Kyodo; ISVD). Nippon.com señala que las medidas pudieron incluso **acelerar** la migración de jóvenes y mujeres a Tokio | [O] para la permanencia y la meta; [A] para la interpretación |
| **Italia ("casas a 1 euro")** | Venta simbólica de casas abandonadas con obligación de reforma (Mussomeli desde 2017, Sambuca di Sicilia, etc.) | **No hay datos nacionales oficiales** de ventas ni series de población antes y después. Mussomeli: más de 100–150 casas vendidas. Sambuca: unos 16–17 inmuebles y un «impacto de €100 M» según el municipio | [A], autodeclarado |
| **Argentina, programas de fundaciones** | "Bienvenidos a mi Pueblo" (Fundación ES VICIS): migración grupal planificada de al menos 20 familias a pueblos de hasta 2.000 habitantes. Piloto en Colonia Belgrano (Santa Fe); en 2021 se extendió a 5 localidades de General López | La fundación declara +10 % de población en un año y 25 negocios nuevos en Colonia Belgrano [A, autodeclarado]. Sin evaluación independiente | [A] |
| **Argentina, "Pueblos que laten"** | — | **No se encontró un programa con ese nombre.** La única coincidencia es la serie periodística «Pueblos que todavía laten» del diario *La Nueva* (Bahía Blanca, 2006–2007), que retrata pueblos del sudoeste bonaerense (Erize, Lartigau con unos 38 habitantes, Arroyo Venado, San Román). **Hay que confirmar con quien lo propuso a qué programa se refiere** | — |
| **Argentina, contexto** | Pueblos en riesgo de desaparición (ONG Responde); El Faro (Buenos Aires) pasó de unos 600 a unos 14 habitantes [A] | — | [A] |
| **Plan DHI** (plan-dhi-resumen §2.1) | «Plan de redistribución poblacional voluntaria»: revitalizar pueblos o crearlos desde cero **dentro de 30 km de los ejidos urbanos**, con autoconstrucción, trabajo remoto y mejoras de transporte y conectividad. Créditos hipotecarios priorizados y centros culturales | **Sin costo ni meta** (no está en la síntesis financiera del plan). La componente vecina, 1.000.000 de lotes con servicios, sí tiene costo: **USD 12.000 por lote** | Propuesta, sin evidencia |

**Síntesis [J].**
- **No hay evidencia** de que algún programa de repoblamiento de pequeños pueblos haya revertido el declive demográfico a escala regional.
- Las experiencias con resultados medibles mueven **pocas personas** (cientos a miles) y miden **permanencia**, no impacto neto.
- El indicador más útil y replicable es la **tasa de permanencia a 3–5 años** de los recién llegados. La referencia japonesa es 57,5 % en el mismo municipio.
- La condición de 30 km a un ejido del Plan DHI es coherente con lo que sabemos: la vida en el pueblo depende del acceso al empleo y a los servicios de una ciudad cercana. Se parece más a la **suburbanización rural** que al repoblamiento del territorio vacío.

---

## 5. Migración interna en Argentina

### 5.1 Datos 2010–2022

Fuente: INDEC (abril de 2024), *Censo 2022. Resultados definitivos. Migraciones internacionales e internas. Edición ampliada* (ISBN 978-950-896-671-1), `https://www.indec.gob.ar/ftp/cuadros/poblacion/censo2022_migraciones.pdf` [O].

**Stock de migrantes internos:**
- **6.912.603** nativos en viviendas particulares nacieron en una jurisdicción distinta de la de su residencia: **15,8 %** de la población nativa.
- En 2010 la proporción era de **20,9 %**. La caída es fuerte.
- *Chequeado* reporta un 17,8 % (7.995.417 personas) con otra base; **la cifra oficial es la de INDEC**.

**Proporción de nacidos en otra jurisdicción por provincia (2022):**

| Jurisdicción | % | Jurisdicción | % |
|---|---|---|---|
| Tierra del Fuego | 54,5 | Córdoba | 14,2 |
| Santa Cruz | 41,8 | Santa Fe | 12,9 |
| Neuquén | 28,1 | Mendoza | 12,6 |
| San Luis | 28,0 | Corrientes | 12,0 |
| Río Negro | 26,5 | Santiago del Estero | 11,7 |
| Chubut | 26,2 | Entre Ríos | 11,2 |
| CABA | 23,3 | Salta | 11,0 |
| La Pampa | 21,2 | Tucumán | 10,7 |
| La Rioja | 18,5 | Misiones | 9,3 |
| Buenos Aires | 16,7 | Formosa | 9,0 |
| Jujuy | 15,3 | San Juan | 8,9 |
| Catamarca | 14,6 | Chaco | 8,3 |

**Migración reciente.**
- El Censo 2022 incluyó la pregunta «¿Hace 5 años vivía en…?» (pregunta 17), con cuadros por residencia en 2017 dentro de los 578 cuadros del tabulado.
- El informe publica la **proporción de migrantes internos llegados hace menos de 5 años** por provincia (Gráfico 17). Va del 9,0 % en Buenos Aires al **26,0 % en Corrientes y 25,8 % en Misiones**. Entre ambos extremos hay valores como 15,4 % en la CABA, 19,6 % en Neuquén y 16,0 % en San Luis.
- La matriz completa de origen y destino 2017–2022 está en los cuadros del INDEC y se puede procesar con REDATAM. **Este insumo debe cargarse en la app.**

**Saldos 2005–2010.** Basso (2023, *Astrolabio* 30:112–143; doi:10.55441/1668.7515.n30.35108), con REDATAM del Censo 2010, encuentra:
- tasas netas **positivas en la Patagonia** (Tierra del Fuego, Santa Cruz, Chubut) y también en Córdoba y Santa Fe;
- tasas **negativas en el norte, Cuyo, la Mesopotamia y la CABA**;
- en la región pampeana, flujos elevados con tasas netas bajas [O].

### 5.2 Determinantes y elasticidades

| Determinante | Evidencia para Argentina | Evidencia internacional | Nivel |
|---|---|---|---|
| **Ingreso o salario** | Basso (2023): regresión simple de la tasa neta provincial sobre el ingreso mediano (EAHU 2010). Coeficiente de **0,0288** (p < 0,01), R² = 0,68 y correlación de 0,82, con n = 24 y una sola variable. **No es una elasticidad**, las unidades no son comparables y no identifica causalidad. Los migrantes tienen ingresos más altos pero también **más desempleo** al llegar | Kennan & Walker (2011, *Econometrica* 79(1):211–251; doi:10.3982/ECTA4657): las decisiones de migrar entre estados de EE. UU. **responden sustancialmente al ingreso esperado**, por diferencias de salario medio y por búsqueda de un mejor ajuste. Aroca & Maloney (2005, *WBER* 19(3):449–472; doi:10.1093/wber/lhi017): en México, las variables laborales son significativas una vez que se controla la restricción de crédito; duplicar la IED reduce la migración entre 1,5 y 2 % | [O] AR; [E] internacional |
| **Desempleo** | Navarro de Gimbatti & Méndez (2003, citados en las IX Jornadas de Estudios de Población, 2007; **no leído**): con la EPH 1996–2002, las disparidades de desempleo favorecen la migración, junto con factores propios de cada aglomerado | Blanchard & Katz (1992, *BPEA*; doi:10.2307/2534556): en EE. UU., **la migración es el principal mecanismo de ajuste** ante shocks regionales de empleo | [A] AR; [E] internacional |
| **Vivienda** | La revisión no encontró estimaciones argentinas | Glaeser & Gottlieb (2008): la oferta de vivienda determina si un shock de demanda se traduce en población o en precios. Busso et al. (2013): más empleo sin más población | [E] internacional |
| **Servicios (salud, educación)** | El Plan DHI supone que más médicos «frenan la migración» (plan-dhi-resumen §2.1), **sin evidencia** | ECES (2026): escuelas, salud, transporte y vivienda asequible condicionan la mudanza a las ciudades nuevas egipcias | [O] |
| **Costo de migrar (distancia, redes)** | Basso (2023): la distancia aparece de forma cualitativa | Morten & Oliveira (2024): las rutas bajan el costo de migrar. Bryan & Morten (2019, *JPE* 127(5):2229–2268; doi:10.1086/701810): las barreras a la migración interna reducen la productividad agregada | [E] internacional |

**Elasticidad recomendada para la app [J].**
- No existe una elasticidad migración-salario argentina estimada con un diseño creíble. Si la app necesita proyectar respuestas migratorias, debe:
  - **(a)** usar un modelo gravitacional calibrado con la matriz 2017–2022 del INDEC (flujo_ij ~ pob_i · pob_j · w_j/w_i · d_ij^−β), estimando β y la sensibilidad salarial con datos propios;
  - **(b)** mostrar rangos con análisis de sensibilidad, sin un valor único.
- Como orden de magnitud internacional, los modelos de elección discreta (Kennan & Walker) implican respuestas significativas pero lentas.
- La caída de la proporción de migrantes internos entre 2010 y 2022 sugiere que **la movilidad espontánea está bajando**. Cualquier meta de redistribución debe medirse contra esa tendencia [J].

---

## 6. Implicancias para la app

### 6.1 Principios

1. **Cada instrumento tiene su unidad, sus restricciones, sus factores y su métrica de éxito.** El modelo MCDA de revision-bibliografica (celdas, R01–R14, F01–F15) sirve directamente para la **ciudad nueva**. Los demás instrumentos lo reutilizan como capa física y agregan factores propios (prefijos K, I, P y G en la tabla JSON).
2. **El factor que más pesa en el éxito poblacional es el empleo o la base económica**, y hoy no está modelado. Las fuentes candidatas son:
   - SIPA y OEDE (empleo registrado por departamento);
   - EPH (31 aglomerados);
   - CEP XXI (mapa productivo).
3. **El costo y el plazo se muestran junto al puntaje**, porque la evidencia (Viedma, Dodoma, Abuja) indica que la sostenibilidad política y fiscal decide más que la aptitud del sitio.
4. **Los indicadores de éxito deben ser medibles con el censo o con registros administrativos**:
   - población lograda sobre población meta a 10 y 20 años;
   - empleo por habitante;
   - tasa de permanencia;
   - saldo migratorio.

### 6.2 Fichas por instrumento

#### (a) Ciudad nueva

- **Unidad:** celda de 1 km² (o 250 m) con agregación en un sitio candidato de 30–100 km².
- **Restricciones:** R01–R14 de revision-bibliografica, incluida R11 (buffer de ciudades existentes), más:
  - **G-R1:** distancia de 30 km o más a un aglomerado de 500.000 habitantes o más, para no ser absorbida;
  - **G-R2:** tiempo de viaje de 3 h o menos a un aglomerado de 300.000 habitantes o más, para no quedar aislada.
- **Factores específicos y pesos sugeridos** (el resto se toma de revision-bibliografica §7, reescalado al 0,55 restante):

  | Factor | Peso | Fundamento |
  |---|---|---|
  | G01, ancla de empleo | 0,20 | Egipto, KAEC, Tierra del Fuego |
  | G02, conectividad de transporte con la metrópoli | 0,10 | New towns británicas, Songdo |
  | G03, tierra fiscal | 0,08 | Development Corporations, Nusantara |
  | G04, demanda regional de vivienda | 0,07 | Keeton & Provoost |

- **Indicadores de éxito:**
  - población lograda a 10 y 20 años sobre la meta. Referencias: Egipto, 5–20 % a más de 30 años; Songdo, 63 % a 17 años [D];
  - empleo local por residente;
  - ocupación de viviendas.
- **Costos de referencia:**
  - Nusantara: unos USD 23.000 por habitante [D: USD 34.000 M / 1,5 M];
  - Putrajaya: unos USD 25.000 por habitante meta y unos USD 74.000 por habitante real [D];
  - Plan DHI, lote con servicios: USD 12.000 por lote, o unos USD 4.700 por habitante [D, con 2,56 personas por hogar según el Censo 2022: 45,6 M de personas / 17,8 M de hogares].
- **Advertencias:**
  - la mediana de cumplimiento de metas es inferior al 15 %;
  - el sesgo hacia vivienda de ingresos altos;
  - el riesgo de ciudad fantasma si la oferta se anticipa a la demanda (Ordos).

#### (b) Capital

- **Unidad:** el sitio candidato, definido como el buffer de 30 km alrededor de una localidad base, evaluado sobre el conjunto nacional.
- **Restricciones:**
  - R01–R14;
  - **K-R1:** ciudad base de 50.000 habitantes o más a 45 min o menos;
  - **K-R2:** tierra contigua disponible de 30.000 ha o más (Viedma requería 490.000 ha de distrito, pero la ciudad necesita mucha menos superficie).
- **Factores:** K01–K06 de §1.4. Pesos base sugeridos [J], reescalados para que sumen 1 junto con un bloque físico de 0,30:

  | Factor | Peso |
  |---|---|
  | K01, centralidad poblacional | 0,20 |
  | K02, accesibilidad | 0,15 |
  | K03, ciudad base | 0,15 |
  | K04, integración y rezago | 0,15 |
  | K06, tierra fiscal | 0,05 |
  | Bloque físico (F01, F08–F10, F03) | 0,30 |

  Hay que correr escenarios:
  - **"Sejong"**, con K04 = 0,36;
  - **"geopolítico"**, que activa K05;
  - **"rendición de cuentas"**, con K01 = 0,35.
- **Indicadores de éxito:**
  - funcionarios trasladados sobre los previstos;
  - población lograda sobre la meta;
  - ALD nacional antes y después (Campante & Do);
  - participación del AMBA en la población y el PBG a 20 años;
  - multiplicador de empleo privado local, con referencia de 1,0–1,4 (Becker et al. 2021; Faggio et al. 2025).
- **Costos de referencia:**
  - Brasília: 12,3 % del PBI [A];
  - Nusantara: USD 34.000 M, con 19 % público;
  - Nueva Capital Administrativa de Egipto: USD 45.000–58.000 M [A];
  - Putrajaya: USD 8.100 M [A];
  - Viedma: USD 1.500–20.000 M, sin estudio [A].
- **Advertencias:**
  - de 15 a 46 años de plazo;
  - no hay evidencia de desconcentración de la primada;
  - una capital aislada implica peor rendición de cuentas;
  - el fracaso de Viedma fue político y fiscal, no de sitio.

#### (c) Ciudades intermedias (redistribución hacia ciudades existentes)

- **Unidad:** aglomerado INDEC o localidad de 50.000 a 500.000 habitantes; departamento cuando faltan datos.
- **Restricciones:**
  - riesgo de inundación R03 aplicado a las áreas de expansión;
  - **I-R1:** holgura hídrica (R13) para la población adicional;
  - **I-R2:** cobertura de agua de red del 50 % o más.
- **Factores y pesos [J]:**

  | Factor | Peso | Indicador |
  |---|---|---|
  | I01, dinamismo del empleo registrado | 0,25 | Crecimiento del SIPA en 10 años |
  | I02, salario relativo | 0,10 | Salario medio del aglomerado sobre la media nacional |
  | I03, asequibilidad de la vivienda | 0,10 | Costo de la vivienda sobre el salario |
  | I04, margen de densificación y suelo vacante | 0,15 | revision-bibliografica §5 |
  | I05, servicios (salud de alta complejidad y universidad) | 0,10 | F14 |
  | I06, accesibilidad nacional | 0,10 | F06 |
  | I07, capacidad institucional | 0,10 | Planes vigentes, catastro, recaudación propia |
  | I08, saldo migratorio reciente | 0,10 | Censo 2022, residencia en 2017 |

- **Indicadores de éxito:**
  - saldo migratorio positivo sostenido;
  - población adicional absorbida sin expansión difusa (cociente de expansión sobre crecimiento menor que 1,5, CIPPEC);
  - empleo por habitante.
- **Costos de referencia:**
  - vivienda social terminada con servicios: unos USD 30.000 [A, Bekerman, año no informado];
  - vivienda PROCREAR de 51 m²: $2.621.756 (julio de 2020, sin terreno) [A];
  - lote con servicios del Plan DHI: USD 12.000.
- **Advertencias:**
  - es el instrumento más alineado con el WDR 2009 (servicios universales, conectividad);
  - "atraer población" requiere empleo y vivienda a la vez (Busso et al. 2013).

#### (d) Pueblos (repoblamiento)

- **Unidad:** localidad INDEC de 2.000 habitantes o menos, o de 2.000 a 10.000. Su área de influencia es de 30 km según el Plan DHI.
- **Restricciones:**
  - **P-R1:** ciudad de 50.000 habitantes o más a 30 km o menos, o a 40 min o menos (Plan DHI);
  - **P-R2:** agua segura, con arsénico bajo el umbral de la OMS (F02);
  - **P-R3:** no estar en zona de riesgo de inundación recurrente (R03).
- **Factores y pesos [J]:**

  | Factor | Peso |
  |---|---|
  | P01, conectividad digital (ENACOM, velocidad de banda ancha) | 0,20 |
  | P02, viviendas deshabitadas recuperables (Censo 2022) | 0,15 |
  | P03, escuela y centro de salud en la localidad | 0,15 |
  | P04, base productiva local (empleo agropecuario y agroindustrial; zonas del Plan DHI con 50 unidades productivas o más) | 0,20 |
  | P05, tiempo de viaje a la ciudad de servicios | 0,15 |
  | P06, tendencia demográfica 2010–2022 (priorizar declive moderado, no extinción) | 0,15 |

- **Indicadores de éxito:**
  - permanencia de los recién llegados a 3 y 5 años, con referencia de 57,5–70,3 % (Japón);
  - población 2022 contra 2032 frente al contrafáctico de cohortes-componentes;
  - negocios nuevos.
- **Costos de referencia:**
  - lote con servicios: USD 12.000 (Plan DHI);
  - la revisión no encontró costos de programas de repoblamiento.
- **Advertencias:**
  - no hay evidencia causal;
  - las cifras son autodeclaradas;
  - "Pueblos que laten" no es verificable;
  - riesgo de que sea suburbanización y no repoblamiento.

#### (e) Polos (promoción productiva)

- **Unidad:** departamento, o aglomerado con su área de influencia de 50 km.
- **Restricciones:**
  - **G-R1:** ciudad base de 100.000 habitantes o más (Parr 1999: los polos sin base urbana fallan);
  - **G-R2:** acceso a energía en alta tensión (F11) y a la red troncal vial o ferroviaria.
- **Factores y pesos [J]:**

  | Factor | Peso |
  |---|---|
  | E01, acceso al mercado (potencial de mercado ponderado por población y PBG) | 0,20 |
  | E02, base industrial existente y especialización (SIPA, CEP XXI) | 0,20 |
  | E03, capital humano (población con secundario completo, universidad) | 0,15 |
  | E04, logística (puertos, corredor bioceánico, ferrocarril) | 0,15 |
  | E05, capacidad estatal provincial | 0,10 |
  | E06, recurso específico (energía, minería, agro) | 0,10 |
  | E07, rezago (NBI) como criterio de equidad | 0,10 |

- **Indicadores de éxito:**
  - empleo neto creado frente a la región de control;
  - **permanencia a 5 y 10 años del fin del beneficio** (San Luis, Zonenrandgebiet, TVA);
  - costo fiscal por empleo y por año;
  - saldo migratorio.
- **Costos de referencia:**
  - promoción industrial: USD 461.000 por empleo acumulado (CEM 1999) [A/O];
  - Tierra del Fuego: unos USD 126.000 por empleo por año, como cota superior [D, a partir de Fundar 2023];
  - Regional Selective Assistance (Reino Unido): +10 % de empleo manufacturero por +10 p.p. de subsidio, solo en pymes [E].
- **Advertencias:**
  - el efecto nacional neto puede ser cercano a cero por relocalización;
  - captura por las grandes firmas y por los propietarios de la tierra;
  - el subsidio al capital no garantiza empleo.

### 6.3 JSON de instrumentos

Los pesos son **[J]** salvo que se indique otra cosa. "funcion_valor" usa la notación de revision-bibliografica §4.2 (L↑ es lineal creciente, L↓ lineal decreciente, trap es trapezoidal).

```json
{
  "ciudad_nueva": {
    "unidad": "celda 1 km2 agregada a sitio candidato 30-100 km2",
    "restricciones": ["R01-R14 (revision-bibliografica §4.1)", "G-R1: >=30 km de aglomerado >=500.000 hab", "G-R2: <=3 h a aglomerado >=300.000 hab"],
    "factores": [
      {"id": "G01", "nombre": "Ancla de empleo", "variable": "empleo registrado (SIPA) en 45 min / poblacion meta", "funcion_valor": "L↑(0; 0,4)", "peso": 0.20, "fuente": "ECES 2026; Fundar 2023 (TDF); Keeton & Provoost 2019"},
      {"id": "G02", "nombre": "Conectividad con metropoli", "variable": "tiempo de viaje a aglomerado >=300.000 hab (min)", "funcion_valor": "trap(30; 45; 90; 180)", "peso": 0.10, "fuente": "Forsyth 2019 doi:10.3828/tpr.2019.17; ECES 2026"},
      {"id": "G03", "nombre": "Tierra fiscal contigua", "variable": "ha de tierra fiscal en el sitio", "funcion_valor": "L↑(0; superficie requerida)", "peso": 0.08, "fuente": "Salim & Negara 2019; Forsyth 2019"},
      {"id": "G04", "nombre": "Demanda regional de vivienda", "variable": "crecimiento de hogares 2010-2022 en 100 km", "funcion_valor": "L↑(min; max nacional)", "peso": 0.07, "fuente": "INDEC Censo 2010-2022; Keeton & Provoost 2019"},
      {"id": "F01-F15", "nombre": "Bloque fisico-ambiental", "variable": "ver revision-bibliografica §4.2", "funcion_valor": "ver §4.2", "peso": 0.55, "fuente": "revision-bibliografica §7 reescalado"}
    ],
    "costos": [
      {"concepto": "Nusantara costo total / poblacion meta", "valor": 23000, "unidad": "USD/hab", "fuente": "[D] IDR 485,2 billones = USD 34.000 M / 1,5 M (Bappenas en Salim & Negara 2019)"},
      {"concepto": "Putrajaya costo / poblacion meta", "valor": 25000, "unidad": "USD/hab", "fuente": "[D] USD 8.100 M [A] / 320.000"},
      {"concepto": "Lote con servicios (tierra 4.800 + obras 7.200)", "valor": 12000, "unidad": "USD/lote", "fuente": "Plan DHI p. 39-40 (plan-dhi-resumen §2.1)"},
      {"concepto": "Lote con servicios por habitante", "valor": 4700, "unidad": "USD/hab", "fuente": "[D] 12.000 / 2,56 hab por hogar (INDEC 2022)"}
    ],
    "advertencias": ["Mediana de cumplimiento de metas poblacionales <15% en los casos con datos [D]", "Ciudades egipcias de 30-45 anos: 5-20% de la meta (ECES 2026)", "Sin ancla de empleo la vivienda queda vacia o se vuelve dormitorio", "Proyectos de desarrollador unico fragiles (Lavasa, KAEC, Eko Atlantic)"]
  },
  "capital": {
    "unidad": "sitio candidato = buffer 30 km de localidad base, evaluado a escala nacional",
    "restricciones": ["R01-R14", "K-R1: ciudad base >=50.000 hab a <=45 min", "K-R2: >=30.000 ha contiguas disponibles"],
    "factores": [
      {"id": "K01", "nombre": "Centralidad poblacional", "variable": "ALD = sum(s_i * ln d_ic) con d en tiempo de viaje, por radio censal", "funcion_valor": "L↓(min; max nacional)", "peso": 0.20, "fuente": "Campante & Do 2014 doi:10.1257/aer.104.8.2456"},
      {"id": "K02", "nombre": "Accesibilidad desde las 24 capitales provinciales", "variable": "max_j tiempo de viaje (h) [y media ponderada]", "funcion_valor": "L↓(8; 30)", "peso": 0.15, "fuente": "Morten & Oliveira 2024 doi:10.1257/app.20180487; Roberts 2014 en Salim & Negara 2019"},
      {"id": "K03", "nombre": "Ciudad base existente", "variable": "poblacion del mayor aglomerado a <=30 km", "funcion_valor": "trap(50.000; 150.000; 800.000; 1.500.000)", "peso": 0.15, "fuente": "Casos Islamabad, Putrajaya, Canberra, La Plata; ECES 2026"},
      {"id": "K04", "nombre": "Integracion territorial y rezago", "variable": "indice: PBG pc relativo, NBI, vacio urbano, distancia al AMBA", "funcion_valor": "L↑(min; max nacional)", "peso": 0.15, "fuente": "Sejong (peso 0,36, Kyunghyang 2004); Sordoni 2021; Plan DHI p. 309"},
      {"id": "K05", "nombre": "Simbolismo y geopolitica", "variable": "distancia a costa atlantica o a capitales limitrofes", "funcion_valor": "solo escenario", "peso": 0.00, "fuente": "Sordoni 2021; Plan DHI p. 309"},
      {"id": "K06", "nombre": "Tierra fiscal", "variable": "ha fiscales contiguas a <=30 km", "funcion_valor": "L↑(0; 30.000)", "peso": 0.05, "fuente": "Salim & Negara 2019; Ley 23.512"},
      {"id": "F01,F03,F08-F10", "nombre": "Bloque fisico (agua, clima, riesgos)", "variable": "ver revision-bibliografica §4.2", "funcion_valor": "ver §4.2", "peso": 0.30, "fuente": "revision-bibliografica §7"}
    ],
    "costos": [
      {"concepto": "Brasilia costo acumulado 1956-1960", "valor": 12.3, "unidad": "% del PBI de 1959", "fuente": "[A] Poder360"},
      {"concepto": "Nusantara costo total", "valor": 34000000000, "unidad": "USD (19% publico)", "fuente": "Bappenas en Salim & Negara 2019"},
      {"concepto": "Nueva Capital Administrativa Egipto", "valor": 58000000000, "unidad": "USD (rango 45.000-58.000 M)", "fuente": "[A] prensa"},
      {"concepto": "Putrajaya costo por habitante real (2020)", "valor": 74000, "unidad": "USD/hab", "fuente": "[D] USD 8.100 M [A] / 109.202 (auditoria nacional)"},
      {"concepto": "Viedma (rango de prensa, sin estudio)", "valor": 2000000000, "unidad": "USD (rango 1.500-20.000 M)", "fuente": "[A] La Nacion 2026; Wikipedia"}
    ],
    "advertencias": ["Plazo de 15-46 anos (Abuja, Canberra, Dodoma); requiere continuidad politica", "Sin evidencia de que reduzca la primacia de la metropoli de origen", "Capitales aisladas se asocian a mas corrupcion (Campante & Do 2014)", "Multiplicador de empleo privado ~1,0-1,4 y muy localizado (Becker et al. 2021; Faggio et al. 2025)", "Viedma fracaso por razones politicas y fiscales, no de sitio", "K01 y K04 estan en conflicto: mostrar frontera de Pareto"]
  },
  "intermedias": {
    "unidad": "aglomerado o localidad INDEC de 50.000-500.000 hab",
    "restricciones": ["R03 sobre areas de expansion", "I-R1: holgura hidrica para la poblacion adicional (R13)", "I-R2: cobertura de agua de red >=50%"],
    "factores": [
      {"id": "I01", "nombre": "Dinamismo del empleo registrado", "variable": "crecimiento % del empleo SIPA en 10 anos", "funcion_valor": "L↑(p10; p90)", "peso": 0.25, "fuente": "Kline & Moretti 2014; ECES 2026"},
      {"id": "I02", "nombre": "Salario relativo", "variable": "salario medio del aglomerado / media nacional", "funcion_valor": "L↑(0,7; 1,3)", "peso": 0.10, "fuente": "Basso 2023 doi:10.55441/1668.7515.n30.35108; Kennan & Walker 2011 doi:10.3982/ECTA4657"},
      {"id": "I03", "nombre": "Asequibilidad de la vivienda", "variable": "precio o alquiler / salario", "funcion_valor": "L↓(p10; p90)", "peso": 0.10, "fuente": "Glaeser & Gottlieb 2008 doi:10.1353/eca.0.0005"},
      {"id": "I04", "nombre": "Margen de densificacion y suelo vacante", "variable": "ver revision-bibliografica §5", "funcion_valor": "L↑(90-rho; 0; 50)", "peso": 0.15, "fuente": "CIPPEC 2018"},
      {"id": "I05", "nombre": "Servicios de alta complejidad", "variable": "F14", "funcion_valor": "ver §4.2", "peso": 0.10, "fuente": "revision-bibliografica F14"},
      {"id": "I06", "nombre": "Accesibilidad nacional", "variable": "F06", "funcion_valor": "ver §4.2", "peso": 0.10, "fuente": "WDR 2009 doi:10.1596/978-0-8213-7607-2"},
      {"id": "I07", "nombre": "Capacidad institucional", "variable": "planes vigentes, catastro, recaudacion propia", "funcion_valor": "puntaje 0-1", "peso": 0.10, "fuente": "Karamaneff & Salvia 2019 (caso San Luis)"},
      {"id": "I08", "nombre": "Saldo migratorio reciente", "variable": "migrantes netos 2017-2022 / poblacion", "funcion_valor": "L↑(p10; p90)", "peso": 0.10, "fuente": "INDEC 2024, Censo 2022 (pregunta 17)"}
    ],
    "costos": [
      {"concepto": "Vivienda social terminada con servicios", "valor": 30000, "unidad": "USD/vivienda", "fuente": "[A] Bekerman (Rev. Univ. Mendoza), ano no informado"},
      {"concepto": "Vivienda minima PROCREAR 51 m2 sin terreno", "valor": 2621756, "unidad": "ARS de julio de 2020", "fuente": "[A] iProfesional 2020"},
      {"concepto": "Lote con servicios", "valor": 12000, "unidad": "USD/lote", "fuente": "Plan DHI p. 39-40"}
    ],
    "advertencias": ["Atraer poblacion requiere empleo y vivienda a la vez: el empleo solo no mueve poblacion (Busso et al. 2013)", "La movilidad interprovincial cae (20,9% en 2010 y 15,8% en 2022): medir metas contra la tendencia", "No existe elasticidad migracion-salario argentina creible: calibrar un modelo gravitacional con la matriz 2017-2022"]
  },
  "pueblos": {
    "unidad": "localidad INDEC <=2.000 hab (o 2.000-10.000) con area de influencia de 30 km",
    "restricciones": ["P-R1: ciudad >=50.000 hab a <=30 km o <=40 min (Plan DHI p. 39, 49)", "P-R2: agua con arsenico <=10 ug/L (F02)", "P-R3: fuera de planicie de inundacion de 100 anos (R03)"],
    "factores": [
      {"id": "P01", "nombre": "Conectividad digital", "variable": "velocidad media de banda ancha fija o movil (Mbps)", "funcion_valor": "L↑(1; 50)", "peso": 0.20, "fuente": "ENACOM; Plan DHI p. 50 (trabajo remoto)"},
      {"id": "P02", "nombre": "Viviendas deshabitadas recuperables", "variable": "viviendas deshabitadas / hogares", "funcion_valor": "L↑(0; 0,3)", "peso": 0.15, "fuente": "INDEC Censo 2022; casas a 1 euro [A]"},
      {"id": "P03", "nombre": "Escuela y centro de salud en la localidad", "variable": "presencia (0/1) de escuela primaria y secundaria y de un CAPS", "funcion_valor": "suma ponderada 0-1", "peso": 0.15, "fuente": "ECES 2026 (servicios condicionan la mudanza)"},
      {"id": "P04", "nombre": "Base productiva local", "variable": "empleo agro o agroindustrial en 30 km; zonas con >=50 unidades productivas a 1-5 km", "funcion_valor": "L↑(p10; p90)", "peso": 0.20, "fuente": "Plan DHI p. 44; SIPA"},
      {"id": "P05", "nombre": "Tiempo a ciudad de servicios", "variable": "minutos a localidad >=50.000 hab", "funcion_valor": "L↓(10; 40)", "peso": 0.15, "fuente": "Plan DHI p. 39"},
      {"id": "P06", "nombre": "Tendencia demografica", "variable": "variacion % 2010-2022", "funcion_valor": "trap(-40; -20; -5; +5), priorizando declive moderado", "peso": 0.15, "fuente": "[J]; contrafactico AGER (Espana)"}
    ],
    "costos": [
      {"concepto": "Lote con servicios", "valor": 12000, "unidad": "USD/lote", "fuente": "Plan DHI p. 39-40"},
      {"concepto": "Costo de programas de repoblamiento", "valor": null, "unidad": "sin dato", "fuente": "No encontrado en la revision"}
    ],
    "advertencias": ["Ningun programa con evaluacion causal (Espana, Japon, Italia, Argentina)", "Meta japonesa de equilibrar flujos hacia Tokio incumplida 11 anos seguidos", "Indicador recomendado: permanencia a 3-5 anos (Japon 57,5% en el mismo municipio)", "Cifras de Italia y de 'Bienvenidos a mi Pueblo' autodeclaradas", "'Pueblos que laten' no verificado como programa", "Con el radio de 30 km es suburbanizacion rural, no ocupacion del territorio vacio"]
  },
  "polos": {
    "unidad": "departamento o aglomerado con area de influencia de 50 km",
    "restricciones": ["G-R1: ciudad base >=100.000 hab (Parr 1999 doi:10.1080/0042098993187)", "G-R2: acceso a alta tension (F11) y a red troncal vial o ferroviaria"],
    "factores": [
      {"id": "E01", "nombre": "Acceso al mercado", "variable": "potencial de mercado sum(PBG_j / d_ij)", "funcion_valor": "L↑(min; max)", "peso": 0.20, "fuente": "Karamaneff & Salvia 2019 (ubicacion de San Luis); Morten & Oliveira 2024"},
      {"id": "E02", "nombre": "Base industrial existente", "variable": "empleo industrial SIPA y cociente de localizacion", "funcion_valor": "L↑(p10; p90)", "peso": 0.20, "fuente": "Kline & Moretti 2014 doi:10.1093/qje/qjt034"},
      {"id": "E03", "nombre": "Capital humano", "variable": "% de 25-64 anos con secundario completo; universidad a <=50 km", "funcion_valor": "L↑(p10; p90)", "peso": 0.15, "fuente": "Neumark & Simpson 2015 doi:10.1016/B978-0-444-59531-7.00018-1"},
      {"id": "E04", "nombre": "Logistica", "variable": "distancia a puerto, ferrocarril de carga o corredor bioceanico", "funcion_valor": "L↓(0; 300 km)", "peso": 0.15, "fuente": "Karamaneff & Salvia 2019"},
      {"id": "E05", "nombre": "Capacidad estatal provincial", "variable": "indice de capacidad institucional", "funcion_valor": "puntaje 0-1", "peso": 0.10, "fuente": "Karamaneff & Salvia 2019 (Ministerio de Industria de San Luis)"},
      {"id": "E06", "nombre": "Recurso especifico", "variable": "energia, mineria o agro en 50 km", "funcion_valor": "booleana o L↑", "peso": 0.10, "fuente": "Darwent 1969 doi:10.1068/a010005"},
      {"id": "E07", "nombre": "Rezago (equidad)", "variable": "NBI 2022", "funcion_valor": "L↑(p10; p90)", "peso": 0.10, "fuente": "Austin, Glaeser & Summers 2018 doi:10.1353/eca.2018.0002"}
    ],
    "costos": [
      {"concepto": "Promocion industrial LR-CAT-SL-SJ, costo fiscal por empleo creado (acumulado con intereses)", "valor": 461000, "unidad": "USD/empleo (1 ARS = 1 USD en 1999)", "fuente": "[A/O] Dagnino Pastore para CEM 1999, en La Nacion 29/8/1999; actor interesado"},
      {"concepto": "Regimen de Tierra del Fuego, costo fiscal anual del subregimen industrial", "valor": 1070000000, "unidad": "USD/ano (0,22% del PBI)", "fuente": "Fundar 2023 (Hallak et al.)"},
      {"concepto": "Tierra del Fuego, costo por empleo electronico por ano (cota superior)", "valor": 126000, "unidad": "USD/empleo/ano", "fuente": "[D] 1.070 M / 8.500 empleos (Fundar 2023)"},
      {"concepto": "Respuesta del empleo al subsidio (Regional Selective Assistance, UK)", "valor": 10, "unidad": "% de empleo manufacturero por +10 p.p. de subsidio maximo (solo pymes)", "fuente": "Criscuolo et al. 2019 doi:10.1257/aer.20160034"}
    ],
    "advertencias": ["El efecto nacional neto puede ser ~0 por relocalizacion (Kline & Moretti 2014; von Ehrlich & Seidel 2018)", "Las grandes firmas capturan subsidios sin aumentar su actividad (Criscuolo et al. 2019)", "Los beneficios se capitalizan en la renta del suelo", "Medir la permanencia despues del fin del beneficio: San Luis se sostuvo (Karamaneff & Salvia 2019)", "Polos sin base urbana o demasiados polos fallan (Darwent 1969; Parr 1999)"]
  }
}
```

---

## 7. Referencias

### 7.1 Con DOI verificado (Crossref u OpenAlex, octubre de 2026)

- Ades, A.F. & Glaeser, E.L. (1995). Trade and Circuses: Explaining Urban Giants. *QJE* 110(1):195–227. doi:10.2307/2118515
- Aroca, P. & Maloney, W.F. (2005). Migration, Trade, and Foreign Direct Investment in Mexico. *World Bank Economic Review* 19(3):449–472. doi:10.1093/wber/lhi017
- Austin, B., Glaeser, E. & Summers, L. (2018). Jobs for the Heartland: Place-Based Policies in 21st-Century America. *BPEA* 2018(1):151–255. doi:10.1353/eca.2018.0002
- Bai, Y. & Jia, R. (2023; en línea en 2021). The Economic Consequences of Political Hierarchy: Evidence from Regime Changes in China, 1000–2000 C.E. *Review of Economics and Statistics*. doi:10.1162/rest_a_01091. Crossref registra la versión en línea, pp. 1–45. El volumen y las páginas de la versión impresa **no se verificaron**.
- Basso, M. (2023). Análisis de las migraciones internas en Argentina en el período 2005-2010. *Astrolabio. Nueva Época* 30:112–143. doi:10.55441/1668.7515.n30.35108
- Becker, S.O., Egger, P.H. & von Ehrlich, M. (2010). Going NUTS: The effect of EU Structural Funds on regional performance. *JPubE* 94(9–10):578–590. doi:10.1016/j.jpubeco.2010.06.006. El DOI está verificado, pero el resumen no se leyó.
- Becker, S.O., Heblich, S. & Sturm, D.M. (2021). The impact of public employment: Evidence from Bonn. *JUE* 122:103291. doi:10.1016/j.jue.2020.103291
- Blanchard, O.J. & Katz, L.F. (1992). Regional Evolutions. *BPEA* 1992(1). doi:10.2307/2534556
- Bryan, G. & Morten, M. (2019). The Aggregate Productivity Effects of Internal Migration: Evidence from Indonesia. *JPE* 127(5):2229–2268. doi:10.1086/701810
- Busso, M., Gregory, J. & Kline, P. (2013). Assessing the Incidence and Efficiency of a Prominent Place Based Policy. *AER* 103(2):897–947. doi:10.1257/aer.103.2.897
- Campante, F.R. & Do, Q.-A. (2014). Isolated Capital Cities, Accountability, and Corruption: Evidence from US States. *AER* 104(8):2456–2481. doi:10.1257/aer.104.8.2456
- Campante, F.R., Do, Q.-A. & Guimaraes, B. (2019). Capital Cities, Conflict, and Misgovernance. *AEJ: Applied* 11(3):298–337. doi:10.1257/app.20170111
- Criscuolo, C., Martin, R., Overman, H.G. & Van Reenen, J. (2019). Some Causal Effects of an Industrial Policy. *AER* 109(1):48–85. doi:10.1257/aer.20160034
- Darwent, D.F. (1969). Growth Poles and Growth Centers in Regional Planning—A Review. *Environment and Planning A* 1(1):5–31. doi:10.1068/a010005
- Dascher, K. (2000). Are Politics and Geography Related? Evidence from a Cross-Section of Capital Cities. *Public Choice* 105(3–4):373–392. doi:10.1023/A:1005151611464. El DOI está verificado, pero el texto no se leyó.
- Faggio, G. (2019). Relocation of public sector workers: Evaluating a place-based policy. *JUE* 111:53–75. doi:10.1016/j.jue.2019.03.001. El DOI está verificado. El ratio 11:10 viene de la prensa y **no se verificó en el texto**.
- Faggio, G., Schlüter, T. & vom Berge, P. (2025). Interaction of public and private employment: Evidence from a German government move. *RSUE* 111:104084. doi:10.1016/j.regsciurbeco.2025.104084
- Forsyth, A. (2019). The British new towns: lessons for the world from the new-town experiment. *Town Planning Review* 90(3):239–246. doi:10.3828/tpr.2019.17
- Forsyth, A. & Peiser, R. (2021). Lessons from planned resettlement and new town experiences for avoiding climate sprawl. *Landscape and Urban Planning* 205:103957. doi:10.1016/j.landurbplan.2020.103957
- Glaeser, E.L. & Gottlieb, J.D. (2008). The Economics of Place-Making Policies. *BPEA* 2008(1):155–253. doi:10.1353/eca.0.0005
- Kennan, J. & Walker, J.R. (2011). The Effect of Expected Income on Individual Migration Decisions. *Econometrica* 79(1):211–251. doi:10.3982/ECTA4657
- Kline, P. & Moretti, E. (2014a). Local Economic Development, Agglomeration Economies, and the Big Push: 100 Years of Evidence from the Tennessee Valley Authority. *QJE* 129(1):275–331. doi:10.1093/qje/qjt034
- Kline, P. & Moretti, E. (2014b). People, Places, and Public Policy: Some Simple Welfare Economics of Local Economic Development Programs. *Annual Review of Economics* 6:629–662. doi:10.1146/annurev-economics-080213-041024
- Lu, Y., Wang, J. & Zhu, L. (2019). Place-Based Policies, Creation, and Agglomeration Economies: Evidence from China's Economic Zone Program. *AEJ: Policy* 11(3):325–360. doi:10.1257/pol.20160272
- Morten, M. & Oliveira, J. (2024). The Effects of Roads on Trade and Migration: Evidence from a Planned Capital City. *AEJ: Applied* 16(2):389–421. doi:10.1257/app.20180487
- Moser, S. (2015). New cities: Old wine in new bottles? *Dialogues in Human Geography* 5(1):31–35. doi:10.1177/2043820614565867
- Neumark, D. & Simpson, H. (2015). Place-Based Policies. En *Handbook of Regional and Urban Economics* 5:1197–1287. doi:10.1016/B978-0-444-59531-7.00018-1
- Parr, J.B. (1999). Growth-pole Strategies in Regional Economic Planning: A Retrospective View. Part 1. *Urban Studies* 36(7):1195–1215. doi:10.1080/0042098993187
- Peiser, R. & Forsyth, A. (eds.) (2021). *New Towns for the Twenty-First Century*. University of Pennsylvania Press. doi:10.9783/9780812297317. El DOI aparece en De Gruyter; **no se comprobó en Crossref**.
- Shepard, W. (2015). *Ghost Cities of China*. Zed/Bloomsbury. doi:10.5040/9781350220386
- von Ehrlich, M. & Seidel, T. (2018). The Persistent Effects of Place-Based Policy: Evidence from the West-German Zonenrandgebiet. *AEJ: Policy* 10(4):344–374. doi:10.1257/pol.20160395
- World Bank (2009). *World Development Report 2009: Reshaping Economic Geography*. doi:10.1596/978-0-8213-7607-2

### 7.2 Informes y documentos con URL (leídos)

- ECES (2 de agosto de 2026). *Economic Lens* n.º 20: «Egypt Built New Cities; Yet Population Remains Concentrated». https://eces.org.eg/wp-content/uploads/2026/07/ECONOMIC-LENS-Issue-20-En.pdf
- Fundar, Hallak, J.C. et al. (14/6/2023). *Documento 1 — Diagnóstico del Régimen de Tierra del Fuego*. https://fund.ar/publicacion/diagnostico-del-subregimen/
- INDEC (abril de 2024). *Censo 2022. Resultados definitivos. Migraciones internacionales e internas. Edición ampliada*. https://www.indec.gob.ar/ftp/cuadros/poblacion/censo2022_migraciones.pdf
- Karamaneff, L.E. & Salvia, A. (2019). ¿Se van o se quedan? El fin de la promoción industrial y sus efectos en los mercados de trabajo provinciales. Los casos de Catamarca, La Rioja, San Juan y San Luis (2005-2017). *Estado Abierto* 3, INAP. https://wadmin.uca.edu.ar/public/ckeditor/Observatorio%20Deuda%20Social/Documentos/2019/2019-Observatorio-Estado-Abierto-Vol%203-%20Salvia-Karamaneff.pdf
- Romer, P. (3/3/2010). *Technologies, Rules, and Progress: The Case for Charter Cities*. Center for Global Development. https://www.cgdev.org/publication/technologies-rules-and-progress-case-charter-cities
- Salim, W. & Negara, S.D. (2019). Shifting the capital from Jakarta: reasons and challenges. *ISEAS Perspective* 2019/79. Contiene los costos de Bappenas y los datos de Brasília y Canberra, este último citando a Roberts 2014. https://www.iseas.edu.sg/wp-content/uploads/2019/10/ISEAS_Perspective_2019_79.pdf
- Sordoni, F. (2021). La cuestión del traslado de la Capital Federal como problemática de Estado. *Estado Abierto* 5(2):91–118. https://publicaciones.inap.gob.ar/index.php/EA/article/view/269

### 7.3 Libros y documentos citados sin lectura del texto completo

- Boudeville, J.-R. (1966). *Problems of Regional Economic Planning*. Edinburgh UP. **[no verificado]**
- DCLG y Oxford Brookes University (2006). *Transferable Lessons from the New Towns*. Su existencia se confirmó por la evidencia escrita al Select Committee on Communities and Local Government (2008), https://publications.parliament.uk/pa/cm200708/cmselect/cmcomloc/889/889we03.htm. El texto no se leyó.
- Keeton, R. & Provoost, M. (eds.) (2019). *To Build a City in Africa: A History and a Manual*. nai010/INTI. Solo se leyeron las fichas editoriales y reseñas: 148 ciudades y 77 M de habitantes potenciales en 2030.
- Perroux, F. (1955). Note sur la notion de «pôle de croissance». *Économie Appliquée* 8. **[no verificado]**
- Rodwin, L. et al. (1969). *Planning Urban Growth and Regional Development: The Experience of the Guayana Program of Venezuela*. MIT Press. Solo se vio el registro de catálogo.

### 7.4 Fuentes secundarias y de prensa (nivel [A])

- *La Nación*: «La promoción industrial cuesta caro» (29/8/1999), https://www.lanacion.com.ar/economia/la-promocion-industrial-cuesta-caro-nid151362/; Wille, G., «Traslado de la Capital. Auge y caída…» (16/4/2026), https://www.lanacion.com.ar/lifestyle/traslado-de-la-capital-auge-y-caida-del-proyecto-mas-ambicioso-el-nombre-para-la-ciudad-la-nueva-nid16042026/
- *Infobae*: sobre Alfonsín y Viedma (16/4/2025), https://www.infobae.com/sociedad/2025/04/16/el-dolor-de-raul-alfonsin-por-su-sueno-frustrado-de-trasladar-la-capital-me-tendria-que-haber-mudado-aunque-sea-en-carpa-a-viedma/; sobre la derogación por el Digesto (31/8/2014), https://www.infobae.com/2014/08/31/1591453-la-presidente-quiere-trasladar-la-capital-pero-sus-legisladores-derogaron-una-ley-similar/
- Wikipedia: «Proyecto de distrito federal Viedma-Carmen de Patagones» (Decreto 1256/89, gastos del ENTECAP), https://es.wikipedia.org/wiki/Proyecto_de_distrito_federal_Viedma-Carmen_de_Patagones; artículos sobre Putrajaya, Naypyidaw, Belmopán, KAEC, Lavasa, Songdo, Kangbashi y Ciudad Guayana (cifras marcadas [A] en las tablas).
- *Tiempo Argentino* (12/11/2020). Diputados convirtió en ley el Gabinete Federal y las capitales alternas. https://www.tiempoar.com.ar/ta_article/diputados-convirtio-en-ley-el-gabinete-federal-y-las-capitales-alternas/
- *Poder360*: Construção de Brasília custou 12% do PIB. https://www.poder360.com.br/brasilia/construcao-de-brasilia-custou-12-do-pib-brasileiro/
- FCDA (Nigeria): The New Federal Capital. https://fcda.gov.ng/about/the-new-federal-capital
- Auditoría Nacional de Malasia: *Pembangunan Putrajaya*. https://lkan.audit.gov.my/documents/lkan/1531/2-2-RE-BI-Pembangunan-Putrajaya.pdf. Se leyó solo a través de un resumen de búsqueda.
- *Al Jazeera* (31/5/2025), sobre Sejong. https://www.aljazeera.com/news/2025/5/31/south-koreas-presidential-favourite-has-plans-for-new-de-facto-capital
- Antara y la Policía de Indonesia, sobre los funcionarios en Nusantara (2025–2026). https://en.antaranews.com/news/410905/indonesia-pushes-nusantara-legislative-judicial-projects-in-2026
- *The World* (25/7/2025), sobre Eko Atlantic. https://theworld.org/segments/2025/07/25/lagos-effort-to-build-a-coastal-city-failing-so-far
- ISVD (Japón), sobre la permanencia del Kyōryokutai, https://isvd.or.jp/en/columns/kyoryokutai-settlement-575; Kyodo vía ABS-CBN, sobre la meta de Tokio, https://news.abs-cbn.com/overseas/12/16/22/japan-aims-to-alleviate-overpopulation-in-tokyo-area
- EUobserver y *The Local*, sobre las casas a 1 euro. https://euobserver.com/199630/how-italys-one-euro-homes-are-helping-to-revive-rural-villages/
- *El Litoral* e iProfesional, sobre «Bienvenidos a mi Pueblo». https://www.ellitoral.com/regionales/lanzaron-programa-repoblar-localidades-general-lopez_0_fod6UgNOgi.html
- *La Nueva* (Bahía Blanca), serie «Pueblos que todavía laten» (2006–2007). https://www.lanueva.com/nota/2006-10-29-9-0-0-pueblos-que-todavia-laten
- *Chequeado* (17/1/2024), sobre las migraciones en el Censo 2022. https://chequeado.com/el-explicador/censo-2022-que-datos-se-informaron-sobre-las-migraciones/

---

## 8. Vacíos y próximos pasos

1. **Procesar la matriz de migración 2017–2022** (REDATAM, pregunta 17 del Censo 2022) por departamento para calibrar un modelo gravitacional. Es el insumo más valioso que falta.
2. **Cargar el empleo registrado por departamento** (SIPA/OEDE, CEP XXI) para los factores G01, I01 y E02.
3. **Evaluación propia con el método de control sintético** para San Luis y Tierra del Fuego frente a las provincias no promovidas, con censos de 1970 a 2022. Llenaría el principal vacío de evidencia causal argentina.
4. **Verificar en fuente primaria:**
   - el costo de Astana, Abuja y Sejong;
   - la meta de Belmopán;
   - el número de la ley de Capitales Alternas;
   - el ratio de Faggio (2019);
   - la revisión aragonesa sobre incentivos fiscales;
   - Navarro de Gimbatti & Méndez (2003).
5. **Confirmar qué es "Pueblos que laten"** con quien lo propuso.
6. **Calcular K01 (ALD) para todo el país** con radios censales. Con eso se puede mostrar la frontera entre centralidad y redistribución para las propuestas históricas: Rosario, Villa María, Río Cuarto, Viedma, Santiago del Estero y el Norte Grande.
