"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiFilter, FiSearch, FiCalendar, FiUser, FiDollarSign, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import Link from 'next/link';

// 取引履歴の型定義
interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userGender: 'male' | 'female';
  type: 'purchase' | 'consumption' | 'gift' | 'refund' | 'bonus';
  points: number;
  amount: number; // 日本円
  createdAt: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description: string;
  paymentMethod?: string;
  relatedItemId?: string;
  relatedItemName?: string;
}

// 取引タイプ表示用の定数
const TRANSACTION_TYPE_LABELS = {
  purchase: 'ポイント購入',
  consumption: 'ポイント消費',
  gift: 'ギフト送信',
  refund: '返金',
  bonus: 'ボーナス付与',
};

// 取引ステータス表示用の定数
const TRANSACTION_STATUS_LABELS = {
  completed: '完了',
  pending: '処理中',
  failed: '失敗',
  refunded: '返金済み',
};

// ステータスに応じたカラーバッジ表示用の定数
const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-blue-100 text-blue-800',
};

// モックデータ - 取引履歴
const initialTransactions: Transaction[] = [
  {
    id: 'TX-00001',
    userId: 'U-1456',
    userName: '田中健太',
    userGender: 'male',
    type: 'purchase',
    points: 1000,
    amount: 2000,
    createdAt: '2025-03-01T12:30:45',
    status: 'completed',
    description: 'ポイント購入: スタンダードパック',
    paymentMethod: 'クレジットカード',
  },
  {
    id: 'TX-00002',
    userId: 'U-2345',
    userName: '佐藤美咲',
    userGender: 'female',
    type: 'gift',
    points: 50,
    amount: 0,
    createdAt: '2025-03-02T14:22:10',
    status: 'completed',
    description: 'ギフト受け取り: 花束',
    relatedItemId: 'G-001',
    relatedItemName: '花束',
  },
  {
    id: 'TX-00003',
    userId: 'U-1456',
    userName: '田中健太',
    userGender: 'male',
    type: 'consumption',
    points: -30,
    amount: 0,
    createdAt: '2025-03-02T15:40:55',
    status: 'completed',
    description: 'ポイント消費: メッセージ送信 x3',
  },
  {
    id: 'TX-00004',
    userId: 'U-3782',
    userName: '鈴木一郎',
    userGender: 'male',
    type: 'purchase',
    points: 3000,
    amount: 5000,
    createdAt: '2025-03-03T09:15:22',
    status: 'failed',
    description: 'ポイント購入: プレミアムパック（決済失敗）',
    paymentMethod: 'クレジットカード',
  },
  {
    id: 'TX-00005',
    userId: 'U-4267',
    userName: '山田花子',
    userGender: 'female',
    type: 'bonus',
    points: 100,
    amount: 0,
    createdAt: '2025-03-04T16:20:30',
    status: 'completed',
    description: 'ボーナスポイント: 新規登録特典',
  },
  {
    id: 'TX-00006',
    userId: 'U-1456',
    userName: '田中健太',
    userGender: 'male',
    type: 'consumption',
    points: -50,
    amount: 0,
    createdAt: '2025-03-05T11:12:42',
    status: 'completed',
    description: 'ポイント消費: プロフィールブースト',
  },
  {
    id: 'TX-00007',
    userId: 'U-5678',
    userName: '小林隆',
    userGender: 'male',
    type: 'purchase',
    points: 500,
    amount: 980,
    createdAt: '2025-03-06T19:30:15',
    status: 'pending',
    description: 'ポイント購入: スターターパック（処理中）',
    paymentMethod: 'コンビニ決済',
  },
  {
    id: 'TX-00008',
    userId: 'U-3782',
    userName: '鈴木一郎',
    userGender: 'male',
    type: 'refund',
    points: -3000,
    amount: -5000,
    createdAt: '2025-03-07T10:05:42',
    status: 'refunded',
    description: '返金処理: 決済トラブルによる返金',
  },
  {
    id: 'TX-00009',
    userId: 'U-7890',
    userName: '伊藤さくら',
    userGender: 'female',
    type: 'gift',
    points: 30,
    amount: 0,
    createdAt: '2025-03-08T14:55:20',
    status: 'completed',
    description: 'ギフト受け取り: チョコレート',
    relatedItemId: 'G-002',
    relatedItemName: 'チョコレート',
  },
  {
    id: 'TX-00010',
    userId: 'U-1456',
    userName: '田中健太',
    userGender: 'male',
    type: 'consumption',
    points: -30,
    amount: 0,
    createdAt: '2025-03-09T20:15:33',
    status: 'completed',
    description: 'ポイント消費: ギフト送信 (チョコレート)',
    relatedItemId: 'G-002',
    relatedItemName: 'チョコレート',
  },
];

export default function TransactionsAdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Transaction>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // 日付フォーマット用ユーティリティ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // フィルタリング適用後の取引履歴を取得
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      transaction.status === selectedStatus;
    
    const matchesType = 
      selectedType === 'all' || 
      transaction.type === selectedType;
    
    const transactionDate = new Date(transaction.createdAt);
    const matchesStartDate = startDate ? new Date(startDate) <= transactionDate : true;
    const matchesEndDate = endDate ? new Date(endDate) >= transactionDate : true;
    
    return matchesSearch && matchesStatus && matchesType && matchesStartDate && matchesEndDate;
  });
  
  // 並び替え
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'createdAt') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'points' || sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField] 
        : b[sortField] - a[sortField];
    } else {
      const valueA = String(a[sortField]).toLowerCase();
      const valueB = String(b[sortField]).toLowerCase();
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });
  
  // 日付文字列を YYYY-MM-DD 形式に変換
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // CSVエクスポート
  const exportToCSV = () => {
    // CSVヘッダー
    const headers = [
      'ID', 'ユーザーID', 'ユーザー名', '性別', '取引タイプ', 'ポイント', '金額', '日時', 'ステータス', '説明', '決済方法'
    ].join(',');
    
    // CSVデータ行
    const rows = sortedTransactions.map(transaction => [
      transaction.id,
      transaction.userId,
      transaction.userName,
      transaction.userGender === 'male' ? '男性' : '女性',
      TRANSACTION_TYPE_LABELS[transaction.type],
      transaction.points,
      transaction.amount,
      formatDate(transaction.createdAt),
      TRANSACTION_STATUS_LABELS[transaction.status],
      transaction.description,
      transaction.paymentMethod || 'N/A'
    ].join(','));
    
    // CSVデータ作成
    const csvContent = [headers, ...rows].join('\n');
    
    // ダウンロード処理
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };
  
  // ソート操作
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // ソートインジケーター表示
  const renderSortIndicator = (field: keyof Transaction) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  return (
    <div className="p-4 md:p-6">
      {/* ヘッダー */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Link href="/admin/billing" className="mr-2">
              <FiArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            取引履歴管理
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            ユーザーの課金・ポイント取引履歴を確認・管理できます
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiDownload className="mr-2 -ml-1 h-5 w-5" />
            CSVエクスポート
          </button>
        </div>
      </div>
      
      {/* 検索・フィルターセクション */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 検索ボックス */}
          <div className="flex items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ID, ユーザー名などで検索"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* 日付範囲 */}
          <div className="flex space-x-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                placeholder="開始日"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                placeholder="終了日"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          {/* 取引タイプフィルター */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">全ての取引タイプ</option>
              {Object.entries(TRANSACTION_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          {/* ステータスフィルター */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">全てのステータス</option>
              {Object.entries(TRANSACTION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 取引履歴テーブル */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  取引ID {renderSortIndicator('id')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('userName')}
                >
                  ユーザー {renderSortIndicator('userName')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  取引タイプ {renderSortIndicator('type')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('points')}
                >
                  ポイント {renderSortIndicator('points')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  金額 {renderSortIndicator('amount')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  日時 {renderSortIndicator('createdAt')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  ステータス {renderSortIndicator('status')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  詳細
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                          transaction.userGender === 'male' ? 'bg-blue-400' : 'bg-pink-400'
                        }`}></span>
                        <div>
                          <div>{transaction.userName}</div>
                          <div className="text-xs text-gray-400">{transaction.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {TRANSACTION_TYPE_LABELS[transaction.type]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        transaction.points > 0 ? 'text-green-600' : 
                        transaction.points < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 
                        transaction.amount < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {transaction.amount !== 0 ? `¥${Math.abs(transaction.amount).toLocaleString()}` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[transaction.status]}`}>
                        {TRANSACTION_STATUS_LABELS[transaction.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="max-w-xs truncate">{transaction.description}</div>
                      {transaction.paymentMethod && (
                        <div className="text-xs text-gray-400">決済: {transaction.paymentMethod}</div>
                      )}
                      {transaction.relatedItemName && (
                        <div className="text-xs text-gray-400">アイテム: {transaction.relatedItemName}</div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-sm text-gray-500 text-center">
                    該当する取引履歴はありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 集計情報 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">取引総数</h3>
          <p className="mt-1 text-2xl font-semibold">{sortedTransactions.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">合計ポイント</h3>
          <p className="mt-1 text-2xl font-semibold">
            {sortedTransactions.reduce((sum, t) => sum + t.points, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">売上合計</h3>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            ¥{sortedTransactions
              .filter(t => t.amount > 0 && t.status === 'completed')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">返金合計</h3>
          <p className="mt-1 text-2xl font-semibold text-red-600">
            ¥{Math.abs(sortedTransactions
              .filter(t => t.amount < 0)
              .reduce((sum, t) => sum + t.amount, 0))
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
