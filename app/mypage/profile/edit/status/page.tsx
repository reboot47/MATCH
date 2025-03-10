"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiX } from 'react-icons/fi';

export default function StatusEditPage() {
  const router = useRouter();
  const [status, setStatus] = useState("気軽にいいねください😊");
  const [remainingChars, setRemainingChars] = useState(48);
  const maxChars = 50;

  // ステータスが変更されたときに残り文字数を更新
  useEffect(() => {
    setRemainingChars(maxChars - status.length);
  }, [status]);

  // 保存して前のページに戻る
  const handleSave = () => {
    // ここでAPIを呼び出してステータスを保存する処理を追加
    // 例: await saveStatus(status);
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
        className="min-h-screen bg-gray-50"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="text-gray-500 p-1"
              >
                <FiChevronLeft size={24} />
              </button>
              <h1 className="text-lg font-medium ml-2">つぶやきを編集</h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="p-4">
          <div className="mt-4">
            <h2 className="text-base mb-1">つぶやき (3文字以上)</h2>
            <div className="relative">
              <textarea 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-lg p-3 pr-10 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-300"
                placeholder="例：今週末は予定空いてます！"
                maxLength={maxChars}
              />
              <button 
                className="absolute top-3 right-3 text-gray-400 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setStatus("")}
              >
                <FiX size={18} />
              </button>
              <div className="text-right text-gray-500 text-sm mt-1">
                あと{remainingChars}文字
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <button 
            onClick={handleSave}
            className="w-full bg-teal-400 text-white rounded-lg py-3 mt-8 font-medium"
          >
            保存
          </button>

          {/* ヘルプセクション */}
          <div className="mt-12">
            <h3 className="font-medium text-lg mb-4">書き方でお困りですか？</h3>
            
            <button 
              onClick={() => router.push('/mypage/profile/edit/status/tips')}
              className="flex items-center justify-between w-full border-t py-4 px-2"
            >
              <div className="flex items-center">
                <span className="text-gray-800 ml-2">つぶやきについてみる</span>
              </div>
              <FiChevronLeft size={20} className="text-gray-500 transform rotate-180" />
            </button>
            
            <button 
              onClick={() => router.push('/mypage/profile/edit/status/templates')}
              className="flex items-center justify-between w-full border-t py-4 px-2"
            >
              <div className="flex items-center">
                <span className="text-gray-800 ml-2">テンプレートから選択する</span>
              </div>
              <FiChevronLeft size={20} className="text-gray-500 transform rotate-180" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
