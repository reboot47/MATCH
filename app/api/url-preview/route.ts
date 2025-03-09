import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'edge';

// レスポンスタイムアウト時間（ミリ秒）
const FETCH_TIMEOUT = 5000;

/**
 * タイムアウト付きのfetch関数
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * URLプレビュー用のAPIエンドポイント
 * 指定されたURLからOGP情報を取得して返す
 */
export async function GET(request: NextRequest) {
  try {
    // URLパラメータの取得
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URLパラメータが必要です' },
        { status: 400 }
      );
    }
    
    // URLの形式を検証
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: '無効なURL形式です' },
        { status: 400 }
      );
    }
    
    // 実際のURL先にリクエスト（タイムアウト付き）
    let response;
    try {
      response = await fetchWithTimeout(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LineBuzzBot/1.0; +https://linebuzz.jp/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
        }
      }, FETCH_TIMEOUT);
      
      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: 'URLの取得に失敗しました', status: response.status },
          { status: 502 }
        );
      }
    } catch (fetchError) {
      // ネットワークエラーやタイムアウトを詳細にハンドリング
      console.error('Fetch error:', fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('abort');
      
      return NextResponse.json({
        success: false, 
        error: isTimeout ? '接続がタイムアウトしました' : 'URLの取得に失敗しました',
        details: errorMessage
      }, { status: 500 });
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // OGP情報の取得
    const title = $('meta[property="og:title"]').attr('content') || 
                 $('title').text() || 
                 url.split('/')[2];
    
    const description = $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="description"]').attr('content') || 
                       '';
    
    const image = $('meta[property="og:image"]').attr('content') || 
                 $('meta[property="og:image:url"]').attr('content') || 
                 '';
    
    const siteName = $('meta[property="og:site_name"]').attr('content') || 
                    url.split('/')[2];
    
    // URLの実際のドメイン名を取得
    const domain = new URL(url).hostname;
    
    // 結果を返す
    return NextResponse.json({
      success: true,
      preview: {
        url,
        title,
        description,
        image,
        siteName,
        domain
      }
    });
    
  } catch (error) {
    console.error('URL preview error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'URLプレビューの取得に失敗しました', 
        details: error instanceof Error ? error.message : String(error),
        url: request.nextUrl.searchParams.get('url') || ''
      },
      { status: 500 }
    );
  }
}
