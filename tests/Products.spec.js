const {test, expect} = require('@playwright/test');
const LoginPage = require('../pages/LoginPages');
const ProductsPage = require('../pages/ProductPages');
const users = require('../test-data/users.json');
test.describe('SAUCEDEMO- PRODUCTS MODULE',()=>{
    let productsPage;

    test.beforeEach(async({page})=>{
        const loginPage= new LoginPage(page);
        await loginPage.open();

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );
        await expect(page).toHaveURL(/inventory/);
        productsPage = new ProductsPage(page);
    });
    // prod -001 
     
    test('PROD-001 - Verify all prod dis on page',async({page})=>{
        await expect(productsPage.productCards).toHaveCount(6);
    });

    //prod 2 

    test('PROD - 002 verify the names and prices ', async({page})=>{
        const names = await productsPage.getProductNames();
         const prices = await productsPage.getProductPrices();

        expect(names).toHaveLength(6);
        expect(prices).toHaveLength(6);

        for (const name of names) {
            expect(name.trim().length).toBeGreaterThan(0);
        }

        for (const price of prices) {
            expect(price).toMatch(/^\$\d+\.\d{2}$/);
        }

    });

     test('PROD-003 - Verify product images are displayed', async ({ page }) => {

        await expect(productsPage.productImages).toHaveCount(6);

        expect(await productsPage.areProductImagesLoaded()).toBe(true);

    });

    // PROD-004
    test('PROD-004 - Verify product sorting options', async ({ page }) => {

        // Name A to Z
        await productsPage.sortProducts('az');

        let names = await productsPage.getProductNames();

        expect(names).toEqual(
            [...names].sort((a, b) => a.localeCompare(b))
        );

        // Name Z to A
        await productsPage.sortProducts('za');

        names = await productsPage.getProductNames();

        expect(names).toEqual(
            [...names].sort((a, b) => b.localeCompare(a))
        );

        // Price low to high
        await productsPage.sortProducts('lohi');

        let prices = await productsPage.getProductPrices();

        let numericPrices = prices.map(price =>
            Number(price.replace('$', ''))
        );

        expect(numericPrices).toEqual(
            [...numericPrices].sort((a, b) => a - b)
        );

        // Price high to low
        await productsPage.sortProducts('hilo');

        prices = await productsPage.getProductPrices();

        numericPrices = prices.map(price =>
            Number(price.replace('$', ''))
        );

        expect(numericPrices).toEqual(
            [...numericPrices].sort((a, b) => b - a)
        );

    });

    // PROD-005
    test('PROD-005 - Add a product to cart', async ({ page }) => {

        const productName = 'Sauce Labs Backpack';

        await productsPage.addProductToCart(productName);

        await expect(
            productsPage.getProductCard(productName)
                .getByRole('button', { name: 'Remove' })
        ).toBeVisible();

        await expect(productsPage.cartBadge).toHaveText('1');

    });

    // PROD-006
    test('PROD-006 - Remove a product from Products page', async ({ page }) => {

        const productName = 'Sauce Labs Backpack';

        await productsPage.addProductToCart(productName);

        await expect(productsPage.cartBadge).toHaveText('1');

        await productsPage.removeProductFromCart(productName);

        await expect(
            productsPage.getProductCard(productName)
                .getByRole('button', { name: 'Add to cart' })
        ).toBeVisible();

        await expect(productsPage.cartBadge).toHaveCount(0);

    });

    // PROD-007
    test('PROD-007 - Verify product details page', async ({ page }) => {

        const productName = 'Sauce Labs Backpack';

        await productsPage.openProductDetails(productName);

        await expect(page.locator('.inventory_details_name'))
            .toHaveText(productName);

        await expect(page.locator('.inventory_details_desc'))
            .toBeVisible();

        await expect(page.locator('.inventory_details_price'))
            .toBeVisible();

        await expect(page.locator('.inventory_details_img'))
            .toBeVisible();

    });

})