"use client";

import React from 'react';
import { motion } from 'framer-motion';

// モックデータ - ユーザー
const mockUsers = [
  {
    id: 1,
    name: '山田太郎',
    nickname: 'Taro',
    email: 'taro@example.com',
    gender: 'male',
    age: 28,
    location: '東京都',
    status: 'active',
    verified: true,
    createdAt: '2024-01-15',
    lastLogin: '2025-03-01',
    points: 2500,
    subscription: 'プレミアム',
    reportCount: 0,
  },
  {
    id: 2,
    name: '佐藤花子',
    nickname: 'Hanako',
    email: 'hanako@example.com',
    gender: 'female',
    age: 25,
    location: '大阪府',
    status: 'active',
    verified: true,
    createdAt: '2024-01-20',
    lastLogin: '2025-03-02',
    points: 1800,
    subscription: 'なし',
    reportCount: 0,
  },
  {
    id: 3,
    name: '鈴木一郎',
    nickname: 'Ichiro',
    email: 'ichiro@example.com',
    gender: 'male',
    age: 32,
    location: '福岡県',
    status: 'active',
    verified: true,
    createdAt: '2024-02-05',
    lastLogin: '2025-02-28',
    points: 5000,
    subscription: 'VIP',
    reportCount: 0,
  },
  {
    id: 4,
    name: '高橋めぐみ',
    nickname: 'Megumi',
    email: 'megumi@example.com',
    gender: 'female',
    age: 23,
    location: '北海道',
    status: 'active',
    verified: true,
    createdAt: '2024-02-10',
    lastLogin: '2025-03-01',
    points: 1200,
    subscription: 'なし',
    reportCount: 0,
  },
  {
    id: 5,
    name: '伊藤健太',
    nickname: 'Kenta',
    email: 'kenta@example.com',
    gender: 'male',
    age: 30,
    location: '愛知県',
    status: 'inactive',
    verified: false,
    createdAt: '2024-02-15',
    lastLogin: '2025-02-20',
    points: 500,
    subscription: 'ベーシック',
    reportCount: 2,
  },
  {
    id: 6,
    name: '渡辺さくら',
    nickname: 'Sakura',
    email: 'sakura@example.com',
    gender: 'female',
    age: 27,
    location: '京都府',
    status: 'suspended',
    verified: true,
    createdAt: '2024-01-25',
    lastLogin: '2025-02-15',
    points: 800,
    subscription: 'なし',
    reportCount: 5,
  },
  {
    id: 7,
    name: '中村大輔',
    nickname: 'Daisuke',
    email: 'daisuke@example.com',
    gender: 'male',
    age: 35,
    location: '兵庫県',
    status: 'active',
    verified: true,
    createdAt: '2024-01-10',
    lastLogin: '2025-03-02',
    points: 3500,
    subscription: 'プレミアム',
    reportCount: 0,
  },
  {
    id: 8,
    name: '小林あおい',
    nickname: 'Aoi',
    email: 'aoi@example.com',
    gender: 'female',
    age: 26,
    location: '広島県',
    status: 'active',
    verified: true,
    createdAt: '2024-02-01',
    lastLogin: '2025-03-01',
    points: 2200,
    subscription: 'ベーシック',
    reportCount: 0,
  },
];

// ステータスバッジコンポーネント
const StatusBadge = ({ status }: { status: string }) => {
  let badgeClass = '';
  
  switch (status) {
    case 'active':
      badgeClass = 'bg-green-100 text-green-800';
      break;
    case 'inactive':
      badgeClass = 'bg-gray-100 text-gray-800';
      break;
    case 'suspended':
      badgeClass = 'bg-red-100 text-red-800';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
      {status === 'active' ? '有効' : status === 'inactive' ? '無効' : '停止中'}
    </span>
  );
};

export default function UsersAdminPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [sort, setSort] = React.useState('newest');
  
  // フィルターされたユーザーリスト
  const filteredUsers = mockUsers.filter(user => {
    // 検索クエリによるフィルタリング
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    
    // ステータスによるフィルタリング
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && user.status === 'active') ||
      (filter === 'inactive' && user.status === 'inactive') ||
      (filter === 'suspended' && user.status === 'suspended') ||
      (filter === 'male' && user.gender === 'male') ||
      (filter === 'female' && user.gender === 'female') ||
      (filter === 'verified' && user.verified) ||
      (filter === 'reported' && user.reportCount > 0);
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // ソート
    switch (sort) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'lastActive':
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      case 'mostPoints':
        return b.points - a.points;
      case 'mostReported':
        return b.reportCount - a.reportCount;
      default:
        return 0;
    }
  });

  return (
    <div className="p-4 md:p-6 pt-16 lg:pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">ユーザー管理</h1>
            <p className="text-gray-500 mt-1">ユーザー情報の確認と管理を行います</p>
          </div>

          {/* フィルターと検索 */}
          <motion.div
            className="mb-6 bg-white p-4 rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">全てのユーザー</option>
                    <option value="active">有効なユーザー</option>
                    <option value="inactive">無効なユーザー</option>
                    <option value="suspended">停止中のユーザー</option>
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="verified">認証済みユーザー</option>
                    <option value="reported">通報されたユーザー</option>
                  </select>
                </div>
                
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">登録日（新しい順）</option>
                    <option value="oldest">登録日（古い順）</option>
                    <option value="lastActive">最終ログイン日</option>
                    <option value="mostPoints">ポイント（多い順）</option>
                    <option value="mostReported">通報数（多い順）</option>
                  </select>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="名前、メールアドレス、ニックネームで検索"
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

          {/* ユーザーリスト */}
          <motion.div
            className="bg-white shadow overflow-hidden sm:rounded-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <div className="px-6 py-4 flex items-center">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                          {user.nickname.charAt(0)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">{user.name}</p>
                            <p className="ml-2 text-sm text-gray-500">@{user.nickname}</p>
                            {user.verified && (
                              <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                                認証済み
                              </span>
                            )}
                            {user.subscription !== 'なし' && (
                              <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-purple-800 text-xs font-medium bg-purple-100 rounded-full">
                                {user.subscription}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <p>
                              {user.email} • {user.age}歳 • {user.location} • {user.points}ポイント
                            </p>
                          </div>
                          <div className="mt-2 flex items-center">
                            <StatusBadge status={user.status} />
                            {user.reportCount > 0 && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                通報 {user.reportCount}件
                              </span>
                            )}
                            <span className="ml-2 text-xs text-gray-500">
                              登録: {user.createdAt} • 最終ログイン: {user.lastLogin}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      {user.status !== 'suspended' ? (
                        <button
                          type="button"
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ページネーション */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                全 <span className="font-medium">{mockUsers.length}</span> 件中 
                <span className="font-medium"> {filteredUsers.length}</span> 件表示
              </p>
              <div className="flex space-x-2">
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  前へ
                </button>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
