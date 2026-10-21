# Atlas de aptitud territorial · Argentina

Herramienta web para evaluar **dónde podrían crearse nuevas ciudades** y **hacia dónde podría redistribuirse población** en Argentina. Usa un análisis multicriterio sobre una grilla de ~95.000 hexágonos (H3, ~36 km²) construida con datos abiertos oficiales y globales.

La metodología sigue la literatura especializada en análisis multicriterio con SIG y en selección de sitios para nuevas ciudades:

- restricciones excluyentes;
- funciones de valor con umbrales absolutos;
- pesos jerárquicos con cuatro escenarios;
- agregación WLC u OWA;
- análisis de robustez por Monte Carlo.

Cada parámetro está documentado con su fuente y su nivel de evidencia.

## Qué hace la app

| Pestaña | Contenido |
|---|---|
| **Criterios** | Restricciones activables con umbral ajustable, pesos por factor, funciones de valor editables, escenarios E0–E3, WLC u OWA |
| **Sitios** | Regiones candidatas contiguas que cumplen la superficie mínima, robustez Monte Carlo (Dirichlet) |
| **Simulador** | Requerimientos de suelo, agua, vivienda y energía por destino; efecto del traslado sobre la concentración en el AMBA |
| **Diagnóstico** | Población, densidad y crecimiento 2010–2022 por departamento y provincia (Censo INDEC) |
| **Método** | Resumen metodológico, limitaciones y fuentes con licencias |

Al hacer clic en una celda se abre su ficha: puntaje de cada factor, aporte al total, motivo de exclusión y todas las variables.

## Documentación

- [`docs/revision-bibliografica.md`](docs/revision-bibliografica.md): criterios, umbrales, funciones de valor y pesos, con 82 referencias verificadas.
- [`docs/metodologia.md`](docs/metodologia.md): procesamiento de datos, modelo de decisión, reproducibilidad y limitaciones.
- [`docs/hallazgos.md`](docs/hallazgos.md): resultados preliminares por escenario.

## Estructura

```
pipeline/   Python: descarga de fuentes y construcción de la grilla H3 → web/public/data
web/        React + MapLibre + deck.gl; modelo multicriterio en web/src/model (con tests)
docs/       revisión bibliográfica, metodología, hallazgos
```

## Uso local

```bash
cd web && npm ci && npm run dev        # usa los datos ya generados en web/public/data
npm test                               # tests del modelo
```

Para regenerar los datos (unos 2,5 GB de descargas):

```bash
pip install -r pipeline/requirements.txt
python pipeline/download.py && python pipeline/build.py
```

## Publicación

`.github/workflows/pages.yml` compila la app en cada push y la publica en la rama `gh-pages`. La app queda en https://auparrino.github.io/Desarrollo/ (si no aparece, en el repositorio elegí **Settings → Pages → Deploy from a branch → gh-pages / root**).

## Fuentes principales

- **Cartografía y estadísticas nacionales:** IGN (límites, rutas, ferrocarril, alta tensión, áreas protegidas, puertos, BAHRA) e INDEC (Censos 2010 y 2022 por radio censal).
- **Población, clima y relieve:** WorldPop y WorldClim 2.1.
- **Agua y riesgos:** Aridity Index v3.1, HydroRIVERS, GEM Global Seismic Hazard 2023 y JRC Global Flood Hazard.
- **Accesibilidad y energía:** Weiss et al. 2018 y 2020 (accesibilidad) y Global Wind Atlas.

Las licencias están en [`pipeline/sources.py`](pipeline/sources.py). El mapa sísmico de GEM tiene licencia CC BY-NC-SA (uso no comercial).
