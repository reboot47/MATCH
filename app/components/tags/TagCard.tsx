'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface TagData {
  id: string;
  name: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  popularity?: number;
}

interface TagCardProps {
  tag: TagData;
  onClick?: (tag: TagData) => void;
  size?: 'small' | 'medium' | 'large';
}

const TagCard: React.FC<TagCardProps> = ({ tag, onClick, size = 'medium' }) => {
  // サイズに基づくスタイル設定
  const cardSizeClasses = {
    small: 'h-24 w-32',
    medium: 'h-32 w-48',
    large: 'h-40 w-56',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // デフォルトの背景色と文字色
  const bgColor = tag.backgroundColor || 'bg-gradient-to-r from-blue-400 to-indigo-500';
  const txtColor = tag.textColor || 'text-white';

  return (
    <motion.div
      className={`relative ${cardSizeClasses[size]} rounded-md overflow-hidden shadow-md cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={() => onClick && onClick(tag)}
    >
      {/* タグの背景 */}
      <div className={`absolute inset-0 ${bgColor} opacity-70`}></div>
      
      {/* タグ名のオーバーレイ */}
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <p className={`${txtColor} ${textSizeClasses[size]} font-bold text-center z-10 drop-shadow-md`}>
          {tag.name}
        </p>
      </div>
      
      {/* タグの説明（オプショナル） */}
      {tag.description && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 p-1">
          <p className="text-xs text-white text-center">{tag.description}</p>
        </div>
      )}
    </motion.div>
  );
};

export default TagCard;
