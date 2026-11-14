"use client"
export const dynamic = 'force-dynamic'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from './AuthContext'
const supabase = createClient('https://gqifluvkrjzsebfdjcio.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzY4NDgsImV4cCI6MjEwNzk1Mjg0OH0.zonQMk22nXN0VsbHyI88hT27ntl-VxEEi8k2G8-k5lc')
declare global { interface Window { FB: any; fbAsyncInit: any } }
const OFFLINE_KJV: Record<string,string> = {"john 3:16":"John 3:16 - For God so loved the world...","romans 1:20":"Romans 1:20 - For the invisible things...","romans 8:28":"Romans 8:28 - And we know...","psalm 23":"Psalm 23 - The LORD is my shepherd...","jeremiah 29:11":"Jeremiah 29:11 - For I know...","philippians 4:13":"Philippians 4:13 - I can do all things...","isaiah 41:10":"Isaiah 41:10 - Fear thou not...","john 14:6":"John 14:6 - I am the way...","2 timothy 1:7":"2 Timothy 1:7 - For God hath not...","psalm 91:1":"Psalm 91:1 - He that dwelleth...","matthew 28:19":"Matthew 28:19 - Go ye therefore...","genesis 1:1":"Genesis 1:1 - In the beginning...","proverbs 3:5":"Proverbs 3:5 - Trust in the LORD...","john 1:1":"John 1:1 - In the beginning was the Word...","romans 10:9":"Romans 10:9 - That if thou shalt confess..."}
const BIBLE_VERSIONS = [{ id: 'kjv', label: 'KJV' },{ id: 'akjv', label: 'NKJV-like' },{ id: 'web', label: 'NIV-like' },{ id: 'bbe', label: 'GNB-like' },{ id: 'asv', label: 'RSV-like' },{ id: 'lsv', label: 'ESV-like' },{ id: 'oeb-cw', label: 'AMP-like' },{ id: 'webbe', label: 'WEBBE' },]
const BIBLE_BOOKS = [{ name: "Genesis", chapters: 50 },{ name: "Exodus", chapters: 40 },{ name: "Leviticus", chapters: 27 },{ name: "Numbers", chapters: 36 },{ name: "Deuteronomy", chapters: 34 },{ name: "Joshua", chapters: 24 },{ name: "Judges", chapters: 21 },{ name: "Ruth", chapters: 4 },{ name: "1 Samuel", chapters: 31 },{ name: "2 Samuel", chapters: 24 },{ name: "1 Kings", chapters: 22 },{ name: "2 Kings", chapters: 25 },{ name: "1 Chronicles", chapters: 29 },{ name: "2 Chronicles", chapters: 36 },{ name: "Ezra", chapters: 10 },{ name: "Nehemiah", chapters: 13 },{ name: "Esther", chapters: 10 },{ name: "Job", chapters: 42 },{ name: "Psalm", chapters: 150 },{ name: "Proverbs", chapters: 31 },{ name: "Ecclesiastes", chapters: 12 },{ name: "Song of Solomon", chapters: 8 },{ name: "Isaiah", chapters: 66 },{ name: "Jeremiah", chapters: 52 },{ name: "Lamentations", chapters: 5 },{ name: "Ezekiel", chapters: 48 },{ name: "Daniel", chapters: 12 },{ name: "Hosea", chapters: 14 },{ name: "Joel", chapters: 3 },{ name: "Amos", chapters: 9 },{ name: "Obadiah", chapters: 1 },{ name: "Jonah", chapters: 4 },{ name: "Micah", chapters: 7 },{ name: "Nahum", chapters: 3 },{ name: "Habakkuk", chapters: 3 },{ name: "Zephaniah", chapters: 3 },{ name: "Haggai", chapters: 2 },{ name: "Zechariah", chapters: 14 },{ name: "Malachi", chapters: 4 },{ name: "Matthew", chapters: 28 },{ name: "Mark", chapters: 16 },{ name: "Luke", chapters: 24 },{ name: "John", chapters: 21 },{ name: "Acts", chapters: 28 },{ name: "Romans", chapters: 16 },{ name: "1 Corinthians", chapters: 16 },{ name: "2 Corinthians", chapters: 13 },{ name: "Galatians", chapters: 6 },{ name: "Ephesians", chapters: 6 },{ name: "Philippians", chapters: 4 },{ name: "Colossians", chapters: 4 },{ name: "1 Thessalonians", chapters: 5 },{ name: "2 Thessalonians", chapters: 3 },{ name: "1 Timothy", chapters: 6 },{ name: "2 Timothy", chapters: 4 },{ name: "Titus", chapters: 3 },{ name: "Philemon", chapters: 1 },{ name: "Hebrews", chapters: 13 },{ name: "James", chapters: 5 },{ name: "1 Peter", chapters: 5 },{ name: "2 Peter", chapters: 3 },{ name: "1 John", chapters: 5 },{ name: "2 John", chapters: 1 },{ name: "3 John", chapters: 1 },{ name: "Jude", chapters: 1 },{ name: "Revelation", chapters: 22 }]
export default function LiveStudio(){
const { user } = useAuth()
const [verse,setVerse]=useState("John 3:16 - For God so loved the world that He gave His only begotten Son...")
const [isCam,setIsCam]=useState(false)
const [isLive,setIsLive]=useState(false)
const [facing,setFacing]=useState<'user'|'environment'>('user')
const [torch,setTorch]=useState(false)
const [fbUser,setFbUser]=useState<any>(null)
const [pages,setPages]=useState<any[]>([])
const [selectedPage,setSelectedPage]=useState<any>(null)
const [fbStreamUrl,setFbStreamUrl]=useState('')
const [liveId,setLiveId]=useState('')
const [pos,setPos]=useState({ x: 360, y: 1050, scale: 0.95 })
const [bgMode,setBgMode]=useState<'face'|'black'|'image'|'split'>('face')
const [saved,setSaved]=useState<string[]>([])
const [dragging,setDragging]=useState(false)
const [fontSize,setFontSize]=useState(28)
const [align,setAlign]=useState<'center'|'justify'>('justify')
const [bgImage,setBgImage]=useState<string|null>(null)
const [ytKey,setYtKey]=useState('')
const [ytLive,setYtLive]=useState(false)
const [textColor,setTextColor]=useState('#00ff00')
const [boxColor,setBoxColor]=useState('#000000')
const [boxOpacity,setBoxOpacity]=useState(0.85)
const [logoImage,setLogoImage]=useState<string|null>(null)
const [logoPos,setLogoPos]=useState({ x: 360, y: 300, scale: 0.7 })
const [isRecording,setIsRecording]=useState(false)
const [recordedUrl,setRecordedUrl]=useState<string|null>(null)
const [selected,setSelected]=useState<'text'|'logo'>('text')
const [showText,setShowText]=useState(true)
const [showLogo,setShowLogo]=useState(true)
const [isAdmin,setIsAdmin]=useState(false)
const [stats,setStats]=useState({ live: 0, daily: 0, weekly: 0, monthly: 0, total: 0 })
const [countries,setCountries]=useState<any[]>([])
const [intros,setIntros]=useState<any[]>([])
const [outros,setOutros]=useState<any[]>([])
const [activeIntroId,setActiveIntroId]=useState<string|null>(null)
const [activeOutroId,setActiveOutroId]=useState<string|null>(null)
const [showStudio,setShowStudio]=useState(false)
const [showTickerStudio,setShowTickerStudio]=useState(false)
const [showAdmin,setShowAdmin]=useState(false)
const [showSettings,setShowSettings]=useState(false)
const [broadcastPlaying,setBroadcastPlaying]=useState<any>(null)
const [tickerText,setTickerText]=useState("📢 ANNOUNCEMENT: Wealthcome to KPAKO NYANKPA INTL MINISTRY - Sunday Service 9AM | Midweek Service Wednesday 6PM | Invite Someone!")
const [tickerOn,setTickerOn]=useState(false)
const [tickerSize,setTickerSize]=useState(26)
const [tickerSpeed,setTickerSpeed]=useState(2)
const [churchName,setChurchName]=useState("KPAKO NYANKPA INTL MINISTRY")
const [showChurchName,setShowChurchName]=useState(true)
const [liveSeconds,setLiveSeconds]=useState(0)
const timerRef=useRef<any>(null)
const [showBible,setShowBible]=useState(false)
const [bibleVer,setBibleVer]=useState('kjv')
const [bibleQuery,setBibleQuery]=useState('Romans 1:20')
const [bibleResult,setBibleResult]=useState('')
const [bibleLoading,setBibleLoading]=useState(false)
const [lowData,setLowData]=useState(false)
const [showTelegramPopup,setShowTelegramPopup]=useState(false)
const TELEGRAM_LINK="https://t.me/+fjt4YW3hTr9jYWM8"
// === UPDATE ONLY: TikTok Bridge (Cloady Live) ===
const WS_URL = "wss://taglive-bridge-j8ppazqg-quiet-comet-8.cloady.io"
const [tiktokUsername,setTiktokUsername]=useState('')
const [tiktokStatus,setTiktokStatus]=useState<'Disconnected'|'Connecting'|'Connected'|'Failed'>('Disconnected')
const [tiktokViewerCount,setTiktokViewerCount]=useState(0)
const [tiktokLikes,setTiktokLikes]=useState(0)
const [tiktokLastComment,setTiktokLastComment]=useState('')
const tiktokWsRef=useRef<WebSocket|null>(null)
const connectTikTok=()=>{
  const username=tiktokUsername.trim().replace(/^@/,'')
  if(!username){ alert('Put your TikTok @username first'); return }
  if(tiktokWsRef.current){ try{ tiktokWsRef.current.close() }catch{} }
  setTiktokStatus('Connecting')
  const ws=new WebSocket(WS_URL)
  tiktokWsRef.current=ws
  ws.onopen=()=>{ setTiktokStatus('Connected'); try{ ws.send(JSON.stringify({ type:'join', username })) }catch{} }
  ws.onmessage=(e)=>{
    try{
      const d=JSON.parse(e.data)
      if(d.type==='chat' || d.type==='comment'){ setTiktokLastComment((d.nickname||d.username||'')+': '+(d.comment||d.text||'')) }
      if(d.type==='viewerCount' || d.type==='viewers'){ setTiktokViewerCount(Number(d.count||d.viewers||0)) }
      if(d.type==='like' || d.type==='likes'){ setTiktokLikes((p)=>p+Number(d.count||1)) }
      if(d.type==='connected' || d.type==='roomInfo'){ setTiktokStatus('Connected') }
      if(d.type==='error' || d.type==='disconnected'){ setTiktokStatus('Failed') }
    }catch{}
  }
  ws.onerror=()=>{ setTiktokStatus('Failed') }
  ws.onclose=()=>{ setTiktokStatus((s)=> s==='Connected' ? 'Disconnected' : s) }
}
const disconnectTikTok=()=>{ try{ tiktokWsRef.current?.close() }catch{}; tiktokWsRef.current=null; setTiktokStatus('Disconnected') }
useEffect(()=>{ return ()=>{ try{ tiktokWsRef.current?.close() }catch{} } },[])
// === UPDATE ONLY: TikTok RTMP Push - Send TagLive Canvas to TikTok ===
const [tiktokRtmpUrl,setTiktokRtmpUrl]=useState('')
const [tiktokStreamKey,setTiktokStreamKey]=useState('')
const [tiktokPushing,setTiktokPushing]=useState(false)
const tiktokPushWsRef=useRef<WebSocket|null>(null)
const tiktokPushRecorderRef=useRef<MediaRecorder|null>(null)
const startTikTokPush=async()=>{
  const rtmpUrl=tiktokRtmpUrl.trim()
  const streamKey=tiktokStreamKey.trim()
  if(!rtmpUrl || !streamKey){ alert('Paste TikTok Server URL + Stream Key first'); return }
  if(!canvasRef.current){ alert('Start Camera first'); return }
  if(tiktokPushWsRef.current){ try{ tiktokPushWsRef.current.close() }catch{} }
  const ws=new WebSocket(WS_URL)
  tiktokPushWsRef.current=ws
  ws.onopen=()=>{
    ws.send(JSON.stringify({ type:'start_push', rtmpUrl, streamKey }))
    const canvasStream=(canvasRef.current as any).captureStream(30) as MediaStream
    const micTrack=streamRef.current?.getAudioTracks()[0]
    if(micTrack) canvasStream.addTrack(micTrack)
    let mime='video/webm;codecs=vp8,opus'
    if(!MediaRecorder.isTypeSupported(mime)) mime='video/webm'
    const rec=new MediaRecorder(canvasStream, { mimeType: mime, videoBitsPerSecond: 2500000 })
    tiktokPushRecorderRef.current=rec
    rec.ondataavailable=(e)=>{ if(e.data.size>0 && ws.readyState===WebSocket.OPEN){ try{ ws.send(e.data) }catch{} } }
    rec.start(500)
    setTiktokPushing(true)
    setTiktokStatus('Connected')
  }
  ws.onmessage=(e)=>{
    try{
      const d=JSON.parse(e.data)
      if(d.type==='push_started') setTiktokPushing(true)
      if(d.type==='push_stopped'){ setTiktokPushing(false) }
      if(d.type==='error'){ setTiktokPushing(false); if(d.message) alert(d.message) }
    }catch{}
  }
  ws.onerror=()=>{ setTiktokPushing(false); alert('Push failed - check Server URL + Key') }
  ws.onclose=()=>{ setTiktokPushing(false) }
}
const stopTikTokPush=()=>{
  try{ tiktokPushRecorderRef.current?.stop() }catch{}
  tiktokPushRecorderRef.current=null
  try{ tiktokPushWsRef.current?.send(JSON.stringify({ type:'stop_push' })) }catch{}
  try{ tiktokPushWsRef.current?.close() }catch{}
  tiktokPushWsRef.current=null
  setTiktokPushing(false)
}
useEffect(()=>{ return ()=>{ try{ tiktokPushRecorderRef.current?.stop() }catch{}; try{ tiktokPushWsRef.current?.close() }catch{} } },[])
const tickerOffsetRef=useRef(720)
const introFileRef=useRef<HTMLInputElement>(null)
const outroFileRef=useRef<HTMLInputElement>(null)
const broadcastVideoRef=useRef<HTMLVideoElement>(null)
const broadcastImageRef=useRef<HTMLImageElement|null>(null)
const lastTouch=useRef({ dist: 0, x:0, y:0, scale:1, selScale:1 })
const videoRef=useRef<HTMLVideoElement>(null)
const canvasRef=useRef<HTMLCanvasElement>(null)
const streamRef=useRef<MediaStream|null>(null)
const trackRef=useRef<MediaStreamTrack|null>(null)
const fileInputRef=useRef<HTMLInputElement>(null)
const logoInputRef=useRef<HTMLInputElement>(null)
const bgImageRef=useRef<HTMLImageElement|null>(null)
const logoImageRef=useRef<HTMLImageElement|null>(null)
const recorderRef=useRef<MediaRecorder|null>(null)
const chunksRef=useRef<Blob[]>([])
const churchLogoInputRef=useRef<HTMLInputElement>(null)
const audioCtxRef=useRef<any>(null)
const introTimeoutRef=useRef<any>(null)
const fbPendingRef=useRef<any>(null)
const heartbeatRef=useRef<any>(null)

useEffect(()=>{
if(typeof window==='undefined') return
if(window.FB) return
window.fbAsyncInit=function(){
  window.FB.init({ appId:'1951327349161990', cookie:true, xfbml:true, version:'v19.0' })
}
const id='facebook-jssdk'
if(document.getElementById(id)) return
const js=document.createElement('script')
js.id=id; js.src='https://connect.facebook.net/en_US/sdk.js'; js.async=true; js.defer=true
document.head.appendChild(js)
},[])

useEffect(()=>{
try{
const params=new URLSearchParams(window.location.search)
if(params.get('admin')==='clear'){ localStorage.removeItem('taglive_admin'); setIsAdmin(false) }
else if(params.get('admin')==='taglive2026'){ localStorage.setItem('taglive_admin','true'); setIsAdmin(true) }
else if(localStorage.getItem('taglive_admin')==='true'){ setIsAdmin(true) }
}catch{}
},[])

useEffect(()=>{
try{
const joined=localStorage.getItem('taglive_telegram_joined')
if(joined==='true') return
const dismissed=localStorage.getItem('taglive_telegram_dismissed_time')
if(dismissed){ const diff=Date.now()-parseInt(dismissed); if(diff < 24*60*60*1000) return }
const t=setTimeout(()=>setShowTelegramPopup(true),1500)
return()=>clearTimeout(t)
}catch{}
},[])

const formatTime=(sec:number)=>{ const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60; return h.toString().padStart(2,'0')+':'+m.toString().padStart(2,'0')+':'+s.toString().padStart(2,'0') }
const startTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); setLiveSeconds(0); timerRef.current=setInterval(()=>setLiveSeconds(p=>p+1),1000) }
const stopTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); timerRef.current=null; setLiveSeconds(0) }
const [showMonthPicker,setShowMonthPicker]=useState(false)
const [calYear,setCalYear]=useState(new Date().getFullYear())
const [calMonth,setCalMonth]=useState(new Date().getMonth())
const [monthCount,setMonthCount]=useState<number|null>(null)
const [monthLoading,setMonthLoading]=useState(false)
const fetchMonthCount=async(year:number,month:number)=>{
setMonthLoading(true); setCalMonth(month); setCalYear(year)
try{
const start=new Date(Date.UTC(year,month,1,0,0,0,0))
const end=new Date(Date.UTC(year,month+1,0,23,59,59,999))
const { count }=await supabase.from('taglive_views').select('*',{count:'exact',head:true}).gte('created_at', start.toISOString()).lte('created_at', end.toISOString())
setMonthCount(count||0)
}catch{ setMonthCount(0) }
setMonthLoading(false)
}

const getGlobalDeviceId=()=>{
 try{
  let gid=localStorage.getItem('taglive_global_device')
  if(gid) return gid
  const oldId=localStorage.getItem('taglive_device')
  if(oldId){ localStorage.setItem('taglive_global_device', oldId); return oldId }
  gid='gid_' + Date.now() + '_' + Math.random().toString(36).slice(2,9)
  localStorage.setItem('taglive_global_device', gid)
  localStorage.setItem('taglive_device', gid)
  return gid
 }catch{ return 'gid_' + Date.now() + '_' + Math.random().toString(36).slice(2,9) }
}

useEffect(()=>{
 let mounted=true
 const trackDevice=async()=>{
  try{
   const deviceId=getGlobalDeviceId()
   const adminFlag = localStorage.getItem('taglive_admin')==='true' || isAdmin
   if(!adminFlag){
     const DAY_MS=24*60*60*1000
     const lastKey='tl_v3_last'
     const lastStr=localStorage.getItem(lastKey)
     const shouldInsert=!lastStr || (Date.now()-parseInt(lastStr) > DAY_MS)
     if(shouldInsert){
       const {error}=await supabase.from('taglive_views').insert({ device_id: deviceId })
       if(!error) localStorage.setItem(lastKey, Date.now().toString())
     }
   }
   try{
     await supabase.from('taglive_devices').upsert({ 
       device_id: deviceId, 
       last_seen: new Date().toISOString(), 
       country: 'Nigeria', 
       city: 'Ilorin', 
       country_code: 'NG',
       user_agent: navigator.userAgent.substring(0,80)
     }, { onConflict: 'device_id' })
   }catch{}
   try{
    const nowDate=new Date()
    const todayUTC=new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate(), 0,0,0,0))
    const weekUTC=new Date(todayUTC); weekUTC.setUTCDate(weekUTC.getUTCDate()-7)
    const monthStart=new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), 1))
    const liveCutoff=new Date(nowDate.getTime()-90*1000)
    const { count: live }=await supabase.from('taglive_devices').select('*',{count:'exact',head:true}).gt('last_seen', liveCutoff.toISOString())
    const { count: total }=await supabase.from('taglive_views').select('*',{count:'exact',head:true})
    const { count: daily }=await supabase.from('taglive_views').select('*',{count:'exact',head:true}).gte('created_at', todayUTC.toISOString())
    const { count: weekly }=await supabase.from('taglive_views').select('*',{count:'exact',head:true}).gte('created_at', weekUTC.toISOString())
    const { count: monthly }=await supabase.from('taglive_views').select('*',{count:'exact',head:true}).gte('created_at', monthStart.toISOString())
    if(mounted) setStats({ live: live||0, daily: daily||0, weekly: weekly||0, monthly: monthly||0, total: total||0 })
    try{
     const { data: liveRows }=await supabase.from('taglive_devices').select('country,country_code').gt('last_seen', liveCutoff.toISOString())
     if(liveRows && mounted){
       const map:any={}
       liveRows.forEach((r:any)=>{
         const key=(r.country_code||'')+'|'+(r.country||'Unknown')
         if(!map[key]) map[key]={ name: r.country||'Unknown', code: r.country_code||'', count:0 }
         map[key].count+=1
       })
       setCountries(Object.values(map))
     }
    }catch{}
   }catch{}
  }catch{}
 }
 trackDevice()
 heartbeatRef.current=setInterval(trackDevice, 10*1000)
 return()=>{ mounted=false; clearInterval(heartbeatRef.current) }
},[isAdmin])

const IDB_NAME='taglive_videos_db'; const IDB_STORE='media';
const getDB=()=>new Promise<any>((res,rej)=>{ const r=indexedDB.open(IDB_NAME,1); r.onupgradeneeded=()=>{ if(!r.result.objectStoreNames.contains(IDB_STORE)) r.result.createObjectStore(IDB_STORE) }; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error) })
const idbSave=async(key:string,val:any)=>{ try{ const db=await getDB(); const tx=db.transaction(IDB_STORE,'readwrite'); tx.objectStore(IDB_STORE).put(val,key); }catch(e){ console.log('IDB save fail',e) } }
const idbGet=async(key:string)=>new Promise<any>(async(resolve)=>{ try{ const db=await getDB(); const tx=db.transaction(IDB_STORE,'readonly'); const req=tx.objectStore(IDB_STORE).get(key); req.onsuccess=()=>resolve(req.result||null); req.onerror=()=>resolve(null)}catch{resolve(null)} })
useEffect(()=>{
try{
const ai=localStorage.getItem('taglive_active_intro'); if(ai) setActiveIntroId(ai)
const ao=localStorage.getItem('taglive_active_outro'); if(ao) setActiveOutroId(ao)
const cl=localStorage.getItem('taglive_church_logo'); if(cl){ setLogoImage(cl); const img=new Image(); img.src=cl; img.onload=()=>{ logoImageRef.current=img } }
const sv=localStorage.getItem('taglive_saved'); if(sv){ setSaved(JSON.parse(sv)) }
const cn=localStorage.getItem('taglive_church_name'); if(cn) setChurchName(cn)
const tt=localStorage.getItem('taglive_ticker_text'); if(tt) setTickerText(tt)
const ton=localStorage.getItem('taglive_ticker_on'); if(ton) setTickerOn(ton==='true')
const lo=localStorage.getItem('taglive_show_logo'); if(lo) setShowLogo(lo==='true')
idbGet('intros').then((i:any)=>{ if(i && Array.isArray(i) && i.length) setIntros(i) })
idbGet('outros').then((o:any)=>{ if(o && Array.isArray(o) && o.length) setOutros(o) })
try{
const iOld=localStorage.getItem('taglive_intros'); if(iOld){ const parsed=JSON.parse(iOld); if(parsed.length && intros.length===0){ setIntros(parsed); idbSave('intros', parsed) } }
const oOld=localStorage.getItem('taglive_outros'); if(oOld){ const parsed=JSON.parse(oOld); if(parsed.length && outros.length===0){ setOutros(parsed); idbSave('outros', parsed) } }
}catch{}
setTimeout(()=>{
  if(canvasRef.current){ canvasRef.current.width=480; canvasRef.current.height=854 }
  setPos((p:any)=>{ return {...p, x:240, y:700 }})
  setLogoPos((p:any)=>{ return {...p, x:90, y:90 }})
},600)
}catch{}
},[])
const saveIntros=async(arr:any[])=>{ setIntros(arr); await idbSave('intros', arr); try{ localStorage.removeItem('taglive_intros') }catch{} }
const saveOutros=async(arr:any[])=>{ setOutros(arr); await idbSave('outros', arr); try{ localStorage.removeItem('taglive_outros') }catch{} }
const fileToBase64=(file:File)=>new Promise<string>((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file) })
const getVideoDuration=(base64:string)=>new Promise<number>((res)=>{ const v=document.createElement('video'); v.src=base64; v.onloadedmetadata=()=>res(v.duration); setTimeout(()=>res(5),2000) })
const handleIntroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return
const base64=await fileToBase64(file)
let dur=5
if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:'id_' + Date.now(), type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name }
const n=[...intros,item]; await saveIntros(n); setActiveIntroId(item.id); localStorage.setItem('taglive_active_intro', item.id); e.target.value=''
}
const handleOutroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return
const base64=await fileToBase64(file)
let dur=5
if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:'id_' + Date.now(), type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name }
const n=[...outros,item]; await saveOutros(n); setActiveOutroId(item.id); localStorage.setItem('taglive_active_outro', item.id); e.target.value=''
}
// === FINAL WORKING CAMERA SWITCH - NO STOCK, NO SLOW-MO ===
const startCamera=async(newFacing=facing)=>{
try{
const wasRecording=isRecording
const oldStream=streamRef.current
const w=lowData?640:1280
const h=lowData?480:720

if(wasRecording && oldStream){
  // LIVE RECORDING: VIDEO ONLY, keep old audio alive
  const oldAudioTracks=oldStream.getAudioTracks()
  const oldVideoTracks=oldStream.getVideoTracks()
  oldVideoTracks.forEach(t=>{ try{ t.stop() }catch{} })
  // Small delay to let device release video only
  await new Promise(r=>setTimeout(r,120))
  let newVideoStream: MediaStream
  try{
    newVideoStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing,width:{ideal:w},height:{ideal:h}}, audio:false})
  }catch{
    newVideoStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:newFacing},width:{ideal:w},height:{ideal:h}}, audio:false})
  }
  const newVideoTrack=newVideoStream.getVideoTracks()[0]
  const combined=new MediaStream([newVideoTrack, ...oldAudioTracks])
  streamRef.current=combined
  trackRef.current=newVideoTrack
  if(videoRef.current){ videoRef.current.srcObject=combined; await videoRef.current.play().catch(()=>{}) }
  setFacing(newFacing); setIsCam(true)
  return
}else{
  // NOT RECORDING: normal switch
  if(oldStream) oldStream.getTracks().forEach(t=>{ try{ t.stop() }catch{} })
  await new Promise(r=>setTimeout(r,150))
  let s: MediaStream
  try{
    s=await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing,width:{ideal:w},height:{ideal:h}},audio:true})
  }catch{
    s=await navigator.mediaDevices.getUserMedia({video:true, audio:true})
  }
  streamRef.current=s; trackRef.current=s.getVideoTracks()[0]
  if(videoRef.current){ videoRef.current.srcObject=s; await videoRef.current.play() }
  if(canvasRef.current){ canvasRef.current.width=480; canvasRef.current.height=854 }
  setFacing(newFacing); setIsCam(true)
}
}catch(e:any){ alert('Camera: '+e.message) }
}
const stopCamera=()=>{
if(isRecording) stopRecordingFinal();
try{ if(audioCtxRef.current){ audioCtxRef.current.close() } }catch{}
audioCtxRef.current=null
streamRef.current?.getTracks().forEach(t=>t.stop());
if(videoRef.current) videoRef.current.srcObject=null;
setIsCam(false); setIsLive(false); setTorch(false); setYtLive(false); stopTimer()
}
const toggleCamera=async()=>{ await startCamera(facing==='user'?'environment':'user') }
const toggleTorch=async()=>{ try{ const track:any=trackRef.current; if(!track?.getCapabilities?.()?.torch) return; await track.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch) }catch(e:any){ } }
const loginFacebook=()=>{
if(!window.FB){ alert('Facebook SDK still loading, wait 3s'); return }
window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); loadPages(resp.authResponse.accessToken) }) } },{scope:'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts,business_management'})
}
const loadPages=(tok?:string)=>{ const t=tok||window.FB?.getAuthResponse()?.accessToken; if(!t) return; window.FB.api('/me/accounts', {access_token:t}, (res:any)=>{ if(res.data?.length){ setPages(res.data) } }) }
const stopIntroOnly=()=>{
  try{ if(introTimeoutRef.current) clearTimeout(introTimeoutRef.current) }catch{}
  introTimeoutRef.current=null
  setBroadcastPlaying(null)
  broadcastImageRef.current=null
  if(broadcastVideoRef.current){ try{ broadcastVideoRef.current.pause(); broadcastVideoRef.current.removeAttribute('src'); broadcastVideoRef.current.load() }catch{} }
  try{
    const el=(audioCtxRef.current as any)?.introAudioEl
    if(el && el._tagliveCleanup) el._tagliveCleanup()
    const mg=(audioCtxRef.current as any)?._micGain
    if(mg){ try{ mg.gain.value=1 }catch{} }
    if(fbPendingRef.current){
      const p=fbPendingRef.current; fbPendingRef.current=null
      setSelectedPage(p.page)
    }
  }catch{}
}
// FACEBOOK LIVE UPDATE ONLY
const createFbLiveForPage=async(page:any)=>{
  setSelectedPage(page)
  try{
    const res=await fetch('https://graph.facebook.com/v19.0/' + page.id + '/live_videos',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body: new URLSearchParams({ access_token: page.access_token, title: verse.substring(0,60), description: 'TagLive - '+verse, status: 'LIVE_NOW' })
    })
    const data=await res.json()
    if(data.error) throw new Error(data.error?.message || JSON.stringify(data.error))
    if(!data.stream_url) throw new Error('Facebook did not return a stream_url.')
    setFbStreamUrl(data.stream_url)
    setLiveId(data.id)
    setIsLive(true)
    startTimer()
    return data
  }catch(e:any){
    setFbStreamUrl('')
    setLiveId('')
    setIsLive(false)
    setSelectedPage(null)
    alert('Facebook Live failed for this Page: ' + (e.message || e))
    throw e
  }
}
const createFbLiveAuto=async(page:any)=>{
  const active=intros.find(i=>i.id===activeIntroId)
  if(active){
    setBroadcastPlaying(active)
    if(active.type==='image'){
      const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img }
      broadcastImageRef.current=img
    } else if(active.type==='video' && broadcastVideoRef.current){
      try{ broadcastVideoRef.current.src=active.data; broadcastVideoRef.current.muted=true; await broadcastVideoRef.current.play() }catch{}
    }
    fbPendingRef.current={ page }
    introTimeoutRef.current=setTimeout(async()=>{
      setBroadcastPlaying(null); broadcastImageRef.current=null
      if(broadcastVideoRef.current){ try{ broadcastVideoRef.current.pause() }catch{} }
      fbPendingRef.current=null
      await createFbLiveForPage(page)
    }, (active.duration||5)*1000)
  } else {
    await createFbLiveForPage(page)
  }
}
const openBibleApp=()=>{ setShowBible(true) }
const fetchBible=async(overrideQuery?:string)=>{
const queryToUse=overrideQuery||bibleQuery
if(!queryToUse.trim()) return
setBibleLoading(true)
setBibleResult('')
const qLower=queryToUse.toLowerCase().trim()
const getOffline=(q:string)=>{
try{ const cache=JSON.parse(localStorage.getItem('taglive_bible_cache')||'{}'); if(cache[q]) return cache[q]+' [CACHED]' }catch{}
if(OFFLINE_KJV[q]) return OFFLINE_KJV[q]+' [OFFLINE KJV]'
const found=Object.keys(OFFLINE_KJV).find(k=>q.includes(k)||k.includes(q))
if(found) return OFFLINE_KJV[found]+' [OFFLINE KJV]'
return null
}
try{
const res=await fetch('https://bible-api.com/'+encodeURIComponent(queryToUse)+'?translation='+bibleVer)
const data=await res.json()
if(data.text){
const full=data.reference+' ('+bibleVer.toUpperCase()+') - '+data.text
setBibleResult(full)
try{ const cache=JSON.parse(localStorage.getItem('taglive_bible_cache')||'{}'); cache[qLower]=full; localStorage.setItem('taglive_bible_cache', JSON.stringify(cache)) }catch{}
} else throw new Error('not found')
}catch{
const off=getOffline(qLower)
if(off){ setBibleResult(off) }
else { setBibleResult('Not found offline. Try John 3:16, Romans 1:20, Psalm 23.') }
}
setBibleLoading(false)
}
const useBibleVerse=()=>{ if(bibleResult){ setVerse(bibleResult); setShowBible(false) } }
const getFilteredBooks=(q:string)=>{ if(!q||q.length<1) return []; const lower=q.toLowerCase(); return BIBLE_BOOKS.filter(b=>b.name.toLowerCase().includes(lower)||lower.includes(b.name.toLowerCase().split(' ').pop()||'')).slice(0,8) }
const detectBookFromQuery=(q:string)=>{ const lower=q.toLowerCase(); return BIBLE_BOOKS.find(b=>lower.startsWith(b.name.toLowerCase()))||BIBLE_BOOKS.find(b=>lower.includes(b.name.toLowerCase())) }
const parseChapterVerse=(q:string,bookName:string)=>{ const rest=q.substring(bookName.length).trim(); const match=rest.match(/(\d+)(?:[:\s]+(\d+))?/); if(!match) return { ch: null, vs: null }; return { ch: parseInt(match[1]), vs: match[2]?parseInt(match[2]):null } }
const filteredBooks=getFilteredBooks(bibleQuery)
const detectedBook=detectBookFromQuery(bibleQuery)
const parsed=detectedBook?parseChapterVerse(bibleQuery,detectedBook.name):{ ch: null, vs: null }
const pasteClipboard=async()=>{ try{ const t=await navigator.clipboard.readText(); if(t) setVerse(t); }catch{ } }
const saveVerse=()=>{ if(!verse.trim()) return; const ns=[verse,...saved.filter(s=>s!==verse)].slice(0,20); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)); }
const deleteSaved=(idx:number)=>{ const ns=saved.filter((_,i)=>i!==idx); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)); }
const pickMedia=()=>fileInputRef.current?.click()
const pickLogo=()=>logoInputRef.current?.click()
const onFilePick=(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setBgImage(url); setBgMode('image'); const img=new Image(); img.src=url; img.onload=()=>{ bgImageRef.current=img } }
const onLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img }; setSelected('logo'); setShowLogo(true); localStorage.setItem('taglive_show_logo','true'); }
const handleChurchLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img }; setShowLogo(true); localStorage.setItem('taglive_show_logo','true'); }
const removeChurchLogo=()=>{ localStorage.removeItem('taglive_church_logo'); setLogoImage(null); logoImageRef.current=null; if(churchLogoInputRef.current) churchLogoInputRef.current.value=''; if(logoInputRef.current) logoInputRef.current.value=''; }
const startRecording=async()=>{
  const canvas=canvasRef.current; if(!canvas) return
  canvas.width=480; canvas.height=854
  const canvasStream=(canvas as any).captureStream(24) as MediaStream
  try{ if(audioCtxRef.current) audioCtxRef.current.close() }catch{}
  audioCtxRef.current=null
  setBroadcastPlaying(null)
  broadcastImageRef.current=null
  if(broadcastVideoRef.current){ try{ broadcastVideoRef.current.pause(); broadcastVideoRef.current.removeAttribute('src'); broadcastVideoRef.current.load() }catch{} }
  if(introTimeoutRef.current){ try{ clearTimeout(introTimeoutRef.current) }catch{} }
  const audioCtx=new (window.AudioContext||(window as any).webkitAudioContext)()
  audioCtxRef.current=audioCtx
  const dest=audioCtx.createMediaStreamDestination()
  ;(audioCtx as any)._dest=dest
  const micTrack=streamRef.current?.getAudioTracks()[0]
  if(!micTrack) return
  const micSource=audioCtx.createMediaStreamSource(new MediaStream([micTrack]))
  const micGain=audioCtx.createGain()
  micGain.gain.value=1
  ;(audioCtx as any)._micGain=micGain
  ;(audioCtx as any)._micSource=micSource
  micSource.connect(micGain)
  micGain.connect(dest)
  const active=intros.find(i=>i.id===activeIntroId)
  if(active){
    setBroadcastPlaying(active)
    try{ micGain.gain.value=0 }catch{}
    if(active.type==='image'){
      const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img }
      broadcastImageRef.current=img
    } else if(active.type==='video'){
      if(broadcastVideoRef.current){
        const v=broadcastVideoRef.current
        v.crossOrigin="anonymous"; v.playsInline=true; v.muted=true; v.volume=0
        v.src=active.data; v.currentTime=0
        try{ await v.play() }catch{}
      }
      try{
        const audioEl=document.createElement('video')
        audioEl.crossOrigin="anonymous"; audioEl.playsInline=true; audioEl.muted=false; audioEl.volume=1
        audioEl.src=active.data
        await audioEl.play().catch(()=>{})
        const vSource=audioCtx.createMediaElementSource(audioEl)
        vSource.connect(dest)
        vSource.connect(audioCtx.destination)
        ;(audioEl as any)._tagliveCleanup=()=>{ try{ vSource.disconnect() }catch{}; try{ audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load() }catch{} }
        ;(audioCtxRef.current as any).introAudioEl=audioEl
      }catch{}
    }
  }
  dest.stream.getAudioTracks().forEach(t=>canvasStream.addTrack(t))
  chunksRef.current=[]
  let mime='video/webm;codecs=vp9,opus'
  if(!MediaRecorder.isTypeSupported(mime)) mime='video/webm;codecs=vp8,opus'
  if(!MediaRecorder.isTypeSupported(mime)) mime='video/webm'
  const rec=new MediaRecorder(canvasStream, { mimeType: mime, videoBitsPerSecond: 1500000 })
  rec.ondataavailable=(e)=>{ if(e.data.size>0) chunksRef.current.push(e.data) }
  rec.onstop=()=>{
    const blob=new Blob(chunksRef.current, { type: 'video/webm' })
    if(recordedUrl) try{ URL.revokeObjectURL(recordedUrl) }catch{}
    setRecordedUrl(URL.createObjectURL(blob))
  }
  rec.start(100); recorderRef.current=rec; setIsRecording(true); startTimer()
  if(active){
    introTimeoutRef.current=setTimeout(()=>{
      setBroadcastPlaying(null); broadcastImageRef.current=null
      if(broadcastVideoRef.current){ try{ broadcastVideoRef.current.pause(); broadcastVideoRef.current.removeAttribute('src'); broadcastVideoRef.current.load() }catch{} }
      try{ const el=(audioCtxRef.current as any)?.introAudioEl; if(el && el._tagliveCleanup) el._tagliveCleanup() }catch{}
      try{ micGain.gain.value=1 }catch{}
    }, (active.duration||5)*1000)
  }
}
