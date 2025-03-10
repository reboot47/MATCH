"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function HeightSelectionPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedHeight, setSelectedHeight] = useState<string>("154cm");

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 女性向け身長選択肢
  const femaleHeights = [
    "140cm未満", "140cm", "141cm", "142cm", "143cm", "144cm", "145cm", 
    "146cm", "147cm", "148cm", "149cm", "150cm", "151cm", "152cm", 
    "153cm", "154cm", "155cm", "156cm", "157cm", "158cm", "159cm", 
    "160cm", "161cm", "162cm", "163cm", "164cm", "165cm", "166cm", 
    "167cm", "168cm", "169cm", "170cm", "171cm", "172cm", "173cm", 
    "174cm", "175cm", "176cm", "177cm", "178cm", "179cm", "180cm以上"
  ];

  // 男性向け身長選択肢
  const maleHeights = [
    "150cm未満", "150cm", "151cm", "152cm", "153cm", "154cm", "155cm", 
    "156cm", "157cm", "158cm", "159cm", "160cm", "161cm", "162cm", 
    "163cm", "164cm", "165cm", "166cm", "167cm", "168cm", "169cm", 
    "170cm", "171cm", "172cm", "173cm", "174cm", "175cm", "176cm", 
    "177cm", "178cm", "179cm", "180cm", "181cm", "182cm", "183cm", 
    "184cm", "185cm", "186cm", "187cm", "188cm", "189cm", "190cm以上"
  ];

  // 性別に応じた身長リスト
  const heights = isMale ? maleHeights : femaleHeights;

  // 身長選択
  const selectHeight = (height: string) => {
    setSelectedHeight(height);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して身長情報を保存する処理を追加
    // 例: await saveHeight(selectedHeight);
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
            <h1 className="text-lg font-medium">身長</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 身長選択リスト */}
        <div className="divide-y overflow-y-auto max-h-[calc(100vh-60px)]">
          {heights.map((height) => (
            <button 
              key={height}
              className="flex items-center justify-between w-full p-4"
              onClick={() => selectHeight(height)}
            >
              <span className="text-gray-800">{height}</span>
              {selectedHeight === height && (
                <FiCheck className="text-teal-500" size={20} />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
