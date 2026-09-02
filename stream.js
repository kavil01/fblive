const { execSync, spawn } = require('child_process');

(async () => {
  const fbStreamUrl = process.env.FB_LIVE_URL;
  
  // உங்கள் YouTube Live Video Link
  const ytLiveUrl = 'https://www.youtube.com/watch?v=7Wv5ZXjWzac'; 
  
  // ஓடும் செய்திகள் (News Tagline Text)
  const newsTickerText = 'KINGTAMIL MEDIA LIVE - 24/7 NEWS & ENTERTAINMENT CHANNEL - LATEST NEWS UPDATES...';

  if (!fbStreamUrl) {
    console.error("Error: FB_LIVE_URL secret is missing!");
    process.exit(1);
  }

  console.log('Fetching YouTube Live Stream URL using yt-dlp...');
  let directHlsUrl = '';
  try {
    const command = `yt-dlp -g --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" --extractor-args "youtube:player_client=android,web" ${ytLiveUrl}`;
    directHlsUrl = execSync(command).toString().trim();
  } catch (err) {
    console.error('Failed to fetch YouTube URL:', err);
    process.exit(1);
  }

  console.log('Stream URL fetched successfully! Processing Overlays and Streaming to Facebook...');

  const filterComplex = [
    `[0:v][1:v]overlay=main_w-overlay_w-20:20[tmp];`,
    `[tmp]drawbox=y=ih-50:color=black@0.7:width=iw:height=50:t=fill[bg];`,
    `[bg]drawtext=text='${newsTickerText}':fontcolor=white:fontsize=24:x=w-mod(max_t*100\\,w+tw):y=h-35`
  ].join('');

  const ffmpegArgs = [
    '-re',
    '-i', directHlsUrl,
    '-i', 'logo.png',
    '-filter_complex', filterComplex,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-b:v', '2500k',
    '-maxrate', '2500k',
    '-bufsize', '5000k',
    '-pix_fmt', 'yuv420p',
    '-g', '60',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'flv',
    fbStreamUrl.trim()
  ];

  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  ffmpeg.stderr.on('data', (data) => {
    console.log(`FFmpeg: ${data.toString()}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  await new Promise(() => {});
})();
