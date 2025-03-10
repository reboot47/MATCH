"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function AppearanceEditPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('可愛い系');
  
  // 見た目タイプの選択肢
  const appearanceTypes = [
    '可愛い系', 'キレイ系', 'ナチュラル系', 'クール系', 'フェミニン系',
    'カジュアル系', 'アクティブ系', '派手系', '落ち着いた系', 'エレガント系'
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
    // ここでAPIを呼び出して見た目タイプを保存
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
            <h1 className="text-lg font-medium">あなたの見た目</h1>
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
              {appearanceTypes.map((type) => (
                <button
                  key={type}
                  className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                    selectedType === type ? 'bg-teal-50 text-teal-600' : ''
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">見た目タイプについて</h3>
            <p className="text-sm text-gray-600">
              ・自分で思う印象に最も近いものを選んでください<br />
              ・他の人からよく言われる印象を参考にするとよいでしょう<br />
              ・マッチングの参考情報として使用されます
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
