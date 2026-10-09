import { factorial } from '../maths.js';
import { range } from '../utils.js';

/*
https://projecteuler.net/problem=34
*/
export function euler034(): number {
  const factorials = range(10).map((x) => factorial(x));

  let p = 99;
  let maxNum: number;

  while (true) {
    let s = 0;
    for (const d of p.toString()) {
      s += factorials[+d]!;
    }
    if (p >= s) {
      maxNum = s;
      break;
    }
    p = (p + 1) * 10 - 1;
  }

  let factorialsSum = 0;

  for (const n of range(10, maxNum + 1)) {
    let s = 0;
    for (const d of n.toString()) {
      s += factorials[+d]!;
    }
    if (n === s) {
      factorialsSum += n;
    }
  }

  return factorialsSum;
}
