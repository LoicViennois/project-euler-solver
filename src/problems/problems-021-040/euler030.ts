import { sum } from '../maths.js';
import { number2digits, range } from '../utils.js';

/*
https://projecteuler.net/problem=30
*/
export function euler030(): number {
  let p = 9;
  let maxNum: number;
  while (true) {
    const digitsPowers = sum(number2digits(p).map((x) => x ** 5));
    if (p >= digitsPowers) {
      maxNum = digitsPowers;
      break;
    }
    p = (p + 1) * 10 - 1;
  }

  let powersSum = 0;

  for (const n of range(10, maxNum)) {
    if (n === sum(number2digits(n).map((x) => x ** 5))) {
      powersSum += n;
    }
  }

  return powersSum;
}
