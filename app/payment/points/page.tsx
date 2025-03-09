"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HiArrowLeft, HiOutlineCreditCard } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

const PointsPage = () => {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 決済処理（モック）
  const handlePayment = () => {
    if (selectedOption === null) {
      alert('購入するポイントプランを選択してください');
      return;
    }
    
    router.push('/payment/confirm');
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
          <h1 className="text-xl font-bold text-center flex-1 mr-8">ポイント購入</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        {/* ポイント残高 */}
        <div className="bg-white rounded-xl shadow mb-6 p-4">
          <h2 className="text-sm text-gray-500 mb-1">現在の残高</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold">3 ポイント</span>
            </div>
            <button className="text-blue-500 text-sm">履歴</button>
          </div>
        </div>

        {/* ポイント購入オプション */}
        <div className="bg-white rounded-xl shadow mb-6">
          <h2 className="text-lg font-bold px-4 pt-4 pb-2">購入プラン</h2>
          
          <div className="divide-y divide-gray-100">
            {/* 1000ポイント */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${selectedOption === 1000 ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedOption(1000)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">P</span>
                </div>
                <div>
                  <p className="font-semibold">1,000ポイント</p>
                  <p className="text-sm text-gray-500">通常プラン</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">¥10,500</p>
                <p className="text-xs text-gray-500">（税込）</p>
              </div>
            </div>
            
            {/* 3000ポイント */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${selectedOption === 3000 ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedOption(3000)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">P</span>
                </div>
                <div>
                  <p className="font-semibold">3,000ポイント</p>
                  <p className="text-sm text-gray-500">お得プラン</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">¥29,800</p>
                <p className="text-xs text-green-600">5%OFF</p>
              </div>
            </div>
            
            {/* 10000ポイント */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${selectedOption === 10000 ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedOption(10000)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">P</span>
                </div>
                <div>
                  <p className="font-semibold">10,000ポイント</p>
                  <p className="text-xs inline-block bg-red-100 text-red-600 px-2 py-0.5 rounded-full">おすすめ</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">¥88,000</p>
                <p className="text-xs text-green-600">15%OFF</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 支払い方法 */}
        <div className="bg-white rounded-xl shadow mb-6 p-4">
          <h2 className="text-lg font-bold mb-3">支払い方法</h2>
          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
            <div className="flex items-center">
              <HiOutlineCreditCard className="text-gray-600 text-xl mr-2" />
              <div>
                <p className="font-medium">クレジットカード</p>
                <p className="text-sm text-gray-500">**** **** **** 1757</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm">変更</button>
          </div>
        </div>
      </main>

      {/* 固定フッター */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button 
          onClick={handlePayment}
          disabled={selectedOption === null}
          className={`w-full py-3 rounded-lg font-bold text-white ${
            selectedOption ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          購入する
        </button>
      </footer>
    </div>
  );
};

export default PointsPage;
