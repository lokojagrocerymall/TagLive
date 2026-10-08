import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session: any = await getServerSession()
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const res = await fetch(
    `https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token&access_token=${session.accessToken}`
  )
  const data = await res.json()

  return NextResponse.json(data)
}
