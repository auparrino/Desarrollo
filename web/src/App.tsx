import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadDataset, loadJSON, type Dataset } from "./data/load";
import { RESTRICTIONS, SCENARIOS, effectiveWeights, type Restriction, type Weights } from "./model/criteria";
import { DEFAULT_WATER, aggregate, computeMask, factorScores, quantile, type Aggregation, type WaterParams } from "./model/mcda";
import { findSites, type Site, type SiteParams } from "./model/sites";
import type { ValueFn } from "./model/valueFunctions";
import MapView, { type Overlays } from "./ui/MapView";
import CriteriaPanel from "./ui/panels/CriteriaPanel";
import SitesPanel from "./ui/panels/SitesPanel";
import CellDetail from "./ui/panels/CellDetail";
import DiagnosticPanel, { METRICS, type DepMetric, type DepProps } from "./ui/panels/DiagnosticPanel";
import SimulatorPanel from "./ui/panels/SimulatorPanel";
import MethodPanel from "./ui/panels/MethodPanel";
import { DIV_RED_BLUE, EXCLUDED, SEQ_BLUE, SEQ_ORANGE, css, gradientCss, ramp, type RGB } from "./ui/colors";
import { VARIABLES, VAR_BY_ID, fmtVar } from "./ui/variables";

type Tab = "aptitud" | "sitios" | "diagnostico" | "simulador" | "metodo";
type View = "aptitud" | "robustez" | "exclusion" | "variable";

const TABS: { id: Tab; nombre: string }[] = [
  { id: "aptitud", nombre: "Criterios" },
  { id: "sitios", nombre: "Sitios" },
  { id: "simulador", nombre: "Simulador" },
  { id: "diagnostico", nombre: "Diagnóstico" },
  { id: "metodo", nombre: "Método" },
];

// Paleta categórica de referencia (orden fijo) para los motivos de exclusión.
const CAT: RGB[] = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"].map(
  (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)) as RGB,
);

const GEO_FILES = {
  provincias: "provincias.geojson",
  departamentos: "departamentos.geojson",
  rutas: "capas/rutas.geojson",
  ferrocarril: "capas/ferrocarril.geojson",
  alta_tension: "capas/alta_tension.geojson",
  rios: "capas/rios.geojson",
  areas_protegidas: "capas/areas_protegidas.geojson",
};

function useDark() {
  const q = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const [dark, setDark] = useState(q?.matches ?? false);
  useEffect(() => {
    if (!q) return;
    const f = (e: MediaQueryListEvent) => setDark(e.matches);
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, [q]);
  return dark;
}

export default function App() {
  const dark = useDark();
  const [ds, setDs] = useState<Dataset | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [geo, setGeo] = useState<Record<string, GeoJSON.FeatureCollection | undefined>>({});
  const [tab, setTab] = useState<Tab>("aptitud");
  const [view, setView] = useState<View>("aptitud");
  const [variable, setVariable] = useState("pob");
  const [overlays, setOverlays] = useState<Overlays>({
    provincias: true, rutas: false, ferrocarril: false, alta_tension: false, rios: false, areas_protegidas: false,
  });

  const [scenario, setScenario] = useState("E1");
  const [weights, setWeights] = useState<Weights>(() => SCENARIOS[0].weights());
  const [fns, setFns] = useState<Record<string, ValueFn>>({});
  const [restrictions, setRestrictions] = useState<Restriction[]>(() => RESTRICTIONS.map((r) => ({ ...r })));
  const [water, setWaterState] = useState<WaterParams>(DEFAULT_WATER);
  const [agg, setAgg] = useState<Aggregation>({ method: "wlc" });
  const [siteParams, setSiteParamsState] = useState<SiteParams>({ topFrac: 0.02, poblacion: 500_000, densidad: 75, maxSites: 20 });
  const [mcParams, setMcParams] = useState({ kappa: 50, samples: 1000, topFrac: 0.1 });
  const [mcProb, setMcProb] = useState<Float32Array | null>(null);
  const [mcProgress, setMcProgress] = useState<number | null>(null);
  const [selCell, setSelCell] = useState<number | null>(null);
  const [selSite, setSelSite] = useState<Site | null>(null);
  const [flyTo, setFlyTo] = useState<{ center: [number, number]; zoom: number; key: number } | null>(null);
  const [depMetric, setDepMetric] = useState<DepMetric>("crec_anual");
  const [selDep, setSelDep] = useState<DepProps | null>(null);
  const [sheet, setSheet] = useState(true);

  useEffect(() => {
    loadDataset().then(setDs).catch((e) => setErr(String(e)));
    for (const [k, f] of Object.entries(GEO_FILES)) {
      loadJSON<GeoJSON.FeatureCollection>(f).then((g) => setGeo((x) => ({ ...x, [k]: g }))).catch(() => undefined);
    }
  }, []);

  // ------------------------------------------------------------ modelo
  const fScores = useMemo(() => (ds ? factorScores(ds.col, ds.n, fns) : {}), [ds, fns]);
  const reason = useMemo(() => (ds ? computeMask(ds.col, ds.n, restrictions, water) : new Uint8Array()), [ds, restrictions, water]);
  const effW = useMemo(() => effectiveWeights(weights), [weights]);
  const score = useMemo(() => aggregate(fScores, effW, reason, agg), [fScores, effW, reason, agg]);
  // los resultados Monte Carlo quedan desactualizados si cambia el modelo
  useEffect(() => setMcProb(null), [fScores, effW, reason]);

  const reasonNames = useMemo(
    () => [...restrictions.map((r) => `${r.id} ${r.nombre}`), "R13 Suficiencia hídrica"],
    [restrictions],
  );
  const stats = useMemo(() => {
    const counts = new Array(restrictions.length + 2).fill(0);
    for (let i = 0; i < reason.length; i++) counts[reason[i]]++;
    return {
      total: reason.length,
      aptas: counts[0],
      excl: [...restrictions.map((r, k) => ({ id: r.id, nombre: r.nombre, n: counts[k + 1] })),
        { id: "R13", nombre: "Suficiencia hídrica", n: counts[restrictions.length + 1] }],
    };
  }, [reason, restrictions]);

  const sites = useMemo(() => (ds ? findSites(ds, score, siteParams, mcProb) : []), [ds, score, siteParams, mcProb]);

  const workerRef = useRef<Worker | null>(null);
  const runMc = useCallback(() => {
    if (!ds) return;
    const ids = Object.keys(effW).filter((id) => fScores[id]);
    const eligible = new Uint8Array(ds.n);
    for (let i = 0; i < ds.n; i++) eligible[i] = reason[i] === 0 ? 1 : 0;
    workerRef.current?.terminate();
    const w = new Worker(new URL("./model/mc.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = w;
    setMcProgress(0);
    w.onmessage = (e) => {
      if (e.data.type === "progress") setMcProgress(e.data.p);
      else {
        setMcProb(e.data.prob);
        setMcProgress(null);
        setView("robustez");
        w.terminate();
      }
    };
    w.postMessage({
      scores: ids.map((id) => fScores[id]),
      weights: ids.map((id) => effW[id]),
      eligible,
      kappa: mcParams.kappa,
      samples: mcParams.samples,
      topFrac: mcParams.topFrac,
      seed: 20221018,
    });
  }, [ds, effW, fScores, reason, mcParams]);

  // ------------------------------------------------------------ colores del mapa
  const legend = useRef<{ title: string; stops?: RGB[]; ticks?: string[]; cats?: { c: RGB; n: string }[] }>({ title: "" });
  const colors = useMemo(() => {
    if (!ds) return new Uint8Array();
    const out = new Uint8Array(ds.n * 4);
    const put = (i: number, c: RGB, a: number) => {
      out[i * 4] = c[0]; out[i * 4 + 1] = c[1]; out[i * 4 + 2] = c[2]; out[i * 4 + 3] = a;
    };
    const hl = new Set(selSite?.cells ?? []);
    if (view === "aptitud") {
      const lo = quantile(score, 0.02);
      const hi = quantile(score, 0.995);
      for (let i = 0; i < ds.n; i++) {
        if (reason[i]) put(i, EXCLUDED, 70);
        else put(i, ramp(SEQ_BLUE, (score[i] - lo) / (hi - lo)), hl.size && !hl.has(i) ? 150 : 225);
      }
      legend.current = {
        title: "Aptitud (0–1)", stops: SEQ_BLUE,
        ticks: [lo.toFixed(2), ((lo + hi) / 2).toFixed(2), hi.toFixed(2)],
        cats: [{ c: EXCLUDED, n: "Excluida por restricción" }],
      };
    } else if (view === "robustez") {
      for (let i = 0; i < ds.n; i++) {
        if (reason[i]) put(i, EXCLUDED, 50);
        else if (!mcProb) put(i, EXCLUDED, 30);
        else put(i, ramp(SEQ_ORANGE, mcProb[i]), mcProb[i] > 0 ? 235 : 60);
      }
      legend.current = {
        title: mcProb ? `Probabilidad de estar en el ${Math.round(mcParams.topFrac * 100)} % superior` : "Calculá la robustez en «Sitios»",
        stops: SEQ_ORANGE, ticks: ["0 %", "50 %", "100 %"], cats: [{ c: EXCLUDED, n: "Excluida" }],
      };
    } else if (view === "exclusion") {
      for (let i = 0; i < ds.n; i++) {
        if (reason[i] === 0) put(i, SEQ_BLUE[2], 120);
        else put(i, CAT[(reason[i] - 1) % CAT.length], 220);
      }
      const present = stats.excl.map((x, k) => ({ ...x, k })).filter((x) => x.n > 0);
      legend.current = {
        title: "Motivo de exclusión (primera restricción incumplida)",
        cats: [{ c: SEQ_BLUE[2], n: "Apta" }, ...present.map((x) => ({ c: CAT[x.k % CAT.length], n: reasonNames[x.k] }))],
      };
    } else {
      const v = ds.col[variable];
      const info = VAR_BY_ID[variable];
      const tf = info?.log ? (x: number) => Math.log10(Math.max(x, 1)) : (x: number) => x;
      const t = Float32Array.from(v, tf);
      const lo = quantile(t, 0.02);
      const hi = quantile(t, 0.98);
      const diverging = variable === "crec_dep";
      for (let i = 0; i < ds.n; i++) {
        const x = diverging ? (v[i] + 3) / 6 : (t[i] - lo) / (hi - lo);
        put(i, ramp(diverging ? DIV_RED_BLUE : SEQ_BLUE, x), Number.isFinite(v[i]) ? 220 : 0);
      }
      const back = info?.log ? (x: number) => 10 ** x : (x: number) => x;
      legend.current = {
        title: info?.nombre ?? variable,
        stops: diverging ? DIV_RED_BLUE : SEQ_BLUE,
        ticks: diverging ? ["≤−3 %", "0", "≥+3 %"] : [lo, (lo + hi) / 2, hi].map((x) => fmtVar(variable, back(x))),
      };
    }
    return out;
  }, [ds, view, score, reason, mcProb, variable, selSite, stats, reasonNames, mcParams.topFrac]);
  const colorKey = useMemo(() => `${view}|${variable}|${Math.random()}`, [colors]); // eslint-disable-line react-hooks/exhaustive-deps

  const depsProps = useMemo(
    () => (geo.departamentos?.features ?? []).map((f) => f.properties as DepProps),
    [geo.departamentos],
  );
  const depFill = useMemo(() => {
    if (tab !== "diagnostico") return null;
    const colorOf = (f: GeoJSON.Feature): [number, number, number, number] => {
      const p = f.properties as DepProps;
      let c: RGB;
      if (depMetric === "crec_anual") c = ramp(DIV_RED_BLUE, ((p.crec_anual ?? NaN) + 3) / 6);
      else if (depMetric === "densidad") c = ramp(SEQ_BLUE, (Math.log10(Math.max(p.densidad ?? NaN, 0.1)) + 1) / 4);
      else c = ramp(SEQ_BLUE, (Math.log10(Math.max(p.pob2022 ?? NaN, 1000)) - 3) / 3);
      const sel = selDep?.cod_dep === p.cod_dep;
      return [c[0], c[1], c[2], sel ? 255 : 215];
    };
    return { colorOf, key: `${depMetric}|${selDep?.cod_dep}` };
  }, [tab, depMetric, selDep]);

  const selectSite = (s: Site) => {
    setSelSite(s);
    setSelCell(s.best);
    setFlyTo({ center: s.center, zoom: 7, key: Date.now() });
  };

  if (err) return <div className="loading">Error al cargar datos: {err}</div>;
  if (!ds) return <div className="loading">Cargando grilla territorial…</div>;

  const L = tab === "diagnostico"
    ? { title: METRICS[depMetric].nombre, stops: METRICS[depMetric].stops, ticks: METRICS[depMetric].ticks, cats: undefined }
    : legend.current;

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Atlas de aptitud territorial · Argentina</h1>
          <p className="muted small">Nuevas ciudades y redistribución poblacional · análisis multicriterio con datos abiertos</p>
        </div>
      </header>
      <div className="main">
        <aside className={`side ${sheet ? "open" : ""}`}>
          <button className="sheet-toggle" onClick={() => setSheet((s) => !s)} aria-expanded={sheet}>
            {sheet ? "Ocultar panel" : "Mostrar panel"}
          </button>
          <nav className="tabs" role="tablist">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
                {t.nombre}
              </button>
            ))}
          </nav>
          <div className="side-body">
            {tab === "aptitud" && (
              <CriteriaPanel
                scenario={scenario}
                setScenario={(id) => {
                  setScenario(id);
                  const s = SCENARIOS.find((x) => x.id === id);
                  if (s) setWeights(s.weights());
                }}
                weights={weights}
                setWeight={(id, v) => { setWeights((w) => ({ ...w, [id]: v })); setScenario("custom"); }}
                fns={fns}
                setFn={(id, fn) => setFns((x) => ({ ...x, [id]: fn }))}
                restrictions={restrictions}
                setRestriction={(id, patch) => setRestrictions((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))}
                water={water}
                setWater={(patch) => setWaterState((w) => ({ ...w, ...patch }))}
                agg={agg}
                setAgg={setAgg}
                stats={stats}
              />
            )}
            {tab === "sitios" && (
              <SitesPanel
                ds={ds}
                sites={sites}
                params={siteParams}
                setParams={(p) => setSiteParamsState((x) => ({ ...x, ...p }))}
                onSelect={selectSite}
                selected={selSite}
                mc={mcParams}
                setMc={(p) => setMcParams((x) => ({ ...x, ...p }))}
                runMc={runMc}
                mcProgress={mcProgress}
                hasMc={!!mcProb}
              />
            )}
            {tab === "diagnostico" && (
              <DiagnosticPanel deps={depsProps} metric={depMetric} setMetric={setDepMetric} selected={selDep} />
            )}
            {tab === "simulador" && <SimulatorPanel ds={ds} sites={sites} deps={depsProps} />}
            {tab === "metodo" && <MethodPanel generado={ds.meta.generado} />}
          </div>
        </aside>

        <div className="mapwrap">
          <MapView
            ds={ds}
            colors={colors}
            colorKey={colorKey}
            geo={geo}
            overlays={overlays}
            depFill={depFill}
            highlight={tab === "diagnostico" ? [] : selSite?.cells ?? []}
            selected={tab === "diagnostico" ? null : selCell}
            flyTo={flyTo}
            onCellClick={(i) => { setSelCell(i); if (i === null) setSelSite(null); }}
            onDepClick={(f) => setSelDep((f?.properties as DepProps) ?? null)}
            dark={dark}
          />
          {tab !== "diagnostico" && (
            <div className="mapctl">
              <label>
                Capa
                <select value={view} onChange={(e) => setView(e.target.value as View)}>
                  <option value="aptitud">Aptitud</option>
                  <option value="robustez">Robustez (Monte Carlo)</option>
                  <option value="exclusion">Motivos de exclusión</option>
                  <option value="variable">Variable…</option>
                </select>
              </label>
              {view === "variable" && (
                <select value={variable} onChange={(e) => setVariable(e.target.value)} aria-label="Variable">
                  {[...new Set(VARIABLES.map((v) => v.grupo))].map((g) => (
                    <optgroup key={g} label={g}>
                      {VARIABLES.filter((v) => v.grupo === g).map((v) => (
                        <option key={v.id} value={v.id}>{v.nombre}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
              <details className="overlays">
                <summary>Capas de referencia</summary>
                {(
                  [
                    ["provincias", "Límites provinciales"], ["rutas", "Rutas nacionales pavimentadas"],
                    ["ferrocarril", "Ferrocarril operativo"], ["alta_tension", "Líneas de alta tensión"],
                    ["rios", "Ríos ≥100 m³/s"], ["areas_protegidas", "Áreas protegidas"],
                  ] as [keyof Overlays, string][]
                ).map(([k, n]) => (
                  <label key={k} className="check">
                    <input type="checkbox" checked={overlays[k]} onChange={(e) => setOverlays((o) => ({ ...o, [k]: e.target.checked }))} />
                    {n}
                  </label>
                ))}
              </details>
            </div>
          )}
          <div className="legend" aria-label="Leyenda">
            <div className="small"><b>{L.title}</b></div>
            {L.stops && (
              <>
                <div className="ramp" style={{ background: gradientCss(L.stops) }} />
                <div className="ticks small muted">{L.ticks?.map((t, k) => <span key={k}>{t}</span>)}</div>
              </>
            )}
            {L.cats?.map((c) => (
              <div key={c.n} className="cat small">
                <span className="swatch" style={{ background: css(c.c) }} />
                {c.n}
              </div>
            ))}
          </div>
          {selCell !== null && tab !== "diagnostico" && (
            <CellDetail
              ds={ds}
              i={selCell}
              score={score[selCell]}
              robust={mcProb ? mcProb[selCell] : null}
              reason={reason[selCell] ? reasonNames[reason[selCell] - 1] : null}
              factorScores={fScores}
              weights={effW}
              onClose={() => { setSelCell(null); setSelSite(null); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

