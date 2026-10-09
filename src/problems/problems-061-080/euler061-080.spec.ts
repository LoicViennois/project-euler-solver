import { describe, expect, test } from 'vitest';

import { euler061 } from './euler061.js';
import { euler062 } from './euler062.js';
import { euler063 } from './euler063.js';
import { euler064 } from './euler064.js';
import { euler065 } from './euler065.js';
import { euler066 } from './euler066.js';
import { euler067 } from './euler067.js';

describe('Euler 061-080', () => {
  describe('euler061', () => {
    test('28684', () => {
      expect(euler061()).toBe(28684);
    });
  });

  describe('euler062', () => {
    test('127035954683', () => {
      expect(euler062()).toBe(127035954683);
    });
  });

  describe('euler063', () => {
    test('49', () => {
      expect(euler063()).toBe(49);
    });
  });

  describe('euler064', () => {
    test('1322', () => {
      expect(euler064()).toBe(1322);
    });
  });

  describe('euler065', () => {
    test('272', () => {
      expect(euler065()).toBe(272);
    });
  });

  describe('euler066', () => {
    test('661', () => {
      expect(euler066()).toBe(661);
    });
  });

  describe('euler067', () => {
    test('7273', () => {
      expect(euler067()).toBe(7273);
    });
  });
});
