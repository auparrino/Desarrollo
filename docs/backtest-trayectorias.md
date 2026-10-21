# Prueba retrospectiva: ¿el modelo de proceso reproduce los casos exitosos?

Generado con `web/scripts/backtest.ts`. Para cada caso con datos de población y de empleo del motor
(`docs/trayectorias-argentina.md`, `docs/trayectorias-internacionales.md`) se alimenta el modelo de
proceso con lo que pasó de verdad (año de inicio, población inicial, empleos del motor año por año) y se
compara la población simulada con la observada en cada censo.

- **A ciegas:** con los parámetros que usa la app para la Argentina (multiplicador 1,6, llegada espontánea
  de hasta ~4.300 personas por año, crecimiento vegetativo 1 %).
- **Calibrado:** con los parámetros que mejor reproducen la historia (búsqueda en grilla).

El error es el promedio cuadrático del logaritmo del cociente simulado/observado: 0,10 equivale a
errar en un ±10 % en promedio; 0,50, en un ±65 %.

## La Plata (nueva capital de la provincia de Buenos Aires) (Argentina, desde 1882)

Población inicial 6.962; motor de empleo con 6 datos (máximo 1.800 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1884 | 10.407 | 7.261 | 7.362 |
| 1884 | 21.349 | 7.261 | 7.362 |
| 1890 | 65.610 | 15.478 | 28.220 |
| 1895 | 60.991 | 18.837 | 30.454 |
| 1909 | 95.126 | 18.339 | 31.507 |
| 1914 | 137.413 | 18.325 | 31.473 |
| 1947 | 302.073 | 18.318 | 31.455 |

Error a ciegas 1.66; calibrado 1.25, con multiplicador 4, llegada espontánea de hasta 15.000 personas por año y crecimiento vegetativo 3 %.

## Tierra del Fuego: Río Grande y Ushuaia (Ley 19.640) (Argentina, desde 1972)

Población inicial 13.527; motor de empleo con 12 datos (máximo 15.000 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1980 | 27.358 | 17.733 | 21.085 |
| 1991 | 69.369 | 42.494 | 83.022 |
| 2001 | 101.079 | 35.022 | 61.517 |
| 2010 | 127.205 | 53.470 | 122.713 |
| 2022 | 185.732 | 84.952 | 176.376 |

Error a ciegas 0.76; calibrado 0.26, con multiplicador 4, llegada espontánea de hasta 60.000 personas por año y crecimiento vegetativo 3 %.

## Puerto Madryn (ALUAR) (Argentina, desde 1971)

Población inicial 6.115; motor de empleo con 4 datos (máximo 3.400 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1980 | 20.478 | 11.402 | 16.912 |
| 1991 | 44.916 | 12.077 | 19.164 |
| 2001 | 57.571 | 16.867 | 28.098 |
| 2010 | 81.315 | 20.849 | 38.996 |
| 2022 | 97.625 | 27.678 | 52.010 |

Error a ciegas 1.18; calibrado 0.67, con multiplicador 4, llegada espontánea de hasta 2.000 personas por año y crecimiento vegetativo 3 %.

## Neuquén capital y departamento Confluencia (Argentina, desde 1958)

Población inicial 0; motor de empleo con 4 datos (máximo 74.317 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1960 | 16.738 | 0 | 0 |
| 1970 | 43.070 | 867 | 884 |
| 1980 | 90.089 | 53.386 | 74.262 |
| 1991 | 167.296 | 107.839 | 126.855 |
| 2001 | 201.868 | 159.988 | 201.105 |
| 2010 | 231.198 | 210.883 | 249.518 |
| 2022 | 287.787 | 267.680 | 314.384 |

Error a ciegas 3.97; calibrado 3.96, con multiplicador 0.6, llegada espontánea de hasta 30.000 personas por año y crecimiento vegetativo 3 %.

## El Calafate (Glaciar Perito Moreno) (Argentina, desde 2000)

Población inicial 3.101; sin datos de empleo del motor: solo crecimiento espontáneo.

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 2001 | 6.410 | 3.132 | 3.194 |
| 2010 | 16.655 | 3.230 | 3.509 |
| 2022 | 22.844 | 3.252 | 3.594 |

Error a ciegas 1.53; calibrado 1.45, con multiplicador 0.3, llegada espontánea de hasta 500 personas por año y crecimiento vegetativo 3 %.

## Añelo (Vaca Muerta) (Argentina, desde 2013)

Población inicial 2.449; motor de empleo con 1 datos (máximo 71.678 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 2022 | 6.304 | 2.548 | 2.762 |
| 2025 | 8.500 | 6.942 | 7.347 |
| 2026 | 10.000 | 11.309 | 11.946 |

Error a ciegas 0.54; calibrado 0.49, con multiplicador 0.3, llegada espontánea de hasta 4.300 personas por año y crecimiento vegetativo 3 %.

## Brasília (Brasil, desde 1956)

Población inicial 12.283; motor de empleo con 3 datos (máximo 61.698 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1957 | 12.283 | 12.406 | 12.651 |
| 1959 | 64.314 | 12.576 | 13.177 |
| 1960 | 141.742 | 15.654 | 45.232 |
| 1970 | 546.015 | 68.990 | 183.983 |
| 1980 | 1.203.333 | 117.921 | 320.190 |
| 1991 | 1.598.415 | 172.504 | 529.103 |
| 2000 | 2.043.169 | 214.711 | 645.963 |
| 2010 | 2.570.160 | 260.646 | 826.880 |
| 2022 | 2.817.381 | 291.724 | 819.257 |

Error a ciegas 2.04; calibrado 1.16, con multiplicador 4, llegada espontánea de hasta 60.000 personas por año y crecimiento vegetativo 3 %.

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
| 1933 | 8.947 | 8.115 | 12.675 |
| 1947 | 16.905 | 14.801 | 25.646 |
| 1954 | 30.315 | 18.114 | 32.138 |
| 1961 | 58.828 | 32.141 | 58.218 |
| 1966 | 96.032 | 55.290 | 99.249 |
| 1971 | 151.169 | 68.880 | 126.151 |
| 1976 | 207.740 | 82.512 | 150.923 |
| 1981 | 227.581 | 91.862 | 170.081 |
| 1991 | 289.320 | 91.296 | 174.151 |

Error a ciegas 0.69; calibrado 0.30, con multiplicador 4, llegada espontánea de hasta 8.000 personas por año y crecimiento vegetativo 1 %.

## Milton Keynes (Reino Unido, desde 1967)

Población inicial 40.000; motor de empleo con 2 datos (máximo 80.000 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1981 | 125.437 | 42.014 | 46.555 |
| 1991 | 179.200 | 142.188 | 155.643 |
| 1992 | 183.000 | 165.839 | 192.253 |
| 2001 | 207.057 | 187.485 | 210.324 |
| 2001 | 184.506 | 187.485 | 210.324 |
| 2011 | 248.821 | 209.712 | 233.888 |
| 2011 | 211.062 | 209.712 | 233.888 |
| 2021 | 287.060 | 232.736 | 257.499 |
| 2021 | 264.349 | 232.736 | 257.499 |

Error a ciegas 0.39; calibrado 0.34, con multiplicador 2, llegada espontánea de hasta 4.300 personas por año y crecimiento vegetativo 3 %.

## Shenzhen (China, desde 1980)

Población inicial 332.900; motor de empleo con 3 datos (máximo 3.090.000 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 1982 | 449.500 | 343.901 | 374.508 |
| 1985 | 881.500 | 662.918 | 739.834 |
| 1988 | 1.201.400 | 1.443.086 | 1.865.305 |
| 1990 | 1.677.800 | 2.180.797 | 2.825.669 |
| 1993 | 3.359.700 | 3.212.253 | 4.104.650 |
| 1995 | 4.491.500 | 3.948.303 | 5.059.476 |
| 2000 | 7.012.400 | 5.868.478 | 7.825.495 |
| 2005 | 8.277.500 | 5.849.779 | 7.895.266 |
| 2010 | 10.372.000 | 5.859.700 | 8.019.971 |
| 2015 | 11.378.700 | 5.877.860 | 8.217.603 |
| 2020 | 17.560.000 | 5.898.391 | 8.344.075 |

Error a ciegas 0.47; calibrado 0.35, con multiplicador 2, llegada espontánea de hasta 60.000 personas por año y crecimiento vegetativo 3 %.

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
| 1990 | 453.047 | 117.958 | 220.220 |
| 2001 | 619.784 | 126.272 | 220.039 |
| 2011 | 672.651 | 125.863 | 220.022 |
| 2011 | 704.585 | 125.863 | 220.022 |

Error a ciegas 1.49; calibrado 0.92, con multiplicador 4, llegada espontánea de hasta 30.000 personas por año y crecimiento vegetativo 3 %.

## Sejong (Corea del Sur, desde 2007)

Población inicial 0; motor de empleo con 3 datos (máximo 10.452 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 2010 | 81.447 | 0 | 0 |
| 2012 | 115.000 | 867 | 884 |
| 2013 | 117.177 | 5.209 | 13.254 |
| 2015 | 204.088 | 12.909 | 52.365 |
| 2017 | 281.120 | 17.671 | 54.033 |
| 2020 | 353.933 | 23.777 | 53.325 |
| 2024 | 394.630 | 22.620 | 48.798 |
| 2025 | 392.471 | 21.935 | 47.308 |

Error a ciegas 5.01; calibrado 4.65, con multiplicador 4, llegada espontánea de hasta 60.000 personas por año y crecimiento vegetativo 3 %.

## Putrajaya (Malasia, desde 1995)

Población inicial 0; motor de empleo con 1 datos (máximo 300 empleos).

| Año | Observado | Simulado a ciegas | Simulado calibrado |
|---|---|---|---|
| 2000 | 12.240 | 866 | 901 |
| 2007 | 30.000 | 1.857 | 4.064 |
| 2010 | 72.413 | 1.846 | 3.986 |
| 2015 | 88.300 | 1.840 | 3.930 |
| 2020 | 109.202 | 1.837 | 3.910 |
| 2023 | 119.200 | 1.837 | 3.905 |

Error a ciegas 3.59; calibrado 2.93, con multiplicador 4, llegada espontánea de hasta 2.000 personas por año y crecimiento vegetativo 3 %.

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

