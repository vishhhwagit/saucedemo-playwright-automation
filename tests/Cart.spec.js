const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPages');
const ProductsPage = require('../pages/ProductPages');
const CartPage = require('../pages/CartPage');
const users = require('../test-data/users.json');

test.describe('SauceDemo - Shopping Cart Module', () => {

    let productsPage;
    let cartPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await expect(page).toHaveURL(/inventory/);

        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
    });

    test('CART-001 - Verify navigation to Shopping Cart page', async ({ page }) => {

    await productsPage.cartIcon.click();

    await expect(page).toHaveURL(/cart/);

    await expect(cartPage.cartTitle).toHaveText('Your Cart');

});

test('CART-002 - Verify added product is displayed in Cart', async ({ page }) => {

    const productName = 'Sauce Labs Backpack';

    await productsPage.addProductToCart(productName);

    await productsPage.cartIcon.click();

    const cartItem = cartPage.getCartItem(productName);

    await expect(cartItem).toBeVisible();

    await expect(cartItem.locator('.inventory_item_name'))
        .toHaveText(productName);

    await expect(cartItem.locator('.inventory_item_price'))
        .toHaveText('$29.99');

    await expect(cartItem.locator('.cart_quantity'))
        .toHaveText('1');

});
test('CART-003 - Verify multiple products in Cart', async ({ page }) => {

    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');

    await productsPage.cartIcon.click();

    await expect(cartPage.cartItems).toHaveCount(2);

    await expect(cartPage.getCartItem('Sauce Labs Backpack')).toBeVisible();
    await expect(cartPage.getCartItem('Sauce Labs Bike Light')).toBeVisible();

});
test('CART-004 - Verify product removal from Cart', async ({ page }) => {

    const productName = 'Sauce Labs Backpack';

    await productsPage.addProductToCart(productName);
    await productsPage.cartIcon.click();

    await cartPage.removeProduct(productName);

    await expect(cartPage.cartItems).toHaveCount(0);

});
 test('CART-005 - Verify Continue Shopping navigation', async ({ page }) => {

    await productsPage.cartIcon.click();

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory/);
    await expect(productsPage.productCards).toHaveCount(6);

});
test('CART-006 - Verify Checkout navigation', async ({ page }) => {

    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.cartIcon.click();

    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

});


});