import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { logImageError, logImageSuccess } from '@/app/utils/imageDebugger';
import { SafeImage } from './SafeImage';

interface GiftImageProps {
  src?: string | null;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fill?: boolean;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
  priority?: boolean;
  quality?: number;
  giftName?: string; // ギフト名（例：「ハート」「ケーキ」）
  style?: React.CSSProperties; // 追加のスタイル
  showLineStyle?: boolean; // LINE風表示を有効にするフラグ
  previewMode?: boolean; // プレビューモード（ギフトセレクタで使用）
}

// ギフト情報の型定義
type GiftInfo = {
  path: string;
  name: string;
  emoji: string;
};

// 既知のギフト画像のリスト（フォーマット統一＆SVG優先）
const GIFT_IMAGES: Record<string, GiftInfo> = {
  // 実際に存在するギフト画像 - SVG優先（高品質）
  'heart': {
    path: '/images/gifts/heart.svg',
    name: 'ハート',
    emoji: '❤️'
  },
  'cake': {
    path: '/images/gifts/cake.svg',
    name: 'ケーキ',
    emoji: '🍰'
  },
  'flowers': {
    path: '/images/gifts/flowers.svg',
    name: '花束',
    emoji: '💐'
  },
  'wine': {
    path: '/images/gifts/wine.svg',
    name: 'ワイン',
    emoji: '🍷'
  },
  'dinner': {
    path: '/images/gifts/dinner.svg',
    name: 'ディナー',
    emoji: '🍽️'
  },
  'default-gift': {
    path: '/images/gifts/default-gift.svg',
    name: 'ギフト',
    emoji: '🎁'
  },
  
  // エイリアス（互換性維持）
  'flower': {
    path: '/images/gifts/flowers.svg',
    name: '花束',
    emoji: '💐'
  },
  'gift': {
    path: '/images/gifts/default-gift.svg',
    name: 'ギフト',
    emoji: '🎁'
  }
};

// 安全なフォールバック画像パス（SVG優先）
const FALLBACK_GIFT_PATH = '/images/gift-placeholder.svg';

/**
 * 改良版ギフト画像表示コンポーネント
 * - LINEスタイルのギフト表示をサポート
 * - SVG画像を優先使用して高品質表示
 * - 堅牢なエラーハンドリングと画像解決
 */
// プリロード済み画像を追跡するためのセット（グローバルキャッシュ）
const preloadedImages = new Set<string>();

const GiftImage: React.FC<GiftImageProps> = (props) => {
  const { 
    src, 
    alt,
    width = 100, 
    height = 100, 
    quality = 90, 
    priority = true,
    className,
    giftName,
    objectFit = 'contain',
    style,
    showLineStyle = true, // デフォルトでLINE風表示を有効に
    previewMode = false, // デフォルトでプレビューモードは無効
    ...otherProps 
  } = props;

  // ローディング状態管理
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // コンポーネント識別子（デバッグ用）
  const componentId = useMemo(() => Math.random().toString(36).substring(2, 8), []);

    // 超シンプルなギフト情報の解決ロジック
  const resolvedGift = useMemo(() => {
    // デフォルトはハートギフト
    const defaultGift = {
      path: '/images/gifts/heart.svg',
      name: 'ハート',
      emoji: '❤️'
    };
    
    // srcが無効な場合はデフォルトを返す
    if (!src) {
      return defaultGift;
    }

    // キー名として知られているギフトの場合
    if (typeof src === 'string') {
      const giftKey = src.toLowerCase().trim();
      if (GIFT_IMAGES[giftKey]) {
        return GIFT_IMAGES[giftKey];
      }
      
      // ローカルパスの場合はそのまま使用
      if (src.startsWith('/')) {
        return {
          path: src,
          name: giftName || 'ギフト',
          emoji: '🎁'
        };
      }
    }
    
    // どれにも当てはまらない場合はデフォルトのハート
    return defaultGift;
  }, [src, giftName]);

  // 読み込み状態のリセット - シンプル化
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [resolvedGift.path]);

  // 開発環境での簡易ログ
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GiftImage] ${src || 'null'} -> ${resolvedGift.path}`);
    }
  }, [src, resolvedGift]);
  
  // 画像ロードハンドラ
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    
    if (process.env.NODE_ENV === 'development') {
      logImageSuccess('GiftImage', `${resolvedGift.path} (ギフト画像読み込み完了)`);
    }
  };

  // エラーハンドラ
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`[GiftImage:${componentId}] Failed to load: ${resolvedGift.path}`);
      logImageError('GiftImage', resolvedGift.path, `ギフト画像読み込み失敗: ${resolvedGift.name}`);
    }
    
    // 親コンポーネントのエラーハンドラ呼び出し
    if (props.onError) {
      props.onError(e);
    }
  };

  // 優先度の高い画像を事前読み込み
  useEffect(() => {
    if (priority && resolvedGift.path && !preloadedImages.has(resolvedGift.path)) {
      // ブラウザ環境でのみ実行
      if (typeof window !== 'undefined') {
        const img = new window.Image();
        img.src = resolvedGift.path;
        img.onload = () => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[GiftImage:${componentId}] Preloaded: ${resolvedGift.path}`);
          }
          preloadedImages.add(resolvedGift.path);
        };
        img.onerror = () => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[GiftImage:${componentId}] Preload failed: ${resolvedGift.path}`);
            logImageError('GiftImage', resolvedGift.path, 'プリロード失敗');
          }
        };
      }
    }
  }, [resolvedGift.path, priority, componentId]);

  // SafeImageを活用した画像表示 - より一貫したエラーハンドリング
  return (
    <div className={className} style={style}>
      <SafeImage
        src={resolvedGift.path}
        fallbackSrc={FALLBACK_GIFT_PATH}
        alt={alt || resolvedGift.name}
        width={typeof width === 'number' ? width : 100}
        height={typeof height === 'number' ? height : 100}
        quality={quality}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        objectFit={objectFit}
        {...otherProps}
      />
    </div>
  );
};

export default GiftImage;
