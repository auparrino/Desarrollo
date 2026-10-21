// Escenario compartible por URL (#e=...) y exportación de resultados.
import type { PolicyId } from "./policies";
import type { Points } from "./plain";

export interface ShareState {
  policy: PolicyId;
  points: Points;
  poblacion: number;
  escala?: string;
  paleta?: string;
}

export function encodeState(s: ShareState): string {
  return "#e=" + encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(s)))));
}

export function decodeState(hash: string): ShareState | null {
  const m = hash.match(/#e=([^&]+)/);
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1]))))) as ShareState;
  } catch {
    return null;
  }
}

export function downloadCSV(name: string, rows: Record<string, string | number>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v: string | number) => {
    const t = String(v ?? "");
    return /[",;\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
