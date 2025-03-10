"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition } from '@/app/utils/scrollPosition';

export default function MeetingPreferencePage() {
  const router = useRouter();
  const [selectedPreference, setSelectedPreference] = useState<string>("マッチング後にまずは会いたい");

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 出会うまでの希望選択肢
  const preferences = [
    "マッチング後にまずは会いたい",
    "気が合えば会いたい",
    "条件が合えば会いたい",
    "メッセージ交換を重ねてから会いたい",
    "その他"
  ];

  // 選択処理
  const selectPreference = (preference: string) => {
    setSelectedPreference(preference);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して希望を保存する処理を追加
    // 例: await saveMeetingPreference(selectedPreference);
    saveScrollPosition();
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
              onClick={() => {
                saveScrollPosition();
                router.back();
              }}
              className="text-gray-500 p-1"
            >
              <span className="text-gray-600">キャンセル</span>
            </button>
            <h1 className="text-lg font-medium">出会うまでの希望</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 希望選択リスト */}
        <div className="divide-y">
          {preferences.map((preference) => (
            <button 
              key={preference}
              className="flex items-center justify-between w-full p-4"
              onClick={() => selectPreference(preference)}
            >
              <span className="text-gray-800">{preference}</span>
              {selectedPreference === preference && (
                <FiCheck className="text-teal-500" size={20} />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
