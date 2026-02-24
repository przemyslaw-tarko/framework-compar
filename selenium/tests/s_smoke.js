import fs from 'fs';
import path from 'path';
import {Builder} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import junit from 'junit-report-builder';

const BASE_URL = process.env.BASE_URL || 'http://wordpress';
const SELENIUM_REMOTE_URL = process.env.SELENIUM_REMOTE_URL || 'http://localhost:4444/wd/hub';
const REPORT_PATH = process.env.REPORT_PATH || '/work/results/selenium/results.xml';

async function runSmokeTest(){
    const options = new chrome.Options();
    options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');
    
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer(SELENIUM_REMOTE_URL)
        .build();

    const testCase = junit
        .testSuite()
        .name('selenium-smoke-test')
        .testCase()
        .className('selenium')
        .name('title contains "Test App"');

    const start = Date.now();

    try{
        const targetUrl = new URL('wp-login.php', BASE_URL).toString();
        await driver.get(targetUrl);
        const title = await driver.getTitle();
        if (!title.includes('Test App')) {
            throw new Error(`Title does not contain "Test App". Actual title: "${title}"`);
        }
        testCase.time((Date.now() - start) / 1000);
    } catch (error) {
        testCase.failure(error.message || String(error));
        testCase.time((Date.now() - start) / 1000);
        throw error;
    } finally{
        await driver.quit();
        fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
        junit.writeTo(REPORT_PATH);
    }
}

runSmokeTest().catch(() => process.exit(1));
// oby to kurwa zadziałalo