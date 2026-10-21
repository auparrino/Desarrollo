# Revisión bibliográfica: criterios y parámetros para la selección de sitios de nuevas ciudades y la evaluación de aptitud territorial para recibir población (foco Argentina)

Fecha de elaboración: 21 de octubre de 2026.

---

## 0. Resumen ejecutivo

1. **Método.** La práctica consolidada es el análisis multicriterio SIG (MCDA-SIG). Sigue esta secuencia: primero restricciones booleanas (exclusión), después factores estandarizados de 0 a 1 mediante funciones de valor, luego ponderación (AHP u otro método), agregación (combinación lineal ponderada, WLC, u OWA) y, al final, análisis de sensibilidad e incertidumbre de los pesos (Malczewski 2004, 2006a; Malczewski & Rinner 2015). La literatura metodológica coincide en que un mapa de aptitud sin análisis de sensibilidad de pesos no es defendible (Chen et al. 2010; Ligmann-Zielinska & Jankowski 2014; Feizizadeh & Blaschke 2014).
2. **Pocos umbrales están bien establecidos de forma universal:**
   - Falkenmark (1.700 / 1.000 / 500 m³/hab/año).
   - Guías de calidad de agua de la OMS: arsénico 10 µg/L, fluoruro 1,5 mg/L, nitrato 50 mg/L.
   - Categorías de estrés térmico UTCI: sin estrés entre 9 y 26 °C (Bröde et al. 2012).
   - Peligro sísmico expresado como PGA con 10 % de probabilidad de excedencia en 50 años (período de retorno de 475 años).
   - Planicie de inundación de 100 años como zona de exclusión habitual.
   - Las normas argentinas que prohíben de hecho urbanizar: Ley 26.331 de bosques nativos, categorías I y II, y Ley 26.639 de glaciares.
3. **Casi todo lo demás es juicio experto o depende del contexto:**
   - pendiente máxima urbanizable (15–30 % según la fuente);
   - altitud máxima;
   - tiempo de viaje óptimo a una ciudad existente;
   - pesos.

   Los pesos AHP **no son transferibles** entre estudios, porque dependen del rango de cada criterio en el área de estudio (Fischer 1995) y del método de elicitación (Borcherding et al. 1991; Pöyhönen & Hämäläinen 2001).
4. **Casos de nuevas capitales.** Los criterios que más se repiten son cinco: agua abundante y no contaminada, baja exposición a desastres, tierra disponible (idealmente fiscal), accesibilidad o cercanía a una ciudad existente sin quedar absorbida por ella, y un objetivo de equilibrio territorial. Los dos casos con más detalle documentado:
   - **Indonesia** (Nusantara): 7 criterios oficiales (Salim & Negara 2019).
   - **Corea** (Sejong, 2004): pesos explícitos. Equilibrio nacional 35,95; accesibilidad 24,01; ambiente 19,84; condiciones naturales 10,20; economía 10,00. También reglas de exclusión: al menos 1 h en auto desde Seúl, buffers de 5 km o 2 km alrededor de ciudades existentes y al menos 50 % de suelo urbanizable.
5. **Argentina.** Los conflictos estructurales entre criterios son cinco:
   - el mejor suelo agrícola (Pampa) coincide con climas templados, buena accesibilidad y bajo riesgo sísmico;
   - hay arsénico en acuíferos de la llanura chaco-pampeana;
   - el NOA y Cuyo tienen alta sismicidad y escasez hídrica;
   - el NEA combina calor e inundaciones;
   - en Patagonia el agua se concentra en valles alóctonos (Negro, Colorado, Chubut) y hay viento y alta demanda de calefacción.

   El proyecto Viedma–Carmen de Patagones (Ley 23.512, 1987) se justificó sobre todo por razones geopolíticas y de descentralización. Su localización se apoyó en el clima templado semiárido con influencia marítima, en el río Negro y en el carácter de bisagra entre la Pampa y la Patagonia (Sordoni 2021, citando a Roulet 1987). No hay evidencia publicada de un MCDA formal en ese proyecto.

---

## 1. Alcance y criterios de verificación

- Se citaron solo fuentes verificadas en esta revisión:
  - los DOI se comprobaron contra Crossref o resolvieron en doi.org;
  - las normas se leyeron en argentina.gob.ar;
  - los documentos técnicos se leyeron en el sitio del organismo emisor.
- Cuando un dato se obtuvo de una fuente secundaria se indica explícitamente.
- Cuando no se pudo verificar un valor que suele citarse, se lo marca como **[no verificado]**.
- Cada parámetro lleva una etiqueta de nivel de evidencia:
  - **[E]**: evidencia empírica o consenso científico amplio.
  - **[N]**: norma o estándar oficial (OMS, ley, reglamento).
  - **[C]**: valor usado en un caso de estudio concreto, que no es generalizable.
  - **[J]**: juicio experto (propuesta de esta revisión, a calibrar).
  - **[D]**: derivación aritmética a partir de otros parámetros.
- Limitación importante: la muestra de estudios AHP de aptitud urbana con pesos publicados y verificados aquí es pequeña (5 estudios con tablas completas más el caso Sejong). Por eso los "rangos de pesos" son indicativos y no un metaanálisis.

---

## 2. Marco metodológico

### 2.1 Flujo de trabajo recomendado

1. **Definir el objetivo y la escala.** Hay dos escalas posibles:
   - *Cribado nacional*: celdas de aproximadamente 1 km, coherente con los mapas de accesibilidad globales (Weiss et al. 2018; Nelson et al. 2019).
   - *Evaluación regional o de sitio*: 30–90 m, con DEM de 30 m y mapas de inundación de unos 90 m.
2. **Aplicar las restricciones** como máscaras booleanas (0/1). Los textos clásicos separan "constraints" de "factors": Eastman et al. 1998, Malczewski 2004 y, antes, el overlay de McHarg y la comparación de métodos de Hopkins (1977). Collins et al. (2001) reseñan la historia del análisis de aptitud en EE. UU.
3. **Estandarizar los factores** a [0,1] con funciones de valor: lineal, trapezoidal (fuzzy), sigmoidal, gaussiana o por umbrales. La función debe justificarse por sí misma. Por ejemplo, la pendiente tiene un óptimo plano-suave y no una relación lineal.
4. **Ponderar.** Ver §2.2.
5. **Agregar.** WLC, de tipo compensatorio, u OWA, que controla el grado de compensación y la actitud frente al riesgo (Yager 1988; Jiang & Eastman 2000; Malczewski 2006b; Boroushaki & Malczewski 2008).
6. **Analizar sensibilidad e incertidumbre.** Puede ser OAT, Monte Carlo o Sobol (Chen et al. 2010; Ligmann-Zielinska & Jankowski 2014; Feizizadeh & Blaschke 2014; Saltelli et al. 2008).
7. **Validar y verificar la robustez.** Hay tres caminos: comparar con ubicaciones históricas exitosas o fallidas, comparar con un modelo de pesos iguales y revisar con actores. Arfiansyah et al. (2024) compararon un modelo de pesos iguales con uno AHP para Nusantara.

### 2.2 Ponderación: opciones y recomendaciones

| Método | Descripción | Ventajas | Riesgos | Referencias |
|---|---|---|---|---|
| AHP (Saaty) | Comparaciones pareadas en escala 1–9; los pesos salen del autovector principal. Se acepta si la razón de consistencia CR = CI/RI es menor que 0,10 | Estructura jerárquica y trazabilidad | Inversión de rangos (rank reversal), sesgo por número de subcriterios y escala 1–9 arbitraria | Saaty 1977, 1990; Belton & Gear 1983; Ishizaka & Labib 2011 |
| Pesos iguales (unit weights) | w_i = 1/n | Robusto ante el error de juicio; en predicción suele rendir casi como los pesos "óptimos" | Ignora las diferencias reales de importancia | Dawes & Corrigan 1974; Einhorn & Hogarth 1975 |
| Pesos por rango (ROC, rank-sum) | Solo requiere ordenar los criterios | Elicitación sencilla y buena calidad decisional | Pierde la información de intensidad | Barron & Barrett 1996 |
| Swing / trade-off | Se ponderan los rangos efectivos de cada criterio | Teóricamente correcto en teoría del valor multiatributo | Requiere expertos entrenados | Borcherding et al. 1991; Fischer 1995 |
| Entropía y métodos objetivos | Pesos según la dispersión de los datos | Sin sesgo humano | La importancia "estadística" no equivale a importancia normativa | p. ej. Liu et al. 2021 (entropía mejorada) |
| Aprendizaje automático | Pesos inferidos de patrones de urbanización observados | Basado en datos | Reproduce la urbanización pasada, que no siempre es deseable | Zhao et al. 2024 |

**Recomendación de esta revisión [J]:**
- Usar AHP (o swing) con un panel multidisciplinario para obtener pesos centrales.
- Exigir CR < 0,10 por matriz (Saaty 1990).
- Agregar los juicios individuales con media geométrica.
- Correr **siempre** dos alternativas en paralelo: un escenario de pesos iguales y una simulación Monte Carlo de pesos (§2.4).
- Reportar como resultado la **probabilidad de que cada celda o sitio quede en el decil superior** y no un único mapa.

Índices aleatorios RI de Saaty para la CR (n = 3…9): 0,58; 0,90; 1,12; 1,24; 1,32; 1,41; 1,45 (Saaty 1980, 1990). [N/E]

### 2.3 Agregación

- **WLC (suma ponderada):** S = Σ w_i·x_i × Π c_j, donde c_j son las restricciones. Es totalmente compensatoria: un valor muy bajo en agua puede compensarse con accesibilidad alta. Para criterios vitales (agua, riesgo) esta compensación es indeseable. Por eso se recomienda convertirlos en restricciones o en umbrales mínimos [J].
- **OWA:** incorpora "pesos de orden" que regulan el grado de ORness, desde AND (pesimista, sin compensación) hasta OR (optimista). Malczewski (2006b) lo aplicó a la aptitud de uso del suelo con cuantificadores difusos. Se recomienda presentar escenarios con ORness de 0,3, 0,5 (equivale a WLC) y 0,7 [J].
- **Agregación jerárquica:** primero se agrega dentro de cada grupo (agua, riesgos, clima, accesibilidad) y después entre grupos. Reduce el sesgo por número de subcriterios: un grupo con más subcriterios tiende a acumular más peso si se pondera "plano" [E: Pöyhönen & Hämäläinen 2001 discuten sesgos ligados a la estructura del árbol].

### 2.4 Sensibilidad e incertidumbre de pesos

- **OAT (uno a la vez):** se varía cada peso en ±x % y se renormaliza el resto (Chen et al. 2010). Es barato pero ignora las interacciones.
- **Monte Carlo y Sobol:** se muestrean vectores de pesos (por ejemplo, Dirichlet centrada en los pesos AHP o uniforme en rangos) y se descompone la varianza del resultado por criterio. Ligmann-Zielinska & Jankowski (2014) mostraron que la influencia de un peso en el mapa final depende de la configuración espacial de los criterios y no solo de su magnitud. Feizizadeh & Blaschke (2014) aplicaron el enfoque a MCDA-SIG. Saltelli et al. (2008) son la referencia general.
- **Propuesta operativa [J]:**
  - N = 10.000 vectores con Dirichlet α = κ·w̄, con κ ≈ 50, que da aproximadamente ±25 % relativo en pesos de 0,10.
  - Alternativamente, uniforme en los "rangos de la literatura" de la tabla JSON, renormalizados.
  - Reportar: (i) la frecuencia con que cada celda queda en el top 10 %; (ii) los índices de Sobol de primer orden y total por criterio; (iii) la estabilidad del ranking de los sitios candidatos (por ejemplo, tau de Kendall frente al escenario central).

### 2.5 Advertencias metodológicas

1. **Sesgo de pesos.**
   - Los pesos cambian con el método de elicitación (Borcherding et al. 1991; Pöyhönen & Hämäläinen 2001).
   - Los pesos deben reflejar el **rango** de variación de cada criterio en el área. Si el área es climáticamente homogénea, el clima "pesa" poco aunque sea importante en abstracto. Este es el problema de *range sensitivity* (Fischer 1995).
   - Consecuencia práctica: **no copiar pesos** de otro estudio. Los pesos de la tabla JSON son puntos de partida para la elicitación.
2. **Doble conteo y correlación.** Altitud, temperatura y HDD están correlacionados, igual que pendiente y susceptibilidad a deslizamientos, o accesibilidad y densidad poblacional. Conviene revisar las correlaciones (por ejemplo, |r| > 0,7) y fusionar o eliminar criterios [J].
3. **Inversión de rangos en AHP.** Agregar o quitar alternativas puede invertir el orden (Belton & Gear 1983). En AHP raster con criterios estandarizados a escalas fijas, el riesgo es menor, pero existe si se normaliza por el mínimo y el máximo del área de estudio.
4. **Normalización min-max dependiente del área.** Si los factores se escalan por el mínimo y el máximo locales, el resultado cambia al cambiar el recorte del área de estudio. Se recomiendan funciones de valor con umbrales absolutos y justificados [J].
5. **MAUP y escala.** Los resultados dependen de la forma y el tamaño de las unidades de agregación (Openshaw 1984; Fotheringham & Wong 1991). Medidas:
   - usar grillas regulares o hexagonales;
   - repetir el análisis a dos resoluciones (por ejemplo, 1 km y 250 m);
   - no mezclar datos censales por radio o departamento con raster sin documentar la desagregación.
6. **Resolución heterogénea de las fuentes.** Por ejemplo, el atlas de suelos INTA 1:500.000 frente a un DEM de 30 m. La resolución efectiva del resultado es la de la capa más gruesa que tenga peso relevante.
7. **Compensación inapropiada.** Ver §2.3.
8. **Usos indebidos del MCDA.** Steele et al. (2009) señalan, entre otros, la falta de transparencia en la elección de criterios, la ausencia de análisis de sensibilidad y el uso del MCDA para legitimar decisiones ya tomadas. Esto es pertinente en traslados de capitales: Salim & Negara (2019) critican que el único estudio de factibilidad de la capital indonesia fuera de Bappenas y no se publicara.
9. **Validación.** Los mapas de aptitud casi nunca se validan. Opciones: retro-validar con ciudades fundadas en el siglo XX (por ejemplo, ciudades planificadas o polos de crecimiento) o con la expansión urbana observada. Esta segunda opción solo vale para "aptitud de expansión", no para "aptitud normativa".

---

## 3. Lecciones de casos de nuevas ciudades y capitales

| Caso | Año | Criterios documentados | Método | Fuente verificada | Observaciones |
|---|---|---|---|---|---|
| Brasília (Brasil) | Comisión Cruls 1892–93; Informe Belcher 1954–55 | Cruls relevó topografía, clima, hidrografía, geología, fauna, flora y recursos minerales del Planalto. El equipo de Belcher (Cornell) se apoyó en la interpretación de fotografía aérea y definió 5 sitios en un área de unos 52.000 km²; se eligió el "Sítio Castanho" | Fotointerpretación y comparación de 5 sitios; una subcomisión fijó los criterios de comparación | Freitas 2025 (resumen AHA); Atlas do DF (IPE-DF) | Los criterios específicos y los pesos del Informe Belcher no se verificaron en fuente primaria. Fuentes secundarias mencionan topografía, suelos, lluvias y vientos [no verificado en primaria] |
| Sejong (Corea del Sur) | 2004 | Tres criterios de cribado: (1) finalidad: equilibrio nacional y dispersión desde el área metropolitana de Seúl, al menos 1 h en auto desde Seúl; (2) urbanizabilidad: unos 23 millones de pyeong (≈76 km²) para unos 500.000 habitantes, con al menos 50 % de suelo urbanizable; (3) necesidad de conservación. **Exclusiones:** 5 km desde el borde urbanizado de ciudades de 300.000 habitantes o más; 2 km para ciudades menores; entornos de bases militares. **Evaluación final** de 4 candidatos con 5 criterios y 20 subcriterios: efecto de equilibrio nacional **35,95**, accesibilidad **24,01**, ambiente **19,84**, condiciones naturales **10,20**, economía **10,00** | Panel de expertos con puntaje ponderado | Kyunghyang Shinmun, 15/06/2004, "행정수도 선정기준은?" (khan.co.kr/article/200406151826561) | Es la evidencia con pesos explícitos más clara entre los casos de capitales. Fuente periodística que reproduce la información oficial del Comité |
| Nusantara/IKN (Indonesia) | 2019 | (1) centralidad geográfica en el archipiélago; (2) tierra disponible de propiedad estatal; (3) lejos de zonas de desastre; (4) agua abundante y no contaminada; (5) cerca de una ciudad existente; (6) bajo riesgo de conflicto social; (7) seguridad y defensa | Estudio técnico de Bappenas, no publicado | Salim & Negara 2019 (ISEAS Perspective 2019/79) | Críticas: área con mucho pantano o turbera; "seguridad" frente a desastres percibida, no demostrada; estudio no público. Arfiansyah et al. (2024) hacen un MCDA residencial ex post (pesos iguales frente a AHP) |
| Astana (Kazajistán) | 1994–97 | Fuentes secundarias mencionan 32 criterios (socioeconómicos, clima, relieve, sismicidad, ambiente, infraestructura y transporte, comunicaciones, base constructiva, mano de obra). Motivos oficiales: sismicidad de Almaty y cercanía a la frontera china; motivos políticos señalados por la prensa | Comisión presidencial | Solo secundarias (enciclopedia, prensa: CSM 1999, RFE/RL 1997) | **[no verificado en primaria]**. Útil como lista de chequeo, no como evidencia |
| Amaravati (India) | 2014 | Términos de referencia del Comité Sivaramakrishnan: mínima relocalización de población, vulnerabilidad a desastres, mínima afectación de los sistemas agrícolas. El comité advirtió que Krishna, Guntur y West Godavari tienen de las mejores tierras agrícolas del país | Informe del comité; el Estado decidió en otro sentido | Fuentes secundarias (prensa y análisis) | Muestra el conflicto entre suelo agrícola de alto valor y capital nueva; un informe de consultoría (2015) reporta 81 % del área como agrícola |
| Smart Cities Mission (India) | 2015 | **No** es selección de sitio. Es un concurso entre ciudades existentes con puntaje de etapa 1 (servicios existentes 25, capacidad institucional 15, autofinanciamiento 30, desempeño previo 30) | Concurso (city challenge) | Secundarias (prensa) | Útil solo como analogía para la "aptitud de ciudades existentes para recibir inversión o población", centrada en la capacidad institucional |
| New Minia City (Egipto) | 2005 | AHP con criterios geotécnicos: karst 0,4243; densidad de fracturas 0,2548; distancia a fallas 0,1399; distancia a cauces 0,1175; suelo 0,0412; pendiente 0,0223 (CR = 0,08); tierra agrícola excluida como restricción booleana | AHP + WLC | Aly, Giardino & Klein 2005 | Muestra que en desierto con karst dominan las restricciones geotécnicas. Pendiente por clases: menos de 5 % es lo mejor, más de 20 % es lo peor |
| Xiong'an (China) | 2017– | Capacidad de carga hídrica como criterio central (cantidad, calidad, cuenca y caudal); se estimó una población sostenible de unos 2,65 millones en el escenario óptimo | Dinámica de sistemas y evaluación de capacidad de carga | Secundarias (resúmenes en DOAJ: Water 2019; Ecol. Indicators 2023) | Ilustra la capacidad de carga hídrica como restricción de tamaño |
| Viedma–Carmen de Patagones–Guardia Mitre (Argentina) | 1986–87 | Objetivos: descentralizar poder demográfico, económico y político; orientar el país hacia la Patagonia, el Atlántico Sur, Malvinas y la Antártida. Se eligió el valle inferior del río Negro por su ubicación geográfica y su clima "semiseco moderado con influencia del mar", tierras fértiles por el río y su carácter de bisagra entre la pampa seca y la meseta patagónica | Estudios de factibilidad no públicos; Ley 23.512 (1987) y ENTECAP (Decreto 1156/87) | Sordoni 2021 (*Estado Abierto*, INAP), que cita a Roulet 1987; texto de la Ley 23.512 en argentina.gob.ar | La vigencia de la ley es discutida (fuentes contradictorias sobre su derogación por el Digesto Jurídico de 2014). No se halló un MCDA publicado |
| Madrid (España) | 1561 | Análisis retrospectivo de red de transporte: ventaja logística de la centralidad sobre la falta de puerto | Reconstrucción de la red vial del siglo XVI y análisis de redes | Pablo-Martí et al. 2022 | Respalda la accesibilidad o centralidad como criterio de capitalidad |

**Síntesis [C/J].** Los criterios que más se repiten en los casos son siete:
- agua (cantidad y calidad);
- exposición a desastres;
- suelo disponible y urbanizable con superficie mínima contigua;
- accesibilidad;
- distancia "justa" a ciudades existentes: cerca para aprovechar infraestructura (Indonesia) pero fuera de su área de absorción (Sejong: al menos 1 h de Seúl y buffers de 2–5 km);
- conservación ambiental;
- un objetivo político de equilibrio territorial, que en Sejong fue el criterio de mayor peso.

---

## 4. Fichas de criterios

Formato de cada ficha: (a) variable; (b) umbral excluyente; (c) función de valor; (d) pesos en la literatura; (e) datos y resolución; (f) referencias; más el nivel de evidencia.

### 4.1 Restricciones duras (máscaras de exclusión)

#### R01. Áreas protegidas, bosques nativos protegidos y glaciares
- (a) Pertenencia a un área protegida (WDPA / SIFAP / Parques Nacionales), a bosque nativo OTBN de categoría I (rojo) o II (amarillo), a glaciares o ambiente periglacial, o a un sitio Ramsar.
- (b) Exclusión total:
  - **Ley 26.331, art. 14:** "No podrán autorizarse desmontes de bosques nativos clasificados en las Categorías I (rojo) y II (amarillo)". Según el art. 9, la categoría I son sectores de muy alto valor de conservación "que no deben transformarse". [N]
  - **Ley 26.639, art. 6 b):** prohíbe en glaciares "la construcción de obras de arquitectura o infraestructura", salvo las necesarias para investigación científica y prevención de riesgos. [N]
  - Buffer alrededor de áreas protegidas: 1 km como valor base, con sensibilidad de 0–5 km. [J]
- (c) No aplica (máscara binaria). Opcionalmente puede agregarse un factor de "distancia a área protegida" que penalice la cercanía por presión antrópica. [J]
- (d) En la literatura aparece casi siempre como restricción y no como factor ponderado (Aly et al. 2005 usan una restricción booleana para la tierra agrícola; Ulloa-Espindola & Martín-Fernández 2024 penalizan los bosques por puntaje).
- (e) Fuentes:
  - WDPA (UNEP-WCMC/IUCN, protectedplanet.net), vectorial, actualización mensual;
  - capas OTBN provinciales (Ley 26.331);
  - Inventario Nacional de Glaciares (IANIGLA-CONICET);
  - SIFAP y Administración de Parques Nacionales.
- (f) Ley 26.331 y Ley 26.639 (textos en argentina.gob.ar).

#### R02. Cuerpos de agua permanentes y humedales
- (a) Ocurrencia de agua superficial.
- (b) Exclusión si la ocurrencia es igual o mayor al 50 % en el período 1984–2021 (JRC Global Surface Water), más un buffer de 100 m. [J]
- (e) JRC Global Surface Water (Pekel et al. 2016), 30 m. Para humedales: inventarios provinciales y sitios Ramsar.
- (f) Pekel et al. 2016, *Nature*, doi:10.1038/nature20584.

#### R03. Planicie de inundación de 100 años
- (a) Profundidad de inundación (m) para el período de retorno T = 100 años.
- (b) Exclusión si la profundidad para T=100 es mayor que 0. El período de 100 años (1 % de probabilidad anual) es el umbral de zonificación más difundido en la práctica de gestión de riesgo. [N/E] Escenario conservador: excluir también la profundidad mayor a 0,5 m para T=500. [J]
- (c) Fuera de la máscara aplica el factor F09.
- (e) Fuentes:
  - JRC Global River Flood Hazard Maps v2.1: unos 90 m; 7 períodos de retorno de 10 a 500 años; modelos LISFLOOD y LISFLOOD-FP (Baugh et al. 2024, dataset JRC);
  - en Argentina, mapas provinciales y de cuenca.

  El Manual para elaboración de mapas de riesgo (2017) de la Secretaría de Planificación Territorial y el documento PNUD/SSPTIP (2010) usan explícitamente inundaciones de recurrencia de 100 años.
- (f) Dottori et al. 2016 (marco metodológico global); Baugh et al. 2024 (dataset); PNUD-SSPTIP 2010.
- **Advertencia:** los modelos globales subestiman las inundaciones pluviales y de llanura. En la Pampa deprimida (cuenca del Salado) son críticas las inundaciones por anegamiento y por ascenso freático. Conviene complementar con el índice HAND o con la profundidad freática, además de los registros históricos. [J]

#### R04. Pendiente máxima urbanizable
- (a) Pendiente (%) derivada de un DEM de 30 m.
- (b) Exclusión con pendiente mayor a 25 % (escenario base), con sensibilidad de 15 % a 30 %. [J] Los umbrales normativos varían según la fuente:
  - la guía de escorrentía citando el New York State Stormwater Design Manual recomienda evitar desarrollos en pendientes de 15 % o más y no considerar desarrollo por encima de 25 %;
  - Chester County (Pensilvania) distingue "moderately steep" (15–25 %) de "very steep" (más de 25 %);
  - la Baseline Hillside Ordinance de Los Ángeles reduce el FAR por bandas de 0–15, 15–30 y 30–45 %.

  Ninguna de estas fuentes es una norma universal. [N local / J]
- (c) Ver F07.
- (e) Fuentes:
  - MDE-Ar v2.1 del IGN: 30 m, a partir de SRTM y ALOS PRISM, precisión vertical de unos 2 m;
  - Copernicus DEM GLO-30;
  - FABDEM, 30 m, sin bosques ni edificios (Hawker et al. 2022).
- (f) Chester County Planning Commission (eTool Steep Slopes); STC Planning 2025, *Water Runs Downhill*; LA City Planning, Baseline Hillside Ordinance.

#### R05. Suelo agrícola de alto valor
- (a) Clase de capacidad de uso (I–VIII) según el sistema USDA de Klingebiel & Montgomery (1961), usado por INTA en las cartas de suelos; o el índice de productividad (IP) del INTA.
- (b) Exclusión de las clases I y II (escenario base) y también de la III (escenario de "protección fuerte"). [J] El caso de New Minia excluye toda la tierra agrícola (Aly et al. 2005) [C], y el Comité Sivaramakrishnan advirtió contra urbanizar las mejores tierras agrícolas [C].

  Justificación empírica: la expansión urbana se concentra en tierras de cultivo más productivas que el promedio, y en Asia y África buena parte de la tierra que se perderá tiene más del doble de productividad que la media nacional (Bren d'Amour et al. 2017). [E]
- (c) Ver F13.
- (e) Fuentes:
  - Atlas de Suelos de la República Argentina, INTA, 1:500.000 / 1:1.000.000 (versión digital de 1995);
  - cartas de suelos 1:50.000 de Buenos Aires (INTA, en Zenodo);
  - SisINTA (perfiles);
  - de forma complementaria, SoilGrids 2.0 a 250 m (Poggio et al. 2021) y FAO GAEZ v4 (FAO & IIASA 2021).
- (f) Klingebiel & Montgomery 1961 (USDA Agric. Handbook 210); Bren d'Amour et al. 2017, *PNAS* 114(34):8939-8944, doi:10.1073/pnas.1606036114.

#### R06. Sismicidad muy alta
- (a) Aceleración máxima del terreno (PGA) en roca, con 10 % de probabilidad de excedencia en 50 años (T ≈ 475 años), o zona sísmica INPRES.
- (b) Restricción "blanda": PGA de 0,35 g o más (zona 4 INPRES, sur de San Juan y norte de Mendoza según la difusión del INPRES). [J] No se excluye por norma, porque se puede construir con diseño sismorresistente. Pero para una ciudad **nueva**, que puede elegir su sitio, es razonable evitar la zona de máxima peligrosidad.

  El Reglamento INPRES-CIRSOC 103 divide el país en 5 zonas (0 a 4) según la aceleración de diseño "as" [N]. Fuentes periodísticas que citan al INPRES dan 0,35 g para la zona 4 y 0,25 g para la zona 3. Los valores de 0,04 / 0,10 / 0,18 g para las zonas 0 / 1 / 2, habituales en la bibliografía técnica, **no se verificaron en el texto primario** en esta revisión. El INPRES publicó un nuevo mapa de peligrosidad (2022) que, según la prensa, aún no se ha incorporado al reglamento.
- (c) Ver F08.
- (e) Fuentes:
  - GEM Global Seismic Hazard Map v2023.1: PGA 475 años en roca, Vs30 de 760–800 m/s; raster bajo licencia CC BY-NC-SA 4.0; doi:10.5281/zenodo.8409647;
  - Pagani et al. 2020 (modelo GEM 2018);
  - GSHAP (Giardini et al. 1999) como referencia histórica;
  - mapa de zonificación del INPRES.
- (f) Johnson et al. 2023 (GEM); Pagani et al. 2020; Giardini et al. 1999; INPRES-CIRSOC 103 (Comentarios a la Parte I).

#### R07. Fallas activas
- (a) Distancia a una falla cuaternaria activa (m).
- (b) Exclusión a menos de 500 m. [J] Aly et al. (2005) asignan la máxima aptitud a más de 500 m de las fallas principales. [C] El Reglamento INPRES-CIRSOC 103 prohíbe grandes irregularidades estructurales en construcciones próximas a fallas activas. [N, cualitativo]
- (e) Fuentes: mapas neotectónicos de SEGEMAR; base de fallas cuaternarias de GEM (GEM Global Active Faults).
- (f) Aly et al. 2005; INPRES-CIRSOC 103 Comentarios.

#### R08. Peligro volcánico
- (a) Pertenencia a zonas de peligro alto de mapas de peligrosidad volcánica, o distancia a un volcán activo de riesgo alto.
- (b) Exclusión en zonas de flujos piroclásticos, lahares y coladas de los mapas de SEGEMAR. Si no hay mapa, radio de 30 km a volcanes de las categorías de mayor riesgo del ranking SEGEMAR. [J]
- (e) Ranking de riesgo relativo de SEGEMAR: 38 volcanes activos o potencialmente activos; método basado en NVEWS (Ewert et al. 2005); actualizado por Elissondo & Farías en 2023, con 5 categorías y 15 parámetros (dato tomado de fuente secundaria: NHESS preprint 2023-225). Mapas de peligrosidad por volcán, por ejemplo Copahue (repositorio SEGEMAR). Smithsonian Global Volcanism Program.
- (f) Elissondo et al. 2016 y Elissondo & Farías 2023 (citados vía fuentes secundarias, **no verificados en primaria**).

#### R09. Altitud
- (a) Altitud (m s.n.m.).
- (b) Exclusión por encima de 2.500 m. [J basado en E] La incidencia del mal agudo de montaña aumenta con la altitud: un estudio en Summit County (Colorado), citado por Hackett & Roach (2001), halló 22 % de casos entre 1.850 y 2.750 m y 42 % a 3.000 m (según un extracto del artículo). Otro estudio halló 9 % a 2.850 m y 53 % a 4.559 m. Además, en Argentina la altitud se correlaciona con el frío (HDD) y con la sismicidad andina.
- (c) Factor opcional: 1 por debajo de 1.500 m, con caída lineal hasta 0 a 2.500 m. [J] Atención al doble conteo con F04.
- (e) MDE-Ar 30 m (IGN); Copernicus DEM.
- (f) Hackett & Roach 2001, *NEJM* 345:107-114, doi:10.1056/NEJM200107123450206.

#### R10. Costa baja (zona costera de baja elevación)
- (a) Elevación (m) dentro de una franja costera.
- (b) Exclusión por debajo de 5 m de elevación en zonas costeras o estuariales, con ascenso del nivel del mar y marejadas como fundamento. [J] McGranahan et al. (2007) definen la zona costera de baja elevación (LECZ) como la franja contigua a la costa por debajo de 10 m. [E, definición]
- (c) Dentro de la LECZ, factor lineal: 0 a 5 m y 1 a 10 m. [J]
- (e) FABDEM o Copernicus DEM (30 m); línea de costa de IGN u OSM.
- (f) McGranahan, Balk & Anderson 2007, *Environment and Urbanization* 19(1), doi:10.1177/0956247807076960.

#### R11. Buffer de ciudades existentes (solo para "ciudad nueva")
- (a) Distancia al borde urbanizado de ciudades existentes.
- (b) Exclusión a menos de 5 km de ciudades de 300.000 habitantes o más y a menos de 2 km de ciudades menores. [C: regla de Sejong 2004] Garantiza que la "nueva ciudad" no sea un barrio de expansión.
- (e) GHSL: GHS-BUILT y GHS-SMOD, grado de urbanización, de 10 a 1.000 m (Pesaresi et al. 2024; Dijkstra et al. 2021); localidades INDEC (BAHRA).
- (f) Kyunghyang Shinmun 2004; Dijkstra et al. 2021; Pesaresi et al. 2024.

#### R12. Estrés térmico extremo (temperatura de bulbo húmedo)
- (a) Percentil 99,9 horario de la temperatura de bulbo húmedo Tw (°C), 1991–2020.
- (b) Exclusión si Tw p99,9 es igual o mayor a 31 °C. [J apoyado en E]
  - Sherwood & Huber (2010) proponen Tw = 35 °C como límite fisiológico de adaptabilidad.
  - Vecellio et al. (2022) hallaron experimentalmente que el umbral crítico en jóvenes sanos es menor, del orden de 31 °C en condiciones húmedas.
  - En Argentina este umbral rara vez se alcanza, aunque el NEA y el Chaco se acercan en eventos extremos. La restricción funciona más como verificación que como filtro.
- (e) ERA5 horario a 0,25° (Hersbach et al. 2020) o ERA5-Land a unos 9 km (Muñoz-Sabater et al. 2021).
- (f) Sherwood & Huber 2010, *PNAS*, doi:10.1073/pnas.0913352107; Vecellio et al. 2022, *J Appl Physiol*, doi:10.1152/japplphysiol.00738.2021.

#### R13. Suficiencia hídrica para la población objetivo
- (a) Relación entre la oferta confiable y la demanda proyectada.
  - La oferta confiable puede ser el caudal Q95 del río o la recarga explotable del acuífero dentro de un radio razonable, por ejemplo 50 km. [J]
  - La demanda es D = P × q, con q en L/hab/día.
- (b) Exclusión si la oferta confiable es menor que 1,5 × D. [D/J]
  - Ejemplo: para P = 500.000 habitantes y q = 200 L/hab/día, D = 100.000 m³/día ≈ 1,16 m³/s, así que se necesitan al menos ≈ 1,7 m³/s confiables.
  - El valor de q es una elección de diseño. La OMS (Howard & Bartram 2003) describe niveles de servicio con unos 20 L/hab/día (fuente comunitaria), unos 50 (en el lote) y más de 100 (dentro de la vivienda, "acceso óptimo"), con un mínimo de supervivencia de 7,5 L/hab/día. El valor de 200 L/hab/día incluye usos urbanos no domésticos y pérdidas. [J]
- (e) BDHI, Base de Datos Hidrológica Integrada de la Subsecretaría de Recursos Hídricos (caudales diarios y mensuales por estación); INA; WRI Aqueduct 4.0; TerraClimate para escorrentía (Abatzoglou et al. 2018).
- (f) Howard & Bartram 2003 (OMS; 2.ª ed. 2020, ISBN 9789240015241); Kuzma et al. 2023.

#### R14. Superficie contigua mínima urbanizable
- (a) Área del parche contiguo que no queda excluido por R01–R13.
- (b) Exclusión si el área es menor que A_req = P / ρ_bruta. [D]
  - Con ρ_bruta de 60–90 hab/ha y P = 500.000 habitantes, se requieren entre 56 y 83 km².
  - Sejong reservó unos 76 km² para 500.000 habitantes (≈ 66 hab/ha brutos) y exigió al menos 50 % de suelo urbanizable en el área candidata [C].
  - Libertun de Duren & Guerrero Compeán (2016) hallan el mínimo de costo per cápita de los servicios municipales (agua, saneamiento, residuos) alrededor de 9.000 hab/km² (90 hab/ha) en unos 8.600 municipios de Brasil, Chile, Ecuador y México [E].
  - UN-Habitat (2014) propone al menos 15.000 hab/km² (150 hab/ha) a escala de **barrio** [N, guía].
- (f) Libertun de Duren & Guerrero Compeán 2016, *Urban Studies* 53(14):3082-3107, doi:10.1177/0042098015601579; UN-Habitat 2014; Kyunghyang Shinmun 2004.

### 4.2 Factores (funciones de valor de 0 a 1)

Notación de las funciones:
- **Lineal creciente** L↑(x; a, b) = 0 si x ≤ a; (x−a)/(b−a) si a < x < b; 1 si x ≥ b.
- **Lineal decreciente** L↓(x; a, b) = 1 − L↑(x; a, b).
- **Trapezoidal** T(x; a, b, c, d) = 0 fuera de [a, d]; sube linealmente entre a y b; vale 1 entre b y c; baja linealmente entre c y d.

#### F01. Disponibilidad hídrica regional
- (a) Agua renovable per cápita de la cuenca, incluida la población nueva: (escorrentía + recarga renovable) / (población actual + población nueva), en m³/hab/año. Complemento: estrés hídrico de base de Aqueduct (BWS = extracciones / disponibilidad).
- (b) Restricción: ver R13. En la cuenca, valores menores a 500 m³/hab/año equivalen a "escasez absoluta". [E]
- (c) Por umbrales de Falkenmark, interpolando linealmente: 0 por debajo de 500; 0,33 a 1.000; 1 a partir de 1.700 m³/hab/año. Alternativa con Aqueduct: L↓(BWS; 0,10; 0,80), donde 1 corresponde a estrés bajo y 0 a "extremadamente alto". [E + J]
  - Las categorías de Aqueduct usadas habitualmente son: bajo menos de 10 %, bajo-medio 10–20 %, medio-alto 20–40 %, alto 40–80 %, extremadamente alto más de 80 %. Estos cortes **no se verificaron** en el texto de la nota técnica de 2023.
- (d) Liu et al. 2021: agua per cápita 0,042 (peso global). Dong et al. 2008: precipitación 0,081 y densidad de ríos 0,041. Indonesia y Xiong'an la tratan como criterio central o restricción. Rango observado: **0,04–0,14**.
- (e) Aqueduct 4.0 (subcuencas Pfafstetter nivel 6, vectorial); TerraClimate (unos 4 km); BDHI; INA.
- (f) Falkenmark, Lundqvist & Widstrand 1989, *Natural Resources Forum* 13(4):258-267, doi:10.1111/j.1477-8947.1989.tb00348.x; Kuzma et al. 2023, doi:10.46830/writn.23.00061.
- **Advertencia [E]:** los umbrales de Falkenmark se adoptaron sin base empírica sólida y solo consideran el agua "azul" (Damkjaer & Taylor 2017, doi:10.1007/s13280-017-0912-z). Se usan como convención, no como ley física.

#### F02. Calidad del agua: arsénico (y fluoruro)
- (a) Concentración de As (µg/L) en el acuífero o la fuente de abastecimiento; F⁻ (mg/L).
- (b) Valor guía de la OMS para As: 10 µg/L (provisional, por factibilidad analítica y de tratamiento). Código Alimentario Argentino, art. 982: 0,01 mg/L, aunque desde la Resolución Conjunta 34/2019 la autoridad sanitaria puede aceptar hasta 0,05 mg/L en regiones con suelos de alto arsénico. OMS para F⁻: 1,5 mg/L. OMS para nitrato: 50 mg/L. [N]
- (c) L↓(As; 10; 50). Un valor de 0 no excluye si hay fuente superficial alternativa. Si hay tratamiento, se puede modelar como costo. [J]
- (d) Rara vez aparece en estudios de aptitud urbana; no se encontraron pesos publicados.
- (e) Hay datos de pozos dispersos: SEGEMAR, autoridades provinciales del agua, estudios publicados. Bundschuh et al. (2012) y Smedley et al. (2002) documentan altas concentraciones en la llanura chaco-pampeana (por ejemplo, La Pampa).
- (f) WHO, *Guidelines for Drinking-water Quality*, 4.ª ed. con 1.ª y 2.ª adendas (2022); Bundschuh et al. 2012, *Sci Total Environ*, doi:10.1016/j.scitotenv.2011.06.024; Smedley et al. 2002, *Appl Geochem*, doi:10.1016/S0883-2927(01)00082-8; CAA art. 982 (RC 34/2019).

#### F03. Confort térmico exterior (UTCI)
- (a) Fracción de horas anuales (1991–2020) con UTCI en la categoría "sin estrés térmico" (9 a 26 °C). Se complementa con la fracción de horas con estrés por calor fuerte o mayor (UTCI > 32 °C) y por frío moderado o mayor (UTCI < −13 °C).
- (b) No hay umbral excluyente establecido. Para el extremo húmedo-cálido, ver R12.
- (c) x = %horas_confort − 2·%horas_calor_fuerte − 1·%horas_frío_moderado, transformado con L↑(x; x_p5; x_p95) sobre la distribución nacional. Es una función ad hoc [J]. Las categorías sí están establecidas [E]:

  | Categoría UTCI | Rango |
  |---|---|
  | Estrés extremo por frío | < −40 °C |
  | Estrés muy fuerte por frío | −40 a −27 °C |
  | Estrés fuerte por frío | −27 a −13 °C |
  | Estrés moderado por frío | −13 a 0 °C |
  | Estrés leve por frío | 0 a 9 °C |
  | Sin estrés térmico | 9 a 26 °C |
  | Estrés moderado por calor | 26 a 32 °C |
  | Estrés fuerte por calor | 32 a 38 °C |
  | Estrés muy fuerte por calor | 38 a 46 °C |
  | Estrés extremo por calor | > 46 °C |

  El viento patagónico entra en el UTCI, y es una ventaja del UTCI sobre la temperatura del aire.
- (d) Rara vez se pondera de forma explícita en la aptitud urbana intrarregional. Dong et al. 2008 dan a la temperatura acumulada 0,011 (global). En capitales, el clima aparece como criterio cualitativo (Brasília, Viedma). Rango observado: **0,01–0,10** (muestra escasa).
- (e) ERA5-HEAT (UTCI horario a 0,25°, Di Napoli et al. 2021); ERA5-Land para reescalar; SMN (normales 1991–2020).
- (f) Bröde et al. 2012, *Int J Biometeorol* 56:481-494, doi:10.1007/s00484-011-0454-1; Błażejczyk et al. 2012, doi:10.1007/s00484-011-0453-2; Jendritzky et al. 2012, doi:10.1007/s00484-011-0513-7; Di Napoli et al. 2021, *Geosci Data J*, doi:10.1002/gdj3.102.

#### F04. Demanda energética climática (grados-día)
- (a) HDD18 (grados-día de calefacción base 18 °C) y CDD (grados-día de refrigeración; base 18 °C o, según ASHRAE, CDD10 para zonificación), en °C·día/año.
- (b) Sin umbral excluyente.
- (c) L↓(HDD18 + k·CDD18; 500; 3.500), con k ≈ 1,5 para reflejar la menor eficiencia relativa de la refrigeración. Es una función ad hoc [J]. Rango aproximado en Argentina: desde HDD18 bajos en el NEA hasta valores altos en Tierra del Fuego, según la zonificación IRAM 11603. Los valores exactos no se verificaron en esta revisión.
- (d) No se hallaron pesos publicados en aptitud urbana.
- (e) IRAM 11603, Clasificación bioambiental de la República Argentina: GD18 y zonas I a VI con subzonas; el ENARGAS la usa como base de la Ley 27.637 de Zonas Frías. También ERA5-Land y SMN.
- (f) IRAM 11603 (vía ENARGAS y SEDICI-UNLP); ASHRAE 169 (zonas por HDD18 y CDD10).
- Nota: F03 y F04 están correlacionados. En la agregación jerárquica deben pertenecer al mismo grupo "clima", con peso de grupo único.

#### F05. Accesibilidad a una ciudad de 50.000 habitantes o más
- (a) Tiempo de viaje (min) a la ciudad más cercana de 50.000 habitantes o más. Capa 6 de Nelson et al. (2019), "50.000–100.000", o el mínimo de las capas 1 a 6.
- (b) Sin umbral excluyente. La regla de Sejong (R11) cubre la cercanía excesiva.
- (c) **Para ciudad nueva:** T(t; 10; 30; 90; 240) min. Es decir, 0 a 10 min o menos (absorción), 1 entre 30 y 90 min, y 0 a 240 min o más. Para **aptitud de ciudades existentes para recibir población**, usar L↓(t; 30; 180). [J, inspirado en Sejong (al menos 1 h de la metrópoli) e Indonesia ("cerca de una ciudad existente")]
- (d) Pesos de accesibilidad observados: Sejong 0,24; Dong et al. 2008 (ferrocarril + rutas) 0,20; Liu et al. 2021 (densidad de tráfico + rutas troncales) 0,12; Ulloa-Espindola 2024 (rutas + servicios) 0,12. Rango observado: **0,04–0,24**.
- (e) Weiss et al. 2018 (unos 1 km, 2015); Nelson et al. 2019 (9 umbrales de tamaño de 5.000 a 50 millones, 30″, incluye puertos; doi:10.6084/m9.figshare.7638134.v3). Para Argentina conviene recalcular con la red vial de OSM y de Vialidad Nacional y con localidades INDEC 2022.
- (f) Weiss et al. 2018, *Nature* 553:333-336, doi:10.1038/nature25181; Nelson et al. 2019, *Sci Data* 6:266, doi:10.1038/s41597-019-0265-5.

#### F06. Conectividad de transporte de escala nacional
- (a) Tiempo a la red vial troncal, a una estación ferroviaria de cargas o pasajeros, a un puerto y a un aeropuerto con vuelos regulares.
- (c) L↓(t_red; 5; 60) min para la red troncal. Para puerto y aeropuerto, L↓(t; 60; 240). Se promedian. [J]
- (d) Dentro del rango de F05. Si se usan ambos, repartir el peso del grupo "accesibilidad".
- (e) Capa de puertos de Nelson et al. 2019; OSM; IGN (red vial y ferroviaria).
- (f) Nelson et al. 2019; Pablo-Martí et al. 2022 (centralidad logística en la elección de una capital).

#### F07. Pendiente (factor)
- (a) Pendiente (%).
- (b) Ver R04.
- (c) Trapezoidal asimétrica: f = 0,8 en 0 %, 1 entre 1 y 5 %, y caída lineal hasta 0 a 25 %. El valor de 0,8 en terreno muy plano refleja dificultades de drenaje, pertinentes en la llanura pampeana. [J] Clases de referencia en la literatura [C]:
  - Dong et al. 2008: menos de 5° óptimo, 5–15° medio, más de 15° bajo.
  - Aly et al. 2005: menos de 5 % óptimo, 5–10, 10–15, 15–20, más de 20 % peor.
- (d) Pesos globales observados: 0,007 (Dong 2008), 0,022 (Aly 2005), 0,051 (Liu 2021, relieve) y 0,06 (Ulloa-Espindola 2024). Rango observado: **0,007–0,06**. Es bajo porque en estos estudios las pendientes fuertes ya suelen estar excluidas. Si no hay restricción, se usa más peso.
- (e) MDE-Ar 30 m; FABDEM.
- (f) Dong et al. 2008, doi:10.3390/s8095975; Aly et al. 2005, *Environ Eng Geosci* XI(3):259-269.

#### F08. Peligro sísmico (factor)
- (a) PGA 475 años (g).
- (c) L↓(PGA; 0,10; 0,35). [J]
- (d) En la muestra, los riesgos geológicos agregados pesan 0,07 (Liu 2021: riesgo geológico + vulnerabilidad), 0,14 (Aly 2005: distancia a fallas) y 0,10 (Sejong: "condiciones naturales", que incluye otros aspectos). Rango del subcriterio sísmico: **0,04–0,14**.
- (e) GEM v2023.1; INPRES.
- (f) Ver R06.

#### F09. Peligro de inundación residual
- (a) Profundidad para T=500 años fuera de la planicie de 100 años, o altura sobre el drenaje más cercano (HAND).
- (c) L↓(profundidad_T500; 0; 1 m), o L↑(HAND; 1; 10 m). [J]
- (d) Rango observado (subcriterio de riesgos hidrológicos): **0,03–0,12**. Liu 2021 da vulnerabilidad a amenazas 0,032; Aly 2005 da distancia a cauces 0,1175.
- (e) JRC v2.1; FABDEM para el cálculo de HAND.
- (f) Dottori et al. 2016; Baugh et al. 2024.

#### F10. Susceptibilidad a deslizamientos
- (a) Clase de susceptibilidad: de muy baja a muy alta.
- (c) Por umbrales: muy baja 1; baja 0,8; moderada 0,4; alta 0,1; muy alta 0 (o restricción). [J] Ulloa-Espindola 2024 usan una escala análoga.
- (d) Ulloa-Espindola 2024: 0,246 (global) en un valle andino. En llanura el peso es casi nulo. Rango: **0,0–0,25**, muy dependiente del contexto.
- (e) Mapa global de susceptibilidad de NASA (Stanley & Kirschbaum 2017), unos 1 km; SEGEMAR (cartas de peligrosidad).
- (f) Stanley & Kirschbaum 2017, *Nat Hazards*, doi:10.1007/s11069-017-2757-y.

#### F11. Acceso a la red eléctrica de alta tensión
- (a) Distancia (km) a líneas de 132 kV o más, o a estaciones transformadoras.
- (c) L↓(d; 10; 100) km. [J]
- (d) No se hallaron pesos publicados en aptitud urbana. Es un criterio estándar en la selección de sitios industriales y energéticos (Oakleaf et al. 2019, para potencial de desarrollo sectorial).
- (e) Arderne et al. 2020 (red global predicha, unos 1 km, más OSM); Secretaría de Energía y CAMMESA (SIG de líneas).
- (f) Arderne et al. 2020, *Sci Data*, doi:10.1038/s41597-019-0347-4; Oakleaf et al. 2019, doi:10.1038/s41597-019-0084-8.

#### F12. Recurso energético renovable local
- (a) Irradiación global horizontal (GHI, kWh/m²/día) y/o densidad de potencia eólica a 100 m.
- (c) L↑(GHI; 3,5; 6,0). Para el viento, L↑(WPD; 200; 600 W/m²) en terrenos aptos. Se toma el máximo de los dos. [J]
- (e) Global Solar Atlas 2.0 (Solargis/ESMAP; GHI a 9″, unos 250 m; PVOUT a 30″); Global Wind Atlas (Davis et al. 2023; unos 250 m).
- (f) ESMAP/Solargis 2019 (GSA 2.0 Technical Report); Davis et al. 2023, *BAMS*, doi:10.1175/BAMS-D-21-0075.1.

#### F13. Costo de oportunidad agrícola (factor residual)
- (a) Clase de capacidad de uso III a VIII, o índice de productividad INTA.
- (c) L↑(clase; III; VI). Es decir, 0 en la clase III, 1 en la clase VI o superior. Las clases VII y VIII también valen 1 para este criterio, aunque suelen coincidir con pendiente o suelos someros que penalizan otros factores. [J]
- (d) Dong et al. 2008 dan al uso del suelo 0,248, pero con signo **favorable** a la tierra cultivada y asentada (los autores puntúan alto la tierra cultivada). Esto muestra que la dirección de la función también es una decisión normativa.
- (e) INTA; SoilGrids; GAEZ v4.
- (f) Klingebiel & Montgomery 1961; Bren d'Amour et al. 2017.

#### F14. Acceso a servicios de salud de alta complejidad y educación superior
- (a) Tiempo de viaje a un hospital de alta complejidad o a una universidad nacional.
- (c) L↓(t; 30; 180) min. [J]
- (e) Weiss et al. 2020 (tiempo a establecimientos de salud, unos 1 km); REFES (Ministerio de Salud), SIU y SPU (universidades).
- (f) Weiss et al. 2020, *Nat Med*, doi:10.1038/s41591-020-1059-1.

#### F15. Contribución al equilibrio territorial (criterio político)
- (a) Indicador del efecto redistributivo. Opciones: distancia al AMBA; inverso de la participación regional en la población o el PBG; índice de "vacío" del sistema urbano, es decir, la distancia a la ciudad de 100.000 habitantes o más más cercana.
- (c) Normalización lineal sobre el rango nacional. La dirección depende del objetivo de política [J].
- (d) Sejong: **0,36**, el criterio de mayor peso. Indonesia: centralidad geográfica y desarrollo regional, 1 de 7 criterios. Viedma: objetivo principal (Sordoni 2021). Rango: **0,0–0,36**.
- (e) INDEC (Censo 2022); CEPAL; PET (sistema urbano).
- (f) Kyunghyang Shinmun 2004; Salim & Negara 2019; Sordoni 2021.

---

## 5. Aptitud de ciudades existentes para recibir población (redistribución)

Para redistribuir población hacia ciudades existentes, que es la alternativa a una ciudad nueva, cambia la unidad de análisis: el aglomerado o el departamento, en lugar de la celda. Además se agregan criterios de **capacidad de absorción**:

| Indicador | Variable y fuente | Función o umbral | Evidencia |
|---|---|---|---|
| Margen de densificación | Densidad bruta actual frente a la de costo mínimo. CIPPEC (2018): la densidad media de los 32 grandes aglomerados sin AMBA era de 39 hab/ha en 2016 y cayó 6,1 % en una década. El AMBA tiene 52,5 hab/ha y Gran Córdoba 36,3 hab/ha | L↑(90 − ρ; 0; 50): más margen, mayor aptitud para absorber sin expansión | [E] Libertun de Duren & Guerrero Compeán 2016; [C] Lanfranchi et al. 2018 (CIPPEC) |
| Expansión frente a crecimiento poblacional | Cociente entre la tasa de expansión del área urbana y la tasa demográfica (CIPPEC: las ciudades con más de 1,5x pasaron de 6 en 2006–2010 a 20 en 2010–2016) | Penalizar las ciudades con más de 1,5x, que es un patrón difuso | [C] CIPPEC 2018 |
| Suelo vacante urbanizable | Hectáreas vacantes dentro del perímetro servido (catastro, GHSL) | L↑(ha_vacante / ha_requerida; 0; 1) | [J]; véase "Herramientas de la Planificación Territorial: Desarrollo de Áreas Vacantes" (Secretaría de Planificación Territorial) |
| Cobertura de redes | % de hogares con agua de red y cloacas (INDEC, Censo 2022) | L↑(%; 50; 95) | [J] |
| Holgura hídrica | Capacidad de planta frente a demanda pico más incremento (R13 aplicado a la ciudad) | Igual que R13 | [D] |
| Mercado laboral | Tasa de empleo o demanda de trabajo (EPH-INDEC, solo 31 aglomerados) | Normalización z | [J] |
| Riesgos | R03 y R06 aplicados a las áreas de expansión | Igual que en §4 | [N/E] |
| Accesibilidad | F05 y F14 | Igual que en §4 | [E/J] |
| Capacidad institucional | Planes vigentes, catastro actualizado, recaudación propia (analogía con la etapa 1 de Smart Cities: 30 puntos de autofinanciamiento, 15 de capacidad institucional) | Puntaje ad hoc | [C] |

Marco de planificación argentino:
- **PET.** Avance I (2008), "1816-2016 Argentina del Bicentenario"; Avance II (2011), con los volúmenes "Argentina Urbana" y "Territorio e Infraestructura" (este último con la actualización del modelo territorial deseado); Avance III (2015); Avance 2018 y "Argentina Urbana. PET Avance 2018". Según un trabajo de SIIU 2020, el Avance 2018 incorpora los ODS, el Marco de Sendai y la Nueva Agenda Urbana.
- **Argentina Urbana 2011.** Constata que el estrato de ciudades de 50.000 a 500.000 habitantes fue el de mayor crecimiento en las últimas décadas (según fuentes secundarias). Esto respalda la estrategia de **ciudades intermedias** como receptoras.
- **Documentos operativos.** *El riesgo de desastres en la planificación del territorio* (PNUD/SSPTIP 2010) y el *Manual para elaboración de mapas de riesgo* (2017).

No se pudo acceder al texto completo de los PET 2016/2018 (enlaces caídos o bloqueados durante la revisión). Se citan solo por título y listado oficial.

---

## 6. Consideraciones específicas para Argentina

1. **Pampa húmeda.**
   - A favor: clima templado (zonas bioambientales II–III de IRAM), baja sismicidad (zona 0 en gran parte), alta accesibilidad.
   - En contra: el suelo de clases I–III, sujeto a la restricción R05 y al factor F13, y el arsénico en el acuífero pampeano (F02).
   - Riesgos: anegamiento y ascenso freático en la cuenca del Salado (R03, con la advertencia de que los modelos globales lo subestiman).
   - El modelo excluirá gran parte de la región si se aplica R05 en su versión fuerte. Se recomienda mostrar el escenario con y sin la clase III.
2. **NEA y Litoral.**
   - Riesgos: inundaciones fluviales del Paraná, Paraguay y Uruguay (PNUD/SSPTIP 2010 documenta crecidas de recurrencia de unos 100–130 años en 1983 y 1992) y calor húmedo (F03, R12).
   - Restricciones: bosques del OTBN (R01).
3. **NOA y Cuyo.**
   - Riesgos: sismicidad de zonas 3–4 (R06, F08) y deslizamientos (F10).
   - Agua: escasez hídrica y oasis de riego de alto valor agrícola (R05).
   - Restricciones: altitud (R09) en la Puna y glaciares (R01).
4. **Patagonia.**
   - Agua: concentrada en ríos alóctonos (Negro, Colorado, Chubut, Santa Cruz). La restricción R13 fija la ciudad nueva a los valles.
   - Clima: viento y frío, con HDD altos (F03, F04).
   - Riesgos: volcanismo en la cordillera (R08).
   - A favor: gran recurso eólico (F12) y abundante tierra fiscal, a semejanza del criterio indonesio de tierra estatal.
   - El caso Viedma muestra que la elección del valle inferior del río Negro responde casi exactamente a este patrón: agua, clima templado-marítimo y bisagra Pampa–Patagonia.
5. **Datos argentinos clave:**

   | Dato | Fuente | Resolución o formato |
   |---|---|---|
   | Relieve | MDE-Ar (IGN) | 30 m |
   | Suelos | INTA | 1:500.000 nacional; 1:50.000 Buenos Aires |
   | Población | INDEC, Censo 2022 | Radio censal |
   | Caudales | BDHI | Por estación |
   | Sismicidad | INPRES | Zonificación por zonas |
   | Volcanes | SEGEMAR | Ranking y mapas por volcán |
   | Bosques nativos | OTBN provinciales | Vectorial |
   | Glaciares | IANIGLA | Inventario |
   | Clima | SMN | Normales |

   La heterogeneidad de escalas obliga a documentar la resolución efectiva del resultado (§2.5).

---

## 7. Propuesta de pesos base para Argentina (punto de partida para la elicitación, no valores definitivos)

Agregación jerárquica: grupo, luego criterio. Pesos globales [J]:

| Grupo | Peso del grupo | Criterios (peso global) |
|---|---|---|
| Agua | 0,20 | F01 0,14; F02 0,06 |
| Accesibilidad y servicios | 0,22 | F05 0,12; F06 0,06; F14 0,04 |
| Riesgos | 0,18 | F08 0,08; F09 0,07; F10 0,03 |
| Clima | 0,13 | F03 0,08; F04 0,05 |
| Equilibrio territorial | 0,08 | F15 0,08 |
| Energía | 0,08 | F11 0,05; F12 0,03 |
| Topografía | 0,06 | F07 0,06 |
| Agro (costo de oportunidad) | 0,05 | F13 0,05 |
| **Total** | **1,00** | |

Escenarios obligatorios:
- **E0**: pesos iguales por grupo (1/8 cada uno).
- **E1**: pesos base.
- **E2**: "Sejong" (equilibrio territorial 0,36; accesibilidad 0,24; resto proporcional).
- **E3**: "ambiental-hídrico" (agua 0,30; riesgos 0,25).
- **Monte Carlo**: Dirichlet con κ = 50 alrededor de E1.
- **OWA** con ORness 0,3 / 0,5 / 0,7.
- **R05** en versión base (clases I–II) y fuerte (clases I–III).

---

## 8. Tabla JSON de criterios

Ver el bloque al final de este documento. Es la misma tabla entregada en el informe.

```json
[
 {"id":"R01","nombre":"Áreas protegidas, bosques nativos OTBN I-II, glaciares, Ramsar","variable":"pertenencia a área protegida/OTBN I-II/glaciar/periglacial (+buffer)","unidad":"binaria; buffer m","tipo":"restriccion","umbral_excluyente":"dentro del polígono o a <1000 m (sensibilidad 0-5000 m)","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"dentro o d<1000 m"}},"peso_sugerido":null,"rango_pesos_literatura":"restricción (no ponderado)","fuente_datos":"WDPA (vectorial, mensual); OTBN provinciales; Inventario Nacional de Glaciares IANIGLA; SIFAP/APN","referencias":["Ley 26.331 arts. 9 y 14","Ley 26.639 art. 6","Aly et al. 2005 (restricción booleana)"]},
 {"id":"R02","nombre":"Cuerpos de agua y humedales","variable":"ocurrencia de agua superficial 1984-2021","unidad":"%","tipo":"restriccion","umbral_excluyente":">=50% ocurrencia + buffer 100 m","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"ocurrencia>=50 o d<100 m"}},"peso_sugerido":null,"rango_pesos_literatura":"restricción","fuente_datos":"JRC Global Surface Water 30 m; inventarios de humedales; Ramsar","referencias":["Pekel et al. 2016 doi:10.1038/nature20584"]},
 {"id":"R03","nombre":"Planicie de inundación T=100 años","variable":"profundidad de inundación T100","unidad":"m","tipo":"restriccion","umbral_excluyente":">0 m en T100 (conservador: >0,5 m en T500)","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"depth_T100>0"}},"peso_sugerido":null,"rango_pesos_literatura":"restricción","fuente_datos":"JRC Global River Flood Hazard Maps v2.1 (~90 m, T10-T500); mapas provinciales","referencias":["Dottori et al. 2016 doi:10.1016/j.advwatres.2016.05.002","Baugh et al. 2024 (JRC dataset)","PNUD-SSPTIP 2010"]},
 {"id":"R04","nombre":"Pendiente máxima urbanizable","variable":"pendiente","unidad":"%","tipo":"restriccion","umbral_excluyente":">25% (sensibilidad 15-30%)","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"slope>25"}},"peso_sugerido":null,"rango_pesos_literatura":"restricción; umbrales normativos locales 15/25/30%","fuente_datos":"MDE-Ar IGN 30 m; FABDEM 30 m; Copernicus GLO-30","referencias":["Chester County Planning Commission (Steep Slopes)","STC Planning 2025 citando NYS Stormwater Manual","LA Baseline Hillside Ordinance","Hawker et al. 2022 doi:10.1088/1748-9326/ac4d4f"]},
 {"id":"R05","nombre":"Suelo agrícola de alto valor","variable":"clase de capacidad de uso (I-VIII)","unidad":"clase","tipo":"restriccion","umbral_excluyente":"clases I-II (escenario fuerte: I-III)","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"clase<=II"}},"peso_sugerido":null,"rango_pesos_literatura":"restricción (Aly 2005); conflicto documentado en Amaravati","fuente_datos":"INTA Atlas de Suelos 1:500.000; cartas 1:50.000 BA; SoilGrids 250 m; GAEZ v4","referencias":["Klingebiel & Montgomery 1961 USDA AH-210","Bren d'Amour et al. 2017 doi:10.1073/pnas.1606036114"]},
 {"id":"R06","nombre":"Sismicidad muy alta","variable":"PGA 10%/50 años (T475) en roca","unidad":"g","tipo":"restriccion","umbral_excluyente":">=0,35 g (zona 4 INPRES) — restricción blanda","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"PGA>=0.35"}},"peso_sugerido":null,"rango_pesos_literatura":"no excluyente por norma; juicio experto","fuente_datos":"GEM GSHM v2023.1 (raster global, CC BY-NC-SA); zonificación INPRES","referencias":["Johnson et al. 2023 doi:10.5281/zenodo.8409647","Pagani et al. 2020 doi:10.1177/8755293020931866","INPRES-CIRSOC 103"]},
 {"id":"R07","nombre":"Fallas activas","variable":"distancia a falla cuaternaria activa","unidad":"m","tipo":"restriccion","umbral_excluyente":"<500 m","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"d<500"}},"peso_sugerido":null,"rango_pesos_literatura":"como factor: 0,14 (Aly 2005)","fuente_datos":"SEGEMAR neotectónica; GEM Global Active Faults","referencias":["Aly et al. 2005 Environ Eng Geosci XI(3):259-269"]},
 {"id":"R08","nombre":"Peligro volcánico","variable":"zona de peligro alto o distancia a volcán de riesgo alto","unidad":"km","tipo":"restriccion","umbral_excluyente":"zona de peligro alto; sin mapa: <30 km","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"zona_alta o d<30 km"}},"peso_sugerido":null,"rango_pesos_literatura":"juicio experto","fuente_datos":"SEGEMAR (ranking 38 volcanes; mapas por volcán); Smithsonian GVP","referencias":["Elissondo et al. 2016; Elissondo & Farías 2023 (vía fuentes secundarias, no verificado en primaria)"]},
 {"id":"R09","nombre":"Altitud","variable":"altitud","unidad":"m s.n.m.","tipo":"restriccion","umbral_excluyente":">2500 m","funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"a":1500,"b":2500}},"peso_sugerido":null,"rango_pesos_literatura":"como factor: 0,025-0,026 (Dong 2008; Liu 2021)","fuente_datos":"MDE-Ar 30 m; Copernicus DEM","referencias":["Hackett & Roach 2001 doi:10.1056/NEJM200107123450206"]},
 {"id":"R10","nombre":"Costa baja (LECZ)","variable":"elevación en franja costera","unidad":"m","tipo":"restriccion","umbral_excluyente":"<5 m (factor lineal 5-10 m)","funcion_valor":{"tipo":"lineal","parametros":{"creciente":true,"a":5,"b":10}},"peso_sugerido":null,"rango_pesos_literatura":"juicio experto","fuente_datos":"FABDEM/Copernicus 30 m; línea de costa IGN/OSM","referencias":["McGranahan et al. 2007 doi:10.1177/0956247807076960"]},
 {"id":"R11","nombre":"Buffer de ciudades existentes (ciudad nueva)","variable":"distancia al borde urbanizado","unidad":"km","tipo":"restriccion","umbral_excluyente":"<5 km si ciudad >=300.000 hab; <2 km si menor","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"d<5 (>=300k) o d<2 (<300k)"}},"peso_sugerido":null,"rango_pesos_literatura":"regla del caso Sejong 2004","fuente_datos":"GHSL GHS-BUILT/SMOD (10-1000 m); localidades INDEC","referencias":["Kyunghyang Shinmun 15/06/2004","Dijkstra et al. 2021 doi:10.1016/j.jue.2020.103312","Pesaresi et al. 2024 doi:10.1080/17538947.2024.2390454"]},
 {"id":"R12","nombre":"Estrés térmico extremo","variable":"temperatura de bulbo húmedo p99,9 horaria 1991-2020","unidad":"°C","tipo":"restriccion","umbral_excluyente":">=31 °C","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"Tw_p999>=31"}},"peso_sugerido":null,"rango_pesos_literatura":"no ponderado en la literatura de aptitud","fuente_datos":"ERA5 0,25° horario; ERA5-Land ~9 km","referencias":["Sherwood & Huber 2010 doi:10.1073/pnas.0913352107","Vecellio et al. 2022 doi:10.1152/japplphysiol.00738.2021","Hersbach et al. 2020 doi:10.1002/qj.3803"]},
 {"id":"R13","nombre":"Suficiencia hídrica para la población objetivo","variable":"oferta confiable (Q95 o recarga explotable) / demanda P·q","unidad":"adimensional","tipo":"restriccion","umbral_excluyente":"<1,5 (con q=200 L/hab/día)","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"Qconf/(P*q)<1.5","q_L_hab_dia":200}},"peso_sugerido":null,"rango_pesos_literatura":"criterio central en Indonesia y Xiong'an (no ponderado)","fuente_datos":"BDHI (SSRH); INA; Aqueduct 4.0; TerraClimate ~4 km","referencias":["Howard & Bartram 2003 (OMS); 2.ª ed. 2020","Kuzma et al. 2023 doi:10.46830/writn.23.00061","Salim & Negara 2019"]},
 {"id":"R14","nombre":"Superficie contigua mínima","variable":"área del parche contiguo apto","unidad":"km²","tipo":"restriccion","umbral_excluyente":"< P/ρ_bruta (60-90 hab/ha; 500.000 hab → 56-83 km²)","funcion_valor":{"tipo":"umbral","parametros":{"excluir_si":"area<P/rho","rho_hab_ha":[60,90]}},"peso_sugerido":null,"rango_pesos_literatura":"Sejong: >=76 km² para 500.000 hab y >=50% urbanizable","fuente_datos":"derivado de máscaras R01-R13","referencias":["Libertun de Duren & Guerrero Compeán 2016 doi:10.1177/0042098015601579","UN-Habitat 2014","Kyunghyang Shinmun 2004"]},
 {"id":"F01","nombre":"Disponibilidad hídrica regional","variable":"agua renovable per cápita de la cuenca (incl. población nueva) o BWS de Aqueduct","unidad":"m³/hab/año (o %)","tipo":"factor","umbral_excluyente":"<500 m³/hab/año (escasez absoluta); ver R13","funcion_valor":{"tipo":"umbral","parametros":{"puntos":[[500,0],[1000,0.33],[1700,1]],"alternativa_BWS":{"tipo":"lineal","decreciente":true,"a":0.10,"b":0.80}}},"peso_sugerido":0.14,"rango_pesos_literatura":"0,04-0,14","fuente_datos":"Aqueduct 4.0 (subcuencas Pfaf. 6); TerraClimate ~4 km; BDHI","referencias":["Falkenmark et al. 1989 doi:10.1111/j.1477-8947.1989.tb00348.x","Kuzma et al. 2023","Liu et al. 2021 doi:10.3390/ijerph18084252","Dong et al. 2008 doi:10.3390/s8095975"]},
 {"id":"F02","nombre":"Calidad de agua (arsénico)","variable":"concentración de As en la fuente","unidad":"µg/L","tipo":"factor","umbral_excluyente":"guía OMS 10 µg/L; CAA hasta 50 µg/L por excepción (RC 34/2019)","funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"a":10,"b":50}},"peso_sugerido":0.06,"rango_pesos_literatura":"no reportado en aptitud urbana","fuente_datos":"pozos provinciales/SEGEMAR (puntual, interpolar)","referencias":["WHO GDWQ 4.ª ed. 2022","CAA art. 982 (RC 34/2019)","Bundschuh et al. 2012 doi:10.1016/j.scitotenv.2011.06.024","Smedley et al. 2002 doi:10.1016/S0883-2927(01)00082-8"]},
 {"id":"F03","nombre":"Confort térmico exterior (UTCI)","variable":"% horas/año con UTCI 9-26 °C, penalizado por horas >32 °C y < -13 °C","unidad":"%","tipo":"factor","umbral_excluyente":null,"funcion_valor":{"tipo":"lineal","parametros":{"creciente":true,"a":"p5 nacional","b":"p95 nacional","indice":"%conf-2*%calor_fuerte-1*%frio_moderado"}},"peso_sugerido":0.08,"rango_pesos_literatura":"0,01-0,10 (muestra escasa)","fuente_datos":"ERA5-HEAT UTCI horario 0,25°; SMN","referencias":["Bröde et al. 2012 doi:10.1007/s00484-011-0454-1","Błażejczyk et al. 2012 doi:10.1007/s00484-011-0453-2","Di Napoli et al. 2021 doi:10.1002/gdj3.102"]},
 {"id":"F04","nombre":"Demanda energética climática","variable":"HDD18 + 1,5·CDD18","unidad":"°C·día/año","tipo":"factor","umbral_excluyente":null,"funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"a":500,"b":3500}},"peso_sugerido":0.05,"rango_pesos_literatura":"no reportado","fuente_datos":"ERA5-Land ~9 km; IRAM 11603 (zonas bioambientales); SMN","referencias":["IRAM 11603 (vía ENARGAS)","ASHRAE 169 (HDD18/CDD10)","Muñoz-Sabater et al. 2021 doi:10.5194/essd-13-4349-2021"]},
 {"id":"F05","nombre":"Accesibilidad a ciudad >=50.000 hab","variable":"tiempo de viaje","unidad":"min","tipo":"factor","umbral_excluyente":"(cercanía excesiva cubierta por R11)","funcion_valor":{"tipo":"trapezoidal","parametros":{"a":10,"b":30,"c":90,"d":240,"nota":"para ciudades existentes usar lineal decreciente 30-180"}},"peso_sugerido":0.12,"rango_pesos_literatura":"0,04-0,24","fuente_datos":"Weiss et al. 2018 (~1 km); Nelson et al. 2019 (30″, 9 clases); recalcular con OSM e INDEC 2022","referencias":["Weiss et al. 2018 doi:10.1038/nature25181","Nelson et al. 2019 doi:10.1038/s41597-019-0265-5","Kyunghyang Shinmun 2004 (Sejong: accesibilidad 24,01)"]},
 {"id":"F06","nombre":"Conectividad de transporte nacional","variable":"tiempo a red troncal / puerto / aeropuerto","unidad":"min","tipo":"factor","umbral_excluyente":null,"funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"red_troncal":[5,60],"puerto_aeropuerto":[60,240]}},"peso_sugerido":0.06,"rango_pesos_literatura":"incluido en 0,04-0,24 (accesibilidad)","fuente_datos":"Nelson et al. 2019 (puertos); OSM; IGN","referencias":["Nelson et al. 2019","Pablo-Martí et al. 2022 doi:10.1371/journal.pone.0269419"]},
 {"id":"F07","nombre":"Pendiente","variable":"pendiente","unidad":"%","tipo":"factor","umbral_excluyente":">25% (R04)","funcion_valor":{"tipo":"trapezoidal","parametros":{"f_en_0":0.8,"b":1,"c":5,"d":25}},"peso_sugerido":0.06,"rango_pesos_literatura":"0,007-0,06","fuente_datos":"MDE-Ar 30 m; FABDEM","referencias":["Dong et al. 2008","Aly et al. 2005","Liu et al. 2021","Ulloa-Espindola & Martín-Fernández 2024 doi:10.1016/j.heliyon.2024.e36596"]},
 {"id":"F08","nombre":"Peligro sísmico","variable":"PGA T475","unidad":"g","tipo":"factor","umbral_excluyente":">=0,35 g (R06, blanda)","funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"a":0.10,"b":0.35}},"peso_sugerido":0.08,"rango_pesos_literatura":"0,04-0,14","fuente_datos":"GEM v2023.1; INPRES","referencias":["Johnson et al. 2023","Pagani et al. 2020","Aly et al. 2005"]},
 {"id":"F09","nombre":"Peligro de inundación residual","variable":"profundidad T500 fuera de T100 o HAND","unidad":"m","tipo":"factor","umbral_excluyente":"T100 (R03)","funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"a":0,"b":1,"alternativa_HAND":{"creciente":true,"a":1,"b":10}}},"peso_sugerido":0.07,"rango_pesos_literatura":"0,03-0,12","fuente_datos":"JRC v2.1 ~90 m; HAND desde FABDEM","referencias":["Dottori et al. 2016","Baugh et al. 2024","Aly et al. 2005 (distancia a cauces 0,1175)"]},
 {"id":"F10","nombre":"Susceptibilidad a deslizamientos","variable":"clase de susceptibilidad","unidad":"clase","tipo":"factor","umbral_excluyente":"opcional: 'muy alta'","funcion_valor":{"tipo":"umbral","parametros":{"muy_baja":1,"baja":0.8,"moderada":0.4,"alta":0.1,"muy_alta":0}},"peso_sugerido":0.03,"rango_pesos_literatura":"0-0,25 (0,246 en valle andino)","fuente_datos":"NASA global landslide susceptibility ~1 km; SEGEMAR","referencias":["Stanley & Kirschbaum 2017 doi:10.1007/s11069-017-2757-y","Ulloa-Espindola & Martín-Fernández 2024"]},
 {"id":"F11","nombre":"Acceso a red eléctrica AT","variable":"distancia a línea >=132 kV o ET","unidad":"km","tipo":"factor","umbral_excluyente":null,"funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"a":10,"b":100}},"peso_sugerido":0.05,"rango_pesos_literatura":"no reportado en aptitud urbana","fuente_datos":"Arderne et al. 2020 (~1 km); OSM; Secretaría de Energía/CAMMESA","referencias":["Arderne et al. 2020 doi:10.1038/s41597-019-0347-4","Oakleaf et al. 2019 doi:10.1038/s41597-019-0084-8"]},
 {"id":"F12","nombre":"Recurso renovable local","variable":"GHI y/o densidad de potencia eólica 100 m","unidad":"kWh/m²/día; W/m²","tipo":"factor","umbral_excluyente":null,"funcion_valor":{"tipo":"lineal","parametros":{"creciente":true,"GHI":[3.5,6.0],"WPD":[200,600],"combinar":"max"}},"peso_sugerido":0.03,"rango_pesos_literatura":"no reportado en aptitud urbana","fuente_datos":"Global Solar Atlas 2.0 (GHI 9″≈250 m); Global Wind Atlas (~250 m)","referencias":["ESMAP/Solargis 2019 GSA 2.0 Technical Report","Davis et al. 2023 doi:10.1175/BAMS-D-21-0075.1"]},
 {"id":"F13","nombre":"Costo de oportunidad agrícola","variable":"clase de capacidad de uso III-VIII","unidad":"clase","tipo":"factor","umbral_excluyente":"I-II (R05)","funcion_valor":{"tipo":"lineal","parametros":{"creciente":true,"a":"III","b":"VI"}},"peso_sugerido":0.05,"rango_pesos_literatura":"0,248 (Dong 2008, con signo opuesto: favorece tierra cultivada)","fuente_datos":"INTA; SoilGrids 250 m; GAEZ v4","referencias":["Klingebiel & Montgomery 1961","Bren d'Amour et al. 2017","Dong et al. 2008"]},
 {"id":"F14","nombre":"Acceso a salud de alta complejidad y universidad","variable":"tiempo de viaje","unidad":"min","tipo":"factor","umbral_excluyente":null,"funcion_valor":{"tipo":"lineal","parametros":{"decreciente":true,"a":30,"b":180}},"peso_sugerido":0.04,"rango_pesos_literatura":"0,077 (servicios, Ulloa-Espindola 2024)","fuente_datos":"Weiss et al. 2020 (~1 km); REFES; SPU","referencias":["Weiss et al. 2020 doi:10.1038/s41591-020-1059-1"]},
 {"id":"F15","nombre":"Contribución al equilibrio territorial","variable":"distancia al AMBA / vacío del sistema urbano / inverso de concentración regional","unidad":"km o índice","tipo":"factor","umbral_excluyente":null,"funcion_valor":{"tipo":"lineal","parametros":{"creciente":true,"a":"min nacional","b":"max nacional"}},"peso_sugerido":0.08,"rango_pesos_literatura":"0-0,36 (Sejong 0,36)","fuente_datos":"INDEC Censo 2022; PET","referencias":["Kyunghyang Shinmun 2004","Salim & Negara 2019","Sordoni 2021"]}
]
```

---

## 9. Referencias verificadas

### 9.1 Método MCDA-SIG
- Barron, F.H. & Barrett, B.E. (1996). Decision quality using ranked attribute weights. *Management Science* 42(11):1515-1523. doi:10.1287/mnsc.42.11.1515
- Belton, V. & Gear, T. (1983). On a short-coming of Saaty's method of analytic hierarchies. *Omega* 11(3):228-230. doi:10.1016/0305-0483(83)90047-6
- Belton, V. & Stewart, T.J. (2002). *Multiple Criteria Decision Analysis: An Integrated Approach*. Springer. doi:10.1007/978-1-4615-1495-4
- Borcherding, K., Eppel, T. & von Winterfeldt, D. (1991). Comparison of weighting judgments in multiattribute utility measurement. *Management Science* 37(12):1603-1619. doi:10.1287/mnsc.37.12.1603
- Boroushaki, S. & Malczewski, J. (2008). Implementing an extension of the analytical hierarchy process using ordered weighted averaging operators with fuzzy quantifiers in ArcGIS. *Computers & Geosciences*. doi:10.1016/j.cageo.2007.04.003
- Chandio, I.A., Matori, A.N., WanYusof, K.B., Talpur, M.A.H. et al. (2013; en línea 2012). GIS-based analytic hierarchy process as a multicriteria decision analysis instrument: a review. *Arabian Journal of Geosciences* 6(8):3059-3066. doi:10.1007/s12517-012-0568-8
- Chen, Y., Yu, J. & Khan, S. (2010). Spatial sensitivity analysis of multi-criteria weights in GIS-based land suitability evaluation. *Environmental Modelling & Software* 25(12). doi:10.1016/j.envsoft.2010.06.001
- Collins, M.G., Steiner, F.R. & Rushman, M.J. (2001). Land-use suitability analysis in the United States: historical development and promising technological achievements. *Environmental Management* 28(5). doi:10.1007/s002670010247
- Dawes, R.M. & Corrigan, B. (1974). Linear models in decision making. *Psychological Bulletin* 81(2):95-106. doi:10.1037/h0037613
- Eastman, J.R., Jiang, H. & Toledano, J. (1998). Multi-criteria and multi-objective decision making for land allocation using GIS. En *Multicriteria Analysis for Land-Use Management*, Springer. doi:10.1007/978-94-015-9058-7_13
- Einhorn, H.J. & Hogarth, R.M. (1975). Unit weighting schemes for decision making. *Organizational Behavior and Human Performance* 13(2):171-192. doi:10.1016/0030-5073(75)90044-6
- Feizizadeh, B. & Blaschke, T. (2014). An uncertainty and sensitivity analysis approach for GIS-based multicriteria landslide susceptibility mapping. *IJGIS* 28(3). doi:10.1080/13658816.2013.869821
- Fischer, G.W. (1995). Range sensitivity of attribute weights in multiattribute value models. *Organizational Behavior and Human Decision Processes* 62(3):252-266. doi:10.1006/obhd.1995.1048
- Fotheringham, A.S. & Wong, D.W.S. (1991). The modifiable areal unit problem in multivariate statistical analysis. *Environment and Planning A* 23(7):1025-1044. doi:10.1068/a231025
- Greene, R., Devillers, R., Luther, J.E. & Eddy, B.G. (2011). GIS-based multiple-criteria decision analysis. *Geography Compass* 5(6). doi:10.1111/j.1749-8198.2011.00431.x
- Hopkins, L.D. (1977). Methods for generating land suitability maps: a comparative evaluation. *Journal of the American Institute of Planners* 43(4). doi:10.1080/01944367708977903
- Huang, I.B., Keisler, J. & Linkov, I. (2011). Multi-criteria decision analysis in environmental sciences: ten years of applications and trends. *Science of the Total Environment* 409(19). doi:10.1016/j.scitotenv.2011.06.022
- Ishizaka, A. & Labib, A. (2011). Review of the main developments in the analytic hierarchy process. *Expert Systems with Applications* 38(11). doi:10.1016/j.eswa.2011.04.143
- Jankowski, P. (1995). Integrating geographical information systems and multiple criteria decision-making methods. *IJGIS* 9(3). doi:10.1080/02693799508902036
- Jiang, H. & Eastman, J.R. (2000). Application of fuzzy measures in multi-criteria evaluation in GIS. *IJGIS* 14(2). doi:10.1080/136588100240903
- Ligmann-Zielinska, A. & Jankowski, P. (2014). Spatially-explicit integrated uncertainty and sensitivity analysis of criteria weights in multicriteria land suitability evaluation. *Environmental Modelling & Software* 57. doi:10.1016/j.envsoft.2014.03.007
- Malczewski, J. (1999). *GIS and Multicriteria Decision Analysis*. Wiley. ISBN 9780471329442.
- Malczewski, J. (2004). GIS-based land-use suitability analysis: a critical overview. *Progress in Planning* 62(1):3-65. doi:10.1016/j.progress.2003.09.002
- Malczewski, J. (2006a). GIS-based multicriteria decision analysis: a survey of the literature. *IJGIS* 20(7):703-726. doi:10.1080/13658810600661508
- Malczewski, J. (2006b). Ordered weighted averaging with fuzzy quantifiers: GIS-based multicriteria evaluation for land-use suitability analysis. *Int. J. Applied Earth Observation and Geoinformation* 8(4). doi:10.1016/j.jag.2006.01.003
- Malczewski, J. & Rinner, C. (2015). *Multicriteria Decision Analysis in Geographic Information Science*. Springer. doi:10.1007/978-3-540-74757-4
- Montgomery, B. & Dragićević, S. (2016). Comparison of GIS-based logic scoring of preference and multicriteria evaluation methods: urban land use suitability. *Geographical Analysis*. doi:10.1111/gean.12103
- Mosadeghi, R., Warnken, J., Tomlinson, R. & Mirfenderesk, H. (2015). Comparison of Fuzzy-AHP and AHP in a spatial multi-criteria decision making model for urban land-use planning. *Computers, Environment and Urban Systems* 49. doi:10.1016/j.compenvurbsys.2014.10.001
- Openshaw, S. (1984). *The Modifiable Areal Unit Problem*. CATMOG 38, Geo Books, Norwich. (Monografía sin DOI.)
- Pereira, J.M.C. & Duckstein, L. (1993). A multiple criteria decision-making approach to GIS-based land suitability evaluation. *IJGIS* 7(5). doi:10.1080/02693799308901971
- Pöyhönen, M. & Hämäläinen, R.P. (2001). On the convergence of multiattribute weighting methods. *European Journal of Operational Research* 129(3):569-585. doi:10.1016/S0377-2217(99)00467-1
- Saaty, T.L. (1977). A scaling method for priorities in hierarchical structures. *Journal of Mathematical Psychology* 15(3):234-281. doi:10.1016/0022-2496(77)90033-5
- Saaty, T.L. (1990). How to make a decision: the analytic hierarchy process. *European Journal of Operational Research* 48(1):9-26. doi:10.1016/0377-2217(90)90057-I
- Saltelli, A., Ratto, M., Andres, T., Campolongo, F. et al. (2008). *Global Sensitivity Analysis: The Primer*. Wiley. doi:10.1002/9780470725184
- Steele, K., Carmel, Y., Cross, J. & Wilcox, C. (2009). Uses and misuses of multicriteria decision analysis (MCDA) in environmental decision making. *Risk Analysis* 29(1). doi:10.1111/j.1539-6924.2008.01130.x
- Yager, R.R. (1988). On ordered weighted averaging aggregation operators in multicriteria decisionmaking. *IEEE Transactions on Systems, Man, and Cybernetics* 18(1). doi:10.1109/21.87068
- Zhao, Y., van Duynhoven, A. & Dragićević, S. (2024). Machine learning for criteria weighting in GIS-based multi-criteria evaluation: a case study of urban suitability analysis. *Land* 13(8):1288. doi:10.3390/land13081288

### 9.2 Estudios de aptitud urbana y nuevas ciudades
- Aly, M.H., Giardino, J.R. & Klein, A.G. (2005). Suitability assessment for New Minia City, Egypt: a GIS approach to engineering geology. *Environmental & Engineering Geoscience* XI(3):259-269.
- Arfiansyah, D., Han, H. & Zlatanova, S. (2024). Land suitability analysis for residential development in an ecologically sensitive area: a case study of Nusantara, the new Indonesian capital. *Sustainability* 16(13):5767. doi:10.3390/su16135767 (solo se consultó el resumen; los pesos no se verificaron).
- Bathrellos, G.D., Gaki-Papanastassiou, K., Skilodimou, H.D., Papanastassiou, D. et al. (2012). Potential suitability for urban planning and industry development using natural hazard maps and geological-geomorphological parameters. *Environmental Earth Sciences* 66(2):537-548. doi:10.1007/s12665-011-1263-x
- Bathrellos, G.D., Skilodimou, H.D., Chousianitis, K., Youssef, A.M. et al. (2017). Suitability estimation for urban development using multi-hazard assessment map. *Science of the Total Environment* 575:119-134. doi:10.1016/j.scitotenv.2016.10.025
- Dai, F.C., Lee, C.F. & Zhang, X.H. (2001). GIS-based geo-environmental evaluation for urban land-use planning: a case study. *Engineering Geology* 61(4):257-271. doi:10.1016/S0013-7952(01)00028-X
- Dong, J., Zhuang, D., Xu, X. & Ying, L. (2008). Integrated evaluation of urban development suitability based on remote sensing and GIS techniques: a case study in Jingjinji Area, China. *Sensors* 8(9):5975-5986. doi:10.3390/s8095975
- Liu, X., Wang, Y. & Li, M. (2021). How to identify future priority areas for urban development: an approach of urban construction land suitability in ecological sensitive areas. *IJERPH* 18(8):4252. doi:10.3390/ijerph18084252
- Pablo-Martí, F., Alañón-Pardo, Á. & Myro, R. (2022). The choice of Madrid as the capital of Spain by Philip II in the light of the knowledge of his time: a transport network perspective. *PLoS ONE* 17(6):e0269419. doi:10.1371/journal.pone.0269419
- Salim, W. & Negara, S.D. (2019). Shifting the capital from Jakarta: reasons and challenges. *ISEAS Perspective* 2019/79. https://www.iseas.edu.sg/wp-content/uploads/2019/10/ISEAS_Perspective_2019_79.pdf
- Sordoni, F. (2021). La cuestión del traslado de la Capital Federal como problemática de Estado: el intento fallido tras la recuperación de la democracia. *Estado Abierto* 5(2):91-118, INAP. https://publicaciones.inap.gob.ar/index.php/EA/article/view/269
- Ulloa-Espindola, R. & Martín-Fernández, S. (2024). Determining the areas most suitable for urban land use while minimizing impact on natural areas: the case of the Machachi Valley, Ecuador. *Heliyon* 10(17):e36596. doi:10.1016/j.heliyon.2024.e36596
- Youssef, A.M., Pradhan, B. & Tarabees, E. (2011; en línea 2010). Integrated evaluation of urban development suitability based on remote sensing and GIS techniques: contribution from the analytic hierarchy process. *Arabian Journal of Geosciences* 4(3-4):463-473. doi:10.1007/s12517-009-0118-1 (metadatos verificados; contenido no consultado).
- Kyunghyang Shinmun (15/06/2004). 행정수도 선정기준은? [¿Cuáles son los criterios de selección de la capital administrativa?]. https://www.khan.co.kr/article/200406151826561 (también 200406151821161 y 200406151824371).
- Freitas, F. (2025). From the sky to the ground: seeking the site for Brazil's new capital in the 1950s. American Historical Association, 138th Annual Meeting (resumen). https://aha.confex.com/aha/2025/webprogram/Paper39431.html
- IPE-DF, Atlas do Distrito Federal, "3 - History of occupation". https://atlas.ipe.df.gov.br/en/?p=1124

### 9.3 Agua, clima, salud
- Bröde, P., Fiala, D., Błażejczyk, K., Holmér, I., Jendritzky, G., Kampmann, B., Tinz, B. & Havenith, G. (2012). Deriving the operational procedure for the Universal Thermal Climate Index (UTCI). *Int J Biometeorol* 56(3):481-494. doi:10.1007/s00484-011-0454-1
- Błażejczyk, K., Epstein, Y., Jendritzky, G., Staiger, H. & Tinz, B. (2012). Comparison of UTCI to selected thermal indices. *Int J Biometeorol* 56. doi:10.1007/s00484-011-0453-2
- Bundschuh, J., Litter, M.I., Parvez, F., Román-Ross, G. et al. (2012). One century of arsenic exposure in Latin America: a review of history and occurrence from 14 countries. *Science of the Total Environment* 429. doi:10.1016/j.scitotenv.2011.06.024
- Damkjaer, S. & Taylor, R. (2017). The measurement of water scarcity: defining a meaningful indicator. *Ambio* 46(5):513-531. doi:10.1007/s13280-017-0912-z
- Di Napoli, C., Barnard, C., Prudhomme, C., Cloke, H.L. & Pappenberger, F. (2021). ERA5-HEAT: a global gridded historical dataset of human thermal comfort indices from climate reanalysis. *Geoscience Data Journal* 8(1):2-10. doi:10.1002/gdj3.102
- Falkenmark, M., Lundqvist, J. & Widstrand, C. (1989). Macro-scale water scarcity requires micro-scale approaches. *Natural Resources Forum* 13(4):258-267. doi:10.1111/j.1477-8947.1989.tb00348.x
- Hackett, P.H. & Roach, R.C. (2001). High-altitude illness. *New England Journal of Medicine* 345(2):107-114. doi:10.1056/NEJM200107123450206
- Howard, G. & Bartram, J. (2003). *Domestic Water Quantity, Service Level and Health*. WHO. 2.ª ed. 2020: https://www.who.int/publications/i/item/9789240015241
- Jendritzky, G., de Dear, R. & Havenith, G. (2012). UTCI: why another thermal index? *Int J Biometeorol* 56. doi:10.1007/s00484-011-0513-7
- Kuzma, S., Bierkens, M.F.P., Lakshman, S., Luo, T., Saccoccia, L., Sutanudjaja, E.H. & Van Beek, R. (2023). *Aqueduct 4.0: Updated decision-relevant global water risk indicators*. WRI Technical Note. doi:10.46830/writn.23.00061
- Sherwood, S.C. & Huber, M. (2010). An adaptability limit to climate change due to heat stress. *PNAS* 107(21):9552-9555. doi:10.1073/pnas.0913352107
- Smedley, P.L., Nicolli, H.B., Macdonald, D.M.J., Barros, A.J. & Tullio, J.O. (2002). Hydrogeochemistry of arsenic and other inorganic constituents in groundwaters from La Pampa, Argentina. *Applied Geochemistry* 17(3):259-284. doi:10.1016/S0883-2927(01)00082-8
- Vecellio, D.J., Wolf, S.T., Cottle, R.M. & Kenney, W.L. (2022). Evaluating the 35 °C wet-bulb temperature adaptability threshold for young, healthy subjects (PSU HEAT Project). *Journal of Applied Physiology* 132(2). doi:10.1152/japplphysiol.00738.2021
- WHO (2022). *Guidelines for Drinking-water Quality: fourth edition incorporating the first and second addenda*. https://www.who.int/publications/i/item/9789240045064 (As 0,01 mg/L (A,T); F⁻ 1,5 mg/L; NO₃⁻ 50 mg/L).

### 9.4 Datos globales
- Abatzoglou, J.T., Dobrowski, S.Z., Parks, S.A. & Hegewisch, K.C. (2018). TerraClimate, a high-resolution global dataset of monthly climate and climatic water balance from 1958-2015. *Scientific Data* 5:170191. doi:10.1038/sdata.2017.191
- Arderne, C., Zorn, C., Nicolas, C. & Koks, E.E. (2020). Predictive mapping of the global power system using open data. *Scientific Data* 7:19. doi:10.1038/s41597-019-0347-4
- Baugh, C., Colonese, J., D'Angelo, C., Dottori, F., Neal, J., Prudhomme, C. & Salamon, P. (2024). *Global river flood hazard maps* (v2.1). European Commission, JRC [dataset]. PID: http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif
- Davis, N.N., Badger, J., Hahmann, A.N., Hansen, B.O. et al. (2023). The Global Wind Atlas: a high-resolution dataset of climatologies and associated web-based application. *BAMS* 104(8). doi:10.1175/BAMS-D-21-0075.1
- Dijkstra, L., Florczyk, A.J., Freire, S., Kemper, T. et al. (2021). Applying the Degree of Urbanisation to the globe: a new harmonised definition reveals a different picture of global urbanisation. *Journal of Urban Economics* 125:103312. doi:10.1016/j.jue.2020.103312
- Dottori, F., Salamon, P., Bianchi, A., Alfieri, L. et al. (2016). Development and evaluation of a framework for global flood hazard mapping. *Advances in Water Resources* 94. doi:10.1016/j.advwatres.2016.05.002
- ESMAP / Solargis (2019). *Global Solar Atlas 2.0 Technical Report*. World Bank. https://documents1.worldbank.org/curated/en/529431592893043403/
- FAO & IIASA (2021). *Global Agro-Ecological Zones version 4 (GAEZ v4): Model documentation*. doi:10.4060/cb4744en
- Fick, S.E. & Hijmans, R.J. (2017). WorldClim 2: new 1-km spatial resolution climate surfaces for global land areas. *International Journal of Climatology* 37(12):4302-4315. doi:10.1002/joc.5086
- Giardini, D., Grünthal, G., Shedlock, K.M. & Zhang, P. (1999). The GSHAP Global Seismic Hazard Map. *Annals of Geophysics* 42(6). doi:10.4401/ag-3784
- Hawker, L., Uhe, P., Paulo, L., Sosa, J. et al. (2022). A 30 m global map of elevation with forests and buildings removed. *Environmental Research Letters* 17:024016. doi:10.1088/1748-9326/ac4d4f
- Hersbach, H., Bell, B., Berrisford, P., Hirahara, S. et al. (2020). The ERA5 global reanalysis. *QJRMS* 146(730). doi:10.1002/qj.3803
- Johnson, K., Villani, M., Bayliss, K., Brooks, C. et al. & Pagani, M. (2023). *Global Earthquake Model (GEM) Seismic Hazard Map (version 2023.1)*. doi:10.5281/zenodo.8409647
- McGranahan, G., Balk, D. & Anderson, B. (2007). The rising tide: assessing the risks of climate change and human settlements in low elevation coastal zones. *Environment and Urbanization* 19(1). doi:10.1177/0956247807076960
- Muñoz-Sabater, J., Dutra, E., Agustí-Panareda, A., Albergel, C. et al. (2021). ERA5-Land: a state-of-the-art global reanalysis dataset for land applications. *Earth System Science Data* 13. doi:10.5194/essd-13-4349-2021
- Nelson, A., Weiss, D.J., van Etten, J., Cattaneo, A., McMenomy, T.S. & Koo, J. (2019). A suite of global accessibility indicators. *Scientific Data* 6:266. doi:10.1038/s41597-019-0265-5. Datos: doi:10.6084/m9.figshare.7638134.v3
- Oakleaf, J.R., Kennedy, C.M., Baruch-Mordo, S., Gerber, J.S., West, P.C., Johnson, J.A. et al. (2019). Mapping global development potential for renewable energy, fossil fuels, mining and agriculture sectors. *Scientific Data* 6:101. doi:10.1038/s41597-019-0084-8
- Pagani, M., Garcia-Pelaez, J., Gee, R., Johnson, K. et al. (2020). The 2018 version of the Global Earthquake Model: hazard component. *Earthquake Spectra* 36(1_suppl). doi:10.1177/8755293020931866
- Pekel, J.-F., Cottam, A., Gorelick, N. & Belward, A.S. (2016). High-resolution mapping of global surface water and its long-term changes. *Nature* 540:418-422. doi:10.1038/nature20584
- Pesaresi, M., Schiavina, M., Politis, P., Freire, S. et al. (2024). Advances on the Global Human Settlement Layer by joint assessment of Earth Observation and population survey data. *International Journal of Digital Earth* 17(1). doi:10.1080/17538947.2024.2390454
- Poggio, L., de Sousa, L.M., Batjes, N.H., Heuvelink, G.B.M. et al. (2021). SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. *SOIL* 7:217-240. doi:10.5194/soil-7-217-2021
- Stanley, T. & Kirschbaum, D.B. (2017). A heuristic approach to global landslide susceptibility mapping. *Natural Hazards* 87. doi:10.1007/s11069-017-2757-y
- Weiss, D.J., Nelson, A., Gibson, H.S., Temperley, W. et al. (2018). A global map of travel time to cities to assess inequalities in accessibility in 2015. *Nature* 553:333-336. doi:10.1038/nature25181
- Weiss, D.J., Nelson, A., Vargas-Ruiz, C.A., Gligorić, K. et al. (2020). Global maps of travel time to healthcare facilities. *Nature Medicine* 26:1835-1838. doi:10.1038/s41591-020-1059-1

### 9.5 Urbanización, densidad y suelo
- Angel, S., Parent, J., Civco, D.L., Blei, A. & Potere, D. (2011). The dimensions of global urban expansion: estimates and projections for all countries, 2000-2050. *Progress in Planning* 75(2). doi:10.1016/j.progress.2011.04.001
- Bren d'Amour, C., Reitsma, F., Baiocchi, G., Barthel, S. et al. (2017). Future urban land expansion and implications for global croplands. *PNAS* 114(34):8939-8944. doi:10.1073/pnas.1606036114
- Klingebiel, A.A. & Montgomery, P.H. (1961). *Land-Capability Classification*. USDA Agriculture Handbook No. 210. https://www.govinfo.gov/content/pkg/GOVPUB-A-PURL-gpo20777/pdf/GOVPUB-A-PURL-gpo20777.pdf
- Libertun de Duren, N. & Guerrero Compeán, R. (2016). Growing resources for growing cities: density and the cost of municipal public services in Latin America. *Urban Studies* 53(14):3082-3107. doi:10.1177/0042098015601579
- Seto, K.C., Güneralp, B. & Hutyra, L.R. (2012). Global forecasts of urban expansion to 2030 and direct impacts on biodiversity and carbon pools. *PNAS* 109(40). doi:10.1073/pnas.1211658109
- UN-Habitat (2014). *A New Strategy of Sustainable Neighbourhood Planning: Five Principles* (Discussion Note 3). https://unhabitat.org/a-new-strategy-of-sustainable-neighbourhood-planning-five-principles. Principios:
  1. Al menos 30 % del suelo para calles y al menos 18 km de calle por km².
  2. Al menos 15.000 hab/km².
  3. Al menos 40 % de la superficie cubierta para uso económico.
  4. Entre 20 y 50 % de la superficie residencial para vivienda de bajo costo, sin que ninguna tenencia supere el 50 %.
  5. Bloques monofuncionales en menos del 10 % del barrio.
- UN-Habitat (2015). *International Guidelines on Urban and Territorial Planning*. https://unhabitat.org/international-guidelines-on-urban-and-territorial-planning
- World Bank (2013). *Planning, Connecting, and Financing Cities—Now: Priorities for City Leaders*. https://documents1.worldbank.org/curated/en/512131468149090268/pdf/Planning-connecting-and-financing-cities-now-priorities-for-city-leaders.pdf

### 9.6 Argentina
- Lanfranchi, G., Cordara, C., Duarte, J.I., Gimenez Hutton, T., Rodriguez, S. & Ferlicca, F. (2018). *¿Cómo crecen las ciudades argentinas? Estudio de la expansión urbana de los 33 grandes aglomerados*. CIPPEC. https://www.cippec.org/wp-content/uploads/2018/11/Cómo-crecen-las-ciudades-argentinas-CIPPEC.pdf
- Ley 23.512 (1987). Traslado de la Capital Federal a Viedma–Carmen de Patagones–Guardia Mitre. https://www.argentina.gob.ar/normativa/nacional/ley-23512-21781/texto
- Ley 26.331 (2007). Presupuestos mínimos de protección ambiental de los bosques nativos. https://www.argentina.gob.ar/normativa/nacional/ley-26331-136125/texto
- Ley 26.639 (2010). Régimen de presupuestos mínimos para la preservación de los glaciares y del ambiente periglacial. https://www.argentina.gob.ar/normativa/nacional/ley-26639-174117/texto
- Ministerio de Planificación Federal (Subsecretaría de Planificación Territorial de la Inversión Pública). *Plan Estratégico Territorial*: Avance I (2008); Avance II (2011), "Argentina Urbana" y "Territorio e Infraestructura"; Avance III (2015); "Avance 2018" y "Argentina Urbana. PET Avance 2018". Listado oficial: https://www.argentina.gob.ar/node/211284 (los PDF no fueron accesibles durante la revisión).
- PNUD / SSPTIP (2010). *El riesgo de desastres en la planificación del territorio: primer avance* (coord. J. Fernández Bussy). ISBN 978-987-1560-19-6.
- INPRES-CIRSOC 103 (2013). *Reglamento Argentino para Construcciones Sismorresistentes, Parte I* y *Comentarios*. https://iisee.kenken.go.jp/worldlist/02_Argentina/
- Código Alimentario Argentino, art. 982 (texto según Resolución Conjunta SRyGS-SAByDR 34/2019). https://www.boletinoficial.gob.ar/detalleAviso/primera/222045/20191127
- IGN. Modelo Digital de Elevaciones de la República Argentina (MDE-Ar v2.1, 30 m). https://www.ign.gob.ar/NuestrasActividades/Geodesia/ModeloDigitalElevaciones/Introduccion
- IRAM 11603. *Acondicionamiento térmico de edificios: clasificación bioambiental de la República Argentina* (consultada a través de fuentes secundarias: ENARGAS y SEDICI-UNLP).

### 9.7 Fuentes secundarias usadas para contexto (no evidencia primaria)
- Casos de Astana, Amaravati y Smart Cities Mission: prensa y enciclopedias (CSM 1999; RFE/RL 1997; The Wire; Business Standard 2015). Solo se tomaron como listas de chequeo.
- Umbrales de pendiente municipales de EE. UU.: Chester County PC; STC Planning 2025; LA City Planning (BHO).

---

## 10. Vacíos y próximos pasos sugeridos
1. Obtener el texto primario del Informe Belcher (1955/56) y de los estudios del ENTECAP / Roulet (1987) para la localización de Viedma.
2. Obtener los PDF del PET 2018 y de Argentina Urbana 2018. Los enlaces oficiales estaban caídos en la fecha de la revisión.
3. Verificar en la Tabla del Reglamento INPRES-CIRSOC 103 los valores de "as" para las zonas 0–2. Verificar también los cortes de categoría del BWS en la nota técnica de Aqueduct 4.0.
4. Ampliar la muestra de pesos AHP (meta: 20 estudios o más con tablas completas) para estimar rangos con distribución empírica.
5. Calibrar las funciones [J] con un panel de expertos argentinos: INTA, INA, INPRES, SEGEMAR, SMN, CONICET y planificadores provinciales.
