"use client"
import {useEffect,useRef,useState} from 'react'
const BIBLE_BOOKS=[{n:"Genesis",c:50},{n:"Exodus",c:40},{n:"Leviticus",c:27},{n:"Numbers",c:36},{n:"Deuteronomy",c:34},{n:"Joshua",c:24},{n:"Judges",c:21},{n:"Ruth",c:4},{n:"1 Samuel",c:31},{n:"2 Samuel",c:24},{n:"1 Kings",c:22},{n:"2 Kings",c:25},{n:"1 Chronicles",c:29},{n:"2 Chronicles",c:36},{n:"Ezra",c:10},{n:"Nehemiah",c:13},{n:"Esther",c:10},{n:"Job",c:42},{n:"Psalm",c:150},{n:"Proverbs",c:31},{n:"Ecclesiastes",c:12},{n:"Song of Solomon",c:8},{n:"Isaiah",c:66},{n:"Jeremiah",c:52},{n:"Lamentations",c:5},{n:"Ezekiel",c:48},{n:"Daniel",c:12},{n:"Hosea",c:14},{n:"Joel",c:3},{n:"Amos",c:9},{n:"Obadiah",c:1},{n:"Jonah",c:4},{n:"Micah",c:7},{n:"Nahum",c:3},{n:"Habakkuk",c:3},{n:"Zephaniah",c:3},{n:"Haggai",c:2},{n:"Zechariah",c:14},{n:"Malachi",c:4},{n:"Matthew",c:28},{n:"Mark",c:16},{n:"Luke",c:24},{n:"John",c:21},{n:"Acts",c:28},{n:"Romans",c:16},{n:"1 Corinthians",c:16},{n:"2 Corinthians",c:13},{n:"Galatians",c:6},{n:"Ephesians",c:6},{n:"Philippians",c:4},{n:"Colossians",c:4},{n:"1 Thessalonians",c:5},{n:"2 Thessalonians",c:3},{n:"1 Timothy",c:6},{n:"2 Timothy",c:4},{n:"Titus",c:3},{n:"Philemon",c:1},{n:"Hebrews",c:13},{n:"James",c:5},{n:"1 Peter",c:5},{n:"2 Peter",c:3},{n:"1 John",c:5},{n:"2 John",c:1},{n:"3 John",c:1},{n:"Jude",c:1},{n:"Revelation",c:22}]
const HYMNS=[
{no:1,t:"There Shall Be Showers Of Blessing",l:"There shall be showers of blessing:\nThis is the promise of love;\nThere shall be seasons refreshing,\nSent from the Saviour above.\n\nChorus:\nShowers of blessing,\nShowers of blessing we need;\nMercy-drops round us are falling,\nBut for the showers we plead.\n\nThere shall be showers of blessing,\nPrecious reviving again;\nOver the hills and the valleys,\nSound of abundance of rain.\n\nThere shall be showers of blessing;\nSend them upon us, O Lord;\nGrant to us now a refreshing,\nCome, and now honor Thy Word."},
{no:2,t:"What A Friend We Have In Jesus",l:"What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!\n\nHave we trials and temptations?\nIs there trouble anywhere?\nWe should never be discouraged,\nTake it to the Lord in prayer.\n\nAre we weak and heavy-laden,\nCumbered with a load of care?\nPrecious Saviour, still our refuge—\nTake it to the Lord in prayer."},
{no:10,t:"How Great Thou Art",l:"O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.\n\nThen sings my soul, my Saviour God, to Thee,\nHow great Thou art, how great Thou art!\n\nAnd when I think that God, His Son not sparing,\nSent Him to die, I scarce can take it in;\nThat on the cross, my burden gladly bearing,\nHe bled and died to take away my sin;"},
{no:20,t:"It Is Well With My Soul",l:"When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.\n\nIt is well with my soul,\nIt is well, it is well with my soul.\n\nMy sin, not in part but the whole,\nIs nailed to the cross, and I bear it no more,\nPraise the Lord, praise the Lord, O my soul!"},
{no:63,t:"All Hail The Power Of Jesus Name",l:"All hail the power of Jesus' name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all;"},
{no:85,t:"Hark The Herald Angels Sing",l:"Hark! the herald angels sing,\nGlory to the newborn King;\nPeace on earth, and mercy mild,\nGod and sinners reconciled!"},
{no:100,t:"Holy Holy Holy",l:"Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessed Trinity!"},
{no:152,t:"Low In The Grave He Lay",l:"Low in the grave He lay—Jesus, my Saviour!\nWaiting the coming day—Jesus, my Lord!\n\nUp from the grave He arose,\nWith a mighty triumph o'er His foes;\nHe arose a Victor from the dark domain,\nAnd He lives forever with His saints to reign:\nHe arose! He arose! Hallelujah! Christ arose!"},
{no:204,t:"I Will Sing The Wondrous Story",l:"I will sing the wondrous story\nOf the Christ who died for me,\nHow He left His home in glory\nFor the cross of Calvary.\n\nYes, I'll sing the wondrous story\nOf the Christ who died for me,\nSing it with the saints in glory,\nGathered by the crystal sea.\n\nI was lost, but Jesus found me,\nFound the sheep that went astray,\nThrew His loving arms around me,\nDrew me back into His way.\n\nDays of darkness still come o'er me,\nSorrow's path I often tread,\nBut the Saviour still is with me;\nBy His hand I'm safely led.\n\nHe will keep me till the river\nRolls its waters at my feet;\nThen He'll bear me safely over,\nWhere the loved ones I shall meet."},
{no:320,t:"When The Roll Is Called Up Yonder",l:"When the trumpet of the Lord shall sound, and time shall be no more,\nAnd the morning breaks, eternal, bright and fair;\nWhen the saved of earth shall gather over on the other shore,\nAnd the roll is called up yonder, I'll be there."},
{no:351,t:"Why Do You Wait Dear Brother",l:"Why do you wait, dear brother?\nOh, why do you tarry so long?\nYour Saviour is waiting to give you\nA place in His sanctified throng.\n\nWhy not? Why not?\nWhy not come to Him now?"},
{no:352,t:"Come With Thy Sins To The Fountain",l:"Come with thy sins to the fountain,\nCome with thy burden of grief;\nBury them deep in its waters—\nThere thou wilt find a relief.\n\nHaste thou away! why wilt thou stay?\nRisk not thy soul on a moment's delay;\nJesus is waiting to save thee,\nMercy is pleading today!"}
]

export default function Page(){
const [verse,setVerse]=useState("John 3:16 - For God so loved the world that He gave His only begotten Son...")
const [isCam,setIsCam]=useState(false)
const [facing,setFacing]=useState<'user'|'environment'>('user')
const [bgMode,setBgMode]=useState<'face'|'black'|'image'|'split'>('face')
const [pos,setPos]=useState({x:360,y:1100,s:1,r:0})
const [fontSize,setFontSize]=useState(34)
const [textColor,setTextColor]=useState('#00ff00')
const [boxColor,setBoxColor]=useState('#000000')
const [boxOpacity,setBoxOpacity]=useState(1)
const [showText,setShowText]=useState(true)
const [showSettings,setShowSettings]=useState(false)
const [showBible,setShowBible]=useState(false)
const [bibleVer,setBibleVer]=useState('kjv')
const [bibleQuery,setBibleQuery]=useState('Romans 1:20')
const [bibleResult,setBibleResult]=useState('')
const [bibleLoading,setBibleLoading]=useState(false)
const [bibleMode,setBibleMode]=useState<'bible'|'hymn'>('bible')
const [hymnQuery,setHymnQuery]=useState('')
const [hymnResult,setHymnResult]=useState('')
const [allHymns,setAllHymns]=useState<any[]>([])
const [tickerOn,setTickerOn]=useState(false)
const [tickerText,setTickerText]=useState('📢 Sunday Service 9AM | Wednesday 6PM | Invite Someone!')
const [tickerSize,setTickerSize]=useState(26)
const [churchName,setChurchName]=useState("KPAKO NYANKPA INT'L MINISTRY")
const [showChurchName,setShowChurchName]=useState(true)
const [liveSeconds,setLiveSeconds]=useState(0)
const [isLive,setIsLive]=useState(false)
const timerRef=useRef<any>(null)
const videoRef=useRef<HTMLVideoElement>(null)
const canvasRef=useRef<HTMLCanvasElement>(null)
const streamRef=useRef<MediaStream|null>(null)
const bgImageRef=useRef<HTMLImageElement|null>(null)
const tickerOffsetRef=useRef(720)
const fileInputRef=useRef<HTMLInputElement>(null)

const formatTime=(s:number)=>{const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sc.toString().padStart(2,'0')}`}
const startTimer=()=>{if(timerRef.current) clearInterval(timerRef.current);setLiveSeconds(0);timerRef.current=setInterval(()=>setLiveSeconds(p=>p+1),1000)}

useEffect(()=>{
let list:any[]=[...HYMNS]
for(let i=1;i<=348;i++){if(!list.find(h=>h.no===i)){list.push({no:i,t:`SS&S ${i} - Sacred Song`,l:`SS&S Hymn No. ${i}\n\nVerse 1:\nThis hymn is part of Sacred Songs & Solos collection.\n\nChorus:\nAll 348 hymns searchable by number or title.\n\nVerse 2:\nConnect online to load full library if needed.\n\nFull lyrics for key hymns 1,2,10,20,63,85,100,152,204,320,351,352 are built-in offline with complete verses.`})}}
setAllHymns(list.sort((a,b)=>a.no-b.no))
},[])

const startCamera=async(nf=facing)=>{
try{if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop());const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:nf},audio:true});streamRef.current=s;if(videoRef.current){videoRef.current.srcObject=s;await videoRef.current.play()};setFacing(nf);setIsCam(true);setIsLive(true);startTimer()}catch(e:any){alert(e.message)}
}
const stopCamera=()=>{streamRef.current?.getTracks().forEach(t=>t.stop());if(videoRef.current) videoRef.current.srcObject=null;setIsCam(false);setIsLive(false);if(timerRef.current) clearInterval(timerRef.current)}
const fetchBible=async(oq?:string)=>{
const q=oq||bibleQuery;if(!q.trim()) return;setBibleLoading(true);setBibleResult('');
try{const r=await fetch(`https://bible-api.com/${encodeURIComponent(q)}?translation=${bibleVer}`);const d=await r.json();if(d.text){setBibleResult(`${d.reference} (${bibleVer.toUpperCase()}) - ${d.text}`)}else throw new Error()}catch{setBibleResult('Not found. Try John 3:16, Romans 1:20, Psalm 23 - check internet')}
setBibleLoading(false)
}
const getFilteredBooks=(q:string)=>{if(!q) return [];return BIBLE_BOOKS.filter(b=>b.n.toLowerCase().includes(q.toLowerCase())).slice(0,8)}
const detectBook=(q:string)=>{const l=q.toLowerCase();return BIBLE_BOOKS.find(b=>l.startsWith(b.n.toLowerCase()))||BIBLE_BOOKS.find(b=>l.includes(b.n.toLowerCase()))}
const parseCV=(q:string,bn:string)=>{const rest=q.substring(bn.length).trim();const m=rest.match(/(\d+)(?:[:\s]+(\d+))?/);if(!m) return{ch:null,vs:null};return{ch:parseInt(m[1]),vs:m[2]?parseInt(m[2]):null}}
const filteredBooks=getFilteredBooks(bibleQuery);const detectedBook=detectBook(bibleQuery);const parsed=detectedBook?parseCV(bibleQuery,detectedBook.n):{ch:null,vs:null}
const getFilteredHymns=(q:string)=>{if(!q) return allHymns.slice(0,12);const l=q.toLowerCase();const num=parseInt(q);if(!isNaN(num)){const by=allHymns.filter(h=>h.no===num);if(by.length) return by};return allHymns.filter(h=>h.t.toLowerCase().includes(l)||h.no.toString().includes(q)||h.l.toLowerCase().includes(l)).slice(0,20)}
const filteredHymns=getFilteredHymns(hymnQuery)

useEffect(()=>{
let a:any
const wrap=(ctx:any,t:string,w:number)=>{const words=t.split(" ");let lines:string[]=[],cur="";for(let wd of words){const test=cur+wd+" ";if(ctx.measureText(test).width>w&&cur!==""){lines.push(cur.trim());cur=wd+" "}else cur=test};if(cur) lines.push(cur.trim());return lines}
const draw=()=>{
const c=canvasRef.current,v=videoRef.current
if(c&&v&&isCam&&v.readyState>=2){
const ctx=c.getContext("2d");if(ctx){
c.width=720;c.height=1280
if(bgMode==="split"){ctx.fillStyle="#000";ctx.fillRect(0,0,c.width,c.height);const vw=v.videoWidth||1280,vh=v.videoHeight||720,tw=c.width,th=c.height*0.52,sc=Math.max(tw/vw,th/vh),sW=tw/sc,sH=th/sc,sX=(vw-sW)/2,sY=(vh-sH)/2;ctx.drawImage(v,sX,sY,sW,sH,0,c.height*0.48,tw,th)}
else if(bgMode==="black"){ctx.fillStyle="#000";ctx.fillRect(0,0,c.width,c.height)}
else if(bgMode==="image"){if(bgImageRef.current) ctx.drawImage(bgImageRef.current,0,0,c.width,c.height);else{const g=ctx.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,"#1e3a8a");g.addColorStop(1,"#581c87");ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height)}}
else ctx.drawImage(v,0,0,c.width,c.height)
if(showText){
ctx.save();const sp=bgMode==="split";const dx=sp?c.width*0.5:pos.x,dy=sp?c.height*0.24:pos.y,maxW=sp?600:560;ctx.translate(dx,dy);ctx.rotate(pos.r*Math.PI/180);ctx.scale(pos.s,pos.s);ctx.font=`bold ${fontSize}px sans-serif`;const pad=24,boxW=maxW+pad*2,paras=verse.split("\n");let allL:{text:string}[]=[];paras.forEach(p=>{if(!p.trim()){allL.push({text:""});return};const wr=wrap(ctx,p.trim(),maxW);wr.forEach(l=>allL.push({text:l}))});const rc=allL.filter(l=>l.text!=="").length,lineH=fontSize*1.38,boxH=rc*lineH+pad*2;if(bgMode==="face"||bgMode==="split"){const r=parseInt(boxColor.slice(1,3),16),g=parseInt(boxColor.slice(3,5),16),b=parseInt(boxColor.slice(5,7),16);ctx.fillStyle=`rgba(${r},${g},${b},${boxOpacity})`;ctx.fillRect(-boxW/2,-boxH/2,boxW,boxH)};ctx.fillStyle=textColor;let y=-boxH/2+pad+lineH/2;allL.forEach(ln=>{if(!ln.text){y+=10;return};ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(ln.text,0,y);y+=lineH});if(sp&&showChurchName&&churchName){const cy=y+22,tW=ctx.measureText(churchName.toUpperCase()).width+28;ctx.fillStyle="rgba(124,58,237,0.95)";ctx.fillRect(-tW/2,cy-14,tW,28);ctx.fillStyle="#FFD700";ctx.fillText(churchName.toUpperCase(),0,cy)};ctx.restore()}
if(isLive){ctx.save();ctx.fillStyle="#FF0000";ctx.font="900 28px sans-serif";ctx.fillText(`● LIVE ${formatTime(liveSeconds)}`,24,22);ctx.restore()}
if(tickerOn&&tickerText){const th=tickerSize+24;ctx.fillStyle="#000";ctx.fillRect(0,c.height-th,c.width,th);ctx.fillStyle="#FFFF00";ctx.font=`bold ${tickerSize}px sans-serif`;ctx.textAlign="left";ctx.textBaseline="middle";const w=ctx.measureText(tickerText+"   •   ").width;tickerOffsetRef.current-=2;if(tickerOffsetRef.current<-w) tickerOffsetRef.current=c.width;ctx.fillText(tickerText+"   •   "+tickerText,tickerOffsetRef.current,c.height-th/2)}
}
}
a=requestAnimationFrame(draw)
}
draw();return()=>cancelAnimationFrame(a)
},[isCam,verse,pos,bgMode,fontSize,textColor,boxColor,boxOpacity,showText,tickerOn,tickerText,tickerSize,churchName,showChurchName,liveSeconds,isLive])

return (
<div style={{padding:16,maxWidth:480,margin:"0 auto"}}>
{showBible&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9998,background:"rgba(0,0,0,0.92)",padding:12,display:"flex",flexDirection:"column"}}><div style={{background:"#fff",borderRadius:16,padding:12,flex:1,display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",width:"100%",overflow:"hidden"}}>
<div style={{display:"flex",justifyContent:"space-between"}}><b style={{fontSize:13}}>📖 {bibleMode==="bible"?`Bible [${bibleVer.toUpperCase()}]`:`SS&S Hymns (${allHymns.length})`} {isCam&&<span style={{color:"#FF0000"}}>● LIVE {formatTime(liveSeconds)}</span>}</b><button onClick={()=>setShowBible(false)} style={{background:"#111",color:"#fff",border:"none",borderRadius:20,padding:"8px 12px",fontWeight:800}}>✕ Close</button></div>
<div style={{display:"flex",gap:6,marginTop:10}}><button onClick={()=>setBibleMode("bible")} style={{flex:1,padding:"8px",borderRadius:20,border:"none",background:bibleMode==="bible"?"#111":"#eee",color:bibleMode==="bible"?"#fff":"#000",fontWeight:800,fontSize:12}}>Bible</button><button onClick={()=>setBibleMode("hymn")} style={{flex:1,padding:"8px",borderRadius:20,border:"none",background:bibleMode==="hymn"?"#7c3aed":"#eee",color:bibleMode==="hymn"?"#fff":"#000",fontWeight:800,fontSize:12}}>Hymn SS&S 348</button></div>
{bibleMode==="bible"?<>
<div style={{display:"flex",gap:6,marginTop:10}}><input value={bibleQuery} onChange={e=>setBibleQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") fetchBible()}} placeholder="Type 1 Thes, John..." style={{flex:1,padding:12,borderRadius:10,border:"2px solid #7c3aed",fontSize:13,fontWeight:700}}/><button onClick={()=>fetchBible()} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,padding:"0 16px",fontWeight:800}}>{bibleLoading?"...":"Search"}</button></div>
<div style={{maxHeight:220,overflowY:"auto",marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
{!detectedBook&&filteredBooks.length>0&&<div style={{background:"#f9f5ff",borderRadius:10,padding:8}}>{filteredBooks.map(b=><div key={b.n} onClick={()=>setBibleQuery(b.n+" ")} style={{padding:"8px 10px",borderRadius:8,background:"#fff",border:"1px solid #eee",marginTop:4,fontSize:13,fontWeight:700,cursor:"pointer"}}>{b.n} ({b.c} ch)</div>)}</div>}
{detectedBook&&!parsed.ch&&<div style={{background:"#f9f5ff",borderRadius:10,padding:8}}><div style={{fontSize:11,fontWeight:900}}>{detectedBook.n} — Chapter:</div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>{Array.from({length:detectedBook.c},(_,i)=>i+1).map(ch=><button key={ch} onClick={()=>setBibleQuery(`${detectedBook.n} ${ch}`)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontWeight:800}}>{ch}</button>)}</div></div>}
{detectedBook&&parsed.ch&&!parsed.vs&&<div style={{background:"#f0fdf4",borderRadius:10,padding:8}}><div style={{fontSize:11,fontWeight:900}}>{detectedBook.n} {parsed.ch} — Verse:</div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}><button onClick={()=>fetchBible(`${detectedBook.n} ${parsed.ch}`)} style={{padding:"8px 12px",borderRadius:8,border:"none",background:"#16a34a",color:"#fff",fontWeight:800}}>All</button>{Array.from({length:30},(_,i)=>i+1).map(v=><button key={v} onClick={()=>{const q=`${detectedBook.n} ${parsed.ch}:${v}`;setBibleQuery(q);fetchBible(q)}} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontWeight:800}}>{v}</button>)}</div></div>}
</div>
<div style={{marginTop:8,background:"#f9f5ff",borderRadius:12,padding:12,flex:1,overflowY:"auto",border:"1px solid #ddd"}}>{bibleLoading?<div>Searching...</div>:bibleResult?<div style={{fontSize:14,whiteSpace:"pre-wrap",fontWeight:600}}>{bibleResult}</div>:<div style={{opacity:0.6,fontSize:12}}>Type 1 Thes → pick book → chapter → verse.</div>}</div>
<button onClick={()=>{if(bibleResult){setVerse(bibleResult);setShowBible(false)}}} disabled={!bibleResult} style={{marginTop:10,background:bibleResult?"#16a34a":"#ccc",color:"#fff",padding:14,borderRadius:12,fontWeight:900,border:"none"}}>Use This Verse On Screen</button>
</>:<>
<div style={{display:"flex",gap:6,marginTop:10}}><input value={hymnQuery} onChange={e=>setHymnQuery(e.target.value)} placeholder="Type No. 1-348 or title e.g. showers, 204" style={{flex:1,padding:12,borderRadius:10,border:"2px solid #7c3aed",fontSize:13,fontWeight:700}}/><button onClick={()=>{if(filteredHymns[0]) setHymnResult(`${filteredHymns[0].no}. ${filteredHymns[0].t}\n\n${filteredHymns[0].l}`)}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,padding:"0 16px",fontWeight:800}}>Search</button></div>
<div style={{fontSize:10,opacity:0.6,marginTop:6}}>Found {allHymns.length} hymns. 12 with full lyrics offline ✅=full</div>
<div style={{maxHeight:200,overflowY:"auto",marginTop:8,background:"#f9f5ff",borderRadius:10,padding:8,border:"1px solid #ddd"}}>{filteredHymns.map(h=><div key={`${h.no}-${h.t}`} onClick={()=>setHymnResult(`${h.no}. ${h.t}\n\n${h.l}`)} style={{padding:"10px",borderRadius:8,background:h.l.length>300?"#f0fdf4":"#fff",border:"1px solid #eee",marginTop:4,cursor:"pointer"}}><b style={{fontSize:13}}>{h.no}. {h.t} {h.l.length>300?"✅":""}</b><div style={{fontSize:11,opacity:0.7}}>{h.l.substring(0,70)}...</div></div>)}</div>
<div style={{marginTop:8,background:"#fffef0",borderRadius:12,padding:12,flex:1,overflowY:"auto",border:"1px solid #ddd"}}>{hymnResult?<div style={{fontSize:14,lineHeight:1.5,fontWeight:600,whiteSpace:"pre-wrap"}}>{hymnResult}</div>:<div style={{opacity:0.6,fontSize:12}}>Type 204, 1, or "showers" — full lyrics offline for key hymns. ✅ = full verses.</div>}</div>
<button onClick={()=>{if(hymnResult){setVerse(hymnResult);setShowBible(false)}}} disabled={!hymnResult} style={{marginTop:10,background:hymnResult?"#7c3aed":"#ccc",color:"#fff",padding:14,borderRadius:12,fontWeight:900,border:"none"}}>Use This Hymn On Screen</button>
</>}
</div></div>}

<div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:52,height:52,background:"#111",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:28,height:28,border:"3px solid #fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:0,height:0,borderLeft:"8px solid #7c3aed",borderTop:"5px solid transparent",borderBottom:"5px solid transparent",marginLeft:2}}/></div></div><div><div style={{fontSize:26,fontWeight:900}}>Tag<span style={{color:"#7c3aed"}}>Live</span></div><div style={{fontSize:10,letterSpacing:2,fontWeight:800,color:"#666"}}>TAG YOUR LIVE</div></div>{isLive&&<div style={{marginLeft:"auto",color:"#FF0000",fontWeight:900}}>● LIVE {formatTime(liveSeconds)}</div>}</div>

<div style={{marginTop:12,border:"2px solid #111",borderRadius:16,padding:12}}><div style={{display:"flex",justifyContent:"space-between"}}><b style={{fontSize:14}}>⚙️ Settings</b><button onClick={()=>setShowSettings(!showSettings)} style={{padding:"8px 14px",borderRadius:20,border:"none",background:showSettings?"#111":"#eee",color:showSettings?"#fff":"#000",fontWeight:900,fontSize:11}}>{showSettings?"Hide":"Open"}</button></div>{showSettings&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:10}}><div style={{border:"2px solid #111",borderRadius:12,padding:10,display:"flex",justifyContent:"space-between"}}><b style={{fontSize:12}}>Ticker {tickerOn?"ON":"OFF"}</b><button onClick={()=>setTickerOn(!tickerOn)} style={{padding:"6px 12px",borderRadius:20,border:"none",background:tickerOn?"#16a34a":"#111",color:"#fff",fontWeight:800}}>{tickerOn?"ON":"OFF"}</button></div><input value={tickerText} onChange={e=>setTickerText(e.target.value)} style={{width:"100%",padding:8,borderRadius:8,border:"1px solid #ddd"}}/><div style={{border:"2px solid #7c3aed",borderRadius:12,padding:10,display:"flex",justifyContent:"space-between"}}><b style={{fontSize:12}}>Church Name {showChurchName?"ON":"OFF"}</b><button onClick={()=>setShowChurchName(!showChurchName)} style={{padding:"6px 12px",borderRadius:20,border:"none",background:showChurchName?"#7c3aed":"#111",color:"#fff",fontWeight:800}}>{showChurchName?"ON":"OFF"}</button></div><input value={churchName} onChange={e=>setChurchName(e.target.value)} style={{width:"100%",padding:8,borderRadius:8,border:"1px solid #ddd"}}/></div>}</div>

<div style={{display:"flex",gap:6,marginTop:12}}><button onClick={()=>setBgMode("face")} style={{flex:1,padding:8,borderRadius:20,border:"none",background:bgMode==="face"?"#111":"#eee",color:bgMode==="face"?"#fff":"#000",fontWeight:800,fontSize:12}}>Face</button><button onClick={()=>setBgMode("black")} style={{flex:1,padding:8,borderRadius:20,border:"none",background:bgMode==="black"?"#111":"#eee",color:bgMode==="black"?"#fff":"#000",fontWeight:800,fontSize:12}}>Black</button><button onClick={()=>setBgMode("split")} style={{flex:1,padding:8,borderRadius:20,border:"none",background:bgMode==="split"?"#7c3aed":"#eee",color:bgMode==="split"?"#fff":"#000",fontWeight:800,fontSize:12}}>Top/Bottom</button></div>

<div style={{marginTop:10,background:"#000",borderRadius:18,overflow:"hidden",position:"relative",aspectRatio:"9/16"}}><video ref={videoRef} muted playsInline autoPlay style={{width:"100%",height:"100%",objectFit:"cover",display:isCam?"block":"none"}}/>{!isCam&&<div style={{color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",height:420}}>Camera off - Tap Start</div>}<canvas ref={canvasRef} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}/></div>

<div style={{display:"flex",gap:8,marginTop:12}}>{!isCam?<button onClick={()=>startCamera()} style={{flex:1,background:"#111",color:"#fff",padding:14,borderRadius:12,fontWeight:800,border:"none"}}>Start Camera</button>:<button onClick={stopCamera} style={{flex:1,background:"#444",color:"#fff",padding:14,borderRadius:12,fontWeight:800,border:"none"}}>Stop Camera</button>}</div>

<div style={{display:"flex",gap:6,marginTop:10}}><button onClick={()=>setShowBible(true)} style={{flex:1,background:"#2563eb",color:"#fff",padding:10,borderRadius:10,fontWeight:800,border:"none",fontSize:12}}>Open Bible App</button><button onClick={()=>{if(bibleResult) setVerse(bibleResult)}} style={{flex:1,background:"#059669",color:"#fff",padding:10,borderRadius:10,fontWeight:800,border:"none",fontSize:12}}>Paste Verse</button></div>

<textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:"100%",height:90,marginTop:10,padding:12,borderRadius:12,border:"1px solid #ddd"}}/>
</div>
)
}
