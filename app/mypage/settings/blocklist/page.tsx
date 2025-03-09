"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiX } from 'react-icons/hi';
import Image from 'next/image';

type BlockedUser = {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  date: string;
};

export default function BlocklistPage() {
  const router = useRouter();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 実際のアプリではAPIからブロックユーザーを取得
    const fetchBlockedUsers = async () => {
      try {
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // モックデータ
        const mockBlockedUsers: BlockedUser[] = Array.from({ length: 15 }, (_, i) => ({
          id: `user-${i}`,
          name: `[表示中止]さん`,
          age: 20 + Math.floor(Math.random() * 20),
          location: ['東京', '大阪', '名古屋', '福岡', '札幌'][Math.floor(Math.random() * 5)],
          avatar: '/assets/images/avatar-placeholder.jpg', // 実際にはこのパスの画像が必要
          date: `2025/0${1 + Math.floor(Math.random() * 3)}/0${1 + Math.floor(Math.random() * 9)}`
        }));
        
        setBlockedUsers(mockBlockedUsers);
      } catch (error) {
        console.error('ブロックユーザーの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlockedUsers();
  }, []);

  const handleUnblock = (userId: string) => {
    // 実際のアプリではAPIを呼び出してブロック解除
    // ここではフロントエンドの表示のみ更新
    setBlockedUsers(prev => prev.filter(user => user.id !== userId));
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
        <h1 className="text-center flex-grow font-medium text-lg">ブロックリスト</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>ブロック中のユーザーはいません</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto mt-2">
            <ul className="bg-white rounded-md shadow-sm divide-y divide-gray-100">
              {blockedUsers.map(user => (
                <li key={user.id} className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                    {/* 実際の画像がない場合のプレースホルダー */}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                      <span>?</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500 ml-2">{user.age}歳 {user.location}</p>
                    </div>
                    <p className="text-xs text-gray-500">{user.date}</p>
                  </div>
                  <button 
                    onClick={() => handleUnblock(user.id)}
                    className="ml-2 text-teal-500 hover:text-teal-600 text-sm flex items-center"
                  >
                    ブロック解除
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
