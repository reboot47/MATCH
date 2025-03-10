"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function TimeEditPage() {
  const router = useRouter();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  
  // 時間帯の選択肢
  const timeOptions = [
    '午前（9:00〜12:00）', 
    'お昼（12:00〜15:00）', 
    '午後（15:00〜18:00）', 
    '夕方（18:00〜20:00）', 
    '夜（20:00〜24:00）',
    '深夜（24:00〜）'
  ];
  
  // チェックボックス切り替え
  const toggleSelection = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(item => item !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
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
    // ここでAPIを呼び出して時間帯を保存
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
            <h1 className="text-lg font-medium">会いやすい時間帯</h1>
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
              あなたが会いやすい時間帯を選択してください<br />
              複数選択可能です
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-100">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  className={`w-full py-4 px-4 text-left flex items-center justify-between ${
                    selectedTimes.includes(time) ? 'bg-teal-50' : ''
                  }`}
                  onClick={() => toggleSelection(time)}
                >
                  <span className={selectedTimes.includes(time) ? 'text-teal-600 font-medium' : ''}>
                    {time}
                  </span>
                  {selectedTimes.includes(time) && (
                    <span className="h-5 w-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">時間帯について</h3>
            <p className="text-sm text-gray-600">
              ・選択した時間帯は相手に表示されます<br />
              ・あなたのライフスタイルに合った時間帯を選ぶことで、実際に会いやすい相手とマッチングしやすくなります<br />
              ・時間が合わないとせっかくの出会いも進展しにくいので、正確に設定しましょう
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
