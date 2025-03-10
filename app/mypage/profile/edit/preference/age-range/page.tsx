"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function AgeRangePreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  
  // 初期値：男性なら年下、女性なら年上を好む傾向に合わせた初期値を設定
  const [minAge, setMinAge] = useState(isMale ? 20 : 25);
  const [maxAge, setMaxAge] = useState(isMale ? 35 : 45);

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 最小年齢の変更
  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxAge) {
      setMinAge(value);
    }
  };

  // 最大年齢の変更
  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minAge) {
      setMaxAge(value);
    }
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して年齢範囲を保存する処理を追加
    // 例: await saveAgeRangePreference({ min: minAge, max: maxAge });
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
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">希望年齢</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 年齢範囲の説明 */}
        <div className="p-4 border-b">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-600">年齢範囲</span>
            <span className="text-teal-500 font-medium">{minAge}〜{maxAge}歳</span>
          </div>
          <p className="text-sm text-gray-500">
            選択した年齢範囲のお相手が優先的に表示されます
          </p>
        </div>

        {/* 年齢スライダー */}
        <div className="p-6">
          {/* 最小年齢 */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">最小年齢</span>
              <span className="text-sm font-medium">{minAge}歳</span>
            </div>
            <input
              type="range"
              min="18"
              max="80"
              step="1"
              value={minAge}
              onChange={handleMinAgeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>18歳</span>
              <span>80歳</span>
            </div>
          </div>

          {/* 最大年齢 */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">最大年齢</span>
              <span className="text-sm font-medium">{maxAge}歳</span>
            </div>
            <input
              type="range"
              min="18"
              max="80"
              step="1"
              value={maxAge}
              onChange={handleMaxAgeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>18歳</span>
              <span>80歳</span>
            </div>
          </div>
        </div>

        {/* 推奨年齢帯 */}
        <div className="px-4 py-5 bg-gray-50 mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">あなたにおすすめの年齢設定</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { setMinAge(18); setMaxAge(25); }}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">18〜25歳</p>
              <p className="text-xs text-gray-500">若い世代</p>
            </button>
            
            <button 
              onClick={() => { setMinAge(25); setMaxAge(35); }}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">25〜35歳</p>
              <p className="text-xs text-gray-500">同年代</p>
            </button>
            
            <button 
              onClick={() => { setMinAge(35); setMaxAge(45); }}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">35〜45歳</p>
              <p className="text-xs text-gray-500">落ち着いた世代</p>
            </button>
            
            <button 
              onClick={() => { setMinAge(45); setMaxAge(60); }}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">45〜60歳</p>
              <p className="text-xs text-gray-500">大人の魅力</p>
            </button>
          </div>
        </div>

        {/* プレミアム会員向けの特典（男性ユーザー向け） */}
        {isMale && (
          <div className="p-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、より広い年齢層の方とマッチングでき、10歳以上年下の魅力的なお相手とも出会える可能性が高まります。
              </p>
              <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                プレミアム会員になる
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
