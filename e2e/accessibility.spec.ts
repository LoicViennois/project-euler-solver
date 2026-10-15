import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

import { CodePage } from './pages/code.page';
import { ProblemsPage } from './pages/problems.page';

async function expectNoViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze();
  expect(results.violations).toEqual([]);
}

for (const theme of ['dark', 'light'] as const) {
  test.describe(`Accessibility (${theme} theme)`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        localStorage.setItem('pes_theme', JSON.stringify(value));
      }, theme);
    });

    test('problems page', async ({ page }) => {
      const problems = new ProblemsPage(page);
      await problems.goto();
      await problems.solveButton(1).click();
      await expect(problems.answer(1)).toHaveText('233168');
      // Let the answer and its timing finish fading in before checking contrast.
      await expect
        .poll(() =>
          page.evaluate(`document
            .querySelector('[data-testid="problem-1"]')
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running'
              && animation.effect.getComputedTiming().iterations !== Infinity)
            .length`),
        )
        .toBe(0);

      await expectNoViolations(page);
    });

    test('code page', async ({ page }) => {
      await new CodePage(page).goto(22);

      await expectNoViolations(page);
    });

    test('about dialog', async ({ page }) => {
      const problems = new ProblemsPage(page);
      await problems.goto();
      await problems.aboutButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      await expectNoViolations(page);
    });
  });
}
