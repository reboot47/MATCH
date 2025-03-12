import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineVideoCamera, HiOutlineFire, HiOutlineClock } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import AppealVideoCard from './AppealVideoCard';
import AppealVideoButton from '@/app/components/AppealVideoButton';
import { 
  AppealVideo, 
  getPopularAppealVideos, 
  getLatestAppealVideos 
} from '@/app/data/appealVideoData';

interface AppealVideoSectionProps {
  onVideoSelect?: (video: AppealVideo) => void;
}

type SortOption = 'popular' | 'latest';

const AppealVideoSection: React.FC<AppealVideoSectionProps> = ({ 
  onVideoSelect 
}) => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [selectedVideo, setSelectedVideo] = useState<AppealVideo | null>(null);

  // ソートオプションに基づいて動画を取得
  const videos = sortOption === 'popular' 
    ? getPopularAppealVideos() 
    : getLatestAppealVideos();

  const handleVideoClick = (video: AppealVideo) => {
    setSelectedVideo(video);
    if (onVideoSelect) {
      onVideoSelect(video);
    }
  };
  
  // アピール動画追加ページへの遷移
  const handleAddVideo = () => {
    console.log('アピール動画追加ボタンがクリックされました');
    // 直接window.locationを使用して遷移します
    window.location.href = '/mypage/profile/edit/appeal-video/new';
  };

  return (
    <div className="py-4">
      {/* ヘッダーとソートオプション */}
      <div className="px-4 mb-4">
        <div className="flex items-center mb-2">
          <HiOutlineVideoCamera className="mr-2 text-pink-500" size={24} />
          <h2 className="text-lg font-bold text-gray-800">アピール動画</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">
          個性が光るアピール動画で相手の魅力を発見しよう！
        </p>
        
        {/* ソートオプション */}
        <div className="flex gap-2">
          <motion.button
            className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
              sortOption === 'popular' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortOption('popular')}
          >
            <HiOutlineFire className="mr-1" />
            人気順
          </motion.button>
          
          <motion.button
            className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
              sortOption === 'latest' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortOption('latest')}
          >
            <HiOutlineClock className="mr-1" />
            新着順
          </motion.button>
        </div>
      </div>

      {/* フィーチャード動画（1番上に大きく表示） */}
      {videos.length > 0 && (
        <div className="px-4 mb-4">
          <AppealVideoCard 
            video={videos[0]} 
            size="large" 
            onClick={handleVideoClick}
          />
        </div>
      )}
      
      {/* 自分のアピール動画追加ボタン */}
      <div className="px-4 mb-4">
        <AppealVideoButton />
      </div>

      {/* 動画グリッド */}
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {videos.slice(1).map(video => (
            <AppealVideoCard
              key={video.id}
              video={video}
              size="medium"
              onClick={handleVideoClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppealVideoSection;
