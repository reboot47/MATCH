"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholderSrc?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onClick?: () => void;
  isProfile?: boolean; // プロフィール画像用のフラグを追加
}

export default function LazyImage({
  src,
  alt,
  width = 500,
  height = 500,
  className = "",
  priority = false,
  placeholderSrc = "/images/placeholder.svg",
  objectFit = "cover",
  onClick,
  isProfile = false, // デフォルトはfalse
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // デフォルトのプロフィールプレースホルダー
  const profilePlaceholder = "/images/profile-placeholder.svg";
  const defaultPlaceholder = isProfile ? profilePlaceholder : placeholderSrc;
  
  // srcが空または無効な場合は確実にプレースホルダーを使用
  // 空の場合は必ずプレースホルダーを返す
  const validSrc = src && typeof src === 'string' && src.trim() !== '' ? src : defaultPlaceholder;
  
  // 初期値も必ず有効な値にする
  const [currentSrc, setCurrentSrc] = useState(defaultPlaceholder);

  useEffect(() => {
    // srcが変更されたときに状態をリセット
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(defaultPlaceholder);
  }, [validSrc, defaultPlaceholder]);

  // 画像読み込みの再試行関数
  const retryLoading = () => {
    if (hasError && validSrc !== defaultPlaceholder) {
      setIsLoading(true);
      setHasError(false);
      // キャッシュバスティングのためにタイムスタンプを追加
      const retrySrc = `${validSrc}?retry=${new Date().getTime()}`;
      // ブラウザ環境でのみ実行するように修正
      if (typeof window !== 'undefined') {
        const img = new window.Image();
        img.src = retrySrc;
        img.onload = () => {
          setCurrentSrc(validSrc);
          setIsLoading(false);
        };
        img.onerror = () => {
          setHasError(true);
          setIsLoading(false);
        };
      }
    }
  };

  return (
    <div className={`relative overflow-hidden ${className} ${isProfile ? 'rounded-full' : ''}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 ${
              isProfile ? 'rounded-full' : ''
            } bg-gray-200 dark:bg-gray-800 animate-pulse`}
          />
        )}
      </AnimatePresence>

      {/* 非表示の本来の画像（プリロード用） */}
      {validSrc !== defaultPlaceholder && (
        <Image
          src={validSrc} // validSrcは終始有効な値
          alt=""
          width={1}
          height={1}
          className="hidden"
          onLoad={() => {
            console.log('【LazyImage】画像の読み込み成功:', validSrc);
            setCurrentSrc(validSrc);
            setIsLoading(false);
          }}
          onError={() => {
            console.log('【LazyImage】画像読み込みエラー:', validSrc);
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}

      {/* 表示用画像 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full"
        onClick={() => {
          if (hasError) {
            retryLoading();
          } else if (onClick) {
            onClick();
          }
        }}
      >
        {/* コンソールに表示するデバッグ情報 */}
        <>{(() => { 
          console.log('【LazyImage結果】', {
            コンポーネント: 'LazyImage',
            結果の画像URL: hasError ? defaultPlaceholder : currentSrc,
            エラー発生: hasError,
            読み込み中: isLoading
          });
          return null; 
        })()}</>
        
        <Image
          src={hasError ? defaultPlaceholder : currentSrc} // 常にデフォルトまたは有効な値が設定される
          alt={alt || '画像'} // altも必ず設定
          width={width}
          height={height}
          priority={priority || isProfile} // プロフィール画像は優先的に読み込む
          style={{ objectFit }}
          className={`transition-opacity duration-300 ease-in-out ${
            isLoading ? "opacity-0" : "opacity-100"
          } w-full h-full ${isProfile ? 'rounded-full' : ''}`}
        />
        
        {/* エラー時の再読み込みボタン */}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-error-300 bg-opacity-30">
            <button 
              onClick={retryLoading}
              className="px-2 py-1 text-xs bg-white text-primary-500 rounded shadow-sm hover:bg-primary-50"
            >
              再読込
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
