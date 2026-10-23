"use client"
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://gqifluvkrjzsebfdjcio.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiO[...]
declare global { interface Window { FB: any } }
const OFFLINE_KJV: Record<string,string> = {"john 3:16":"John 3:16 - For God so loved the world...","romans 1:20":"Romans 1:20 - For the invisible things...","romans 8:28":"Romans 8:28 - And we know t[...]
const BIBLE_VERSIONS = [{ id: 'kjv', label: 'KJV' },{ id: 'akjv', label: 'NKJV-like' },{ id: 'web', label: 'NIV-like' },{ id: 'bbe', label: 'GNB-like' },{ id: 'asv', label: 'RSV-like' },{ id: 'lsv', l[...]
const BIBLE_BOOKS = [{ name: "Genesis", chapters: 50 },{ name: "Exodus", chapters: 40 },{ name: "Leviticus", chapters: 27 },{ name: "Numbers", chapters: 36 },{ name: "Deuteronomy", chapters: 34 },{ na[...]
const SS_HYMNS = [{no:1,title:"There Shall Be Showers Of Blessing",lyrics:"There shall be showers of blessing:\nThis is the promise of love;"},{no:2,title:"What A Friend We Have In Jesus",lyrics:"What[...]
const BUILD_348 = ()=>{ let list=[...SS_HYMNS]; for(let i=1;i<=348;i++){ if(!list.find(h=>h.no===i)){ list.push({no:i,title:`SS&S ${i}`,lyrics:`SS&S ${i}`}); } } return list.sort((a,b)=>a.no-b.no); };
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
const [pos,setPos]=useState({ x: 360, y: 1100, scale: 1, rotation: 0 })
const [bgMode,setBgMode]=useState<'face'|'black'|'image'|'split'>('face')
const [saved,setSaved]=useState<string[]>([])
const [dragging,setDragging]=useState(false)
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
const [bibleMode,setBibleMode]=useState<'bible'|'hymn'>('bible')
const [hymnQuery,setHymnQuery]=useState('')
const [hymnResult,setHymnResult]=useState('')
const [hymnLoading,setHymnLoading]=useState(false)
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
const audioCtxRef=useRef<AudioContext|null>(null)
const formatTime=(sec:number)=>{ const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60; return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` }
const startTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); setLiveSeconds(0); timerRef.current=setInterval(()=>setLiveSeconds(p=>p+1),1000) }
const stopTimer=()=>{ if(timerRef.current) clearInterval(timerRef.current); timerRef.current=null; setLiveSeconds(0) }
useEffect(()=>{
const fbAppId='1951327349161990'
if(!document.getElementById('fb-sdk')){
const s=document.createElement('script'); s.id='fb-sdk'; s.src='https://connect.facebook.net/en_US/sdk.js';
s.onload=()=>{ window.FB.init({appId: fbAppId, cookie:true, xfbml:false, version:'v19.0'}) }
document.body.appendChild(s)
}
try{
const sv=localStorage.getItem('taglive_saved'); if(sv) setSaved(JSON.parse(sv))
const yk=localStorage.getItem('taglive_ytkey'); if(yk) setYtKey(yk)
const si=localStorage.getItem('taglive_intros'); if(si) setIntros(JSON.parse(si).filter((x:any)=>x.type!=='animated'))
const so=localStorage.getItem('taglive_outros'); if(so) setOutros(JSON.parse(so).filter((x:any)=>x.type!=='animated'))
const ai=localStorage.getItem('taglive_active_intro'); if(ai) setActiveIntroId(ai)
const ao=localStorage.getItem('taglive_active_outro'); if(ao) setActiveOutroId(ao)
const tk=localStorage.getItem('taglive_ticker_text'); if(tk) setTickerText(tk)
const ts=localStorage.getItem('taglive_ticker_size'); if(ts) setTickerSize(parseInt(ts))
const tsp=localStorage.getItem('taglive_ticker_speed'); if(tsp) setTickerSpeed(parseInt(tsp))
const ton=localStorage.getItem('taglive_ticker_on'); if(ton) setTickerOn(ton==='true')
const cn=localStorage.getItem('taglive_church_name'); if(cn) setChurchName(cn)
const cl=localStorage.getItem('taglive_church_logo'); if(cl){ setLogoImage(cl); const img=new Image(); img.src=cl; img.onload=()=>{ logoImageRef.current=img } }
const ld=localStorage.getItem('taglive_lowdata'); if(ld) setLowData(ld==='true')
const params=new URLSearchParams(window.location.search)
if(params.get('admin')==='taglive2026'){ localStorage.setItem('taglive_admin','true'); setIsAdmin(true) }
else if(localStorage.getItem('taglive_admin')==='true'){ setIsAdmin(true) }
}catch{}
const handleVis=async()=>{ if(!document.hidden){ try{ const t=await navigator.clipboard.readText(); if(t && t.length>5 && t.length<500 && t!==verse) setVerse(t) }catch{} } }
document.addEventListener('visibilitychange', handleVis)
return()=>{ document.removeEventListener('visibilitychange', handleVis); if(timerRef.current) clearInterval(timerRef.current) }
},[])
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
const saveIntros=(arr:any[])=>{ const filtered=arr.filter((x:any)=>x.type!=='animated'); setIntros(filtered); localStorage.setItem('taglive_intros', JSON.stringify(filtered)) }
const saveOutros=(arr:any[])=>{ const filtered=arr.filter((x:any)=>x.type!=='animated'); setOutros(filtered); localStorage.setItem('taglive_outros', JSON.stringify(filtered)) }
const fileToBase64=(file:File)=>new Promise<string>((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file) })
const getVideoDuration=(base64:string)=>new Promise<number>((res)=>{ const v=document.createElement('video'); v.src=base64; v.onloadedmetadata=()=>res(v.duration); setTimeout(()=>res(10),2000) })
const handleIntroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return
const base64=await fileToBase64(file)
let dur=5
if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name }
const n=[...intros,item]; saveIntros(n); setActiveIntroId(item.id); localStorage.setItem('taglive_active_intro', item.id); e.target.value=''; alert(`Intro Saved! ${Math.round(dur)}s - stays after refresh`)
}
const handleOutroFile=async(e:any)=>{
const file=e.target.files?.[0]; if(!file) return
const base64=await fileToBase64(file)
let dur=5
if(file.type.startsWith('video')){ dur=await getVideoDuration(base64) }
const item={ id:`id_${Date.now()}`, type:file.type.startsWith('video')?'video':'image', data:base64, duration:dur, title:file.name }
const n=[...outros,item]; saveOutros(n); setActiveOutroId(item.id); localStorage.setItem('taglive_active_outro', item.id); e.target.value=''; alert(`Outro Saved! ${Math.round(dur)}s - stays after refresh`)
}
const startCamera=async(newFacing=facing)=>{
try{
if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
await new Promise(r=>setTimeout(r,300))
const w=lowData?640:1280
const h=lowData?480:720
const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing,width:{ideal:w},height:{ideal:h}},audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})
streamRef.current=s; trackRef.current=s.getVideoTracks()[0]
if(videoRef.current){ videoRef.current.srcObject=s; await videoRef.current.play() }
setFacing(newFacing); setIsCam(true)
}catch(e:any){ alert('Camera: '+e.message) }
}
const stopCamera=()=>{
if(isRecording) stopRecording();
streamRef.current?.getTracks().forEach(t=>t.stop());
if(videoRef.current) videoRef.current.srcObject=null;
setIsCam(false); setIsLive(false); setTorch(false); setYtLive(false); stopTimer()
}
const toggleCamera=async()=>{ await startCamera(facing==='user'?'environment':'user') }
const toggleTorch=async()=>{ try{ const track:any=trackRef.current; if(!track?.getCapabilities?.()?.torch) return alert('Torch not supported'); await track.applyConstraints({advanced:[{torch:!torch}]}) }catch{} }
const loginFacebook=()=>{
if(!window.FB){ alert('Wait 3 sec...'); return }
window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); loadPages(resp.authResponse.accessToken) }) } },{scope:'public_profile,pages_show_list,pages_manage_posts,pages_read_engagement,pages_manage_metadata,pages_read_user_content'} )
}
const loadPages=(tok?:string)=>{ const t=tok||window.FB?.getAuthResponse()?.accessToken; if(!t) return alert('Login first'); window.FB.api('/me/accounts', {access_token:t}, (res:any)=>{ if(res.data?.length){ setPages(res.data); setSelectedPage(res.data[0]) } else { alert('No pages found') } }) }
const createFbLiveAuto=async(page:any)=>{
const active=intros.find(i=>i.id===activeIntroId)
if(active){
setBroadcastPlaying(active)
if(active.type==='image'){ const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img } }
if(active.type==='video'&&broadcastVideoRef.current){ broadcastVideoRef.current.src=active.data; broadcastVideoRef.current.muted=false; broadcastVideoRef.current.volume=1; broadcastVideoRef.current.crossOrigin="anonymous"; try{ await broadcastVideoRef.current.play() }catch{} }
setTimeout(async()=>{
setBroadcastPlaying(null); broadcastImageRef.current=null;
setSelectedPage(page)
try{
const res=await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token:window.FB.getAuthResponse().accessToken, status:'LIVE_NOW', title:'TagLive Service', description:'TagLive stream' }).toString() })
const data=await res.json(); if(data.error) throw new Error(JSON.stringify(data.error)); setFbStreamUrl(data.stream_url); setLiveId(data.id); setIsLive(true); startTimer()
}catch(e:any){ setIsLive(true); startTimer() }
}, (active.duration||5)*1000)
} else {
setSelectedPage(page)
try{
const res=await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token:window.FB.getAuthResponse().accessToken, status:'LIVE_NOW', title:'TagLive Service', description:'TagLive stream' }).toString() })
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
const getFilteredBooks=(q:string)=>{ if(!q||q.length<1) return []; const lower=q.toLowerCase(); return BIBLE_BOOKS.filter(b=>b.name.toLowerCase().includes(lower)||lower.includes(b.name.toLowerCase().slice(0,3))) }
const detectBookFromQuery=(q:string)=>{ const lower=q.toLowerCase(); return BIBLE_BOOKS.find(b=>lower.startsWith(b.name.toLowerCase()))||BIBLE_BOOKS.find(b=>lower.includes(b.name.toLowerCase())) }
const parseChapterVerse=(q:string,bookName:string)=>{ const rest=q.substring(bookName.length).trim(); const match=rest.match(/(\d+)(?:[:\s]+(\d+))?/); if(!match) return { ch: null, vs: null }; return { ch: parseInt(match[1]), vs: match[2]?parseInt(match[2]):null } }
const filteredBooks=getFilteredBooks(bibleQuery)
const detectedBook=detectBookFromQuery(bibleQuery)
const parsed=detectedBook?parseChapterVerse(bibleQuery,detectedBook.name):{ ch: null, vs: null }
const getFilteredHymns=(q:string)=>{ if(!q) return BUILD_348().slice(0,6); const lower=q.toLowerCase(); const num=parseInt(q); if(!isNaN(num)){ const byNo=BUILD_348().filter(h=>h.no===num); if(byNo.length) return byNo; } return BUILD_348().filter(h=>h.title.toLowerCase().includes(lower)||h.lyrics.toLowerCase().includes(lower)).slice(0,8) }
const filteredHymns=getFilteredHymns(hymnQuery)
const fetchHymnOnline = async (no: number) => {
  setHymnLoading(true)
  try{ const cache=JSON.parse(localStorage.getItem('taglive_hymn_cache')||'{}'); if(cache[no]){ setHymnResult(cache[no]+' [CACHED]'); setHymnLoading(false); return } }catch{}
  const realLocal = SS_HYMNS.find(h=>h.no===no)
  if(realLocal){
    const full=`${realLocal.no}. ${realLocal.title}\n\n${realLocal.lyrics}`
    setHymnResult(full)
    try{ const cache=JSON.parse(localStorage.getItem('taglive_hymn_cache')||'{}'); cache[no]=full; localStorage.setItem('taglive_hymn_cache', JSON.stringify(cache)) }catch{}
    setHymnLoading(false)
    try{ const res=await fetch(`/api/sss?no=${no}`); const d=await res.json(); if(d && d.lyrics && d.lyrics.length>20 && !d.lyrics.includes(`SS&S ${no} - (Tap`)){ const full2=`${d.no}. ${d.title}\n\n${d.lyrics}`; setHymnResult(full2); try{ const cache=JSON.parse(localStorage.getItem('taglive_hymn_cache')||'{}'); cache[no]=full2; localStorage.setItem('taglive_hymn_cache', JSON.stringify(cache)) }catch{} } }catch{}
    return
  }
  try { const res = await fetch(`/api/sss?no=${no}`); const d = await res.json(); if (d && d.lyrics && d.lyrics.length>10) { const full=`${d.no}. ${d.title}\n\n${d.lyrics}`; setHymnResult(full); try{ const cache=JSON.parse(localStorage.getItem('taglive_hymn_cache')||'{}'); cache[no]=full; localStorage.setItem('taglive_hymn_cache', JSON.stringify(cache)) }catch{} } } catch {}
  const fallback = BUILD_348().find(h=>h.no===no)
  if(fallback){ setHymnResult(`${fallback.no}. ${fallback.title}\n\n${fallback.lyrics}`) } else { setHymnResult(`${no}. SS&S ${no}\n\nHymn not found.`) }
  setHymnLoading(false)
}
const pasteClipboard=async()=>{ try{ const t=await navigator.clipboard.readText(); if(t) setVerse(t); else alert('Clipboard empty') }catch{ alert('Allow clipboard') } }
const saveVerse=()=>{ if(!verse.trim()) return; const ns=[verse,...saved.filter(s=>s!==verse)].slice(0,20); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)); alert('Saved!') }
const deleteSaved=(idx:number)=>{ const ns=saved.filter((_,i)=>i!==idx); setSaved(ns); localStorage.setItem('taglive_saved', JSON.stringify(ns)); }
const pickMedia=()=>fileInputRef.current?.click()
const pickLogo=()=>logoInputRef.current?.click()
const onFilePick=(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setBgImage(url); setBgMode('image'); const img=new Image(); img.src=url; img.onload=()=>{ bgImageRef.current=img } }
const onLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img } }
const handleChurchLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img } }
const removeChurchLogo=()=>{ localStorage.removeItem('taglive_church_logo'); setLogoImage(null); logoImageRef.current=null; if(churchLogoInputRef.current) churchLogoInputRef.current.value=''; if(logoInputRef.current) logoInputRef.current.value=''; }
  // FIXED: SMOOTH RECORDING + SOUND - NO SKIPPING - AUDIO MIXING + BADGE NAME
const startRecording=async()=>{
  const canvas=canvasRef.current; if(!canvas) return alert('Start camera first')
  if(canvas.width!==720 || canvas.height!==1280){ canvas.width=720; canvas.height=1280 }
  const canvasStream=(canvas as any).captureStream(30) as MediaStream
  try{
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext
    if (AudioCtor) {
      const ctx = new AudioCtor()
      audioCtxRef.current = ctx
      const dest = ctx.createMediaStreamDestination()
      const micTracks = streamRef.current?.getAudioTracks()||[]
      micTracks.forEach(track => {
        try{ const src = ctx.createMediaStreamSource(new MediaStream([track])); src.connect(dest) }catch{}
      })
      if(broadcastVideoRef.current && (broadcastVideoRef.current as any).captureStream){
        try{
          const vStream = (broadcastVideoRef.current as any).captureStream()
          vStream.getAudioTracks().forEach((at:MediaStreamTrack)=>{
            try{ const vsrc = ctx.createMediaStreamSource(new MediaStream([at])); vsrc.connect(dest) }catch{}
          })
        }catch{}
      }
      dest.stream.getAudioTracks().forEach(at=>canvasStream.addTrack(at))
    } else {
      const micTracks=streamRef.current?.getAudioTracks()||[]
      micTracks.forEach(t=> canvasStream.addTrack(t))
    }
  }catch{
    const micTracks=streamRef.current?.getAudioTracks()||[]
    micTracks.forEach(t=> canvasStream.addTrack(t))
  }
  const active=intros.find(i=>i.id===activeIntroId)
  if(active){
    setBroadcastPlaying(active)
    if(active.type==='image'){ const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img } }
    else if(active.type==='video'&&broadcastVideoRef.current){
      broadcastVideoRef.current.src=active.data; broadcastVideoRef.current.muted=false; broadcastVideoRef.current.volume=1; broadcastVideoRef.current.crossOrigin="anonymous"
      try{ await broadcastVideoRef.current.play(); }catch{}
    }
    const introMs=(active.duration||5)*1000
    setTimeout(()=>{ setBroadcastPlaying(null); broadcastImageRef.current=null }, introMs)
  }
  chunksRef.current=[]
  let mime='video/mp4'
  if(!MediaRecorder.isTypeSupported('video/mp4')){ if(MediaRecorder.isTypeSupported('video/webm;codecs=h264')) mime='video/webm;codecs=h264'; else if(MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) mime='video/webm;codecs=vp9'; else mime='video/webm' }
  const rec=new MediaRecorder(canvasStream, { mimeType: mime, videoBitsPerSecond: 2500000 })
  rec.ondataavailable=(e)=>{ if(e.data.size>0) chunksRef.current.push(e.data) }
  rec.onstop=()=>{ const blob=new Blob(chunksRef.current, { type: 'video/mp4' }); const url=URL.createObjectURL(blob); setRecordedUrl(url) }
  rec.start(100); recorderRef.current=rec; setIsRecording(true); startTimer()
}
const stopRecordingFinal=()=>{
  recorderRef.current?.stop(); setIsRecording(false); setBroadcastPlaying(null); broadcastImageRef.current=null; 
  if(broadcastVideoRef.current){ try{ broadcastVideoRef.current.pause(); broadcastVideoRef.current.src='' }catch{} }
  try{ if(audioCtxRef.current){ audioCtxRef.current.close(); audioCtxRef.current=null } }catch{}
  if(!isLive&&!ytLive) stopTimer()
}
const stopRecording=async()=>{
  const active=outros.find(o=>o.id===activeOutroId)
  if(active && isRecording){
    setBroadcastPlaying(active)
    if(active.type==='image'){ const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img }; setTimeout(()=>{ stopRecordingFinal() }, (active.duration||5)*1000) }
    else if(active.type==='video'&&broadcastVideoRef.current){
      broadcastVideoRef.current.src=active.data; broadcastVideoRef.current.muted=false; broadcastVideoRef.current.volume=1; broadcastVideoRef.current.crossOrigin="anonymous"
      try{ await broadcastVideoRef.current.play() }catch{}
      broadcastVideoRef.current.onended=()=>{ stopRecordingFinal() }
      setTimeout(()=>{ stopRecordingFinal() }, (active.duration||7)*1000)
    } else { setTimeout(()=>{ stopRecordingFinal() }, (active.duration||5)*1000) }
  } else { stopRecordingFinal() }
}
const onTouchStart=(e:any)=>{
const rect=canvasRef.current?.getBoundingClientRect(); if(!rect) return
const tx=(e.touches[0].clientX-rect.left)*(720/rect.width)
const ty=(e.touches[0].clientY-rect.top)*(1280/rect.height)
const distText=Math.hypot(tx-pos.x,ty-pos.y)
const distLogo=Math.hypot(tx-logoPos.x,ty-logoPos.y)
if(logoImage&&distLogo<180&&distLogo<distText){ setSelected('logo'); lastTouch.current.selScale=logoPos.scale; lastTouch.current.selRot=logoPos.rotation }
else { setSelected('text'); lastTouch.current.selScale=pos.scale; lastTouch.current.selRot=pos.rotation }
if(e.touches.length===1){ setDragging(true); lastTouch.current.x=e.touches[0].clientX; lastTouch.current.y=e.touches[0].clientY }
else if(e.touches.length===2){ const dx=e.touches[1].clientX-e.touches[0].clientX; const dy=e.touches[1].clientY-e.touches[0].clientY; lastTouch.current.dist=Math.hypot(dx,dy); lastTouch.current.angle=Math.atan2(dy,dx)*180/Math.PI; lastTouch.current.rot=lastTouch.current.angle; }
}
const onTouchMove=(e:any)=>{
const rect=canvasRef.current?.getBoundingClientRect(); if(!rect) return
if(e.touches.length===1&&dragging){ const tx=e.touches[0].clientX-rect.left; const ty=e.touches[0].clientY-rect.top; const nx=tx*(720/rect.width); const ny=ty*(1280/rect.height); if(selected==='logo'){ setLogoPos(p=>({...p,x:Math.min(720,Math.max(0,nx)),y:Math.min(1280,Math.max(0,ny))})) } else { setPos(p=>({...p,x:Math.min(720,Math.max(0,nx)),y:Math.min(1280,Math.max(0,ny))})) } }
if(e.touches.length===2){ const dx=e.touches[1].clientX-e.touches[0].clientX; const dy=e.touches[1].clientY-e.touches[0].clientY; const dist=Math.hypot(dx,dy); const angle=Math.atan2(dy,dx)*180/Math.PI; const scale=lastTouch.current.dist ? dist/lastTouch.current.dist : 1; const rot=angle-lastTouch.current.angle; if(selected==='logo'){ setLogoPos(p=>({ ...p, scale: Math.max(0.2, Math.min(2.2, lastTouch.current.selScale*scale)), rotation: lastTouch.current.selRot + rot })) } else { setPos(p=>({ ...p, scale: Math.max(0.5, Math.min(2.4, lastTouch.current.selScale*scale)), rotation: lastTouch.current.selRot + rot })) } }
}
const onTouchEnd=()=>{ setDragging(false); lastTouch.current.dist=0 }
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
if(c.width!==720 || c.height!==1280){ c.width=720; c.height=1280 }
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
return
}
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
if(logoImageRef.current){ ctx.save(); ctx.translate(logoPos.x,logoPos.y); ctx.rotate(logoPos.rotation*Math.PI/180); ctx.scale(logoPos.scale,logoPos.scale); const iw=logoImageRef.current.width, ih=logoImageRef.current.height; const ratio=Math.min(220/iw,220/ih); const dw=iw*ratio, dh=ih*ratio; ctx.drawImage(logoImageRef.current,-dw/2,-dh/2,dw,dh); ctx.restore() }
if(showText){
ctx.save();
const isSplit=bgMode==='split'
const drawX=isSplit?c.width*0.5:pos.x
const drawY=isSplit?c.height*0.24:pos.y
const maxW=isSplit?600:560
ctx.translate(drawX,drawY); ctx.rotate(pos.rotation*Math.PI/180); ctx.scale(pos.scale,pos.scale); ctx.font=`bold ${fontSize}px sans-serif`; const pad=24; const boxW=maxW+pad*2; const paragraphs=verse.split('\n'); let lineHeight=fontSize*1.3; let y=0; const lines: string[] = [];
paragraphs.forEach(par => {
  const words=par.split(' '); let current='';
  words.forEach((word:string)=>{
   const test=current ? `${current} ${word}` : word;
   if(ctx.measureText(test).width > maxW && current){ lines.push(current); current = word } else { current = test }
  });
  if(current) lines.push(current);
});
const totalH = lines.length*lineHeight
const boxH = totalH + pad*2
ctx.fillStyle = hexToRgba(boxColor, boxOpacity)
ctx.fillRect(-boxW/2,-boxH/2,boxW,boxH)
ctx.fillStyle=textColor; ctx.textAlign='center'; ctx.textBaseline='middle';
lines.forEach((line, index) => {
 const yy = -boxH/2 + pad + (index + 0.5) * lineHeight
 ctx.fillText(line, 0, yy)
})
if(isSplit&&showChurchName&&churchName){
ctx.fillStyle='#FFD700'; ctx.font=`900 ${Math.max(14,Math.floor(fontSize*0.52))}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'
const churchY=y+22; const tW=ctx.measureText(churchName.toUpperCase()).width+28
ctx.fillStyle='rgba(124,58,237,0.95)'; const pillH=28; ctx.fillRect(-tW/2,churchY-pillH/2,tW,pillH)
ctx.fillStyle='#FFD700'; ctx.fillText(churchName.toUpperCase(),0,churchY)
}
if(selected==='text'&&!isSplit){ ctx.strokeStyle='#7c3aed'; ctx.lineWidth=3; ctx.setLineDash([12,8]); ctx.strokeRect(-boxW/2-4,-boxH/2-4,boxW+8,boxH+8); ctx.setLineDash([]) } ctx.restore() }
if(isLive||ytLive||isRecording){
const timeStr=formatTime(liveSeconds)
ctx.save(); ctx.fillStyle='#FF0000'; ctx.font='900 28px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=6; ctx.fillText(`● LIVE ${timeStr}`, 18, 18); ctx.restore();
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
a=requestAnimationFrame(draw)
}
draw()
return()=>cancelAnimationFrame(a)
},[isCam,verse,isLive,pos,bgMode,fontSize,align,bgImage,ytLive,textColor,boxColor,boxOpacity,logoImage,logoPos,isRecording,selected,showText,tickerOn,tickerText,tickerSize,tickerSpeed,churchName,showChurchName,lowData,selectedPage,broadcastPlaying])
return (
<div style={{padding:16,maxWidth:480,margin:'0 auto'}}>
{showBible&&(
<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9998,background:'rgba(0,0,0,0.92)',padding:12,display:'flex',flexDirection:'column'}}>
<div style={{background:'#fff',borderRadius:16,padding:12,flex:1,display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto',width:'100%',overflow:'hidden'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:13}}>📖 Bible & Hymn {isCam&&<span style={{color:'#FF0000'}}>● LIVE {formatTime(liveSeconds)}</span>}</b><button onClick={()=>setShowBible(false)} style={{padding:'6px 10px',borderRadius:20,border:'none',background:'#111',color:'#fff',fontWeight:900}}>Close</button></div>
<div style={{display:'flex',gap:6,marginTop:10}}><button onClick={()=>setBibleMode('bible')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bibleMode==='bible'?'#111':'#eee',color:bibleMode==='bible'?'#fff':'#111',fontWeight:900}}>Bible</button><button onClick={()=>setBibleMode('hymn')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bibleMode==='hymn'?'#7c3aed':'#eee',color:bibleMode==='hymn'?'#fff':'#111',fontWeight:900}}>Hymn</button></div>
{bibleMode==='bible'?(
<>
<div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>{BIBLE_VERSIONS.map(v=>(<button key={v.id} onClick={()=>setBibleVer(v.id)} style={{padding:'6px 10px',borderRadius:20,border:'none',background:bibleVer===v.id?'#111':'#eee',color:bibleVer===v.id?'#fff':'#111',fontWeight:900}}>{v.label}</button>))}</div>
<div style={{display:'flex',gap:6,marginTop:10}}><input value={bibleQuery} onChange={e=>setBibleQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')fetchBible()}} placeholder="Type 1 Thes, John, Romans 1:20" style={{flex:1,padding:10,borderRadius:10,border:'1px solid #ddd',fontSize:12}}/></div>
<div style={{maxHeight:200,overflowY:'auto',marginTop:8,display:'flex',flexDirection:'column',gap:6}}>
{!detectedBook&&filteredBooks.length>0&&(<div style={{background:'#f9f5ff',borderRadius:10,padding:8,border:'1px solid #ddd'}}><div style={{fontSize:11,fontWeight:900}}>Books matching "{bibleQuery}":</div>{filteredBooks.slice(0,10).map(b=><button key={b.name} onClick={()=>setBibleQuery(b.name)} style={{display:'block',width:'100%',textAlign:'left',padding:'6px 8px',marginTop:4,border:'none',background:'#fff',borderRadius:8,fontSize:12}}>{b.name}</button>)}</div>)}
{detectedBook&&!parsed.ch&&(<div style={{background:'#f9f5ff',borderRadius:10,padding:8,border:'1px solid #ddd'}}><div style={{fontSize:11,fontWeight:900}}>{detectedBook.name} — Select Chapter:</div>{Array.from({length:detectedBook.chapters},(_,i)=><button key={i+1} onClick={()=>setBibleQuery(`${detectedBook.name} ${i+1}`)} style={{display:'inline-block',padding:'4px 8px',margin:'4px 4px 0 0',border:'none',background:'#fff',borderRadius:8,fontSize:11}}>{i+1}</button>)}</div>)}
{detectedBook&&parsed.ch&&!parsed.vs&&(<div style={{background:'#f0fdf4',borderRadius:10,padding:8,border:'1px solid #bbf7d0'}}><div style={{fontSize:11,fontWeight:900}}>{detectedBook.name} {parsed.ch} — Select Verse:</div><button onClick={()=>fetchBible()} style={{marginTop:6,padding:'6px 10px',border:'none',background:'#16a34a',color:'#fff',borderRadius:8,fontWeight:900}}>Open Chapter</button></div>)}
</div>
<div style={{marginTop:8,background:'#f9f5ff',borderRadius:12,padding:12,flex:1,overflowY:'auto',border:'1px solid #ddd'}}>{bibleLoading?<div style={{opacity:.6,fontSize:12}}>Searching...</div>:bibleResult || <div style={{fontSize:12,opacity:.7}}>Search for a verse, chapter, or passage.</div>}</div>
<button onClick={useBibleVerse} disabled={!bibleResult} style={{marginTop:10,background:bibleResult?'#16a34a':'#ccc',color:'#fff',padding:14,borderRadius:12,fontWeight:900,border:'none'}}>Use This Verse</button>
</>
):(
<>
<div style={{display:'flex',gap:6,marginTop:10}}><input value={hymnQuery} onChange={e=>setHymnQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){const num=parseInt(hymnQuery);if(!isNaN(num))fetchHymnOnline(num); else fetchHymnOnline(1)}}} placeholder="Search hymn number or title" style={{flex:1,padding:10,borderRadius:10,border:'1px solid #ddd',fontSize:12}}/></div>
<div style={{maxHeight:200,overflowY:'auto',marginTop:8,background:'#f9f5ff',borderRadius:10,padding:8,border:'1px solid #ddd'}}><div style={{fontSize:11,fontWeight:900,marginBottom:6}}>SS&S Hymns:</div>{filteredHymns.slice(0,12).map(h=><div key={h.no} onClick={()=>fetchHymnOnline(h.no)} style={{padding:'8px 10px',background:'#fff',border:'1px solid #eee',borderRadius:8,marginTop:4,cursor:'pointer'}}><b style={{fontSize:13}}>{h.no}. {h.title}</b><div style={{fontSize:11,opacity:.7,marginTop:2}}>{h.lyrics.substring(0,60)}...</div></div>)}</div>
<div style={{marginTop:8,background:'#fffef0',borderRadius:12,padding:12,flex:1,overflowY:'auto',border:'1px solid #ddd'}}>{hymnLoading?<div style={{opacity:.6,fontSize:12}}>Fetching...</div>:hymnResult || <div style={{fontSize:12,opacity:.7}}>Select a hymn to display lyrics.</div>}</div>
<button onClick={()=>{if(hymnResult){setVerse(hymnResult);setShowBible(false)}}} disabled={!hymnResult} style={{marginTop:10,background:hymnResult?'#7c3aed':'#ccc',color:'#fff',padding:14,borderRadius:12,fontWeight:900,border:'none'}}>Use This Hymn</button>
</>
)}
</div>
</div>
)}
<div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:52,height:52,background:'#111',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}><div style={{width:32,height:32,borderRadius:50,background:'#ff0000',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:12}}>L</div></div><div><div style={{fontSize:18,fontWeight:900,letterSpacing:1}}>{churchName}</div><div style={{fontSize:11,opacity:.7}}>LIVE STUDIO</div></div></div>
{isAdmin&&(<div style={{marginTop:10,background:'#000',border:'2px solid #00ff00',borderRadius:16,padding:12}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:12,color:'#00ff00'}}>ADMIN</b><button onClick={()=>setShowAdmin(!showAdmin)} style={{padding:'4px 8px',border:'none',background:'#111',color:'#fff',borderRadius:8,fontSize:10}}>Toggle</button></div>{showAdmin&&<div style={{marginTop:8,color:'#00ff00',fontSize:12,display:'flex',flexDirection:'column',gap:4}}><div>Live: {stats.live}</div><div>Daily: {stats.daily}</div><div>Weekly: {stats.weekly}</div><div>Monthly: {stats.monthly}</div><div>Total: {stats.total}</div></div>}</div>)}
<div style={{marginTop:12,border:'2px solid #111',borderRadius:16,padding:12,background:'#ffffff'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:14}}>⚙️ Settings & Studio</b><button onClick={()=>setShowSettings(!showSettings)} style={{padding:'6px 10px',borderRadius:20,border:'none',background:'#111',color:'#fff',fontWeight:900}}>{showSettings?'Hide':'Show'}</button></div>
{showSettings&&(
<div style={{marginTop:12,display:'flex',flexDirection:'column',gap:12}}>
<div style={{border:'2px solid #FF0000',borderRadius:12,padding:10,background:lowData?'#fef2f2':'#fff',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><b style={{fontSize:12}}>Low Data</b><div style={{fontSize:10,opacity:.7}}>{lowData?'Reduced quality':'Normal quality'}</div></div><button onClick={()=>{const val=!lowData; setLowData(val); localStorage.setItem('taglive_lowdata', String(val))}} style={{padding:'6px 12px',border:'none',background:lowData?'#111':'#eee',color:lowData?'#fff':'#111',borderRadius:20,fontWeight:900}}>{lowData?'ON':'OFF'}</button></div>
<div style={{border:'2px solid #7c3aed',borderRadius:16,padding:12,background:'#f9f5ff'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:14}}>Intro / Outro Studio</b><button onClick={()=>setShowStudio(!showStudio)} style={{padding:'6px 8px',border:'none',background:'#111',color:'#fff',borderRadius:8,fontWeight:900}}>{showStudio?'Hide':'Open'}</button></div>{showStudio&&(<div style={{marginTop:10}}><div style={{display:'flex',gap:6,marginTop:8}}><label style={{flex:1,background:'#7c3aed',color:'#fff',padding:12,borderRadius:10,fontWeight:800,fontSize:12,textAlign:'center',cursor:'pointer'}}>Upload Intro<input ref={introFileRef} type="file" accept="image/*,video/*" onChange={handleIntroFile} style={{display:'none'}} /></label><label style={{flex:1,background:'#111',color:'#fff',padding:12,borderRadius:10,fontWeight:800,fontSize:12,textAlign:'center',cursor:'pointer'}}>Upload Outro<input ref={outroFileRef} type="file" accept="image/*,video/*" onChange={handleOutroFile} style={{display:'none'}} /></label></div><div style={{marginTop:12}}>{intros.length>0&&<div style={{marginBottom:10}}><b style={{fontSize:12}}>Active Intro:</b><div style={{display:'flex',flexDirection:'column',gap:4,marginTop:6}}>{intros.map((it:any)=><div key={it.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',padding:'8px 10px',borderRadius:8,border:'1px solid #eee'}}><span>{it.title}</span><button onClick={()=>{setActiveIntroId(it.id); localStorage.setItem('taglive_active_intro', it.id)}} style={{padding:'4px 8px',border:'none',background:activeIntroId===it.id?'#16a34a':'#111',color:'#fff',borderRadius:8,fontSize:10}}>Use</button></div>)}</div></div>}{outros.length>0&&<div><b style={{fontSize:12}}>Active Outro:</b><div style={{display:'flex',flexDirection:'column',gap:4,marginTop:6}}>{outros.map((ot:any)=><div key={ot.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',padding:'8px 10px',borderRadius:8,border:'1px solid #eee'}}><span>{ot.title}</span><button onClick={()=>{setActiveOutroId(ot.id); localStorage.setItem('taglive_active_outro', ot.id)}} style={{padding:'4px 8px',border:'none',background:activeOutroId===ot.id?'#16a34a':'#111',color:'#fff',borderRadius:8,fontSize:10}}>Use</button></div>)}</div></div>}</div></div>)}</div>
<div style={{border:'2px solid #111',borderRadius:16,padding:12,background:'#ffffff'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}><b style={{fontSize:13,color:'#111'}}>Ticker</b><button onClick={()=>setShowTickerStudio(!showTickerStudio)} style={{padding:'6px 8px',border:'none',background:'#111',color:'#fff',borderRadius:8,fontWeight:900}}>{showTickerStudio?'Hide':'Open'}</button></div>{showTickerStudio&&(<div style={{marginTop:10,display:'flex',flexDirection:'column',gap:8}}><input value={tickerText} onChange={e=>{setTickerText(e.target.value);localStorage.setItem('taglive_ticker_text',e.target.value);tickerOffsetRef.current=720}} placeholder="Type announcement..." style={{width:'100%',padding:10,borderRadius:10,border:'1px solid #ddd',fontSize:12}}/><div style={{display:'flex',gap:6,flexWrap:'wrap'}}><div style={{flex:1,minWidth:120,display:'flex',alignItems:'center',gap:6,background:'#f3f0ff',padding:'6px 10px',borderRadius:10}}><span style={{fontSize:10,fontWeight:800}}>A-</span><input type="range" min={16} max={42} value={tickerSize} onChange={e=>{setTickerSize(parseInt(e.target.value)); localStorage.setItem('taglive_ticker_size', e.target.value)}} style={{flex:1}} /></div><div style={{flex:1,minWidth:120,display:'flex',alignItems:'center',gap:6,background:'#fef3c7',padding:'6px 10px',borderRadius:10}}><span style={{fontSize:10,fontWeight:800}}>Speed</span><input type="range" min={1} max={6} value={tickerSpeed} onChange={e=>{setTickerSpeed(parseInt(e.target.value)); localStorage.setItem('taglive_ticker_speed', e.target.value)}} style={{flex:1}} /></div></div><button onClick={()=>{setTickerOn(!tickerOn); localStorage.setItem('taglive_ticker_on', String(!tickerOn))}} style={{padding:'8px 12px',border:'none',background:tickerOn?'#16a34a':'#111',color:'#fff',borderRadius:10,fontWeight:900}}>{tickerOn?'Ticker On':'Ticker Off'}</button></div>)}</div>
<div style={{border:'2px solid #7c3aed',borderRadius:16,padding:12,background:'#fff'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:13}}>Church Name</b><button onClick={()=>setShowChurchName(!showChurchName)} style={{padding:'6px 8px',border:'none',background:'#111',color:'#fff',borderRadius:8,fontWeight:900}}>{showChurchName?'Show':'Hide'}</button></div><input value={churchName} onChange={e=>{setChurchName(e.target.value);localStorage.setItem('taglive_church_name',e.target.value)}} placeholder="SALEM GANA JA CITY" style={{width:'100%',marginTop:8,padding:10,borderRadius:10,border:'1px solid #ddd'}}/><div style={{marginTop:10,border:'1px dashed #7c3aed',borderRadius:10,padding:10,background:'#f9f5ff'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b style={{fontSize:11}}>SAVED LOGO</b>{logoImage&&<button onClick={removeChurchLogo} style={{padding:'4px 8px',border:'none',background:'#111',color:'#fff',borderRadius:8,fontSize:10}}>Remove</button>}</div><div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>{logoImage&&<img src={logoImage} style={{width:50,height:50,objectFit:'contain',borderRadius:8,border:'1px solid #ddd',background:'#fff'}}/>}<div style={{flex:1}}><input ref={churchLogoInputRef} type="file" accept="image/*" onChange={handleChurchLogoPick} style={{width:'100%',fontSize:11}}/><div style={{fontSize:9,opacity:0.7,marginTop:2}}>{logoImage?'Logo saved':'No logo saved'}</div></div></div></div></div>
</div>
)}
</div>
<div style={{display:'flex',gap:6,marginTop:12}}><button onClick={()=>setBgMode('face')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='face'?'#111':'#eee',color:bgMode==='face'?'#fff':'#111',fontWeight:900}}>Face</button><button onClick={()=>setBgMode('black')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='black'?'#111':'#eee',color:bgMode==='black'?'#fff':'#111',fontWeight:900}}>Black</button><button onClick={()=>setBgMode('image')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='image'?'#111':'#eee',color:bgMode==='image'?'#fff':'#111',fontWeight:900}}>Image</button><button onClick={()=>setBgMode('split')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='split'?'#111':'#eee',color:bgMode==='split'?'#fff':'#111',fontWeight:900}}>Split</button></div>
<div style={{display:'flex',alignItems:'center',gap:6,marginTop:10,flexWrap:'wrap'}}><div style={{flex:1,minWidth:140,display:'flex',alignItems:'center',gap:6,background:'#f3f0ff',padding:'6px 10px',borderRadius:10}}><span style={{fontSize:10,fontWeight:800}}>Text</span><input type="range" min={20} max={64} value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value))} style={{flex:1}} /></div><div style={{flex:1,minWidth:140,display:'flex',alignItems:'center',gap:6,background:'#fef3c7',padding:'6px 10px',borderRadius:10}}><span style={{fontSize:10,fontWeight:800}}>Box</span><input type="range" min={0.2} max={1} step={0.05} value={boxOpacity} onChange={e=>setBoxOpacity(parseFloat(e.target.value))} style={{flex:1}} /></div></div>
<div style={{display:'flex',gap:6,marginTop:8,alignItems:'center',background:'#fff',border:'1px solid #eee',padding:8,borderRadius:10,flexWrap:'wrap'}}><div style={{display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:10,fontWeight:800}}>Text</span><input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} /></div><div style={{display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:10,fontWeight:800}}>Box</span><input type="color" value={boxColor} onChange={e=>setBoxColor(e.target.value)} /></div><button onClick={()=>setSelected('text')} style={{padding:'6px 10px',border:'none',background:selected==='text'?'#111':'#eee',color:selected==='text'?'#fff':'#111',borderRadius:8,fontWeight:900}}>Text</button><button onClick={()=>setSelected('logo')} style={{padding:'6px 10px',border:'none',background:selected==='logo'?'#111':'#eee',color:selected==='logo'?'#fff':'#111',borderRadius:8,fontWeight:900}}>Logo</button><button onClick={()=>setShowText(!showText)} style={{padding:'6px 10px',border:'none',background:showText?'#16a34a':'#111',color:'#fff',borderRadius:8,fontWeight:900}}>{showText?'Text On':'Text Off'}</button></div>
<div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{marginTop:10,background:'#000',borderRadius:18,overflow:'hidden',position:'relative',aspectRatio:'9/16',touchAction:'none'}}>
<canvas ref={canvasRef} style={{display:'block',width:'100%',height:'100%'}} />
<video ref={videoRef} playsInline muted style={{display:'none'}} />
<video ref={broadcastVideoRef} muted={false} playsInline crossOrigin="anonymous" style={{display:'none'}}/>
{isCam&&(<div style={{position:'absolute',top: bgMode==='split'?'auto':'12px',bottom: bgMode==='split'?'50px':'auto',right:12,display:'flex',gap:8,zIndex:50}}><button onClick={toggleCamera} style={{background:'#111',color:'#fff',padding:'8px 10px',border:'none',borderRadius:10,fontWeight:900}}>Flip</button>{trackRef.current?.getCapabilities?.()?.torch && <button onClick={toggleTorch} style={{background:torch?'#ffeb3b':'#111',color:torch?'#111':'#fff',padding:'8px 10px',border:'none',borderRadius:10,fontWeight:900}}>Torch</button>}</div>)}
</div>
<div style={{display:'flex',gap:8,marginTop:12}}>{!isCam?<button onClick={()=>startCamera()} style={{flex:1,background:'#111',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Start Camera</button>:<button onClick={stopCamera} style={{flex:1,background:'#111',color:'#fff',padding:14,borderRadius:12,fontWeight:800,border:'none'}}>Stop Camera</button>}</div>
<div style={{display:'flex',gap:6,marginTop:10}}>{!isRecording?<button onClick={startRecording} disabled={!isCam} style={{flex:1,background:isCam?'#a21caf':'#ccc',color:'#fff',padding:12,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Record</button>:<button onClick={stopRecording} style={{flex:1,background:'#111',color:'#fff',padding:12,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Stop + Outro ({formatTime(liveSeconds)})</button>}{recordedUrl&&<a href={recordedUrl} download={`${churchName.replace(/[^a-zA-Z0-9]/g,'_')}-${Date.now()}.mp4`} style={{flex:1,background:'#16a34a',color:'#fff',padding:12,borderRadius:10,fontWeight:800,border:'none',fontSize:12,textAlign:'center',textDecoration:'none'}}>Download</a>}</div>
{recordedUrl&&<video src={recordedUrl} controls style={{width:'100%',marginTop:8,borderRadius:12}}/>}
<div style={{display:'flex',gap:6,marginTop:10}}><button onClick={openBibleApp} style={{flex:1,background:'#2563eb',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Open Bible/Hymn</button><button onClick={pasteClipboard} style={{flex:1,background:'#111',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none',fontSize:12}}>Paste</button></div>
<textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%',height:90,marginTop:10,padding:12,borderRadius:12,border:'1px solid #ddd'}} placeholder={"Ministering:\nNAME OF PRESENTER\nSERMON TITLE\nSCRIPTURE"} />
{saved.length>0&&<div style={{marginTop:8,border:'1px solid #eee',borderRadius:12,padding:8,background:'#fff'}}><details open><summary style={{fontSize:12,fontWeight:900,cursor:'pointer',padding:4}}>📁 Saved Folder ({saved.length})</summary><div style={{marginTop:8,display:'flex',flexDirection:'column',gap:6}}>{saved.map((s,i)=><div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#f3f0ff',border:'1px solid #e5e7eb',padding:'8px 10px',borderRadius:20}}><span onClick={()=>setVerse(s)} style={{cursor:'pointer',flex:1}}>{s.slice(0,80)}</span><button onClick={()=>deleteSaved(i)} style={{padding:'4px 8px',border:'none',background:'#111',color:'#fff',borderRadius:20,fontSize:10}}>x</button></div>)}</div></details></div>}
<div style={{marginTop:14,border:'2px solid #111',borderRadius:14,padding:12}}><b>Connect Facebook</b><div style={{display:'flex',gap:8,marginTop:8}}><button onClick={loginFacebook} style={{flex:1,background:'#1877f2',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none'}}>Login</button>{fbUser&&<button onClick={()=>createFbLiveAuto(selectedPage||pages[0])} style={{flex:1,background:'#1a73e8',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none'}}>Go Live</button>}</div>{pages.length>0&&<div style={{marginTop:8}}><select value={selectedPage?.id || ''} onChange={e=>{const p=pages.find(x=>x.id===e.target.value); setSelectedPage(p||null)}} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #ddd'}}>{pages.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}<div style={{marginTop:8,fontSize:11,opacity:.7}}>{fbStreamUrl ? `Stream URL: ${fbStreamUrl}` : 'Not connected yet'}</div></div>
<div style={{marginTop:14,border:'2px solid #ff0000',borderRadius:14,padding:12}}><b>Connect YouTube Live</b><input value={ytKey} onChange={e=>{setYtKey(e.target.value);localStorage.setItem('taglive_ytkey', e.target.value)}} placeholder="YouTube API key" style={{width:'100%',marginTop:8,padding:10,borderRadius:10,border:'1px solid #ddd'}}/><button onClick={()=>setYtLive(!ytLive)} style={{marginTop:8,width:'100%',background:ytLive?'#16a34a':'#111',color:'#fff',padding:10,borderRadius:10,fontWeight:800,border:'none'}}>{ytLive?'YouTube Live ON':'Start YouTube Live'}</button></div>
</div>
)
}
