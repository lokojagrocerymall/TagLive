import { EgressClient } from 'livekit-server-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { room, facebookKey, youtubeKey } = req.body;
    const host = process.env.LIVEKIT_URL;
    const egress = new EgressClient(host, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);

    const outputs = [];
    if (facebookKey) {
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
      return res.status(400).json({ ok: false, error: 'No stream key provided' });
    }

    const info = await egress.startRoomCompositeEgress(room, {
      streamOutputs: outputs,
      layout: 'single-speaker',
      video: { width: 1280, height: 720, videoBitrate: 3000, framerate: 30 }
    });

    res.status(200).json({ ok: true, egressId: info.egressId, destinations: outputs.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
