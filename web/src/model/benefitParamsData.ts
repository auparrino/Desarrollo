import data from "./benefitParams.json";
import type { BenefitParams } from "./benefits";

/** Parámetros de beneficios con fuente (docs/beneficios-parametros.md). */
export const BENEFIT_PARAMS = data as unknown as BenefitParams;
