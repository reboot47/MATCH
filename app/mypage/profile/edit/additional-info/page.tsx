"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useUser } from '@/components/UserContext';
import { saveScrollPosition, restoreScrollPosition, navigateWithScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

// その他情報の型定義
type AdditionalInfo = {
  dream: string;
  meetingArea: string;
  meetingDays: string;
  meetingTime: string;
  meetingPreference: string;
  personalityType: string;
  hobbies: string;
  drinking: string;
  smoking: string;
  holidays: string;
};

export default function AdditionalInfoEditPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  
  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);
  
  // その他情報の状態管理
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    dream: "ネイルサロン",
    meetingArea: "未設定",
    meetingDays: "未設定",
    meetingTime: "午前",
    meetingPreference: "マッチング後にまずは会いたい",
    personalityType: "未設定",
    hobbies: "未設定",
    drinking: "飲む",
    smoking: "未設定",
    holidays: "未設定",
  });

  // ページのトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  // 各項目の編集ページへ移動
  const navigateToEdit = (field: string) => {
    navigateWithScrollPosition(router, `/mypage/profile/edit/additional-info/${field}`);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium ml-2">その他プロフィール</h1>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white mt-2">
          {/* 将来の夢 */}
          <div className="py-2 px-4 bg-gray-100">
            <h2 className="font-medium">将来の夢</h2>
          </div>
          <button 
            onClick={() => navigateToEdit('dream')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">将来の夢</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.dream}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 会いやすいエリアや時間 */}
          <div className="py-2 px-4 bg-gray-100 mt-2">
            <h2 className="font-medium">会いやすいエリアや時間</h2>
          </div>
          <button 
            onClick={() => navigateToEdit('area')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">エリア</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.meetingArea}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
          <button 
            onClick={() => navigateToEdit('days')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">曜日</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.meetingDays}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
          <button 
            onClick={() => navigateToEdit('time')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">時間帯</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.meetingTime}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
          <button 
            onClick={() => navigateToEdit('preference')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">出会うまでの希望</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.meetingPreference}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 性格・プライベート */}
          <div className="py-2 px-4 bg-gray-100 mt-2">
            <h2 className="font-medium">性格・プライベート</h2>
          </div>
          <button 
            onClick={() => navigateToEdit('personality')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">性格・タイプ</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.personalityType}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
          <button 
            onClick={() => navigateToEdit('hobbies')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">趣味・好きなこと</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.hobbies}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
          <button 
            onClick={() => navigateToEdit('drinking')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">お酒</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.drinking}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
          <button 
            onClick={() => navigateToEdit('smoking')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">タバコ</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.smoking}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
          <button 
            onClick={() => navigateToEdit('holidays')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">休日</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{additionalInfo.holidays}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
