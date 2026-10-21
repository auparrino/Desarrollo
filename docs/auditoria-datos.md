# Auditoría de datos

Grilla generada el 2026-10-21: 95,682 celdas H3 res 6. Se genera con `python pipeline/audit.py`.

## 1. Cobertura y rangos

| Variable | Faltantes | Mín | P50 | Máx | Fuera de rango |
|---|---|---|---|---|---|
| elev | 31 | -97.3 | 255 | 6.34e+03 | 0 |
| pend_media | 190 | 0 | 0.575 | 181 | 4 |
| frac_pend_ok | 0 | 0 | 1 | 1 | 0 |
| t_media | 13 | -10.7 | 15.4 | 24 | 0 |
| t_max_cal | 13 | -0.888 | 30.6 | 35.5 | 0 |
| t_min_fri | 13 | -19.7 | 1.4 | 12.5 | 0 |
| prec | 13 | 36 | 559 | 1.98e+03 | 0 |
| prec_estac | 13 | 10.1 | 46 | 128 | 0 |
| hdd18 | 13 | 1.39 | 1.46e+03 | 1.05e+04 | 5 |
| cdd18 | 13 | 0 | 490 | 2.18e+03 | 0 |
| ghi | 13 | 2.07 | 4.61 | 5.96 | 0 |
| aridez | 0 | 0 | 0.375 | 2.46 | 0 |
| pga475 | 6 | 0 | 0.0238 | 0.839 | 0 |
| frac_inund100 | 0 | 0 | 0 | 1 | 0 |
| t_ciudad | 88 | 0 | 157 | 2.09e+03 | 0 |
| t_salud | 88 | 0 | 89.8 | 1.89e+03 | 0 |
| viento100 | 3 | 1.41 | 6.95 | 39.5 | 2 |
| pob | 0 | 0 | 17.8 | 6.01e+05 | 0 |
| pob_50km | 0 | 109 | 2.19e+04 | 1.53e+07 | 0 |
| crec_dep | 0 | -2.67 | 1.14 | 4.43 | 0 |
| frac_ap_estricta | 0 | 0 | 0 | 1 | 0 |
| frac_ap_uso_multiple | 0 | 0 | 0 | 1 | 0 |
| d_ruta | 0 | 0.000319 | 24.1 | 249 | 0 |
| d_ffcc | 0 | 0.00334 | 62.3 | 531 | 0 |
| d_alta_tension | 0 | 6.88e-05 | 31.2 | 518 | 0 |
| d_puerto | 0 | 0.275 | 239 | 970 | 0 |
| d_rio10 | 0 | 0.000177 | 25.9 | 302 | 0 |
| d_rio100 | 0 | 0.000177 | 74.8 | 601 | 0 |
| d_localidad | 0 | 0.067 | 18.8 | 250 | 0 |
| q_rio25 | 0 | 0 | 8.89 | 1.93e+04 | 0 |
| d_amba | 0 | 2.32 | 926 | 2.34e+03 | 0 |
| frac_tierra | 0 | 0.0135 | 0.554 | 1 | 0 |
| d_media_pob | 0 | 485 | 882 | 2.48e+03 | 0 |
| d_max_capital | 0 | 1.7e+03 | 2.48e+03 | 3.68e+03 | 0 |
| d_metro | 0 | 0 | 354 | 2.28e+03 | 0 |
| as_prob | 426 | 0.00853 | 0.361 | 0.997 | 0 |
| f_prob | 358 | 0.00187 | 0.252 | 0.954 | 0 |
| pct_fiscal_eap | 789 | 0 | 0.28 | 100 | 0 |
| pct_dep_en_eap | 10 | 0 | 62 | 100 | 0 |
| pct_extranjero | 28 | 0 | 2.47 | 59.8 | 0 |
| d_comunidad | 0 | 0.165 | 67.2 | 425 | 0 |
| empleo_50km | 0 | 0 | 1.65e+03 | 1.89e+06 | 0 |
| emp_crec | 3410 | -4.32 | 0.508 | 19.1 | 0 |
| salario_rel | 3060 | 0.463 | 0.822 | 2.23 | 0 |
| n_proyectos_100km | 0 | 0 | 0 | 68 | 0 |
| d_parque_ind | 0 | 0.233 | 69.6 | 385 | 0 |
| pct_agua_red | 0 | 1.71 | 87.6 | 98.8 | 0 |
| pct_cloaca | 0 | 0.16 | 47.5 | 99.4 | 0 |
| pct_internet | 0 | 9.19 | 69.3 | 94.7 | 0 |
| pct_nbi | 0 | 1.54 | 6.47 | 39.9 | 0 |
| pct_viv_ociosas | 0 | 0.76 | 7.24 | 64.4 | 0 |
| salud_int_100mil | 0 | 0 | 15.8 | 124 | 0 |
| crec_proy_2035 | 0 | -16.7 | 2.06 | 24.3 | 0 |
| viv_ociosas_50km | 0 | 4.89 | 647 | 2.2e+05 | 0 |
| d_universidad | 0 | 0.0426 | 54.1 | 303 | 0 |
| d_hospital | 0 | 0.0653 | 28.5 | 300 | 0 |

## 2. Coherencia interna

| Control | Resultado |
|---|---|
| t_min_fri ≤ t_media ≤ t_max_cal (celdas que no cumplen) | 0 |
| HDD18 decrece con la temperatura (corr. Spearman) | -0.996 |
| d_rio100 ≥ d_rio10 | 0 |
| pob_50km ≥ pob | 0 |
| Fracción de celdas con >100.000 hab. a <15 min de una ciudad | 1.0 |

## 3. Conservación de la población censal

Total de la grilla: 45,618,784. Censo 2022 en viviendas particulares: 45,618,784 (diferencia +0.000 %).

El reparto se hace píxel a píxel, así que el total departamental se conserva. Cada celda se rotula con el departamento que ocupa la mayor parte de su superficie: los departamentos más chicos que una celda (comunas de CABA, partidos del conurbano) quedan rotulados dentro de sus vecinos. Para análisis departamentales se usa departamentos.geojson, que tiene los totales censales exactos.

Diferencia máxima por provincia según el rótulo de las celdas: 8.6 % (efecto de borde de ese rótulo, no pérdida de población).

El total oficial del Censo 2022 (46.044.703) incluye viviendas colectivas y personas en situación de calle; la grilla usa la población en viviendas particulares, que es la que está disponible por radio censal.

## 4. Ciudades de control

Valores en la celda que contiene el centro de cada ciudad. Sirve para detectar errores groseros y para ver qué restricciones afectarían a ciudades que existen y funcionan.

| Ciudad | T media °C | Precip. mm | PGA g | Río ≤25 km m³/s | Min. a ciudad | Restricciones que la excluirían |
|---|---|---|---|---|---|---|
| CABA | 17.4 | 1116 | 0.00 | 28 | 0 | — |
| Córdoba | 17.2 | 832 | 0.10 | 11 | 0 | — |
| Rosario | 17.5 | 983 | 0.00 | 18243 | 7 | R03 |
| Mendoza | 16.4 | 257 | 0.49 | 55 | 0 | R06 |
| San Miguel de Tucumán | 20.1 | 962 | 0.27 | 50 | 0 | — |
| La Plata | 16.5 | 1086 | 0.00 | 6 | 0 | — |
| Mar del Plata | 14.2 | 923 | 0.00 | 5 | 0 | — |
| Salta | 17.3 | 741 | 0.30 | 3 | 0 | — |
| Santa Fe | 18.6 | 1035 | 0.00 | 19313 | 3 | R03 |
| San Juan | 17.6 | 278 | 0.50 | 44 | 0 | R03, R06 |
| Resistencia | 21.1 | 1397 | 0.01 | 18747 | 0 | R03 |
| Neuquén | 14.7 | 295 | 0.02 | 1106 | 0 | R03 |
| Corrientes | 21.1 | 1448 | 0.01 | 18747 | 6 | — |
| Posadas | 21.5 | 1785 | 0.00 | 13098 | 5 | R03 |
| Bahía Blanca | 15.2 | 690 | 0.00 | 5 | 0 | R13 |
| Paraná | 18.3 | 1079 | 0.00 | 19313 | 2 | — |
| San Salvador de Jujuy | 17.0 | 830 | 0.30 | 28 | 2 | — |
| Formosa | 22.2 | 1417 | 0.02 | 4621 | 2 | R03 |
| Santiago del Estero | 20.6 | 655 | 0.22 | 124 | 0 | R03 |
| San Luis | 17.2 | 453 | 0.15 | 0 | 0 | R13 |
| La Rioja | 19.1 | 375 | 0.37 | 1 | 0 | R06, R13 |
| Catamarca | 20.3 | 529 | 0.30 | 3 | 1 | R13 |
| Santa Rosa | 15.8 | 697 | 0.01 | 0 | 1 | R13 |
| Río Gallegos | 7.5 | 254 | 0.04 | 80 | 2 | — |
| Comodoro Rivadavia | 12.5 | 244 | 0.00 | 0 | 0 | R13 |
| Trelew | 13.6 | 209 | 0.00 | 239 | 5 | — |
| Viedma | 14.5 | 368 | 0.00 | 870 | 1 | R03 |
| Ushuaia | 5.0 | 492 | 0.07 | 13 | 432 | — |
| Río Cuarto | 16.5 | 826 | 0.10 | 2 | 0 | — |
| Bariloche | 8.8 | 952 | 0.23 | 164 | 205 | R01 |

## 5. Población actual dentro de cada restricción

Si una restricción abarca a mucha población que vive hoy allí, el umbral puede ser demasiado severo, o bien señala un riesgo real que esa población ya soporta.

| Restricción | Celdas | % del país | Población 2022 dentro | % de la población |
|---|---|---|---|---|
| R01 Área protegida estricta | 3,131 | 3.3 | 215,542 | 0.5 |
| R03 Inundación T100 | 9,555 | 10.0 | 6,520,413 | 14.3 |
| R04 Pendiente | 5,263 | 5.5 | 408,983 | 0.9 |
| R06 Sismicidad | 8,652 | 9.0 | 3,340,139 | 7.3 |
| R09 Altitud | 6,955 | 7.3 | 171,415 | 0.4 |
| R10 Costa baja | 1,112 | 1.2 | 332,427 | 0.7 |
| R13 Agua | 36,173 | 37.8 | 3,711,434 | 8.1 |

## 6. Observaciones

- `pend_media`: 4 celdas fuera del rango plausible [0, 100].
- `hdd18`: 5 celdas fuera del rango plausible [0, 10000].
- `viento100`: 2 celdas fuera del rango plausible [0, 25].
- Hay 9 celdas con más de 50.000 habitantes que R13 (agua) excluiría. Las ciudades áridas existentes se abastecen de ríos regulados, acueductos o agua subterránea, que el sustituto no capta.
- Hay 28 celdas con más de 50.000 habitantes dentro de la planicie T100 del JRC. El mapa global no considera las defensas existentes, así que sobreestima la exposición en ciudades con terraplenes, como Resistencia o Santa Fe; a la vez subestima el anegamiento pampeano.
- La pendiente calculada sobre un MDE de 1 km es baja aun en la sierra: el 95 % de las celdas tiene una pendiente media de 16 % o menos. Por eso R04 usa la fracción de la celda con pendiente ≤15 %.
- HydroRIVERS es un caudal modelado: se valida contra aforos en docs/datos-hidrologia.md.
