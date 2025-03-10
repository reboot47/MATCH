"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';
import { UserContext } from '@/components/UserContext';

export default function SelfIntroductionEditPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const isMale = userContext?.user?.gender === 'male';
  const [introduction, setIntroduction] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const maxLength = 300;
  
  // 入力チェック
  const validateIntroduction = (value: string) => {
    if (value.length > maxLength) {
      setErrorMessage(`${maxLength}文字以内で入力してください`);
      return false;
    }
    setErrorMessage('');
    return true;
  };
  
  // 自己紹介の変更を処理
  const handleIntroductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setIntroduction(value);
    validateIntroduction(value);
  };
  
  // 保存処理
  const handleSave = () => {
    if (validateIntroduction(introduction)) {
      // ここでAPIを呼び出して自己紹介を保存
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
  
  // 自己紹介の例
  const introductionExamples = isMale ? [
    '休日は映画鑑賞や美術館巡りをするのが好きです。趣味を一緒に楽しめる方と知り合いたいです。',
    '仕事はITエンジニアをしていて、休日は料理や読書を楽しんでいます。穏やかで誠実な性格です。',
    '旅行と食べ歩きが大好きです。新しい場所や美味しいものを一緒に探求できる方と出会いたいです。'
  ] : [
    '休日はカフェ巡りやショッピングをするのが好きです。楽しい時間を共有できる方と出会いたいです。',
    '趣味は読書とヨガです。落ち着いた雰囲気の場所や会話が好きです。優しい方と知り合いたいです。',
    '音楽とアートが大好きです。ライブに行ったり、美術館巡りを一緒に楽しめる人を探しています。'
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
            <h1 className="text-lg font-medium">自己紹介</h1>
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
            <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-2">
              自己紹介文
            </label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={handleIntroductionChange}
              className={`w-full p-3 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              placeholder="あなたのことを相手に伝える自己紹介文を入力してください"
              rows={6}
              maxLength={maxLength}
            />
            <div className="flex justify-between mt-1">
              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">{introduction.length}/{maxLength}</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">文例を参考にする</h3>
            <div className="space-y-3">
              {introductionExamples.map((example, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    setIntroduction(example);
                    validateIntroduction(example);
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">自己紹介のポイント</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 趣味や興味を具体的に書くと話題が広がりやすいです</li>
              <li>• どんな人と出会いたいかを明確にすると相性の良い相手と出会いやすくなります</li>
              <li>• 自分の性格や価値観について触れると相手に伝わりやすいです</li>
              <li>• {isMale ? 
                '自己紹介文はマッチング率に大きく影響します。自然な印象を与える文章を心がけましょう' : 
                '好印象を与える自己紹介文はメッセージの返信率を高めます'}</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
