import { expect, test } from '@playwright/test';

import { ProblemsPage } from './pages/problems.page';

test.describe('Navigation', () => {
  test('redirects unknown routes to the problems', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page).toHaveURL('/');
    await expect(new ProblemsPage(page).heading).toBeVisible();
  });

  test('goes home from the header title', async ({ page }) => {
    await page.goto('/code/1');

    await page
      .getByRole('link', { name: 'Project Euler Solver, home' })
      .click();

    await expect(page).toHaveURL('/');
  });

  test('links to the GitHub repository and the build commit', async ({
    page,
  }) => {
    const problems = new ProblemsPage(page);
    await problems.goto();

    await expect(problems.githubLink).toHaveAttribute(
      'href',
      'https://github.com/LoicViennois/project-euler-solver',
    );
    await expect(problems.buildInfo.getByRole('link')).toHaveAttribute(
      'href',
      /^https:\/\/github\.com\/LoicViennois\/project-euler-solver/,
    );
  });

  test('shows the about dialog', async ({ page }) => {
    const problems = new ProblemsPage(page);
    await problems.goto();

    await problems.aboutButton.click();

    const dialog = page.getByRole('dialog', { name: 'About' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId('commit-link')).toBeVisible();
    await expect(
      dialog.getByRole('link', { name: 'MIT License' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/LoicViennois/project-euler-solver/blob/master/LICENSE',
    );
    await expect(
      dialog.getByRole('link', { name: 'Open an issue on GitHub' }),
    ).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(problems.aboutButton).toBeFocused();
  });

  test('switches theme and remembers it', async ({ page }) => {
    const problems = new ProblemsPage(page);
    await problems.goto();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await problems.themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });
});
