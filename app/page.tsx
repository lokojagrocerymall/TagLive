"use client"
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://gqifluvkrjzsebfdjcio.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaWZsdXZrcmp6c2ViZmRqY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzY4NDgsImV4cCI6MjEwNzk1Mjg0OH0.zonQMk22nXN0VsbHyI88hT27ntl-VxEEi8k2G8-k5lc'
);

const OFFLINE_KJV: Record<string,string> = {
  "john 3:16": "John 3:16 - For God so loved the world...",
  "romans 1:20": "Romans 1:20 - For the invisible things of Him...",
  "psalm 23": "Psalm 23 - The LORD is my shepherd..."
};

export default function LiveStudio(){
  const [verse,setVerse] = useState("John 3:16 - For God so loved the world...");
  const [isCam,setIsCam] = useState(false);
  const [isLive,setIsLive] = useState(false);
  const [facing,setFacing] = useState<'user'|'environment'>('user');
  const [torch,setTorch] = useState(false);
  const [fbUser,setFbUser] = useState<any>(null);
  const [pages,setPages] = useState<any[]>([]);
  const [selectedPage,setSelectedPage] = useState<any>(null);
  const [pos,setPos] = useState({x:360,y:1100,scale:1,rotation:0});
  const [bgMode,setBgMode] = useState<'face'|'black'|'image'|'split'>('face');
  const [saved,setSaved] = useState<string[]>([]);
  const [dragging,setDragging] = useState(false);
  const [fontSize,setFontSize] = useState(34);
  const [bgImage,setBgImage] = useState<string|null>(null);
  const [ytKey,setYtKey] = useState('');
  const [ytLive,setYtLive] = useState(false);
  const [textColor,setTextColor] = useState('#00ff00');
  const [boxColor,setBoxColor] = useState('#000000');
  const [boxOpacity,setBoxOpacity] = useState(1);
  const [logoImage,setLogoImage] = useState<string|null>(null);
  const [logoPos,setLogoPos] = useState({x:360,y:300,scale:0.7,rotation:0});
  const [isRecording,setIsRecording] = useState(false);
  const [recordedUrl,setRecordedUrl] = useState<string|null>(null);
  const [selected,setSelected] = useState<'text'|'logo'>('text');
  const [isAdmin,setIsAdmin] = useState(false);
  const [intros,setIntros] = useState<any[]>([]);
  const [outros,setOutros] = useState<any[]>([]);
  const [activeIntroId,setActiveIntroId] = useState<string|null>(null);
  const [activeOutroId,setActiveOutroId] = useState<string|null>(null);
  const [showStudio,setShowStudio] = useState(false);
  const [showSettings,setShowSettings] = useState(true);
  const [broadcastPlaying,setBroadcastPlaying] = useState<any>(null);
  const [tickerText,setTickerText] = useState('ANNOUNCEMENT: Sunday Service 9AM | Wednesday 6PM');
  const [tickerOn,setTickerOn] = useState(false);
  const [tickerSize,setTickerSize] = useState(26);
  const [tickerSpeed,setTickerSpeed] = useState(2);
  const [churchName,setChurchName] = useState("KPAKO NYANKPA INT'L MINISTRY");
  const [showChurchName,setShowChurchName] = useState(true);
  const [liveSeconds,setLiveSeconds] = useState(0);
  const timerRef = useRef<any>(null);
  const [showBible,setShowBible] = useState(false);
  const [bibleQuery,setBibleQuery] = useState('Romans 1:20');
  const [bibleResult,setBibleResult] = useState('');
  const [bibleLoading,setBibleLoading] = useState(false);
  const tickerOffsetRef = useRef(720);

  const introFileRef = useRef<HTMLInputElement>(null);
  const outroFileRef = useRef<HTMLInputElement>(null);
  const broadcastVideoRef = useRef<HTMLVideoElement>(null);
  const broadcastImageRef = useRef<HTMLImageElement|null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream|null>(null);
  const trackRef = useRef<MediaStreamTrack|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgImageRef = useRef<HTMLImageElement|null>(null);
  const logoImageRef = useRef<HTMLImageElement|null>(null);
  const recorderRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const churchLogoInputRef = useRef<HTMLInputElement>(null);
  const lastTouch = useRef({dist:0,angle:0,selScale:1,selRot:0});

  const formatTime = (s:number)=>{
    const h = Math.floor(s/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s%60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const startTimer = ()=>{
    if(timerRef.current) clearInterval(timerRef.current);
    setLiveSeconds(0);
    timerRef.current = setInterval(()=> setLiveSeconds(v=>v+1), 1000);
  };
  const stopTimer = ()=>{
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setLiveSeconds(0);
  };

  useEffect(()=>{
    const id='1951327349161990';
    if(!document.getElementById('fb-sdk')){
      const s=document.createElement('script');
      s.id='fb-sdk';
      s.src='https://connect.facebook.net/en_US/sdk.js';
      s.onload=()=>{
        (window as any).FB.init({appId:id,cookie:true,xfbml:false,version:'v19.0'});
      };
      document.body.appendChild(s);
    }
    try{
      const a=localStorage.getItem('taglive_saved');
      if(a) setSaved(JSON.parse(a));
      const b=localStorage.getItem('taglive_ytkey');
      if(b) setYtKey(b);
      const c=localStorage.getItem('taglive_intros');
      if(c) setIntros(JSON.parse(c));
      const d=localStorage.getItem('taglive_outros');
      if(d) setOutros(JSON.parse(d));
      const e=localStorage.getItem('taglive_active_intro');
      if(e) setActiveIntroId(e);
      const f=localStorage.getItem('taglive_active_outro');
      if(f) setActiveOutroId(f);
      const g=localStorage.getItem('taglive_ticker_text');
      if(g) setTickerText(g);
      const i=localStorage.getItem('taglive_church_name');
      if(i) setChurchName(i);
      const j=localStorage.getItem('taglive_church_logo');
      if(j){
        setLogoImage(j);
        const im=new Image();
        im.src=j;
        im.onload=()=>{logoImageRef.current=im;};
      }
    }catch{}
  },[]);

  const fileToBase64 = (f:File)=> new Promise<string>((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result as string);
    r.onerror=rej;
    r.readAsDataURL(f);
  });

  const getDur = (b:string)=> new Promise<number>((res)=>{
    const v=document.createElement('video');
    v.src=b;
    v.onloadedmetadata=()=>res(v.duration);
    setTimeout(()=>res(8),2000);
  });

  const saveIntros = (a:any[])=>{
    setIntros(a);
    localStorage.setItem('taglive_intros',JSON.stringify(a));
  };
  const saveOutros = (a:any[])=>{
    setOutros(a);
    localStorage.setItem('taglive_outros',JSON.stringify(a));
  };

  const handleIntroFile = async(e:any)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const b=await fileToBase64(f);
    let d=5;
    if(f.type.startsWith('video')) d=await getDur(b);
    const it={id:`id_${Date.now()}`,type:f.type.startsWith('video')?'video':'image',data:b,title:`Intro ${f.name.substring(0,20)}`,duration:d};
    const n=[...intros,it];
    saveIntros(n);
    setActiveIntroId(it.id);
    localStorage.setItem('taglive_active_intro',it.id);
    e.target.value='';
  };

  const handleOutroFile = async(e:any)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const b=await fileToBase64(f);
    let d=5;
    if(f.type.startsWith('video')) d=await getDur(b);
    const it={id:`id_${Date.now()}`,type:f.type.startsWith('video')?'video':'image',data:b,title:`Outro ${f.name.substring(0,20)}`,duration:d};
    const n=[...outros,it];
    saveOutros(n);
    setActiveOutroId(it.id);
    localStorage.setItem('taglive_active_outro',it.id);
    e.target.value='';
  };

  const startCamera = async(nf=facing)=>{
    try{
      if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop());
      await new Promise(r=>setTimeout(r,300));
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:nf,width:{ideal:1280},height:{ideal:720}},audio:true});
      streamRef.current=s;
      trackRef.current=s.getVideoTracks()[0];
      if(videoRef.current){
        videoRef.current.srcObject=s;
        await videoRef.current.play();
      }
      setFacing(nf);
      setIsCam(true);
    }catch(e:any){alert(e.message);}
  };

  const stopCamera = ()=>{
    if(isRecording) stopRecordingFinal();
    streamRef.current?.getTracks().forEach(t=>t.stop());
    if(videoRef.current) videoRef.current.srcObject=null;
    setIsCam(false);
    setIsLive(false);
    setTorch(false);
    setYtLive(false);
    stopTimer();
  };

  const toggleCamera = async()=>{
    await startCamera(facing==='user'?'environment':'user');
  };

  const toggleTorch = async()=>{
    try{
      const t:any=trackRef.current;
      if(!t?.getCapabilities?.()?.torch) return alert('No torch');
      await t.applyConstraints({advanced:[{torch:!torch}] as any});
      setTorch(!torch);
    }catch(e:any){alert(e.message);}
  };

  const loginFacebook = ()=>{
    if(!(window as any).FB){alert('Wait FB loading');return;}
    (window as any).FB.login((r:any)=>{
      if(r.authResponse){
        (window as any).FB.api('/me?fields=name',(u:any)=>{
          setFbUser(u);
          loadPages(r.authResponse.accessToken);
        });
      }
    },{scope:'public_profile,pages_show_list,pages_read_engagement,business_management'});
  };

  const loadPages = (tok?:string)=>{
    const t=tok||(window as any).FB?.getAuthResponse()?.accessToken;
    if(!t) return alert('Login first');
    (window as any).FB.api('/me/accounts',{access_token:t},(res:any)=>{
      if(res.data?.length) setPages(res.data);
      else alert('No pages');
    });
  };

  const createFbLiveAuto = async(page:any)=>{
    const active=intros.find(i=>i.id===activeIntroId);
    if(active){
      setBroadcastPlaying(active);
      if(active.type==='image'){
        const im=new Image();
        im.src=active.data;
        im.onload=()=>{broadcastImageRef.current=im;};
      }
      if(active.type==='video'&&broadcastVideoRef.current){
        broadcastVideoRef.current.src=active.data;
        broadcastVideoRef.current.muted=false;
        broadcastVideoRef.current.volume=1;
        broadcastVideoRef.current.play().catch(()=>{});
      }
      setTimeout(()=>{
        setBroadcastPlaying(null);
        broadcastImageRef.current=null;
        setSelectedPage(page);
        setIsLive(true);
        startTimer();
      },(active.duration||5)*1000);
    }else{
      setSelectedPage(page);
      setIsLive(true);
      startTimer();
    }
  };

  const fetchBible = async()=>{
    const q=bibleQuery.trim();
    if(!q) return;
    setBibleLoading(true);
    try{
      const r=await fetch(`https://bible-api.com/${encodeURIComponent(q)}?translation=kjv`);
      const d=await r.json();
      if(d.text) setBibleResult(`${d.reference} - ${d.text}`);
      else throw new Error();
    }catch{
      setBibleResult(OFFLINE_KJV[q.toLowerCase()]||'Not found. Try John 3:16');
    }
    setBibleLoading(false);
  };

  const saveVerse = ()=>{
    if(!verse.trim()) return;
    const ns=[verse,...saved.filter(s=>s!==verse)].slice(0,20);
    setSaved(ns);
    localStorage.setItem('taglive_saved',JSON.stringify(ns));
  };

  const pickMedia = ()=> fileInputRef.current?.click();
  const pickLogo = ()=> logoInputRef.current?.click();

  const onFilePick = (e:any)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const u=URL.createObjectURL(f);
    setBgImage(u);
    setBgMode('image');
    const im=new Image();
    im.src=u;
    im.onload=()=>{bgImageRef.current=im;};
  };

  const onLogoPick = async(e:any)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const b=await fileToBase64(f);
    setLogoImage(b);
    localStorage.setItem('taglive_church_logo',b);
    const im=new Image();
    im.src=b;
    im.onload=()=>{logoImageRef.current=im;};
    setSelected('logo');
  };

  const handleChurchLogoPick = async(e:any)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const b=await fileToBase64(f);
    setLogoImage(b);
    localStorage.setItem('taglive_church_logo',b);
    const im=new Image();
    im.src=b;
    im.onload=()=>{logoImageRef.current=im;};
  };

  const removeChurchLogo = ()=>{
    localStorage.removeItem('taglive_church_logo');
    setLogoImage(null);
    logoImageRef.current=null;
    if(churchLogoInputRef.current) churchLogoInputRef.current.value='';
    if(logoInputRef.current) logoInputRef.current.value='';
  };
    const startRecording = async()=>{
    const c=canvasRef.current;
    if(!c) return;
    c.width=720;
    c.height=1280;
    const cs=(c as any).captureStream(30) as MediaStream;
    const mts=streamRef.current?.getAudioTracks()||[];
    mts.forEach((t:any)=>cs.addTrack(t));

    const active=intros.find(i=>i.id===activeIntroId);
    if(active){
      setBroadcastPlaying(active);
      if(active.type==='image'){
        const im=new Image();
        im.src=active.data;
        im.onload=()=>{broadcastImageRef.current=im;};
      }else if(active.type==='video'&&broadcastVideoRef.current){
        broadcastVideoRef.current.src=active.data;
        broadcastVideoRef.current.muted=false;
        broadcastVideoRef.current.volume=1;
        broadcastVideoRef.current.crossOrigin="anonymous";
        try{
          await broadcastVideoRef.current.play();
          const vs=(broadcastVideoRef.current as any).captureStream?.();
          if(vs){
            vs.getAudioTracks().forEach((at:MediaStreamTrack)=>{
              try{cs.addTrack(at);}catch{}
            });
          }
        }catch{}
      }
      setTimeout(()=>{
        setBroadcastPlaying(null);
        broadcastImageRef.current=null;
      },(active.duration||5)*1000);
    }

    chunksRef.current=[];
    let mime='video/mp4';
    if(!MediaRecorder.isTypeSupported('video/mp4')){
      if(MediaRecorder.isTypeSupported('video/webm;codecs=h264')) mime='video/webm;codecs=h264';
      else mime='video/webm;codecs=vp9';
    }
    const rec=new MediaRecorder(cs,{mimeType:mime});
    rec.ondataavailable=(e)=>{if(e.data.size>0) chunksRef.current.push(e.data);};
    rec.onstop=()=>{
      const b=new Blob(chunksRef.current,{type:'video/mp4'});
      setRecordedUrl(URL.createObjectURL(b));
    };
    rec.start(100);
    recorderRef.current=rec;
    setIsRecording(true);
    startTimer();
  };

  const stopRecordingFinal = ()=>{
    recorderRef.current?.stop();
    setIsRecording(false);
    setBroadcastPlaying(null);
    broadcastImageRef.current=null;
    if(broadcastVideoRef.current){
      try{broadcastVideoRef.current.pause();broadcastVideoRef.current.src='';}catch{}
    }
    if(!isLive&&!ytLive) stopTimer();
  };

  const stopRecording = async()=>{
    const active=outros.find(o=>o.id===activeOutroId);
    if(active&&isRecording){
      setBroadcastPlaying(active);
      if(active.type==='image'){
        const im=new Image();
        im.src=active.data;
        im.onload=()=>{broadcastImageRef.current=im;};
        setTimeout(()=>{stopRecordingFinal();},(active.duration||5)*1000);
      }else if(active.type==='video'&&broadcastVideoRef.current){
        broadcastVideoRef.current.src=active.data;
        broadcastVideoRef.current.muted=false;
        broadcastVideoRef.current.volume=1;
        broadcastVideoRef.current.crossOrigin="anonymous";
        try{await broadcastVideoRef.current.play();}catch{}
        broadcastVideoRef.current.onended=()=>{stopRecordingFinal();};
        setTimeout(()=>{stopRecordingFinal();},(active.duration||7)*1000);
      }else{
        setTimeout(()=>{stopRecordingFinal();},(active.duration||5)*1000);
      }
    }else{
      stopRecordingFinal();
    }
  };

  const onTouchStart = (e:any)=>{
    const rect=canvasRef.current?.getBoundingClientRect();
    if(!rect) return;
    const tx=(e.touches[0].clientX-rect.left)*(720/rect.width);
    const ty=(e.touches[0].clientY-rect.top)*(1280/rect.height);
    if(logoImage&&Math.hypot(tx-logoPos.x,ty-logoPos.y)<180) setSelected('logo');
    else setSelected('text');
    setDragging(true);
    if(e.touches.length===2){
      const dx=e.touches[1].clientX-e.touches[0].clientX;
      const dy=e.touches[1].clientY-e.touches[0].clientY;
      lastTouch.current.dist=Math.hypot(dx,dy);
      lastTouch.current.angle=Math.atan2(dy,dx)*180/Math.PI;
    }
  };

  const onTouchMove = (e:any)=>{
    const rect=canvasRef.current?.getBoundingClientRect();
    if(!rect) return;
    if(e.touches.length===1&&dragging){
      const tx=e.touches[0].clientX-rect.left;
      const ty=e.touches[0].clientY-rect.top;
      const nx=tx*(720/rect.width);
      const ny=ty*(1280/rect.height);
      if(selected==='logo') setLogoPos(p=>({...p,x:nx,y:ny}));
      else setPos(p=>({...p,x:nx,y:ny}));
    }
  };

  const onTouchEnd = ()=>{
    setDragging(false);
    lastTouch.current.dist=0;
  };

  useEffect(()=>{
    let anim:any;
    const wrapText = (ctx:any,t:string,mw:number)=>{
      const w=t.split(' ');
      let ls:string[]=[];
      let cur='';
      for(let x of w){
        const te=cur+x+' ';
        if(ctx.measureText(te).width>mw&&cur!==''){
          ls.push(cur.trim());
          cur=x+' ';
        }else cur=te;
      }
      if(cur) ls.push(cur.trim());
      return ls;
    };

    const draw = ()=>{
      const c=canvasRef.current;
      const v=videoRef.current;
      if(c&&v&&isCam&&v.readyState>=2){
        const ctx=c.getContext('2d');
        if(ctx){
          if(c.width!==720||c.height!==1280){
            c.width=720;
            c.height=1280;
          }
          if(broadcastPlaying){
            ctx.fillStyle='#000';
            ctx.fillRect(0,0,c.width,c.height);
            if(broadcastPlaying.type==='image'&&broadcastImageRef.current){
              const iw=broadcastImageRef.current.width;
              const ih=broadcastImageRef.current.height;
              const r=Math.min(c.width/iw,c.height/ih);
              const nw=iw*r;
              const nh=ih*r;
              const x=(c.width-nw)/2;
              const y=(c.height-nh)/2;
              ctx.drawImage(broadcastImageRef.current,x,y,nw,nh);
            }else if(broadcastPlaying.type==='video'&&broadcastVideoRef.current&&broadcastVideoRef.current.readyState>=2){
              const vw=broadcastVideoRef.current.videoWidth;
              const vh=broadcastVideoRef.current.videoHeight;
              if(vw&&vh){
                const r=Math.min(c.width/vw,c.height/vh);
                const nw=vw*r;
                const nh=vh*r;
                const x=(c.width-nw)/2;
                const y=(c.height-nh)/2;
                ctx.drawImage(broadcastVideoRef.current,x,y,nw,nh);
              }
            }
          }else{
            if(bgMode==='black'){
              ctx.fillStyle='#000';
              ctx.fillRect(0,0,c.width,c.height);
            }else if(bgMode==='image'&&bgImageRef.current){
              const iw=bgImageRef.current.width;
              const ih=bgImageRef.current.height;
              const rc=c.width/c.height;
              const ri=iw/ih;
              let sx,sy,sw,sh;
              if(ri>rc){sh=ih;sw=ih*rc;sx=(iw-sw)/2;sy=0;}
              else{sw=iw;sh=iw/rc;sx=0;sy=(ih-sh)/2;}
              ctx.drawImage(bgImageRef.current,sx,sy,sw,sh,0,0,c.width,c.height);
            }else if(bgMode==='split'){
              ctx.fillStyle='#000';
              ctx.fillRect(0,0,c.width,c.height);
              const vw=v.videoWidth||1280;
              const vh=v.videoHeight||720;
              const tw=c.width;
              const th=c.height*0.52;
              const sc=Math.max(tw/vw,th/vh);
              const sW=tw/sc;
              const sH=th/sc;
              const sX=(vw-sW)/2;
              const sY=(vh-sH)/2;
              ctx.drawImage(v,sX,sY,sW,sH,0,c.height*0.48,tw,th);
            }else{
              ctx.drawImage(v,0,0,c.width,c.height);
            }
            if(logoImageRef.current){
              ctx.save();
              ctx.translate(logoPos.x,logoPos.y);
              ctx.rotate(logoPos.rotation*Math.PI/180);
              ctx.scale(logoPos.scale,logoPos.scale);
              ctx.drawImage(logoImageRef.current,-90,-90,180,180);
              ctx.restore();
            }
            ctx.save();
            ctx.translate(pos.x,pos.y);
            ctx.scale(pos.scale,pos.scale);
            ctx.rotate(pos.rotation*Math.PI/180);
            ctx.font=`bold ${fontSize}px sans-serif`;
            ctx.fillStyle=textColor;
            ctx.textAlign='center';
            const lines=wrapText(ctx,verse.substring(0,120),560);
            lines.forEach((ln,i)=>{
              ctx.fillText(ln,0,i*fontSize*1.2);
            });
            ctx.restore();
            if(isLive||ytLive||isRecording){
              ctx.fillStyle='#FF0000';
              ctx.font='900 28px sans-serif';
              ctx.fillText(`● LIVE ${formatTime(liveSeconds)}`,20,40);
            }
            if(tickerOn&&tickerText){
              const th=tickerSize+24;
              ctx.fillStyle='#000';
              ctx.fillRect(0,c.height-th,c.width,th);
              ctx.fillStyle='#FFFF00';
              ctx.font=`bold ${tickerSize}px sans-serif`;
              tickerOffsetRef.current-=tickerSpeed;
              if(tickerOffsetRef.current<-600) tickerOffsetRef.current=c.width;
              ctx.fillText(tickerText,tickerOffsetRef.current,c.height-th/2+4);
            }
            if(bgMode==='split'&&showChurchName&&churchName){
              ctx.save();
              ctx.translate(c.width/2,c.height*0.35);
              ctx.font='900 18px sans-serif';
              const tw=ctx.measureText(churchName.toUpperCase()).width+32;
              ctx.fillStyle='rgba(124,58,237,0.95)';
              ctx.fillRect(-tw/2,-16,tw,32);
              ctx.fillStyle='#FFD700';
              ctx.textAlign='center';
              ctx.fillText(churchName.toUpperCase(),0,6);
              ctx.restore();
            }
          }
        }
      }
      anim=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(anim);
  },[isCam,verse,isLive,pos,bgMode,fontSize,textColor,logoImage,logoPos,isRecording,selected,tickerOn,tickerText,tickerSize,tickerSpeed,churchName,showChurchName,liveSeconds,broadcastPlaying]);

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f7'}}>
      {showBible&&(
        <div style={{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.92)',padding:12,display:'flex'}}>
          <div style={{background:'#fff',borderRadius:16,padding:12,flex:1,display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto',width:'100%'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><b>Bible</b><button onClick={()=>setShowBible(false)} style={{background:'#111',color:'#fff',border:'none',borderRadius:20,padding:'8px 12px'}}>X</button></div>
            <div style={{display:'flex',gap:6,marginTop:10}}>
              <input value={bibleQuery} onChange={e=>setBibleQuery(e.target.value)} style={{flex:1,padding:12,borderRadius:10,border:'2px solid #7c3aed'}}/>
              <button onClick={fetchBible} style={{background:'#7c3aed',color:'#fff',border:'none',borderRadius:10,padding:'0 16px'}}>Go</button>
            </div>
            <div style={{marginTop:8,background:'#f9f5ff',borderRadius:12,padding:12,flex:1,overflowY:'auto'}}>{bibleLoading?'Loading...':bibleResult||'Type verse e.g. John 3:16'}</div>
            <button onClick={()=>{if(bibleResult){setVerse(bibleResult);setShowBible(false);}}} disabled={!bibleResult} style={{marginTop:10,background:'#16a34a',color:'#fff',padding:14,borderRadius:12,border:'none'}}>Use Verse</button>
          </div>
        </div>
      )}

      <div style={{background:'#fff',borderBottom:'2px solid #111',padding:'12px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:100}}>
        <div style={{fontWeight:900,fontSize:20}}>Tag<span style={{color:'#7c3aed'}}>Live</span> - Tag Your Live</div>
        {(isLive||ytLive||isRecording)&&<div style={{marginLeft:'auto',color:'#FF0000',fontWeight:900,border:'2px solid red',borderRadius:20,padding:'6px 12px',fontSize:11}}>● LIVE {formatTime(liveSeconds)}</div>}
      </div>

      <style>{`.studio{display:grid;gap:16;padding:16;max-width:1600px;margin:0 auto}@media(max-width:1023px){.studio{grid-template-columns:1fr}}@media(min-width:1024px){.studio{grid-template-columns:380px 460px 380px}}`}</style>

      <div className="studio">
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{border:'2px solid #111',borderRadius:16,padding:12,background:'#fff'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <b style={{fontSize:13}}>Studio</b>
              <button onClick={()=>setShowSettings(!showSettings)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:showSettings?'#111':'#eee',color:showSettings?'#fff':'#000',fontSize:11}}>{showSettings?'Hide':'Open'}</button>
            </div>
            {showSettings&&(
              <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:10}}>
                <div style={{border:'2px solid #7c3aed',borderRadius:12,padding:10,background:'#f9f5ff'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><b style={{fontSize:12}}>Intro/Outro (with Sound)</b><button onClick={()=>setShowStudio(!showStudio)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:'#111',color:'#fff',fontSize:11}}>{showStudio?'Hide':'Open'}</button></div>
                  {showStudio&&(
                    <div style={{marginTop:8}}>
                      <div style={{display:'flex',gap:6}}>
                        <label style={{flex:1,background:'#7c3aed',color:'#fff',padding:10,borderRadius:10,fontSize:11,textAlign:'center'}}>Intro<input ref={introFileRef} type="file" accept="video/*,image/*" onChange={handleIntroFile} style={{display:'none'}}/></label>
                        <label style={{flex:1,background:'#111',color:'#fff',padding:10,borderRadius:10,fontSize:11,textAlign:'center'}}>Outro<input ref={outroFileRef} type="file" accept="video/*,image/*" onChange={handleOutroFile} style={{display:'none'}}/></label>
                      </div>
                      {intros.map((it:any)=><div key={it.id} style={{display:'flex',gap:4,marginTop:4}}><button onClick={()=>{setActiveIntroId(it.id);localStorage.setItem('taglive_active_intro',it.id);}} style={{flex:1,padding:8,borderRadius:8,border:'none',background:activeIntroId===it.id?'#16a34a':'#eee',fontSize:11}}>{activeIntroId===it.id?'✓ ':''}{it.title}</button><button onClick={()=>{const n=intros.filter((x:any)=>x.id!==it.id);saveIntros(n);}} style={{padding:8,borderRadius:8,border:'none',background:'red',color:'#fff'}}>X</button></div>)}
                      {outros.map((ot:any)=><div key={ot.id} style={{display:'flex',gap:4,marginTop:4}}><button onClick={()=>{setActiveOutroId(ot.id);localStorage.setItem('taglive_active_outro',ot.id);}} style={{flex:1,padding:8,borderRadius:8,border:'none',background:activeOutroId===ot.id?'#16a34a':'#eee',fontSize:11}}>{activeOutroId===ot.id?'✓ ':''}{ot.title}</button><button onClick={()=>{const n=outros.filter((x:any)=>x.id!==ot.id);saveOutros(n);}} style={{padding:8,borderRadius:8,border:'none',background:'red',color:'#fff'}}>X</button></div>)}
                    </div>
                  )}
                </div>

                <div style={{border:'2px solid #111',borderRadius:12,padding:10}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><b style={{fontSize:11}}>Ticker (Black/Yellow)</b><button onClick={()=>setTickerOn(!tickerOn)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:tickerOn?'#16a34a':'#111',color:'#fff',fontSize:11}}>{tickerOn?'ON':'OFF'}</button></div>
                  <input value={tickerText} onChange={e=>{setTickerText(e.target.value);localStorage.setItem('taglive_ticker_text',e.target.value);}} style={{width:'100%',marginTop:6,padding:8,borderRadius:8,border:'2px solid #111',fontSize:11,background:'#000',color:'#FFFF00'}}/>
                  <div style={{display:'flex',gap:6,marginTop:6,alignItems:'center'}}>
                    <span style={{fontSize:10}}>Size</span><input type="range" min={18} max={40} value={tickerSize} onChange={e=>setTickerSize(parseInt(e.target.value))} style={{flex:1}}/>
                    <span style={{fontSize:10}}>Speed</span><input type="range" min={1} max={5} value={tickerSpeed} onChange={e=>setTickerSpeed(parseInt(e.target.value))} style={{flex:1}}/>
                  </div>
                </div>

                <div style={{border:'2px solid #7c3aed',borderRadius:12,padding:10}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><b style={{fontSize:11}}>Church Name (Gold Pill)</b><button onClick={()=>setShowChurchName(!showChurchName)} style={{padding:'6px 12px',borderRadius:20,border:'none',background:showChurchName?'#7c3aed':'#111',color:'#fff',fontSize:11}}>{showChurchName?'ON':'OFF'}</button></div>
                  <input value={churchName} onChange={e=>{setChurchName(e.target.value);localStorage.setItem('taglive_church_name',e.target.value);}} style={{width:'100%',marginTop:6,padding:8,borderRadius:8,border:'2px solid #7c3aed',fontSize:11}}/>
                  <div style={{display:'flex',gap:6,marginTop:6}}>
                    <input ref={churchLogoInputRef} type="file" accept="image/*" onChange={handleChurchLogoPick} style={{flex:1,fontSize:11}}/>
                    <button onClick={removeChurchLogo} style={{background:'red',color:'#fff',border:'none',borderRadius:6,padding:'4px 8px',fontSize:10}}>Remove Logo</button>
                  </div>
                </div>
                                <div style={{display:'flex',gap:6}}>
                  <button onClick={()=>setBgMode('face')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='face'?'#111':'#eee',color:bgMode==='face'?'#fff':'#000',fontSize:12}}>Face</button>
                  <button onClick={()=>setBgMode('black')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='black'?'#111':'#eee',color:bgMode==='black'?'#fff':'#000',fontSize:12}}>Black</button>
                  <button onClick={()=>setBgMode('image')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='image'?'#111':'#eee',color:bgMode==='image'?'#fff':'#000',fontSize:12}}>Image</button>
                  <button onClick={()=>setBgMode('split')} style={{flex:1,padding:8,borderRadius:20,border:'none',background:bgMode==='split'?'#7c3aed':'#eee',color:bgMode==='split'?'#fff':'#000',fontSize:12}}>Split</button>
                </div>

                <div style={{display:'flex',gap:6,alignItems:'center',background:'#f3f0ff',padding:8,borderRadius:10}}>
                  <span style={{fontSize:10}}>Font</span><input type="range" min={20} max={60} value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value))} style={{flex:1}}/>
                  <button onClick={pickMedia} style={{padding:'8px 10px',borderRadius:10,border:'none',background:'#7c3aed',color:'#fff',fontSize:10}}>Media</button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={onFilePick} style={{display:'none'}}/>
                </div>

                <div style={{display:'flex',gap:6,alignItems:'center',background:'#fff',border:'1px solid #eee',padding:8,borderRadius:10}}>
                  <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} style={{width:28,height:28}}/>
                  <input type="color" value={boxColor} onChange={e=>setBoxColor(e.target.value)} style={{width:28,height:28}}/>
                  <input type="range" min={0} max={1} step={0.05} value={boxOpacity} onChange={e=>setBoxOpacity(parseFloat(e.target.value))} style={{flex:1}}/>
                  <button onClick={pickLogo} style={{padding:'6px 10px',borderRadius:8,border:'none',background:logoImage?'#16a34a':'#111',color:'#fff',fontSize:10}}>Logo</button>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoPick} style={{display:'none'}}/>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{background:'#000',borderRadius:18,overflow:'hidden',position:'relative',aspectRatio:'9/16',touchAction:'none'}}>
            <video ref={videoRef} muted playsInline autoPlay style={{width:'100%',height:'100%',objectFit:'cover',display:isCam&&bgMode!=='black'?'block':'none'}}/>
            {!isCam&&<div style={{color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',height:'100%',minHeight:400}}>Camera off - Start Camera</div>}
            <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>
            <video ref={broadcastVideoRef} muted={false} playsInline crossOrigin="anonymous" style={{display:'none'}}/>
            {isCam&&(
              <div style={{position:'absolute',top:bgMode==='split'?'auto':'12px',bottom:bgMode==='split'?'54px':'auto',right:12,display:'flex',gap:8,zIndex:50}}>
                <button onClick={toggleCamera} style={{background:'rgba(0,0,0,0.85)',color:'#fff',border:'2px solid #fff',borderRadius:20,padding:'10px 14px',fontSize:12}}>Flip</button>
                <button onClick={toggleTorch} style={{background:torch?'#fbbf24':'rgba(0,0,0,0.85)',color:torch?'#000':'#fff',border:'2px solid #fff',borderRadius:20,padding:'10px 14px',fontSize:12}}>{torch?'Torch On':'Flash'}</button>
              </div>
            )}
          </div>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            {!isCam?<button onClick={()=>startCamera()} style={{flex:1,background:'#111',color:'#fff',padding:14,borderRadius:12,border:'none'}}>Start Camera</button>:<><button onClick={toggleCamera} style={{flex:1,background:'#7c3aed',color:'#fff',padding:14,borderRadius:12,border:'none'}}>Switch</button><button onClick={stopCamera} style={{flex:1,background:'#444',color:'#fff',padding:14,borderRadius:12,border:'none'}}>Stop</button></>}
          </div>
          <div style={{display:'flex',gap:6,marginTop:10}}>
            {!isRecording?<button onClick={startRecording} disabled={!isCam} style={{flex:1,background:isCam?'#a21caf':'#ccc',color:'#fff',padding:12,borderRadius:10,border:'none',fontSize:12}}>Record+Intro (with Sound)</button>:<button onClick={stopRecording} style={{flex:1,background:'#111',color:'#fff',padding:12,borderRadius:10,border:'none',fontSize:12}}>Stop+Outro ({formatTime(liveSeconds)})</button>}
            {recordedUrl&&<a href={recordedUrl} download={`taglive-${Date.now()}.mp4`} style={{flex:1,background:'#16a34a',color:'#fff',padding:12,borderRadius:10,textAlign:'center',textDecoration:'none',fontSize:12}}>Download MP4</a>}
          </div>
          {recordedUrl&&<video src={recordedUrl} controls style={{width:'100%',marginTop:8,borderRadius:12}}/>}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <textarea value={verse} onChange={e=>setVerse(e.target.value)} style={{width:'100%',height:90,padding:12,borderRadius:12,border:'1px solid #ddd'}}/>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>setShowBible(true)} style={{flex:1,background:'#2563eb',color:'#fff',padding:10,borderRadius:10,border:'none',fontSize:12}}>Bible</button>
            <button onClick={saveVerse} style={{flex:1,background:'#f59e0b',color:'#000',padding:10,borderRadius:10,border:'none',fontSize:12}}>Save</button>
            <button onClick={pickMedia} style={{flex:1,background:'#7c3aed',color:'#fff',padding:10,borderRadius:10,border:'none',fontSize:12}}>Media</button>
          </div>

          <div style={{border:'2px solid #111',borderRadius:14,padding:12,background:'#fff'}}>
            <b>Facebook - Go Live + Intro</b>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button onClick={loginFacebook} style={{flex:1,background:fbUser?'#16a34a':'#1877F2',color:'#fff',padding:12,borderRadius:8,border:'none',fontSize:12}}>{fbUser?`✓ ${fbUser.name}`:'Login FB'}</button>
              <button onClick={()=>loadPages()} style={{flex:1,border:'1px solid #000',padding:12,borderRadius:8,background:'#fff',fontSize:12}}>Load Pages</button>
            </div>
            {pages.map((p:any)=><div key={p.id} onClick={()=>createFbLiveAuto(p)} style={{marginTop:6,padding:10,background:selectedPage?.id===p.id?'#7c3aed':'#f3f0ff',color:selectedPage?.id===p.id?'#fff':'#000',borderRadius:8,fontSize:13,cursor:'pointer'}}>{p.name} {selectedPage?.id===p.id?`● LIVE ${formatTime(liveSeconds)}`:'(Go Live)'}</div>)}
          </div>

          <div style={{border:'2px solid #ff0000',borderRadius:14,padding:12,background:'#fff'}}>
            <b>YouTube Live - Stream Key + Intro</b>
            <input value={ytKey} onChange={e=>{setYtKey(e.target.value);localStorage.setItem('taglive_ytkey',e.target.value);}} placeholder="Paste YouTube Stream Key" style={{width:'100%',marginTop:8,padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:12}}/>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button onClick={()=>{if(!ytKey) return alert('Paste Stream Key');setYtLive(true);setIsLive(true);startTimer();}} style={{flex:1,background:ytLive?'#16a34a':'#ff0000',color:'#fff',padding:12,borderRadius:8,border:'none',fontSize:12}}>{ytLive?`● LIVE ${formatTime(liveSeconds)}`:'Go Live YT + Intro'}</button>
              <button onClick={()=>{setYtLive(false);if(!selectedPage) setIsLive(false);stopTimer();}} style={{flex:1,border:'1px solid #000',padding:12,borderRadius:8,background:'#fff',fontSize:12}}>Stop + Outro</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
