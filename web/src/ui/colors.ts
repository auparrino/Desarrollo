// Rampas de color (paleta de referencia validada del skill de visualización).
// Secuencial = un solo matiz (azul) de claro a oscuro; divergente = azul ↔ rojo con gris neutro.

export type RGB = [number, number, number];

const hex = (h: string): RGB => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)) as RGB;

export const SEQ_BLUE = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"].map(hex);
export const SEQ_ORANGE = ["#fde0cf", "#f8b896", "#f2905e", "#eb6834", "#c4501f", "#933a14", "#64270c"].map(hex);
export const DIV_RED_BLUE = ["#8a1f1f", "#b8302f", "#e34948", "#ec8f87", "#f0efec", "#86b6ef", "#3987e5", "#1c5cab", "#0d366b"].map(hex);
export const EXCLUDED: RGB = [137, 135, 129];

export function ramp(stops: RGB[], t: number): RGB {
  if (!Number.isFinite(t)) return EXCLUDED;
  t = Math.min(1, Math.max(0, t));
  const x = t * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

export const css = (c: RGB) => `rgb(${c.map(Math.round).join(",")})`;
export const gradientCss = (stops: RGB[]) => `linear-gradient(90deg, ${stops.map(css).join(", ")})`;
