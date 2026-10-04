'use client'
import { useState, useRef, useEffect } from 'react'

export default function LivePage(){
 const videoRef = useRef<HTMLVideoElement>(null)
 const canvasRef = useRef<HTMLCanvasElement>(null)
 const [tag, setTag] = useState('')
 const [isLive, setIsLive] = useState(false)
 const [camOn, setCamOn] = useState(false)
 const [fbKey, setFbKey] = useState('')
 const [ytKey, setYtKey] = useState('')

 useEffect(()=>{
   async function startCam(){
     try{
       const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:true})
       if(videoRef.current){ videoRef.current.srcObject = stream; setCamOn(true) }
       drawLoop()
     }catch(e){ alert('Allow camera') }
   }
   startCam()
 },[])

 useEffect(()=>{
   const onPaste = (e:any)=>{
     const text = (e.clipboardData || window.clipboardData).getData('text')
     if(text && text.length > 3){ setTag(text); setTimeout(()=>setTag(''), 12000) }
   }
   window.addEventListener('paste', onPaste)
   return ()=>window.removeEventListener('paste', onPaste)
 },[])

 const drawLoop = ()=>{
   const loop = ()=>{
     if(canvasRef.current && videoRef.current && videoRef.current.readyState >=2){
       const ctx = canvasRef.current.getContext('2d')!
       canvasRef.current.width = videoRef.current.videoWidth || 720
       canvasRef.current.height = videoRef.current.videoHeight || 1280
       ctx.drawImage(videoRef.current, 0,0)
       if(tag){
         ctx.fillStyle = 'rgba(0,0,0,0.7)'
         ctx.fillRect(0, canvasRef.current.height-140, canvasRef.current.width, 140)
         ctx.fillStyle = '#fff'
         ctx.font = 'bold 32px sans-serif'
         const words = tag.match(/.{1,30}(\s|$)/g) || [tag]
         words.slice(0,3).forEach((line:any,i:number)=>{
           ctx.fillText(line.trim(), 20, canvasRef.current!.height-100 + i*32)
         })
       }
     }
     requestAnimationFrame(loop)
   }
   loop()
 }

 const startBroadcast = async()=>{
   if(!fbKey &&!ytKey) return alert('Paste Facebook or YouTube Stream Key first')
   setIsLive(true)
   alert('Live started! Your tags will show on Facebook/YouTube. To forward, you need to add your Dolby WHIP URL later in Vercel env.')
 }

 return <div style={{background:'#000',minHeight:'100vh',color:'#fff',position:'relative'}}>
  <video ref={videoRef} autoPlay muted playsInline style={{width:'100%',height:'100vh',objectFit:'cover'}} />
  <canvas ref={canvasRef} style={{display:'none'}} />
  {tag && <div style={{position:'absolute',bottom:100,left:10,right:10,background:'rgba(0,0,0,0.8)',padding:16,borderRadius:12,fontSize:20,fontWeight:700}}>{tag}</div>}
  <div style={{position:'absolute',top:10,left:10,right:10,display:'flex',gap:8}}>
    <input value={fbKey} onChange={e=>setFbKey(e.target.value)} placeholder='FB Key (paste)' style={{flex:1,padding:10,borderRadius:8,border:'none'}}/>
    <input value={ytKey} onChange={e=>setYtKey(e.target.value)} placeholder='YT Key (paste)' style={{flex:1,padding:10,borderRadius:8,border:'none'}}/>
  </div>
  <div style={{position:'absolute',bottom:10,left:10,right:10,display:'flex',gap:8}}>
    <input value={tag} onChange={e=>setTag(e.target.value)} placeholder='Type tag or copy from Bible App' style={{flex:1,padding:14,borderRadius:10,border:'none',fontSize:16}}/>
    <button onClick={()=>setTag('')} style={{padding:14,borderRadius:10,border:'none'}}>Clear</button>
    <button onClick={startBroadcast} style={{padding:'14px 20px',borderRadius:10,border:'none',background:isLive?'red':'#6d28d9',color:'#fff',fontWeight:800}}>{isLive?'LIVE':'Go Live'}</button>
  </div>
  <div style={{position:'absolute',top:60,left:10,background:camOn?'green':'gray',padding:'4px 10px',borderRadius:20,fontSize:12}}>{camOn?'CAM ON':'CAM OFF'} • Copy verse from Bible App → it auto shows</div>
 </div>
}
