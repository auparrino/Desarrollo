"""Auditoría de la grilla generada por build.py.

Controles de cobertura, rangos, coherencia interna, conservación de totales
censales y "pruebas de cordura" (qué ciudades conocidas excluye cada restricción).
Escribe docs/auditoria-datos.md y docs/auditoria-datos.json.

Uso: python pipeline/audit.py
"""
from __future__ import annotations

import json
from pathlib import Path

import h3
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "web" / "public" / "data"
RAW = ROOT / "data" / "raw"

# Rangos físicamente plausibles para Argentina continental (controles de error grosero).
RANGES = {
    "elev": (-120, 7000), "pend_media": (0, 100), "frac_pend_ok": (0, 1), "t_media": (-15, 30),
    "t_max_cal": (-5, 45), "t_min_fri": (-30, 20), "prec": (0, 3500), "prec_estac": (0, 200),
    "hdd18": (0, 10000), "cdd18": (0, 3000), "ghi": (1, 8), "aridez": (0, 3), "pga475": (0, 2),
    "frac_inund100": (0, 1), "t_ciudad": (0, 3000), "t_salud": (0, 3000), "viento100": (0, 25),
    "pob": (0, 2e6), "pob_50km": (0, 2e7), "crec_dep": (-10, 15), "frac_ap_estricta": (0, 1),
    "frac_ap_uso_multiple": (0, 1), "d_ruta": (0, 600), "d_ffcc": (0, 1500), "d_alta_tension": (0, 1000),
    "d_puerto": (0, 2000), "d_rio10": (0, 1000), "d_rio100": (0, 1500), "d_localidad": (0, 300),
    "q_rio25": (0, 30000), "q95_rio25": (0, 30000), "d_amba": (0, 3500), "frac_tierra": (0, 1), "d_media_pob": (0, 3000),
    "d_max_capital": (0, 4000), "d_metro": (0, 3000), "as_prob": (0, 1), "f_prob": (0, 1),
    "pct_fiscal_eap": (0, 100), "pct_dep_en_eap": (0, 100), "pct_extranjero": (0, 100), "d_comunidad": (0, 1000),
    "empleo_50km": (0, 5e6), "emp_crec": (-30, 30), "salario_rel": (0.2, 5), "n_proyectos_100km": (0, 500),
    "d_parque_ind": (0, 1000), "pct_agua_red": (0, 100), "pct_cloaca": (0, 100), "pct_internet": (0, 100),
    "pct_nbi": (0, 100), "pct_viv_ociosas": (0, 100), "salud_int_100mil": (0, 1000), "crec_proy_2035": (-60, 200),
    "viv_ociosas_50km": (0, 2e6), "pct_fiscal_est": (0, 100), "frac_fiscal_conocida": (0, 1), "d_inmueble_estado": (0, 1000), "d_universidad": (0, 1500), "d_hospital": (0, 1500),
}

# Ciudades de control (coordenadas del centro; fuente: BAHRA/IGN).
CIUDADES = {
    "CABA": (-34.6037, -58.3816), "Córdoba": (-31.4167, -64.1833), "Rosario": (-32.9468, -60.6393),
    "Mendoza": (-32.8895, -68.8458), "San Miguel de Tucumán": (-26.8083, -65.2176), "La Plata": (-34.9214, -57.9545),
    "Mar del Plata": (-38.0055, -57.5426), "Salta": (-24.7859, -65.4117), "Santa Fe": (-31.6333, -60.7000),
    "San Juan": (-31.5375, -68.5364), "Resistencia": (-27.4606, -58.9839), "Neuquén": (-38.9516, -68.0591),
    "Corrientes": (-27.4692, -58.8306), "Posadas": (-27.3671, -55.8961), "Bahía Blanca": (-38.7183, -62.2663),
    "Paraná": (-31.7413, -60.5115), "San Salvador de Jujuy": (-24.1858, -65.2995), "Formosa": (-26.1849, -58.1731),
    "Santiago del Estero": (-27.7951, -64.2615), "San Luis": (-33.2950, -66.3356), "La Rioja": (-29.4131, -66.8558),
    "Catamarca": (-28.4696, -65.7795), "Santa Rosa": (-36.6167, -64.2833), "Río Gallegos": (-51.6230, -69.2168),
    "Comodoro Rivadavia": (-45.8641, -67.4966), "Trelew": (-43.2489, -65.3051), "Viedma": (-40.8135, -62.9967),
    "Ushuaia": (-54.8019, -68.3030), "Río Cuarto": (-33.1232, -64.3493), "Bariloche": (-41.1335, -71.3103),
}


def load():
    meta = json.loads((DATA / "cells.json").read_text())
    buf = (DATA / "cells.bin").read_bytes()
    n = meta["n"]
    lo = np.frombuffer(buf, "<u4", n, meta["layout"]["h3_lo"])
    hi = np.frombuffer(buf, "<u4", n, meta["layout"]["h3_hi"])
    ids = (hi.astype(np.uint64) << np.uint64(32)) | lo.astype(np.uint64)
    dep = np.frombuffer(buf, "<u2", n, meta["layout"]["dep_idx"])
    cols = {c["id"]: np.frombuffer(buf, "<f4", n, c["offset"]).astype(float) for c in meta["columns"]}
    df = pd.DataFrame(cols)
    df["h3"] = ids
    deps = meta["departamentos"]
    df["cod_dep"] = [deps[i]["cod"] for i in dep]
    df["provincia"] = [deps[i]["provincia"] for i in dep]
    return meta, df


def restriction_masks(df: pd.DataFrame) -> dict[str, pd.Series]:
    """Restricciones por defecto de la app (web/src/model/criteria.ts, mcda.ts)."""
    q_req = 500_000 * 200 * 1.5 / 1000 / 86400  # R13 con Q95 corregido y α = 0,5
    return {
        "R01 Área protegida estricta": df.frac_ap_estricta > 0.5,
        "R03 Inundación T100": df.frac_inund100 > 0.4,
        "R04 Pendiente": df.frac_pend_ok < 0.5,
        "R06 Sismicidad": df.pga475 >= 0.35,
        "R09 Altitud": df.elev > 2500,
        "R10 Costa baja": df.elev < 5,
        "R13 Agua": ~((df.q95_rio25 * 0.5 >= q_req) | (df.aridez >= 0.5)),
    }


def main() -> None:
    meta, df = load()
    rep: dict = {"celdas": len(df)}
    lines = ["# Auditoría de datos", "",
             f"Grilla generada el {meta['generado']}: {len(df):,} celdas H3 res {meta['h3_res']}. "
             "Se genera con `python pipeline/audit.py`.", ""]

    # 1. cobertura y rangos
    lines += ["## 1. Cobertura y rangos", "",
              "| Variable | Faltantes | Mín | P50 | Máx | Fuera de rango |", "|---|---|---|---|---|---|"]
    issues = []
    cov = {}
    for k, (a, b) in RANGES.items():
        if k not in df:
            continue
        v = df[k]
        nan = int(v.isna().sum())
        out = int(((v < a) | (v > b)).sum())
        cov[k] = {"nan": nan, "fuera_rango": out}
        lines.append(f"| {k} | {nan} | {v.min():.3g} | {v.median():.3g} | {v.max():.3g} | {out} |")
        if out:
            issues.append(f"`{k}`: {out} celdas fuera del rango plausible [{a}, {b}].")
    rep["cobertura"] = cov

    # 2. coherencia interna
    c = []
    t = df[["t_min_fri", "t_media", "t_max_cal"]].dropna()
    c.append(("t_min_fri ≤ t_media ≤ t_max_cal (celdas que no cumplen)", int((~((t.t_min_fri <= t.t_media) & (t.t_media <= t.t_max_cal))).sum())))
    c.append(("HDD18 decrece con la temperatura (corr. Spearman)", round(df[["hdd18", "t_media"]].corr("spearman").iloc[0, 1], 3)))
    c.append(("d_rio100 ≥ d_rio10", int((df.d_rio100 + 1e-3 < df.d_rio10).sum())))
    c.append(("pob_50km ≥ pob", int((df.pob_50km + 1 < df.pob).sum())))
    c.append(("Fracción de celdas con >100.000 hab. a <15 min de una ciudad", round(float((df[df.pob > 1e5].t_ciudad < 15).mean()), 3)))
    lines += ["", "## 2. Coherencia interna", "", "| Control | Resultado |", "|---|---|"]
    lines += [f"| {a} | {b} |" for a, b in c]
    rep["coherencia"] = dict(c)

    # 3. totales censales
    rc = pd.read_csv(RAW / "rc2022.csv", usecols=["cod_prov", "POB_TOT_P"], dtype={"cod_prov": str}, encoding="utf-8-sig")
    rc["cod_prov"] = rc.cod_prov.str.zfill(2)
    prov_censo = rc.groupby("cod_prov").POB_TOT_P.sum()
    prov_grid = df.groupby(df.cod_dep.str[:2]).pob.sum()
    cmp = pd.DataFrame({"censo": prov_censo, "grilla": prov_grid}).fillna(0)
    cmp["dif_pct"] = 100 * (cmp.grilla - cmp.censo) / cmp.censo
    lines += ["", "## 3. Conservación de la población censal", "",
              f"Total de la grilla: {df.pob.sum():,.0f}. Censo 2022 en viviendas particulares: {prov_censo.sum():,.0f} "
              f"(diferencia {100 * (df.pob.sum() / prov_censo.sum() - 1):+.3f} %).", "",
              "El reparto se hace píxel a píxel, así que el total departamental se conserva. Cada celda se rotula con el "
              "departamento que ocupa la mayor parte de su superficie: los departamentos más chicos que una celda (comunas "
              "de CABA, partidos del conurbano) quedan rotulados dentro de sus vecinos. Para análisis departamentales se usa "
              "departamentos.geojson, que tiene los totales censales exactos.", "",
              f"Diferencia máxima por provincia según el rótulo de las celdas: {cmp.dif_pct.abs().max():.1f} % "
              "(efecto de borde de ese rótulo, no pérdida de población).", "",
              "El total oficial del Censo 2022 (46.044.703) incluye viviendas colectivas y personas en situación de calle; "
              "la grilla usa la población en viviendas particulares, que es la que está disponible por radio censal.", ""]
    rep["poblacion"] = {"grilla": float(df.pob.sum()), "censo_vp": float(prov_censo.sum()),
                        "dif_max_prov_pct": float(cmp.dif_pct.abs().max())}

    # 4. pruebas de cordura: ciudades de control
    masks = restriction_masks(df)
    idx = pd.Series(range(len(df)), index=df.h3.values)
    rows = []
    for name, (lat, lon) in CIUDADES.items():
        cell = h3.str_to_int(h3.latlng_to_cell(lat, lon, meta["h3_res"]))
        if cell not in idx.index:
            rows.append((name, "fuera de la grilla", "", "", "", "", ""))
            continue
        i = idx[cell]
        r = df.iloc[i]
        excl = [k.split(" ")[0] for k, m in masks.items() if bool(m.iloc[i])]
        rows.append((name, f"{r.t_media:.1f}", f"{r.prec:.0f}", f"{r.pga475:.2f}", f"{r.q_rio25:.0f}",
                     f"{r.t_ciudad:.0f}", ", ".join(excl) or "—"))
    lines += ["## 4. Ciudades de control", "",
              "Valores en la celda que contiene el centro de cada ciudad. Sirve para detectar errores groseros y para ver "
              "qué restricciones afectarían a ciudades que existen y funcionan.", "",
              "| Ciudad | T media °C | Precip. mm | PGA g | Río ≤25 km m³/s | Min. a ciudad | Restricciones que la excluirían |",
              "|---|---|---|---|---|---|---|"]
    lines += ["| " + " | ".join(map(str, r)) + " |" for r in rows]
    rep["ciudades"] = rows

    # 5. impacto de cada restricción sobre la población actual
    lines += ["", "## 5. Población actual dentro de cada restricción", "",
              "Si una restricción abarca a mucha población que vive hoy allí, el umbral puede ser demasiado severo, o bien "
              "señala un riesgo real que esa población ya soporta.", "",
              "| Restricción | Celdas | % del país | Población 2022 dentro | % de la población |", "|---|---|---|---|---|"]
    tot = df.pob.sum()
    imp = {}
    for k, m in masks.items():
        p = df.pob[m].sum()
        imp[k] = {"celdas": int(m.sum()), "pob": float(p)}
        lines.append(f"| {k} | {int(m.sum()):,} | {100 * m.mean():.1f} | {p:,.0f} | {100 * p / tot:.1f} |")
    rep["impacto_restricciones"] = imp

    # 6. hallazgos
    big = df[df.pob > 50_000]
    agua_big = big[masks["R13 Agua"][big.index]]
    inund_big = big[masks["R03 Inundación T100"][big.index]]
    lines += ["", "## 6. Observaciones", ""]
    obs = issues + [
        f"Hay {len(agua_big)} celdas con más de 50.000 habitantes que R13 (agua) excluiría. Las ciudades áridas existentes "
        "se abastecen de ríos regulados, acueductos o agua subterránea, que el sustituto no capta.",
        f"Hay {len(inund_big)} celdas con más de 50.000 habitantes dentro de la planicie T100 del JRC. El mapa global no "
        "considera las defensas existentes, así que sobreestima la exposición en ciudades con terraplenes, como Resistencia o "
        "Santa Fe; a la vez subestima el anegamiento pampeano.",
        "La pendiente calculada sobre un MDE de 1 km es baja aun en la sierra: el 95 % de las celdas tiene una pendiente media "
        f"de {df.pend_media.quantile(0.95):.0f} % o menos. Por eso R04 usa la fracción de la celda con pendiente ≤15 %.",
        "Los caudales de HydroRIVERS se corrigieron con 387 estaciones de aforo de la BDHI (docs/datos-hidrologia.md); "
        "sin estación aguas arriba o abajo el factor de corrección queda en 1.",
    ]
    lines += [f"- {o}" for o in obs]
    (ROOT / "docs" / "auditoria-datos.md").write_text("\n".join(lines) + "\n")
    (ROOT / "docs" / "auditoria-datos.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1, default=str))
    print("\n".join(lines))


if __name__ == "__main__":
    main()
