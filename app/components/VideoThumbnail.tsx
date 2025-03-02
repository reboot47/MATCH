"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineUsers, HiOutlinePlay } from "react-icons/hi";
import LazyImage from "./LazyImage";

interface VideoThumbnailProps {
  id: string;
  title: string;
  hostName: string;
  hostImage: string;
  thumbnailUrl: string;
  viewerCount: number;
  isLive: boolean;
  onClick: () => void;
}

export default function VideoThumbnail({
  id,
  title,
  hostName,
  hostImage,
  thumbnailUrl,
  viewerCount,
  isLive,
  onClick
}: VideoThumbnailProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <motion.div
      className="rounded-xl overflow-hidden ios-card relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={onClick}
    >
      <div className="relative aspect-video">
        <LazyImage
          src={thumbnailUrl}
          alt={title}
          width={320}
          height={180}
          className="w-full aspect-video object-cover"
        />
        
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold truncate text-sm">{title}</h3>
            
            <div className="flex items-center space-x-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
              <HiOutlineUsers className="w-3 h-3" />
              <span>{viewerCount}</span>
            </div>
          </div>
        </div>
        
        {/* ライブステータス */}
        {isLive && (
          <div className="absolute top-2 left-2 bg-secondary-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
            LIVE
          </div>
        )}
        
        {/* プレイボタン - ホバー時に表示 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-primary-500 rounded-full p-3"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiOutlinePlay className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* ホスト情報 */}
      <div className="p-3 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <LazyImage
            src={hostImage}
            alt={hostName}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 dark:text-gray-100 font-medium text-sm truncate">{hostName}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
            {isLive ? "ライブ配信中" : "録画配信"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
