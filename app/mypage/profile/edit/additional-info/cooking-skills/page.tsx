"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function CookingSkillsEditPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedOption, setSelectedOption] = useState('');
  
  // 料理スキルの選択肢
  const options = [
    '料理が得意', 
    '自分で作る程度', 
    '簡単なものなら作れる', 
    '料理はほとんどしない',
    '全くしない',
    '勉強中'
  ];
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出して料理スキルを保存
    // 実際の実装ではAPIコールを行う
    navigateBackWithScrollPosition(router);
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
            <h1 className="text-lg font-medium">料理スキル</h1>
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
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-80 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                    selectedOption === option ? 'bg-teal-50 text-teal-600' : ''
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">料理スキルについて</h3>
            <p className="text-sm text-gray-600">
              {isMale ? (
                <>
                  ・料理スキルはライフスタイルの自立度を示す重要な情報です<br />
                  ・料理ができる男性は女性から好印象を持たれることが多いです<br />
                  ・共通の趣味として料理を楽しむカップルも増えています
                </>
              ) : (
                <>
                  ・料理スキルは日常生活での役割分担を考える上で参考になります<br />
                  ・お互いの料理スキルに合わせた関係構築ができます<br />
                  ・趣味としての料理を共有できる相手と出会うきっかけになります
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
