import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session: any = await getServerSession()
  const { pageId, pageAccessToken, title, description } = await req.json()

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${pageId}/live_videos`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title || "TagLive Stream",
        description: description || "",
        status: "UNPUBLISHED",
        planned_start_time: Math.floor(Date.now()/1000) + 60,
        access_token: pageAccessToken,
      }),
    }
  )
  const data = await res.json()

  return NextResponse.json(data)
}
