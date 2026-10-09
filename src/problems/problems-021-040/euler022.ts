import namesText from './assets/p022_names.txt?raw';
import { wordValue } from '../utils.js';

/*
https://projecteuler.net/problem=22
*/
export function euler022(): number {
  const names = namesText.replace(/"/g, '').split(',');

  names.sort();

  let total = 0;
  names.forEach((n, i) => {
    total += wordValue(n) * (i + 1);
  });

  return total;
}
