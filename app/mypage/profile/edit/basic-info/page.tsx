"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateWithScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

// 基本情報の型定義
type BasicInfo = {
  nickname: string;
  age: string;
  location: string;
  height: string;
  bodyType: string;
  appearance: string;
  occupation: string;
  hometown: string;
  hasChildren: string;
};

export default function BasicInfoEditPage() {
  const router = useRouter();
  
  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);
  
  // 基本情報の状態管理
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    nickname: "yuki",
    age: "31歳",
    location: "大阪府",
    height: "154cm",
    bodyType: "普通",
    appearance: "可愛い系",
    occupation: "非公開",
    hometown: "",
    hasChildren: "",
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
    navigateWithScrollPosition(router, `/mypage/profile/edit/basic-info/${field}`);
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
            <h1 className="text-lg font-medium ml-2">基本プロフィール</h1>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white mt-2">
          {/* ニックネーム */}
          <button 
            onClick={() => navigateToEdit('nickname')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">ニックネーム</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.nickname}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 年齢 */}
          <button 
            onClick={() => navigateToEdit('age')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">年齢</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.age}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 居住地 */}
          <button 
            onClick={() => navigateToEdit('location')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">居住地</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.location}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 身長 */}
          <button 
            onClick={() => navigateToEdit('height')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">身長</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.height}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 体型 */}
          <button 
            onClick={() => navigateToEdit('body-type')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">体型</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.bodyType}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* あなたの見た目 */}
          <button 
            onClick={() => navigateToEdit('appearance')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">あなたの見た目</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.appearance}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 職種 */}
          <button 
            onClick={() => navigateToEdit('occupation')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">職種</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.occupation}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 出身地 */}
          <button 
            onClick={() => navigateToEdit('hometown')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">出身地</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.hometown || "未設定"}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>

          {/* 子供の有無 */}
          <button 
            onClick={() => navigateToEdit('has-children')}
            className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-100"
          >
            <span className="text-gray-800">子供の有無</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{basicInfo.hasChildren || "未設定"}</span>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
