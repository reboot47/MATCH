"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import BottomNavigation from '../components/BottomNavigation';

// タブの種類
type TabType = 'いいね！' | '足あと' | 'リクエスト';

// ユーザー情報の型定義
interface LikeUser {
  id: string;
  name: string;
  age: number;
  location: string;
  profileImage: string;
  timestamp: string;
  isNew: boolean;
}

export default function LikesPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('いいね！');
  const [isLoading, setIsLoading] = useState(true);
  
  // モック：お相手からの「いいね！」データ
  const [likes, setLikes] = useState<LikeUser[]>([
    {
      id: '1',
      name: 'べこさん',
      age: 40,
      location: '大阪府',
      profileImage: '/images/profile/user1.jpg',
      timestamp: '9時間前',
      isNew: true
    },
    {
      id: '2',
      name: 'なみさん',
      age: 26, 
      location: '大阪府',
      profileImage: '/images/profile/user2.jpg',
      timestamp: '9時間前',
      isNew: true
    },
    {
      id: '3',
      name: 'りえさん',
      age: 27,
      location: '大阪府',
      profileImage: '/images/profile/user3.jpg',
      timestamp: '11時間前',
      isNew: true
    },
    {
      id: '4',
      name: 'あやさん',
      age: 25,
      location: '東京都',
      profileImage: '/images/profile/user4.jpg',
      timestamp: '1日前',
      isNew: true
    }
  ]);

  // モック：足あとデータ
  const [footprints, setFootprints] = useState<LikeUser[]>([
    {
      id: '5',
      name: 'あいさん',
      age: 30,
      location: '京都府',
      profileImage: '/images/profile/user5.jpg',
      timestamp: '2時間前',
      isNew: true
    },
    {
      id: '6',
      name: 'めぐみさん',
      age: 24,
      location: '兵庫県',
      profileImage: '/images/profile/user6.jpg',
      timestamp: '5時間前',
      isNew: false
    }
  ]);

  // モック：リクエストデータ
  const [requests, setRequests] = useState<LikeUser[]>([
    {
      id: '7',
      name: 'まきさん',
      age: 32,
      location: '大阪府',
      profileImage: '/images/profile/user7.jpg',
      timestamp: '1日前',
      isNew: true
    }
  ]);

  useEffect(() => {
    // 実際の実装では、ここでAPIからデータを取得する
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // マッチング処理
  const handleMatch = (userId: string) => {
    // 実際の実装では、ここでAPI呼び出しを行う
    toast.success('マッチングしました！チャットを始めましょう');
    
    // モックデータから削除してUIを更新
    setLikes(prev => prev.filter(like => like.id !== userId));
  };

  // 表示するデータの選択
  const getActiveData = () => {
    switch(activeTab) {
      case 'いいね！':
        return likes;
      case '足あと':
        return footprints;
      case 'リクエスト':
        return requests;
      default:
        return likes;
    }
  };

  const activeData = getActiveData();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダータブ */}
      <div className="bg-white shadow-sm">
        <div className="flex border-b">
          {(['いいね！', '足あと', 'リクエスト'] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-4 text-center text-sm font-medium ${
                activeTab === tab 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'いいね！' && likes.length > 0 && (
                <span className="ml-1 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="max-w-lg mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">今週</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
          </div>
        ) : activeData.length > 0 ? (
          <ul className="space-y-4">
            {activeData.map((item) => (
              <li key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden mr-4">
                      <Image
                        src={item.profileImage}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100px, 150px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">
                            {item.name}から{activeTab === 'いいね！' ? '「いいね！」' : activeTab === '足あと' ? 'あなたのプロフィールを見ました' : 'リクエストが届きました'}
                          </h3>
                          <p className="text-gray-600">{item.age}歳 {item.location}</p>
                        </div>
                        {item.isNew && (
                          <span className="bg-purple-400 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{item.timestamp}</p>
                    </div>
                  </div>
                  
                  {activeTab === 'いいね！' && (
                    <div className="mt-3 flex justify-between">
                      <motion.button
                        className="w-full bg-teal-400 text-white py-3 rounded-md font-medium"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMatch(item.id)}
                      >
                        マッチする
                      </motion.button>
                      <motion.button 
                        className="ml-3 w-10 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md"
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  )}
                  
                  {activeTab === '足あと' && (
                    <div className="mt-3">
                      <Link href={`/user/${item.id}`}
                        className="block w-full text-center bg-teal-400 text-white py-3 rounded-md font-medium"
                      >
                        プロフィールを見る
                      </Link>
                    </div>
                  )}
                  
                  {activeTab === 'リクエスト' && (
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-teal-400 text-white py-3 rounded-md font-medium">
                        承認する
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md font-medium">
                        拒否する
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-gray-500">
            <FaHeart className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-center text-lg">
              {activeTab === 'いいね！' 
                ? 'まだ「いいね！」はありません' 
                : activeTab === '足あと' 
                  ? '足あとはありません' 
                  : 'リクエストはありません'
              }
            </p>
          </div>
        )}
      </div>

      {/* フッターナビゲーション */}
      <BottomNavigation />
    </div>
  );
}
