"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';

// フィルターカテゴリの定義
const categories = [
  "すべて",
  "未設定",
  "気になる",
  "お気に入り",
  "要注意リスト",
  "日程調整前",
  "日程調整中",
  "日程調整済み",
  "お会い済み"
];

export default function MemoFilterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentFilter, setCurrentFilter] = useState<string>('すべて');
  
  // 現在のフィルターをURLクエリパラメータから取得
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setCurrentFilter(filter);
    }
  }, [searchParams]);
  
  // フィルターを選択してメインページに戻る
  const selectFilter = (filter: string) => {
    // URLクエリパラメータを使用してフィルター情報を渡す
    router.push(`/memo?filter=${encodeURIComponent(filter)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 p-1"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium ml-2">フィルター</h1>
        </div>
      </div>

      {/* フィルターリスト */}
      <div className="bg-white">
        <ul className="divide-y divide-gray-100">
          {categories.map((category) => (
            <li 
              key={category}
              className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              onClick={() => selectFilter(category)}
            >
              <span className="text-gray-900">{category}</span>
              <FiCheck 
                className={`text-teal-500 ${category === currentFilter ? 'opacity-100' : 'opacity-0'}`} 
                size={20} 
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
