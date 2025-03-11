"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiHelpCircle, FiList } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// ユーザーの型定義
interface User {
  id: string;
  name: string;
  age: number;
  prefecture: string;
  height: number;
  occupation: string;
  imageUrl: string;
  viewed: boolean;
}

export default function HistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fromYou' | 'pickup' | 'profileVideo' | 'profileVisit'>('fromYou');
  const [sortOrder, setSortOrder] = useState<'likeOrder' | 'loginOrder'>('likeOrder');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'さな',
      age: 19,
      prefecture: '宮崎県',
      height: 159,
      occupation: '学生',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '2',
      name: 'ななみ',
      age: 22,
      prefecture: '宮崎県',
      height: 157,
      occupation: '会社員',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '3',
      name: 'しおん',
      age: 29,
      prefecture: '宮崎県',
      height: 170,
      occupation: '福祉・介護',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '4',
      name: 'なな',
      age: 30,
      prefecture: '宮崎県',
      height: 152,
      occupation: '非公開',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '5',
      name: 'ma',
      age: 31,
      prefecture: '神奈川県',
      height: 147,
      occupation: '非公開',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '6',
      name: 'RAMchan',
      age: 24,
      prefecture: '大阪府',
      height: 158,
      occupation: '事務員',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '7',
      name: 'ミライ',
      age: 24,
      prefecture: '大阪府',
      height: 166,
      occupation: 'フリーター',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '8',
      name: 'mimi',
      age: 28,
      prefecture: '大阪府',
      height: 164,
      occupation: '会社員',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    },
    {
      id: '9',
      name: 'りな',
      age: 22,
      prefecture: '大阪府',
      height: 159,
      occupation: '会社員',
      imageUrl: '/images/profile/default-female.png',
      viewed: true
    },
    {
      id: '10',
      name: 'アリス',
      age: 21,
      prefecture: '大阪府',
      height: 153,
      occupation: '学生',
      imageUrl: '/images/profile/default-female.png',
      viewed: false
    }
  ]);

  // ユーザータブ切り替え処理
  const handleTabChange = (tab: 'fromYou' | 'pickup' | 'profileVideo' | 'profileVisit') => {
    setActiveTab(tab);
  };

  // ソート順切り替え処理
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'likeOrder' ? 'loginOrder' : 'likeOrder');
    toast.success(sortOrder === 'likeOrder' ? 'ログイン順に並び替えました' : 'いいね送信順に並び替えました');
  };

  // みてね！ボタンのハンドラー
  const handleViewUser = (userId: string) => {
    // ユーザーの状態を更新
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, viewed: true } 
          : user
      )
    );
    toast.success('みてね！しました');
  };

  // 戻るボタンのハンドラー
  const handleBack = () => {
    router.push('/mypage');
  };

  // 現在のタブに基づいてユーザーをフィルタリング
  const getFilteredUsers = () => {
    // タブに応じたフィルタリングロジック（現在はモック）
    switch (activeTab) {
      case 'fromYou':
        return sortOrder === 'likeOrder' 
          ? users.slice(0, 5) // いいね送信順
          : users.slice(5, 10); // ログイン順
      case 'pickup':
        return users.slice(2, 7);
      case 'profileVideo':
        return users.slice(3, 8);
      case 'profileVisit':
        return users.slice(4, 9);
      default:
        return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={handleBack}
            className="text-gray-500 p-1 hover:text-gray-800 transition-colors"
            aria-label="戻る"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">履歴</h1>
          <button 
            className="text-gray-500 p-1 hover:text-gray-800 transition-colors"
            aria-label="ヘルプ"
          >
            <FiHelpCircle size={24} />
          </button>
        </div>
      </div>

      {/* タブ */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'fromYou' 
              ? 'text-teal-500 border-b-2 border-teal-500' 
              : 'text-gray-500'
          }`}
          onClick={() => handleTabChange('fromYou')}
        >
          あなたから
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'pickup' 
              ? 'text-teal-500 border-b-2 border-teal-500' 
              : 'text-gray-500'
          }`}
          onClick={() => handleTabChange('pickup')}
        >
          ピックアップ
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'profileVideo' 
              ? 'text-teal-500 border-b-2 border-teal-500' 
              : 'text-gray-500'
          }`}
          onClick={() => handleTabChange('profileVideo')}
        >
          プロフ動画
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'profileVisit' 
              ? 'text-teal-500 border-b-2 border-teal-500' 
              : 'text-gray-500'
          }`}
          onClick={() => handleTabChange('profileVisit')}
        >
          プロフ訪問
        </button>
      </div>

      {/* ソート順切り替え */}
      <div className="flex justify-end px-4 py-2">
        <button
          className="flex items-center text-teal-500 text-sm"
          onClick={toggleSortOrder}
        >
          <FiList className="mr-1" />
          {sortOrder === 'likeOrder' ? 'いいね送信順' : 'ログイン順'}
        </button>
      </div>

      {/* ユーザーリスト */}
      <div className="flex-1 overflow-auto pb-16">
        {filteredUsers.length > 0 ? (
          <ul className="divide-y">
            {filteredUsers.map(user => (
              <li key={user.id} className="p-4">
                <div className="flex">
                  {/* プロフィール画像 */}
                  <div className="w-16 h-16 mr-4 relative flex-shrink-0">
                    <Image
                      src={user.imageUrl}
                      alt={user.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                  
                  {/* ユーザー情報 */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{user.name} {user.age}歳 {user.prefecture}</h3>
                        <p className="text-sm text-gray-500">{user.height}cm {user.occupation}</p>
                      </div>
                    </div>
                    
                    {/* みてね！ボタン */}
                    <button
                      className={`w-full mt-2 py-2 rounded-full text-center ${
                        user.viewed
                          ? 'bg-white text-pink-500 border border-pink-500'
                          : 'bg-pink-500 text-white'
                      }`}
                      onClick={() => handleViewUser(user.id)}
                      disabled={user.viewed}
                    >
                      {user.viewed ? 'みてね！済み' : 'みてね！する'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>表示するユーザーがいません</p>
          </div>
        )}
      </div>
    </div>
  );
}
