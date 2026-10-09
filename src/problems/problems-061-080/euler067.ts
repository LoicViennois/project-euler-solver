import triangleText from './assets/p067_triangle.txt?raw';

import { max } from '../maths.js';

/*
https://projecteuler.net/problem=67
*/
export function euler067(): number {
  const rows = triangleText
    .split('\n')
    .filter((line) => line)
    .map((line) => {
      return line.split(' ').map((n) => +n);
    });

  const distances: number[] = new Array<number>(rows.length).fill(0);

  for (const row of rows) {
    const previousDistances = [...distances];
    for (const [index, col] of row.entries()) {
      distances[index] =
        col +
        max([previousDistances[index - 1] ?? 0, previousDistances[index]!]);
    }
  }

  return max(distances);
}
