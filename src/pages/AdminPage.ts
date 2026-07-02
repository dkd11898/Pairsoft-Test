import { Locator, Page, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly systemUsersMenu: Locator;
  readonly userTableCards: Locator;
  readonly confirmationButton: Locator;
  readonly modalContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.systemUsersMenu = page.locator('a.oxd-main-menu-item:has(span:has-text("Admin"))');
    this.userTableCards = page.locator('div.oxd-table-body > div.oxd-table-card');
    this.confirmationButton = page.locator('button.oxd-button--label-danger');
    this.modalContainer = page.locator('div.oxd-modal-container');
  }

  async navigateToAdmin() {
    await expect(this.systemUsersMenu).toBeVisible({ timeout: 10000 });
    // Click without waiting for navigation so we can wait for the actual UI element that indicates the Admin view
    await this.systemUsersMenu.click({ noWaitAfter: true });
    // Wait for the system users table DOM to appear (cards may render later)
    try {
      await this.page.waitForFunction(() => !!document.querySelector('div.oxd-table-body > div.oxd-table-card'), null, { timeout: 15000 });
    } catch (e) {
      // Fallback: the page may require clicking the Search button to populate results
      const searchBtn = this.page.locator('button:has-text("Search")').first();
      if (await searchBtn.count() > 0) {
        await searchBtn.click({ force: true });
      }
      await this.page.waitForFunction(() => !!document.querySelector('div.oxd-table-body > div.oxd-table-card'), null, { timeout: 15000 });
    }
  }

  async deleteSecondUser() {
    // Ensure the table has rendered before counting rows. Wait for any card to appear.
    await this.page.waitForFunction(() => !!document.querySelector('div.oxd-table-body > div.oxd-table-card'), null, { timeout: 30000 });
    const rowCount = await this.userTableCards.count();
    if (rowCount < 2) {
      throw new Error(`Expected at least 2 user rows before deleting, but found ${rowCount}.`);
    }
    const secondRow = this.userTableCards.nth(1);
    const usernameCell = secondRow.locator('div.oxd-table-cell').nth(1);
    const username = (await usernameCell.textContent())?.trim() ?? '';
    if (!username) {
      throw new Error('Unable to read the username from the second row.');
    }
    await secondRow.locator('button:has(.bi-trash)').click();
    return username;
  }

  async confirmDelete() {
    // Wait for the confirmation modal or button, then click the 'Yes, Delete' action.
    const confirmBtn = this.page.getByRole('button', { name: /Yes, Delete/i });
    try {
      await expect(confirmBtn).toBeVisible({ timeout: 15000 });
      await confirmBtn.click();
      return;
    } catch (e) {
      // Fallback: wait for any button with the confirmation text and click it
      await this.page.waitForSelector('button:has-text("Yes, Delete")', { timeout: 15000 });
      await this.page.click('button:has-text("Yes, Delete")');
    }
  }

  async assertUserDeleted(username: string) {
    // Wait until the username no longer appears in the table
    const usernameLocator = this.page.locator(`div.oxd-table-body >> text=${username}`);
    await expect(usernameLocator).toHaveCount(0, { timeout: 15000 });
  }
}
