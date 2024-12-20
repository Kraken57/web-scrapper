import puppeteer from "puppeteer";

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();

  console.log("Navigating to page...");
  await page.goto("https://leetcode.com/problems/two-sum/", { waitUntil: "networkidle2" }); 

  console.log("Waiting for the content...");
  await page.waitForSelector('div[data-e2e-locator="console-testcase-input"]', {
    timeout: 60000, 
  });

  const testCase = await page.$eval(
    'div[data-e2e-locator="console-testcase-input"]',
    (el) => el.textContent.trim()
  );

  console.log("Fetched Test Case:", testCase);

  await browser.close();
})();
