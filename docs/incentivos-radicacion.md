# Incentivos a la radicación de personas y empresas: mapeo con alcance geográfico

Fecha de verificación: 21 de octubre de 2026.

> **Relación con otros documentos.** `docs/politicas-territoriales.md` (§3.3) ya revisa la evidencia sobre polos y sobre la promoción industrial de La Rioja, Catamarca, San Luis, San Juan y Tierra del Fuego. Aquí no se repite esa revisión: se mapean **los incentivos que existen hoy**, dónde rigen y cuánto cuestan.
>
> **Los incentivos municipales** los releva otro agente en `data/interim/incentivos/municipales.csv`, así que este relevamiento no los incluye.

**Datos producidos** (en `data/interim/incentivos/`):

| Archivo | Contenido |
|---|---|
| `incentivos.csv` | 67 incentivos (28 nacionales y 39 provinciales), con las columnas pedidas |
| `incentivos_departamento.csv` | 2.455 pares `cod_dep`–`incentivo_id`. Las provincias están expandidas a todos sus departamentos. **Los incentivos con alcance `pais` no se expanden**, porque son constantes en todo el territorio y no discriminan entre departamentos |
| `zonas_francas.geojson` | 17 puntos: 14 zonas operativas y 3 en construcción o en desarrollo, con el departamento que contiene cada punto |
| `contribuciones_zona_27541.csv` | Tabla auxiliar: puntos de crédito fiscal de IVA por contribuciones patronales (Anexo I de la Ley 27.541) para los 529 departamentos, con la precisión del mapeo. Es el único incentivo nacional con **intensidad continua por departamento** |

Los cuatro archivos se regeneran con `python3 pipeline/incentivos.py`. El script contiene la tabla de incentivos y el mapeo de zonas a departamentos.

---

## 0. Resumen

1. **El mapa de incentivos tiene dos ejes, uno patagónico y otro norteño, y apuntan a destinatarios distintos.**
   - **Patagonia** (Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego, más La Pampa, Patagones y Malargüe) concentra los incentivos **para personas**:
     - asignaciones familiares diferenciadas;
     - un 40 % adicional en las jubilaciones;
     - la Zona Fría automática;
     - la exención de combustibles;
     - en Tierra del Fuego, el IVA exento.

     Un departamento patagónico tiene, en promedio ponderado por población, unos 7 incentivos vigentes, de los cuales 4 o 5 llegan a hogares o trabajadores.
   - **El NEA y el NOA** concentran el **abaratamiento de la mano de obra para empresas**: el crédito fiscal de IVA por contribuciones patronales es de 7 a 8,85 puntos de la nómina en Formosa, Chaco, Santiago del Estero, Misiones y Jujuy. En cambio, casi no tienen incentivos para hogares.
2. **Entre 2024 y 2026 se recortaron varios regímenes con alcance geográfico:**
   - la deducción patagónica del 22 % en Ganancias (Ley 27.743, 2024);
   - ProCreAr (Decreto 1018/2024);
   - la Zona Fría ampliada, que **desde el 13/10/2026** pasó a ser focalizada por ingresos (Ley 27.828).

   El régimen Norte Grande (Decreto 191/2021) dejó de generar beneficios en 2025. Los reembolsos por puertos patagónicos están derogados desde 2016. Los nuevos regímenes nacionales (RIGI, RIFL y RIMI, este último de la Ley 27.802) **no tienen diferencial geográfico**.
3. **Costo fiscal 2026.** Los incentivos geográficos nacionales con dato suman unos **USD 2.700 M por año**:
   - Tierra del Fuego: 1.307;
   - crédito de IVA por zona: 656;
   - combustibles en la zona sur: 394;
   - ampliación de la Zona Fría: unos 300 según la prensa.

   Esta suma excluye los regímenes nacionales sin diferencial geográfico (PyME, Economía del Conocimiento). La conversión a dólares supone un tipo de cambio de $1.374 por USD [D], el promedio de las pautas del Presupuesto 2026 para fin de 2025 y fin de 2026.
4. **Evidencia.** Solo hay evidencia observacional de dos regímenes: Tierra del Fuego y la promoción industrial de La Rioja, Catamarca, San Luis y San Juan. Para los demás **no se encontró ninguna evaluación**, ni causal ni descriptiva.
5. **Vacíos.**
   - **No existe un incentivo nacional para que una persona se radique en un lugar.** Los que llegan a las personas compensan el costo de vida en la Patagonia, no la decisión de mudarse.
   - Los programas de repoblamiento son municipales o de fundaciones. El caso provincial más claro es el apoyo de Santa Fe a "Bienvenidos a mi Pueblo".
   - En tierra fiscal hay regímenes de adjudicación en venta (Río Negro), pero no programas de "tierra por radicación".

---

## 1. Método y niveles de verificación

- **Normas nacionales.** Se leyó el texto consolidado en la Biblioteca Electrónica de ARCA (`biblioteca.afip.gob.ar/dcp/…`), que indica el estado de la norma y sus modificaciones hasta 2026. Se complementó con el Boletín Oficial y con argentina.gob.ar/normativa. Infoleg devolvía 403 desde el proxy.
- **Costo fiscal.** La fuente es el *Informe sobre gastos tributarios 2024–2026* de la DNIAF (septiembre de 2025), con valores de 2026 en pesos convertidos a dólares [D].
- **Normas provinciales.** El nivel de verificación es menor:
  - **[N]** texto de la norma leído (Córdoba 10.792, Salta 8.086, Jujuy 5.922);
  - **[S]** resumen oficial secundario: fichas "Normativa e incentivos" y "Incentivos" de argentina.gob.ar, de julio a octubre de 2024, o comunicados del gobierno provincial;
  - **[A]** prensa o estudios jurídicos. Lo que no se pudo confirmar quedó como `incierto`.
- **Etiquetas de evidencia:** se usan las de `politicas-territoriales.md`: [E] causal, [O] observacional, [A] anécdota o prensa, [J] juicio propio, [D] derivación aritmética.
- **Corrección al pedido:** **no existe un "Decreto 191/2023"** sobre el Norte Grande. La norma es el **Decreto 191/2021**, prorrogado por el Decreto 899/2021.

---

## 2. Incentivos nacionales

En las tablas, **USD M/año** es el costo fiscal de 2026 salvo que se indique otro año.

### 2.1 Regímenes con alcance geográfico

| ID | Incentivo | Norma | Estado (oct. 2026) | Alcance | Intensidad | Beneficiario | USD M/año |
|---|---|---|---|---|---|---|---|
| N01 | Régimen fiscal y aduanero de Tierra del Fuego | Ley 19.640 (1972) | Vigente, sin plazo | Isla Grande (94008, 94011, 94015) | IVA exento dentro del área, Ganancias exento, sin derechos de importación | Empresas y hogares | **1.307** (todo el régimen) |
| N02 | Subrégimen industrial de Tierra del Fuego | Decreto 727/2021 (mod. Decreto 111/2025) | Vigente hasta **31/12/2038**, prorrogable 15 años | Ídem | El aporte del 15 % del beneficio de IVA al FAMP se redujo a **0 %** (Res. 20/2026) porque la baja de aranceles erosionó la ventaja | Empresas | incluido en N01 |
| N03 | Promoción de La Rioja, Catamarca, San Luis y San Juan | Leyes 22.021, 22.702 y 22.973; Decreto 699/2010 | **Vencido** (2012), con beneficios residuales | 46, 10, 74 y 70 | Ganancias e IVA, con tope de 45 % (Decreto 699/2010) | Empresas | 159 (residual, Decretos 2054/92 y siguientes) |
| N04 | Promoción industrial general | Ley 21.608 (1977) | **Incierto**: no verificado | País | — | Empresas | — |
| N05 | Deducciones de Ganancias +22 % en la Patagonia | Art. 30 de la Ley de Ganancias | **Derogado** por la Ley 27.743, art. 71 (julio de 2024) | 42, 58, 62, 26, 78, 94 y Patagones | +22 % sobre las deducciones personales | Trabajadores y jubilados | 73 (2024) |
| N06 | Reembolsos por puertos patagónicos | Ley 23.018; Decreto 2229/2015 | **Derogado** por el DNU 1199/2016 | Puertos de San Antonio Este a Ushuaia | Entre 8 % y 13 % del FOB según el puerto [A] | Empresas | — |
| N07–N10 | Asignaciones familiares por zona | Ley 24.714; Decreto 1668/2012 (montos de la Res. ANSES 283/2026) | Vigente | Zona 1: La Pampa, Río Negro, Neuquén, 3 departamentos de Formosa, distritos de Mendoza y Orán. Zona 2: Chubut. Zona 3: Puna de Jujuy y Catamarca y norte de Salta. Zona 4: Santa Cruz y Tierra del Fuego | Asignación por hijo de hasta unas **2,2 veces** la general en las zonas 2 a 4 (en octubre de 2026: $168.837 contra $78.304 [A]). AUH en zona diferencial: $203.565 contra $156.588 | Hogares | sin dato |
| N11 | Bonificación por zona austral en jubilaciones | Ley 19.485 (mod. Decreto 1472/2008) | Vigente | 42, 58, 62, 26, 78, 94 y Patagones | **+40 %** sobre el haber; la CSJN (2019) resolvió que no lo reducen los topes | Jubilados | sin dato |
| N12 | Adicional por zona desfavorable en salarios | Convenios colectivos y estatutos | **Incierto**: no hay norma general | Patagonia, principalmente | Varía según el convenio | Trabajadores | — |
| N13 | **Zona Fría automática** | Ley 25.565, art. 75, inc. a; **Ley 27.828 y Decreto 1161/2026** | Vigente hasta **31/12/2031** | Patagonia (incluye La Pampa y Patagones), Malargüe y Puna (Jujuy y Los Andes en Salta) | Hasta octubre de 2026: 50 % del cuadro tarifario. Ahora: bonificación sobre el precio del gas en PIST, con monto a fijar por el PEN (nuevo porcentaje no verificado). Unos 940.000 usuarios | Hogares | Fondo autofinanciado (pagos 2023: $74.416 M) |
| N14 | **Zona Fría ampliada**, ahora focalizada | Ley 27.637, art. 4, **derogado** por la Ley 27.828 | Vigente solo para hogares del Régimen de Subsidios Focalizados con ingresos de hasta 3 CBT, ReNaBaP, veteranos o CUD | 231 departamentos de las subzonas IIIa a VI. El CSV trae una **lista parcial**: Córdoba (13), San Juan (8) y Mendoza (17) | Antes: 30 % automático (50 % para vulnerables), unos 3,37 M usuarios | Hogares | unos 300 [A] |
| N15 | Exención de combustibles en la zona sur | Ley 23.966, Tít. III, art. 7, inc. d (Ley 27.209) | Vigente | 58, 42, 62, 26, 78, 94, Patagones y Malargüe | Exención del impuesto; el gasoil paga un monto fijo diferencial | Empresas y hogares | **394** |
| N16 | Zonas francas | Ley 24.331 (1994) | Vigente | 17 puntos (ver §2.3) | Fuera del territorio aduanero; sin tributos nacionales mientras la mercadería permanece en la zona | Empresas | sin dato |
| N20 | Bonificación de tasa PyME en el Plan Belgrano | Ley 27.264, art. 42 | **Incierto** | NOA y NEA (10 provincias) | Monto reglamentario no verificado | Empresas | — |
| N21 | Compensación a PyMEs de frontera | Ley 27.264, art. 10 | **Incierto**: es una facultad sin reglamentación encontrada | — | — | Empresas | — |
| N22 | **Crédito de IVA por contribuciones patronales según zona** | Ley 27.541, art. 21 y Anexo I (reemplazó al Anexo I del Decreto 814/2001) | Vigente, sin plazo | **85 zonas**, mapeadas a 490 departamentos con más de 0 puntos | De 0 (CABA y GBA) a **8,85 puntos** de la nómina (resto de Chaco, Formosa y Santiago del Estero) | Empresas | **656** |
| N23 | Norte Grande: menos contribuciones por nuevas altas | Decreto 191/2021 y Decreto 899/2021 | **Vencido**: altas hasta 06/2022, beneficio hasta 06/2025 | 10, 22, 18, 34, 38, 46, 54, 66, 86 y 90 | 80 %, 55 % y 30 % para mujeres; 70 %, 45 % y 20 % para varones (años 1 a 3) | Empresas | 0,6 (2025); 0 (2026) |
| N28 | Tierras fiscales en zona de frontera | Ley 18.575 (1970) | **Incierto** | — | Adjudicación para radicar pobladores; no se verificaron programas activos | Hogares y empresas | — |

**Sobre el Decreto 814/01.** El pedido lo menciona, y está **derogado**. La Ley 27.541 (art. 26) lo derogó y trasladó su Anexo I de reducción por provincia al Anexo I propio, con los mismos puntos. Ese anexo es el incentivo N22, que **sigue vigente**: la Ley de Modernización Laboral 27.802 (2026) no lo modificó. Hay dos simplificaciones en el mapeo de zonas a departamentos (ver `precision_mapeo`):
- los "Gran X" (Gran Córdoba, Gran Mendoza, etc.) se asignaron a los departamentos del aglomerado;
- el "tercer cinturón del GBA" es una lista propia.

### 2.2 Regímenes nacionales sin diferencial geográfico

Se incluyen porque compiten con los regionales o los neutralizan.

| ID | Incentivo | Norma | Estado | Intensidad | USD M/año |
|---|---|---|---|---|---|
| N17 | RIGI | Ley 27.742; Decreto 105/2026 | Vigente; adhesión hasta **8/7/2027** | Ganancias al 25 %, amortización acelerada, sin derechos de importación y exportación, estabilidad por 30 años, para inversiones de más de USD 200 M | sin dato |
| N18 | Economía del Conocimiento | Ley 27.506 (mod. 27.570) | Vigente hasta **31/12/2029** | Bono de 70 % de las contribuciones; **80 % por nuevas altas de residentes en "zonas desfavorables o provincias de menor desarrollo"** (art. 9 inc. e); Ganancias reducido 60 %, 40 % o 20 % | 358 |
| N19 | PyME: impuesto al cheque a cuenta de Ganancias | Ley 27.264 | Vigente | El art. 11 prevé un diferencial de 5 % a 15 % para economías regionales | 766 |
| N24 | RIFL | Ley 27.802, Tít. XX; Decreto 315/2026 | Vigente (altas hasta 04/2027) | Contribuciones de 5 % durante 48 meses por nuevas altas | sin dato |
| N25 | RIMI | Ley 27.802, Tít. XXIII; Decreto 242/2026 | Vigente | Amortización acelerada para inversiones PyME desde USD 150.000 | sin dato |
| N26 | ProCreAr | Decreto 902/2012 | **Derogado** (Decreto 1018/2024) | No se verificó una prioridad geográfica explícita | — |
| N27 | Casa Propia – Construir Futuro | Res. 16/2021 y Res. 227/2023 | **Incierto**: prorrogado formalmente hasta 2026, sin evidencia de ejecución | — | — |

**Dónde se aprobaron proyectos RIGI.** A octubre de 2026 eran unos 25 proyectos por unos USD 60.000 M según iProfesional y La Nación, en estas provincias:
- **Río Negro:** GNL Southern Energy, USD 15.156 M; oleoducto VMOS, 2.900; gasoducto San Matías;
- **Neuquén:** Los Toldos II Este, 6.432; Rincón de Aranda, 4.522; Bajo del Choique, 12.240 (aprobado el 19/10);
- **San Juan:** Vicuña, 9.737; Los Azules, 2.672;
- **Catamarca:** MARA, 4.000, más 5 proyectos mineros;
- **Salta:** Rincón, 2.744;
- **Mendoza:** PSJ Cobre Mendocino, 891;
- **Buenos Aires:** Fértil Pampa, 2.693;
- **Santa Fe, Jujuy y La Pampa.**

El RIGI no discrimina por lugar, pero en la práctica se concentra donde están los recursos: cordillera y Vaca Muerta [O].

### 2.3 Zonas francas (Ley 24.331)

Fuente: CFI (2023), con 14 zonas operativas y 3 en construcción. Las coordenadas son **aproximadas**, en el centro de la localidad o del área portuaria, con un error de unos ±5 km (`zonas_francas.geojson`).

| Zona franca | Provincia | Localidad (departamento) | Estado |
|---|---|---|---|
| La Plata | Buenos Aires | Ensenada (06245) | Operativa; preexistente (Ley 5.142, 1907); la de más usuarios |
| Bahía Blanca – Coronel Rosales | Buenos Aires | Bahía Blanca (06056) | Operativa |
| Córdoba | Córdoba | Córdoba (14014) | Operativa |
| Comodoro Rivadavia | Chubut | Escalante (26021) | Operativa |
| Concepción del Uruguay | Entre Ríos | Uruguay (30098) | Operativa desde 2014 |
| Perico | Jujuy | El Carmen (38014) | Operativa (RG 5435/2023) |
| General Pico | La Pampa | Maracó (42105) | Operativa |
| Mendoza | Mendoza | Luján de Cuyo (50063) | Operativa |
| Puerto Iguazú | Misiones | Iguazú (54063) | Operativa |
| Zapala | Neuquén | Zapala (58112) | Operativa |
| Salta | Salta | General Güemes (66049) | Operativa |
| Río Gallegos | Santa Cruz | Güer Aike (78021) | Operativa |
| Santafesina | Santa Fe | Villa Constitución (82028) | Operativa; ampliada por RG 5635/2025 |
| Justo Daract | San Luis | General Pedernera (74035) | Operativa |
| La Quiaca | Jujuy | Yavi (38112) | En construcción |
| Río Negro | Río Negro | Sierra Grande (62077) | En desarrollo |
| Caleta Olivia | Santa Cruz | Deseado (78014) | En construcción |

---

## 3. Incentivos provinciales

Todos los de esta tabla tienen como beneficiario a las empresas, salvo que se indique otra cosa. La columna **V** indica el nivel de verificación (ver §1).

| ID | Provincia | Norma | Estado | Intensidad principal | Alcance interno | V |
|---|---|---|---|---|---|---|
| P_CBA_01 | Córdoba | Ley 10.792 (2021) | Vigente | IIBB (sobre el incremento), Sellos e Inmobiliario exentos 10 años; subsidio por nuevo empleo y eléctrico por 5 años | Toda la provincia | N |
| P_CBA_02 | Córdoba | Ley 10.792, arts. 26 y 27 | Vigente | **15 años** de exención y subsidio de **7 años** | **10 departamentos del Norte y Oeste**: San Javier, San Alberto, Pocho, Minas, Cruz del Eje, Ischilín, Totoral, Tulumba, Sobremonte y Río Seco | N |
| P_CBA_03 | Córdoba | Ley Impositiva 2026 | Vigente | IIBB exento a la industria radicada | Toda | A |
| P_SFE_01 y 02 | Santa Fe | Ley 8.478 (1979); Decreto 1361/22; Ley Impositiva | Vigente | Exención de tributos provinciales hasta 10 años, con prioridad a parques; IIBB industrial exento hasta $1.300 M | Toda | S/A |
| P_SFE_03 | Santa Fe | Convenio con la Fundación Es Vicis | Incierto | Viviendas financiadas por la provincia a cambio de radicación (20 en Colonia Belgrano). **Beneficiario: hogares** | San Jerónimo (piloto) | S |
| P_ER_01 y 02 | Entre Ríos | Ley 11.071; Ley Impositiva | Vigente | IIBB, Sellos, Inmobiliario y Automotor exentos 10 años (+5); IIBB industrial exento hasta $1.430 M | Toda | A |
| P_ER_03 | Entre Ríos | Ley 10.394 (2015) | Incierto | Emprendedurismo joven con objetivo de arraigo rural. **Beneficiario: hogares** | Toda | A |
| P_BA_01 | Buenos Aires | Ley 13.656; Decreto 523/08 | **Incierto** (la anotación dice "derogada por Ley 15.510") | Exención de tributos provinciales con orden de prioridad regional | Toda | S |
| P_NQN_01 y 02 | Neuquén | Ley 378; **Ley 3502 "Invierta en Neuquén"** (2025) | Vigente; adhesión por 2 años | IIBB, Inmobiliario y Sellos hasta 10 años; estabilidad fiscal de 10 años; tierra pública a precio preferencial | Toda | S/A |
| P_RN_01 y 02 | Río Negro | **Ley 5766** y **Ley 5767** (2025); Ley 5769 (Viedma) | Vigente | IIBB hasta 100 % por 3 años (10 a 15 en parques); Sellos 50 %; Inmobiliario 10 años; bono de 20 % a 40 % de la inversión | Toda; parques; Viedma | S |
| P_RN_03 | Río Negro | Ley 5705 (2023); Decreto 423/2025 | Vigente | Tierras fiscales adjudicadas en venta (no son un premio a la radicación). **Beneficiario: hogares y empresas** | Toda | S |
| P_CHU_01 y 02 | Chubut | Ley IX N° 80 "Invierta en Chubut"; Ley VII N° 4 | Vigente | IIBB 10 años; Sellos 5 años; **subsidio de 25 % al gas y 15 % a la electricidad**; hasta 25 años por acto de promoción | Toda | S |
| P_CHU_03 | Chubut | Ley XXIV N° 124 (2026) | Incierto | IIBB y Sellos exentos 3 años para construir viviendas (hasta 6/2027). **Beneficiario: empresas y hogares** | Toda | A |
| P_SCZ_01 | Santa Cruz | Ley 3092 (2009), ampliada por **Ley 4011 (2026)** | Vigente | Tributos exentos 10 a 15 años; reintegro de hasta 40 % de la inversión (texto de 2009); estabilidad de 30 años (no verificado) | Toda | A |
| P_LPA_01 | La Pampa | Ley 2870 | Vigente | Préstamos de fomento, exenciones, venta de inmuebles fiscales | Toda | S |
| P_MZA_01 | Mendoza | Ley 9.584 (2024) | Vigente | Exención, estabilidad, aportes reembolsables o no (fondo de hasta 1 % de IIBB) | **Zonas turísticas**: Uspallata, Precordillera norte, sur de San Rafael, Huayquerías y Payunia (5 departamentos, mapeo aproximado) | S |
| P_MZA_02 | Mendoza | Ley Impositiva 2026 | Vigente | IIBB industrial de 0,5 % a 1,5 %; exenciones en parques | Toda | A |
| P_SJ_01 | San Juan | CEMOFI | Incierto | Bono de $3 M por año por nuevo empleo industrial | Toda | A |
| P_SL_01 | San Luis | Proyecto de 2026 | **Incierto**: no sancionado | Bono fiscal de hasta 100 % y terrenos fiscales | Toda | A |
| P_SL_02 | San Luis | Ley VIII-1087-2022 (turismo) | Vigente | IIBB, Inmobiliario y Sellos exentos hasta 100 % por 15 años; donación de inmuebles | Toda | S |
| P_CAT_01 y 02 | Catamarca | Ley 2968 (mod. Ley 5760/2022); Ley 5.267 (turismo) | Incierto / vigente | IIBB industrial de 1,5 % en 2026, exento desde 2027; turismo con IIBB exento 10 años | Toda | S/A |
| P_LR_01 | La Rioja | Ley 8.300 (2009) | Vigente | Devolución de 30 % de la inversión y 50 % de la infraestructura; tributos exentos 15 años; subsidio de tasa de 50 % | Toda | S |
| P_FOR_01 y 02 | Formosa | Ley 1608; Código Fiscal (Ley 1669) | Vigente / incierto | Call centers: 100 % los primeros 4 años, baja a 20 % en el año 8; industria exenta según reglamentación | Toda | S/A |
| P_CHA_01 | Chaco | Ley 937-I; Ley 1861 | Vigente | 4 regímenes; el "de fomento" premia el "arraigo poblacional" (porcentajes no verificados) | Toda | S |
| P_COR_01 | Corrientes | Ley 5.470 | Vigente | Estabilidad fiscal 10 años (+5); IIBB y Sellos exentos; inmuebles fiscales a 10 años; tarifa eléctrica de fomento | Toda (los municipios adheridos suman Inmobiliario) | S |
| P_MIS_01 | Misiones | Alícuota reducida de IIBB industrial | Incierto (vencía el 30/4/2026) | Alícuota reducida | Toda | A |
| P_SAL_01 | Salta | Ley 8.086 (2018) | Vigente | Tributos exentos hasta 5 años, **+4 en zonas prioritarias**; crédito fiscal de hasta 40 % de la inversión; comodato de bienes fiscales por 20 años | Toda | N |
| P_JUJ_01 | Jujuy | Ley 5.922 (2016), mod. Ley 6.336 | Vigente | Hasta 10 años: IIBB y Sellos; reintegro de 30 % de la inversión; reintegro de Ganancias de 30 % a 60 % (50 % a 80 % en zonas francas); prioridad a zonas de menor desarrollo | Toda | N |
| P_SDE_01 y 02 | Santiago del Estero | Ley 6.750 | Vigente | Devolución de 30 % de la inversión; tributos exentos 10 años; créditos turísticos | Toda; 6 departamentos turísticos | S |
| P_TUC_01 | Tucumán | Decreto 1998/3 (2023); Ley 9.767 | Vigente | IIBB de 1,5 % para turismo; Sellos exento en concesiones | Toda | S |
| P_RIGI_ADH | 5 a 13 provincias | Leyes de adhesión al RIGI | Incierto | No crean tributos locales nuevos sobre los proyectos RIGI | Lista según Canal 12 Misiones y Marval | A |

**Lectura [J].**
- Las leyes provinciales de promoción se parecen mucho entre sí: exención de IIBB, Sellos e Inmobiliario por 10 a 15 años, más reintegros de inversión. Por eso **casi no generan diferencias entre provincias**: si todas eximen, ninguna se diferencia.
- Lo que sí diferencia es:
  - la **modulación interna**: Córdoba con el Norte y Oeste, Salta con sus zonas prioritarias, Jujuy con las zonas de menor desarrollo, Mendoza con sus zonas turísticas, los parques industriales;
  - la **tasa general de IIBB a la industria**: 0 % en Córdoba y, con topes, en Santa Fe y Entre Ríos, contra 1,5 % en San Juan y Salta.

---

## 4. Mapa conceptual: qué regiones concentran incentivos

El cuadro muestra el promedio de incentivos **vigentes** por departamento, ponderado por la población de 2022, y el crédito de IVA del Anexo I de la Ley 27.541, también ponderado. Sale de `incentivos_departamento.csv` y `contribuciones_zona_27541.csv`.

| Provincia | Incentivos vigentes por departamento | Incentivos para hogares o trabajadores | Crédito de IVA (pts de nómina) |
|---|---|---|---|
| Chubut | 7,4 | 4,0 | 6,3 |
| Río Negro | 7,1 | 5,0 | 3,4 |
| Neuquén | 7,1 | 4,0 | 3,3 |
| Tierra del Fuego | 7,0 | 5,0 | 6,5 |
| Santa Cruz | 6,8 | 4,0 | 6,7 |
| La Pampa | 6,2 | 4,0 | 2,7 |
| Córdoba | 4,2 | 0,7 | 2,0 |
| Mendoza | 3,9 | 1,6 | 3,3 |
| Entre Ríos / Santa Fe | 3,1 / 3,0 | 0 | 3,0 / 2,5 |
| Jujuy / Salta | 2,3 | 0,2–0,3 | 7,7 |
| Santiago del Estero / Formosa / Chaco | 2,0–2,2 | 0 | 8,3–8,5 |
| Corrientes / Misiones | 2,0 / 1,1 | 0 | 7,1 / 7,8 |
| Catamarca / La Rioja / Tucumán / San Juan / San Luis | 1,8–2,3 | 0–0,8 | 3,4–6,1 |
| Buenos Aires | 0,4 | 0 | 0,4 |
| CABA | 0 | 0 | 0 |

Esta es la estructura de incentivos, de sur a norte:

```
                 PERSONAS (hogares/trabajadores)              EMPRESAS
                 ───────────────────────────────              ────────────────────────────────
 Patagonia       Asig. familiares x2,2 · jubilación +40%       TdF 19.640 (IVA, Ganancias, aduana)
 (+La Pampa,     Zona Fría automática · combustibles exentos   Crédito IVA 3–7 pts · RIGI (Vaca Muerta,
  Patagones,     (antes: Ganancias +22%, derogado 2024)        GNL) · leyes provinciales "Invierta en…"
  Malargüe)      TdF: IVA exento al consumo
                 ──────── compensación de COSTO DE VIDA ─────  ─── ancla productiva puntual ───
 Puna            Asig. familiares zona 3 · Zona Fría Puna      Crédito IVA 8 pts · RIGI litio/cobre
 NOA / NEA       (casi nada)                                   Crédito IVA 5,7–8,85 pts (el mayor)
                                                               (antes: Norte Grande 191/2021, vencido)
                                                               Leyes provinciales: reintegros 30–40%
 Cuyo / Centro   Zona Fría ampliada → focalizada (2026)        Córdoba Norte/Oeste 15 años · IIBB 0
                                                               industria (CBA; SF/ER con tope)
 AMBA            —                                             Crédito IVA 0 · sin diferencial
```

**Lectura [J].**
- **La Patagonia es la única región donde el Estado compensa de forma sistemática a las personas** por vivir allí.
- **El norte recibe abaratamiento del trabajo para las empresas**, el crédito de IVA de hasta 8,85 puntos, pero no tiene compensación para los hogares fuera de la Puna.
- **El AMBA no tiene ningún incentivo**, lo que es coherente con un objetivo de desconcentración.

---

## 5. Costo fiscal

Las estimaciones de 2026 son de la DNIAF en pesos, convertidas a dólares con $1.374 por USD [D].

| Incentivo | $ M (2026) | % PBI | USD M/año |
|---|---|---|---|
| Tierra del Fuego, Ley 19.640 (IVA 1.119.565, Ganancias 260.779, importación 169.452, Internos 245.583) | 1.795.379 | 0,17 | **1.307** |
| PyME, Ley 27.264 (impuesto al cheque a cuenta de Ganancias), sin diferencial geográfico | 1.052.239 | 0,10 | 766 |
| Crédito de IVA por contribuciones según zona (Decreto 814/01 y Ley 27.541) | 901.934 | 0,09 | **656** |
| Exención de combustibles en la zona sur | 541.543 | 0,05 | **394** |
| Economía del Conocimiento | 491.460 | 0,05 | 358 |
| Promoción industrial residual (Decretos 2054/92, 804/96, 1553/98 y 2334/06) | 217.788 | 0,02 | 159 |
| Ganancias +22 % en la Patagonia (último año: 2024) | 67.024 (2024) | 0,01 | unos 73 |
| Norte Grande, Decreto 191/2021 (2025) | 777 (2025) | 0,00 | unos 0,6 |
| Zona Fría ampliada (prensa: Los Andes, Econojournal) | — | — | unos 300 [A] |
| Zona Fría, todo el fondo (pagos 2023, autofinanciado con recargo sobre el PIST) | 74.416 (2023) | — | unos 210 [D, TC 2023 de unos $350] |

**Sin dato oficial:** asignaciones familiares por zona, zona austral jubilatoria, zonas francas, RIGI y todos los regímenes provinciales. Las provincias no publican gastos tributarios por régimen con regularidad. La excepción parcial es Córdoba, con un cupo de $160.000 M en 2025 [A].

**Orden de magnitud [J].** Los incentivos geográficos nacionales cuestan unos USD 2.700 M por año, alrededor del 0,4 % del PBI. **Tierra del Fuego explica cerca de la mitad**, con el 0,4 % de la población del país.

---

## 6. Qué dice la evidencia

| Incentivo | Evidencia | Nivel |
|---|---|---|
| Tierra del Fuego (19.640) | La población se multiplicó por 14 en 50 años y el 54,5 % de los residentes nació en otra provincia. Hay unos 8.500 empleos en la electrónica, con un costo de hasta USD 126.000 por puesto y año. No hay contrafáctico | [O]/[D] (ver `politicas-territoriales.md` §3.3) |
| Promoción de La Rioja, Catamarca, San Luis y San Juan | +31.728 empleos industriales entre 1973 y 1993, con un costo de USD 461.000 por puesto (estudio encargado por un actor interesado). En San Luis el empleo se sostuvo después de 2012 | [O]/[A] |
| Zonas francas | Predominan el almacenaje y la logística; el objetivo exportador e industrial "no ha sido concretado" (CFI 2023) | [O] |
| Crédito de IVA por zona (814/27.541), Norte Grande, Economía del Conocimiento con diferencial regional | **No se encontró ninguna evaluación.** La rebaja por zona existe desde 2001 sin evaluación pública de su efecto sobre el empleo o la localización | — |
| Asignaciones familiares, zona austral, Zona Fría, combustibles | No se encontraron evaluaciones de su efecto sobre la migración o la permanencia | — |
| RIGI | Demasiado reciente | — |
| Repoblamiento ("Bienvenidos a mi Pueblo") | 20.000 familias se postularon para 20 viviendas; no hay datos de permanencia | [A] |

**Evidencia internacional relevante** (revisada en `politicas-territoriales.md` §3.2):
- las rebajas de cargas laborales por zona tienen efectos positivos sobre el empleo local, pero modestos y con relocalización;
- los subsidios a la inversión funcionan sobre todo en firmas pequeñas (Criscuolo et al. 2019);
- **atraer población es un objetivo distinto de crear empleo**: las Empowerment Zones crearon empleo sin sumar población.

Para el crédito de IVA argentino se podría hacer una evaluación con discontinuidades en los límites de zona, por ejemplo Paraná (2,20 pts) frente al resto de Entre Ríos (3,00), o Gran Resistencia (7,30) frente al resto del Chaco (8,85), usando datos del SIPA por departamento (`empleo_departamento.csv`) [J].

---

## 7. Vacíos: incentivos para PERSONAS frente a incentivos para empresas

De los 46 incentivos vigentes del CSV, **36 tienen como beneficiario solo a empresas** y apenas **7 solo a hogares**. Los vacíos son estos:

1. **No hay un incentivo nacional a la decisión de mudarse.** Los beneficios para personas (asignaciones, jubilación, Zona Fría, combustibles) compensan el costo de vida de quien **ya vive** en la Patagonia o en la Puna. No hay bono de radicación, ni cobertura de gastos de mudanza, ni crédito hipotecario con prioridad territorial: ProCreAr está disuelto y Casa Propia es incierto.
2. **El único beneficio en el impuesto a las personas se derogó en 2024** (Ganancias +22 %). No hay deducción por residir en zonas de baja densidad, a diferencia de la deducción de IRPF por residencia en municipios despoblados de algunas comunidades autónomas españolas.
3. **NOA y NEA no tienen compensación para hogares** fuera de las asignaciones de la Puna. Tienen los mayores incentivos laborales para empresas y los menores para personas.
4. **No hay programas provinciales de "tierra por radicación".** Las leyes de tierras (Río Negro 5705) adjudican en venta. Ceder tierra fiscal es un beneficio **para empresas** en las leyes de promoción (Neuquén 378, Corrientes 5.470, La Rioja 8.300, Salta 8.086, San Luis). La Ley 18.575 de frontera, pensada para radicar pobladores, no tiene ejecución verificable.
5. **El repoblamiento de pueblos es municipal o privado.** Santa Fe es el único caso provincial encontrado, como apoyo a una fundación. No hay ley provincial de repoblamiento con beneficios definidos; los proyectos bonaerenses de "Arraigo Juvenil" no se sancionaron.
6. **Faltan incentivos salariales con diferencial geográfico** para profesionales escasos (salud, docencia) en el empleo público nacional. Varían por convenio y no se pudieron sistematizar (N12).
7. **Hay un sesgo de diseño.** Casi todos los regímenes provinciales premian la inversión y el empleo **de la empresa**. El único que nombra el "arraigo poblacional" como criterio es el régimen de fomento del Chaco (937-I), y su intensidad no se verificó.

---

## 8. Propuesta de uso en la app

### 8.1 Indicador de intensidad de incentivos por departamento (IIR)

Se propone un indicador de dos componentes. **No se suman**, porque responden a preguntas distintas.

```
IIR_empresas(d) = 0,50 · s(pts_IVA_27541(d))                      # costo laboral, continuo, 0–8,85
               + 0,25 · s(Σ incentivos impositivos/aduaneros vigentes en d, ponderados)
               + 0,15 · 1[TdF 19.640]  + 0,10 · 1[zona franca o parque con régimen]
IIR_personas(d) = 0,35 · z_AAFF(d)          # factor de zona: 1 general, ~1,2 zona 1, ~2,2 zonas 2–4
               + 0,25 · 1[zona austral jubilatoria +40%]
               + 0,20 · 1[Zona Fría automática]
               + 0,10 · 1[combustibles exentos] + 0,10 · 1[IVA exento TdF]
```

- `s()` reescala a [0, 1] entre el mínimo y el máximo nacional.
- Solo se usan filas con `vigencia_estado = vigente`. Las que están en `incierto` pueden entrar con un peso de 0,5 en un escenario de sensibilidad.
- Los incentivos con alcance `pais` (RIGI, RIFL, RIMI, Economía del Conocimiento, PyME) **no entran**: no discriminan entre departamentos. Sí conviene mostrarlos en la ficha como "aplica en todo el país". El RIGI se puede mostrar como capa de puntos con los proyectos aprobados.
- Los pesos son **[J]**: hay que calibrarlos, por ejemplo con el valor económico estimado del beneficio por trabajador u hogar. El crédito de IVA se puede monetizar directamente: puntos × salario medio del departamento (SIPA).
- **Capas sugeridas:**
  - `IIR_empresas` y `IIR_personas` como coropletas;
  - `zonas_francas.geojson` como puntos;
  - `contribuciones_zona_27541.csv` como capa continua;
  - un panel de "incentivos que aplican aquí" con la lista de `incentivos_departamento.csv`.

### 8.2 Qué instrumento de la app complementa cada incentivo

| Instrumento de la app | Incentivos que lo complementan | Cómo usarlo |
|---|---|---|
| **(a) Ciudad nueva** | TdF 19.640 (el precedente de "ciudad promovida"); zona franca; RIGI (ancla productiva: GNL en Río Negro, litio en la Puna); leyes "Invierta en…" de Neuquén, Río Negro y Chubut | Ubicar la ciudad donde ya rigen N22 (crédito de IVA alto) y beneficios para personas (zona austral, asignaciones). El vacío principal es un **régimen de radicación de hogares** y crédito de vivienda, que la app debería modelar como instrumento propio |
| **(b) Traslado de capital** | Pocos: el traslado de empleo público no necesita incentivos fiscales. El adicional por zona en salarios públicos (N12) es la palanca natural | Comparar el costo del traslado con los adicionales salariales que habría que pagar. Mostrar qué beneficios para personas ya existen en el destino |
| **(c) Ciudades intermedias** | Crédito de IVA (N22): las capitales provinciales tienen menos puntos que el resto de la provincia, y eso **juega en contra** de concentrar en la intermedia. También Córdoba Norte y Oeste, Salta (zonas prioritarias), Jujuy (menor desarrollo), parques industriales | Usar `IIR_empresas` para detectar intermedias con incentivos altos y empleo bajo, donde el cuello de botella no es fiscal |
| **(d) Pueblos (repoblamiento)** | Casi ninguno a nivel nacional o provincial (Santa Fe con Es Vicis; Entre Ríos 10.394 incierto); los municipales se relevan aparte | Mostrar el vacío de forma explícita. Proponer un "paquete pueblo": vivienda o tierra, más el crédito de IVA existente, más conectividad. Cruzar con `municipales.csv` |
| **(e) Polos productivos** | Crédito de IVA (N22), leyes provinciales de promoción, zonas francas, RIGI, Economía del Conocimiento (80 % en zonas de menor desarrollo) | `IIR_empresas` como factor. Recordar que el diferencial interprovincial de las leyes provinciales es chico [J] y que la evidencia sobre zonas francas es negativa |

### 8.3 Advertencias para el uso

1. **La Zona Fría cambió hace una semana.** La Ley 27.828 está publicada desde el 13/10/2026 y el nuevo porcentaje de bonificación sobre el PIST depende de la reglamentación. La lista de departamentos de la zona ampliada (N14) está **incompleta**: faltan 94 partidos de Buenos Aires y departamentos de Santa Fe, San Luis, Salta y La Rioja. Se pueden completar con el buscador de localidades de ENARGAS.
2. **Mapeo de N22 por departamento.** Las zonas del Anexo I se definen por aglomerado ("Gran X") o por departamento. Las zonas mixtas o aproximadas están marcadas en `precision_mapeo`: Confluencia en Neuquén, el sur de Río Negro, el tercer cinturón del GBA y Patagones.
3. **Asignaciones familiares en Mendoza y Orán.** La zona 1 se define por **distritos**; el mapeo a departamento entero sobreestima su alcance.
4. **Fichas provinciales de argentina.gob.ar.** Son de 2024 y tienen foco turístico. Conviene revalidar con los boletines provinciales antes de publicar.

---

## 9. Fuentes principales

- Biblioteca Electrónica de ARCA, textos consolidados:
  - Leyes 19.640, 24.331, 24.714, 25.565, 27.264, 27.506, 27.541 (y su Anexo I `biblioteca.afip.gob.ar/pdfp/ley_27541_A1.pdf`), 27.637, 27.742, 27.743, 27.802 y 27.828;
  - Decretos 191/2021, 699/2010, 727/2021 y 814/2001.
- Boletín Oficial:
  - Decreto 1668/2012 (zonas de asignaciones familiares);
  - Res. SIyC 19 y 20/2026 (FAMP-Fueguina);
  - resolución de combustibles del 1/4/2026 (art. 7 inc. d de la Ley 23.966).
- DNIAF, *Informe sobre gastos tributarios. Estimación 2024–2026* (septiembre de 2025).
- Secretaría de Energía, *Informe Régimen de Zona Fría* (2024).
- CFI, *Facilitación de Comercio – Zonas Francas* (2023).
- argentina.gob.ar, fichas "Normativa e incentivos" e "Incentivos" por provincia (2024).
- Legislatura de Córdoba, Ley 10.792.
- Consejo Profesional de Salta: textos de la Ley 8.086 (Salta) y de la Ley 5.922 (Jujuy).
- Prensa y estudios, nivel [A]: La Nación (24/9/2026, Zona Fría); Palabras del Derecho (13/10/2026); iProfesional (9/10/2026 RIGI; 30/9/2026 IIBB provinciales); Marval (adhesiones al RIGI; Ley de Santa Cruz); Infocampo (reembolsos patagónicos); Los Andes y Econojournal (costo de la Zona Fría).

Las URL completas están en la columna `fuente_url` de `incentivos.csv`.
