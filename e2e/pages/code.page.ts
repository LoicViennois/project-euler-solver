import { expect, type Locator, type Page } from '@playwright/test';

export class CodePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly code: Locator;
  readonly backLink: Locator;
  readonly answer: Locator;
  readonly otherSolutions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.code = page.locator('pre code.hljs');
    this.backLink = page.getByRole('link', { name: 'Problems list' });
    this.answer = page.getByRole('main').getByTestId('answer');
    this.otherSolutions = page.getByRole('navigation', {
      name: 'Other solutions',
    });
  }

  async goto(id: number): Promise<void> {
    await this.page.goto(`/code/${id}`);
    await this.expectSolution(id);
  }

  async expectSolution(id: number): Promise<void> {
    const name = `euler${String(id).padStart(3, '0')}`;
    await expect(this.page).toHaveURL(`/code/${id}`);
    await expect(this.heading).toHaveText(`${name}.ts`);
    await expect(this.code).toContainText(`export function ${name}()`);
  }

  siblingLink(id: number): Locator {
    return this.otherSolutions.getByRole('link', {
      name: `euler${String(id).padStart(3, '0')}`,
    });
  }
}
