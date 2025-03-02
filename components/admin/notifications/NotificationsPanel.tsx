"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBell, HiX, HiOutlineExclamation, HiOutlineCheckCircle, HiOutlineInformationCircle } from 'react-icons/hi';

// 通知タイプの定義
type NotificationType = 'info' | 'success' | 'warning' | 'error';

// 通知アイテムの型定義
interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// モックデータ
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'warning',
    title: '不適切なコンテンツが報告されました',
    message: 'ユーザーID: 4872のプロフィール写真が3人のユーザーから報告されました。確認してください。',
    time: '15分前',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'システムメンテナンス予定',
    message: '2025年3月10日午前2時から4時までシステムメンテナンスが予定されています。',
    time: '1時間前',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'キャンペーン開始',
    message: '春の出会いキャンペーンが正常に開始されました。現在の参加者数: 234人',
    time: '2時間前',
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: '支払い処理エラー',
    message: '複数のユーザーから支払い処理に関する問題が報告されています。決済システムを確認してください。',
    time: '4時間前',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: '新機能リリース完了',
    message: 'ビデオチャット機能のリリースが完了しました。利用統計を監視してください。',
    time: '昨日',
    read: true,
  },
];

const NotificationsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  // 通知をすべて既読にする
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  // 特定の通知を削除する
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 通知のアイコンを取得
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <HiOutlineInformationCircle className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <HiOutlineExclamation className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <HiOutlineExclamation className="h-5 w-5 text-red-500" />;
    }
  };

  // 通知の背景色を取得
  const getNotificationBgColor = (type: NotificationType, read: boolean) => {
    if (read) return 'bg-gray-50';
    
    switch (type) {
      case 'info':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
    }
  };

  return (
    <div className="relative z-50">
      {/* 通知ベルアイコン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <HiOutlineBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 通知パネル */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">通知</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    すべて既読にする
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <HiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${getNotificationBgColor(notification.type, notification.read)}`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-start justify-between">
                            <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <HiX className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">通知はありません</div>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                すべての通知を表示
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsPanel;
