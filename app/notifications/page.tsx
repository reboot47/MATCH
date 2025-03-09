'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { FaBell } from 'react-icons/fa';
import { useNotification, NotificationType } from '../contexts/NotificationContext';
import CampaignIcon from '../components/notifications/CampaignIcon';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/home')} 
              className="mr-3 text-gray-600"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-xl font-semibold">お知らせ</h1>
          </div>
          <button 
            onClick={markAllAsRead} 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            全て既読
          </button>
        </div>
      </header>

      {/* 通知リスト */}
      <div className="max-w-screen-md mx-auto pt-2 pb-20">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="p-4">
              {/* お知らせのヘッダー */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(notification.type)}`}>
                    {notification.type}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {notification.date}
                </span>
              </div>

              {/* お知らせの内容 */}
              <div>
                {notification.type === 'キャンペーン' && (
                  <div className="float-left mr-3 mb-1">
                    <div className="w-14 h-14 rounded-md overflow-hidden">
                      <CampaignIcon 
                        type={notification.title.includes('ゴールド') ? 'gold' : 
                              notification.title.includes('動画') ? 'video' : 'event'} 
                      />
                    </div>
                  </div>
                )}
                <h2 className="text-sm font-medium mb-1">{notification.title}</h2>
                <p className="text-xs text-gray-600">{notification.content}</p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            <FaBell size={40} className="mx-auto mb-3 text-gray-300" />
            <p>お知らせはありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 通知タイプに応じた色を返す関数
function getTypeColor(type: NotificationType): string {
  switch (type) {
    case 'キャンペーン':
      return 'bg-purple-100 text-purple-800';
    case '重要':
      return 'bg-red-100 text-red-800';
    case 'システム':
      return 'bg-gray-100 text-gray-800';
    case 'イベント':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}
