export default async function handler(req) {
  const url = new URL(req.url, 'http://x');
  const contestId = url.searchParams.get('contestId');
  const problemIndex = url.searchParams.get('problemIndex');
  
  const cfUrl = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;
  
  const response = await fetch(cfUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  
  const html = await response.text();
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

export const config = { runtime: 'edge' };
