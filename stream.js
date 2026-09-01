const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

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
      '--start-fullscreen',
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

  // 1. Cookies-ஐ ஏற்றுதல் (நீங்கள் JSON வடிவில் உருவாக்கியிருக்க வேண்டும்)
  try {
    if (fs.existsSync('cookies.json')) {
      const cookiesString = fs.readFileSync('cookies.json', 'utf8');
      const cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
      console.log('Cookies loaded successfully!');
    } else {
      console.log('cookies.json not found. Proceeding without cookies.');
    }
  } catch (err) {
    console.error('Error loading cookies:', err);
  }

  // 2. Bot-க்கான அடையாளங்களை மறைத்தல்
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
