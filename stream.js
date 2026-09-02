const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { spawn } = require('child_process');

puppeteer.use(StealthPlugin());

(async () => {
  const streamUrl = process.env.FB_LIVE_URL;

  if (!streamUrl) {
    console.error("Error: FB_LIVE_URL Secret is missing!");
    process.exit(1);
  }

  // 1. Puppeteer உலாவியைத் தொடங்குதல்
  const browser = await puppeteer.launch({
    headless: false, // DISPLAY-ல் திரையைக் காட்ட false வைக்க வேண்டும்
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,720',
      '--autoplay-policy=no-user-gesture-required'
    ],
    defaultViewport: { width: 1280, height: 720 }
  });

  const page = await browser.newPage();
  
  console.log('Loading page via Netlify Proxy...');
  await page.goto('https://precious-paprenjak-693d3b.netlify.app/', {
    waitUntil: 'networkidle2',
    timeout: 90000
  });

  console.log('Page loaded! Starting FFmpeg Stream to Facebook...');

  // 2. FFmpeg மூலம் Xvfb திரையைப் பிடித்து Facebook-க்கு அனுப்புதல்
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
    streamUrl
  ]);

  // Logs சரிபார்த்தல்
  ffmpeg.stderr.on('data', (data) => {
    console.log(`FFmpeg Log: ${data.toString()}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
  });

  // Keep-alive loop
  await new Promise(() => {});
})();
