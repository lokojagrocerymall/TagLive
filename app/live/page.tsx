"use client"
import { useEffect, useState } from 'react'

export default function Live(){
  const [tag, setTag] = useState('')
  const [verse, setVerse] = useState('John 3:16 - For God so loved the world...')

  useEffect(()=>{
    const onPaste = (e:any)=>{
      const text = (e.clipboardData || (window as any).clipboardData)?.getData('text')
      if(text && text.length > 3){ 
        setTag(text); 
        setTimeout(()=>setTag(''), 12000) 
      }
    }
    window.addEventListener('paste', onPaste as any)
    return ()=> window.removeEventListener('paste', onPaste as any)
  },[])

  return (
    <div style={{padding:20, maxWidth:500, margin:'0 auto'}}>
      <h2 style={{fontWeight:900}}>Live Studio</h2>
      <p style={{color:'#666', fontSize:14}}>Copy any Bible verse from YouVersion / Bible app and it will appear here as Tag.</p>
      
      <textarea 
        value={verse} 
        onChange={e=>setVerse(e.target.value)}
        style={{width:'100%', height:100, marginTop:16, padding:12, borderRadius:12, border:'1px solid #ddd'}}
        placeholder="Paste Bible verse here..."
      />

      {tag && (
        <div style={{marginTop:16, background:'#6d28d9', color:'#fff', padding:16, borderRadius:12, fontWeight:700}}>
          LIVE TAG: {tag}
        </div>
      )}

      <div style={{marginTop:24, background:'#111', color:'#fff', padding:20, borderRadius:16, textAlign:'center'}}>
        <div style={{fontSize:24, fontWeight:900}}>{verse || tag}</div>
        <div style={{marginTop:8, fontSize:12, opacity:0.7}}>This will be burned into your live stream</div>
      </div>

      <p style={{marginTop:16, fontSize:12, color:'#999'}}>Tip: Keep this phone screen recording to Facebook Live. Tags will show.</p>
    </div>
  )
}
