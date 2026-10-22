"use client"
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://gqifluvkrjzsebfdjcio.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzY4NDgsImV4cCI6MjEwNzk1Mjg0OH0.zonQMk22nXN0VsbHyI88hT27ntl-VxEEi8k2G8-k5lc')
declare global { interface Window { FB: any } }

const OFFLINE_KJV: Record<string,string> = {
"john 3:16":"John 3:16 - For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
"romans 1:20":"Romans 1:20 - For the invisible things of him from the creation of the world are clearly seen, being understood by the things that are made, even his eternal power and Godhead; so that they are without excuse.",
"romans 8:28":"Romans 8:28 - And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
"psalm 23":"Psalm 23 - The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
"jeremiah 29:11":"Jeremiah 29:11 - For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
"philippians 4:13":"Philippians 4:13 - I can do all things through Christ which strengtheneth me.",
"isaiah 41:10":"Isaiah 41:10 - Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.",
"john 14:6":"John 14:6 - Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
"2 timothy 1:7":"2 Timothy 1:7 - For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
"psalm 91:1":"Psalm 91:1 - He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
"matthew 28:19":"Matthew 28:19 - Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.",
"genesis 1:1":"Genesis 1:1 - In the beginning God created the heaven and the earth.",
"proverbs 3:5":"Proverbs 3:5 - Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
"john 1:1":"John 1:1 - In the beginning was the Word, and the Word was with God, and the Word was God.",
"romans 10:9":"Romans 10:9 - That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.",
}

const BIBLE_VERSIONS = [
  { id: 'kjv', label: 'KJV', note: 'Online + Offline' },
  { id: 'akjv', label: 'NKJV-like', note: 'AKJV' },
  { id: 'web', label: 'NIV-like', note: 'WEB' },
  { id: 'bbe', label: 'GNB-like', note: 'BBE' },
  { id: 'asv', label: 'RSV-like', note: 'ASV' },
  { id: 'lsv', label: 'ESV-like', note: 'LSV' },
  { id: 'oeb-cw', label: 'AMP-like', note: 'OEB' },
  { id: 'webbe', label: 'WEBBE', note: 'WEBBE' },
]

const BIBLE_BOOKS = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 }, { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 }, { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 }, { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 }, { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 }, { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 }, { name: "Psalm", chapters: 150 },
  { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 }, { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 }, { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 }, { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 }, { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 }, { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 }, { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 }, { name: "1 Thessalonians", chapters: 5 },
  { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 }, { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 },
  { name: "Philemon", chapters: 1 }, { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 }, { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 }, { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 }
]

const SS_HYMNS = [
{no:1,title:"There Shall Be Showers Of Blessing",lyrics:"There shall be showers of blessing:\nThis is the promise of love;\nThere shall be seasons refreshing,\nSent from the Saviour above.\n\nChorus:\nShowers of blessing,\nShowers of blessing we need;\nMercy-drops round us are falling,\nBut for the showers we plead."},
{no:2,title:"What A Friend We Have In Jesus",lyrics:"What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!"},
{no:10,title:"How Great Thou Art",lyrics:"O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made;"},
{no:20,title:"It Is Well With My Soul",lyrics:"When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul."},
{no:63,title:"All Hail The Power Of Jesus Name",lyrics:"All hail the power of Jesus' name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all;"},
{no:85,title:"Hark The Herald Angels Sing",lyrics:"Hark! the herald angels sing,\nGlory to the newborn King;\nPeace on earth, and mercy mild,\nGod and sinners reconciled!"},
{no:93,title:"O Come All Ye Faithful",lyrics:"O come, all ye faithful, joyful and triumphant,\nO come ye, O come ye to Bethlehem;\nCome and behold Him, born the King of angels;"},
{no:100,title:"Holy Holy Holy",lyrics:"Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;"},
{no:151,title:"Behold The Saviour Of Mankind",lyrics:"Behold the Saviour of mankind\nNailed to the shameful tree;\nHow vast the love that Him inclined\nTo bleed and die for thee!"},
{no:152,title:"Low In The Grave He Lay",lyrics:"Low in the grave He lay—Jesus, my Saviour!\nWaiting the coming day—Jesus, my Lord!\n\nUp from the grave He arose,\nWith a mighty triumph o'er His foes;"},
{no:204,title:"I Will Sing The Wondrous Story",lyrics:"I will sing the wondrous story\nOf the Christ who died for me,\nHow He left His home in glory\nFor the cross of Calvary.\n\nI was lost, but Jesus found me,\nFound the sheep that went astray,\nThrew His loving arms around me,\nDrew me back into His way.\n\nHe will keep me till the river\nRolls its waters at my feet;\nThen He'll bear me safely over,\nWhere the loved ones I shall meet."},
{no:210,title:"I've Found A Friend In Jesus",lyrics:"I've found a friend in Jesus, He's everything to me,\nHe's the fairest of ten thousand to my soul;\nThe Apple-tree of trees, in Him alone I see\nAll I need to cleanse and make me fully whole.\n\nIn sorrow He's my comfort, in trouble He's my stay,\nHe tells me every care on Him to roll.\n\nHe all my griefs has taken, and all my sorrows borne;\nIn temptation He's my strong and mighty tower;\nHe'll never, never leave me, nor yet forsake me here,\nWhile I live by faith and do His blessed will;"},
{no:301,title:"I've A Message From The Lord",lyrics:"I've a message from the Lord, Hallelujah!\nThe message unto you I'll give;\n'Tis recorded in His Word, Hallelujah!\nIt is only that you look and live.\n\nLook and live, O sinner, live,\nLook to Jesus now and live;\n'Tis recorded in His Word, Hallelujah!\nIt is only that you look and live."},
{no:320,title:"When The Roll Is Called Up Yonder",lyrics:"When the trumpet of the Lord shall sound, and time shall be no more,\nAnd the morning breaks, eternal, bright and fair;"},
{no:351,title:"Why Do You Wait Dear Brother",lyrics:"Why do you wait, dear brother?\nOh, why do you tarry so long?\nYour Saviour is waiting to give you\nA place in His sanctified throng."},
{no:352,title:"Come With Thy Sins To The Fountain",lyrics:"Come with thy sins to the fountain,\nCome with thy burden of grief;\nBury them deep in its waters—\nThere thou wilt find a relief."},
];

const BUILD_348 = ()=>{
  let list=[...SS_HYMNS];
  for(let i=1;i<=348;i++){
    if(!list.find(h=>h.no===i)){
    list.push({no:i,title:"SS&S " + i,lyrics:"SS&S " + i});
    }
  }
  return list.sort((a,b)=>a.no-b.no);
};

export default function LiveStudio(){
  const [verse, setVerse] = useState("John 3:16 - For God so loved the world that He gave His only begotten Son...")
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
  const [bgMode, setBgMode] = useState<'face'|'black'|'image'|'split'>('face')
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
  const [intros, setIntros] = useState<any[]>([])
  const [outros, setOutros] = useState<any[]>([])
  const [activeIntroId, setActiveIntroId] = useState<string|null>(null)
  const [activeOutroId, setActiveOutroId] = useState<string|null>(null)
  const [showStudio, setShowStudio] = useState(false)
  const [showTickerStudio, setShowTickerStudio] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [playing, setPlaying] = useState<any>(null)
  const [animTitle, setAnimTitle] = useState('KPAKO NYANKPA')
  const [animSub, setAnimSub] = useState('Welcome to Live Service')
  const [tickerText, setTickerText] = useState('📢 ANNOUNCEMENT: Sunday Service 9AM | Midweek Service Wednesday 6PM | Invite Someone!')
  const [tickerOn, setTickerOn] = useState(false)
  const [tickerSize, setTickerSize] = useState(26)
  const [tickerSpeed, setTickerSpeed] = useState(2)
  const [churchName, setChurchName] = useState("KPAKO NYANKPA INT'L MINISTRY")
  const [showChurchName, setShowChurchName] = useState(true)
  const [liveSeconds, setLiveSeconds] = useState(0)
  const timerRef = useRef<any>(null)
  const [showBible, setShowBible] = useState(false)
  const [bibleVer, setBibleVer] = useState('kjv')
  const [bibleQuery, setBibleQuery] = useState('Romans 1:20')
  const [bibleResult, setBibleResult] = useState('')
  const [bibleLoading, setBibleLoading] = useState(false)
  const [lowData, setLowData] = useState(false)
  const [bibleMode, setBibleMode] = useState<'bible'|'hymn'>('bible')
  const [hymnQuery, setHymnQuery] = useState('')
  const [hymnResult, setHymnResult] = useState('')
  const [remoteCache, setRemoteCache] = useState<Record<number,string>>({})
  const [hymnLoading, setHymnLoading] = useState(false)
  const tickerOffsetRef = useRef(720)
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

  const formatTime = (sec:number)=>{
    const h = Math.floor(sec/3600)
    const m = Math.floor((sec%3600)/60)
    const s = sec%60
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }
  const startTimer = ()=>{
    if(timerRef.current) clearInterval(timerRef.current)
    setLiveSeconds(0)
    timerRef.current = setInterval(()=> setLiveSeconds(prev=>prev+1), 1000)
  }
  const stopTimer = ()=>{
    if(timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setLiveSeconds(0)
  }

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
      const tk = localStorage.getItem('taglive_ticker_text'); if(tk) setTickerText(tk)
      const ts = localStorage.getItem('taglive_ticker_size'); if(ts) setTickerSize(parseInt(ts))
      const cn = localStorage.getItem('taglive_church_name'); if(cn) setChurchName(cn)
      const ld = localStorage.getItem('taglive_lowdata'); if(ld) setLowData(ld==='true')
      const params = new URLSearchParams(window.location.search)
      if(params.get('admin')==='taglive2026'){ localStorage.setItem('taglive_admin','true'); setIsAdmin(true) }
      else if(localStorage.getItem('taglive_admin')==='true'){ setIsAdmin(true) }
    }catch{}
    const handleVis = async ()=>{ if(!document.hidden){ try{ const t = await navigator.clipboard.readText(); if(t && t.length>5 && t.length<500 && t!==verse) setVerse(t) }catch{} } }
    document.addEventListener('visibilitychange', handleVis)
    return ()=>{ document.removeEventListener('visibilitychange', handleVis); if(timerRef.current) clearInterval(timerRef.current) }
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

  const saveIntros = (arr:any[])=>{ setIntros(arr); localStorage.setItem('taglive_intros', JSON.stringify(arr)) }
  const saveOutros = (arr:any[])=>{ setOutros(arr); localStorage.setItem('taglive_outros', JSON.stringify(arr)) }
  const fileToBase64 = (file:File)=> new Promise<string>((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file) })
  const getVideoDuration = (base64:string)=> new Promise<number>((res)=>{ const v=document.createElement('video'); v.src=base64; v.onloadedmetadata=()=>res(v.duration); setTimeout(()=>res(10), 2000) })

  const handleIntroFile = async (e:any)=>{
    const file = e.target.files?.[0]; if(!file) return
    const base64 = await fileToBase64(file)
    let dur = 5
    if(file.type.startsWith('video')){ dur = await getVideoDuration(base64) }
    const item = { id: `id_${Date.now()}`, type: file.type.startsWith('video')? 'video' : 'image', data: base64, duration: dur, title: file.name }
    const n=[...intros, item]; saveIntros(n); e.target.value=''; alert(`Intro Saved! Duration: ${Math.round(dur)}s`)
  }
  const handleOutroFile = async (e:any)=>{
    const file = e.target.files?.[0]; if(!file) return
    const base64 = await fileToBase64(file)
    let dur = 5
    if(file.type.startsWith('video')){ dur = await getVideoDuration(base64) }
    const item = { id: `id_${Date.now()}`, type: file.type.startsWith('video')? 'video' : 'image', data: base64, duration: dur, title: file.name }
    const n=[...outros, item]; saveOutros(n); e.target.value=''; alert(`Outro Saved! Duration: ${Math.round(dur)}s`)
  }
  const addAnimatedIntro = (isOutro=false)=>{
    if(!animTitle.trim()) return alert('Add title')
    const item = { id: `id_${Date.now()}`, type: 'animated', data: null, duration: 5, title: animTitle, subtitle: animSub }
    if(isOutro){ const n=[...outros, item]; saveOutros(n) } else { const n=[...intros, item]; saveIntros(n) }
    alert('Animated Saved! (5s)')
  }
  const playItem = (item:any, onEnd?:()=>void)=>{
    setPlaying(item)
    if(item.type==='video'){
      setTimeout(()=>{ introVideoRef.current?.play() },300)
    } else {
      setTimeout(()=>{ setPlaying(null); if(onEnd) onEnd() }, item.duration*1000)
    }
  }
  const playActiveIntroThen = (cb:()=>void)=>{
    const active = intros.find(i=>i.id===activeIntroId)
    if(!active){ cb(); return }
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
      const w = lowData ? 640 : 1280
      const h = lowData ? 480 : 720
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:newFacing, width:{ideal:w}, height:{ideal:h}}, audio:true})
      streamRef.current = s; trackRef.current = s.getVideoTracks()[0]
      if(videoRef.current){ videoRef.current.srcObject = s; await videoRef.current.play() }
      setFacing(newFacing); setIsCam(true)
    }catch(e:any){ alert('Camera: '+e.message) }
  }
  const stopCamera = ()=>{ 
    if(isRecording) stopRecording(); 
    streamRef.current?.getTracks().forEach(t=>t.stop()); 
    if(videoRef.current) videoRef.current.srcObject=null; 
    setIsCam(false); setIsLive(false); setTorch(false); setYtLive(false); stopTimer()
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
        const data = await res.json(); if(data.error) throw new Error(JSON.stringify(data.error)); setFbStreamUrl(data.stream_url); setLiveId(data.id); setIsLive(true); startTimer(); alert('FB LIVE AFTER INTRO!')
      }catch(e:any){ alert('Auto Live needs approval: '+e.message); setIsLive(true); startTimer() }
    })
  }
  const openBibleApp = ()=>{ setShowBible(true) }
  
  const fetchBible = async (overrideQuery?: string)=>{
    const queryToUse = overrideQuery || bibleQuery
    if(!queryToUse.trim()) return
    setBibleLoading(true)
    setBibleResult('')
    const qLower = queryToUse.toLowerCase().trim()
    const getOffline = (q: string)=>{
      try{
        const cache = JSON.parse(localStorage.getItem('taglive_bible_cache')||'{}')
        if(cache[q]) return cache[q] + ' [CACHED]'
      }catch{}
      if(OFFLINE_KJV[q]) return OFFLINE_KJV[q] + ' [OFFLINE KJV]'
      const found = Object.keys(OFFLINE_KJV).find(k=> q.includes(k) || k.includes(q))
      if(found) return OFFLINE_KJV[found] + ' [OFFLINE KJV]'
      return null
    }
    try{
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(queryToUse)}?translation=${bibleVer}`)
      const data = await res.json()
      if(data.text){
        const full = `${data.reference} (${bibleVer.toUpperCase()}) - ${data.text}`
        setBibleResult(full)
        try{
          const cache = JSON.parse(localStorage.getItem('taglive_bible_cache')||'{}')
          cache[qLower]=full
          localStorage.setItem('taglive_bible_cache', JSON.stringify(cache))
        }catch{}
      } else {
        throw new Error('not found')
      }
    }catch{
      const off = getOffline(qLower)
      if(off){ setBibleResult(off) }
      else { setBibleResult('Not found offline. Try John 3:16, Romans 1:20, Psalm 23. For other verses, check internet connection and try again.') }
    }
    setBibleLoading(false)
  }

  const useBibleVerse = ()=>{
    if(bibleResult){ setVerse(bibleResult); setShowBible(false) }
  }

  // AUTO DETECT LOGIC
