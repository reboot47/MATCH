"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// モックデータ - マーケティングキャンペーン
const mockCampaigns = [
  {
    id: 1,
    name: '春の新規ユーザーキャンペーン',
    type: '新規ユーザー獲得',
    target: '20-35歳 未婚男女',
    startDate: '2025-03-15',
    endDate: '2025-04-15',
    budget: 500000,
    status: 'planned',
    description: '春の出会いシーズンに向けて、新規ユーザー登録時に300ポイントプレゼント。',
    kpi: {
      targetRegistrations: 5000,
      currentRegistrations: 0,
      targetConversion: 20,
      currentConversion: 0
    }
  },
  {
    id: 2,
    name: 'ゴールデンウィーク特別イベント',
    type: 'ユーザーエンゲージメント',
    target: '既存ユーザー全員',
    startDate: '2025-04-29',
    endDate: '2025-05-05',
    budget: 800000,
    status: 'planned',
    description: 'GW期間中、特別マッチングイベントを開催。毎日ログインでポイント獲得。',
    kpi: {
      targetParticipation: 10000,
      currentParticipation: 0,
      targetMatches: 3000,
      currentMatches: 0
    }
  },
  {
    id: 3,
    name: '休眠ユーザー復帰プログラム',
    type: 'ユーザー再アクティブ化',
    target: '3ヶ月以上未ログインのユーザー',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    budget: 300000,
    status: 'active',
    description: '休眠ユーザーに向けた特別オファー。復帰時に500ポイント付与。',
    kpi: {
      targetReactivation: 2000,
      currentReactivation: 850,
      targetRetention: 40,
      currentRetention: 32
    }
  },
  {
    id: 4,
    name: 'プレミアム会員アップグレードキャンペーン',
    type: '収益向上',
    target: '3ヶ月以上アクティブの無料会員',
    startDate: '2025-02-15',
    endDate: '2025-03-15',
    budget: 400000,
    status: 'active',
    description: 'プレミアム会員初月50%オフキャンペーン。',
    kpi: {
      targetUpgrades: 1200,
      currentUpgrades: 980,
      targetRevenue: 2000000,
      currentRevenue: 1670000
    }
  },
  {
    id: 5,
    name: '地域限定マッチングキャンペーン（関西）',
    type: '地域活性化',
    target: '関西地方のユーザー',
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    budget: 250000,
    status: 'planned',
    description: '関西地方のユーザー向け特別マッチングイベント。地元で出会いを促進。',
    kpi: {
      targetParticipation: 3000,
      currentParticipation: 0,
      targetMatches: 1000,
      currentMatches: 0
    }
  }
];

const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // 検索とフィルター適用済みキャンペーン
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    // 検索語句によるフィルタリング
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // キャンペーンタイプによるフィルタリング
    const matchesType = filterType === 'all' || campaign.type === filterType;
    
    // ステータスによるフィルタリング
    const matchesStatus = activeTab === 'all' || campaign.status === activeTab;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // ステータスバッジの色分け
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">予定</span>;
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">実行中</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">完了</span>;
      case 'canceled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">中止</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">マーケティングキャンペーン管理</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            新規キャンペーン作成
          </button>
        </div>
        
        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-1">実行中のキャンペーン</h3>
            <p className="text-2xl font-bold text-blue-600">2</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-1">今月の予算使用率</h3>
            <p className="text-2xl font-bold text-green-600">68%</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-1">新規ユーザー獲得</h3>
            <p className="text-2xl font-bold text-purple-600">1,254</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-1">ROI</h3>
            <p className="text-2xl font-bold text-indigo-600">245%</p>
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
                className={`px-4 py-2 rounded-md ${activeTab === 'planned' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('planned')}
              >
                予定
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('active')}
              >
                実行中
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('completed')}
              >
                完了
              </button>
            </div>
            
            <div className="flex space-x-2">
              <select 
                className="px-3 py-2 border rounded-md text-gray-700 text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">すべてのタイプ</option>
                <option value="新規ユーザー獲得">新規ユーザー獲得</option>
                <option value="ユーザーエンゲージメント">ユーザーエンゲージメント</option>
                <option value="ユーザー再アクティブ化">ユーザー再アクティブ化</option>
                <option value="収益向上">収益向上</option>
                <option value="地域活性化">地域活性化</option>
              </select>
              
              <input
                type="text"
                placeholder="キャンペーン検索..."
                className="px-3 py-2 border rounded-md text-gray-700 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* キャンペーンリスト */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map(campaign => (
              <motion.div 
                key={campaign.id}
                className="bg-white rounded-lg shadow overflow-hidden"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h2 className="text-xl font-bold text-gray-800">{campaign.name}</h2>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-gray-600 mb-4">{campaign.description}</p>
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
                      <p className="text-sm font-medium">{campaign.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ターゲット</p>
                      <p className="text-sm font-medium">{campaign.target}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">期間</p>
                      <p className="text-sm font-medium">{campaign.startDate} 〜 {campaign.endDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">予算</p>
                      <p className="text-sm font-medium">¥{campaign.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* KPI表示（アクティブなキャンペーンのみ） */}
                  {campaign.status === 'active' && (
                    <div className="mt-6 pt-4 border-t">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">KPI進捗状況</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {'targetReactivation' in campaign.kpi ? (
                          <>
                            <div>
                              <p className="text-xs text-gray-500">再アクティブ化</p>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">{campaign.kpi.currentReactivation}</p>
                                <p className="text-xs text-gray-500">目標: {campaign.kpi.targetReactivation}</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(campaign.kpi.currentReactivation / campaign.kpi.targetReactivation) * 100}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">継続率</p>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">{campaign.kpi.currentRetention}%</p>
                                <p className="text-xs text-gray-500">目標: {campaign.kpi.targetRetention}%</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(campaign.kpi.currentRetention / campaign.kpi.targetRetention) * 100}%` }}></div>
                              </div>
                            </div>
                          </>
                        ) : 'targetUpgrades' in campaign.kpi ? (
                          <>
                            <div>
                              <p className="text-xs text-gray-500">アップグレード数</p>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">{campaign.kpi.currentUpgrades}</p>
                                <p className="text-xs text-gray-500">目標: {campaign.kpi.targetUpgrades}</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(campaign.kpi.currentUpgrades / campaign.kpi.targetUpgrades) * 100}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">収益</p>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">¥{(campaign.kpi.currentRevenue / 10000).toFixed(1)}万</p>
                                <p className="text-xs text-gray-500">目標: ¥{(campaign.kpi.targetRevenue / 10000).toFixed(1)}万</p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${(campaign.kpi.currentRevenue / campaign.kpi.targetRevenue) * 100}%` }}></div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">該当するキャンペーンがありません</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MarketingPage;
