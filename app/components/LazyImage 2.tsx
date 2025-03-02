'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const LazyImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  objectFit = 'cover',
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState('/images/default-avatar.png');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };
    
    // 高速化: 既にキャッシュされている場合の対応
    if (img.complete) {
      setImageSrc(src);
      setLoaded(true);
    }
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Next.js Imageコンポーネントのpropsを設定
  const imageProps = {
    src: error ? '/images/default-avatar.png' : imageSrc,
    alt,
    className: `transition-opacity duration-300 ${className} ${loaded ? 'opacity-100' : 'opacity-0'}`,
    width,
    height,
    fill,
    sizes,
    priority,
    loading: priority ? 'eager' : 'lazy',
    style: {
      objectFit,
    },
    onLoadingComplete: () => setLoaded(true),
  };

  if (fill) {
    // fill属性が指定されている場合
    return (
      <div className="relative w-full h-full">
        <Image {...imageProps} />
      </div>
    );
  }

  // 通常のイメージ（width/height指定）
  return <Image {...imageProps} />;
};

export default LazyImage;
