"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function MarriageIntentionPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 結婚への意向の選択肢
  const marriageOptions = [
    "すぐにでも結婚したい",
    "2〜3年以内に結婚したい",
    "良い人がいれば結婚したい",
    "まだ結婚は考えていない",
    "結婚するつもりはない",
    "わからない",
    "非公開"
  ];

  // 選択肢の選択
  const selectOption = (option: string) => {
    setSelectedOption(option);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して情報を保存する処理を追加
    // 例: await saveMarriageIntention(selectedOption);
    navigateBackWithScrollPosition(router);
  };

  // ページのトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-white"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <span className="text-gray-600">キャンセル</span>
            </button>
            <h1 className="text-lg font-medium">結婚への意向</h1>
            <button 
              onClick={handleComplete}
              className={`font-medium ${selectedOption ? 'text-teal-500' : 'text-gray-300'}`}
              disabled={!selectedOption}
            >
              完了
            </button>
          </div>
        </div>

        {/* 選択リスト */}
        <div className="divide-y">
          {marriageOptions.map((option) => (
            <button 
              key={option}
              className="flex items-center justify-between w-full p-4"
              onClick={() => selectOption(option)}
            >
              <span className="text-gray-800">{option}</span>
              {selectedOption === option && (
                <FiCheck className="text-teal-500" size={20} />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
