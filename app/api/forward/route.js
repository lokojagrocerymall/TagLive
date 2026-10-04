export async function GET() {
  return Response.json({ ok: true, msg: "TagLive API running" })
}
export async function POST(request) {
  const data = await request.json().catch(()=>({}))
  return Response.json({ ok: true, data })
}
