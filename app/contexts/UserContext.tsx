"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ユーザー型定義
type UserType = {
  id?: string;
  name?: string;
  email?: string;
  gender?: '男性' | '女性';
  authProvider?: 'credentials' | 'google';
  isRegistered?: boolean;
  registeredAt?: string;
} | null;

// コンテキスト初期値
const initialContext = {
  user: null as UserType,
  setUser: (user: UserType) => {},
  isLoading: true,
  isAuthenticated: false,
  checkRegistrationStatus: (email: string) => false,
  saveUser: (userData: UserType) => {},
  removeUser: () => {},
};

// コンテキスト作成
const UserContext = createContext(initialContext);

// カスタムフック
export const useUser = () => useContext(UserContext);

// プロバイダーコンポーネント
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初期化時にローカルストレージからユーザー情報を読み込む
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('linebuzz_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('ユーザー情報の読み込みに失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      loadUser();
    }
  }, []);

  // ユーザーの登録状態をチェック
  const checkRegistrationStatus = (email: string): boolean => {
    try {
      const storedUsers = localStorage.getItem('linebuzz_registered_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        return users.some((user: any) => user.email === email);
      }
      return false;
    } catch (error) {
      console.error('登録状態の確認に失敗しました', error);
      return false;
    }
  };

  // ユーザー情報を保存
  const saveUser = (userData: UserType) => {
    if (!userData) return;
    
    try {
      // メインのユーザー情報を保存
      localStorage.setItem('linebuzz_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      // 登録済みユーザーリストに追加
      if (userData.email) {
        let registeredUsers = [];
        const storedUsers = localStorage.getItem('linebuzz_registered_users');
        
        if (storedUsers) {
          registeredUsers = JSON.parse(storedUsers);
          // 既に存在するかチェック
          const exists = registeredUsers.some((user: any) => user.email === userData.email);
          if (!exists) {
            registeredUsers.push({
              email: userData.email,
              gender: userData.gender,
              registeredAt: userData.registeredAt || new Date().toISOString()
            });
          }
        } else {
          registeredUsers = [{
            email: userData.email,
            gender: userData.gender,
            registeredAt: userData.registeredAt || new Date().toISOString()
          }];
        }
        
        localStorage.setItem('linebuzz_registered_users', JSON.stringify(registeredUsers));
      }
    } catch (error) {
      console.error('ユーザー情報の保存に失敗しました', error);
    }
  };

  // ユーザー情報を削除（ログアウト用）
  const removeUser = () => {
    try {
      localStorage.removeItem('linebuzz_user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('ユーザー情報の削除に失敗しました', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        checkRegistrationStatus,
        saveUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
