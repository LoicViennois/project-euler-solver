import { describe, expect, test } from 'vitest';

import {
  dividers,
  factorial,
  gcd,
  isPrime,
  max,
  maxKey,
  min,
  mul,
  sieve,
  sum,
} from './maths.js';

describe('Maths', () => {
  describe('isPrime', () => {
    test('7 is prime', () => {
      expect(isPrime(7)).toBe(true);
    });
    test('8 is not prime', () => {
      expect(isPrime(8)).toBe(false);
    });
  });

  describe('sieve', () => {
    test('primes under 8', () => {
      expect(sieve(8)).toEqual([2, 3, 5, 7]);
    });
  });

  describe('dividers', () => {
    test('dividers of 8', () => {
      expect(dividers(8)).toEqual([1, 2, 4]);
    });
  });

  describe('sum', () => {
    test('sum of [1, 2, 3, 4]', () => {
      expect(sum([1, 2, 3, 4])).toBe(10);
    });
  });

  describe('mul', () => {
    test('mul of [1, 2, 3, 4]', () => {
      expect(mul([1, 2, 3, 4])).toBe(24);
    });
  });

  describe('min', () => {
    test('min of [1, 4, 3, 2]', () => {
      expect(min([1, 4, 3, 2])).toBe(1);
    });
  });

  describe('max', () => {
    test('max of [1, 4, 3, 2]', () => {
      expect(max([1, 4, 3, 2])).toBe(4);
    });
  });

  describe('maxKey', () => {
    test('maxKey of {"a": 1, "b": 4, "c": 3, "d": 2]', () => {
      expect(
        maxKey(
          new Map([
            ['a', 1],
            ['b', 4],
            ['c', 3],
            ['d', 2],
          ]),
        ),
      ).toBe('b');
    });
  });

  describe('factorial', () => {
    test('factorial of 4', () => {
      expect(factorial(4)).toBe(24);
    });
  });

  describe('gcd', () => {
    test('gcd of 12 and 8', () => {
      expect(gcd(12, 8)).toBe(4);
    });
  });
});
