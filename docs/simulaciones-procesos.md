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

- **Crear una ciudad nueva** (Senillosa, meta 500.000): para no perder plata, *a demanda, sin motor de empleo* (15.993 habitantes al año 30, 0 % de probabilidad de saldo positivo). Para poblar, *organismos públicos primero, luego viviendas a demanda*: 41.327 habitantes, a unos USD 136 por habitante adicional. Lo peor: *viviendas primero* (−USD 7,7 mil millones).
- **Trasladar la capital** (Senillosa, meta 500.000): para no perder plata, *traslado gradual con radicación de las familias* (141.793 habitantes al año 30, 63 % de probabilidad de saldo positivo). Para poblar, *traslado gradual con radicación de las familias*: 141.793 habitantes, y además mejora el saldo. Lo peor: *traslado rápido y viviendas para todos al inicio* (−USD 2,9 mil millones).
- **Fortalecer ciudades intermedias** (Gran Paraná, meta 100.000): para no perder plata, *a demanda, sin motor de empleo* (20.176 habitantes al año 30, 0 % de probabilidad de saldo positivo). Para poblar, *por etapas, sin motor de empleo*: 29.407 habitantes, a unos USD 19.109 por habitante adicional. Lo peor: *viviendas primero* (−USD 1,4 mil millones).
- **Repoblar pueblos** (Correa, meta 20.000): para no perder plata, *a demanda, sin motor de empleo* (3.523 habitantes al año 30, 0 % de probabilidad de saldo positivo). Para poblar, *organismos públicos primero, luego viviendas a demanda*: 7.844 habitantes, a unos USD 7.672 por habitante adicional. Lo peor: *motor de empleo grande primero, luego viviendas a demanda* (−USD 206 millones).
- **Crear polos productivos** (Laguna Brava, meta 50.000): para no perder plata, *parque por etapas sin incentivos fiscales* (109.711 habitantes al año 30, 97 % de probabilidad de saldo positivo). Lo peor: *parque completo e incentivos por 10 años* (−USD 12,9 mil millones).

## Procesos óptimos: lo que se repite en todas las simulaciones

1. **No construir por adelantado.** "Viviendas primero" es siempre la peor estrategia: la gente no llega más rápido por haber casas, llega si hay trabajo, y las viviendas vacías cuestan. Se construye a demanda o por etapas chicas.
2. **El empleo pone el ritmo, no la vivienda.** Sin un motor de empleo, un lugar nuevo crece como mucho al ritmo del flujo migratorio habitual (unos cientos de personas por año), y donde el empleo de la zona no crece directamente no llega nadie. Con el mejor motor, una ciudad nueva llega a unas decenas de miles de personas en 30 años, no a 500.000. Una meta realista para una ciudad nueva sin un motor excepcional es de decenas de miles de habitantes, no de cientos de miles.
3. **El motor de empleo más barato es público y permanente.** Trasladar o crear organismos, una universidad u hospitales regionales cuesta una vez (oficinas y mudanza, unos USD 23.000 por puesto) y suma gente a un costo muy bajo por habitante. Los incentivos fiscales por empleo, al nivel de los regímenes de promoción (unos USD 51.000 por puesto por año), no se pagan en ningún caso simulado.
4. **Capital: trasladar de a un ministerio y que las familias se muden.** El traslado gradual (12 años) con vivienda y ayuda para que el 85 % de los agentes se mude con su familia es el mejor proceso. Si el traslado va más rápido que la construcción, los agentes no encuentran dónde vivir y terminan viajando, como en Brasilia y en Putrajaya.
5. **Polos: urbanizar por etapas y sin incentivos fiscales.** El parque se urbaniza a medida que se venden los lotes; lo que hace falta son compromisos de inversión firmados, no exenciones por empleo.
6. **Lo que más define el resultado es el atractivo del lugar.** En los lugares sin motor, el resultado depende casi por completo de qué parte de quienes se mudan elige ese lugar. Servicios, conexión y programas de retorno para quienes nacieron en la región son la palanca; en la capital manda el empleo que genera el traslado.
7. **Donde la zona es menos productiva que el AMBA, el proceso no lo arregla.** En ciudades intermedias y pueblos de zonas con salarios más bajos que el AMBA el saldo es negativo con cualquier estrategia: es una decisión de equilibrio territorial, no de rentabilidad.

El "proceso óptimo" es la estrategia con mayor saldo mediano; se muestran también la probabilidad
de que el saldo sea positivo y lo que más pesa en el resultado.

## Crear una ciudad nueva: Senillosa (Confluencia, Neuquén)

Meta: 500.000 habitantes. Hoy hay 144.894 puestos privados en la zona, que crecieron 1 % por año; hacia Neuquén se mudan unas 13.742 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Viviendas primero | 11.257 – **27.645** – 42.720 | 99 % | −USD 7,7 mil millones | 0 % | USD 654.435 |
| Por etapas, sin motor de empleo | 11.836 – **26.855** – 42.025 | 96 % | −USD 1 mil millones | 0 % | USD 85.857 |
| **A demanda, sin motor de empleo** ✔ | 6.999 – **15.993** – 23.530 | 29 % | −USD 94 millones | 0 % | referencia |
| Motor de empleo chico primero, luego viviendas a demanda | 25.075 – **34.830** – 44.091 | 34 % | −USD 1,2 mil millones | 0 % | USD 57.555 |
| Motor de empleo grande primero, luego viviendas a demanda | 48.788 – **62.204** – 79.243 | 43 % | −USD 2,9 mil millones | 0 % | USD 60.064 |
| Organismos públicos primero, luego viviendas a demanda | 30.610 – **41.327** – 51.354 | 36 % | −USD 97 millones | 0 % | USD 136 |
| Motor chico + programa de retorno y ayuda de mudanza | 27.991 – **40.746** – 53.641 | 35 % | −USD 1,2 mil millones | 0 % | USD 43.557 |

**Si el objetivo es no perder plata: a demanda, sin motor de empleo.** Se construye cada año lo que pide la llegada del año anterior.

**Si el objetivo es poblar: organismos públicos primero, luego viviendas a demanda.** Traslado de 17.308 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales. Suma 25.335 habitantes más que la referencia y cada uno le cuesta al país unos USD 136 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 833 | 617 | 2.295 | 825 | 0 |
| 5 | 1.766 | 899 | 4.339 | 100 | 17 |
| 10 | 4.410 | 1.569 | 8.089 | 821 | 36 |
| 15 | 6.303 | 2.495 | 12.849 | 75 | 62 |
| 20 | 8.949 | 3.155 | 17.026 | 825 | 81 |
| 30 | 13.482 | 4.740 | 26.933 | 825 | 127 |

Lo que más pesa en el resultado: cuánta gente que se muda elige este lugar (correlación 1) y cuánto empleo local genera el motor (correlación -0,06).

## Trasladar la capital: Senillosa (El Cuy, Río Negro)

Meta: 500.000 habitantes. Hoy hay 76.122 puestos privados en la zona, que crecieron 1 % por año; hacia Río Negro se mudan unas 14.896 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Traslado rápido y viviendas para todos al inicio | 152.169 – **199.409** – 245.817 | 63 % | −USD 2,9 mil millones | 0 % | USD 35.194 |
| Traslado rápido, viviendas a demanda | 77.063 – **99.512** – 122.293 | 62 % | −USD 229 millones | 19 % | no suma gente |
| Traslado gradual (12 años), viviendas a demanda | 92.920 – **119.078** – 147.141 | 57 % | −USD 88 millones | 34 % | referencia |
| Traslado rápido con radicación de las familias | 94.738 – **118.934** – 142.894 | 51 % | −USD 163 millones | 27 % | no suma gente |
| **Traslado gradual con radicación de las familias** ✔ | 117.812 – **141.793** – 171.186 | 46 % | USD 66 millones | 63 % | gana |

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

## Fortalecer ciudades intermedias: Gran Paraná (Paraná, Entre Ríos)

Meta: 100.000 habitantes. Hoy hay 162.200 puestos privados en la zona, que crecieron 0,5 % por año; hacia Entre Ríos se mudan unas 17.973 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Viviendas primero | 15.221 – **29.473** – 30.747 | 95 % | −USD 1,4 mil millones | 0 % | USD 139.667 |
| Por etapas, sin motor de empleo | 16.042 – **29.407** – 30.070 | 87 % | −USD 258 millones | 0 % | USD 19.109 |
| **A demanda, sin motor de empleo** ✔ | 9.245 – **20.176** – 27.708 | 41 % | −USD 82 millones | 0 % | referencia |
| Motor de empleo chico primero, luego viviendas a demanda | 12.201 – **22.695** – 34.654 | 49 % | −USD 395 millones | 0 % | USD 124.254 |
| Motor de empleo grande primero, luego viviendas a demanda | 17.682 – **28.787** – 40.638 | 56 % | −USD 868 millones | 0 % | USD 91.311 |
| Organismos públicos primero, luego viviendas a demanda | 13.294 – **23.801** – 35.052 | 46 % | −USD 182 millones | 0 % | USD 27.530 |
| Motor chico + programa de retorno y ayuda de mudanza | 15.086 – **31.573** – 46.798 | 59 % | −USD 440 millones | 0 % | USD 31.385 |

**Si el objetivo es no perder plata: a demanda, sin motor de empleo.** Se construye cada año lo que pide la llegada del año anterior.

**Si el objetivo es poblar: por etapas, sin motor de empleo.** Etapas del 20 % de la meta, cada una cuando la anterior está ocupada en un 80 %. Suma 9.232 habitantes más que la referencia y cada uno le cuesta al país unos USD 19.109 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 1.189 | 560 | 1.420 | 320 | 9 |
| 5 | 2.383 | 976 | 2.236 | 769 | 16 |
| 10 | 5.176 | 2.083 | 4.541 | 402 | 48 |
| 15 | 8.351 | 3.056 | 6.488 | 789 | 76 |
| 20 | 11.122 | 4.169 | 8.912 | 383 | 107 |
| 30 | 17.065 | 6.255 | 13.491 | 361 | 167 |

Lo que más pesa en el resultado: cuánta gente que se muda elige este lugar (correlación -0,98) y cuánto empleo local genera el motor (correlación 0,05).

## Repoblar pueblos: Correa (Iriondo, Santa Fe)

Meta: 20.000 habitantes. Hoy hay 310.304 puestos privados en la zona, que crecieron 0 % por año; hacia Santa Fe se mudan unas 35.985 personas por año (de otras provincias y entre departamentos).

| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |
|---|---|---|---|---|---|
| Viviendas primero | 3.674 – **3.754** – 3.794 | 88 % | −USD 140 millones | 0 % | no suma gente |
| Por etapas, sin motor de empleo | 3.903 – **3.949** – 4.012 | 92 % | −USD 28 millones | 0 % | USD 34.936 |
| **A demanda, sin motor de empleo** ✔ | 3.516 – **3.523** – 3.570 | 53 % | −USD 13 millones | 0 % | referencia |
| Motor de empleo chico primero, luego viviendas a demanda | 6.688 – **7.853** – 9.035 | 65 % | −USD 93 millones | 0 % | USD 18.393 |
| Motor de empleo grande primero, luego viviendas a demanda | 11.673 – **14.253** – 17.133 | 77 % | −USD 206 millones | 0 % | USD 17.982 |
| Organismos públicos primero, luego viviendas a demanda | 6.719 – **7.844** – 8.994 | 52 % | −USD 47 millones | 0 % | USD 7.672 |
| Motor chico + programa de retorno y ayuda de mudanza | 6.730 – **7.850** – 9.015 | 66 % | −USD 97 millones | 0 % | USD 19.260 |

**Si el objetivo es no perder plata: a demanda, sin motor de empleo.** Se construye cada año lo que pide la llegada del año anterior.

**Si el objetivo es poblar: organismos públicos primero, luego viviendas a demanda.** Traslado de 692 empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales. Suma 4.320 habitantes más que la referencia y cada uno le cuesta al país unos USD 7.672 en valor presente.

Cómo evoluciona (valores centrales):

| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |
|---|---|---|---|---|---|
| 3 | 259 | 161 | 160 | 43 | 2 |
| 5 | 431 | 161 | 266 | 86 | 3 |
| 10 | 959 | 506 | 790 | 282 | 7 |
| 15 | 1.815 | 636 | 821 | 121 | 17 |
| 20 | 2.547 | 940 | 1.170 | 310 | 22 |
| 30 | 3.537 | 1.237 | 1.649 | 14 | 36 |

Lo que más pesa en el resultado: nacimientos (correlación -0,6) y cuánta gente que se muda elige este lugar (correlación -0,08).

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

