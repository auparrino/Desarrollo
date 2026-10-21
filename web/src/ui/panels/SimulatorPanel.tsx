import { useMemo, useState } from "react";
import type { Dataset } from "../../data/load";
import type { Site } from "../../model/sites";
import { concentracion, requerimientos, type SimParams } from "../../model/simulator";
import type { DepProps } from "./DiagnosticPanel";

interface Props {
  ds: Dataset;
  sites: Site[];
  deps: DepProps[];
}

const n0 = (v: number) => (Number.isFinite(v) ? v.toLocaleString("es-AR", { maximumFractionDigits: 0 }) : "—");
const n1 = (v: number) => (Number.isFinite(v) ? v.toLocaleString("es-AR", { maximumFractionDigits: 1 }) : "—");
const n2 = (v: number) => (Number.isFinite(v) ? v.toLocaleString("es-AR", { maximumFractionDigits: 2 }) : "—");

export default function SimulatorPanel(p: Props) {
  const [chosen, setChosen] = useState<number[]>([]);
  const [pob, setPob] = useState(500_000);
  const [s, setS] = useState<Omit<SimParams, "poblacionPorDestino">>({
    densidad: 75,
    dotacion: 200,
    personasPorVivienda: 2.8,
    consumoElectrico: 3000,
    origenAMBA: true,
  });
  const set = (patch: Partial<typeof s>) => setS((x) => ({ ...x, ...patch }));

  const climaRef = useMemo(() => {
    // media nacional de HDD18 + 1,5·CDD18 ponderada por población
    const { hdd18, cdd18, pob } = p.ds.col;
    let a = 0, w = 0;
    for (let i = 0; i < p.ds.n; i++) {
      if (Number.isFinite(hdd18[i])) { a += pob[i] * (hdd18[i] + 1.5 * cdd18[i]); w += pob[i]; }
    }
    return a / w;
  }, [p.ds]);

  const sel = p.sites.filter((x) => chosen.includes(x.rank));
  const res = sel.map((site) =>
    requerimientos(
      {
        nombre: `${site.departamento}, ${site.provincia}`,
        provincia: site.provincia,
        hdd: p.ds.col.hdd18[site.best],
        cdd: p.ds.col.cdd18[site.best],
        qRio: p.ds.col.q_rio25[site.best],
      },
      pob,
      { ...s, poblacionPorDestino: [] },
      climaRef,
    ),
  );
  const conc = useMemo(
    () =>
      concentracion(
        p.deps.map((d) => ({ cod: d.cod_dep, provincia: d.provincia, pob: d.pob2022 ?? 0 })),
        res.map((r) => ({ provincia: r.provincia, poblacion: r.poblacion })),
        s.origenAMBA,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.deps, chosen.join(","), pob, s.origenAMBA, p.sites],
  );
  const total = res.reduce((a, r) => a + r.poblacion, 0);
  const crecPorAnio = useMemo(() => {
    const t10 = p.deps.reduce((a, d) => a + (d.pob2010 ?? 0), 0);
    const t22 = p.deps.reduce((a, d) => a + (d.pob2022 ?? 0), 0);
    return (t22 - t10) / 12;
  }, [p.deps]);

  return (
    <div className="panel">
      <section>
        <h3>Simulador de redistribución</h3>
        <p className="muted small">
          Elegí regiones candidatas (pestaña Sitios) y asigná población. Las cifras son derivaciones aritméticas de los
          parámetros, no proyecciones; sirven para dimensionar órdenes de magnitud.
        </p>
        <div className="checklist">
          {p.sites.slice(0, 12).map((x) => (
            <label key={x.rank} className="check">
              <input
                type="checkbox"
                checked={chosen.includes(x.rank)}
                onChange={(e) => setChosen((c) => (e.target.checked ? [...c, x.rank] : c.filter((r) => r !== x.rank)))}
              />
              {x.rank}. {x.departamento}, {x.provincia}
            </label>
          ))}
          {!p.sites.length && <p className="muted">Primero calculá la aptitud y las regiones candidatas.</p>}
        </div>
        <div className="grid2">
          <label>
            Habitantes por destino
            <input type="number" step={50000} value={pob} onChange={(e) => setPob(Number(e.target.value))} />
          </label>
          <label>
            Densidad bruta (hab/ha)
            <input type="number" step={5} value={s.densidad} onChange={(e) => set({ densidad: Number(e.target.value) })} />
          </label>
          <label>
            Dotación de agua (L/hab/día)
            <input type="number" step={10} value={s.dotacion} onChange={(e) => set({ dotacion: Number(e.target.value) })} />
          </label>
          <label>
            Personas por vivienda
            <input type="number" step={0.1} value={s.personasPorVivienda} onChange={(e) => set({ personasPorVivienda: Number(e.target.value) })} />
          </label>
          <label>
            Electricidad (kWh/hab/año)
            <input type="number" step={100} value={s.consumoElectrico} onChange={(e) => set({ consumoElectrico: Number(e.target.value) })} />
          </label>
          <label className="check">
            <input type="checkbox" checked={s.origenAMBA} onChange={(e) => set({ origenAMBA: e.target.checked })} />
            La población proviene del AMBA
          </label>
        </div>
        <p className="muted small">
          Dotación 200 L/hab/día y densidad 60–90 hab/ha según la revisión (§R13, §R14). Personas por vivienda y consumo
          eléctrico son valores de referencia editables: conviene ajustarlos con INDEC (hogares, Censo 2022) y CAMMESA
          (demanda por provincia).
        </p>
      </section>

      {res.length > 0 && (
        <section>
          <h3>Requerimientos por destino</h3>
          <div className="table-wrap">
            <table className="provs">
              <thead>
                <tr>
                  <th>Destino</th><th>Suelo km²</th><th>Agua m³/s</th><th>% caudal río</th><th>Viviendas</th>
                  <th>GWh/año</th><th>Índice climático</th>
                </tr>
              </thead>
              <tbody>
                {res.map((r) => (
                  <tr key={r.nombre}>
                    <td>{r.nombre}</td>
                    <td className="num">{n0(r.superficieKm2)}</td>
                    <td className="num">{n2(r.aguaM3s)}</td>
                    <td className="num">{Number.isFinite(r.usoCaudalPct) ? `${n1(r.usoCaudalPct)} %` : "sin río"}</td>
                    <td className="num">{n0(r.viviendas)}</td>
                    <td className="num">{n0(r.energiaGWh)}</td>
                    <td className="num">{n2(r.indiceClimatico)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted small">
            Índice climático: (HDD18 + 1,5·CDD18) del destino sobre la media nacional ponderada por población. Si es mayor
            que 1, la demanda de climatización es mayor que la de un habitante promedio.
          </p>
        </section>
      )}

      {res.length > 0 && (
        <section>
          <h3>Efecto sobre la concentración</h3>
          <div className="tiles">
            <div className="tile">
              <span className="muted small">Población trasladada</span>
              <b>{n0(total)}</b>
            </div>
            <div className="tile">
              <span className="muted small">Participación AMBA</span>
              <b>{n1(100 * conc.despues.participacionAMBA)} %</b>
              <span className="muted small">hoy {n1(100 * conc.antes.participacionAMBA)} %</span>
            </div>
            <div className="tile">
              <span className="muted small">HHI provincial</span>
              <b>{n2(conc.despues.hhiProvincial)}</b>
              <span className="muted small">hoy {n2(conc.antes.hhiProvincial)}</span>
            </div>
          </div>
          <p className="muted small">
            HHI: suma de cuadrados de las participaciones provinciales; 1 indica toda la población en una provincia. Como
            referencia, el país sumó ≈{n0(crecPorAnio)} habitantes por año entre los censos 2010 y 2022: el traslado
            simulado equivale a {n1(total / crecPorAnio)} años de crecimiento demográfico total.
          </p>
        </section>
      )}
    </div>
  );
}
