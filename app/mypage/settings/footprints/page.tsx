"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft } from 'react-icons/hi';
import Link from 'next/link';

type FootprintUser = {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  date: string;
  time: string;
  hasMessage?: boolean;
};

export default function FootprintsPage() {
  const router = useRouter();
  const [footprints, setFootprints] = useState<FootprintUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 実際のアプリではAPIからデータを取得
    const fetchFootprints = async () => {
      try {
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // モックデータ
        const mockFootprints: FootprintUser[] = Array.from({ length: 20 }, (_, i) => ({
          id: `user-${i}`,
          name: `[表示中止]さん`,
          age: 20 + Math.floor(Math.random() * 20),
          location: ['東京', '大阪', '名古屋', '福岡', '札幌', '横浜', '神戸', '京都'][Math.floor(Math.random() * 8)],
          avatar: '/assets/images/avatar-placeholder.jpg',
          date: `0${1 + Math.floor(Math.random() * 9)}/0${1 + Math.floor(Math.random() * 9)}`,
          time: `${10 + Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 10)}`,
          hasMessage: Math.random() > 0.7
        }));
        
        setFootprints(mockFootprints);
      } catch (error) {
        console.error('足あとリストの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFootprints();
  }, []);

  const handleSendMessage = (userId: string) => {
    // 実際のアプリではメッセージ画面に遷移
    router.push(`/messages/${userId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="mr-4 text-gray-600"
          aria-label="戻る"
        >
          <HiChevronLeft size={24} />
        </button>
        <h1 className="text-center flex-grow font-medium text-lg">足あとリスト</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : footprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>足あとはありません</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <ul className="bg-white">
              {footprints.map(user => (
                <li key={user.id} className="flex py-3 px-4 border-b border-gray-100">
                  <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                    {/* 実際の画像がない場合のプレースホルダー */}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                      <span>?</span>
                    </div>
                    {user.hasMessage && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500 ml-2">{user.age}歳 {user.location}</p>
                    </div>
                    <p className="text-xs text-gray-500">{user.date} {user.time}</p>
                  </div>
                  <button 
                    onClick={() => handleSendMessage(user.id)}
                    className="ml-2 px-3 py-1 text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600"
                  >
                    直接メッセージ
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-4 space-x-2">
              <button className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center">1</button>
              <button className="w-8 h-8 bg-white text-gray-600 rounded-full flex items-center justify-center">2</button>
              <button className="w-8 h-8 bg-white text-gray-600 rounded-full flex items-center justify-center">3</button>
              <span className="flex items-center text-gray-400">...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
