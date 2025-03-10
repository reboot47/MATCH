"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function AgeEditPage() {
  const router = useRouter();
  const [age, setAge] = useState('31');
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  // 年齢の選択肢
  const ageOptions = Array.from({ length: 60 }, (_, i) => i + 18);
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出して年齢を保存
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
            <h1 className="text-lg font-medium">年齢</h1>
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
              {ageOptions.map((value) => (
                <button
                  key={value}
                  className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                    age === String(value) ? 'bg-teal-50 text-teal-600' : ''
                  }`}
                  onClick={() => setAge(String(value))}
                >
                  {value}歳
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">年齢について</h3>
            <p className="text-sm text-gray-600">
              ・年齢は18歳以上であることが必要です<br />
              ・一度設定すると変更が難しいため、正確な情報を入力してください<br />
              ・年齢確認が必要になる場合があります
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
