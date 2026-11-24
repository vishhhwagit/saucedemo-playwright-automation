class OrderConfirmationPage {
    constructor(page) {
        this.page = page;

        this.confirmationTitle = page.locator('.title');
        this.confirmationHeader = page.locator('.complete-header');
        this.confirmationMessage = page.locator('.complete-text');
        this.backHomeButton = page.locator('#back-to-products');
    }

    async getConfirmationTitle() {
        return await this.confirmationTitle.textContent();
    }

    async getConfirmationMessage() {
        return await this.confirmationMessage.textContent();
    }

    async backHome() {
        await this.backHomeButton.click();
    }
}

module.exports = OrderConfirmationPage;