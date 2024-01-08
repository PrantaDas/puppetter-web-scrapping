import { config } from "dotenv";
config();

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Define options interface for the RecaptchaPlugin
interface RecaptchaPluginOptions {
    provider: {
        id: string;
        token: string;
    };
    visualFeedback: boolean;
}

// Use StealthPlugin for avoiding bot detection
puppeteer.use(StealthPlugin());

// Use RecaptchaPlugin for solving reCAPTCHA challenges
puppeteer.use(
    RecaptchaPlugin({
        provider: { id: '2captcha', token: process.env.CAPTCHA_TOKEN },
        visualFeedback: true
    } as RecaptchaPluginOptions)
);

// Main function to perform the web scraping
(async () => {
    try {
        // Launch a headful browser
        const browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            args: [
                '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
                '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
                '--start-maximized'
            ]
        });

        // Create a new page
        const page = await browser.newPage();

        // Set default timeouts for the page
        page.setDefaultTimeout(300000);
        page.setDefaultNavigationTimeout(150000);

        // Navigate to the target URL
        await page.goto(process.env.URL!, {
            waitUntil: 'networkidle2'
        });

        console.log('=> Page loaded successfully');

        // Wait for the input field to be visible
        await page.waitForSelector("#curpinput", { visible: true });

        // Enter a sample CURP into the input field
        await page.$eval('#curpinput', (el: any) => el.value = process.env.IDENTIFIER);

        console.log('=> Trying to solve re-catpcha...');

        // Solve reCAPTCHA challenges
        const { solved } = await page.solveRecaptchas();
        if (solved) {
            console.log('=> ✔️ The captcha has been solved...');
        }

        console.log('=> Searching..');
        // Wait for the search button to be present
        await page.waitForSelector("#searchButton");

        // Click on the search button
        await page.click('#searchButton');

        // Create a Chrome DevTools Protocol session
        const client = await page.target().createCDPSession();

        // Set up download path for PDFs
        const downloadPath = path.join(process.cwd(), 'downloads');
        if (!existsSync(downloadPath)) mkdirSync(downloadPath);

        console.log('=> Download Location Created...');

        // Configure page to allow downloads
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath
        });

        // Wait for the download link to be present
        await page.waitForSelector("#download");

        console.log('=> Download link found...');

        // Click on the download link
        await page.click("#download");

        console.log('=> Pdf Downloaded successfully...');

        // Close the browser
        await browser.close();
    } catch (err) {
        console.log(err);
    }
})();
