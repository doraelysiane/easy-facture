import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  // Fill login form
  console.log('Logging in...');
  await page.type('input[type="email"]', 'admin@izifacture.com');
  await page.type('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for navigation...');
  await page.waitForNavigation();
  
  console.log('Navigating to factures...');
  await page.goto('http://localhost:3000/factures');
  
  console.log('Opening invoice modal...');
  // Click the eye icon
  await page.waitForSelector('button .lucide-eye');
  const eyeButtons = await page.$$('button');
  for (const btn of eyeButtons) {
     const hasEye = await btn.$('.lucide-eye');
     if (hasEye) {
         await btn.click();
         break;
     }
  }
  
  console.log('Waiting for invoice preview to load...');
  await page.waitForSelector('#invoice-print-area', { visible: true, timeout: 5000 });
  
  console.log('Emulating print media...');
  await page.emulateMediaType('print');
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'print-test.png', fullPage: true });
  
  console.log('Checking DOM for invoice content...');
  const text = await page.$eval('#invoice-print-area', el => el.innerText);
  console.log('Invoice text content length:', text.length);
  if (text.length > 100) {
     console.log('SUCCESS: Invoice has content!');
  } else {
     console.log('ERROR: Invoice content is suspiciously short or empty!');
  }
  
  await browser.close();
  console.log('Done.');
})();
