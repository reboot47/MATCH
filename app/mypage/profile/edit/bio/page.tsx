"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaQuestionCircle, FaUserCircle } from 'react-icons/fa';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition, navigateWithScrollPosition } from '@/app/utils/scrollPosition';

export default function BioEditPage() {
  const router = useRouter();
  const [bio, setBio] = useState(`はじめまして！ yukiです。
人とお話しするのが大好きでたくさんの人と関わりたいと思いpatersをはじめてみました。
近くでお会いできる人がいたら嬉しいです！
素敵な出会いがありますように......！`);
  const [remainingChars, setRemainingChars] = useState(398);
  const maxChars = 500;

  // バイオが変更されたときに残り文字数を更新
  useEffect(() => {
    setRemainingChars(maxChars - bio.length);
  }, [bio]);

  // 保存して前のページに戻る
  const handleSave = () => {
    // ここでAPIを呼び出してバイオを保存する処理を追加
    // 例: await saveBio(bio);
    navigateBackWithScrollPosition(router);
  };

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

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
                onClick={() => navigateBackWithScrollPosition(router)}
                className="text-gray-500 p-1"
              >
                <FiChevronLeft size={24} />
              </button>
              <h1 className="text-lg font-medium ml-2">自己紹介を編集</h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="p-4">
          <div className="mt-2">
            <h2 className="text-xl font-medium mb-4">自己紹介</h2>
            <div className="relative">
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border rounded-lg p-3 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-teal-300"
                placeholder="あなたのことを教えてください"
                maxLength={maxChars}
              />
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
              onClick={() => router.push('/mypage/profile/edit/bio/tips')}
              className="flex items-center justify-between w-full border-t py-4 px-2"
            >
              <div className="flex items-center">
                <FaQuestionCircle className="text-gray-500" />
                <span className="text-gray-800 ml-2">魅力的な自己紹介の書き方をみる</span>
              </div>
              <FiChevronRight className="text-gray-500" />
            </button>
            
            <button 
              onClick={() => router.push('/mypage/profile/edit/bio/examples')}
              className="flex items-center justify-between w-full border-t py-4 px-2"
            >
              <div className="flex items-center">
                <FaUserCircle className="text-gray-500" />
                <span className="text-gray-800 ml-2">他の会員の自己紹介をみてみる</span>
              </div>
              <FiChevronRight className="text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
