import data from "./unitCosts.json";
import type { UnitCosts } from "./costs";

/** Costos unitarios argentinos con fuente (docs/costos-unitarios.md). */
export const UNIT_COSTS = data as unknown as UnitCosts;
