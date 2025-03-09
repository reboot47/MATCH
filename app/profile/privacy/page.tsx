'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaLock, FaShieldAlt, FaUserShield } from 'react-icons/fa';
import PrivacySettings from '@/app/components/profile/PrivacySettings';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Link from 'next/link';

// プライバシー設定のインターフェース
interface PrivacyOption {
  id: string;
  label: string;
  description: string;
  value: string;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

export default function PrivacyPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [privacySettings, setPrivacySettings] = useState<PrivacyOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ユーザーのプライバシー設定を取得
  useEffect(() => {
    const fetchPrivacySettings = async () => {
      if (status === 'loading' || !session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/users/${session.user.id}/privacy`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '設定の取得に失敗しました');
        }
        
        const data = await response.json();
        setPrivacySettings(data.privacySettings);
      } catch (error) {
        console.error('Privacy settings fetch error:', error);
        setError('プライバシー設定の取得に失敗しました。ページを再読み込みしてください。');
        // エラー時にはデフォルト設定を使用
        setPrivacySettings(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacySettings();
  }, [session, status]);

  // プライバシー設定を保存
  const handleSavePrivacySettings = async (data: PrivacyOption[]) => {
    if (!session?.user?.id) {
      toast.error('ログインが必要です');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacySettings: data }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '設定の保存に失敗しました');
      }
      
      toast.success('プライバシー設定を保存しました');
      return true;
    } catch (error) {
      console.error('Privacy settings save error:', error);
      toast.error('設定の保存に失敗しました。後でもう一度お試しください。');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#66cdaa] text-white rounded-md hover:bg-[#90ee90] transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">プライバシーとセキュリティ</h1>
        <p className="text-gray-600">
          あなたのプライバシーとセキュリティは私たちにとって重要です。以下の設定をカスタマイズして、自分に合った体験を作成してください。
        </p>
      </div>

      <div className="space-y-8">
        {/* プライバシー設定コンポーネント */}
        <PrivacySettings 
          options={privacySettings || undefined}
          onSave={handleSavePrivacySettings} 
        />

        {/* 追加のセキュリティ情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center mb-4">
            <FaShieldAlt className="text-[#66cdaa] w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">あなたのデータの取り扱い</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              LineBuzzでは、ユーザーのプライバシーを最優先事項として考えています。
              私たちはあなたの情報を以下の目的でのみ使用します：
            </p>

            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#66cdaa] mr-2">•</span>
                <span>より適切なマッチングの提供</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#66cdaa] mr-2">•</span>
                <span>サービスの改善と新機能の開発</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#66cdaa] mr-2">•</span>
                <span>安全なプラットフォームの維持</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#66cdaa] mr-2">•</span>
                <span>法的義務の履行</span>
              </li>
            </ul>

            <p className="text-gray-700">
              あなたのデータはいつでもあなたのものです。データの削除やエクスポートについては、
              <Link href="/profile/account" className="text-[#66cdaa] hover:underline">アカウント設定</Link>
              ページをご覧ください。
            </p>
          </div>
        </motion.div>

        {/* セキュリティのヒント */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center mb-4">
            <FaUserShield className="text-[#66cdaa] w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">セキュリティのヒント</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">強力なパスワード</h3>
              <p className="text-gray-600 text-sm">
                アカウントの安全を確保するために、複雑で一意のパスワードを使用してください。
                文字、数字、記号を組み合わせたものが最も安全です。
              </p>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">二要素認証</h3>
              <p className="text-gray-600 text-sm">
                <Link href="/profile/account-security" className="text-[#66cdaa] hover:underline">アカウントセキュリティ</Link>
                ページで二要素認証を有効にすることで、アカウントの保護を強化できます。
              </p>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">不審なメッセージに注意</h3>
              <p className="text-gray-600 text-sm">
                個人情報や金銭を要求するユーザーには警戒してください。
                不審なメッセージは即座に報告してください。
              </p>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">デバイスのセキュリティ</h3>
              <p className="text-gray-600 text-sm">
                デバイスのロックを確実に行い、公共のWi-Fiネットワークでの個人情報の入力は避けてください。
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/help/security"
              className="text-[#66cdaa] hover:underline inline-flex items-center"
            >
              <FaLock className="mr-1" />
              セキュリティについてもっと学ぶ
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
