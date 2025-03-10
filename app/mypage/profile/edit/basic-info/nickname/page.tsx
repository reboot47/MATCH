"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function NicknameEditPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('yuki');
  const [errorMessage, setErrorMessage] = useState('');
  
  // ニックネームの入力チェック
  const validateNickname = (value: string) => {
    if (value.trim() === '') {
      setErrorMessage('ニックネームを入力してください');
      return false;
    }
    if (value.length > 10) {
      setErrorMessage('ニックネームは10文字以内で入力してください');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  
  // ニックネームの変更を処理
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateNickname(value);
  };
  
  // 保存処理
  const handleSave = () => {
    if (validateNickname(nickname)) {
      // ここでAPIを呼び出してニックネームを保存
      // 実際の実装ではAPIコールを行う
      navigateBackWithScrollPosition(router);
    }
  };
  
  // ページトランジション設定
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
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">ニックネーム</h1>
            <button 
              onClick={handleSave}
              className="text-teal-500 p-1"
            >
              <FiCheck size={24} />
            </button>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              className={`w-full p-3 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              placeholder="ニックネームを入力してください"
              maxLength={10}
            />
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">ニックネームについて</h3>
            <p className="text-sm text-gray-600">
              ・本名の使用は避けてください<br />
              ・10文字以内でご設定ください<br />
              ・他人に不快感を与える表現はお控えください
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
