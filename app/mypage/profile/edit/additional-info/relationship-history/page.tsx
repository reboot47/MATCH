"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { UserContext } from '@/app/components/UserContext';

export default function RelationshipHistoryEditPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const isMale = userContext?.user?.gender === 'male';
  const [selectedOption, setSelectedOption] = useState('');
  
  // 恋愛歴の選択肢
  const options = [
    '恋人なし', 
    '恋人あり（現在）', 
    '独身（未婚）', 
    '独身（離婚）', 
    '独身（死別）',
    '既婚（別居中）',
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
    // ここでAPIを呼び出して恋愛歴を保存
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
            <h1 className="text-lg font-medium">恋愛歴・結婚歴</h1>
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
            <h3 className="text-sm font-medium mb-2">恋愛歴・結婚歴について</h3>
            <p className="text-sm text-gray-600">
              ・恋愛歴・結婚歴は相手にあなたの現在の状況を正確に伝えるために重要です<br />
              ・この情報は検索条件として使われることがあります<br />
              ・{isMale ? 
                '女性ユーザーは真剣な交際を望む傾向が強いため、正確な情報提供が好印象につながります' : 
                '男性ユーザーはこの情報を重視する傾向があるため、慎重に選択しましょう'}<br />
              ・非公開を選択することもできます
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
