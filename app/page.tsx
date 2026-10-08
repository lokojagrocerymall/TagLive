"use client"
import { useState, useRef, useEffect } from 'react'
import { Room, RoomEvent } from 'livekit-client'

export default function LiveStudio() {
  const [roomName, setRoomName] = useState('my-live-room')
  const [connected, setConnected] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [facebookKey, setFacebookKey] = useState('')
  const [youtubeKey, setYoutubeKey] = useState('')
  const [streaming, setStreaming] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const roomRef = useRef<Room | null>(null)

  const verse = "John 3:16 - For God so loved the world..."

  async function join() {
    const res = await fetch(`/api/token?room=${roomName}&username=host`)
    const data = await res.json()
    const room = new Room()
    roomRef.current = room
    await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token)
    setConnected(true)
  }

  async function startCamera() {
    await roomRef.current?.localParticipant.enableCameraAndMicrophone()
    if (videoRef.current) {
      const pub = roomRef.current?.localParticipant.getTrackPublication('camera')
      const track = pub?.videoTrack
      if (track) track.attach(videoRef.current)
    }
    setCameraOn(true)
  }

  async function startStream() {
    const res = await fetch('/api/start-egress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: roomName, facebookKey, youtubeKey })
    })
    if (res.ok) setStreaming(true)
    else alert('Failed to start')
  }

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
      <h2>Live Studio</h2>
      <input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Room Name" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
      <button onClick={join} style={{ width: '100%', marginTop: 10, padding: 14, background: '#6d28d9', color: '#fff', borderRadius: 10, border: 'none', fontWeight: 800 }}>Join Room</button>
      
      {connected && (
        <div style={{ marginTop: 16 }}>
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: 12, background: '#000' }} />
          <div style={{ position: 'relative', marginTop: -40, textAlign: 'center', color: '#fff', fontWeight: 700, background: 'rgba(0,0,0,0.5)', padding: 8 }}>{verse}</div>
          
          {!cameraOn && <button onClick={startCamera} style={{ width: '100%', marginTop: 12, padding: 14, background: '#000', color: '#fff', borderRadius: 10, border: 'none' }}>Start Camera</button>}
          
          {cameraOn && (
            <div style={{ marginTop: 12 }}>
              <input value={facebookKey} onChange={(e) => setFacebookKey(e.target.value)} placeholder="Facebook Stream Key" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', marginBottom: 8 }} />
              <input value={youtubeKey} onChange={(e) => setYoutubeKey(e.target.value)} placeholder="YouTube Stream Key" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
              <button onClick={startStream} disabled={streaming || (!facebookKey && !youtubeKey)} style={{ width: '100%', marginTop: 8, padding: 14, background: streaming ? '#16a34a' : '#1877F2', color: '#fff', borderRadius: 10, border: 'none', fontWeight: 800 }}>
                {streaming ? 'LIVE NOW ●' : 'Start Stream (FB + YouTube)'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
