// index.ts
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
// Sleep function for handling timing
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
// Main scraper class
class LeetCodeScraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    async initialize() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        this.page = await this.browser.newPage();
    }
    async fetchTestCases(url) {
        if (!this.page) {
            throw new Error('Page not initialized');
        }
        try {
            await this.initialize();
            if (!this.page) {
                throw new Error('Page initialization failed');
            }
            await this.page.goto(url, { waitUntil: 'networkidle0' });
            // Wait for test case buttons
            await this.page.waitForSelector('[data-e2e-locator="console-testcase-tag"]');
            const testCases = [];
            // Get all test case buttons
            const buttons = await this.page.$$('[data-e2e-locator="console-testcase-tag"]');
            console.log(`Found ${buttons.length} test cases`);
            // Process each test case
            for (let i = 0; i < buttons.length; i++) {
                console.log(`Processing test case ${i + 1}`);
                // Click the button and wait for content to load
                await buttons[i].click();
                await sleep(1000); // Wait for content to update
                // Extract test case data
                const testCaseData = await this.extractTestCaseData(i + 1);
                testCases.push(testCaseData);
                // Additional verification step
                const inputField = await this.page.$('[data-e2e-locator="console-testcase-input"]');
                if (inputField) {
                    const text = await inputField.evaluate(el => el.textContent);
                    console.log(`Verified test case ${i + 1} input: ${text}`);
                }
            }
            return testCases;
        }
        catch (error) {
            console.error('Error fetching test cases:', error);
            throw error;
        }
        finally {
            await this.cleanup();
        }
    }
    async extractTestCaseData(caseNumber) {
        if (!this.page) {
            throw new Error('Page not initialized');
        }
        const data = await this.page.evaluate(() => {
            const input = document.querySelector('[data-e2e-locator="console-testcase-input"]');
            const output = document.querySelector('[data-e2e-locator="console-expected-output"]');
            return {
                input: input?.textContent?.trim() || '',
                expectedOutput: output?.textContent?.trim() || ''
            };
        });
        return {
            caseNumber,
            ...data,
            timestamp: new Date().toISOString()
        };
    }
    async saveTestCases(testCases, outputDir) {
        await fs.mkdir(outputDir, { recursive: true });
        for (const testCase of testCases) {
            const inputPath = path.join(outputDir, `input_${testCase.caseNumber}.txt`);
            const outputPath = path.join(outputDir, `output_${testCase.caseNumber}.txt`);
            await fs.writeFile(inputPath, testCase.input);
            await fs.writeFile(outputPath, testCase.expectedOutput);
        }
    }
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}
class CodeRunner {
    constructor(language) {
        this.language = language;
        this.commands = {
            'python': {
                run: 'python3'
            },
            'cpp': {
                compile: 'g++ -std=c++17',
                run: './'
            }
        };
    }
    async runCode(sourceFile, inputFile) {
        // Implementation for running code with different languages
        // This is a placeholder - implement actual code execution logic
        return '';
    }
}
// Main execution function
const runScraper = async (url, outputDir = './testcases') => {
    const scraper = new LeetCodeScraper();
    try {
        console.log('Starting test case extraction...');
        const testCases = await scraper.fetchTestCases(url);
        console.log(`Successfully extracted ${testCases.length} test cases`);
        await scraper.saveTestCases(testCases, outputDir);
        console.log(`Test cases saved to ${outputDir}`);
        return testCases;
    }
    catch (error) {
        console.error('Failed to extract test cases:', error);
        throw error;
    }
};
export { LeetCodeScraper, CodeRunner, runScraper };
