#!/bin/bash

# Virtual Screen 1280x720 24-bit அமைத்தல்
Xvfb :99 -screen 0 1280x720x24 &
sleep 2
export DISPLAY=:99

# Chromium உலாவியை முழுத் திரையில் (Kiosk Mode) திறத்தல்
chromium-browser \
  --no-sandbox \
  --disable-setuid-sandbox \
  --disable-dev-shm-usage \
  --start-fullscreen \
  --kiosk \
  --window-position=0,0 \
  --window-size=1280,720 \
  --autoplay-policy=no-user-gesture-required \
  "https://kingfmtamilgroup.blogspot.com/" &

# வெப்சைட் முழுமையாக Load ஆக 15 வினாடிகள் காத்திருத்தல்
sleep 15

# FFmpeg மூலம் திரையைப் பிடித்து Facebook-க்கு ஸ்ட்ரீம் செய்தல்
ffmpeg -f x11grab -video_size 1280x720 -i :99.0 \
       -f lavfi -i anullsrc \
       -c:v libx264 -preset ultrafast -pix_fmt yuv420p -g 60 -b:v 2500k \
       -c:a aac -b:a 128000 -ar 44100 \
       -f flv "rtmps://live-api-s.facebook.com:443/rtmp/${FB_STREAM_KEY}"
