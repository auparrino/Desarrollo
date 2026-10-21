// Datos de una zona contados en lenguaje cotidiano.

import type { Dataset } from "../data/load";

const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");

export function nearestPlace(
  loc: GeoJSON.FeatureCollection | undefined,
  lon: number,
  lat: number,
): { nombre: string; km: number } | null {
  if (!loc) return null;
  let best: GeoJSON.Feature | null = null;
  let bd = Infinity;
  const k = Math.cos((lat * Math.PI) / 180);
  for (const f of loc.features) {
    const [x, y] = (f.geometry as GeoJSON.Point).coordinates;
    const d = ((x - lon) * k) ** 2 + (y - lat) ** 2;
    if (d < bd) {
      bd = d;
      best = f;
    }
  }
  return best ? { nombre: String(best.properties?.nombre ?? ""), km: Math.sqrt(bd) * 111 } : null;
}

export function lluvia(mm: number): string {
  if (mm < 250) return "muy seco";
  if (mm < 500) return "seco";
  if (mm < 900) return "intermedio";
  return "húmedo";
}

export function sismo(g: number): string {
  if (g < 0.05) return "muy bajo";
  if (g < 0.15) return "bajo";
  if (g < 0.3) return "medio";
  return "alto";
}

export interface Fact {
  icono: string;
  texto: string;
}

export function facts(ds: Dataset, i: number): Fact[] {
  const c = ds.col;
  const q = c.q_rio25[i];
  return [
    {
      icono: "🌡️",
      texto: `Temperatura media de ${n0(c.t_media[i])} °C: en verano llega a ${n0(c.t_max_cal[i])} °C y en invierno baja a ${n0(c.t_min_fri[i])} °C.`,
    },
    { icono: "🌧️", texto: `Llueven ${n0(c.prec[i])} mm por año (clima ${lluvia(c.prec[i])}).` },
    {
      icono: "💧",
      texto: q >= 50
        ? `Hay un río grande cerca (caudal medio estimado: ${n0(q)} m³/s).`
        : q >= 5
          ? `Hay un río mediano cerca (≈${n0(q)} m³/s).`
          : "No hay ríos importantes a menos de 25 km.",
    },
    { icono: "🏙️", texto: `Está a ${n0(c.t_ciudad[i])} minutos de una ciudad de más de 50.000 habitantes.` },
    { icono: "🏥", texto: `El centro de salud más cercano está a ${n0(c.t_salud[i])} minutos en vehículo.` },
    { icono: "🌎", texto: `Peligro de terremotos ${sismo(c.pga475[i])}.` },
    { icono: "👥", texto: `Hoy viven unas ${n0(c.pob_50km[i])} personas en un radio de 50 km.` },
    { icono: "📍", texto: `Está a ${n0(c.d_amba[i])} km de Buenos Aires.` },
  ];
}
