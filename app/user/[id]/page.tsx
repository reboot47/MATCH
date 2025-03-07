"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';

// 仮のユーザーデータ（実際の実装ではAPIから取得）
const mockUser = {
  id: '123',
  name: 'すぅちゃん',
  age: 27,
  location: '大阪府',
  bio: `初めて登録しました！💕
初心者なのでお手柔らかに😊笑
色んな人とお話したいです！
カフェでも飲みでも♪
まずは顔合わせから希望です♡`,
  appearance: {
    height: 163,
    bodyType: 'グラマー',
    lookType: 'ギャル系、綺麗系'
  },
  basicProfile: {
    occupation: '事務員',
    dream: 'セレブ',
    meetingArea: '気が合えば会いたい',
    personality: '素直、明るい、楽観的'
  },
  images: [
    '/images/dummy/thumbnails/1.jpg',
    '/images/dummy/thumbnails/2.jpg',
    '/images/dummy/thumbnails/3.jpg'
  ], // 実際に存在する画像に変更
  likes: 82,
  message: '会ってお話ししましょよ〜😉💕',
  boostMultiplier: 2
};

// プロフィールタブの定義
const tabs = [
  { id: 'profile', label: 'プロフ' },
  { id: 'pickup', label: 'ピックアップ' }
];

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  // 直接paramsからIDを取得
  const userId = params.id as string;
  const { user: currentUser, isAuthenticated = false } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(mockUser);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // APIから特定のユーザー情報を取得する（実際の実装時に使用）
  useEffect(() => {
    // 認証チェック
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // 実際の実装ではAPIエンドポイントからデータを取得
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        // setUser(data);
        
        // モックデータを使用
        setTimeout(() => {
          setUser(mockUser);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, isAuthenticated, router]);

  // いいねを送信する関数
  const handleSendLike = () => {
    setIsLiked(!isLiked);
    // 実際の実装ではAPIエンドポイントにいいねを送信
  };

  // メッセージを送信する関数
  const handleSendMessage = () => {
    router.push(`/messages/${user.id}`);
  };

  // ボタンアニメーション設定
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // 戻るボタン
  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <h1 className="text-xl font-medium text-center flex-grow">プロフィール</h1>
          <div className="w-8"></div> {/* 右側のスペース確保 */}
        </div>
      </div>

      {/* メインプロフィール画像 */}
      <div className="relative w-full h-[60vh] bg-gray-200">
        {user.images && user.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={user.images[0]} 
              alt={user.name}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">写真なし</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h2 className="text-2xl font-bold">{user.name} {user.age}歳 {user.location}</h2>
          <div className="mt-2 flex items-center">
            <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
              <span className="mr-1">パパッと会いたい</span>
            </div>
          </div>
        </div>
      </div>

      {/* いいね情報表示 */}
      <div className="bg-white p-3 flex items-center border-b">
        <div className="text-gray-600">24時間以内</div>
        <div className="flex items-center ml-4 text-pink-500">
          <FaHeart className="mr-1" /> {user.likes}
        </div>
      </div>

      {/* メッセージプレビュー */}
      {user.message && (
        <div className="bg-white p-3 mb-2 flex items-start">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-500 mr-2">
            💬
          </div>
          <div className="flex-1">
            <p className="text-gray-800">{user.message}</p>
            {user.boostMultiplier > 1 && (
              <div className="mt-1 inline-block bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full text-xs font-medium">
                x{user.boostMultiplier}
              </div>
            )}
          </div>
        </div>
      )}

      {/* タブナビゲーション */}
      <div className="bg-white mb-2">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-3 text-center relative ${
                activeTab === tab.id ? 'text-teal-500' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                  layoutId="activeTab"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' ? (
              <div className="p-4">
                {/* 自己紹介 */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">自己紹介</h3>
                  <p className="text-gray-700 whitespace-pre-line">{user.bio}</p>
                </div>

                {/* 容姿・外観 */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">容姿・外観</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">身長</span>
                      <span className="text-gray-800">{user.appearance.height}cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">体型</span>
                      <span className="text-gray-800">{user.appearance.bodyType}</span>
                    </div>
                    <div className="col-span-2 flex justify-between items-center">
                      <span className="text-gray-600">見た目のタイプ</span>
                      <span className="text-gray-800">{user.appearance.lookType}</span>
                    </div>
                  </div>
                </div>

                {/* 基本プロフィール */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">基本プロフィール</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">職業</span>
                      <span className="text-gray-800">{user.basicProfile.occupation}</span>
                    </div>
                  </div>
                </div>

                {/* 将来の夢 */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">将来の夢</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">{user.basicProfile.dream}</span>
                    {user.boostMultiplier > 1 && (
                      <div className="inline-block bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full text-xs font-medium">
                        x{user.boostMultiplier}
                      </div>
                    )}
                  </div>
                </div>

                {/* 会いやすいエリアや時間 */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">会いやすいエリアや時間</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">出会うまでの希望</span>
                    <span className="text-gray-800">{user.basicProfile.meetingArea}</span>
                  </div>
                </div>

                {/* 性格・プライベート */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">性格・プライベート</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">性格・タイプ</span>
                    <span className="text-gray-800">{user.basicProfile.personality}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* ピックアップ写真表示 */}
                <div className="grid grid-cols-3 gap-2">
                  {user.images && user.images.map((image, index) => (
                    <div key={index} className="aspect-square relative bg-gray-200 rounded-md overflow-hidden">
                      <Image
                        src={image}
                        alt={`${user.name}の写真 ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 下部アクションボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-3 flex justify-around">
        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-100 text-pink-500"
          onClick={handleSendLike}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
        </motion.button>
        
        <motion.button
          className="flex-1 mx-3 h-14 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold flex items-center justify-center"
          onClick={handleSendMessage}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaPaperPlane className="mr-2" /> メッセージを送る
        </motion.button>
      </div>
    </div>
  );
}
