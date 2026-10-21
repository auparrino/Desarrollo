// Sensibilidad de pesos por Monte Carlo: pesos ~ Dirichlet(κ·w) alrededor del escenario
// elegido; para cada muestra se identifica el decil (o fracción) superior de celdas aptas.
// Resultado: probabilidad de que cada celda quede en el grupo superior
// (Chen, Yu & Khan 2010; Ligmann-Zielinska & Jankowski 2014).

export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(rng: () => number): number {
  let u = 0;
  while (u === 0) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

/** Gamma(shape, 1) por Marsaglia & Tsang (2000). */
export function gamma(shape: number, rng: () => number): number {
  if (shape < 1) return gamma(shape + 1, rng) * Math.pow(rng(), 1 / shape);
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number, v: number;
    do {
      x = normal(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

export function dirichlet(alpha: number[], rng: () => number): number[] {
  const g = alpha.map((a) => gamma(Math.max(a, 1e-3), rng));
  const s = g.reduce((a, b) => a + b, 0);
  return g.map((x) => x / s);
}

export interface MCInput {
  scores: Float32Array[]; // un arreglo por factor, mismo orden que `weights`
  weights: number[];
  eligible: Uint8Array; // 1 = apta
  kappa: number;
  samples: number;
  topFrac: number;
  seed: number;
}

/** Devuelve la probabilidad (0–1) de cada celda de quedar en el `topFrac` superior. */
export function runMonteCarlo(inp: MCInput, onProgress?: (p: number) => void): Float32Array {
  const { scores, weights, eligible, kappa, samples, topFrac } = inp;
  const n = eligible.length;
  const k = weights.length;
  const rng = mulberry32(inp.seed);
  const idx: number[] = [];
  for (let i = 0; i < n; i++) if (eligible[i]) idx.push(i);
  const m = idx.length;
  const count = new Uint32Array(n);
  const s = new Float32Array(m);
  const BINS = 2048;
  const hist = new Uint32Array(BINS);
  const alpha = weights.map((w) => kappa * w);
  for (let t = 0; t < samples; t++) {
    const w = dirichlet(alpha, rng);
    hist.fill(0);
    for (let j = 0; j < m; j++) {
      const i = idx[j];
      let v = 0;
      let ws = 0;
      for (let f = 0; f < k; f++) {
        const x = scores[f][i];
        if (x === x) {
          v += w[f] * x;
          ws += w[f];
        }
      }
      const val = ws > 0 ? v / ws : 0;
      s[j] = val;
      hist[Math.min(BINS - 1, (val * BINS) | 0)]++;
    }
    // umbral del topFrac superior por histograma
    const target = Math.max(1, Math.round(m * topFrac));
    let acc = 0;
    let b = BINS - 1;
    for (; b >= 0; b--) {
      acc += hist[b];
      if (acc >= target) break;
    }
    const thr = b / BINS;
    for (let j = 0; j < m; j++) if (s[j] >= thr) count[idx[j]]++;
    if (onProgress && t % 25 === 0) onProgress(t / samples);
  }
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = eligible[i] ? count[i] / samples : NaN;
  return out;
}
