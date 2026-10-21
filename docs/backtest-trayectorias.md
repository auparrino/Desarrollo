# Prueba retrospectiva: ¿el modelo de proceso reproduce los casos exitosos?

Generado con `web/scripts/backtest.ts`. Para cada caso con datos de población y de empleo del motor
(`docs/trayectorias-argentina.md`, `docs/trayectorias-internacionales.md`) se alimenta el modelo de
proceso con lo que pasó de verdad (año de inicio, población inicial, empleos del motor año por año) y se
compara la población simulada con la observada en cada censo.

- **A ciegas:** con los parámetros que usa la app para la Argentina (multiplicador 1, llegada espontánea
  de hasta ~4.300 personas por año, crecimiento vegetativo 1 %).
- **Calibrado:** con los parámetros que mejor reproducen la historia (búsqueda en grilla).

El error es el promedio cuadrático del logaritmo del cociente simulado/observado: 0,10 equivale a
errar en un ±10 % en promedio; 0,50, en un ±65 %.

## Brasília (Brasil, desde 1956)

Población inicial 12.283; motor de empleo con 3 datos (máximo 61.698 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1957 | 12.283 | 12.406 | 12.651 |
| 1959 | 64.314 | 12.576 | 13.177 |
| 1960 | 141.742 | 14.976 | 45.232 |
| 1970 | 546.015 | 60.740 | 183.983 |
| 1980 | 1.203.333 | 104.275 | 320.190 |
| 1991 | 1.598.415 | 154.354 | 529.103 |
| 2000 | 2.043.169 | 187.815 | 645.963 |
| 2010 | 2.570.160 | 229.506 | 826.880 |
| 2022 | 2.817.381 | 260.900 | 819.257 |

Error a ciegas 2.14; calibrado 1.16, con multiplicador 4, llegada espontánea de hasta 60.000 personas por año y crecimiento vegetativo 3 %.

## Palmas (Brasil, desde 1989)

Población inicial 3.288; sin datos de empleo del motor: solo crecimiento espontáneo.

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1991 | 24.261 | 3.347 | 3.465 |
| 1996 | 86.116 | 3.411 | 3.673 |
| 2000 | 137.045 | 3.457 | 3.809 |
| 2010 | 228.332 | 3.449 | 3.811 |
| 2022 | 302.692 | 3.448 | 3.807 |

Error a ciegas 3.62; calibrado 3.53, con multiplicador 0.3, llegada espontánea de hasta 500 personas por año y crecimiento vegetativo 3 %.

## Canberra (Australia, desde 1913)

Población inicial 1.777; motor de empleo con 3 datos (máximo 14.600 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1921 | 2.583 | 1.847 | 1.847 |
| 1933 | 8.947 | 7.209 | 12.675 |
| 1947 | 16.905 | 12.574 | 25.646 |
| 1954 | 30.315 | 14.999 | 32.138 |
| 1961 | 58.828 | 25.768 | 58.218 |
| 1966 | 96.032 | 47.644 | 99.249 |
| 1971 | 151.169 | 61.543 | 126.151 |
| 1976 | 207.740 | 72.832 | 150.923 |
| 1981 | 227.581 | 71.311 | 170.081 |
| 1991 | 289.320 | 70.679 | 174.151 |

Error a ciegas 0.85; calibrado 0.30, con multiplicador 4, llegada espontánea de hasta 8.000 personas por año y crecimiento vegetativo 1 %.

## Milton Keynes (Reino Unido, desde 1967)

Población inicial 40.000; motor de empleo con 2 datos (máximo 80.000 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1981 | 125.437 | 42.014 | 46.555 |
| 1991 | 179.200 | 136.599 | 155.643 |
| 1992 | 183.000 | 143.224 | 192.253 |
| 2001 | 207.057 | 169.932 | 210.324 |
| 2001 | 184.506 | 169.932 | 210.324 |
| 2011 | 248.821 | 192.515 | 233.888 |
| 2011 | 211.062 | 192.515 | 233.888 |
| 2021 | 287.060 | 214.850 | 257.499 |
| 2021 | 264.349 | 214.850 | 257.499 |

Error a ciegas 0.42; calibrado 0.34, con multiplicador 2, llegada espontánea de hasta 4.300 personas por año y crecimiento vegetativo 3 %.

## Shenzhen (China, desde 1980)

Población inicial 332.900; motor de empleo con 3 datos (máximo 3.090.000 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1982 | 449.500 | 343.901 | 374.508 |
| 1985 | 881.500 | 641.587 | 739.834 |
| 1988 | 1.201.400 | 1.212.391 | 1.865.305 |
| 1990 | 1.677.800 | 1.791.424 | 2.825.669 |
| 1993 | 3.359.700 | 2.646.793 | 4.104.650 |
| 1995 | 4.491.500 | 3.225.425 | 5.059.476 |
| 2000 | 7.012.400 | 4.685.764 | 7.825.495 |
| 2005 | 8.277.500 | 4.673.495 | 7.895.266 |
| 2010 | 10.372.000 | 4.685.267 | 8.019.971 |
| 2015 | 11.378.700 | 4.703.960 | 8.217.603 |
| 2020 | 17.560.000 | 4.724.645 | 8.344.075 |

Error a ciegas 0.60; calibrado 0.35, con multiplicador 2, llegada espontánea de hasta 60.000 personas por año y crecimiento vegetativo 3 %.

## Gaborone (Botsuana, desde 1964)

Población inicial 3.855; sin datos de empleo del motor: solo crecimiento espontáneo.

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1971 | 17.718 | 3.999 | 4.306 |
| 1981 | 59.657 | 4.046 | 4.476 |
| 1991 | 133.468 | 4.043 | 4.465 |
| 2001 | 186.007 | 4.042 | 4.463 |
| 2011 | 231.626 | 4.042 | 4.463 |
| 2022 | 246.325 | 4.042 | 4.463 |

Error a ciegas 3.41; calibrado 3.31, con multiplicador 0.3, llegada espontánea de hasta 500 personas por año y crecimiento vegetativo 3 %.

## Astaná (Kazajistán, desde 1997)

Población inicial 277.365; sin datos de empleo del motor: solo crecimiento espontáneo.

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1999 | 312.965 | 282.301 | 292.301 |
| 2002 | 493.000 | 286.324 | 305.063 |
| 2009 | 613.006 | 291.451 | 323.711 |
| 2021 | 1.234.042 | 290.873 | 321.321 |
| 2025 | 1.528.703 | 290.850 | 321.203 |

Error a ciegas 1.07; calibrado 0.99, con multiplicador 0.3, llegada espontánea de hasta 30.000 personas por año y crecimiento vegetativo 3 %.

## Belo Horizonte (Brasil, desde 1894)

Población inicial 0; sin datos de empleo del motor: solo crecimiento espontáneo.

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1897 | 10.000 | 0 | 0 |
| 1900 | 13.472 | 0 | 0 |
| 1920 | 55.563 | 0 | 0 |
| 1940 | 211.377 | 0 | 0 |
| 1950 | 352.724 | 0 | 0 |
| 1960 | 693.328 | 0 | 0 |
| 1970 | 1.255.415 | 0 | 0 |

Error a ciegas 11.87; calibrado 11.87, con multiplicador 0.3, llegada espontánea de hasta 0 personas por año y crecimiento vegetativo 1 %.

## Goiânia (Brasil, desde 1933)

Población inicial 0; sin datos de empleo del motor: solo crecimiento espontáneo.

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1940 | 48.166 | 0 | 0 |
| 1950 | 53.389 | 0 | 0 |
| 1960 | 153.505 | 0 | 0 |
| 1970 | 389.784 | 0 | 0 |
| 1980 | 738.117 | 0 | 0 |
| 1991 | 920.840 | 0 | 0 |
| 2000 | 1.090.737 | 0 | 0 |
| 2010 | 1.302.001 | 0 | 0 |

Error a ciegas 12.78; calibrado 12.78, con multiplicador 0.3, llegada espontánea de hasta 0 personas por año y crecimiento vegetativo 1 %.

## Ciudad Guayana (Venezuela, desde 1961)

Población inicial 44.100; motor de empleo con 1 datos (máximo 13.000 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1975 | 225.000 | 84.888 | 214.705 |
| 1990 | 453.047 | 108.101 | 220.220 |
| 2001 | 619.784 | 107.505 | 220.039 |
| 2011 | 672.651 | 107.459 | 220.022 |
| 2011 | 704.585 | 107.459 | 220.022 |

Error a ciegas 1.61; calibrado 0.92, con multiplicador 4, llegada espontánea de hasta 30.000 personas por año y crecimiento vegetativo 3 %.

## Sejong (Corea del Sur, desde 2007)

Población inicial 0; motor de empleo con 3 datos (máximo 10.452 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 2010 | 81.447 | 0 | 0 |
| 2012 | 115.000 | 867 | 884 |
| 2013 | 117.177 | 5.209 | 13.254 |
| 2015 | 204.088 | 12.909 | 52.365 |
| 2017 | 281.120 | 17.671 | 54.033 |
| 2020 | 353.933 | 20.471 | 53.325 |
| 2024 | 394.630 | 18.033 | 48.798 |
| 2025 | 392.471 | 17.376 | 47.308 |

Error a ciegas 5.05; calibrado 4.65, con multiplicador 4, llegada espontánea de hasta 60.000 personas por año y crecimiento vegetativo 3 %.

## Putrajaya (Malasia, desde 1995)

Población inicial 0; motor de empleo con 1 datos (máximo 300 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 2000 | 12.240 | 866 | 901 |
| 2007 | 30.000 | 1.489 | 4.064 |
| 2010 | 72.413 | 1.451 | 3.986 |
| 2015 | 88.300 | 1.425 | 3.930 |
| 2020 | 109.202 | 1.416 | 3.910 |
| 2023 | 119.200 | 1.414 | 3.905 |

Error a ciegas 3.81; calibrado 2.93, con multiplicador 4, llegada espontánea de hasta 2.000 personas por año y crecimiento vegetativo 3 %.

## Chandigarh (India, desde 1951)

Población inicial 24.261; sin datos de empleo del motor: solo crecimiento espontáneo.

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1961 | 119.881 | 25.270 | 27.453 |
| 1971 | 257.251 | 25.450 | 28.130 |
| 1981 | 451.610 | 25.440 | 28.093 |
| 1991 | 642.015 | 25.439 | 28.088 |
| 2001 | 900.635 | 25.439 | 28.088 |
| 2011 | 1.055.450 | 25.439 | 28.088 |

Error a ciegas 2.97; calibrado 2.88, con multiplicador 0.3, llegada espontánea de hasta 2.000 personas por año y crecimiento vegetativo 3 %.

