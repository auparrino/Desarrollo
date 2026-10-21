"""Catálogo de fuentes de datos crudos.

Cada entrada documenta la URL de descarga, el archivo local en data/raw y la
referencia/licencia. `download.py` usa este catálogo; `build.py` lo lee para
escribir los metadatos que muestra la app.
"""

IGN_WFS = (
    "https://wms.ign.gob.ar/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature"
    "&typeName=ign:{layer}&outputFormat=application/json&srsName=EPSG:4326"
)
WC = "https://geodata.ucdavis.edu/climate/worldclim/2_1/base/"

SOURCES = {
    "provincias": {
        "url": IGN_WFS.format(layer="provincia"),
        "file": "ign_provincia.json",
        "cita": "Instituto Geográfico Nacional (IGN), capa 'provincia', WFS oficial.",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "departamentos": {
        "url": IGN_WFS.format(layer="departamento"),
        "file": "ign_departamento.json",
        "cita": "IGN, capa 'departamento'.",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "areas_protegidas": {
        "url": IGN_WFS.format(layer="area_protegida"),
        "file": "ign_area_protegida.json",
        "cita": "IGN / SIB-APN, capa 'area_protegida' (nacionales y provinciales).",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "rutas_nacionales": {
        "url": IGN_WFS.format(layer="vial_nacional"),
        "file": "ign_vial_nacional.json",
        "cita": "IGN / Dirección Nacional de Vialidad, red vial nacional.",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "ferrocarril": {
        "url": IGN_WFS.format(layer="lineas_de_transporte_ferroviario_AN010"),
        "file": "ign_lineas_de_transporte_ferroviario_AN010.json",
        "cita": "IGN / Ministerio de Transporte, red ferroviaria.",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "lineas_electricas": {
        "url": IGN_WFS.format(layer="lineas_de_energia_AT030"),
        "file": "ign_lineas_de_energia_AT030.json",
        "cita": "IGN, líneas de transmisión eléctrica (AT030). Se usan las de código ten=6 (alta tensión).",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "puertos": {
        "url": IGN_WFS.format(layer="puntos_de_puertos_y_muelles_BB005"),
        "file": "ign_puntos_de_puertos_y_muelles_BB005.json",
        "cita": "IGN / Ministerio de Transporte, puertos.",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "localidades": {
        "url": IGN_WFS.format(layer="localidad_bahra"),
        "file": "ign_localidad_bahra.json",
        "cita": "BAHRA (Base de Asentamientos Humanos de la República Argentina), INDEC/IGN.",
        "licencia": "CC BY 4.0",
    },
    "censo2022": {
        "url": "https://infra.datos.gob.ar/catalog/indec/dataset/50/distribution/50.1/download/radios-censales-2022.csv",
        "file": "rc2022.csv",
        "cita": "INDEC, Censo Nacional de Población, Hogares y Viviendas 2022, población en viviendas particulares por radio censal.",
        "licencia": "CC BY 4.0 (datos.gob.ar)",
    },
    "censo2010": {
        "url": "https://infra.datos.gob.ar/catalog/indec/dataset/50/distribution/50.4/download/radios-censales-2010.csv",
        "file": "rc2010.csv",
        "cita": "INDEC, Censo Nacional de Población, Hogares y Viviendas 2010, población por radio censal.",
        "licencia": "CC BY 4.0 (datos.gob.ar)",
    },
    "worldpop": {
        "url": "https://data.worldpop.org/GIS/Population/Global_2000_2020_1km_UNadj/2020/ARG/arg_ppp_2020_1km_Aggregated_UNadj.tif",
        "file": "worldpop_arg_2020_1km.tif",
        "cita": "WorldPop (2018). Global High Resolution Population Denominators, 2020, 1 km, UN-adjusted. doi:10.5258/SOTON/WP00671",
        "licencia": "CC BY 4.0",
    },
    "elevacion": {
        "url": WC + "wc2.1_30s_elev.zip",
        "file": "wc2.1_30s_elev.tif",
        "cita": "WorldClim 2.1 elevación 30\" (derivada de SRTM). Fick & Hijmans (2017) doi:10.1002/joc.5086",
        "licencia": "CC BY 4.0",
    },
    "clima_bio": {
        "url": WC + "wc2.1_2.5m_bio.zip",
        "file": "wc2.1_2.5m_bio_{n}.tif",
        "cita": "WorldClim 2.1 variables bioclimáticas 1970-2000, 2.5'. Fick & Hijmans (2017).",
        "licencia": "CC BY 4.0",
    },
    "clima_tavg": {
        "url": WC + "wc2.1_2.5m_tavg.zip",
        "file": "wc2.1_2.5m_tavg_{mm}.tif",
        "cita": "WorldClim 2.1 temperatura media mensual 1970-2000, 2.5'.",
        "licencia": "CC BY 4.0",
    },
    "radiacion": {
        "url": WC + "wc2.1_2.5m_srad.zip",
        "file": "wc2.1_2.5m_srad_{mm}.tif",
        "cita": "WorldClim 2.1 radiación solar incidente mensual (kJ m-2 día-1), 2.5'.",
        "licencia": "CC BY 4.0",
    },
    "aridez": {
        "url": "https://ndownloader.figshare.com/files/56300327",
        "file": "Global-AI_ET0__annual_v3_1/ai_v31_yr.tif",
        "cita": "Zomer, Xu & Trabucco (2022). Version 3 of the Global Aridity Index and Potential Evapotranspiration Database. Scientific Data 9:409. doi:10.1038/s41597-022-01493-1 (v3.1)",
        "licencia": "CC BY 4.0",
    },
    "rios": {
        "url": "https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_sa_shp.zip",
        "file": "HydroRIVERS_v10_sa_shp/HydroRIVERS_v10_sa.shp",
        "cita": "Lehner & Grill (2013). Global river hydrography and network routing. Hydrological Processes 27(15). doi:10.1002/hyp.9740",
        "licencia": "HydroSHEDS License (uso libre con atribución)",
    },
    "sismicidad": {
        "url": "https://zenodo.org/records/8409647/files/GEM-GSHM_PGA-475y-rock_v2023.zip",
        "file": "v2023_1_pga_475_rock_3min.tif",
        "cita": "Pagani et al. (2023). GEM Global Seismic Hazard Map v2023.1, PGA 10% en 50 años (475 años), roca. doi:10.5281/zenodo.8409647",
        "licencia": "CC BY-NC-SA 4.0 (uso no comercial)",
    },
    "inundacion": {
        "url": "https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/FLOODS/GlobalMaps/floodMapGL_rp100y.zip",
        "file": "floodMapGL_rp100y.tif",
        "cita": "Dottori et al. (2016). JRC Global flood hazard map, período de retorno 100 años. Ver Dottori et al. (2016) Adv. Water Resour. doi:10.1016/j.advwatres.2016.05.002",
        "licencia": "CC BY 4.0 (JRC)",
    },
    "accesibilidad": {
        "url": (
            "https://data.malariaatlas.org/geoserver/Accessibility/wcs?service=WCS&version=2.0.1&request=GetCoverage"
            "&coverageId=Accessibility__201501_Global_Travel_Time_to_Cities"
            "&subset=Long(-74,-53)&subset=Lat(-56,-21)&format=image/geotiff"
        ),
        "file": "access_cities_2015.tif",
        "cita": "Weiss et al. (2018). A global map of travel time to cities to assess inequalities in accessibility in 2015. Nature 553:333-336. doi:10.1038/nature25181",
        "licencia": "CC BY 4.0",
    },
    "viento": {
        "url": "https://globalwindatlas.info/api/gis/country/ARG/wind-speed/100",
        "file": "gwa_arg_ws100.tif",
        "cita": "Global Wind Atlas 3 (DTU / Banco Mundial), velocidad media a 100 m. Davis et al. (2023) BAMS doi:10.1175/BAMS-D-21-0075.1",
        "licencia": "CC BY 4.0",
    },
    "salud": {
        "url": (
            "https://data.malariaatlas.org/geoserver/Accessibility/wcs?service=WCS&version=2.0.1&request=GetCoverage"
            "&coverageId=Accessibility__202001_Global_Motorized_Travel_Time_to_Healthcare"
            "&subset=Long(-74,-53)&subset=Lat(-56,-21)&format=image/geotiff"
        ),
        "file": "access_health_2020.tif",
        "cita": "Weiss et al. (2020). Global maps of travel time to healthcare facilities. Nature Medicine 26:1835-1838. doi:10.1038/s41591-020-1059-1",
        "licencia": "CC BY 4.0",
    },
    "tenencia_cna2018": {
        "url": "https://consultascna2018.indec.gob.ar/ (cuadros C3.1-C3.3; ver pipeline/tierra/)",
        "file": "tierra/cna2018_tenencia_departamento.csv",
        "cita": "INDEC, Censo Nacional Agropecuario 2018, resultados definitivos: superficie de las EAP por régimen de tenencia y tipo de dominio (fiscal/privado), por departamento.",
        "licencia": "Información estadística pública (INDEC); citar la fuente",
    },
    "extranjerizacion": {
        "url": "https://www.argentina.gob.ar/justicia/tierras-rurales (Registro Nacional de Tierras Rurales, corte agosto 2025)",
        "file": "tierra/rntr/rntr_extranjerizacion_departamento_2025-08.csv",
        "cita": "Registro Nacional de Tierras Rurales (Ley 26.737), porcentaje de tierra rural en titularidad extranjera por departamento, agosto de 2025.",
        "licencia": "Información pública oficial",
    },
    "comunidades_indigenas": {
        "url": "https://datos.gob.ar (Ministerio del Interior, listado de comunidades indígenas, noviembre 2025)",
        "file": "tierra/indigenas/comunidades_indigenas_mininterior_20251112.csv",
        "cita": "Ministerio del Interior / INAI, listado de comunidades indígenas con estado del relevamiento territorial (Ley 26.160), noviembre de 2025.",
        "licencia": "CC BY 4.0 (datos.gob.ar)",
    },
    "arsenico": {
        "url": "https://doi.org/10.25678/0001ZT",
        "file": "../interim/agua_subterranea/as_prob_gt10ugL_podgorski2020_arg.tif",
        "cita": "Podgorski & Berg (2020). Global threat of arsenic in groundwater. Science 368:845-850. doi:10.1126/science.aba1510. Datos: doi:10.25678/0001ZT. Probabilidad de As > 10 µg/L.",
        "licencia": "Sin licencia abierta explícita (Eawag/ERIC); se publican solo promedios por celda, con cita. Confirmar con los autores.",
    },
    "fluoruro": {
        "url": "https://doi.org/10.25678/0006GQ",
        "file": "../interim/agua_subterranea/f_prob_gt1p5mgL_podgorski2022_arg.tif",
        "cita": "Podgorski & Berg (2022). Global analysis and prediction of fluoride in groundwater. Nature Communications 13:4232. Datos: doi:10.25678/0006GQ. Probabilidad de F > 1,5 mg/L.",
        "licencia": "Sin licencia abierta explícita (Eawag/ERIC); se publican solo promedios por celda, con cita. Confirmar con los autores.",
    },
    "empleo": {
        "url": "https://cdn.produccion.gob.ar/cdn-cep/datos-por-departamento/ (CEP XXI, SIPA; ver docs/datos-economia.md)",
        "file": "../interim/economia/indicadores_empleo_departamento.csv",
        "cita": "CEP XXI (Ministerio de Economía), puestos de trabajo asalariados registrados privados y salarios por departamento (SIPA), 2014-2023, por domicilio del trabajador.",
        "licencia": "CC BY 4.0 (datos.gob.ar)",
    },
    "proyectos": {
        "url": "SIACAM (minería), Secretaría de Energía (concesiones, Vaca Muerta), CAMMESA/RenovAr, RENPI (parques industriales)",
        "file": "../interim/economia/proyectos.geojson",
        "cita": "Cartera de proyectos productivos: SIACAM (Secretaría de Minería), Secretaría de Energía (concesiones de hidrocarburos), CAMMESA y RenovAr (energías renovables), RENPI (parques industriales). Ver docs/datos-economia.md.",
        "licencia": "CC BY 4.0 / información pública oficial",
    },
    "servicios": {
        "url": "https://www.indec.gob.ar (Censo 2022, cuadros definitivos por departamento); ver docs/datos-servicios.md",
        "file": "../interim/censo_servicios/servicios_departamento.csv",
        "cita": "INDEC, Censo 2022 (hogares con agua de red, cloaca, internet, tenencia, viviendas desocupadas); NBI y hacinamiento procesados desde REDATAM vía Poblaciones (CONICET/UCA); RENABAP (corte 5/12/2023); REFES/SISA; padrón de escuelas 2024; estimaciones de población INDEC 2022-2035.",
        "licencia": "CC BY 4.0 / información estadística pública",
    },
    "universidades": {
        "url": "https://wms.ign.gob.ar/geoserver/ows (WFS, sedes universitarias)",
        "file": "../interim/censo_servicios/universidades.geojson",
        "cita": "IGN, sedes de universidades (WFS).",
        "licencia": "CC BY 4.0 (IGN)",
    },
    "establecimientos_salud": {
        "url": "https://datos-poblaciones.conicet.gov.ar (REFES/SISA vía Poblaciones); ver docs/poblaciones.md",
        "file": "../interim/censo_servicios/equipamiento_salud.geojson",
        "cita": "REFES/SISA (Ministerio de Salud), establecimientos de salud georreferenciados, vía plataforma Poblaciones (CONICET/UCA), actualización 2025.",
        "licencia": "CC BY 4.0",
    },
}
