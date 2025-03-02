"use client";

import React, { useState } from 'react';
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
    title: 'プレミアムナイト',
    description: 'プレミアム会員限定の特別マッチングイベント。参加者全員にプレミアム機能の無料体験権を配布。',
    type: 'VIP',
    startDate: '2025-03-15',
    endDate: '2025-03-15',
    status: 'active',
    participantsCount: 156,
    targetGender: 'all',
    rewards: ['プレミアム機能7日間無料', 'VIPバッジ'],
    requirements: ['プレミアム会員', 'プロフィール完成度100%'],
    notificationScheduled: true
  },
  {
    id: 3,
    title: 'スポーツ好きマッチング',
    description: 'スポーツが趣味・関心事のユーザー向け特別マッチングイベント。',
    type: '趣味',
    startDate: '2025-03-10',
    endDate: '2025-03-20',
    status: 'active',
    participantsCount: 432,
    targetGender: 'all',
    rewards: ['スポーツバッジ', 'ボーナスポイント50pt'],
    requirements: ['趣味にスポーツ関連が含まれる'],
    notificationScheduled: true
  },
  {
    id: 4,
    title: 'バレンタインスペシャル',
    description: 'バレンタインデーに合わせた特別イベント。期間中のマッチング確率が上昇。',
    type: 'シーズナル',
    startDate: '2025-02-07',
    endDate: '2025-02-14',
    status: 'completed',
    participantsCount: 3456,
    targetGender: 'all',
    rewards: ['チョコレートバッジ', '限定メッセージテンプレート'],
    requirements: ['なし'],
    notificationScheduled: true
  },
  {
    id: 5,
    title: '地域限定：東京ナイト',
    description: '東京都在住のユーザー向け特別マッチングイベント。',
    type: '地域',
    startDate: '2025-03-30',
    endDate: '2025-03-30',
    status: 'upcoming',
    participantsCount: 0,
    targetGender: 'all',
    rewards: ['東京バッジ', 'ローカルマッチングブースト'],
    requirements: ['東京都在住'],
    notificationScheduled: false
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
  
  // イベントタイプの重複なしリスト
  const eventTypes = ['all', ...new Set(mockEvents.map(event => event.type))];
  
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">イベント管理</h1>
          
          <div className="flex space-x-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
              新規イベント作成
            </button>
          </div>
        </div>
        
        {/* 検索とフィルター */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">キーワード検索</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="イベント名や説明を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">イベントタイプ</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {eventTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type === 'all' ? 'すべてのタイプ' : type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
              >
                フィルターをリセット
              </button>
            </div>
          </div>
        </div>
        
        {/* タブ */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('all')}
              >
                すべて
              </button>
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('active')}
              >
                開催中
              </button>
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                今後のイベント
              </button>
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('completed')}
              >
                終了済み
              </button>
            </div>
          </div>
          
          {/* イベントリスト */}
          <div className="p-6">
            {filteredEvents.length > 0 ? (
              <div className="space-y-6">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="border rounded-lg overflow-hidden bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              event.status === 'active' ? 'bg-green-100 text-green-800' :
                              event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status === 'active' ? '開催中' :
                               event.status === 'upcoming' ? '予定' :
                               '終了'}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                              {event.type}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">編集</button>
                          <button className="text-red-600 hover:text-red-800">削除</button>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <span className="block text-xs font-medium text-gray-500">期間</span>
                          <span className="block text-sm">{event.startDate} 〜 {event.endDate}</span>
                        </div>
                        
                        <div>
                          <span className="block text-xs font-medium text-gray-500">対象性別</span>
                          <span className="block text-sm">
                            {event.targetGender === 'all' ? 'すべて' :
                             event.targetGender === 'male' ? '男性のみ' :
                             '女性のみ'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="block text-xs font-medium text-gray-500">参加者数</span>
                          <span className="block text-sm">{event.participantsCount.toLocaleString()} 人</span>
                        </div>
                        
                        <div>
                          <span className="block text-xs font-medium text-gray-500">通知設定</span>
                          <span className="block text-sm">{event.notificationScheduled ? '予約済み' : '未設定'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {event.rewards.map((reward, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            {reward}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">該当するイベントがありません</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventsPage;
