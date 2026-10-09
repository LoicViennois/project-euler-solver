/*
https://projecteuler.net/problem=40
*/
export function euler040(): number {
  let digits = '0';
  let n = 1;

  while (digits.length < 1e6 + 1) {
    digits += n;
    n += 1;
  }

  let p = 1;
  for (const d of [1, 10, 1e2, 1e3, 1e4, 1e5, 1e6]) {
    p *= +digits[d]!;
  }

  return p;
}
