'use client';

import React, { useState } from 'react';
import GiftImage from '../components/common/GiftImage';
import Link from 'next/link';

/**
 * ギフト画像テスト用のページコンポーネント
 * このページはギフト画像をテストするための専用ページです
 */
export default function GiftTestPage() {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  
  // テスト用のギフト（実際に存在するもののみ）
  const gifts = [
    'heart', 'cake', 'flowers', 'wine', 'dinner', 'default-gift'
  ];

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">ギフト画像テストページ</h1>
        <p className="text-gray-600 mb-4">
          このページは自動テスト用に提供されています。各ギフト画像をクリックして選択できます。
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← ホームに戻る
        </Link>
        <Link href="/debug/image" className="text-blue-600 hover:underline ml-4">
          デバッグ情報を表示 →
        </Link>
      </header>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">ギフト選択</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {gifts.map((gift) => (
            <button
              key={gift}
              className={`p-4 rounded-lg border ${
                selectedGift === gift 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedGift(gift)}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center">
                  <GiftImage 
                    src={gift} 
                    width={60}
                    height={60}
                    alt={`${gift}ギフト`}
                  />
                </div>
                <span className="mt-2 text-sm capitalize">{gift}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedGift && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-3">選択されたギフト</h2>
          <div className="flex items-center justify-center my-4">
            <GiftImage 
              src={selectedGift} 
              width={100}
              height={100}
              priority={true}
              quality={90}
              alt={`${selectedGift}ギフト`}
            />
          </div>
          <p className="text-center text-gray-700">
            <span className="capitalize">{selectedGift}</span> を選択しました
          </p>
        </div>
      )}
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>画像ロード状況の詳細は開発ツールのコンソールで確認できます</p>
      </div>
    </div>
  );
}
