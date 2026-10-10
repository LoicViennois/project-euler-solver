import titles from './titles.json';

// The solution sources double as the catalogue: a problem is solved when its file exists.
// Sources load lazily, so the catalogue costs nothing until a solution is opened.
const sources = import.meta.glob<string>(
  '../problems/problems-*/euler[0-9][0-9][0-9].ts',
  { query: '?raw', import: 'default' },
);

const loaders = new Map(
  Object.entries(sources).map(([path, load]) => {
    const id = Number(/euler(\d{3})\.ts$/.exec(path)?.[1]);
    return [id, load];
  }),
);

/** Ids of the problems with a solution, in ascending order. */
export const solvedIds = [...loaders.keys()].sort((a, b) => a - b);

/** The problem being worked on: the one after the last solved. */
export const nextId = Math.max(0, ...solvedIds) + 1;

/** Every problem id shown: the solved ones, then the one being worked on. */
export const allIds = [...solvedIds, nextId];

export function hasSolution(id: number): boolean {
  return loaders.has(id);
}

/** Title of a problem on Project Euler, refreshed by `pnpm titles`. */
export function problemTitle(id: number): string | undefined {
  return (titles as Record<string, string | undefined>)[id];
}

export function solutionName(id: number): string {
  return `euler${String(id).padStart(3, '0')}`;
}

export function problemUrl(id: number): string {
  return `https://projecteuler.net/problem=${id}`;
}

export function loadSource(id: number): Promise<string> {
  const load = loaders.get(id);
  return load ? load() : Promise.reject(new Error(`No solution for ${id}`));
}
