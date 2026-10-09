import { expect, test } from '@playwright/test';

import { ProblemsPage } from './pages/problems.page';

test.describe('Problems', () => {
  let problems: ProblemsPage;

  test.beforeEach(async ({ page }) => {
    problems = new ProblemsPage(page);
    await problems.goto();
  });

  test('lists the problems with links to Project Euler', async () => {
    await expect(problems.heading).toHaveText(
      'Project Euler, solved in your browser.',
    );
    await expect(problems.progress).toHaveText('0 of 67 solved');
    await expect(problems.problemLink(1)).toHaveAttribute(
      'href',
      'https://projecteuler.net/problem=1',
    );
    await expect(problems.answer(1)).toHaveText('—');
  });

  test('marks problems without a solution yet', async () => {
    await expect(problems.tile(67)).not.toContainText('Not solved yet');
    await expect(problems.tile(68)).toContainText('Not solved yet');
    await expect(problems.tile(68).getByRole('button')).toHaveCount(0);
    await expect(
      problems.tile(68).getByRole('link', { name: /Code/ }),
    ).toHaveCount(0);
  });

  test('solves a single problem', async () => {
    await problems.solveButton(1).click();

    await expect(problems.answer(1)).toHaveText('233168');
    await expect(problems.duration(1)).toContainText(/ms/);
    await expect(
      problems.tile(1).getByRole('button', { name: 'Solve problem 1 again' }),
    ).toBeVisible();
    await expect(problems.tile(1)).toHaveAttribute('data-solved', 'true');
    await expect(problems.answer(2)).toHaveText('—');
    await expect(problems.progress).toHaveText(/^1 of 67 solved in /);
  });

  test('solves a group of ten problems', async () => {
    await problems.solveGroupButton(1, 10).click();

    await expect(problems.answer(1)).toHaveText('233168');
    await expect(problems.answer(2)).toHaveText('4613732');
    await expect(problems.answer(10)).toHaveText('142913828922');
    await expect(problems.progress).toHaveText(/^10 of 67 solved in /);
    await expect(problems.answer(11)).toHaveText('—');
  });

  test('offers to solve only the problems with a solution in the last group', async () => {
    await expect(problems.solveGroupButton(61, 67)).toBeVisible();
  });

  test('keeps the answers when coming back from the code', async ({ page }) => {
    await problems.solveButton(3).click();
    await expect(problems.answer(3)).toHaveText('6857');

    await problems.codeLink(3).click();
    await expect(page).toHaveURL('/code/3');
    await page.getByRole('link', { name: 'All problems' }).click();

    await expect(problems.answer(3)).toHaveText('6857');
  });
});
