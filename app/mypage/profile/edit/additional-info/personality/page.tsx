"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function PersonalityEditPage() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const maxSelection = 3;
  
  // 性格・タイプの選択肢
  const personalityTypes = [
    '明るい', '優しい', '素直', '誠実', '天然', '真面目',
    '几帳面', '慎重派', '寂しがり', '甘えん坊', '気が利く', '頑張り屋',
    '情熱的', '好奇心旺盛', '社交的', '内向的', '穏やか', '冷静',
    'マイペース', '負けず嫌い', '思いやりがある', '感情豊か', 'ポジティブ',
    '協調性がある', '頼りになる', 'ユーモアがある', '計画的', '細かいことは気にしない'
  ];
  
  // チェックボックス切り替え
  const toggleSelection = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(item => item !== type));
    } else {
      if (selectedTypes.length < maxSelection) {
        setSelectedTypes([...selectedTypes, type]);
      }
    }
  };
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出して性格タイプを保存
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
            <h1 className="text-lg font-medium">性格・タイプ</h1>
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
          <div className="mb-4 bg-white p-4 rounded-lg">
            <p className="text-center text-sm text-gray-600">
              あなたの性格や特徴を最大3つまで選択できます
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-2 gap-2 p-4">
              {personalityTypes.map((type) => (
                <button
                  key={type}
                  className={`p-3 rounded-lg text-center text-sm border ${
                    selectedTypes.includes(type)
                      ? 'bg-teal-50 border-teal-400 text-teal-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                  onClick={() => toggleSelection(type)}
                  disabled={selectedTypes.length >= maxSelection && !selectedTypes.includes(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">性格・タイプについて</h3>
            <p className="text-sm text-gray-600">
              ・自分を表現するのに最も適した特徴を選んでください<br />
              ・最大3つまで選択できます<br />
              ・他の人からよく言われる性格も参考にするとよいでしょう
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
