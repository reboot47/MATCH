"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function HeightRangePreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  
  // 初期値：男性は低め〜標準的な女性、女性は標準的〜高めの男性を好む傾向に合わせた初期設定
  const [minHeight, setMinHeight] = useState(isMale ? 150 : 170);
  const [maxHeight, setMaxHeight] = useState(isMale ? 170 : 190);

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 最小身長の変更
  const handleMinHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= maxHeight) {
      setMinHeight(value);
    }
  };

  // 最大身長の変更
  const handleMaxHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= minHeight) {
      setMaxHeight(value);
    }
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して身長範囲を保存する処理を追加
    // 例: await saveHeightRangePreference({ min: minHeight, max: maxHeight });
    navigateBackWithScrollPosition(router);
  };

  // 身長表示を整形する関数
  const formatHeight = (cm: number) => {
    return `${cm}cm`;
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
            <h1 className="text-lg font-medium">希望身長</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 身長範囲の説明 */}
        <div className="p-4 border-b">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-600">身長範囲</span>
            <span className="text-teal-500 font-medium">{formatHeight(minHeight)}〜{formatHeight(maxHeight)}</span>
          </div>
          <p className="text-sm text-gray-500">
            選択した身長範囲のお相手が優先的に表示されます
          </p>
        </div>

        {/* 身長スライダー */}
        <div className="p-6">
          {/* 最小身長 */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">最小身長</span>
              <span className="text-sm font-medium">{formatHeight(minHeight)}</span>
            </div>
            <input
              type="range"
              min={isMale ? 140 : 150}
              max={isMale ? 180 : 190}
              step="1"
              value={minHeight}
              onChange={handleMinHeightChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>{formatHeight(isMale ? 140 : 150)}</span>
              <span>{formatHeight(isMale ? 180 : 190)}</span>
            </div>
          </div>

          {/* 最大身長 */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">最大身長</span>
              <span className="text-sm font-medium">{formatHeight(maxHeight)}</span>
            </div>
            <input
              type="range"
              min={isMale ? 140 : 150}
              max={isMale ? 180 : 190}
              step="1"
              value={maxHeight}
              onChange={handleMaxHeightChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>{formatHeight(isMale ? 140 : 150)}</span>
              <span>{formatHeight(isMale ? 180 : 190)}</span>
            </div>
          </div>
        </div>

        {/* 推奨身長帯 */}
        <div className="px-4 py-5 bg-gray-50 mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">あなたにおすすめの身長設定</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {isMale ? (
              // 男性向けの推奨身長
              <>
                <button 
                  onClick={() => { setMinHeight(140); setMaxHeight(155); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">140〜155cm</p>
                  <p className="text-xs text-gray-500">小柄な女性</p>
                </button>
                
                <button 
                  onClick={() => { setMinHeight(155); setMaxHeight(165); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">155〜165cm</p>
                  <p className="text-xs text-gray-500">標準的な身長</p>
                </button>
                
                <button 
                  onClick={() => { setMinHeight(165); setMaxHeight(175); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">165〜175cm</p>
                  <p className="text-xs text-gray-500">高めの女性</p>
                </button>
                
                <button 
                  onClick={() => { setMinHeight(140); setMaxHeight(180); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">140〜180cm</p>
                  <p className="text-xs text-gray-500">身長不問</p>
                </button>
              </>
            ) : (
              // 女性向けの推奨身長
              <>
                <button 
                  onClick={() => { setMinHeight(160); setMaxHeight(170); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">160〜170cm</p>
                  <p className="text-xs text-gray-500">低め〜標準</p>
                </button>
                
                <button 
                  onClick={() => { setMinHeight(170); setMaxHeight(180); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">170〜180cm</p>
                  <p className="text-xs text-gray-500">標準的な身長</p>
                </button>
                
                <button 
                  onClick={() => { setMinHeight(180); setMaxHeight(190); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">180〜190cm</p>
                  <p className="text-xs text-gray-500">高身長</p>
                </button>
                
                <button 
                  onClick={() => { setMinHeight(150); setMaxHeight(190); }}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                >
                  <p className="text-gray-800 font-medium">150〜190cm</p>
                  <p className="text-xs text-gray-500">身長不問</p>
                </button>
              </>
            )}
          </div>
        </div>

        {/* プレミアム会員向けの特典（男性ユーザー向け） */}
        {isMale && (
          <div className="p-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、設定した身長範囲のお相手が優先的に表示されます。また、人気の高い身長帯のお相手と優先的にマッチングできます。
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
