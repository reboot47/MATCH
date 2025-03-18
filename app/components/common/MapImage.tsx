import React, { useState, useEffect, useMemo } from 'react';
import { logImageError, logImageSuccess } from '@/app/utils/imageDebugger';

interface MapImageProps {
  latitude?: number | string;
  longitude?: number | string;
  name?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fill?: boolean;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  zoom?: number;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  priority?: boolean;
}

/**
 * 極めてシンプルなマップ表示コンポーネント
 */
const MapImage: React.FC<MapImageProps> = ({ 
  latitude = 35.6812, // デフォルトは東京
  longitude = 139.7671, // デフォルトは東京
  name = '地図', 
  className = '',
  width = '100%',
  height = '150px',
  onError,
  fill,
  objectFit = 'cover',
  zoom = 15,
  mapType = 'roadmap',
  priority = false,
  ...rest
}) => {
  // ユニークなコンポーネント識別子を生成（ログ用）
  const componentId = useMemo(() => Math.random().toString(36).substring(2, 6), []);
  
  // 画像読み込み状態管理
  const [hasError, setHasError] = useState<boolean>(false);
  
  // 常に動作する地図URLのフォールバック
  const placeholderImageUrl = '/images/map-placeholder.svg';
  
  // どんな入力値でも動作するように保証
  const lat = latitude ? Number(latitude) || 35.6812 : 35.6812;
  const lng = longitude ? Number(longitude) || 139.7671 : 139.7671;
  
  // Google Maps Static API用のURL
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&maptype=${mapType}&markers=color:red|${lat},${lng}&key=${apiKey}`;

  // エラーハンドラ
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.preventDefault();
    setHasError(true);
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`[MapImage:${componentId}] Failed to load map for coordinates: ${lat},${lng}`);
      logImageError('MapImage', mapUrl, `地図画像の読み込みに失敗しました`);
    }
    
    // カスタムエラーハンドラがあれば呼び出す
    if (onError) {
      onError(e);
    }
  };
  
  // 画像ロード成功時の処理
  const handleLoad = () => {
    setHasError(false);
    
    if (process.env.NODE_ENV === 'development') {
      logImageSuccess('MapImage', `位置: ${lat},${lng} の地図画像読み込み成功`);
    }
  };
  
  // 優先度の高い地図画像をプリロード
  useEffect(() => {
    if (priority && mapUrl && typeof window !== 'undefined') {
      const preloadImg = new window.Image();
      preloadImg.src = mapUrl;
    }
  }, [mapUrl, priority]);
  
  // スタイルの変数を準備
  const containerStyle = {
    width,
    height,
    position: 'relative' as const,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    ...(hasError ? {
      border: '1px solid rgba(220, 38, 38, 0.3)',
      backgroundColor: 'rgba(254, 242, 242, 0.6)'
    } : {})
  };
  
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit || 'cover'
  };

  return (
    <div className={className} style={containerStyle}>
      <img
        src={hasError ? placeholderImageUrl : mapUrl}
        alt={name}
        style={imageStyle}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? "eager" : "lazy"}
        {...rest}
      />
    </div>
  );
};

export default MapImage;
