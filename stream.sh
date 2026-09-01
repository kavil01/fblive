#!/bin/bash

# டிஸ்ப்ளே அமைவு
Xvfb :99 -screen 0 1280x720x24 &
export DISPLAY=:99

# Google Chrome பின்னணியில் திறத்தல்
google-chrome --no-sandbox --disable-setuid-sandbox --headless=new --remote-debugging-port=9222 --window-size=1280,720 "https://kingfmtamilgroup.blogspot.com/" &
sleep 10

# FFmpeg மூலம் Facebook-க்கு லைவ் ஸ்ட்ரீம் செய்தல்
ffmpeg -f x11grab -video_size 1280x720 -i :99.0 \
       -f lavfi -i anullsrc \
       -c:v libx264 -preset ultrafast -pix_fmt yuv420p -g 60 -b:v 2500k \
       -c:a aac -b:a 128000 -ar 44100 \
       -f flv "rtmps://live-api-s.facebook.com:443/rtmp/${FB_STREAM_KEY}"
