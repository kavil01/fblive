const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { spawn } = require('child_process');

puppeteer.use(StealthPlugin());

(async () => {
  const streamUrl = process.env.FB_LIVE_URL;

  if (!streamUrl || streamUrl.trim() === "") {
    console.error("Critical Error: FB_LIVE_URL Secret is empty or missing in GitHub Settings!");
    process.exit(1);
  }

  console.log("Launching Puppeteer Stealth Browser...");

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1280,720',
      '--autoplay-policy=no-user-gesture-required'
    ],
    defaultViewport: { width: 1280, height: 720 }
  });

  const page = await browser.newPage();
  
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  console.log('Loading direct Netlify TV Player...');
  
  // புதிய Netlify TV Hosted URL
  await page.goto('https://courageous-longma-5917a5.netlify.app/', {
    waitUntil: 'networkidle2',
    timeout: 90000
  });

  console.log('Player loaded successfully! Starting FFmpeg Stream to Facebook...');

  const ffmpeg = spawn('ffmpeg', [
    '-f', 'x11grab',
    '-video_size', '1280x720',
    '-framerate', '30',
    '-i', ':99.0',
    '-f', 'lavfi',
    '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-tune', 'zerolatency',
    '-b:v', '2500k',
    '-maxrate', '2500k',
    '-bufsize', '5000k',
    '-pix_fmt', 'yuv420p',
    '-g', '60',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'flv',
    streamUrl.trim()
  ]);

  ffmpeg.stderr.on('data', (data) => {
    console.log(`FFmpeg Log: ${data.toString()}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  await new Promise(() => {});
})();
