"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// モックデータ - 報告・違反
const mockReports = [
  {
    id: 1,
    reporterId: 'user_123',
    reporterName: '田中響子',
    reportedId: 'user_456',
    reportedName: '佐藤健太',
    type: 'inappropriate_behavior',
    description: 'メッセージで不適切な誘いをしてきました。何度断っても執拗に誘ってきます。',
    status: 'pending',
    createdAt: '2025-03-02T15:30:00',
    updatedAt: '2025-03-02T15:30:00',
    severity: 'medium',
    evidenceUrls: ['message_12345.jpg']
  },
  {
    id: 2,
    reporterId: 'user_234',
    reporterName: '山田優子',
    reportedId: 'user_567',
    reportedName: '高橋雄太',
    type: 'fake_profile',
    description: 'プロフィール写真が明らかに別人のものです。芸能人の写真を使用しています。',
    status: 'investigating',
    createdAt: '2025-03-02T14:20:00',
    updatedAt: '2025-03-02T16:15:00',
    severity: 'medium',
    evidenceUrls: ['profile_evidence_234.jpg', 'chat_evidence_234.jpg']
  },
  {
    id: 3,
    reporterId: 'user_345',
    reporterName: '鈴木美咲',
    reportedId: 'user_678',
    reportedName: '伊藤大輔',
    type: 'harassment',
    description: '拒否した後も何度もメッセージを送り続けてきます。ストーカー行為のように感じます。',
    status: 'resolved',
    createdAt: '2025-03-01T10:45:00',
    updatedAt: '2025-03-02T13:20:00',
    resolution: 'warning',
    severity: 'high',
    evidenceUrls: ['chat_log_345.jpg', 'message_screenshot_345.jpg']
  },
  {
    id: 4,
    reporterId: 'user_456',
    reporterName: '中村美香',
    reportedId: 'user_789',
    reportedName: '木村拓也',
    type: 'inappropriate_content',
    description: '不適切な画像を送ってきました。',
    status: 'resolved',
    createdAt: '2025-03-01T09:30:00',
    updatedAt: '2025-03-02T11:40:00',
    resolution: 'banned',
    severity: 'critical',
    evidenceUrls: ['evidence_456.jpg']
  },
  {
    id: 5,
    reporterId: 'user_567',
    reporterName: '小林健太',
    reportedId: 'user_890',
    reportedName: '加藤さくら',
    type: 'scam',
    description: 'お金を要求してきました。外部サイトに誘導しようとしています。',
    status: 'investigating',
    createdAt: '2025-03-01T08:15:00',
    updatedAt: '2025-03-02T10:30:00',
    severity: 'high',
    evidenceUrls: ['chat_evidence_567.jpg', 'link_evidence_567.jpg']
  },
  {
    id: 6,
    reporterId: 'user_678',
    reporterName: '渡辺隆',
    reportedId: 'user_901',
    reportedName: '斎藤由美',
    type: 'underage',
    description: 'プロフィールには25歳となっていますが、会話の中で高校生だと言っていました。',
    status: 'pending',
    createdAt: '2025-03-01T16:40:00',
    updatedAt: '2025-03-01T16:40:00',
    severity: 'high',
    evidenceUrls: ['chat_screenshot_678.jpg']
  },
  {
    id: 7,
    reporterId: 'user_789',
    reporterName: '松本拓也',
    reportedId: 'user_012',
    reportedName: '井上智子',
    type: 'other',
    description: '複数のアカウントを使い分けているようです。同じ人物が別のアカウントから連絡してきました。',
    status: 'pending',
    createdAt: '2025-03-01T15:20:00',
    updatedAt: '2025-03-01T15:20:00',
    severity: 'low',
    evidenceUrls: ['profile_comparison_789.jpg']
  }
];

// 報告タイプの日本語表記
const reportTypeLabels = {
  inappropriate_behavior: '不適切な行動',
  fake_profile: '偽プロフィール',
  harassment: 'ハラスメント',
  inappropriate_content: '不適切なコンテンツ',
  scam: '詐欺行為',
  underage: '未成年',
  other: 'その他'
};

// 報告ステータスの日本語表記
const reportStatusLabels = {
  pending: '保留中',
  investigating: '調査中',
  resolved: '解決済み'
};

// 解決方法の日本語表記
const resolutionLabels = {
  warning: '警告',
  banned: 'アカウント停止',
  dismissed: '却下',
  monitoring: '監視継続'
};

// 重大度の日本語表記と色
const severityConfig = {
  low: { label: '低', color: 'bg-blue-100 text-blue-800' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: '高', color: 'bg-orange-100 text-orange-800' },
  critical: { label: '最高', color: 'bg-red-100 text-red-800' }
};

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // フィルタリングされた報告
  const filteredReports = mockReports.filter(report => {
    // 検索語句によるフィルタリング
    const matchesSearch = 
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // タブによるフィルタリング
    const matchesTab = 
      activeTab === 'all' || 
      report.status === activeTab;
    
    // 報告タイプによるフィルタリング
    const matchesType = filterType === 'all' || report.type === filterType;
    
    return matchesSearch && matchesTab && matchesType;
  });
  
  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // 報告タイプのリスト（重複なし）
  const reportTypes = ['all', ...new Set(mockReports.map(report => report.type))];
  
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">報告・違反管理</h1>
          
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 border rounded-md text-gray-700 text-sm"
              defaultValue="newest"
            >
              <option value="newest">最新順</option>
              <option value="oldest">古い順</option>
              <option value="severity">重大度順</option>
            </select>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
              レポート作成
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
                placeholder="ユーザー名や報告内容を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">報告タイプ</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">すべてのタイプ</option>
                {reportTypes.filter(type => type !== 'all').map((type) => (
                  <option key={type} value={type}>
                    {reportTypeLabels[type as keyof typeof reportTypeLabels] || type}
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
                className={`px-4 py-3 font-medium ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('pending')}
              >
                保留中
              </button>
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'investigating' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('investigating')}
              >
                調査中
              </button>
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'resolved' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('resolved')}
              >
                解決済み
              </button>
            </div>
          </div>
          
          {/* 報告リスト */}
          <div className="p-6">
            {filteredReports.length > 0 ? (
              <div className="space-y-6">
                {filteredReports.map((report) => (
                  <motion.div
                    key={report.id}
                    className="border rounded-lg overflow-hidden bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {reportTypeLabels[report.type as keyof typeof reportTypeLabels]}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {reportStatusLabels[report.status as keyof typeof reportStatusLabels]}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${severityConfig[report.severity as keyof typeof severityConfig].color}`}>
                              重大度: {severityConfig[report.severity as keyof typeof severityConfig].label}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-800">報告者:</span>
                              <span className="ml-2 text-gray-700">{report.reporterName}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="font-medium text-gray-800">報告対象:</span>
                              <span className="ml-2 text-gray-700">{report.reportedName}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded border mb-3">
                            <p className="text-gray-700">{report.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {report.evidenceUrls.map((url, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                証拠 #{index + 1}: {url}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span>報告日時: {formatDate(report.createdAt)}</span>
                            <span>最終更新: {formatDate(report.updatedAt)}</span>
                            {report.resolution && (
                              <span className="font-medium">
                                解決方法: {resolutionLabels[report.resolution as keyof typeof resolutionLabels]}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                            詳細を見る
                          </button>
                          {report.status !== 'resolved' && (
                            <>
                              <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm transition-colors duration-200">
                                調査中に変更
                              </button>
                              <button className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded text-sm transition-colors duration-200">
                                解決済みに変更
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {report.status !== 'resolved' && (
                        <div className="mt-4 flex flex-wrap justify-end gap-2">
                          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm transition-colors duration-200">
                            アカウント停止
                          </button>
                          <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm transition-colors duration-200">
                            警告を送信
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200">
                            報告者に連絡
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200">
                            対象者に連絡
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">該当する報告はありません</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;