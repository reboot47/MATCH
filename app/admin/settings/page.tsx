"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// 管理者アカウントのモックデータ
const adminAccounts = [
  {
    id: 1,
    name: '山田太郎',
    email: 'admin@linebuzz.jp',
    role: 'スーパー管理者',
    permissions: ['all'],
    lastLogin: '2025-03-02 14:32'
  },
  {
    id: 2,
    name: '佐藤修',
    email: 'sato@linebuzz.jp',
    role: 'コンテンツモデレーター',
    permissions: ['content_moderation', 'user_management_read'],
    lastLogin: '2025-03-02 10:15'
  },
  {
    id: 3,
    name: '鈴木美咲',
    email: 'misaki@linebuzz.jp',
    role: 'マーケティング担当',
    permissions: ['marketing', 'analytics', 'events'],
    lastLogin: '2025-03-01 16:45'
  },
  {
    id: 4,
    name: '伊藤健太',
    email: 'kenta@linebuzz.jp',
    role: 'カスタマーサポート',
    permissions: ['user_management_read', 'support'],
    lastLogin: '2025-03-02 09:22'
  },
  {
    id: 5,
    name: '田中洋子',
    email: 'yoko@linebuzz.jp',
    role: '分析担当',
    permissions: ['analytics', 'reports'],
    lastLogin: '2025-02-28 15:10'
  }
];

// アプリ設定のモックデータ
const appSettings = {
  general: {
    appName: 'LINEBUZZ',
    defaultLanguage: '日本語',
    timeZone: 'Asia/Tokyo',
    contactEmail: 'support@linebuzz.jp',
    maintenanceMode: false
  },
  security: {
    registrationRequiresApproval: true,
    minimumPasswordLength: 8,
    requireProfilePhotoVerification: true,
    twoFactorAuthForAdmins: true,
    sessionTimeout: 60, // 分
    loginAttempts: 5
  },
  notifications: {
    pushNotificationsEnabled: true,
    emailNotificationsEnabled: true,
    marketingEmailsEnabled: true,
    notificationScheduleStart: '8:00',
    notificationScheduleEnd: '22:00'
  },
  billing: {
    currency: 'JPY',
    taxRate: 10,
    freeTrialDays: 7,
    defaultSubscriptionPeriod: 'monthly',
    pointExpiryDays: 90,
    paymentGateways: ['Stripe', 'PayPal', 'Apple Pay', 'Google Pay', 'Line Pay']
  },
  content: {
    profanityFilterLevel: 'high',
    automaticContentModeration: true,
    userReportThreshold: 3,
    maximumProfilePhotos: 6,
    maximumMessageLength: 500
  }
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [editMode, setEditMode] = useState(false);
  
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">設定</h1>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              editMode 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '保存する' : '編集する'}
          </button>
        </div>
        
        {/* タブ切り替え */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            <button 
              className={`px-6 py-3 ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('general')}
            >
              一般設定
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('security')}
            >
              セキュリティ
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('notifications')}
            >
              通知設定
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'billing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('billing')}
            >
              課金設定
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('content')}
            >
              コンテンツ設定
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'admins' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('admins')}
            >
              管理者アカウント
            </button>
          </div>
        </div>
        
        {/* 一般設定 */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">一般設定</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">アプリ名</label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 border rounded-md ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                    value={appSettings.general.appName}
                    disabled={!editMode}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">デフォルト言語</label>
                  <select 
                    className={`w-full px-3 py-2 border rounded-md ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                    value={appSettings.general.defaultLanguage}
                    disabled={!editMode}
                  >
                    <option value="日本語">日本語</option>
                    <option value="English">English</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タイムゾーン</label>
                  <select 
                    className={`w-full px-3 py-2 border rounded-md ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                    value={appSettings.general.timeZone}
                    disabled={!editMode}
                  >
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">お問い合わせメール</label>
                  <input 
                    type="email" 
                    className={`w-full px-3 py-2 border rounded-md ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                    value={appSettings.general.contactEmail}
                    disabled={!editMode}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="maintenanceMode" 
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  checked={appSettings.general.maintenanceMode}
                  disabled={!editMode}
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                  メンテナンスモードを有効化
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* 管理者アカウント */}
        {activeTab === 'admins' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">管理者アカウント</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  新規管理者追加
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メール</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">役割</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終ログイン</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminAccounts.map(admin => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          admin.role === 'スーパー管理者' 
                            ? 'bg-purple-100 text-purple-800' 
                            : admin.role === 'コンテンツモデレーター'
                              ? 'bg-green-100 text-green-800'
                              : admin.role === 'マーケティング担当'
                                ? 'bg-blue-100 text-blue-800'
                                : admin.role === 'カスタマーサポート'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">編集</button>
                        {admin.role !== 'スーパー管理者' && (
                          <button className="text-red-600 hover:text-red-900">削除</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* その他のタブのコンテンツは省略 - 実際はここに各タブの内容を追加 */}
        {(activeTab === 'security' || activeTab === 'notifications' || activeTab === 'billing' || activeTab === 'content') && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">{
              activeTab === 'security' ? 'セキュリティ設定' :
              activeTab === 'notifications' ? '通知設定' :
              activeTab === 'billing' ? '課金設定' :
              'コンテンツ設定'
            }</h2>
            
            <p className="text-gray-500">
              この{
                activeTab === 'security' ? 'セキュリティ' :
                activeTab === 'notifications' ? '通知' :
                activeTab === 'billing' ? '課金' :
                'コンテンツ'
              }設定タブの内容は、今後の開発で実装される予定です。
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
