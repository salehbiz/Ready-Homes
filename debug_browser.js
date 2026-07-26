const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to localhost:5173...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded. Capturing layout metrics...');
  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log('Scroll height:', height);
  
  await browser.close();
})();
