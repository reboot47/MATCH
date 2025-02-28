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
  originalUrl: string | any, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  } = {}
): string => {
  // デフォルト画像のパス
  const defaultImagePath = '/images/default-avatar.png';
  
  if (!originalUrl) return defaultImagePath;
  
  // オブジェクトの場合、URLプロパティを取得
  if (typeof originalUrl === 'object' && originalUrl !== null) {
    // 写真オブジェクトからURLを抽出
    if (originalUrl.url) {
      originalUrl = originalUrl.url;
    } else if (originalUrl.imageUrl) {
      originalUrl = originalUrl.imageUrl;
    } else if (originalUrl.image) {
      originalUrl = originalUrl.image;
    } else {
      console.warn('有効なURL情報がオブジェクトから取得できませんでした', originalUrl);
      return defaultImagePath;
    }
  }
  
  // originalUrlが文字列でない場合はデフォルト画像を返す
  if (typeof originalUrl !== 'string') {
    console.warn('有効なURLが指定されていません', originalUrl);
    return defaultImagePath;
  }
  
  // 空文字列の場合もデフォルト画像を返す
  if (originalUrl === '') {
    return defaultImagePath;
  }
  
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
 * 動画のサムネイルURLを取得する
 * @param videoUrl 動画のURL
 * @returns サムネイル画像のURL
 */
export const getVideoThumbnailUrl = (videoUrl: string | any): string => {
  // まず、オブジェクトからサムネイルURLを取得する機能を追加
  if (typeof videoUrl === 'object' && videoUrl !== null) {
    // オブジェクトにthumbnailUrlプロパティがある場合、それを優先的に使用
    if (videoUrl.thumbnailUrl) {
      return videoUrl.thumbnailUrl;
    }
    
    // 通常のURLプロパティを取得
    if (videoUrl.url) {
      videoUrl = videoUrl.url;
    } else {
      console.warn('有効な動画URL情報がオブジェクトから取得できませんでした', videoUrl);
      return '/images/default-video-thumbnail.jpg';
    }
  }

  if (!videoUrl) {
    return '/images/default-video-thumbnail.jpg';
  }

  // サムネイルURLが既に存在する場合はそのまま使用（文字列として渡された場合）
  if (typeof videoUrl === 'string' && videoUrl.includes('/thumbnail_')) {
    return videoUrl;
  }

  // YouTubeの場合
  const youtubeMatch = typeof videoUrl === 'string' && videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }

  // Vimeoの場合
  const vimeoMatch = typeof videoUrl === 'string' && videoUrl.match(/vimeo\.com\/(?:.*\/)?(?:videos\/)?([0-9]+)(?:.*)?$/);
  if (vimeoMatch && vimeoMatch[1]) {
    // Vimeoはサムネイルを取得するためにAPIが必要なので、ここではプレースホルダーを返す
    return '/images/vimeo-placeholder.jpg';
  }

  // ローカルビデオファイルの場合
  if (typeof videoUrl === 'string') {
    const lowerCaseUrl = videoUrl.toLowerCase();
    
    // Cloudinaryの動画URLの場合、対応するサムネイルURLを生成
    if (lowerCaseUrl.includes('cloudinary.com') && 
        (lowerCaseUrl.includes('/video/upload/') || lowerCaseUrl.includes('/videos/'))) {
      // サムネイルURLパスを生成（動画のパスから派生）
      return videoUrl.replace(/\/video\/upload\//, '/video/upload/c_thumb,w_500,h_500,g_auto/');
    }
    
    if (lowerCaseUrl.startsWith('/test.mov') || lowerCaseUrl.endsWith('.mov')) {
      return '/images/mov-icon.jpg';
    }
    
    if (lowerCaseUrl.startsWith('/test.mp4') || lowerCaseUrl.endsWith('.mp4')) {
      return '/images/mp4-icon.jpg';
    }
    
    // その他のビデオファイル
    if (lowerCaseUrl.match(/\.(mp4|mov|webm|ogg|avi|wmv|flv|mkv)(\?.*)?$/i)) {
      return '/images/video-icon.jpg';
    }
  }

  // 不明な場合はデフォルトのサムネイルを返す
  return '/images/default-video-thumbnail.jpg';
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
