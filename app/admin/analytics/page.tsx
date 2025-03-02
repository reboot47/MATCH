"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// モックデータ - ユーザー統計
const userStats = {
  totalUsers: 125876,
  activeUsers: 68543,
  premiumUsers: 12450,
  newUsersToday: 423,
  genderRatio: {
    male: 68,
    female: 32
  },
  ageDistribution: [
    { age: '18-24', percentage: 24 },
    { age: '25-34', percentage: 41 },
    { age: '35-44', percentage: 22 },
    { age: '45-54', percentage: 9 },
    { age: '55+', percentage: 4 }
  ],
  regionDistribution: [
    { region: '関東', users: 52340 },
    { region: '関西', users: 24698 },
    { region: '中部', users: 15489 },
    { region: '九州', users: 12540 },
    { region: '東北', users: 9854 },
    { region: '北海道', users: 7456 },
    { region: '中国', users: 6543 },
    { region: '四国', users: 5432 },
    { region: '沖縄', users: 2345 }
  ],
  retentionRates: [
    { day: 1, rate: 85 },
    { day: 7, rate: 62 },
    { day: 30, rate: 43 },
    { day: 90, rate: 28 }
  ]
};

// モックデータ - マッチング統計
const matchingStats = {
  dailyMatches: 12543,
  weeklyMatches: 78965,
  monthlyMatches: 312450,
  averageMatchesPerUser: 12.4,
  messagesSent: {
    daily: 54321,
    weekly: 298765,
    monthly: 1245000
  },
  conversationContinuationRate: 48,
  mostActiveHours: [
    { hour: '7-9', percentage: 8 },
    { hour: '12-14', percentage: 12 },
    { hour: '18-20', percentage: 25 },
    { hour: '21-23', percentage: 38 },
    { hour: '0-2', percentage: 15 },
    { hour: '3-6', percentage: 2 }
  ],
  mostPopularUsers: [
    { id: 'user_12345', likes: 1243 },
    { id: 'user_23456', likes: 1156 },
    { id: 'user_34567', likes: 987 },
    { id: 'user_45678', likes: 932 },
    { id: 'user_56789', likes: 876 }
  ]
};

// モックデータ - 収益統計
const revenueStats = {
  totalRevenue: 325450000,
  currentMonthRevenue: 42345000,
  previousMonthRevenue: 38764000,
  arpu: 4532,
  arppu: 12450,
  conversionRate: 8.4,
  revenueBySource: [
    { source: 'サブスクリプション', percentage: 65 },
    { source: 'ポイント購入', percentage: 25 },
    { source: 'プロフィールブースト', percentage: 5 },
    { source: 'その他', percentage: 5 }
  ],
  revenueByGender: {
    male: 92,
    female: 8
  },
  monthlyRevenue: [
    { month: '1月', revenue: 32450000 },
    { month: '2月', revenue: 38764000 },
    { month: '3月', revenue: 42345000 }
  ]
};

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [timePeriod, setTimePeriod] = useState('month');
  
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">統計・分析</h1>
          
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 border rounded-md text-gray-700 text-sm"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <option value="day">今日</option>
              <option value="week">今週</option>
              <option value="month">今月</option>
              <option value="quarter">四半期</option>
              <option value="year">年間</option>
            </select>
            
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm transition-colors duration-200">
              レポート出力
            </button>
          </div>
        </div>
        
        {/* 重要KPI表示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xs font-medium text-gray-500 mb-1">総ユーザー数</h3>
            <p className="text-xl font-bold text-indigo-600">{userStats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+2.4%</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xs font-medium text-gray-500 mb-1">アクティブユーザー</h3>
            <p className="text-xl font-bold text-blue-600">{userStats.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+5.1%</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xs font-medium text-gray-500 mb-1">新規ユーザー</h3>
            <p className="text-xl font-bold text-green-600">{userStats.newUsersToday.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+12.8%</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xs font-medium text-gray-500 mb-1">日次マッチング数</h3>
            <p className="text-xl font-bold text-pink-600">{matchingStats.dailyMatches.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+3.7%</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xs font-medium text-gray-500 mb-1">月間収益</h3>
            <p className="text-xl font-bold text-yellow-600">¥{(revenueStats.currentMonthRevenue / 10000).toFixed(1)}万</p>
            <p className="text-xs text-green-600 mt-1">+9.2%</p>
          </motion.div>
          
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xs font-medium text-gray-500 mb-1">課金率</h3>
            <p className="text-xl font-bold text-purple-600">{revenueStats.conversionRate}%</p>
            <p className="text-xs text-green-600 mt-1">+0.4%</p>
          </motion.div>
        </div>
        
        {/* タブ切り替え */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            <button 
              className={`px-6 py-3 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('users')}
            >
              ユーザー分析
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'matching' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('matching')}
            >
              マッチング分析
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'revenue' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('revenue')}
            >
              売上分析
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'retention' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('retention')}
            >
              継続率分析
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'behavior' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('behavior')}
            >
              行動分析
            </button>
          </div>
        </div>
        
        {/* ユーザー分析 */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 性別分布 */}
            <motion.div 
              className="bg-white p-6 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-lg font-bold mb-4">性別分布</h2>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-l-full" style={{ width: `${userStats.genderRatio.male}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <p className="text-sm text-gray-600">男性 ({userStats.genderRatio.male}%)</p>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                  <p className="text-sm text-gray-600">女性 ({userStats.genderRatio.female}%)</p>
                </div>
              </div>
            </motion.div>
            
            {/* 年齢分布 */}
            <motion.div 
              className="bg-white p-6 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-4">年齢分布</h2>
              <div className="space-y-3">
                {userStats.ageDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-600">{item.age}</p>
                      <p className="text-sm font-medium">{item.percentage}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* 地域分布 */}
            <motion.div 
              className="bg-white p-6 rounded-lg shadow lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">地域分布</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userStats.regionDistribution.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{item.region}</p>
                    <p className="text-sm font-medium">{item.users.toLocaleString()}人</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* 継続率 */}
            <motion.div 
              className="bg-white p-6 rounded-lg shadow lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h2 className="text-lg font-bold mb-4">継続率</h2>
              <div className="flex justify-between items-end">
                {userStats.retentionRates.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="relative pb-12">
                      <div 
                        className="absolute bottom-0 w-16 bg-blue-500 rounded-t" 
                        style={{ height: `${item.rate * 2}px` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium">{item.rate}%</p>
                    <p className="text-xs text-gray-500">{item.day}日後</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
        
        {/* マッチング分析 */}
        {activeTab === 'matching' && (
          <div>
            <p className="text-center text-gray-500 py-8">
              マッチング分析タブの内容がここに表示されます
            </p>
          </div>
        )}
        
        {/* 売上分析 */}
        {activeTab === 'revenue' && (
          <div>
            <p className="text-center text-gray-500 py-8">
              売上分析タブの内容がここに表示されます
            </p>
          </div>
        )}
        
        {/* 継続率分析 */}
        {activeTab === 'retention' && (
          <div>
            <p className="text-center text-gray-500 py-8">
              継続率分析タブの内容がここに表示されます
            </p>
          </div>
        )}
        
        {/* 行動分析 */}
        {activeTab === 'behavior' && (
          <div>
            <p className="text-center text-gray-500 py-8">
              行動分析タブの内容がここに表示されます
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
