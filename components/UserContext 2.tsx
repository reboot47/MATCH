"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ユーザー情報の型定義
export type Gender = 'male' | 'female' | 'other' | null;

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bio: string;
  location: string;
  profileImage?: string;
  profileCompletionPercentage: number;
  isVerified: boolean;
  interests: string[];
  occupation?: string;
  education?: string;
  isOnline: boolean;
  lastActive?: string;
}

export interface UserPoints {
  balance: number;
  history: {
    id: string;
    amount: number;
    type: 'earned' | 'spent' | 'purchased';
    description: string;
    date: string;
  }[];
  subscription?: {
    plan: 'none' | 'basic' | 'premium' | 'vip';
    expiresAt: string;
    autoRenew: boolean;
  };
}

interface UserContextType {
  user: UserProfile | null;
  points: UserPoints | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setPoints: (points: UserPoints | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addPoints: (amount: number, description: string) => Promise<void>;
  spendPoints: (amount: number, description: string) => Promise<boolean>;
  isGenderMale: () => boolean;
  isGenderFemale: () => boolean;
}

// コンテキストの作成
const UserContext = createContext<UserContextType | undefined>(undefined);

// モックユーザーデータ（開発用）
const MOCK_MALE_USER: UserProfile = {
  id: '1',
  name: '山田太郎',
  age: 28,
  gender: 'male',
  bio: 'IT企業で働いています。休日は映画鑑賞とカフェ巡りが趣味です。',
  location: '東京都',
  profileCompletionPercentage: 85,
  isVerified: true,
  interests: ['映画', '音楽', 'カフェ', '旅行'],
  occupation: 'エンジニア',
  education: '早稲田大学',
  isOnline: true,
};

const MOCK_FEMALE_USER: UserProfile = {
  id: '2',
  name: '佐藤花子',
  age: 26,
  gender: 'female',
  bio: 'デザイナーとして働いています。休日は料理とヨガを楽しんでいます。',
  location: '東京都',
  profileCompletionPercentage: 90,
  isVerified: true,
  interests: ['料理', 'ヨガ', 'アート', '写真'],
  occupation: 'デザイナー',
  education: '慶應義塾大学',
  isOnline: true,
};

const MOCK_MALE_POINTS: UserPoints = {
  balance: 500,
  history: [
    {
      id: '1',
      amount: 500,
      type: 'purchased',
      description: 'スターターパック購入',
      date: '2025-03-01',
    },
    {
      id: '2',
      amount: -100,
      type: 'spent',
      description: 'プロフィールブースト使用',
      date: '2025-03-01',
    },
    {
      id: '3',
      amount: -50,
      type: 'spent',
      description: 'スーパーいいね！使用',
      date: '2025-03-02',
    },
  ],
  subscription: {
    plan: 'premium',
    expiresAt: '2025-04-01',
    autoRenew: true,
  },
};

const MOCK_FEMALE_POINTS: UserPoints = {
  balance: 1200,
  history: [
    {
      id: '1',
      amount: 200,
      type: 'earned',
      description: '新規登録ボーナス',
      date: '2025-03-01',
    },
    {
      id: '2',
      amount: 300,
      type: 'earned',
      description: 'プロフィール完成ボーナス',
      date: '2025-03-01',
    },
    {
      id: '3',
      amount: 500,
      type: 'earned',
      description: '本人確認完了ボーナス',
      date: '2025-03-01',
    },
    {
      id: '4',
      amount: 200,
      type: 'earned',
      description: 'メッセージ返信ボーナス',
      date: '2025-03-02',
    },
  ],
  subscription: {
    plan: 'basic',
    expiresAt: '2025-04-01',
    autoRenew: false,
  },
};

// プロバイダーコンポーネント
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 開発用のモックデータロード
  useEffect(() => {
    // 本番環境では実際のAPI呼び出しに置き換え
    const loadMockData = async () => {
      // 開発用：強制的に男性ユーザーとしてログイン
      // setUser(MOCK_MALE_USER);
      // setPoints(MOCK_MALE_POINTS);

      // 開発用：強制的に女性ユーザーとしてログイン
      setUser(MOCK_FEMALE_USER);
      setPoints(MOCK_FEMALE_POINTS);

      setIsLoading(false);
    };

    loadMockData();
  }, []);

  // ログイン関数
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // 実際のAPIリクエストに置き換える
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 開発用：メールアドレスに応じてユーザーの性別を切り替え
      if (email.includes('male')) {
        setUser(MOCK_MALE_USER);
        setPoints(MOCK_MALE_POINTS);
      } else {
        setUser(MOCK_FEMALE_USER);
        setPoints(MOCK_FEMALE_POINTS);
      }
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error('ログインに失敗しました');
    }
  };

  // ログアウト関数
  const logout = () => {
    setUser(null);
    setPoints(null);
  };

  // プロフィール更新
  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      // 実際のAPIリクエストに置き換える
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        setUser({ ...user, ...profile });
      }
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error('プロフィール更新に失敗しました');
    }
  };

  // ポイント追加
  const addPoints = async (amount: number, description: string) => {
    if (!points) return;
    
    const newHistory = {
      id: Math.random().toString(36).substring(7),
      amount,
      type: 'earned' as const,
      description,
      date: new Date().toISOString().split('T')[0],
    };
    
    setPoints({
      ...points,
      balance: points.balance + amount,
      history: [newHistory, ...points.history],
    });
  };

  // ポイント消費
  const spendPoints = async (amount: number, description: string): Promise<boolean> => {
    if (!points) return false;
    if (points.balance < amount) return false;
    
    const newHistory = {
      id: Math.random().toString(36).substring(7),
      amount: -amount,
      type: 'spent' as const,
      description,
      date: new Date().toISOString().split('T')[0],
    };
    
    setPoints({
      ...points,
      balance: points.balance - amount,
      history: [newHistory, ...points.history],
    });
    
    return true;
  };

  // 性別判定ヘルパー関数
  const isGenderMale = () => user?.gender === 'male';
  const isGenderFemale = () => user?.gender === 'female';

  return (
    <UserContext.Provider
      value={{
        user,
        points,
        isLoading,
        setUser,
        setPoints,
        login,
        logout,
        updateProfile,
        addPoints,
        spendPoints,
        isGenderMale,
        isGenderFemale,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// カスタムフック
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
