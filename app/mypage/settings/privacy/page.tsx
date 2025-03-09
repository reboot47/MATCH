"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiEye, HiEyeOff, HiLockClosed } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

type PrivacySettings = {
  profileVisibility: 'all' | 'matched' | 'none';
  lastOnlineVisible: boolean;
  locationVisible: boolean;
  ageVisible: boolean;
  readReceiptsEnabled: boolean;
  allowProfileSearch: boolean;
  allowLocationServices: boolean;
};

export default function PrivacySettingsPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'all',
    lastOnlineVisible: true,
    locationVisible: true,
    ageVisible: true,
    readReceiptsEnabled: true,
    allowProfileSearch: true,
    allowLocationServices: true
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    // 実際のアプリではAPIからプライバシー設定を取得
    const fetchPrivacySettings = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // モックデータ
        const mockSettings: PrivacySettings = {
          profileVisibility: 'all',
          lastOnlineVisible: true,
          locationVisible: true,
          ageVisible: true,
          readReceiptsEnabled: true,
          allowProfileSearch: true,
          allowLocationServices: true
        };
        
        setSettings(mockSettings);
      } catch (error) {
        console.error('プライバシー設定の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrivacySettings();
  }, []);

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileVisibilityChange = (value: 'all' | 'matched' | 'none') => {
    setSettings(prev => ({
      ...prev,
      profileVisibility: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setSaveMessage({ type: '', message: '' });
      
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 保存成功
      setSaveMessage({
        type: 'success',
        message: 'プライバシー設定を更新しました'
      });
    } catch (error) {
      console.error('設定の保存に失敗しました', error);
      setSaveMessage({
        type: 'error',
        message: '設定の保存に失敗しました。しばらく経ってからもう一度お試しください。'
      });
    } finally {
      setIsSaving(false);
      // 3秒後にメッセージを消す
      setTimeout(() => {
        setSaveMessage({ type: '', message: '' });
      }, 3000);
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
        <h1 className="text-center flex-grow font-medium text-lg">プライバシー設定</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <>
              {/* プロフィール可視性設定 */}
              <div className="bg-white rounded-lg shadow-sm mb-4">
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <HiEye className="text-teal-500 mr-2" size={20} />
                  <h2 className="font-medium">プロフィール表示設定</h2>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    あなたのプロフィールがどのユーザーに表示されるかを選択できます
                  </p>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={settings.profileVisibility === 'all'}
                        onChange={() => handleProfileVisibilityChange('all')}
                        className="h-4 w-4 text-teal-500"
                      />
                      <span className="ml-2 text-gray-700">すべてのユーザーに表示</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={settings.profileVisibility === 'matched'}
                        onChange={() => handleProfileVisibilityChange('matched')}
                        className="h-4 w-4 text-teal-500"
                      />
                      <span className="ml-2 text-gray-700">マッチしたユーザーのみに表示</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={settings.profileVisibility === 'none'}
                        onChange={() => handleProfileVisibilityChange('none')}
                        className="h-4 w-4 text-teal-500"
                      />
                      <span className="ml-2 text-gray-700">非公開（検索に表示されません）</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 一般プライバシー設定 */}
              <div className="bg-white rounded-lg shadow-sm mb-4">
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <HiLockClosed className="text-teal-500 mr-2" size={20} />
                  <h2 className="font-medium">一般プライバシー設定</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-gray-700">最終ログイン時間を表示</p>
                      <p className="text-xs text-gray-500">他のユーザーがあなたの最終オンライン時間を見られるようにします</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-last-online"
                        checked={settings.lastOnlineVisible}
                        onChange={() => handleToggle('lastOnlineVisible')}
                        className="hidden"
                      />
                      <label
                        htmlFor="toggle-last-online"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.lastOnlineVisible ? 'bg-teal-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            settings.lastOnlineVisible ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-gray-700">位置情報を表示</p>
                      <p className="text-xs text-gray-500">あなたの位置情報（都道府県）を他のユーザーに表示します</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-location"
                        checked={settings.locationVisible}
                        onChange={() => handleToggle('locationVisible')}
                        className="hidden"
                      />
                      <label
                        htmlFor="toggle-location"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.locationVisible ? 'bg-teal-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            settings.locationVisible ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-gray-700">年齢を表示</p>
                      <p className="text-xs text-gray-500">あなたの年齢を他のユーザーに表示します</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-age"
                        checked={settings.ageVisible}
                        onChange={() => handleToggle('ageVisible')}
                        className="hidden"
                      />
                      <label
                        htmlFor="toggle-age"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.ageVisible ? 'bg-teal-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            settings.ageVisible ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-gray-700">既読通知</p>
                      <p className="text-xs text-gray-500">メッセージを読んだことを相手に通知します</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-read-receipts"
                        checked={settings.readReceiptsEnabled}
                        onChange={() => handleToggle('readReceiptsEnabled')}
                        className="hidden"
                      />
                      <label
                        htmlFor="toggle-read-receipts"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.readReceiptsEnabled ? 'bg-teal-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            settings.readReceiptsEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-gray-700">プロフィール検索を許可</p>
                      <p className="text-xs text-gray-500">検索結果にあなたのプロフィールを表示します</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-profile-search"
                        checked={settings.allowProfileSearch}
                        onChange={() => handleToggle('allowProfileSearch')}
                        className="hidden"
                      />
                      <label
                        htmlFor="toggle-profile-search"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.allowProfileSearch ? 'bg-teal-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            settings.allowProfileSearch ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-gray-700">位置情報サービスを許可</p>
                      <p className="text-xs text-gray-500">アプリが位置情報にアクセスすることを許可します</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-location-services"
                        checked={settings.allowLocationServices}
                        onChange={() => handleToggle('allowLocationServices')}
                        className="hidden"
                      />
                      <label
                        htmlFor="toggle-location-services"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.allowLocationServices ? 'bg-teal-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            settings.allowLocationServices ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 設定保存ボタン */}
              <div className="mt-6">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className={`w-full py-3 rounded-md text-white font-medium ${
                    isSaving ? 'bg-gray-400' : 'bg-teal-500 hover:bg-teal-600'
                  }`}
                >
                  {isSaving ? '保存中...' : '設定を保存する'}
                </button>
                
                {saveMessage.message && (
                  <div className={`mt-3 p-3 rounded-md text-center ${
                    saveMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {saveMessage.message}
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-xs text-gray-500">
                <p className="mb-1">プライバシー設定はいつでも変更可能です。</p>
                <p>詳しくは<span className="text-teal-500">プライバシーポリシー</span>をご確認ください。</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
