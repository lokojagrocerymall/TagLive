import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
  const { platform, rtmpUrl, streamKey } = await req.json()
  
  // In production, this would start an FFmpeg process that takes WebRTC and pushes to RTMP.
  // For Vercel, we return the restream config for Cloudflare/Mux.
  // You can connect this to a Fly.io / Render server running: ffmpeg -i webrtc -c:v libx264 -f flv rtmp://...

  return NextResponse.json({
    ok: true,
    message: `Ready to push to ${platform}`,
    fullRtmp: `${rtmpUrl}${streamKey}`,
    instructions: "Connect canvas.captureStream() to this endpoint via WHIP. For now, use OBS or deploy the RTMP relay server I gave you below."
  })
}

export async function GET(){
  return NextResponse.json({ status: "TagLive RTMP API running", platforms: ["facebook","youtube","tiktok"] })
}
