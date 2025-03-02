"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';

// モックデータ - イベント
const mockEvents = [
  {
    id: 1,
    title: '春の桜マッチングパーティー',
    description: '桜の季節に合わせた特別なマッチングイベント。アプリ内で参加ユーザー同士が特別な「桜」バッジを獲得できます。',
    type: 'シーズナル',
    startDate: '2025-03-25',
    endDate: '2025-04-10',
    status: 'upcoming',
    participantsCount: 0,
    targetGender: 'all',
    rewards: ['桜バッジ', '限定プロフィールフレーム', 'ボーナスポイント100pt'],
    requirements: ['プロフィール完成度80%以上', 'アクティブステータス'],
    notificationScheduled: true
  },
  {
    id: 2,
    title: 'ゴールデンマッチウィーク',
    description: 'GW期間中の特別イベント。毎日ログインすると特別なマッチング機会と報酬が得られます。',
    type: 'シーズナル',
    startDate: '2025-04-29',
    endDate: '2025-05-06',
    status: 'upcoming',
    participantsCount: 0,
    targetGender: 'all',
    rewards: ['毎日のボーナスポイント', '特別マッチングブースト', 'GWスペシャルバッジ'],
    requirements: ['イベント期間中に最低3回ログイン'],
    notificationScheduled: true
  },
  {
    id: 3,
    title: 'プレミアムマッチングナイト',
    description: '毎週金曜日夜の特別マッチングイベント。プレミアム会員限定で参加でき、マッチング率が大幅アップします。',
    type: '定期',
    startDate: '2025-03-07',
    endDate: '2025-03-07',
    recurringWeekly: true,
    recurringDay: '金',
    status: 'active',
    participantsCount: 1250,
    targetGender: 'all',
    rewards: ['マッチング率3倍', 'ボーナスポイント50pt'],
    requirements: ['プレミアム会員'],
    notificationScheduled: true
  },
  {
    id: 4,
    title: '女性限定！プロフィール写真アップデートキャンペーン',
    description: '女性ユーザー向けの特別キャンペーン。プロフィール写真を更新すると特典が得られます。',
    type: 'キャンペーン',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    status: 'active',
    participantsCount: 876,
    targetGender: 'female',
    rewards: ['プロフィール表示ブースト', 'ボーナスポイント200pt'],
    requirements: ['女性ユーザー', 'プロフィール写真更新'],
    notificationScheduled: true
  },
  {
    id: 5,
    title: '30代限定マッチングデー',
    description: '30代のユーザー同士が出会える特別な日。同年代限定のマッチング機会を提供します。',
    type: '年齢別',
    startDate: '2025-03-15',
    endDate: '2025-03-15',
    status: 'upcoming',
    participantsCount: 0,
    targetGender: 'all',
    ageRange: '30-39',
    rewards: ['同年代限定マッチング', '年齢特典バッジ'],
    requirements: ['30-39歳のユーザー'],
    notificationScheduled: false
  },
  {
    id: 6,
    title: 'バレンタインスペシャル',
    description: 'バレンタイン時期の特別イベント。ユーザー同士で仮想チョコレートを贈ることができました。',
    type: 'シーズナル',
    startDate: '2025-02-07',
    endDate: '2025-02-14',
    status: 'completed',
    participantsCount: 5432,
    targetGender: 'all',
    rewards: ['バレンタインバッジ', '特別ギフト機能'],
    requirements: ['プロフィール完成度50%以上'],
    notificationScheduled: true,
    results: {
      totalParticipants: 5432,
      totalGiftsSent: 12543,
      newMatches: 1876,
      conversionRate: 34.5
    }
  }
];

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // 検索とフィルター適用済みイベント
  const filteredEvents = mockEvents.filter(event => {
    // 検索語句によるフィルタリング
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // イベントタイプによるフィルタリング
    const matchesType = filterType === 'all' || event.type === filterType;
    
    // ステータスによるフィルタリング
    const matchesStatus = activeTab === 'all' || event.status === activeTab;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // ステータスバッジの色分け
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">予定</span>;
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">実施中</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">終了</span>;
      case 'canceled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">中止</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">イベント管理</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              新規イベント作成
            </button>
          </div>
          
          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-white p-4 rounded-lg shadow"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-1">実施中のイベント</h3>
              <p className="text-2xl font-bold text-blue-600">2</p>
            </motion.div>
            
            <motion.div
              className="bg-white p-4 rounded-lg shadow"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-1">予定されたイベント</h3>
              <p className="text-2xl font-bold text-green-600">3</p>
            </motion.div>
            
            <motion.div
              className="bg-white p-4 rounded-lg shadow"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-1">現在の参加者数</h3>
              <p className="text-2xl font-bold text-purple-600">2,126</p>
            </motion.div>
            
            <motion.div
              className="bg-white p-4 rounded-lg shadow"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-1">前回イベント参加率</h3>
              <p className="text-2xl font-bold text-indigo-600">34.5%</p>
            </motion.div>
          </div>
          
          {/* タブとフィルター */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <button 
                  className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('all')}
                >
                  すべて
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${activeTab === 'upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  予定
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${activeTab === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('active')}
                >
                  実施中
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  終了
                </button>
              </div>
              
              <div className="flex space-x-2">
                <select 
                  className="px-3 py-2 border rounded-md text-gray-700 text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">すべてのタイプ</option>
                  <option value="シーズナル">シーズナル</option>
                  <option value="定期">定期</option>
                  <option value="キャンペーン">キャンペーン</option>
                  <option value="年齢別">年齢別</option>
                </select>
                
                <input
                  type="text"
                  placeholder="イベント検索..."
                  className="px-3 py-2 border rounded-md text-gray-700 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* イベントリスト */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <motion.div 
                  key={event.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                          {getStatusBadge(event.status)}
                          {event.targetGender !== 'all' && (
                            <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
                              {event.targetGender === 'female' ? '女性限定' : '男性限定'}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                          編集
                        </button>
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                          詳細
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">タイプ</p>
                        <p className="text-sm font-medium">{event.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">期間</p>
                        <p className="text-sm font-medium">
                          {event.startDate} {event.startDate !== event.endDate ? `〜 ${event.endDate}` : ''}
                          {event.recurringWeekly && <span className="ml-1 text-xs text-green-600">（毎週{event.recurringDay}曜）</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">参加者数</p>
                        <p className="text-sm font-medium">{event.participantsCount.toLocaleString()}人</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">通知</p>
                        <p className={`text-sm font-medium ${event.notificationScheduled ? 'text-green-600' : 'text-red-600'}`}>
                          {event.notificationScheduled ? '予約済み' : '未設定'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">報酬</p>
                        <div className="flex flex-wrap gap-1">
                          {event.rewards.map((reward, index) => (
                            <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                              {reward}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">参加条件</p>
                        <div className="flex flex-wrap gap-1">
                          {event.requirements.map((req, index) => (
                            <span key={index} className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded text-xs">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* 終了したイベントの結果 */}
                    {event.status === 'completed' && event.results && (
                      <div className="mt-6 pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">イベント結果</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">総参加者数</p>
                            <p className="text-sm font-medium">{event.results.totalParticipants.toLocaleString()}人</p>
                          </div>
                          {event.results.totalGiftsSent && (
                            <div>
                              <p className="text-xs text-gray-500">総ギフト送信数</p>
                              <p className="text-sm font-medium">{event.results.totalGiftsSent.toLocaleString()}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500">新規マッチング数</p>
                            <p className="text-sm font-medium">{event.results.newMatches.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">コンバージョン率</p>
                            <p className="text-sm font-medium">{event.results.conversionRate}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">該当するイベントがありません</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EventsPage;
