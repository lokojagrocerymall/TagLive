"use client"
import { useEffect, useRef, useState } from 'react'

export default function Live(){
  const [verse, setVerse] = useState('John 3:16 - For God so loved the world...')
  const [platform, setPlatform] = useState<'facebook'|'youtube'|'tiktok'>('facebook')
  const [fbKey, setFbKey] = useState('')
  const [ytKey, setYtKey] = useState('')
  const [ttKey, setTtKey] = useState('')
  const [isCam, setIsCam] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream|null>(null)

  useEffect(()=>{
    const f = localStorage.getItem('taglive_fbKey'); if(f) setFbKey(f)
    const y = localStorage.getItem('taglive_ytKey'); if(y) setYtKey(y)
    const t = localStorage.getItem('taglive_ttKey'); if(t) setTtKey(t)
  },[])
  useEffect(()=>{ if(fbKey) localStorage.setItem('taglive_fbKey', fbKey)},[fbKey])
  useEffect(()=>{ if(ytKey) localStorage.setItem('taglive_ytKey', ytKey)},[ytKey])
  useEffect(()=>{ if(ttKey) localStorage.setItem('taglive_ttKey', ttKey)},[ttKey])

  // Camera
  const startCamera = async()=>{
    try{
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:true})
      streamRef.current = s
      if(videoRef.current){ videoRef.current.srcObject = s; await videoRef.current.play() }
      setIsCam(true)
    }catch(e){ alert('Camera permission needed') }
  }
  const stopCamera = ()=>{
    streamRef.current?.getTracks().forEach(t=>t.stop())
    setIsCam(false)
  }

  // Draw canvas with burned tag
  useEffect(()=>{
    let anim:any
    const draw = ()=>{
      const canvas = canvasRef.current
      const video = videoRef.current
      if(canvas && video && isCam && video.readyState>=2){
        const ctx = canvas.getContext('2d')
        if(ctx){
          canvas.width = 720; canvas.height = 1280
          ctx.drawImage(video, 0,0, canvas.width, canvas.height)
          // black bar with verse
          const barH = 180
          ctx.fillStyle = 'rgba(0,0,0,0.85)'
          ctx.fillRect(0, canvas.height-barH, canvas.width, barH)
          ctx.fillStyle = '#fff'
          ctx.font = 'bold 28px sans-serif'
          ctx.textAlign = 'center'
          const words = verse.match(/.{1,34}(\s|$)/g) || [verse]
          words.slice(0,3).forEach((line,i)=>{
            ctx.fillText(line.trim(), canvas.width/2, canvas.height-barH+50 + i*36)
          })
        }
      }
      anim = requestAnimationFrame(draw)
    }
    draw()
    return ()=> cancelAnimationFrame(anim)
  },[isCam, verse])

  const getKeys = ()=>{
    if(platform==='facebook') return {url:'rtmps://live-api-s.facebook.com:443/rtmp/', key:fbKey}
    if(platform==='youtube') return {url:'rtmp://a.rtmp.youtube.com/live2', key:ytKey}
    return {url:'rtmp://push-va.tiktok.com/live/', key:ttKey} // TikTok RTMP from TikTok Live Center
  }
  const {url, key} = getKeys()

  return (
    <div style={{padding:16, maxWidth:500, margin:'0 auto'}}>
      <h2 style={{fontWeight:900, fontSize:24}}>Live Studio Pro</h2>

      {/* Camera preview */}
      <div style={{marginTop:12, background:'#000', borderRadius:16, overflow:'hidden', position:'relative', aspectRatio:'9/16'}}>
        <video ref={videoRef} muted playsInline style={{width:'100%', height:'100%', objectFit:'cover', display: isCam?'block':'none'}} />
        {!isCam && <div style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', height:400}}>Camera off</div>}
        <canvas ref={canvasRef} style={{display:'none'}} />
        {/* Overlay preview */}
        <div style={{position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.85)', color:'#fff', padding:14, textAlign:'center', fontWeight:800}}>
          {verse}
        </div>
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        {!isCam? <button onClick={startCamera} style={{flex:1, background:'#111', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>📷 Start Camera</button>
        : <button onClick={stopCamera} style={{flex:1, background:'#ef4444', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>Stop Camera</button>}
      </div>

      <textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%', height:80, marginTop:12, padding:12, borderRadius:12, border:'1px solid #ddd'}} placeholder="Type verse tag - it burns into video" />

      {/* PLATFORM */}
      <div style={{marginTop:18, border:'2px solid #6d28d9', borderRadius:16, padding:14}}>
        <h3 style={{fontWeight:800}}>🔴 Go Live To</h3>
        <div style={{display:'flex', gap:6, marginTop:10}}>
          {(['facebook','youtube','tiktok'] as const).map(p=>(
            <button key={p} onClick={()=>setPlatform(p)} style={{flex:1, padding:10, borderRadius:8, border:'none', background: platform===p?'#6d28d9':'#eee', color:platform===p?'#fff':'#000', fontWeight:800, textTransform:'capitalize'}}>{p}</button>
          ))}
        </div>

        <div style={{marginTop:12}}>
          <label style={{fontSize:12, fontWeight:700}}>{platform.toUpperCase()} RTMP URL</label>
          <input value={url} readOnly style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4, fontSize:11, background:'#f5f3ff'}} />
          <label style={{fontSize:12, fontWeight:700, marginTop:10, display:'block'}}>Stream Key (from {platform})</label>
          {platform==='facebook' && <input value={fbKey} onChange={e=>setFbKey(e.target.value)} placeholder="FB key from facebook.com/live/producer" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />}
          {platform==='youtube' && <input value={ytKey} onChange={e=>setYtKey(e.target.value)} placeholder="YouTube key from studio.youtube.com" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />}
          {platform==='tiktok' && <input value={ttKey} onChange={e=>setTtKey(e.target.value)} placeholder="TikTok key from tiktok.com/live/creators" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />}
        </div>

        <div style={{marginTop:12, background:'#111', color:'#fff', padding:12, borderRadius:10, fontSize:11}}>
          <b>STATUS:</b> Camera + Tag composited on canvas.<br/>
          To actually push RTMP from browser, you need a small server (Cloudflare/Mux). For now use: <b>Copy Canvas → OBS → paste RTMP above</b>. Or I can add the server code for direct push.
        </div>

        <button onClick={()=>{
          if(!key) return alert('Paste your '+platform+' stream key first')
          alert(`Ready to push to ${platform}!\nURL: ${url}\nKey: ${key.slice(0,8)}...\n\nNext: I will add the API route /api/live that pushes your canvas directly to RTMP without OBS. Want me to add it?`)
        }} style={{width:'100%', marginTop:12, background:'#6d28d9', color:'#fff', padding:14, borderRadius:10, fontWeight:900, border:'none'}}>
          🔴 GO LIVE to {platform.toUpperCase()} with Tag
        </button>

        <p style={{fontSize:10, color:'#666', marginTop:8}}>
          TikTok: You need 1000+ followers + get RTMP from LIVE Center (tiktok.com/live/creators or TikTok Live Studio). If you don't have it, stream to FB/YT first, then restream.
        </p>
      </div>
    </div>
  )
}
