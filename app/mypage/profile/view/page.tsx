"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiEdit2, 
  FiCamera, 
  FiPlay, 
  FiHeart, 
  FiStar,
  FiMap,
  FiCalendar,
  FiUser,
  FiCoffee,
  FiDroplet
} from 'react-icons/fi';
import BottomNavigation from '@/app/components/BottomNavigation';

// 仮のユーザーデータ
const dummyUser = {
  id: 'user123',
  name: '愛子',
  age: 28,
  location: '東京都・新宿区',
  profilePhoto: '/images/profile/profile_placeholder_female.jpg',
  bio: '自然が好きなOLです。休日は美味しいものを食べに出かけたり、友達とショッピングしたりしています。落ち着いた性格で人見知りするタイプですが、仲良くなると話しやすいと言われます。素敵な出会いがあればいいなと思っています。',
  appealPhotos: [
    {id: 1, url: '/images/profile/female_appeal1.jpg'},
    {id: 2, url: '/images/profile/female_appeal2.jpg'},
    {id: 3, url: '/images/profile/female_appeal3.jpg'}
  ],
  hasAppealVideo: true,
  status: 'こんにちは！よろしくお願いします 😊',
  basicInfo: {
    height: 162,
    bodyType: 'スリム',
    education: '大卒',
    occupation: 'IT関連',
    annualIncome: '400〜600万円',
    drinking: '時々飲む',
    smoking: '吸わない',
    marriageHistory: 'なし',
    hasChildren: 'なし',
    wantsChildren: '希望する',
    religion: '無宗教',
    bloodType: 'O型'
  },
  datingPurpose: '恋愛目的',
  appealTags: ['カフェ巡り', '旅行好き', '読書', '映画鑑賞', '料理']
};

export default function ProfileViewPage() {
  const router = useRouter();
  const [user, setUser] = useState(dummyUser);
  
  // ページトランジションのアニメーション設定
  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-gray-50 pb-16"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => router.back()}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">マイプロフィール</h1>
            <Link 
              href="/mypage/profile/new-edit"
              className="text-teal-500 p-1"
            >
              <FiEdit2 size={20} />
            </Link>
          </div>
        </div>

        {/* メインプロフィール情報 */}
        <div className="bg-white mb-3">
          {/* メイン写真 */}
          <div className="relative">
            <div className="w-full aspect-square bg-gray-200">
              <Image 
                src={user.profilePhoto} 
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* プロフィール基本情報オーバーレイ */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">{user.age}歳</span>
                    <span className="flex items-center">
                      <FiMap size={14} className="mr-1" />
                      {user.location}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiHeart size={20} className="text-pink-300" />
                  </motion.button>
                  <motion.button
                    className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiStar size={20} className="text-yellow-300" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
          
          {/* つぶやき */}
          {user.status && (
            <div className="p-4 border-b border-gray-100">
              <p className="text-gray-800 italic">"{user.status}"</p>
            </div>
          )}
          
          {/* 自己紹介文 */}
          <div className="p-4">
            <h3 className="text-gray-700 font-medium mb-2">自己紹介</h3>
            <p className="text-gray-800 whitespace-pre-line">{user.bio}</p>
          </div>
        </div>
        
        {/* アピール動画 */}
        {user.hasAppealVideo && (
          <div className="bg-white mb-3 p-4">
            <h3 className="text-gray-700 font-medium mb-3">アピール動画</h3>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <FiPlay size={30} className="text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                01:24
              </div>
            </div>
          </div>
        )}
        
        {/* アピール写真 */}
        {user.appealPhotos.length > 0 && (
          <div className="bg-white mb-3 p-4">
            <h3 className="text-gray-700 font-medium mb-3">アピール写真</h3>
            <div className="grid grid-cols-3 gap-2">
              {user.appealPhotos.map(photo => (
                <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <Image 
                    src={photo.url}
                    alt={`アピール写真 ${photo.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* アピールタグ */}
        {user.appealTags.length > 0 && (
          <div className="bg-white mb-3 p-4">
            <h3 className="text-gray-700 font-medium mb-3">アピールタグ</h3>
            <div className="flex flex-wrap gap-2">
              {user.appealTags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 基本情報 */}
        <div className="bg-white mb-3 p-4">
          <h3 className="text-gray-700 font-medium mb-3">基本情報</h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-2" />
              <div>
                <span className="text-xs text-gray-500">身長</span>
                <p className="text-gray-800">{user.basicInfo.height}cm</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-2" />
              <div>
                <span className="text-xs text-gray-500">体型</span>
                <p className="text-gray-800">{user.basicInfo.bodyType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiCalendar className="text-gray-400 mr-2" />
              <div>
                <span className="text-xs text-gray-500">職業</span>
                <p className="text-gray-800">{user.basicInfo.occupation}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiCalendar className="text-gray-400 mr-2" />
              <div>
                <span className="text-xs text-gray-500">年収</span>
                <p className="text-gray-800">{user.basicInfo.annualIncome}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiCoffee className="text-gray-400 mr-2" />
              <div>
                <span className="text-xs text-gray-500">お酒</span>
                <p className="text-gray-800">{user.basicInfo.drinking}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiDroplet className="text-gray-400 mr-2" />
              <div>
                <span className="text-xs text-gray-500">タバコ</span>
                <p className="text-gray-800">{user.basicInfo.smoking}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span className="text-gray-500">結婚歴</span>
              <span className="text-gray-800">{user.basicInfo.marriageHistory}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span className="text-gray-500">子どもの有無</span>
              <span className="text-gray-800">{user.basicInfo.hasChildren}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span className="text-gray-500">子どもの希望</span>
              <span className="text-gray-800">{user.basicInfo.wantsChildren}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span className="text-gray-500">血液型</span>
              <span className="text-gray-800">{user.basicInfo.bloodType}</span>
            </div>
          </div>
        </div>
        
        {/* 出会いの目的 */}
        <div className="bg-white mb-3 p-4">
          <h3 className="text-gray-700 font-medium mb-1">出会いの目的</h3>
          <div className="flex items-center mt-2">
            <span className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-sm">
              {user.datingPurpose}
            </span>
          </div>
        </div>
        
        {/* ボトムナビゲーション */}
        <BottomNavigation />
      </motion.div>
    </AnimatePresence>
  );
}
