import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, X, Star, MapPin, ArrowUpRight, 
  Shield, Gift, MessageCircle, Info
} from 'lucide-react';
import { UserProfile } from '@/components/UserContext';

interface ProfileCardProps {
  profile: UserProfile;
  onLike: () => void;
  onSkip: () => void;
  onSuperLike?: () => void;
  costLike?: number;
  costSuperLike?: number;
  currentIndex: number;
  totalCards: number;
}

export default function ProfileCard({
  profile,
  onLike,
  onSkip,
  onSuperLike,
  costLike = 0,
  costSuperLike = 50,
  currentIndex,
  totalCards
}: ProfileCardProps) {
  
  // プロフィール写真の仮データ
  const photos = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80',
  ];
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };
  
  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };
  
  return (
    <div className="max-w-sm mx-auto">
      <motion.div 
        className={`bg-white rounded-xl shadow-xl overflow-hidden ${
          isExpanded ? 'h-auto' : 'h-[550px]'
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* 写真エリア */}
        <div 
          className="relative h-96 bg-gray-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img 
            src={photos[currentPhotoIndex]} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
          
          {/* 写真ナビゲーション */}
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <div className="flex gap-1">
              {photos.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* 写真切り替えボタン */}
          <div className="absolute inset-y-0 left-0 w-1/4" onClick={prevPhoto}></div>
          <div className="absolute inset-y-0 right-0 w-1/4" onClick={nextPhoto}></div>
          
          {/* 認証バッジ */}
          {profile.isVerified && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full">
              <Shield size={16} />
            </div>
          )}
          
          {/* カードインデックス */}
          <div className="absolute top-4 left-4 bg-black/30 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex}/{totalCards}
          </div>
        </div>
        
        {/* プロフィール情報 */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold flex items-center">
                {profile.name}
                <span className="ml-1 text-gray-500">{profile.age}</span>
              </h2>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{profile.location}</span>
                {profile.occupation && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{profile.occupation}</span>
                  </>
                )}
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => {/* プロフィール詳細表示 */}}
            >
              <Info size={20} />
            </button>
          </div>
          
          {/* 趣味タグ */}
          <div className="flex flex-wrap gap-1 mt-3">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{profile.interests.length - 3}
              </span>
            )}
          </div>
          
          {/* 自己紹介 */}
          <p className={`text-gray-600 mt-3 text-sm ${
            !isExpanded && profile.bio.length > 100 ? 'line-clamp-2' : ''
          }`}>
            {profile.bio}
          </p>
          
          {!isExpanded && profile.bio.length > 100 && (
            <button 
              className="text-primary text-xs mt-1 flex items-center"
              onClick={() => setIsExpanded(true)}
            >
              もっと見る
              <ArrowUpRight size={12} className="ml-1" />
            </button>
          )}
        </div>
        
        {/* アクションボタン */}
        <div className="px-4 pb-4 pt-2 flex justify-center gap-4">
          <motion.button
            className="w-14 h-14 bg-white shadow-md rounded-full flex items-center justify-center text-gray-500 border border-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSkip}
          >
            <X size={30} />
          </motion.button>
          
          {onSuperLike && (
            <motion.button
              className="w-12 h-12 bg-blue-500 shadow-md rounded-full flex items-center justify-center text-white relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSuperLike}
            >
              <Star size={24} />
              {costSuperLike > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-white text-blue-500 text-xs px-1 py-0.5 rounded-full border border-blue-200 font-medium">
                  {costSuperLike}p
                </div>
              )}
            </motion.button>
          )}
          
          <motion.button
            className="w-14 h-14 bg-primary shadow-md rounded-full flex items-center justify-center text-white relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
          >
            <Heart size={30} />
            {costLike > 0 && (
              <div className="absolute -bottom-2 -right-2 bg-white text-primary text-xs px-1 py-0.5 rounded-full border border-primary/20 font-medium">
                {costLike}p
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
