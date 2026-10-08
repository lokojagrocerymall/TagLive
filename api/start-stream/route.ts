import { EgressClient, StreamProtocol } from 'livekit-server-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { room, rtmpUrl, streamKey } = await req.json()
  const host = process.env.LIVEKIT_URL!.replace('wss://', 'https://')
  const client = new EgressClient(host, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!)
  const info = await client.startRoomCompositeEgress(room, {
    streamOutputs: [
      {
        protocol: StreamProtocol.RTMP,
        urls: [`${rtmpUrl}${streamKey}`],
      },
    ],
  })
  return NextResponse.json({ egressId: info.egressId })
}
