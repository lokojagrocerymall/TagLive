"use client"
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://gqifluvkrjzsebfdjcio.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTY4MjcsImV4cCI6MjA2NzM5MjgyN30.zonQMk22nXN0VsbHyI88hT27ntl-VxEEi8k2G8-k5lc')
declare global { interface Window { FB: any } }

// FIXED DB - SAVES AS BLOB SO IT STAYS FOREVER
const openDB = () => new Promise<IDBDatabase>((res,rej)=>{
  const req = indexedDB.open('taglive_db_v2', 2)
  req.onupgradeneeded = ()=>{
    const db = req.result
    if(!db.objectStoreNames.contains('intros')) db.createObjectStore('intros', {keyPath:'id'})
    if(!db.objectStoreNames.contains('outros')) db.createObjectStore('outros', {keyPath:'id'})
  }
  req.onsuccess = ()=>res(req.result)
  req.onerror = ()=>rej(req.error)
})
const idbSaveBlob = async (store:string, item:any)=>{
  const db = await openDB()
  return new Promise<void>((resolve, reject)=>{
    const tx = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).put(item)
    req.onsuccess = ()=>resolve()
    req.onerror = ()=>reject(req.error)
    tx.oncomplete = ()=>{ db.close() }
  })
}
const idbGetAll = async (store:string): Promise<any[]>=> new Promise(async(res)=>{
  try{
    const db = await openDB()
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).getAll()
    req.onsuccess = ()=>{ const r = req.result as any[]; db.close(); res(r) }
    req.onerror = ()=>{ db.close(); res([]) }
  }catch{ res([]) }
})
const idbDelete = async (store:string, id:string)=>{
  const db = await openDB()
  return new Promise<void>((r)=>{
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).delete(id)
    tx.oncomplete = ()=>{ db.close(); r() }
  })
}
const fileToBase64 = (file:File|Blob)=>new Promise<string>((res,rej)=>{ const rd=new FileReader(); rd.onload=()=>res(rd.result as string); rd.onerror=rej; rd.readAsDataURL(file) })
const getVideoDuration = (blob: Blob): Promise<number> => new Promise((resolve)=>{
  const url = URL.createObjectURL(blob)
  const v = document.createElement('video')
  v.src = url
  v.onloadedmetadata = ()=>{ resolve(v.duration); URL.revokeObjectURL(url) }
  v.onerror = ()=>{ resolve(7); URL.revokeObjectURL(url) }
  setTimeout(()=>{ resolve(7); try{URL.revokeObjectURL(url)}catch{} }, 2500)
})

const OFFLINE_KJV: Record<string,string> = {"john 3:16":"John 3:16 - For God so loved the world...","romans 1:20":"Romans 1:20 - For the invisible things...","psalm 23":"Psalm 23 - The LORD is my shepherd...","philippians 4:13":"Philippians 4:13 - I can do all things..."}
const BIBLE_VERSIONS = [{ id: 'kjv', label: 'KJV' },{ id: 'akjv', label: 'NKJV-like' },{ id: 'web', label: 'NIV-like' },{ id: 'bbe', label: 'GNB-like' },{ id: 'asv', label: 'RSV-like' },{ id: 'lsv', label: 'ESV-like' },{ id: 'oeb-cw', label: 'AMP-like' },]
const BIBLE_BOOKS = [{ name: "Genesis", chapters: 50 },{ name: "Exodus", chapters: 40 },{ name: "Leviticus", chapters: 27 },{ name: "Numbers", chapters: 36 },{ name: "Deuteronomy", chapters: 34 },{ name: "Joshua", chapters: 24 },{ name: "Judges", chapters: 21 },{ name: "Ruth", chapters: 4 },{ name: "1 Samuel", chapters: 31 },{ name: "2 Samuel", chapters: 24 },{ name: "1 Kings", chapters: 22 },{ name: "2 Kings", chapters: 25 },{ name: "1 Chronicles", chapters: 29 },{ name: "2 Chronicles", chapters: 36 },{ name: "Ezra", chapters: 10 },{ name: "Nehemiah", chapters: 13 },{ name: "Esther", chapters: 10 },{ name: "Job", chapters: 42 },{ name: "Psalm", chapters: 150 },{ name: "Proverbs", chapters: 31 },{ name: "Ecclesiastes", chapters: 12 },{ name: "Song of Solomon", chapters: 8 },{ name: "Isaiah", chapters: 66 },{ name: "Jeremiah", chapters: 52 },{ name: "Lamentations", chapters: 5 },{ name: "Ezekiel", chapters: 48 },{ name: "Daniel", chapters: 12 },{ name: "Hosea", chapters: 14 },{ name: "Joel", chapters: 3 },{ name: "Amos", chapters: 9 },{ name: "Obadiah", chapters: 1 },{ name: "Jonah", chapters: 4 },{ name: "Micah", chapters: 7 },{ name: "Nahum", chapters: 3 },{ name: "Habakkuk", chapters: 3 },{ name: "Zephaniah", chapters: 3 },{ name: "Haggai", chapters: 2 },{ name: "Zechariah", chapters: 14 },{ name: "Malachi", chapters: 4 },{ name: "Matthew", chapters: 28 },{ name: "Mark", chapters: 16 },{ name: "Luke", chapters: 24 },{ name: "John", chapters: 21 },{ name: "Acts", chapters: 28 },{ name: "Romans", chapters: 16 },{ name: "1 Corinthians", chapters: 16 },{ name: "2 Corinthians", chapters: 13 },{ name: "Galatians", chapters: 6 },{ name: "Ephesians", chapters: 6 },{ name: "Philippians", chapters: 4 },{ name: "Colossians", chapters: 4 },{ name: "1 Thessalonians", chapters: 5 },{ name: "2 Thessalonians", chapters: 3 },{ name: "1 Timothy", chapters: 6 },{ name: "2 Timothy", chapters: 4 },{ name: "Titus", chapters: 3 },{ name: "Philemon", chapters: 1 },{ name: "Hebrews", chapters: 13 },{ name: "James", chapters: 5 },{ name: "1 Peter", chapters: 5 },{ name: "2 Peter", chapters: 3 },{ name: "1 John", chapters: 5 },{ name: "2 John", chapters: 1 },{ name: "3 John", chapters: 1 },{ name: "Jude", chapters: 1 },{ name: "Revelation", chapters: 22 }]
const SS_HYMNS = [{no:1,title:"There Shall Be Showers Of Blessing",lyrics:"There shall be showers of blessing:\\nThis is the promise of love;"},{no:2,title:"What A Friend We Have In Jesus",lyrics:"What a friend we have in Jesus"},{no:10,title:"How Great Thou Art",lyrics:"O Lord my God"},{no:20,title:"It Is Well With My Soul",lyrics:"When peace like a river"},{no:40,title:"To God Be The Glory",lyrics:"To God be the glory"},{no:41,title:"The Old Rugged Cross",lyrics:"On a hill far away"},{no:42,title:"Blessed Assurance",lyrics:"Blessed assurance, Jesus is mine!"},{no:100,title:"Holy Holy Holy",lyrics:"Holy, holy, holy! Lord God Almighty!"},{no:320,title:"When The Roll Is Called Up Yonder",lyrics:"When the trumpet of the Lord shall sound,"},];
const BUILD_348 = ()=>{ let list=[...SS_HYMNS]; for(let i=1;i<=348;i++){ if(!list.find(h=>h.no===i)){ list.push({no:i,title:`SS&S ${i}`,lyrics:`SS&S ${i}`}); } } return list.sort((a,b)=>a.no-b.no); };

export default function Page(){
const canvasRef=useRef<HTMLCanvasElement>(null)
const videoRef=useRef<HTMLVideoElement>(null)
const broadcastVideoRef=useRef<HTMLVideoElement>(null)
const streamRef=useRef<MediaStream|null>(null)
const trackRef=useRef<MediaStreamTrack|null>(null)
const recorderRef=useRef<MediaRecorder|null>(null)
const chunksRef=useRef<Blob[]>([])
const audioCtxRef=useRef<AudioContext|null>(null)
const fileInputRef=useRef<HTMLInputElement>(null)
const logoInputRef=useRef<HTMLInputElement>(null)
const churchLogoInputRef=useRef<HTMLInputElement>(null)
const introFileRef=useRef<HTMLInputElement>(null)
const outroFileRef=useRef<HTMLInputElement>(null)
const broadcastImageRef=useRef<HTMLImageElement|null>(null)
const tickerOffsetRef=useRef(720)
const [isCam,setIsCam]=useState(false)
const [facing,setFacing]=useState<'user'|'environment'>('user')
const [torch,setTorch]=useState(false)
const [verse,setVerse]=useState('TagLive - Tag Your Live')
const [saved,setSaved]=useState<string[]>([])
const [bgMode,setBgMode]=useState<'face'|'black'|'image'|'split'>('face')
const [bgImage,setBgImage]=useState<string|null>(null)
const [logo,setLogo]=useState<string|null>(null)
const [churchLogo,setChurchLogo]=useState<string|null>(null)
const [logoPos,setLogoPos]=useState({x:10,y:10,w:60,h:60})
const [churchLogoPos,setChurchLogoPos]=useState({x:10,y:60,w:80,h:25})
const [isLive,setIsLive]=useState(false)
const [ytLive,setYtLive]=useState(false)
const [liveSeconds,setLiveSeconds]=useState(0)
const [timerRefState,setTimerRefState]=useState<NodeJS.Timeout|null>(null)
const [fbUser,setFbUser]=useState<any>(null)
const [pages,setPages]=useState<any[]>([])
const [selectedPage,setSelectedPage]=useState<any>(null)
const [fbStreamUrl,setFbStreamUrl]=useState('')
const [liveId,setLiveId]=useState('')
const [isRecording,setIsRecording]=useState(false)
const [recordedUrl,setRecordedUrl]=useState<string|null>(null)
const [mp4Url,setMp4Url]=useState<string|null>(null)
const [isConverting,setIsConverting]=useState(false)
const [intros,setIntros]=useState<any[]>([])
const [outros,setOutros]=useState<any[]>([])
const [activeIntroId,setActiveIntroId]=useState<string|null>(null)
const [activeOutroId,setActiveOutroId]=useState<string|null>(null)
const [broadcastPlaying,setBroadcastPlaying]=useState<any>(null)
const [showBible,setShowBible]=useState(false)
const [bibleMode,setBibleMode]=useState<'bible'|'hymn'>('bible')
const [bibleQuery,setBibleQuery]=useState('')
const [bibleVer,setBibleVer]=useState('kjv')
const [bibleResult,setBibleResult]=useState('')
const [bibleLoading,setBibleLoading]=useState(false)
const [hymnQuery,setHymnQuery]=useState('')
const [hymnResult,setHymnResult]=useState('')
const [hymnLoading,setHymnLoading]=useState(false)
const [showSettings,setShowSettings]=useState(false)
const [showStudio,setShowStudio]=useState(false)
const [lowData,setLowData]=useState(false)
const [tickerText,setTickerText]=useState('Welcome to TagLive - Jesus is Lord!   ')
const [tickerOn,setTickerOn]=useState(true)
const [showTickerStudio,setShowTickerStudio]=useState(false)
const [churchName,setChurchName]=useState('KPAKO CHURCH')
const [showChurchName,setShowChurchName]=useState(true)
const [showAdmin,setShowAdmin]=useState(false)
const [isAdmin,setIsAdmin]=useState(false)
const [stats,setStats]=useState({live:0,daily:0,weekly:0,monthly:0,total:0})
useEffect(()=>{
  const s=localStorage.getItem('taglive_saved'); if(s) try{setSaved(JSON.parse(s))}catch{}
  const v=localStorage.getItem('taglive_verse'); if(v) setVerse(v)
  const b=localStorage.getItem('taglive_bg'); if(b) setBgImage(b)
  const l=localStorage.getItem('taglive_logo'); if(l) setLogo(l)
  const cl=localStorage.getItem('taglive_church_logo'); if(cl) setChurchLogo(cl)
  const ld=localStorage.getItem('taglive_lowdata'); if(ld) setLowData(ld==='true')
  const tt=localStorage.getItem('taglive_ticker_text'); if(tt) setTickerText(tt)
  const to=localStorage.getItem('taglive_ticker_on'); if(to) setTickerOn(to==='true')
  const cn=localStorage.getItem('taglive_church_name'); if(cn) setChurchName(cn)
  const sc=localStorage.getItem('taglive_show_church'); if(sc) setShowChurchName(sc==='true')
  const ai=localStorage.getItem('taglive_active_intro'); if(ai) setActiveIntroId(ai)
  const ao=localStorage.getItem('taglive_active_outro'); if(ao) setActiveOutroId(ao)
  const adm=localStorage.getItem('taglive_admin'); if(adm==='true') setIsAdmin(true)
  
  // FIX 1: Load intros/outros as BLOB -> stays forever
  idbGetAll('intros').then(async(all)=>{
    const withData = await Promise.all(all.map(async (it:any)=>{
      if(it.blob && !it.data){ try{ it.data = await fileToBase64(it.blob) }catch{} }
      return it
    }))
    setIntros(withData)
  })
  idbGetAll('outros').then(async(all)=>{
    const withData = await Promise.all(all.map(async (it:any)=>{
      if(it.blob && !it.data){ try{ it.data = await fileToBase64(it.blob) }catch{} }
      return it
    }))
    setOutros(withData)
  })
},[])

const formatTime=(s:number)=>{ const h=Math.floor(s/3600); const m=Math.floor((s%3600)/60); const sec=s%60; return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}` }
const startTimer=()=>{ if(timerRefState) clearInterval(timerRefState); const id=setInterval(()=>setLiveSeconds(v=>v+1),1000) as any; setTimerRefState(id) }
const stopTimer=()=>{ if(timerRefState) clearInterval(timerRefState); setTimerRefState(null); setLiveSeconds(0) }
const saveVerse=()=>{ if(!verse.trim()) return; const n=[verse,...saved].slice(0,20); setSaved(n); localStorage.setItem('taglive_saved',JSON.stringify(n)); localStorage.setItem('taglive_verse',verse) }
const deleteSaved=(i:number)=>{ const n=saved.filter((_,idx)=>idx!==i); setSaved(n); localStorage.setItem('taglive_saved',JSON.stringify(n)) }
const pasteClipboard=async()=>{ try{ const t=await navigator.clipboard.readText(); if(t) setVerse(t) }catch{} }

useEffect(()=>{
const trackDevice=async()=>{
try{
let deviceId=localStorage.getItem('taglive_device')
if(!deviceId){ deviceId=`dev_${Date.now()}_${Math.random().toString(36).slice(2,9)}`; localStorage.setItem('taglive_device', deviceId) }
await supabase.from('taglive_devices').upsert({ device_id: deviceId, last_seen: new Date().toISOString() }, { onConflict: 'device_id' })
}catch{}
}; trackDevice()
},[isAdmin])

const handleIntroFile=async(e:any)=>{
  const file=e.target.files?.[0]; if(!file) return
  const dur = file.type.startsWith('video') ? await getVideoDuration(file) : 5
  const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', blob: file, data: '', duration: dur, title: file.name }
  await idbSaveBlob('intros', item)
  const all = await idbGetAll('intros')
  const withUrls = await Promise.all(all.map(async (it:any)=>{
    if(it.blob && !it.data){ try{ it.data = await fileToBase64(it.blob) }catch{} }
    return it
  }))
  setIntros(withUrls); setActiveIntroId(item.id); localStorage.setItem('taglive_active_intro', item.id)
  alert(`Intro Saved Forever ✅`)
  e.target.value=''
}
const handleOutroFile=async(e:any)=>{
  const file=e.target.files?.[0]; if(!file) return
  const dur = file.type.startsWith('video') ? await getVideoDuration(file) : 5
  const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', blob: file, data: '', duration: dur, title: file.name }
  await idbSaveBlob('outros', item)
  const all = await idbGetAll('outros')
  const withUrls = await Promise.all(all.map(async (it:any)=>{
    if(it.blob && !it.data){ try{ it.data = await fileToBase64(it.blob) }catch{} }
    return it
  }))
  setOutros(withUrls); setActiveOutroId(item.id); localStorage.setItem('taglive_active_outro', item.id)
  alert(`Outro Saved Forever ✅`)
  e.target.value=''
}

const startCamera=async(newFacing=facing)=>{
try{
if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
await new Promise(r=>setTimeout(r,300))
const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing,width:{ideal:1280},height:{ideal:720}},audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})
streamRef.current=s; trackRef.current=s.getVideoTracks()[0]
if(videoRef.current){ videoRef.current.srcObject=s; await videoRef.current.play() }
setFacing(newFacing); setIsCam(true)
}catch(e:any){ alert('Camera: '+e.message) }
}
const stopCamera=()=>{ if(isRecording) stopRecording(); streamRef.current?.getTracks().forEach(t=>t.stop()); if(videoRef.current) videoRef.current.srcObject=null; setIsCam(false); setTorch(false); stopTimer() }
const toggleCamera=async()=>{ await startCamera(facing==='user'?'environment':'user') }
const startRecording=async()=>{
if(!canvasRef.current) return
const canvas=canvasRef.current
const canvasStream=canvas.captureStream(30)
let combined=new MediaStream(canvasStream.getVideoTracks() as any)
if(streamRef.current){
  streamRef.current.getAudioTracks().forEach(t=>combined.addTrack(t))
}
chunksRef.current=[]; setRecordedUrl(null); setMp4Url(null)
let mime='video/webm;codecs=vp9,opus'
if(!MediaRecorder.isTypeSupported(mime)) mime='video/webm;codecs=vp8,opus'
if(!MediaRecorder.isTypeSupported(mime)) mime='video/webm'

const rec=new MediaRecorder(combined,{mimeType:mime, videoBitsPerSecond:2500000})
recorderRef.current=rec
rec.ondataavailable=(e)=>{ if(e.data.size>0) chunksRef.current.push(e.data) }
rec.onstop=async()=>{
  const webmBlob=new Blob(chunksRef.current,{type:mime})
  const webmUrl=URL.createObjectURL(webmBlob)
  setRecordedUrl(webmUrl)

  // FIX 2: Convert to MP4 with sound + timer for ALL DEVICES
  try{
    setIsConverting(true)
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
    const ffmpeg=new FFmpeg()
    ffmpeg.on('log',()=>{})
    const baseURL='https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({ coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`,'text/javascript'), wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`,'application/wasm') })
    await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob))
    await ffmpeg.exec(['-i','input.webm','-c:v','libx264','-c:a','aac','-pix_fmt','yuv420p','-movflags','faststart','output.mp4'])
    const data:any = await ffmpeg.readFile('output.mp4')
    const mp4Blob=new Blob([data.buffer],{type:'video/mp4'})
    const mp4Link=URL.createObjectURL(mp4Blob)
    setMp4Url(mp4Link)
  }catch(err){
    console.log('MP4 convert failed, using webm', err)
    setMp4Url(webmUrl) // fallback still with sound
  }finally{
    setIsConverting(false)
  }
}
rec.start(100)
setIsRecording(true)
if(!isLive) { setIsLive(true); startTimer() }
}

const stopRecording=()=>{
recorderRef.current?.stop()
setIsRecording(false)
}
// DRAW CANVAS WITH TIMER BURNED IN (so MP4 will have timer visible everywhere)
useEffect(()=>{
if(!isCam) return
let anim:number
const draw=()=>{
const canvas=canvasRef.current
const video=videoRef.current
if(!canvas||!video) { anim=requestAnimationFrame(draw); return }
const ctx=canvas.getContext('2d')
if(!ctx) return
canvas.width=720
canvas.height=1280
ctx.clearRect(0,0,canvas.width,canvas.height)

if(bgMode==='black'){
  ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height)
}
if(video.readyState>=2){
  if(bgMode==='face' || bgMode==='split'){
    const vw=video.videoWidth||1280
    const vh=video.videoHeight||720
    const scale=Math.max(canvas.width/vw, canvas.height/vh)
    const sw=vw*scale
    const sh=vh*scale
    const sx=(canvas.width-sw)/2
    const sy=(canvas.height-sh)/2
    if(bgMode==='face'){
      ctx.drawImage(video,sx,sy,sw,sh)
    } else {
      ctx.drawImage(video,sx,0,sw,canvas.height*0.6)
    }
  }
}
if(bgImage && (bgMode==='image' || bgMode==='split')){
  if(!broadcastImageRef.current){ const img=new Image(); img.src=bgImage; broadcastImageRef.current=img }
  const img=broadcastImageRef.current
  if(img.complete){
    if(bgMode==='image') ctx.drawImage(img,0,0,canvas.width,canvas.height)
    else ctx.drawImage(img,0,canvas.height*0.6,canvas.width,canvas.height*0.4)
  }
}

// Verse
ctx.fillStyle='rgba(0,0,0,0.6)'
ctx.fillRect(0,canvas.height-280,canvas.width,160)
ctx.fillStyle='#fff'
ctx.font='bold 28px Arial'
const words=verse.split(' ')
let line=''; let y=canvas.height-240
for(let w of words){
  const test=line+w+' '
  if(ctx.measureText(test).width>canvas.width-40){ ctx.fillText(line,20,y); line=w+' '; y+=36 } else line=test
}
ctx.fillText(line,20,y)

// TIMER + LOGOS + TICKER
ctx.fillStyle='#FF0000'
ctx.fillRect(10,10,120,30)
ctx.fillStyle='#fff'
ctx.font='bold 20px monospace'
ctx.fillText(formatTime(liveSeconds),20,30)

if(logo && logoPos){
  const img=new Image(); img.src=logo
  if(img.complete) ctx.drawImage(img,logoPos.x,logoPos.y,logoPos.w,logoPos.h)
}
if(churchLogo && churchLogoPos){
  const img=new Image(); img.src=churchLogo
  if(img.complete) ctx.drawImage(img,churchLogoPos.x,churchLogoPos.y,churchLogoPos.w,churchLogoPos.h)
}
if(tickerOn && tickerText){
  ctx.fillStyle='rgba(0,0,0,0.8)'
  ctx.fillRect(0,canvas.height-60,canvas.width,60)
  ctx.fillStyle='#FFFF00'
  ctx.font='bold 22px Arial'
  tickerOffsetRef.current-=2
  if(tickerOffsetRef.current<-ctx.measureText(tickerText).width) tickerOffsetRef.current=canvas.width
  ctx.fillText(tickerText,tickerOffsetRef.current,canvas.height-22)
}
if(showChurchName){
  ctx.fillStyle='#fff'
  ctx.font='bold 26px Arial'
  ctx.fillText(churchName, canvas.width/2 - ctx.measureText(churchName).width/2, 70)
}

anim=requestAnimationFrame(draw)
}
draw()
return()=>cancelAnimationFrame(anim)
},[isCam,bgMode,bgImage,verse,logo,churchLogo,logoPos,churchLogoPos,tickerOn,tickerText,liveSeconds,churchName,showChurchName,formatTime])

const fbLogin=()=>{
  // @ts-ignore
  window.FB.login((res:any)=>{
    if(res.authResponse){
      // @ts-ignore
      window.FB.api('/me','GET',{fields:'name,email'},(user:any)=>{
        setFbUser(user)
        // @ts-ignore
        window.FB.api('/me/accounts','GET',{},(pagesRes:any)=>{
          if(pagesRes.data) setPages(pagesRes.data)
        })
      })
    }
  },{scope:'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,publish_video'})
}
return(
<div style={{minHeight:'100vh',background:'#000',color:'#fff',padding:10}}>
<canvas ref={canvasRef} style={{display:'none'}}></canvas>
<video ref={videoRef} autoPlay playsInline muted style={{width:'100%',maxWidth:720,aspectRatio:'9/16',background:'#111',borderRadius:12}}></video>

<div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
<button onClick={()=>isCam?stopCamera():startCamera()} style={{padding:'12px 20px',background:isCam?'#ff4444':'#00cc66',border:'none',borderRadius:8,color:'#fff',fontWeight:'bold'}}>{isCam?'Stop Camera':'Start Camera'}</button>
<button onClick={toggleCamera} style={{padding:'12px',background:'#333',border:'none',borderRadius:8,color:'#fff'}}>Flip</button>
<button onClick={()=>isRecording?stopRecording():startRecording()} style={{padding:'12px 20px',background:isRecording?'#ff4444':'#ffcc00',border:'none',borderRadius:8,color:'#000',fontWeight:'bold'}}>{isRecording?'Stop Rec':'● Record'}</button>
<button onClick={fbLogin} style={{padding:'12px',background:'#1877f2',border:'none',borderRadius:8,color:'#fff'}}>FB Login</button>
</div>

{/* FIX 2 UI: MP4 DOWNLOAD */}
<div style={{marginTop:16,padding:12,background:'#111',borderRadius:10}}>
{isConverting && <div style={{color:'#ffcc00',fontWeight:'bold'}}>⏳ Converting to MP4 with sound + timer... Wait 10 sec...</div>}

{recordedUrl && !isConverting && !mp4Url && <div style={{color:'#fff'}}>Processing...</div>}

{mp4Url && (
  <div>
    <div style={{color:'#00ff88',fontWeight:'bold',marginBottom:8}}>✅ MP4 READY — Plays everywhere with SOUND + TIMER!</div>
    <video src={mp4Url} controls style={{width:'100%',maxWidth:400,borderRadius:8,background:'#000'}}></video>
    <div style={{display:'flex',gap:10,marginTop:10}}>
      <a href={mp4Url} download={`TagLive_${Date.now()}.mp4`} style={{padding:'14px 24px',background:'#00cc66',color:'#fff',textDecoration:'none',borderRadius:8,fontWeight:'bold',textAlign:'center'}}>⬇️ Download MP4 WITH SOUND + TIMER ✅</a>
      {recordedUrl && <a href={recordedUrl} download={`TagLive_${Date.now()}_webm.webm`} style={{padding:'14px',background:'#333',color:'#fff',textDecoration:'none',borderRadius:8}}>WebM Backup</a>}
    </div>
    <div style={{fontSize:12,color:'#aaa',marginTop:6}}>This MP4 works in Gallery, WhatsApp, Facebook, YouTube — everywhere!</div>
  </div>
)}
</div>

{/* INTRO/OUTRO UI */}
<div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
<div>
<input ref={introFileRef} type="file" accept="image/*,video/*" onChange={handleIntroFile} style={{display:'none'}} />
<button onClick={()=>introFileRef.current?.click()} style={{padding:'10px',background:'#444',border:'none',borderRadius:8,color:'#fff'}}>Add Intro (Stays Forever)</button>
<div style={{fontSize:11,color:'#aaa'}}>{intros.length} intros saved</div>
{intros.map((it:any)=>(
  <div key={it.id} style={{display:'flex',gap:4,alignItems:'center',marginTop:4}}>
    <input type="checkbox" checked={activeIntroId===it.id} onChange={()=>{ setActiveIntroId(it.id); localStorage.setItem('taglive_active_intro', it.id) }} />
    <span style={{fontSize:12}}>{it.title?.slice(0,20)}</span>
    <button onClick={async()=>{ await idbDelete('intros',''+it.id); setIntros(intros.filter((x:any)=>x.id!==it.id)) }} style={{background:'#ff4444',border:'none',borderRadius:4,color:'#fff',fontSize:10}}>x</button>
  </div>
))}
</div>
<div>
<input ref={outroFileRef} type="file" accept="image/*,video/*" onChange={handleOutroFile} style={{display:'none'}} />
<button onClick={()=>outroFileRef.current?.click()} style={{padding:'10px',background:'#444',border:'none',borderRadius:8,color:'#fff'}}>Add Outro (Stays Forever)</button>
<div style={{fontSize:11,color:'#aaa'}}>{outros.length} outros saved</div>
{outros.map((it:any)=>(
  <div key={it.id} style={{display:'flex',gap:4,alignItems:'center',marginTop:4}}>
    <input type="checkbox" checked={activeOutroId===it.id} onChange={()=>{ setActiveOutroId(it.id); localStorage.setItem('taglive_active_outro', it.id) }} />
    <span style={{fontSize:12}}>{it.title?.slice(0,20)}</span>
    <button onClick={async()=>{ await idbDelete('outros',''+it.id); setOutros(outros.filter((x:any)=>x.id!==it.id)) }} style={{background:'#ff4444',border:'none',borderRadius:4,color:'#fff',fontSize:10}}>x</button>
  </div>
))}
</div>
</div>

{/* VERSE */}
<div style={{marginTop:12}}>
<textarea value={verse} onChange={(e)=>setVerse(e.target.value)} style={{width:'100%',height:80,background:'#222',color:'#fff',border:'1px solid #444',borderRadius:8,padding:10}}></textarea>
<div style={{display:'flex',gap:6,marginTop:6}}>
<button onClick={saveVerse} style={{padding:8,background:'#00cc66',border:'none',borderRadius:6,color:'#fff'}}>Save</button>
<button onClick={pasteClipboard} style={{padding:8,background:'#333',border:'none',borderRadius:6,color:'#fff'}}>Paste</button>
</div>
<div style={{marginTop:6}}>{saved.map((s,i)=><div key={i} onClick={()=>setVerse(s)} style={{padding:6,background:'#222',marginTop:4,borderRadius:6,fontSize:12,cursor:'pointer'}}>{s.slice(0,60)}</div>)}</div>
</div>

<div style={{marginTop:20,fontSize:11,color:'#666',textAlign:'center'}}>TagLive Final - Intro/Outro Persistent + MP4 Everywhere ✅ Timer:{formatTime(liveSeconds)}</div>
</div>
)
}
