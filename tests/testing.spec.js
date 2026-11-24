const{test , expect} = require('@playwright/test');
test('Verify SauceDemo website opens' , async({page})=>{
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
})