import { test, expect } from '@playwright/test';

test.describe('Shopping Cart and Checkout', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/inventory/);
  });

  test('user can add a product to cart', async ({ page }) => {
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('user can remove a product from cart', async ({ page }) => {
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('cart shows correct number of items', async ({ page }) => {
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('complete end to end purchase flow', async ({ page }) => {
    // Add product to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Go to cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Start checkout
    await page.click('[data-test="checkout"]');

    // Fill customer info
    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // Verify order summary
    await expect(page.locator('.summary_info')).toBeVisible();

    // Complete order
    await page.click('[data-test="finish"]');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('checkout fails with missing customer info', async ({ page }) => {
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.click('[data-test="continue"]');
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

});