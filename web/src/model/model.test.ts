import { describe, expect, it } from "vitest";
import { evaluate } from "./valueFunctions";
import { aggregate, caudalRequerido, computeMask, DEFAULT_WATER } from "./mcda";
import { RESTRICTIONS, SCENARIOS, effectiveWeights, FACTORS } from "./criteria";
import { dirichlet, mulberry32, runMonteCarlo } from "./montecarlo";
import { concentracion, hhi, isAMBA } from "./simulator";
import { POLICIES } from "./policies";

describe("funciones de valor", () => {
  it("lineales y logarítmicas", () => {
    expect(evaluate({ kind: "increasing", a: 0, b: 10 }, 5)).toBeCloseTo(0.5);
    expect(evaluate({ kind: "decreasing", a: 0, b: 10 }, 12)).toBe(0);
    expect(evaluate({ kind: "increasing", a: 5, b: 500, log: true }, 50)).toBeCloseTo(0.5);
    expect(evaluate({ kind: "increasing", a: 0, b: 1 }, NaN)).toBeNaN();
  });
  it("trapezoidal con valor inicial", () => {
    const fn = { kind: "trapezoid" as const, a: 10, b: 30, c: 90, d: 240 };
    expect(evaluate(fn, 5)).toBe(0);
    expect(evaluate(fn, 20)).toBeCloseTo(0.5);
    expect(evaluate(fn, 60)).toBe(1);
    expect(evaluate(fn, 165)).toBeCloseTo(0.5);
    expect(evaluate({ ...fn, fa: 0.8 }, 0)).toBeCloseTo(0.8);
  });
});

describe("escenarios de pesos", () => {
  it("todos suman 1", () => {
    for (const s of SCENARIOS) {
      const w = s.weights();
      expect(Object.values(w).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    }
  });
  it("Sejong asigna 0,36 al equilibrio territorial", () => {
    const w = SCENARIOS.find((s) => s.id === "E2")!.weights();
    const eq = FACTORS.filter((f) => f.grupo === "equilibrio").reduce((a, f) => a + w[f.id], 0);
    expect(eq).toBeCloseTo(0.36, 6);
  });
  it("pesos efectivos excluyen factores sin datos", () => {
    const e = effectiveWeights(SCENARIOS[0].weights());
    expect(e.F10).toBeUndefined();
    expect(Object.values(e).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
  });
});

describe("agregación", () => {
  const scores = { A: Float32Array.from([1, 0, 0.5]), B: Float32Array.from([0, 1, NaN]) };
  const mask = new Uint8Array([0, 0, 0]);
  it("WLC y renormalización por faltantes", () => {
    const s = aggregate(scores, { A: 0.75, B: 0.25 }, mask);
    expect(s[0]).toBeCloseTo(0.75);
    expect(s[1]).toBeCloseTo(0.25);
    expect(s[2]).toBeCloseTo(0.5);
  });
  it("OWA con orness 0,5 equivale a WLC; menor es más pesimista", () => {
    const w = { A: 0.5, B: 0.5 };
    expect(aggregate(scores, w, mask, { method: "owa", orness: 0.5 })[0]).toBeCloseTo(0.5);
    expect(aggregate(scores, w, mask, { method: "owa", orness: 0.2 })[0]).toBeLessThan(0.5);
    expect(aggregate(scores, w, mask, { method: "owa", orness: 0.8 })[0]).toBeGreaterThan(0.5);
  });
  it("celdas excluidas quedan NaN", () => {
    expect(aggregate(scores, { A: 1 }, new Uint8Array([1, 0, 0]))[0]).toBeNaN();
  });
});

describe("restricciones", () => {
  it("demanda hídrica: 500.000 hab × 200 L × 1,5 ≈ 1,74 m³/s", () => {
    expect(caudalRequerido(DEFAULT_WATER)).toBeCloseTo(1.736, 2);
  });
  it("máscara atribuye la primera restricción incumplida", () => {
    const n = 3;
    const col = (v: number[]) => Float32Array.from(v);
    const cols: Record<string, Float32Array> = {
      frac_ap_estricta: col([0, 1, 0]), frac_ap_uso_multiple: col([0, 0, 0]), frac_inund100: col([0, 0, 0]),
      frac_pend_ok: col([1, 1, 1]), pga475: col([0, 0, 0]), elev: col([100, 100, 100]), pob: col([0, 0, 0]),
      q_rio25: col([100, 100, 0]), q95_rio25: col([100, 100, 0]), aridez: col([0.1, 0.1, 0.1]),
    };
    const m = computeMask(cols, n, RESTRICTIONS, DEFAULT_WATER);
    expect(m[0]).toBe(0);
    expect(m[1]).toBe(1); // R01
    expect(m[2]).toBe(RESTRICTIONS.length + 1); // R13 agua
  });
});

describe("Monte Carlo", () => {
  it("Dirichlet suma 1 y concentra con κ alto", () => {
    const rng = mulberry32(1);
    const w = dirichlet([500, 500], rng);
    expect(w[0] + w[1]).toBeCloseTo(1, 9);
    expect(Math.abs(w[0] - 0.5)).toBeLessThan(0.1);
  });
  it("una celda dominante siempre queda arriba", () => {
    const n = 100;
    const a = new Float32Array(n).map((_, i) => i / n);
    const b = new Float32Array(n).map((_, i) => i / n);
    a[99] = b[99] = 1;
    const prob = runMonteCarlo({
      scores: [a, b], weights: [0.5, 0.5], eligible: new Uint8Array(n).fill(1), kappa: 10, samples: 50, topFrac: 0.05, seed: 3,
    });
    expect(prob[99]).toBe(1);
    expect(prob[0]).toBe(0);
  });
});

describe("simulador", () => {
  it("AMBA y HHI", () => {
    expect(isAMBA("02007")).toBe(true);
    expect(isAMBA("06427")).toBe(true);
    expect(isAMBA("06441")).toBe(false);
    expect(hhi([1, 1])).toBeCloseTo(0.5);
  });
  it("trasladar población desde el AMBA reduce su participación", () => {
    const deps = [
      { cod: "02007", provincia: "CABA", pob: 3e6 },
      { cod: "06427", provincia: "Buenos Aires", pob: 2e6 },
      { cod: "62007", provincia: "Río Negro", pob: 1e6 },
    ];
    const { antes, despues } = concentracion(deps, [{ provincia: "Río Negro", poblacion: 1e6 }], true);
    expect(antes.participacionAMBA).toBeCloseTo(5 / 6);
    expect(despues.participacionAMBA).toBeCloseTo(4 / 6);
    expect(despues.provincias.find((p) => p.nombre === "Río Negro")!.despues).toBeCloseTo(2e6);
  });
});

describe("instrumentos de política", () => {
  it("los pesos de cada instrumento suman 1 (los factores sin datos se redistribuyen)", () => {
    for (const p of POLICIES) {
      const w = p.weights();
      expect(Object.values(w).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
      expect(Object.values(effectiveWeights(w)).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    }
  });
  it("las restricciones propias tienen ids únicos", () => {
    for (const p of POLICIES) {
      const ids = p.restrictions().map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe("costos", () => {
  it("ciudad nueva de 500.000 hab. cuesta del orden de casos documentados (USD 10–60 mil por hab.)", async () => {
    const { estimateCosts } = await import("./costs");
    const { UNIT_COSTS } = await import("./unitCostsData");
    const one = (v: number) => Float32Array.from([v]);
    const cols = {
      q_rio25: one(100), q95_rio25: one(30), aridez: one(0.2), prec: one(400), d_ruta: one(20), d_alta_tension: one(20),
      d_rio10: one(5), viv_ociosas_50km: one(0),
    };
    const r = estimateCosts("ciudad_nueva", cols, 0, "Río Negro", { poblacion: 500_000, densidad: 75 }, UNIT_COSTS);
    expect(r.porHabitante[1]).toBeGreaterThan(10_000);
    expect(r.porHabitante[1]).toBeLessThan(60_000);
    expect(r.totalCapital[0]).toBeLessThanOrEqual(r.totalCapital[1]);
    expect(r.totalCapital[1]).toBeLessThanOrEqual(r.totalCapital[2]);
  });
});

describe("presupuesto de puntos", () => {
  it("reparto inicial suma 10 y los pesos suman 1 para cada instrumento y enfoque", async () => {
    const { defaultPoints, presetPoints, weightsFromPoints, PRESETS, BUDGET } = await import("./plain");
    for (const pol of POLICIES) {
      const base = pol.weights();
      const d = defaultPoints(base);
      expect(Object.values(d).reduce((a, b) => a + b, 0)).toBe(BUDGET);
      for (const pr of PRESETS) {
        const pts = presetPoints(pr.id, base);
        expect(Object.values(pts).reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(BUDGET);
        const w = weightsFromPoints(pts, base);
        expect(Object.values(w).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
      }
    }
  });
  it("el bloque fijo (agua, riesgos, clima) no cambia con los puntos", async () => {
    const { weightsFromPoints, defaultPoints } = await import("./plain");
    const base = POLICIES[0].weights();
    const pts = defaultPoints(base);
    const k = Object.keys(pts)[0];
    const w1 = weightsFromPoints(pts, base);
    const w2 = weightsFromPoints({ ...pts, [k]: 0 }, base);
    for (const id of ["F01", "F08", "F03"]) expect(w2[id]).toBeCloseTo(w1[id], 9);
  });
});

describe("costo-beneficio", () => {
  it("más población que llega ⇒ resultados más extremos; B/C finito", async () => {
    const { estimateCosts } = await import("./costs");
    const { UNIT_COSTS } = await import("./unitCostsData");
    const { costBenefit } = await import("./benefits");
    const { BENEFIT_PARAMS } = await import("./benefitParamsData");
    const one = (v: number) => Float32Array.from([v]);
    const c = {
      q_rio25: one(100), q95_rio25: one(30), aridez: one(0.2), prec: one(400), d_ruta: one(20), d_alta_tension: one(20),
      d_rio10: one(5), viv_ociosas_50km: one(0), pob_50km: one(100000), salario_rel: one(1),
    };
    const costos = estimateCosts("ciudad_nueva", c, 0, "Río Negro", { poblacion: 500_000, densidad: 75 }, UNIT_COSTS);
    const inp = { policy: "ciudad_nueva" as const, poblacion: 500_000, costos, c, i: 0, codProv: "62" };
    const o = costBenefit(inp, BENEFIT_PARAMS, "optimista");
    const p = costBenefit(inp, BENEFIT_PARAMS, "pesimista");
    expect(o.poblacionFinal).toBeGreaterThan(p.poblacionFinal);
    expect(Math.abs(o.social.van)).toBeGreaterThan(Math.abs(p.social.van) * 0.5);
    expect(Number.isFinite(o.social.bc)).toBe(true);
  });

  it("la brecha salarial cuenta solo en parte y los vecinos dan resultados parecidos", async () => {
    const { estimateCosts } = await import("./costs");
    const { UNIT_COSTS } = await import("./unitCostsData");
    const { costBenefit } = await import("./benefits");
    const { BENEFIT_PARAMS } = await import("./benefitParamsData");
    const one = (v: number) => Float32Array.from([v]);
    const c = {
      q_rio25: one(100), q95_rio25: one(30), aridez: one(0.2), prec: one(400), d_ruta: one(20), d_alta_tension: one(20),
      d_rio10: one(5), viv_ociosas_50km: one(0), pob_50km: one(100000), salario_rel: one(1),
    };
    const costos = estimateCosts("ciudad_nueva", c, 0, "Neuquén", { poblacion: 500_000, densidad: 75 }, UNIT_COSTS);
    const base = { policy: "ciudad_nueva" as const, poblacion: 500_000, costos, c, i: 0, codProv: "58", relAmba: 1.1 };
    const a = costBenefit({ ...base, relDest: 1.3 }, BENEFIT_PARAMS, "base");
    const b = costBenefit({ ...base, relDest: 1.32 }, BENEFIT_PARAMS, "base");
    expect(a.supuestos.brecha).toBeLessThan(1);
    expect(a.anual.productividad).toBeGreaterThan(0);
    expect(Math.abs(b.anual.productividad / a.anual.productividad - 1)).toBeLessThan(0.15);
  });

  it("el plazo de recupero es el año en que el saldo queda positivo para siempre", async () => {
    const { estimateCosts } = await import("./costs");
    const { UNIT_COSTS } = await import("./unitCostsData");
    const { costBenefit } = await import("./benefits");
    const { BENEFIT_PARAMS } = await import("./benefitParamsData");
    const one = (v: number) => Float32Array.from([v]);
    const c = {
      q_rio25: one(100), q95_rio25: one(30), aridez: one(0.2), prec: one(400), d_ruta: one(20), d_alta_tension: one(20),
      d_rio10: one(5), viv_ociosas_50km: one(0), pob_50km: one(100000), salario_rel: one(1),
    };
    const costos = estimateCosts("ciudad_nueva", c, 0, "Neuquén", { poblacion: 500_000, densidad: 75 }, UNIT_COSTS);
    const r = costBenefit({ policy: "ciudad_nueva", poblacion: 500_000, costos, c, i: 0, codProv: "58", relDest: 1.4, relAmba: 1.1 }, BENEFIT_PARAMS, "base");
    expect(r.social.recupero).not.toBeNull();
    expect(r.cronograma.length).toBe(r.horizonte + 1);
    const pobre = costBenefit({ policy: "ciudad_nueva", poblacion: 500_000, costos, c, i: 0, codProv: "58", relDest: 0.7, relAmba: 1.1 }, BENEFIT_PARAMS, "base");
    expect(pobre.social.recupero).toBeNull();
  });

  it("la edificación patagónica cuesta más que en la región pampeana", async () => {
    const { estimateCosts, coefRegional } = await import("./costs");
    const { UNIT_COSTS } = await import("./unitCostsData");
    const one = (v: number) => Float32Array.from([v]);
    const c = {
      q_rio25: one(100), q95_rio25: one(30), aridez: one(0.2), prec: one(900), d_ruta: one(20), d_alta_tension: one(20),
      d_rio10: one(5), viv_ociosas_50km: one(0), pob_50km: one(100000), salario_rel: one(1),
    };
    expect(coefRegional("Santa Cruz")).toBeGreaterThan(1.2);
    expect(coefRegional("Santa Fe")).toBe(1);
    const sc = estimateCosts("ciudad_nueva", c, 0, "Santa Cruz", { poblacion: 100_000, densidad: 75 }, UNIT_COSTS);
    const sf = estimateCosts("ciudad_nueva", c, 0, "Santa Fe", { poblacion: 100_000, densidad: 75 }, UNIT_COSTS);
    expect(sc.totalCapital[1]).toBeGreaterThan(sf.totalCapital[1] * 1.2);
    expect(sc.propio[1]).toBeGreaterThan(sf.propio[1]);
  });
});
