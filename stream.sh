#!/bin/bash

# 1. Virtual Screen உருவாக்கல்
Xvfb :99 -screen 0 1280x720x24 &
export DISPLAY=:99
sleep 3

# 2. Window Manager (Fluxbox) இயக்குதல்
fluxbox &
sleep 2

# 3. Chrome / Chromium-ஐ நேரடியாக முழுத்திரையில் திறத்தல் (Headless இல்லமால்)
chromium-browser \
  --no-sandbox \
  --disable-setuid-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --start-maximized \
  --start-fullscreen \
  --window-size=1280,720 \
  --window-position=0,0 \
  --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" \
  "https://kingfmtamilgroup.blogspot.com/" &

# வெப்சைட் லோட் ஆக 20 வினாடி காத்திருத்தல்
sleep 20

# 4. FFmpeg ஸ்ட்ரீமிங்கைத் தொடங்குதல்
ffmpeg -f x11grab -video_size 1280x720 -i :99.0 \
       -f lavfi -i anullsrc \
       -c:v libx264 -preset ultrafast -pix_fmt yuv420p -g 60 -b:v 2500k \
       -c:a aac -b:a 128000 -ar 44100 \
       -f flv "rtmps://live-api-s.facebook.com:443/rtmp/${FB_STREAM_KEY}"
