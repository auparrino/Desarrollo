# Trayectorias argentinas para validar el modelo de poblamiento

Este documento resume siete casos argentinos de ciudades que crecieron porque un "motor" creó empleo: una capital nueva, una industria, el petróleo o el turismo. Para cada caso se reconstruye qué se hizo, en qué orden y cuánto creció la población. El fin es comparar el modelo año a año (empleo → migración → vivienda → nacimientos) con trayectorias reales.

Los datos con fuente están en `web/src/model/trayectorias_ar.json`. Las fuentes descargadas, en PDF y en texto, están en `data/raw/trayectorias_ar/`.

**Reglas.** No se inventó ningún número. Si un dato no se encontró, figura como `null`. Se marca `estimado` cuando la fuente dice "más de", "unos" o algo parecido, o cuando el valor es derivado. Se marca `verificado: false` cuando la cifra viene de prensa o de un testimonio que no se pudo contrastar con una estadística.

## Resumen comparativo

| Caso | t0 | Motor | Población | Multiplicador | Empleo del motor | Confiabilidad |
|---|---|---|---|---|---|---|
| La Plata | 1882 | Capital nueva (construcción + Estado) | 6.962 (1881, partido de Ensenada) → 65.610 (1890) → 137.413 (1914) | ×6 en 6 años | 457–733 obreros en edificios (1883–84) y más de 1.500 en el puerto (1884). Empleados públicos: sin dato | Media |
| Tierra del Fuego | 1972 | Ley 19.640 (industria) | 13.527 (1970) → 69.369 (1991) → 185.732 (2022) | ×5,1 en 21 años | 532 (c. 1978) → más de 6.000 (1987) → unos 2.000 (2002) → más de 15.000 (c. 2013–15) → 6.651 (2026) | Población alta; empleo antes de 1996 bajo |
| Puerto Madryn | 1971 | ALUAR (aluminio) | 6.115 (1970) → 20.478 (1980) → 97.625 (2022) | ×3,3 en 10 años | 300 en obra (1972) → más de 900 directos (1974) → 3.400 (2021) | Alta / media |
| Neuquén (Confluencia) | 1958 | Capital provincial + represas + petróleo | ciudad: 16.738 (1960) → 90.089 (1980) → 287.787 (2022) | ×5,4 en 20 años | unos 2.000 obreros en El Chocón (1970). Estado provincial: 74.317 (2021) | Población alta; empleo bajo |
| El Calafate | 2000 | Aeropuerto + turismo del glaciar | 3.101 (1991) → 6.410 (2001) → 16.655 (2010) → 22.844 (2022) | ×2,6 en 9 años | Empleo: sin dato. Camas: 2.586 (2001) → 7.603 (2009) | Alta (con camas en lugar de empleo) |
| Añelo | 2013 | Vaca Muerta (petróleo no convencional) | 2.449 (2010) → 6.304 (2022) | ×2,6 en 12 años | Flotantes: 15.000–40.000 (prensa) | Población alta; empleo bajo |
| Comodoro Rivadavia | 1907 | Petróleo | 124.104 (1991) → 199.369 (2022) | — | 1.401 obreros en 1914 (no verificado) | Baja |

## 1. La Plata (1882): primero ferrocarril y obreros, después Estado

**Secuencia.**

1. **1882 (marzo):** se elige el sitio y una ley obliga a los empleados trasladados a vivir en la nueva ciudad. El ferrocarril Tolosa–Ensenada ya existía.
2. **1882 (octubre):** decreto para contratar en Europa "mil obreros o más".
3. **1882 (19 de noviembre):** fundación.
4. **1883 (enero):** ramal ferroviario Ringuelet–Brandsen para traer materiales, con 185 inmigrantes al empezar.
5. **1883 (diciembre):** con los ramales listos, 457 obreros trabajan en 9 edificios públicos. Después de abril de 1884 son 733. En marzo de 1884 hay más de 1.500 en el puerto.
6. **1884 (marzo):** el censo cuenta 10.407 habitantes. El 78 % son extranjeros y la gran mayoría varones jornaleros: 7.336 varones y 796 mujeres no argentinos.
7. **1884 (15 de abril):** se trasladan los poderes provinciales y llegan los empleados públicos. No se encontró cuántos fueron.
8. **1885–1887:** se inauguran edificios. Hay luz eléctrica (1886), telégrafo y teléfono (1887).
9. **1888:** Talleres del Ferrocarril Oeste y barrio obrero "Mil Casas".
10. **1890:** 65.610 habitantes. Se termina el puerto, con más de 1.800 obreros, y llega la crisis.
11. **1895:** 60.991 habitantes.
12. **1897 y 1905:** universidad provincial, que después pasa a ser nacional.
13. **1909 y 1914:** 95.126 y 137.413 habitantes.

**Vivienda.** Llegó a demanda y fue precaria. Los obreros vivían en casillas de madera que el Estado alquilaba en el puerto o que levantaban ellos mismos en tierras ajenas. El único barrio planificado se hizo seis años después de la fundación. Algunos inmigrantes recibieron quintas en tierras inundables.

**Lecciones.**

- El primer motor fue la construcción, no el empleo público.
- La llegada de varones solos retrasa los nacimientos: en 1884 había unos 5,4 varones por mujer (8.779 varones y 1.628 mujeres).
- Cuando la obra termina y llega una crisis, el saldo migratorio puede volverse negativo (-7 % entre 1890 y 1895).

## 2. Tierra del Fuego (Ley 19.640, 1972): incentivo fiscal con efecto retardado

**Población.** Para la provincia, según IPIEC e INDEC:

| Año | Habitantes |
|---|---|
| 1960 | 7.955 |
| 1970 | 13.527 |
| 1980 | 27.358 |
| 1991 | 69.369 |
| 2001 | 101.079 |
| 2010 | 127.205 |
| 2022 | 185.732 |

Para las dos ciudades hay población urbana casi año por medio, gracias a los censos territoriales:

| Año | Río Grande | Ushuaia |
|---|---|---|
| 1966 | 4.823 | 3.847 |
| 1970 | 6.189 | 5.373 |
| 1976 | 8.786 | 7.171 |
| 1980 | 13.897 | 11.033 |
| 1983 | 20.250 | 15.975 |
| 1986 | 30.002 | 22.718 |
| 1991 | 38.137 | 29.166 |
| 1994 | 44.120 | 40.870 |
| 1997 | 47.199 | 44.976 |
| 2001 | 52.681 | 45.430 |
| 2010 | 66.475 | 56.593 |
| 2022 | 97.611 | 79.409 |

**Empleo industrial.**

| Año | Empleos | Fuente y aclaraciones |
|---|---|---|
| c. 1978 | 532 | 59 empresas (Fundar, con datos del Anuario de 1978) |
| 1982 | más de 2.000 | Prensa |
| 1987 | más de 6.000 | Prensa |
| 1995 | unos 600 | Solo Río Grande, testimonio de un dirigente de la UOM |
| 1996 | unos 3.000 | Valor derivado: "la mitad" del pico de 1987 |
| 2002 | unos 2.000 | Prensa |
| 2007–09 | más de 6.000 | Prensa |
| c. 2013–15 | más de 15.000 | Decreto 727/2021 |
| 2021 | 10.800 | Fundar |
| jul. 2025 | 9.508 | IPIEC |
| jul. 2026 | 6.651 | IPIEC |

Las cifras de prensa anteriores a 1996 no están verificadas. Desde 1996 hay datos del OEDE.

**Secuencia.** La ley es de 1972. Primero hubo regalías petroleras y obra pública, y en 1977–1982 se planificaron y consolidaron los parques industriales. La ola de ensambladoras de electrónica llegó en 1980–1987. La población urbana se duplicó entre 1980 y 1986 (de 24.930 a 52.720). La vivienda quedó atrás: el parque creció 244 % y las viviendas precarias 684 %. En 1987–88 Ushuaia declaró la emergencia habitacional. La provincialización llegó en 1990–91 y el IPV construyó 8.500 viviendas hasta 2000. En 1994–96 hubo cierres de plantas y el empleo público funcionó como refugio. La Ley 26.539 de 2009 trajo un nuevo ciclo, con pico en 2013–15, y en 2025–26 hubo otra caída.

**Migrantes.** En 1991 el 60 % de la población provincial había nacido en otra provincia. Muchos venían de zonas rurales o tenían poca calificación, y los atraían los salarios altos.

**Lecciones.**

- El incentivo fiscal tardó unos 8 años en mover el empleo de forma masiva.
- La respuesta de la población fue muy rápida y la vivienda formal no la siguió: los asentamientos fueron cerca del 30 % de la expansión urbana hasta 1991.
- Cuando el motor se cae, la población no se va. El Estado absorbe empleo y la natalidad de una población joven sigue empujando.
- Conviene modelar por separado la volatilidad del empleo del motor y el stock de población.

## 3. Puerto Madryn (ALUAR, 1971): infraestructura estatal y vivienda de empresa por adelantado

**Secuencia.**

1. **1968:** proyecto de la Fuerza Aérea.
2. **1969–71:** acueducto Trelew–Madryn de 63 km.
3. **1970:** licitación de la presa de Futaleufú.
4. **1971:** adjudicación al grupo de FATE. El Estado garantiza energía, puerto de aguas profundas, tierra y exenciones, y según Solari Yrigoyen aporta cerca del 85 % de la inversión.
5. **1971 (noviembre):** empieza la obra de la planta. En 1972 trabajan 300 obreros.
6. **1972 (abril):** empieza el puerto, habilitado en parte en enero de 1974.
7. **1972–78:** ALUAR construye barrios propios. El mayor es el barrio Roca, con 468 viviendas para técnicos y operarios, escuela y centro comercial.
8. **1974 (julio):** empieza la producción con más de 900 empleados directos. La energía viene de una central térmica y del gasoducto mientras se termina la presa.
9. **1978:** se inaugura Futaleufú.
10. **1979–85:** se instalan pesqueras que llegan a emplear tanto como ALUAR.
11. **Años 90:** crisis del precio del aluminio en 1993, rebaja salarial a 930 trabajadores y crecimiento poblacional de solo 2,5 % anual. Llega el turismo de Península Valdés (Patrimonio de la Humanidad en 1999).
12. **Hacia 2005:** ampliación de ALUAR. En 2021 tiene 3.400 empleos directos.

**Población.**

| Año | Habitantes |
|---|---|
| 1970 | 6.115 |
| 1980 | 20.478 |
| 1991 | 44.916 |
| 2001 | 57.571 |
| 2010 | 81.315 |
| 2022 | 97.625 |

**Migración.** Explica el 83 % del crecimiento en 1970–80, el 68 % en 1980–91, el 52 % en 1991–2001 y el 58 % en 2001–10. Los extranjeros nunca superaron el 8,2 %.

**Lecciones.**

- El empleo directo del motor fue chico (unos 900) comparado con los 14.000 habitantes que se sumaron en la década. El multiplicador vino de la construcción, la pesca y los servicios.
- Un segundo y un tercer motor (pesca en el mismo puerto, turismo) sostuvieron el crecimiento cuando el primero se estancó.
- La vivienda de empresa construida por adelantado permitió que los trabajadores se mudaran con su familia.

## 4. Neuquén y Confluencia: capital provincial más energía

**Población de la ciudad.**

| Año | Habitantes |
|---|---|
| 1960 | 16.738 (prensa) |
| 1970 | 43.070 |
| 1980 | 90.089 |
| 1991 | 167.296 |
| 2001 | 201.868 |
| 2010 | 231.198 |
| 2022 | 287.787 |

Confluencia creció 98,9 % en 1947–60, 76,9 % en 1960–70, 73,6 % en 1970–80, 69,8 % en 1980–91 y 18,7 % en 1991–2001.

**Secuencia.**

1. **1955–58:** provincialización (Ley 14.408).
2. **1968–73:** El Chocón, con unos 2.000 obreros en la villa temporaria y la construcción de la capital casi triplicando su empleo.
3. **Años 70–80:** hidrocarburos y obra pública.
4. **Años 90:** privatizaciones. Las ciudades petroleras del interior se estancan (Cutral Có pasa de 33.463 a 33.718) y el departamento de una represa ya terminada se vacía (Collón Curá, -44 %).
5. **Desde 2010:** Vaca Muerta. El crecimiento se reparte en ciudades dormitorio (Plottier +61 %, Centenario +45 % entre 2010 y 2022).

**Empleo público provincial.** 74.317 agentes en 2021 y 72.043 en 2022. No se encontró una serie histórica.

**Migrantes.** En los años 60 y 70 vinieron de Río Negro, La Pampa y Mendoza; desde los 80, de Buenos Aires. Eran sobre todo varones de 20 a 24 años, y hubo una ola chilena.

**Lecciones.**

- La combinación de capital y energía dio unos 70 % de crecimiento por década durante cuarenta años.
- Las represas son motores transitorios.
- El Estado provincial amortigua las caídas del motor privado.
- En la fase madura, el crecimiento se reparte en el área metropolitana.

## 5. El Calafate (aeropuerto, 2000–2001): el turismo sigue a la capacidad de alojamiento

**Población.** 3.101 (1991), 6.410 (2001), 16.655 (2010) y 22.844 (2022).

**Camas hoteleras.** 2.586 (2001), 3.597 (2004), 7.603 (2009), entre 7.600 y 8.200 de 2010 a 2019, 5.017 en la pandemia (2021) y 6.966 (2022). No se encontró una serie de empleo turístico.

**Secuencia.** El parque nacional se creó en 1937. En los años 80 se agotó la ganadería. El aeropuerto internacional se inauguró a fines de 2000 o en 2001, según la fuente, y en 2002 llegó la devaluación. Las camas se triplicaron entre 2004 y 2009, y la población se multiplicó por 2,6 entre 2001 y 2010. Desde 2010 las camas se estancan y la población crece más despacio.

**Empleo.** Es estacional y polifuncional. Los puestos calificados se cubren con trabajadores de otros destinos turísticos y con estudiantes, y los no calificados con mano de obra local.

**Lecciones.**

- La infraestructura que destraba el motor (el aeropuerto) y el contexto macroeconómico llegaron primero. Las camas aparecieron 2 a 3 años después y la población las siguió.
- El techo lo da la capacidad de recibir turistas.

## 6. Añelo (Vaca Muerta): mucho empleo y poca radicación

**Población.** 2.449 (2010) y 6.304 (2022), +157 %. El departamento pasó de 10.786 a 18.166. La prensa estima 8.500 habitantes en 2025 y más de 10.000 en 2026, con unos 1.500 recién llegados por año.

**Trabajadores.** Se estima una población flotante de 15.000 a 40.000 trabajadores, que viven en campamentos o viajan más de 2 horas por día desde Neuquén.

**Vivienda.** El IPV estima un faltante de más de 15.000 viviendas en el área de Vaca Muerta. Hay alquileres muy altos, módulos prefabricados y el 50 % de las parcelas sin construir. En 2026 el intendente pidió no mudarse sin un trabajo confirmado.

**Lecciones.**

- Un motor intensivo en capital, con rotación de personal y sin vivienda genera más viajes diarios que radicación.
- En el modelo, el paso de empleo a migración permanente tiene que depender de la oferta de vivienda y de la distancia a la ciudad regional.

## 7. Comodoro Rivadavia (petróleo, 1907): caso incompleto

Solo se verificó la población desde 1991: 124.104 (1991), 135.632 (2001), 175.196 (2010) y 199.369 (2022).

Entre 1991 y 2001, con la privatización de YPF, creció apenas 9 %. Entre 2001 y 2010, con el boom de precios, creció 29 %.

La cifra de 1.401 obreros en 1914 (3,3 % argentinos) no está verificada: la fuente del CSIC no respondió.

## Lecciones generales para el modelo

1. **El orden de los pasos.** En los casos que funcionaron, el Estado puso primero la infraestructura que destraba el motor: ferrocarril en La Plata; agua, puerto y energía en Madryn; aeropuerto en El Calafate; parques industriales en Tierra del Fuego. El empleo masivo llegó entre 1 y 8 años después. Conviene modelar un retraso entre la decisión y el empleo.
2. **El multiplicador.** El empleo directo del motor es una parte chica del crecimiento. En Madryn fueron unos 900 empleos directos para +14.000 habitantes en 10 años. La construcción y los servicios multiplican.
3. **La vivienda.** Solo Madryn construyó vivienda para su personal por adelantado. En La Plata, Tierra del Fuego y Añelo la vivienda fue a demanda y con informalidad: hasta un tercio de la expansión en Tierra del Fuego, y viajes diarios y campamentos en Añelo. El modelo debe permitir que la falta de vivienda convierta a migrantes permanentes en viajeros diarios o población informal.
4. **Asimetría entre llegar e irse.** Las caídas del motor (La Plata 1890, Tierra del Fuego 1995–2002, Madryn en los 90, Neuquén en los 90) frenan la llegada pero rara vez vacían la ciudad. Las excepciones son los campamentos de obra, como Collón Curá. El Estado y la natalidad sostienen la población.
5. **Demografía de la llegada.** Las primeras olas son de varones jóvenes (La Plata 1884, Neuquén en los 60). Los nacimientos aumentan con retraso, cuando llegan las familias.
6. **Diversificación.** Las ciudades que siguieron creciendo después de que el primer motor se estancara sumaron un segundo motor que usa la misma infraestructura: pesca y turismo en Madryn, universidad en La Plata, Estado y petróleo en Neuquén.

## Vacíos y confiabilidad

- **Datos que faltan:**
  - el número de empleados públicos trasladados a La Plata en 1884;
  - una serie oficial del empleo industrial fueguino antes de 1996;
  - los contratistas de ALUAR;
  - el empleo de El Chocón, una serie del empleo público de Neuquén y el empleo petrolero propio de Neuquén o de Añelo;
  - el empleo turístico de El Calafate;
  - la vivienda estatal en Neuquén y El Calafate.
- **Datos poco homogéneos:** la serie de La Plata posterior a 1914 que da Wikipedia mezcla partido y Gran La Plata, así que se omitió salvo 1947 (marcado) y 2022. Las cifras de 2022 por localidad cuentan solo hogares particulares.
- **Casos sin cubrir:** la promoción industrial de San Luis (1983–2000), Villa Carlos Paz y Pilar.
