
class ProductsPage {
    constructor(page) {
        this.page = page;

        // Products page elements
        this.productCards = page.locator('.inventory_item');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.productImages = page.locator('.inventory_item_img img');

        // Sorting dropdown
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');

        // Cart
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartIcon = page.locator('.shopping_cart_link');
    }

    // Get the number of displayed products
    async getProductCount() {
        return await this.productCards.count();
    }

    // Get all product names
    async getProductNames() {
        return await this.productNames.allTextContents();
    }

    // Get all product prices
    async getProductPrices() {
        return await this.productPrices.allTextContents();
    }

    // Verify product images are loaded
    async areProductImagesLoaded() {
    const count = await this.productImages.count();

    for (let i = 0; i < count; i++) {
        const image = this.productImages.nth(i);

        await image.waitFor();

        await image.evaluate(img => {
            if (!img.complete) {
                return new Promise(resolve => {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                });
            }
        });

        const isLoaded = await image.evaluate(img => {
            return img.complete && img.naturalWidth > 0;
        });

        if (!isLoaded) {
            return false;
        }
    }

    return count > 0;
}

    // Sort products
    async sortProducts(option) {
        await this.sortDropdown.selectOption(option);
    }

    // Get product card by name
    getProductCard(productName) {
        return this.page.locator('.inventory_item')
            .filter({
                has: this.page.locator('.inventory_item_name')
                    .getByText(productName, { exact: true })
            });
    }

    // Add a product to cart
    async addProductToCart(productName) {
        const product = this.getProductCard(productName);
        await product.getByRole('button', { name: 'Add to cart' }).click();
    }

    // Remove a product from the Products page
    async removeProductFromCart(productName) {
        const product = this.getProductCard(productName);
        await product.getByRole('button', { name: 'Remove' }).click();
    }

    // Get product button text
    async getProductButtonText(productName) {
        const product = this.getProductCard(productName);
        return await product.locator('button').textContent();
    }

    // Get cart badge count
    async getCartBadgeCount() {
        if (await this.cartBadge.count() === 0) {
            return 0;
        }

        return Number(await this.cartBadge.textContent());
    }

    // Open product details
    async openProductDetails(productName) {
        await this.productNames
            .getByText(productName, { exact: true })
            .click();
    }
}

module.exports = ProductsPage;
