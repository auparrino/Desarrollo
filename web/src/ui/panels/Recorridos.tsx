// Gráfico: la trayectoria simulada del lugar junto a los recorridos reales de ciudades que funcionaron.

import { RECORRIDOS, emular } from "../../model/recorridos";

const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");
const H = 30;

export default function Recorridos({ plan, etiqueta = "Este lugar" }: { plan?: number[]; etiqueta?: string }) {
  const refs = RECORRIDOS.filter((r) => r.urbanizado && r.hasta >= 15).map((r) => ({ r, e: emular(r, 0, H, 1.6) }));
  const W = 620, Hh = 250, ml = 52, mr = 150, mt = 10, mb = 28;
  const ymax = Math.max(...refs.map((x) => x.e.pob[H] ?? 0), ...(plan ?? [0])) * 1.05;
  const px = (t: number) => ml + (t / H) * (W - ml - mr);
  const py = (v: number) => mt + (1 - v / ymax) * (Hh - mt - mb);
  const path = (s: number[], hasta = H) => s.slice(0, Math.min(H, hasta) + 1).map((v, t) => `${t ? "L" : "M"}${px(t).toFixed(1)},${py(v).toFixed(1)}`).join("");
  // etiquetas al final de cada línea, separadas para que no se pisen
  const corto = (n: string) => {
    const t = n.split(/[(:]/)[0].trim();
    return t.length > 18 ? t.split(" ")[0] : t;
  };
  const labels = [...refs.map((x) => ({ txt: corto(x.r.nombre), y: py(x.e.pob[Math.min(H, x.r.hasta)]), x: px(Math.min(H, x.r.hasta)), plan: false })), ...(plan ? [{ txt: etiqueta, y: py(plan[Math.min(H, plan.length - 1)]), x: px(H), plan: true }] : [])]
    .sort((a, b) => a.y - b.y);
  for (let k = 1; k < labels.length; k++) if (labels[k].y - labels[k - 1].y < 11) labels[k].y = labels[k - 1].y + 11;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * ymax);
  return (
    <figure className="recorridos">
      <svg viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label="Población sumada por año: este lugar y recorridos reales">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={ml} x2={W - mr} y1={py(v)} y2={py(v)} className="grid" />
            <text x={ml - 6} y={py(v) + 3} className="tick" textAnchor="end">{v >= 1000 ? `${n0(v / 1000)} mil` : n0(v)}</text>
          </g>
        ))}
        {[0, 10, 20, 30].map((t) => <text key={t} x={px(t)} y={Hh - 8} className="tick" textAnchor="middle">año {t}</text>)}
        {refs.map((x) => (
          <path key={x.r.id} d={path(x.e.pob, x.r.hasta)} className="ref">
            <title>{`${x.r.nombre}: ${n0(x.e.pob[H])} personas sumadas en 30 años; llegada máxima ${n0(x.e.llegadasPico)} por año`}</title>
          </path>
        ))}
        {plan && <path d={path(plan)} className="plan"><title>{`${etiqueta}: ${n0(plan[Math.min(H, plan.length - 1)])} personas en 30 años`}</title></path>}
        {labels.map((l) => (
          <text key={l.txt} x={l.x + 6} y={l.y + 3} className={l.plan ? "lbl plan-lbl" : "lbl"}>{l.txt}</text>
        ))}
      </svg>
      <figcaption className="small muted">
        Personas sumadas desde el inicio. Líneas grises: ciudades y polos que funcionaron en países urbanizados, desde que se
        decidieron (censos; docs/recorridos-exitosos.md); cada una termina donde terminan sus datos. {plan ? " Línea azul: este lugar con el proceso recomendado." : ""} Pasá el mouse por una línea para ver el detalle.
      </figcaption>
    </figure>
  );
}

/** Lista de recorridos con qué se hizo primero y qué enseñan. */
export function RecorridosLista({ soloComparables = true }: { soloComparables?: boolean }) {
  const lista = RECORRIDOS.filter((r) => !soloComparables || r.urbanizado);
  return (
    <ul className="recorridos-lista">
      {lista.map((r) => {
        const e = emular(r, 0, Math.min(30, r.hasta));
        return (
          <li key={r.id}>
            <details>
              <summary>
                <b>{r.nombre.split(/[(:]/)[0].trim()}</b> <span className="muted small">{r.pais}, desde {r.t0}</span>
                <span className="small"> · {n0(e.pob[e.pob.length - 1])} personas sumadas en {Math.min(30, r.hasta)} años · hasta {n0(e.llegadasPico)} por año</span>
              </summary>
              {r.secuencia.length > 0 && (
                <>
                  <p className="small"><b>Qué se hizo, en orden</b></p>
                  <ol className="small">{r.secuencia.slice(0, 6).map((x) => <li key={x}>{x}</li>)}</ol>
                </>
              )}
              {r.lecciones.length > 0 && (
                <>
                  <p className="small"><b>Qué enseña</b></p>
                  <ul className="small facts">{r.lecciones.slice(0, 3).map((x) => <li key={x}>{x}</li>)}</ul>
                </>
              )}
            </details>
          </li>
        );
      })}
    </ul>
  );
}
