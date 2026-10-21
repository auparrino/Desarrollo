import { runMonteCarlo, type MCInput } from "./montecarlo";

self.onmessage = (e: MessageEvent<MCInput>) => {
  const prob = runMonteCarlo(e.data, (p) => self.postMessage({ type: "progress", p }));
  self.postMessage({ type: "done", prob }, { transfer: [prob.buffer] });
};
