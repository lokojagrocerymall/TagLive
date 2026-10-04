"use client"
import { useEffect, useState } from 'react'

export default function Live(){
  const [tag, setTag] = useState('')
  const [verse, setVerse] = useState('John 3:16 - For God so loved the world...')
  const [fbUrl, setFbUrl] = useState('rtmps://live-api-s.facebook.com:443/rtmp/')
  const [fbKey, setFbKey] = useState('')
  const [ytUrl, setYtUrl] = useState('rtmp://a.rtmp.youtube.com/live2')
  const [ytKey, setYtKey] = useState('')
  const [platform, setPlatform] = useState<'facebook'|'youtube'>('facebook')

  useEffect(()=>{
    const savedFb = localStorage.getItem('taglive_fbKey')
    const savedYt = localStorage.getItem('taglive_ytKey')
    if(savedFb) setFbKey(savedFb)
    if(savedYt) setYtKey(savedYt)

    const onPaste = (e:any)=>{
      const text = (e.clipboardData || (window as any).clipboardData)?.getData('text')
      if(text && text.length > 3 && text.length < 300){
        setTag(text)
        setVerse(text)
        setTimeout(()=>setTag(''), 15000)
      }
    }
    window.addEventListener('paste', onPaste as any)
    return ()=> window.removeEventListener('paste', onPaste as any)
  },[])

  useEffect(()=>{
    if(fbKey) localStorage.setItem('taglive_fbKey', fbKey)
  },[fbKey])
  useEffect(()=>{
    if(ytKey) localStorage.setItem('taglive_ytKey', ytKey)
  },[ytKey])

  const fullRtmp = platform === 'facebook'? `${fbUrl}${fbKey}` : `${ytUrl}/${ytKey}`

  return (
    <div style={{padding:20, maxWidth:500, margin:'0 auto', paddingBottom:80}}>
      <h2 style={{fontWeight:900, fontSize:26}}>Live Studio</h2>
      <p style={{color:'#666', fontSize:13}}>Paste Bible verse anywhere, it appears as tag + burns into stream.</p>

      <textarea
        value={verse}
        onChange={e=>setVerse(e.target.value)}
        style={{width:'100%', height:90, marginTop:16, padding:12, borderRadius:12, border:'1px solid #ddd', fontSize:16}}
        placeholder="Paste Bible verse here..."
      />

      {tag && (
        <div style={{marginTop:12, background:'#6d28d9', color:'#fff', padding:12, borderRadius:10, fontWeight:700, fontSize:14}}>
          LIVE TAG: {tag}
        </div>
      )}

      <div style={{marginTop:16, background:'#111', color:'#fff', padding:20, borderRadius:16, textAlign:'center', minHeight:90}}>
        <div style={{fontSize:22, fontWeight:900, lineHeight:1.3}}>{verse || tag}</div>
        <div style={{marginTop:8, fontSize:11, opacity:0.6}}>Burned into live stream</div>
      </div>

      {/* RTMP SECTION */}
      <div style={{marginTop:24, border:'2px solid #6d28d9', borderRadius:16, padding:16}}>
        <h3 style={{fontWeight:800, marginBottom:12}}>🔴 Stream Setup (RTMP)</h3>

        <div style={{display:'flex', gap:8, marginBottom:12}}>
          <button onClick={()=>setPlatform('facebook')} style={{flex:1, padding:10, borderRadius:8, border:'none', background: platform==='facebook'?'#6d28d9':'#eee', color:platform==='facebook'?'#fff':'#000', fontWeight:700}}>Facebook</button>
          <button onClick={()=>setPlatform('youtube')} style={{flex:1, padding:10, borderRadius:8, border:'none', background: platform==='youtube'?'#6d28d9':'#eee', color:platform==='youtube'?'#fff':'#000', fontWeight:700}}>YouTube</button>
        </div>

        {platform === 'facebook'? (
          <>
            <label style={{fontSize:12, fontWeight:700}}>Facebook RTMP URL</label>
            <input value={fbUrl} onChange={e=>setFbUrl(e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4, marginBottom:10, fontSize:12}} />
            <label style={{fontSize:12, fontWeight:700}}>Facebook Stream Key (paste from Facebook)</label>
            <input value={fbKey} onChange={e=>setFbKey(e.target.value)} placeholder="FB-123456..." style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4, fontSize:12}} />
          </>
        ) : (
          <>
            <label style={{fontSize:12, fontWeight:700}}>YouTube RTMP URL</label>
            <input value={ytUrl} onChange={e=>setYtUrl(e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4, marginBottom:10, fontSize:12}} />
            <label style={{fontSize:12, fontWeight:700}}>YouTube Stream Key (paste from YouTube Studio)</label>
            <input value={ytKey} onChange={e=>setYtKey(e.target.value)} placeholder="xxxx-xxxx-xxxx-xxxx" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:4, fontSize:12}} />
          </>
        )}

        <div style={{marginTop:12, background:'#f5f3ff', padding:10, borderRadius:8, fontSize:11, wordBreak:'break-all'}}>
          <b>Full RTMP:</b><br/>{fullRtmp || 'Paste your key above'}
        </div>

        <button
          onClick={()=>navigator.clipboard.writeText(fullRtmp)}
          style={{width:'100%', marginTop:10, background:'#111', color:'#fff', padding:12, borderRadius:10, fontWeight:800, border:'none'}}
        >
          Copy RTMP for OBS
        </button>

        <p style={{fontSize:11, color:'#666', marginTop:10}}>
          Where to get keys:<br/>
          • FB: facebook.com/live/producer → Use Stream Key<br/>
          • YT: studio.youtube.com → Go Live → Stream Key
        </p>
      </div>

      <p style={{marginTop:16, fontSize:11, color:'#999', textAlign:'center'}}>
        Tip: Use OBS Studio → Add Browser Source = your TagLive URL → Add Media Source = your RTMP. Tags will burn in automatically.
      </p>
    </div>
  )
}
