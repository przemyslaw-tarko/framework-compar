const {defineConfig} = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    use:{
        baseURL: process.env.BASE_URL || 'http://wordpress'
    },
    report: [["junit", {outputFile: "/work/results/playwright/results.xml"}]]
});