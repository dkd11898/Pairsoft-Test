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
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }

  async getCredentialsFromLabel() {
    const usernameParagraph = this.page.locator('p:has-text("Username")').first();
    const passwordParagraph = this.page.locator('p:has-text("Password")').first();

    await Promise.all([
      usernameParagraph.waitFor({ state: 'attached', timeout: 15000 }),
      passwordParagraph.waitFor({ state: 'attached', timeout: 15000 })
    ]);

    const usernameLabelText = (await usernameParagraph.textContent())?.trim() ?? '';
    const passwordLabelText = (await passwordParagraph.textContent())?.trim() ?? '';

    if (!usernameLabelText.includes(':') || !passwordLabelText.includes(':')) {
      throw new Error('Unable to locate username and password labels on the login page.');
    }

    const username = usernameLabelText.split(':').pop()?.trim();
    const password = passwordLabelText.split(':').pop()?.trim();

    if (!username || !password) {
      throw new Error('Login credentials could not be parsed from the label text.');
    }

    return { username, password };
  }

  async loginWithLabelCredentials() {
    const credentials = await this.getCredentialsFromLabel();
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await Promise.all([
      this.page.waitForNavigation({ url: /.*dashboard.*/, waitUntil: 'networkidle' }),
      this.loginButton.click()
    ]);
  }
}
