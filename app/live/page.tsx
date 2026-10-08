// @ts-nocheck
'use client'
import { useEffect, useRef, useState } from 'react'
import { Room } from 'livekit-client'
declare global { interface Window { FB: any } }

export default function Live(){
  const [verse, setVerse] = useState('John 3:16 - For God so loved the world...')
  const [fbKey, setFbKey] = useState('')
  const [isCam, setIsCam] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [facing, setFacing] = useState<'user'|'environment'>('user')
  const [torch, setTorch] = useState(false)
  const [fbUser, setFbUser] = useState<any>(null)
  const [status, setStatus] = useState('Ready')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream|null>(null)
  const trackRef = useRef<MediaStreamTrack|null>(null)
  const roomRef = useRef<Room|null>(null)

  useEffect(()=>{
    const fbAppId = '1337456311621600'
    if(!document.getElementById('fb-sdk')){
      const s = document.createElement('script'); s.id='fb-sdk'; s.src='https://connect.facebook.net/en_US/sdk.js';
      s.onload=()=>{
        window.FB.init({appId: fbAppId, cookie:true, xfbml:false, version:'v19.0'})
        window.FB.getLoginStatus((resp:any)=>{ if(resp.status==='connected'){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); localStorage.setItem('taglive_fbUser', JSON.stringify(u)) }) } })
      }
      document.body.appendChild(s)
    }
    const f=localStorage.getItem('taglive_fbKey'); if(f) setFbKey(f)
  },[])

  useEffect(()=>{
    let anim:any
    const draw=()=>{
      const canvas=canvasRef.current; const video=videoRef.current
      if(canvas&&video&&isCam&&video.readyState>=2){
        const ctx=canvas.getContext('2d'); if(ctx){
          canvas.width=720; canvas.height=1280
          ctx.filter='brightness(1.3) contrast(1.1)'; ctx.drawImage(video,0,0,canvas.width,canvas.height); ctx.filter='none'
          const barH=180; ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.fillRect(0,canvas.height-barH,canvas.width,barH)
          ctx.fillStyle='#fff'; ctx.font='bold 28px sans-serif'; ctx.textAlign='center'
          const words=verse.match(/.{1,34}(\s|$)/g)||[verse]
          words.slice(0,3).forEach((line,i)=>{ ctx.fillText(line.trim(), canvas.width/2, canvas.height-barH+50 + i*36) })
          if(isLive){ ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(40,40,12,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='bold 20px sans-serif'; ctx.textAlign='left'; ctx.fillText('LIVE FACEBOOK',65,47) }
        }
      }
      anim=requestAnimationFrame(draw)
    }
    draw(); return()=>cancelAnimationFrame(anim)
  },[isCam, verse, isLive])

  const stopCameraHard=async()=>{ try{ if(roomRef.current) await roomRef.current.disconnect(); roomRef.current=null; if(streamRef.current){ streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null } if(videoRef.current) videoRef.current.srcObject=null; trackRef.current=null }catch{}; setIsCam(false); setIsLive(false); setTorch(false); setStatus('Stopped') }

  const startCamera = async(newFacing=facing)=>{
    try{
      setStatus('Connecting to LiveKit...')
      await stopCameraHard(); await new Promise(r=>setTimeout(r,800))
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing}, audio:true})
      streamRef.current=s; trackRef.current=s.getVideoTracks()[0]
      if(videoRef.current){ videoRef.current.srcObject=s; await videoRef.current.play().catch(()=>{}) }
      setFacing(newFacing)
      const res = await fetch('/api/token', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({room:'church-service', identity: fbUser?.name||'Pastor'})})
      const {token, url} = await res.json()
      const room = new Room(); await room.connect(url, token); roomRef.current=room
      setTimeout(async()=>{
        const canvas = canvasRef.current; if(!canvas) return
        const cs = canvas.captureStream(30)
        const vTrack = cs.getVideoTracks()[0]
        const aTrack = s.getAudioTracks()[0]
        if(vTrack) await room.localParticipant.publishTrack(vTrack)
        if(aTrack) await room.localParticipant.publishTrack(aTrack)
      },1000)
      setIsCam(true); setStatus('In Studio - Canvas with verse is streaming')
    }catch(e:any){ alert(e.message); setStatus('Error: '+e.message) }
  }

  const toggleCamera=async()=>{ await startCamera(facing==='user'?'environment':'user') }
  const toggleTorch=async()=>{ try{ const t:any=trackRef.current; const c=t?.getCapabilities?.(); if(!c?.torch) return alert('No torch'); await t.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch)}catch(e:any){ alert(e.message)} }
  const loginFacebook=()=>{ if(!window.FB) return alert('Wait...'); window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); localStorage.setItem('taglive_fbUser', JSON.stringify(u)); alert(`✅ Logged in as ${u.name}`) }) } }, {scope:'public_profile'}) }
  const handleGoLive=async()=>{
    if(!isCam) return alert('Start Camera first')
    if(!fbKey) return alert('Paste Facebook Stream Key!')
    setStatus('Going LIVE to Facebook...')
    const res = await fetch('/api/start-stream', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({room:'church-service', rtmpUrl:'rtmps://live-api-s.facebook.com:443/rtmp/', streamKey:fbKey})})
    if(res.ok){ setIsLive(true); setStatus('🔴 LIVE ON FACEBOOK'); localStorage.setItem('taglive_fbKey', fbKey) } else { setStatus('Failed - check Stream Key') }
  }

  return (
    <div style={{padding:16, maxWidth:500, margin:'0 auto', paddingBottom:80}}>
      <h2 style={{fontWeight:900, fontSize:24}}>Live Studio Pro <span style={{fontSize:12, background:'#16a34a', color:'#fff', padding:'4px 8px', borderRadius:8}}>V8 LIVEKIT</span></h2>
      <p style={{fontSize:12, color:'#333'}}><b>Status:</b> {status}</p>
      {fbUser? <div style={{background:'#dcfce7', padding:10, borderRadius:10, marginTop:10, textAlign:'center', fontWeight:900, color:'#16a34a'}}>✅ LOGGED IN AS {fbUser.name}</div> : <button onClick={loginFacebook} style={{width:'100%', background:'#1877F2', color:'#fff', padding:12, borderRadius:10, fontWeight:900, border:'none', marginTop:10}}>f Login with Facebook</button>}
      <div style={{marginTop:12, background:'#000', borderRadius:16, overflow:'hidden', position:'relative', aspectRatio:'9/16'}}>
        <video ref={videoRef} muted playsInline autoPlay style={{display:'none'}} />
        {!isCam && <div style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', height:400, flexDirection:'column'}}><span>Camera off</span></div>}
        <canvas ref={canvasRef} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', display: isCam?'block':'none'}} />
        {isLive && <div style={{position:'absolute', top:12, left:12, background:'#ef4444', color:'#fff', padding:'6px 12px', borderRadius:20, fontSize:13, fontWeight:900, zIndex:3}}>● LIVE FACEBOOK</div>}
        {isCam && <div style={{position:'absolute', top:12, right:12, display:'flex', gap:8, zIndex:4}}><button onClick={toggleCamera} style={{background:'rgba(0,0,0,0.6)', color:'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>🔄 Flip</button><button onClick={toggleTorch} style={{background:torch?'#fbbf24':'rgba(0,0,0,0.6)', color:torch?'#000':'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>{torch?'🔦 On':'🔦'}</button></div>}
      </div>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        {!isCam? <button onClick={()=>startCamera()} style={{flex:1, background:'#111', color:'#fff', padding:14, borderRadius:10, fontWeight:800, border:'none'}}>📷 Start Camera</button> : <button onClick={stopCameraHard} style={{flex:1, background:'#444', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>Stop Cam</button>}
      </div>
      <textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%', height:80, marginTop:12, padding:12, borderRadius:12, border:'1px solid #ddd'}} placeholder="Bible verse overlay" />
      <input value={fbKey} onChange={e=>setFbKey(e.target.value)} placeholder="Paste Facebook Stream Key" style={{width:'100%', padding:12, borderRadius:8, border: fbKey?'2px solid #16a34a':'2px solid #ef4444', marginTop:12}} />
      {isCam && <button onClick={handleGoLive} style={{width:'100%', marginTop:12, background:isLive?'#ef4444':'#16a34a', color:'#fff', padding:14, borderRadius:10, fontWeight:900, border:'none'}}>{isLive? '■ STOP LIVE' : '🔴 GO LIVE TO FACEBOOK'}</button>}
      {isLive && <button onClick={()=>setIsLive(false)} style={{width:'100%', marginTop:8, background:'#000', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>END LIVE</button>}
    </div>
  )
}
