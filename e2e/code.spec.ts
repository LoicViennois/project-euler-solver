import { expect, test } from '@playwright/test';

import { CodePage } from './pages/code.page';
import { ProblemsPage } from './pages/problems.page';

test.describe('Code', () => {
  test('opens the code of a problem from its tile', async ({ page }) => {
    const problems = new ProblemsPage(page);
    await problems.goto();

    await problems.codeLink(1).click();

    const code = new CodePage(page);
    await code.expectSolution(1);
    await expect(
      page.getByRole('link', { name: 'Problem 1 on Project Euler' }),
    ).toHaveAttribute('href', 'https://projecteuler.net/problem=1');
  });

  test('switches between solutions with the arrow keys', async ({ page }) => {
    const code = new CodePage(page);
    await code.goto(1);

    await page.keyboard.press('ArrowRight');
    await code.expectSolution(2);

    await page.keyboard.press('ArrowLeft');
    await code.expectSolution(1);
  });

  test('moves to the previous and next solutions', async ({ page }) => {
    const code = new CodePage(page);
    await code.goto(1);
    await expect(code.otherSolutions.getByRole('link')).toHaveCount(1);

    await code.siblingLink(2).click();
    await code.expectSolution(2);

    await code.siblingLink(1).click();
    await code.expectSolution(1);
  });

  test('solves the problem being read', async ({ page }) => {
    const code = new CodePage(page);
    await code.goto(1);

    await page.getByRole('button', { name: 'Solve problem 1' }).click();

    await expect(code.answer).toHaveText('233168');
  });

  test('goes back to the problems', async ({ page }) => {
    const code = new CodePage(page);
    await code.goto(1);

    await code.backLink.click();

    await expect(page).toHaveURL('/');
    await expect(new ProblemsPage(page).heading).toBeVisible();
  });

  test('opens the first solution when none is given', async ({ page }) => {
    await page.goto('/code');
    await new CodePage(page).expectSolution(1);
  });

  test('redirects to the problems when a solution does not exist', async ({
    page,
  }) => {
    await page.goto('/code/68');
    await expect(page).toHaveURL('/');
  });
});
