"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function IncomeSelectionPage() {
  const router = useRouter();
  const [selectedIncome, setSelectedIncome] = useState<string>("");

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 年収の選択肢
  const incomeRanges = [
    "200万円未満",
    "200〜400万円",
    "400〜600万円",
    "600〜800万円",
    "800〜1,000万円",
    "1,000〜1,500万円",
    "1,500〜2,000万円",
    "2,000万円以上",
    "非公開"
  ];

  // 年収選択
  const selectIncome = (income: string) => {
    setSelectedIncome(income);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して年収情報を保存する処理を追加
    // 例: await saveIncome(selectedIncome);
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
            <h1 className="text-lg font-medium">年収</h1>
            <button 
              onClick={handleComplete}
              className={`font-medium ${selectedIncome ? 'text-teal-500' : 'text-gray-300'}`}
              disabled={!selectedIncome}
            >
              完了
            </button>
          </div>
        </div>

        {/* 年収選択リスト */}
        <div className="divide-y">
          {incomeRanges.map((income) => (
            <button 
              key={income}
              className="flex items-center justify-between w-full p-4"
              onClick={() => selectIncome(income)}
            >
              <span className="text-gray-800">{income}</span>
              {selectedIncome === income && (
                <FiCheck className="text-teal-500" size={20} />
              )}
            </button>
          ))}
        </div>

        {/* 注記 */}
        <div className="p-4 text-sm text-gray-500">
          <p>※ 年収情報は、より適切なマッチングのために使用されます。この情報はあなたの許可なしに他のユーザーに公開されることはありません。</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
