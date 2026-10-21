# Metodología

Este documento describe cómo se construye y evalúa la aptitud territorial. Los fundamentos, umbrales y referencias de cada criterio están en [`revision-bibliografica.md`](revision-bibliografica.md); los resultados de los escenarios, en [`hallazgos.md`](hallazgos.md).

## 1. Pregunta y alcance

**¿Dónde podría localizarse una ciudad nueva de tamaño intermedio (por defecto 500.000 habitantes) en Argentina, y cuán robusta es esa respuesta ante distintos juicios sobre la importancia de cada criterio?**

- **Ámbito:** Argentina continental y Tierra del Fuego.
- **Exclusiones del análisis:** el sector antártico y las islas del Atlántico Sur, que no tienen administración efectiva ni datos censales. Se siguen dibujando en el mapa base como territorio nacional (cartografía oficial del IGN).
- **Unidad:** celda hexagonal H3 de resolución 6, de unos 36 km². Son 95.059 celdas.
- **Resolución efectiva:** la de las fuentes, de 1 a 5 km. El resultado es de **escala regional, de pre-factibilidad**: identifica regiones donde vale la pena hacer estudios de sitio. No reemplaza esos estudios.

## 2. Procesamiento de datos (`pipeline/`)

1. **Descarga** (`download.py`): las fuentes catalogadas en `sources.py`, con URL, cita y licencia.
2. **Grilla común:** todas las capas raster se remuestrean a 30″ (≈1 km) sobre el rectángulo 74°–53° O, 21°–56° S, usando promedio, o vecino más cercano en el caso de conteos y máscaras.
3. **Máscara del área de estudio:** provincias del IGN rasterizadas.
4. **Asignación a H3:** cada píxel se asigna a la celda H3 que contiene su centro. Los atributos se agregan como media (variables continuas), suma (población) o fracción de píxeles (condiciones booleanas, por ejemplo inundación, áreas protegidas o pendiente ≤15 %).
5. **Población (método dasimétrico):** se usa WorldPop 2020 (1 km) como superficie de distribución y se reescala píxel a píxel para que la suma por departamento coincida con el **Censo 2022** (INDEC, radios censales). Así se conserva el total censal de 45.618.784 personas en viviendas particulares.
6. **Crecimiento 2010–2022:** se calcula con la tasa geométrica anual por departamento. Hay tres cambios de límites que se resolvieron con grupos comparables:
   - comunas de CABA: recodificación de 2010 a 2022;
   - Chascomús y Lezama;
   - Río Grande, Tolhuin y Ushuaia.
7. **Distancias:** se miden desde el centro de la celda en la proyección equivalente Albers de Sudamérica (ESRI:102033) hasta:
   - rutas nacionales pavimentadas;
   - ferrocarril operativo;
   - líneas de alta tensión;
   - puertos;
   - ríos;
   - localidades (BAHRA).
8. **Salida:** `web/public/data/cells.bin`, un archivo binario columnar float32, más los metadatos y los límites simplificados para el mapa.

### Variables derivadas
| Variable | Cálculo |
|---|---|
| Pendiente | Gradiente del MDE de 30″ en metros. **Subestima** la pendiente local (ver §6) |
| HDD18 / CDD18 | Σ días_mes × max(0, 18 − T_mes) y Σ días_mes × max(0, T_mes − 18), con las medias mensuales de WorldClim |
| GHI | Media anual de la radiación de WorldClim (kJ m⁻² día⁻¹ ÷ 3600) |
| Potencia eólica | 0,5 · ρ · v³ · 1,91 (factor de Weibull con k = 2), con ρ = 1,225 kg/m³ |
| q_rio25 | Máximo caudal medio (HydroRIVERS) de los tramos a ≤25 km |
| pob_50km | Suma de la población de las celdas cuyo centro está a ≤50 km |

## 3. Modelo de decisión (`web/src/model/`)

Es la secuencia recomendada por la revisión (§2.1):

1. **Restricciones** (`criteria.ts`, `mcda.ts`). Cada celda se excluye si incumple un umbral, y se registra la primera restricción que incumple. Todas son activables y ajustables:

   | ID | Criterio | Umbral por defecto |
   |---|---|---|
   | R01 | Área protegida estricta | > 50 % de la celda |
   | R01b | Área protegida de uso múltiple | Apagada |
   | R03 | Planicie de inundación T = 100 | > 50 % de la celda |
   | R04 | Superficie con pendiente ≤15 % | < 50 % de la celda |
   | R06 | Aceleración sísmica PGA (T = 475) | ≥ 0,35 g |
   | R09 | Altitud | > 2500 m |
   | R10 | Costa baja | < 5 m |
   | R11 | Celda ya urbanizada | > 3600 hab |
   | R13 | Suficiencia hídrica | Ver abajo |

   **R13** se cumple si un río a ≤25 km aporta, con el 20 % de su caudal medio, la demanda P × q × 1,5 (para 500.000 hab y q = 200 L/hab/día, unos 1,74 m³/s). También se cumple si el clima es subhúmedo o húmedo (P/ET0 ≥ 0,5).

2. **Factores 0–1** con funciones de valor de **umbrales absolutos**, no un min–max del área, para que los puntajes no cambien al variar el área analizada. Son 12 factores con datos. Tres más (arsénico, deslizamientos, suelos INTA) figuran como "sin datos" y su peso se redistribuye proporcionalmente.
3. **Pesos jerárquicos** por grupo (§7 de la revisión). Hay cuatro escenarios obligatorios:
   - E1, base;
   - E0, grupos iguales;
   - E2, Sejong;
   - E3, ambiental-hídrico.
4. **Agregación:**
   - **WLC**, combinación lineal ponderada;
   - **OWA** ponderado (Yager 1996) con cuantificador RIM Q(r) = r^α, α = (1 − ORness)/ORness. Con ORness 0,5 equivale a WLC; con valores menores, una celda débil en un criterio no puede compensarlo con otros.

   Si a una celda le falta un factor, se renormaliza sobre los factores disponibles.
5. **Sensibilidad por Monte Carlo:** pesos ~ Dirichlet(κ·w) con κ = 50 y N = 1000 (2000 en el script de resultados). Se reporta la probabilidad de que cada celda quede en el 10 % superior.
6. **Regiones candidatas** (`sites.ts`): se toman las celdas aptas del 2 % superior y se agrupan por contigüidad H3. Se exige superficie útil (descontando pendientes > 15 %) ≥ P / densidad bruta (R14). Por defecto 75 hab/ha, dentro del rango 60–90 de la revisión.

## 4. Simulador de redistribución

Para cada destino elegido calcula, como derivación aritmética [D]:

| Resultado | Cálculo |
|---|---|
| Suelo | P / densidad |
| Agua | P · q |
| Fracción del caudal del río cercano | Demanda de agua sobre q_rio25 |
| Viviendas | P / personas por vivienda |
| Energía eléctrica anual | P · consumo por habitante |
| Índice climático | (HDD + 1,5·CDD) relativo a la media nacional ponderada por población |

Sobre el sistema urbano calcula la participación del AMBA (CABA + 24 partidos) y el índice de Herfindahl provincial, antes y después del traslado. El consumo eléctrico por habitante y las personas por vivienda son **parámetros editables sin valor verificado**: deben calibrarse con CAMMESA y con INDEC.

## 5. Reproducibilidad

```bash
pip install -r pipeline/requirements.txt
python pipeline/download.py     # ≈2,5 GB en data/raw (no versionado)
python pipeline/build.py        # ≈2 min → web/public/data
cd web && npm ci && npm test && npm run build
npx vite-node scripts/escenarios.ts > ../docs/resultados.json
```

## 6. Limitaciones y sesgos conocidos

Están ordenadas según cuánto pueden cambiar los resultados.

1. **Caudales modelados.**
   - HydroRIVERS deriva sus caudales de un modelo global (WaterGAP), no de aforos.
   - En cuencas áridas y reguladas puede desviarse mucho del caudal observado. Por ejemplo, para el tramo inferior del río Chubut da unos 240 m³/s, un valor que parece alto para un río de meseta patagónica.
   - Tampoco descuenta represas ni usos consuntivos existentes.
   - **Antes de cualquier conclusión sobre un valle patagónico hay que contrastar con la BDHI (SSRH).**
2. **Faltantes que favorecen sistemáticamente a algunas regiones.**
   - Sin suelos INTA (R05/F13), la Pampa húmeda no sufre su costo de oportunidad agrícola.
   - Sin arsénico (F02), no se penaliza el acuífero pampeano.
   - Sin deslizamientos (F10), fallas activas (R07) ni volcanes (R08), el NOA, Cuyo y la cordillera patagónica quedan favorecidos.
   - Sin OTBN ni glaciares (R01 completo), el Chaco y la cordillera quedan favorecidos.
3. **Inundación subestimada en la llanura pampeana.** El mapa del JRC omite cuencas menores de unos 5.000 km² y los anegamientos por ascenso freático (cuenca del Salado).
4. **Pendiente subestimada.** Un MDE de 1 km suaviza el relieve. La restricción R04 usa la fracción de la celda con pendiente ≤15 % como sustituto del umbral de 25 % a 30 m de la literatura. Conviene recalcular con el MDE-Ar de 30 m del IGN.
5. **Clima de 1970–2000.** No incluye proyecciones de cambio climático. El confort térmico es una aproximación desde las extremas mensuales, no el UTCI horario.
6. **Pesos.** Son juicio experto inicial. Para uso decisorio deben elicitarse con actores (AHP con CR < 0,10) y reportarse junto con la robustez.
7. **Censo 2022:** se usa la población en viviendas particulares, alrededor del 1 % menos que la población total.
8. **Licencias:** el mapa sísmico GEM tiene licencia CC BY-NC-SA, solo uso no comercial.
