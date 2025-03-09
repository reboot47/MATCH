"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft } from 'react-icons/hi';
import Image from 'next/image';
import { useUser } from '@/components/UserContext';

export default function CampaignCodePage() {
  const router = useRouter();
  const userContext = useUser();
  
  const [campaignCode, setCampaignCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignCode.trim()) {
      setMessage({ type: 'error', text: '優待コードを入力してください。' });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setMessage({ type: '', text: '' });
      
      // 実際のアプリではAPIリクエストを行います
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功したと仮定
      setMessage({ type: 'success', text: '優待コードが正常に適用されました。' });
      setCampaignCode('');
    } catch (error) {
      setMessage({ type: 'error', text: '優待コードの適用に失敗しました。正しいコードをご確認ください。' });
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-center flex-grow font-medium text-lg">優待コード入力</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-center text-xl font-medium mb-4">ご優待カードをお持ちの場合</h2>
            <p className="text-center text-gray-600 mb-6">
              patersのご優待カードをお持ちの方はこちらからご入力ください。
            </p>
            
            {/* 優待カード画像 */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-64 h-40 rounded-lg overflow-hidden bg-black">
                <div className="absolute top-4 left-4 text-amber-500 font-medium">paters</div>
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  <div>12345678</div>
                  <div className="text-xs text-gray-300">ご招待</div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mb-8">ご優待カード</p>
            
            {/* コード入力フォーム */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  value={campaignCode}
                  onChange={(e) => setCampaignCode(e.target.value)}
                  placeholder="ここに優待コードをご入力ください"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              {message.text && (
                <div className={`mb-4 p-3 rounded-md text-center ${
                  message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {message.text}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-500 text-white py-3 rounded-md font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    処理中...
                  </div>
                ) : '送信'}
              </button>
            </form>
            
            <p className="text-gray-500 text-xs mt-4">
              ※ご優待カードは、運営が発行した特別なカードです。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
