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
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);

  // デフォルトのプロフィールプレースホルダー
  const profilePlaceholder = "/images/profile-placeholder.svg";

  useEffect(() => {
    // srcが変更されたときに状態をリセット
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(isProfile ? profilePlaceholder : placeholderSrc);
  }, [src, placeholderSrc, isProfile, profilePlaceholder]);

  // 画像読み込みの再試行関数
  const retryLoading = () => {
    if (hasError) {
      setIsLoading(true);
      setHasError(false);
      // キャッシュバスティングのためにタイムスタンプを追加
      const retrySrc = `${src}?retry=${new Date().getTime()}`;
      const img = new Image();
      img.src = retrySrc;
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoading(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
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
      <Image
        src={src}
        alt=""
        width={1}
        height={1}
        className="hidden"
        onLoad={() => {
          setCurrentSrc(src);
          setIsLoading(false);
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />

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
        <Image
          src={hasError ? (isProfile ? profilePlaceholder : placeholderSrc) : currentSrc}
          alt={alt}
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
