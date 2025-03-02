'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { Zap, Loader2 } from 'lucide-react';

export default function PointsPage() {
  const { user, isGenderMale, isGenderFemale, isLoading } = useUser();
  const router = useRouter();

  // ユーザーの性別に基づいて適切なページにリダイレクト
  useEffect(() => {
    if (!isLoading) {
      if (isGenderMale()) {
        router.push('/match/points/buy');
      } else if (isGenderFemale()) {
        router.push('/match/points/earn');
      }
      // 性別未設定の場合はこのページに留まる
    }
  }, [isLoading, isGenderMale, isGenderFemale, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="mt-4 text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // 性別が設定されていない場合のフォールバックUI
  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <Zap size={48} className="text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold">LINEBUZZポイント</h1>
        <p className="text-gray-500 mt-2">
          ポイントを使って特別な機能を利用できます
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">ポイントについて</h2>
        <p className="text-gray-600 mb-4">
          LINEBUZZではポイントを使用して様々な特別機能を利用できます。男性ユーザーはポイントを購入し、女性ユーザーはアクティビティを通じてポイントを獲得できます。
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-blue-800 mb-2">男性ユーザーの場合</h3>
          <p className="text-blue-700 text-sm">
            ポイントを購入して、以下のような特別機能を利用できます:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-700 mt-2">
            <li>スーパーいいね！</li>
            <li>プロフィールブースト</li>
            <li>特別なギフト送信</li>
            <li>検索フィルターの拡張</li>
          </ul>
        </div>
        
        <div className="bg-pink-50 rounded-lg p-4">
          <h3 className="font-medium text-pink-800 mb-2">女性ユーザーの場合</h3>
          <p className="text-pink-700 text-sm">
            以下のようなアクティビティでポイントを獲得できます:
          </p>
          <ul className="list-disc list-inside text-sm text-pink-700 mt-2">
            <li>プロフィール完成</li>
            <li>毎日のログイン</li>
            <li>メッセージへの返信</li>
            <li>特別イベントへの参加</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">性別を設定してください</h2>
        <p className="text-gray-600 mb-6">
          ポイントシステムを利用するには、プロフィールで性別を設定してください。
        </p>
        
        <button
          onClick={() => router.push('/match/profile')}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
        >
          プロフィールを編集する
        </button>
      </div>
    </div>
  );
}
