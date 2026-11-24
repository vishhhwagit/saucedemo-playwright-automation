const{test,expect} = require('@playwright/test');
const LoginPage = require("../pages/LoginPages");
const users = require('../test-data/users.json');
test.describe('SauceDemo - Login Module',()=>{
    test('LOGIN-001 - login with valid credentials' , async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );
        await expect(page).toHaveURL(/inventory/);
    });


    test('LOGIN-002 - LOGIN WITH INVALID', async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await loginPage.login(
            users.invalidUser.username,
            users.invalidUser.password
        );
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
            'Username and password do not match'
        );
    });
    test('LOGIN-003 - LOGIN WITH LOCKED OUT USER', async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await loginPage.login(
            users.lockedUser.username,
            users.lockedUser.password
        )

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText('locked out');
    });
    test('LOGIN-004 LOGIN WITH EMPTY USERNAME', async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await loginPage.login('', users.validUser.password);

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText('Username is required');

    });

    test('LOGIN-005 LOGIN WITH EMPTY PASSWORD', async({page})=>{
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login(users.validUser.username , '');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText('Password is required');
    })


    test('LOGIN-006 LOGIN WITH BOTH FIELDS MTY' , async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.open();

        await loginPage.login('', '');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
        'Username is required');

    });

    test('LOGIN-007 - Verify password is masked', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.enterPassword('secret_sauce');

    await expect(loginPage.passwordInput)
        .toHaveAttribute('type', 'password');
});
 });

