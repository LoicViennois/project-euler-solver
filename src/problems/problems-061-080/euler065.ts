import { sum } from '../maths.js';
import { bigNumber2digits, range } from '../utils.js';

function computeBigContinuedFraction(terms: bigint[]): [bigint, bigint] {
  const len = terms.length;

  let ni = terms[len - 1]!;
  let di = BigInt(1);

  for (let i = len - 1; i--; i >= 0) {
    const aj = terms[i]!;
    const nj1 = ni;
    ni = ni * aj + di;
    di = nj1;
  }
  return [ni, di];
}

/*
https://projecteuler.net/problem=65
*/
export function euler065(): number {
  const terms = [BigInt(2), BigInt(1)];
  for (const i of range(1, 34)) {
    terms.push(...[BigInt(2) * BigInt(i), BigInt(1), BigInt(1)]);
  }

  const nj = computeBigContinuedFraction(terms.slice(0, terms.length - 1))[0];

  return sum(bigNumber2digits(nj));
}
