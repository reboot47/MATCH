"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "@/app/components/LazyImage";
import BottomNavigation from "@/app/components/BottomNavigation";
import { HiOutlineSearch, HiOutlineBell, HiOutlineChat, HiOutlineHeart } from "react-icons/hi";

// ダミーユーザーデータ（後で実際のAPIに置き換え）
const dummyUsers = [
  {
    id: "1",
    name: "田中 美咲",
    age: 28,
    location: "東京",
    bio: "旅行と音楽が好きです。カフェ巡りも趣味のひとつです。",
    images: ["/images/dummy/user1.svg"],
    distance: 3,
    lastActive: "30分前",
  },
  {
    id: "2",
    name: "佐藤 健太",
    age: 32,
    location: "横浜",
    bio: "スポーツ観戦とアウトドア活動が大好きです。一緒に新しい場所を探検しませんか？",
    images: ["/images/dummy/user2.svg"],
    distance: 12,
    lastActive: "1時間前",
  },
  {
    id: "3",
    name: "小林 さくら",
    age: 26,
    location: "川崎",
    bio: "料理と写真撮影が趣味です。美味しいレストランがあれば教えてください！",
    images: ["/images/dummy/user3.svg"],
    distance: 8,
    lastActive: "3時間前",
  },
  {
    id: "4",
    name: "伊藤 大輔",
    age: 30,
    location: "千葉",
    bio: "エンジニアとして働いています。休日は映画鑑賞や読書を楽しんでいます。",
    images: ["/images/dummy/user4.svg"],
    distance: 15,
    lastActive: "本日",
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(dummyUsers);

  useEffect(() => {
    // ローディング状態をシミュレート
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      // いいね処理
      console.log(`${recommendation[activeIndex].name}にいいねしました`);
    } else {
      // スキップ処理
      console.log(`${recommendation[activeIndex].name}をスキップしました`);
    }

    // 次のユーザーに進む
    if (activeIndex < recommendation.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      // すべてのおすすめユーザーを見終わった場合
      setRecommendation([]);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-primary-300 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-primary-300">LINEBUZZ</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 ios-btn">
              <HiOutlineSearch className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 ios-btn relative">
              <HiOutlineBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary-300 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 p-4 overflow-y-auto">
        {recommendation.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg mx-auto"
            >
              <div className="relative aspect-[3/4] w-full">
                <LazyImage
                  src={recommendation[activeIndex].images[0]}
                  alt={recommendation[activeIndex].name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {recommendation[activeIndex].name}, {recommendation[activeIndex].age}
                  </h2>
                  <p className="text-sm opacity-90">{recommendation[activeIndex].location} • {recommendation[activeIndex].distance}km</p>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-700 mb-4">{recommendation[activeIndex].bio}</p>
                <div className="flex space-x-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">旅行</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">音楽</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">カフェ</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 p-4 border-t border-gray-200">
                <button 
                  onClick={() => handleSwipe("left")}
                  className="p-4 bg-gray-200 rounded-full text-gray-600 ios-btn"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleSwipe("right")}
                  className="p-4 bg-primary-300 rounded-full text-white ios-btn"
                >
                  <HiOutlineHeart className="w-8 h-8" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <HiOutlineSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">新しい推奨がありません</h2>
            <p className="text-gray-600 mb-6">また後で確認してください。または検索機能で新しい出会いを探しましょう。</p>
            <button className="py-2 px-4 bg-primary-300 text-white rounded-full shadow hover:bg-primary-400 transition ios-btn">
              検索する
            </button>
          </div>
        )}
      </div>

      {/* フッター（ボトムナビゲーション） */}
      <BottomNavigation />
    </main>
  );
}
