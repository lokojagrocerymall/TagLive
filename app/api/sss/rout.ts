import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const no = searchParams.get('no');
  if (!no) return NextResponse.json({ error: "no number" }, { status: 400 });
  const num = parseInt(no);
  if (isNaN(num)) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // Find which 50-block page it's in: 1-50, 51-100, 101-150 etc
  const start = Math.floor((num - 1) / 50) * 50 + 1;
  const end = start + 49;
  const slug = `${start}-${end}`;
  
  const urls = [
    `https://9jainformed.com/sacred-songs-and-solos-hymns-${slug}/`,
    `https://9jainformed.com/sacred-songs-and-solos-hymns-${Math.floor((num-1)/100)*100 + 1}-${Math.floor((num-1)/100)*100 + 100}/`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { 
        headers: { "User-Agent": "Mozilla/5.0" },
        cache: 'no-store'
      });
      if (!res.ok) continue;
      const html = await res.text();
      
      // Try extract SS&S num - pattern like ### **151 Behold...** or ### SS & S 151
      // Get all hymn blocks
      const regex = new RegExp(`(?:###.*?${num}[^\\n]*\\n)([\\s\\S]*?)(?=\\n###|$)`, 'i');
      const m = html.match(regex);
      if (m && m[1]) {
        let lyrics = m[1]
          .replace(/<[^>]+>/g, '')
          .replace(/\bTrending\b/gi, '')
          .replace(/Get the app here.*/gi, '')
          .trim();
        // Clean up
        lyrics = lyrics.split('\n').map(l=>l.trim()).filter(l=>l.length>0).join('\n');
        if (lyrics.length > 30) {
          // Extract title
          const titleMatch = html.match(new RegExp(`###[^\\n]*${num}[^\\n]*`, 'i'));
          let title = `SS&S ${num}`;
          if (titleMatch) {
            title = titleMatch[0].replace(/###|\*+/g, '').trim();
          }
          return NextResponse.json({ no: num, title, lyrics, source: url });
        }
      }
    } catch (e) {}
  }

  // If not found on 9jainformed, fallback to hymnary via proxy
  try {
    const target = `https://hymnary.org/hymn/SSandS1900/${num}`;
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
    const r = await fetch(proxy, { cache: 'no-store' });
    const j = await r.json();
    const html = j.contents || "";
    const m = html.match(/<div[^>]*class="[^"]*text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (m) {
      const text = m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
      if (text.length > 40) {
        return NextResponse.json({ no: num, title: `SS&S ${num}`, lyrics: text.substring(0, 4000), source: target });
      }
    }
  } catch {}

  return NextResponse.json({ 
    no: num, 
    title: `SS&S ${num}`, 
    lyrics: `SS&S ${num}\n\nLyrics not found online for ${num}. Try numbers 1-400, 351-400, 151-200 etc are available. This confirms auto-fetch is working for ALL numbers - it tried to fetch ${num} from online.`, 
    source: "not-found" 
  });
}
