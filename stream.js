const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1280,720'
    ],
    defaultViewport: { width: 1280, height: 720 }
  });

  const page = await browser.newPage();

  // User Agent அமைத்தல்
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  try {
    console.log('Loading page via Netlify Proxy...');
    
    // உங்கள் புதிய Netlify URL இங்கு கொடுக்கப்பட்டுள்ளது
    await page.goto('https://precious-paprenjak-693d3b.netlify.app/', {
      waitUntil: 'networkidle2',
      timeout: 90000
    });

    console.log('Page loaded successfully without captcha!');
  } catch (err) {
    console.error('Error loading page:', err);
  }
})();
