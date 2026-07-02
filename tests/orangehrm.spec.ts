import { expect, test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { AdminPage } from '../src/pages/AdminPage';

test('login and delete second admin user on OrangeHRM', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const adminPage = new AdminPage(page);

  await test.step('Login', async () => {
    await loginPage.goto();
    await loginPage.loginWithLabelCredentials();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  await test.step('Navigate to Admin', async () => {
    await adminPage.navigateToAdmin();
  });

  await test.step('Delete second user', async () => {
    const rowCount = await adminPage.getUserRowCount();
    if (rowCount < 2) {
      // create a test user so the delete flow can run reliably
      await adminPage.addTestUser();
      // ensure the table is refreshed
      await adminPage.navigateToAdmin();
    }
    const deletedUsername = await adminPage.deleteSecondUser();
    await adminPage.confirmDelete();
    await adminPage.assertUserDeleted(deletedUsername);
  });
});
