# Hallazgos preliminares

> Estos resultados se generan con `web/scripts/escenarios.ts`; los números exactos están en [`resultados.json`](resultados.json).
> Los parámetros son los de la app por defecto: población objetivo de 500.000 habitantes, densidad de 75 hab/ha y las restricciones de [`metodologia.md`](metodologia.md) §3.
> Son **resultados de pre-factibilidad regional**, condicionados por las limitaciones de datos de la §6 de la metodología. No son una recomendación de localización.

## 1. Cuánto territorio queda después de las restricciones

De 95.059 celdas, **41.644 (44 %) pasan todas las restricciones**. Las que más excluyen son estas:

- **Suficiencia hídrica (R13):** buena parte de la meseta patagónica, la Puna, el oeste árido y el Chaco seco no tienen ríos con caudal suficiente ni clima húmedo.
- **Inundación T = 100 (R03):** los valles del Paraná, el Paraguay, el Bermejo y el Salado.
- **Sismicidad ≥ 0,35 g (R06):** Cuyo y parte del NOA.
- **Altitud > 2500 m y pendiente (R09, R04):** la cordillera.

## 2. Regiones que aparecen en todos los escenarios

Las regiones que figuran entre las candidatas en E1, E0, E3 y OWA:

| Región | Por qué puntúa alto | Primera alerta |
|---|---|---|
| **Valle inferior del río Negro** (Patagones–Adolfo Alsina, frente a Viedma) | Río de unos 870 m³/s (modelado), clima templado, sismicidad nula, a menos de 1 h de Viedma–Carmen de Patagones, lejos del AMBA | Coincide con el sitio de la capital de 1986–87 (Proyecto Patagonia). La planicie de inundación y la salinidad de suelos requieren estudio local |
| **Valle inferior del Chubut** (Rawson–Gaiman–Trelew) | Clima templado-seco, accesibilidad, puerto cercano, viento | El caudal modelado (~240 m³/s) parece **sobreestimado**: verificar con aforos antes de sacar conclusiones |
| **Confluencia neuquina** (Neuquén–Plottier–Cipolletti, El Cuy) | Ríos Limay y Neuquén, red de alta tensión, ciudad dinámica (crecimiento anual de 2,1 % en el departamento Confluencia) | Es expansión de un aglomerado existente, no ciudad nueva en sentido estricto |
| **Sudeste bonaerense** (Balcarce, Necochea, Tres Arroyos) | Clima, conectividad, puertos, baja sismicidad | Suelo agrícola de clase I–III (sin datos INTA en este modelo) |
| **Litoral del río Uruguay y Alto Paraná** (Santo Tomé, Ituzaingó, Candelaria) | Agua muy abundante, clima cálido-húmedo, puerto fluvial | Calor húmedo (no modelado con UTCI), áreas protegidas y OTBN (incompletos) |
| **Centro-este del Chaco** (1° de Mayo, Presidencia de la Plaza) | Precipitación, conectividad con Resistencia | Calor, anegamientos, OTBN |

La sorpresa principal es que el **NEA y el sudeste bonaerense compiten de igual a igual con los valles patagónicos**, y que la meseta patagónica fuera de los valles no aparece en ningún escenario.

## 3. Qué tan sensible es la respuesta a los pesos

El índice de Jaccard compara el 5 % superior de celdas entre escenarios (1 = mismas celdas):

| | E0 | E2 Sejong | E3 Hídrico | E1 OWA 0,3 |
|---|---|---|---|---|
| **E1 Base** | 0,40 | **0,17** | 0,80 | 0,68 |

- E1, E3 y OWA son parecidos: el resultado base es robusto ante dar más peso al agua y los riesgos, y ante una agregación más pesimista.
- **E2 (Sejong) cambia el mapa.** Con un peso de 0,36 al equilibrio territorial, el NOA (valle de Lerma, Metán, General San Martín en Salta, Palpalá en Jujuy) y Santa Cruz (Güer Aike, en el valle del río Gallegos) entran al grupo superior.
- La pregunta política de cuánto pesa descentralizar es **la que más define el resultado**. No puede resolverse técnicamente: debe explicitarse.
- **Monte Carlo** alrededor de E1 (κ = 50, 2000 muestras): 1104 celdas tienen probabilidad ≥ 90 % de quedar en el 10 % superior.

  | Provincia | Celdas robustas |
  |---|---|
  | Buenos Aires | 42 % |
  | Corrientes | 15 % |
  | Chaco | 13 % |
  | Santa Fe | 10 % |
  | Chubut | 9 % |
  | Río Negro | 5 % |
  | Misiones | 4 % |

## 4. Distribución del 5 % superior por provincia

| Escenario | Principales provincias (% de celdas del 5 % superior) |
|---|---|
| E1 Base | Buenos Aires 34 · Chaco 13 · Chubut 12 · Corrientes 10 · Santa Fe 10 · Misiones 8 |
| E0 Grupos iguales | Chubut 25 · Buenos Aires 17 · Chaco 10 · Santa Cruz 9 · Neuquén 8 · Formosa 8 |
| E2 Sejong | Chubut 25 · Salta 17 · Formosa 14 · Santa Cruz 13 · Misiones 11 · Chaco 8 |
| E3 Ambiental-hídrico | Buenos Aires 35 · Santa Fe 15 · Chaco 13 · Corrientes 10 · Misiones 9 |

## 5. Próximos pasos para robustecer el análisis

Están ordenados por impacto esperado sobre las conclusiones.

1. **Caudales observados** de la BDHI (SSRH) en lugar de HydroRIVERS, con caudal Q95 y descontando usos existentes.
2. **Suelos INTA** (capacidad de uso) para R05 y F13. Probablemente baje al sudeste bonaerense y a Santa Fe.
3. **OTBN** provinciales e inventario de glaciares (IANIGLA) para completar R01.
4. **Arsénico:** compilar datos provinciales y de SEGEMAR para F02.
5. **MDE-Ar de 30 m** (IGN) para la pendiente, e inundación de mayor resolución (JRC v2.1 a 90 m o mapas provinciales).
6. **Peligro volcánico** (SEGEMAR) y fallas activas (R07, R08) para la cordillera.
7. **Elicitación de pesos** con actores (AHP), reportando el resultado de cada actor junto con la robustez.
8. **Escenarios de cambio climático** (CMIP6) para clima y disponibilidad hídrica en 2050.
