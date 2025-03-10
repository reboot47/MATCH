"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function EducationSelectionPage() {
  const router = useRouter();
  const [selectedEducation, setSelectedEducation] = useState<string>("");

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 学歴の選択肢
  const educationLevels = [
    "高校卒業",
    "専門学校卒業",
    "短大卒業",
    "大学卒業",
    "大学院卒業",
    "その他",
    "非公開"
  ];

  // 学歴選択
  const selectEducation = (education: string) => {
    setSelectedEducation(education);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して学歴情報を保存する処理を追加
    // 例: await saveEducation(selectedEducation);
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
            <h1 className="text-lg font-medium">最終学歴</h1>
            <button 
              onClick={handleComplete}
              className={`font-medium ${selectedEducation ? 'text-teal-500' : 'text-gray-300'}`}
              disabled={!selectedEducation}
            >
              完了
            </button>
          </div>
        </div>

        {/* 学歴選択リスト */}
        <div className="divide-y">
          {educationLevels.map((education) => (
            <button 
              key={education}
              className="flex items-center justify-between w-full p-4"
              onClick={() => selectEducation(education)}
            >
              <span className="text-gray-800">{education}</span>
              {selectedEducation === education && (
                <FiCheck className="text-teal-500" size={20} />
              )}
            </button>
          ))}
        </div>

        {/* 注記 */}
        <div className="p-4 text-sm text-gray-500">
          <p>※ あなたの学歴情報は、より良いマッチングのために使用されます。</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
