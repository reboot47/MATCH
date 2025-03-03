"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { FaLock, FaEnvelope, FaBell, FaShieldAlt, FaTrash, FaSignOutAlt } from 'react-icons/fa';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState({
    password: false,
    email: false,
    delete: false,
  });
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyOptions, setPrivacyOptions] = useState({
    showOnlineStatus: true,
    showLastActive: true,
    allowMessagesFromNonMatches: false,
  });

  // セッションチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setEmail(session.user.email || '');
    }
  }, [router, status, session]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('新しいパスワードと確認用パスワードが一致しません');
      return;
    }
    
    try {
      // ここでは実際のAPIリクエストは省略
      toast.success('パスワードを更新しました（モック）');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('パスワード更新エラー:', error);
      toast.error('パスワードの更新中にエラーが発生しました');
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // ここでは実際のAPIリクエストは省略
      toast.success('メールアドレスの変更リクエストを送信しました（モック）');
    } catch (error) {
      console.error('メールアドレス更新エラー:', error);
      toast.error('メールアドレスの更新中にエラーが発生しました');
    }
  };

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // ここでは実際のAPIリクエストは省略
      toast.success('通知設定を更新しました（モック）');
    } catch (error) {
      console.error('通知設定更新エラー:', error);
      toast.error('通知設定の更新中にエラーが発生しました');
    }
  };

  const handleUpdatePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // ここでは実際のAPIリクエストは省略
      toast.success('プライバシー設定を更新しました（モック）');
    } catch (error) {
      console.error('プライバシー設定更新エラー:', error);
      toast.error('プライバシー設定の更新中にエラーが発生しました');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'アカウントを削除しますか？この操作は取り消せません。'
    );
    
    if (!confirmed) return;
    
    try {
      // ここでは実際のAPIリクエストは省略
      toast.success('アカウント削除リクエストを送信しました（モック）');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('アカウント削除エラー:', error);
      toast.error('アカウントの削除中にエラーが発生しました');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('ログアウトエラー:', error);
      toast.error('ログアウト中にエラーが発生しました');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">アカウント設定</h1>
        
        <div className="space-y-6">
          {/* パスワード変更 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaLock className="text-blue-500" />
              <h2 className="text-xl font-semibold">パスワード変更</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（確認）</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  更新する
                </button>
              </div>
            </form>
          </div>
          
          {/* メールアドレス変更 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-blue-500" />
              <h2 className="text-xl font-semibold">メールアドレス変更</h2>
            </div>
            
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">現在のメールアドレス</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新しいメールアドレス</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  更新する
                </button>
              </div>
            </form>
          </div>
          
          {/* 通知設定 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaBell className="text-blue-500" />
              <h2 className="text-xl font-semibold">通知設定</h2>
            </div>
            
            <form onSubmit={handleUpdateNotifications} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">アプリ内通知</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
          
          {/* プライバシー設定 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-blue-500" />
              <h2 className="text-xl font-semibold">プライバシー設定</h2>
            </div>
            
            <form onSubmit={handleUpdatePrivacy} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">オンラインステータスを表示する</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyOptions.showOnlineStatus}
                    onChange={() => setPrivacyOptions({
                      ...privacyOptions,
                      showOnlineStatus: !privacyOptions.showOnlineStatus,
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">最終アクティブ時間を表示する</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyOptions.showLastActive}
                    onChange={() => setPrivacyOptions({
                      ...privacyOptions,
                      showLastActive: !privacyOptions.showLastActive,
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">マッチしていない相手からのメッセージを許可する</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyOptions.allowMessagesFromNonMatches}
                    onChange={() => setPrivacyOptions({
                      ...privacyOptions,
                      allowMessagesFromNonMatches: !privacyOptions.allowMessagesFromNonMatches,
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
          
          {/* アカウント削除 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaTrash className="text-red-500" />
              <h2 className="text-xl font-semibold">アカウント削除</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              アカウントを削除すると、すべてのデータが永久に削除されます。この操作は取り消せません。
            </p>
            
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              アカウントを削除する
            </button>
          </div>
          
          {/* ログアウト */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaSignOutAlt className="text-gray-500" />
              <h2 className="text-xl font-semibold">ログアウト</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              すべてのデバイスからログアウトします。
            </p>
            
            <button
              onClick={handleSignOut}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              ログアウトする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
