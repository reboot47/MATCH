"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// モックデータ - 要モデレーションコンテンツ
const mockContents = [
  {
    id: 1,
    type: 'プロフィール写真',
    userId: 'user_12345',
    username: '山田太郎',
    content: 'https://example.com/profile_pic_1.jpg',
    reportCount: 3,
    reportReason: '不適切なコンテンツ',
    uploadedAt: '2025-03-01',
    status: 'pending'
  },
  {
    id: 2,
    type: 'プロフィール説明',
    userId: 'user_23456',
    username: '鈴木花子',
    content: 'お金目的でのやり取りを希望します。連絡先交換できる方のみ。',
    reportCount: 5,
    reportReason: '規約違反',
    uploadedAt: '2025-03-02',
    status: 'pending'
  },
  {
    id: 3,
    type: 'メッセージ',
    userId: 'user_34567',
    username: '佐藤健',
    content: 'LINEに移動しませんか？私のIDは...',
    reportCount: 2,
    reportReason: '外部連絡先の交換',
    uploadedAt: '2025-03-02',
    status: 'pending'
  },
  {
    id: 4,
    type: 'プロフィール写真',
    userId: 'user_45678',
    username: '田中美咲',
    content: 'https://example.com/profile_pic_2.jpg',
    reportCount: 1,
    reportReason: '不適切なコンテンツ',
    uploadedAt: '2025-03-01',
    status: 'pending'
  },
  {
    id: 5,
    type: 'プロフィール説明',
    userId: 'user_56789',
    username: '伊藤大輔',
    content: 'ただいま東京に出張中。ホテルで会える人を探しています。',
    reportCount: 4,
    reportReason: '不適切な出会い',
    uploadedAt: '2025-03-02',
    status: 'pending'
  },
];

// モデレーションポリシー
const moderationPolicies = [
  {
    id: 1,
    category: 'プロフィール写真',
    rules: [
      '本人確認可能な顔写真が必要',
      '露出度の高い写真は禁止',
      '暴力的・攻撃的な表現を含む写真は禁止',
      '他者の写真の無断使用は禁止',
    ]
  },
  {
    id: 2,
    category: 'プロフィール説明',
    rules: [
      '個人情報（電話番号、LINEなど）の記載は禁止',
      '金銭のやり取りを目的とする内容は禁止',
      '性的な表現・暗示は禁止',
      '差別的・攻撃的な表現は禁止',
    ]
  },
  {
    id: 3,
    category: 'メッセージ',
    rules: [
      '外部連絡先の交換は禁止',
      '金銭のやり取りの提案は禁止',
      '嫌がらせ・脅迫的なメッセージは禁止',
      '不適切な出会いの提案は禁止',
    ]
  },
];

// 報告理由の統計データ（モック）
const reportReasonStats = [
  { reason: '不適切なコンテンツ', count: 187 },
  { reason: '規約違反', count: 145 },
  { reason: '外部連絡先の交換', count: 98 },
  { reason: '不適切な出会い', count: 76 },
  { reason: 'なりすまし', count: 42 },
  { reason: 'スパム', count: 38 },
  { reason: 'その他', count: 23 },
];

const ModerationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [activePolicyTab, setActivePolicyTab] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // 検索とフィルター適用済みコンテンツ
  const filteredContents = mockContents.filter(content => {
    // 検索語句によるフィルタリング
    const matchesSearch = 
      content.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.reportReason.toLowerCase().includes(searchTerm.toLowerCase());
    
    // コンテンツタイプによるフィルタリング
    const matchesType = filterType === 'all' || content.type === filterType;
    
    // ステータスによるフィルタリング
    const matchesStatus = activeTab === 'all' || content.status === activeTab;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // モデレーション決定処理（モック）
  const handleModeration = (id: number, decision: 'approve' | 'reject') => {
    // 実際のAPIリクエストがここに入る
    console.log(`コンテンツID ${id} を ${decision === 'approve' ? '承認' : '拒否'} しました`);
    // ここではモック表示のためにalertを使用
    alert(`コンテンツID ${id} を ${decision === 'approve' ? '承認' : '拒否'} しました`);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6">コンテンツモデレーション</h1>
        
        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-700 mb-2">未処理コンテンツ</h3>
            <p className="text-3xl font-bold text-blue-600">32</p>
            <p className="text-sm text-gray-500 mt-1">前日比 +5</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-700 mb-2">今日の処理数</h3>
            <p className="text-3xl font-bold text-green-600">24</p>
            <p className="text-sm text-gray-500 mt-1">前日比 +8</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-700 mb-2">拒否率</h3>
            <p className="text-3xl font-bold text-red-600">18.5%</p>
            <p className="text-sm text-gray-500 mt-1">前日比 -2.3%</p>
          </motion.div>
        </div>
        
        {/* タブとフィルター */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('pending')}
              >
                未処理
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('approved')}
              >
                承認済み
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'rejected' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('rejected')}
              >
                拒否済み
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('all')}
              >
                すべて
              </button>
            </div>
            
            <div className="flex space-x-2">
              <select 
                className="px-3 py-2 border rounded-md text-gray-700 text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">すべてのタイプ</option>
                <option value="プロフィール写真">プロフィール写真</option>
                <option value="プロフィール説明">プロフィール説明</option>
                <option value="メッセージ">メッセージ</option>
              </select>
              
              <input
                type="text"
                placeholder="検索..."
                className="px-3 py-2 border rounded-md text-gray-700 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* コンテンツリスト */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイプ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コンテンツ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">報告</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アップロード日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map((content) => (
                  <tr key={content.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{content.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{content.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{content.username}</div>
                      <div className="text-sm text-gray-500">{content.userId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {content.type.includes('写真') ? (
                        <a href={content.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          画像を表示
                        </a>
                      ) : (
                        content.content
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {content.reportCount}件
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{content.reportReason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{content.uploadedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleModeration(content.id, 'approve')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        承認
                      </button>
                      <button 
                        onClick={() => handleModeration(content.id, 'reject')}
                        className="text-red-600 hover:text-red-900"
                      >
                        拒否
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredContents.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              該当するコンテンツがありません
            </div>
          )}
        </div>
        
        {/* モデレーションポリシーと統計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* モデレーションポリシー */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-4">モデレーションポリシー</h2>
            
            <div className="mb-4">
              <div className="flex border-b">
                {moderationPolicies.map(policy => (
                  <button
                    key={policy.id}
                    className={`px-4 py-2 ${activePolicyTab === policy.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActivePolicyTab(policy.id)}
                  >
                    {policy.category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">
                {moderationPolicies.find(p => p.id === activePolicyTab)?.category}のモデレーションルール
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {moderationPolicies.find(p => p.id === activePolicyTab)?.rules.map((rule, index) => (
                  <li key={index} className="text-sm text-gray-600">{rule}</li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* 報告統計 */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-4">報告理由の統計</h2>
            
            <div className="space-y-4">
              {reportReasonStats.map((stat, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1/3 text-sm text-gray-600">{stat.reason}</div>
                  <div className="w-2/3">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {stat.count}件
                          </span>
                        </div>
                      </div>
                      <div className="flex h-2 overflow-hidden text-xs bg-blue-100 rounded">
                        <div
                          style={{ width: `${(stat.count / Math.max(...reportReasonStats.map(s => s.count))) * 100}%` }}
                          className="flex flex-col justify-center text-center text-white bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModerationPage;
