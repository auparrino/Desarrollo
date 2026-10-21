// Utilidades geográficas de la interfaz.

/** Centro aproximado de cada provincia (centro del polígono más grande), más el AMBA y el resto de Buenos Aires. */
export function centrosProvincia(prov?: GeoJSON.FeatureCollection): Map<string, [number, number]> {
  const m = new Map<string, [number, number]>();
  for (const f of prov?.features ?? []) {
    const g = f.geometry;
    const polys = g?.type === "MultiPolygon" ? g.coordinates : g?.type === "Polygon" ? [g.coordinates] : [];
    let best: number[][] = [];
    for (const poly of polys) if (poly[0].length > best.length && poly[0][0][1] > -56) best = poly[0];
    if (!best.length) continue;
    const xs = best.map((p) => p[0]), ys = best.map((p) => p[1]);
    m.set(String(f.properties?.provincia ?? f.properties?.nombre ?? ""), [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2]);
  }
  m.set("AMBA", [-58.45, -34.62]);
  if (m.has("Buenos Aires")) m.set("Resto de Buenos Aires", [-61.0, -36.6]);
  return m;
}

export interface Flujo { lugar: string; pct: number; desde: [number, number]; hasta: [number, number] }

/** Curva suave entre dos puntos (bezier cuadrática), como LineString. */
export function curva(a: [number, number], b: [number, number], n = 24): [number, number][] {
  const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.18, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.18;
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n;
    return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
  });
}
