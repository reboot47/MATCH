"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUser, FiMail, FiMapPin, FiCalendar, FiClock, FiDollarSign, FiShield, FiFlag, FiCheckCircle, FiXCircle } from 'react-icons/fi';

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
    pendingApproval: false,
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
    pendingApproval: false,
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
    pendingApproval: false,
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
    pendingApproval: false,
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
    pendingApproval: false,
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
    pendingApproval: false,
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
    pendingApproval: false,
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
    pendingApproval: false,
  },
  {
    id: 9,
    name: '松本逸平',
    nickname: 'Ippei',
    email: 'ippei@example.com',
    gender: 'male',
    age: 24,
    location: '神奈川県',
    status: 'inactive',
    verified: false,
    createdAt: '2025-03-10',
    lastLogin: '2025-03-10',
    points: 0,
    subscription: 'なし',
    reportCount: 0,
    pendingApproval: true,
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

// ユーザー詳細モーダルコンポーネント
type User = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  gender: string;
  age: number;
  location: string;
  status: string;
  verified: boolean;
  createdAt: string;
  lastLogin: string;
  points: number;
  subscription: string;
  reportCount: number;
  pendingApproval: boolean;
};

type UserDetailModalProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (userId: number, newStatus: string) => void;
  onDeleteUser: (userId: number) => void;
  onApproveUser?: (userId: number) => void;
};

const UserDetailModal = ({ user, isOpen, onClose, onStatusChange, onDeleteUser, onApproveUser }: UserDetailModalProps) => {
  if (!user || !isOpen) return null;
  
  const statusOptions = [
    { value: 'active', label: '有効', color: 'bg-green-500' },
    { value: 'inactive', label: '無効', color: 'bg-gray-500' },
    { value: 'suspended', label: '停止中', color: 'bg-red-500' }
  ];
  
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(user.id, newStatus);
  };

  return (
    <div className="modal-overlay">
      <style jsx global>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .modal-container {
          position: relative;
          z-index: 10001;
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
        }
      `}</style>
      <div className="modal-container">
        <motion.div 
          className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* モーダルヘッダー */}
          <div className="bg-primary-600 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-white flex items-center">
              <FiUser className="mr-2" /> ユーザー詳細
            </h3>
            <button
              onClick={onClose}
              className="bg-primary-700 rounded-full p-1 text-white hover:bg-primary-800 focus:outline-none"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          {/* ユーザー基本情報 */}
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center mb-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                {user.nickname.charAt(0)}
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-900">{user.name}</h4>
                <div className="flex items-center mt-1">
                  <p className="text-sm text-gray-500">@{user.nickname}</p>
                  {user.verified && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FiCheckCircle className="mr-1" /> 認証済み
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* ユーザーステータス変更 */}
            <div className="mb-6 border-t border-b border-gray-200 py-4">
              <p className="text-sm font-medium text-gray-500 mb-2">アカウント状態:</p>
              <div className="flex space-x-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${user.status === option.value ? 'ring-2 ring-offset-2 ring-primary-500 ' + option.color + ' text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 詳細情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiMail className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">メールアドレス</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">所在地</p>
                  <p className="text-sm font-medium">{user.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiCalendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">登録日</p>
                  <p className="text-sm font-medium">{user.createdAt}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiClock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">最終ログイン</p>
                  <p className="text-sm font-medium">{user.lastLogin}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiDollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">ポイント残高</p>
                  <p className="text-sm font-medium">{user.points.toLocaleString()} ポイント</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiShield className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">サブスクリプション</p>
                  <p className="text-sm font-medium">{user.subscription}</p>
                </div>
              </div>
            </div>
            
            {/* 通報情報 */}
            {user.reportCount > 0 && (
              <div className="mt-4 bg-red-50 p-3 rounded-md">
                <div className="flex">
                  <FiFlag className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800">通報 {user.reportCount}件</p>
                    <p className="text-xs text-red-700 mt-1">このユーザーは他のユーザーから通報されています。詳細を確認してください。</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 承認セクション - 承認待ちユーザーのみ表示 */}
          {user.pendingApproval && onApproveUser && (
            <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200">
              <div className="flex items-center">
                <FiCheckCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-sm font-medium text-yellow-800">このユーザーは承認待ちです</p>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  onClick={() => onApproveUser(user.id)}
                >
                  ユーザーを承認する
                </button>
              </div>
            </div>
          )}
          
          {/* モーダルフッター */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              閉じる
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              詳細ログを表示
            </button>
            
            {/* 削除ボタン */}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => {
                if (window.confirm(`本当に${user.name}（${user.nickname}）を削除しますか？この操作は取り消せません。`))
                  onDeleteUser(user.id);
              }}
            >
              ユーザーを削除
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  // ユーザー詳細モーダルを開く
  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeUserDetail = () => {
    setIsModalOpen(false);
    // 少し遅延させてからselectedUserをnullにする（アニメーション効果のため）
    setTimeout(() => setSelectedUser(null), 300);
  };

  // ユーザーステータスの変更
  const handleStatusChange = (userId: number, newStatus: string) => {
    setActionInProgress(true);
    
    // 実際の実装ではAPIリクエストを行う
    // この例ではモックデータを更新
    setTimeout(() => {
      try {
        // ユーザー配列を更新
        const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        );
        
        setUsers(updatedUsers);
        
        // 選択中のユーザーも更新
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
        
        // 成功メッセージを表示
        setActionMessage({
          text: `ユーザーのステータスを「${newStatus === 'active' ? '有効' : newStatus === 'inactive' ? '無効' : '停止中'}」に変更しました`,
          type: 'success'
        });
        
        // 3秒後にメッセージを消す
        setTimeout(() => setActionMessage(null), 3000);
      } catch (error) {
        // エラーメッセージを表示
        setActionMessage({
          text: 'ステータスの更新中にエラーが発生しました。後でもう一度お試しください。',
          type: 'error'
        });
      } finally {
        setActionInProgress(false);
      }
    }, 600); // 実際のAPIリクエストを模倣するための遅延
  };
  
  // ユーザー削除機能
  const handleDeleteUser = (userId: number) => {
    setActionInProgress(true);
    
    // 実際の実装ではAPIリクエストを行う
    setTimeout(() => {
      try {
        // ユーザー配列から対象ユーザーを削除
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        
        // モーダルを閉じる
        closeUserDetail();
        
        // 成功メッセージを表示
        setActionMessage({
          text: 'ユーザーが正常に削除されました',
          type: 'success'
        });
        
        setTimeout(() => setActionMessage(null), 3000);
      } catch (error) {
        setActionMessage({
          text: 'ユーザーの削除中にエラーが発生しました。後でもう一度お試しください。',
          type: 'error'
        });
      } finally {
        setActionInProgress(false);
      }
    }, 600);
  };
  
  // ユーザー承認機能
  const handleApproveUser = (userId: number) => {
    setActionInProgress(true);
    
    // 実際の実装ではAPIリクエストを行う
    setTimeout(() => {
      try {
        // ユーザー配列を更新
        const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, pendingApproval: false, status: 'active', verified: true } : user
        );
        
        setUsers(updatedUsers);
        
        // 選択中のユーザーも更新
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, pendingApproval: false, status: 'active', verified: true });
        }
        
        // 成功メッセージを表示
        setActionMessage({
          text: 'ユーザーが承認されました',
          type: 'success'
        });
        
        setTimeout(() => setActionMessage(null), 3000);
      } catch (error) {
        setActionMessage({
          text: 'ユーザーの承認中にエラーが発生しました。後でもう一度お試しください。',
          type: 'error'
        });
      } finally {
        setActionInProgress(false);
      }
    }, 600);
  };

  // フィルターされたユーザーリスト
  const filteredUsers = users.filter(user => {
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
      (filter === 'pending' && user.pendingApproval) ||
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
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ユーザー管理</h1>
        <p className="text-gray-500 mt-1">ユーザー情報の確認と管理を行います</p>
      </div>
      
      {/* アクション通知メッセージ */}
      {actionMessage && (
        <motion.div 
          className={`mb-4 rounded-lg p-4 flex items-center ${actionMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {actionMessage.type === 'success' ? (
            <FiCheckCircle className="h-5 w-5 mr-3 text-green-500" />
          ) : (
            <FiXCircle className="h-5 w-5 mr-3 text-red-500" />
          )}
          <p>{actionMessage.text}</p>
        </motion.div>
      )}

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
                <option value="pending">承認待ちユーザー</option>
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
                <div className="min-w-0 flex-1 flex items-center cursor-pointer" onClick={() => openUserDetail(user)}>
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
                    onClick={() => openUserDetail(user)}
                    title="ユーザー詳細を表示"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {user.status === 'active' ? (
                    <button
                      type="button"
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => handleStatusChange(user.id, 'suspended')}
                      disabled={actionInProgress}
                      title="ユーザーを停止する"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => handleStatusChange(user.id, 'active')}
                      disabled={actionInProgress}
                      title="ユーザーを有効化する"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={() => handleStatusChange(user.id, 'inactive')}
                    disabled={actionInProgress}
                    title="ユーザーを無効化する"
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
      
      {/* ユーザー詳細モーダル */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeUserDetail}
        onStatusChange={handleStatusChange}
        onDeleteUser={handleDeleteUser}
        onApproveUser={handleApproveUser}
      />
    </div>
  );
}
