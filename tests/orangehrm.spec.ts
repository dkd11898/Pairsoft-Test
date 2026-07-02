import { expect, test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { AdminPage } from '../src/pages/AdminPage';

test('login and delete second admin user on OrangeHRM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const adminPage = new AdminPage(page);

  await loginPage.goto();
  await loginPage.loginWithLabelCredentials();

  await expect(page).toHaveURL(/.*dashboard/);

  await adminPage.navigateToAdmin();
  const deletedUsername = await adminPage.deleteSecondUser();
  await adminPage.confirmDelete();
  await adminPage.assertUserDeleted(deletedUsername);
});
