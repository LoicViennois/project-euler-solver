import { expect, test } from '@playwright/test';

import { ProblemsPage } from './pages/problems.page';

test.describe('Problems', () => {
  let problems: ProblemsPage;

  test.beforeEach(async ({ page }) => {
    problems = new ProblemsPage(page);
    await problems.goto();
  });

  test('lists the problems with links to their code', async () => {
    await expect(problems.heading).toHaveText(
      'Project Euler, solved in your browser.',
    );
    await expect(problems.progress).toHaveText('0 of 67 solved');
    await expect(problems.codeLink(1)).toHaveAttribute('href', '/code/1');
    await expect(problems.tile(1)).toContainText('Multiples of 3 or 5');
    await expect(problems.answer(1)).toHaveText('?');
  });

  test('shows only the problem being worked on after the solved ones', async () => {
    await expect(problems.tile(67)).not.toContainText('Working on it');
    await expect(problems.tile(68)).toContainText('Working on it…');
    await expect(problems.tile(69)).toHaveCount(0);
    await expect(problems.tile(68).getByRole('button')).toHaveCount(0);
    await expect(problems.tile(68).getByRole('link')).toHaveCount(0);
  });

  test('solves a single problem', async () => {
    await problems.solveButton(1).click();

    await expect(problems.answer(1)).toHaveText('233168');
    await expect(problems.duration(1)).toContainText(/ms/);
    await expect(
      problems.tile(1).getByRole('button', { name: 'Solve problem 1 again' }),
    ).toBeVisible();
    await expect(problems.tile(1)).toHaveAttribute('data-solved', 'true');
    await expect(problems.answer(2)).toHaveText('?');
    await expect(problems.progress).toHaveText(/^1 of 67 solved in /);
  });

  test('solves all the problems', async () => {
    await problems.solveAllButton.click();

    await expect(problems.answer(1)).toHaveText('233168');
    await expect(problems.answer(10)).toHaveText('142913828922');
    await expect(problems.tile(10)).toHaveAttribute('data-solved', 'true');
  });

  test('resets the answers', async () => {
    await expect(problems.resetButton).toHaveAttribute('aria-disabled', 'true');
    await problems.solveButton(1).click();
    await expect(problems.answer(1)).toHaveText('233168');

    await problems.resetButton.click();

    await expect(problems.answer(1)).toHaveText('?');
    await expect(problems.duration(1)).toHaveText('');
    await expect(problems.progress).toHaveText('0 of 67 solved');
    await expect(problems.resetButton).toHaveAttribute('aria-disabled', 'true');
    await expect(problems.resetButton).toBeFocused();
  });

  test('solves a problem without opening its code', async ({ page }) => {
    await problems.solveButton(2).click();

    await expect(problems.answer(2)).toHaveText('4613732');
    await expect(page).toHaveURL('/');
  });

  test('keeps the answers when coming back from the code', async ({ page }) => {
    await problems.solveButton(3).click();
    await expect(problems.answer(3)).toHaveText('6857');

    await problems.codeLink(3).click();
    await expect(page).toHaveURL('/code/3');
    await page.getByRole('link', { name: 'Problems list' }).click();

    await expect(problems.answer(3)).toHaveText('6857');
  });
});
