import puppeteer from "puppeteer";

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: false }); // Keep the browser visible
  const page = await browser.newPage();

  console.log("Navigating to page...");
  await page.goto("https://leetcode.com/problems/two-sum/", { waitUntil: "networkidle2" });

  console.log("Waiting for the test case elements...");
  await page.waitForSelector('button[data-e2e-locator="console-testcase-tag"]', { timeout: 60000 });

  // Get the number of test cases
  const testCaseButtons = await page.$$eval(
    'button[data-e2e-locator="console-testcase-tag"]',
    (buttons) => buttons.map((btn) => btn.textContent.trim())
  );

  console.log(`Found ${testCaseButtons.length} test cases.`);

  const testCases = [];
  for (let i = 0; i < testCaseButtons.length; i++) {
    console.log(`Selecting ${testCaseButtons[i]}...`);

    // Click the test case button
    await page.click(`button[data-e2e-locator="console-testcase-tag"]:nth-child(${i + 1})`);

    // Wait for the test case data to load
    await page.waitForSelector('div[data-e2e-locator="console-testcase-input"]');

    // Fetch the input values
    const nums = await page.$eval(
      'div[data-e2e-locator="console-testcase-input"]',
      (el) => el.textContent.trim()
    );

    testCases.push({
      caseName: testCaseButtons[i],
      nums,
    });
  }

  console.log("Fetched Test Cases:");
  console.log(testCases);

  await browser.close();
})();
