"use client"
import { useEffect, useRef, useState } from 'react'
declare global { interface Window { FB: any; google: any } }
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
  const [fbUser, setFbUser] = useState<any>(null)
  const [ytUser, setYtUser] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream|null>(null)
  const trackRef = useRef<MediaStreamTrack|null>(null)

  useEffect(()=>{
    const saved = localStorage.getItem('taglive_fbUser'); if(saved){ try{ setFbUser(JSON.parse(saved)) }catch{} }
    const fbAppId = '1337456311621600'
    if(!document.getElementById('fb-sdk')){
      const s = document.createElement('script'); s.id='fb-sdk'; s.src='https://connect.facebook.net/en_US/sdk.js';
      s.onload=()=>{
        window.FB.init({appId: fbAppId, cookie:true, xfbml:false, version:'v19.0'})
        window.FB.getLoginStatus((resp:any)=>{ if(resp.status==='connected'){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); localStorage.setItem('taglive_fbUser', JSON.stringify(u)) }) } })
      }
      document.body.appendChild(s)
    }
    if(!document.getElementById('g-sdk')){ const g=document.createElement('script'); g.id='g-sdk'; g.src='https://accounts.google.com/gsi/client'; document.body.appendChild(g) }
    const f=localStorage.getItem('taglive_fbKey'); if(f) setFbKey(f)
    const y=localStorage.getItem('taglive_ytKey'); if(y) setYtKey(y)
    const t=localStorage.getItem('taglive_ttKey'); if(t) setTtKey(t)
  },[])
  useEffect(()=>{ if(fbKey) localStorage.setItem('taglive_fbKey', fbKey)},[fbKey])
  useEffect(()=>{ if(ytKey) localStorage.setItem('taglive_ytKey', ytKey)},[ytKey])
  useEffect(()=>{ if(ttKey) localStorage.setItem('taglive_ttKey', ttKey)},[ttKey])

  const stopCameraHard = ()=>{ try{ if(streamRef.current){ streamRef.current.getTracks().forEach(t=>{try{t.stop()}catch{}}); streamRef.current=null } if(videoRef.current){ try{ videoRef.current.pause(); videoRef.current.srcObject=null }catch{} } trackRef.current=null }catch{}; setIsCam(false); setIsLive(false); setTorch(false) }
  const startCamera = async(newFacing=facing)=>{
    try{
      stopCameraHard(); await new Promise(r=>setTimeout(r, 800))
      let s:MediaStream|null=null
      try{ s=await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing}, audio:true}) }catch{}
      if(!s) try{ s=await navigator.mediaDevices.getUserMedia({video:true, audio:true}) }catch{}
      if(!s) try{ s=await navigator.mediaDevices.getUserMedia({video:true, audio:false}) }catch{}
      if(!s) throw new Error('Camera locked')
      streamRef.current=s; trackRef.current=s.getVideoTracks()[0]
      if(videoRef.current){ videoRef.current.srcObject=s; await videoRef.current.play().catch(()=>{}) }
      setFacing(newFacing); setIsCam(true)
    }catch(e:any){ alert(e.message) }
  }
  const stopCamera=()=>stopCameraHard()
  const toggleCamera=async()=>{ await startCamera(facing==='user'?'environment':'user') }
  const toggleTorch=async()=>{ try{ const t:any=trackRef.current; const c=t?.getCapabilities?.(); if(!c?.torch) return alert('No torch'); await t.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch)}catch(e:any){ alert(e.message)} }

  const loginFacebook=()=>{
    if(!window.FB){ alert('Wait...'); return; }
    if(isCam) stopCameraHard()
    setTimeout(()=>{ window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name,picture', (user:any)=>{ setFbUser(user); localStorage.setItem('taglive_fbUser', JSON.stringify(user)); alert(`✅ Logged in as ${user.name}! Paste Stream Key now!`) }) } }, {scope:'public_profile'}) }, 600)
  }
  const loginYouTube=()=>{ if(!window.google){ alert('Google loading...'); return; } const client=window.google.accounts.oauth2.initTokenClient({ client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID||'YOUR_GOOGLE_ID', scope:'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile', callback: async(tr:any)=>{ const at=tr.access_token; const ch=await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',{headers:{Authorization:`Bearer ${at}`}}).then(r=>r.json()); const channel=ch.items?.[0]?.snippet; setYtUser({name:channel?.title}); alert(`YouTube ${channel?.title}`) } }); client.requestAccessToken() }

  useEffect(()=>{ let anim:any; const draw=()=>{ const canvas=canvasRef.current; const video=videoRef.current; if(canvas&&video&&isCam&&video.readyState>=2){ const ctx=canvas.getContext('2d'); if(ctx){ canvas.width=720; canvas.height=1280; ctx.filter='brightness(1.3) contrast(1.1)'; ctx.drawImage(video,0,0,canvas.width,canvas.height); ctx.filter='none'; const barH=180; ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.fillRect(0,canvas.height-barH,canvas.width,barH); ctx.fillStyle='#fff'; ctx.font='bold 28px sans-serif'; ctx.textAlign='center'; const words=verse.match(/.{1,34}(\s|$)/g)||[verse]; words.slice(0,3).forEach((line,i)=>{ ctx.fillText(line.trim(), canvas.width/2, canvas.height-barH+50 + i*36) }); if(isLive){ ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(40,40,12,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='bold 20px sans-serif'; ctx.textAlign='left'; ctx.fillText(`LIVE ${platform.toUpperCase()}`,65,47) } } } anim=requestAnimationFrame(draw) }; draw(); return()=>cancelAnimationFrame(anim) },[isCam, verse, isLive, platform])

  const getKeys=()=>{ if(platform==='facebook') return {url:'rtmps://live-api-s.facebook.com:443/rtmp/', key:fbKey}; if(platform==='youtube') return {url:'rtmp://a.rtmp.youtube.com/live2', key:ytKey}; return {url:'rtmp://push-va.tiktok.com/live/', key:ttKey} }
  const {url, key}=getKeys()
  const handleGoLive=async()=>{ if(!isCam) return alert('Start Camera first'); if(!key) return alert(`Paste ${platform} Stream Key! Go to facebook.com/live/producer to get it`); setIsLive(true); try{ await fetch('/api/live',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({platform, rtmpUrl:url, streamKey:key})}); alert(`🔴 LIVE on ${platform.toUpperCase()}! Check your Facebook!`) }catch(e:any){ setIsLive(false); alert(e.message) } }

  return (
    <div style={{padding:16, maxWidth:500, margin:'0 auto', paddingBottom:80}}>
      <h2 style={{fontWeight:900, fontSize:24}}>Live Studio Pro <span style={{fontSize:12, background:'#16a34a', color:'#fff', padding:'4px 8px', borderRadius:8}}>V7</span></h2>

      {/* BIG LOGIN STATUS BANNER - NEW */}
      {fbUser? (
        <div style={{background:'#dcfce7', border:'2px solid #16a34a', padding:12, borderRadius:12, marginTop:12, textAlign:'center'}}>
          <div style={{fontWeight:900, color:'#16a34a', fontSize:16}}>✅ LOGGED IN AS {fbUser.name}</div>
          <div style={{fontSize:11, color:'#333', marginTop:4}}>App ID: 1337456311621600 | Ready to go live!</div>
          <button onClick={()=>{ localStorage.removeItem('taglive_fbUser'); setFbUser(null); }} style={{marginTop:8, fontSize:11, padding:'4px 8px', borderRadius:6, border:'1px solid #ccc', background:'#fff'}}>Logout</button>
        </div>
      ) : (
        <div style={{background:'#fef3c7', border:'2px solid #f59e0b', padding:12, borderRadius:12, marginTop:12, textAlign:'center'}}>
          <div style={{fontWeight:900, color:'#d97706', fontSize:14}}>⚠️ NOT LOGGED IN</div>
          <div style={{fontSize:11, marginTop:2}}>Tap Facebook login below</div>
        </div>
      )}

      <div style={{marginTop:12, background:'#000', borderRadius:16, overflow:'hidden', position:'relative', aspectRatio:'9/16'}}>
        <video ref={videoRef} muted playsInline autoPlay style={{width:'100%', height:'100%', objectFit:'cover', display: isCam?'block':'none'}} />
        {!isCam && <div style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', height:400, flexDirection:'column', gap:4}}><span>Camera off</span><span style={{fontSize:11, opacity:0.7}}>{fbUser? `Ready for ${fbUser.name}` : 'Login first'}</span></div>}
        <canvas ref={canvasRef} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover'}} />
        {isLive && <div style={{position:'absolute', top:12, left:12, background:'#ef4444', color:'#fff', padding:'6px 12px', borderRadius:20, fontSize:13, fontWeight:900, zIndex:3, animation:'pulse 1s infinite'}}>● LIVE {platform} {isLive?'— TAP STOP TO END':''}</div>}
        {isCam && <div style={{position:'absolute', top:12, right:12, display:'flex', gap:8, zIndex:4}}><button onClick={toggleCamera} style={{background:'rgba(0,0,0,0.6)', color:'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>🔄 Flip</button><button onClick={toggleTorch} style={{background:torch?'#fbbf24':'rgba(0,0,0,0.6)', color:torch?'#000':'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>{torch?'🔦 On':'🔦'}</button></div>}
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        {!isCam? <button onClick={()=>startCamera()} style={{flex:1, background:'#111', color:'#fff', padding:14, borderRadius:10, fontWeight:800, border:'none', fontSize:16}}>📷 Start Camera</button>
        : <><button onClick={toggleCamera} style={{flex:1, background:'#6d28d9', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>🔄 Switch</button><button onClick={stopCamera} style={{flex:1, background:'#444', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>Stop Cam</button></>}
      </div>

      {/* LIVE CONTROL BUTTONS - ALWAYS VISIBLE */}
      {isCam && (
        <div style={{display:'flex', gap:8, marginTop:8}}>
          {!isLive? <button onClick={handleGoLive} style={{flex:1, background:'#16a34a', color:'#fff', padding:14, borderRadius:10, fontWeight:900, border:'none', fontSize:16}}>🔴 START LIVE NOW</button>
          : <button onClick={()=>setIsLive(false)} style={{flex:1, background:'#ef4444', color:'#fff', padding:14, borderRadius:10, fontWeight:900, border:'none', fontSize:16, animation:'pulse 1s infinite'}}>■ STOP / END LIVE</button>}
        </div>
      )}

      <textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%', height:80, marginTop:12, padding:12, borderRadius:12, border:'1px solid #ddd'}} />
      <div style={{marginTop:18, border:'2px solid #16a34a', borderRadius:16, padding:14}}>
        <h3 style={{fontWeight:800}}>🔴 Setup</h3>
        <div style={{display:'flex', gap:8, marginTop:10}}>
          <button onClick={loginFacebook} style={{flex:1, background: fbUser?'#16a34a':'#1877F2', color:'#fff', padding:12, borderRadius:10, fontWeight:900, border:'none', fontSize:12}}>{fbUser? `✓ ${fbUser.name.slice(0,12)}` : 'f Login with Facebook'}</button>
          <button onClick={loginYouTube} style={{flex:1, background: ytUser?'#16a34a':'#FF0000', color:'#fff', padding:12, borderRadius:10, fontWeight:900, border:'none', fontSize:12}}>{ytUser? `✓ ${ytUser.name.slice(0,12)}` : '▶ Login YouTube'}</button>
        </div>
        <div style={{display:'flex', gap:6, marginTop:14}}>{(['facebook','youtube','tiktok'] as const).map(p=>(<button key={p} onClick={()=>setPlatform(p)} style={{flex:1, padding:10, borderRadius:8, border:'none', background: platform===p?'#6d28d9':'#eee', color:platform===p?'#fff':'#000', fontWeight:800, textTransform:'capitalize'}}>{p}</button>))}</div>
        <div style={{marginTop:12}}><label style={{fontSize:12, fontWeight:700}}>{platform.toUpperCase()} RTMP URL</label><input value={url} readOnly style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4, fontSize:11, background:'#f5f3ff'}} /><label style={{fontSize:12, fontWeight:700, marginTop:10, display:'block'}}>Stream Key - REQUIRED FOR GO LIVE</label>{platform==='facebook' && <input value={fbKey} onChange={e=>setFbKey(e.target.value)} placeholder="Paste FB key from facebook.com/live/producer" style={{width:'100%', padding:12, borderRadius:8, border: fbKey?'2px solid #16a34a':'2px solid #ef4444', marginTop:4, background:fbUser?'#dcfce7':''}} />} {platform==='youtube' && <input value={ytKey} onChange={e=>setYtKey(e.target.value)} placeholder="YouTube key" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />} {platform==='tiktok' && <input value={ttKey} onChange={e=>setTtKey(e.target.value)} placeholder="TikTok manual" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4}} />}</div>
        {!isCam && <p style={{fontSize:11, color:'#ef4444', marginTop:8, fontWeight:700}}>⚠️ Start Camera first, then GO LIVE button will appear above!</p>}
        {isCam &&!key && <p style={{fontSize:11, color:'#ef4444', marginTop:8, fontWeight:700}}>⚠️ Paste Stream Key! Get it at facebook.com/live/producer on computer</p>}
        <button onClick={handleGoLive} style={{width:'100%', marginTop:12, background: isLive?'#ef4444':'#6d28d9', color:'#fff', padding:14, borderRadius:10, fontWeight:900, border:'none'}}>{isLive? '■ STOP LIVE' : `🔴 GO LIVE to ${platform.toUpperCase()}`}</button>
        {isLive && <button onClick={()=>setIsLive(false)} style={{width:'100%', marginTop:8, background:'#000', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>END LIVE STREAM</button>}
      </div>
    </div>
  )
}
