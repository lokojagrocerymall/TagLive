import { AccessToken } from 'livekit-server-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { room, identity } = await req.json()
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, { identity })
  at.addGrant({ roomJoin: true, room })
  return NextResponse.json({ token: await at.toJwt(), url: process.env.LIVEKIT_URL })
}
