"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// モックデータ - フィルター設定
const mockFilters = [
  {
    id: 1,
    name: '不適切な言葉フィルター',
    description: '禁止単語や不適切表現を自動的にブロックします',
    status: true,
    sensitivity: 'high',
    lastUpdated: '2025-02-15',
    blockedCount: 1243,
    flaggedCount: 325,
    keywords: ['馬鹿', 'バカ', 'クソ', '死ね', '殺す', 'アホ']
  },
  {
    id: 2,
    name: '性的コンテンツフィルター',
    description: '露骨な性的表現や提案を検出します',
    status: true,
    sensitivity: 'medium',
    lastUpdated: '2025-01-20',
    blockedCount: 752,
    flaggedCount: 198,
    keywords: ['セックス', 'エッチ', 'ヤリ', '抱く', '裸']
  },
  {
    id: 3,
    name: 'スパム検出フィルター',
    description: '繰り返しメッセージや迷惑な勧誘を自動検出します',
    status: true,
    sensitivity: 'medium',
    lastUpdated: '2025-02-05',
    blockedCount: 3215,
    flaggedCount: 542,
    keywords: ['儲かる', '稼げる', '投資', '副業', 'お金']
  },
  {
    id: 4,
    name: '個人情報フィルター',
    description: '電話番号やメールアドレスなどの個人情報共有を検出します',
    status: false,
    sensitivity: 'low',
    lastUpdated: '2025-01-10',
    blockedCount: 421,
    flaggedCount: 86,
    keywords: ['電話', 'メール', '@', '090', '080']
  },
  {
    id: 5,
    name: 'フィッシング詐欺検出',
    description: '詐欺的なリンクやフィッシング試行を検出します',
    status: true,
    sensitivity: 'high',
    lastUpdated: '2025-02-22',
    blockedCount: 189,
    flaggedCount: 42,
    keywords: ['クリック', 'リンク', '登録', '確認', 'パスワード']
  }
];

// モックデータ - 自動対応設定
const mockActions = [
  {
    id: 1,
    trigger: '不適切な言葉フィルター - 高感度',
    action: 'メッセージブロック',
    notification: true,
    adminAlert: false,
    userWarning: true,
    status: true
  },
  {
    id: 2,
    trigger: '不適切な言葉フィルター - 中感度',
    action: 'フラグ付け',
    notification: true,
    adminAlert: false,
    userWarning: false,
    status: true
  },
  {
    id: 3,
    trigger: '性的コンテンツフィルター - 高感度',
    action: 'メッセージブロック',
    notification: true,
    adminAlert: true,
    userWarning: true,
    status: true
  },
  {
    id: 4,
    trigger: 'スパム検出 - 連続3回以上',
    action: '一時的アカウントブロック',
    notification: true,
    adminAlert: true,
    userWarning: true,
    status: true
  },
  {
    id: 5,
    trigger: '個人情報検出',
    action: '警告表示',
    notification: true,
    adminAlert: false,
    userWarning: true,
    status: true
  }
];

const AutoModerationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('filters');
  const [editingFilter, setEditingFilter] = useState<any | null>(null);
  const [filters, setFilters] = useState(mockFilters);
  const [actions, setActions] = useState(mockActions);

  // フィルター編集モーダル用ステート
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any | null>(null);

  // アクション編集モーダル用ステート
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any | null>(null);

  // フィルターステータス切り替え
  const toggleFilterStatus = (id: number) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, status: !filter.status } : filter
    ));
    toast.success('フィルター状態を更新しました');
  };

  // アクションステータス切り替え
  const toggleActionStatus = (id: number) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, status: !action.status } : action
    ));
    toast.success('アクション状態を更新しました');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">自動モデレーション設定</h1>
        <p className="mt-2 text-gray-600">
          システムが自動的に検出・対応するコンテンツフィルターとアクションを管理します
        </p>
      </div>

      {/* タブナビゲーション */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="タブ">
          <button
            onClick={() => setActiveTab('filters')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'filters'
                ? 'border-[#66cdaa] text-[#66cdaa]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            フィルター設定
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'actions'
                ? 'border-[#66cdaa] text-[#66cdaa]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            自動対応設定
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-[#66cdaa] text-[#66cdaa]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            実行ログ
          </button>
        </nav>
      </div>

      {/* フィルター設定タブ */}
      {activeTab === 'filters' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">コンテンツフィルター</h2>
            <button 
              className="px-4 py-2 bg-[#66cdaa] text-white rounded-md hover:bg-[#5bb99a] transition"
              onClick={() => {
                setSelectedFilter(null);
                setShowFilterModal(true);
              }}
            >
              新規フィルター追加
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">フィルター名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">感度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">検出数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filters.map((filter) => (
                  <tr key={filter.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{filter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{filter.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        filter.sensitivity === 'high' ? 'bg-red-100 text-red-800' : 
                        filter.sensitivity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {filter.sensitivity === 'high' ? '高' : 
                         filter.sensitivity === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ブロック: {filter.blockedCount} / フラグ: {filter.flaggedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          checked={filter.status} 
                          onChange={() => toggleFilterStatus(filter.id)}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                            filter.status ? 'bg-[#66cdaa]' : 'bg-gray-300'
                          }`}
                        ></label>
                      </div>
                      <span className="text-sm">{filter.status ? '有効' : '無効'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-[#66cdaa] hover:text-[#5bb99a] mr-3"
                        onClick={() => {
                          setSelectedFilter(filter);
                          setShowFilterModal(true);
                        }}
                      >
                        編集
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => toast.error('この機能は実装中です')}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* 自動対応設定タブ */}
      {activeTab === 'actions' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">自動対応アクション</h2>
            <button 
              className="px-4 py-2 bg-[#66cdaa] text-white rounded-md hover:bg-[#5bb99a] transition"
              onClick={() => {
                setSelectedAction(null);
                setShowActionModal(true);
              }}
            >
              新規アクション追加
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">トリガー</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">通知設定</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {actions.map((action) => (
                  <tr key={action.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{action.trigger}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        action.action === 'メッセージブロック' ? 'bg-red-100 text-red-800' : 
                        action.action === '一時的アカウントブロック' ? 'bg-red-100 text-red-800' : 
                        action.action === 'フラグ付け' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {action.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {action.notification && <span className="mr-2">📱 通知</span>}
                      {action.adminAlert && <span className="mr-2">👨‍💼 管理者</span>}
                      {action.userWarning && <span>⚠️ ユーザー警告</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          checked={action.status} 
                          onChange={() => toggleActionStatus(action.id)}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                            action.status ? 'bg-[#66cdaa]' : 'bg-gray-300'
                          }`}
                        ></label>
                      </div>
                      <span className="text-sm">{action.status ? '有効' : '無効'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-[#66cdaa] hover:text-[#5bb99a] mr-3"
                        onClick={() => {
                          setSelectedAction(action);
                          setShowActionModal(true);
                        }}
                      >
                        編集
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => toast.error('この機能は実装中です')}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ログタブ */}
      {activeTab === 'logs' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">モデレーション実行ログ</h2>
          <p className="text-gray-600 mb-6">過去30日間のモデレーションアクション履歴を表示しています</p>
          
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">ログデータの読み込み中...</p>
          </div>
        </motion.div>
      )}

      {/* スタイル */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 10;
          border-color: #ccc;
          transition: all 0.3s;
        }
        .toggle-label {
          display: block;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
};

export default AutoModerationPage;
