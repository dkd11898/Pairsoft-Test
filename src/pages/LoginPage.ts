import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async getCredentialsFromLabel() {
    const usernameParagraph = this.page.locator('p:has-text("Username")').first();
    const passwordParagraph = this.page.locator('p:has-text("Password")').first();

    try {
      await Promise.all([
        usernameParagraph.waitFor({ state: 'attached', timeout: 8000 }),
        passwordParagraph.waitFor({ state: 'attached', timeout: 8000 })
      ]);

      const usernameLabelText = (await usernameParagraph.textContent())?.trim() ?? '';
      const passwordLabelText = (await passwordParagraph.textContent())?.trim() ?? '';

      if (!usernameLabelText.includes(':') || !passwordLabelText.includes(':')) {
        throw new Error('Label format unexpected');
      }

      const username = usernameLabelText.split(':').pop()?.trim();
      const password = passwordLabelText.split(':').pop()?.trim();

      if (!username || !password) throw new Error('Parsed empty');

      return { username, password };
    } catch (e) {
      throw new Error('Unable to fetch credentials from login label');
    }
  }

  async loginWithLabelCredentials() {
    const credentials = await this.getCredentialsFromLabel();
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard.*/);
  }
}
