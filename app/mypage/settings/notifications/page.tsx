"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

export default function NotificationSettingsPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? false;
  
  // 通知設定の状態
  const [notificationSettings, setNotificationSettings] = useState({
    // SMS通知設定
    smsNotifications: {
      campaign: false,
    },
    // メール通知設定
    emailNotifications: {
      likes: false,
      matches: false, 
      messages: false,
      footprints: false,
      announcements: false,
    }
  });

  // トグルスイッチの変更ハンドラー
  const handleSmsToggle = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      smsNotifications: {
        ...notificationSettings.smsNotifications,
        [key]: !notificationSettings.smsNotifications[key as keyof typeof notificationSettings.smsNotifications],
      }
    });
  };

  const handleEmailToggle = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      emailNotifications: {
        ...notificationSettings.emailNotifications,
        [key]: !notificationSettings.emailNotifications[key as keyof typeof notificationSettings.emailNotifications],
      }
    });
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
        <h1 className="text-center flex-grow font-medium text-lg">通知設定</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-2">
          {/* 注意事項 */}
          <div className="bg-gray-100 p-3 rounded-md mb-6 text-sm text-gray-600">
            ※反映に時間がかかることがあります。
          </div>

          {/* SMS通知設定 */}
          <div className="bg-white rounded-md shadow-sm mb-6">
            <h2 className="text-lg font-medium p-4 border-b border-gray-100">SMS通知の配信設定</h2>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between p-4">
                <span className="text-gray-700">キャンペーンなどのお得な情報</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.smsNotifications.campaign}
                    onChange={() => handleSmsToggle('campaign')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* メール通知設定 */}
          <div className="bg-white rounded-md shadow-sm mb-6">
            <h2 className="text-lg font-medium p-4 border-b border-gray-100">メールの配信設定</h2>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between p-4">
                <span className="text-gray-700">いいね！をもらった時</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.emailNotifications.likes}
                    onChange={() => handleEmailToggle('likes')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-gray-700">マッチングした時</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.emailNotifications.matches}
                    onChange={() => handleEmailToggle('matches')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-gray-700">メッセージをもらった時</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.emailNotifications.messages}
                    onChange={() => handleEmailToggle('messages')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-gray-700">足あとがついた時</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.emailNotifications.footprints}
                    onChange={() => handleEmailToggle('footprints')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-gray-700">その他のお知らせ</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationSettings.emailNotifications.announcements}
                    onChange={() => handleEmailToggle('announcements')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 配信先メールアドレス変更 */}
          <div className="bg-white rounded-md shadow-sm mb-6">
            <button 
              onClick={() => router.push('/mypage/settings/email')}
              className="w-full p-4 text-left flex items-center justify-between text-teal-500"
            >
              <span>配信先メールアドレスを変更する</span>
              <HiChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
