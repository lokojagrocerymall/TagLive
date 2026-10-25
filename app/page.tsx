"use client"
export const dynamic = 'force-dynamic'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://gqifluvkrjzsebfdjcio.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzY4NDgsImV4cCI6MjEwNzk1Mjg0OH0.zonQMk22nXN0VsbHyI88hT27ntl-VxEEi8k2G8-k5lc')
declare global { interface Window { FB: any } }
const OFFLINE_KJV: Record<string,string> = {"john 3:16":"John 3:16 - For God so loved the world that He gave His only begotten Son...","romans 1:20":"Romans 1:20 - For the invisible things of Him from the creation...","romans 8:28":"Romans 8:28 - And we know that all things work together...","psalm 23":"Psalm 23 - The LORD is my shepherd...","jeremiah 29:11":"Jeremiah 29:11 - For I know the thoughts that I think...","philippians 4:13":"Philippians 4:13 - I can do all things through Christ...","isaiah 41:10":"Isaiah 41:10 - Fear thou not; for I am with thee...","john 14:6":"John 14:6 - I am the way, the truth, and the life...","2 timothy 1:7":"2 Timothy 1:7 - For God hath not given us the spirit of fear...","psalm 91:1":"Psalm 91:1 - He that dwelleth in the secret place...","matthew 28:19":"Matthew 28:19 - Go ye therefore, and teach all nations...","genesis 1:1":"Genesis 1:1 - In the beginning God created...","proverbs 3:5":"Proverbs 3:5 - Trust in the LORD with all thine heart...","john 1:1":"John 1:1 - In the beginning was the Word...","romans 10:9":"Romans 10:9 - That if thou shalt confess with thy mouth..."}
const BIBLE_VERSIONS = [{ id: 'kjv', label: 'KJV' },{ id: 'akjv', label: 'NKJV-like' },{ id: 'web', label: 'NIV-like' },{ id: 'bbe', label: 'GNB-like' },{ id: 'asv', label: 'RSV-like' },{ id: 'lsv', label: 'ESV-like' },{ id: 'oeb-cw', label: 'AMP-like' },{ id: 'webbe', label: 'WEBBE' },]
const BIBLE_BOOKS = [{ name: "Genesis", chapters: 50 },{ name: "Exodus", chapters: 40 },{ name: "Leviticus", chapters: 27 },{ name: "Numbers", chapters: 36 },{ name: "Deuteronomy", chapters: 34 },{ name: "Joshua", chapters: 24 },{ name: "Judges", chapters: 21 },{ name: "Ruth", chapters: 4 },{ name: "1 Samuel", chapters: 31 },{ name: "2 Samuel", chapters: 24 },{ name: "1 Kings", chapters: 22 },{ name: "2 Kings", chapters: 25 },{ name: "1 Chronicles", chapters: 29 },{ name: "2 Chronicles", chapters: 36 },{ name: "Ezra", chapters: 10 },{ name: "Nehemiah", chapters: 13 },{ name: "Esther", chapters: 10 },{ name: "Job", chapters: 42 },{ name: "Psalm", chapters: 150 },{ name: "Proverbs", chapters: 31 },{ name: "Ecclesiastes", chapters: 12 },{ name: "Song of Solomon", chapters: 8 },{ name: "Isaiah", chapters: 66 },{ name: "Jeremiah", chapters: 52 },{ name: "Lamentations", chapters: 5 },{ name: "Ezekiel", chapters: 48 },{ name: "Daniel", chapters: 12 },{ name: "Hosea", chapters: 14 },{ name: "Joel", chapters: 3 },{ name: "Amos", chapters: 9 },{ name: "Obadiah", chapters: 1 },{ name: "Jonah", chapters: 4 },{ name: "Micah", chapters: 7 },{ name: "Nahum", chapters: 3 },{ name: "Habakkuk", chapters: 3 },{ name: "Zephaniah", chapters: 3 },{ name: "Haggai", chapters: 2 },{ name: "Zechariah", chapters: 14 },{ name: "Malachi", chapters: 4 },{ name: "Matthew", chapters: 28 },{ name: "Mark", chapters: 16 },{ name: "Luke", chapters: 24 },{ name: "John", chapters: 21 },{ name: "Acts", chapters: 28 },{ name: "Romans", chapters: 16 },{ name: "1 Corinthians", chapters: 16 },{ name: "2 Corinthians", chapters: 13 },{ name: "Galatians", chapters: 6 },{ name: "Ephesians", chapters: 6 },{ name: "Philippians", chapters: 4 },{ name: "Colossians", chapters: 4 },{ name: "1 Thessalonians", chapters: 5 },{ name: "2 Thessalonians", chapters: 3 },{ name: "1 Timothy", chapters: 6 },{ name: "2 Timothy", chapters: 4 },{ name: "Titus", chapters: 3 },{ name: "Philemon", chapters: 1 },{ name: "Hebrews", chapters: 13 },{ name: "James", chapters: 5 },{ name: "1 Peter", chapters: 5 },{ name: "2 Peter", chapters: 3 },{ name: "1 John", chapters: 5 },{ name: "2 John", chapters: 1 },{ name: "3 John", chapters: 1 },{ name: "Jude", chapters: 1 },{ name: "Revelation", chapters: 22 }]

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
const [liveId,setLiveId]=useState('')
const [pos,setPos]=useState({ x: 360, y: 1050, scale: 0.95, rotation: 0 })
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
const [logoPos,setLogoPos]=useState({ x: 360, y: 300, scale: 0.7, rotation: 0 })
const [isRecording,setIsRecording]=useState(false)
const [recordedUrl,setRecordedUrl]=useState<string|null>(null)
const [selected,setSelected]=useState<'text'|'logo'>('text')
const [showText,setShowText]=useState(true)
const [showLogo,setShowLogo]=useState(true)
const [isAdmin,setIsAdmin]=useState(false)
const [stats,setStats]=useState({ live: 0, daily: 0, weekly: 0, monthly: 0, total: 0 })
const [intros,setIntros]=useState<any[]>([])
const [outros,setOutros]=useState<any[]>([])
const [activeIntroId,setActiveIntroId]=useState<string|null>(null)
const [activeOutroId,setActiveOutroId]=useState<string|null>(null)
const [showStudio,setShowStudio]=useState(false)
const [showTickerStudio,setShowTickerStudio]=useState(false)
const [showAdmin,setShowAdmin]=useState(false)
const [showSettings,setShowSettings]=useState(false)
const [broadcastPlaying,setBroadcastPlaying]=useState<any>(null)
const [tickerText,setTickerText]=useState('📢 ANNOUNCEMENT: Sunday Service 9AM | Midweek Service Wednesday 6PM | Invite Someone!')
const [tickerOn,setTickerOn]=useState(false)
const [tickerSize,setTickerSize]=useState(26)
const [tickerSpeed,setTickerSpeed]=useState(2)
const [churchName,setChurchName]=useState("KPAKO NYANKPA INT'L MINISTRY")
const [showChurchName,setShowChurchName]=useState(true)
const [liveSeconds,setLiveSeconds]=useState(0)
const timerRef=useRef<any>(null)
const [showBible,setShowBible]=useState(false)
const [bibleVer,setBibleVer]=useState('kjv')
const [bibleQuery,setBibleQuery]=useState('Romans 1:20')
const [bibleResult,setBibleResult]=useState('')
const [bibleLoading,setBibleLoading]=useState(false)
const [lowData,setLowData]=useState(false)
const tickerOffsetRef=useRef(720)
const introFileRef=useRef<HTMLInputElement>(null)
const outroFileRef=useRef<HTMLInputElement>(null)
const broadcastVideoRef=useRef<HTMLVideoElement>(null)
const broadcastImageRef=useRef<HTMLImageElement|null>(null)
const lastTouch=useRef({ dist: 0, angle: 0, x:0, y:0, scale:1, rot:0, selScale:1, selRot:0 })
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
// FIX FOR INTRO STOP - TV STUDIO MODE
const introTimeoutRef=useRef<any>(null)
const fbPendingRef=useRef<any>(null)
const formatTime=(sec:number)=>{ const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60; return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` }
const startTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); setLiveSeconds(0); timerRef.current=setInterval(()=>setLiveSeconds(p=>p+1),1000) }
const stopTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); timerRef.current=null; setLiveSeconds(0) }
  useEffect(()=>{
const trackDevice=async()=>{
try{
let deviceId=localStorage.getItem('taglive_device')
if(!deviceId){ deviceId=`dev_${Date.now()}_${Math.random().toString(36).slice(2,9)}`; localStorage.setItem('taglive_device', deviceId) }
await supabase.from('taglive_devices').upsert({ device_id: deviceId, last_seen: new Date().toISOString(), user_agent: navigator.userAgent.substring(0,200) }, { onConflict: 'device_id' })
const lastView=localStorage.getItem('tl_last_view'); const now=Date.now()
if(!lastView || now-parseInt(lastView)>30*60*1000){ await supabase.from('taglive_views').insert({ device_id: deviceId }); localStorage.setItem('tl_last_view', now.toString()) }
if(localStorage.getItem('taglive_admin')==='true'){
const nowDate=new Date(); const todayStart=new Date(nowDate); todayStart.setHours(0,0,0,0)
const weekStart=new Date(nowDate); weekStart.setDate(nowDate.getDate()-7)
const monthStart=new Date(nowDate); monthStart.setDate(nowDate.getDate()-30)
const fiveMinAgo=new Date(nowDate.getTime()-5*60*1000)
const { count: live }=await supabase.from('taglive_devices').select('*',{count:'exact',head:true}).gt('last_seen', fiveMinAgo.toISOString())
const { count: total }=await supabase.from('taglive_views').select('*',{count:'exact',head:true})
const { count: daily }=await supabase.from('taglive_views').select('*',{count:'exact',head:true}).gte('created_at', todayStart.toISOString())
const { count: weekly }=await supabase.from('taglive_views').select('*',{count:'exact',head:true}).gte('created_at', weekStart.toISOString())
const { count: monthly }=await supabase.from('taglive_views').select('*',{count:'exact',head:true}).gte('created_at', monthStart.toISOString())
setStats({ live: live||0, daily: daily||0, weekly: weekly||0, monthly: monthly||0, total: total||0 })
}
}catch{}
}
trackDevice(); const interval=setInterval(trackDevice,60000); return()=>clearInterval(interval)
},[isAdmin])

useEffect(()=>{
try{
const i=localStorage.getItem('taglive_intros'); if(i){ setIntros(JSON.parse(i)) }
const o=localStorage.getItem('taglive_outros'); if(o){ setOutros(JSON.parse(o)) }
const ai=localStorage.getItem('taglive_active_intro'); if(ai) setActiveIntroId(ai)
const ao=localStorage.getItem('taglive_active_outro'); if(ao) setActiveOutroId(ao)
const cl=localStorage.getItem('taglive_church_logo'); 
if(cl){ 
  setLogoImage(cl); 
  const img=new Image(); 
  img.src=cl; 
  img.onload=()=>{ logoImageRef.current=img } 
}
const sv=localStorage.getItem('taglive_saved'); if(sv){ setSaved(JSON.parse(sv)) }
const cn=localStorage.getItem('taglive_church_name'); if(cn) setChurchName(cn)
const tt=localStorage.getItem('taglive_ticker_text'); if(tt) setTickerText(tt)
const ton=localStorage.getItem('taglive_ticker_on'); if(ton) setTickerOn(ton==='true')
const lo=localStorage.getItem('taglive_show_logo'); if(lo) setShowLogo(lo==='true')
setTimeout(()=>{
  if(canvasRef.current){ canvasRef.current.width=480; canvasRef.current.height=854 }
  setPos((p:any)=>({...p, x:240, y:700 }))
  setLogoPos((p:any)=>({...p, x:90, y:90 }))
},600)
}catch{}
},[])

const saveIntros=(arr:any[])=>{ const filtered=arr.filter((x:any)=>x.type!=='animated'); setIntros(filtered); localStorage.setItem('taglive_intros', JSON.stringify(filtered)) }
const saveOutros=(arr:any[])=>{ const filtered=arr.filter((x:any)=>x.type!=='animated'); setOutros(filtered); localStorage.setItem('taglive_outros', JSON.stringify(filtered)) }
const fileToBase64=(file:File)=>new Promise<string>((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file) })
const getVideoDuration=(base64:string)=>new Promise<number>((res)=>{ const v=document.createElement('video'); v.src=base64; v.onloadedmetadata=()=>res(v.duration); setTimeout(()=>res(5),2000) })

const handleIntroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return
const base64=await fileToBase64(file)
let dur=5
if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name }
const n=[...intros,item]; saveIntros(n); setActiveIntroId(item.id); localStorage.setItem('taglive_active_intro', item.id); e.target.value=''; 
}
const handleOutroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return
const base64=await fileToBase64(file)
let dur=5
if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name }
const n=[...outros,item]; saveOutros(n); setActiveOutroId(item.id); localStorage.setItem('taglive_active_outro', item.id); e.target.value=''; 
}

const startCamera=async(newFacing=facing)=>{
try{
if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
await new Promise(r=>setTimeout(r,300))
const w=lowData?640:1280
const h=lowData?480:720
const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing,width:{ideal:w},height:{ideal:h}},audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}})
streamRef.current=s; trackRef.current=s.getVideoTracks()[0]
if(videoRef.current){ videoRef.current.srcObject=s; await videoRef.current.play() }
if(canvasRef.current){ canvasRef.current.width=480; canvasRef.current.height=854 }
setFacing(newFacing); setIsCam(true)
}catch(e:any){ alert('Camera: '+e.message) }
}
const stopCamera=()=>{
if(isRecording) stopRecordingFinal();
streamRef.current?.getTracks().forEach(t=>t.stop());
if(videoRef.current) videoRef.current.srcObject=null;
setIsCam(false); setIsLive(false); setTorch(false); setYtLive(false); stopTimer()
}
const toggleCamera=async()=>{ await startCamera(facing==='user'?'environment':'user') }
const toggleTorch=async()=>{ try{ const track:any=trackRef.current; if(!track?.getCapabilities?.()?.torch) return alert('Torch not supported'); await track.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch) }catch(e:any){ alert(e.message) } }

const loginFacebook=()=>{
if(!window.FB){ alert('Wait 3 sec...'); return }
window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); loadPages(resp.authResponse.accessToken) }) } },{scope:'public_profile,pages_show_list,pages_read_engagement,business_management'})
}
const loadPages=(tok?:string)=>{ const t=tok||window.FB?.getAuthResponse()?.accessToken; if(!t) return alert('Login first'); window.FB.api('/me/accounts', {access_token:t}, (res:any)=>{ if(res.data?.length){ setPages(res.data); alert(`Found ${res.data.length} pages`) } else alert('No pages') }) }

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

const createFbLiveAuto=async(page:any)=>{
const active=intros.find(i=>i.id===activeIntroId)
if(active){
setBroadcastPlaying(active)
if(active.type==='image'){ const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img }; broadcastImageRef.current=img }
if(active.type==='video'&&broadcastVideoRef.current){
  broadcastVideoRef.current.src=active.data;
  broadcastVideoRef.current.crossOrigin="anonymous";
  broadcastVideoRef.current.muted=false;
  broadcastVideoRef.current.volume=1;
  broadcastVideoRef.current.playsInline=true;
  try{ await broadcastVideoRef.current.play() }catch{}
}
introTimeoutRef.current=setTimeout(async()=>{
setBroadcastPlaying(null); broadcastImageRef.current=null;
if(broadcastVideoRef.current){ try{ broadcastVideoRef.current.pause() }catch{} }
setSelectedPage(page)
try{
const res=await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token: page.access_token, title: verse.substring(0,60), description: 'TagLive - '+verse, status: 'UNPUBLISHED' }) })
const data=await res.json(); if(data.error) throw new Error(JSON.stringify(data.error)); setFbStreamUrl(data.stream_url); setLiveId(data.id); setIsLive(true); startTimer()
}catch(e:any){ setIsLive(true); startTimer() }
}, (active.duration||5)*1000)
fbPendingRef.current={ page }
} else {
setSelectedPage(page)
try{
const res=await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token: page.access_token, title: verse.substring(0,60), description: 'TagLive - '+verse, status: 'UNPUBLISHED' }) })
const data=await res.json(); if(data.error) throw new Error(JSON.stringify(data.error)); setFbStreamUrl(data.stream_url); setLiveId(data.id); setIsLive(true); startTimer()
}catch(e:any){ setIsLive(true); startTimer() }
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
const res=await fetch(`https://bible-api.com/${encodeURIComponent(queryToUse)}?translation=${bibleVer}`)
const data=await res.json()
if(data.text){
const full=`${data.reference} (${bibleVer.toUpperCase()}) - ${data.text}`
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

const pasteClipboard=async()=>{ try{ const t=await navigator.clipboard.readText(); if(t) setVerse(t); else alert('Clipboard empty') }catch{ alert('Allow clipboard') } }
const saveVerse=()=>{ if(!verse.trim()) return; const ns=[verse,...saved.filter(s=>s!==verse)].slice(0,20); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)); }
const deleteSaved=(idx:number)=>{ const ns=saved.filter((_,i)=>i!==idx); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)); }
const pickMedia=()=>fileInputRef.current?.click()
const pickLogo=()=>logoInputRef.current?.click()
const onFilePick=(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setBgImage(url); setBgMode('image'); const img=new Image(); img.src=url; img.onload=()=>{ bgImageRef.current=img } }
const onLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img }; setSelected('logo'); setShowLogo(true); localStorage.setItem('taglive_show_logo','true'); }
const handleChurchLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img }; setShowLogo(true); localStorage.setItem('taglive_show_logo','true'); }
const removeChurchLogo=()=>{ localStorage.removeItem('taglive_church_logo'); setLogoImage(null); logoImageRef.current=null; if(churchLogoInputRef.current) churchLogoInputRef.current.value=''; if(logoInputRef.current) logoInputRef.current.value=''; }

const startRecording=async()=>{
  const canvas=canvasRef.current; if(!canvas) return alert('Start camera first')
  canvas.width=480; canvas.height=854
  const canvasStream=(canvas as any).captureStream(30) as MediaStream
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
  if(!micTrack) return alert('Mic not found - restart camera')
  const micSource=audioCtx.createMediaStreamSource(new MediaStream([micTrack]))
  const micGain=audioCtx.createGain()
  micGain.gain.value=1
  ;(audioCtx as any)._micGain=micGain
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
  const rec=new MediaRecorder(canvasStream, { mimeType: mime, videoBitsPerSecond: 1200000 })
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

const stopRecordingFinal=()=>{
  try{ if(introTimeoutRef.current) clearTimeout(introTimeoutRef.current) }catch{}
  introTimeoutRef.current=null
  try{ recorderRef.current?.stop() }catch{}
  try{
    const el=(audioCtxRef.current as any)?.introAudioEl
    if(el && el._tagliveCleanup) el._tagliveCleanup()
    const el2=(audioCtxRef.current as any)?.outroAudioEl
    if(el2 && el2._tagliveCleanup) el2._tagliveCleanup()
  }catch{}
  try{ if(audioCtxRef.current) audioCtxRef.current.close() }catch{}
  audioCtxRef.current=null
  setIsRecording(false); setBroadcastPlaying(null); broadcastImageRef.current=null
  if(broadcastVideoRef.current){ try{ broadcastVideoRef.current.pause(); broadcastVideoRef.current.removeAttribute('src'); broadcastVideoRef.current.load() }catch{} }
  if(!isLive&&!ytLive) stopTimer()
}

const stopRecording=async()=>{
  const active=outros.find(o=>o.id===activeOutroId)
  if(active && isRecording){
    setBroadcastPlaying(active)
    const micGain=(audioCtxRef.current as any)?._micGain
    if(micGain){ try{ micGain.gain.value=0 }catch{} }
    if(active.type==='image'){
      const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img }
      broadcastImageRef.current=img
      setTimeout(()=>{ if(micGain){ try{ micGain.gain.value=1 }catch{} } stopRecordingFinal() }, (active.duration||5)*1000)
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
        if(audioCtxRef.current && (audioCtxRef.current as any)._dest){
          const dest=(audioCtxRef.current as any)._dest
          const vSource=audioCtxRef.current.createMediaElementSource(audioEl)
          vSource.connect(dest)
          vSource.connect(audioCtxRef.current.destination)
          ;(audioEl as any)._tagliveCleanup=()=>{ try{ vSource.disconnect() }catch{}; try{ audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load() }catch{} }
          ;(audioCtxRef.current as any).outroAudioEl=audioEl
        }
      }catch{}
      setTimeout(()=>{ if(micGain){ try{ micGain.gain.value=1 }catch{} } stopRecordingFinal() }, (active.duration||5)*1000)
    }
  } else { stopRecordingFinal() }
}

// DOUBLE TAP TO LOCK / UNLOCK - FIXED ADJUSTABLE
const editStateRef=useRef({ locked:false, target:null as any, lastTap:0, lastX:0, lastY:0 })

const onTouchStart=(e:any)=>{
const canvas=canvasRef.current; if(!canvas) return
const rect=canvas.getBoundingClientRect(); 
const cw=canvas.width||480; const ch=canvas.height||854
const tx=(e.touches[0].clientX-rect.left)*(cw/rect.width)
const ty=(e.touches[0].clientY-rect.top)*(ch/rect.height)
const distText=Math.hypot(tx-pos.x,ty-pos.y)
const distLogo=Math.hypot(tx-logoPos.x,ty-logoPos.y)
const nearText=distText<350
const nearLogo=logoImage&&showLogo&&distLogo<300
const now=Date.now()
const timeDiff=now-editStateRef.current.lastTap
const moved=Math.hypot(tx-editStateRef.current.lastX, ty-editStateRef.current.lastY)

if(nearText||nearLogo){
  const tappedTarget=nearLogo&&(!nearText||distLogo<distText)?'logo':'text'
  if(timeDiff<350 && moved<80 && editStateRef.current.target===tappedTarget){
    if(editStateRef.current.locked && editStateRef.current.target===tappedTarget){
      editStateRef.current.locked=false; editStateRef.current.target=null
      setDragging(false); setSelected(null as any)
    } else {
      editStateRef.current.locked=true; editStateRef.current.target=tappedTarget
      setSelected(tappedTarget as any)
      lastTouch.current.selScale=tappedTarget==='logo'?logoPos.scale:pos.scale
      lastTouch.current.selRot=tappedTarget==='logo'?logoPos.rotation:pos.rotation
      lastTouch.current.dist=0
      lastTouch.current.angle=0
    }
    editStateRef.current.lastTap=0
    return
  }
  editStateRef.current.lastTap=now
  editStateRef.current.lastX=tx
  editStateRef.current.lastY=ty
  if(!editStateRef.current.locked) editStateRef.current.target=tappedTarget
  setDragging(false)
  return
} else {
  if(editStateRef.current.locked){
    editStateRef.current.locked=false
    editStateRef.current.target=null
    setDragging(false)
    setSelected(null as any)
  }
  editStateRef.current.lastTap=now
  editStateRef.current.lastX=tx
  editStateRef.current.lastY=ty
  return
}
}

const onTouchMove=(e:any)=>{
if(!editStateRef.current.locked) return
const canvas=canvasRef.current; if(!canvas) return
const rect=canvas.getBoundingClientRect(); if(!rect) return
e.preventDefault()
if(e.touches.length===1){
  const cw=canvas.width||480; const ch=canvas.height||854
  const tx=(e.touches[0].clientX-rect.left)*(cw/rect.width); 
  const ty=(e.touches[0].clientY-rect.top)*(ch/rect.height); 
  if(editStateRef.current.target==='logo') setLogoPos(p=>({...p,x:tx,y:ty})); else setPos(p=>({...p,x:tx,y:ty})) 
  if(!dragging) setDragging(true)
}
if(e.touches.length===2){
  const dx=e.touches[1].clientX-e.touches[0].clientX; const dy=e.touches[1].clientY-e.touches[0].clientY; const dist=Math.hypot(dx,dy); const angle=Math.atan2(dy,dx)*180/Math.PI;
  if(lastTouch.current.dist===0){ lastTouch.current.dist=dist; lastTouch.current.angle=angle; lastTouch.current.selScale=editStateRef.current.target==='logo'?logoPos.scale:pos.scale; lastTouch.current.selRot=editStateRef.current.target==='logo'?logoPos.rotation:pos.rotation }
  if(lastTouch.current.dist>0){ const f=dist/lastTouch.current.dist; if(editStateRef.current.target==='logo'){ setLogoPos(p=>({ ...p, scale:Math.min(2,Math.max(0.2,lastTouch.current.selScale*f)), rotation:lastTouch.current.selRot+(angle-lastTouch.current.angle) })) } else { setPos(p=>({ ...p, scale:Math.min(1.3,Math.max(0.6,lastTouch.current.selScale*f)), rotation:lastTouch.current.selRot+(angle-lastTouch.current.angle) })) } }
}
}
const onTouchEnd=(e:any)=>{
  setDragging(false)
  if(e && e.touches && e.touches.length===0){
    lastTouch.current.dist=0
  }
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
const ctx=c.getContext('2d')
if(ctx){
if(broadcastPlaying){
ctx.fillStyle='#000'; ctx.fillRect(0,0,c.width,c.height)
if(broadcastPlaying.type==='image'&&broadcastImageRef.current){
const iw=broadcastImageRef.current.width, ih=broadcastImageRef.current.height
const ratio=Math.min(c.width/iw, c.height/ih)
const nw=iw*ratio, nh=ih*ratio
const x=(c.width-nw)/2, y=(c.height-nh)/2
ctx.drawImage(broadcastImageRef.current,x,y,nw,nh)
} else if(broadcastPlaying.type==='video'&&broadcastVideoRef.current&&broadcastVideoRef.current.readyState>=2){
const vw=broadcastVideoRef.current.videoWidth, vh=broadcastVideoRef.current.videoHeight
if(vw&&vh){ const ratio=Math.min(c.width/vw, c.height/vh); const nw=vw*ratio, nh=vh*ratio; const x=(c.width-nw)/2, y=(c.height-nh)/2; ctx.drawImage(broadcastVideoRef.current,x,y,nw,nh) }
}
} else {
const hexToRgba=(hex:string,op:number)=>{ const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${op})` }
if(bgMode==='split'){
ctx.fillStyle='#000'; ctx.fillRect(0,0,c.width,c.height)
const vw=v.videoWidth||1280; const vh=v.videoHeight||720
const targetW=c.width; const targetH=c.height*0.52
const scale=Math.max(targetW/vw,targetH/vh)
const sW=targetW/scale; const sH=targetH/scale
const sX=(vw-sW)/2; const sY=(vh-sH)/2
ctx.drawImage(v,sX,sY,sW,sH,0,c.height*0.48,targetW,targetH)
} else if(bgMode==='black'){ ctx.fillStyle='#000'; ctx.fillRect(0,0,c.width,c.height) }
else if(bgMode==='image'){ 
  if(bgImageRef.current){
    const iw=bgImageRef.current.width, ih=bgImageRef.current.height
    const rCanvas=c.width/c.height, rImg=iw/ih
    let sx,sy,sw,sh
    if(rImg>rCanvas){ sh=ih; sw=ih*rCanvas; sx=(iw-sw)/2; sy=0 }
    else { sw=iw; sh=iw/rCanvas; sx=0; sy=(ih-sh)/2 }
    ctx.drawImage(bgImageRef.current,sx,sy,sw,sh,0,0,c.width,c.height)
  } else { const g=ctx.createLinearGradient(0,0,c.width,c.height); g.addColorStop(0,'#1e3a8a'); g.addColorStop(1,'#581c87'); ctx.fillStyle=g; ctx.fillRect(0,0,c.width,c.height) }
}
else {
  const vw=v.videoWidth||1280, vh=v.videoHeight||720
  const rCanvas=c.width/c.height, rVideo=vw/vh
  let sx,sy,sw,sh
  if(rVideo>rCanvas){ sh=vh; sw=vh*rCanvas; sx=(vw-sw)/2; sy=0 }
  else { sw=vw; sh=vw/rCanvas; sx=0; sy=(vh-sh)/2 }
  ctx.drawImage(v,sx,sy,sw,sh,0,0,c.width,c.height)
}
if(logoImageRef.current && showLogo){ ctx.save(); ctx.translate(logoPos.x,logoPos.y); ctx.rotate(logoPos.rotation*Math.PI/180); ctx.scale(logoPos.scale,logoPos.scale); const iw=logoImageRef.current.width, ih=logoImageRef.current.height; const maxLogoW=180; const sc=Math.min(1,maxLogoW/iw); ctx.drawImage(logoImageRef.current,-iw*sc/2,-ih*sc/2,iw*sc,ih*sc); if(editStateRef.current.locked && editStateRef.current.target==='logo'){ ctx.strokeStyle='#00ff00'; ctx.lineWidth=3; ctx.setLineDash([8,6]); ctx.strokeRect(-iw*sc/2-6,-ih*sc/2-6,iw*sc+12,ih*sc+12); ctx.setLineDash([]) } ctx.restore() }
if(showText){
ctx.save();
const isSplit=bgMode==='split'
const drawX=isSplit?c.width*0.5:pos.x
const drawY=isSplit?c.height*0.24:pos.y
const maxW=isSplit?600:520
ctx.translate(drawX,drawY); ctx.rotate(pos.rotation*Math.PI/180); ctx.scale(pos.scale,pos.scale); ctx.font=`bold ${fontSize}px sans-serif`; const pad=24; const boxW=maxW+pad*2; const paragraphs=verse.split('\n'); let allLines:{text:string,isLastInPara:boolean,paraIdx:number}[]=[]; paragraphs.forEach((para,pIdx)=>{ if(!para.trim()){ allLines.push({text:'',isLastInPara:true,paraIdx:pIdx}); return } const wrapped=wrapText(ctx,para.trim(),maxW); wrapped.forEach((l,i)=>allLines.push({text:l,isLastInPara:i===wrapped.length-1,paraIdx:pIdx})) }); const realCount=allLines.filter(l=>l.text!=='').length; const lineH=fontSize*1.38; const boxH=realCount*lineH+(paragraphs.length-1)*10+pad*2; ctx.fillStyle=hexToRgba(boxColor,boxOpacity); ctx.fillRect(-boxW/2,-boxH/2,boxW,boxH); ctx.fillStyle=textColor; let y=-boxH/2+pad+lineH/2; allLines.forEach((ln)=>{ if(!ln.text){ y+=10; return } ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(ln.text,0,y); y+=lineH });
if(isSplit&&showChurchName&&churchName){
ctx.fillStyle='#FFD700'; ctx.font=`900 ${Math.max(14,Math.floor(fontSize*0.52))}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'
const churchY=y+22; const tW=ctx.measureText(churchName.toUpperCase()).width+28
ctx.fillStyle='rgba(124,58,237,0.95)'; const pillH=28; ctx.fillRect(-tW/2,churchY-pillH/2,tW,pillH)
ctx.fillStyle='#FFD700'; ctx.fillText(churchName.toUpperCase(),0,churchY)
}
if(editStateRef.current.locked && editStateRef.current.target==='text' && !isSplit){ ctx.strokeStyle='#7c3aed'; ctx.lineWidth=3; ctx.setLineDash([10,6]); ctx.strokeRect(-boxW/2-4,-boxH/2-4,boxW+8,boxH+8); ctx.setLineDash([]) } ctx.restore() }
if(isLive||ytLive||isRecording){
const timeStr=formatTime(liveSeconds)
ctx.save(); ctx.fillStyle='#FF0000'; ctx.font='900 28px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=6; ctx.fillText(`● LIVE ${timeStr}${lowData?' [480p]':''}`,24,22); ctx.restore()
}
if(tickerOn&&tickerText){
const tickerH=tickerSize+24
ctx.fillStyle='#000000'
ctx.fillRect(0,c.height-tickerH,c.width,tickerH)
ctx.fillStyle='#FFFF00'
ctx.font='bold '+tickerSize+'px sans-serif'
ctx.textAlign='left'
ctx.textBaseline='middle'
const txt=tickerText+'   •   '+tickerText
const w=ctx.measureText(txt).width
tickerOffsetRef.current-=tickerSpeed
if(tickerOffsetRef.current<0-w){ tickerOffsetRef.current=c.width }
ctx.fillText(txt,tickerOffsetRef.current,c.height-tickerH/2)
}
}
}
}
a=requestAnimationFrame(draw)
}
draw()
return()=>cancelAnimationFrame(a)
},[isCam,verse,isLive,pos,bgMode,fontSize,align,bgImage,ytLive,textColor,boxColor,boxOpacity,logoImage,logoPos,isRecording,selected,showText,showLogo,tickerOn,tickerText,tickerSize,tickerSpeed,churchName,showChurchName,liveSeconds,lowData,broadcastPlaying])

return (
<div style={{minHeight:'100vh',background:'#f5f5f7'}}>
{showBible&&(
<div style={{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.92)',padding:12,display:'flex'}}>
<div style={{background:'#fff',borderRadius:16,padding:12,flex:1,display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto',width:'100%',overflow:'hidden'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:13}}>📖 Bible {isCam&&<span style={{color:'#FF0000'}}>● LIVE {formatTime(liveSeconds)}</span>}</b><button onClick={()=>setShowBible(false)} style={{background:'#111',color:'#fff',border:'none',borderRadius:20,padding:'8px 12px',fontWeight:800}}>✕ Close</button></div>
<div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>{BIBLE_VERSIONS.map(v=>(<button key={v.id} onClick={()=>setBibleVer(v.id)} style={{padding:'6px 10px',borderRadius:20,border:'none',background:bibleVer===v.id?'#111':'#eee',color:bibleVer===v.id?'#fff':'#000',fontWeight:800,fontSize:10}}>{v.label}</button>))}</div>
<div style={{display:'flex',gap:6,marginTop:10}}><input value={bibleQuery} onChange={e=>setBibleQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')fetchBible()}} placeholder="Type 1 Thes, John, Romans..." style={{flex:1,padding:12,borderRadius:10,border:'2px solid #7c3aed',fontSize:13,fontWeight:700}}/><button onClick={()=>fetchBible()} style={{background:'#7c3aed',color:'#fff',border:'none',borderRadius:10,padding:'0 16px',fontWeight:800}}>{bibleLoading?'...':'Search'}</button></div>
<div style={{maxHeight:200,overflowY:'auto',marginTop:8,display:'flex',flexDirection:'column',gap:6}}>
{!detectedBook&&filteredBooks.length>0&&(<div style={{background:'#f9f5ff',borderRadius:10,padding:8,border:'1px solid #ddd'}}><div style={{fontSize:11,fontWeight:900}}>Books matching "{bibleQuery}":</div>{filteredBooks.map(b=>(<div key={b.name} onClick={()=>setBibleQuery(b.name+' ')} style={{padding:'8px 10px',borderRadius:8,background:'#fff',border:'1px solid #eee',marginTop:4,fontSize:13,fontWeight:700,cursor:'pointer'}}>{b.name} ({b.chapters} ch)</div>))}</div>)}
{detectedBook&&!parsed.ch&&(<div style={{background:'#f9f5ff',borderRadius:10,padding:8,border:'1px solid #ddd'}}><div style={{fontSize:11,fontWeight:900}}>{detectedBook.name} — Select Chapter:</div><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{Array.from({length:detectedBook.chapters},(_,i)=>i+1).map(ch=>(<button key={ch} onClick={()=>setBibleQuery(`${detectedBook.name} ${ch}`)} style={{padding:'8px 12px',borderRadius:8,border:'1px solid #ddd',background:'#fff',fontWeight:800,fontSize:12}}>{ch}</button>))}</div></div>)}
{detectedBook&&parsed.ch&&!parsed.vs&&(<div style={{background:'#f0fdf4',borderRadius:10,padding:8,border:'1px solid #bbf7d0'}}><div style={{fontSize:11,fontWeight:900}}>{detectedBook.name} {parsed.ch} — Select Verse:</div><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}><button onClick={()=>fetchBible(`${detectedBook.name} ${parsed.ch}`)} style={{padding:'8px 12px',borderRadius:8,border:'none',background:'#16a34a',color:'#fff',fontWeight:800,fontSize:12}}>All Chapter</button>{Array.from({length:30},(_,i)=>i+1).map(v=>(<button key={v} onClick={()=>{const q=`${detectedBook.name} ${parsed.ch}:${v}`;setBibleQuery(q);fetchBible(q)}} style={{padding:'8px 12px',borderRadius:8,border:'1px solid #ddd',background:'#fff',fontWeight:800,fontSize:12}}>{v}</button>))}</div></div>)}
</div>
<div style={{marginTop:8,background:'#f9f5ff',borderRadius:12,padding:12,flex:1,overflowY:'auto',border:'1px solid #ddd'}}>{bibleLoading?<div style={{opacity:.6,fontSize:12}}>Searching...</div>:bibleResult?<div style={{fontSize:14,lineHeight:1.5,fontWeight:600,whiteSpace:'pre-wrap'}}>{bibleResult}</div>:<div style={{opacity:.6,fontSize:12}}>Type 1 Thes → pick book → chapter → verse.</div>}</div>
<button onClick={useBibleVerse} disabled={!bibleResult} style={{marginTop:10,background:bibleResult?'#16a34a':'#ccc',color:'#fff',padding:14,borderRadius:12,fontWeight:900,border:'none'}}>Use This Verse On Screen</button>
</div>
</div>
)}

<div style={{background:'#fff',borderBottom:'2px solid #111',padding:'12px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:100}}>
<img src="/logo.png" alt="TagLive Logo" style={{width:38,height:38,objectFit:'contain',borderRadius:8}} onError={(e:any)=>{e.currentTarget.style.display='none'}} />
<div style={{fontWeight:900,fontSize:20}}>Tag<span style={{color:'#7c3aed'}}>Live</span> - Tag Your Live</div>
{(isLive||ytLive||isRecording)&&<div style={{marginLeft:'auto',color:'#FF0000',fontWeight:900,border:'2px solid red',borderRadius:20,padding:'6px 12px',fontSize:11}}>● LIVE {formatTime(liveSeconds)}</div>}
</div>

{isAdmin&&(<div style={{margin:12,background:'#000',border:'2px solid #00ff00',borderRadius:16,padding:12}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:12,color:'#00ff00'}}>ADMIN DASHBOARD</b><button onClick={()=>setShowAdmin(!showAdmin)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:showAdmin?'#00ff00':'#111',color:showAdmin?'#000':'#00ff00',fontWeight:800,fontSize:11}}>Open</button></div>{showAdmin&&(<div style={{marginTop:10}}><div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:6,textAlign:'center'}}><div style={{background:'#111',borderRadius:10,padding:8}}><div style={{fontSize:10,color:'#fff'}}>LIVE</div><div style={{fontSize:18,fontWeight:900,color:'#00ff00'}}>{stats.live}</div></div><div style={{background:'#111',borderRadius:10,padding:8}}><div style={{fontSize:10,color:'#fff'}}>DAILY</div><div style={{fontSize:18,fontWeight:900,color:'#ffeb00'}}>{stats.daily}</div></div><div style={{background:'#111',borderRadius:10,padding:8}}><div style={{fontSize:10,color:'#fff'}}>WEEKLY</div><div style={{fontSize:18,fontWeight:900,color:'#00d4ff'}}>{stats.weekly}</div></div><div style={{background:'#111',borderRadius:10,padding:8}}><div style={{fontSize:10,color:'#fff'}}>MONTHLY</div><div style={{fontSize:18,fontWeight:900,color:'#ff00ff'}}>{stats.monthly}</div></div><div style={{background:'#111',borderRadius:10,padding:8}}><div style={{fontSize:10,color:'#fff'}}>TOTAL</div><div style={{fontSize:18,fontWeight:900,color:'#fff'}}>{stats.total}</div></div></div></div>)}</div>)}

<style>{`.studio{display:grid;gap:16;padding:16;max-width:1600px;margin:0 auto}@media(max-width:1023px){.studio{grid-template-columns:1fr}}@media(min-width:1024px){.studio{grid-template-columns:380px 460px 380px}}`}</style>

<div className="studio">
<div style={{display:'flex',flexDirection:'column',gap:12}}>
<div style={{border:'2px solid #111',borderRadius:16,padding:12,background:'#ffffff'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:14}}>⚙️ Settings & Studio</b><button onClick={()=>setShowSettings(!showSettings)} style={{padding:'8px 14px',borderRadius:20,border:'none',background:showSettings?'#111':'#eee',color:showSettings?'#fff':'#000',fontWeight:900,fontSize:11}}>{showSettings?'Hide':'Open'}</button></div>
{showSettings&&(
<div style={{marginTop:12,display:'flex',flexDirection:'column',gap:12}}>
<div style={{border:'2px solid #FF0000',borderRadius:12,padding:10,background:lowData?'#fef2f2':'#fff',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><b style={{fontSize:12}}>Data Saver Mode</b><div style={{fontSize:10,opacity:.7}}>{lowData?'480p - Uses less data':'720p - High Quality'}</div></div><button onClick={()=>{const v=!lowData;setLowData(v);localStorage.setItem('taglive_lowdata',v.toString());if(isCam)setTimeout(()=>startCamera(),300)}} style={{padding:'8px 14px',borderRadius:20,border:'none',background:lowData?'#16a34a':'#111',color:'#fff',fontWeight:900,fontSize:11}}>{lowData?'480p ON':'720p'}</button></div>

<div style={{border:'2px solid #7c3aed',borderRadius:16,padding:12,background:'#f9f5ff'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:14}}>Intro / Outro Studio (SAVES)</b><button onClick={()=>setShowStudio(!showStudio)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:'#111',color:'#fff',fontWeight:800,fontSize:11}}>{showStudio?'Hide':'Open'}</button></div>
{showStudio&&(<div style={{marginTop:10}}>
<div style={{display:'flex',gap:6,marginTop:8}}><label style={{flex:1,background:'#7c3aed',color:'#fff',padding:12,borderRadius:10,fontWeight:800,fontSize:12,textAlign:'center',cursor:'pointer'}}>Upload Intro<input ref={introFileRef} type="file" accept="video/*,image/*" onChange={handleIntroFile} style={{display:'none'}}/></label><label style={{flex:1,background:'#111',color:'#fff',padding:12,borderRadius:10,fontWeight:800,fontSize:12,textAlign:'center',cursor:'pointer'}}>Upload Outro<input ref={outroFileRef} type="file" accept="video/*,image/*" onChange={handleOutroFile} style={{display:'none'}}/></label></div>
<div style={{marginTop:12}}>
{intros.length>0&&<div style={{marginBottom:10}}><b style={{fontSize:12}}>Active Intro (SAVED - FULL DURATION):</b><div style={{display:'flex',flexDirection:'column',gap:4,marginTop:6}}>{intros.map((it:any)=><div key={it.id} style={{display:'flex',gap:4}}><button onClick={()=>{setActiveIntroId(it.id);localStorage.setItem('taglive_active_intro',it.id)}} style={{flex:1,padding:8,borderRadius:8,border:'none',background:activeIntroId===it.id?'#16a34a':'#eee',color:activeIntroId===it.id?'#fff':'#000',fontWeight:700,fontSize:11,textAlign:'left'}}>{activeIntroId===it.id?'✓ ':''}{it.title} ({Math.round(it.duration)}s)</button><button onClick={()=>{const n=intros.filter((x:any)=>x.id!==it.id);saveIntros(n); if(activeIntroId===it.id){setActiveIntroId(null);localStorage.removeItem('taglive_active_intro')}}} style={{padding:8,borderRadius:8,border:'none',background:'#ff0000',color:'#fff',fontSize:11}}>X</button></div>)}</div></div>}
{outros.length>0&&<div><b style={{fontSize:12}}>Active Outro (SAVED):</b><div style={{display:'flex',flexDirection:'column',gap:4,marginTop:6}}>{outros.map((ot:any)=><div key={ot.id} style={{display:'flex',gap:4}}><button onClick={()=>{setActiveOutroId(ot.id);localStorage.setItem('taglive_active_outro',ot.id)}} style={{flex:1,padding:8,borderRadius:8,border:'none',background:activeOutroId===ot.id?'#16a34a':'#eee',color:activeOutroId===ot.id?'#fff':'#000',fontWeight:700,fontSize:11,textAlign:'left'}}>{activeOutroId===ot.id?'✓ ':''}{ot.title} ({Math.round(ot.duration)}s)</button><button onClick={()=>{const n=outros.filter((x:any)=>x.id!==ot.id);saveOutros(n); if(activeOutroId===ot.id){setActiveOutroId(null);localStorage.removeItem('taglive_active_outro')}}} style={{padding:8,borderRadius:8,border:'none',background:'#ff0000',color:'#fff',fontSize:11}}>X</button></div>)}</div></div>}
</div>
</div>)}
</div>

<div style={{border:'2px solid #111',borderRadius:16,padding:12,background:'#ffffff',overflow:'hidden'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}><b style={{fontSize:13,color:'#111',flex:1}}>Scrolling Ticker</b><div style={{display:'flex',gap:6,flexShrink:0}}><button onClick={()=>{ const v=!tickerOn; setTickerOn(v); localStorage.setItem('taglive_ticker_on', v.toString()) }} style={{padding:'8px 14px',borderRadius:20,border:'none',background:tickerOn?'#16a34a':'#111',color:'#fff',fontWeight:900,fontSize:11}}>{tickerOn?'ON':'OFF'}</button><button onClick={()=>setShowTickerStudio(!showTickerStudio)} style={{padding:'8px 12px',borderRadius:20,border:'none',background:showTickerStudio?'#111':'#eee',color:showTickerStudio?'#fff':'#000',fontWeight:800,fontSize:11}}>{showTickerStudio?'Hide':'Open'}</button></div></div>
{showTickerStudio&&(<div style={{marginTop:10,display:'flex',flexDirection:'column',gap:8,overflow:'hidden'}}>
<input value={tickerText} onChange={e=>{setTickerText(e.target.value);localStorage.setItem('taglive_ticker_text',e.target.value);tickerOffsetRef.current=720}} placeholder="Type announcement..." style={{width:'100%',padding:10,borderRadius:10,border:'2px solid #111',fontSize:12,fontWeight:700,background:'#000',color:'#FFFF00',boxSizing:'border-box'}}/>
<div style={{display:'flex',gap:6,flexWrap:'wrap',minWidth:0}}>
<div style={{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:6,background:'#f3f0ff',padding:'6px 10px',borderRadius:10}}><span style={{fontSize:10,fontWeight:800,flexShrink:0}}>A-</span><input type="range" min={16} max={60} value={tickerSize} onChange={e=>{ const v=parseInt(e.target.value); setTickerSize(v); localStorage.setItem('taglive_ticker_size', v.toString()) }} style={{flex:1,minWidth:0,width:0}}/><span style={{fontSize:10,fontWeight:800,flexShrink:0}}>A+</span><span style={{fontSize:10,fontWeight:800,background:'#111',color:'#fff',padding:'3px 6px',borderRadius:20,flexShrink:0}}>{tickerSize}</span></div>
<div style={{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:6,background:'#fef3c7',padding:'6px 10px',borderRadius:10}}><span style={{fontSize:10,fontWeight:800,flexShrink:0}}>Speed</span><input type="range" min={1} max={10} value={tickerSpeed} onChange={e=>{ const v=parseInt(e.target.value); setTickerSpeed(v); localStorage.setItem('taglive_ticker_speed', v.toString()) }} style={{flex:1,minWidth:0,width:0}}/><span style={{fontSize:10,fontWeight:800,background:'#111',color:'#fff',padding:'3px 6px',borderRadius:20,flexShrink:0}}>{tickerSpeed}</span></div>
</div>
</div>)}</div>

<div style={{border:'2px solid #7c3aed',borderRadius:16,padding:12,background:'#fff'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:13}}>Church Name + Logo (SAVES)</b><button onClick={()=>setShowChurchName(!showChurchName)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:showChurchName?'#7c3aed':'#111',color:'#fff',fontWeight:800,fontSize:11}}>{showChurchName?'ON':'OFF'}</button></div>
<input value={churchName} onChange={e=>{setChurchName(e.target.value);localStorage.setItem('taglive_church_name',e.target.value)}} placeholder="SALEM GANA JA CITY" style={{width:'100%',marginTop:8,padding:10,borderRadius:10,border:'2px solid #7c3aed',fontSize:12,fontWeight:800,boxSizing:'border-box'}}/>
<div style={{marginTop:10,border:'1px dashed #7c3aed',borderRadius:10,padding:10,background:'#f9f5ff'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:11}}>SAVED LOGO</b>{logoImage&&<button onClick={removeChurchLogo} style={{padding:'4px 8px',borderRadius:6,border:'none',background:'red',color:'#fff',fontWeight:800,fontSize:10}}>Remove</button>}</div>
<div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
{logoImage&&<img src={logoImage} style={{width:50,height:50,objectFit:'contain',borderRadius:8,border:'1px solid #ddd',background:'#fff'}}/>}
<div style={{flex:1}}>
<input ref={churchLogoInputRef} type="file" accept="image/*" onChange={handleChurchLogoPick} style={{width:'100%',fontSize:11}}/>
<div style={{fontSize:9,opacity:0.7,marginTop:2}}>{logoImage?'Logo saved - stays after refresh':'No logo saved'}</div>
</div>
</div>
</div>
</div>

</div>
)}
</div>

<div style={{display:'flex',gap:6,marginTop:12}}><button onClick={()=>setBgMode('face')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='face'?'#111':'#eee',color:bgMode==='face'?'#fff':'#000',fontWeight:800,fontSize:12}}>Face</button><button onClick={()=>setBgMode('black')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='black'?'#111':'#eee',color:bgMode==='black'?'#fff':'#000',fontWeight:800,fontSize:12}}>Black</button><button onClick={()=>setBgMode('image')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='image'?'#111':'#eee',color:bgMode==='image'?'#fff':'#000',fontWeight:800,fontSize:12}}>Image</button><button onClick={()=>setBgMode('split')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='split'?'#7c3aed':'#eee',color:bgMode==='split'?'#fff':'#000',fontWeight:800,fontSize:12}}>Top/Bottom</button></div>

<div style={{display:'flex',alignItems:'center',gap:6,marginTop:10,flexWrap:'wrap',minWidth:0}}><div style={{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:6,background:'#f3f0ff',padding:'6px 10px',borderRadius:10}}><span style={{fontSize:10,fontWeight:800,flexShrink:0}}>A-</span><input type="range" min={18} max={48} value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value))} style={{flex:1,minWidth:0,width:0}}/><span style={{fontSize:10,fontWeight:800,flexShrink:0}}>A+</span><span style={{fontSize:10,fontWeight:800,background:'#111',color:'#fff',padding:'3px 6px',borderRadius:20,flexShrink:0}}>{fontSize}</span></div><button onClick={()=>setAlign(align==='justify'?'center':'justify')} style={{padding:'8px 10px',borderRadius:10,border:'none',background:align==='justify'?'#111':'#ddd',color:align==='justify'?'#fff':'#000',fontWeight:800,fontSize:10,flexShrink:0}}>{align==='justify'?'Justify':'Center'}</button><button onClick={pickMedia} style={{padding:'8px 10px',borderRadius:10,border:'none',background:'#7c3aed',color:'#fff',fontWeight:800,fontSize:10,flexShrink:0}}>Media</button><input ref={fileInputRef} type="file" accept="image/*" onChange={onFilePick} style={{display:'none'}}/></div>

<div style={{display:'flex',gap:6,marginTop:8,alignItems:'center',background:'#fff',border:'1px solid #eee',padding:8,borderRadius:10,flexWrap:'wrap',minWidth:0}}><div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}><span style={{fontSize:10,fontWeight:800}}>Text</span><input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} style={{width:28,height:28,border:'none',borderRadius:6}}/></div><div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}><span style={{fontSize:10,fontWeight:800}}>Box</span><input type="color" value={boxColor} onChange={e=>setBoxColor(e.target.value)} style={{width:28,height:28,border:'none',borderRadius:6}}/></div><div style={{display:'flex',alignItems:'center',gap:4,flex:1,minWidth:0}}><span style={{fontSize:10,fontWeight:800,flexShrink:0}}>Opac</span><input type="range" min={0} max={1} step={0.05} value={boxOpacity} onChange={e=>setBoxOpacity(parseFloat(e.target.value))} style={{flex:1,minWidth:0,width:0}}/></div>
<button onClick={()=>{ const v=!showLogo; setShowLogo(v); localStorage.setItem('taglive_show_logo', v.toString()); if(v){ setLogoPos((p:any)=>({...p, x:80, y:80})) } }} style={{padding:'6px 10px',borderRadius:8,border:'none',background:showLogo?'#16a34a':'#111',color:'#fff',fontWeight:800,fontSize:10,flexShrink:0}}>{showLogo?'Logo':'No Logo'}</button>
<input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoPick} style={{display:'none'}}/>
<button onClick={()=>{ const v=!showText; setShowText(v); if(v){ setPos((p:any)=>({...p, x:240, y:680})) } }} style={{padding:'6px 10px',borderRadius:8,border:'none',background:showText?'#111':'#ddd',color:showText?'#fff':'#000',fontWeight:800,fontSize:10,flexShrink:0}}>{showText?'Text':'No Text'}</button>
</div>
</div>

<div>
<div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{background:'#000',borderRadius:18,overflow:'hidden',position:'relative',aspectRatio:'9/16',touchAction: editStateRef.current.locked ? 'none' : 'pan-y'}}><video ref={videoRef} muted playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover',display:isCam&&bgMode==='face'?'block':'none'}}/>{!isCam&&<div style={{color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',height:420}}>Camera off - {lowData?'480p ON':'720p'}</div>}<canvas ref={canvasRef} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}/>
<video ref={broadcastVideoRef} muted playsInline crossOrigin="anonymous" style={{position:'absolute',left:'-9999px',top:'-9999px',width:'10px',height:'10px',opacity:0.01}}/>
{broadcastPlaying&&(
  <div style={{position:'absolute',top:12,left:12,right:12,display:'flex',justifyContent:'flex-end',zIndex:100}}>
    <button onClick={stopIntroOnly} style={{background:'#ff0000',color:'#fff',border:'2px solid #fff',padding:'10px 16px',borderRadius:20,fontWeight:900,fontSize:12}}>✕</button>
  </div>
)}
{isCam&&!broadcastPlaying&&(<div style={{position:'absolute',top: bgMode==='split'?'auto':'12px',bottom: bgMode==='split'?'50px':'auto',right:12,display:'flex',gap:8,zIndex:50}}><button onClick={toggleCamera} style={{background:'rgba(0,0,0,0.85)',color:'#fff',border:'2px solid #fff',borderRadius:20,padding:'10px 14px',fontWeight:900,fontSize:12}}>Flip</button><button onClick={toggleTorch} style={{background:torch?'#fbbf24':'rgba(0,0,0,0.85)',color:torch?'#000':'#fff',border:'2px solid #fff',borderRadius:20,padding:'10px 14px',fontWeight:900,fontSize:12}}>{torch?'Flash On':'Flash'}</button></div>)}
</div>
<div style={{display:'flex',gap:8,marginTop:12}}>{!isCam?<button onClick={()=>startCamera()} style={{flex:1,background:'#111',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Start Camera {lowData?'(480p)':''}</button>:<><button onClick={toggleCamera} style={{flex:1,background:'#7c3aed',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Switch Camera</button><button onClick={stopCamera} style={{flex:1,background:'#444',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Stop</button></>}</div>
<div style={{display:'flex',gap:6,marginTop:10}}>
{!isRecording?<button onClick={startRecording} disabled={!isCam} style={{flex:1,background:isCam?'#a21caf':'#ccc',color:'#fff',padding:12,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Record MP4 + Intro FULL</button>
:<><button onClick={stopRecording} style={{flex:1,background:'#111',color:'#fff',padding:12,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Stop + Outro ({formatTime(liveSeconds)})</button>{broadcastPlaying&&<button onClick={stopIntroOnly} style={{background:'#ff0000',color:'#fff',padding:12,borderRadius:10,fontWeight:900,border:'none',fontSize:11}}>STOP INTRO</button>}</>}
{recordedUrl&&<a href={recordedUrl} download={`TagLive-${Date.now()}.webm`} style={{flex:1,background:'#16a34a',color:'#fff',padding:12,borderRadius:10,fontWeight:800,textAlign:'center',textDecoration:'none',fontSize:12}}>Download MP4</a>}
</div>
{recordedUrl&&<video src={recordedUrl} controls playsInline style={{width:'100%',marginTop:8,borderRadius:12}}/>}
<div style={{display:'flex',gap:6,marginTop:10}}><button onClick={openBibleApp} style={{flex:1,background:'#2563eb',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Open Bible</button><button onClick={pasteClipboard} style={{flex:1,background:'#059669',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Paste</button><button onClick={saveVerse} style={{flex:1,background:'#f59e0b',color:'#000',padding:10,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Save</button></div>
<textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%',height:90,marginTop:10,padding:12,borderRadius:12,border:'1px solid #ddd'}} placeholder={"Ministering:\nNAME OF PRESENTER"}/>
{saved.length>0&&<div style={{marginTop:8,border:'1px solid #eee',borderRadius:12,padding:8,background:'#fff'}}>
<details open>
<summary style={{fontSize:12,fontWeight:900,cursor:'pointer',padding:4}}>📁 Saved Folder ({saved.length})</summary>
<div style={{marginTop:8,display:'flex',flexDirection:'column',gap:6}}>
{saved.map((s,i)=><div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#f3f0ff',border:'1px solid #e5e7eb',padding:'8px 10px',borderRadius:20}}><span onClick={()=>setVerse(s)} style={{fontSize:11,flex:1,cursor:'pointer',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:600}}>{s.substring(0,40)}...</span><button onClick={()=>deleteSaved(i)} style={{marginLeft:8,background:'#ff0000',color:'#fff',border:'none',borderRadius:50,width:22,height:22,fontWeight:900,fontSize:12,lineHeight:'22px'}}>×</button></div>)}
</div>
</details>
</div>}
</div>

<div style={{display:'flex',flexDirection:'column',gap:12}}>
<div style={{border:'2px solid #111',borderRadius:14,padding:12}}><b>Connect Facebook</b><div style={{display:'flex',gap:8,marginTop:8}}><button onClick={loginFacebook} style={{flex:1,background:fbUser?'#16a34a':'#1877F2',color:'#fff',padding:12,borderRadius:8,fontWeight:800,border:'none'}}>{fbUser?`✓ ${fbUser.name}`:'Login Facebook'}</button><button onClick={()=>loadPages()} style={{flex:1,border:'1px solid #000',padding:12,borderRadius:8,fontWeight:800,background:'#fff'}}>Load My Pages</button></div>{pages.map((p:any)=><div key={p.id} onClick={()=>createFbLiveAuto(p)} style={{marginTop:6,padding:10,background:selectedPage?.id===p.id?'#7c3aed':'#f3f0ff',color:selectedPage?.id===p.id?'#fff':'#000',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>{p.name} {selectedPage?.id===p.id?`LIVE ${formatTime(liveSeconds)}`:'(Go Live)'}</div>)} {fbStreamUrl&&<div style={{marginTop:10,padding:10,background:'#dcfce7',borderRadius:8,fontSize:11,wordBreak:'break-all'}}>FB: {fbStreamUrl.substring(0,70)}...</div>}</div>
<div style={{marginTop:14,border:'2px solid #ff0000',borderRadius:14,padding:12}}><b>Connect YouTube Live</b><input value={ytKey} onChange={e=>{setYtKey(e.target.value);localStorage.setItem('taglive_ytkey',e.target.value)}} placeholder="Paste YouTube Stream Key here" style={{width:'100%',marginTop:8,padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:12}}/><div style={{display:'flex',gap:8,marginTop:8}}><button onClick={()=>{if(!ytKey)return alert('Paste YouTube key first'); const active=intros.find(i=>i.id===activeIntroId); if(active){setBroadcastPlaying(active); if(active.type==='image'){const img=new Image();img.src=active.data;img.onload=()=>{broadcastImageRef.current=img}} if(active.type==='video'&&broadcastVideoRef.current){broadcastVideoRef.current.src=active.data;broadcastVideoRef.current.muted=false;broadcastVideoRef.current.volume=1;broadcastVideoRef.current.play().catch(()=>{})} introTimeoutRef.current=setTimeout(()=>{setBroadcastPlaying(null);broadcastImageRef.current=null;setYtLive(true);setIsLive(true);startTimer()},(active.duration||5)*1000)} else {setYtLive(true);setIsLive(true);startTimer()}}} style={{flex:1,background:ytLive?'#16a34a':'#ff0000',color:'#fff',padding:12,borderRadius:8,fontWeight:800,border:'none'}}>{ytLive?`YouTube LIVE ${formatTime(liveSeconds)}`:'Go Live YouTube + Intro FULL'}</button><button onClick={()=>{const active=outros.find(o=>o.id===activeOutroId); if(active){setBroadcastPlaying(active); if(active.type==='video'&&broadcastVideoRef.current){broadcastVideoRef.current.src=active.data;broadcastVideoRef.current.muted=false;broadcastVideoRef.current.play()} setTimeout(()=>{setBroadcastPlaying(null);setYtLive(false);if(!fbStreamUrl)setIsLive(false);stopTimer()},(active.duration||5)*1000)} else {setYtLive(false);if(!fbStreamUrl)setIsLive(false);stopTimer()}}} style={{flex:1,border:'1px solid #000',padding:12,borderRadius:8,fontWeight:800,background:'#fff'}}>Stop YT + Outro</button></div></div>
</div>

</div>
</div>
)
}
