"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';
import { UserContext } from '@/app/components/UserContext';

export default function IncomeEditPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const isMale = userContext?.user?.gender === 'male';
  const [selectedOption, setSelectedOption] = useState('');
  
  // 年収の選択肢
  const options = [
    '300万円未満', 
    '300〜400万円', 
    '400〜500万円', 
    '500〜600万円', 
    '600〜700万円',
    '700〜800万円',
    '800〜900万円',
    '900〜1,000万円',
    '1,000〜1,500万円',
    '1,500〜2,000万円',
    '2,000万円以上',
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
    // ここでAPIを呼び出して年収を保存
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
            <h1 className="text-lg font-medium">年収</h1>
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
            <h3 className="text-sm font-medium mb-2">年収について</h3>
            <p className="text-sm text-gray-600">
              {isMale ? (
                <>
                  ・年収は相手が重視するプロフィール項目の一つです<br />
                  ・年収は検索フィルターとして使われることがあります<br />
                  ・「非公開」を選択することもできますが、表示すると検索結果に表示される確率が上がります
                </>
              ) : (
                <>
                  ・年収はプロフィール情報の一つとして表示されます<br />
                  ・必須ではないため、「非公開」を選択することも可能です<br />
                  ・相手との価値観の一致を確認する手がかりになります
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
