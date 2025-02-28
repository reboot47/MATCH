'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { motion } from 'framer-motion';

const emailSchema = z.string().email('有効なメールアドレスを入力してください');

export default function EmailSettingsPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      setCurrentEmail(session.user.email);
    }
  }, [session]);

  const validateInputs = () => {
    try {
      emailSchema.parse(newEmail);
      if (newEmail === currentEmail) {
        setError('現在のメールアドレスと同じです');
        return false;
      }
      setError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError('入力に誤りがあります');
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setIsLoading(true);
    try {
      console.log('送信データ:', { email: newEmail });
      const response = await fetch('/api/user/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      console.log('APIレスポンス:', data, 'ステータス:', response.status);

      if (!response.ok) {
        throw new Error(data.error || 'メールアドレスの更新に失敗しました');
      }

      toast.success('メールアドレスが更新されました');
      
      // 明示的にセッションを更新し、設定ページにリダイレクト
      try {
        // セッションの強制更新
        await fetch('/api/auth/session', { method: 'GET' });
        await update();
        
        // 少し待ってからリダイレクト (セッション更新の完了を待つ)
        setTimeout(() => {
          router.push('/settings');
          router.refresh(); // ページを強制的に更新
        }, 500);
      } catch (sessionError) {
        console.error('セッション更新エラー:', sessionError);
        // セッション更新に失敗してもUIは更新する
        router.push('/settings');
      }
    } catch (error) {
      console.error('エラー詳細:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('メールアドレスの更新中にエラーが発生しました');
      }
      toast.error('メールアドレスの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <motion.header 
        className="bg-white border-b"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="mr-4"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">メールアドレスを登録・変更する</h1>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <motion.main 
        className="flex-1 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-600 mb-4">
            現在のメールアドレス: <span className="font-medium">{currentEmail || '登録されていません'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-6">
            <label 
              htmlFor="newEmail" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              新しいメールアドレス
            </label>
            <input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="新しいメールアドレスを入力"
              required
            />
          </div>

          {error && (
            <motion.div 
              className="p-3 bg-red-50 text-red-700 rounded-md mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-white font-medium ${
              isLoading ? 'bg-navy-600' : 'bg-navy-700 hover:bg-navy-800'
            } transition-colors`}
          >
            {isLoading ? '更新中...' : 'メールアドレスを更新する'}
          </button>
        </form>
      </motion.main>
    </div>
  );
}
