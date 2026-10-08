import { AccessToken } from 'livekit-server-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { room, identity } = await req.json()
  const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: identity || 'user',
  })
  at.addGrant({ roomJoin: true, room })
  const token = await at.toJwt()
  return NextResponse.json({ token, url: process.env.LIVEKIT_URL })
}
