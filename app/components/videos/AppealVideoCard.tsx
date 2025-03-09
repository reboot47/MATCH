import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiOutlinePlay, HiOutlineClock, HiOutlineEye } from 'react-icons/hi';
import { AppealVideo } from '@/app/data/appealVideoData';

interface AppealVideoCardProps {
  video: AppealVideo;
  onClick?: (video: AppealVideo) => void;
  size?: 'small' | 'medium' | 'large';
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const formatViews = (views: number): string => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`;
  }
  return views.toString();
};

const AppealVideoCard: React.FC<AppealVideoCardProps> = ({ 
  video, 
  onClick, 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-28 h-40',
    medium: 'w-36 h-52',
    large: 'w-full h-64'
  };

  const handleClick = () => {
    if (onClick) {
      onClick(video);
    }
  };

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden shadow-md ${sizeClasses[size]}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onClick={handleClick}
    >
      {/* サムネイル画像 */}
      <div className="relative w-full h-full">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={size === 'large'}
        />
        
        {/* オーバーレイグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          {/* 再生アイコン */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full p-2 backdrop-blur-sm">
            <HiOutlinePlay className="text-white" size={size === 'small' ? 20 : 24} />
          </div>
          
          {/* 動画情報 */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-white font-medium truncate text-sm">
              {video.title}
            </h3>
            
            {/* 再生時間と視聴回数 */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center text-white/80 text-xs">
                <HiOutlineClock className="mr-1" size={12} />
                <span>{formatDuration(video.duration)}</span>
              </div>
              
              <div className="flex items-center text-white/80 text-xs">
                <HiOutlineEye className="mr-1" size={12} />
                <span>{formatViews(video.views)}</span>
              </div>
            </div>
            
            {/* タグ（大きいサイズの場合のみ表示） */}
            {size === 'large' && (
              <div className="flex flex-wrap gap-1 mt-2">
                {video.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 再生時間バッジ */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
          {formatDuration(video.duration)}
        </div>
      </div>
    </motion.div>
  );
};

export default AppealVideoCard;
