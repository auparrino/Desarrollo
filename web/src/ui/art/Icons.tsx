// Íconos lineales sobrios, de un solo color (heredan currentColor).
import type { PolicyId } from "../../model/policies";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function PolicyIcon({ id, size = 26 }: { id: PolicyId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="picon">
      {id === "ciudad_nueva" && (
        <g {...P}>
          <path d="M3 21h18" /><path d="M5 21V10l5-3v14" /><path d="M10 21V4l9 4v13" /><path d="M13 10h3M13 13h3M13 16h3" />
        </g>
      )}
      {id === "capital" && (
        <g {...P}>
          <path d="M3 21h18" /><path d="M4 10h16" /><path d="M12 3l8 5H4z" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /><path d="M4 18h16" />
        </g>
      )}
      {id === "intermedias" && (
        <g {...P}>
          <path d="M3 21h18" /><rect x="4" y="11" width="5" height="10" /><rect x="10" y="6" width="5" height="15" /><rect x="16" y="13" width="4" height="8" />
        </g>
      )}
      {id === "pueblos" && (
        <g {...P}>
          <path d="M3 21h18" /><path d="M5 21v-7l4-3 4 3v7" /><path d="M13 21v-5l3-2 3 2v5" /><path d="M8 21v-3h2v3" />
        </g>
      )}
      {id === "polos" && (
        <g {...P}>
          <path d="M3 21h18" /><path d="M4 21V12l5 3v-3l5 3v-3l5 3v6" /><path d="M17 12V5h2v8" />
        </g>
      )}
    </svg>
  );
}
