import { allProblems } from '../problems';

export interface SolveRequest {
  id: number;
}

export type SolveResponse =
  | { id: number; ok: true; value: number; duration: number }
  | { id: number; ok: false; error: string };

// Solutions run one at a time, in the order requested, off the main thread.
self.onmessage = (event: MessageEvent<SolveRequest>) => {
  const { id } = event.data;
  const solver = allProblems.find((p) => p.id === id)?.solver;
  let response: SolveResponse;
  if (!solver) {
    response = { id, ok: false, error: `Problem ${id} has no solution yet` };
  } else {
    try {
      const start = performance.now();
      const value = solver();
      response = { id, ok: true, value, duration: performance.now() - start };
    } catch (error) {
      response = {
        id,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  self.postMessage(response);
};
