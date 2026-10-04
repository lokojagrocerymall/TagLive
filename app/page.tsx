"use client"
import { signIn } from "next-auth/react"
import Link from 'next/link'

export default function Home(){
 return <div style={{padding:20,maxWidth:500,margin:'0 auto'}}>
 <h1 style={{fontSize:44,fontWeight:900}}>Tag<span style={{color:'#6d28d9'}}>Live</span></h1>
 <p style={{color:'#555'}}>Tag Your Live. Show Bible verses during live stream. Tags burned into Facebook/YouTube video from phone.</p>

 <button onClick={() => signIn('facebook')} style={{display:'block',width:'100%',marginTop:18,background:'#1877F2',color:'#fff',padding:16,textAlign:'center',borderRadius:12,fontWeight:800,border:'none',fontSize:16,cursor:'pointer'}}>
 f Login with Facebook
 </button>

 <div style={{marginTop:20,background:'#111',color:'#fff',padding:16,borderRadius:14}}>
 <p>✅ Bible App Integration</p>
 <p>✅ Works on Phone</p>
 <p>✅ Facebook/YouTube with Tags</p>
 <p>✅ For Mobile Livestreams</p>
 </div>
 <Link href='/live' style={{display:'block',marginTop:18,background:'#6d28d9',color:'#fff',padding:16,textAlign:'center',borderRadius:12,fontWeight:800,textDecoration:'none'}}>Go to Live Studio →</Link>
 </div>
}
