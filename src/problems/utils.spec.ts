import { describe, expect, test } from 'vitest';

import {
  areDisjoint,
  arePermutations,
  arraysEqual,
  concat,
  difference,
  digits2number,
  haveDuplicates,
  haveSameLength,
  intersection,
  maxBy,
  nbOccurrences,
  number2digits,
  range,
  transpose,
  union,
  uniq,
  wordValue,
  zip,
} from './utils.js';

describe('Utils', () => {
  describe('number2digits', () => {
    test('123 digits', () => {
      expect(number2digits(123)).toEqual([1, 2, 3]);
    });
  });

  describe('digits2number', () => {
    test('[1, 2, 3] to number', () => {
      expect(digits2number([1, 2, 3])).toEqual(123);
    });
  });

  describe('wordValue', () => {
    test("wordValue of 'hello'", () => {
      expect(wordValue('hello')).toEqual(212);
    });
  });

  describe('haveSameLength', () => {
    test('haveSameLength true', () => {
      expect(haveSameLength([1, 2], [3, 4], [5, 6])).toBe(true);
    });
    test('haveSameLength false', () => {
      expect(haveSameLength([1, 2], [3, 4], [5, 6, 7])).toBe(false);
    });
  });

  describe('haveDuplicates', () => {
    test('haveDuplicates [1, 2, 2, 3]', () => {
      expect(haveDuplicates([1, 2, 2, 3])).toBe(true);
    });

    test('haveDuplicates [1, 2, 3]', () => {
      expect(haveDuplicates([1, 2, 3])).toBe(false);
    });
  });

  describe('nbOccurrences', () => {
    test('nbOccurrences of 2 in [1, 2, 2, 3]', () => {
      expect(nbOccurrences(2, [1, 2, 2, 3])).toEqual(2);
    });
  });

  describe('arePermutations', () => {
    test('arePermutations 123 and 321', () => {
      expect(arePermutations(123, 321)).toBe(true);
    });
  });

  describe('range', () => {
    test('range 0 to 4', () => {
      expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('uniq', () => {
    test('uniq of [1, 2, 2, 3]', () => {
      expect(uniq([1, 2, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('concat', () => {
    test('concat of [1, 2] and [3, 4]', () => {
      expect(concat([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
    });
  });

  describe('union', () => {
    test('union of [1, 2] and [2, 3]', () => {
      expect(union([1, 2], [2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('maxBy', () => {
    test('maxBy length of [1, 2] and [1, 2, 3]', () => {
      expect(
        maxBy(
          [
            [1, 2],
            [1, 2, 3],
          ],
          (a) => a.length,
        ),
      ).toEqual([1, 2, 3]);
    });
  });

  describe('arraysEqual', () => {
    test('arraysEqual [1, 2, 3] and [1, 2, 3]', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });
  });

  describe('transpose', () => {
    test('transpose of [[1, 2, 3], [1, 2, 3]]', () => {
      expect(
        transpose([
          [1, 2, 3],
          [1, 2, 3],
        ]),
      ).toEqual([
        [1, 1],
        [2, 2],
        [3, 3],
      ]);
    });
  });

  describe('zip', () => {
    test('zip of [1, 2, 3] and [1, 2, 3]', () => {
      expect(zip([1, 2, 3], ['a', 'b', 'c'])).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]);
    });
  });

  describe('difference', () => {
    test('difference of [1, 2, 3, 4] and [2, 3]', () => {
      expect(difference([1, 2, 3, 4], [2, 3])).toEqual([1, 4]);
    });
  });

  describe('intersection', () => {
    test('intersection of [1, 2, 3, 4] and [2, 3]', () => {
      expect(intersection([1, 2, 3, 4], [2, 3])).toEqual([2, 3]);
    });
  });

  describe('areDisjoint', () => {
    test('areDisjoint [1, 2, 3, 4] and [2, 3]', () => {
      expect(areDisjoint([1, 2, 3, 4], [2, 3])).toBe(false);
    });

    test('areDisjoint [1, 2] and [3, 4]', () => {
      expect(areDisjoint([1, 2], [3, 4])).toBe(true);
    });
  });
});
