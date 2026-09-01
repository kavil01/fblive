#!/bin/bash

# yt-dlp கருவியை பதிவிறக்கம் செய்து புதுப்பித்தல்
sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# உங்கள் Blogger தளத்தில் இயங்கும் YouTube Video / Live Link-ஐ கீழே உள்ள URL-ல் மாற்றவும்
YOUTUBE_URL="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"

# Direct Stream Link-ஐ எடுத்து FFmpeg மூலம் நேரலையாக ஸ்ட்ரீம் செய்தல்
STREAM_URL=$(yt-dlp -g -f "best[ext=mp4]/best" "$YOUTUBE_URL")

ffmpeg -re -i "$STREAM_URL" \
       -c:v libx264 -preset ultrafast -b:v 2500k -maxrate 2500k -bufsize 5000k \
       -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k -ar 44100 \
       -f flv "rtmps://live-api-s.facebook.com:443/rtmp/${FB_STREAM_KEY}"
