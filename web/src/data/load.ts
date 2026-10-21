// Carga la grilla H3 generada por pipeline/build.py (cells.bin + cells.json).

export interface ColumnMeta {
  id: string;
  offset: number;
  min: number;
  max: number;
}

export interface CellsMeta {
  h3_res: number;
  n: number;
  layout: { h3_lo: number; h3_hi: number; dep_idx: number };
  columns: ColumnMeta[];
  departamentos: { cod: string; nombre: string; provincia: string }[];
  provincias: Record<string, string>;
  generado: string;
}

export interface Dataset {
  n: number;
  h3: string[];
  dep: Uint16Array;
  col: Record<string, Float32Array>;
  meta: CellsMeta;
  index: Map<string, number>;
}

const BASE = `${import.meta.env.BASE_URL}data/`;

export function h3FromParts(lo: number, hi: number): string {
  return hi.toString(16) + lo.toString(16).padStart(8, "0");
}

export async function loadDataset(): Promise<Dataset> {
  const [meta, buf] = await Promise.all([
    fetch(BASE + "cells.json").then((r) => r.json() as Promise<CellsMeta>),
    fetch(BASE + "cells.bin").then((r) => r.arrayBuffer()),
  ]);
  const n = meta.n;
  const lo = new Uint32Array(buf, meta.layout.h3_lo, n);
  const hi = new Uint32Array(buf, meta.layout.h3_hi, n);
  const h3 = new Array<string>(n);
  const index = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    h3[i] = h3FromParts(lo[i], hi[i]);
    index.set(h3[i], i);
  }
  const dep = new Uint16Array(buf.slice(meta.layout.dep_idx, meta.layout.dep_idx + n * 2));
  const col: Record<string, Float32Array> = {};
  for (const c of meta.columns) col[c.id] = new Float32Array(buf, c.offset, n);
  return { n, h3, dep, col, meta, index };
}

export interface Incentivo {
  id: string;
  nombre: string;
  nivel: string;
  norma: string;
  vigencia_estado: string;
  vigencia_hasta: string;
  tipo: string;
  beneficiario: string;
  intensidad: string;
  fuente_url: string;
}
export interface IncentivoMunicipal {
  id: string;
  municipio: string;
  provincia: string;
  cod_dep: string;
  nombre_programa: string;
  tipo: string;
  beneficiario: string;
  requisitos: string;
  intensidad: string;
  vigencia_estado: string;
  fuente_url: string;
  verificado: string;
}
export interface Incentivos {
  incentivos: Incentivo[];
  por_dep: Record<string, string[]>;
  municipales?: IncentivoMunicipal[];
}

export async function loadJSON<T = unknown>(path: string): Promise<T> {
  const r = await fetch(BASE + path);
  if (!r.ok) throw new Error(`No se pudo cargar ${path}`);
  return r.json();
}
