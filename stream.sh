#!/bin/bash

# 1. Virtual Screen உருவாக்கல்
Xvfb :99 -screen 0 1280x720x24 &
export DISPLAY=:99
sleep 3

# 2. Window Manager (Fluxbox) இயக்குதல்
fluxbox &
sleep 2

# 3. Chromium-ஐ பாப்-அப் வராதவாறு கொடிகளுடன் திறத்தல்
chromium-browser \
  --no-sandbox \
  --disable-setuid-sandbox \
  --disable-dev-shm-usage \
  --no-first-run \
  --no-default-browser-check \
  --disable-first-run-ui \
  --start-maximized \
  --start-fullscreen \
  --window-size=1280,720 \
  --window-position=0,0 \
  "https://kingfmtamilgroup.blogspot.com/" &

# 4. ஒருவேளை Terms பாப்-அப் வந்தால் அதை தானாக Accept செய்ய Enter அழுத்துதல்
sleep 5
xdotool key Return
sleep 15

# 5. FFmpeg ஸ்ட்ரீமிங்கைத் தொடங்குதல்
ffmpeg -f x11grab -video_size 1280x720 -i :99.0 \
       -f lavfi -i anullsrc \
       -c:v libx264 -preset ultrafast -pix_fmt yuv420p -g 60 -b:v 2500k \
       -c:a aac -b:a 128000 -ar 44100 \
       -f flv "rtmps://live-api-s.facebook.com:443/rtmp/${FB_STREAM_KEY}"
