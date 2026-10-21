# Coeficiente regional de costo de construcción (vivienda social)

Archivo de datos: `web/src/model/costoRegional.json`. Base: Gran Buenos Aires = 1,00.

## Fuente principal

**Resolución 8/2021 de la Secretaría de Hábitat** (Ministerio de Desarrollo Territorial y Hábitat), publicada en el BO el 10/08/2021. Su Anexo (IF-2021-70745373-APN-SH#MDTYH) fija los **montos máximos financiables por m² en UVI** que el Programa Casa Propia - Construir Futuro reconoce por provincia para vivienda nueva. El prototipo es una vivienda unifamiliar de hasta 64 m², 2 dormitorios, en planta baja, e incluye vereda, forestación y alumbrado público.
PDF: https://www.argentina.gob.ar/sites/default/files/infoleg/352785/res8.pdf

Según la Res. SH 2/2021, los valores por provincia "contemplan en forma integral los costos de los insumos (materiales), mano de obra, gastos de logística, sismicidad, códigos de edificación locales, etc.". Es la única tabla oficial nacional con valores para las 24 jurisdicciones que encontramos.

## Fuentes de control

- **Res. SH 2/2021** (marzo 2021, en pesos): https://www.argentina.gob.ar/sites/default/files/infoleg/347550/res2.pdf. Los cocientes son casi idénticos: TDF 1,590, Santa Cruz 1,379, Neuquén/Cuyo/NOA norte 1,045. Hay dos diferencias: en 2021-03 Chubut figuraba en 1,218 (en la Res. 8 pasa a 1,264), y La Pampa, Córdoba y el NEA/NOA sur estaban en 1,00.
- **Patagonia Construye (sept. 2026)**: estimación privada que parte del ICC CABA y suma diferenciales de flete y zona UOCRA. Da Neuquén Capital ≈ 0,9-1,0 y Ushuaia ≈ 1,7-1,9 respecto del índice CABA. Coincide en orden de magnitud con la tabla oficial (Neuquén 1,04 y TDF 1,59), pero no es una fuente oficial.

## Método

coef = (UVI/m² de la provincia) / (943,30 UVI/m² de GBA). Como ambos valores están en UVI, el cociente no depende de la inflación ni de la fecha de actualización. Buenos Aires (06) toma el valor común a "Gran Bs. As." e "Interior de Bs. As.". **Ninguna provincia es imputada.**

## Tabla

| Cód. | Jurisdicción | UVI/m² | Coef. |
|---|---|---|---|
| 02 | CABA | 943,30 | 1,000 |
| 06 | Buenos Aires | 943,30 | 1,000 |
| 30 | Entre Ríos | 943,30 | 1,000 |
| 82 | Santa Fe | 943,30 | 1,000 |
| 14 | Córdoba | 962 | 1,020 |
| 18 | Corrientes | 962 | 1,020 |
| 22 | Chaco | 962 | 1,020 |
| 34 | Formosa | 962 | 1,020 |
| 54 | Misiones | 962 | 1,020 |
| 86 | Santiago del Estero | 962 | 1,020 |
| 90 | Tucumán | 962 | 1,020 |
| 10 | Catamarca | 985 | 1,044 |
| 38 | Jujuy | 985 | 1,044 |
| 42 | La Pampa | 985 | 1,044 |
| 46 | La Rioja | 985 | 1,044 |
| 50 | Mendoza | 985 | 1,044 |
| 58 | Neuquén | 985 | 1,044 |
| 62 | Río Negro | 985 | 1,044 |
| 66 | Salta | 985 | 1,044 |
| 70 | San Juan | 985 | 1,044 |
| 74 | San Luis | 985 | 1,044 |
| 26 | Chubut | 1.192 | 1,264 |
| 78 | Santa Cruz | 1.300 | 1,378 |
| 94 | Tierra del Fuego | 1.499 | 1,589 |

## Advertencias

1. **Son topes de financiamiento, no costos medidos.** La tabla agrupa provincias en escalones (1,00 / 1,02 / 1,044) y no capta diferencias finas. Por ejemplo, el costo real en el NEA podría ser *menor* que en GBA por los salarios, pero la tabla no lo refleja.
2. **No distingue dentro de una provincia.** Las ciudades turísticas o aisladas (Bariloche, El Calafate, la Puna) pueden costar bastante más que el promedio provincial.
3. **Vigencia.** Es la tabla oficial más reciente que pudimos verificar (agosto 2021). Existe una Res. SH 2/2023 que podría haberla modificado, pero el Boletín Oficial no respondió y no pudimos verificarla. La estructura relativa fue estable entre marzo y agosto de 2021.
4. **No se usaron los ICC provinciales** (DPEC Neuquén, IPEC Santa Fe, DGEyC Córdoba, DEIE Mendoza). Publican índices o valores con tipologías y fechas distintas al ICC INDEC GBA, y no pudimos armar un cociente homogéneo para las 24 jurisdicciones. Son el camino natural para refinar este coeficiente.
5. La prima patagónica responde en gran parte a las zonas salariales del convenio UOCRA y a la logística. Si el modelo ya ajusta la mano de obra por región, hay riesgo de contarla dos veces.
