"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiFlag, FiMoreVertical, FiMessageCircle, FiHeart, FiGift } from 'react-icons/fi';
import ReportContentModal from '../shared/ReportContentModal';

interface UserProfileCardProps {
  userId: string;
  username: string;
  age: number;
  location: string;
  occupation?: string;
  bio?: string;
  avatarUrl: string;
  isVerified: boolean;
  isOnline: boolean;
  lastActive?: string;
  memberSince: string;
  onSendMessage?: () => void;
  onLike?: () => void;
  onSendGift?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userId,
  username,
  age,
  location,
  occupation,
  bio,
  avatarUrl,
  isVerified,
  isOnline,
  lastActive,
  memberSince,
  onSendMessage,
  onLike,
  onSendGift
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  
  // アクションメニューの表示・非表示
  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };
  
  // 報告モーダルを開く
  const openReportModal = () => {
    setIsOptionsOpen(false);
    setIsReportModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* プロフィールヘッダー */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <div className="absolute bottom-4 left-4 flex items-end">
          <div className="relative">
            <div className="rounded-full h-20 w-20 border-4 border-white overflow-hidden">
              <Image 
                src={avatarUrl} 
                alt={username}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="ml-4 text-white">
            <h2 className="text-xl font-bold">{username}, {age}</h2>
            <div className="flex items-center text-sm">
              <span className="mr-2">{location}</span>
              {isOnline ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                  オンライン
                </span>
              ) : (
                lastActive && (
                  <span className="text-gray-300 text-xs">
                    最終アクティブ: {lastActive}
                  </span>
                )
              )}
            </div>
            {occupation && (
              <p className="text-sm text-gray-200">{occupation}</p>
            )}
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button 
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
              onClick={toggleOptions}
            >
              <FiMoreVertical size={20} />
            </button>
            
            {isOptionsOpen && (
              <motion.div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={openReportModal}
                >
                  <FiFlag className="mr-2" size={16} />
                  プロフィールを報告
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* プロフィール情報 */}
      <div className="p-4">
        {bio && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">自己紹介</h3>
            <p className="text-gray-700">{bio}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mb-4">
          会員登録: {memberSince}
        </div>
        
        {/* アクションボタン */}
        <div className="grid grid-cols-3 gap-2">
          {onSendMessage && (
            <motion.button
              className="flex flex-col items-center justify-center p-3 bg-blue-500 text-white rounded-md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSendMessage}
            >
              <FiMessageCircle size={20} />
              <span className="mt-1 text-xs font-medium">メッセージ</span>
            </motion.button>
          )}
          
          {onLike && (
            <motion.button
              className="flex flex-col items-center justify-center p-3 bg-pink-500 text-white rounded-md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLike}
            >
              <FiHeart size={20} />
              <span className="mt-1 text-xs font-medium">いいね</span>
            </motion.button>
          )}
          
          {onSendGift && (
            <motion.button
              className="flex flex-col items-center justify-center p-3 bg-purple-500 text-white rounded-md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSendGift}
            >
              <FiGift size={20} />
              <span className="mt-1 text-xs font-medium">ギフト</span>
            </motion.button>
          )}
        </div>
      </div>
      
      {/* 報告モーダル */}
      <ReportContentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentId={userId}
        contentType="profile"
        userId={userId}
        username={username}
      />
    </div>
  );
};

export default UserProfileCard;
