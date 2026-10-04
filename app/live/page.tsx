"use client"
import { useEffect, useRef, useState } from 'react'

export default function Live(){
  const [verse, setVerse] = useState('John 3:16 - For God so loved the world...')
  const [platform, setPlatform] = useState<'facebook'|'youtube'|'tiktok'>('facebook')
  const [fbKey, setFbKey] = useState('')
  const [ytKey, setYtKey] = useState('')
  const [ttKey, setTtKey] = useState('')
  const [isCam, setIsCam] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [facing, setFacing] = useState<'user'|'environment'>('user')
  const [torch, setTorch] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream|null>(null)
  const trackRef = useRef<MediaStreamTrack|null>(null)

  useEffect(()=>{
    const f = localStorage.getItem('taglive_fbKey'); if(f) setFbKey(f)
    const y = localStorage.getItem('taglive_ytKey'); if(y) setYtKey(y)
    const t = localStorage.getItem('taglive_ttKey'); if(t) setTtKey(t)
  },[])
  useEffect(()=>{ if(fbKey) localStorage.setItem('taglive_fbKey', fbKey)},[fbKey])
  useEffect(()=>{ if(ytKey) localStorage.setItem('taglive_ytKey', ytKey)},[ytKey])
  useEffect(()=>{ if(ttKey) localStorage.setItem('taglive_ttKey', ttKey)},[ttKey])

  const startCamera = async(newFacing = facing)=>{
    try{
      if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing, width:{ideal:1280}, height:{ideal:720}}, audio:true})
      streamRef.current = s
      trackRef.current = s.getVideoTracks()[0]
      if(videoRef.current){ videoRef.current.srcObject = s; await videoRef.current.play() }
      setFacing(newFacing)
      setIsCam(true)
    }catch(e){ alert('Camera permission needed: '+e) }
  }

  const stopCamera = ()=>{
    streamRef.current?.getTracks().forEach(t=>t.stop())
    setIsCam(false)
    setIsLive(false)
    setTorch(false)
  }

  const toggleCamera = async()=>{
    const newFacing = facing==='user'?'environment':'user'
    await startCamera(newFacing)
  }

  const toggleTorch = async()=>{
    try{
      const track: any = trackRef.current
      if(!track) return alert('Camera not ready')
      const caps = track.getCapabilities?.()
      if(!caps?.torch) return alert('Torch not supported on this phone, use room light')
      await track.applyConstraints({advanced:[{torch:!torch}] as any})
      setTorch(!torch)
    }catch(e){ alert('Torch failed: '+e) }
  }

  useEffect(()=>{
    let anim:any
    const draw = ()=>{
      const canvas = canvasRef.current
      const video = videoRef.current
      if(canvas && video && isCam && video.readyState>=2){
        const ctx = canvas.getContext('2d')
        if(ctx){
          canvas.width = 720; canvas.height = 1280
          // Brightness boost for dark room
          ctx.filter = 'brightness(1.3) contrast(1.1)'
          ctx.drawImage(video, 0,0, canvas.width, canvas.height)
          ctx.filter = 'none'
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
          if(isLive){
            ctx.fillStyle = '#ef4444'
            ctx.beginPath()
            ctx.arc(40, 40, 12, 0, Math.PI*2)
            ctx.fill()
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 20px sans-serif'
            ctx.textAlign = 'left'
            ctx.fillText(`LIVE ${platform.toUpperCase()}`, 65, 47)
          }
        }
      }
      anim = requestAnimationFrame(draw)
    }
    draw()
    return ()=> cancelAnimationFrame(anim)
  },[isCam, verse, isLive, platform])

  const getKeys = ()=>{
    if(platform==='facebook') return {url:'rtmps://live-api-s.facebook.com:443/rtmp/', key:fbKey}
    if(platform==='youtube') return {url:'rtmp://a.rtmp.youtube.com/live2', key:ytKey}
    return {url:'rtmp://push-va.tiktok.com/live/', key:ttKey}
  }
  const {url, key} = getKeys()

  const handleGoLive = async()=>{
    if(!isCam) return alert('Start Camera first')
    if(!key) return alert(`Paste your ${platform} stream key first`)
    const canvas = canvasRef.current
    if(!canvas) return
    try{
      const canvasStream = (canvas as any).captureStream(30)
      const audioTracks = streamRef.current?.getAudioTracks() || []
      audioTracks.forEach((track: MediaStreamTrack) => canvasStream.addTrack(track))
      setIsLive(true)
      await fetch('/api/live', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ platform, rtmpUrl: url, streamKey: key }) })
      alert(`🔴 LIVE NOW on ${platform.toUpperCase()}!`)
    }catch(err){ alert('Go Live failed: '+err); setIsLive(false) }
  }

  return (
    <div style={{padding:16, maxWidth:500, margin:'0 auto', paddingBottom:80}}>
      <h2 style={{fontWeight:900, fontSize:24}}>Live Studio Pro</h2>

      <div style={{marginTop:12, background:'#000', borderRadius:16, overflow:'hidden', position:'relative', aspectRatio:'9/16'}}>
        <video ref={videoRef} muted playsInline style={{width:'100%', height:'100%', objectFit:'cover', display: isCam?'block':'none'}} />
        {!isCam && <div style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', height:400}}>Camera off</div>}
        <canvas ref={canvasRef} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover'}} />
        <div style={{position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.85)', color:'#fff', padding:14, textAlign:'center', fontWeight:800, zIndex:2}}>
          {verse}
        </div>
        {isLive && <div style={{position:'absolute', top:12, left:12, background:'#ef4444', color:'#fff', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:900, zIndex:3}}>● LIVE {platform}</div>}

        {/* Camera controls on video */}
        {isCam && <div style={{position:'absolute', top:12, right:12, display:'flex', gap:8, zIndex:4}}>
          <button onClick={toggleCamera} style={{background:'rgba(0,0,0,0.6)', color:'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>🔄 Flip</button>
          <button onClick={toggleTorch} style={{background:torch?'#fbbf24':'rgba(0,0,0,0.6)', color:torch?'#000':'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>{torch?'🔦 On':'🔦'}</button>
        </div>}
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        {!isCam? <button onClick={()=>startCamera()} style={{flex:1, background:'#111', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>📷 Start Camera</button>
        : <><button onClick={toggleCamera} style={{flex:1, background:'#6d28d9', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>🔄 Switch Front/Back</button>
           <button onClick={stopCamera} style={{flex:1, background:'#444', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>Stop</button></>}
      </div>

      <textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%', height:80, marginTop:12, padding:12, borderRadius:12, border:'1px solid #ddd'}} placeholder="Type verse tag" />

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
          <label style={{fontSize:12, fontWeight:700, marginTop:10, display:'block'}}>Stream Key</label>
          {platform==='facebook' && <input value={fbKey} onChange={e=>setFbKey(e.target.value)} placeholder="FB key" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />}
          {platform==='youtube' && <input value={ytKey} onChange={e=>setYtKey(e.target.value)} placeholder="YouTube key" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />}
          {platform==='tiktok' && <input value={ttKey} onChange={e=>setTtKey(e.target.value)} placeholder="TikTok key" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />}
        </div>
        {!isLive? (
          <button onClick={handleGoLive} style={{width:'100%', marginTop:12, background:'#6d28d9', color:'#fff', padding:14, borderRadius:10, fontWeight:900, border:'none'}}>🔴 GO LIVE to {platform.toUpperCase()} with Tag</button>
        ) : (
          <button onClick={()=>setIsLive(false)} style={{width:'100%', marginTop:12, background:'#ef4444', color:'#fff', padding:14, borderRadius:10, fontWeight:900, border:'none'}}>■ STOP LIVE</button>
        )}
      </div>
    </div>
  )
}
