"use client"
import { useEffect, useRef, useState } from 'react'
declare global { interface Window { FB: any } }

const OFFLINE_KJV: Record<string,string> = {
"john 3:16":"John 3:16 - For God so loved the world that He gave His only begotten Son...",
"psalm 23":"Psalm 23 - The LORD is my shepherd; I shall not want.",
}

const BIBLE_VERSIONS = [
{ id: 'kjv', label: 'KJV' },
{ id: 'akjv', label: 'NKJV-like' },
{ id: 'web', label: 'NIV-like' },
]

export default function LiveStudio(){
const [verse,setVerse]=useState("John 3:16 - For God so loved the world that He gave His only begotten Son...")
const [isCam,setIsCam]=useState(false)
const [isLive,setIsLive]=useState(false)
const [facing,setFacing]=useState<'user'|'environment'>('user')
const [torch,setTorch]=useState(false)
const [fbUser,setFbUser]=useState<any>(null)
const [pages,setPages]=useState<any[]>([])
const [selectedPage,setSelectedPage]=useState<any>(null)
const [fbStreamUrl,setFbStreamUrl]=useState('')
const [pos,setPos]=useState({ x: 360, y: 1100, scale: 1, rotation: 0 })
const [bgMode,setBgMode]=useState<'face'|'black'|'image'|'split'>('face')
const [saved,setSaved]=useState<string[]>([])
const [fontSize,setFontSize]=useState(34)
const [align,setAlign]=useState<'center'|'justify'>('justify')
const [bgImage,setBgImage]=useState<string|null>(null)
const [ytKey,setYtKey]=useState('')
const [ytLive,setYtLive]=useState(false)
const [textColor,setTextColor]=useState('#00ff00')
const [boxColor,setBoxColor]=useState('#000000')
const [boxOpacity,setBoxOpacity]=useState(1)
const [logoImage,setLogoImage]=useState<string|null>(null)
const [logoPos,setLogoPos]=useState({ x: 360, y: 300, scale: 0.7, rotation: 0 })
const [isRecording,setIsRecording]=useState(false)
const [recordedUrl,setRecordedUrl]=useState<string|null>(null)
const [selected,setSelected]=useState<'text'|'logo'>('text')
const [showText,setShowText]=useState(true)
const [intros,setIntros]=useState<any[]>([])
const [outros,setOutros]=useState<any[]>([])
const [activeIntroId,setActiveIntroId]=useState<string|null>(null)
const [activeOutroId,setActiveOutroId]=useState<string|null>(null)
const [showStudio,setShowStudio]=useState(false)
const [showSettings,setShowSettings]=useState(true)
const [showBible,setShowBible]=useState(false)
const [bibleQuery,setBibleQuery]=useState('')
const [bibleResult,setBibleResult]=useState('')
const [bibleLoading,setBibleLoading]=useState(false)
const [bibleVer,setBibleVer]=useState('kjv')
const [tickerOn,setTickerOn]=useState(false)
const [tickerText,setTickerText]=useState('Welcome to Church Service | Sunday Service 9AM')
const [tickerSize,setTickerSize]=useState(18)
const [tickerSpeed,setTickerSpeed]=useState(2)
const [churchName,setChurchName]=useState('TAG LIVE CHURCH')
const [showChurchName,setShowChurchName]=useState(true)
const [liveSeconds,setLiveSeconds]=useState(0)
const [recSeconds,setRecSeconds]=useState(0)
const [lowData,setLowData]=useState(false)
const [broadcastPlaying,setBroadcastPlaying]=useState<any>(null)

const canvasRef=useRef<HTMLCanvasElement>(null)
const videoRef=useRef<HTMLVideoElement>(null)
const streamRef=useRef<MediaStream|null>(null)
const trackRef=useRef<MediaStreamTrack|null>(null)
const recorderRef=useRef<MediaRecorder|null>(null)
const recordedChunksRef=useRef<Blob[]>([])
const bgImageRef=useRef<HTMLImageElement|null>(null)
const logoImageRef=useRef<HTMLImageElement|null>(null)
const broadcastVideoRef=useRef<HTMLVideoElement>(null)
const broadcastImageRef=useRef<HTMLImageElement|null>(null)
const fileInputRef=useRef<HTMLInputElement>(null)
const logoInputRef=useRef<HTMLInputElement>(null)
const churchLogoInputRef=useRef<HTMLInputElement>(null)
const introFileRef=useRef<HTMLInputElement>(null)
const outroFileRef=useRef<HTMLInputElement>(null)
const tickerOffsetRef=useRef(720)
const lastTouch=useRef({ x:0, y:0, dist:0, angle:0, selScale:1, selRot:0 })
const timerRef=useRef<any>(null)

const formatTime=(s:number)=>{ const m=Math.floor(s/60); const sec=s%60; return `${m}:${sec.toString().padStart(2,'0')}` }
const startTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); timerRef.current=setInterval(()=>setLiveSeconds(p=>p+1),1000) }
const stopTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); timerRef.current=null }

useEffect(()=>{
try{
const s=localStorage.getItem('taglive_saved'); if(s) setSaved(JSON.parse(s));
const cn=localStorage.getItem('taglive_church_name'); if(cn) setChurchName(cn);
const lg=localStorage.getItem('taglive_church_logo'); if(lg){ setLogoImage(lg); const img=new Image(); img.src=lg; img.onload=()=>logoImageRef.current=img }
const yk=localStorage.getItem('taglive_ytkey'); if(yk) setYtKey(yk);
const ai=localStorage.getItem('taglive_active_intro'); if(ai) setActiveIntroId(ai);
const ao=localStorage.getItem('taglive_active_outro'); if(ao) setActiveOutroId(ao);
}catch{}
},[])

const openDB=()=>new Promise<any>((res,rej)=>{ const r=indexedDB.open('taglive_db',2); r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains('media')) db.createObjectStore('media',{keyPath:'id'}) }; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error) })
const saveToDB=async(obj:any)=>{ try{ const db=await openDB(); const tx=db.transaction('media','readwrite'); tx.objectStore('media').put(obj) }catch{} }
const saveIntros=async(arr:any[])=>{ setIntros(arr); for(const it of arr){ await saveToDB({id:it.id,kind:'intro',data:it}) } }
const saveOutros=async(arr:any[])=>{ setOutros(arr); for(const it of arr){ await saveToDB({id:it.id,kind:'outro',data:it}) } }

useEffect(()=>{
const load=async()=>{ try{ const db=await openDB(); const tx=db.transaction('media','readonly'); const req=tx.objectStore('media').getAll(); req.onsuccess=()=>{ const all=req.result||[]; const ins=all.filter((x:any)=>x.kind==='intro'); const outs=all.filter((x:any)=>x.kind==='outro'); if(ins.length) setIntros(ins.map((x:any)=>x.data)); if(outs.length) setOutros(outs.map((x:any)=>x.data)) } }catch{} }; load()
},[])

const fileToBase64=(file:File)=>new Promise<string>((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file) })
const getVideoDuration=(base64:string)=>new Promise<number>((res)=>{ const v=document.createElement('video'); v.src=base64; v.onloadedmetadata=()=>res(v.duration); setTimeout(()=>res(5),2000) })

const handleIntroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return;
const base64=await fileToBase64(file);
let dur=5; if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name };
const n=[...intros,item]; await saveIntros(n); setActiveIntroId(item.id); localStorage.setItem('taglive_active_intro', item.id); e.target.value='';
}
const handleOutroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return;
const base64=await fileToBase64(file);
let dur=5; if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name };
const n=[...outros,item]; await saveOutros(n); setActiveOutroId(item.id); localStorage.setItem('taglive_active_outro', item.id); e.target.value='';
}

const startCamera=async(newFacing=facing)=>{
try{
if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop());
await new Promise(r=>setTimeout(r,200));
const w=lowData?640:1280; const h=lowData?480:720;
const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing,width:{ideal:w},height:{ideal:h}},audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
streamRef.current=s; trackRef.current=s.getVideoTracks()[0];
if(videoRef.current){ videoRef.current.srcObject=s; await videoRef.current.play() }
setFacing(newFacing); setIsCam(true)
}catch(e:any){ alert('Camera: '+e.message) }
}
const stopCamera=()=>{ if(isRecording) stopRecording(); streamRef.current?.getTracks().forEach(t=>t.stop()); if(videoRef.current) videoRef.current.srcObject=null; setIsCam(false); setIsLive(false); setTorch(false); setYtLive(false); stopTimer() }
const toggleCamera=async()=>{ await startCamera(facing==='user'?'environment':'user') }
const toggleTorch=async()=>{ try{ const track:any=trackRef.current; if(!track?.getCapabilities?.()?.torch) return alert('Torch not supported'); await track.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch) }catch(e:any){ alert(e.message) } }

const loginFacebook=()=>{
if(!window.FB){ alert('Facebook SDK loading... wait 3 sec'); return }
window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name', (u:any)=>{ setFbUser(u); loadPages(resp.authResponse.accessToken) }) } },{scope:'public_profile,pages_show_list,pages_read_engagement'})
}
const loadPages=(tok?:string)=>{ const t=tok||window.FB?.getAuthResponse()?.accessToken; if(!t) return alert('Login first'); window.FB.api('/me/accounts', {access_token:t}, (res:any)=>{ if(res.data?.length){ setPages(res.data) } }) }

const createFbLiveAuto=async(page:any)=>{
const active=intros.find(i=>i.id===activeIntroId)
if(active){
setBroadcastPlaying(active)
if(active.type==='image'){ const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img } }
if(active.type==='video'&&broadcastVideoRef.current){ broadcastVideoRef.current.src=active.data; broadcastVideoRef.current.play().catch(()=>{}) }
setTimeout(async()=>{
setBroadcastPlaying(null); broadcastImageRef.current=null;
setSelectedPage(page)
try{
const res=await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token: page.access_token, title: verse.substring(0,60), description: 'TagLive - '+verse, status: 'UNPUBLISHED' }) })
const data=await res.json(); setFbStreamUrl(data.stream_url||''); setIsLive(true); startTimer(); setTimeout(()=>{ if(!isRecording) startRecording().catch(()=>{}) },500)
}catch{ setIsLive(true); startTimer(); setTimeout(()=>{ if(!isRecording) startRecording().catch(()=>{}) },500) }
}, (active.duration||5)*1000)
} else {
setSelectedPage(page)
try{
const res=await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token: page.access_token, title: verse.substring(0,60), description: 'TagLive - '+verse, status: 'UNPUBLISHED' }) })
const data=await res.json(); setFbStreamUrl(data.stream_url||''); setIsLive(true); startTimer(); setTimeout(()=>{ if(!isRecording) startRecording().catch(()=>{}) },500)
}catch{ setIsLive(true); startTimer(); setTimeout(()=>{ if(!isRecording) startRecording().catch(()=>{}) },500) }
}
}

const fetchBible=async(q=bibleQuery)=>{
if(!q.trim()) return
setBibleLoading(true); setBibleResult('')
try{
const res=await fetch(`https://bible-api.com/${encodeURIComponent(q)}?translation=${bibleVer}`)
const data=await res.json()
if(data.text){ setBibleResult(`${data.reference} - ${data.text}`) }
else throw new Error('not found')
}catch{
const key=q.toLowerCase().trim()
if(OFFLINE_KJV[key]) setBibleResult(OFFLINE_KJV[key]+' [OFFLINE]')
else setBibleResult('Not found. Try John 3:16, Psalm 23')
}
setBibleLoading(false)
}
const useBibleVerse=()=>{ if(bibleResult){ setVerse(bibleResult); setShowBible(false) } }

const pasteClipboard=async()=>{ try{ const t=await navigator.clipboard.readText(); if(t) setVerse(t) }catch{} }
const saveVerse=()=>{ if(!verse.trim()) return; const ns=[verse,...saved.filter(s=>s!==verse)].slice(0,20); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)) }
const deleteSaved=(idx:number)=>{ const ns=saved.filter((_,i)=>i!==idx); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)) }

const pickMedia=()=>fileInputRef.current?.click()
const pickLogo=()=>logoInputRef.current?.click()
const onFilePick=(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setBgImage(url); setBgMode('image'); const img=new Image(); img.src=url; img.onload=()=>{ bgImageRef.current=img } }
const onLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img } }
const handleChurchLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img } }
const removeChurchLogo=()=>{ localStorage.removeItem('taglive_church_logo'); setLogoImage(null); logoImageRef.current=null }

const startRecording=async()=>{
const canvas=canvasRef.current; if(!canvas) return alert('Start camera first')
const canvasStream=(canvas as any).captureStream(30) as MediaStream
const combined=new MediaStream()
canvasStream.getVideoTracks().forEach(t=>combined.addTrack(t))
streamRef.current?.getAudioTracks().forEach(t=>{ try{ combined.addTrack(t) }catch{} })
const active=intros.find((i:any)=>i.id===activeIntroId)
if(active){
setBroadcastPlaying(active)
if(active.type==='image'){
const img=new Image(); img.src=active.data; await new Promise(r=>{ img.onload=r; setTimeout(r,800) }); broadcastImageRef.current=img
} else if(active.type==='video'&&broadcastVideoRef.current){
const v=broadcastVideoRef.current; v.src=active.data; v.muted=false; try{ await v.play() }catch{}; await new Promise(r=>{ v.onended=()=>r(); setTimeout(r,(active.duration||5)*1000+800) })
broadcastImageRef.current=null; setBroadcastPlaying(null)
}
}
recordedChunksRef.current=[]
const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm'
const rec=new MediaRecorder(combined,{mimeType:mime})
recorderRef.current=rec
rec.ondataavailable=e=>{ if(e.data.size>0) recordedChunksRef.current.push(e.data) }
rec.onstop=()=>{ const blob=new Blob(recordedChunksRef.current,{type:'video/webm'}); const url=URL.createObjectURL(blob); setRecordedUrl(url); setRecSeconds(liveSeconds) }
rec.start(100); setIsRecording(true); startTimer()
}
const stopRecordingFinal=()=>{ try{ recorderRef.current?.stop() }catch{}; setIsRecording(false); if(!isLive&&!ytLive) stopTimer() }
const stopRecording=async()=>{
const active=outros.find((o:any)=>o.id===activeOutroId)
if(active){
setBroadcastPlaying(active)
if(active.type==='image'){ const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img; setTimeout(()=>stopRecordingFinal(), (active.duration||5)*1000) } }
else if(active.type==='video'&&broadcastVideoRef.current){ const v=broadcastVideoRef.current; v.src=active.data; v.play().catch(()=>{}); v.onended=()=>stopRecordingFinal(); setTimeout(()=>stopRecordingFinal(), (active.duration||10)*1000+800) }
else stopRecordingFinal()
} else stopRecordingFinal()
}

const onTouchStart=(e:any)=>{
const rect=canvasRef.current?.getBoundingClientRect(); if(!rect) return
const tx=(e.touches[0].clientX-rect.left)*(720/rect.width)
const ty=(e.touches[0].clientY-rect.top)*(1280/rect.height)
if(logoImage) setSelected(Math.hypot(tx-logoPos.x,ty-logoPos.y)<180?'logo':'text'); else setSelected('text')
}
const onTouchMove=(e:any)=>{
const rect=canvasRef.current?.getBoundingClientRect(); if(!rect) return
const tx=e.touches[0].clientX-rect.left; const ty=e.touches[0].clientY-rect.top;
const nx=tx*(720/rect.width); const ny=ty*(1280/rect.height);
if(selected==='logo') setLogoPos(p=>({...p,x:nx,y:ny})); else setPos(p=>({...p,x:nx,y:ny}))
}

useEffect(()=>{
let a:any
const wrapText=(ctx:any,text:string,maxWidth:number)=>{
const words=text.split(' '); let lines:string[]=[]; let cur='';
for(let w of words){ const test=cur+w+' '; if(ctx.measureText(test).width>maxWidth&&cur!==''){ lines.push(cur.trim()); cur=w+' ' } else cur=test }
if(cur) lines.push(cur.trim()); return lines
}
const draw=()=>{
const c=canvasRef.current, v=videoRef.current
if(c&&v&&isCam&&v.readyState>=2){
const ctx=c.getContext('2d'); if(!ctx) return
if(c.width!==720||c.height!==1280){ c.width=720; c.height=1280 }
if(broadcastPlaying){
ctx.fillStyle='#000'; ctx.fillRect(0,0,c.width,c.height)
if(broadcastPlaying.type==='image'&&broadcastImageRef.current){
const iw=broadcastImageRef.current.width, ih=broadcastImageRef.current.height
const ratio=Math.min(c.width/iw,c.height/ih); const nw=iw*ratio, nh=ih*ratio
ctx.drawImage(broadcastImageRef.current,(c.width-nw)/2,(c.height-nh)/2,nw,nh)
} else if(broadcastPlaying.type==='video'&&broadcastVideoRef.current&&broadcastVideoRef.current.readyState>=2){
const vw=broadcastVideoRef.current.videoWidth, vh=broadcastVideoRef.current.videoHeight
if(vw&&vh){ const ratio=Math.min(c.width/vw,c.height/vh); const nw=vw*ratio, nh=vh*ratio; ctx.drawImage(broadcastVideoRef.current,(c.width-nw)/2,(c.height-nh)/2,nw,nh) }
}
} else {
if(bgMode==='black'){ ctx.fillStyle='#000'; ctx.fillRect(0,0,c.width,c.height) }
else {
const vw=v.videoWidth||1280, vh=v.videoHeight||720
const rCanvas=c.width/c.height, rVideo=vw/vh; let sx,sy,sw,sh
if(rVideo>rCanvas){ sh=vh; sw=vh*rCanvas; sx=(vw-sw)/2; sy=0 } else { sw=vw; sh=vw/rCanvas; sx=0; sy=(vh-sh)/2 }
ctx.drawImage(v,sx,sy,sw,sh,0,0,c.width,c.height)
}
if(logoImageRef.current){
ctx.save(); ctx.translate(logoPos.x,logoPos.y); ctx.rotate(logoPos.rotation*Math.PI/180); ctx.scale(logoPos.scale,logoPos.scale);
const iw=logoImageRef.current.width, ih=logoImageRef.current.height; const maxW=180; const sc=Math.min(1,maxW/iw);
ctx.drawImage(logoImageRef.current,-iw*sc/2,-ih*sc/2,iw*sc,ih*sc); ctx.restore()
}
if(showText){
ctx.save(); ctx.translate(pos.x,pos.y); ctx.rotate(pos.rotation*Math.PI/180); ctx.scale(pos.scale,pos.scale);
ctx.font=`bold ${fontSize}px sans-serif`; const maxW=560; const pad=24; const boxW=maxW+pad*2;
const lines=wrapText(ctx,verse,maxW); const lineH=fontSize*1.38; const boxH=lines.length*lineH+pad*2;
const hexToRgba=(hex:string,op:number)=>{ const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${op})` }
ctx.fillStyle=hexToRgba(boxColor,boxOpacity); ctx.fillRect(-boxW/2,-boxH/2,boxW,boxH)
ctx.fillStyle=textColor; ctx.textAlign='center'; let y=-boxH/2+pad+lineH/2
lines.forEach((ln:string)=>{ ctx.fillText(ln,0,y); y+=lineH })
if(showChurchName&&churchName){ ctx.fillStyle='#FFD700'; ctx.font=`900 18px sans-serif`; ctx.fillText(churchName.toUpperCase(),0,y+22) }
ctx.restore()
}
if(isLive||ytLive||isRecording){
ctx.fillStyle='#FF0000'; ctx.font='900 28px sans-serif'; ctx.fillText(`● LIVE ${formatTime(liveSeconds)}`,24,22)
}
if(tickerOn&&tickerText){
const tickerH=tickerSize+24; ctx.fillStyle='#000'; ctx.fillRect(0,c.height-tickerH,c.width,tickerH)
ctx.fillStyle='#FFFF00'; ctx.font=`bold ${tickerSize}px sans-serif`; ctx.textAlign='left'
const txt=tickerText+'   •   '+tickerText; tickerOffsetRef.current-=tickerSpeed; if(tickerOffsetRef.current<0-ctx.measureText(txt).width) tickerOffsetRef.current=c.width
ctx.fillText(txt,tickerOffsetRef.current,c.height-tickerH/2)
}
}
}
a=requestAnimationFrame(draw)
}
draw(); return()=>cancelAnimationFrame(a)
},[isCam,verse,isLive,pos,bgMode,fontSize,align,bgImage,ytLive,textColor,boxColor,boxOpacity,logoImage,logoPos,isRecording,selected,showText,tickerOn,tickerText,tickerSize,tickerSpeed,churchName,showChurchName,liveSeconds,lowData,broadcastPlaying])

return (
<div style={{padding:16,maxWidth:480,margin:'0 auto'}}>
{showBible&&(
<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9998,background:'rgba(0,0,0,0.92)',padding:12,display:'flex',flexDirection:'column'}}>
<div style={{background:'#fff',borderRadius:16,padding:12,flex:1,display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto',width:'100%',overflow:'hidden'}}>
<div style={{display:'flex',justifyContent:'space-between'}}><b>📖 Bible</b><button onClick={()=>setShowBible(false)} style={{background:'#111',color:'#fff',border:'none',borderRadius:20,padding:'8px 12px',fontWeight:800}}>✕ Close</button></div>
<div style={{display:'flex',gap:6,marginTop:10}}><input value={bibleQuery} onChange={e=>setBibleQuery(e.target.value)} placeholder="John 3:16" style={{flex:1,padding:12,borderRadius:10,border:'2px solid #7c3aed'}}/><button onClick={()=>fetchBible()} style={{background:'#7c3aed',color:'#fff',border:'none',borderRadius:10,padding:'0 16px',fontWeight:800}}>{bibleLoading?'...':'Search'}</button></div>
<div style={{marginTop:8,background:'#f9f5ff',borderRadius:12,padding:12,flex:1,overflowY:'auto',border:'1px solid #ddd'}}>{bibleLoading?<div>Searching...</div>:bibleResult?<div style={{whiteSpace:'pre-wrap'}}>{bibleResult}</div>:<div>Try John 3:16</div>}</div>
<button onClick={useBibleVerse} disabled={!bibleResult} style={{marginTop:10,background:'#16a34a',color:'#fff',padding:14,borderRadius:12,fontWeight:900,border:'none'}}>Use This Verse</button>
</div>
</div>
)}

<div style={{display:'flex',alignItems:'center',gap:12}}><div style={{fontSize:26,fontWeight:900}}>Tag<span style={{color:'#7c3aed'}}>Live</span></div>{(isLive||ytLive||isRecording)&&<div style={{marginLeft:'auto',color:'#FF0000',fontWeight:900}}>● LIVE {formatTime(liveSeconds)}</div>}</div>

<div style={{marginTop:12,border:'2px solid #111',borderRadius:16,padding:12,background:'#fff'}}>
<div style={{display:'flex',justifyContent:'space-between'}}><b>⚙️ Settings & Studio</b><button onClick={()=>setShowSettings(!showSettings)} style={{padding:'8px 14px',borderRadius:20,border:'none',background:'#111',color:'#fff',fontWeight:900}}>{showSettings?'Hide':'Open'}</button></div>
{showSettings&&(
<div style={{marginTop:12,display:'flex',flexDirection:'column',gap:12}}>
<div style={{border:'2px solid #7c3aed',borderRadius:16,padding:12,background:'#f9f5ff'}}><b>Intro / Outro - No Limit</b><div style={{display:'flex',gap:6,marginTop:8}}><label style={{flex:1,background:'#7c3aed',color:'#fff',padding:12,borderRadius:10,fontWeight:800,textAlign:'center',cursor:'pointer'}}>Upload Intro<input ref={introFileRef} type="file" accept="video/*,image/*" onChange={handleIntroFile} style={{display:'none'}}/></label><label style={{flex:1,background:'#111',color:'#fff',padding:12,borderRadius:10,fontWeight:800,textAlign:'center',cursor:'pointer'}}>Upload Outro<input ref={outroFileRef} type="file" accept="video/*,image/*" onChange={handleOutroFile} style={{display:'none'}}/></label></div>
<div style={{marginTop:10}}>{intros.map((it:any)=><div key={it.id} style={{display:'flex',gap:4,marginTop:4}}><button onClick={()=>{setActiveIntroId(it.id);localStorage.setItem('taglive_active_intro',it.id)}} style={{flex:1,padding:8,borderRadius:8,border:'none',background:activeIntroId===it.id?'#16a34a':'#eee',textAlign:'left'}}>{activeIntroId===it.id?'✓ ':''}{it.title} ({Math.round(it.duration)}s)</button><button onClick={()=>saveIntros(intros.filter(x=>x.id!==it.id))} style={{padding:8,borderRadius:8,border:'none',background:'#ff0000',color:'#fff'}}>X</button></div>)}{outros.map((ot:any)=><div key={ot.id} style={{display:'flex',gap:4,marginTop:4}}><button onClick={()=>{setActiveOutroId(ot.id);localStorage.setItem('taglive_active_outro',ot.id)}} style={{flex:1,padding:8,borderRadius:8,border:'none',background:activeOutroId===ot.id?'#16a34a':'#eee',textAlign:'left'}}>{activeOutroId===ot.id?'✓ ':''}{ot.title} ({Math.round(ot.duration)}s)</button><button onClick={()=>saveOutros(outros.filter(x=>x.id!==ot.id))} style={{padding:8,borderRadius:8,border:'none',background:'#ff0000',color:'#fff'}}>X</button></div>)}</div>
</div>
<div style={{border:'2px solid #111',borderRadius:16,padding:12}}><div style={{display:'flex',justifyContent:'space-between'}}><b>Scrolling Ticker</b><button onClick={()=>setTickerOn(!tickerOn)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:tickerOn?'#16a34a':'#111',color:'#fff',fontWeight:800}}>{tickerOn?'ON':'OFF'}</button></div><input value={tickerText} onChange={e=>setTickerText(e.target.value)} placeholder="Announcement" style={{width:'100%',marginTop:8,padding:10,borderRadius:10,border:'1px solid #ddd'}}/></div>
<div style={{border:'2px solid #7c3aed',borderRadius:16,padding:12}}><b>Church Name</b><input value={churchName} onChange={e=>{setChurchName(e.target.value);localStorage.setItem('taglive_church_name',e.target.value)}} style={{width:'100%',marginTop:8,padding:10,borderRadius:10,border:'1px solid #ddd'}}/><div style={{marginTop:8}}><input ref={churchLogoInputRef} type="file" accept="image/*" onChange={handleChurchLogoPick}/>{logoImage&&<button onClick={removeChurchLogo} style={{marginLeft:8,background:'red',color:'#fff',border:'none',borderRadius:6,padding:'4px 8px'}}>Remove</button>}</div></div>
</div>
)}
</div>

<div onTouchStart={onTouchStart} onTouchMove={onTouchMove} style={{marginTop:10,background:'#000',borderRadius:18,overflow:'hidden',position:'relative',aspectRatio:'9/16'}}>
<video ref={videoRef} muted playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover',display:isCam?'block':'none'}}/>
{!isCam&&<div style={{color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',height:400}}>Camera off</div>}
<canvas ref={canvasRef} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}/>
<video ref={broadcastVideoRef} muted playsInline crossOrigin="anonymous" style={{position:'absolute',left:'-9999px',width:10,height:10,opacity:0.01}}/>
</div>

<div style={{display:'flex',gap:8,marginTop:12}}>{!isCam?<button onClick={()=>startCamera()} style={{flex:1,background:'#111',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Start Camera</button>:<><button onClick={toggleCamera} style={{flex:1,background:'#7c3aed',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Switch</button><button onClick={stopCamera} style={{flex:1,background:'#444',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Stop</button></>}</div>

<div style={{display:'flex',gap:6,marginTop:10}}>
{!isRecording?<button onClick={startRecording} disabled={!isCam} style={{flex:1,background:isCam?'#a21caf':'#ccc',color:'#fff',padding:12,borderRadius:10,fontWeight:800,border:'none'}}>Record MP4 {activeIntroId?'+ Intro':''}</button>:<button onClick={stopRecording} style={{flex:1,background:'#111',color:'#fff',padding:12,borderRadius:10,fontWeight:800,border:'none'}}>Stop + Outro ({formatTime(liveSeconds)})</button>}
</div>

{recordedUrl&&(
<div style={{marginTop:12,padding:12,background:'#111',borderRadius:16,border:'2px solid #16a34a'}}>
<div style={{color:'#fff',fontWeight:800,marginBottom:8}}>🎬 Preview - {formatTime(recSeconds)}</div>
<video src={recordedUrl} controls playsInline style={{width:'100%',borderRadius:12,background:'#000'}}/>
<div style={{display:'flex',gap:8,marginTop:10}}>
<a href={recordedUrl} download={`TAGLive-${Date.now()}.webm`} style={{flex:1,padding:12,borderRadius:24,background:'#16a34a',color:'#fff',textAlign:'center',fontWeight:900,textDecoration:'none'}}>⬇ Download MP4</a>
<button onClick={()=>{setRecordedUrl(null);setRecSeconds(0)}} style={{flex:1,padding:12,borderRadius:24,border:'none',background:'#333',color:'#fff',fontWeight:800}}>✕ Clear</button>
</div>
</div>
)}

<div style={{display:'flex',gap:6,marginTop:10}}><button onClick={()=>setShowBible(true)} style={{flex:1,background:'#2563eb',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none'}}>Open Bible</button><button onClick={pasteClipboard} style={{flex:1,background:'#059669',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none'}}>Paste</button><button onClick={saveVerse} style={{flex:1,background:'#f59e0b',color:'#000',padding:10,borderRadius:10,fontWeight:800,border:'none'}}>Save</button></div>
<textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%',height:90,marginTop:10,padding:12,borderRadius:12,border:'1px solid #ddd'}}/>
{saved.length>0&&<div style={{marginTop:8,border:'1px solid #eee',borderRadius:12,padding:8}}>{saved.map((s,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',background:'#f3f0ff',padding:'6px 10px',borderRadius:20,marginTop:4}}><span onClick={()=>setVerse(s)} style={{fontSize:11}}>{s.substring(0,40)}...</span><button onClick={()=>deleteSaved(i)} style={{background:'#ff0000',color:'#fff',border:'none',borderRadius:20,width:22,height:22}}>×</button></div>)}</div>}

<div style={{marginTop:14,border:'2px solid #111',borderRadius:14,padding:12}}><b>Connect Facebook</b><div style={{display:'flex',gap:8,marginTop:8}}><button onClick={loginFacebook} style={{flex:1,background:fbUser?'#16a34a':'#1877F2',color:'#fff',padding:12,borderRadius:8,fontWeight:800,border:'none'}}>{fbUser?`✓ ${fbUser.name}`:'Login'}</button><button onClick={()=>loadPages()} style={{flex:1,border:'1px solid #000',padding:12,borderRadius:8,fontWeight:800,background:'#fff'}}>Load Pages</button></div>{pages.map((p:any)=><div key={p.id} onClick={()=>createFbLiveAuto(p)} style={{marginTop:6,padding:10,background:selectedPage?.id===p.id?'#7c3aed':'#f3f0ff',borderRadius:8,fontWeight:700,cursor:'pointer'}}>{p.name} (Go Live + Record)</div>)}</div>

<div style={{marginTop:14,border:'2px solid #ff0000',borderRadius:14,padding:12}}><b>Connect YouTube Live</b><input value={ytKey} onChange={e=>{setYtKey(e.target.value);localStorage.setItem('taglive_ytkey',e.target.value)}} placeholder="YouTube Stream Key" style={{width:'100%',marginTop:8,padding:10,borderRadius:8,border:'1px solid #ddd'}}/><div style={{display:'flex',gap:8,marginTop:8}}><button onClick={()=>{if(!ytKey)return alert('Paste key'); const active=intros.find(i=>i.id===activeIntroId); if(active){setBroadcastPlaying(active); setTimeout(()=>{setBroadcastPlaying(null);setYtLive(true);setIsLive(true);startTimer(); setTimeout(()=>{ if(!isRecording) startRecording().catch(()=>{}) },500)},(active.duration||5)*1000)} else {setYtLive(true);setIsLive(true);startTimer(); setTimeout(()=>{ if(!isRecording) startRecording().catch(()=>{}) },500)}}} style={{flex:1,background:ytLive?'#16a34a':'#ff0000',color:'#fff',padding:12,borderRadius:8,fontWeight:800,border:'none'}}>{ytLive?`LIVE ${formatTime(liveSeconds)} + Rec`:'Go Live YT + Intro + Record'}</button><button onClick={()=>{setYtLive(false);if(!fbStreamUrl)setIsLive(false);stopTimer()}} style={{flex:1,border:'1px solid #000',padding:12,borderRadius:8,fontWeight:800,background:'#fff'}}>Stop YT</button></div></div>

<input ref={fileInputRef} type="file" accept="image/*" onChange={onFilePick} style={{display:'none'}}/>
<input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoPick} style={{display:'none'}}/>
</div>
)
}
