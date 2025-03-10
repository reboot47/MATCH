"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiSearch } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function HometownEditPage() {
  const router = useRouter();
  const [hometown, setHometown] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 都道府県リスト
  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];
  
  // 海外の国・地域
  const countries = [
    '中国', '韓国', '台湾', 'アメリカ', 'カナダ', 'オーストラリア', 
    'イギリス', 'フランス', 'ドイツ', 'イタリア', 'スペイン', 'ブラジル',
    'ロシア', 'インド', 'タイ', 'シンガポール', 'ベトナム', 'フィリピン'
  ];
  
  // 非公開オプション
  const privateOption = ['非公開'];
  
  // 全ての選択肢を結合
  const allOptions = [...prefectures, ...countries, ...privateOption];
  
  // 検索フィルター
  const filteredOptions = allOptions.filter(option => 
    option.includes(searchTerm)
  );
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出して出身地を保存
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
            <h1 className="text-lg font-medium">出身地</h1>
            <button 
              onClick={handleSave}
              className="text-teal-500 p-1"
            >
              <FiCheck size={24} />
            </button>
          </div>
        </div>
        
        {/* 検索フィールド */}
        <div className="p-4 bg-white border-b">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="出身地を検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        
        {/* 出身地リスト */}
        <div className="bg-white">
          {/* 日本の都道府県 */}
          <div className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700">
            日本
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.filter(option => prefectures.includes(option)).map((option) => (
              <button
                key={option}
                className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                  hometown === option ? 'bg-teal-50 text-teal-600' : ''
                }`}
                onClick={() => setHometown(option)}
              >
                {option}
              </button>
            ))}
          </div>
          
          {/* 海外の国・地域 */}
          {filteredOptions.some(option => countries.includes(option)) && (
            <>
              <div className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700">
                海外
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.filter(option => countries.includes(option)).map((option) => (
                  <button
                    key={option}
                    className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                      hometown === option ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                    onClick={() => setHometown(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          
          {/* 非公開オプション */}
          {filteredOptions.some(option => privateOption.includes(option)) && (
            <>
              <div className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700">
                その他
              </div>
              <div>
                {filteredOptions.filter(option => privateOption.includes(option)).map((option) => (
                  <button
                    key={option}
                    className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                      hometown === option ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                    onClick={() => setHometown(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
