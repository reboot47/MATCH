"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HiArrowLeft, HiOutlineCreditCard } from 'react-icons/hi';
import { FaCoins } from 'react-icons/fa';
import { useUser } from '@/components/UserContext';

const CoinsPage = () => {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 決済処理（モック）
  const handlePayment = () => {
    if (selectedOption === null) {
      alert('購入するコインプランを選択してください');
      return;
    }
    
    router.push('/payment/confirm');
  };

  // 男性ユーザーのみがアクセス可能な画面
  const [isClient, setIsClient] = useState(false);
  
  // クライアントサイドでのみ実行される処理
  React.useEffect(() => {
    setIsClient(true);
    
    if (!isMale) {
      router.push('/mypage');
    }
  }, [isMale, router]);

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
          <h1 className="text-xl font-bold text-center flex-1 mr-8">PATERS COIN</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        {/* コイン残高 */}
        <div className="bg-white rounded-xl shadow mb-6 p-4">
          <h2 className="text-sm text-gray-500 mb-1">現在の残高</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                <FaCoins className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold">0 コイン</span>
            </div>
            <button className="text-blue-500 text-sm">履歴</button>
          </div>
        </div>

        {/* コイン購入オプション */}
        <div className="bg-white rounded-xl shadow mb-6">
          <h2 className="text-lg font-bold px-4 pt-4 pb-2">クレジット決済でコインを購入</h2>
          
          <div className="divide-y divide-gray-100">
            {/* 10コイン */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${selectedOption === 10 ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedOption(10)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <FaCoins className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold">10コイン</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">¥1,000</p>
                <p className="text-xs text-gray-500">（税込）</p>
              </div>
            </div>
            
            {/* 60コイン */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${selectedOption === 60 ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedOption(60)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <FaCoins className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold">60コイン</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">¥5,000</p>
                <p className="text-xs text-green-600">お得プラン</p>
              </div>
            </div>
            
            {/* 130コイン */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${selectedOption === 130 ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedOption(130)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <FaCoins className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold">130コイン</p>
                  <p className="text-xs inline-block bg-red-100 text-red-600 px-2 py-0.5 rounded-full">おすすめ</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">¥10,000</p>
                <p className="text-xs text-green-600">10%OFF</p>
              </div>
            </div>
            
            {/* 280コイン */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer ${selectedOption === 280 ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedOption(280)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <FaCoins className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold">280コイン</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">¥20,000</p>
                <p className="text-xs text-green-600">15%OFF</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">注意事項</h3>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
            <li>一度購入したコインの有効期限は1000日です</li>
            <li>コイン及び購入特典の返品・返金はできません</li>
            <li>購入時のポイント数は変更できません</li>
          </ul>
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

export default CoinsPage;
