#!/bin/bash

# Virtual Screen அமைத்தல்
Xvfb :99 -screen 0 1280x720x24 &
export DISPLAY=:99
sleep 2

# Fluxbox Window Manager
fluxbox &
sleep 2

# Node.js மூலம் Puppeteer திரையை இயக்குதல்
node stream.js &
sleep 25

# FFmpeg மூலம் உங்கள் வெப்சைட் திரையை Facebook-க்கு ஸ்ட்ரீம் செய்தல்
ffmpeg -f x11grab -video_size 1280x720 -i :99.0 \
       -f lavfi -i anullsrc \
       -c:v libx264 -preset ultrafast -pix_fmt yuv420p -g 60 -b:v 2500k \
       -c:a aac -b:a 128000 -ar 44100 \
       -f flv "rtmps://live-api-s.facebook.com:443/rtmp/${FB_STREAM_KEY}"
