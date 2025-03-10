"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useUser } from '@/components/UserContext';

export default function DrinkingPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedOption, setSelectedOption] = useState<string>("飲む");

  // お酒の選択肢
  const drinkingOptions = [
    "飲まない",
    "飲む",
    "ときどき飲む"
  ];

  // 選択処理
  const selectOption = (option: string) => {
    setSelectedOption(option);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して情報を保存する処理を追加
    // 例: await saveDrinkingPreference(selectedOption);
    router.back();
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
              onClick={() => router.back()}
              className="text-gray-500 p-1"
            >
              <span className="text-gray-600">キャンセル</span>
            </button>
            <h1 className="text-lg font-medium">お酒</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 選択肢リスト */}
        <div className="divide-y">
          {drinkingOptions.map((option) => (
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
