// Simulador de procesos (modo experto): elegir lugar, estrategia y parámetros inciertos, y ver la
// trayectoria año por año frente a los recorridos reales (web/src/model/proceso.ts).

import { useMemo, useState } from "react";
import type { Dataset } from "../../data/load";
import { musd } from "../../model/brief";
import type { Policy } from "../../model/policies";
import { INCIERTOS_CENTRAL, simular, type Inciertos } from "../../model/proceso";
import type { Site } from "../../model/sites";
import { evaluarSitio, siteName, uniqueByPlace } from "../evaluar";
import Recorridos from "./Recorridos";

interface Props {
  ds: Dataset;
  sites: Site[];
  policy: Policy;
  poblacion: number;
  localidades?: GeoJSON.FeatureCollection;
}

const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");

export default function ProcesoPanel(p: Props) {
  const lista = useMemo(() => uniqueByPlace(p.sites, p.localidades).slice(0, 12), [p.sites, p.localidades]);
  const [k, setK] = useState(0);
  const s = lista[Math.min(k, lista.length - 1)];
  const ev = useMemo(() => (s ? evaluarSitio(p.ds, s, siteName(s, p.localidades), k + 1, p.policy.id, p.poblacion) : null), [p.ds, s, p.localidades, k, p.policy.id, p.poblacion]);
  const [estId, setEstId] = useState<string | null>(null);
  const [u, setU] = useState<Inciertos>(INCIERTOS_CENTRAL);
  if (!ev) return <div className="panel"><p>No hay lugares aptos con estas condiciones.</p></div>;
  const est = ev.cmp.rs.find((x) => x.estrategia.id === estId)?.estrategia ?? ev.elegido.estrategia;
  const r = simular(ev.cmp.ctx, est, u);
  const at = (t: number) => r.serie[t - 1];
  const slider = (key: keyof Inciertos, nombre: string, min: number, max: number, step: number, fmt: (v: number) => string) => (
    <label className="slider">
      <span>{nombre}: <b>{fmt(u[key])}</b></span>
      <input type="range" min={min} max={max} step={step} value={u[key]} onChange={(e) => setU({ ...u, [key]: Number(e.target.value) })} />
    </label>
  );
  return (
    <div className="panel">
      <section>
        <h3>Simulador de procesos</h3>
        <p className="muted small">
          Año por año: empleo (crecimiento de la zona, motor y multiplicador, construcción, servicios), vivienda según la regla de la
          estrategia, llegadas limitadas por los flujos migratorios hacia la provincia, salidas y nacimientos. Supuestos en
          docs/simulaciones-procesos.md.
        </p>
        <label>Lugar{" "}
          <select value={k} onChange={(e) => { setK(Number(e.target.value)); setEstId(null); }}>
            {lista.map((x, j) => <option key={x.rank} value={j}>{siteName(x, p.localidades)} ({x.provincia})</option>)}
          </select>
        </label>{" "}
        <label>Estrategia{" "}
          <select value={est.id} onChange={(e) => setEstId(e.target.value)}>
            {ev.cmp.rs.map((x) => <option key={x.estrategia.id} value={x.estrategia.id}>{x.estrategia.nombre}{x === ev.elegido ? " (recomendada)" : ""}</option>)}
          </select>
        </label>
        <p className="small">{est.descripcion}</p>
        <div className="sliders">
          {slider("multiplicador", "Empleos locales por empleo del motor", 0.5, 3, 0.1, (v) => v.toLocaleString("es-AR", { maximumFractionDigits: 1 }))}
          {slider("captacion", "Parte de quienes se mudan a la provincia que elige este lugar", 0.01, 0.15, 0.01, (v) => `${Math.round(v * 100)} %`)}
          {slider("salidaDesocupados", "Recién llegados sin trabajo que se van por año", 0.1, 0.5, 0.05, (v) => `${Math.round(v * 100)} %`)}
          {slider("vegetativo", "Crecimiento vegetativo", 0.004, 0.02, 0.001, (v) => `${(v * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 })} %`)}
          <button className="link" onClick={() => setU(INCIERTOS_CENTRAL)}>Volver a los valores centrales</button>
        </div>
        <Recorridos plan={[0, ...r.serie.map((x) => x.pob)]} etiqueta={ev.nombre.replace(/^Cerca de /, "")} />
        <div className="tiles">
          <div className="tile"><span className="small">Habitantes al año 30</span><b>{n0(r.pob30)}</b></div>
          <div className="tile"><span className="small">Viviendas vacías (máximo)</span><b>{Math.round(r.vaciasMax * 100)} %</b></div>
          <div className="tile"><span className="small">Saldo para el país</span><b className={r.van >= 0 ? "pos" : "neg"}>{musd(r.van)}</b></div>
          <div className="tile"><span className="small">Inversión total</span><b>{musd(r.inversion)}</b></div>
        </div>
        <table className="provs small">
          <thead><tr><th>Año</th><th className="num">Habitantes</th><th className="num">Viviendas</th><th className="num">Empleos para los que llegan</th><th className="num">Llegan</th><th className="num">Se van</th></tr></thead>
          <tbody>
            {[3, 5, 10, 15, 20, 30].map((t) => at(t) && (
              <tr key={t}><td>{t}</td><td className="num">{n0(at(t).pob)}</td><td className="num">{n0(at(t).viviendas)}</td><td className="num">{n0(at(t).empleos)}</td><td className="num">{n0(at(t).llegan)}</td><td className="num">{n0(at(t).seVan)}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="muted small">
          Hacia {s.provincia} se mudan unas {n0(ev.cmp.ctx.poolAnual)} personas por año; hoy hay {n0(ev.cmp.merc.puestos)} puestos privados en la
          zona. La ficha del lugar muestra las {ev.cmp.rs.length} estrategias simuladas {250} veces cada una.
        </p>
      </section>
    </div>
  );
}
