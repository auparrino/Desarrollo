# Simulaciones de proceso: cómo conviene hacerlo

Generado con `web/scripts/simular.ts` sobre el modelo `web/src/model/proceso.ts`. Para el caso de
cada instrumento (el mismo de `docs/casos-concretos.md`) se simulan varias estrategias año por año
durante 30 años, 800 veces cada una, variando lo que no se sabe con certeza:

| Parámetro incierto | Rango | Fuente |
|---|---|---|
| Empleos locales por cada empleo del motor | 0,5 a 1,6 | Moretti (2010) |
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

- **Crear una ciudad nueva** (Sarmiento, meta 500.000): para no perder plata, *organismos públicos primero, luego viviendas a demanda* (33.626 habitantes al año 30, 100 % de probabilidad de saldo positivo). Para poblar, *organismos públicos primero, luego viviendas a demanda*: 33.626 habitantes, y además mejora el saldo. Lo peor: *viviendas primero* (−USD 10,4 mil millones).
- **Trasladar la capital** (Senillosa, meta 500.000): para no perder plata, *traslado gradual con radicación de las familias* (119.128 habitantes al año 30, 24 % de probabilidad de saldo positivo). Para poblar, *traslado gradual con radicación de las familias*: 119.128 habitantes, y además mejora el saldo. Lo peor: *traslado rápido y viviendas para todos al inicio* (−USD 4,3 mil millones).
- **Fortalecer ciudades intermedias** (Gran San Nicolás de los Arroyos, meta 100.000): para no perder plata, *a demanda, sin motor de empleo* (61.803 habitantes al año 30, 0 % de probabilidad de saldo positivo). Para poblar, *organismos públicos primero, luego viviendas a demanda*: 71.844 habitantes, a unos USD 13.753 por habitante adicional. Lo peor: *viviendas primero* (−USD 1,2 mil millones).
- **Repoblar pueblos** (Punta Alta, meta 20.000): para no perder plata, *a demanda, sin motor de empleo* (19.978 habitantes al año 30, 0 % de probabilidad de saldo positivo). Lo peor: *motor de empleo grande primero, luego viviendas a demanda* (−USD 197 millones).
- **Crear polos productivos** (Laguna Brava, meta 50.000): para no perder plata, *parque por etapas sin incentivos fiscales* (96.144 habitantes al año 30, 72 % de probabilidad de saldo positivo). Para poblar, *parque por etapas e incentivos por 5 años*: 109.852 habitantes, a unos USD 251.675 por habitante adicional. Lo peor: *parque completo e incentivos por 10 años* (−USD 13,1 mil millones).

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
| Motor de empleo chico primero, luego viviendas a demanda | 20.555 – **26.578** – 32.690 | 43 % | −USD 1,1 mil millones | 0 % | USD 34.048 |
| Motor de empleo grande primero, luego viviendas a demanda | 42.189 – **52.365** – 64.879 | 46 % | −USD 2,8 mil millones | 0 % | USD 49.298 |
| **Organismos públicos primero, luego viviendas a demanda** ✔ | 27.556 – **33.626** – 39.663 | 43 % | USD 413 millones | 100 % | gana |
| Motor chico + programa de retorno y ayuda de mudanza | 22.323 – **29.724** – 37.404 | 43 % | −USD 1,1 mil millones | 0 % | USD 29.208 |

**Si el objetivo es no perder plata: organismos públicos primero, luego viviendas a demanda.** Traslado de 22.500 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales.

**Si el objetivo es poblar: organismos públicos primero, luego viviendas a demanda.** Traslado de 22.500 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales. Suma 33.626 habitantes más que la referencia y cada uno le cuesta al país unos USD 0 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 867 | 1.662 | 7.667 | 858 | 0 |
| 5 | 8.289 | 4.258 | 19.077 | 3.464 | 48 |
| 10 | 27.067 | 10.671 | 47.524 | 3.900 | 231 |
| 15 | 29.155 | 10.671 | 45.862 | 416 | 287 |
| 20 | 30.867 | 10.830 | 45.972 | 349 | 305 |
| 30 | 33.158 | 11.627 | 46.034 | 362 | 328 |

Lo que más pesa en el resultado: cuánto empleo local genera el motor (correlación 0,86) y cuánta gente que se muda elige este lugar (correlación 0,44).

## Trasladar la capital: Senillosa (El Cuy, Río Negro)

Meta: 500.000 habitantes. Hoy hay 76.122 puestos privados en la zona, que crecieron 1 % por año; hacia Río Negro se mudan unas 14.896 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Traslado rápido y viviendas para todos al inicio | 125.362 – **158.832** – 191.166 | 72 % | −USD 4,3 mil millones | 0 % | USD 64.079 |
| Traslado rápido, viviendas a demanda | 64.431 – **80.839** – 97.258 | 51 % | −USD 482 millones | 0 % | no suma gente |
| Traslado gradual (12 años), viviendas a demanda | 77.915 – **95.814** – 114.875 | 45 % | −USD 278 millones | 0 % | referencia |
| Traslado rápido con radicación de las familias | 82.375 – **100.313** – 118.918 | 41 % | −USD 388 millones | 0 % | no suma gente |
| **Traslado gradual con radicación de las familias** ✔ | 102.433 – **119.128** – 140.307 | 39 % | −USD 104 millones | 24 % | gana |

**Si el objetivo es no perder plata: traslado gradual con radicación de las familias.** 12 años; vivienda y ayuda de mudanza para que el 85 % se mude.

**Si el objetivo es poblar: traslado gradual con radicación de las familias.** 12 años; vivienda y ayuda de mudanza para que el 85 % se mude. Suma 23.314 habitantes más que la referencia y cada uno le cuesta al país unos USD 0 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 1.544 | 4.190 | 18.046 | 1.529 | 0 |
| 5 | 18.325 | 10.073 | 42.061 | 6.176 | 121 |
| 10 | 62.555 | 23.986 | 100.033 | 10.574 | 519 |
| 15 | 109.006 | 39.843 | 146.277 | 894 | 1.081 |
| 20 | 113.464 | 39.843 | 148.667 | 894 | 1.126 |
| 30 | 118.347 | 41.550 | 153.941 | 505 | 1.178 |

Lo que más pesa en el resultado: cuánto empleo local genera el motor (correlación 0,93) y cuánta gente que se muda elige este lugar (correlación 0,28).

## Fortalecer ciudades intermedias: Gran San Nicolás de los Arroyos (San Nicolás, Buenos Aires)

Meta: 100.000 habitantes. Hoy hay 311.579 puestos privados en la zona, que crecieron 0,5 % por año; hacia Buenos Aires se mudan unas 173.024 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Viviendas primero | 65.141 – **67.317** – 68.291 | 83 % | −USD 1,2 mil millones | 0 % | no suma gente |
| Por etapas, sin motor de empleo | 65.128 – **65.293** – 68.713 | 72 % | −USD 294 millones | 0 % | no suma gente |
| **A demanda, sin motor de empleo** ✔ | 60.727 – **61.803** – 62.982 | 62 % | −USD 139 millones | 0 % | referencia |
| Motor de empleo chico primero, luego viviendas a demanda | 68.993 – **70.793** – 72.162 | 77 % | −USD 562 millones | 0 % | USD 47.055 |
| Motor de empleo grande primero, luego viviendas a demanda | 73.993 – **76.534** – 78.912 | 72 % | −USD 1,1 mil millones | 0 % | USD 67.569 |
| Organismos públicos primero, luego viviendas a demanda | 70.165 – **71.844** – 73.023 | 71 % | −USD 277 millones | 0 % | USD 13.753 |
| Motor chico + programa de retorno y ayuda de mudanza | 80.205 – **85.194** – 90.727 | 81 % | −USD 644 millones | 0 % | USD 21.584 |

**Si el objetivo es no perder plata: a demanda, sin motor de empleo.** Se construye cada año lo que pide la llegada del año anterior.

**Si el objetivo es poblar: organismos públicos primero, luego viviendas a demanda.** Traslado de 4.500 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales. Suma 10.041 habitantes más que la referencia y cada uno le cuesta al país unos USD 13.753 en valor presente.

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
| Motor de empleo chico primero, luego viviendas a demanda | 19.929 – **19.979** – 20.000 | 78 % | −USD 88 millones | 0 % | no suma gente |
| Motor de empleo grande primero, luego viviendas a demanda | 19.932 – **19.978** – 20.047 | 83 % | −USD 197 millones | 0 % | no suma gente |
| Organismos públicos primero, luego viviendas a demanda | 19.933 – **19.977** – 20.000 | 72 % | −USD 29 millones | 0 % | no suma gente |
| Motor chico + programa de retorno y ayuda de mudanza | 19.929 – **19.976** – 20.000 | 78 % | −USD 97 millones | 0 % | no suma gente |

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
| Parque completo e incentivos por 10 años | 101.821 – **109.808** – 110.332 | 52 % | −USD 13,1 mil millones | 0 % | USD 961.693 |
| Parque por etapas e incentivos por 5 años | 109.565 – **109.852** – 109.998 | 51 % | −USD 3,4 mil millones | 0 % | USD 251.675 |
| **Parque por etapas sin incentivos fiscales** ✔ | 77.453 – **96.144** – 109.865 | 47 % | USD 64 millones | 72 % | referencia |
| Parque por etapas, incentivos 5 años y programa de retorno | 109.584 – **109.868** – 109.999 | 52 % | −USD 3,4 mil millones | 0 % | USD 253.921 |

**Si el objetivo es no perder plata: parque por etapas sin incentivos fiscales.** Solo infraestructura y suelo; las empresas llegan más despacio.

**Si el objetivo es poblar: parque por etapas e incentivos por 5 años.** Lotes a medida que se venden; incentivos acotados a 5 años. Suma 13.708 habitantes más que la referencia y cada uno le cuesta al país unos USD 251.675 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 4.636 | 2.895 | 16.714 | 3.733 | 9 |
| 5 | 12.087 | 5.500 | 31.204 | 3.734 | 83 |
| 10 | 30.662 | 12.866 | 68.845 | 3.642 | 270 |
| 15 | 56.588 | 21.033 | 104.149 | 6.186 | 503 |
| 20 | 79.861 | 30.115 | 142.436 | 3.515 | 763 |
| 30 | 91.940 | 32.427 | 153.358 | 263 | 949 |

Lo que más pesa en el resultado: cuánto empleo local genera el motor (correlación 0,91) y cuánta gente que se muda elige este lugar (correlación 0,35).

