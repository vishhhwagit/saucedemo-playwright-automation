class CartPage{
    constructor(page){
        this.page = page ; 

        this.cartItems = page.locator('.cart_item');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.quantities = page.locator('.cart_quantity');

        this.continueShoppingButton = page.locator('#continue-shopping');
        this.checkoutButton = page.locator('#checkout');
        this.cartTitle = page.locator('.title');
    }

    async getCartItemCount(){
        return await this.cartItems.count();
    }
    async getProductPrices(){
        return await this.productPrices.allTextContents();
    }
    async continueShopping(){
        await this.continueShoppingButton.click();
    }
    async checkout(){
        await this.checkoutButton.click();
    }
    getCartItem(productName){
        return this.cartItems.filter({
            has: this.page.locator('.inventory_item_name',{
                hasText:productName
            })
        });
    }
    async removeProduct(productName){
        const product = this.getCartItem(productName);
        await product.getByRole('button',{name:'Remove'}).click();
    }
}
module.exports = CartPage;