import { useSyncExternalStore } from 'react';

import type { SolveResponse } from '../workers/solver.worker';
import SolverWorker from '../workers/solver.worker?worker';
import { hasSolution } from './catalog';
import { holdUpdates } from './update';

export type Run =
  | { status: 'queued' }
  | { status: 'solving' }
  | { status: 'solved'; value: number; duration: number }
  | { status: 'failed'; error: string };

const STORAGE_KEY = 'pe_runs';

type FinishedRun = Extract<Run, { status: 'solved' | 'failed' }>;

function isFinished(run: Run): run is FinishedRun {
  return run.status === 'solved' || run.status === 'failed';
}

/** The results of this tab's session, so a reload (an update) keeps them. */
function loadRuns(): Map<number, Run> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const saved: unknown = raw ? JSON.parse(raw) : [];
    return new Map(
      Array.isArray(saved)
        ? (saved as [number, FinishedRun][]).filter(
            ([id, run]) => hasSolution(id) && isFinished(run),
          )
        : [],
    );
  } catch {
    return new Map();
  }
}

function saveRuns(): void {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...runs].filter(([, run]) => isFinished(run))),
    );
  } catch {
    // ignore storage errors
  }
}

// Results live for the whole session, so they survive navigating to the code
// and back, and reloads.
const runs = loadRuns();
const listeners = new Set<() => void>();
let snapshot: ReadonlyMap<number, Run> = new Map(runs);
// An update reloads the page, which would stop the solutions running.
let releaseUpdates: (() => void) | null = null;

let worker: Worker | null = null;
const queue: number[] = [];
let current: number | null = null;

function emit(): void {
  snapshot = new Map(runs);
  saveRuns();
  if (current !== null) {
    releaseUpdates ??= holdUpdates();
  } else {
    releaseUpdates?.();
    releaseUpdates = null;
  }
  listeners.forEach((listener) => listener());
}

function getWorker(): Worker {
  if (!worker) {
    worker = new SolverWorker();
    worker.onmessage = (event: MessageEvent<SolveResponse>) => {
      const result = event.data;
      runs.set(
        result.id,
        result.ok
          ? {
              status: 'solved',
              value: result.value,
              duration: result.duration,
            }
          : { status: 'failed', error: result.error },
      );
      current = null;
      next();
    };
  }
  return worker;
}

function next(): void {
  const id = queue.shift();
  if (id !== undefined) {
    current = id;
    runs.set(id, { status: 'solving' });
    getWorker().postMessage({ id });
  }
  emit();
}

function isPending(id: number): boolean {
  return current === id || queue.includes(id);
}

/** Queues problems to solve; already pending ones keep their place. */
export function solve(ids: number[]): void {
  const added = ids.filter((id) => hasSolution(id) && !isPending(id));
  if (added.length === 0) {
    return;
  }
  for (const id of added) {
    runs.set(id, { status: 'queued' });
    queue.push(id);
  }
  if (current === null) {
    next();
  } else {
    emit();
  }
}

/** Forgets every result and stops the solution running, if any. */
export function reset(): void {
  queue.length = 0;
  runs.clear();
  if (current !== null) {
    worker?.terminate();
    worker = null;
    current = null;
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRuns(): ReadonlyMap<number, Run> {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export function useRun(id: number): Run | undefined {
  return useSyncExternalStore(subscribe, () => runs.get(id));
}
