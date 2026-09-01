const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Stealth plugin மூலம் Bot கண்டறிதலைத் தடுத்தல்
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1280,720'
    ],
    defaultViewport: {
      width: 1280,
      height: 720
    }
  });

  const page = await browser.newPage();

  // உண்மையான உலாவியைப் போன்ற User-Agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  // Bot-க்கான அடையாளங்களை மறைத்தல்
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  try {
    console.log('Loading page...');
    await page.goto('https://kingfmtamilgroup.blogspot.com/', {
      waitUntil: 'networkidle2',
      timeout: 90000
    });
    console.log('Page loaded successfully!');
  } catch (err) {
    console.error('Error loading page:', err);
  }
})();
