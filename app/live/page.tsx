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
  const [pages, setPages] = useState<any[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream|null>(null)
  const trackRef = useRef<MediaStreamTrack|null>(null)

  useEffect(()=>{
    const fbAppId = '1951327349161990'
    if(!document.getElementById('fb-sdk')){
      const s = document.createElement('script'); s.id='fb-sdk'; s.src='https://connect.facebook.net/en_US/sdk.js';
      s.onload=()=>{ window.FB.init({appId: fbAppId, cookie:true, xfbml:false, version:'v19.0'}) }
      document.body.appendChild(s)
    }
  },[])

  const startCamera = async(newFacing = facing)=>{
    try{
      if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
      await new Promise(r=>setTimeout(r,300))
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing, width:{ideal:1280}, height:{ideal:720}}, audio:true})
      streamRef.current = s; trackRef.current = s.getVideoTracks()[0]
      if(videoRef.current){ videoRef.current.srcObject = s; await videoRef.current.play() }
      setFacing(newFacing); setIsCam(true)
    }catch(e:any){ alert('Camera: '+e.message) }
  }
  const stopCamera = ()=>{ streamRef.current?.getTracks().forEach(t=>t.stop()); if(videoRef.current) videoRef.current.srcObject=null; setIsCam(false); setIsLive(false); setTorch(false) }

  // RESTORED FEATURE 1: CAMERA SWITCH
  const toggleCamera = async()=>{ await startCamera(facing==='user'?'environment':'user') }

  // RESTORED FEATURE 2: FLASH LIGHT
  const toggleTorch = async()=>{
    try{
      const track: any = trackRef.current
      const caps = track?.getCapabilities?.()
      if(!caps?.torch) return alert('Torch not supported on this phone/browser - try Chrome')
      await track.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch)
    }catch(e:any){ alert('Torch: '+e.message) }
  }

  const loginFacebook = ()=>{
    if(!window.FB){ alert('Wait 3 sec... SDK loading'); return; }
    window.FB.login((resp:any)=>{
      if(resp.authResponse){
        window.FB.api('/me?fields=name,picture', (user:any)=>{
          setFbUser(user)
          // auto load pages after login
          loadPages(resp.authResponse.accessToken)
        })
      }
    },{scope:'public_profile,pages_show_list,business_management,pages_read_engagement', config_id: ''})
  }

  const loadPages = (token?: string)=>{
    const accessToken = token || window.FB?.getAuthResponse()?.accessToken
    if(!accessToken) return alert('Login Facebook first')
    window.FB.api('/me/accounts', {access_token: accessToken}, (res:any)=>{
      if(res.data){
        setPages(res.data)
        alert(`Found ${res.data.length} pages! Select one below`)
      } else {
        alert('No pages found or permission needed: '+JSON.stringify(res))
      }
    })
  }

  useEffect(()=>{
    let anim:any
    const draw = ()=>{
      const canvas = canvasRef.current; const video = videoRef.current
      if(canvas && video && isCam && video.readyState>=2){
        const ctx = canvas.getContext('2d')
        if(ctx){
          canvas.width=720; canvas.height=1280
          ctx.drawImage(video,0,0,canvas.width,canvas.height)
          const barH=180; ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.fillRect(0,canvas.height-barH,canvas.width,barH)
          ctx.fillStyle='#fff'; ctx.font='bold 28px sans-serif'; ctx.textAlign='center'
          const words = verse.match(/.{1,34}(\s|$)/g) || [verse]
          words.slice(0,3).forEach((line,i)=>{ ctx.fillText(line.trim(), canvas.width/2, canvas.height-barH+50 + i*36) })
          if(isLive){ ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(40,40,12,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='bold 20px sans-serif'; ctx.textAlign='left'; ctx.fillText(`LIVE ${platform.toUpperCase()}`,65,47) }
        }
      }
      anim=requestAnimationFrame(draw)
    }; draw(); return ()=>cancelAnimationFrame(anim)
  },[isCam, verse, isLive, platform])

  return (
    <div style={{padding:16, maxWidth:500, margin:'0 auto'}}>
      <h2 style={{fontWeight:900}}>TagLive - Tag Your Live</h2>
      <div style={{marginTop:12, background:'#000', borderRadius:16, overflow:'hidden', position:'relative', aspectRatio:'9/16'}}>
        <video ref={videoRef} muted playsInline autoPlay style={{width:'100%', height:'100%', objectFit:'cover', display: isCam?'block':'none'}} />
        {!isCam && <div style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', height:400}}>Camera off</div>}
        <canvas ref={canvasRef} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}} />
        {isCam && <div style={{position:'absolute', top:12, right:12, display:'flex', gap:8, zIndex:4}}>
          <button onClick={toggleCamera} style={{background:'rgba(0,0,0,0.7)', color:'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>🔄 Flip</button>
          <button onClick={toggleTorch} style={{background:torch?'#fbbf24':'rgba(0,0,0,0.7)', color:torch?'#000':'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>{torch?'🔦 On':'🔦 Off'}</button>
        </div>}
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        {!isCam? <button onClick={()=>startCamera()} style={{flex:1, background:'#111', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>📷 Start Camera</button>
        : <><button onClick={toggleCamera} style={{flex:1, background:'#6d28d9', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>🔄 Switch Camera</button>
           <button onClick={stopCamera} style={{flex:1, background:'#444', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>Stop</button></>}
      </div>

      <textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%', height:80, marginTop:12, padding:12, borderRadius:12}} />

      <div style={{marginTop:16, border:'1px solid #ddd', borderRadius:12, padding:12}}>
        <b>Connect Facebook</b>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button onClick={loginFacebook} style={{background:'#1877F2', color:'#fff', padding:10, borderRadius:8, border:'none', fontWeight:800}}>{fbUser? `✓ ${fbUser.name}` : 'Login Facebook'}</button>
          <button onClick={()=>loadPages()} style={{border:'1px solid #000', padding:10, borderRadius:8, fontWeight:800}}>Load My Pages</button>
        </div>
        {pages.map(p=><div key={p.id} style={{marginTop:8, padding:8, background:'#f0f0f0', borderRadius:8}}>{p.name}</div>)}
      </div>

      <input placeholder="Paste Facebook Stream Key" value={fbKey} onChange={e=>setFbKey(e.target.value)} style={{width:'100%', padding:12, marginTop:12, borderRadius:8, border:'1px solid red'}} />
      <p style={{fontSize:12, color:'#666'}}>Start camera first, then paste stream key.</p>
      <p style={{fontSize:11, marginTop:12, color:'green', fontWeight:700}}>✅ RESTORED: Switch Camera + Flash Light + Scripture Projection (John 3:16 overlay)</p>
    </div>
  )
}
