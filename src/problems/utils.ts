import { sum } from './maths.js';

export function number2digits(n: number | string): number[] {
  const s = n + '';
  return s.split('').map((c) => +c);
}

export function digits2number(digits: number[]): number {
  return +digits.join('');
}

export function bigNumber2digits(b: bigint): number[] {
  return b
    .toString()
    .split('')
    .map((c) => +c);
}

function alphaPosition(c: string): number {
  return c.charCodeAt(0) - 64;
}

export function wordValue(word: string): number {
  return sum(word.split('').map((c: string) => alphaPosition(c)));
}

export function haveSameLength<T>(...arrays: T[][]): boolean {
  const len0 = arrays[0]?.length;
  for (const array of arrays) {
    if (array.length !== len0) {
      return false;
    }
  }
  return true;
}

export function haveDuplicates<T>(array: T[]): boolean {
  return uniq(array).length !== array.length;
}

export function nbOccurrences<T>(item: T, array: T[]): number {
  return array.filter((i) => i === item).length;
}

export function arePermutations(n1: number, n2: number): boolean {
  return arraysEqual(number2digits(n1).sort(), number2digits(n2).sort());
}

export function range(start: number, end?: number, step?: number): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  step = step || 1;
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

export function times<T>(k: number, fn: () => T): void {
  for (let i = 0; i < k; i++) {
    fn();
  }
}

export function uniq<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function concat<T>(...arrays: T[][]): T[] {
  const [array1, ...otherArrays] = arrays;
  return (array1 ?? []).concat(...otherArrays);
}

export function union<T>(...arrays: T[][]): T[] {
  return uniq(concat(...arrays));
}

export function maxBy<T>(array: T[], mapFn: (a: T) => number): T {
  return array.reduce((a, b) => (mapFn(a) >= mapFn(b) ? a : b));
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export function transpose<T>(array: T[][]): T[][] {
  return (array[0] ?? []).map((_, colIndex) =>
    array.map((row) => row[colIndex]!),
  );
}

export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
  return array1.map((val1, index) => [val1, array2[index]!]);
}

export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((val1) => !array2.includes(val1));
}

export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((val1) => array2.includes(val1));
}

export function areDisjoint<T>(...arrays: T[][]): boolean {
  return (
    arrays.reduce((array1, array2) => intersection(array1, array2)).length === 0
  );
}
