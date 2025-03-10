"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function BodyTypeSelectionPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedBodyType, setSelectedBodyType] = useState<string>("普通");

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 女性向け体型選択肢
  const femaleBodyTypes = [
    "スリム", 
    "普通", 
    "グラマー", 
    "筋肉質", 
    "ぽっちゃり", 
    "太め",
    "非公開"
  ];

  // 男性向け体型選択肢
  const maleBodyTypes = [
    "スリム", 
    "普通", 
    "細マッチョ", 
    "ガッチリ", 
    "マッチョ", 
    "ぽっちゃり", 
    "太め",
    "非公開"
  ];

  // 性別に応じた体型リスト
  const bodyTypes = isMale ? maleBodyTypes : femaleBodyTypes;

  // 体型選択
  const selectBodyType = (bodyType: string) => {
    setSelectedBodyType(bodyType);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して体型情報を保存する処理を追加
    // 例: await saveBodyType(selectedBodyType);
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
            <h1 className="text-lg font-medium">体型</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 体型選択リスト */}
        <div className="divide-y">
          {bodyTypes.map((bodyType) => (
            <button 
              key={bodyType}
              className="flex items-center justify-between w-full p-4"
              onClick={() => selectBodyType(bodyType)}
            >
              <span className="text-gray-800">{bodyType}</span>
              {selectedBodyType === bodyType && (
                <FiCheck className="text-teal-500" size={20} />
              )}
            </button>
          ))}
        </div>

        {/* 説明テキスト */}
        <div className="p-4 text-sm text-gray-500">
          <p>実際の体型が自己申告と異なるとの報告があった場合、アカウントを停止する場合があります。</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
