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

export const GROUP_SIZE = 10;

/** Ids of the problems with a solution, in ascending order. */
export const solvedIds = [...loaders.keys()].sort((a, b) => a - b);

/** Every problem id shown, up to the end of the last started group of ten. */
export const allIds = Array.from(
  {
    length: Math.ceil(Math.max(0, ...solvedIds) / GROUP_SIZE) * GROUP_SIZE,
  },
  (_, i) => i + 1,
);

export function hasSolution(id: number): boolean {
  return loaders.has(id);
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

/** Splits ids into consecutive groups of ten: 1-10, 11-20… */
export function groupIds(ids: number[]): number[][] {
  const groups: number[][] = [];
  for (let i = 0; i < ids.length; i += GROUP_SIZE) {
    groups.push(ids.slice(i, i + GROUP_SIZE));
  }
  return groups;
}
