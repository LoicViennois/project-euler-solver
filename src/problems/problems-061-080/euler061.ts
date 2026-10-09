import { SolutionNotFoundError } from '../errors/solution-not-found.error.js';
import { sum } from '../maths.js';
import {
  arraysEqual,
  concat,
  digits2number,
  number2digits,
  range,
} from '../utils.js'; /*
https://projecteuler.net/problem=61
*/

/*
https://projecteuler.net/problem=61
*/
export function euler061(): number {
  const triangles = range(1e3)
    .map((n) => (n * (n + 1)) / 2)
    .filter((k) => k >= 1e3 && k < 1e4);
  const squares = range(1e3)
    .map((n) => n * n)
    .filter((k) => k >= 1e3 && k < 1e4);
  const pentagonals = range(1e3)
    .map((n) => (n * (3 * n - 1)) / 2)
    .filter((k) => k >= 1e3 && k < 1e4);
  const hexagonals = range(1e3)
    .map((n) => n * (2 * n - 1))
    .filter((k) => k >= 1e3 && k < 1e4);
  const heptagonals = range(1e3)
    .map((n) => (n * (5 * n - 3)) / 2)
    .filter((k) => k >= 1e3 && k < 1e4);
  const octagonals = range(1e3)
    .map((n) => n * (3 * n - 2))
    .filter((k) => k >= 1e3 && k < 1e4);

  const polygonals2 = [
    squares,
    pentagonals,
    hexagonals,
    heptagonals,
    octagonals,
  ];

  function combinationsWith(k: number): number[] {
    const combinations = [];
    const prefix = number2digits(k).slice(2);
    for (const d1 of range(10)) {
      for (const d2 of range(10)) {
        combinations.push(digits2number(concat(prefix, [d1, d2])));
      }
    }
    return combinations;
  }

  function isInSubset(k: number, set: number[][]): [boolean, number[][]] {
    const newSet = [...set];
    for (let s = 0; s < newSet.length; s++) {
      if (newSet[s]!.includes(k)) {
        newSet.splice(s, 1);
        return [true, newSet];
      }
    }
    return [false, newSet];
  }

  function areCyclic(a: number, b: number): boolean {
    return arraysEqual(number2digits(a).slice(2), number2digits(b).slice(0, 2));
  }

  for (const n1 of triangles) {
    for (const n2 of combinationsWith(n1)) {
      const [foundN2, polygonals3] = isInSubset(n2, polygonals2);
      if (foundN2) {
        for (const n3 of combinationsWith(n2)) {
          const [foundN3, polygonals4] = isInSubset(n3, polygonals3);
          if (foundN3) {
            for (const n4 of combinationsWith(n3)) {
              const [foundN4, polygonals5] = isInSubset(n4, polygonals4);
              if (foundN4) {
                for (const n5 of combinationsWith(n4)) {
                  const [foundN5, polygonals6] = isInSubset(n5, polygonals5);
                  if (foundN5) {
                    for (const n6 of combinationsWith(n5)) {
                      const [foundN6] = isInSubset(n6, polygonals6);
                      if (foundN6) {
                        if (areCyclic(n6, n1)) {
                          return sum([n1, n2, n3, n4, n5, n6]);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  throw new SolutionNotFoundError('euler061');
}
