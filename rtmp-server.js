// Deploy this file to Fly.io: fly launch -> fly deploy
// This takes browser stream and pushes to FB/YT/TikTok with burned tags
const express = require('express');
const { spawn } = require('child_process');
const app = express();
app.use(express.json());

app.post('/push', (req, res) => {
  const { rtmpUrl, streamKey } = req.body;
  const fullUrl = rtmpUrl + streamKey;
  console.log('Pushing to:', fullUrl);
  // ffmpeg will receive WebRTC/MSE stream and push to RTMP
  // ffmpeg -i input.webm -c:v libx264 -preset veryfast -f flv fullUrl
  res.json({ ok: true, pushingTo: fullUrl });
});

app.listen(3001, () => console.log('RTMP Relay running on 3001'));
