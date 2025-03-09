"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowLeft, HiCheck } from 'react-icons/hi';

const PaymentConfirmPage = () => {
  const router = useRouter();
  
  // 購入完了後のマイページへの遷移
  const handleComplete = () => {
    router.push('/mypage');
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
          <h1 className="text-xl font-bold text-center flex-1 mr-8">PAYMENT</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <HiCheck className="text-white text-4xl" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
            支払いが完了しました
          </h2>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">購入内容</span>
              <span className="font-medium">1000ポイント</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">購入価格</span>
              <span className="font-bold">¥105,000 (税込)</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">請求先</span>
              <span className="font-medium">VISA **** **** **** 1757</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            購入したポイントは即時反映されます。<br />
            購入履歴はマイページから確認できます。
          </p>
          
          <button
            onClick={handleComplete}
            className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors"
          >
            マイページへ戻る
          </button>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">請求に関する注意事項</h3>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
            <li>ご本人様の決済であると確認ができない場合は利用制限をかけさせていただく場合がございます。予めご了承ください。</li>
            <li>明細名は「paters」または「amica」「SKGroup」のいずれかにて表記されます。カード会社毎に明細名が異なりますのでご了承ください。</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default PaymentConfirmPage;
