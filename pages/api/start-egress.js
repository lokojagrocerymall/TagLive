import { EgressClient } from 'livekit-server-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { room, facebookKey, youtubeKey, pageId, pageAccessToken, title, scripture } = req.body;
    
    const host = process.env.LIVEKIT_URL;
    const egress = new EgressClient(host, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);

    const outputs = [];
    let facebookLiveId = null;

    // === NEW AUTO MODE: Create Facebook Live automatically ===
    if (pageId && pageAccessToken) {
      console.log('Auto-creating Facebook Live for page:', pageId);
      
      const fbRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/live_videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: pageAccessToken,
          status: 'LIVE_NOW',
          title: title || scripture || 'Sunday Service Live - TagLive',
          description: 'Live with scripture overlay via TagLive - Church Live Tagging App'
        })
      });
      
      const fbData = await fbRes.json();
      
      if (fbData.error) {
        console.error('Facebook error:', fbData.error);
        return res.status(400).json({ ok: false, error: `Facebook: ${fbData.error.message}` });
      }

      // Facebook gives us stream_url = rtmps://live-api-s.facebook.com:443/rtmp/ + key combined
      // LiveKit needs full URL
      outputs.push({
        protocol: 0,
        urls: [fbData.stream_url] // Already contains key!
      });
      
      facebookLiveId = fbData.id;
      console.log('Facebook Live created:', fbData.id);
      
    } 
    // === OLD MANUAL MODE: Still works if they paste key ===
    else if (facebookKey) {
      outputs.push({
        protocol: 0,
        urls: [`rtmps://live-api-s.facebook.com:443/rtmp/${facebookKey}`]
      });
    }

    if (youtubeKey) {
      outputs.push({
        protocol: 0,
        urls: [`rtmp://a.rtmp.youtube.com/live2/${youtubeKey}`]
      });
    }

    if (outputs.length === 0) {
      return res.status(400).json({ ok: false, error: 'No Page selected or stream key provided' });
    }

    const info = await egress.startRoomCompositeEgress(room, {
      streamOutputs: outputs,
      layout: 'single-speaker',
      video: { width: 1280, height: 720, videoBitrate: 3000, framerate: 30 }
    });

    res.status(200).json({ 
      ok: true, 
      egressId: info.egressId, 
      destinations: outputs.length,
      facebookLiveId,
      autoCreated: !!pageId
    });
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
