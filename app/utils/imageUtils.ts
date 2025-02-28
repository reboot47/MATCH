/**
 * 画像最適化ユーティリティ
 * 
 * Cloudinaryの画像URLを変換し、最適化された画像を提供します。
 */

/**
 * Cloudinary画像のURLを変換して最適化します
 * @param originalUrl 元のCloudinary URL
 * @param options 変換オプション
 * @returns 最適化されたURL
 */
export const getOptimizedImageUrl = (
  originalUrl: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  } = {}
): string => {
  if (!originalUrl) return '';
  
  // Base64データURIの場合はそのまま返す
  if (originalUrl.startsWith('data:')) {
    return originalUrl;
  }
  
  // Cloudinary URLでない場合はそのまま返す
  if (!originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }
  
  // デフォルト値を設定
  const {
    width = 0,
    height = 0,
    quality = 80,
    format = 'auto',
    crop = 'fill'
  } = options;
  
  try {
    // URLをパースしてCloudinaryのアップロードパスを見つける
    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex === -1) return originalUrl;
    
    // URLの基本部分と残りの部分を分離
    const baseUrl = originalUrl.substring(0, uploadIndex + 8); // '/upload/'を含む
    const remainingUrl = originalUrl.substring(uploadIndex + 8);
    
    // 変換パラメータを構築
    const transformations = [];
    
    if (width > 0) transformations.push(`w_${width}`);
    if (height > 0) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality > 0) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    
    // パフォーマンス最適化のための追加パラメータ
    transformations.push('dpr_auto'); // デバイスのDPRに応じた解像度
    
    // URLを再構築
    const transformationString = transformations.join(',');
    const optimizedUrl = `${baseUrl}${transformationString}/${remainingUrl}`;
    
    return optimizedUrl;
  } catch (error) {
    console.error('画像URL変換エラー:', error);
    return originalUrl; // エラーが発生した場合は元のURLを返す
  }
};

/**
 * プロフィール画像用の最適化されたURLを取得します
 * @param url 元のURL
 * @param size サイズ (width/heightともに同じ値)
 */
export const getProfileImageUrl = (url: string, size: number = 80): string => {
  return getOptimizedImageUrl(url, {
    width: size,
    height: size,
    quality: 80,
    crop: 'fill',
    format: 'auto'
  });
};

/**
 * サムネイル画像用の最適化されたURLを取得します
 * @param url 元のURL
 */
export const getThumbnailUrl = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 150,
    height: 150,
    quality: 70,
    crop: 'thumb',
    format: 'auto'
  });
};

/**
 * ギャラリー表示用の最適化されたURLを取得します
 * @param url 元のURL
 */
export const getGalleryImageUrl = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 300,
    quality: 80,
    format: 'auto'
  });
};

/**
 * フルサイズ画像の最適化URLを取得します（大きいサイズだが、圧縮あり）
 * @param url 元のURL
 */
export const getFullsizeImageUrl = (url: string): string => {
  return getOptimizedImageUrl(url, {
    quality: 85,
    format: 'auto'
  });
};
