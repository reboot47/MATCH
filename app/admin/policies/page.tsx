"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Policy } from '@/types/policy';
import PolicyList from '@/app/components/admin/PolicyList';
import PolicyEditForm from '@/app/components/admin/PolicyEditForm';

interface Policy {
  id: string;
  name: string;
  description: string;
  contentType: string;
  rules: string[];
  severity: string;
  actionRequired: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// モックデータ - 本番ではAPIから取得
const mockPolicies: Policy[] = [
  {
    id: "policy-1",
    name: "プロフィール写真ポリシー",
    description: "プロフィール写真に関するモデレーションルール",
    contentType: "photo",
    rules: [
      "本人確認可能な顔写真が必要",
      "露出度の高い写真は禁止",
      "暴力的・攻撃的な表現を含む写真は禁止",
      "他者の写真の無断使用は禁止"
    ],
    severity: "medium",
    actionRequired: "remove",
    isActive: true,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z"
  },
  {
    id: "policy-2",
    name: "メッセージコンテンツポリシー",
    description: "ユーザー間のメッセージに関するモデレーションルール",
    contentType: "message",
    rules: [
      "外部連絡先の交換は禁止",
      "金銭のやり取りの提案は禁止",
      "嫌がらせ・脅迫的なメッセージは禁止",
      "不適切な出会いの提案は禁止"
    ],
    severity: "high",
    actionRequired: "ban",
    isActive: true,
    createdAt: "2025-02-02T00:00:00Z",
    updatedAt: "2025-02-02T00:00:00Z"
  },
  {
    id: "policy-3",
    name: "プロフィール説明ポリシー",
    description: "ユーザープロフィールのテキスト内容に関するモデレーションルール",
    contentType: "profile",
    rules: [
      "個人情報（電話番号、LINEなど）の記載は禁止",
      "金銭のやり取りを目的とする内容は禁止",
      "性的な表現・暗示は禁止",
      "差別的・攻撃的な表現は禁止"
    ],
    severity: "medium",
    actionRequired: "warn",
    isActive: true,
    createdAt: "2025-02-03T00:00:00Z",
    updatedAt: "2025-02-03T00:00:00Z"
  }
];

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ポリシーデータを取得する関数
  const fetchPolicies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // クエリパラメータを構築
      let url = '/api/admin/policies';
      const params = new URLSearchParams();
      
      if (filterType !== 'all') {
        params.append('contentType', filterType);
      }
      
      if (searchTerm.trim()) {
        params.append('query', searchTerm.trim());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      // APIを呼び出す
      const response = await fetch(url);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'ポリシーの取得に失敗しました');
      }
      
      const data = await response.json();
      setPolicies(data.policies);
    } catch (error: any) {
      console.error('ポリシー取得エラー:', error);
      setError(error.message || 'ポリシーの取得に失敗しました');
      
      // 開発環境ではモックデータを使用
      if (process.env.NODE_ENV === 'development') {
        setPolicies(mockPolicies);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ページ読み込み時にポリシーデータを取得
  useEffect(() => {
    fetchPolicies();
  }, [searchTerm, filterType]);

  // 検索ハンドラ
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // フィルタハンドラ
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  // ポリシー編集ハンドラ
  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setIsEditModalOpen(true);
  };

  // 新規ポリシー作成ハンドラ
  const handleCreateNew = () => {
    setEditingPolicy(null);
    setIsEditModalOpen(true);
  };

  // ポリシー保存ハンドラ
  const handleSavePolicy = async (policy: Policy) => {
    try {
      const isNewPolicy = !policy.id;
      const method = isNewPolicy ? 'POST' : 'PUT';
      const url = '/api/admin/policies';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policy),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ポリシーの保存に失敗しました');
      }
      
      const result = await response.json();
      
      // 成功メッセージを表示
      toast.success(result.message || 'ポリシーが保存されました');
      
      // モーダルを閉じる
      setIsEditModalOpen(false);
      
      // ポリシーリストを更新
      fetchPolicies();
      
    } catch (error: any) {
      console.error('ポリシー保存エラー:', error);
      toast.error(error.message || 'ポリシーの保存に失敗しました');
    }
  };

  // ポリシー削除ハンドラ
  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm('このポリシーを削除してもよろしいですか？この操作は元に戻せません。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/policies?id=${policyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ポリシーの削除に失敗しました');
      }
      
      const result = await response.json();
      
      // 成功メッセージを表示
      toast.success(result.message || 'ポリシーが削除されました');
      
      // ポリシーリストを更新
      fetchPolicies();
      
    } catch (error: any) {
      console.error('ポリシー削除エラー:', error);
      toast.error(error.message || 'ポリシーの削除に失敗しました');
    }
  };

  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">モデレーションポリシー管理</h1>
            <p className="mt-1 text-sm text-gray-600">
              コンテンツ種別ごとのモデレーションルールを設定・管理します
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規ポリシー
          </button>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* 検索とフィルタ */}
        <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/3">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  検索
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="ポリシー名・説明を検索"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="w-full sm:w-1/3">
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                  コンテンツタイプで絞り込み
                </label>
                <select
                  id="filter"
                  name="filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterType}
                  onChange={handleFilter}
                >
                  <option value="all">すべて表示</option>
                  <option value="profile">プロフィール</option>
                  <option value="photo">写真</option>
                  <option value="message">メッセージ</option>
                  <option value="livestream">ライブ配信</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ポリシーリスト */}
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">エラーが発生しました</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchPolicies}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                再試行
              </button>
            </div>
          </div>
        ) : policies.length === 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">モデレーションポリシーが見つかりません</h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? '検索条件に一致するポリシーがありません。検索条件を変更するか、新しいポリシーを作成してください。'
                  : 'モデレーションポリシーが登録されていません。「新規ポリシー」ボタンから作成してください。'}
              </p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                新規ポリシー作成
              </button>
            </div>
          </div>
        ) : (
          <PolicyList 
            policies={policies}
            onEdit={handleEdit}
            onDelete={handleDeletePolicy}
          />
        )}
      </div>

      {/* ポリシー編集モーダル */}
      <PolicyEditForm
        policy={editingPolicy || undefined}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePolicy}
        isOpen={isEditModalOpen}
      />
    </div>
  );
}
