'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// お知らせタイプの定義
export type NotificationType = 'キャンペーン' | '重要' | 'システム' | 'イベント';

// お知らせの型定義
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  imageUrl?: string;
}

// コンテキストの型定義
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
}

// デフォルト値
const defaultContext: NotificationContextType = {
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  addNotification: () => {},
};

// コンテキスト作成
const NotificationContext = createContext<NotificationContextType>(defaultContext);

// コンテキストプロバイダーの型
interface NotificationProviderProps {
  children: ReactNode;
}

// 初期お知らせデータ
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'キャンペーン',
    title: '【すぐ出会いたい人向け】今なら特別価格！最短で出会えるゴールドオプション💖',
    content: '期間限定でゴールドオプションが50%OFF！今すぐ気になる相手と会える特別な機会です。',
    date: '2025-03-08 12:00',
    isRead: false,
    imageUrl: '/images/gold-campaign.jpg'
  },
  {
    id: '2',
    type: 'キャンペーン',
    title: '【もう時間を無駄にしない】今なら格安で動画見放題！！参わなくても貴や話し方を見れちゃう🌟✨',
    content: '期間限定で動画サービスが格安に！相手の素顔を確認して安心してマッチングしましょう。',
    date: '2025-03-07 18:00',
    isRead: false,
    imageUrl: '/images/gold-campaign.jpg'
  },
  {
    id: '3',
    type: '重要',
    title: '「いいね！」仕様変更のお知らせ',
    content: 'より快適なマッチング体験のために「いいね！」機能の仕様を変更しました。詳細はこちら。',
    date: '2025-03-06 18:00',
    isRead: true
  },
  {
    id: '4',
    type: 'システム',
    title: 'やりとりしているお相手について',
    content: 'サービスの健全な運営のために、やりとりの際の注意点をご確認ください。',
    date: '2025-03-04 16:08',
    isRead: true
  },
  {
    id: '5',
    type: 'イベント',
    title: '「コインバックチャレンジ」本日スタート！✨使用コイン全額還元 💰',
    content: '期間中にコインを使うと、使用額に応じてコインが還元されます。是非ご参加ください！',
    date: '2025-03-01 00:00',
    isRead: false
  },
  {
    id: '6',
    type: 'システム',
    title: 'やりとりしているお相手について',
    content: 'サービスの健全な運営のために、やりとりの際の注意点をご確認ください。',
    date: '2025-02-28 07:47',
    isRead: true
  },
  {
    id: '7',
    type: 'システム',
    title: 'やりとりしているお相手について',
    content: 'サービスの健全な運営のために、やりとりの際の注意点をご確認ください。',
    date: '2025-02-27 12:28',
    isRead: true
  },
];

// 通知プロバイダーコンポーネント
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 初期データロード（実際のアプリではAPIからフェッチする）
  useEffect(() => {
    // ローカルストレージから既存の通知を取得
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      updateUnreadCount(parsedNotifications);
    } else {
      // 初回のみ初期データを使用
      setNotifications(initialNotifications);
      updateUnreadCount(initialNotifications);
      localStorage.setItem('notifications', JSON.stringify(initialNotifications));
    }
  }, []);

  // 未読数の更新
  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  };

  // 単一のお知らせを既読にする
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // すべてのお知らせを既読にする
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // 新しいお知らせを追加する
  const addNotification = (notification: Notification) => {
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// カスタムフック
export const useNotification = () => useContext(NotificationContext);
