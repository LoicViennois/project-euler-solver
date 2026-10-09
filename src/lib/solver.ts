import { useSyncExternalStore } from 'react';

import type { SolveResponse } from '../workers/solver.worker';
import SolverWorker from '../workers/solver.worker?worker';
import { hasSolution } from './catalog';

export type Run =
  | { status: 'queued' }
  | { status: 'solving' }
  | { status: 'solved'; value: number; duration: number }
  | { status: 'failed'; error: string };

// Results live for the whole session, so they survive navigating to the code and back.
const runs = new Map<number, Run>();
const listeners = new Set<() => void>();
let snapshot: ReadonlyMap<number, Run> = new Map();

let worker: Worker | null = null;
const queue: number[] = [];
let current: number | null = null;

function emit(): void {
  snapshot = new Map(runs);
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
