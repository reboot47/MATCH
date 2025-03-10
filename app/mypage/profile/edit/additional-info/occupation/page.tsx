"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiSearch } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';

export default function OccupationEditPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState('');
  
  // 職業カテゴリー
  const occupationCategories = [
    {
      name: '会社員',
      occupations: ['IT・通信', '営業・販売', '事務・管理', 'サービス業', '金融・保険', '広告・マスコミ']
    },
    {
      name: '公務員・教育',
      occupations: ['公務員', '教師・教育関係', '警察官・消防士', '自衛官']
    },
    {
      name: '医療・福祉',
      occupations: ['医師', '看護師', '薬剤師', 'その他医療従事者', '福祉・介護']
    },
    {
      name: '専門職',
      occupations: ['弁護士', '会計士・税理士', 'コンサルタント', 'クリエイター', 'エンジニア']
    },
    {
      name: '自営・経営',
      occupations: ['会社経営', '自営業', 'フリーランス']
    },
    {
      name: 'その他',
      occupations: ['学生', '主婦・主夫', 'パート・アルバイト', '無職', '非公開']
    }
  ];
  
  // 検索フィルター
  const filteredCategories = searchTerm.trim() === '' 
    ? occupationCategories 
    : occupationCategories.map(category => ({
        name: category.name,
        occupations: category.occupations.filter(occ => 
          occ.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.occupations.length > 0);
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出して職業を保存
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
            <h1 className="text-lg font-medium">職業</h1>
            <button 
              onClick={handleSave}
              className="text-teal-500 p-1"
            >
              <FiCheck size={24} />
            </button>
          </div>
          
          {/* 検索フォーム */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                placeholder="職業を検索"
              />
            </div>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="p-4">
          {filteredCategories.map((category) => (
            category.occupations.length > 0 ? (
              <div key={category.name} className="mb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2 px-2">{category.name}</h2>
                <div className="bg-white rounded-lg shadow">
                  {category.occupations.map((occupation) => (
                    <button
                      key={occupation}
                      className={`w-full py-4 px-4 text-left border-b border-gray-100 last:border-b-0 ${
                        selectedOccupation === occupation ? 'bg-teal-50 text-teal-600' : ''
                      }`}
                      onClick={() => setSelectedOccupation(occupation)}
                    >
                      {occupation}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          ))}
          
          {filteredCategories.every(cat => cat.occupations.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">検索結果が見つかりませんでした</p>
            </div>
          )}
          
          <div className="mt-4 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">職業について</h3>
            <p className="text-sm text-gray-600">
              ・職業はプロフィールの重要な情報として表示されます<br />
              ・多くのユーザーは職業をマッチングの条件に含めています<br />
              ・隠したい場合は「非公開」を選択することもできます
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
