"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';

export default function HolidaysEditPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  
  // 休日の選択肢
  const options = [
    '土日', 
    '平日', 
    '不定休', 
    '土曜日', 
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '週休2日（土日以外）',
    '週休3日以上'
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
    // ここでAPIを呼び出して休日を保存
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
            <h1 className="text-lg font-medium">休日</h1>
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
            <h3 className="text-sm font-medium mb-2">休日について</h3>
            <p className="text-sm text-gray-600">
              ・休日の情報は実際にお会いするときの予定を立てやすくします<br />
              ・相手とのライフスタイルの一致度を確認するのに役立ちます<br />
              ・この情報は検索条件として利用されることがあります
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
