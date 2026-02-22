const {test, expect} = require('@playwright/test');

test('check title contains "Test App"', async ({page}) => {
    await page.goto('/wp-login.php');
    await expect(page).toHaveTitle(/Test App/);
});