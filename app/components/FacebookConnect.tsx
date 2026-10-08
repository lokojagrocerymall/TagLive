"use client"
import { useState } from "react"
import { signIn, useSession } from "next-auth/react"

export default function FacebookConnect({ onKey }: { onKey: (key: string, url: string) => void }) {
  const { data: session }: any = useSession()
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadPages = async () => {
    const res = await fetch("/api/facebook/pages")
    const data = await res.json()
    setPages(data.data || [])
  }

  const createLive = async (page: any) => {
    setLoading(true)
    const res = await fetch("/api/facebook/create-live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId: page.id, pageAccessToken: page.access_token, title: "Sunday Service" }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.stream_url) {
      // stream_url = rtmps://live-api-s.facebook.com:443/rtmp/FB-123...
      const parts = data.stream_url.split("/")
      const key = parts[parts.length - 1]
      onKey(key, "rtmps://live-api-s.facebook.com:443/rtmp/")
      alert("Facebook connected! Stream key loaded automatically")
    } else {
      alert("Error: " + JSON.stringify(data))
    }
  }

  if (!session) {
    return <button onClick={() => signIn("facebook")} className="bg-blue-600 text-white px-4 py-2 rounded">Connect Facebook</button>
  }

  return (
    <div className="space-y-2">
      <button onClick={loadPages} className="bg-blue-600 text-white px-4 py-2 rounded">Load My Pages</button>
      {pages.map((p) => (
        <button key={p.id} onClick={() => createLive(p)} disabled={loading} className="block w-full text-left border p-2 rounded">
          {p.name} — {loading ? "Creating..." : "Get Stream Key"}
        </button>
      ))}
    </div>
  )
}
