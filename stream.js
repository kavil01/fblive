const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-infobars',
      '--disable-features=Translate',
      '--start-fullscreen',
      '--window-size=1280,720',
      '--autoplay-policy=no-user-gesture-required'
    ],
    defaultViewport: {
      width: 1280,
      height: 720
    }
  });

  const page = await browser.newPage();
  
  // Accept dialogs Automatically
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.goto('https://kingfmtamilgroup.blogspot.com/', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('Page successfully loaded!');
})();
