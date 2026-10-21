# Migración interna en la Argentina: matriz, perfil y ritmos

Este documento respalda `web/src/model/migracion.json`, el archivo que usa la app para estimar de qué
provincias vendría la gente a un polo nuevo y a qué ritmo. La idea es partir de flujos observados en
los censos, no de un modelo de gravedad armado a ojo.

- Datos crudos: `data/raw/migracion/`. Ahí están las tablas MIALC de 1991, 2001, 2010 y 2022, la
  publicación del INDEC, los informes del RENAPER, las series de City Population y los PDF de la
  bibliografía.
- Todas las descargas se hicieron el 21/10/2026.
- Ningún número de este documento es inventado. Cuando un dato no se encontró, se dice y en el JSON
  queda `null`.

---

## 1. Fuentes y qué mide cada una

| Fuente | Qué da | Período | Escala | Fiabilidad |
|---|---|---|---|---|
| **CEPAL/CELADE, base MIALC 2.0** (procesa con REDATAM los microdatos del Censo 2022 del INDEC; tabla `ARG_2022_D5MB`) | Matriz origen‑destino por provincia de residencia 5 años antes; perfiles por edad, sexo, años de estudio y tipología | 2017–2022 | 24 provincias | Alta. Es el dato oficial más reciente. **Fuente principal del JSON.** |
| MIALC 2.0, Censo 2010 (`ARG_2010_D5MB` y la matriz municipal `ARG_2010_E5MB`, de 2.238 × 2.238) | Igual que la anterior, más la matriz entre municipios | 2005–2010 | Provincias y municipios | Alta por provincia. Media por municipio (ver §7). |
| MIALC 2.0, Censo 2001 (`ARG_2001_D5MB`) | Matriz por provincia | 1996–2001 | Provincias | Alta |
| MIALC, Censo 1991 | El tabulado de migración reciente figura como "No disponible" | — | — | — |
| INDEC (2024), *Migraciones internacionales e internas*, Censo 2022 | Migración de toda la vida (lugar de nacimiento), con los 24 partidos separados en el destino. Texto de las preguntas 13 y 17 | 2022 | Provincias | Alta |
| RENAPER, Dirección Nacional de Población (2023): informes *interprovincial* e *interdepartamental* | Cambios de domicilio declarados en el DNI, con AMBA (CABA + 40 partidos) separado | ene‑2012 a ago‑2022 | Provincias y departamentos | Media. Sólo cuenta a quien actualizó el DNI, y la fecha del trámite no es la de la mudanza. |
| City Population (con datos del INDEC), DocTec 15 de Tierra del Fuego, cuadro histórico del gobierno de Formosa | Población por departamento y localidad 1991–2022; series provinciales de 1970 y 1980 | 1970–2022 | Departamentos y localidades | Alta (son conteos censales) |

**Las preguntas censales.** El Censo 2022 preguntó (P17) "¿Hace 5 años vivía en… esta localidad /
otra localidad de esta provincia / otra provincia argentina / otro país?" y luego en qué provincia.
**No preguntó el partido ni el municipio**, así que en 2022 no se puede separar el AMBA del resto de
Buenos Aires en el origen. CEPAL lo confirma: las matrices de 2022 existen sólo a nivel provincial.
El Censo 2010 hizo la pregunta en el cuestionario ampliado, que se aplicó por muestra en las
localidades de más de 50.000 habitantes. Fue el primer censo que preguntó el municipio de residencia
anterior (Molinatti 2017). Por eso la separación AMBA / resto de Buenos Aires sólo es posible con
2010.

**Descartadas o no conseguidas.**
- IPUMS-International: no hacía falta, porque MIALC ya trae los tabulados agregados.
- REDATAM del INDEC en línea: no se pudo automatizar. Además, con 2022 tampoco permitiría partir el
  origen bonaerense.
- La nota de CEPAL sobre Argentina 2022 bloqueó la descarga (Cloudflare). Sólo se usa su resumen del
  buscador: matrices de 2022 sólo por provincia y "fuerte caída" de la intensidad entre 2010 y 2022.

## 2. Método

1. **Matriz 2022.** Se leyó `ARG_2022_D5MB.xlsx`. En el archivo, las filas son la provincia de
   residencia en 2022 y las columnas la de 2017. El JSON la guarda transpuesta, como
   `matriz[origen][destino]`.
   - La diagonal es la gente que no cambió de provincia. Se conserva para poder calcular tasas, pero
     **hay que excluirla al sumar flujos**.
   - Universo: población de 5 años o más en viviendas particulares. Excluye ignorados y a quienes
     vivían en el exterior. Total: 42.136.607 personas, de las cuales **750.405 son migrantes
     interprovinciales**. Se comprobó que cada fila suma su total.
2. **Matriz 2010 con AMBA separado** (`matriz_2010_amba`). La matriz municipal tiene 2.238 unidades.
   - Se asignó cada municipio a su provincia por sumas acumuladas contra los totales provinciales. El
     orden es contiguo y la diferencia es ≤ 10 personas por provincia.
   - Después se agruparon en 25 regiones: **AMBA** (CABA más los 24 partidos del GBA, los 24
     presentes) y **Resto de Buenos Aires** (los otros 108 partidos codificados).
   - Al volver a agregar a provincias se reproduce la matriz provincial de 2010.
   - Hay 1.072.226 migrantes entre regiones. Los flujos CABA↔GBA, unas 374 mil personas, quedan
     dentro del AMBA. Los flujos AMBA↔resto de Buenos Aires, unas 222 mil, pasan a contarse.
3. **Perfil.** Se calculó con las tablas MIALC D5DA (edad), D5EE (edad × años de estudio), D5SX y
   D5SE (sexo) y DTSX (tipología), de 2022 y 2010.
4. **Distancia.** Se ajustó por MCO el modelo
   `log M = c + a·log Po + b·log Pd − g·log D` sobre los 550 pares de provincias (sin el par
   CABA–Buenos Aires). La distancia se midió en gran círculo entre los centros urbanos principales,
   con coordenadas aproximadas. Es una estimación propia y sólo orientativa.
5. **Ritmos.**
   - Crecimiento total: tasa exponencial con las fechas censales exactas.
   - Saldo migratorio por año: saldo del quinquenio dividido por 5 (MIALC), o saldo de 2012–2022
     dividido por 10,6 (RENAPER).

Los scripts quedaron en el scratchpad de la sesión, fuera del repositorio: `build_mig.py`, `agg2.py`,
`agg3.py` y `prof.py`. Leen los archivos de `data/raw/migracion/` y reproducen el JSON.

## 3. La matriz: corredores y saldos

### 3.1 Corredores principales, 2017–2022 (personas en 5 años)

| # | Origen → destino | Personas |
|---|---|---|
| 1 | CABA → Buenos Aires | 62.676 |
| 2 | Buenos Aires → CABA | 39.058 |
| 3 | Buenos Aires → Córdoba | 19.356 |
| 4 | Santa Fe → Córdoba | 11.344 |
| 5 | Misiones → Buenos Aires | 11.272 |
| 6 | Buenos Aires → Misiones | 11.149 |
| 7 | Santa Fe → Buenos Aires | 10.802 |
| 8 | Buenos Aires → Santa Fe | 10.705 |
| 9 | Córdoba → Buenos Aires | 10.556 |
| 10 | Buenos Aires → Entre Ríos | 10.368 |
| 11 | Buenos Aires → Río Negro | 10.317 |
| 12 | Corrientes → Buenos Aires | 9.160 |
| 13 | Buenos Aires → Corrientes | 8.782 |
| 14 | Buenos Aires → Neuquén | 7.891 |
| 15 | Neuquén → Río Negro | 7.077 |

### 3.2 Corredores principales, 2005–2010, con AMBA separado

| # | Origen → destino | Personas |
|---|---|---|
| 1 | AMBA → Resto de Buenos Aires | 140.007 |
| 2 | Resto de Buenos Aires → AMBA | 82.085 |
| 3 | AMBA → Córdoba | 20.418 |
| 4 | Misiones → AMBA | 17.731 |
| 5 | Santa Fe → Córdoba | 14.361 |
| 6 | Corrientes → AMBA | 13.593 |
| 7 | AMBA → Entre Ríos | 13.482 |
| 8 | Córdoba → AMBA | 12.700 |
| 9 | AMBA → Misiones | 12.050 |
| 10 | AMBA → Santa Fe | 11.539 |
| 11 | Chaco → AMBA | 11.339 |
| 12 | Santiago del Estero → AMBA | 10.140 |

### 3.3 Saldos

**2017–2022 por provincia** (saldo en 5 años; entre paréntesis, % anual sobre la población media de 5
años o más):

- **Ganan:**
  - Córdoba +32.719 (+0,19)
  - Río Negro +10.307 (+0,30)
  - Neuquén +8.914 (+0,28)
  - San Luis +7.226 (+0,29)
  - Buenos Aires +5.196 (+0,01)
  - Entre Ríos +3.389
  - La Pampa +2.327
  - Mendoza +1.995
- **Pierden:**
  - CABA −17.508 (−0,12)
  - Formosa −11.878 (−0,42)
  - Chaco −9.719 (−0,19)
  - Salta −8.107 (−0,12)
  - Santa Cruz −5.784 (−0,37)
  - Tucumán −4.490
  - Santiago del Estero −3.849
  - Corrientes −3.147
  - Misiones −2.805
- **Tierra del Fuego:** +324. Es casi neutro, pero tiene la rotación más alta del país: entra el
  1,56% y sale el 1,52% de su población por año.

**2005–2010 con AMBA separado:**

- AMBA −71.867 (−0,13%/año) y resto de Buenos Aires +77.974 (+0,31%/año). En el registro RENAPER de
  2012–2022, el AMBA ampliado también es el mayor perdedor neto (−184.766).
- En 2005–2010, Santa Cruz (+1,68%/año) y Tierra del Fuego (+1,69%/año) tenían los saldos relativos
  más altos del país.
- En 2017–2022, Santa Cruz pasó a perder población por migración y Tierra del Fuego quedó en
  equilibrio.

### 3.4 De dónde vienen los inmigrantes de los polos

| Destino | Principales orígenes, en % de sus inmigrantes interprovinciales |
|---|---|
| Neuquén 2022 | Buenos Aires 26,0 · Río Negro 17,6 · Mendoza 9,1 · CABA 7,1 · Córdoba 6,4 · Salta 4,9 |
| Neuquén 2010 | Río Negro 23,8 · AMBA 20,0 · resto de Buenos Aires 11,9 · Mendoza 9,3 · Córdoba 6,0 |
| Tierra del Fuego 2022 | Buenos Aires 30,3 · Córdoba 9,0 · CABA 7,3 · Salta 5,8 · Tucumán 5,3 · Chaco 5,3 |
| Tierra del Fuego 2010 | AMBA 18,2 · Misiones 10,8 · resto de Buenos Aires 10,2 · Salta 8,6 · Formosa 8,1 · Jujuy 6,4 |
| Santa Cruz 2010 | AMBA 14,4 · Salta 11,5 · Formosa 10,3 · resto de Buenos Aires 8,4 · Chubut 7,8 |
| Chubut 2022 | Buenos Aires 30,8 · Santa Cruz 10,3 · CABA 9,4 · Córdoba 7,8 · Río Negro 7,4 |
| Córdoba 2022 | Buenos Aires 22,7 · Santa Fe 13,3 · CABA 5,8 · San Luis 4,6 · Salta 4,4 |
| San Luis 2022 | Buenos Aires 36,3 · Córdoba 17,7 · Mendoza 14,9 · CABA 6,8 |

**Lectura para la app.**

- **Tres orígenes fijos.** Un polo nuevo recibiría de un cuarto a un tercio de sus migrantes desde la
  provincia de Buenos Aires (sobre todo del AMBA). Otra parte grande vendría de las provincias
  vecinas. Habría un aporte del NOA y del NEA que crece cuanto más industrial y de empleo poco
  calificado sea el polo: Tierra del Fuego y Santa Cruz en 2010.
- **Origen de Buenos Aires en 2022.** La matriz 2022 no separa AMBA y resto. Si se necesita, se
  puede partir el origen "Buenos Aires" con las proporciones de 2010, por ejemplo con
  `matriz_2010_amba`. Es un supuesto, no una medición.

### 3.5 Distancia

El decaimiento con la distancia **entre provincias** es débil.

- La elasticidad estimada es −0,11 en 2017–2022 y −0,15 en 2005–2010, con R² de 0,45 y 0,42. El
  tamaño de origen y destino explica mucho más: elasticidades de 0,65 a 0,77.
- Sólo el 27% de los migrantes interprovinciales recorre menos de 300 km entre centros principales,
  y el 80% menos de 1.000 km.
- Los pares a más de 2.000 km (el norte con Tierra del Fuego y Santa Cruz) tienen una intensidad
  relativa *mayor* que los de 600 a 1.500 km. El empleo patagónico atrae desde lejos.
- La fricción de distancia sí es fuerte **dentro** de cada provincia y aglomerado. Según el RENAPER,
  las tasas de inmigración más altas están en departamentos chicos al lado de las capitales.
- **Recomendación:** no usar un exponente de gravedad de ~2. Conviene repartir los orígenes con la
  matriz observada de un destino análogo y agregar un término de vecindad.

## 4. Perfil del migrante interprovincial reciente (Censo 2022, 2017–2022)

| Indicador | Migrantes | No migrantes | 2010 (migrantes) |
|---|---|---|---|
| % de 15 a 34 años (sobre 5+ años) | **47,1** | 32,5 | 50,2 |
| % de 20 a 34 años | 39,3 | — | 41,9 |
| % de 5 a 14 años | 13,7 | 17,0 | 15,5 |
| % de 60 años o más | 9,6 | 17,4 | 8,5 |
| Tasa de migración en 5 años, total | 1,78% | — | 3,40% |
| Tasa de migración en 5 años, 20–34 años | 2,86% (pico en 20–34) | — | 5,55% |
| Años de estudio medios, 25–39 años | **13,5** | 11,6 | 11,9 contra 10,5* |
| % con 13 o más años de estudio, 25–39 | **57,8** | 34,9 | 44,5 contra 29,5* |
| Índice de masculinidad (varones cada 100 mujeres) | 96,7 | 92,6 | 100,0 (no migrantes 93,5) |
| Niños de 5–14 por adulto de 25–44 | 0,31 | 0,54 | 0,37 (no migrantes 0,64) |
| Retornos (% de los migrantes recientes) | 30,9 | — | 27,5 |
| Migrantes múltiples (% de los recientes) | 15,9 | — | 17,3 |

\* La codificación de años de estudio cambia entre 2010 y 2022. Sólo es válido comparar migrantes con
no migrantes dentro del mismo censo.

- **Edad.** La migración es selectiva de adultos jóvenes. La tasa de 20–34 años casi duplica la de
  45–49 (1,36%) y triplica la de 70 años o más.
  - Para comparar, el RENAPER da una edad mediana de 31 años entre quienes cambiaron de provincia en
    2012–2022.
- **Educación.** Los migrantes de 25–39 años tienen casi 2 años más de estudio, y una probabilidad
  1,7 veces mayor de haber pasado los 12 años de estudio. Es la selectividad positiva que CELADE
  describe para la región.
- **Sexo.**
  - En el censo hay casi paridad, con un leve exceso masculino respecto de los no migrantes.
  - Por destino, el índice de los inmigrantes va de 89,8 (CABA, La Rioja) a 103,3 (Salta). Neuquén
    da 97,6, Santa Cruz 96,5 y Tierra del Fuego 91,0 en 2017–2022.
  - El RENAPER da 116. Probablemente se deba a quién actualiza el DNI: un sesgo del registro.
- **Familias.** No hay un tabulado de hogares que migran juntos, así que el dato es `null`.
  - Como aproximación: entre los migrantes hay 0,31 niños de 5–14 por adulto de 25–44, contra 0,54
    entre los no migrantes.
  - Una parte importante migra con hijos, pero menos que el promedio. Predominan las personas solas y
    las parejas jóvenes.
- **Retorno y etapas.**
  - Cerca de un tercio de los migrantes recientes vuelve a su provincia de nacimiento (30,9% en
    2022).
  - Uno de cada seis es un migrante múltiple: la provincia donde vivía hace 5 años no era la de
    nacimiento. Es un indicio de trayectorias por etapas.
  - Para la app, un polo nuevo debe esperar emigración de retorno de una fracción relevante de sus
    llegados.

## 5. Ritmos de referencia

El detalle completo está en `ritmos` del JSON. En "Crecimiento total" se mezclan el crecimiento
natural y el migratorio. "Saldo migratorio/año" sólo figura cuando está medido.

| Lugar | Período | Crecimiento total (%/año) | Crecimiento absoluto (hab./año) | Saldo migratorio/año | Fuente |
|---|---|---|---|---|---|
| Tierra del Fuego (provincia) | 1970–1980 | 7,25 | 1.375 | null | DocTec 15 TdF |
| Tierra del Fuego (provincia) | 1980–1991 | **9,21** | 3.978 | null | DocTec 15 TdF |
| Tierra del Fuego (provincia) | 2005–2010 | 2,60 (2001–10) | — | +1.781 (1,69% anual) | MIALC 2010 |
| Tierra del Fuego (provincia) | 2017–2022 | 3,33 (2010–22) | — | +65 | MIALC 2022 |
| Ushuaia (departamento) | 1991–2001 | 4,30 | 1.558 | null | City Population/INDEC |
| Río Grande + Tolhuin | 2010–2022 | 3,59 | 3.049 | null | City Population/INDEC |
| Neuquén (provincia) | 1970–1980 | 4,64 | 8.873 | null | cuadro histórico |
| Neuquén (provincia) | 1980–1991 | 4,52 | 13.730 | null | idem |
| Neuquén (provincia) | 2017–2022 | 2,22 (2010–22) | — | +1.783 | MIALC 2022 |
| Neuquén (provincia) | 2012–2022 | — | — | +2.310 (RENAPER) | RENAPER |
| Confluencia (Neuquén) | 2010–2022 | 2,25 | 9.183 | +1.607 (RENAPER) | City Population; RENAPER |
| Añelo (departamento) | 2010–2022 | **4,61** | 639 | null (tasa de inmigración RENAPER: 391 por mil en 10 años) | City Population; RENAPER |
| Añelo (localidad) | 2010–2022 | **8,53** | 334 | null | City Population |
| Rincón de los Sauces (localidad) | 1991–2001 | **10,65** | 628 | null | City Population |
| Plottier (localidad) | 2010–2022 | 4,23 | 1.722 | +586 (2005–10, municipio) | City Population; MIALC |
| Puerto Madryn (localidad) | 2001–2010 | 3,93 | 2.651 | +853 (2005–10) | City Population; MIALC |
| Lago Argentino (El Calafate) | 2001–2010 | **10,87** | 1.271 | null | City Population |
| Santa Cruz (provincia) | 2005–2010 | 3,76 (2001–10) | — | +3.770 (1,68% anual) | MIALC 2010 |
| Bariloche (localidad) | 2001–2010 | 2,26 | 2.276 | +92 (2005–10, alta rotación) | City Population; MIALC |
| Pilar (partido) | 2001–2010 | 2,86 | 7.450 | +2.883 (2005–10) | City Population; MIALC |
| Pilar (partido) | 2010–2022 | 2,43 | 8.279 | +2.456 (RENAPER, el mayor saldo del país) | RENAPER |
| Escobar (partido) | 1991–2001 | 3,16 | 4.732 | null | City Population |
| General Rodríguez (partido) | 2010–2022 | 4,36 | 4.805 | +1.965 (RENAPER) | City Population; RENAPER |
| Colón (Córdoba) | 2010–2022 | 2,39 | 6.107 | +2.219 (RENAPER) | City Population; RENAPER |
| Córdoba Capital | 2010–2022 | 1,08 | 15.199 | −4.772 (RENAPER) | RENAPER |
| Córdoba (provincia) | 2017–2022 | — | — | +6.544 (el mayor saldo interprovincial) | MIALC 2022 |
| AMBA (CABA + 24 partidos) | 2005–2010 | — | — | −14.373 | MIALC 2010 (agregación propia) |

**Órdenes de magnitud para calibrar la app.**

- **Techo histórico sostenido.** Crecer entre 7% y 11% anual durante una década sólo ocurrió partiendo
  de bases muy chicas: Tierra del Fuego entre 1970 y 1991 (de 13.527 a 69.369 habitantes), El
  Calafate, Rincón de los Sauces y Añelo.
  - En valores absolutos, el máximo para un polo "desde cero" es de unos **4.000 habitantes por año**
    (Tierra del Fuego, 1980–91, con promoción industrial fuerte).
  - Las áreas de 100 a 500 mil habitantes crecieron como mucho entre 3% y 4,5% anual: Plottier,
    General Rodríguez y San Vicente en 2010–22; Puerto Madryn en 2001–10; Escobar en 1991–2001.
  - En términos absolutos, el máximo es de unos 8.000 a 9.000 habitantes por año, en la periferia del
    AMBA (Pilar) o en Neuquén–Confluencia.
- **Saldo migratorio sostenido.** Es de 1,7% de la población por año en los mejores casos
  provinciales (Tierra del Fuego y Santa Cruz en 2005–10). Ninguna provincia superó los ~6.500
  migrantes netos por año en 2017–22 (Córdoba).
- **Total del país.**
  - **Unas 150.000 personas por año** cambiaron de provincia en 2017–2022, según el Censo 2022
    (750.405 en 5 años).
  - Eran unas 245.000 por año en 2005–2010 y 215.000 en 1996–2001.
  - El RENAPER da unas 221.000 por año entre provincias en 2012–2022, contando AMBA y resto de
    Buenos Aires como jurisdicciones separadas, y 532.000 por año entre departamentos.
  - El JSON usa 150.081 en `total_interprovincial_anio` y deja el resto en `total_interprovincial_detalle`.
  - Ejemplo: una ciudad que necesite **5.000 migrantes netos por año** de otras provincias tendría que
    captar el **3,3%** de todos los migrantes interprovinciales del país, o el 2% con la cifra de
    2010. Es más que el saldo de cualquier provincia en 2017–22.

## 6. Procesos según la literatura

Hallazgos breves y citados. Lo que no se pudo verificar en texto completo se aclara.

1. **Reorientación desde 1970 y fin de la primacía del AMBA.** Desde los años setenta bajó el peso
   relativo del aglomerado de Buenos Aires como receptor, y subió el de las aglomeraciones de tamaño
   intermedio. Llegan migrantes del campo y de localidades menores. (Vapñarsky 1994 y 1995;
   Bertoncello 1994; según los resume Pérez 2009. Vapñarsky y Gorojovsky 1990, citados por Gutiérrez y
   Rearte 2012.)
   - Los datos de MIALC lo confirman. En 2005–2010 el AMBA tuvo saldo negativo con el resto del país
     (−71.867), y el resto de Buenos Aires fue el mayor ganador (+77.974). La mayor parte vino del AMBA
     (62,5% de sus inmigrantes).
2. **Las metrópolis expulsan, pero hacia cerca.** Rodríguez Vignoli (2004, CELADE) describe para
   América Latina que las grandes ciudades pasan a tener emigración neta. Habla de
   "desconcentración concentrada" (hacia periferias y ciudades intermedias cercanas) y de
   "rururbanización". Lo citan los informes del RENAPER de 2023.
   - En la Argentina de 2012–2022 los mayores saldos negativos son de CABA, Córdoba Capital, La
     Matanza y Tucumán Capital. Los mayores positivos son de Pilar, Colón, Punilla, General Rodríguez,
     Santa María y Confluencia (RENAPER interdepartamental 2023).
3. **Migración guiada por el empleo: petróleo, promoción industrial, Estado.**
   - **Tierra del Fuego.** La Ley 19.640 (1972) generó la ola de radicación más rápida registrada. La
     población es mayoritariamente de migrantes internos de distintas regiones (Hermida, Malizia y van
     Aert 2013; Aletheia‑UNLP 2024). En 2022 el 54,5% de la población nativa había nacido en otra
     provincia (INDEC 2024).
   - **Añelo / Vaca Muerta.** Tiene la séptima tasa de inmigración interdepartamental del país en
     2012–22 (RENAPER). El intendente sostiene que el censo subestima la población (Diario Río Negro).
     COPADE informa un 37,4% de crecimiento de la región Vaca Muerta en 2010–22.
   - **Patagonia austral.** Los saldos son muy volátiles. Santa Cruz pasó de +1,68%/año (2005–10) a
     −0,37%/año (2017–22). El RENAPER también la ubica entre las mayores pérdidas relativas en
     2012–22. **Los polos que dependen de un solo sector pueden revertirse en una década.**
4. **Migración por amenidades.** En la Norpatagonia andina (San Martín de los Andes, Villa La
   Angostura, El Bolsón, Bariloche) y en las sierras de Córdoba, el crecimiento se asocia a la
   migración de amenidad y al negocio inmobiliario (Otero y González, UNComahue).
   - El RENAPER ubica las tasas de inmigración más altas en destinos turísticos y periurbanos (Mar
     Chiquita, Monte Hermoso, Lago Argentino, General Lavalle). Calamuchita y Punilla están entre
     los mayores saldos absolutos.
   - El perfil difiere del laboral: llega gente de más edad y más educada, y la rotación es alta.
     Bariloche tuvo un saldo casi nulo en 2005–10 con 8.700 entradas y 8.300 salidas.
5. **Redes y cadenas.** La persistencia de corredores largos se explica mejor por redes de
   paisanaje que por distancia: por ejemplo Misiones, Formosa, Salta y Jujuy hacia Tierra del Fuego y
   Santa Cruz, que en 2010 aportaban entre el 6% y el 11% cada una.
   - Se encontraron testimonios de familias que llegan a Río Grande porque un pariente ya trabajaba en
     una fábrica (nota de La Nación), pero **no un estudio cuantitativo argentino de redes**. Queda como
     hipótesis apoyada en la matriz.
6. **Retorno y etapas.** La tipología CELADE de MIALC da 31% de retornos y 16% de migrantes múltiples
   entre los recientes de 2022.
   - No se encontró literatura argentina específica sobre migración escalonada. La evidencia es este
     cálculo más estudios de migración intraprovincial hacia capitales del Norte Grande (Pérez 2009).
7. **Caída de la intensidad.** CEPAL informa una fuerte caída de la migración interna en Argentina
   entre 2010 y 2022. El INDEC registra que la población nativa nacida en otra jurisdicción bajó de
   20,9% a 18,3%. La tasa de migración reciente en 5 años bajó de 3,40% a 1,78%.

## 7. Advertencias

- **Personas, no movimientos.** El censo capta a los sobrevivientes que cambiaron de provincia
  respecto de hace 5 años. No cuenta mudanzas de ida y vuelta, a los menores de 5 años, ni a
  quienes murieron o se fueron del país. Los flujos anuales reales son mayores.
- **2022 es atípico.** El quinquenio 2017–22 incluye la pandemia (2020–21), y 2022 fue el primer
  censo de derecho, con autoempadronamiento digital. La caída respecto de 2010 puede estar
  exagerada. Conviene correr la app con 2022 y con 2010 como escenarios.
- **No hay AMBA en 2022.** La división AMBA / resto de Buenos Aires sólo existe para 2005–2010. El
  RENAPER usa otra definición: AMBA = CABA + 40 partidos.
- **Matriz municipal de 2010.** Molinatti (2017) señala que localidad y municipio aparecen casi como
  sinónimos en la codificación. Se comprobaron poblaciones municipales inverosímiles en Santa Cruz
  (Caleta Olivia con 11.626 habitantes, Pico Truncado con 33.649) y en Tierra del Fuego (Río Grande
  con 43.720).
  - Por eso sólo se usaron municipios cuya población cuadra con el censo (Pilar, Plottier, Puerto
    Madryn, Bariloche) y la agregación AMBA / resto, que cuadra con los totales provinciales.
- **RENAPER.** Depende de que la gente actualice el DNI, y la fecha registrada es la del trámite. Los
  encabezados de sus tablas dicen "en miles", pero las cifras son personas (por ejemplo, 472.452).
- **Ritmos.** El "crecimiento total" incluye el crecimiento natural, que aquí no se separa. Para 1970–1991 no hay saldos migratorios medidos (`null`). Las cifras de Tierra del
  Fuego para 1970–1980 vienen del gobierno provincial (13.527 y 27.358). Otro cuadro da 15.658 y
  29.392, probablemente con otra cobertura territorial.
- **Distancia.** El ajuste usa centros urbanos aproximados y datos agregados por provincia, así que
  sirve de orientación, no como parámetro estructural.
- **Datos no encontrados** (quedan `null` o fuera del JSON):
  - un tabulado de migración por hogar o familia;
  - saldos migratorios por departamento en 1970–1991;
  - un estudio cuantitativo de redes;
  - la matriz 2022 por departamento.

## Uso en la app

`web/src/model/migracion.ts` usa estos datos en la ficha de cada lugar y en `docs/casos-concretos.md`:

- **De dónde vendría la gente.** Una parte viene de otros departamentos de la misma provincia. Se calcula con las mudanzas entre departamentos del RENAPER (≈ 311.000 por año) repartidas según la población de cada provincia, frente a lo que llega de otras provincias.
  - El resto se reparte en un 70 % según los corredores que hoy llegan a esa provincia (matriz 2017–2022) y en un 30 % según cuánta gente sale de cada provincia hacia cualquier destino. Este 30 % representa la atracción de una oportunidad nueva fuera de los corredores.
  - El AMBA se separa del resto de Buenos Aires con la matriz 2005–2010.
  - No se usa un modelo de gravedad porque la distancia casi no explica los flujos (elasticidad ≈ −0,11).
- **Quiénes llegan.** El perfil del Censo 2022 se usa así:
  - 47 % tiene de 15 a 34 años, y estudió más que quienes no migran.
  - Hay 0,31 chicos por adulto joven, contra 0,54: en la primera etapa de una ciudad nueva los lugares escolares se reducen en esa proporción.
  - El 31 % vuelve a su provincia de nacimiento.
- **Ritmo.** La llegada anual se compara con el total de quienes cambian de provincia por año (150.081, Censo 2022) y con el mayor saldo migratorio neto de un lugar argentino: Pilar, unas 2.900 personas por año en 2005–2010. No se compara con el crecimiento total, que en las ciudades grandes es sobre todo por nacimientos: Córdoba Capital crece unas 15.000 personas por año con saldo migratorio negativo.
  - El censo mide personas en 5 años, así que subestima los movimientos anuales. La comparación es de orden de magnitud.

Los scripts que arman `web/src/model/migracion.json` están en `pipeline/migracion/`.
