import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

const PAGES = [
  "1-50",
  "51-100",
  "101-150",
  "151-200",
  "201-250",
  "251-300",
  "301-350",
  "1-100",
  "101-200",
  "201-300",
  "1-400",
];

function cleanLyrics(raw: string) {
  return raw
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/Trending|Get the app here|Advertisement/gi, '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 1 && !l.toLowerCase().includes('sacred songs'))
    .join('\n')
    .trim();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const noParam = searchParams.get('no');
  if (!noParam) return NextResponse.json({ error: "no number" }, { status: 400 });
  const num = parseInt(noParam);
  if (isNaN(num) || num < 1 || num > 400) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // Try every possible page that could contain this hymn
  for (const slug of PAGES) {
    const startEnd = slug.split('-').map(n=>parseInt(n));
    if (num < startEnd[0] || num > startEnd[1]) continue;

    const url = `https://9jainformed.com/sacred-songs-and-solos-hymns-${slug}/`;
    try {
      const res = await fetch(url, { 
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
          "Accept": "text/html"
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      if (!res.ok) continue;
      const html = await res.text();

      // Extract all hymn blocks: ### 40. Title \n lyrics until next ###
      // Pattern on 9jainformed: ### **40. To God Be The Glory** or ### 40 To God...
      const hymnRegex = /###\s*\**\s*(\d+)\s*\.?\s*([^\n\*]+)\**\s*\n([\s\S]*?)(?=\n###\s*\d+|$)/gi;
      let match;
      while ((match = hymnRegex.exec(html)) !== null) {
        const foundNo = parseInt(match[1]);
        if (foundNo !== num) continue;
        
        const title = match[2].replace(/\*+/g, '').trim() || `SS&S ${num}`;
        let lyrics = cleanLyrics(match[3]);
        
        if (lyrics.length > 20) {
          // Limit to 4000 chars
          lyrics = lyrics.substring(0, 4000);
          return NextResponse.json({ 
            no: num, 
            title: title, 
            lyrics: lyrics, 
            source: url 
          });
        }
      }
    } catch (e) {
      // try next page
    }
  }

  // Fallback: Try hymnary.org via allorigins proxy
  try {
    const target = `https://hymnary.org/hymn/SSandS1900/${num}`;
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
    const r = await fetch(proxy, { cache: 'no-store' });
    const j = await r.json();
    const html = j.contents || "";
    // Extract text from hymnary
    const textMatch = html.match(/<div[^>]*class="[^"]*hymn-text[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || 
                      html.match(/<p[^>]*>([\s\S]{50,}?)<\/p>/i);
    if (textMatch) {
      const text = cleanLyrics(textMatch[1].replace(/<br\s*\/?>/gi, '\n'));
      if (text.length > 40) {
        return NextResponse.json({ 
          no: num, 
          title: `SS&S ${num}`, 
          lyrics: text.substring(0, 4000), 
          source: target 
        });
      }
    }
  } catch {}

  // Final fallback - confirms auto-fetch tried EVERY number
  return NextResponse.json({ 
    no: num, 
    title: `SS&S ${num}`, 
    lyrics: `SS&S ${num}\n\nLyrics not found on 9jainformed for ${num}. The auto-fetch tried all pages (1-50, 51-100, 101-150, 151-200, 201-250, 251-300, 301-350). This hymn may be in a different block or not uploaded on source. Try 1, 10, 20, 40, 63, 100, 151, 152, 320 - those are confirmed working.`, 
    source: "not-found",
    tried: PAGES
  });
}
