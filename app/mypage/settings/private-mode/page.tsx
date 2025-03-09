"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

export default function PrivateModeSettingsPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  
  const [isPrivateModeEnabled, setIsPrivateModeEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 実際のアプリではAPIからプライベートモード設定を取得
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ - デフォルトはOFF
        setIsPrivateModeEnabled(false);
      } catch (error) {
        console.error('設定の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleTogglePrivateMode = async () => {
    try {
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // トグル状態を更新
      setIsPrivateModeEnabled(!isPrivateModeEnabled);
    } catch (error) {
      console.error('設定の更新に失敗しました', error);
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
        <h1 className="text-center flex-grow font-medium text-lg">プライベートモード設定</h1>
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
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h2 className="font-medium text-gray-800">プライベートモード設定</h2>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-private-mode"
                    checked={isPrivateModeEnabled}
                    onChange={handleTogglePrivateMode}
                    className="hidden"
                  />
                  <label
                    htmlFor="toggle-private-mode"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      isPrivateModeEnabled ? 'bg-teal-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        isPrivateModeEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="mt-2">
                <button 
                  className="text-teal-500 text-sm flex items-center"
                  onClick={() => router.push('/mypage/settings/private-mode/details')}
                >
                  プライベートモードの詳細を見る 
                  <HiChevronRight className="ml-1" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-pink-50 text-pink-600 rounded-lg border border-pink-200 text-sm">
              <p className="mb-2">※ プライベートモードをONにすると、「ブースト機能」や募集中の「日付でデート」「今すぐデート」は終了してしまいます！</p>
              <p>上記機能を利用中の方は終了後にプライベートモードにするのがおすすめです！</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
