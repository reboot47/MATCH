"use client";

import { useState, useEffect, ImgHTMLAttributes, useMemo } from 'react';
import Image from 'next/image';
import { getProxiedImageUrl } from '@/app/utils/proxyHelpers';

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  defaultAlt?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
  quality?: number;
  priority?: boolean;
}

/**
 * 超単純化された安全な画像表示コンポーネント
 */
export function SafeImage({ 
  src, 
  fallbackSrc = `/images/placeholder.svg`, 
  alt = '', 
  defaultAlt = '画像',
  onError,
  width = 100,
  height = 100,
  className = '',
  style,
  fill,
  objectFit = 'cover',
  objectPosition,
  quality,
  priority,
  ...rest 
}: SafeImageProps) {
  // ユニークなコンポーネント識別子を生成（ログ用）
  const componentId = useMemo(() => Math.random().toString(36).substring(2, 6), []);
  
  // 表示状態を管理
  const [hasError, setHasError] = useState<boolean>(false);
  
  // 初期状態の画像ソース設定
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  
  // srcが変更されたときに画像URLを更新
  useEffect(() => {
    try {
      if (src && typeof src === 'string' && src.trim() !== '') {
        // 外部URLの場合はプロキシを使用
        if (src.startsWith('http') && !src.startsWith('/')) {
          const proxiedUrl = getProxiedImageUrl(src);
          if (proxiedUrl) {
            setImgSrc(proxiedUrl);
          } else {
            setImgSrc(fallbackSrc);
          }
        } else {
          setImgSrc(src);
        }
      } else {
        setImgSrc(fallbackSrc);
      }
    } catch (error) {
      console.error(`[SafeImage:${componentId}] Error processing image URL:`, error);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  }, [src, fallbackSrc, componentId]);

  // エラーハンドリング - フォールバック画像を表示
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // イベントの処理を続行
    e.preventDefault();
    
    // デバッグログ
    if (process.env.NODE_ENV === 'development') {
      const imgSrcTruncated = imgSrc ? (imgSrc.length > 30 ? `${imgSrc.substring(0, 30)}...` : imgSrc) : 'null';
      console.error(`[SafeImage:${componentId}] Image load error for URL: ${imgSrcTruncated}`);
    }
    
    // フォールバック画像に切り替え
    setImgSrc(fallbackSrc);
    setHasError(true);
    
    // カスタムエラーハンドラがあれば呼び出す
    if (onError) {
      onError(e);
    }
  };
  
  // 画像ロード成功時の処理
  const handleImageLoad = () => {
    // ロード成功したらエラーフラグをクリア
    setHasError(false);
    
    if (process.env.NODE_ENV === 'development') {
      const imgSrcTruncated = imgSrc ? (imgSrc.length > 30 ? `${imgSrc.substring(0, 30)}...` : imgSrc) : 'null';
      console.debug(`[SafeImage:${componentId}] Image loaded successfully: ${imgSrcTruncated}`);
    }
  };
  
  // 優先度の高い画像をプリロード
  useEffect(() => {
    if (priority && imgSrc && typeof window !== 'undefined') {
      const preloadImg = new window.Image();
      preloadImg.src = imgSrc;
    }
  }, [imgSrc, priority]);
  
  // 画像URLが空でないことを確認
  const validImgSrc = imgSrc && imgSrc.trim() !== '' ? imgSrc : '/images/placeholder.svg';
  
  // 実際にDOMに渡すsrc値
  const safeSrc = validImgSrc === '' ? undefined : validImgSrc;
  
  // スタイルの設定
  const imageStyle = {
    objectFit,
    objectPosition,
    ...(hasError ? {
      border: '1px solid rgba(220, 38, 38, 0.3)',
      borderRadius: '3px',
      backgroundColor: 'rgba(254, 242, 242, 0.6)'
    } : {}),
    ...(fill ? {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    } : {}),
    ...style
  } as React.CSSProperties;

  return (
    <img 
      src={safeSrc}
      alt={alt || defaultAlt}
      onError={handleImageError}
      onLoad={handleImageLoad}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      style={imageStyle}
      loading={priority ? "eager" : "lazy"}
      {...rest}
    />
  );
}

/**
 * アバター画像用のSafeImage
 */
export function AvatarImage(props: Omit<SafeImageProps, 'fallbackSrc'>) {
  // srcが空または無効な場合は安全な値を設定
  const safeProps = {
    ...props,
    src: props.src && typeof props.src === 'string' && props.src.trim() !== '' 
      ? props.src 
      : null 
  };
  
  return <SafeImage 
    {...safeProps} 
    fallbackSrc="/images/avatar-placeholder.svg"
    defaultAlt="ユーザー" 
  />;
}

/**
 * スタンプ画像用のSafeImage
 */
export function StickerImage(props: Omit<SafeImageProps, 'fallbackSrc'>) {
  // srcが空または無効な場合は安全な値を設定
  const safeProps = {
    ...props,
    src: props.src && typeof props.src === 'string' && props.src.trim() !== '' 
      ? props.src 
      : null 
  };
  
  return <SafeImage 
    {...safeProps} 
    fallbackSrc="/images/sticker-placeholder.svg" 
    defaultAlt="スタンプ" 
  />;
}

export default SafeImage;
