class LoginPage{
  constructor(page){
    this.page = page;

    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // navigate to login page 

  async open(){
    await this.page.goto('/');
  }
  // enter username 

  async enterUsername(username){
    await this.usernameInput.fill(username);
  }
   // Enter password
    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    // Click login button
    async clickLogin() {
        await this.loginButton.click();
    }

    // Reusable login function
    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }

}
module.exports = LoginPage;