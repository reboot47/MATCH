"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft } from 'react-icons/hi';

export default function PhoneSettingsPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      setError('電話番号を入力してください');
      return;
    }
    
    // 電話番号のバリデーション（日本の電話番号形式）
    if (!/^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/.test(phoneNumber.replace(/-/g, ''))) {
      setError('有効な電話番号を入力してください');
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
      
      // 認証コードが送信されたという想定
      setTimeout(() => {
        // 通常はここで認証コード入力画面に遷移
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
        <h1 className="text-center flex-grow font-medium text-lg">電話番号変更</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-6">
          <h2 className="text-lg font-medium mb-4">新しい電話番号</h2>
          
          {success ? (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
              認証コードを送信しました。SMS をご確認ください。
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="tel"
                  placeholder="09014884757"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>
              
              <div className="text-sm text-gray-600 mb-6">
                <p className="mb-2">※電話番号はあなたがロボットや業者ではないことを確認するために入力してください。</p>
                <p>※ご入力いただいた電話番号に認証コードをお送りするので、認証コードを受け取れる電話番号を入力してください。</p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-md text-white font-medium ${
                  isSubmitting || !phoneNumber
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
