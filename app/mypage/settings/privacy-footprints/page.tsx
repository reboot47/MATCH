"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

export default function FootprintsSettingsPage() {
  const router = useRouter();
  const userContext = useUser();
  
  const [leaveFootprints, setLeaveFootprints] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState({ type: '', message: '' });
  
  useEffect(() => {
    // 実際のアプリではAPIから足跡設定を取得
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ - デフォルトはOFF
        setLeaveFootprints(false);
      } catch (error) {
        console.error('設定の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleToggleFootprints = async () => {
    try {
      setSaveMessage({ type: '', message: '' });
      
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 設定を更新
      setLeaveFootprints(!leaveFootprints);
      
      // 成功メッセージ
      setSaveMessage({
        type: 'success',
        message: '設定を更新しました'
      });
      
      // 3秒後にメッセージを消す
      setTimeout(() => {
        setSaveMessage({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('設定の更新に失敗しました', error);
      setSaveMessage({
        type: 'error',
        message: '設定の更新に失敗しました'
      });
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
        <h1 className="text-center flex-grow font-medium text-lg">足あと設定</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="max-w-md mx-auto mt-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-gray-700">足あとを残す</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-footprints"
                    checked={leaveFootprints}
                    onChange={handleToggleFootprints}
                    className="hidden"
                  />
                  <label
                    htmlFor="toggle-footprints"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      leaveFootprints ? 'bg-teal-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        leaveFootprints ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end px-4 pb-3">
                <button 
                  className="text-teal-500 text-sm flex items-center"
                  onClick={() => router.push('/mypage/settings/privacy-footprints/details')}
                >
                  足あと機能の詳細を見る 
                  <HiChevronRight className="ml-1" />
                </button>
              </div>
            </div>
            
            {saveMessage.message && (
              <div className={`mt-4 p-3 rounded-md text-center ${
                saveMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {saveMessage.message}
              </div>
            )}
            
            <div className="mt-6 bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
              <h3 className="font-medium text-gray-700 mb-2">足あと機能について</h3>
              <p className="mb-2">足あと機能をONにすると、あなたがプロフィールを閲覧したユーザーに「閲覧した」という記録が残ります。</p>
              <p className="mb-2">OFFにすると、あなたのプロフィール閲覧は相手に通知されなくなります。</p>
              <p>足あと機能をOFFにしても、他のユーザーがあなたのプロフィールを閲覧した記録はあなたのマイページに表示されます。</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
