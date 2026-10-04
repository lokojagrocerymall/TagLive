export async function GET() {
  return Response.json({ ok: true, msg: "TagLive API running" })
}
export async function POST(req) {
  const body = await req.json().catch(()=>({}))
  return Response.json({ ok: true, received: body })
}
