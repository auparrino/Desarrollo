# Incentivos municipales a la radicación de personas y empresas

Fecha de elaboración: 21 de octubre de 2026.

> **Relación con otros documentos.** `docs/incentivos-radicacion.md` cubre los regímenes **nacionales y provinciales** (`data/interim/incentivos/incentivos.csv`). Este documento cubre lo **municipal**: comunas, municipios, comisiones de fomento y partidos.
>
> **Datos:**
> - `data/interim/incentivos/municipales.csv`: 42 programas;
> - `data/interim/incentivos/municipales_cobertura.csv`: 39 municipios prioritarios del modelo.
>
> **Script:** `pipeline/incentivos_municipales.py`, con las filas en `pipeline/incentivos_municipales_datos.py`.

---

## 0. Resumen

- **Programas relevados.** Son **42 programas en 36 gobiernos locales de 9 provincias**: Buenos Aires 12, Santa Fe 8, Córdoba 6, Neuquén 5, Chubut 4, Río Negro 3, Entre Ríos 2, Corrientes 1 y Misiones 1.
  - **Por tipo:**
    - exención de tasas: 14;
    - lotes: 11;
    - parque industrial (lotes industriales cedidos o a precio de fomento): 11;
    - otros (paquetes de "Bienvenidos a mi Pueblo"): 5;
    - vivienda para profesionales: 1.
  - **Por beneficiario:** 25 son para empresas, 14 para personas y 3 para profesionales.
- **Verificación.** Solo 14 filas están verificadas contra la norma o el sitio oficial (`verificado=si`). Las otras 28 se apoyan en prensa (`parcial`).
- **Repoblamiento con lote gratis: casos escasos.** Este tipo de programa es mucho menos frecuente de lo que sugiere la prensa. El único caso argentino 2018-2026 con lote **gratuito** abierto a cualquier familia es **Nicolás Bruzzone** (Córdoba, 2022). Una parte de la cobertura que lo replica habla de pueblos de EE. UU. (Curtis, Elwood, Mankato) o de España.
- **Formas más comunes.** Lo que sí se repite es:
  - (a) lote comunal a **precio muy inferior al de mercado**, con obligación de construir (Toro Pujio, Balcarce, Villa del Rosario, San Francisco);
  - (b) programas de **arraigo de jóvenes locales**, con residencia previa exigida (Alicia, Neuquén, Varvarco);
  - (c) el modelo **comuna + fundación** de "Bienvenidos a mi Pueblo" en el sur y centro de Santa Fe.
- **Incentivos a empresas.** Son más comunes y mejor documentados:
  - regímenes de promoción industrial con exención de tasas (Balcarce, Exaltación de la Cruz, Bahía Blanca, Zárate, Pergamino, Goya, Tres de Febrero, Esteban Echeverría);
  - lotes de parques industriales a precio de fomento o cedidos gratis con cargo (Tres Arroyos, Balcarce, Valle María, Neuquén).
  - En Buenos Aires casi todos se apoyan en la adhesión a la Ley provincial 13.656.
- **Cobertura obligatoria (39 municipios).**
  - **14 tienen algún incentivo documentado:** Trelew, Rawson, Neuquén, Cipolletti, General Roca, Allen, Malagueño, Balcarce, Necochea, Tres Arroyos, Zárate, General Alvarado, Casilda y Posadas.
  - **1 no lo tiene,** según su Ordenanza Fiscal: San Nicolás.
  - **24 quedan `sin_info`:** no se halló nada en la web, lo que **no prueba** que no exista.

---

## 1. Metodología

### 1.1 Búsqueda

1. **Prensa nacional y regional, 2018-2026.** Se usó WebSearch, en modo estándar y extendido, con decenas de consultas. Estas son las variantes: "regala terrenos", "terrenos gratis", "lotes a un peso", "pueblo busca habitantes", "programa de repoblamiento", "banco de tierras", "vivienda para médicos", "lotes para jóvenes", "Bienvenidos a mi pueblo".
   - Las consultas se combinaron con provincias: Buenos Aires, La Pampa, Santa Fe, Córdoba, Entre Ríos, Patagonia y NEA.
   - También se filtró por dominios regionales: La Voz de San Justo, El Litoral, La Capital, Río Negro, LM Neuquén, Jornada, La Arena, Cadena 3, Noticias NQN y Primera Edición.
2. **Normas oficiales.** Se buscaron en estas fuentes:
   - SIBOM, el boletín oficial municipal bonaerense: Balcarce, Exaltación de la Cruz, Bahía Blanca;
   - digestos y boletines municipales: Tres Arroyos, Trelew, Pergamino, Goya, Valle María, Gualeguaychú, Casilda, Santo Tomé (Santa Fe), San Nicolás y Patagones;
   - el Registro Provincial de Parques Industriales de Río Negro.
3. **Municipios de la lista obligatoria.** Para cada uno se hicieron al menos dos consultas: "promoción industrial / exención de tasas / parque industrial" y "lotes / radicación / familias".
4. **Lectura completa.** Cada fila se basa en una página o PDF **abierto y leído** con WebFetch o curl y pdftotext. No se usó el resumen del buscador.
   - **El resumen del buscador falló varias veces.** Atribuyó a la Ordenanza 13977 de Trelew un contenido que en realidad era de la 13976, y mezcló municipios en otras consultas.
   - Por eso hay casos de la prensa que se descartaron porque no se pudo abrir la fuente: Claromecó (Tres Arroyos), Freyre, Catriel, Colonia San José y "Tierra Pampa".

### 1.2 Criterios de inclusión y codificación

- **Qué entra.** Un incentivo **municipal**: instrumento de la municipalidad, comuna o comisión de fomento, o un convenio en el que el gobierno local aporta tierra, vivienda o tributos.
- **Qué no entra.**
  - Los programas puramente provinciales o nacionales (Lotes con Servicios, Plan Familia Propietaria, Procrear, promoción industrial provincial). Se mencionan en la cobertura solo como contexto.
  - Las iniciativas privadas, como los lotes de la empresa Indoors para sus empleados en Matorrales (Córdoba).
- **Programas de lotes para residentes.** Se incluyeron cuando el precio está claramente bajo el de mercado o el programa se presenta como de arraigo. En el campo `requisitos` se indica si exige residencia previa, porque esto separa *retener* población de *atraer* población.
- **`verificado`:**
  - `si`: texto de la norma o publicación oficial del municipio;
  - `parcial`: solo prensa, o fuente oficial que no detalla condiciones;
  - `no`: no se usó.
- **`vigencia_estado`:**
  - `vigente`: norma sin plazo vencido o anuncio de 2024-2026;
  - `vencido`: convocatoria o sorteo cerrado;
  - `incierto`: el resto, que es la mayoría de los anuncios de prensa sin seguimiento.

### 1.3 Códigos y ubicación

- **Código de gobierno local.** Viene de INDEC, *Códigos de gobiernos locales, Censo 2022*. El archivo `c2022_codigos_gobiernos_locales.xlsx` se copió a `data/raw/indec/`.
  - El cruce se hizo con la API Georef, cuyo `municipio.id` coincide con el código INDEC (se comprobó en todos los casos).
  - Si Georef no tiene el municipio, como pasa con Santa Cruz, se usó el nombre exacto del listado INDEC.
- **Lat/lon.** Es el centroide de la **localidad cabecera** según Georef.
  - Se eligió así porque los ejidos patagónicos son enormes: el centroide del polígono de Cipolletti cae en el departamento El Cuy.
  - Si no hay cabecera identificable, se usa el centroide del polígono de `data/raw/poblaciones/limites/municipios_wkt.csv`.
  - Para Gascón se usó la localidad, no el partido de Adolfo Alsina.
- **`cod_dep`.** Se asignó por punto en polígono sobre `web/public/data/departamentos.geojson`. En Buenos Aires se tomó directamente partido = departamento (`06` + los 3 dígitos del partido).

---

## 2. Tablas

Las tablas resumen los CSV: requisitos y cupo están completos en `municipales.csv`.

### A. Personas y profesionales

| id | Municipio (prov.) | Programa | Norma | Intensidad | Vigencia | Verif. | Fuente |
|---|---|---|---|---|---|---|---|
| MUN001 | Nicolás Bruzzone (Córdoba) | Cesión de terrenos baldíos para repoblar el pueblo | Sin ordenanza identificada (anuncio del presidente comunal, 2022) | Lote baldío de 11 x 27 m (≈297 m²) sin precio de compra; tributo de $5.000 mensuales por 12 meses (valores 2022). | incierto | parcial | [2022-10-14](https://www.infobae.com/economia/2022/10/14/un-municipio-de-cordoba-regalara-terrenos-a-quienes-quieran-instalarse-en-el-pueblo-que-condiciones-pide/) |
| MUN002 | Toro Pujio (Córdoba) | Lotes comunales a bajo precio para repoblar la localidad | Sin ordenanza identificada | Lote a $100.000-150.000 (2021), contra ≈$2 millones un lote equivalente en Arroyito; meta de duplicar la población urbana (≈322 hab.) en 2-3 años. | incierto | parcial | [2021-03-07](https://www.lavozdesanjusto.com.ar/lotes-baratos-la-estrategia-de-toro-pujio-para-repoblarse--------102799) |
| MUN003 | Varvarco - Invernada Vieja (Neuquén) | Prioridad en lotes municipales para jóvenes profesionales que regresen | Resolución N° 32/2020 de la Comisión de Fomento (21-12-2020) | Prioridad en la adjudicación de terrenos municipales (lotes de 15 x 30 m pagados en cuotas mensuales). | incierto | parcial | [2022-04-17](https://www.rionegro.com.ar/sociedad/proponen-entregar-terrenos-a-jovenes-que-retornen-al-norte-neuquino-2250437/) |
| MUN004 | Colonia Belgrano (Santa Fe) | Bienvenidos a mi Pueblo (piloto) | Convenio comuna - Fundación Es Vicis (Suiza), con apoyo provincial; sin ordenanza identificada | Lote comunal para construir más financiamiento de la vivienda, capacitación y acompañamiento. | vencido | parcial | [2016-05-12](https://www.primeraedicion.com.ar/nota/220587/pueblo-santafesino-otorga-tierras-y-ofrece-facilidades-a-nuevos-habitantes/) |
| MUN005 | Labordeboy (Santa Fe) | Bienvenidos a mi Pueblo (convocatoria 2024) | Acuerdo comuna - Fundación Es Vicis | Según la prensa, la comuna podría cubrir alquiler por un tiempo o ceder espacios de trabajo sin cargo; red local de clientes. | incierto | parcial | [2024-07-26](https://www.lanacion.com.ar/sociedad/medico-farmaceutico-y-emprendedores-la-inusual-convocatoria-de-tres-pueblos-para-cubrir-necesidades-nid26072024/) |
| MUN006 | Maggiolo (Santa Fe) | Bienvenidos a mi Pueblo (convocatoria 2024) | Acuerdo comuna - Fundación Es Vicis | Alquiler cubierto por un tiempo o espacios de trabajo cedidos (según la prensa); acompañamiento de la fundación. | incierto | parcial | [2024-07-26](https://www.lanacion.com.ar/sociedad/medico-farmaceutico-y-emprendedores-la-inusual-convocatoria-de-tres-pueblos-para-cubrir-necesidades-nid26072024/) |
| MUN007 | Carmen (Santa Fe) | Bienvenidos a mi Pueblo (convocatoria 2024) | Acuerdo comuna - Fundación Es Vicis | Alquiler cubierto por un tiempo o espacios de trabajo cedidos (según la prensa). | incierto | parcial | [2024-07-26](https://www.lanacion.com.ar/sociedad/medico-farmaceutico-y-emprendedores-la-inusual-convocatoria-de-tres-pueblos-para-cubrir-necesidades-nid26072024/) |
| MUN008 | Cafferata (Santa Fe) | Bienvenidos a mi Pueblo (acuerdo 2021) | Acuerdo comuna - Fundación Es Vicis (2021) | Trabajo y vivienda para familias jóvenes (sin detalle de montos). | incierto | parcial | [2021-05-31](https://www.cadena3.com/noticia/juntos/buscan-repoblar-cinco-localidades-del-sur-de-santa-fe_293764) |
| MUN009 | San Eduardo (Santa Fe) | Bienvenidos a mi Pueblo (acuerdo 2021) | Acuerdo comuna - Fundación Es Vicis (2021) | Trabajo y vivienda para familias jóvenes (sin detalle de montos). | incierto | parcial | [2021-05-31](https://www.cadena3.com/noticia/juntos/buscan-repoblar-cinco-localidades-del-sur-de-santa-fe_293764) |
| MUN010 | Adolfo Alsina (Gascón) (Buenos Aires) | Convocatoria de repoblación de Gascón | Sin norma identificada; impulsada por un referente local junto a la ONG Proyecto Pulpería (carácter municipal no confirmado) | Terreno sin costo en un pueblo de ≈120 habitantes. | incierto | parcial | [2020-07-17](https://www.lanacion.com.ar/sociedad/queres-dejar-ciudad-seis-pueblos-bonaerenses-buscan-nid2398684/) |
| MUN011 | Alicia (Córdoba) | Programa Raíces (lotes) y Plan Habitar Alicia (viviendas) | Sin ordenanza citada; marco regulatorio en elaboración | Lotes de 240 m² con agua, luz y alumbrado pagaderos en hasta 24 cuotas; viviendas de 47 m² en 180 cuotas con cuota de preadjudicación similar a un alquiler. | vigente | parcial | [2026-03-10](https://www.lavozdesanjusto.com.ar/alicia-lanzo-el-programa-raices-lotes-y-viviendas-propias-para-jovenes-y-familias) |
| MUN012 | Villa del Rosario (Córdoba) | Plan Vivir Lotes | Sin ordenanza citada en la fuente | Lote a $4,5 millones (2024) en 12 cuotas sin interés o 84 cuotas ajustadas por costo de la construcción. | incierto | parcial | [2024-09-02](https://www.lmneuquen.com/pais/terrenos-menos-5-millones-pesos-y-84-cuotas-la-increible-oportunidad-un-pueblo-argentino-n1140078) |
| MUN013 | San Francisco (Córdoba) | Programa municipal de loteo (sector sur) | Sin ordenanza citada (anuncio del intendente) | Precio estimado en un tercio del valor de mercado; contado o cuotas. | incierto | parcial | [2024-03-03](https://www.lavozdesanjusto.com.ar/los-detalles-del-programa-municipal-de-loteo-anunciado-por-bernarte) |
| MUN014 | Balcarce (Buenos Aires) | Venta municipal de 102 lotes para vivienda única (Pueblo Nuevo) | Listado convalidado por el Concejo Deliberante (número de ordenanza no citado) | $6.000/m² (lotes de $1,17-1,43 millones), ≈50% debajo del mercado; 50% al contado y saldo en 12 cuotas. | vencido | parcial | [2022-11-30](https://www.lacapitalmdp.com/el-municipio-de-balcarce-pone-a-la-venta-102-lotes-para-vivienda-unica/) |
| MUN015 | Neuquén (Neuquén) | Plan Loteo Joven | Programa del Instituto Municipal de Urbanismo y Hábitat (IMUH) | Lote con servicios financiado a 10 años con período de gracia y sin anticipo. | incierto | parcial | [2021-10-18](https://www.rionegro.com.ar/gaido-anuncio-un-plan-de-loteos-destinado-a-los-jovenes-de-neuquen-2000228/) |
| MUN016 | Gualeguaychú (Entre Ríos) | Lotes del Banco Municipal de Tierras para trabajadores de la salud | Ordenanza N° 12859/2023 | Lotes con servicios del Banco de Tierras en la urbanización Las Ramas (zona noreste). | vigente | si | [2023-12-18](https://estacion.gualeguaychu.gov.ar/adjuntos/transparencia/ordenanzas/o12859023.pdf) |
| MUN017 | Rincón de los Sauces (Neuquén) | Viviendas para médicos del hospital local (convenio con YPF) | Convenio municipio - YPF (comodato), firmado con el gobierno provincial | 5 viviendas cedidas en comodato por 3 años al municipio para alojar médicos. | vigente | parcial | [2024-05-28](https://www.rionegro.com.ar/municipales/un-municipio-de-neuquen-logro-que-ypf-garantice-las-casas-para-poder-tener-medicos-3606566/) |

### B. Empresas

| id | Municipio (prov.) | Programa | Norma | Intensidad | Vigencia | Verif. | Fuente |
|---|---|---|---|---|---|---|---|
| MUN018 | Balcarce (Buenos Aires) | Régimen Municipal de Promoción Industrial | Ordenanza N° 32/2020 (adhiere a Ley 13.656) | 100% habilitación y derechos de oficina; 100% derechos de construcción por 2 años (luego 60/40/20%); 100% publicidad 2 años; 50% Seguridad e Higiene 2 años (+2). Plazos +50% si emplea más de 15 personas con 70% locales. | vigente | si | [2020-03-12](https://sibom.slyt.gba.gob.ar/bulletins/3374/contents/1458555) |
| MUN019 | Balcarce (Buenos Aires) | Venta de parcelas del SIP El Molino I a valor de promoción industrial | Ordenanza N° 113/21 (caso particular; marco Ord. 69/19) | $230/m² (2021) como "valor de promoción industrial" para dos parcelas. | vencido | si | [2021-06-11](https://sibom.slyt.gba.gob.ar/bulletins/5647/contents/1594068) |
| MUN020 | Exaltación de la Cruz (Buenos Aires) | Régimen de promoción industrial y de otras actividades | Ordenanza N° 2655/2020 | Industria: hasta 100% de derechos de construcción, habilitación, servicios generales y Seguridad e Higiene (base 50%) por hasta 5 años (+50%). Otras actividades: TSG y SeH 100% años 1-2, luego 80/60/40%. | vigente | si | [2020-05-12](https://sibom.slyt.gba.gob.ar/bulletins/3822/contents/1463296) |
| MUN021 | Bahía Blanca (Buenos Aires) | Régimen de promoción para radicación industrial y logística | Ordenanza N° 20518 (30-12-2021) | Exención de tasas por 8 años en el Parque Industrial o sectores planificados y por 5 años en otras zonas industriales; 100% construcción y habilitación para obras del plan. | vigente | si | [2021-12-30](https://sibom.slyt.gba.gob.ar/bulletins/6555/contents/1677387) |
| MUN022 | Zárate (Buenos Aires) | Régimen de promoción industrial (reglamentación automotriz/autopartes) | Ordenanza N° 3971 (adhesión Ley 13.656) y Decreto N° 275/2024 | Exención de tasas municipales de hasta 100% por un plazo de hasta 10 años, por resolución fundada. | vigente | si | [2024-04-09](https://zarate.gob.ar/wp-content/uploads/2024/04/dto-275-Regimen-Promocion-Industrial.pdf) |
| MUN023 | Pergamino (Buenos Aires) | Régimen de Promoción Industrial | Ordenanza N° 9692/23 | Seguridad e Higiene, derechos de construcción y publicidad: hasta 100% por 5 años y hasta 50% los 2 años siguientes (máx. 7 años). | vigente | si | [2023-03-22](https://aplicativos.pergamino.gob.ar/hcd_admin/upload/Ordenanza%209692-23.pdf) |
| MUN024 | Tres Arroyos (Buenos Aires) | Venta de parcelas y exención de tasas en el Parque Industrial | Ordenanza N° 6405/12 (precios actualizados por Ord. 6519/13 y 7061/17) | Exención de todas las tasas y derechos municipales por 10 años desde el boleto; tierra a 5 módulos/m² (U$S 4,97/m² en la ampliación, 2017), 60% al boleto y 5 cuotas sin interés. | incierto | si | [2012-12-18](http://hcd.tresarroyos.gov.ar/digesto/ordenanza/parque-industrial-de-tres-arroyos) |
| MUN025 | Necochea (Buenos Aires) | Cesión de lotes en el Sector Industrial Planificado | Convenios aprobados por comisión evaluadora y Concejo Deliberante | Cesión o concesión de lote municipal en el SIP (condiciones económicas no publicadas). | incierto | si | [2019-10-02](https://necochea.gov.ar/una-nueva-empresa-viene-a-dar-impulso-al-sector-industrial-planificado/) |
| MUN026 | Trelew (Chubut) | Régimen de promoción industrial para nuevas actividades | Ordenanza municipal aprobada en agosto de 2020 (número no citado en la fuente) | 100% habilitación y revalidaciones por 2 años; hasta 100% de Ingresos Brutos municipal y Seguridad e Higiene el 1er año y 50% el 2do; descuentos en automotor, inmobiliario y servicios; Fondo Especial de Inversión con créditos. | incierto | parcial | [2020-08-17](https://www.elchubut.com.ar/trelew/2020-8-17-15-8-0-se-abre-una-nueva-etapa-para-el-parque-industrial-de-trelew) |
| MUN027 | Trelew (Chubut) | Distrito Logístico Trelew | Ordenanza N° 13975/2025 | Transferencia de ≈60 ha municipales (450.436 + 149.440 m²) a un ente exento de tributos municipales para radicar empresas logísticas. | vigente | si | [2025-10-01](https://trelew.gob.ar/wp-content/uploads/2025/10/Boletin-948-1-10-25.pdf) |
| MUN028 | Trelew (Chubut) | Exenciones municipales para inversiones turísticas (Ley XXIII N° 65) | Ordenanza N° 13976/2025 (ratifica Res. 2792/25; adhesión Ord. 13826) | Exención de contribuciones de obras privadas, Seguridad e Higiene, publicidad e Ingresos Brutos municipal, en los mismos plazos y porcentajes que el beneficio provincial. | vigente | si | [2025-10-01](https://trelew.gob.ar/wp-content/uploads/2025/10/Boletin-948-1-10-25.pdf) |
| MUN029 | Rawson (Chubut) | Adjudicación de lotes en el Parque Industrial de Rawson | Contratos de adjudicación vía ADER y Consorcio del Parque Industrial (CoPIR) | Lotes municipales en el parque (precio y beneficios fiscales no publicados). | vigente | parcial | [2026-08-04](https://cholilaonline.ar/2026/08/construimos-un-camino-de-crecimiento-rawson-adjudico-lotes-a-diez-empresas-para-potenciar-el-parque-industrial.html) |
| MUN030 | Neuquén (Neuquén) | Parque Industrial Capital / Invierta Capital | Ordenanza de creación del parque (2022) y régimen anunciado en 2026; precio de tierra a aprobar por el Concejo | 10 años de exención de tasa de baldío, derechos de edificación, tasas retributivas y licencia comercial; tierra a precio promocional. | vigente | parcial | [2026-07-20](https://www.lmneuquen.com/neuquen/lanzan-el-parque-industrial-capital-y-los-inversores-neuquinos-tendran-10-anos-libres-impuestos-n1246632) |
| MUN031 | Neuquén (Neuquén) | Habilita Gratis / licencia comercial sin costo | Medidas tributarias municipales 2025-2026 (número de ordenanza no citado) | Licencia comercial sin costo los primeros 12 meses (2026); en 2025 los nuevos locales no pagaban inspección, habilitación bromatológica, carnet ni licencia por 6 meses. | vigente | parcial | [2026-08-03](https://www.noticiasnqn.com.ar/noticias/2026/08/03/346228-neuquen-elimina-52-tasas-y-reduce-impuestos-para-vecinos-y-comercios) |
| MUN032 | Cipolletti (Río Negro) | Exención de Seguridad e Higiene a comercios nuevos | Modificación del art. 127 del Código Tributario Municipal (2025) | Exención de tasas de seguridad e higiene por 12 meses. | vigente | parcial | [2025-05-15](https://www.noticiasnqn.com.ar/noticias/2025/05/15/313553-cipolletti-eximira-por-un-ano-las-tasas-municipales-a-nuevos-comercios) |
| MUN033 | General Roca (Río Negro) | Parque Industrial I (municipal) | Ordenanza N° 5081/2025 (creación y reglamento interno); Parque II por Ord. 4683/12 | Lotes en parque industrial municipal; beneficios municipales específicos no publicados. | vigente | parcial | [2026](https://rionegro.gov.ar/programa/557/registro-provincial-de-parques-industriales-y-logisticos) |
| MUN034 | Allen (Río Negro) | Parque Industrial Norte (municipal) | Ordenanza Municipal N° 033/2022 | 95 lotes, 50 disponibles; beneficios fiscales listados son provinciales. | vigente | parcial | [2026](https://rionegro.gov.ar/programa/557/registro-provincial-de-parques-industriales-y-logisticos) |
| MUN035 | Malagueño (Córdoba) | Polígono Industrial Municipal de Malagueño | Polo municipal creado en 2004, aprobado por la Provincia en 2021 (parque N° 40) | 10 ha; lotes a ≈US$50-70/m² (2023). Sin exenciones municipales documentadas. | vigente | parcial | [2023-04-25](https://www.somospymes.com.ar/item/63503-malagueno-como-paso-de-ser-un-pueblo-a-la-ciudad-con-mas-parques-industriales-de-cordoba.html) |
| MUN036 | Casilda (Santa Fe) | Venta de lotes del Área Industrial municipal | Ordenanza N° 3521/2025 (ratifica venta del lote 2) | Lotes municipales en el Área Industrial (precio no publicado). | vigente | parcial | [2025](https://www.casilda.gob.ar/web/licitaciones-casilda/) |
| MUN037 | Santo Tomé (Santa Fe) | Exención promocional para emprendedores | Ordenanza Tributaria N° 2823/10, art. 24 inc. o (y Ord. 3025/14) | Exención del Derecho de Registro e Inspección por 6 meses; alícuota industrial reducida 0,50% (general 0,70%). | vigente | si | [2014](https://www.santotome.gob.ar/empresas_emprendedores_y_empleo/Administracion_e_Impuestos/ordenanza_tributaria) |
| MUN038 | Goya (Corrientes) | Régimen Especial Municipal de Promoción de Actividades Productivas | Ordenanza N° 2013/18 (modifica Ord. 2010; antecedentes Ord. 1263/05 y 1413/08) | Exención de hasta 10 años de tasas (servicios, habilitación, seguridad e higiene, sanidad, actuaciones) e impuestos inmobiliario y automotor municipales; créditos de la Caja Municipal de Préstamos. | vigente | si | [2018-09-19](https://www.goya.gob.ar/sites/default/files/ordenanza_2013_regimen_de_promocion_industrial.docx) |
| MUN039 | Posadas (Misiones) | Exención de contribuciones de construcción en el Parque Industrial | Ordenanza sancionada por el Concejo Deliberante en agosto de 2015 (número no citado) | Exención de las contribuciones municipales por construcción inmobiliaria. | incierto | parcial | [2015-08-13](https://www.primeraedicion.com.ar/?p=2148) |
| MUN040 | Valle María (Entre Ríos) | Cesión gratuita con cargo de parcelas del Parque Industrial | Ordenanza N° 300/2020 (marco: Ord. 84/2014 régimen municipal de promoción industrial y Ord. 93/2014 reglamento) | Parcela del parque industrial cedida gratis con cargo de instalación. | incierto | si | [2020-12-22](https://vallemaria.gob.ar/sites/default/files/300-2020_dona_parcelas_del_parque_industrial.pdf) |
| MUN041 | Esteban Echeverría (Buenos Aires) | Exención de tasas a empresas que se instalen o amplíen | Ordenanza aprobada por unanimidad en 2021 (número no citado) | Exención por 2 años de 7 tasas locales: habilitación, Seguridad e Higiene, construcción, publicidad, avance de obra, red vial y permisos. | incierto | parcial | [2021-05-09](https://www.baenegocios.com/amp/Empresas-que-se-instalen-en-Esteban-Echeverria-no-pagaran-impuestos-locales-por-dos-anos-20210509-0012/) |
| MUN042 | Tres de Febrero (Buenos Aires) | Régimen municipal de incentivo a inversiones ("RIGI municipal") | Ordenanza aprobada por el Concejo Deliberante en junio de 2025 (número no citado) | Inversión US$10-20 M: 1 año sin TISH y 50% por 9 años (empresas ya radicadas: 50% por 10 años); más de US$20 M o más de 100 empleos: 1 año exento y 50% por 14 años; estabilidad de la TISH por 30 años. | vigente | parcial | [2025-06-13](https://eleconomista.com.ar/politica/con-guino-milei-municipio-conurbano-lanza-su-rigi-desafia-gremios-n85712) |

### C. Cobertura de los municipios prioritarios

| Municipio | cod_dep | ¿Incentivo? | Resumen | Fuente |
|---|---|---|---|---|
| Viedma | 62007 | sin_info | No se halló incentivo municipal vigente. Proyecto de adhesión al RIMI con exención de habilitación, construcción y SeH hasta 5 años, con dictamen de comisión (sep-2026), sin sanción. El Parque Industrial (ENREPAVI) tiene beneficios provinciales (Ley 5766, IIBB y Sellos 10 años). | [enlace](https://www.rionegro.com.ar/politica/viedma-busca-atraer-inversiones-y-generar-empleo-a-traves-del-parque-industrial-4733002/) |
| Carmen de Patagones | 06602 | sin_info | Las ventajas documentadas son provinciales (Ley 12.322: inmobiliario, IIBB y sellos, prorrogada en 2024). Sector Industrial Planificado sin lotes disponibles en 2024. En la Ordenanza Fiscal 2024 no se encontró una exención industrial específica. | [enlace](https://www.noticiasnet.com.ar/noticias/2024/09/22/163770-la-menor-presion-tributaria-pone-en-ventaja-al-parque-industrial-de-patagones) |
| Trelew | 26077 | si | Régimen de promoción industrial de 2020 (habilitación 100% 2 años; SeH e IIBB municipal 100%/50%); Ord. 13975/2025 Distrito Logístico; Ord. 13976/2025 exenciones para inversiones turísticas; donación de tierra a empresa pesquera (Ord. 13952/2025). | [enlace](https://trelew.gob.ar/wp-content/uploads/2025/10/Boletin-948-1-10-25.pdf) |
| Rawson | 26077 | si | Adjudicación de lotes en el Parque Industrial municipal (10 empresas, ago-2026) vía ADER y CoPIR; no se publicaron precio ni exenciones. | [enlace](https://cholilaonline.ar/2026/08/construimos-un-camino-de-crecimiento-rawson-adjudico-lotes-a-diez-empresas-para-potenciar-el-parque-industrial.html) |
| Gaiman | 26042 | sin_info | No se encontraron ordenanzas, programas de lotes ni exenciones municipales en fuentes web. | — |
| Puerto Madryn | 26007 | sin_info | Solo se halló el ordenamiento del Parque Industrial Liviano junto con la Provincia (2025) y una tasa a los parques eólicos (Ord. 11.349/2020). No se halló un régimen municipal de exenciones. | [enlace](https://www.diariojornada.com.ar/393380/politica/avanza_el_ordenamiento_del_parque_industrial_liviano) |
| Neuquén | 58035 | si | Parque Industrial Capital con 10 años de exención de tasas municipales y tierra a precio promocional (2026); licencia comercial gratis 12 meses para comercios nuevos; Plan Loteo Joven (2021). | [enlace](https://www.lmneuquen.com/neuquen/lanzan-el-parque-industrial-capital-y-los-inversores-neuquinos-tendran-10-anos-libres-impuestos-n1246632) |
| Plottier | 58035 | sin_info | No se halló régimen municipal de promoción. Solo hay una ordenanza de 2025 que frena loteos en tierras productivas, sin incentivo a la radicación. | [enlace](https://www.noticiasnqn.com.ar/noticias/2025/08/25/319201-freno-a-los-loteos-bertolini-logro-la-ordenanza-que-protege-las-tierras-productivas) |
| Senillosa | 58035 | sin_info | Hay un parque industrial con lotes privados en venta, pero no se hallaron normas ni beneficios municipales. | — |
| Centenario | 58035 | sin_info | Parque industrial con lotes reservados por empresas (prensa sin fecha precisa); no se hallaron exenciones ni ordenanza de promoción. | [enlace](https://www.lmneuquen.com/98-empresas-aun-esperan-la-luz-centenario-n224663) |
| Cipolletti | 62042 | si | Exención de Seguridad e Higiene por 12 meses a comercios nuevos (mod. art. 127 Código Tributario, may-2025); eliminación de la renta diferencial en Servicio de Ruta (dic-2024); nuevos parques industriales aprobados (dic-2025). | [enlace](https://www.noticiasnqn.com.ar/noticias/2025/05/15/313553-cipolletti-eximira-por-un-ano-las-tasas-municipales-a-nuevos-comercios) |
| General Roca | 62042 | si | Parques industriales municipales I (Ord. 5081/2025) y II (Ord. 4683/12). Los beneficios fiscales listados son provinciales; no se halló exención municipal específica. | [enlace](https://rionegro.gov.ar/programa/557/registro-provincial-de-parques-industriales-y-logisticos) |
| Allen | 62042 | si | Parque Industrial Norte municipal (Ord. 033/2022) con 50 de 95 lotes disponibles. Los incentivos listados son provinciales. | [enlace](https://rionegro.gov.ar/programa/557/registro-provincial-de-parques-industriales-y-logisticos) |
| Río Primero | 14105 | sin_info | Solo se hallaron loteos privados y la promoción provincial (Ley 10.792); no hay programa municipal documentado. | — |
| Despeñaderos | 14147 | sin_info | No se hallaron programas municipales de lotes ni de radicación de empresas en fuentes web. | — |
| Malagueño | 14147 | si | Polígono Industrial Municipal (10 ha, aprobado por la Provincia en 2021) con lotes a ≈US$50-70/m². Sin exenciones municipales documentadas. | [enlace](https://www.somospymes.com.ar/item/63503-malagueno-como-paso-de-ser-un-pueblo-a-la-ciudad-con-mas-parques-industriales-de-cordoba.html) |
| Navarro | 06574 | sin_info | Solo se halló el plan provincial Familia Propietaria (67 familias, ene-2025) y un convenio con INTI; no hay incentivo municipal documentado. | [enlace](https://gba.gob.ar/desarrollo_de_la_comunidad/noticias/acceso_al_lote_propio_para_m%C3%A1s_familias_de_navarro) |
| Balcarce | 06063 | si | Ord. 32/2020 de promoción industrial (habilitación y construcción 100%, SeH 50%); lotes del SIP a valor de promoción (Ord. 113/21); venta de 102 lotes para vivienda única al 50% del mercado (2022). | [enlace](https://sibom.slyt.gba.gob.ar/bulletins/3374/contents/1458555) |
| Necochea | 06581 | si | Cesión o concesión de lotes municipales en el Sector Industrial Planificado mediante convenio aprobado por el Concejo (2019). No se halló régimen de exenciones. | [enlace](https://necochea.gov.ar/una-nueva-empresa-viene-a-dar-impulso-al-sector-industrial-planificado/) |
| Tres Arroyos | 06833 | si | Ord. 6405/12: exención de todas las tasas por 10 años a industrias del Parque Industrial y tierra a precio de fomento (U$S 4,97/m² en 2017). Programa Un lote para mi familia en Claromecó, para residentes. | [enlace](http://hcd.tresarroyos.gov.ar/digesto/ordenanza/parque-industrial-de-tres-arroyos) |
| San Nicolás | 06763 | no | La Ordenanza Fiscal y Tarifaria 2025 no tiene régimen general de promoción ni exenciones por radicación. Solo fija un tope a la TSH para generadoras eléctricas en delegaciones (art. 192). | [enlace](https://sannicolasciudad.gob.ar/system/procedure_attachments/files/000/000/585/original/Fiscal_y_Tarifaria_2025.pdf) |
| Zárate | 06882 | si | Ord. 3971 (adhesión a Ley 13.656): exención de tasas de hasta 100% por hasta 10 años; Dto. 275/2024 orientado a la industria automotriz y autopartista. | [enlace](https://zarate.gob.ar/wp-content/uploads/2024/04/dto-275-Regimen-Promocion-Industrial.pdf) |
| Mar Chiquita (Santa Clara del Mar) | 06518 | sin_info | No se halló régimen de promoción ni programa de lotes. Hay radicaciones puntuales en Vivoratá y la venta por licitación de un lote municipal en Santa Clara (Ord. 100/2025), que no es un incentivo. | — |
| General Alvarado | 06280 | si | Sector Industrial Planificado de iniciativa municipal en Miramar (18 ha, más de 20 empresas, aprobado en 2018). No se hallaron exenciones municipales. Sorteo de lotes sociales en Otamendi (2019), para residentes. | [enlace](https://www.gba.gob.ar/produccion/noticias/miramar_se_firm%C3%B3_la_aprobaci%C3%B3n_del_sector_industrial_planificado_de_general) |
| Carcarañá | 82119 | sin_info | Área Industrial con aporte nacional (2016) y loteos industriales privados; no se halló incentivo municipal. | — |
| Casilda | 82014 | si | Venta de lotes del Área Industrial municipal por ordenanza (Ord. 3521/2025); no se publican precio ni exenciones. | [enlace](https://www.casilda.gob.ar/web/licitaciones-casilda/) |
| San Jerónimo Norte | 82070 | sin_info | No se hallaron programas comunales de lotes ni de radicación de empresas. | — |
| San Carlos Centro | 82070 | sin_info | Hay un Área Industrial Oficial de Desarrollo con gasoducto en obra por convenio municipio-empresa (2024-2026); no se hallaron precios de lotes ni exenciones. | [enlace](https://www.ellitoral.com/regionales/gasoducto-area-industrial-san-carlos-centro-infraestructura-inversion-empleo-local_0_EH3UOLXdAz.amp.html) |
| Margarita Belén | 22126 | sin_info | No se hallaron programas municipales en fuentes web. | — |
| Resistencia | 22140 | sin_info | No se halló régimen municipal de promoción ni exención de tasas por radicación. | — |
| Corrientes | 18021 | sin_info | Solo se halló la ordenanza de habilitaciones N° 6303/2015 (sin exenciones) y la ley provincial 5470, que admite adhesión municipal; no se confirmó adhesión. | [enlace](https://ciudaddecorrientes.gov.ar/sites/default/files/2371.pdf) |
| Santo Tomé (Corrientes) | 18168 | sin_info | No se halló la ordenanza de adhesión a la Ley 6051 de parques industriales ni otros incentivos municipales. | — |
| Ituzaingó | 18084 | sin_info | El Parque Industrial y su ampliación (expropiación de 700 ha) son provinciales; no se hallaron incentivos municipales. | [enlace](https://www.perfil.com/noticias/nea/corrientes-amplia-el-parque-industrial-de-ituzaingo-es-ley-la-expropiacion-de-700-hectareas.phtml) |
| Candelaria | 54021 | sin_info | No se hallaron programas municipales en fuentes web. | — |
| Posadas | 54028 | si | Ordenanza de 2015 que exime de contribuciones de construcción a empresas del Parque Industrial (vigencia no confirmada); la municipalidad integra el PIIP (Ord. 2920/2011). | [enlace](https://www.primeraedicion.com.ar/?p=2148) |
| Salta | 66028 | sin_info | Solo se hallaron exenciones transitorias por la pandemia (Ord. 15.691/2020); no hay régimen municipal de radicación. Los incentivos vigentes son provinciales (Ley 8.086). | [enlace](https://www.consejosalta.org.ar/wp-content/uploads/Resolucion-13-2020-reglamentacion-Ordenanza-15691-Exenciones.docx) |
| La Caldera | 66077 | sin_info | Solo se hallaron loteos privados; no hay programas municipales documentados. | — |
| Río Gallegos | 78021 | sin_info | No se halló régimen municipal de promoción. Hay una Zona Franca de régimen nacional y provincial. | — |
| Comodoro Rivadavia | 26021 | sin_info | La Provincia pidió al municipio adherir a la eliminación de tasas municipales en la Zona Franca; no se halló ordenanza de adhesión ni régimen municipal propio. | [enlace](https://www.bloomberglinea.com/latinoamerica/argentina/chubut-elimina-impuestos-y-aranceles-para-empresas-que-se-radiquen-en-zonas-francas/) |

---

## 3. Patrones observados

### 3.1 Quién ofrece lotes gratis o casi gratis

- **Perfil.** Son comunas **muy chicas, de 200 a 2.000 habitantes**, de la pampa agrícola del sur de Córdoba y el sur y centro de Santa Fe:
  - Nicolás Bruzzone, con unos 200 habitantes urbanos;
  - Toro Pujio, con unos 322 urbanos y unos 700 en total;
  - Labordeboy, Carmen, Maggiolo, Cafferata y San Eduardo.

  Tres rasgos se repiten:
  - **tierra comunal ociosa** que ya poseen: baldíos sin dueño, una vieja cancha, tierra donada;
  - un **jefe comunal con iniciativa personal**, porque casi nunca hay ordenanza;
  - **una ciudad cercana con lotes caros**, de donde llegan los compradores. En Toro Pujio la mayoría vino de Arroyito, donde un lote vale unas 15 veces más.
- **El "gratis" casi nunca es literal.**
  - En Bruzzone se entrega la *posesión*, se paga un tributo mensual durante 12 meses y la titularidad llega por usucapión.
  - En Toro Pujio y Balcarce hay un precio bajo y plazo de obra: 6 meses para empezar en Toro Pujio y 5 años para construir en Balcarce.
- **En la Patagonia no apareció ningún caso municipal de lote gratis para recién llegados.** Las notas que mencionan Gastre, Paso de Indios, Gobernador Gregores o Los Chihuidos vienen de un sitio de contenido genérico que no cita fuentes, y no se pudieron confirmar. Los programas de tierra patagónicos son para residentes, como Plan Loteo Joven en Neuquén o la tierra fiscal en General Roca. Lo más parecido es la **prioridad a jóvenes profesionales nativos que regresan** (Varvarco, Res. 32/2020).
- **La Pampa y el oeste bonaerense.** No se encontró ningún programa municipal verificado. Solo hay subastas (Metileo) y la iniciativa de Gascón, impulsada con la ONG Proyecto Pulpería y de carácter municipal no confirmado.

### 3.2 Requisitos habituales

| Requisito | Dónde aparece |
|---|---|
| Construir en un plazo (de 6 meses a 5 años) o perder el lote | Toro Pujio, Balcarce, Bruzzone (posesión condicionada), parques industriales (Tres Arroyos: planta en 3 años; Balcarce: 36 meses; Neuquén: naves en 2 años) |
| Residencia previa en la localidad (1 a 2 años) | Alicia (lotes), Neuquén (Loteo Joven); ausente en Bruzzone, Toro Pujio, Villa del Rosario y Balcarce |
| Edad o composición familiar | Neuquén (18-29, parejas), Balcarce (18-64), Bienvenidos a mi Pueblo (familias jóvenes, prioridad con niños) |
| Proyecto productivo u oficio | Colonia Belgrano y las comunas de Es Vicis; Gascón |
| No tener otro inmueble ni haber recibido ayuda estatal | Balcarce, Neuquén |
| Empleo local (empresas) | Balcarce (70% de personal residente), Trelew (2 empleados vecinos), Goya (mantener los puestos), Esteban Echeverría |

### 3.3 Resultados reportados

Hay muy pocos, y ninguno tiene seguimiento independiente:

- **Colonia Belgrano (2016-2019).** Es el único caso con balance:
  - unas 20.000 postulaciones en 4 semanas para 20 plazas;
  - entre 15 y 17 familias se instalaron y seguían allí unos 3 años después;
  - la población creció un 10% el primer año, hubo 25 negocios nuevos y el empleo local subió un 15%;
  - los ingresos de las familias subieron un 40% reales, según la propia fundación.
- **Nicolás Bruzzone (2022).** Más de 70 familias "interesadas" para unos 50 lotes. No hay datos de cuántas se mudaron.
- **Toro Pujio (2021).** 8 lotes vendidos de 10 en el primer barrio, mayoría a familias de Arroyito, y la primera casa en obra.
- **Gascón.** Al menos una familia se radicó en 2016.
- **Lectura.** La demanda declarada supera por mucho a la oferta: miles de postulantes para decenas de lotes. Pero la conversión en radicación efectiva es de **decenas de familias por pueblo**. Sin empleo local o trabajo remoto, el lote solo no alcanza; por eso Es Vicis selecciona por oficio o emprendimiento. Esto coincide con lo revisado en `docs/politicas-territoriales.md`, donde la falta de empleo local es el principal factor de fracaso.

### 3.4 Incentivos a empresas

- **Estructura típica.** En Buenos Aires el modelo es la adhesión a la Ley 13.656 más una ordenanza local, con estos rasgos:
  - exención de **habilitación** (100%) y **derechos de construcción** (100%, de 2 a 5 años);
  - exención decreciente de **Seguridad e Higiene** (50-100%, de 1 a 10 años);
  - plazos que se alargan si se contrata personal local.
- **Los más generosos:**
  - Tres Arroyos: todas las tasas por 10 años en el parque industrial;
  - Goya: 10 años de tasas e impuestos municipales;
  - Bahía Blanca: 8 años en el parque;
  - Zárate: hasta 100% por hasta 10 años;
  - Neuquén: 10 años en el Parque Industrial Capital.
- **Tierra industrial barata.** Es el incentivo más tangible:
  - Tres Arroyos: U$S 4,97/m² en 2017;
  - Balcarce: $230/m² en 2021;
  - Valle María: cesión gratuita con cargo;
  - Malagueño: lotes a U$S 50-70/m², que es precio de mercado periurbano y no subsidio.
- **Tendencia 2025-2026.** Aparecen "RIGI municipales" (Tres de Febrero, el proyecto de Viedma) y exenciones a **comercios nuevos** por 6 a 12 meses (Neuquén, Cipolletti). Cuesta poco al fisco y sirve para atraer comercio de servicios, más que industria.

---

## 4. Limitaciones

1. **Sesgo de prensa.** Lo que se encuentra es lo que fue noticia. Un caso llamativo como Bruzzone tiene decenas de notas que se repiten unas a otras, mientras que ordenanzas fiscales con exenciones generosas no tienen ninguna. Además, las notas "pueblo regala terrenos" de 2024-2026 hablan sobre todo de EE. UU. y España, y algunos sitios de contenido mezclan casos sin fuente (TurismoArgentino.net). Ninguno de esos casos entró sin verificación.
2. **No hay registro oficial.** No existe un registro nacional ni provincial de incentivos municipales.
   - SIBOM cubre los 135 partidos bonaerenses, pero el buscador web solo indexa una parte.
   - Las 1.300 comunas y municipios chicos de Santa Fe, Córdoba y Entre Ríos rara vez publican su digesto.
   - Muchos programas de lotes no tienen ordenanza: son decisiones del jefe comunal.
3. **Cobertura.** Se relevaron 36 de los unos 2.300 gobiernos locales: menos del 2%. En los 24 municipios prioritarios marcados `sin_info`, la ausencia no prueba que no haya incentivo. Para confirmarlo hay que consultar el digesto o pedirlo por acceso a la información pública.
4. **Vigencia.** Casi la mitad de las filas (18) son `incierto`. Los anuncios de prensa no tienen seguimiento, y las ordenanzas fiscales se renuevan cada año.
5. **Montos en pesos.** No son comparables entre años por la inflación. Para comparar conviene usar los valores en U$S o en múltiplos del salario mínimo cuando la fuente los da.
6. **No se evaluó la efectividad.** Salvo Colonia Belgrano, no hay datos de cuántas personas o empresas llegaron ni de cuántas se quedaron.

---

## 5. Cómo mostrarlo en la app

1. **Capa de puntos "Incentivos municipales".** Un punto por fila de `municipales.csv` en `lat/lon`.
   - El ícono depende del `tipo`: lote, casa, porcentaje para tasas, fábrica para parque industrial.
   - El color depende de `beneficiario`: personas, profesionales, empresas.
   - El borde muestra `verificado`: sólido para `si`, punteado para `parcial`. La opacidad baja con `vigencia_estado` = `incierto` o `vencido`.
2. **En el panel `CellDetail`,** en la sección de incentivos, debajo de los nacionales y provinciales que ya muestra `incentivos_departamento.csv`, agregar **"Municipios del departamento"**.
   - El cruce se hace por `cod_dep`. Muestra programa, intensidad, norma, fecha y enlace a la fuente, con una etiqueta "solo prensa" si `verificado=parcial`.
   - Si el departamento contiene un sitio de la lista prioritaria, se muestra la fila de `municipales_cobertura.csv`. En `sin_info` el texto debe ser "Sin información relevada (no implica que no exista)".
3. **No sumarlo al puntaje del modelo por ahora.** La cobertura es menor al 2% y está sesgada hacia lo que fue noticia, así que incorporarlo al MCDA premiaría a los municipios con más prensa. Como mucho, puede usarse como **filtro o bandera** ("tiene tierra municipal ofrecida", "tiene régimen de exención industrial") en los escenarios de *repoblar pueblos* y *polos productivos*.
4. **Escenario "repoblar pueblos".** Mostrar como referencia el paquete típico observado: lote comunal a menos del 10-50% del precio de mercado, obligación de construir en 6 a 60 meses y acompañamiento laboral. Junto a eso, mostrar el **resultado realista**: decenas de familias por pueblo y por convocatoria, no cientos, para no sobreestimar la población que se puede atraer.
5. **Actualización.** Agregar filas en `pipeline/incentivos_municipales_datos.py` y correr `python3 pipeline/incentivos_municipales.py`, que geocodifica y valida los dominios. Una mejora natural es un formulario en la app para que los municipios carguen su propio programa con enlace a la norma, y así se reduzca el sesgo de prensa.
