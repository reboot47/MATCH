import { useState } from 'react';
import Image from 'next/image';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { theme } from '@/app/styles/theme';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    location: string;
    occupation: string;
    bio: string;
    images: string[];
    distance?: number;
    lastActive?: string;
    tags?: string[];
  };
  onSwipe: (direction: 'left' | 'right' | 'up', profileId: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipe }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // スワイプ方向の状態
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  
  // 縦方向のモーション値
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [200, 0, -200], [20, 0, -20]);
  const opacityY = useTransform(y, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // スワイプ操作の処理
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // 上スワイプ（スーパーライク）の検出
    if (info.offset.y < -100 && Math.abs(info.offset.x) < 50) {
      setSwipeDirection('up');
      onSwipe('up', profile.id);
      return;
    }
    
    // 横スワイプの検出
    if (info.offset.x > 100) {
      setSwipeDirection('right');
      setExitX(200);
      onSwipe('right', profile.id);
    } else if (info.offset.x < -100) {
      setSwipeDirection('left');
      setExitX(-200);
      onSwipe('left', profile.id);
    }
  };
  
  // 画像の切り替え処理
  const handleImageTap = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev < profile.images.length - 1 ? prev + 1 : prev
      );
    } else {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  return (
    <motion.div 
      className="relative w-full max-w-sm mx-auto h-[70vh] rounded-2xl overflow-hidden shadow-lg bg-white"
      style={{ 
        x, 
        y,
        rotate: swipeDirection === 'up' ? 0 : rotate,
        rotateX: swipeDirection === 'up' ? -20 : rotateX,
        opacity: swipeDirection === 'up' ? opacityY : opacity,
        scale: swipeDirection === 'up' ? 0.8 : 1
      }}
      drag={true}
      dragElastic={0.7}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={swipeDirection === 'up' 
        ? { y: -400, opacity: 0 } 
        : exitX !== null 
          ? { x: exitX } 
          : undefined
      }
      transition={{ 
        type: 'spring', 
        damping: swipeDirection === 'up' ? 15 : 30, 
        stiffness: swipeDirection === 'up' ? 200 : 300 
      }}
      whileTap={{ scale: 0.98 }}
      whileDrag={{
        scale: 0.95,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
    >
      {/* プロフィール画像 */}
      <div className="relative w-full h-4/6">
        <Image 
          src={profile.images[currentImageIndex] || '/images/default-avatar.png'} 
          alt={profile.name}
          fill
          className="object-cover"
          quality={90}
          priority
        />
        
        {/* 画像インジケーター */}
        <div className="absolute top-3 left-0 right-0 flex justify-center space-x-1">
          {profile.images.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* 画像ナビゲーションエリア */}
        <div 
          className="absolute left-0 top-0 h-full w-1/4"
          onClick={() => handleImageTap('prev')}
        />
        <div 
          className="absolute right-0 top-0 h-full w-1/4"
          onClick={() => handleImageTap('next')}
        />
      </div>
      
      {/* プロフィール情報 */}
      <div className="p-4 h-2/6 flex flex-col justify-between">
        {/* 最終アクティブ表示 */}
        {profile.lastActive && (
          <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
            <p className="text-xs text-white font-medium">{profile.lastActive}</p>
          </div>
        )}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
            <motion.button
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center"
              whileTap={theme.animation.tap}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          </div>
          
          <div className="flex items-center text-neutral-500 mt-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile.location} {profile.distance && `・${profile.distance}km`}
          </div>
          
          <div className="flex items-center text-neutral-500 mt-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {profile.occupation}
          </div>
          
          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {profile.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-neutral-600 line-clamp-2">{profile.bio}</p>
        </div>
      </div>
      
      {/* スワイプオーバーレイ */}
      <motion.div 
        className="absolute top-1/4 left-5 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-2xl border-2 border-white rotate-[-20deg] shadow-lg"
        style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        initial={{ scale: 0.8 }}
        animate={{ scale: x.get() > 50 ? 1 : 0.8 }}
      >
        いいね！
      </motion.div>
      
      <motion.div 
        className="absolute top-1/4 right-5 bg-rose-500 text-white px-4 py-2 rounded-lg font-bold text-2xl border-2 border-white rotate-[20deg] shadow-lg"
        style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        initial={{ scale: 0.8 }}
        animate={{ scale: x.get() < -50 ? 1 : 0.8 }}
      >
        パス
      </motion.div>
      
      {/* スーパーライクオーバーレイ */}
      <motion.div 
        className="absolute top-10 left-0 right-0 mx-auto w-fit bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-2xl border-2 border-white shadow-lg"
        style={{ opacity: useTransform(y, [-100, 0], [1, 0]) }}
        initial={{ scale: 0.8 }}
        animate={{ scale: y.get() < -50 ? 1 : 0.8 }}
      >
        スーパーライク！
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;
