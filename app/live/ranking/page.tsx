"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiQuestionMarkCircle } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '../../../components/UserContext';

// ランキング項目のタイプ定義
interface RankingItem {
  id: string;
  rank: number;
  name: string;
  age: number;
  location: string;
  points: number;
  image: string;
  isVerified: boolean;
}

export default function LiveStreamRankingPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  
  const [rankingItems, setRankingItems] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily'); // daily, weekly, monthly

  useEffect(() => {
    // ランキングデータの取得
    const fetchRankingData = async () => {
      setIsLoading(true);
      try {
        // 実際のアプリではAPIリクエストを行う
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ
        const mockRanking: RankingItem[] = [
          {
            id: '1',
            rank: 1,
            name: 'ゆきな',
            age: 24,
            location: '東京都',
            points: 4500,
            image: '/images/placeholder-user.jpg',
            isVerified: true
          },
          {
            id: '2',
            rank: 2,
            name: 'あいり',
            age: 26,
            location: '大阪府',
            points: 3820,
            image: '/images/placeholder-user.jpg',
            isVerified: true
          },
          {
            id: '3',
            rank: 3,
            name: 'みほ',
            age: 22,
            location: '福岡県',
            points: 3100,
            image: '/images/placeholder-user.jpg',
            isVerified: true
          },
          {
            id: '4',
            rank: 4,
            name: 'さくら',
            age: 25,
            location: '北海道',
            points: 2780,
            image: '/images/placeholder-user.jpg',
            isVerified: false
          },
          {
            id: '5',
            rank: 5,
            name: 'ななみ',
            age: 27,
            location: '神奈川県',
            points: 2350,
            image: '/images/placeholder-user.jpg',
            isVerified: true
          },
          {
            id: '6',
            rank: 6,
            name: 'れいな',
            age: 23,
            location: '京都府',
            points: 2100,
            image: '/images/placeholder-user.jpg',
            isVerified: false
          },
          {
            id: '7',
            rank: 7,
            name: 'まりあ',
            age: 29,
            location: '愛知県',
            points: 1870,
            image: '/images/placeholder-user.jpg',
            isVerified: true
          },
          {
            id: '8',
            rank: 8,
            name: 'みゆき',
            age: 25,
            location: '兵庫県',
            points: 1650,
            image: '/images/placeholder-user.jpg',
            isVerified: true
          },
          {
            id: '9',
            rank: 9,
            name: 'ことは',
            age: 24,
            location: '千葉県',
            points: 1520,
            image: '/images/placeholder-user.jpg',
            isVerified: true
          },
          {
            id: '10',
            rank: 10,
            name: 'ちなつ',
            age: 26,
            location: '広島県',
            points: 1380,
            image: '/images/placeholder-user.jpg',
            isVerified: false
          }
        ];
        
        setRankingItems(mockRanking);
      } catch (error) {
        console.error('ランキングデータの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRankingData();
  }, [activeTab]);

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
        <h1 className="text-center flex-grow font-medium text-lg">ランキング</h1>
        <Link href="/help/live/ranking" className="text-gray-600">
          <HiQuestionMarkCircle size={24} />
        </Link>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20">
        {/* タブ切り替え */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'daily' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('daily')}
            >
              デイリー
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'weekly' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('weekly')}
            >
              ウィークリー
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'monthly' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('monthly')}
            >
              マンスリー
            </button>
          </div>
        </div>

        {/* ランキングリスト */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="px-4 py-4">
            {/* トップ3 */}
            <div className="flex justify-between items-end mb-8">
              {/* 2位 */}
              {rankingItems.length > 1 && (
                <div className="flex flex-col items-center w-1/3">
                  <div className="relative mb-2">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                      <Image 
                        src={rankingItems[1].image} 
                        alt={rankingItems[1].name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                  </div>
                  <p className="text-sm font-medium">{rankingItems[1].name}</p>
                  <p className="text-xs text-gray-500">{rankingItems[1].points}pt</p>
                </div>
              )}

              {/* 1位 */}
              {rankingItems.length > 0 && (
                <div className="flex flex-col items-center w-1/3">
                  <div className="relative mb-2">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-yellow-400">
                      <Image 
                        src={rankingItems[0].image} 
                        alt={rankingItems[0].name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      1
                    </div>
                  </div>
                  <p className="text-sm font-medium">{rankingItems[0].name}</p>
                  <p className="text-xs text-gray-500">{rankingItems[0].points}pt</p>
                </div>
              )}

              {/* 3位 */}
              {rankingItems.length > 2 && (
                <div className="flex flex-col items-center w-1/3">
                  <div className="relative mb-2">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-amber-700">
                      <Image 
                        src={rankingItems[2].image} 
                        alt={rankingItems[2].name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                  </div>
                  <p className="text-sm font-medium">{rankingItems[2].name}</p>
                  <p className="text-xs text-gray-500">{rankingItems[2].points}pt</p>
                </div>
              )}
            </div>

            {/* 4位以降 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {rankingItems.slice(3).map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 font-medium text-gray-700">
                    {item.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {item.isVerified && (
                        <span className="ml-1 text-purple-500 text-xs">●</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.age}歳 | {item.location}</p>
                  </div>
                  <div className="font-medium text-gray-700">
                    {item.points}pt
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
