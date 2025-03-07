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
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setPoints: (points: UserPoints | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addPoints: (amount: number, description: string) => Promise<void>;
  spendPoints: (amount: number, description: string) => Promise<boolean>;
  isGenderMale: () => boolean;
  isGenderFemale: () => boolean;
  toggleGender: () => void; // 開発モード用の性別切り替え機能
}

// コンテキストの作成
export const UserContext = createContext<UserContextType | undefined>(undefined);

// モックユーザーデータ（開発用）
const MOCK_MALE_USER: UserProfile = {
  id: '1',
  name: '伊藤雄一',
  age: 28,
  gender: 'male',
  bio: '大手システム開発会社でエンジニアとして働いています。趣味はスポーツ観戦とキャンプです。',
  location: '東京都',
  profileImage: '/images/avatar1.jpg', // 実際に存在する画像に変更
  profileCompletionPercentage: 85,
  isVerified: true,
  interests: ['スポーツ', 'キャンプ', '映画', 'カフェ'],
  occupation: 'ソフトウェアエンジニア',
  education: '東京大学',
  isOnline: true,
};

const MOCK_FEMALE_USER: UserProfile = {
  id: '2',
  name: '田中めぐみ',
  age: 26,
  gender: 'female',
  bio: '大手アパレル企業でマーケティング担当をしています。旅行とカフェ巡りが趣味です。',
  location: '東京都',
  profileImage: '/images/avatar2.jpg', // 実際に存在する画像に変更
  profileCompletionPercentage: 95,
  isVerified: true,
  interests: ['旅行', 'カフェ', 'ファッション', 'ヨガ'],
  occupation: 'マーケティング',
  education: '慶應大学',
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 認証状態とユーザーデータのロード
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 認証状態のチェック
        if (typeof window !== 'undefined') {
          const authStatus = localStorage.getItem('isAuthenticated') === 'true';
          setIsAuthenticated(authStatus);
          
          if (authStatus) {
            // ローカルストレージから性別設定を取得
            const savedGender = localStorage.getItem('userGender') || 'female';
            
            if (savedGender === 'male') {
              setUser(MOCK_MALE_USER);
              setPoints(MOCK_MALE_POINTS);
            } else {
              setUser(MOCK_FEMALE_USER);
              setPoints(MOCK_FEMALE_POINTS);
            }
          } else {
            // 未認証の場合はユーザー情報をクリア
            setUser(null);
            setPoints(null);
          }
        }
      } catch (error) {
        console.error('ユーザーデータのロード中にエラーが発生しました', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // ログイン関数
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // 実際のAPIリクエストに置き換える
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // メールアドレスに応じてユーザーの性別を設定
      let isMaleUser = email.includes('male');
      
      if (isMaleUser) {
        setUser(MOCK_MALE_USER);
        setPoints(MOCK_MALE_POINTS);
        if (typeof window !== 'undefined') {
          localStorage.setItem('userGender', 'male');
        }
      } else {
        setUser(MOCK_FEMALE_USER);
        setPoints(MOCK_FEMALE_POINTS);
        if (typeof window !== 'undefined') {
          localStorage.setItem('userGender', 'female');
        }
      }
      
      // 認証済み状態を保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      setIsAuthenticated(true);
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
    setIsAuthenticated(false);
    
    // 認証状態をクリア
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      // 性別情報は次回ログイン時の参照用に保持
    }
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

  // 開発モード用の性別切り替え機能
  const toggleGender = () => {
    if (!user) return;
    
    if (isGenderMale()) {
      setUser(MOCK_FEMALE_USER);
      setPoints(MOCK_FEMALE_POINTS);
      // ローカルストレージに性別を保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('userGender', 'female');
      }
    } else {
      setUser(MOCK_MALE_USER);
      setPoints(MOCK_MALE_POINTS);
      // ローカルストレージに性別を保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('userGender', 'male');
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        points,
        isLoading,
        isAuthenticated,
        setUser,
        setPoints,
        login,
        logout,
        updateProfile,
        addPoints,
        spendPoints,
        isGenderMale,
        isGenderFemale,
        toggleGender,
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
