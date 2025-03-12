"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { FaMars, FaVenus } from 'react-icons/fa';
import { useUser } from '@/components/UserContext';

export default function ProfileSummary() {
  const { data: session } = useSession();
  const { user, isGenderMale, isGenderFemale } = useUser();
  const [pointsMode, setPointsMode] = useState(false);
  const [coinsMode, setCoinsMode] = useState(false);
  
  // 性別アイコンとカラーの設定
  const genderIcon = isGenderMale() ? <FaMars className="text-blue-500" /> : isGenderFemale() ? <FaVenus className="text-pink-500" /> : null;
  const genderText = isGenderMale() ? '男性' : isGenderFemale() ? '女性' : '未設定';
  const genderBgColor = isGenderMale() ? 'bg-blue-100' : isGenderFemale() ? 'bg-pink-100' : 'bg-gray-100';

  // 仮のユーザーデータ（実際のユーザーデータが存在しない場合用）
  const demoUser = {
    id: 'demo-user',
    name: 'hideo',
    age: 25,
    gender: '未設定' as any,
    bio: '',
    location: '東京',
    profileImage: '/images/default-avatar.svg',
    profileCompletionPercentage: 30,
    isVerified: true,
    interests: ['音楽', '映画', '旅行'],
    occupation: '会社員',
    isOnline: true
  };
  
  // ユーザーポイント情報（実際はコンテキストから取得）
  const userPoints = {
    likes: 5,
    points: 16,
    coins: 25,
    plan: 'スタンダードプラン'
  };

  const displayUser = user || demoUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-6 mx-4"
      style={{ borderRadius: '16px' }}
    >
      
      <div className="flex flex-col items-center">
        {/* プロフィール画像 */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-white shadow-md">
          {displayUser.profileImage ? (
            <Image
              src={displayUser.profileImage}
              alt={displayUser.name || ''}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-500">
              <svg viewBox="0 0 24 24" className="w-10 h-10">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* ユーザー名と編集ボタン */}
        <div className="flex items-center mb-1">
          <h2 className="text-xl font-bold text-gray-800">{displayUser.name}</h2>
          <Link href="/mypage/profile/edit">
            <motion.button 
              className="ml-2 text-teal-500 p-1 rounded-full hover:bg-teal-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
            >
              <HiOutlinePencil size={18} />
            </motion.button>
          </Link>
        </div>
        
        {/* 性別表示 */}
        <div className={`flex items-center mb-3 px-3 py-1 rounded-full ${genderBgColor}`}>
          {genderIcon}
          <span className="ml-1 text-sm font-medium">{genderText}</span>
        </div>

        {/* スタンダードプラン */}
        <Link href="/mypage/plans" className="text-gray-600 text-sm mb-4 flex items-center">
          <span>{userPoints.plan}</span>
          <span className="ml-1">›</span>
        </Link>

        {/* ポイント情報 */}
        <div className="grid grid-cols-3 gap-4 w-full mb-4">
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center relative">
            <button className="absolute top-1 right-1 text-teal-500 bg-teal-50 rounded-full w-5 h-5 flex items-center justify-center">
              <span className="text-xs">+</span>
            </button>
            <p className="text-xs text-gray-500 mb-1">残いいね！</p>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center mr-1">
                <span className="text-white text-xs">❤</span>
              </div>
              <span className="font-bold">{userPoints.likes}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center relative">
            <button className="absolute top-1 right-1 text-teal-500 bg-teal-50 rounded-full w-5 h-5 flex items-center justify-center">
              <span className="text-xs">+</span>
            </button>
            <p className="text-xs text-gray-500 mb-1">残ポイント</p>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-1">
                <span className="text-white text-xs">P</span>
              </div>
              <span className="font-bold">{userPoints.points}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center relative">
            <button className="absolute top-1 right-1 text-teal-500 bg-teal-50 rounded-full w-5 h-5 flex items-center justify-center">
              <span className="text-xs">+</span>
            </button>
            <p className="text-xs text-gray-500 mb-1">残コイン</p>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-1">
                <span className="text-white text-xs">C</span>
              </div>
              <span className="font-bold">{userPoints.coins}</span>
            </div>
          </div>
        </div>

        {/* PASSモード */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="bg-pink-200 text-pink-600 px-2 py-0.5 rounded text-xs mr-2">お得</span>
              <span className="text-gray-700">PASSモード</span>
              <button className="ml-1 text-gray-400">
                <HiOutlineQuestionMarkCircle size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <span className="text-gray-600 text-sm">ポイント</span>
              <div className="ml-4 w-12 h-6 rounded-full bg-gray-200 flex items-center p-0.5 cursor-pointer"
                   onClick={() => setPointsMode(!pointsMode)}>
                <div className={`w-5 h-5 rounded-full transition-all duration-300 ${pointsMode ? 'bg-teal-500 ml-6' : 'bg-white'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-600 text-sm">コイン</span>
              <div className="ml-4 w-12 h-6 rounded-full bg-gray-200 flex items-center p-0.5 cursor-pointer"
                   onClick={() => setCoinsMode(!coinsMode)}>
                <div className={`w-5 h-5 rounded-full transition-all duration-300 ${coinsMode ? 'bg-teal-500 ml-6' : 'bg-white'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
