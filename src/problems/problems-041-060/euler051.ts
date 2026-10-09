import { cartesianProduct, combination } from '../combinatorics.js';
import { isPrime } from '../maths.js';
import { maxBy, range } from '../utils.js';

/*
https://projecteuler.net/problem=51
*/
export function euler051(): number {
  const digits = range(10).map((d) => '' + d);
  const maxNbDigits = 6;

  const digitReplacements: number[][] = [];

  for (const nbDigitsToReplace of range(1, maxNbDigits)) {
    for (const digitsToReplace of combination(
      range(maxNbDigits),
      nbDigitsToReplace,
    )) {
      const possibleDigits: string[][] = [];
      for (const i of range(maxNbDigits)) {
        if (digitsToReplace.includes(i)) {
          possibleDigits.push(['X']);
        } else {
          possibleDigits.push(digits);
        }
      }
      for (const possibleNumberAsArray of cartesianProduct(...possibleDigits)) {
        const possibleNumber = possibleNumberAsArray.join('');
        const replacements = [];
        for (const d of digits) {
          const replacement: string = possibleNumber.replace(/X/g, d);
          if (replacement[0] !== '0' && isPrime(+replacement)) {
            replacements.push(+replacement);
          }
        }
        digitReplacements.push(replacements);
      }
    }
  }

  return maxBy(digitReplacements, (a) => a.length)[0]!;
}
