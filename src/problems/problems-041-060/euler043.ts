import { sum } from '../maths.js';
import {
  concat,
  digits2number,
  haveDuplicates,
  number2digits,
  range,
} from '../utils.js';

/*
https://projecteuler.net/problem=43
*/
export function euler043(): number {
  /**
   * Get all the 3-uniq-digits numbers divisible by n
   */
  function buildProducts(n: number): number[] {
    let dn = [];
    let k = 0;
    while (k < 999) {
      if (k >= 10) {
        dn.push(k);
      }
      k += n;
    }
    dn = dn.filter((d) => {
      return !haveDuplicates(number2digits(d));
    });
    return dn;
  }

  /**
   * Get possible values for the next 3-uniq-digits number, excluding previously used digits
   */
  function getPossibleValues(n: number[]): number[][] {
    const remainingDigits = range(10).filter((k) => !n.includes(k));
    const values = [];
    for (const k of remainingDigits) {
      values.push(concat([k], n.slice(0, 2)));
    }
    return values;
  }

  const d2 = buildProducts(2);
  const d3 = buildProducts(3);
  const d5 = buildProducts(5);
  const d7 = buildProducts(7);
  const d11 = buildProducts(11);
  const d13 = buildProducts(13);
  const d17 = buildProducts(17);

  const d17Digits = d17.map((d) => number2digits(d));

  const finalNumbers: number[] = [];

  for (const n17 of d17Digits) {
    for (const n13 of getPossibleValues(n17)) {
      if (d13.includes(digits2number(n13))) {
        for (const n11 of getPossibleValues(n13)) {
          if (d11.includes(digits2number(n11))) {
            for (const n7 of getPossibleValues(n11)) {
              if (d7.includes(digits2number(n7))) {
                for (const n5 of getPossibleValues(n7)) {
                  if (d5.includes(digits2number(n5))) {
                    for (const n3 of getPossibleValues(n5)) {
                      if (d3.includes(digits2number(n3))) {
                        for (const n2 of getPossibleValues(n3)) {
                          if (d2.includes(digits2number(n2))) {
                            let finalDigits: number[] = concat(
                              [
                                n2[0]!,
                                n3[0]!,
                                n5[0]!,
                                n7[0]!,
                                n11[0]!,
                                n13[0]!,
                              ],
                              n17,
                            );
                            if (!haveDuplicates(finalDigits)) {
                              const firstDigit = range(10).filter(
                                (k) => !finalDigits.includes(k),
                              )[0];
                              finalDigits = concat([firstDigit!], finalDigits);
                              finalNumbers.push(digits2number(finalDigits));
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
    }
  }

  return sum(finalNumbers);
}
