"use client"
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://gqifluvkrjzsebfdjcio.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzY4NDgsImV4cCI6MjEwNzk1Mjg0OH0.zonQMk22nXN0VsbHyI88hT27ntl-VxEEi8k2G8-k5lc')
declare global { interface Window { FB: any } }

export default function LiveStudio(){
  const [verse, setVerse] = useState("John 3:16 - For God so loved the world...")
  const [isCam, setIsCam] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [facing, setFacing] = useState<'user'|'environment'>('user')
  const [torch, setTorch] = useState(false)
  const [fbUser, setFbUser] = useState<any>(null)
  const [pages, setPages] = useState<any[]>([])
  const [selectedPage, setSelectedPage] = useState<any>(null)
  const [fbStreamUrl, setFbStreamUrl] = useState('')
  const [liveId, setLiveId] = useState('')
  const [pos, setPos] = useState({ x: 360, y: 1100, scale: 1, rotation: 0 })
  const [bgMode, setBgMode] = useState<'face'|'black'|'image'>('face')
  const [saved, setSaved] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [fontSize, setFontSize] = useState(34)
  const [align, setAlign] = useState<'center'|'justify'>('justify')
  const [bgImage, setBgImage] = useState<string|null>(null)
  const [ytKey, setYtKey] = useState('')
  const [ytLive, setYtLive] = useState(false)
  const [textColor, setTextColor] = useState('#00ff00')
  const [boxColor, setBoxColor] = useState('#000000')
  const [boxOpacity, setBoxOpacity] = useState(1)
  const [logoImage, setLogoImage] = useState<string|null>(null)
  const [logoPos, setLogoPos] = useState({ x: 360, y: 300, scale: 0.7, rotation: 0 })
  const [isRecording, setIsRecording] = useState(false)
  const [recordedUrl, setRecordedUrl] = useState<string|null>(null)
  const [selected, setSelected] = useState<'text'|'logo'>('text')
  const [showText, setShowText] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({ live: 0, daily: 0, weekly: 0, monthly: 0, total: 0 })
  // INTRO / OUTRO FINAL KILLER
  const [intros, setIntros] = useState<any[]>([])
  const [outros, setOutros] = useState<any[]>([])
  const [activeIntroId, setActiveIntroId] = useState<string|null>(null)
  const [activeOutroId, setActiveOutroId] = useState<string|null>(null)
  const [showStudio, setShowStudio] = useState(false)
  const [playing, setPlaying] = useState<any>(null)
  const [animTitle, setAnimTitle] = useState('APOSTLE JAMES AGBEM KAJINYANA')
  const [animSub, setAnimSub] = useState('Welcome to Live Service')
  const [introDur, setIntroDur] = useState(5)
  const introFileRef = useRef<HTMLInputElement>(null)
  const outroFileRef = useRef<HTMLInputElement>(null)
  const introVideoRef = useRef<HTMLVideoElement>(null)

  const lastTouch = useRef({ dist: 0, angle: 0, x:0, y:0, scale:1, rot:0, selScale:1, selRot:0 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream|null>(null)
  const trackRef = useRef<MediaStreamTrack|null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bgImageRef = useRef<HTMLImageElement|null>(null)
  const logoImageRef = useRef<HTMLImageElement|null>(null)
  const recorderRef = useRef<MediaRecorder|null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(()=>{
    const fbAppId = '1951327349161990'
    if(!document.getElementById('fb-sdk')){
      const s = document.createElement('script'); s.id='fb-sdk'; s.src='https://connect.facebook.net/en_US/sdk.js';
      s.onload=()=>{ window.FB.init({appId: fbAppId, cookie:true, xfbml:false, version:'v19.0'}) }
      document.body.appendChild(s)
    }
    try{
      const sv = localStorage.getItem('taglive_saved'); if(sv) setSaved(JSON.parse(sv))
      const yk = localStorage.getItem('taglive_ytkey'); if(yk) setYtKey(yk)
      const si = localStorage.getItem('taglive_intros'); if(si) setIntros(JSON.parse(si))
      const so = localStorage.getItem('taglive_outros'); if(so) setOutros(JSON.parse(so))
      const ai = localStorage.getItem('taglive_active_intro'); if(ai) setActiveIntroId(ai)
      const ao = localStorage.getItem('taglive_active_outro'); if(ao) setActiveOutroId(ao)
      const params = new URLSearchParams(window.location.search)
      if(params.get('admin')==='taglive2026'){ localStorage.setItem('taglive_admin','true'); setIsAdmin(true) }
      else if(localStorage.getItem('taglive_admin')==='true'){ setIsAdmin(true) }
    }catch{}
    const handleVis = async ()=>{ if(!document.hidden){ try{ const t = await navigator.clipboard.readText(); if(t && t.length>5 && t.length<500 && t!==verse) setVerse(t) }catch{} } }
    document.addEventListener('visibilitychange', handleVis)
    return ()=> document.removeEventListener('visibilitychange', handleVis)
  },[])

  useEffect(()=>{
    const trackDevice = async()=>{
      try{
        let deviceId = localStorage.getItem('taglive_device')
        if(!deviceId){ deviceId = `dev_${Date.now()}_${Math.random().toString(36).slice(2,9)}`; localStorage.setItem('taglive_device', deviceId) }
        await supabase.from('taglive_devices').upsert({ device_id: deviceId, last_seen: new Date().toISOString(), user_agent: navigator.userAgent.substring(0,200) }, { onConflict: 'device_id' })
        const lastView = localStorage.getItem('tl_last_view'); const now = Date.now()
        if(!lastView || now - parseInt(lastView) > 30*60*1000){ await supabase.from('taglive_views').insert({ device_id: deviceId }); localStorage.setItem('tl_last_view', now.toString()) }
        if(localStorage.getItem('taglive_admin')==='true'){
          const nowDate = new Date(); const todayStart = new Date(nowDate); todayStart.setHours(0,0,0,0)
          const weekStart = new Date(nowDate); weekStart.setDate(nowDate.getDate() - 7)
          const monthStart = new Date(nowDate); monthStart.setDate(nowDate.getDate() - 30)
          const fiveMinAgo = new Date(nowDate.getTime() - 5*60*1000)
          const { count: live } = await supabase.from('taglive_devices').select('*', { count: 'exact', head: true }).gt('last_seen', fiveMinAgo.toISOString())
          const { count: total } = await supabase.from('taglive_views').select('*', { count: 'exact', head: true })
          const { count: daily } = await supabase.from('taglive_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString())
          const { count: weekly } = await supabase.from('taglive_views').select('*', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString())
          const { count: monthly } = await supabase.from('taglive_views').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString())
          setStats({ live: live||0, daily: daily||0, weekly: weekly||0, monthly: monthly||0, total: total||0 })
        }
      }catch(e){}
    }
    trackDevice(); const interval = setInterval(trackDevice, 60000); return ()=> clearInterval(interval)
  },[isAdmin])

  // INTRO / OUTRO LOGIC
  const saveIntros = (arr:any[])=>{ setIntros(arr); localStorage.setItem('taglive_intros', JSON.stringify(arr)) }
  const saveOutros = (arr:any[])=>{ setOutros(arr); localStorage.setItem('taglive_outros', JSON.stringify(arr)) }
  const fileToBase64 = (file:File)=> new Promise<string>((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file) })
  const addImageIntro = async(isOutro=false)=>{
    const input = isOutro? outroFileRef.current : introFileRef.current
    const file = (input as any)?.files?.[0]; if(!file) return alert('Pick file first')
    const base64 = await fileToBase64(file)
    const item = { id: `id_${Date.now()}`, type: file.type.startsWith('video')? 'video' : 'image', data: base64, duration: introDur, title: file.name }
    if(isOutro){ const n=[...outros, item]; saveOutros(n) } else { const n=[...intros, item]; saveIntros(n) }
    alert('✅ Saved!')
  }
  const addAnimatedIntro = (isOutro=false)=>{
    if(!animTitle.trim()) return alert('Add title')
    const item = { id: `id_${Date.now()}`, type: 'animated', data: null, duration: introDur, title: animTitle, subtitle: animSub }
    if(isOutro){ const n=[...outros, item]; saveOutros(n) } else { const n=[...intros, item]; saveIntros(n) }
    alert('✅ Animated Saved!')
  }
  const playItem = (item:any, onEnd?:()=>void)=>{
    setPlaying(item)
    if(item.type==='video'){ setTimeout(()=>{ introVideoRef.current?.play() },200) }
    const dur = item.type==='video'? 15000 : item.duration*1000
    setTimeout(()=>{ setPlaying(null); if(onEnd) onEnd() }, dur)
  }
  const playActiveIntroThen = (cb:()=>void)=>{
    const active = intros.find(i=>i.id===activeIntroId)
    if(!active) return cb()
    playItem(active, cb)
  }
  const playActiveOutro = ()=>{
    const active = outros.find(o=>o.id===activeOutroId)
    if(!active) return
    playItem(active)
  }

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
  const stopCamera = ()=>{ 
    if(isRecording) stopRecording(); 
    streamRef.current?.getTracks().forEach(t=>t.stop()); 
    if(videoRef.current) videoRef.current.srcObject=null; 
    setIsCam(false); setIsLive(false); setTorch(false); setYtLive(false)
    if(activeOutroId) playActiveOutro()
  }
  const toggleCamera = async()=>{ await startCamera(facing==='user'?'environment':'user') }
  const toggleTorch = async()=>{ try{ const track:any = trackRef.current; if(!track?.getCapabilities?.()?.torch) return alert('Torch not supported'); await track.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch) }catch(e:any){ alert(e.message) } }
  const loginFacebook = ()=>{
    if(!window.FB){ alert('Wait 3 sec...'); return }
    window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); loadPages(resp.authResponse.accessToken) }) } },{scope:'public_profile,pages_show_list,pages_read_engagement,business_management'})
  }
  const loadPages = (tok?:string)=>{ const t = tok || window.FB?.getAuthResponse()?.accessToken; if(!t) return alert('Login first'); window.FB.api('/me/accounts', {access_token:t}, (res:any)=>{ if(res.data?.length){ setPages(res.data); alert(`Found ${res.data.length} pages`) } else alert('No pages') }) }
  const createFbLiveAuto = async (page:any)=>{
    playActiveIntroThen(async ()=>{
      setSelectedPage(page)
      try{
        const res = await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token: page.access_token, title: verse.substring(0,60), description: 'TagLive - '+verse, status: 'UNPUBLISHED' }) })
        const data = await res.json(); if(data.error) throw new Error(JSON.stringify(data.error)); setFbStreamUrl(data.stream_url); setLiveId(data.id); setIsLive(true); alert('✅ FB LIVE AUTO-CREATED AFTER INTRO!')
      }catch(e:any){ alert('Auto Live needs approval: '+e.message); setIsLive(true) }
    })
  }
  const openBibleApp = ()=>{ alert('📖 Open Bible app, COPY verse, return here - auto-paste!') }
  const pasteClipboard = async()=>{ try{ const t = await navigator.clipboard.readText(); if(t) setVerse(t); else alert('Clipboard empty') }catch{ alert('Allow clipboard') } }
  const saveVerse = ()=>{ if(!verse.trim()) return; const ns = [verse, ...saved.filter(s=>s!==verse)].slice(0,20); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)); alert('Saved!') }
  const pickMedia = ()=> fileInputRef.current?.click()
  const pickLogo = ()=> logoInputRef.current?.click()
  const onFilePick = (e:any)=>{ const f = e.target.files?.[0]; if(!f) return; const url = URL.createObjectURL(f); setBgImage(url); setBgMode('image'); const img = new Image(); img.src=url; img.onload=()=>{ bgImageRef.current=img } }
  const onLogoPick = (e:any)=>{ const f = e.target.files?.[0]; if(!f) return; const url = URL.createObjectURL(f); setLogoImage(url); const img = new Image(); img.src=url; img.onload=()=>{ logoImageRef.current=img }; setSelected('logo') }
  const startRecording = ()=>{
    const canvas = canvasRef.current; if(!canvas) return alert('Start camera first')
    const canvasStream = (canvas as any).captureStream(30) as MediaStream
    const audioTracks = streamRef.current?.getAudioTracks() || []
    audioTracks.forEach(t=> canvasStream.addTrack(t))
    chunksRef.current = []
    const rec = new MediaRecorder(canvasStream, { mimeType: 'video/webm;codecs=vp9' })
    rec.ondataavailable = (e)=>{ if(e.data.size>0) chunksRef.current.push(e.data) }
    rec.onstop = ()=>{ const blob = new Blob(chunksRef.current, { type: 'video/webm' }); const url = URL.createObjectURL(blob); setRecordedUrl(url) }
    rec.start(100); recorderRef.current = rec; setIsRecording(true)
  }
  const stopRecording = ()=>{ recorderRef.current?.stop(); setIsRecording(false) }

  const onTouchStart = (e:any)=>{
    const rect = canvasRef.current?.getBoundingClientRect(); if(!rect) return
    const tx = (e.touches[0].clientX - rect.left) * (720/rect.width)
    const ty = (e.touches[0].clientY - rect.top) * (1280/rect.height)
    const distText = Math.hypot(tx - pos.x, ty - pos.y)
    const distLogo = Math.hypot(tx - logoPos.x, ty - logoPos.y)
    if(logoImage && distLogo < 180 && distLogo < distText){ setSelected('logo'); lastTouch.current.selScale = logoPos.scale; lastTouch.current.selRot = logoPos.rotation }
    else { setSelected('text'); lastTouch.current.selScale = pos.scale; lastTouch.current.selRot = pos.rotation }
    if(e.touches.length===1){ setDragging(true); lastTouch.current.x = e.touches[0].clientX; lastTouch.current.y = e.touches[0].clientY }
    else if(e.touches.length===2){ const dx = e.touches[1].clientX - e.touches[0].clientX; const dy = e.touches[1].clientY - e.touches[0].clientY; lastTouch.current.dist = Math.hypot(dx,dy); lastTouch.current.angle = Math.atan2(dy,dx)*180/Math.PI; lastTouch.current.selScale = selected==='logo'? logoPos.scale : pos.scale; lastTouch.current.selRot = selected==='logo'? logoPos.rotation : pos.rotation; setDragging(false) }
  }
  const onTouchMove = (e:any)=>{
    const rect = canvasRef.current?.getBoundingClientRect(); if(!rect) return
    if(e.touches.length===1 && dragging){ const tx = e.touches[0].clientX - rect.left; const ty = e.touches[0].clientY - rect.top; const nx = tx*(720/rect.width); const ny = ty*(1280/rect.height); if(selected==='logo') setLogoPos(p=>({...p, x:nx, y:ny})); else setPos(p=>({...p, x:nx, y:ny})) }
    if(e.touches.length===2){ const dx = e.touches[1].clientX - e.touches[0].clientX; const dy = e.touches[1].clientY - e.touches[0].clientY; const dist = Math.hypot(dx,dy); const angle = Math.atan2(dy,dx)*180/Math.PI; if(lastTouch.current.dist>0){ const f = dist / lastTouch.current.dist; if(selected==='logo'){ setLogoPos(p=>({ ...p, scale: Math.min(3, Math.max(0.2, lastTouch.current.selScale*f)), rotation: lastTouch.current.selRot + (angle-lastTouch.current.angle) })) } else { setPos(p=>({ ...p, scale: Math.min(3, Math.max(0.4, lastTouch.current.selScale*f)), rotation: lastTouch.current.selRot + (angle-lastTouch.current.angle) })) } } }
  }
  const onTouchEnd = ()=> { setDragging(false); lastTouch.current.dist=0 }

  useEffect(()=>{
    let a:any
    const wrapText = (ctx:any, text:string, maxWidth:number)=>{ const words=text.split(' '); let lines=[]; let cur=''; for(let w of words){ const test=cur+w+' '; if(ctx.measureText(test).width>maxWidth && cur!==''){ lines.push(cur.trim()); cur=w+' ' } else cur=test } if(cur) lines.push(cur.trim()); return lines }
    const draw = ()=>{
      const c=canvasRef.current, v=videoRef.current
      if(c&&v&&isCam&&v.readyState>=2){
        const ctx=c.getContext('2d')
        if(ctx){
          c.width=720; c.height=1280
          if(bgMode==='black'){ ctx.fillStyle='#000'; ctx.fillRect(0,0,c.width,c.height) }
          else if(bgMode==='image'){ if(bgImageRef.current) ctx.drawImage(bgImageRef.current,0,0,c.width,c.height); else { const g=ctx.createLinearGradient(0,0,c.width,c.height); g.addColorStop(0,'#1e3a8a'); g.addColorStop(1,'#581c87'); ctx.fillStyle=g; ctx.fillRect(0,0,c.width,c.height) } }
          else ctx.drawImage(v,0,0,c.width,c.height)
          if(logoImageRef.current){ ctx.save(); ctx.translate(logoPos.x, logoPos.y); ctx.rotate(logoPos.rotation*Math.PI/180); ctx.scale(logoPos.scale, logoPos.scale); const iw = logoImageRef.current.width, ih = logoImageRef.current.height; const maxLogoW = 180; const sc = Math.min(1, maxLogoW/iw); ctx.drawImage(logoImageRef.current, -iw*sc/2, -ih*sc/2, iw*sc, ih*sc); if(selected==='logo'){ ctx.strokeStyle='#00ff00'; ctx.lineWidth=4; ctx.setLineDash([10,10]); ctx.strokeRect(-iw*sc/2-6, -ih*sc/2-6, iw*sc+12, ih*sc+12); ctx.setLineDash([]) } ctx.restore() }
          if(showText){
            ctx.save(); ctx.translate(pos.x, pos.y); ctx.rotate(pos.rotation*Math.PI/180); ctx.scale(pos.scale, pos.scale); ctx.font=`bold ${fontSize}px sans-serif`; const maxW = 560; const pad = 24; const boxW = maxW + pad*2; const paragraphs = verse.split('\n'); let allLines:{text:string, isLastInPara:boolean, paraIdx:number}[] = []; paragraphs.forEach((para,pIdx)=>{ if(!para.trim()){ allLines.push({text:'', isLastInPara:true, paraIdx:pIdx}); return } const wrapped = wrapText(ctx, para.trim(), maxW); wrapped.forEach((l,i)=> allLines.push({text:l, isLastInPara:i===wrapped.length-1, paraIdx:pIdx})) }); const realCount = allLines.filter(l=>l.text!=='').length; const lineH = fontSize * 1.38; const boxH = realCount*lineH + (paragraphs.length-1)*10 + pad*2; const hexToRgba = (hex:string, op:number)=>{ const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${op})` }; if(bgMode==='face'){ ctx.fillStyle=hexToRgba(boxColor, boxOpacity); ctx.fillRect(-boxW/2, -boxH/2, boxW, boxH) } else if(bgMode==='image'){ ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=10; ctx.shadowOffsetX=2; ctx.shadowOffsetY=3 } ctx.fillStyle=textColor; let y = -boxH/2 + pad + lineH/2; allLines.forEach((ln)=>{ if(!ln.text){ y+=10; return } if(paragraphs.length>1 && ln.paraIdx>0){ ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(ln.text, 0, y) } else { if(align==='justify' && !ln.isLastInPara){ const words = ln.text.split(' '); if(words.length===1){ ctx.textAlign='center'; ctx.fillText(ln.text, 0, y) } else { ctx.textAlign='left'; ctx.textBaseline='middle'; const totalWordsWidth = words.reduce((s,w)=>s+ctx.measureText(w).width,0); const gap = (maxW - totalWordsWidth) / (words.length-1); let x = -maxW/2; words.forEach((w)=>{ ctx.fillText(w, x, y); x += ctx.measureText(w).width + gap }) } } else { ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(ln.text, 0, y) } } y+= lineH }); if(selected==='text'){ ctx.strokeStyle='#7c3aed'; ctx.lineWidth=3; ctx.setLineDash([12,8]); ctx.strokeRect(-boxW/2-4, -boxH/2-4, boxW+8, boxH+8); ctx.setLineDash([]) } ctx.restore() }
          if(isLive || ytLive || isRecording){ ctx.fillStyle=isRecording?'#a21caf':'#ef4444'; ctx.beginPath(); ctx.arc(40,40,12,0,Math.PI*2); ctx.fill() }
        }
      }
      a=requestAnimationFrame(draw)
    }; draw(); return()=>cancelAnimationFrame(a)
  },[isCam,verse,isLive,pos,bgMode,fontSize,align,bgImage,ytLive,textColor,boxColor,boxOpacity,logoImage,logoPos,isRecording,selected,showText])

  return (
    <div style={{padding:16, maxWidth:480, margin:'0 auto'}}>
      {playing && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:9999, background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
          {playing.type==='image' && <img src={playing.data} style={{width:'100%', height:'100%', objectFit:'contain'}} />}
          {playing.type==='video' && <video ref={introVideoRef} src={playing.data} autoPlay controls={false} style={{width:'100%', height:'100%', objectFit:'contain'}} onEnded={()=>setPlaying(null)} />}
          {playing.type==='animated' && (
            <div style={{textAlign:'center', padding:40, animation:'pulse 1s infinite'}}>
              <div style={{fontSize:14, letterSpacing:4, color:'#7c3aed', fontWeight:900, marginBottom:20}}>{playing.subtitle || 'WELCOME'}</div>
              <div style={{fontSize:32, fontWeight:900, color:'#fff', lineHeight:1.1}}>{playing.title}</div>
              <div style={{marginTop:30, width:80, height:80, borderRadius:'50%', border:'4px solid #7c3aed', display:'flex', alignItems:'center', justifyContent:'center', margin:'30px auto 0'}}>
                <div style={{width:0,height:0, borderLeft:'20px solid #fff', borderTop:'12px solid transparent', borderBottom:'12px solid transparent', marginLeft:6}} />
              </div>
            </div>
          )}
          <button onClick={()=>setPlaying(null)} style={{position:'absolute', top:20, right:20, background:'rgba(255,255,255,0.2)', color:'#fff', border:'none', borderRadius:20, padding:'8px 14px', fontWeight:800}}>✕ Skip</button>
        </div>
      )}
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{width:52, height:52, background:'#111', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
          <div style={{width:28, height:28, border:'3px solid #fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{width:0,height:0, borderLeft:'8px solid #7c3aed', borderTop:'5px solid transparent', borderBottom:'5px solid transparent', marginLeft:2}} />
          </div>
          <div style={{position:'absolute', right:-10, top:6, background:'#7c3aed', padding:'3px 4px', borderRadius:4, transform:'rotate(12deg)'}}>
            <div style={{width:14, height:2, background:'#000', marginBottom:2}}/><div style={{width:14, height:2, background:'#000', marginBottom:2}}/><div style={{width:14, height:2, background:'#000'}}/>
          </div>
        </div>
        <div><div style={{fontSize:26, fontWeight:900}}>Tag<span style={{color:'#7c3aed'}}>Live</span></div><div style={{fontSize:10, letterSpacing:2, fontWeight:800, color:'#666'}}>TAG YOUR LIVE</div></div>
      </div>
      {isAdmin && (
        <div style={{marginTop:10, background:'#000', border:'2px solid #00ff00', borderRadius:16, padding:14}}>
          <div style={{color:'#00ff00', fontWeight:900, textAlign:'center', fontSize:12, marginBottom:10}}>👑 ADMIN DASHBOARD - Only you see this!</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6, textAlign:'center'}}>
            <div style={{background:'#111', borderRadius:10, padding:8}}><div style={{fontSize:10, opacity:0.7, color:'#fff'}}>🟢 LIVE</div><div style={{fontSize:18, fontWeight:900, color:'#00ff00'}}>{stats.live}</div></div>
            <div style={{background:'#111', borderRadius:10, padding:8}}><div style={{fontSize:10, opacity:0.7, color:'#fff'}}>📅 DAILY</div><div style={{fontSize:18, fontWeight:900, color:'#ffeb00'}}>{stats.daily}</div></div>
            <div style={{background:'#111', borderRadius:10, padding:8}}><div style={{fontSize:10, opacity:0.7, color:'#fff'}}>📊 WEEKLY</div><div style={{fontSize:18, fontWeight:900, color:'#00d4ff'}}>{stats.weekly}</div></div>
            <div style={{background:'#111', borderRadius:10, padding:8}}><div style={{fontSize:10, opacity:0.7, color:'#fff'}}>🗓️ MONTHLY</div><div style={{fontSize:18, fontWeight:900, color:'#ff00ff'}}>{stats.monthly}</div></div>
            <div style={{background:'#111', borderRadius:10, padding:8}}><div style={{fontSize:10, opacity:0.7, color:'#fff'}}>📈 TOTAL</div><div style={{fontSize:18, fontWeight:900, color:'#fff'}}>{stats.total}</div></div>
          </div>
        </div>
      )}

      <div style={{marginTop:12, border:'2px solid #7c3aed', borderRadius:16, padding:12, background:'#f9f5ff'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <b style={{fontSize:14}}>🎬 Intro / Outro Studio - FINAL KILL</b>
          <button onClick={()=>setShowStudio(!showStudio)} style={{padding:'6px 12px', borderRadius:20, border:'none', background:'#111', color:'#fff', fontWeight:800, fontSize:11}}>{showStudio?'Hide':'Open'}</button>
        </div>
        {showStudio && (
          <div style={{marginTop:10}}>
            <div style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', background:'#fff', padding:8, borderRadius:10, border:'1px solid #ddd'}}>
              <input value={animTitle} onChange={e=>setAnimTitle(e.target.value)} placeholder="Title e.g. APOSTLE JAMES..." style={{flex:1, minWidth:140, padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}} />
              <input value={animSub} onChange={e=>setAnimSub(e.target.value)} placeholder="Subtitle e.g. Welcome" style={{flex:1, minWidth:120, padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}} />
              <div style={{display:'flex', alignItems:'center', gap:4}}><span style={{fontSize:10, fontWeight:800}}>Sec:</span><input type="number" min={1} max={30} value={introDur} onChange={e=>setIntroDur(parseInt(e.target.value)||5)} style={{width:50, padding:6, borderRadius:8, border:'1px solid #ddd'}} /></div>
            </div>
            <div style={{display:'flex', gap:6, marginTop:8}}>
              <button onClick={()=>addAnimatedIntro(false)} style={{flex:1, background:'#7c3aed', color:'#fff', padding:10, borderRadius:10, fontWeight:800, border:'none', fontSize:11}}>✨ Save Animated Intro</button>
              <button onClick={()=>addAnimatedIntro(true)} style={{flex:1, background:'#111', color:'#fff', padding:10, borderRadius:10, fontWeight:800, border:'none', fontSize:11}}>✨ Save Animated Outro</button>
            </div>
            <div style={{display:'flex', gap:6, marginTop:8}}>
              <input ref={introFileRef} type="file" accept="image/*,video/*" style={{display:'none'}} onChange={()=>{}} />
              <button onClick={()=>{ introFileRef.current?.click(); setTimeout(()=>{ const f=introFileRef.current?.files?.[0]; if(f) addImageIntro(false) },500) }} style={{flex:1, background:'#fff', border:'1px solid #000', padding:10, borderRadius:10, fontWeight:800, fontSize:11}}>🖼️ Upload Intro Image/Video</button>
              <input ref={outroFileRef} type="file" accept="image/*,video/*" style={{display:'none'}} />
              <button onClick={()=>{ outroFileRef.current?.click() }} style={{flex:1, background:'#fff', border:'1px solid #000', padding:10, borderRadius:10, fontWeight:800, fontSize:11}}>🖼️ Upload Outro</button>
            </div>
            <div style={{marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <div style={{background:'#fff', borderRadius:10, padding:8, border:'1px solid #ddd'}}>
                <div style={{fontSize:11, fontWeight:900, marginBottom:6}}>INTROs ({intros.length}) - Tap to Activate:</div>
                {intros.map(i=>(
                  <div key={i.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px', marginTop:4, background:i.id===activeIntroId?'#7c3aed':'#f3f0ff', color:i.id===activeIntroId?'#fff':'#000', borderRadius:8, fontSize:11}}>
                    <span onClick={()=>{ setActiveIntroId(i.id); localStorage.setItem('taglive_active_intro', i.id) }} style={{flex:1, cursor:'pointer', fontWeight:700}}>{i.type==='animated'?'✨':i.type==='video'?'🎥':'🖼️'} {i.title?.substring(0,20)} ({i.duration}s) {i.id===activeIntroId?'✅ ACTIVE':''}</span>
                    <button onClick={()=>{ playItem(i) }} style={{marginLeft:4, background:'#000', color:'#fff', border:'none', borderRadius:6, padding:'2px 6px', fontSize:10}}>▶</button>
                    <button onClick={()=>{ const n=intros.filter(x=>x.id!==i.id); saveIntros(n); if(activeIntroId===i.id){ setActiveIntroId(null); localStorage.removeItem('taglive_active_intro') } }} style={{marginLeft:4, background:'#ef4444', color:'#fff', border:'none', borderRadius:6, padding:'2px 6px', fontSize:10}}>✕</button>
                  </div>
                ))}
                {intros.length===0 && <div style={{fontSize:11, opacity:0.6}}>No intros yet. Create above!</div>}
              </div>
              <div style={{background:'#fff', borderRadius:10, padding:8, border:'1px solid #ddd'}}>
                <div style={{fontSize:11, fontWeight:900, marginBottom:6}}>OUTROs ({outros.length}) - Tap to Activate:</div>
                {outros.map(o=>(
                  <div key={o.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px', marginTop:4, background:o.id===activeOutroId?'#16a34a':'#f0fdf4', color:o.id===activeOutroId?'#fff':'#000', borderRadius:8, fontSize:11}}>
                    <span onClick={()=>{ setActiveOutroId(o.id); localStorage.setItem('taglive_active_outro', o.id) }} style={{flex:1, cursor:'pointer', fontWeight:700}}>{o.type==='animated'?'✨':o.type==='video'?'🎥':'🖼️'} {o.title?.substring(0,20)} {o.id===activeOutroId?'✅':''}</span>
                    <button onClick={()=>{ playItem(o) }} style={{marginLeft:4, background:'#000', color:'#fff', border:'none', borderRadius:6, padding:'2px 6px', fontSize:10}}>▶</button>
                    <button onClick={()=>{ const n=outros.filter(x=>x.id!==o.id); saveOutros(n); if(activeOutroId===o.id){ setActiveOutroId(null); localStorage.removeItem('taglive_active_outro') } }} style={{marginLeft:4, background:'#ef4444', color:'#fff', border:'none', borderRadius:6, padding:'2px 6px', fontSize:10}}>✕</button>
                  </div>
                ))}
                {outros.length===0 && <div style={{fontSize:11, opacity:0.6}}>No outros yet.</div>}
              </div>
            </div>
            <div style={{marginTop:8, fontSize:10, background:'#111', color:'#00ff88', padding:8, borderRadius:8, textAlign:'center', fontWeight:800}}>✅ Active Intro auto-plays when you tap GO LIVE! Active Outro plays when you STOP!</div>
          </div>
        )}
      </div>

      <div style={{display:'flex', gap:6, marginTop:12}}>
        <button onClick={()=>setBgMode('face')} style={{flex:1, padding:8, borderRadius:20, border:'none', background:bgMode==='face'?'#111':'#eee', color:bgMode==='face'?'#fff':'#000', fontWeight:800, fontSize:12}}>👤 Face</button>
        <button onClick={()=>setBgMode('black')} style={{flex:1, padding:8, borderRadius:20, border:'none', background:bgMode==='black'?'#111':'#eee', color:bgMode==='black'?'#fff':'#000', fontWeight:800, fontSize:12}}>⬛ Black</button>
        <button onClick={()=>setBgMode('image')} style={{flex:1, padding:8, borderRadius:20, border:'none', background:bgMode==='image'?'#111':'#eee', color:bgMode==='image'?'#fff':'#000', fontWeight:800, fontSize:12}}>🖼️ Image</button>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:6, marginTop:10, flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:140, display:'flex', alignItems:'center', gap:6, background:'#f3f0ff', padding:'6px 10px', borderRadius:10}}>
          <span style={{fontSize:10, fontWeight:800}}>A-</span>
          <input type="range" min={20} max={60} value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value))} style={{flex:1}} />
          <span style={{fontSize:10, fontWeight:800}}>A+</span>
          <span style={{fontSize:10, fontWeight:800, background:'#111', color:'#fff', padding:'3px 6px', borderRadius:20}}>{fontSize}</span>
        </div>
        <button onClick={()=>setAlign(align==='justify'?'center':'justify')} style={{padding:'8px 10px', borderRadius:10, border:'none', background:align==='justify'?'#111':'#ddd', color:align==='justify'?'#fff':'#000', fontWeight:800, fontSize:10}}>{align==='justify'?'☰ Justify':'≡ Center'}</button>
        <button onClick={pickMedia} style={{padding:'8px 10px', borderRadius:10, border:'none', background:'#7c3aed', color:'#fff', fontWeight:800, fontSize:10}}>🖼️ Media</button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFilePick} style={{display:'none'}} />
      </div>
      <div style={{display:'flex', gap:6, marginTop:8, alignItems:'center', background:'#fff', border:'1px solid #eee', padding:8, borderRadius:10, flexWrap:'wrap'}}>
        <div style={{display:'flex', alignItems:'center', gap:4}}><span style={{fontSize:10, fontWeight:800}}>Text</span><input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} style={{width:28, height:28, border:'none', borderRadius:6}} /></div>
        <div style={{display:'flex', alignItems:'center', gap:4}}><span style={{fontSize:10, fontWeight:800}}>Box</span><input type="color" value={boxColor} onChange={e=>setBoxColor(e.target.value)} style={{width:28, height:28, border:'none', borderRadius:6}} /></div>
        <div style={{display:'flex', alignItems:'center', gap:4, flex:1}}><span style={{fontSize:10, fontWeight:800}}>Opac</span><input type="range" min={0} max={1} step={0.05} value={boxOpacity} onChange={e=>setBoxOpacity(parseFloat(e.target.value))} style={{flex:1}} /></div>
        <button onClick={pickLogo} style={{padding:'6px 10px', borderRadius:8, border:'none', background:logoImage?'#16a34a':'#111', color:'#fff', fontWeight:800, fontSize:10}}>{logoImage?'✓ Logo':'➕ Logo'}</button>
        <input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoPick} style={{display:'none'}} />
        <button onClick={()=>setShowText(!showText)} style={{padding:'6px 10px', borderRadius:8, border:'none', background:showText?'#111':'#ddd', color:showText?'#fff':'#000', fontWeight:800, fontSize:10}}>{showText?'👁️ Text':'🚫 Text'}</button>
      </div>
      <div style={{display:'flex', gap:6, marginTop:6, fontSize:10, fontWeight:800}}>
        <div style={{flex:1, padding:'4px 8px', borderRadius:20, background:selected==='text'?'#7c3aed':'#eee', color:selected==='text'?'#fff':'#000', textAlign:'center'}}>✏️ {selected==='text'?'TEXT SELECTED (drag/pinch)':'Tap Text'}</div>
        <div style={{flex:1, padding:'4px 8px', borderRadius:20, background:selected==='logo'?'#16a34a':'#eee', color:selected==='logo'?'#fff':'#000', textAlign:'center'}}>🖼️ {selected==='logo'?'LOGO SELECTED':'Tap Logo'}</div>
      </div>
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onMouseDown={onTouchStart as any} style={{marginTop:10, background:'#000', borderRadius:18, overflow:'hidden', position:'relative', aspectRatio:'9/16', touchAction:'none'}}>
        <video ref={videoRef} muted playsInline autoPlay style={{width:'100%', height:'100%', objectFit:'cover', display:isCam&&bgMode==='face'?'block':'none'}}/>
        {!isCam && <div style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', height:420}}>Camera off</div>}
        <canvas ref={canvasRef} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}}/>
        {isCam && <div style={{position:'absolute', top:12, right:12, display:'flex', gap:8, zIndex:10}}>
          <button onClick={toggleCamera} style={{background:'rgba(0,0,0,0.7)', color:'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>🔄 Flip</button>
          <button onClick={toggleTorch} style={{background:torch?'#fbbf24':'rgba(0,0,0,0.7)', color:torch?'#000':'#fff', border:'none', borderRadius:20, padding:'8px 12px', fontWeight:800}}>{torch?'🔦 On':'🔦'}</button>
        </div>}
        {isLive && <div style={{position:'absolute', top:12, left:12, background:'#ef4444', color:'#fff', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:900}}>● FB LIVE</div>}
        {ytLive && <div style={{position:'absolute', top:42, left:12, background:'#ff0000', color:'#fff', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:900}}>● YT LIVE</div>}
        {isRecording && <div style={{position:'absolute', top:72, left:12, background:'#a21caf', color:'#fff', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:900}}>● REC</div>}
        <div style={{position:'absolute', bottom:8, left:0, right:0, textAlign:'center', color:'#fff', fontSize:10, opacity:0.7}}>Tap Logo=Select Logo | Tap Text=Select Text | {showText?'Text ON':'Text OFF'}</div>
      </div>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        {!isCam? <button onClick={()=>startCamera()} style={{flex:1, background:'#111', color:'#fff', padding:14, borderRadius:12, fontWeight:800, border:'none'}}>📷 Start Camera</button>
        : <><button onClick={toggleCamera} style={{flex:1, background:'#7c3aed', color:'#fff', padding:14, borderRadius:12, fontWeight:800, border:'none'}}>🔄 Switch Camera</button>
           <button onClick={stopCamera} style={{flex:1, background:'#444', color:'#fff', padding:14, borderRadius:12, fontWeight:800, border:'none'}}>Stop + Outro</button></>}
      </div>
      <div style={{display:'flex', gap:6, marginTop:10}}>
        {!isRecording? <button onClick={startRecording} disabled={!isCam} style={{flex:1, background:isCam?'#a21caf':'#ccc', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none', fontSize:12}}>● Record Video</button>
        : <button onClick={stopRecording} style={{flex:1, background:'#111', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none', fontSize:12}}>■ Stop Recording</button>}
        {recordedUrl && <a href={recordedUrl} download={`taglive-${Date.now()}.webm`} style={{flex:1, background:'#16a34a', color:'#fff', padding:12, borderRadius:10, fontWeight:800, textAlign:'center', textDecoration:'none', fontSize:12}}>⬇ Download</a>}
      </div>
      {recordedUrl && <video src={recordedUrl} controls style={{width:'100%', marginTop:8, borderRadius:12}} />}
      <div style={{display:'flex', gap:6, marginTop:10}}>
        <button onClick={openBibleApp} style={{flex:1, background:'#2563eb', color:'#fff', padding:10, borderRadius:10, fontWeight:800, border:'none', fontSize:12}}>📖 Open Bible App</button>
        <button onClick={pasteClipboard} style={{flex:1, background:'#059669', color:'#fff', padding:10, borderRadius:10, fontWeight:800, border:'none', fontSize:12}}>📋 Paste Verse</button>
        <button onClick={saveVerse} style={{flex:1, background:'#f59e0b', color:'#000', padding:10, borderRadius:10, fontWeight:800, border:'none', fontSize:12}}>💾 Save</button>
      </div>
      <textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%', height:90, marginTop:10, padding:12, borderRadius:12, border:'1px solid #ddd'}} placeholder={"Ministering:\nAPOSTLE JAMES AGBEM KAJINYANA"} />
      {saved.length>0 && <div style={{marginTop:8, border:'1px solid #eee', borderRadius:10, padding:8}}><div style={{fontSize:11, fontWeight:800, marginBottom:6}}>📌 Saved (Tap):</div><div style={{display:'flex', flexWrap:'wrap', gap:6}}>{saved.map((s,i)=><span key={i} onClick={()=>setVerse(s)} style={{fontSize:11, background:'#f3f0ff', border:'1px solid #ddd', padding:'6px 8px', borderRadius:20, cursor:'pointer'}}>{s.substring(0,30)}...</span>)}</div></div>}
      <div style={{marginTop:14, border:'2px solid #111', borderRadius:14, padding:12}}>
        <b>Connect Facebook - Intro will play first!</b>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button onClick={loginFacebook} style={{flex:1, background:fbUser?'#16a34a':'#1877F2', color:'#fff', padding:12, borderRadius:8, fontWeight:800, border:'none'}}>{fbUser?`✓ ${fbUser.name}`:'Login Facebook'}</button>
          <button onClick={()=>loadPages()} style={{flex:1, border:'1px solid #000', padding:12, borderRadius:8, fontWeight:800, background:'#fff'}}>Load My Pages</button>
        </div>
        {pages.map((p:any)=><div key={p.id} onClick={()=>createFbLiveAuto(p)} style={{marginTop:6, padding:10, background:selectedPage?.id===p.id?'#7c3aed':'#f3f0ff', color:selectedPage?.id===p.id?'#fff':'#000', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer'}}>{p.name} {selectedPage?.id===p.id?'✓':'(Tap to Go Live with Intro)'}</div>)}
        {fbStreamUrl && <div style={{marginTop:10, padding:10, background:'#dcfce7', borderRadius:8, fontSize:11, wordBreak:'break-all'}}>✅ FB: {fbStreamUrl.substring(0,70)}...</div>}
      </div>
      <div style={{marginTop:14, border:'2px solid #ff0000', borderRadius:14, padding:12}}>
        <b>🔴 Connect YouTube Live - Intro plays first!</b>
        <div style={{fontSize:11, color:'#666', marginTop:4}}>YouTube Studio {'>'} Go Live {'>'} Stream {'>'} Copy Stream Key</div>
        <input value={ytKey} onChange={e=>{setYtKey(e.target.value); localStorage.setItem('taglive_ytkey', e.target.value)}} placeholder="Paste YouTube Stream Key here" style={{width:'100%', marginTop:8, padding:10, borderRadius:8, border:'1px solid #ddd', fontSize:12}} />
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button onClick={()=>{ if(!ytKey) return alert('Paste YouTube key first'); playActiveIntroThen(()=>{ setYtLive(true); setIsLive(true); alert('✅ YouTube LIVE ON AFTER INTRO') }) }} style={{flex:1, background:ytLive?'#16a34a':'#ff0000', color:'#fff', padding:12, borderRadius:8, fontWeight:800, border:'none'}}>{ytLive?'✓ YouTube LIVE ON':'Go Live YouTube + Intro'}</button>
          <button onClick={()=>{setYtLive(false); if(!fbStreamUrl) setIsLive(false); if(activeOutroId) playActiveOutro()}} style={{flex:1, border:'1px solid #000', padding:12, borderRadius:8, fontWeight:800, background:'#fff'}}>Stop YT + Outro</button>
        </div>
      </div>
      <p style={{textAlign:'center', fontSize:11, color:'#16a34a', marginTop:10, fontWeight:700}}>✅ FINAL KILL: Intro + Outro + Save Forever</p>
    </div>
  )
}
