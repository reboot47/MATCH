/**
 * 画像URLをバリデーションし、空や無効な場合はnullを返す（絶対に空文字列を返さない）
 * @param url 検証する画像URL
 * @returns 有効な画像URLまたはnull
 */
export const validateImageUrl = (url?: string | null): string | null => {
  // nullやundefinedの場合はnullを返す
  if (url === null || url === undefined) {
    return null;
  }
  
  // 文字列型でない場合はnullを返す
  if (typeof url !== 'string') {
    return null;
  }
  
  // 空文字列のチェック
  if (url === '') {
    return null;
  }
  
  // 空白のみの文字列チェック
  if (url.trim() === '') {
    return null;
  }
  
  // URLをトリムして返す
  return url.trim();
};

/**
 * 画像URLが有効かどうかを確認
 * @param url 検証する画像URL
 * @returns boolean 有効ならtrue
 */
export const isValidImageUrl = (url?: string | null): boolean => {
  // nullやundefined、空文字列の場合は無効
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  
  // 画像パスを正規化
  const trimmedUrl = url.trim();
  
  // フォーマットを判定
  const isDataURL = trimmedUrl.startsWith('data:image/');
  
  // データURLは有効
  if (isDataURL) return true;
  
  // 相対パスの場合は常に有効と見なす (例: /images/avatar.jpg)
  if (trimmedUrl.startsWith('/')) return true;
  
  // blob URLの場合も有効
  if (trimmedUrl.startsWith('blob:')) return true;
  
  // 絶対URLの場合はプロトコルと拡張子の確認
  try {
    const urlObj = new URL(trimmedUrl);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch (e) {
    // URLとして解析できない場合は無効と見なす
    return false;
  }
};

/**
 * 安全な画像URLを取得する（絶対に空文字列を返さない）
 * @param url 元のURL
 * @param fallback フォールバック画像URL
 * @returns 有効なURLまたはデフォルト画像のURL
 */
export const getSafeImageUrl = (url?: string | null, fallback: string = '/images/placeholder.png'): string => {
  // あらかじめデバッグ情報をログ出力
  console.debug('[getSafeImageUrl] Input URL:', url, 'Fallback:', fallback);
  
  // まず入力URLを検証
  if (isValidImageUrl(url)) {
    const validUrl = url as string;
    console.debug('[getSafeImageUrl] Using valid input URL:', validUrl);
    return validUrl;
  }
  
  // 入力URLが無効な場合はフォールバックURLを使用
  console.debug('[getSafeImageUrl] Input URL is invalid, trying fallback');
  if (isValidImageUrl(fallback)) {
    console.debug('[getSafeImageUrl] Using fallback URL:', fallback);
    return fallback;
  }
  
  // それでも有効でない場合は絶対に安全なデフォルト画像を返す
  console.debug('[getSafeImageUrl] Using default placeholder image');
  return '/images/placeholder.png';
};

/**
 * プレースホルダー画像を返す（旧関数互換性用）
 * @param url 検証する画像URL
 * @param placeholder プレースホルダー画像のパス
 * @returns 有効な画像URL
 */
export const getImageWithFallback = (url?: string | null, placeholder: string = '/images/placeholder.png'): string => {
  const validUrl = validateImageUrl(url);
  return validUrl || placeholder;
};

/**
 * ギフト画像URLをバリデーション
 * @param url ギフト画像URL
 * @returns 有効なギフト画像URL、絶対に空文字列を返さない
 */
export const validateGiftImageUrl = (url?: string | null): string => {
  // デフォルトのギフト画像パス
  const DEFAULT_GIFT_IMAGE = '/images/gifts/default-gift.png';

  // 入力値の詳細デバッグ
  console.log('【validateGiftImageUrl】入力詳細:', {
    url,
    type: typeof url,
    isEmpty: url === '',
    isNull: url === null,
    isUndefined: url === undefined
  });

  // URLが無効な場合はデフォルト画像を返す
  if (!url || url.trim() === '') {
    console.warn('【validateGiftImageUrl】無効なURL:', url);
    return DEFAULT_GIFT_IMAGE;
  }

  // 相対パスの場合の処理
  if (url.startsWith('/')) {
    console.log('【validateGiftImageUrl】相対パスを使用:', url);
    return url;
  }

  // URLのバリデーション
  try {
    const parsedUrl = new URL(url);
    
    // 画像ファイルの拡張子チェック
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext => 
      parsedUrl.pathname.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      console.warn('【validateGiftImageUrl】無効なファイル形式:', url);
      return DEFAULT_GIFT_IMAGE;
    }

    // 画像URLの存在確認（オプション）
    fetch(url, { method: 'HEAD' })
      .catch(() => {
        console.warn('【validateGiftImageUrl】画像URLにアクセスできません:', url);
        return DEFAULT_GIFT_IMAGE;
      });

    // 有効なURLを返す
    console.log('【validateGiftImageUrl】有効なURL:', url);
    return url;

  } catch (error) {
    console.error('【validateGiftImageUrl】URLのパースエラー:', error);
    return DEFAULT_GIFT_IMAGE;
  }
};

/**
 * プロフィール画像URLをバリデーション
 * @param url プロフィール画像URL
 * @returns 有効なプロフィール画像URL
 */
export const validateProfileImageUrl = (url?: string): string => {
  return getImageWithFallback(url, '/images/profile-placeholder.svg');
};

/**
 * アバター画像URLをバリデーション
 * @param url アバター画像URL
 * @returns 有効なアバター画像URL
 */
export const validateAvatarUrl = (url?: string): string => {
  return getImageWithFallback(url, '/images/default-avatar.svg');
};
