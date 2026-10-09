import { sieve } from '../maths.js';

/*
https://projecteuler.net/problem=07
*/
export function euler007(): number {
  return sieve(2e5)[10000]!;
}
