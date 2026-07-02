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
    await Promise.all([
      this.page.waitForURL('**/admin/viewSystemUsers'),
      this.systemUsersMenu.click()
    ]);
  }

  async deleteSecondUser() {
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
    await secondRow.locator('button:has(i[class*="bi-trash"])').click();
    return username;
  }

  async confirmDelete() {
    // Try several strategies to locate the actual confirmation control used by the app.
    // Some OrangeHRM builds render a visible overlay/dialog, others render inline buttons.
    // 1) Prefer an overlay/dialog if it's visible
    const visibleOverlay = this.page.locator('div.oxd-overlay:not(.oxd-overlay--hide)');
    if (await visibleOverlay.count() > 0) {
      // Look for common confirmation button texts inside the overlay
      const yesBtnInOverlay = visibleOverlay.locator('button:has-text("Yes")');
      const deleteBtnInOverlay = visibleOverlay.locator('button:has-text("Delete")');
      const confirmBtnInOverlay = visibleOverlay.locator('button:has-text("Confirm")');
      if (await yesBtnInOverlay.count() > 0) {
        await yesBtnInOverlay.first().click();
      } else if (await deleteBtnInOverlay.count() > 0) {
        await deleteBtnInOverlay.first().click();
      } else if (await confirmBtnInOverlay.count() > 0) {
        await confirmBtnInOverlay.first().click();
      } else {
        // fallback to any visible danger-style button in the overlay
        const danger = visibleOverlay.locator('button.oxd-button--label-danger');
        if (await danger.count() > 0) await danger.first().click();
      }
      await expect(visibleOverlay).toBeHidden({ timeout: 10000 });
      return;
    }

    // 2) If no overlay visible, try to find inline confirmation buttons anywhere on page
    const inlineYes = this.page.locator('button:has-text("Yes")');
    const inlineDelete = this.page.locator('button:has-text("Delete")');
    const inlineConfirm = this.page.locator('button:has-text("Confirm")');
    if (await inlineYes.count() > 0) {
      await inlineYes.first().click();
      return;
    }
    if (await inlineDelete.count() > 0) {
      await inlineDelete.first().click();
      return;
    }
    if (await inlineConfirm.count() > 0) {
      await inlineConfirm.first().click();
      return;
    }

    // 3) Last resort: click any visible danger-styled button
    const anyDanger = this.page.locator('button.oxd-button--label-danger');
    if (await anyDanger.count() > 0) {
      await anyDanger.first().click();
      return;
    }

    throw new Error('Unable to find a confirmation button to complete delete action.');
  }

  async assertUserDeleted(username: string) {
    await this.page.waitForTimeout(2000);
    const rows = this.userTableCards;
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const rowUsername = (await rows.nth(i).locator('div.oxd-table-cell').nth(1).textContent())?.trim();
      if (rowUsername === username) {
        throw new Error(`Expected username ${username} to be removed from the table, but it still exists.`);
      }
    }
  }
}
