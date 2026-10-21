// Funciones de valor: transforman una variable física en un puntaje de aptitud 0–1
// con umbrales absolutos (no min–max del área de estudio), como recomienda la
// literatura MCDA-SIG (Malczewski 2006; Beinat 1997). Ver docs/revision-bibliografica.md §2.

export type ValueFn =
  | { kind: "increasing"; a: number; b: number; log?: boolean }
  | { kind: "decreasing"; a: number; b: number; log?: boolean }
  | { kind: "trapezoid"; a: number; b: number; c: number; d: number; fa?: number }
  | { kind: "piecewise"; points: [number, number][] };

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function ramp(x: number, a: number, b: number, log?: boolean): number {
  if (log) {
    x = Math.log10(Math.max(x, 1e-9));
    a = Math.log10(a);
    b = Math.log10(b);
  }
  return clamp01((x - a) / (b - a));
}

export function evaluate(fn: ValueFn, x: number): number {
  if (!Number.isFinite(x)) return NaN;
  switch (fn.kind) {
    case "increasing":
      return ramp(x, fn.a, fn.b, fn.log);
    case "decreasing":
      return 1 - ramp(x, fn.a, fn.b, fn.log);
    case "trapezoid": {
      // sube de fa (en x<=a) a 1 entre a y b, meseta b–c, baja a 0 entre c y d
      const fa = fn.fa ?? 0;
      if (x <= fn.a) return fa;
      if (x < fn.b) return fa + (1 - fa) * ((x - fn.a) / (fn.b - fn.a));
      if (x <= fn.c) return 1;
      if (x < fn.d) return (fn.d - x) / (fn.d - fn.c);
      return 0;
    }
    case "piecewise": {
      const p = fn.points;
      if (x <= p[0][0]) return p[0][1];
      for (let i = 1; i < p.length; i++) {
        if (x <= p[i][0]) {
          const [x0, y0] = p[i - 1];
          const [x1, y1] = p[i];
          return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
        }
      }
      return p[p.length - 1][1];
    }
  }
}

export function describe(fn: ValueFn, unit: string): string {
  const u = unit ? ` ${unit}` : "";
  switch (fn.kind) {
    case "increasing":
      return `0 en ≤${fn.a}${u} → 1 en ≥${fn.b}${u}${fn.log ? " (escala log)" : ""}`;
    case "decreasing":
      return `1 en ≤${fn.a}${u} → 0 en ≥${fn.b}${u}${fn.log ? " (escala log)" : ""}`;
    case "trapezoid":
      return `óptimo entre ${fn.b} y ${fn.c}${u}; 0 en ≥${fn.d}${u}; ${fn.fa ?? 0} en ≤${fn.a}${u}`;
    case "piecewise":
      return fn.points.map(([x, y]) => `${x}${u}→${y}`).join(", ");
  }
}
