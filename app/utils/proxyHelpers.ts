// URL変換結果をキャッシュするマップ
const urlProxyCache: Map<string, string | null> = new Map();

// キャッシュの有効期限（ミリ秒）
const CACHE_TTL_MS = 10 * 60 * 1000; // 10分

// 直接利用できる信頼済みドメインのリスト
const TRUSTED_IMAGE_DOMAINS = [
  // ストックフォト・画像サービス
  'picsum.photos',
  'images.unsplash.com',
  'images.pexels.com',
  'cloudinary.com',
  'res.cloudinary.com',
  'img.freepik.com',
  'cdn.pixabay.com',
  // SNSプラットフォーム
  'lh3.googleusercontent.com',
  'graph.facebook.com',
  'pbs.twimg.com',
  'instagram.com',
  'cdninstagram.com',
  'static.xx.fbcdn.net',
  // Google関連サービス
  'maps.googleapis.com', // Googleマップ静的画像サービス
  'maps.gstatic.com', // Googleマップ関連アセット
  'storage.googleapis.com', // Google Cloud Storage
  // CDNサービス
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'media.tenor.com',
  // その他の主要サービス
  'img.youtube.com',
  'i.ytimg.com',
  'assets.line-scdn.net', // LINE関連アセット
  'd.line-scdn.net', // LINE関連アセット
];

/**
 * 画像URLがプロキシ経由で取得する必要があるかどうかを判定
 * @param url 検証するURL
 * @returns プロキシが必要ならtrue、そうでなければfalse
 */
const needsProxying = (url: string): boolean => {
  // 相対パス、データURL、ローカルURLはプロキシ不要
  if (url.startsWith('/') || 
      url.startsWith('data:') || 
      url.includes('localhost') || 
      url.includes('127.0.0.1')) {
    return false;
  }

  // 信頼済みドメインもプロキシ不要
  if (TRUSTED_IMAGE_DOMAINS.some(domain => url.includes(domain))) {
    return false;
  }

  // 外部URLのみプロキシが必要
  return url.match(/^https?:\/\//) !== null;
};

/**
 * キャッシュエントリの有効期限を確認
 */
const cleanupCache = (): void => {
  const now = Date.now();
  // 期限切れの項目を削除
  urlProxyCache.forEach((value, key) => {
    const timestamp = parseInt(key.split('|')[1] || '0', 10);
    if (now - timestamp > CACHE_TTL_MS) {
      urlProxyCache.delete(key);
    }
  });
};

/**
 * 外部画像URLをプロキシURLに変換する
 * @param url 元の画像URL
 * @returns プロキシされた画像URL
 */
export const getProxiedImageUrl = (url?: string | null): string | null => {
  // 開発環境でのみ詳細ログを出力
  const isDevMode = process.env.NODE_ENV === 'development';
  
  // 定期的にキャッシュをクリーンアップ（5%の確率で実行）
  if (Math.random() < 0.05) {
    cleanupCache();
  }

  // Debug情報としてスタックトレースの一部を記録
  if (isDevMode) {
    const stack = new Error().stack?.split('\n')[2] || 'unknown';
    const caller = stack.trim().substring(0, 50);
    console.debug(`[ProxyHelper] Called from: ${caller} with URL: ${url?.substring(0, 30)}...`);
  }
  
  if (!url) {
    if (isDevMode) console.debug('[ProxyHelper] Null or undefined URL provided');
    return null;
  }

  // URLの基本検証
  if (typeof url !== 'string' || url.trim() === '') {
    if (isDevMode) console.debug('[ProxyHelper] Empty or invalid URL format');
    return null;
  }

  // URLが複雑すぎる場合、ログに記録するが変換は行う
  if (url.length > 500 && isDevMode) {
    console.warn('[ProxyHelper] Very long URL detected:', url.substring(0, 100) + '...');
  }
  
  try {
    // キャッシュのハッシュキーを作成（URLをハッシュ化）
    // 単純なハッシュ関数で文字列からハッシュを生成
    const simpleHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16);
    };
    
    const urlHash = simpleHash(url);
    const timestamp = Date.now().toString();
    const cacheKey = `${urlHash}|${timestamp}`;
    
    // キャッシュを確認（ハッシュベース）
    const cachedEntry = Array.from(urlProxyCache.entries())
      .find(([key]) => key.startsWith(urlHash + '|'));
    
    if (cachedEntry) {
      if (isDevMode) console.debug(`[ProxyHelper] Cache hit for: ${url.substring(0, 30)}...`);
      return cachedEntry[1];
    }
    
    // プロキシが必要かどうか判定
    if (!needsProxying(url)) {
      // キャッシュに保存してそのまま返す
      urlProxyCache.set(cacheKey, url);
      if (isDevMode) console.debug(`[ProxyHelper] Using original URL (trusted domain): ${url.substring(0, 30)}...`);
      return url;
    }
    
    // プロキシURLを生成
    const encodedUrl = encodeURIComponent(url);
    const cacheBuster = Date.now().toString(36); // より短いキャッシュバスター
    const proxyUrl = `/api/proxy/image?url=${encodedUrl}&t=${cacheBuster}`;
    
    if (isDevMode) console.debug(`[ProxyHelper] Generated proxy URL for: ${url.substring(0, 30)}...`);
    
    // キャッシュに保存して返す
    urlProxyCache.set(cacheKey, proxyUrl);
    return proxyUrl;
  } catch (e) {
    console.error('[ProxyHelper] Failed to proxy URL:', url?.substring(0, 50), e);
    // エラー時はnullを返す（元のURLを返すと無限ループの可能性がある）
    return null;
  }
};
