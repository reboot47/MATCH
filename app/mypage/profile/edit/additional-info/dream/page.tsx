"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function DreamEditPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [dream, setDream] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // 入力チェック
  const validateDream = (value: string) => {
    if (value.length > 50) {
      setErrorMessage('50文字以内で入力してください');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  
  // 将来の夢の変更を処理
  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDream(value);
    validateDream(value);
  };
  
  // 保存処理
  const handleSave = () => {
    if (validateDream(dream)) {
      // ここでAPIを呼び出して将来の夢を保存
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
  
  // 将来の夢の例
  const dreamExamples = isMale ? [
    '自分の会社を持ちたい',
    '世界中を旅行したい',
    '家族を大切にした生活がしたい',
    '自分のスキルで人の役に立ちたい'
  ] : [
    'ネイルサロンを開きたい',
    '世界中を旅行したい',
    '子どもと過ごす時間を大切にしたい',
    '自分の趣味を活かした仕事をしたい'
  ];
  
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
            <h1 className="text-lg font-medium">将来の夢</h1>
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
            <label htmlFor="dream" className="block text-sm font-medium text-gray-700 mb-2">
              将来の夢や目標
            </label>
            <textarea
              id="dream"
              value={dream}
              onChange={handleDreamChange}
              className={`w-full p-3 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              placeholder="将来の夢や目標を入力してください"
              rows={4}
              maxLength={50}
            />
            <div className="flex justify-between mt-1">
              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">{dream.length}/50</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">入力例</h3>
            <div className="space-y-2">
              {dreamExamples.map((example, index) => (
                <button
                  key={index}
                  className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setDream(example);
                    validateDream(example);
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">将来の夢について</h3>
            <p className="text-sm text-gray-600">
              ・将来の夢や目標を共有することで、価値観の一致している相手とマッチングしやすくなります<br />
              ・あなたの人生観が伝わると、興味を持ってもらいやすくなります<br />
              ・具体的な内容ほど、話題のきっかけになりやすいです
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
