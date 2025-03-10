"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function SmokingEditPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedOption, setSelectedOption] = useState('');
  
  // タバコの選択肢
  const options = [
    '吸わない', 
    '時々吸う', 
    '吸う', 
    '非喫煙者の前では吸わない',
    '電子タバコを使用',
    '非公開'
  ];
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出してタバコの習慣を保存
    // 実際の実装ではAPIコールを行う
    navigateBackWithScrollPosition(router);
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
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">タバコ</h1>
            <button 
              onClick={handleSave}
              className="text-teal-500 p-1"
            >
              <FiCheck size={24} />
            </button>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-80 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                    selectedOption === option ? 'bg-teal-50 text-teal-600' : ''
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">タバコについて</h3>
            <p className="text-sm text-gray-600">
              ・相手の選好や健康への配慮から重要な情報です<br />
              ・相手の希望と合致するよう、正確にお答えください<br />
              {isMale ? 
                '・相手がタバコの有無で検索条件を絞っている場合があります' : 
                '・喫煙の有無はマッチング条件として重視される傾向があります'}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
