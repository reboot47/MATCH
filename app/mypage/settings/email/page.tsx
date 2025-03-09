"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft } from 'react-icons/hi';

export default function EmailSettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    // 実際のアプリではここでAPIリクエストを行います
    try {
      // APIリクエストをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功表示
      setSuccess(true);
      
      // 数秒後に前のページに戻る
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
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
        <h1 className="text-center flex-grow font-medium text-lg">メールアドレス変更</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-6">
          <h2 className="text-lg font-medium mb-4">登録または変更後のメールアドレス</h2>
          
          {success ? (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
              メールアドレスが正常に変更されました。確認のメールをお送りしました。
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="メールアドレスを入力"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-md text-white font-medium ${
                  isSubmitting || !email 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                {isSubmitting ? '処理中...' : '保存する'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
