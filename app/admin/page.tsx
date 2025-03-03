"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ダッシュボードカードコンポーネント
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  linkTo?: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  linkTo,
  color
}) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${linkTo ? 'cursor-pointer' : ''}`}
    >
      {linkTo ? (
        <Link href={linkTo}>
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
                {change && (
                  <p className={`text-xs font-medium mt-2 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {change.isPositive ? '+' : ''}{change.value}% {change.isPositive ? '増加' : '減少'}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${color}`}>
                {icon}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              {change && (
                <p className={`text-xs font-medium mt-2 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {change.isPositive ? '+' : ''}{change.value}% {change.isPositive ? '増加' : '減少'}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              {icon}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// 最近の活動コンポーネント
interface ActivityItemProps {
  type: 'report' | 'moderation' | 'user';
  title: string;
  time: string;
  description: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, title, time, description }) => {
  let icon;
  let bgColor;
  
  switch (type) {
    case 'report':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      bgColor = 'bg-red-100';
      break;
    case 'moderation':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
      bgColor = 'bg-blue-100';
      break;
    case 'user':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
      bgColor = 'bg-green-100';
      break;
    default:
      icon = null;
      bgColor = 'bg-gray-100';
  }
  
  return (
    <div className="flex items-start py-3">
      <div className={`${bgColor} p-2 rounded-full flex-shrink-0 mr-4`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
    </div>
  );
};

// 管理画面ダッシュボード
const AdminDashboard: React.FC = () => {
  // モックデータ
  const stats = [
    {
      title: '月間アクティブユーザー',
      value: '1,234',
      change: { value: 5.3, isPositive: true },
      color: 'bg-blue-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      linkTo: '/admin/analytics/users'
    },
    {
      title: '新規登録（今週）',
      value: '89',
      change: { value: 12.7, isPositive: true },
      color: 'bg-green-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      linkTo: '/admin/users'
    },
    {
      title: '未処理の報告',
      value: '23',
      color: 'bg-red-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      linkTo: '/admin/reports'
    },
    {
      title: '今月の売上',
      value: '¥675,000',
      change: { value: 8.4, isPositive: true },
      color: 'bg-purple-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      linkTo: '/admin/analytics/revenue'
    }
  ];
  
  const recentActivities = [
    {
      type: 'report' as const,
      title: '不適切なコンテンツの報告',
      time: '10分前',
      description: 'ユーザーID: 12345のプロフィール写真に関する報告が提出されました'
    },
    {
      type: 'moderation' as const,
      title: 'コンテンツモデレーション',
      time: '30分前',
      description: '管理者がユーザーID: 56789のメッセージを削除しました'
    },
    {
      type: 'user' as const,
      title: '新規ユーザー登録',
      time: '1時間前',
      description: '新しいユーザーが登録されました（ユーザーID: 98765）'
    },
    {
      type: 'moderation' as const,
      title: 'ポリシー更新',
      time: '2時間前',
      description: '管理者がプロフィール写真ポリシーを更新しました'
    },
    {
      type: 'report' as const,
      title: 'ハラスメント報告',
      time: '3時間前',
      description: 'ユーザーID: 23456のチャットメッセージに関する報告が処理されました'
    }
  ];
  
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">管理者ダッシュボード</h1>
          <p className="text-gray-600 mt-1">LineBuzzプラットフォームの管理と運営状況の概要</p>
        </div>
        
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              linkTo={stat.linkTo}
              color={stat.color}
            />
          ))}
        </div>
        
        {/* コンテンツ領域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 最近の活動 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">最近の活動</h2>
                <Link href="/admin/reports">
                  <span className="text-sm text-blue-600 hover:text-blue-800">すべて表示</span>
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    type={activity.type}
                    title={activity.title}
                    time={activity.time}
                    description={activity.description}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* クイックアクセス */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">クイックアクセス</h2>
              <div className="space-y-3">
                {[
                  { name: 'モデレーションポリシー', href: '/admin/policies', icon: '📋' },
                  { name: '未処理の報告', href: '/admin/reports', icon: '🚨' },
                  { name: '承認待ちユーザー', href: '/admin/users/approvals', icon: '👤' },
                  { name: 'ユーザー統計', href: '/admin/analytics/users', icon: '📊' },
                  { name: 'システム設定', href: '/admin/settings', icon: '⚙️' }
                ].map((item, index) => (
                  <Link key={index} href={item.href}>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
