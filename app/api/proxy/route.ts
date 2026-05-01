import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch target URL. Status: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    
    // Check for Cloudflare block (usually contains "Attention Required" or "Cloudflare")
    if (html.includes('<title>Just a moment...</title>') || html.includes('cf-browser-verification')) {
      return NextResponse.json({ error: 'Blocked by Cloudflare' }, { status: 403 });
    }

    const $ = cheerio.load(html);
    
    // Extract only the problem statement to avoid loading entire codeforces site layout
    const problemStatement = $('.problem-statement').html();

    if (!problemStatement) {
      return NextResponse.json({ error: 'Could not find problem statement in HTML' }, { status: 404 });
    }

    return NextResponse.json({ html: problemStatement });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
