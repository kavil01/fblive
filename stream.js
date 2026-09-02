const { spawn } = require('child_process');

const fbStreamUrl = process.env.FB_LIVE_URL;

// உங்கள் video file
const sourceVideo = process.env.SOURCE_VIDEO || 'video.mp4';

// ஓடும் செய்தி
const newsTickerText =
process.env.NEWS_TICKER ||
'KING FM TAMIL MEDIA LIVE - 24/7 NEWS & ENTERTAINMENT - LATEST NEWS UPDATES';

// Logo file
const logoFile = 'logo.png';

if (!fbStreamUrl) {
console.error('ERROR: FB_LIVE_URL secret is missing!');
process.exit(1);
}

console.log('====================================');
console.log('KING FM TV STREAM STARTING');
console.log('====================================');

const safeTicker = newsTickerText
.replace(/\/g, '\\')
.replace(/'/g, "\'")
.replace(/:/g, '\:');

const filterComplex = [
"[0:v][1:v]overlay=W-w-20:20[logo];",
"[logo]drawbox=x=0:y=H-70:w=W:h=70:color=black@0.75:t=fill[tickerbg];",
"[tickerbg]drawtext=" +
"text='${safeTicker}':" +
"fontcolor=white:" +
"fontsize=24:" +
"x=W-mod(t*100\\,W+tw):" +
"y=H-45"
].join('');

const ffmpegArgs = [
'-re',

// Video loop
'-stream_loop', '-1',

// Main video
'-i', sourceVideo,

// Logo
'-loop', '1',
'-i', logoFile,

'-filter_complex', filterComplex,

'-map', '0:v:0',
'-map', '0:a:0?',

'-c:v', 'libx264',
'-preset', 'veryfast',

'-b:v', '2500k',
'-maxrate', '2500k',
'-bufsize', '5000k',

'-pix_fmt', 'yuv420p',

'-r', '30',
'-g', '60',

'-c:a', 'aac',
'-b:a', '128k',
'-ar', '44100',

'-shortest',

'-f', 'flv',

fbStreamUrl.trim()
];

console.log('Starting FFmpeg...');

const ffmpeg = spawn('ffmpeg', ffmpegArgs);

ffmpeg.stderr.on('data', (data) => {
console.log(data.toString());
});

ffmpeg.on('error', (error) => {
console.error('FFmpeg Error:', error);
});

ffmpeg.on('close', (code) => {
console.log("FFmpeg stopped with code: ${code}");

// Auto restart
console.log('Restarting stream in 10 seconds...');

setTimeout(() => {
process.exit(1);
}, 10000);
});
