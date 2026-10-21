# Simulaciones de proceso: cómo conviene hacerlo

Generado con `web/scripts/simular.ts` sobre el modelo `web/src/model/proceso.ts`. Para el caso de
cada instrumento (el mismo de `docs/casos-concretos.md`) se simulan varias estrategias año por año
durante 30 años, 800 veces cada una, variando lo que no se sabe con certeza:

| Parámetro incierto | Rango | Fuente |
|---|---|---|
| Empleos locales por cada empleo del motor | 0,8 a 2,5 | Moretti (2010): 1,6; implícito en los casos exitosos: Tierra del Fuego 1987 ≈ 1,7, Canberra 1966 ≈ 1,9 (`docs/recorridos-exitosos.md`) |
| Parte del flujo migratorio hacia la provincia que capta un solo lugar | 2 % a 12 % | observado: Pilar 1,7 %, Colón (Córdoba) 4,3 %, Puerto Madryn 7,8 %, Confluencia 11,7 %; con un techo de 1,5 veces el mayor saldo observado (Pilar, ~2.900 personas netas por año) |
| Recién llegados sin trabajo que se van cada año | 20 % a 40 % | supuesto; uno de cada tres migrantes vuelve a su provincia (Censo 2022) |
| Parte del empleo nuevo que ocupan migrantes | 60 % (fijo) | Blanchard y Katz (1992) |
| Crecimiento vegetativo | 0,6 % a 1,2 % anual | INDEC |

En cada año: el empleo disponible para los que llegan es la mitad del crecimiento normal de la
zona más el motor de empleo (y su efecto multiplicador), la construcción (1,5 empleos-año por
vivienda) y los servicios públicos locales (3 empleos cada 100 habitantes). Llega gente solo si hay
vacantes, vivienda terminada y gente que se esté mudando hacia esa provincia (mudanzas por año del
RENAPER y del Censo 2022). Los primeros traen pocos chicos (1,6 personas por empleo; 2,2 después).
El saldo económico suma el beneficio anual por habitante radicado (del costo-beneficio) y resta la
conexión, el motor de empleo, los incentivos, las ayudas y el costo de oportunidad de las viviendas
vacías (las ocupadas se necesitarían igual en otro lugar).

## Resumen

- **Crear una ciudad nueva** (Sarmiento, meta 500.000): para no perder plata, *organismos públicos primero, luego viviendas a demanda* (31.980 habitantes al año 30, 100 % de probabilidad de saldo positivo). Para poblar, *organismos públicos primero, luego viviendas a demanda*: 31.980 habitantes, y además mejora el saldo. Lo peor: *viviendas primero* (−USD 10,4 mil millones).
- **Trasladar la capital** (Senillosa, meta 500.000): para no perder plata, *traslado gradual con radicación de las familias* (141.793 habitantes al año 30, 67 % de probabilidad de saldo positivo). Para poblar, *traslado gradual con radicación de las familias*: 141.793 habitantes, y además mejora el saldo. Lo peor: *traslado rápido y viviendas para todos al inicio* (−USD 2,9 mil millones).
- **Fortalecer ciudades intermedias** (Gran San Nicolás de los Arroyos, meta 100.000): para no perder plata, *a demanda, sin motor de empleo* (61.803 habitantes al año 30, 0 % de probabilidad de saldo positivo). Para poblar, *organismos públicos primero, luego viviendas a demanda*: 71.547 habitantes, a unos USD 12.298 por habitante adicional. Lo peor: *viviendas primero* (−USD 1,2 mil millones).
- **Repoblar pueblos** (Punta Alta, meta 20.000): para no perder plata, *a demanda, sin motor de empleo* (19.978 habitantes al año 30, 0 % de probabilidad de saldo positivo). Lo peor: *motor de empleo grande primero, luego viviendas a demanda* (−USD 156 millones).
- **Crear polos productivos** (Laguna Brava, meta 50.000): para no perder plata, *parque por etapas sin incentivos fiscales* (109.711 habitantes al año 30, 97 % de probabilidad de saldo positivo). Lo peor: *parque completo e incentivos por 10 años* (−USD 12,9 mil millones).

## Procesos óptimos: lo que se repite en todas las simulaciones

1. **No construir por adelantado.** "Viviendas primero" es siempre la peor estrategia: la gente no llega más rápido por haber casas, llega si hay trabajo, y las viviendas vacías cuestan. Se construye a demanda o por etapas chicas.
2. **El empleo pone el ritmo, no la vivienda.** Sin un motor de empleo, un lugar nuevo crece como mucho al ritmo del flujo migratorio habitual (unos cientos de personas por año), y donde el empleo de la zona no crece directamente no llega nadie (en Sarmiento, sin motor, la simulación da cero). Con el mejor motor, una ciudad nueva llega a unas 30.000 a 50.000 personas en 30 años, no a 500.000. Una meta realista para una ciudad nueva sin un motor excepcional es de decenas de miles de habitantes, no de cientos de miles.
3. **El motor de empleo más barato es público y permanente.** Trasladar o crear organismos, una universidad u hospitales regionales cuesta una vez (oficinas y mudanza, unos USD 23.000 por puesto) y suma gente a un costo muy bajo por habitante. Los incentivos fiscales por empleo, al nivel de los regímenes de promoción (unos USD 51.000 por puesto por año), no se pagan en ningún caso simulado.
4. **Capital: trasladar de a un ministerio y que las familias se muden.** El traslado gradual (12 años) con vivienda y ayuda para que el 85 % de los agentes se mude con su familia es el mejor proceso. Si el traslado va más rápido que la construcción, los agentes no encuentran dónde vivir y terminan viajando, como en Brasilia y en Putrajaya.
5. **Polos: urbanizar por etapas y sin incentivos fiscales.** El parque se urbaniza a medida que se venden los lotes; lo que hace falta son compromisos de inversión firmados, no exenciones por empleo.
6. **Lo que más define el resultado es el atractivo del lugar.** En los lugares sin motor, el resultado depende casi por completo de qué parte de quienes se mudan elige ese lugar. Servicios, conexión y programas de retorno para quienes nacieron en la región son la palanca; en la capital manda el empleo que genera el traslado.
7. **Donde la zona es menos productiva que el AMBA, el proceso no lo arregla.** En el pueblo cercano a Punta Alta cualquier estrategia llega a la meta, pero el saldo es negativo porque los salarios de la zona son más bajos: es una decisión de equilibrio territorial, no de rentabilidad.

El "proceso óptimo" es la estrategia con mayor saldo mediano; se muestran también la probabilidad
de que el saldo sea positivo y lo que más pesa en el resultado.

## Crear una ciudad nueva: Sarmiento (Deseado, Santa Cruz)

Meta: 500.000 habitantes. Hoy hay 27.130 puestos privados en la zona, que crecieron -0,3 % por año; hacia Santa Cruz se mudan unas 6.939 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Viviendas primero | 6 – **23** – 104 | 100 % | −USD 10,4 mil millones | 0 % | no suma gente |
| Por etapas, sin motor de empleo | 0 – **0** – 0 | 100 % | −USD 1,7 mil millones | 0 % | no suma gente |
| A demanda, sin motor de empleo | 0 – **0** – 0 | 100 % | −USD 213 millones | 0 % | referencia |
| Motor de empleo chico primero, luego viviendas a demanda | 20.095 – **26.723** – 33.584 | 43 % | −USD 743 millones | 0 % | USD 19.817 |
| Motor de empleo grande primero, luego viviendas a demanda | 41.528 – **52.591** – 67.090 | 46 % | −USD 1,9 mil millones | 0 % | USD 31.281 |
| **Organismos públicos primero, luego viviendas a demanda** ✔ | 25.449 – **31.980** – 39.036 | 52 % | USD 415 millones | 100 % | gana |
| Motor chico + programa de retorno y ayuda de mudanza | 21.938 – **29.893** – 38.137 | 43 % | −USD 705 millones | 0 % | USD 16.455 |

**Si el objetivo es no perder plata: organismos públicos primero, luego viviendas a demanda.** Traslado de 17.308 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales.

**Si el objetivo es poblar: organismos públicos primero, luego viviendas a demanda.** Traslado de 17.308 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales. Suma 31.980 habitantes más que la referencia y cada uno le cuesta al país unos USD 0 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 867 | 1.342 | 7.188 | 858 | 0 |
| 5 | 8.067 | 3.856 | 18.565 | 4.158 | 39 |
| 10 | 25.431 | 10.359 | 47.890 | 2.936 | 225 |
| 15 | 27.520 | 10.359 | 45.814 | 416 | 271 |
| 20 | 29.608 | 10.367 | 45.888 | 416 | 292 |
| 30 | 31.885 | 11.163 | 45.965 | 416 | 315 |

Lo que más pesa en el resultado: cuánto empleo local genera el motor (correlación 0,88) y cuánta gente que se muda elige este lugar (correlación 0,4).

## Trasladar la capital: Senillosa (El Cuy, Río Negro)

Meta: 500.000 habitantes. Hoy hay 76.122 puestos privados en la zona, que crecieron 1 % por año; hacia Río Negro se mudan unas 14.896 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Traslado rápido y viviendas para todos al inicio | 152.169 – **199.409** – 245.817 | 63 % | −USD 2,9 mil millones | 0 % | USD 34.791 |
| Traslado rápido, viviendas a demanda | 77.063 – **99.512** – 122.293 | 62 % | −USD 207 millones | 22 % | no suma gente |
| Traslado gradual (12 años), viviendas a demanda | 92.920 – **119.078** – 147.141 | 57 % | −USD 68 millones | 38 % | referencia |
| Traslado rápido con radicación de las familias | 94.738 – **118.934** – 142.894 | 51 % | −USD 136 millones | 31 % | no suma gente |
| **Traslado gradual con radicación de las familias** ✔ | 117.812 – **141.793** – 171.186 | 46 % | USD 90 millones | 67 % | gana |

**Si el objetivo es no perder plata: traslado gradual con radicación de las familias.** 12 años; vivienda y ayuda de mudanza para que el 85 % se mude.

**Si el objetivo es poblar: traslado gradual con radicación de las familias.** 12 años; vivienda y ayuda de mudanza para que el 85 % se mude. Suma 22.715 habitantes más que la referencia y cada uno le cuesta al país unos USD 0 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 1.544 | 4.190 | 21.746 | 1.529 | 0 |
| 5 | 22.271 | 11.439 | 53.161 | 10.083 | 121 |
| 10 | 74.272 | 29.492 | 132.100 | 10.454 | 637 |
| 15 | 131.488 | 49.132 | 191.351 | 894 | 1.306 |
| 20 | 135.934 | 49.132 | 193.741 | 894 | 1.350 |
| 30 | 142.314 | 50.087 | 199.289 | 95 | 1.455 |

Lo que más pesa en el resultado: cuánto empleo local genera el motor (correlación 0,96) y cuánta gente que se muda elige este lugar (correlación 0,2).

## Fortalecer ciudades intermedias: Gran San Nicolás de los Arroyos (San Nicolás, Buenos Aires)

Meta: 100.000 habitantes. Hoy hay 311.579 puestos privados en la zona, que crecieron 0,5 % por año; hacia Buenos Aires se mudan unas 173.024 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Viviendas primero | 65.141 – **67.317** – 68.291 | 83 % | −USD 1,2 mil millones | 0 % | no suma gente |
| Por etapas, sin motor de empleo | 65.128 – **65.293** – 68.713 | 72 % | −USD 294 millones | 0 % | no suma gente |
| **A demanda, sin motor de empleo** ✔ | 60.727 – **61.803** – 62.982 | 62 % | −USD 139 millones | 0 % | referencia |
| Motor de empleo chico primero, luego viviendas a demanda | 68.806 – **70.643** – 72.097 | 79 % | −USD 480 millones | 0 % | USD 38.511 |
| Motor de empleo grande primero, luego viviendas a demanda | 73.502 – **76.297** – 78.982 | 76 % | −USD 928 millones | 0 % | USD 54.400 |
| Organismos públicos primero, luego viviendas a demanda | 69.787 – **71.547** – 72.774 | 73 % | −USD 259 millones | 0 % | USD 12.298 |
| Motor chico + programa de retorno y ayuda de mudanza | 80.103 – **85.213** – 91.331 | 82 % | −USD 561 millones | 0 % | USD 18.003 |

**Si el objetivo es no perder plata: a demanda, sin motor de empleo.** Se construye cada año lo que pide la llegada del año anterior.

**Si el objetivo es poblar: organismos públicos primero, luego viviendas a demanda.** Traslado de 3.462 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales. Suma 9.745 habitantes más que la referencia y cada uno le cuesta al país unos USD 12.298 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 2.312 | 1.493 | 3.641 | 1.431 | 9 |
| 5 | 6.220 | 2.655 | 5.182 | 1.912 | 43 |
| 10 | 14.500 | 5.654 | 10.001 | 3.057 | 114 |
| 15 | 25.728 | 10.080 | 15.690 | 1.642 | 241 |
| 20 | 38.427 | 13.995 | 19.939 | 3.131 | 353 |
| 30 | 62.346 | 22.330 | 30.393 | 3.212 | 591 |

Lo que más pesa en el resultado: nacimientos (correlación -0,35) y cuánta gente que se muda elige este lugar (correlación -0,28).

## Repoblar pueblos: Punta Alta (Coronel de Marina Leonardo Rosales, Buenos Aires)

Meta: 20.000 habitantes. Hoy hay 71.063 puestos privados en la zona, que crecieron 1,5 % por año; hacia Buenos Aires se mudan unas 173.024 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Viviendas primero | 17.440 – **17.483** – 17.500 | 50 % | −USD 65 millones | 0 % | no suma gente |
| Por etapas, sin motor de empleo | 19.931 – **19.978** – 19.997 | 50 % | −USD 17 millones | 0 % | no suma gente |
| **A demanda, sin motor de empleo** ✔ | 19.933 – **19.978** – 19.999 | 69 % | −USD 14 millones | 0 % | referencia |
| Motor de empleo chico primero, luego viviendas a demanda | 19.929 – **19.979** – 20.000 | 79 % | −USD 71 millones | 0 % | no suma gente |
| Motor de empleo grande primero, luego viviendas a demanda | 19.932 – **19.978** – 20.046 | 84 % | −USD 156 millones | 0 % | no suma gente |
| Organismos públicos primero, luego viviendas a demanda | 19.933 – **19.977** – 20.000 | 73 % | −USD 26 millones | 0 % | no suma gente |
| Motor chico + programa de retorno y ayuda de mudanza | 19.929 – **19.976** – 20.000 | 79 % | −USD 81 millones | 0 % | no suma gente |

**Si el objetivo es no perder plata: a demanda, sin motor de empleo.** Se construye cada año lo que pide la llegada del año anterior.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 1.303 | 928 | 2.325 | 890 | 4 |
| 5 | 3.988 | 1.690 | 3.237 | 1.309 | 27 |
| 10 | 9.600 | 4.170 | 7.067 | 2.406 | 72 |
| 15 | 20.007 | 6.993 | 9.326 | 926 | 191 |
| 20 | 19.990 | 6.993 | 12.726 | 12 | 208 |
| 30 | 19.998 | 6.993 | 20.263 | 2 | 200 |

Lo que más pesa en el resultado: nacimientos (correlación 0,98) y cuánto empleo local genera el motor (correlación 0,07).

## Crear polos productivos: Laguna Brava (Capital, Corrientes)

Meta: 50.000 empleos. Hoy hay 90.833 puestos privados en la zona, que crecieron 1,1 % por año; hacia Corrientes se mudan unas 15.533 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Parque completo e incentivos por 10 años | 109.604 – **109.886** – 110.683 | 63 % | −USD 12,9 mil millones | 0 % | no suma gente |
| Parque por etapas e incentivos por 5 años | 109.617 – **109.880** – 110.319 | 62 % | −USD 3,2 mil millones | 0 % | no suma gente |
| **Parque por etapas sin incentivos fiscales** ✔ | 92.651 – **109.711** – 109.980 | 57 % | USD 217 millones | 97 % | referencia |
| Parque por etapas, incentivos 5 años y programa de retorno | 109.610 – **109.883** – 110.367 | 62 % | −USD 3,3 mil millones | 0 % | no suma gente |

**Si el objetivo es no perder plata: parque por etapas sin incentivos fiscales.** Solo infraestructura y suelo; las empresas llegan más despacio.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 4.636 | 3.626 | 21.770 | 3.733 | 9 |
| 5 | 14.177 | 6.970 | 40.295 | 3.713 | 104 |
| 10 | 39.109 | 16.063 | 87.230 | 5.799 | 333 |
| 15 | 71.500 | 27.017 | 133.453 | 6.854 | 646 |
| 20 | 102.785 | 38.348 | 181.012 | 5.748 | 970 |
| 30 | 109.974 | 38.462 | 193.106 | 32 | 1.115 |

Lo que más pesa en el resultado: cuánto empleo local genera el motor (correlación 0,96) y cuánta gente que se muda elige este lugar (correlación 0,21).

