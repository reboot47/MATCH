"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiEye, HiEyeOff } from 'react-icons/hi';

export default function PasswordSettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // パスワード要件の検証
  const hasMinLength = newPassword.length >= 12 && newPassword.length <= 20;
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasLowercase && hasUppercase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      setError('現在のパスワードを入力してください');
      return;
    }
    
    if (!isPasswordValid) {
      setError('新しいパスワードは全ての要件を満たす必要があります');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    // 実際のアプリではここでAPIリクエストを行います
    try {
      // APIリクエストをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功
      setSuccess(true);
      
      // 数秒後に前のページに戻る
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-center flex-grow font-medium text-lg">パスワードの変更</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-6">
          {success ? (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
              パスワードが正常に変更されました。
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* 現在のパスワード */}
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">現在のパスワード</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="古いパスワードを入力"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* 新しいパスワード */}
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">新しいパスワード</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="新しいパスワードを入力"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* パスワードの再入力 */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">新しいパスワード</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="新しいパスワードを再入力"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* パスワード要件 */}
              <div className="mb-6">
                <p className="text-red-500 mb-2">パスワードは以下の条件をすべて満たす必要があります</p>
                <ul className="space-y-1">
                  <li className={`flex items-center ${hasMinLength ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="inline-block w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      {hasMinLength && <span className="text-xs">✓</span>}
                    </span>
                    12文字以上20文字以内
                  </li>
                  <li className={`flex items-center ${hasLowercase ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="inline-block w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      {hasLowercase && <span className="text-xs">✓</span>}
                    </span>
                    半角英小文字を含む
                  </li>
                  <li className={`flex items-center ${hasUppercase ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="inline-block w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      {hasUppercase && <span className="text-xs">✓</span>}
                    </span>
                    半角英大文字を含む
                  </li>
                  <li className={`flex items-center ${hasNumber ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="inline-block w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      {hasNumber && <span className="text-xs">✓</span>}
                    </span>
                    数字を含む
                  </li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || !isPasswordValid || !currentPassword || newPassword !== confirmPassword}
                className={`w-full py-3 rounded-md text-white font-medium ${
                  isSubmitting || !isPasswordValid || !currentPassword || newPassword !== confirmPassword
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                {isSubmitting ? '処理中...' : '保存する'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
