'use client';
import { useState, useRef } from 'react';

export default function LivePage() {
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [verse, setVerse] = useState('John 3:16 - For God so loved the world...');
  const [streamKey, setStreamKey] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStarted(true);
    } catch (e: any) {
      console.error(e);
      setError('Camera failed: ' + (e.message || e.name) + ' — Try again, close other apps.');
      alert('Could not start video source: ' + (e.message || e.name));
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStarted(false);
  };

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h1>Live Studio Pro <span style={{ background: '#16a34a', color: '#fff', fontSize: 12, padding: '4px 8px', borderRadius: 6 }}>V8.1</span></h1>
      <p>Status: {error ? 'Error: ' + error : started ? 'Ready' : 'Camera off'}</p>
      <div style={{ background: '#16a34a', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 12 }}>
        ✅ LOGGED IN AS J.A.K Bayeti
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 480, background: '#000', aspectRatio: '9/16', borderRadius: 8, overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {!started && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Camera off</div>}
        <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 8, fontSize: 14 }}>
          {verse}
        </div>
      </div>

      <button onClick={started ? stopCamera : startCamera} style={{ marginTop: 12, background: started ? '#dc2626' : '#000', color: '#fff', padding: '10px 16px', border: 'none', borderRadius: 8, width: '100%' }}>
        {started ? 'Stop Camera' : 'Start Camera'}
      </button>

      <input value={verse} onChange={e => setVerse(e.target.value)} placeholder="Verse" style={{ width: '100%', marginTop: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
      <input value={streamKey} onChange={e => setStreamKey(e.target.value)} placeholder="Paste Facebook Stream Key" style={{ width: '100%', marginTop: 12, padding: 10, borderRadius: 8, border: '1px solid #ef4444' }} />

      <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
        {started && streamKey ? 'Camera OK. Tap Start Stream in your LiveKit dashboard to push to Facebook with this key.' : 'Start camera first, then paste stream key.'}
      </p>
    </div>
  );
}
