'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function PhoneSettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (session?.user?.phoneNumber) {
      setCurrentPhoneNumber(session.user.phoneNumber);
    }
  }, [session]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [remainingTime]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!phoneNumber || !phoneNumber.match(/^\d{10,11}$/)) {
      setError('有効な電話番号を入力してください');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '認証コードの送信に失敗しました');
      }

      setMessage('認証コードを送信しました。SMSをご確認ください。');
      toast.success('認証コードを送信しました');
      
      // 開発環境の場合、認証コードを自動入力
      if (data.verificationCode) {
        setVerificationCode(data.verificationCode);
      }
      
      // 再送信制限時間を設定（3分）
      setRemainingTime(180);
      setStep(2);
    } catch (error) {
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      toast.error('認証コードの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!verificationCode) {
      setError('認証コードを入力してください');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile/phone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '電話番号の更新に失敗しました');
      }

      // セッションを更新
      await update();
      
      toast.success('電話番号を更新しました');
      setTimeout(() => {
        router.push('/settings');
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      toast.error('電話番号の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const formatRemainingTime = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
          <h1 className="text-lg font-medium">電話番号の変更</h1>
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
          <p className="text-sm text-gray-600 mb-1">
            現在の電話番号:
          </p>
          <p className="font-medium">
            {currentPhoneNumber || '登録されていません'}
          </p>
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
        
        {message && (
          <motion.div 
            className="p-3 bg-green-50 text-green-700 rounded-md mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>
        )}

        {step === 1 ? (
          <motion.form
            onSubmit={handleRequestCode}
            className="bg-white rounded-lg shadow-sm p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                新しい電話番号
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: 08012345678"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                ※ハイフンなしの10〜11桁の電話番号を入力してください
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-md text-white font-medium ${
                isLoading ? 'bg-navy-600' : 'bg-navy-700 hover:bg-navy-800'
              } transition-colors`}
            >
              {isLoading ? '送信中...' : '認証コードを送信'}
            </button>
          </motion.form>
        ) : (
          <motion.form
            onSubmit={handleVerifyCode}
            className="bg-white rounded-lg shadow-sm p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                認証コード
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="SMSで送信された認証コード"
                maxLength={4}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                SMSで送信された4桁の認証コードを入力してください
              </p>
              
              {remainingTime > 0 && (
                <p className="mt-3 text-sm text-gray-600">
                  再送信まで: {formatRemainingTime()}
                </p>
              )}
              
              {remainingTime === 0 && step === 2 && (
                <button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={isLoading}
                  className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  認証コードを再送信する
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                戻る
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 rounded-md text-white font-medium ${
                  isLoading ? 'bg-navy-600' : 'bg-navy-700 hover:bg-navy-800'
                } transition-colors`}
              >
                {isLoading ? '確認中...' : '電話番号を変更する'}
              </button>
            </div>
          </motion.form>
        )}
      </motion.main>
    </div>
  );
}
