import { expect, type Locator, type Page } from '@playwright/test';

export class ProblemsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly solveAllButton: Locator;
  readonly progress: Locator;
  readonly githubLink: Locator;
  readonly aboutButton: Locator;
  readonly themeToggle: Locator;
  readonly buildInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.solveAllButton = page.getByRole('button', { name: /^Solve all/ });
    this.progress = page.getByRole('status').filter({ hasText: 'solved' });
    this.githubLink = page
      .getByRole('banner')
      .getByRole('link', { name: 'GitHub repository' });
    this.aboutButton = page
      .getByRole('banner')
      .getByRole('button', { name: 'About' });
    this.themeToggle = page
      .getByRole('banner')
      .getByRole('button', { name: /Switch to (light|dark) theme/ });
    this.buildInfo = page.getByTestId('build-info');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveTitle('Project Euler Solver');
  }

  tile(id: number): Locator {
    return this.page.getByTestId(`problem-${id}`);
  }

  codeLink(id: number): Locator {
    return this.tile(id).getByRole('link', {
      name: `Problem ${id}`,
      exact: true,
    });
  }

  solveButton(id: number): Locator {
    return this.tile(id).getByRole('button', { name: `Solve problem ${id}` });
  }

  answer(id: number): Locator {
    return this.tile(id).getByTestId('answer');
  }

  duration(id: number): Locator {
    return this.tile(id).getByTestId('duration');
  }
}
