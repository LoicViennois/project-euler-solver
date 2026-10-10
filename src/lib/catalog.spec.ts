import { describe, expect, it } from 'vitest';

import { allIds, problemTitle } from './catalog';

describe('catalog', () => {
  it('has a title for every problem shown (run `pnpm titles` if not)', () => {
    const missing = allIds.filter((id) => !problemTitle(id));
    expect(missing).toEqual([]);
  });
});
