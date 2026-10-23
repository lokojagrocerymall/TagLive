"use client"
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://gqifluvkrjzsebfdjcio.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzY4NDgsImV4cCI6MjEwNzk1Mjg0OH0.zonQMk22nXN0VsbHyI88hT27ntl-VxEEi8k2G8-k5lc')
declare global { interface Window { FB: any } }
const OFFLINE_KJV: Record<string,string> = {"john 3:16":"John 3:16 - For God so loved the world...","romans 1:20":"Romans 1:20 - For the invisible things...","romans 8:28":"Romans 8:28 - And we know that all things...","psalm 23":"Psalm 23 - The LORD is my shepherd...","jeremiah 29:11":"Jeremiah 29:11 - For I know the thoughts...","philippians 4:13":"Philippians 4:13 - I can do all things...","isaiah 41:10":"Isaiah 41:10 - Fear thou not...","john 14:6":"John 14:6 - I am the way...","2 timothy 1:7":"2 Timothy 1:7 - For God hath not given...","psalm 91:1":"Psalm 91:1 - He that dwelleth...","matthew 28:19":"Matthew 28:19 - Go ye therefore...","genesis 1:1":"Genesis 1:1 - In the beginning...","proverbs 3:5":"Proverbs 3:5 - Trust in the LORD...","john 1:1":"John 1:1 - In the beginning was the Word...","romans 10:9":"Romans 10:9 - That if thou shalt confess..."}
const BIBLE_VERSIONS = [{ id: 'kjv', label: 'KJV' },{ id: 'akjv', label: 'NKJV-like' },{ id: 'web', label: 'NIV-like' },{ id: 'bbe', label: 'GNB-like' },{ id: 'asv', label: 'RSV-like' },{ id: 'lsv', label: 'ESV-like' },{ id: 'oeb-cw', label: 'AMP-like' },{ id: 'webbe', label: 'WEBBE' },]
const BIBLE_BOOKS = [{ name: "Genesis", chapters: 50 },{ name: "Exodus", chapters: 40 },{ name: "Leviticus", chapters: 27 },{ name: "Numbers", chapters: 36 },{ name: "Deuteronomy", chapters: 34 },{ name: "Joshua", chapters: 24 },{ name: "Judges", chapters: 21 },{ name: "Ruth", chapters: 4 },{ name: "1 Samuel", chapters: 31 },{ name: "2 Samuel", chapters: 24 },{ name: "1 Kings", chapters: 22 },{ name: "2 Kings", chapters: 25 },{ name: "1 Chronicles", chapters: 29 },{ name: "2 Chronicles", chapters: 36 },{ name: "Ezra", chapters: 10 },{ name: "Nehemiah", chapters: 13 },{ name: "Esther", chapters: 10 },{ name: "Job", chapters: 42 },{ name: "Psalm", chapters: 150 },{ name: "Proverbs", chapters: 31 },{ name: "Ecclesiastes", chapters: 12 },{ name: "Song of Solomon", chapters: 8 },{ name: "Isaiah", chapters: 66 },{ name: "Jeremiah", chapters: 52 },{ name: "Lamentations", chapters: 5 },{ name: "Ezekiel", chapters: 48 },{ name: "Daniel", chapters: 12 },{ name: "Hosea", chapters: 14 },{ name: "Joel", chapters: 3 },{ name: "Amos", chapters: 9 },{ name: "Obadiah", chapters: 1 },{ name: "Jonah", chapters: 4 },{ name: "Micah", chapters: 7 },{ name: "Nahum", chapters: 3 },{ name: "Habakkuk", chapters: 3 },{ name: "Zephaniah", chapters: 3 },{ name: "Haggai", chapters: 2 },{ name: "Zechariah", chapters: 14 },{ name: "Malachi", chapters: 4 },{ name: "Matthew", chapters: 28 },{ name: "Mark", chapters: 16 },{ name: "Luke", chapters: 24 },{ name: "John", chapters: 21 },{ name: "Acts", chapters: 28 },{ name: "Romans", chapters: 16 },{ name: "1 Corinthians", chapters: 16 },{ name: "2 Corinthians", chapters: 13 },{ name: "Galatians", chapters: 6 },{ name: "Ephesians", chapters: 6 },{ name: "Philippians", chapters: 4 },{ name: "Colossians", chapters: 4 },{ name: "1 Thessalonians", chapters: 5 },{ name: "2 Thessalonians", chapters: 3 },{ name: "1 Timothy", chapters: 6 },{ name: "2 Timothy", chapters: 4 },{ name: "Titus", chapters: 3 },{ name: "Philemon", chapters: 1 },{ name: "Hebrews", chapters: 13 },{ name: "James", chapters: 5 },{ name: "1 Peter", chapters: 5 },{ name: "2 Peter", chapters: 3 },{ name: "1 John", chapters: 5 },{ name: "2 John", chapters: 1 },{ name: "3 John", chapters: 1 },{ name: "Jude", chapters: 1 },{ name: "Revelation", chapters: 22 }]
const SS_HYMNS = [{no:1,title:"There Shall Be Showers Of Blessing",lyrics:"There shall be showers of blessing:\nThis is the promise of love;"},{no:2,title:"What A Friend We Have In Jesus",lyrics:"What a friend we have in Jesus, All our sins and griefs to bear!"},{no:10,title:"How Great Thou Art",lyrics:"O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made;"},{no:20,title:"It Is Well With My Soul",lyrics:"When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul."},{no:40,title:"To God Be The Glory",lyrics:"To God be the glory, great things He hath done;"},{no:41,title:"The Old Rugged Cross",lyrics:"On a hill far away stood an old rugged cross,"},{no:42,title:"Blessed Assurance",lyrics:"Blessed assurance, Jesus is mine!"},{no:63,title:"All Hail The Power Of Jesus Name",lyrics:"All hail the power of Jesus' name!"},{no:85,title:"Hark The Herald Angels Sing",lyrics:"Hark! the herald angels sing"},{no:93,title:"O Come All Ye Faithful",lyrics:"O come, all ye faithful,"},{no:100,title:"Holy Holy Holy",lyrics:"Holy, holy, holy! Lord God Almighty!"},{no:151,title:"Behold The Saviour Of Mankind",lyrics:"Behold the Saviour of mankind"},{no:152,title:"Low In The Grave He Lay",lyrics:"Low in the grave He lay—Jesus, my Saviour!"},{no:204,title:"I Will Sing The Wondrous Story",lyrics:"I will sing the wondrous story"},{no:210,title:"I've Found A Friend In Jesus",lyrics:"I've found a friend in Jesus, He's everything to me,"},{no:301,title:"I've A Message From The Lord",lyrics:"I've a message from the Lord, Hallelujah!"},{no:320,title:"When The Roll Is Called Up Yonder",lyrics:"When the trumpet of the Lord shall sound,"},{no:351,title:"Why Do You Wait Dear Brother",lyrics:"Why do you wait, dear brother?"},{no:352,title:"Come With Thy Sins To The Fountain",lyrics:"Come with thy sins to the fountain,"},];
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
const toggleTorch=async()=>{ try{ const track:any=trackRef.current; if(!track?.getCapabilities?.()?.torch) return alert('Torch not supported'); await track.applyConstraints({advanced:[{torch:!torch}] as any}); setTorch(!torch) }catch(e:any){ alert(e.message) } }
const loginFacebook=()=>{
if(!window.FB){ alert('Wait 3 sec...'); return }
window.FB.login((resp:any)=>{ if(resp.authResponse){ window.FB.api('/me?fields=name,picture', (u:any)=>{ setFbUser(u); loadPages(resp.authResponse.accessToken) }) } },{scope:'public_profile,pages_show_list,pages_read_engagement,business_management'})
}
const loadPages=(tok?:string)=>{ const t=tok||window.FB?.getAuthResponse()?.accessToken; if(!t) return alert('Login first'); window.FB.api('/me/accounts', {access_token:t}, (res:any)=>{ if(res.data?.length){ setPages(res.data); alert(`Found ${res.data.length} pages`) } else alert('No pages') }) }
const createFbLiveAuto=async(page:any)=>{
const active=intros.find(i=>i.id===activeIntroId)
if(active){
setBroadcastPlaying(active)
if(active.type==='image'){ const img=new Image(); img.src=active.data; img.onload=()=>{ broadcastImageRef.current=img } }
if(active.type==='video'&&broadcastVideoRef.current){ broadcastVideoRef.current.src=active.data; broadcastVideoRef.current.muted=false; broadcastVideoRef.current.volume=1; broadcastVideoRef.current.play().catch(()=>{}) }
setTimeout(async()=>{
setBroadcastPlaying(null); broadcastImageRef.current=null;
setSelectedPage(page)
try{
const res=await fetch(`https://graph.facebook.com/v19.0/${page.id}/live_videos`,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ access_token: page.access_token, title: verse.substring(0,60), description: 'TagLive - '+verse, status: 'UNPUBLISHED' }) })
const data=await res.json(); if(data.error) throw new Error(JSON.stringify(data.error)); setFbStreamUrl(data.stream_url); setLiveId(data.id); setIsLive(true); startTimer()
}catch(e:any){ setIsLive(true); startTimer() }
}, (active.duration||5)*1000)
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
const getFilteredHymns=(q:string)=>{ if(!q) return BUILD_348().slice(0,6); const lower=q.toLowerCase(); const num=parseInt(q); if(!isNaN(num)){ const byNo=BUILD_348().filter(h=>h.no===num); if(byNo.length) return byNo } return BUILD_348().filter(h=>h.title.toLowerCase().includes(lower)).slice(0,8) }
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
    try{ const res=await fetch(`/api/sss?no=${no}`); const d=await res.json(); if(d && d.lyrics && d.lyrics.length>20 && !d.lyrics.includes(`SS&S ${no} - (Tap`)){ const full2=`${d.no}. ${d.title}\n\n${d.lyrics}`; setHymnResult(full2); const cache=JSON.parse(localStorage.getItem('taglive_hymn_cache')||'{}'); cache[no]=full2; localStorage.setItem('taglive_hymn_cache', JSON.stringify(cache)) } }catch{}
    return
  }
  try { const res = await fetch(`/api/sss?no=${no}`); const d = await res.json(); if (d && d.lyrics && d.lyrics.length>10) { const full=`${d.no}. ${d.title}\n\n${d.lyrics}`; setHymnResult(full); try{ const cache=JSON.parse(localStorage.getItem('taglive_hymn_cache')||'{}'); cache[no]=full; localStorage.setItem('taglive_hymn_cache', JSON.stringify(cache)) }catch{}; setHymnLoading(false); return } } catch {}
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
const onLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img }; setSelected('logo') }
const handleChurchLogoPick=async(e:any)=>{ const f=e.target.files?.[0]; if(!f) return; const base64=await fileToBase64(f); setLogoImage(base64); localStorage.setItem('taglive_church_logo', base64); const img=new Image(); img.src=base64; img.onload=()=>{ logoImageRef.current=img }; }
const removeChurchLogo=()=>{ localStorage.removeItem('taglive_church_logo'); setLogoImage(null); logoImageRef.current=null; if(churchLogoInputRef.current) churchLogoInputRef.current.value=''; if(logoInputRef.current) logoInputRef.current.value=''; }
  // FIXED: INTRO NOW AUTO-CLEARS AFTER DURATION + SAFE AUDIO
const startRecording=async()=>{
  const canvas=canvasRef.current; if(!canvas) return alert('Start camera first')
  if(canvas.width!==720 || canvas.height!==1280){ canvas.width=720; canvas.height=1280 }
  const canvasStream=(canvas as any).captureStream(30) as MediaStream
  try{
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioCtxRef.current = ctx
    const dest = ctx.createMediaStreamDestination()
    const micTracks = streamRef.current?.getAudioTracks()||[]
    micTracks.forEach(t=>{
      try{ const src = ctx.createMediaStreamSource(new MediaStream([t])); src.connect(dest) }catch{}
    })
    dest.stream.getAudioTracks().forEach(at=>canvasStream.addTrack(at))
  }catch{
    const micTracks=streamRef.current?.getAudioTracks()||[]
    micTracks.forEach(t=> canvasStream.addTrack(t))
  }
  const active=intros.find(i=>i.id===activeIntroId)
  if(active){
    setBroadcastPlaying(active)
    if(active.type==='image'){ 
      const img=new Image(); 
      img.src=active.data; 
      img.onload=()=>{ broadcastImageRef.current=img } 
    }
    else if(active.type==='video'&&broadcastVideoRef.current){
      broadcastVideoRef.current.src=active.data; 
      broadcastVideoRef.current.muted=false; 
      broadcastVideoRef.current.volume=1; 
      broadcastVideoRef.current.crossOrigin="anonymous"
      try{ await broadcastVideoRef.current.play(); }catch{}
    }
    // FIX 1: AUTO CLEAR INTRO - THIS WAS MISSING!
    setTimeout(()=>{ 
      setBroadcastPlaying(null); 
      broadcastImageRef.current=null;
      if(broadcastVideoRef.current){ try{broadcastVideoRef.current.pause()}catch{} }
    }, (active.duration||5)*1000)
  }
  chunksRef.current=[]
  let mime='video/mp4'
  if(!MediaRecorder.isTypeSupported('video/mp4')){ if(MediaRecorder.isTypeSupported('video/webm;codecs=h264')) mime='video/webm;codecs=h264'; else mime='video/webm;codecs=vp9' }
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
