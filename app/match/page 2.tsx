'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/components/UserContext';
import {
  Heart, MessageCircle, Zap, Search, Gift, Star, 
  ChevronRight, Bell, Calendar, ArrowRight, Users, Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { user, points, isGenderMale, isGenderFemale } = useUser();
  
  // モックデータ - 最近のマッチング
  const recentMatches = [
    {
      id: '1',
      name: '佐藤 美咲',
      age: 26,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      lastActive: '3分前',
      isOnline: true,
      isNew: true,
    },
    {
      id: '2',
      name: '高橋 愛',
      age: 28,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80',
      lastActive: '15分前',
      isOnline: true,
      isNew: false,
    },
    {
      id: '3',
      name: '田中 優子',
      age: 25,
      photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      lastActive: '1時間前',
      isOnline: false,
      isNew: false,
    },
  ];
  
  // モックデータ - 特別イベント
  const specialEvents = [
    {
      id: '1',
      title: '春の特別マッチングイベント',
      description: '春の訪れと共に、新しい出会いを探しませんか？特別なアルゴリズムで最適なマッチングをご提案します。',
      image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      date: '2025年3月20日',
      participants: 328,
    },
    {
      id: '2',
      title: 'カフェ好き限定マッチング',
      description: 'コーヒーやカフェ巡りが好きな方向けの特別イベント。共通の趣味から始まる素敵な出会いを。',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      date: '2025年3月15日',
      participants: 156,
    },
  ];

  return (
    <div className="pb-16">
      {/* ヘッダー */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">LINEBUZZ</h1>
          <div className="flex items-center gap-3">
            <Link href="/match/notifications">
              <Bell size={24} className="text-gray-600" />
            </Link>
            <Link href="/match/profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                <img 
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3'} 
                  alt={user?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-2 space-y-6">
        {/* 検索バー */}
        <div className="bg-white rounded-full shadow-sm flex items-center p-3 mt-2">
          <Search size={20} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="名前や趣味で検索..." 
            className="flex-1 outline-none text-sm"
          />
        </div>

        {/* ポイント情報 */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Zap size={24} className="text-primary mr-2" />
              <div>
                <div className="text-sm text-gray-600">利用可能ポイント</div>
                <div className="font-bold text-xl">{points?.balance || 0}</div>
              </div>
            </div>
            <Link 
              href={isGenderMale() ? "/match/points/buy" : "/match/points/earn"}
              className="bg-white text-primary text-sm font-medium px-3 py-1 rounded-full shadow-sm flex items-center"
            >
              {isGenderMale() ? "購入" : "獲得"}
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1 bg-white bg-opacity-70 rounded-lg p-3">
              <Heart size={18} className="text-pink-500 mb-1" />
              <div className="text-xs text-gray-600">いいね！</div>
              <div className="font-semibold">{isGenderMale() ? '5ポイント' : '無料'}</div>
            </div>
            <div className="flex-1 bg-white bg-opacity-70 rounded-lg p-3">
              <Star size={18} className="text-blue-500 mb-1" />
              <div className="text-xs text-gray-600">スーパーいいね！</div>
              <div className="font-semibold">50ポイント</div>
            </div>
            <div className="flex-1 bg-white bg-opacity-70 rounded-lg p-3">
              <Gift size={18} className="text-purple-500 mb-1" />
              <div className="text-xs text-gray-600">ギフト</div>
              <div className="font-semibold">30〜ポイント</div>
            </div>
          </div>
        </section>

        {/* 最近のマッチング */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">新しいマッチング</h2>
            <Link href="/match/discover" className="text-primary text-sm font-medium flex items-center">
              もっと見る
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="flex -mx-2 overflow-x-auto pb-2 scrollbar-hide">
            {recentMatches.map((match) => (
              <motion.div
                key={match.id}
                className="px-2 w-36 flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/match/chat/${match.id}`}>
                  <div className="relative rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="aspect-[3/4]">
                      <img 
                        src={match.photo} 
                        alt={match.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <div className="text-white font-medium text-sm truncate">
                        {match.name}, {match.age}
                      </div>
                      <div className="flex items-center">
                        <div 
                          className={`w-2 h-2 rounded-full mr-1 ${
                            match.isOnline ? 'bg-green-400' : 'bg-gray-400'
                          }`}
                        ></div>
                        <span className="text-white text-xs opacity-90">
                          {match.isOnline ? 'オンライン' : match.lastActive}
                        </span>
                      </div>
                    </div>
                    {match.isNew && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                        新着
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
            
            <div className="px-2 w-36 flex-shrink-0">
              <Link href="/match/discover">
                <div className="h-full rounded-lg overflow-hidden bg-gray-100 shadow-sm flex flex-col items-center justify-center p-4 text-center">
                  <Search size={24} className="text-primary mb-2" />
                  <div className="text-gray-600 text-sm">
                    新しい出会いを探す
                  </div>
                  <ArrowRight size={16} className="text-primary mt-2" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 特別イベント */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">特別イベント</h2>
            <Link href="/match/events" className="text-primary text-sm font-medium flex items-center">
              すべて見る
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {specialEvents.map((event) => (
              <Link href={`/match/events/${event.id}`} key={event.id}>
                <motion.div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-32">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold truncate">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-white text-xs mt-1">
                        <Calendar size={12} className="mr-1" />
                        <span>{event.date}</span>
                        <span className="mx-2">•</span>
                        <Users size={12} className="mr-1" />
                        <span>{event.participants}人参加</span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Sparkles size={12} className="mr-1" />
                      特別
                    </div>
                  </div>
                  <div className="p-3 text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* 会員ステータス */}
        {points?.subscription?.plan !== 'none' ? (
          <section>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <Star size={20} className="mr-2" />
                    <h3 className="font-bold">{points?.subscription?.plan}プラン</h3>
                  </div>
                  <p className="text-white/80 text-sm mt-1">
                    {points?.subscription?.expiresAt}まで有効
                  </p>
                </div>
                <Link 
                  href="/match/profile/subscription" 
                  className="bg-white/20 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
                >
                  詳細を見る
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 flex justify-between text-sm">
                <div>
                  <div className="text-white/80">毎月獲得</div>
                  <div className="font-semibold flex items-center">
                    <Zap size={14} className="mr-1" />
                    {points?.subscription?.plan === 'premium' ? '1500' : '600'} pts
                  </div>
                </div>
                <div>
                  <div className="text-white/80">次回更新日</div>
                  <div className="font-semibold">{points?.subscription?.expiresAt}</div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section>
            <Link href={isGenderMale() ? "/match/points/buy" : "/match/points/earn"}>
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start">
                  <div className="p-3 bg-primary/10 rounded-full mr-3">
                    <Star size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">プレミアム体験</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      プレミアム会員になって、すべての機能を利用しましょう。
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-primary mt-1" />
                </div>
              </div>
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
