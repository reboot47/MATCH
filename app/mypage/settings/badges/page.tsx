"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiQuestionMarkCircle } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

export default function BadgeSettingsPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  
  const [badges, setBadges] = useState({
    gold: false,
    vipDiamond: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState({ type: '', message: '' });
  
  useEffect(() => {
    // 実際のアプリではAPIからバッジ設定を取得
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ - デフォルトはOFF
        setBadges({
          gold: false,
          vipDiamond: false
        });
      } catch (error) {
        console.error('設定の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleToggleBadge = async (type: 'gold' | 'vipDiamond') => {
    try {
      setSaveMessage({ type: '', message: '' });
      
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 設定を更新
      setBadges(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
      
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
        <h1 className="text-center flex-grow font-medium text-lg">バッジ表示設定</h1>
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
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-gray-700">ゴールドバッジを表示する</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-gold-badge"
                      checked={badges.gold}
                      onChange={() => handleToggleBadge('gold')}
                      className="hidden"
                    />
                    <label
                      htmlFor="toggle-gold-badge"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        badges.gold ? 'bg-teal-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                          badges.gold ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-gray-700">VIP / ダイヤモンドバッジを表示する</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-vip-badge"
                      checked={badges.vipDiamond}
                      onChange={() => handleToggleBadge('vipDiamond')}
                      className="hidden"
                    />
                    <label
                      htmlFor="toggle-vip-badge"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        badges.vipDiamond ? 'bg-teal-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                          badges.vipDiamond ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-sm text-gray-600">
                <p>OFFにするとお相手からバッジが見えなくなります</p>
              </div>
            </div>
            
            {saveMessage.message && (
              <div className={`mt-4 p-3 rounded-md text-center ${
                saveMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {saveMessage.message}
              </div>
            )}
            
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <div className="flex items-start mb-3">
                <HiQuestionMarkCircle className="text-teal-500 mt-1 mr-2 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-medium text-gray-700">バッジについて</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    バッジは有料プランや特別なステータスを示すマークです。バッジを非表示にしても特典や機能は引き続きご利用いただけます。
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-7 mr-2"></div>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded mr-2">GOLD</span>
                    <p className="text-sm text-gray-600">ゴールド会員</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded mr-2">VIP</span>
                    <p className="text-sm text-gray-600">VIPまたはダイヤモンド会員</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
