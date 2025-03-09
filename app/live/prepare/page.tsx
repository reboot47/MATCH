"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiQuestionMarkCircle } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '../../../components/UserContext';

export default function LiveStreamPreparationPage() {
  const router = useRouter();
  const userContext = useUser();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // 年齢確認ステータスの確認
    const checkVerificationStatus = async () => {
      // 実際のアプリではAPIリクエストを行う
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // テスト用に未確認と仮定
      setIsVerified(false);
    };
    
    checkVerificationStatus();
  }, []);

  const handleStartStreaming = () => {
    setIsLoading(true);
    
    // 実際のアプリではライブ配信開始のAPI呼び出しなどを行う
    setTimeout(() => {
      setIsLoading(false);
      router.push('/live/streaming');
    }, 1000);
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
        <h1 className="text-center flex-grow font-medium text-lg">ライブ配信</h1>
        <Link href="/help/live" className="text-gray-600">
          <HiQuestionMarkCircle size={24} />
        </Link>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20">
        {/* キャッシュ表示部分 */}
        <div className="bg-white p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">残キャッシュ</span>
              <span className="text-red-500 text-lg">●</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">0</span>
              <Link href="/payment/cash" className="ml-4 px-4 py-1 rounded-full bg-gray-100 text-teal-600 text-sm">
                キャッシュ換金
              </Link>
            </div>
          </div>
        </div>

        {/* ライブ配信準備コンテンツ */}
        <div className="flex flex-col items-center px-4 pt-4">
          {/* イラスト */}
          <div className="my-8">
            <Image 
              src="/images/live-stream-illustration.png" 
              alt="ライブ配信イラスト"
              width={280}
              height={280}
              className="max-w-full h-auto"
            />
          </div>

          {/* ライブ配信説明テキスト */}
          <div className="bg-white rounded-lg p-6 w-full max-w-md mb-8 shadow-sm">
            <h2 className="text-lg font-medium mb-4 text-center">ライブ配信のルール</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>18歳未満の方はライブ配信をご利用いただけません</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>公序良俗に反する配信や、第三者の権利を侵害する行為は禁止です</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>視聴者からのギフトやいいねが、キャッシュとして換金可能です</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>ランキング上位に入ると、追加特典が付与されます</span>
              </li>
            </ul>
          </div>

          {/* 開始ボタン */}
          <button
            onClick={handleStartStreaming}
            disabled={isLoading}
            className="w-full max-w-md bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-md font-medium mb-4 hover:opacity-90 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                準備中...
              </div>
            ) : 'ライブ配信を準備する'}
          </button>
          
          <p className="text-sm text-gray-500 text-center">
            「ライブ配信を準備する」をタップすることで、<br />
            <Link href="/terms" className="text-teal-600 underline">利用規約</Link>に同意したものとみなします。
          </p>
        </div>
      </main>
    </div>
  );
}
