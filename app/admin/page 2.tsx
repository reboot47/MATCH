"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';

// ダッシュボードカードのコンポーネント
const DashboardCard = ({ title, value, description, icon, color }: any) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          {description && (
            <p className={`text-sm ${color} mt-2 flex items-center`}>
              {description.includes('+') ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  // ダッシュボードのサマリーデータ
  const summaryData = [
    {
      title: '総ユーザー数',
      value: '12,345',
      description: '+12% 先月比',
      color: 'text-green-600',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: '今月の売上',
      value: '¥2,873,500',
      description: '+8% 先月比',
      color: 'text-blue-600',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '新規マッチング',
      value: '5,726',
      description: '+23% 先月比',
      color: 'text-pink-600',
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'ポイント消費数',
      value: '985,245',
      description: '+41% 先月比',
      color: 'text-purple-600',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // 性別比率データ
  const genderRatio = {
    male: 65,
    female: 35,
  };

  // 最近のトランザクションデータ
  const recentTransactions = [
    { id: 1, user: '山田太郎', type: 'ポイント購入', amount: '¥10,000', date: '2025/03/02', status: 'completed' },
    { id: 2, user: '佐藤次郎', type: 'プレミアムプラン', amount: '¥5,800', date: '2025/03/01', status: 'completed' },
    { id: 3, user: '鈴木花子', type: 'ブースト機能', amount: '¥2,000', date: '2025/03/01', status: 'pending' },
    { id: 4, user: '高橋健太', type: 'ギフト購入', amount: '¥3,500', date: '2025/02/28', status: 'completed' },
    { id: 5, user: '伊藤直樹', type: 'ポイント購入', amount: '¥20,000', date: '2025/02/28', status: 'completed' },
  ];

  // ユーザー活動グラフデータ（モック）
  const userActivityData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        name: '男性ユーザー',
        data: [3200, 3800, 4100, 4700, 5300, 5900],
      },
      {
        name: '女性ユーザー',
        data: [2800, 3100, 3400, 3600, 3900, 4200],
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">管理ダッシュボード</h1>
        <p className="text-gray-500 mt-1">最新の統計情報とアプリの状態を確認できます</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map((data, index) => (
          <DashboardCard key={index} {...data} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 男女比グラフ */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">ユーザー性別比率</h2>
          <div className="mt-6 flex items-center justify-center">
            <div className="relative pt-1 w-full">
              <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${genderRatio.male}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                >
                  {genderRatio.male}% 男性
                </div>
                <div
                  style={{ width: `${genderRatio.female}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                >
                  {genderRatio.female}% 女性
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>男性: {genderRatio.male}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span>女性: {genderRatio.female}%</span>
            </div>
          </div>
        </motion.div>

        {/* ユーザー活動グラフ */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">ユーザー推移（月次）</h2>
          <div className="mt-6">
            <div className="h-64 flex items-end">
              {userActivityData.datasets[0].data.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex justify-center items-end space-x-1">
                    <div
                      className="w-5 bg-blue-500 rounded-t"
                      style={{ height: `${(value / 6000) * 100}%` }}
                    ></div>
                    <div
                      className="w-5 bg-pink-500 rounded-t"
                      style={{ height: `${(userActivityData.datasets[1].data[index] / 6000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {userActivityData.labels[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center text-sm text-gray-600 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>男性ユーザー</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span>女性ユーザー</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 最近のトランザクション */}
      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800">最近の課金トランザクション</h2>
          <p className="text-sm text-gray-500 mt-1">直近のユーザー課金状況</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ユーザー
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイプ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? '完了' : '処理中'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <a href="/admin/billing" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            すべてのトランザクションを表示 →
          </a>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
