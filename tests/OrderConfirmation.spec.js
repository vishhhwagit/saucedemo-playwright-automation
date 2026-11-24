const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPages');
const ProductsPage = require('../pages/ProductPages');
const CartPage = require('../pages/CartPage');
const OrderConfirmationPage = require('../pages/OrderConfirmationPage');
const users = require('../test-data/users.json');

test.describe('SauceDemo - Order Confirmation Module', () => {

    let orderConfirmationPage;

    test.beforeEach(async ({ page }) => {

        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        // Login
        await loginPage.open();
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        // Add product to cart
        await productsPage.addProductToCart('Sauce Labs Backpack');

        // Navigate to Cart
        await productsPage.cartIcon.click();

        // Checkout
        await cartPage.checkout();

        // Enter customer information
        await page.locator('#first-name').fill('Viswanath');
        await page.locator('#last-name').fill('B');
        await page.locator('#postal-code').fill('600001');

        await page.locator('#continue').click();

        // Finish order
        await page.locator('#finish').click();

        orderConfirmationPage = new OrderConfirmationPage(page);
    });

    // Tests will be added below
    test('ORD-001 - Verify successful order confirmation', async ({ page }) => {

    await expect(page).toHaveURL(/checkout-complete/);

    await expect(orderConfirmationPage.confirmationTitle)
        .toHaveText('Checkout: Complete!');

});
   test('ORD-002 - Verify confirmation message', async () => {

    await expect(orderConfirmationPage.confirmationHeader)
        .toHaveText('Thank you for your order!');

    await expect(orderConfirmationPage.confirmationMessage)
        .toContainText('Your order has been dispatched');

});
  test('ORD-003 - Verify order completion summary', async ({ page }) => {

    // Navigate back to Products page
    await page.goto('/inventory.html');

    // Add product to cart
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart('Sauce Labs Backpack');

    // Navigate to Cart
    await productsPage.cartIcon.click();

    const cartPage = new CartPage(page);
    await cartPage.checkout();

    // Enter customer information
    await page.locator('#first-name').fill('Viswanath');
    await page.locator('#last-name').fill('B');
    await page.locator('#postal-code').fill('600001');

    await page.locator('#continue').click();

    // Verify order summary
    await expect(page.locator('.cart_item')).toHaveCount(1);

    await expect(page.locator('.inventory_item_name'))
        .toHaveText('Sauce Labs Backpack');

    await expect(page.locator('.summary_total_label'))
        .toContainText('Total:');
});

  test('ORD-004 - Verify Back Home navigation', async ({ page }) => {

    await orderConfirmationPage.backHome();

    await expect(page).toHaveURL(/inventory/);

    await expect(page.locator('.inventory_list')).toBeVisible();

});

});