class CheckoutPage {
    constructor(page) {
        this.page = page;

        // Checkout Information
        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput = page.locator('#last-name');
        this.postalCodeInput = page.locator('#postal-code');

        this.continueButton = page.locator('#continue');
        this.cancelButton = page.locator('#cancel');
        this.errorMessage = page.locator('[data-test="error"]');

        // Checkout Overview
        this.cartItems = page.locator('.cart_item');
        this.subtotal = page.locator('.summary_subtotal_label');
        this.tax = page.locator('.summary_tax_label');
        this.total = page.locator('.summary_total_label');
        this.finishButton = page.locator('#finish');
    }

    async enterCustomerInformation(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continueCheckout() {
        await this.continueButton.click();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }
}

module.exports = CheckoutPage;