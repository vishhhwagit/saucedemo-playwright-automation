
const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPages');
const ProductsPage = require('../pages/ProductPages');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');

const users = require('../test-data/users.json');

test.describe('SauceDemo - Checkout Module', () => {

    let productsPage;
    let cartPage;
    let checkoutPage;

    // Common setup before every test
    test.beforeEach(async ({ page }) => {

        const loginPage = new LoginPage(page);

        // Login
        await loginPage.open();

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        // Add product to cart
        productsPage = new ProductsPage(page);

        await productsPage.addProductToCart(
            'Sauce Labs Backpack'
        );

        // Navigate to Cart
        await productsPage.cartIcon.click();

        // Navigate to Checkout
        cartPage = new CartPage(page);

        await cartPage.checkout();

        // Initialize Checkout Page
        checkoutPage = new CheckoutPage(page);

    });

    // CHK-001: Verify Checkout Information page
    test('CHK-001 - Verify Checkout Information page', async ({ page }) => {

        await expect(page).toHaveURL(/checkout-step-one/);

        await expect(checkoutPage.continueButton).toBeVisible();

        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.lastNameInput).toBeVisible();
        await expect(checkoutPage.postalCodeInput).toBeVisible();

    });

    // CHK-002: Verify checkout with valid information
    test('CHK-002 - Checkout with valid customer information', async ({ page }) => {

        await checkoutPage.enterCustomerInformation(
            'Viswanath',
            'B',
            '600001'
        );

        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(/checkout-step-two/);

        await expect(checkoutPage.finishButton).toBeVisible();

    });

    // CHK-003: Verify First Name is mandatory
    test('CHK-003 - Verify First Name validation', async () => {

        await checkoutPage.enterCustomerInformation(
            '',
            'B',
            '600001'
        );

        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage)
            .toHaveText('Error: First Name is required');

    });

    // CHK-004: Verify Last Name is mandatory
    test('CHK-004 - Verify Last Name validation', async () => {

        await checkoutPage.enterCustomerInformation(
            'Viswanath',
            '',
            '600001'
        );

        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage)
            .toHaveText('Error: Last Name is required');

    });

    // CHK-005: Verify Postal Code is mandatory
    test('CHK-005 - Verify Postal Code validation', async () => {

        await checkoutPage.enterCustomerInformation(
            'Viswanath',
            'B',
            ''
        );

        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage)
            .toHaveText('Error: Postal Code is required');

    });

    // CHK-006: Verify checkout with all fields empty
    test('CHK-006 - Verify checkout with empty fields', async () => {

        await checkoutPage.enterCustomerInformation('', '', '');

        await checkoutPage.continueCheckout();

        await expect(checkoutPage.errorMessage)
            .toHaveText('Error: First Name is required');

    });

    // CHK-007: Verify Cancel button navigation
    test('CHK-007 - Verify Cancel button navigation', async ({ page }) => {

        await checkoutPage.cancelCheckout();

        await expect(page).toHaveURL(/cart/);

        await expect(page.locator('.title'))
            .toHaveText('Your Cart');

    });

    // CHK-008: Verify Checkout Overview
    test('CHK-008 - Verify Checkout Overview details', async ({ page }) => {

        await checkoutPage.enterCustomerInformation(
            'Viswanath',
            'B',
            '600001'
        );

        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(/checkout-step-two/);

        await expect(checkoutPage.cartItems).toHaveCount(1);

        await expect(page.locator('.inventory_item_name'))
            .toHaveText('Sauce Labs Backpack');

        await expect(checkoutPage.subtotal).toBeVisible();
        await expect(checkoutPage.tax).toBeVisible();
        await expect(checkoutPage.total).toBeVisible();

    });

});
