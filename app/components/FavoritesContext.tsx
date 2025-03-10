"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// お気に入りユーザーの型定義
export interface FavoriteUser {
  id: string;
  name: string;
  age: number;
  location: string;
  profileImage: string;
  lastActive?: string;
  isOnline?: boolean;
  lastMessage?: {
    text: string;
    timestamp: string;
    isUnread?: boolean;
  };
}

interface FavoritesContextType {
  favorites: FavoriteUser[];
  addFavorite: (user: FavoriteUser) => void;
  removeFavorite: (userId: string) => void;
  isFavorite: (userId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  // モックデータを初期値として設定
  const [favorites, setFavorites] = useState<FavoriteUser[]>([
    {
      id: '1',
      name: 'れいな',
      age: 23,
      location: '大阪府',
      profileImage: '/images/profile/user1.jpg',
      lastActive: '3時間前',
      isOnline: false,
      lastMessage: {
        text: '今週の土曜日、空いてる？',
        timestamp: '昨日',
        isUnread: true
      }
    },
    {
      id: '2',
      name: 'さやか',
      age: 25,
      location: '大阪府',
      profileImage: '/images/profile/user2.jpg',
      lastActive: '1時間前',
      isOnline: true,
      lastMessage: {
        text: 'ありがとう！了解です😊',
        timestamp: '3時間前'
      }
    },
    {
      id: '3',
      name: 'みき',
      age: 27,
      location: '大阪府',
      profileImage: '/images/profile/user3.jpg',
      lastActive: '30分前',
      isOnline: true,
      lastMessage: {
        text: '写真ありがとう！素敵ですね✨',
        timestamp: '1日前'
      }
    }
  ]);

  // お気に入りをローカルストレージから読み込む
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // お気に入りが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // お気に入りに追加
  const addFavorite = (user: FavoriteUser) => {
    setFavorites(prev => {
      // 既に追加されている場合は何もしない
      if (prev.some(fav => fav.id === user.id)) {
        return prev;
      }
      return [...prev, user];
    });
  };

  // お気に入りから削除
  const removeFavorite = (userId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== userId));
  };

  // お気に入りに含まれているか確認
  const isFavorite = (userId: string) => {
    return favorites.some(fav => fav.id === userId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
