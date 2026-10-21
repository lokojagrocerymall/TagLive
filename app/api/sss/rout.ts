import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const no = searchParams.get("no");
  if (!no) return NextResponse.json({ error: "no number" }, { status: 400 });

  const num = parseInt(no);
  let range = "";
  if (num <= 50) range = "1-to-50";
  else if (num <= 100) range = "51-to-100";
  else if (num <= 150) range = "101-to-150";
  else if (num <= 200) range = "151-to-200";
  else if (num <= 250) range = "201-to-250";
  else if (num <= 300) range = "251-to-300";
  else if (num <= 350) range = "301-to-350";
  else if (num <= 400) range = "351-to-400";
  else if (num <= 1000) range = `${Math.floor((num-1)/50)*50+1}-to-${Math.ceil(num/50)*50}`;
  else range = "1-to-50";

  const urls = [
    `https://9jainformed.com/sacred-songs-and-solos-hymns-${range}/`,
    `https://9jainformed.com/sacred-songs-and-solos-hymns-${range.replace("to","-")}/`,
    `https://9jainformed.com/sacred-songs-and-solos-hymns-${range}/`.replace("-to-","-")
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) continue;
      const html = await res.text();
      
      // Try to extract SS&S {num}
      const regex = new RegExp(`SS & S ${num}[\\s\\S]{0,3000}`, "i");
      const match = html.match(regex);
      if (match) {
        // Strip html tags roughly
        const text = match[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").substring(0, 5000);
        return NextResponse.json({ no: num, title: `SS&S ${num}`, lyrics: text, source: url });
      }
      
      // Fallback: return full page if contains number
      if (html.toLowerCase().includes(`ss & s ${num}`) || html.includes(`SS&S ${num}`)) {
        const clean = html.replace(/<[^>]+>/g, "\n").replace(/\n+/g, "\n");
        const start = clean.toLowerCase().indexOf(`ss & s ${num}`.toLowerCase());
        if (start > -1) {
          const snippet = clean.substring(start, start + 4000);
          return NextResponse.json({ no: num, title: `SS&S ${num}`, lyrics: snippet, source: url });
        }
      }
    } catch (e) {}
  }

  return NextResponse.json({ no: num, title: `SS&S ${num}`, lyrics: `SS&S ${num}\n\nFull lyrics not yet cached. Online fetch attempted.`, source: "none" });
}
