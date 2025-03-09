'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { FaFlag, FaClock, FaCalendarAlt } from 'react-icons/fa';
import MissionItem from '../components/missions/MissionItem';
import { useMission } from '../contexts/MissionContext';
import { motion } from 'framer-motion';

export default function MissionsPage() {
  const router = useRouter();
  const { points } = useMission();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-green-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/home')} 
              className="mr-3 text-gray-600"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-xl font-semibold">ミッション一覧</h1>
          </div>
        </div>
      </header>

      {/* ポイント情報 */}
      <div className="bg-white mx-auto max-w-screen-md rounded-b-3xl shadow-sm overflow-hidden mb-4">
        <div className="py-6 px-4 text-center">
          <h2 className="text-lg text-gray-600 mb-2">残ポイント</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-4xl font-bold">{points.regular}</span>
          </div>

          {/* 期間限定ポイント */}
          <div className="bg-green-50 rounded-lg py-2 px-4 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600 text-sm">
                <FaClock className="mr-1 text-teal-500" /> 
                <span>期間限定ポイント</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center mr-1">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-bold text-lg">{points.limited}</span>
              </div>
            </div>
          </div>

          {/* 有効期限付きポイント */}
          <div className="text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 text-gray-400" /> 
              <span>2025年09月04日失効予定</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center mr-1">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="font-bold">{points.expiring}</span>
            </div>
          </div>
        </div>
      </div>

      {/* タブ切り替え */}
      <div className="mx-auto max-w-screen-md mb-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center ${activeTab === 'daily' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('daily')}
          >
            デイリー
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === 'weekly' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('weekly')}
          >
            ウィークリー
          </button>
        </div>
      </div>

      {/* ミッションリスト */}
      <div className="max-w-screen-md mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'daily' && (
            <>
              <MissionItem 
                id="daily-1"
                type="easy"
                title="いいね❤️を15人に送信してみよう！"
                progress={7}
                target={15}
                reward={1}
                icon={<FaFlag className="text-teal-500" />}
              />
              
              <MissionItem 
                id="daily-2"
                type="normal"
                title="20人のプロフィールを訪れてみよう👣"
                progress={17}
                target={20}
                reward={2}
                icon={<FaFlag className="text-teal-500" />}
                note="※ 足あとを残すがOFFの場合・プライベートモードの場合は対象となりません"
              />
              
              <MissionItem 
                id="daily-3"
                type="premium"
                title="本日のピックアップを完了しよう！"
                progress={1}
                target={1}
                reward={3}
                icon={<FaFlag className="text-teal-500" />}
                description="ホームの「ピックアップ」ボタンからチェック"
                isCompleted={true}
              />
            </>
          )}

          {activeTab === 'weekly' && (
            <>
              <MissionItem 
                id="weekly-1"
                type="premium" 
                title="プロフィール写真を更新しよう"
                progress={0}
                target={1}
                reward={5}
                icon={<FaFlag className="text-teal-500" />}
              />
              
              <MissionItem 
                id="weekly-2"
                type="normal"
                title="メッセージを3人と交換しよう"
                progress={2}
                target={3}
                reward={10}
                icon={<FaFlag className="text-teal-500" />}
              />
              
              <MissionItem 
                id="weekly-3"
                type="easy"
                title="ライブ配信を30分視聴しよう"
                progress={15}
                target={30}
                reward={8}
                icon={<FaFlag className="text-teal-500" />}
                description="時間の累計でOK！"
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
