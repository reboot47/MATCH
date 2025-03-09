"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowLeft, HiX } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

const LikesExchangePage = () => {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  const [remainingPoints, setRemainingPoints] = useState(3);
  const [remainingLikes, setRemainingLikes] = useState(12);
  
  // ポイントといいねの交換レート
  const exchangeRates = [
    { likes: 10, points: 10, discount: 0 },
    { likes: 22, points: 20, discount: 10 },
    { likes: 35, points: 30, discount: 15 },
    { likes: 60, points: 50, discount: 20 },
    { likes: 130, points: 100, discount: 30 },
    { likes: 420, points: 300, discount: 40 },
  ];
  
  // 交換処理
  const handleExchange = (likes: number, points: number) => {
    if (remainingPoints < points) {
      alert('ポイントが足りません');
      return;
    }
    
    setRemainingPoints(prev => prev - points);
    setRemainingLikes(prev => prev + likes);
    alert(`${points}ポイントを${likes}いいねに交換しました`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HiArrowLeft className="text-gray-700 text-xl" />
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-8">いいね交換</h1>
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HiX className="text-gray-700 text-xl" />
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        {/* 交換説明 */}
        <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
          <h2 className="text-center text-lg font-bold text-blue-800 mb-2">ポイントを「いいね！」に交換して<br />女性にアピールしてみましょう！</h2>
          <div className="flex justify-center items-center my-4">
            <div className="relative flex items-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div className="w-8 text-center">
                <span className="text-gray-600 font-bold">→</span>
              </div>
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">♡</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 残高表示 */}
        <div className="flex justify-between mb-6">
          <div className="flex-1 bg-white rounded-lg shadow p-3 mr-2">
            <p className="text-sm text-gray-500 mb-1">残ポイント</p>
            <p className="text-xl font-bold text-green-600">{remainingPoints}</p>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-3 ml-2">
            <p className="text-sm text-gray-500 mb-1">残いいね</p>
            <p className="text-xl font-bold text-pink-600">{remainingLikes}</p>
          </div>
        </div>
        
        {/* 交換レート一覧 */}
        <div className="bg-white rounded-xl shadow mb-6">
          {exchangeRates.map((rate, index) => (
            <div 
              key={index}
              className="p-4 flex items-center justify-between border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-pink-600 font-bold">♡</span>
                </div>
                <div>
                  <p className="font-semibold">{rate.likes}いいね</p>
                  {rate.discount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      {rate.discount}%OFF
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleExchange(rate.likes, rate.points)}
                disabled={remainingPoints < rate.points}
                className={`py-2 px-4 rounded-lg text-sm font-bold text-white ${
                  remainingPoints >= rate.points ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              >
                {rate.points}ポイントと交換
              </button>
            </div>
          ))}
        </div>
        
        {/* 注意書き */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">注意事項</h3>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
            <li>ポイントからいいねへの交換は取り消しできません</li>
            <li>いいねの有効期限は交換日から30日間です</li>
            <li>ポイント交換で複数のいいねを送るとマッチ率が大幅にアップします</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default LikesExchangePage;
