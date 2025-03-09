"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiQuestionMarkCircle } from 'react-icons/hi';
import { RiVipCrownLine } from 'react-icons/ri';
import { MdAdd } from 'react-icons/md';
import { useUser } from '../../components/UserContext';
import Image from 'next/image';
import Link from 'next/link';

// ライブ配信者タイプ定義
interface LiveStreamer {
  id: string;
  name: string;
  age: number;
  location: string;
  viewers: number;
  image: string;
  isOnline: boolean;
  isVerified: boolean;
}

export default function LiveStreamPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  
  // 状態管理
  const [coins, setCoins] = useState(isMale ? 4 : 0);
  const [showAgeVerificationModal, setShowAgeVerificationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [liveStreamers, setLiveStreamers] = useState<LiveStreamer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ユーザーの年齢確認状態を確認
    const checkVerificationStatus = async () => {
      // 実際のアプリではAPIリクエストを行う
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // テスト用に女性ユーザーは未確認と仮定
      if (!isMale) {
        setIsVerified(false);
        setShowAgeVerificationModal(true);
      } else {
        setIsVerified(true);
      }
    };
    
    // ライブ配信者データ取得
    const fetchLiveStreamers = async () => {
      setIsLoading(true);
      try {
        // 実際のアプリではAPIリクエストを行う
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ
        const mockStreamers: LiveStreamer[] = [
          {
            id: '1',
            name: '',
            age: 23,
            location: '福岡県',
            viewers: 6,
            image: '/images/placeholder-user.jpg',
            isOnline: true,
            isVerified: true
          },
          {
            id: '2',
            name: '',
            age: 26,
            location: '東京都',
            viewers: 12,
            image: '/images/placeholder-user.jpg',
            isOnline: true,
            isVerified: true
          },
          {
            id: '3',
            name: '',
            age: 21,
            location: '大阪府',
            viewers: 4,
            image: '/images/placeholder-user.jpg',
            isOnline: true,
            isVerified: false
          }
        ];
        
        setLiveStreamers(mockStreamers);
      } catch (error) {
        console.error('ライブ配信者データの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkVerificationStatus();
    if (isMale) {
      fetchLiveStreamers();
    }
  }, [isMale]);

  const handleAgeVerification = () => {
    router.push('/verification/age');
  };
  
  const handlePrepareStream = () => {
    if (!isVerified) {
      setShowAgeVerificationModal(true);
      return;
    }
    // 配信準備画面へ
    router.push('/live/prepare');
  };
  
  const handleWatchStream = (streamerId: string) => {
    if (coins < 1) {
      // コインが足りない場合はコイン購入ページへ
      router.push('/payment/coin');
      return;
    }
    
    // 配信視聴ページへ
    router.push(`/live/watch/${streamerId}`);
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
        <h1 className="text-center flex-grow font-medium text-lg">ライブ配信</h1>
        <div className="flex items-center space-x-4">
          <Link href="/live/ranking" className="text-gray-600">
            <RiVipCrownLine size={24} />
          </Link>
          <Link href="/help/live" className="text-gray-600">
            <HiQuestionMarkCircle size={24} />
          </Link>
        </div>
      </header>

      {/* メインコンテンツ - 性別によって表示を切り替え */}
      <main className="flex-grow pt-16 pb-20">
        {/* コイン/キャッシュ表示部分 */}
        <div className="bg-white p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">
                {isMale ? '残コイン' : '残キャッシュ'}
              </span>
              <span className={`${isMale ? 'text-blue-500' : 'text-red-500'} text-lg`}>●</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{coins}</span>
              <Link href={isMale ? '/payment/coin' : '/payment/cash'} className="ml-4 px-4 py-1 rounded-full bg-gray-100 text-teal-600 text-sm">
                {isMale ? 'コイン購入' : 'キャッシュ換金'}
              </Link>
              {!isMale && (
                <button className="ml-2 rounded-full bg-teal-100 text-teal-600 w-8 h-8 flex items-center justify-center">
                  <MdAdd size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* 男性向け: 配信者リスト */}
        {isMale ? (
          <div className="px-4">
            <h2 className="text-lg font-medium my-4">ライブ配信中のお相手</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {liveStreamers.map((streamer) => (
                  <div 
                    key={streamer.id} 
                    className="bg-white rounded-lg overflow-hidden shadow-sm relative"
                    onClick={() => handleWatchStream(streamer.id)}
                  >
                    <div className="aspect-square bg-gray-200 relative">
                      <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <span className="mr-1">👁️</span> {streamer.viewers}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white">
                        <div className="flex items-center">
                          <span className="font-medium">{streamer.age}歳</span>
                          <span className="mx-1">|</span>
                          <span>{streamer.location}</span>
                          {streamer.isVerified && (
                            <span className="ml-1 text-purple-300">●</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => router.push('/live/ranking')}
              className="w-full bg-teal-500 text-white py-3 rounded-md font-medium mt-6 hover:bg-teal-600"
            >
              ランキングを見る
            </button>
          </div>
        ) : (
          // 女性向け: 配信準備画面
          <div className="flex flex-col items-center justify-center px-4 pt-8">
            <div className="w-full max-w-sm">
              <div className="flex justify-center mb-8">
                <Image 
                  src="/images/live-stream-illustration.png" 
                  alt="ライブ配信イラスト"
                  width={280}
                  height={280}
                  className="max-w-full h-auto"
                />
              </div>
              
              <button
                onClick={handlePrepareStream}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-md font-medium mt-6 hover:opacity-90"
              >
                ライブ配信を準備する
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* 年齢確認モーダル */}
      {showAgeVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="bg-teal-500 text-white p-6 flex flex-col items-center">
              <div className="rounded-full bg-white p-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium">ライブ配信の利用には<br />年齢確認が必要です</p>
            </div>
            
            <div className="p-6">
              <p className="text-center text-gray-700 mb-6">
                規約に基づき、<br />ライブ配信の利用が可能になる前に<br />年齢確認を必須としています。
              </p>
              
              <button
                onClick={handleAgeVerification}
                className="w-full bg-teal-500 text-white py-3 rounded-md font-medium hover:bg-teal-600"
              >
                年齢確認を行う
              </button>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-center">
              <button
                onClick={() => setShowAgeVerificationModal(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
