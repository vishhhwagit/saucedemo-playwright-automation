
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

    testDir: './tests',

    timeout: 30000,

    expect: {
        timeout: 5000
    },

    reporter: 'html',

    use: {
        baseURL: 'https://www.saucedemo.com',

        browserName: 'chromium',

        headless: false,

        screenshot: 'only-on-failure',

        trace: 'on-first-retry'
    }
});
