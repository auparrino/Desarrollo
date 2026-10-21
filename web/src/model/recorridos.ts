// Recorridos de ciudades nuevas y polos que funcionaron (web/src/model/trayectorias_*.json):
// cómo creció cada una año a año desde que se decidió, y qué haría falta para que un lugar
// argentino siga el mismo recorrido (llegadas por año, empleos a crear, viviendas).
//
// La población de cada caso se interpola en escala logarítmica entre censos. "Seguir el
// recorrido" significa sumar cada año las mismas personas que sumó el caso en su mismo año de
// vida (en números absolutos), partiendo de la población que el lugar ya tiene.

import ar from "./trayectorias_ar.json";
import int from "./trayectorias_int.json";

interface Punto { anio: number | null; pob?: number | null }
interface CasoJSON {
  id: string; nombre: string; pais: string; tipo: string; t0: number; poblacion: Punto[]; lecciones?: string[]; secuencia?: string[];
  contexto_nacional?: { urbanizacion_pct?: number | null };
}

export interface Recorrido {
  id: string;
  nombre: string;
  pais: string;
  tipo: string;
  t0: number;
  /** población por año de vida (índice 0 = año de la decisión) */
  serie: number[];
  /** años cubiertos por datos (desde t0) */
  hasta: number;
  urbanizado: boolean; // país con más del 70 % de población urbana al empezar (comparable con la Argentina)
  secuencia: string[];
  lecciones: string[];
}

const URBANIZADOS = new Set(["Argentina", "Reino Unido", "Australia", "Corea del Sur"]);

function serieLog(pts: { anio: number; pob: number }[], t0: number, H: number): number[] {
  const s = pts.filter((p) => p.anio >= t0 - 10).sort((a, b) => a.anio - b.anio);
  const out: number[] = [];
  for (let k = 0; k <= H; k++) {
    const y = t0 + k;
    const j = s.findIndex((p) => p.anio >= y);
    if (j === -1) { out.push(s[s.length - 1].pob); continue; }
    if (s[j].anio === y) { out.push(s[j].pob); continue; }
    if (j === 0) {
      // antes del primer dato se supone que ya vivía esa población (estimación conservadora)
      out.push(s[0].pob);
      continue;
    }
    const a = s[j - 1], b = s[j];
    const f = (y - a.anio) / (b.anio - a.anio);
    out.push(Math.exp(Math.log(Math.max(a.pob, 1)) * (1 - f) + Math.log(Math.max(b.pob, 1)) * f));
  }
  return out;
}

function armar(c: CasoJSON): Recorrido | null {
  const pts = (c.poblacion ?? []).filter((p): p is { anio: number; pob: number } => Number.isFinite(p.anio) && Number.isFinite(p.pob ?? NaN) && (p.pob ?? 0) > 0);
  // si hay dos datos del mismo año (ciudad y área metropolitana), se queda con el menor (ciudad)
  const porAnio = new Map<number, number>();
  for (const p of pts) porAnio.set(p.anio, Math.min(porAnio.get(p.anio) ?? Infinity, p.pob));
  const limpio = [...porAnio.entries()].map(([anio, pob]) => ({ anio, pob }));
  if (limpio.length < 3) return null;
  // sin datos en los primeros 10 años no se puede reconstruir el recorrido
  if (Math.min(...limpio.map((p) => p.anio)) > c.t0 + 10) return null;
  const fin = Math.max(...limpio.map((p) => p.anio));
  const H = Math.min(60, fin - c.t0);
  if (H < 10) return null;
  return {
    id: c.id, nombre: c.nombre, pais: c.pais, tipo: c.tipo, t0: c.t0, serie: serieLog(limpio, c.t0, H), hasta: H,
    urbanizado: c.pais === "Argentina" || (c.contexto_nacional?.urbanizacion_pct ?? (URBANIZADOS.has(c.pais) ? 80 : 0)) >= 70, secuencia: c.secuencia ?? [], lecciones: c.lecciones ?? [],
  };
}

export const RECORRIDOS: Recorrido[] = [...((ar as { casos: CasoJSON[] }).casos ?? []), ...((int as { casos: CasoJSON[] }).casos ?? [])]
  .map(armar)
  .filter((x): x is Recorrido => x !== null);

export interface Emulacion {
  recorrido: Recorrido;
  pob: number[]; // población del lugar año por año (0..H)
  llegadasPico: number; // personas netas por año en el año de más llegada
  anioPico: number;
  empleosPico: number; // empleos nuevos por año que hacen falta en ese año
  motorPico: number; // de esos, cuántos tendría que crear un motor (el resto lo genera el multiplicador)
  viviendasPico: number;
  vecesRecordAR: number; // llegadas pico / mayor saldo migratorio observado en la Argentina
  pctMigrantesNac: number; // llegadas pico / migrantes interprovinciales por año
}

const RECORD_AR = 2883; // Pilar 2005–2010, saldo migratorio neto por año (docs/migracion-interna.md)
const MIGRANTES_AR = 150_081; // cambios de provincia por año (Censo 2022)

/** Qué haría falta para que un lugar con `pob0` habitantes siga el recorrido de `r` durante `H` años. */
export function emular(r: Recorrido, pob0: number, H = 30, multiplicador = 1, vegetativo = 0.01): Emulacion {
  const pob = [pob0];
  let pico = 0, anioPico = 0;
  for (let k = 1; k <= H; k++) {
    const d = (r.serie[Math.min(k, r.hasta)] ?? 0) - (r.serie[Math.min(k - 1, r.hasta)] ?? 0);
    const p = pob[k - 1] + Math.max(0, d);
    pob.push(p);
    const llegadas = Math.max(0, d - pob[k - 1] * vegetativo);
    if (llegadas > pico) { pico = llegadas; anioPico = k; }
  }
  const empleosPico = pico * 0.45;
  return {
    recorrido: r, pob, llegadasPico: pico, anioPico, empleosPico, motorPico: empleosPico / (1 + multiplicador),
    viviendasPico: pico / 2.86, vecesRecordAR: pico / RECORD_AR, pctMigrantesNac: (100 * pico) / MIGRANTES_AR,
  };
}
