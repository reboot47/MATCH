import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// フォールバック画像のバイナリデータをキャッシュする変数
let fallbackImageCache: ArrayBuffer | null = null;

// レスポンスキャッシュの有効期限（30分）
const CACHE_TTL = 30 * 60 * 1000;

// 画像URLとそのレスポンスキャッシュを保持
type CacheEntry = {
  timestamp: number;
  response: NextResponse;
  contentType: string;
  size: number;
};

// 信頼できる画像形式
const SUPPORTED_MIME_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/gif', 
  'image/webp', 
  'image/svg+xml'
];

// 画像の最大サイズ制限
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_IMAGE_SIZE = 100; // 100バイト

// URL検証用の正規表現
const URL_REGEX = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const responseCache = new Map<string, CacheEntry>();

/**
 * CORS問題を回避するための画像プロキシAPI
 * @param request リクエストオブジェクト
 */
export async function GET(request: NextRequest) {
  try {
    // URLからimageUrlパラメータを取得
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const skipCache = searchParams.get('skip_cache') === 'true';

    // パラメータが存在するか確認
    if (!imageUrl) {
      console.error('[ImageProxy] Missing URL parameter');
      return new NextResponse('Image URL is required', { status: 400 });
    }
    
    // URLの形式を検証
    if (!URL_REGEX.test(imageUrl)) {
      console.error(`[ImageProxy] Invalid URL format: ${imageUrl.substring(0, 50)}...`);
      return await getFallbackImageResponse('Invalid URL format');
    }
    
    // 悪意的なURLをブロック（内部のプライベートIPレンジや危険なプロトコル）
    if (
      imageUrl.match(/^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\]|10\.|172\.(?:1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/) ||
      imageUrl.startsWith('file:') ||
      imageUrl.startsWith('ftp:') ||
      imageUrl.startsWith('data:')
    ) {
      console.error(`[ImageProxy] Blocked dangerous URL: ${imageUrl.substring(0, 50)}...`);
      return await getFallbackImageResponse('Blocked URL');
    }

    // キャッシュをチェック（skip_cacheがtrueでない場合）
    if (!skipCache) {
      const cachedEntry = responseCache.get(imageUrl);
      if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_TTL) {
        // キャッシュが有効であれば、キャッシュしたレスポンスを返す
        return cachedEntry.response.clone();
      }
    }

    console.log(`[ImageProxy] Fetching image from: ${imageUrl}`);

      // タイムアウトを設定したfetchオプション
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LineBuzzProxy/1.0)',
        'Accept': 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,*/*',
        'Referer': new URL(request.url).origin
      },
      signal: AbortSignal.timeout(5000), // 5秒のタイムアウト
    };
    
    // リクエストの開始時間を記録
    const startTime = Date.now();

    // 外部URLから画像を取得
    const response = await fetch(imageUrl, fetchOptions);
    
    if (!response.ok) {
      console.error(`[ImageProxy] Failed to fetch image: ${response.status} ${response.statusText}`);
      
      // 404またはその他のエラーの場合はフォールバック画像を返す
      return await getFallbackImageResponse(`HTTP Error: ${response.status}`);
    }
    
    // リクエストが長すぎる場合の警告
    const fetchTime = Date.now() - startTime;
    if (fetchTime > 3000) { // 3秒以上
      console.warn(`[ImageProxy] Slow fetch for ${imageUrl.substring(0, 30)}... - took ${fetchTime}ms`);
    }

    // 元の画像のContent-Typeを取得
    const contentType = response.headers.get('content-type');
    
    // サポートする画像タイプか確認
    const finalContentType = contentType && SUPPORTED_MIME_TYPES.some(type => contentType.includes(type))
      ? contentType
      : 'image/jpeg';
      
    // サポートされていないMIMEタイプの場合の警告
    if (contentType && !SUPPORTED_MIME_TYPES.some(type => contentType.includes(type))) {
      console.warn(`[ImageProxy] Unsupported content type: ${contentType} for URL: ${imageUrl.substring(0, 30)}...`);
    }
    
    // 画像データを取得
    const imageData = await response.arrayBuffer();
    
    // 画像データが少なすぎる場合は無効な画像と判断
    if (imageData.byteLength < MIN_IMAGE_SIZE) {
      console.error(`[ImageProxy] Image too small (${imageData.byteLength} bytes), using fallback`);
      return await getFallbackImageResponse('Image too small');
    }

    // 画像のデータが大きすぎる場合も無効と判断
    if (imageData.byteLength > MAX_IMAGE_SIZE) {
      console.error(`[ImageProxy] Image too large (${imageData.byteLength} bytes), using fallback`);
      return await getFallbackImageResponse('Image too large');
    }

    // プロキシされた画像のレスポンスを作成
    const proxiedResponse = new NextResponse(imageData, {
      headers: {
        'Content-Type': finalContentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
    // レスポンスをキャッシュに保存
    // cloneメソッドはクローンしたオブジェクトを返すのでそのまま保存
    responseCache.set(imageUrl, {
      timestamp: Date.now(),
      response: proxiedResponse,
      contentType: finalContentType,
      size: imageData.byteLength
    });
    
    // キャッシュが大きくなりすぎないように管理（200エントリまたは50MBまで）
    let totalCacheSize = 0;
    let oldestEntries: Array<{key: string, timestamp: number}> = [];
    
    // 全キャッシュサイズを計算し、古いエントリを追跡
    responseCache.forEach((entry, key) => {
      totalCacheSize += entry.size;
      oldestEntries.push({ key, timestamp: entry.timestamp });
    });
    
    // エントリ数が多すぎるか、合計サイズが大きすぎる場合
    if (responseCache.size > 200 || totalCacheSize > 50 * 1024 * 1024) {
      // 古い順にソート
      oldestEntries.sort((a, b) => a.timestamp - b.timestamp);
      
      // 古いエントリから順に20%を削除
      const entriesToRemove = Math.ceil(responseCache.size * 0.2);
      for (let i = 0; i < entriesToRemove && i < oldestEntries.length; i++) {
        responseCache.delete(oldestEntries[i].key);
      }
      
      console.log(`[ImageProxy] Cache pruned. Removed ${entriesToRemove} entries. New size: ${responseCache.size} entries`);
    }
    
    // 完了と結果のログ出力
    const totalTime = Date.now() - startTime;
    console.log(`[ImageProxy] Successfully processed image: ${imageUrl.substring(0, 30)}... (${imageData.byteLength} bytes) in ${totalTime}ms`);
    
    return proxiedResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[ImageProxy] Error: ${errorMessage}`);
    
    // 例外発生時もフォールバック画像を返す
    return await getFallbackImageResponse(`Error: ${errorMessage.substring(0, 50)}`);
  }
}

/**
 * フォールバック画像を返す
 * リクエスト失敗時の代替画像として使用
 * @param reason フォールバックを返す理由
 */
async function getFallbackImageResponse(reason?: string): Promise<NextResponse> {
  try {
    // 開発環境ではエラー理由をログ出力
    if (process.env.NODE_ENV === 'development' && reason) {
      console.warn(`[ImageProxy] Returning fallback image. Reason: ${reason}`);
    }
    
    // キャッシュがあればそれを使用
    if (fallbackImageCache) {
      return new NextResponse(
        fallbackImageCache,
        {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // 1x1透明PNG画像をバイナリデータとして返す
    const transparentPng = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]).buffer;
    
    // 結果をキャッシュに保存
    fallbackImageCache = transparentPng;
    
    return new NextResponse(
      transparentPng,
      {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('[ImageProxy] Error in fallback:', error);
    return new NextResponse('Fallback image error', { status: 500 });
  }
}
