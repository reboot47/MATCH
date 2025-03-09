"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft } from 'react-icons/hi';
import Image from 'next/image';

type HiddenMessageUser = {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  lastMessage?: string;
  lastActive: string;
};

export default function HiddenMessagesPage() {
  const router = useRouter();
  const [hiddenUsers, setHiddenUsers] = useState<HiddenMessageUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 実際のアプリではAPIからブロックユーザーを取得
    const fetchHiddenUsers = async () => {
      try {
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // モックデータ
        const mockHiddenUsers: HiddenMessageUser[] = Array.from({ length: 20 }, (_, i) => {
          const girlNames = ['あすか', 'ともみ', 'かおり', 'まりこ', 'あやか', 'さゆり', 'なつみ', 'れいか', 'じゅん', 'まき'];
          const name = girlNames[Math.floor(Math.random() * girlNames.length)];
          
          return {
            id: `user-${i}`,
            name: name,
            age: 20 + Math.floor(Math.random() * 15),
            location: ['東京都', '大阪府', '愛知県', '神奈川県', '福岡県', '京都府', '北海道', '兵庫県'][Math.floor(Math.random() * 8)],
            avatar: `/assets/images/avatar-${i % 5 + 1}.jpg`, // 実際にはこのパスの画像が必要
            lastActive: '今日 12:34'
          };
        });
        
        setHiddenUsers(mockHiddenUsers);
      } catch (error) {
        console.error('非表示ユーザーの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHiddenUsers();
  }, []);

  const handleUnhide = (userId: string) => {
    // 実際のアプリではAPIを呼び出して非表示解除
    // ここではフロントエンドの表示のみ更新
    setHiddenUsers(prev => prev.filter(user => user.id !== userId));
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
        <h1 className="text-center flex-grow font-medium text-lg">メッセージ非表示リスト</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : hiddenUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>非表示中のユーザーはいません</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <ul className="bg-white">
              {hiddenUsers.map(user => (
                <li key={user.id} className="flex items-center py-3 px-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                    {/* 仮のアバター表示（実際の画像がない場合） */}
                    <div className="w-full h-full bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center text-white font-bold">
                      {user.name[0]}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-800">{user.name}さん</p>
                      <p className="text-sm text-gray-500 ml-2">{user.age}歳 {user.location}</p>
                    </div>
                    <p className="text-xs text-gray-400">{user.lastActive}</p>
                  </div>
                  <button 
                    onClick={() => handleUnhide(user.id)}
                    className="px-3 py-1 bg-teal-500 text-white text-sm rounded-full"
                  >
                    表示する
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-4 space-x-2">
              <button className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center">1</button>
              <button className="w-8 h-8 bg-white text-gray-600 border border-gray-200 rounded-full flex items-center justify-center">2</button>
              <button className="w-8 h-8 bg-white text-gray-600 border border-gray-200 rounded-full flex items-center justify-center">...</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
