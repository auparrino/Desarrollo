# Recorridos de ciudades nuevas y polos que funcionaron

Generado con `web/scripts/recorridos.ts` a partir de `docs/trayectorias-argentina.md` y
`docs/trayectorias-internacionales.md` (censos y fuentes oficiales; los datos de empleo del motor son
escasos y varios son estimaciones de prensa). La población se interpola entre censos en escala
logarítmica; antes del primer censo se supone la población de ese censo.

## Cómo crecieron

"Comparable" = país con más del 70 % de población urbana al empezar, como la Argentina (92 %): no
había una gran reserva rural esperando migrar a la ciudad.

| Caso | Inicio | Comparable | Población al año 10 | Año 20 | Año 30 | Llegada máxima por año | Veces el récord argentino reciente |
|---|---|---|---|---|---|---|---|
| La Plata (nueva capital de la provincia de Buenos Aires) (Argentina) | 1882 | sí | 63.722 | 76.170 | 118.614 | 16.935 (año 8) | 5,9 |
| Tierra del Fuego: Río Grande y Ushuaia (Ley 19.640) (Argentina) | 1972 | sí | 32.401 | 72.030 | 103.694 | 5.145 (año 19) | 1,8 |
| Puerto Madryn (ALUAR) (Argentina) | 1971 | sí | 21.994 | 44.916 | 57.571 | 2.746 (año 20) | 1 |
| Neuquén capital y departamento Confluencia (Argentina) | 1958 | sí | 35.652 | 77.727 | 141.310 | 6.563 (año 30) | 2,3 |
| El Calafate (Glaciar Perito Moreno) (Argentina) | 2000 | sí | 16.655 | 21.672 | s/d | 1.586 (año 10) | 0,6 |
| Añelo (Vaca Muerta) (Argentina) | 2013 | sí | 6.964 | s/d | s/d | 1.446 (año 13) | 0,5 |
| Brasília (Brasil) | 1956 | no | 318.363 | 877.230 | 1.404.890 | 80.432 (año 24) | 27,9 |
| Palmas (Brasil) | 1989 | sí | 122.016 | 216.968 | 282.093 | 18.774 (año 7) | 6,5 |
| Canberra (Australia) | 1913 | sí | 3.177 | 8.947 | 14.095 | 818 (año 20) | 0,3 |
| Milton Keynes (Reino Unido) | 1967 | sí | 90.491 | 155.372 | 183.835 | 9.077 (año 14) | 3,1 |
| Shenzhen (China) | 1980 | no | 1.677.800 | 7.012.400 | 10.372.000 | 670.863 (año 13) | 232,7 |
| Gaborone (Botsuana) | 1964 | no | 25.503 | 75.958 | 147.443 | 9.133 (año 27) | 3,2 |
| Astaná (Kazajistán) | 1997 | no | 576.011 | 977.331 | s/d | 68.246 (año 28) | 23,7 |
| Belo Horizonte (Brasil) | 1894 | no | 17.886 | 36.323 | 72.584 | 4.112 (año 30) | 1,4 |
| Goiânia (Brasil) | 1933 | no | 49.677 | 73.291 | 203.017 | 16.696 (año 30) | 5,8 |
| Ciudad Guayana (Venezuela) | 1961 | no | 145.697 | 297.692 | 466.139 | 21.637 (año 14) | 7,5 |
| Sejong (Corea del Sur) | 2007 | sí | 281.120 | s/d | s/d | 48.713 (año 8) | 16,9 |
| Putrajaya (Malasia) | 1995 | no | 23.221 | 88.300 | s/d | 18.013 (año 15) | 6,2 |
| Chandigarh (India) | 1951 | no | 119.881 | 257.251 | 451.610 | 20.687 (año 30) | 7,2 |

El "récord argentino reciente" es el mayor saldo migratorio neto observado en un lugar entre 2005 y
2022: Pilar, unas 2.900 personas por año (`docs/migracion-interna.md`).

## Lo que se repite en los recorridos

1. **Primero la infraestructura, después el empleo masivo** (de 1 a 8 años después). La Plata tuvo
   ferrocarril y obreros de la construcción antes que empleados públicos; Puerto Madryn, acueducto,
   puerto y central térmica antes que ALUAR; Brasilia tenía 64.000 habitantes en 1959, antes de que
   llegara un solo ministerio.
2. **Dos motores en secuencia: la construcción y después un empleo estable.** Donde el segundo motor
   tardó, la ciudad se estancó: Canberra tardó unos 45 años en llegar a 30.000 habitantes, Goiânia casi
   no creció en los años cuarenta, y La Plata perdió población con la crisis de 1890.
3. **El motor directo es una parte chica del crecimiento.** Los ~900 empleos de ALUAR fueron con unos
   14.000 habitantes nuevos en 1970–1980; la construcción y los servicios multiplican.
4. **La vivienda llegó casi siempre a demanda e informal**, y después se regularizó: un tercio de la
   expansión urbana de Tierra del Fuego hasta 1991, las ciudades satélite de Brasilia, las villas de
   Belo Horizonte. La excepción es Puerto Madryn, donde ALUAR construyó barrios por adelantado.
5. **Si no hay vivienda, el empleo se vuelve viaje diario y no radicación** (Añelo hoy; Sejong y
   Putrajaya con sus funcionarios: en Sejong, en 2014, un tercio seguía viajando o se había mudado sin
   la familia, sobre todo por las escuelas).
6. **Cuando el motor se achica, deja de llegar gente pero casi nadie se va**: el empleo público y los
   nacimientos de una población joven sostienen la ciudad (Tierra del Fuego en los noventa).
7. **El ritmo máximo, en países urbanizados, fue de 8 a 14 % anual durante una década**, y bajó de 3 %
   después de 25 a 35 años. Ritmos de 17 a 24 % solo se vieron con una gran reserva rural (Shenzhen,
   Gaborone) o en un estado nuevo (Palmas).

## ¿El modelo de proceso los reproduce?

Sí, cuando se conoce el motor de empleo. Se alimentó el modelo con lo que pasó en cada caso (año de
inicio, población inicial, empleos del motor año por año) y se comparó con los censos
(`docs/backtest-trayectorias.md`). El error es el promedio cuadrático del logaritmo del cociente
simulado/observado (0,35 ≈ ±40 %).

| Caso | Datos del motor | Error con los parámetros de la app | Error calibrado | Multiplicador calibrado | Llegada espontánea calibrada (por año) |
|---|---|---|---|---|---|
| Tierra del Fuego: Río Grande y Ushuaia (Ley 19.640) | sí | 0.76 | 0.26 | 4 | 60.000 |
| Canberra | sí | 0.69 | 0.30 | 4 | 8.000 |
| Milton Keynes | sí | 0.39 | 0.34 | 2 | 4.300 |
| Shenzhen | sí | 0.47 | 0.35 | 2 | 60.000 |
| Añelo (Vaca Muerta) | sí | 0.54 | 0.49 | 0,3 | 4.300 |
| Puerto Madryn (ALUAR) | sí | 1.18 | 0.67 | 4 | 2.000 |
| Ciudad Guayana | sí | 1.49 | 0.92 | 4 | 30.000 |
| Brasília | sí | 2.04 | 1.16 | 4 | 60.000 |
| La Plata (nueva capital de la provincia de Buenos Aires) | sí | 1.66 | 1.25 | 4 | 15.000 |
| Putrajaya | sí | 3.59 | 2.93 | 4 | 2.000 |
| Neuquén capital y departamento Confluencia | sí | 3.97 | 3.96 | 0,6 | 30.000 |
| Sejong | sí | 5.01 | 4.65 | 4 | 60.000 |

- Los casos de países urbanizados con buenos datos del motor (Tierra del Fuego, Canberra, Milton Keynes)
  se reproducen con errores de ±30 a ±40 %. La calibración pide multiplicadores altos (hasta 4, el borde
  de la búsqueda) porque las series del motor cuentan solo una parte del empleo básico: la industria en
  Tierra del Fuego o ALUAR en Madryn, sin el empleo público ni la construcción.
- Neuquén, Sejong, Putrajaya y Palmas no se reproducen: hay uno o dos datos del motor, muy lejos del
  inicio, y la interpolación no representa lo que pasó.
  Brasilia, Shenzhen o Ciudad Guayana necesitan llegadas espontáneas de 30.000 a 60.000 por año: había
  millones de personas migrando del campo, algo que la Argentina ya no tiene.
- **Multiplicador implícito.** En Tierra del Fuego, hacia 1987, unos 6.000 empleos industriales iban con
  unos 36.000 habitantes nuevos: cada empleo del motor sostuvo ~1,7 empleos más. En Canberra (1966),
  14.600 empleos públicos con ~94.000 habitantes: ~1,9. Moretti (2010) da 1,6 para la industria. Con
  esto, el modelo de la app pasó de un multiplicador central de 1 (rango 0,5–1,6) a 1,6 (rango 0,8–2,5).
- Donde no hay datos del motor (Belo Horizonte, Goiânia, Palmas, Gaborone) el modelo no se puede probar:
  solo se conoce la población.

## ¿Qué haría falta para seguir esos recorridos?

Para cada caso de la app (el mismo de `docs/casos-concretos.md`) se calcula qué habría que lograr
para crecer como los casos comparables en sus primeros 30 años: las mismas personas por año, en el
mismo año de vida. Los empleos a crear salen de una tasa de empleo de 0,45; el motor es la parte que no
genera el multiplicador (1,6).

| Seguir el recorrido de | Habitantes al año 30 | Llegada máxima por año | Veces el récord argentino | Empleos a crear en ese año | De esos, del motor | Viviendas en ese año |
|---|---|---|---|---|---|---|
| La Plata (nueva capital de la provincia de Buenos Aires) | 115.273 | 16.935 | 5,9 | 7.621 | 2.931 | 5.921 |
| Tierra del Fuego: Río Grande y Ushuaia (Ley 19.640) | 88.121 | 5.145 | 1,8 | 2.315 | 890 | 1.799 |
| Puerto Madryn (ALUAR) | 50.670 | 2.746 | 1 | 1.236 | 475 | 960 |
| Neuquén capital y departamento Confluencia | 124.572 | 6.563 | 2,3 | 2.954 | 1.136 | 2.295 |
| El Calafate (Glaciar Perito Moreno) | 16.883 | 1.586 | 0,6 | 714 | 275 | 555 |
| Palmas | 265.224 | 18.774 | 6,5 | 8.448 | 3.249 | 6.564 |
| Canberra | 12.180 | 818 | 0,3 | 368 | 142 | 286 |
| Milton Keynes | 143.835 | 9.077 | 3,1 | 4.085 | 1.571 | 3.174 |
| Sejong | 313.183 | 48.713 | 16,9 | 21.921 | 8.431 | 17.033 |

Y lo que da el proceso recomendado por las simulaciones en cada caso de la app (`docs/simulaciones-procesos.md`):

| Caso de la app | Proceso recomendado | Habitantes al año 30 | Recorrido real más parecido |
|---|---|---|---|
| Crear una ciudad nueva: Senillosa | Organismos públicos primero, luego viviendas a demanda | 41.272 | Puerto Madryn (ALUAR) (50.670) |
| Trasladar la capital: Senillosa | Traslado gradual con radicación de las familias | 140.419 | Milton Keynes (143.835) |
| Fortalecer ciudades intermedias: Gran Paraná | Por etapas, sin motor de empleo | 29.415 | Puerto Madryn (ALUAR) (50.670) |
| Repoblar pueblos: Correa | Organismos públicos primero, luego viviendas a demanda | 7.776 | Canberra (12.180) |
| Crear polos productivos: Laguna Brava | Parque por etapas sin incentivos fiscales | 109.694 | La Plata (nueva capital de la provincia de Buenos Aires) (115.273) |

**Lectura.** Los recorridos argentinos más parecidos a una ciudad nueva (Puerto Madryn, Tierra del
Fuego, Neuquén) necesitaron en su mejor momento entre 2.700 y 6.600 personas por año: entre una y dos
veces y media el mayor saldo migratorio reciente del país, sostenido por un motor de empleo concreto
(ALUAR y su puerto; la promoción industrial; el Estado provincial, El Chocón y el petróleo). La Plata,
Palmas, Milton Keynes y Sejong llegaron más rápido, pero con condiciones difíciles de repetir: una
capital provincial completa trasladada en meses y la inmigración europea (La Plata), un estado nuevo
(Palmas), una política nacional de 25 años con una corporación de desarrollo (Milton Keynes) o el
traslado de 40 organismos nacionales con su región alrededor (Sejong). El proceso recomendado por las
simulaciones queda en el orden de esos recorridos argentinos: la ciudad nueva, como Puerto Madryn; la
capital, como Milton Keynes, Neuquén o La Plata.
