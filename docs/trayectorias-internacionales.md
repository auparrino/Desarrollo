# Trayectorias de ciudades nuevas que crecieron: datos para contrastar el modelo de proceso

Fecha de elaboración: 21 de octubre de 2026.

> **Para qué sirve.** El modelo de la app simula año a año la cadena **empleo → migración → vivienda → nacimientos**. Este documento junta 13 casos reales de capitales nuevas, ciudades nuevas y polos planificados que crecieron, para comparar sus trayectorias con las que produce el modelo (backtest). Los datos están en `web/src/model/trayectorias_int.json`: población por año con su fuente, motor de empleo, secuencia de obras, vivienda, radicación frente a viaje diario, origen de los migrantes, crisis y contexto nacional.
>
> **Relación con otros documentos.** `docs/politicas-territoriales.md` §1–§2 trata las capitales y ciudades nuevas desde otro ángulo (metas, costos y cumplimiento, incluidos los fracasos). Aquí el foco está en **cómo creció cada caso que funcionó, año a año**.
>
> **Confiabilidad.** Las series de población vienen de censos nacionales (IBGE, ABS, ONS, Statistics Botswana, Censo de India, DOSM, Statistics Korea, anuarios de Shenzhen). Casi todas se leyeron a través de tablas de Wikipedia o de citypopulation.de, que citan esos censos; no se abrieron los volúmenes originales. Los datos del motor (empleos trasladados por año) son **escasos**: solo hay cifras parciales para Brasília, Canberra, Sejong, Shenzhen, Milton Keynes y Putrajaya. En el JSON, `null` significa que el dato no se encontró y `"estimado": true` marca cifras redondas, aproximadas o derivadas. Los crecimientos anuales de este texto son **cálculos propios** hechos a partir de las series.

---

## 0. Resumen

1. **Todas las ciudades que crecieron tuvieron dos motores sucesivos.** El primero fue la **obra**, con miles de obreros que llegaron antes que cualquier ministerio. En 1959, el Distrito Federal de Brasília ya tenía 64.314 habitantes, antes de la inauguración. El segundo fue el **empleo estable**: público en Canberra, Brasília, Chandigarh y Sejong, e industrial en Shenzhen, Ciudad Guayana y Milton Keynes. Donde el segundo motor tardó, la ciudad se estancó: Canberra tardó 45 años en llegar a 30.000 habitantes y Goiânia casi no creció en los años cuarenta.
2. **Las tasas de crecimiento máximas son muy altas, pero duran poco.** Sostenidas durante una década, en los casos medidos fueron:

   | Caso | Período | Crecimiento anual |
   |---|---|---|
   | Brasília | 1960–1970 | 14 % |
   | Palmas | 1991–2000 | 21 % |
   | Shenzhen | 1980–1990 | 17 % |
   | Gaborone | 1964–1971 | 24 % |
   | Gaborone | 1971–1981 | 13 % |
   | Canberra | 1954–1971 | ~10 % |
   | Chandigarh | 1961–1971 | 8 % |
   | Goiânia | 1950–1960 | 11 % |

   Después de 20 a 30 años, la tasa baja a menos del 3 %. Un modelo que dé tasas sostenidas por encima del 25 % anual, o que no muestre esa desaceleración, queda fuera del rango observado.
3. **El empleo público trasladado genera una población varias veces mayor, pero llega en etapas y tarda.** En Canberra había unos 14.600 servidores públicos federales en 1966 (estimación propia: el 15 % de 97.416) y 96.032 habitantes, unas 6,6 personas por servidor. En Sejong, unos 10.000 a 15.000 servidores trasladados coincidieron con 280.000 habitantes nuevos en 12 años. Esa población vino casi toda de la región vecina (Daejeon y Chungcheong), no de Seúl.
4. **La vivienda construida por adelantado fue la regla para los funcionarios.** Así fue en Brasília, Canberra, Chandigarh, Gaborone, Putrajaya y Sejong. Para los obreros y los migrantes atraídos por el empleo, en cambio, nunca alcanzó. En todos los casos aparecieron asentamientos informales que después se regularizaron: Taguatinga en Brasília, Naledi en Gaborone, las colonias de tránsito en Chandigarh, las favelas de Belo Horizonte y las aldeas urbanas de Shenzhen. En Canberra, la vivienda pública marcó el ritmo del traslado: en 1955 había más de 3.000 familias en lista de espera.
5. **Viajar o radicarse depende de la distancia y de las escuelas.** En Sejong, que está a unos 120 km de Seúl con tren rápido, el 23 % de los servidores seguía viajando desde Seúl en 2013. En 2014, el 34 % se había mudado solo o viajaba, y la primera razón para no mudar a la familia era la educación (54,2 %). Putrajaya, a 25 km de Kuala Lumpur, tiene apenas el 34 % de su población meta: hay unos 22.000 departamentos para funcionarios frente a una necesidad de 35.000. Cuando la distancia impide el viaje diario (Brasília, Canberra, Palmas, Gaborone), los empleados se radican, aunque el traslado sea lento.
6. **Hubo crisis en todos los casos, y la salida dependió de quién sostuvo el proyecto.** Brasília la sostuvo con una segunda ley de traslado (1967–1976). Canberra, con una autoridad única con suelo y presupuesto, la NCDC creada en 1958. Shenzhen, con el respaldo político del viaje de Deng al sur en 1992. Astaná, con la renta petrolera de los años 2000. Milton Keynes giró en los ochenta hacia la vivienda privada en propiedad. La dependencia de un solo empleador estatal hizo vulnerable a Ciudad Guayana.
7. **El contexto nacional pone el techo.** Las ciudades que crecieron más rápido (Shenzhen, Gaborone, Chandigarh y Brasília) estaban en países con poca urbanización, entre el 3 % y el 45 %, con grandes reservas de población rural dispuesta a migrar. Las que crecieron en países ya urbanizados, como Sejong (82 %), Milton Keynes (77 %) y Canberra (82 % en 1960), lo hicieron más despacio y con migrantes regionales. **Argentina está urbanizada en torno al 92 %, así que los casos comparables son estos últimos, no Shenzhen.**

---

## 1. Tabla comparativa

Las fuentes de cada dato están en el JSON. Los crecimientos anuales son cálculos propios entre los puntos de la serie.

| Caso | Tipo | t0 | Población inicial | Población a los ~10 años | Población a los ~25 años | Hoy | Motor principal | Vivienda | Urbanización del país en t0 |
|---|---|---|---|---|---|---|---|---|---|
| **Brasília** (DF) | Capital nueva | 1956 | 12.283 (1957) | 546.015 (1970) | 1.203.333 (1980) | 2.817.381 (2022) | Obra; servidores federales en dos olas (1960 y 1967–76) | El Estado construyó por adelantado para los servidores; los obreros fueron a ciudades satélite | 44,7 % (1960) |
| **Palmas** | Capital estatal nueva | 1989 | 24.261 (1991) | 137.045 (2000) | 302.692 (2022, 33 años) | 302.692 | Empleo público estatal nuevo y obra | Venta de lotes estatales; un tercio reservado a bajos ingresos | 74,2 % |
| **Canberra** (ACT) | Capital nueva | 1913 / 1958 | 1.777 (1911) | 30.315 (1954, tras 40 años) | 151.169 (1971, 13 años después de la NCDC) | 453.890 (2021) | Traslado de la administración federal desde 1958 | Del gobierno, por adelantado y en alquiler; suelo público | 81,6 % (1960) |
| **Milton Keynes** | Ciudad nueva (new town) | 1967 | ~40.000 | 125.437 (1981) | 183.000 (1992) | 287.060 (municipio, 2021) | Empresas trasladadas y nuevas (~40.000 empleos en 1986; ~80.000 en 1992) | De la corporación, por adelantado: alquiler en los setenta y venta privada en los ochenta | 77,2 % |
| **Shenzhen** | Zona económica especial | 1980 | 332.900 | 1.677.800 (1990) | 7.012.400 (2000, 20 años) | 17.560.000 (2020) | Fábricas exportadoras con capital de Hong Kong; 20.000 soldados ingenieros (1983) | Por demanda: dormitorios de fábrica y aldeas urbanas | 19,4 % |
| **Gaborone** | Capital nueva | 1964 | 3.855 | 17.718 (1971) | 133.468 (1991) | 246.325 (2022) | Gobierno de un país nuevo, financiado con diamantes | Más de 1.000 casas del gobierno; después lotes con servicios | 3,4 % |
| **Astaná** | Capital trasladada a una ciudad existente | 1997 | 277.365 (1989) | 613.006 (2009) | 1.234.042 (2021) | 1.528.703 (2025) | Gobierno y renta petrolera (desde 2000) | Vivienda para funcionarios y después construcción masiva | 56,5 % |
| **Belo Horizonte** | Capital estatal nueva | 1894 | ~10.000 (1897) | 13.472 (1900) | 55.563 (1920) | 2.315.560 (2022) | Gobierno estatal; industria desde los años cuarenta | Lotes para funcionarios; favelas para los obreros | Sin dato |
| **Goiânia** | Capital estatal nueva | 1933 | — | 48.166 (1940) | 153.505 (1960) | 1.437.366 (2022) | Gobierno estatal; ferrocarril (1951) y Brasília | Sin dato | Sin dato |
| **Ciudad Guayana** | Polo industrial | 1961 | 44.100 (1960) | 225.000 (1975, estimado) | 453.047 (1990) | 704.585 (municipio Caroní, 2011) | Siderurgia, aluminio e hidroelectricidad estatales (CVG) | Urbanizaciones de las empresas y de la CVG; autoconstrucción en San Félix | 62,8 % |
| **Sejong** | Ciudad administrativa | 2007 / 2012 | 81.447 (2010) | 353.933 (2020) | — | 392.471 (2025) | ~10.000 servidores en 2012–14, más organismos después | Torres de departamentos por adelantado, con cupos para servidores | 81,9 % |
| **Putrajaya** | Ciudad administrativa | 1995 | 12.240 (2000) | 72.413 (2010) | 109.202 (2020) | 119.200 (2023, estimado) | Ministerios federales (1999–2005) | Cuarteles del gobierno: ~22.000 de los 35.000 necesarios | 55,9 % |
| **Chandigarh** | Capital estatal nueva | 1951 | 24.261 (1951, aldeas) | 119.881 (1961) | 451.610 (1981) | 1.055.450 (2011) | Gobierno de Punjab, refugiados y, desde 1966, dos gobiernos | Del Estado, en 13 tipos según el rango del empleado | 17,9 % (1960) |

---

## 2. Cada ruta, en detalle

### 2.1 Brasília (Brasil, 1956–)

**Secuencia.**

1. **1956.** Se creó NOVACAP, una empresa estatal dueña de la tierra y de la obra. Se abrieron la pista de aterrizaje y la ciudad de obra (Cidade Livre).
2. **1957–1960.** Unos 30.000 obreros, los candangos, levantaron los palacios, los ministerios y las primeras supercuadras.
3. **1958–1960.** Para los obreros y los ocupantes desalojados se fundaron ciudades satélite: Taguatinga en 1958, Cruzeiro en 1959 (para servidores) y Gama en 1960.
4. **21/4/1960.** La ciudad se inauguró inconclusa. Ese año, la meta del grupo de traslado era instalar unos 700 servidores con sus familias, en un universo de 363.700 empleados federales.
5. **1967–1976.** La Ley 5.363/1967 y el Decreto 75.648/1975 completaron el traslado, con un fondo de vivienda (CODEBRÁS) y ayudas para mudarse.

**Números.** El DF tenía 12.283 habitantes en 1957, 64.314 en 1959 y 141.742 en 1960. Después llegó a 546.015 en 1970 y a 1.203.333 en 1980. Creció un 14 % anual entre 1960 y 1970 y un 8 % entre 1970 y 1980. En 2010, el 46 % de los residentes había nacido fuera del DF, sobre todo en Goiás, Minas Gerais y Bahía. Ese mismo año, Río todavía tenía 114.739 servidores federales civiles, contra 61.698 en el DF (dato de un resumen de búsqueda).

**Lecciones.**

- La obra fue el primer motor de población, y los ministerios llegaron recién en la segunda ola.
- La vivienda por adelantado fue solo para los servidores. El Plano Piloto pasó de tener el 48 % de la población del DF a tener el 13 %.
- La continuidad la dio una segunda decisión política, no el plan original.

### 2.2 Palmas (Tocantins, Brasil, 1989–)

**Secuencia.**

1. **1989.** Se instaló una capital provisoria en Miracema y la Asamblea autorizó expropiar el sitio, con lo que el Estado quedó como dueño del suelo. Se creó una comisión de implantación y se colocó la piedra fundamental.
2. **1/1/1990.** El gobierno se trasladó, aunque todavía no había edificios ni alojamiento para el personal.
3. **1992.** La Ley 397 reservó al menos un tercio de los lotes estatales para familias de hasta 5 salarios mínimos.

**Números.** La población pasó de 24.261 habitantes (1991) a 86.116 (1996), 137.045 (2000), 228.332 (2010) y 302.692 (2022). Creció un 21 % anual entre 1991 y 2000 y un 5 % entre 2000 y 2010.

**Lecciones.**

- Es el caso más parecido a lo que la app puede simular: una capital provincial nueva en un país ya urbanizado (74 %).
- El empleo público nuevo, sumado a la venta de lotes, produjo el crecimiento más rápido de la muestra entre los países urbanizados.
- El precio fue la dispersión: un estudio de la UFT de 2007 documentó vacíos urbanos y un costo alto de mantenimiento.

### 2.3 Canberra (Australia, 1913 / 1958–)

**Secuencia.**

1. **1913.** Fundación de la ciudad.
2. **Años veinte.** El gobierno construyó casas antes de mudar a los servidores: aprobó 545 en 1926–27. El Parlamento se instaló en 1927, y hacia 1928 se habían trasladado 646 servidores (dato no verificado en el texto completo).
3. **1927–1958.** Casi 30 años de estancamiento por la Depresión y la guerra, con la mayoría de los departamentos todavía en Melbourne.
4. **1958.** Nació la NCDC, una autoridad única con suelo público en arrendamiento y presupuesto propio. Al empezar tenía el plan de trasladar a 3.000 servidores más.

**Números.** El ACT tenía 16.905 habitantes en 1947 y 30.315 en 1954. Después llegó a 58.828 (1961), 96.032 (1966) y 151.169 (1971), con un crecimiento de cerca del 10 % anual durante 17 años. En 1966, unos 14.600 servidores federales trabajaban en el ACT (estimación). En 1941, el gobierno era dueño de 1.633 casas, contra 400 privadas.

**Lecciones.**

- Sin traslado real de empleos, la capital no crece.
- Con una autoridad única, suelo público y vivienda por adelantado, la población se multiplicó por cinco en 17 años.
- La lista de espera de vivienda (más de 3.000 familias en 1955) fue el límite que marcó el ritmo.

### 2.4 Milton Keynes (Reino Unido, 1967–)

**Secuencia.**

1. **1967.** Designación como new town. La corporación de desarrollo compró la tierra a valor agrícola.
2. **1968–1970.** Plan con una malla vial de 1 km y parques lineales.
3. **Años setenta.** Vivienda en alquiler para hogares derivados de Londres, que llegaban con empleo en empresas trasladadas.
4. **1979.** Abrió el centro comercial central.
5. **Años ochenta.** Giro hacia la vivienda privada en propiedad y la inversión extranjera.
6. **1992.** La corporación se disolvió.

**Números.** La población pasó de unos 40.000 habitantes (1967) a 125.437 (1981, estimación) y a 183.000 (1992). Eso equivale a un 8,5 % anual entre 1967 y 1981 (comparación aproximada, porque los ámbitos difieren) y a un 3,6 % entre 1981 y 1991. Los empleos nuevos sumaban unos 40.000 en 1986 (7.000 de inversores extranjeros) y unos 80.000 en 1992. Se construyeron unas 44.000 viviendas (estas dos últimas cifras vienen de una fuente secundaria).

**Lecciones.**

- El empleo y la vivienda se entregaban juntos.
- La captura de la plusvalía del suelo pagó la infraestructura.
- La ciudad siguió creciendo por su cuenta después de 1992 y hoy recibe más viajeros diarios de los que envía.

### 2.5 Shenzhen (China, 1980–)

**Secuencia.**

1. **1979.** Se abrió la zona industrial de Shekou, con puerto y energía.
2. **1980.** Se creó la zona económica especial, con reglas propias para la tierra, la inversión y el trabajo.
3. **1983.** 20.000 soldados ingenieros pasaron a ser obreros civiles con hukou local, es decir, con residencia legal en la ciudad.
4. **Años ochenta.** Fábricas de procesamiento de empresas de Hong Kong, con migrantes jóvenes alojados en dormitorios.
5. **1992.** El viaje de Deng al sur relanzó la zona.

**Números.** Antes de la zona había unos 310.000 habitantes y menos de 30.000 trabajadores. La población llegó a 881.500 en 1985, 1.677.800 en 1990, 4.491.500 en 1995, 7.012.400 en 2000 y 17,56 millones en 2020. De estos últimos, solo el 33,4 % tenía hukou local. Creció un 17 % anual entre 1980 y 1990 y un 15,4 % entre 1990 y 2000.

**Lecciones.**

- Cuando el motor es el empleo industrial exportador, la población lo sigue casi sin rezago.
- La vivienda la pusieron los privados y los aldeanos, no el plan.
- No es un caso trasladable a un país urbanizado al 92 %, pero sirve de cota superior del modelo.

### 2.6 Gaborone (Botsuana, 1964–)

**Secuencia.**

1. **1964–1966.** En unos tres años se construyó una ciudad completa con más de 1.000 casas del gobierno, oficinas, escuelas y un hospital, y se trasladó la administración desde Mafeking.
2. **Años siguientes.** Los obreros se asentaron de forma informal en Naledi.
3. **1971–1975.** Lotes para bajos ingresos y regularización de Naledi.

**Números.** La ciudad pasó de 3.855 habitantes (1964) a 17.718 (1971), 59.657 (1981), 133.468 (1991) y 246.325 (2022), frente a una meta de 20.000. Creció un 24 % anual entre 1964 y 1971 y un 13 % entre 1971 y 1981.

**Lecciones.**

- En un país casi sin ciudades (3,4 % urbano), la capital absorbió la urbanización nacional.
- La vivienda para quienes no eran funcionarios se resolvió con lotes con servicios.

### 2.7 Astaná (Kazajistán, 1997–)

**Secuencia.**

1. **1994.** Decisión parlamentaria.
2. **1995.** Comisión estatal y fondo "Nueva Capital".
3. **1997.** Traslado a Akmola, una ciudad existente. Se fijó un cupo para trasladar el 40 % del aparato presidencial y entre el 20 y el 30 % del personal de los ministerios (según el recuerdo de un exfuncionario).
4. **Desde 2000.** Construcción masiva en la margen izquierda del río, financiada con la renta petrolera.

**Números.** La ciudad tenía 277.365 habitantes en 1989 y 312.965 en 1999, apenas un 1,2 % de crecimiento anual en una década de crisis. Después llegó a 613.006 en 2009, 1.234.042 en 2021 y 1.528.703 en 2025.

**Lecciones.**

- Partir de una ciudad existente dio una base de servicios.
- El crecimiento fuerte empezó recién con dinero para construir, tres años después del traslado.
- La población se multiplicó por cuatro entre 1999 y 2021.

### 2.8 Belo Horizonte (Minas Gerais, Brasil, 1894–)

**Secuencia.**

1. **1893–1894.** Decisión y comienzo de la obra, a cargo de la Comisión Constructora.
2. **1897.** La ciudad se inauguró inconclusa, con unos 10.000 habitantes. Los lotes centrales se dieron o se vendieron en condiciones preferenciales a los funcionarios y a los expropietarios de Ouro Preto.
3. **Desde los años cuarenta.** Industrialización.

**Números.** La población fue de 13.472 habitantes en 1900, 55.563 en 1920, 211.377 en 1940, 693.328 en 1960 y 1.255.415 en 1970. Creció un 7 % anual sostenido durante 70 años.

**Lecciones.**

- La función de capital sola dio un crecimiento lento al principio, desde una base muy chica.
- Los obreros sin lote fundaron las favelas desde el primer día.

### 2.9 Goiânia (Goiás, Brasil, 1933–)

**Secuencia.**

1. **1933.** Piedra fundamental.
2. **1935–1937.** Traslado escalonado de las secretarías del gobierno.
3. **1942.** Inauguración oficial.
4. **1951.** Llegó el ferrocarril.
5. **1956–1960.** Construcción de Brasília.

**Números.** La ciudad tenía 48.166 habitantes en 1940, ya cerca de su meta de 50.000, y 53.389 en 1950, apenas un 1 % de crecimiento anual. Con la conexión, pasó a 153.505 en 1960 (11 % anual) y a 389.784 en 1970.

**Lecciones.**

- Una capital estatal llega pronto a un techo si no tiene conexión ni más empleo.
- La conectividad (ferrocarril y rutas a Brasília) destrabó el crecimiento.

### 2.10 Ciudad Guayana (Venezuela, 1961–)

**Secuencia.**

1. **Años cincuenta.** Minería de hierro estadounidense.
2. **1960–1961.** Se creó la CVG, con control de la tierra y de las empresas, y se hizo el plan con el MIT y Harvard.
3. **Décadas siguientes.** Siderurgia, aluminio y represas (Guri), con urbanizaciones en Puerto Ordaz y autoconstrucción en San Félix.

**Números.** San Félix tenía 44.100 habitantes en 1960. La ciudad llegó a unos 225.000 en 1975 (estimación) y a 453.047 en 1990, y el municipio Caroní tenía 704.585 en 2011. Los migrantes vinieron sobre todo de los estados del nororiente, que aportaron el 79 % de los inmigrantes del estado Bolívar en 1971. La migración neta acumulada del estado fue de +56.230 personas (1971), +128.118 (1981) y +157.347 (1990). SIDOR tenía unos 13.000 empleados.

**Lecciones.**

- Una industria pesada con energía barata multiplicó la ciudad por diez en 30 años.
- Esa industria crea pocos empleos directos para la población que atrae.
- La dependencia de un solo empleador estatal hizo a la ciudad vulnerable a la crisis nacional.

### 2.11 Sejong (Corea del Sur, 2007 / 2012–)

**Secuencia.**

1. **2004–2005.** La Corte anuló el proyecto de capital y se rehízo como ciudad administrativa.
2. **2007–2012.** Se construyeron el complejo de gobierno y las torres de departamentos.
3. **2010.** El gobierno intentó revertir el plan, sin éxito.
4. **2012–2014.** Se trasladaron unos 36 organismos con unos 10.452 servidores, en tres etapas.
5. **2015–2021.** Entrega masiva de departamentos.

**Números.**

- **Población.** La ciudad lanzó en 2012 con unos 115.000 habitantes. Tenía 204.088 en 2015, 353.933 en 2020 y 392.471 en 2025. Creció unos 2.500 habitantes por mes entre 2012 y 2020. En 2025 tuvo su primer saldo migratorio negativo (−47 personas).
- **Viaje frente a radicación.** En una encuesta de 2011, el 46,1 % de los servidores pensaba mudarse con la familia, el 40,6 % solo y cerca del 10 % viajar. En 2013, el 23 % viajaba desde Seúl. En 2014, el 34 % se había mudado solo o viajaba.
- **Origen de los migrantes.** Entre 2012 y 2017 llegaron 72.460 residentes de Daejeon.

**Lecciones.**

- El empleo público atrajo sobre todo población regional.
- La familia decide según las escuelas.
- Cuando se termina el stock de vivienda nueva, el crecimiento se frena. Además, la fecundidad bajó a menos de 1 hijo por mujer, a pesar de la población joven, con una edad media de 37 años.

### 2.12 Putrajaya (Malasia, 1995–)

**Secuencia.**

1. **1995.** Comenzó la obra de la ciudad completa, a 25 km de Kuala Lumpur.
2. **1997.** La crisis asiática demoró el cronograma.
3. **1999.** Se mudó la oficina del primer ministro (unas 300 personas).
4. **1999–2005.** Se trasladó el resto de los ministerios, con tren rápido desde 2002.

**Números.** La ciudad tenía 12.240 habitantes en 2000, 72.413 en 2010 y 109.202 en 2020, el 34 % de la meta de 320.000. Hay unos 22.000 cuarteles para funcionarios, contra una necesidad de 35.000, y entre 17.000 y 18.000 servidores en lista de espera (2021–2025).

**Lecciones.**

- Cerca de la metrópoli, una parte grande de los empleados viaja en vez de mudarse. No se encontró una cifra oficial de esa proporción.
- La población queda atada a la vivienda pública disponible.

### 2.13 Chandigarh (India, 1951–)

**Secuencia.**

1. **1948.** Elección del sitio.
2. **1951.** Le Corbusier se hizo cargo del plan.
3. **1952.** Ley de control de la periferia.
4. **1951–1953.** Se construyeron viviendas del gobierno en 13 tipos según el rango del empleado, y en 1953 se trasladó el gobierno desde Shimla.
5. **1966.** La ciudad pasó a ser capital de dos estados, Punjab y Haryana.

**Números.** La población fue de 119.881 habitantes en 1961, 257.251 en 1971 (7,9 % anual), 451.610 en 1981 y 1.055.450 en 2011. En 1971, entre el 11 y el 15 % vivía en asentamientos ilegales.

**Lecciones.**

- El empleo público de dos estados y los refugiados de la Partición sostuvieron el crecimiento durante 30 años.
- El control de la periferia desplazó el crecimiento a los municipios vecinos (Mohali y Panchkula).

---

## 3. Qué usar para el backtest del modelo

Estos son rangos observados, no parámetros calibrados. Ningún caso se parece del todo al contexto argentino.

| Variable del modelo | Rango observado | Casos |
|---|---|---|
| Años entre el t0 y el primer empleo estable trasladado | 0–4 años con decisión firme (Brasília, Gaborone, Palmas, Putrajaya y Sejong desde la obra); 14 años (Canberra, hasta 1927) y 45 años (Canberra, hasta el traslado masivo) | Todos |
| Crecimiento anual en la primera década con motor activo | 8–14 % en países urbanizados o semiurbanizados (Canberra 1954–71, Milton Keynes 1967–81, Brasília 1960–70, Chandigarh 1961–71); 17–24 % solo con grandes reservas rurales (Shenzhen, Gaborone) o en un estado nuevo (Palmas) | Ver §1 |
| Desaceleración | La tasa baja a menos del 3 % entre los 25 y los 35 años del t0 en casi todos los casos | Brasília, Canberra, Gaborone, Goiânia, Belo Horizonte |
| Habitantes por empleo público trasladado | Unos 6,6 en Canberra en 1966 (estimado) y unos 20 a 28 en Sejong, contando la migración regional. Son cálculos propios con datos incompletos | Canberra, Sejong |
| Proporción de empleados que viajan en vez de radicarse | 10 % previsto y 23 % efectivo en Sejong (2013); 34 % solos o viajando (2014). Cerca de 0 cuando la distancia supera los 250 km | Sejong; sin cifra para Putrajaya |
| Proporción de la población en vivienda informal en la etapa de crecimiento rápido | 11–15 % en Chandigarh (1971). En el resto, cualitativo | Chandigarh, Gaborone, Brasília, Belo Horizonte |
| Origen de los migrantes | Mayormente regional (Sejong desde Daejeon y Chungcheong, Ciudad Guayana desde el nororiente, Goiânia desde el interior de Goiás); el origen nacional amplio solo se dio con el empleo masivo de la obra (Brasília) | Ver JSON |

**Advertencias.**

- **Sesgo de selección.** La muestra incluye solo casos que crecieron. Para la tasa de fracaso, ver `politicas-territoriales.md` §2.
- **Ámbitos geográficos distintos.** Hay datos del DF, del municipio, del área urbana y del territorio. El campo `derivado.tramos` del JSON calcula el crecimiento solo dentro del ámbito con más datos, pero en Sejong (registro de 2024 contra censo de 2025) y Putrajaya (estimación de 2007) mezcla definiciones y sus tramos cortos no son confiables.
- **Faltan series anuales del motor.** Casi en ningún caso se encontró el número de empleos trasladados año por año. Las cifras del JSON son puntos aislados.

---

## 4. Fuentes

La lista completa, con su URL, está en el campo `fuentes` de cada caso en `web/src/model/trayectorias_int.json`. Las principales son:

- Censos del IBGE (tablas de pt.wikipedia «Distrito Federal (Brasil)», «Palmas», «Belo Horizonte» y «Goiânia»); IBGE, Censo Experimental de Brasília 1959 (Boletim Geográfico 1973).
- ABS, *Australian Historical Population Statistics* (en.wikipedia «Demographics of Canberra»); APSC, *Fifty years of APS employment data*; en.wikipedia «Public housing in the Australian Capital Territory».
- TCPA, ficha «Milton Keynes» (copia en `data/raw/trayectorias_int/tcpa_milton_keynes.pdf`); censos de la ONS; MK Living Archive.
- Anuario Estadístico de Shenzhen 2020 (en.wikipedia «Demographics of Shenzhen»); gobierno de Shenzhen, «深圳故事» (2023).
- Statistics Botswana (en.wikipedia «Gaborone»).
- Censos de Kazajistán y stat.gov.kz (en.wikipedia «Astana»); e-history.kz.
- Ravuri (2003), *Delaware Review of Latin American Studies* 4(2); OpenEdition IHEAL; Britannica.
- Statistics Korea y citypopulation.de; Korea Herald (2012, 2013); Seoul Shinmun (2011, 2017, 2018); Asia Economy (2020); Hankyung (2026); Korea Times (2026).
- DOSM vía citypopulation.de; Bernama (junio de 2025); Auditoría Nacional de Malasia.
- Censo de India (en.wikipedia «Chandigarh»).
- Banco Mundial, WDI (población y urbanización nacional; copia en `data/raw/trayectorias_int/wb_*.json`).
