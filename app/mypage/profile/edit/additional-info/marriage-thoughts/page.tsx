"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function MarriageThoughtsEditPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedOption, setSelectedOption] = useState('');
  
  // 結婚に対する考え方の選択肢
  const options = [
    '結婚を希望している', 
    'いずれは結婚したい', 
    '良い人がいれば結婚したい', 
    '今は考えていない', 
    '結婚願望はない',
    'まだ決めていない',
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
    // ここでAPIを呼び出して結婚に対する考え方を保存
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
            <h1 className="text-lg font-medium">結婚に対する考え方</h1>
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
            <h3 className="text-sm font-medium mb-2">結婚に対する考え方について</h3>
            <p className="text-sm text-gray-600">
              ・結婚に対する考え方は関係の方向性を決める重要な情報です<br />
              ・{isMale ? 
                '女性ユーザーの多くは将来のビジョンを重視します' : 
                '男性の結婚観はマッチング前に確認されることが多いです'}<br />
              ・結婚観が一致している相手と出会うことで、将来のミスマッチを防げます<br />
              ・この情報は検索条件として使われることが多いです
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
