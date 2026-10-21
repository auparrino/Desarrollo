# Casos del mundo: políticas de desarrollo territorial y redistribución de población

Fecha de elaboración: 21 de octubre de 2026.

> **Relación con otros documentos.** Este texto amplía `docs/politicas-territoriales.md`, que ya cubre capitales nuevas (§1), ciudades nuevas (§2), polos y la evidencia causal clásica sobre políticas basadas en el lugar (§3: TVA, Empowerment Zones, Zonenrandgebiet, RSA británica, zonas chinas), repoblamiento de pueblos (§4: España, Japón, Italia, Argentina) y migración interna argentina (§5). Aquí **no se repiten** esas fichas: cuando un caso ya está allí, la tabla lo resume en una línea y remite a la sección. Lo nuevo es la cobertura por país (China, Brasil, la UE, Italia, Alemania, Francia, el Reino Unido, Japón, Corea, Rusia, Kazajistán, Indonesia, India, EE. UU., Canadá, Australia, Chile, México, Escandinavia y Nueva Zelanda), con foco en **qué resultados se midieron** y qué enseñan para cada instrumento de la app.
>
> Los mismos 40 casos están en `web/src/model/casos.json`, con lecciones en lenguaje llano y coordenadas para el mapa de "Casos del mundo".

---

## 0. Resumen

1. **Lo que más se repite en los casos que funcionaron es el empleo.** Los programas que movieron o retuvieron población lo hicieron porque crearon o trasladaron puestos de trabajo: las villes nouvelles de París crearon 300.000 empleos, las Áreas de Desarrollo Industrial del Mezzogiorno dejaron industria y servicios calificados que persistieron, y la Zona Franca de Manaus hizo crecer el PBI per cápita. Los que dieron tierra, vivienda o dinero para mudarse sin empleo atrajeron poca gente o a la gente equivocada: la Hectárea del Lejano Oriente, los reasentamientos de Kazajistán y las visas regionales australianas.
2. **Hacer crecer el PBI de una región no es lo mismo que retener población.** El Desarrollo del Oeste chino subió 1,6 puntos por año el crecimiento del PBI regional, pero no movió el empleo ni los salarios. Alemania Oriental duplicó su PBI real y llegó al 79 % del ingreso per cápita del Oeste, y aun así perdió el 16 % de su población. Los Fondos de Cohesión europeos subieron el crecimiento, pero no el empleo.
3. **Los incentivos fiscales en zonas chicas suelen mover actividad en vez de crearla.** Las Zones Franches Urbaines francesas, la LEGI británica, los Freeports y las Opportunity Zones muestran desplazamiento desde zonas vecinas, empleos tomados por gente de afuera o ningún efecto rural.
4. **Trasladar agencias públicas tiene efectos reales pero chicos y locales.** Cada empleo público trasladado trae cerca de un empleo privado, pero en el mismo barrio. Suecia trasladó o creó agencias con unos 10.000 empleos en 17 años, con efectos importantes en pocas ciudades y chicos en el total. En Corea solo el 40 % de los empleados de las 153 instituciones trasladadas se mudó con su familia.
5. **La continuidad política decide más que el diseño.** Las Zonas Económicas Especiales de México duraron tres años. La Cassa per il Mezzogiorno funcionó mientras tuvo autonomía técnica y empeoró al descentralizarse en 1971. Los regímenes que duraron décadas, como Manaus, Arica o Finnmark, siguen vivos pero se volvieron difíciles de evaluar y de cortar.
6. **Concentrar rinde más que repartir.** La Cassa rindió en pocas áreas con base industrial y no en las periféricas. La UE rinde en el 30 % de las regiones con capital humano e instituciones. Francia apostó a 8 metrópolis, no a cientos de pueblos.
7. **Las rutas tienen la evidencia más sólida para poblar una frontera.** La Marcha para el Oeste brasileña y Brasília muestran que bajar el costo de moverse explica buena parte de la migración y de las ganancias.

### Convenciones

Se usan las etiquetas de `politicas-territoriales.md`:

| Etiqueta | Significado |
|---|---|
| **[E]** | Evidencia causal o cuasiexperimental con revisión de pares: regresión discontinua, diferencias en diferencias, control sintético, variables instrumentales o grupos de comparación creíbles |
| **[O]** | Datos oficiales o descriptivos: auditorías, censos, informes de gobierno. Muestra qué pasó, no por qué |
| **[A]** | Prensa, fuente secundaria o cifra del promotor. Sirve como orden de magnitud |
| **[D]** | Cuenta propia a partir de cifras citadas |

Cada DOI se verificó contra Crossref en octubre de 2026. Los resúmenes de los artículos se leyeron en Semantic Scholar, OpenAlex o el sitio del editor. Las cifras sin fuente primaria se marcan **[no verificado]**. Los montos se dan en la moneda original cuando no hay conversión publicada.

---

## 1. Tablas por región

Columnas: **Instrumento → app** indica el tipo de instrumento y a qué instrumento de la app se parece (ciudad_nueva, capital, intermedias, pueblos, polos). **Ev.** es la calidad de la evidencia.

### 1.1 Asia oriental

| Caso | Período y objetivo | Instrumento → app | Escala | Resultados medidos | Ev. | Lección para Argentina |
|---|---|---|---|---|---|---|
| **China: Gran Desarrollo del Oeste** | Desde 2000. Industrializar las provincias del oeste | Inversión pública e incentivos fiscales → polos, intermedias | Unos 2,2 billones de yuanes en 120 obras clave entre 2000 y 2009, según datos oficiales citados por la prensa [A] | Con un diseño de discontinuidad espacial: **+1,6 puntos por año de crecimiento del PBI**, pero **sin efecto sobre el empleo no agrícola ni los salarios**. El crecimiento vino de la inversión física, no de la productividad (Jia, Ma, Qin & Wang 2020) | [E] | Gastar mucho en obras hace subir el PBI, pero si no crea empleo, no retiene gente |
| **China: hukou y su reforma** | Registro de residencia desde 1958. Reforma desde 2014 (Plan Nacional de Nueva Urbanización) | Regla migratoria → intermedias | No es un gasto | La caída de los costos de migrar y de comerciar dentro de China explica el **36 % del crecimiento de la productividad del trabajo entre 2000 y 2005**. Los costos de migrar siguen altos (Tombe & Zhu 2019, modelo cuantitativo calibrado). Urbanización de residentes: 66,16 % en 2023 (Xinhua). El porcentaje con registro urbano es mucho menor: 46,7 % en 2021 según un documento de gobierno local; la cifra de 48,3 % para 2023 viene de un experto citado por la prensa **[no verificado en fuente oficial]** | [O] | Facilitar que la gente se mude adonde hay trabajo rinde más que retenerla con trabas |
| **China: Xiong'an** | Desde 2017. Desconcentrar de Pekín las funciones "no capitales" | Ciudad nueva y traslado dirigido de empresas estatales y universidades → ciudad_nueva, capital | Más de **1 billón de yuanes** de inversión acumulada a fines de 2025 (Xinhua) [O] | Población de 1,2 M (censo 2020, que ya incluía los tres condados originales) a unos 1,4 M en 2025, según la Comisión Nacional de Desarrollo y Reforma. Se instalaron 3 sedes de empresas estatales centrales, más de 400 filiales y más de 4.000 empresas de Pekín. Sin evaluación de impacto. Capacidad hídrica en `revision-bibliografica.md` §3 | [O] | Una ciudad nueva crece cuando el Estado le manda empleadores reales, no solo viviendas |
| **Corea: Desarrollo Nacional Equilibrado y Ciudades de la Innovación** | 2005–2019. Trasladar 153 instituciones públicas fuera de la región de Seúl | Traslado de agencias → intermedias, capital | Sin costo total verificado. En 2023 las instituciones trasladadas gastaron 3,14 billones de wones (unos USD 2.300 M) en compras y aportes locales (*Korea Times*) [A] | 112 instituciones fueron a 10 Ciudades de la Innovación. Llegaron **234.684 residentes nuevos sobre 267.869 previstos (88 %)** (*Bizhankook*, con datos oficiales) [A]. Solo el **40 % de los empleados se mudó con su familia** (Ministerio de Tierra, 2024, vía *Korea Times*). Entre 2000 y 2025 la población de esas regiones creció 4,8 % y la del país 12,3 % [D, con las cifras de *Bizhankook*]. La región de Seúl superó el 50 % de la población en 2020. **Causal:** con un diseño cuasiexperimental sobre 12 áreas, las ciudades receptoras atrajeron más jóvenes que el grupo de control, más en las afueras que en el centro (Kang, Lee & Kim 2024) | [E] para la migración juvenil; [O/A] para el resto | Mudar oficinas públicas atrae algo de gente joven, pero no frena a la capital si las familias no se mudan |
| **Corea: Sejong** | Desde 2005. Ciudad administrativa | Nueva ciudad y traslado de ministerios → capital, ciudad_nueva | Ver `politicas-territoriales.md` §1.1 | Unos 390.000–400.000 habitantes frente a la meta de 500.000 para 2030 [A] | [A] | Trasladar ministerios crea una ciudad mediana, no una nueva capital económica |
| **Japón: Chihō Sōsei 1.0 y 2.0** | 2014–2024 (1.0) y 2025–2034 (2.0). Equilibrar los flujos migratorios con Tokio | Transferencias, subsidios a la mudanza, donaciones con deducción fiscal → pueblos, intermedias | Unos **1,5 billones de yenes** en la versión 1.0, según el Japan Institute for Local Government citado por Yokota (ISVD, 2026) [A] | La meta de igualar entradas y salidas de Tokio **no se cumplió 11 años seguidos**. En 2024 la región de Tokio ganó **135.843 personas netas**. La 2.0 se lanzó sin evaluar la 1.0. Detalle del programa de cuerpos de revitalización (57,5 % de permanencia) en `politicas-territoriales.md` §4 | [O] | Diez años de subsidios a los pueblos no frenaron la migración hacia la capital |
| **Japón: traslado de la Agencia de Asuntos Culturales a Kioto** | Decidido en 2016 y concretado el 27/3/2023 | Traslado de agencia → intermedias | Sin dato | Es el primer organismo nacional que trasladó su sede fuera de Tokio. Las funciones parlamentarias y diplomáticas quedaron en Tokio (sitio de la agencia; *Japan Times*) | [A] | Trasladar una sola agencia es un gesto simbólico; no cambia el mapa del empleo |

### 1.2 Rusia, Asia central, sur y sudeste asiático

| Caso | Período y objetivo | Instrumento → app | Escala | Resultados medidos | Ev. | Lección para Argentina |
|---|---|---|---|---|---|---|
| **Rusia: Hectárea del Lejano Oriente** | Desde 2016 (extendida al Ártico en 2021). Frenar la pérdida de población del Lejano Oriente | Tierra gratis (hasta 1 ha por persona) → pueblos | Sin costo fiscal publicado | **151.103 personas recibieron 98.000 ha**, pero solo unas 35.000 registraron la parcela como propiedad o arriendo. Uso: vivienda 53 %, agricultura 28 %, emprendimientos 12 %, recreación 7 % (Corporación de Desarrollo del Lejano Oriente, agosto de 2025) [O]. La región perdió población desde 1991, y el programa atrajo sobre todo a residentes locales que construyeron segundas casas (RFE/RL 2020) [A]. Sin evaluación de impacto | [O] | Regalar tierra sin trabajo ni servicios no atrae pobladores nuevos: la aprovechan los que ya viven ahí |
| **Kazajistán: Astaná** | Desde 1997. Trasladar la capital al norte | Traslado de capital → capital, ciudad_nueva | Sin dato verificado | De unos 280.000 habitantes (1997) a más de 1,3 M. Almaty sigue siendo el centro económico (`politicas-territoriales.md` §1.1) | [A] | Una capital nueva crece, pero la ciudad más grande del país sigue siendo la principal |
| **Kazajistán: reasentamiento del sur al norte (Enbek, Serpin-2050) y repatriados (kandas)** | Desde 2017. Llevar población del sur, más poblado, al norte, que pierde gente | Subsidio a la mudanza y al alquiler, becas → intermedias, pueblos | Sin dato verificado | Entre 2017 y 2021 se mudaron algo más de **32.000 personas**, y la mitad no estaba en condiciones de trabajar. En febrero de 2024 el presidente del Senado reconoció que los programas no cumplieron su objetivo (Eurasianet; bne IntelliNews) | [A] | Pagar la mudanza no alcanza si el destino no ofrece trabajo y vivienda que la gente quiera |
| **Indonesia: Transmigrasi** | 1950–2015, con un pico entre 1979 y 1988. Llevar campesinos de Java y Bali a otras islas | Tierra gratis, vivienda y traslado organizado → pueblos, ciudad_nueva | Sin cifra total verificada. La meta del plan quinquenal 1984–1989 era de 750.000 familias (Titus 1992) | **2 millones de personas** trasladadas entre 1979 y 1988 a asentamientos nuevos. Como la asignación de origen fue casi aleatoria, se puede medir que los pueblos que recibieron colonos de zonas con clima y suelos parecidos tienen **más productividad de arroz y más luz nocturna** 10 a 20 años después (Bazzi, Gaduh, Rothenberg & Wong 2016). Un segundo estudio muestra efectos sobre la integración nacional (Bazzi et al. 2019) | [E] | Mover gente funciona mejor cuando lo que sabe hacer sirve en el lugar de destino |
| **India: Smart Cities Mission** | 2015–2025. Mejorar 100 ciudades | Inversión pública urbana → intermedias | 7.504 proyectos terminados por ₹1,50 billones (1,50,306 crore) al 4/3/2025, el 93 % del total (*Down To Earth*) [O] | Solo **18 de las 100 ciudades** terminaron todos sus proyectos. No hay una evaluación de impacto sobre población ni empleo; la Comisión Permanente del Parlamento pidió auditorías externas | [O] | Mejorar las ciudades intermedias ayuda a la calidad de vida, pero sin medir resultados no se sabe si atrae gente |
| **India: Zonas Económicas Especiales** | Desde 2006 (Ley SEZ de 2005). Exportaciones, empleo e infraestructura | Incentivo fiscal y aduanero → polos | Sin dato verificado | Con datos censales de 2001 y 2011, las zonas **no generaron desarrollo socioeconómico local**. El autor lo atribuye a que los políticos estatales usaron las corporaciones de desarrollo para capturar rentas de la tierra (Alkon 2018) | [E] | Una zona franca sin control sobre el uso de la tierra puede terminar en un negocio inmobiliario sin empleo |

### 1.3 América Latina

| Caso | Período y objetivo | Instrumento → app | Escala | Resultados medidos | Ev. | Lección para Argentina |
|---|---|---|---|---|---|---|
| **Brasil: SUDENE y Fondo Constitucional del Nordeste (FNE)** | SUDENE desde 1959 y FNE desde 1989. Industrializar el Nordeste | Reducción de hasta el 75 % del impuesto a las ganancias y crédito subsidiado → polos, intermedias | Sin total verificado. En 2025, 671 empresas tenían el beneficio, con R$ 19.600 M de inversión asociada (*Movimento Econômico*) [A] | Los créditos industriales del FNE **crearon empleo en las firmas, pero no se detectó efecto en el PBI per cápita municipal** (2000–2006; Resende 2014). Los incentivos fiscales aumentaron el empleo en la industria intensiva en mano de obra (control sintético generalizado; Costa et al. 2024). Con créditos grandes, el FNE se asocia a más ingreso y PBI municipal entre 2010 y 2020 (Monte et al. 2025) | [E] | El crédito barato crea empleos en las empresas que lo reciben, pero cuesta que eso cambie a toda la región |
| **Brasil: SUDAM** | 1966–2001; recreada en 2007. Desarrollo de la Amazonia | Fondo de inversión (FINAM) e incentivos fiscales → polos | Sin dato verificado | Se extinguió en mayo de 2001 con el argumento oficial de fraude y corrupción. Una tesis de la UFPA sostiene que la causa de fondo fue la incapacidad fiscal de seguir financiándola. **No se encontró evaluación causal** | [A] | Un fondo de incentivos sin control termina cerrado por fraude, y con él se pierde la política |
| **Brasil: Zona Franca de Manaus** | Desde 1967, prorrogada hasta 2073. Poblar la Amazonia y sustituir importaciones | Incentivo fiscal y aduanero → polos, ciudad_nueva | Unos **R$ 24.220 M** previstos para 2021, el quinto gasto tributario federal (TCU) [O] | Frente a un control sintético, la zona **aumentó el PBI per cápita real y la producción de servicios per cápita**, pero **redujo la producción agrícola per cápita** (Possebom 2017) | [E] | Un régimen fiscal muy generoso puede hacer crecer una ciudad aislada, pero es caro y depende de que el beneficio siga. Es el caso más parecido a Tierra del Fuego |
| **Brasil: Marcha para el Oeste y frontera agrícola** | Desde 1938 (Vargas) hasta 2010. Ocupar el Centro-Oeste | Rutas, colonias agrícolas y tierra → pueblos, polos | Sin dato verificado | La migración de agricultores al Oeste entre 1950 y 2010 explica el **25 % del cambio en la especialización exportadora de Brasil** (soja, carne, maíz). **Las rutas fueron el motor principal de esa migración** (Pellegrina & Sotelo 2025, modelo cuantitativo con datos de migrantes) | [E] | Las rutas que abaratan mudarse hacen más por poblar una frontera que cualquier decreto |
| **Brasil: Brasília** | 1956–1960 | Traslado de capital y red de rutas → capital, ciudad_nueva | Unos 12,3 % del PBI de 1959 en 4 años [A] | Ver `politicas-territoriales.md` §1.1 y §1.3: más de 2,5 M de habitantes; rutas radiales con 2,8 % de ganancia de bienestar (Morten & Oliveira 2024) | [E] | Lo que más deja una capital nueva son las rutas que la conectan con el resto del país |
| **Chile: Ley Arica (Ley 19.420) y franquicias de zonas extremas** | Bonificación a la contratación desde 1975 (DL 889); crédito a la inversión desde 1995. Prorrogados hasta 2035 | Crédito tributario del 30 % (40 % en Parinacota y turismo) y bonificación del 17 % de la remuneración → polos, intermedias | En Arica y Parinacota, en 2016: crédito tributario de **CLP 45.398 M** y bonificación de **CLP 12.293 M** (Senado, 2020) [O] | La bonificación cubre entre 27.000 y 32.000 trabajadores por año, con un número estable de empleadores; el informe del Senado lo describe como estancamiento. La zona franca industrial de Arica facturó **USD 30 M en 2016, menos del 1 % de la de Iquique**. **No hay evaluación de impacto** | [O] | Un beneficio fiscal que se renueva por décadas sin evaluar se vuelve un derecho adquirido y deja de mover la economía |
| **México: Zonas Económicas Especiales** | Ley de 2016; declaratorias derogadas el 19/11/2019 | Incentivo fiscal y aduanero con administrador privado → polos | Sin dato verificado | Se declararon 7 zonas en el sur (Puerto Chiapas, Coatzacoalcos, Lázaro Cárdenas–La Unión, Progreso, Salina Cruz, Campeche y Tabasco). Se derogaron porque **ninguna tuvo administrador integral** y los gobiernos locales no hicieron las obras. Las inversiones que se mencionaban (más de USD 4.000 M en Lázaro Cárdenas, según empresarios) eran compromisos anunciados (IDC Online; *El Financiero*) | [O] | Una zona especial que depende de un solo gobierno muere con el cambio de gobierno |

### 1.4 Europa

| Caso | Período y objetivo | Instrumento → app | Escala | Resultados medidos | Ev. | Lección para Argentina |
|---|---|---|---|---|---|---|
| **UE: Política de Cohesión (Objetivo 1)** | Desde 1989. Convergencia de las regiones con menos del 75 % del PBI per cápita medio | Inversión pública y transferencias → intermedias, polos | **€392.000 M en 2021–2027**, casi un tercio del presupuesto de la UE (Comisión Europea) [O] | Con una regresión discontinua en el umbral del 75 %: **más crecimiento del PBI per cápita, sin efecto sobre el empleo** (Becker, Egger & von Ehrlich 2010). Solo **alrededor del 30 %** de las regiones, las que tienen suficiente capital humano y buenas instituciones, convierte los fondos en más crecimiento (2013). El estudio de 1989–2013 analiza efectos por período y tipo de gasto (2018). En el Mezzogiorno, la productividad local apenas respondió a los fondos europeos de 2007–2015 (Albanese, de Blasio & Locatelli 2021) | [E] | La plata para regiones pobres rinde solo donde hay gente capacitada y gobiernos que funcionan |
| **Italia: Cassa per il Mezzogiorno** | 1950–1984/1992. Industrializar el Sur | Inversión pública e incentivos → polos | Las Áreas de Desarrollo Industrial recibieron unos **€90.000 M, cerca del 0,5 % del PBI por año** (nota CSEF) [O] | Las Áreas elegidas **mantuvieron más empleo y salarios décadas después** de terminado el programa, y el efecto pasó de la industria a los **servicios calificados** (Incoronato & Lattanzio 2024). En las zonas más periféricas el efecto fue transitorio (citado en la misma nota). La Cassa funcionó bien sus dos primeras décadas, con autonomía técnica, y después se volvió un instrumento de despilfarro (Felice & Lepore 2017). Su **descentralización en 1971 le costó al Sur un 11 % de PBI per cápita** en la década siguiente (control sintético; Buscemi 2025) | [E] | Concentrar la inversión en pocos polos con base industrial deja efectos duraderos; repartirla por todos lados, no |
| **Alemania: reunificación y Aufbau Ost** | 1990–2019 (Pactos de Solidaridad) | Transferencias fiscales, inversión e incentivos → intermedias, polos | Unos **€1,3 billones netos** de Oeste a Este entre 1990 y 2005, según un estudio del IWH citado por *Tagesspiegel* [A] | El PBI real del Este (sin Berlín) creció **98 % entre 1991 y 2024**, contra 43 % en el Oeste. El PBI por habitante del Este llegó al **79 % del Oeste en 2022** (informe anual del gobierno, vía prensa). Pero la **población del Este cayó 16 %, a 12,4 M**, y 1,2 M de personas más se fueron al Oeste que las que volvieron (1991–2024) (Statistisches Landesamt Rheinland-Pfalz 2025). Comparación con el Mezzogiorno: Boltho, Carlin & Scaramozzino (2018) | [O] | Se puede cerrar buena parte de la brecha de ingreso y aun así perder población durante 30 años |
| **Alemania: agencias federales (Bonn, Berlín y la regla de 1992)** | Bonn capital desde 1949; gobierno a Berlín en 1999; en 1992 se resolvió ubicar las instituciones federales nuevas en el Este | Traslado de agencias → capital, intermedias | Sin dato | Bonn: algo más de 1 empleo privado por cada empleo público, con desplazamiento de unos 0,2 industriales. Berlín: 1,3–1,4 empleos privados por cada público, concentrados a menos de 300 m (`politicas-territoriales.md` §1.3). La resolución de 1992 de la Comisión Federal es un **acuerdo político sin fuerza legal** (Bundestag, Servicios Científicos, 2019). **No se encontró un balance de empleos trasladados al Este** | [E] para los multiplicadores | Cada empleo público trasladado trae más o menos un empleo privado, pero en el mismo barrio |
| **Alemania: Zonenrandgebiet** | 1971–1994 | Incentivo fiscal e inversión → polos | Ver `politicas-territoriales.md` §3.2 | Efectos persistentes después del fin del subsidio, con relocalización desde zonas vecinas (von Ehrlich & Seidel 2018) | [E] | Un subsidio puede dejar efectos duraderos si ayuda a armar una base económica que después se sostiene sola |
| **Francia: DATAR y métropoles d'équilibre** | Desde 1963–1964. Contrapesar a París con 8 metrópolis regionales | Inversión en ciudades regionales y control de la radicación industrial en París → intermedias | Sin dato verificado | En 1973 casi todas las metrópolis, salvo Lille, crecían más rápido que París (Larousse), y la emigración neta desde las provincias se había revertido a comienzos de los setenta (Watkins). París seguía concentrando el 61 % de los investigadores. **No hay evaluación causal** | [A] | Apostar a pocas ciudades regionales grandes ayudó a equilibrar, pero los empleos más calificados se quedaron en la capital |
| **Francia: villes nouvelles de Île-de-France** | Desde 1965 (Delouvrier). Absorber el crecimiento de París | Nueva ciudad satélite con organismo público de desarrollo → ciudad_nueva | Sin dato verificado | De **178.000 habitantes (1968) a más de 740.000 (1999)**, el 7 % de la región. **300.000 empleos creados entre 1968 y 1999.** En 2005 el 43 % de los ocupados trabajaba en su propia ciudad nueva (37 % en 1999), pero solo el 29 % en Sénart, que no tenía empleo público departamental. No contuvieron la expansión urbana, que era el objetivo inicial (IAURIF 2005; Insee) | [O] | Una ciudad nueva cerca de una metrópoli llega a su tamaño si se lleva empleo con ella |
| **Francia: Zones Franches Urbaines** | Desde 1997. Empleo en barrios pobres | Exención fiscal → intermedias | Sin dato verificado | Las empresas se instalaron dentro de la zona en vez de al lado, **sin crear actividad neta en el municipio**. Hubo más empleo, sobre todo para trabajadores de bajos salarios (Mayer, Mayneris & Py 2017). En barrios bien conectados se crearon más firmas nuevas; en los aislados solo subieron los salarios (Briant, Lafourcade & Schmutz 2015) | [E] | Una exención fiscal en un lugar mal conectado mueve empresas unas cuadras, pero no crea empleo nuevo |
| **Reino Unido: Levelling Up** | 2019–2026. Reducir brechas regionales | Fondos concursables para obras locales → intermedias, pueblos | **£9.500 M** en tres fondos, de los cuales **£4.800 M** son del Levelling Up Fund (NAO, noviembre de 2023) [O] | A marzo de 2023 se había gastado solo el **14 %** de la primera ronda del Levelling Up Fund. La Comisión de Cuentas Públicas (2024) no encontró ejemplos de resultados y señaló que se priorizaron proyectos "listos para empezar" en lugar de los de mayor impacto | [O] | Repartir fondos por concurso con plazos cortos favorece los proyectos rápidos, no los que cambian una región |
| **Reino Unido: Freeports** | Desde 2021 | Incentivo fiscal y aduanero en sitios definidos → polos | Sin costo fiscal total en lo leído. Se prevén **£880 M** de impuestos locales retenidos en 25 años (gobierno) [O] | 12 puertos francos y 52 sitios. El gobierno informa **£6.400 M de inversión privada**, el 89 % extranjera (informe 2025). Se estiman unos 5.600 empleos en Inglaterra, pero según evidencia presentada al Parlamento **cerca de dos tercios no serían nuevos** (UKTPO 2024) [A]. La Oficina de Responsabilidad Fiscal calculó su costo asumiendo que la actividad se traslada desde otros lugares (Institute for Government) | [O] | Una zona franca suele mudar actividad de un lugar a otro más que crearla |
| **Reino Unido: LEGI y traslado de funcionarios (Lyons)** | LEGI 2006–2011; Lyons Review desde 2004 | Subsidio a empresas locales; traslado de agencias → intermedias | Sin dato | LEGI, con regresión discontinua: **ningún efecto neto en el empleo** y un desplazamiento desde zonas vecinas de cerca del **10 % del empleo local** (Einiö & Overman 2020). Traslado de unos 25.000 puestos públicos: efectos de corto plazo en servicios, sin efecto claro de largo plazo (Faggio 2019; `politicas-territoriales.md` §1.3) | [E] | Ayudar a los comercios de un barrio le quita clientes al barrio de al lado |
| **Noruega: zona de acción de Finnmark y Nord-Troms y aportes patronales regionales** | Desde 1990. Retener población en el extremo norte | Menos impuesto a la renta, condonación de hasta el 10 % anual del crédito estudiantil, exención del impuesto a la electricidad y aporte patronal cero → pueblos, intermedias | Medidas dirigidas a personas: unos **NOK 1.340 M** en 2020 [D, suma de las partidas oficiales que reproduce Menon 2022]. Población de la zona: 91.196 (2022) | **Causal:** cuando una norma de la UE obligó a eliminar los aportes patronales diferenciados, el empleo local cayó y parte del costo pasó a los salarios. El incentivo creaba empleo (Ku, Schönberg & Schreiner 2020). Las evaluaciones de la zona encuentran efectos, pero **no alcanzaron para revertir la emigración y el envejecimiento**. Una proyección de Menon sin inmigración lleva al este de Finnmark de unos 29.000 habitantes (2000) a 21.000 en 2050 (Menon 2022). Una evaluación econométrica de Vista Analyse (2023) no se pudo leer | [E] para los aportes patronales; [O] para la zona | Bajar impuestos a quien vive en una zona lejana ayuda a retener gente, pero solo no revierte la emigración |
| **Suecia: agencias estatales fuera de Estocolmo** | 2004–2020. Compensar el cierre de bases militares y equilibrar la presencia del Estado | Traslado o creación de agencias → intermedias | Sin dato; costos iniciales altos y caída transitoria de la productividad | **62 decisiones: algo más de 4.000 empleos nuevos y casi 6.000 preservados fuera de Estocolmo**, en 27 municipios. El efecto fue importante en pocos lugares (Arvidsjaur, Östersund, Gotland) y chico en el total. No hubo pérdida duradera de eficiencia (Riksrevisionen 2023) | [O] | Mudar agencias sirve para apoyar ciudades concretas, no para equilibrar el país |
| **Dinamarca: Bedre Balance** | 2015–2018. Llevar empleos estatales fuera de Copenhague | Traslado de agencias → intermedias | Unos **DKK 550 M** estimados para la segunda ronda [A] | En la segunda ronda, **uno de cada tres empleados afectados renunció** antes del traslado (DR, vía *The Copenhagen Post*). La auditoría danesa señala que, como en Noruega y Suecia, la producción de los organismos se resintió varios años | [A] | Si se traslada una oficina, buena parte del personal se queda y hay que contratar y formar gente nueva |

### 1.5 América del Norte y Oceanía

| Caso | Período y objetivo | Instrumento → app | Escala | Resultados medidos | Ev. | Lección para Argentina |
|---|---|---|---|---|---|---|
| **EE. UU.: Tennessee Valley Authority** | Desde 1933 | Inversión pública en energía y obras → polos | Ver `politicas-territoriales.md` §3.2 | El empleo agrícola subió y se revirtió al terminar los subsidios; el industrial siguió creciendo. Las inversiones directas rindieron más que su costo, pero las ganancias de aglomeración de la región **se compensaron con pérdidas en el resto del país** (Kline & Moretti 2014) | [E] | La infraestructura grande puede dejar industria duradera, aunque parte de lo que gana una región lo pierde otra |
| **EE. UU.: Empowerment Zones** | 1994–2004 (primera ronda) | Crédito fiscal al empleo de residentes y subsidios → intermedias | Ver `politicas-territoriales.md` §3.2 | Más empleo y salarios para los trabajadores locales, **sin aumento de población ni del costo de vida**, con costos de eficiencia modestos (Busso, Gregory & Kline 2013) | [E] | Un subsidio atado al empleo de los residentes mejora sus ingresos, aunque no atraiga población nueva |
| **EE. UU.: Opportunity Zones** | Desde 2018 | Rebaja de impuestos a las ganancias de capital invertidas en zonas pobres → intermedias | Unos **USD 3.500 M por año** entre 2019 y 2022 según el Comité Conjunto de Tributación, citado por CBPP [O] | En áreas metropolitanas, el empleo creció **entre 3 y 4,5 puntos más** que en zonas comparables, pero **los empleos los tomaron sobre todo personas de afuera** (Arefeva et al. 2025). **Ningún efecto en zonas rurales** (versión de trabajo del mismo estudio). Sin efectos sobre el empleo, los ingresos ni la pobreza de los residentes (Freedman, Khanna & Neumark 2023). Sin efecto mayor a 0,5 puntos en el precio de las casas (Chen, Glaeser & Wessel 2023) | [E] | Un beneficio a inversores puede crear empleos en un barrio sin mejorar la vida de quienes viven ahí, y en zonas rurales no hace nada |
| **EE. UU.: Homestead Act** | 1862–1976 (Alaska hasta 1986). Poblar el Oeste | Tierra gratis (160 acres) a cambio de vivir y trabajar 5 años → pueblos | **270 millones de acres, el 10 % de la superficie del país** (National Park Service) [O] | Unos **1,6 millones de colonos**, cerca del 40 % de los que lo intentaron, obtuvieron el título (NPS). Hoy las tierras entregadas por homestead tienen **menos actividad económica** que las vendidas por dinero en la misma época, por un efecto de dependencia de la trayectoria en el uso del suelo (Allen & Leonard 2021) | [E] | Regalar tierra pobló el territorio, pero dejó parcelas chicas que con el tiempo frenaron el desarrollo |
| **Canadá: Provincial Nominee Program y Atlantic Immigration Program** | PNP desde 1998; programa atlántico desde 2017 | Visa de inmigración nominada por la provincia → intermedias, pueblos | Sin dato verificado | El **82 %** de los nominados de 2000–2008 seguía en su provincia en 2008: **56 % en las provincias atlánticas** y más del 95 % en Alberta y Columbia Británica (IRCC) [O]. El programa atlántico retuvo mejor al año que los programas provinciales (Statistics Canada 2023, **no leído completo**) | [O] | Los inmigrantes se quedan donde hay trabajo; en las regiones más pobres casi la mitad se va |
| **Australia: visas regionales para trabajadores calificados** | Desde los años noventa (subclases 491, 494 y anteriores) | Visa condicionada a vivir en zonas "regionales" → intermedias, pueblos | Sin dato verificado | Con microdatos administrativos de 2010 a 2020: más del **80 %** de los titulares pidió la visa estando ya en Australia y cerca del **65 % ya vivía en una región**, así que el programa atrae a pocos nuevos. Retención fuera de las metrópolis: **70 % a los 10 años**, menor en zonas remotas (Laukova et al. 2025). Cinco años después, cerca del **45 %** de los que siguen en el país vive en Sídney, Melbourne o Brisbane, en parte porque la definición de "regional" incluye ciudades grandes (e61 Institute 2026) | [O] | Una visa que obliga a vivir en el interior unos años no garantiza que la gente se quede |
| **Nueva Zelanda: Provincial Growth Fund** | 2018–2021 | Fondo de inversión regional → intermedias, pueblos | **NZ$3.000 M en tres años** (Auditor General) [O] | El Auditor General pidió más transparencia y que se comparara lo planificado con lo logrado. El gobierno informó 1.023 empleos a mayo de 2019, cifras cuestionadas por economistas. La evaluación encargada por el ministerio (borrador de 2021) **no se pudo leer** | [O] | Un fondo grande que se reparte rápido sin reglas claras de evaluación termina discutido por sus cifras |

**Islandia.** No se encontraron programas de redistribución de población con evaluación publicada que justifiquen una ficha.

---

## 2. Síntesis transversal: qué funcionó y qué no

### 2.1 Funcionó, con evidencia causal o datos oficiales sólidos

| Resultado | Casos | Condición común |
|---|---|---|
| Base industrial que persiste después del subsidio | Áreas de Desarrollo Industrial del Mezzogiorno, TVA, Zonenrandgebiet | Pocos lugares elegidos, con base urbana e infraestructura, durante 20 años o más |
| Crecimiento del PBI regional | Desarrollo del Oeste, Fondos de Cohesión, Manaus, Aufbau Ost | Mucha inversión. **Ninguno de estos casos movió con claridad el empleo o la población** |
| Ciudades nuevas que llegaron a su escala | Villes nouvelles (más de 740.000 habitantes), Brasília, Xiong'an en crecimiento | Cerca de una metrópoli o con traslado de empleadores |
| Empleo e ingreso de los residentes | Empowerment Zones; aportes patronales regionales en Noruega | Subsidio atado al empleo local |
| Población y productividad en zonas de frontera | Marcha para el Oeste, Transmigrasi bien emparejada | Rutas que abaratan la mudanza; migrantes cuyas habilidades sirven en el destino |

### 2.2 No funcionó, o no se pudo demostrar

| Resultado | Casos | Por qué |
|---|---|---|
| Atraer pobladores nuevos con tierra o dinero | Hectárea rusa, reasentamiento kazajo, Homestead a largo plazo | Sin empleo en el destino, la usan los locales o los menos empleables |
| Retener inmigrantes en regiones pobres | Provincias atlánticas de Canadá (56 %), visas regionales de Australia | La gente sigue al trabajo y a sus redes; la definición de "región" es laxa |
| Crear empleo neto con exenciones en zonas chicas | ZFU, LEGI, Freeports, Opportunity Zones (rurales) | Desplazamiento desde la zona de al lado y empleos tomados por gente de afuera |
| Frenar a la capital | Chihō Sōsei (11 años sin cumplir la meta), Corea (la región de Seúl supera el 50 %), métropoles d'équilibre en empleos calificados | Los empleos más productivos se siguen concentrando |
| Sobrevivir al cambio de gobierno | ZEE mexicanas (3 años), SUDAM (cerrada en 2001) | Instrumento ligado a un gobierno o con fraude |
| Saber si funcionó | Ley Arica (más de 25 años), Smart Cities, Provincial Growth Fund, Levelling Up | No se diseñó la evaluación desde el inicio |

---

## 3. Patrones

### 3.1 El rol del empleo

El empleo es la variable que separa los casos que movieron población de los que no.

- **Población sin empleo no se sostiene.** Los programas que ofrecieron tierra, vivienda o una visa sin una base de empleo atrajeron poca gente nueva. La Hectárea del Lejano Oriente dio tierra a 151.103 personas, pero solo 35.000 formalizaron la parcela y no hay señales de que llegara población nueva. Del reasentamiento kazajo, la mitad de los que se mudaron no podía trabajar.
- **Empleo con población.** Las villes nouvelles crecieron a la vez que creaban 300.000 empleos, y la que tuvo menos empleo propio, Sénart, quedó como ciudad dormitorio.
- **Empleo sin población.** Lo contrario también pasa: las Empowerment Zones y el FNE brasileño crearon empleo sin mover población. El Desarrollo del Oeste subió el PBI sin subir el empleo no agrícola. **El objetivo "más población" necesita su propio indicador**, distinto del de "más PBI" o "más empleo", como ya plantea `politicas-territoriales.md` §6.
- **Quién toma el empleo.** En las Opportunity Zones los empleos nuevos los tomaron sobre todo personas que no vivían en la zona. Para una política de población, eso es una ventaja si los que vienen se mudan, y un fracaso si viajan a diario.

### 3.2 La escala

- **Montos grandes, efectos chicos por peso.** Los programas más caros (Aufbau Ost, con más de €1 billón; la Cohesión, con €392.000 M por período; el Desarrollo del Oeste, con billones de yuanes) muestran convergencia de ingreso parcial y **ningún efecto demostrado sobre la distribución de la población**. Alemania Oriental perdió el 16 % de su población aun con las mayores transferencias regionales del mundo desarrollado.
- **Concentrar rinde más.** En la Cassa, las pocas áreas industriales elegidas tuvieron efectos persistentes y las periféricas no. En la UE, solo el 30 % de las regiones convierte la plata en crecimiento. La lección es geográfica: **pocos polos con base urbana**, no reparto parejo.
- **Los programas chicos no mueven agregados.** La Agencia Cultural japonesa, Bedre Balance y la mayoría de las decisiones suecas son demasiado chicos para cambiar el mapa nacional. Sirven para una ciudad concreta.

### 3.3 La continuidad política

- **Instrumentos cortos, resultados nulos.** Las ZEE mexicanas no llegaron a operar en tres años. El Levelling Up gastó el 14 % de su primera ronda en el plazo previsto. Los traslados de capital tardan entre 15 y 46 años (`politicas-territoriales.md` §1.1).
- **Instrumentos largos, resultados difíciles de cortar.** Manaus (desde 1967, prorrogada hasta 2073), la bonificación de Arica (desde 1975, hasta 2035) y la zona de Finnmark (desde 1990) sobreviven a todos los gobiernos. Tienen resultados, pero se vuelven derechos adquiridos y **nadie los evalúa antes de prorrogarlos**. El paralelo argentino es la Ley 19.640.
- **El diseño institucional importa.** La Cassa rindió mientras tuvo autonomía técnica y empeoró al descentralizarse. SUDAM se cerró por fraude. Las new towns británicas y francesas tenían organismos públicos de desarrollo con control del suelo.

### 3.4 El traslado de agencias públicas

| Caso | Escala | Resultado |
|---|---|---|
| Bonn y Berlín | Gobierno federal completo | Cerca de 1 empleo privado por cada público, en un radio de pocos cientos de metros |
| Reino Unido (Lyons) | Unos 25.000 puestos | Efecto de corto plazo en servicios; sin efecto claro de largo plazo |
| Suecia | 62 decisiones, unos 10.000 empleos nuevos o preservados | Importante en pocas ciudades, chico en el total; sin pérdida duradera de eficiencia |
| Corea | 153 instituciones | 88 % de los residentes previstos; solo el 40 % de los empleados se mudó con su familia; más jóvenes en las ciudades receptoras |
| Dinamarca | Varios miles de empleos | Uno de cada tres empleados renunció en la segunda ronda |
| Japón | 1 agencia | Simbólico |

**Lectura.** El traslado de agencias es el instrumento con mejor evidencia sobre su multiplicador local, cercano a 1, y peor evidencia sobre su efecto regional. Funciona si: (a) se trasladan **muchas** agencias a **pocas** ciudades; (b) la ciudad receptora tiene vivienda, escuelas y empleo para el cónyuge, porque si no la familia no se muda; (c) se acepta un costo de transición de varios años en productividad y rotación de personal.

---

## 4. Recomendaciones por instrumento de la app

### ciudad_nueva

- **Casos de referencia:** villes nouvelles (éxito con empleo), Xiong'an (en curso con traslado de empleadores), Transmigrasi (asentamientos rurales), Sejong (por debajo de la meta).
- **Recomendación 1.** Condicionar la viabilidad a un **ancla de empleo explícita** (organismos públicos, empresas estatales, industria) y mostrar en el simulador el cociente entre empleos y población activa prevista. Referencia: 43 % de los ocupados trabaja en su propia ciudad nueva en Francia; Sénart, sin empleo público, solo 29 %.
- **Recomendación 2.** Preferir sitios a distancia de viaje diario de una metrópoli o de una ciudad base, coherente con la regla G-R1 y con `politicas-territoriales.md` §2.2.
- **Recomendación 3.** Para asentamientos rurales planificados, emparejar a los pobladores con zonas de clima y suelo parecidos a los de origen (Bazzi et al. 2016).

### capital

- **Casos:** Brasília, Astaná, Sejong, Xiong'an, Bonn y Berlín.
- **Recomendación 1.** Presentar los resultados como "ciudad de 0,5 a 2 M de habitantes en décadas", no como desconcentración del AMBA. Ningún caso nuevo de este relevamiento contradice esa conclusión de `politicas-territoriales.md` §1.
- **Recomendación 2.** Sumar al costo de la capital el de la **red de rutas** que la conecta, que es el componente con efectos medidos (Brasília, Marcha para el Oeste).
- **Recomendación 3.** Usar como multiplicador del empleo público trasladado un valor de **1 empleo privado por cada empleo público**, con efecto concentrado en la ciudad receptora, no en la región.

### intermedias

- **Casos:** métropoles d'équilibre, Ciudades de la Innovación, agencias suecas, Cohesión, Smart Cities, PNP canadiense, visas australianas.
- **Recomendación 1.** Priorizar **pocas ciudades intermedias grandes** con capital humano e instituciones (Francia eligió 8 metrópolis; la UE rinde en el 30 % de las regiones con mejores condiciones).
- **Recomendación 2.** Si el instrumento incluye traslado de organismos públicos, modelar la **tasa de mudanza familiar** como parámetro (40 % en Corea) y no asumir que cada empleo trasladado trae un hogar.
- **Recomendación 3.** Si se usa inmigración regional, la referencia de retención es **56 % en regiones pobres** (Canadá atlántico) y **70 % a 10 años** fuera de las metrópolis (Australia), con poco efecto de atracción de gente nueva.

### pueblos

- **Casos:** Hectárea rusa, Homestead Act, reasentamiento kazajo, Chihō Sōsei, Finnmark.
- **Recomendación 1.** **No modelar la tierra gratis como un instrumento de atracción de población.** Ningún caso moderno muestra que atraiga pobladores nuevos sin empleo.
- **Recomendación 2.** Los incentivos a personas (menos impuestos, condonación de créditos, guarderías gratis) **retienen más de lo que atraen**, según la evaluación noruega citada por Menon. Su indicador de éxito debería ser la permanencia de los residentes, no la llegada de nuevos.
- **Recomendación 3.** Fijar expectativas bajas: Japón gastó unos 1,5 billones de yenes en 10 años sin cambiar el balance con Tokio. Los pueblos dependen del empleo de una ciudad cercana (regla P-R2).

### polos

- **Casos:** Cassa y Áreas de Desarrollo Industrial, Manaus, SUDENE y FNE, Desarrollo del Oeste, SEZ de India, ZEE de México, Freeports, Ley Arica.
- **Recomendación 1.** Elegir **pocos polos con base urbana e industrial previa** (reglas E-R1 y E-R2). La periferia sin condiciones iniciales no retuvo los efectos en el Mezzogiorno.
- **Recomendación 2.** Exigir una **cláusula de evaluación y vencimiento**: ningún régimen de duración indefinida del relevamiento (Arica, Manaus) tiene evaluación oficial de impacto. El caso que sí la tiene (Manaus) muestra crecimiento con costos en otros sectores.
- **Recomendación 3.** Descontar el **desplazamiento**: entre un tercio y dos tercios de los empleos de las zonas francas y las exenciones locales vienen de otros lugares (Freeports, LEGI, ZFU). El simulador debería mostrar el empleo bruto y el neto.
- **Recomendación 4.** Proteger el instrumento del ciclo político y de la captura de la tierra (México, SUDAM, SEZ de India): administración profesional y reglas sobre el uso del suelo dentro de la zona.

---

## 5. Las ocho lecciones principales, en lenguaje llano

1. **Sin trabajo no hay población.** La gente se muda y se queda donde hay empleo. Tierra, casas o dinero para mudarse no alcanzan solos.
2. **Que la región crezca no garantiza que la gente se quede.** Alemania Oriental casi cerró la brecha de ingreso y aun así perdió una de cada seis personas.
3. **Las exenciones fiscales en zonas chicas suelen mover empresas de un lado a otro.** Hay que contar los empleos netos, no los anunciados.
4. **Concentrar en pocos lugares rinde más que repartir en muchos.** Los efectos duraderos aparecieron en polos con base previa.
5. **Mudar oficinas públicas trae más o menos un empleo privado por cada empleo público, pero en el mismo barrio.** Además, muchas familias no se mudan.
6. **Las rutas hacen más por poblar una frontera que los decretos.** Bajar el costo de moverse es lo que mejor funcionó en Brasil.
7. **Una política que dura poco no llega a dar resultados, y una que dura para siempre sin evaluación se vuelve un privilegio.** Hace falta continuidad con fecha de revisión.
8. **Si no se mide desde el principio, nunca se sabe si funcionó.** La mitad de los casos de este relevamiento no tiene una evaluación de impacto.

---

## 6. Referencias

### 6.1 Artículos con DOI verificado en Crossref (octubre de 2026)

- Albanese, G., de Blasio, G. & Locatelli, A. (2021). Does EU regional policy promote local TFP growth? Evidence from the Italian Mezzogiorno. *Papers in Regional Science*. doi:10.1111/pirs.12574
- Alkon, M. (2018). Do special economic zones induce developmental spillovers? Evidence from India's states. *World Development* 107:396–409. doi:10.1016/j.worlddev.2018.02.028
- Allen, D.W. & Leonard, B. (2021). Property Right Acquisition and Path Dependence: Nineteenth-Century Land Policy and Modern Economic Outcomes. *The Economic Journal* 131(640):3073–3102. doi:10.1093/ej/ueab030
- Arefeva, A., Davis, M.A., Ghent, A.C. & Park, M. (2025). The Effect of Capital Gains Taxes on Business Creation and Employment: The Case of Opportunity Zones. *Management Science* 71(6):4566–4581. doi:10.1287/mnsc.2022.03223. El resultado nulo en zonas rurales viene de la versión de trabajo (Brookings, 2020).
- Bazzi, S., Gaduh, A., Rothenberg, A.D. & Wong, M. (2016). Skill Transferability, Migration, and Development: Evidence from Population Resettlement in Indonesia. *AER* 106(9):2658–2698. doi:10.1257/aer.20141781
- Bazzi, S., Gaduh, A., Rothenberg, A.D. & Wong, M. (2019). Unity in Diversity? How Intergroup Contact Can Foster Nation Building. *AER*. doi:10.1257/aer.20180174. Solo se verificó el registro.
- Becker, S.O., Egger, P.H. & von Ehrlich, M. (2010). Going NUTS: The effect of EU Structural Funds on regional performance. *JPubE* 94(9–10):578–590. doi:10.1016/j.jpubeco.2010.06.006
- Becker, S.O., Egger, P.H. & von Ehrlich, M. (2013). Absorptive Capacity and the Growth and Investment Effects of Regional Transfers. *AEJ: Economic Policy* 5(4):29–77. doi:10.1257/pol.5.4.29
- Becker, S.O., Egger, P.H. & von Ehrlich, M. (2018). Effects of EU Regional Policy: 1989–2013. *Regional Science and Urban Economics*. doi:10.1016/j.regsciurbeco.2017.12.001
- Boltho, A., Carlin, W. & Scaramozzino, P. (2018). Why East Germany did not become a new Mezzogiorno. *Journal of Comparative Economics* 46(1):308–325. doi:10.1016/j.jce.2017.11.004. Solo se verificó el registro.
- Briant, A., Lafourcade, M. & Schmutz, B. (2015). Can Tax Breaks Beat Geography? Lessons from the French Enterprise Zone Experience. *AEJ: Economic Policy* 7(2):88–124. doi:10.1257/pol.20120137
- Buscemi, A. (2025). No revenge of the places that don't matter? Evidence from Italy's Cassa per il Mezzogiorno. *Cliometrica* 20:185–220. doi:10.1007/s11698-025-00310-0
- Busso, M., Gregory, J. & Kline, P. (2013). *AER* 103(2):897–947. doi:10.1257/aer.103.2.897
- Chen, J., Glaeser, E. & Wessel, D. (2023). JUE Insight: The (non-)effect of opportunity zones on housing prices. *JUE* 133:103451. doi:10.1016/j.jue.2022.103451
- Costa, E.M. et al. (2024, en línea). Effects of SUDENE's tax incentives on job creation in the Northeast region of Brazil. *Applied Economics Letters* 33(7):1011–1016. doi:10.1080/13504851.2024.2402927
- Einiö, E. & Overman, H.G. (2020). The effects of supporting local business: Evidence from the UK. *Regional Science and Urban Economics* 83:103500. doi:10.1016/j.regsciurbeco.2019.103500
- Ehrlich, M. von & Overman, H.G. (2020). Place-Based Policies and Spatial Disparities across European Cities. *Journal of Economic Perspectives* 34(3):128–149. doi:10.1257/jep.34.3.128
- Felice, E. & Lepore, A. (2017). State intervention and economic growth in Southern Italy: the rise and fall of the 'Cassa per il Mezzogiorno' (1950–1986). *Business History* 59(3):319–341. doi:10.1080/00076791.2016.1174214
- Freedman, M., Khanna, S. & Neumark, D. (2023). JUE Insight: The Impacts of Opportunity Zones on Zone Residents. *JUE* 133:103407. doi:10.1016/j.jue.2021.103407
- Incoronato, L. & Lattanzio, S. (2024). Place-Based Industrial Policies and Local Agglomeration in the Long Run. CSEF Working Paper 733 / SSRN. doi:10.2139/ssrn.4991746. Es un documento de trabajo, sin revisión de pares a la fecha.
- Jia, J., Ma, G., Qin, C. & Wang, L. (2020). Place-based policies, state-led industrialisation, and regional development: Evidence from China's Great Western Development Programme. *European Economic Review* 123:103398. doi:10.1016/j.euroecorev.2020.103398
- Kang, M., Lee, S. & Kim, J. (2024). Has South Korea's policy of relocating public institutions been successful? A case study of 12 agglomeration areas under the Innovation City Policy. *Urban Studies* 61(5):900–922. doi:10.1177/00420980231193567
- Kline, P. & Moretti, E. (2014). *QJE* 129(1):275–331. doi:10.1093/qje/qjt034
- Ku, H., Schönberg, U. & Schreiner, R.C. (2020). Do place-based tax incentives create jobs? *JPubE* 191:104105. doi:10.1016/j.jpubeco.2019.104105
- Laukova, D., Bernard, A., Zając, J., Kimpton, A., Argent, N. & Sigler, T. (2025). Are Visa-Based Dispersal Policies Effective in Attracting and Retaining Skilled Migrants in Rural Australia? *International Migration Review* 60(2):1117–1147. doi:10.1177/01979183251330275
- Mayer, T., Mayneris, F. & Py, L. (2017). The impact of Urban Enterprise Zones on establishment location decisions and labor market outcomes: evidence from France. *Journal of Economic Geography* 17(4):709–752. doi:10.1093/jeg/lbv035
- Monte, P.A. et al. (2025). Analysis of the Northeast Constitutional Financing Fund (FNE) on Municipal Economic Indicators in the Period 2010–2020. *Journal of Regional Science* 65(3):678–697. doi:10.1111/jors.12759
- Morten, M. & Oliveira, J. (2024). *AEJ: Applied* 16(2):389–421. doi:10.1257/app.20180487
- Pellegrina, H.S. & Sotelo, S. (2025). Migration, Specialization, and Trade: Evidence from Brazil's March to the West. *JPE* 133(12):3993–4049. doi:10.1086/738147
- Possebom, V. (2017). Free Trade Zone of Manaus: An Impact Evaluation using the Synthetic Control Method. *Revista Brasileira de Economia* 71(2):217–231. doi:10.5935/0034-7140.20170011
- Resende, G.M. (2014). Measuring Micro- and Macro-Impacts of Regional Development Policies: The Case of the Northeast Regional Fund (FNE) Industrial Loans in Brazil, 2000–2006. *Regional Studies* 48(4):646–664. doi:10.1080/00343404.2012.667872
- Tombe, T. & Zhu, X. (2019). Trade, Migration, and Productivity: A Quantitative Analysis of China. *AER* 109(5):1843–1872. doi:10.1257/aer.20150811
- von Ehrlich, M. & Seidel, T. (2018). *AEJ: Economic Policy* 10(4):344–374. doi:10.1257/pol.20160395

Becker, Heblich & Sturm (2021), Faggio (2019) y Faggio, Schlüter & vom Berge (2025) están en `politicas-territoriales.md` §7.1.

### 6.2 Informes oficiales y documentos con URL (leídos)

- Bundestag, Servicios Científicos (14/1/2019). WD 3-3000-004/19, sobre el carácter jurídico del acuerdo de la Comisión Federal de 1992. https://www.bundestag.de/resource/blob/629638/9f9f983d9bea78c180dfbb2d38275614/WD-3-004-19-pdf-data.pdf
- Comisión Europea. Available budget of Cohesion Policy 2021–2027. https://ec.europa.eu/regional_policy/funding/available-budget_en
- Corporación de Desarrollo del Lejano Oriente y el Ártico (27/8/2025). Over 150 thousand people received land under the "Hectare" program. https://erdc.ru/en/news/svyshe-150-tysyach-chelovek-poluchili-zemlyu-po-programme-gektar-na-dalnem-vostoke/
- Gobierno del Reino Unido (23/6/2025). UK Freeports Programme Report 2025. https://www.gov.uk/government/publications/uk-freeports-programme-report-2025 (cifras leídas a través de un resumen de búsqueda)
- IAURIF (octubre de 2005). *Note rapide* n.º 394: «Les villes nouvelles adoptées par leurs habitants». https://www.institutparisregion.fr/fileadmin/NewEtudes/Etude_371/nr_394_les_villes_nouvelles.pdf
- IRCC. Evaluation of the Provincial Nominee Program (resumen). https://www.canada.ca/en/immigration-refugees-citizenship/corporate/reports-statistics/evaluations/provincial-nominee-program/summary.html
- Menon Economics, Grünfeld, L.A. & Klyve, K.K. (2022). Personrettede tiltak for økt bosetting i Øst-Finnmark. https://ofr.no/wp-content/uploads/2022/05/Notat-om-personrettede-tiltak.pdf
- Nota CSEF sobre Incoronato & Lattanzio. https://csef.it/wp-content/uploads/7.nota-csef_Place-Based-Industrial-Policies-and-Local-Agglomeration-in-the-Long-Run.pdf
- Riksrevisionen (2023). RiR 2023:1, Establishment of government agencies outside of Stockholm. https://www.riksrevisionen.se/en/audits/audit-reports/2023/establishment-of-government-agencies-outside-of-stockholm---small-regional-contributions-without-jeopardised-efficiency-in-the-long-term.html
- Senado de Chile, Asesoría Técnica Parlamentaria (febrero de 2020). Análisis de incentivos tributarios, bonificaciones y beneficios especiales en zonas extremas del país. https://tramitacion.senado.cl/appsenado/index.php?mo=transparencia&ac=doctoInformeAsesoria&id=14129
- Statistisches Landesamt Rheinland-Pfalz, Emmerichs, S. (29/9/2025). *Datenblick* 23/2025: 35 Jahre Deutsche Einheit. https://www.statistischebibliothek.de/mir/servlets/MCRFileNodeServlet/RPHeft_derivate_00009147/Datenblick_23-2025_35%20Jahre%20Deutsche%20Einheit.pdf
- Titus, M.J. (1992). Transmigration and regional development in Indonesia: policy options between myth and reality. *Populasi* 1(3). https://journal.ugm.ac.id/populasi/article/download/10841/8093
- TCU. Levantamento sobre as políticas públicas de desenvolvimento: Zona Franca de Manaus. https://portal.tcu.gov.br/data/files/7B/65/50/0D/438F0810B4FE0FF7E18818A8/LEVANTAMENTO%20SOBRE%20AS%20POLITICAS%20PUBLICAS%20DE%20DESENVOLVIMENTO%20ZONA%20FRANCA%20DE%20MANAUS.pdf (cifra leída a través de un resumen de búsqueda)
- Xinhua (23/9/2024), urbanización de 66,16 % en 2023. https://www.news.cn/politics/20240923/6a5dade56e6b43749b08d7838f6c6fb5/c.html
- Xinhua (3/12/2025), inversión acumulada en Xiong'an. https://www.news.cn/enterprise/20251203/b3bb6648f8034cdd969b35c5b07a6e02/c.html
- Yokota, N. (13/5/2026). Regional Revitalization 2.0. Institute for Social Vision Design. https://isvd.or.jp/en/columns/regional-revitalization-2-kankeijinko

### 6.3 Fuentes secundarias y de prensa (nivel [A] u [O] indirecto)

- Agencia de Asuntos Culturales de Japón, cronología del traslado. https://www.bunka.go.jp/english/pr/Timeline_of_the_Agency/index.html; *Japan Times* (27/3/2023). https://japantimes.co.jp/news/2023/03/27/national/culture-agency-kyoto
- Auditor General de Nueva Zelanda (2020). https://oag.parliament.nz/media/2019/provincial-growth-fund; MBIE, evaluación del PGF (borrador, 12/3/2021), https://mbie.govt.nz/dmsdocument/14474-evaluation-of-the-provincial-growth-fund-12-march-2021; informe semanal (26/7/2019), https://mbie.govt.nz/dmsdocument/10406-0275-19-20-regional-economic-development-weekly-report-for-week-ending-26-july-2019
- *Bizhankook* (31/8/2026), balance de las Ciudades de la Innovación. https://en.bizhankook.com/articles/public-institution-relocation-report-card.html
- CBPP, sobre el costo de las Opportunity Zones. https://www.cbpp.org/blog/final-opportunity-zone-rules-could-raise-tax-breaks-cost
- *China Daily* (12/8/2017), población de los tres condados de Xiong'an. https://www.chinadaily.com.cn/china/2017-08/12/content_30507985.htm
- *Civil Service World* y Room151, sobre el NAO y el Levelling Up. https://www.civilserviceworld.com/professions/article/dhluc-wasted-opportunities-levelling-up-spending-impact-billions; https://www.room151.co.uk/funding/levelling-up-projects-behind-schedule-and-unlikely-to-be-completed-by-deadlines-says-nao/
- *The Copenhagen Post*, sobre Bedre Balance II. https://cphpost.dk/?p=105126; resumen de Rigsrevisionen, https://egov.nik.gov.pl/DK/2017/relocationGovJobs/alg_relocationGovJobs.html
- *Down To Earth* (2025), sobre la Smart Cities Mission. https://www.downtoearth.org.in/governance/after-a-decade-of-its-launch-only-18-out-of-100-cities-have-completed-smart-cities-mission-projects-but-there-are-some-positive-takeaways
- e61 Institute (7/5/2026). Moving to the country: Analysing regional migrant outcomes. https://e61.in/moving-to-the-country-analysing-regional-migrant-outcomes/
- *El Financiero*, sobre la ZEE de Lázaro Cárdenas. https://www.elfinanciero.com.mx/empresas/michoacan-perdera-25-mil-empleos-si-desaparecen-zee-advierten-empresarios; IDC Online (20/11/2019), sobre la derogación. https://idconline.mx/fiscal-contable/2019/11/20/amlo-dice-adios-a-las-zonas-economicas-especiales
- Eurasianet (20/2/2024). https://eurasianet.org/kazakhstan-population-resettlement-program-declared-a-failure; bne IntelliNews (29/2/2024). https://www.intellinews.com/kazakhstan-population-resettlement-programmes-declared-a-failure-314724
- Institute for Government, sobre Freeports. https://www.instituteforgovernment.org.uk/explainers/trade-freeports-free-zones
- *Korea Times* (18/6/2025). https://www.koreatimes.co.kr/amp/southkorea/society/20250618/koreas-innovation-city-dream-stumbles-on-poor-planning-and-policy-drift
- Larousse, *Journal de l'année* 1973. https://www.larousse.fr/archives/journaux_annee/1973/60/legislation; Watkins (SJSU). https://sjsu.edu/faculty/watkins/francereg.htm
- *Movimento Econômico* (21/1/2026), sobre los incentivos de SUDENE. https://movimentoeconomico.com.br/economia/2026/01/21/incentivos-fiscais-da-sudene-movem-r-196-bilhoes-para-671-projetos-em-2025/
- National Park Service, sobre la Homestead Act. https://www.nps.gov/home/learn/news/licolns-legacy.htm; https://www.nps.gov/articles/the-homestead-act.htm
- *Nordkurier*, sobre el informe anual de la Unidad Alemana. https://www.nordkurier.de/regional/brandenburg/wirtschaftskraft-im-osten-gleicht-sich-langsam-dem-westen-an-1929250
- RFA (2010), sobre la inversión del Desarrollo del Oeste. https://www.rfa.org/mandarin/yataibaodao/xi-07062010164610.html
- RFE/RL (20/9/2020), sobre la Hectárea del Lejano Oriente. https://www.rferl.org/a/on-russia-s-far-eastern-frontier-acres-of-free-land-but-little-interest/30848156.html
- Statistics Canada (2023), sobre la retención del Atlantic Immigration Program (**no leído completo**). https://www150.statcan.gc.ca/n1/pub/36-28-0001/2023011/article/00002-eng.htm
- *Tagesspiegel*, sobre el estudio del IWH. https://www.tagesspiegel.de/wirtschaft/ramsauer-will-aufbau-west-1790581.html
- Universidad Federal de Pará, tesis sobre la extinción de SUDAM. https://repositorio.ufpa.br/handle/2011/2327
- UK Trade Policy Observatory (3/7/2024), sobre los Freeports. https://blogs.sussex.ac.uk/uktpo/2024/07/03/whatever-happened-to-freeports-trade-and-local-development-in-the-general-election/

---

## 7. Vacíos

1. **Evaluaciones que no se pudieron leer:** Vista Analyse (2023) sobre la zona de Finnmark; MBIE (2021) sobre el Provincial Growth Fund; Statistics Canada (2023) sobre el programa atlántico; el balance alemán de agencias trasladadas al Este (Drucksache 13/9736).
2. **Costos no verificados:** Desarrollo del Oeste (total oficial de 20 años), Transmigrasi, Ciudades de la Innovación, SUDENE, ZEE de México y SEZ de India. En casi ningún caso hay un costo en porcentaje del PBI. Las excepciones son la Cassa (0,5 % por año) y Brasília (12,3 % del PBI de 1959).
3. **Sin evaluación causal:** Ley Arica, métropoles d'équilibre, Hectárea rusa, reasentamiento kazajo, Smart Cities, Levelling Up. Para Argentina, el paralelo más útil a evaluar sería un control sintético de Tierra del Fuego como el que Possebom hizo para Manaus (ver `politicas-territoriales.md` §8, punto 3).
4. **Islandia** quedó sin ficha por falta de casos evaluados.
