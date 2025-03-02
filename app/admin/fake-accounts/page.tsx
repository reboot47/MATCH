"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// モックデータ - サクラアカウント
const mockFakeAccounts = [
  {
    id: 1,
    name: '鈴木さくら',
    nickname: 'Sakura',
    age: 24,
    gender: 'female',
    location: '東京都',
    status: 'active',
    type: 'premium',
    createdAt: '2024-12-15',
    lastActive: '2025-03-01',
    messagesSent: 345,
    matchesCount: 78,
    conversionRate: 23.5,
    schedule: 'daily',
    imageUrl: '/images/fake1.jpg',
  },
  {
    id: 2,
    name: '佐藤ゆい',
    nickname: 'Yui',
    age: 26,
    gender: 'female',
    location: '大阪府',
    status: 'inactive',
    type: 'standard',
    createdAt: '2024-11-20',
    lastActive: '2025-02-25',
    messagesSent: 245,
    matchesCount: 52,
    conversionRate: 18.2,
    schedule: 'weekends',
    imageUrl: '/images/fake2.jpg',
  },
  {
    id: 3,
    name: '高橋みお',
    nickname: 'Mio',
    age: 22,
    gender: 'female',
    location: '福岡県',
    status: 'active',
    type: 'VIP',
    createdAt: '2025-01-10',
    lastActive: '2025-03-02',
    messagesSent: 412,
    matchesCount: 95,
    conversionRate: 28.7,
    schedule: 'daily',
    imageUrl: '/images/fake3.jpg',
  },
];

export default function FakeAccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // フィルターされたアカウントリスト
  const filteredAccounts = mockFakeAccounts.filter(account => {
    // 検索クエリによるフィルタリング
    const matchesSearch = 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    
    // ステータスによるフィルタリング
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && account.status === 'active') ||
      (filter === 'inactive' && account.status === 'inactive');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">サクラアカウント管理</h1>
        <p className="text-gray-500 mt-1">システム運用のためのサクラアカウントを管理します</p>
      </div>

      {/* 上部コントロールセクション */}
      <motion.div
        className="mb-6 bg-white p-4 rounded-lg shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              新規アカウント作成
            </button>
            <select
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">全てのアカウント</option>
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
            </select>
          </div>
          
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="名前またはニックネームで検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* アカウントリスト */}
      <motion.div
        className="bg-white shadow overflow-hidden sm:rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ul className="divide-y divide-gray-200">
          {filteredAccounts.map((account) => (
            <li key={account.id}>
              <div className="px-6 py-4 flex items-center">
                <div className="flex-shrink-0 h-12 w-12 relative rounded-full bg-gray-200 overflow-hidden">
                  {/* 実際の実装ではここに画像が入ります */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
                    {account.nickname.charAt(0)}
                  </div>
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-primary-600">{account.name}</h3>
                      <p className="text-sm text-gray-500">
                        @{account.nickname} • {account.age}歳 • {account.location}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        account.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.status === 'active' ? 'アクティブ' : '非アクティブ'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {account.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between">
                    <div className="flex space-x-6 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">{account.messagesSent}</span> メッセージ
                      </div>
                      <div>
                        <span className="font-medium">{account.matchesCount}</span> マッチ
                      </div>
                      <div>
                        <span className="font-medium">{account.conversionRate}%</span> 変換率
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">重要な注意事項</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">サクラアカウントの運用について</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  1. サクラアカウントは法的・倫理的観点から慎重に運用する必要があります。<br />
                  2. ユーザーを不当に誘導する内容のメッセージは避けてください。<br />
                  3. 金銭的取引を促す内容は厳禁です。<br />
                  4. 全てのアクティビティはログに記録され、監査の対象となります。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
