"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiArrowLeft, FiSearch, FiFilter, FiX, FiCheck, FiEdit, FiTrash2, FiActivity } from 'react-icons/fi';
import Link from 'next/link';

// 課金アクションの型定義
interface BillingAction {
  id: string;
  name: string;
  description: string;
  pointsForMen: number;
  pointsForWomen: number;
  isActive: boolean;
  category: 'communication' | 'matching' | 'content' | 'feature' | 'gift';
  applicableGenders: 'all' | 'men' | 'women';
}

// 性別表示用の定数
const GENDER_LABELS = {
  all: '全員',
  men: '男性のみ',
  women: '女性のみ',
};

// カテゴリ表示用の定数
const CATEGORY_LABELS = {
  communication: 'コミュニケーション',
  matching: 'マッチング',
  content: 'コンテンツ',
  feature: '特別機能',
  gift: 'ギフト',
};

// モックデータ - 課金アクション
const initialBillingActions: BillingAction[] = [
  {
    id: '1',
    name: 'メッセージ送信',
    description: '1通のメッセージを送信',
    pointsForMen: 5,
    pointsForWomen: -2, // 女性はポイント獲得（マイナス値）
    isActive: true,
    category: 'communication',
    applicableGenders: 'all',
  },
  {
    id: '2',
    name: '画像添付送信',
    description: 'メッセージに画像を添付して送信',
    pointsForMen: 8,
    pointsForWomen: -3,
    isActive: true,
    category: 'communication',
    applicableGenders: 'all',
  },
  {
    id: '3',
    name: '動画添付送信',
    description: 'メッセージに動画を添付して送信',
    pointsForMen: 10,
    pointsForWomen: -5,
    isActive: true,
    category: 'communication',
    applicableGenders: 'all',
  },
  {
    id: '4',
    name: 'スーパーいいね！',
    description: '通常より目立つスーパーいいね！を送信',
    pointsForMen: 20,
    pointsForWomen: -10,
    isActive: true,
    category: 'matching',
    applicableGenders: 'all',
  },
  {
    id: '5',
    name: 'プロフィールブースト',
    description: '24時間検索結果の上位に表示',
    pointsForMen: 50,
    pointsForWomen: 30,
    isActive: true,
    category: 'feature',
    applicableGenders: 'all',
  },
  {
    id: '6',
    name: 'プロフィール閲覧履歴確認',
    description: '自分のプロフィールを見たユーザーを確認',
    pointsForMen: 15,
    pointsForWomen: 10,
    isActive: true,
    category: 'feature',
    applicableGenders: 'all',
  },
  {
    id: '7',
    name: '花束ギフト送信',
    description: '花束のバーチャルギフトを送信',
    pointsForMen: 30,
    pointsForWomen: 20,
    isActive: true,
    category: 'gift',
    applicableGenders: 'all',
  },
  {
    id: '8',
    name: 'プレミアムフィルター利用',
    description: '高度な検索フィルターを1回利用',
    pointsForMen: 25,
    pointsForWomen: 15,
    isActive: true,
    category: 'feature',
    applicableGenders: 'all',
  },
  {
    id: '9',
    name: 'リマッチ',
    description: '過去にスキップしたユーザーともう一度マッチングチャンス',
    pointsForMen: 25,
    pointsForWomen: 15,
    isActive: true,
    category: 'matching',
    applicableGenders: 'all',
  },
  {
    id: '10',
    name: '位置情報共有',
    description: 'マッチングしたユーザーと位置情報を共有',
    pointsForMen: 15,
    pointsForWomen: 10,
    isActive: false,
    category: 'feature',
    applicableGenders: 'all',
  },
];

export default function BillingActionsAdminPage() {
  const [billingActions, setBillingActions] = useState<BillingAction[]>(initialBillingActions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<BillingAction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAction, setNewAction] = useState<BillingAction>({
    id: '', // 追加時に自動生成
    name: '',
    description: '',
    pointsForMen: 0,
    pointsForWomen: 0,
    isActive: true,
    category: 'communication',
    applicableGenders: 'all',
  });

  // フィルター適用後のアクション一覧を取得
  const filteredActions = billingActions.filter(action => {
    const matchesSearch = 
      action.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      action.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      action.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // アクションの編集を開始
  const handleEdit = (action: BillingAction) => {
    setIsEditing(action.id);
    setEditingAction({ ...action });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditingAction(null);
  };

  // 編集を保存
  const handleSave = (action: BillingAction) => {
    // 実際のAPIコールは後で実装
    const updatedActions = billingActions.map(a => 
      a.id === action.id ? action : a
    );
    setBillingActions(updatedActions);
    setIsEditing(null);
    setEditingAction(null);
  };

  // 編集中のアクションを更新
  const handleUpdateEditingAction = (field: string, value: any) => {
    if (!editingAction) return;
    setEditingAction({
      ...editingAction,
      [field]: value,
    });
  };

  // アクティブ状態を切り替え
  const toggleActive = (id: string) => {
    const updatedActions = billingActions.map(action => 
      action.id === id ? { ...action, isActive: !action.isActive } : action
    );
    setBillingActions(updatedActions);
  };
  
  // 新規アクションの入力フォーム更新
  const handleUpdateNewAction = (field: string, value: any) => {
    setNewAction({
      ...newAction,
      [field]: value,
    });
  };
  
  // 新規アクションの追加
  const handleAddAction = () => {
    // IDを生成（実際の実装では、APIからの応答で得られるID等を使用）
    const newId = String(Date.now());
    
    // 新規アクションを追加
    const actionToAdd: BillingAction = {
      ...newAction,
      id: newId,
    };
    
    // アクション配列を更新
    setBillingActions([...billingActions, actionToAdd]);
    
    // フォームをリセット
    setNewAction({
      id: '',
      name: '',
      description: '',
      pointsForMen: 0,
      pointsForWomen: 0,
      isActive: true,
      category: 'communication',
      applicableGenders: 'all',
    });
    
    // 追加フォームを閉じる
    setShowAddForm(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-4">
        <Link href="/admin/billing" className="flex items-center text-gray-600 hover:text-gray-900">
          <FiArrowLeft className="mr-2" />
          <span>課金管理に戻る</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">課金アクション管理</h1>
        <p className="text-gray-500 mt-1">ポイントを消費・獲得するアクションの設定</p>
      </div>

      {/* 検索とフィルター */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="アクション名・説明で検索"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-400" />
            <span className="text-gray-600">カテゴリ:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">すべて</option>
            <option value="communication">コミュニケーション</option>
            <option value="matching">マッチング</option>
            <option value="content">コンテンツ</option>
            <option value="feature">特別機能</option>
            <option value="gift">ギフト</option>
          </select>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center">
            <FiPlus className="mr-2" />
            <span>新規追加</span>
          </button>
        </div>
      </div>

      {/* アクション一覧 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション名
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                男性ポイント
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                女性ポイント
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                対象
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActions.map((action) => (
              <tr key={action.id} className="hover:bg-gray-50">
                {isEditing === action.id ? (
                  // 編集モード
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        value={editingAction?.name || ''}
                        onChange={(e) => handleUpdateEditingAction('name', e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md mt-1 text-xs text-gray-500"
                        value={editingAction?.description || ''}
                        onChange={(e) => handleUpdateEditingAction('description', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        value={editingAction?.category || ''}
                        onChange={(e) => handleUpdateEditingAction('category', e.target.value)}
                      >
                        <option value="communication">コミュニケーション</option>
                        <option value="matching">マッチング</option>
                        <option value="content">コンテンツ</option>
                        <option value="feature">特別機能</option>
                        <option value="gift">ギフト</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        value={editingAction?.pointsForMen || 0}
                        onChange={(e) => handleUpdateEditingAction('pointsForMen', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        value={editingAction?.pointsForWomen || 0}
                        onChange={(e) => handleUpdateEditingAction('pointsForWomen', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        value={editingAction?.isActive ? 'active' : 'inactive'}
                        onChange={(e) => handleUpdateEditingAction('isActive', e.target.value === 'active')}
                      >
                        <option value="active">有効</option>
                        <option value="inactive">無効</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        value={editingAction?.applicableGenders || 'all'}
                        onChange={(e) => handleUpdateEditingAction('applicableGenders', e.target.value)}
                      >
                        <option value="all">全員</option>
                        <option value="men">男性のみ</option>
                        <option value="women">女性のみ</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => editingAction && handleSave(editingAction)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        キャンセル
                      </button>
                    </td>
                  </>
                ) : (
                  // 表示モード
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{action.name}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {CATEGORY_LABELS[action.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {action.pointsForMen > 0 ? (
                        <span className="text-red-600">-{action.pointsForMen}</span>
                      ) : (
                        <span className="text-green-600">+{Math.abs(action.pointsForMen)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {action.pointsForWomen > 0 ? (
                        <span className="text-red-600">-{action.pointsForWomen}</span>
                      ) : (
                        <span className="text-green-600">+{Math.abs(action.pointsForWomen)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center
                          ${action.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {action.isActive ? <FiCheck className="mr-1" /> : <FiX className="mr-1" />}
                        {action.isActive ? '有効' : '無効'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {GENDER_LABELS[action.applicableGenders]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(action)}
                        className="text-primary-600 hover:text-primary-900 mr-3 p-1 rounded hover:bg-gray-100"
                        title="編集"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => toggleActive(action.id)}
                        className={`mr-3 p-1 rounded hover:bg-gray-100 ${
                          action.isActive 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={action.isActive ? '無効化' : '有効化'}
                      >
                        <FiActivity className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* アクションがない場合 */}
      {filteredActions.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-500">該当するアクションが見つかりません</p>
        </div>
      )}
      
      {/* 新規アクション追加フォーム */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">新規課金アクション追加</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    アクション名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={newAction.name}
                    onChange={(e) => handleUpdateNewAction('name', e.target.value)}
                    placeholder="例: メッセージ送信"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={newAction.description}
                    onChange={(e) => handleUpdateNewAction('description', e.target.value)}
                    placeholder="例: 1通のメッセージを送信"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カテゴリ
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newAction.category}
                      onChange={(e) => handleUpdateNewAction('category', e.target.value)}
                    >
                      <option value="communication">コミュニケーション</option>
                      <option value="matching">マッチング</option>
                      <option value="content">コンテンツ</option>
                      <option value="feature">特別機能</option>
                      <option value="gift">ギフト</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      対象ユーザー
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newAction.applicableGenders}
                      onChange={(e) => handleUpdateNewAction('applicableGenders', e.target.value)}
                    >
                      <option value="all">全員</option>
                      <option value="men">男性のみ</option>
                      <option value="women">女性のみ</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      男性ポイント <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-1">（消費：正の値、獲得：負の値）</span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newAction.pointsForMen}
                      onChange={(e) => handleUpdateNewAction('pointsForMen', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      女性ポイント <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-1">（消費：正の値、獲得：負の値）</span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newAction.pointsForWomen}
                      onChange={(e) => handleUpdateNewAction('pointsForWomen', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input
                      id="is-active"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={newAction.isActive}
                      onChange={(e) => handleUpdateNewAction('isActive', e.target.checked)}
                    />
                    <label htmlFor="is-active" className="ml-2 block text-sm text-gray-900">
                      このアクションを有効にする
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 border-t pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setShowAddForm(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={handleAddAction}
                  disabled={!newAction.name || !newAction.description}
                >
                  <FiSave className="inline-block mr-2" />
                  保存
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 説明セクション */}
      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h3 className="font-medium text-blue-900 mb-2">課金アクションについて</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 男性ポイントがプラスの場合はポイント消費、マイナスの場合はポイント獲得を意味します</li>
          <li>• 女性ポイントがプラスの場合はポイント消費、マイナスの場合はポイント獲得を意味します</li>
          <li>• 有効/無効を切り替えることで、アクションの課金機能をオン/オフできます</li>
          <li>• アクション名と説明は、ユーザーに表示される内容です</li>
          <li>• カテゴリ別に課金アクションを整理すると、管理がしやすくなります</li>
          <li>• 対象ユーザーを設定することで、特定の性別のみに適用されるアクションを作成できます</li>
        </ul>
      </div>
      
      {/* ポイント設計のガイドライン */}
      <div className="bg-yellow-50 p-4 rounded-lg mt-4">
        <h3 className="font-medium text-yellow-900 mb-2">ポイント設計のガイドライン</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 基本的な通信機能（メッセージ）は5〜10ポイント程度が目安です</li>
          <li>• 特別な機能やブースト系は20〜50ポイント程度が目安です</li>
          <li>• 女性ユーザーにはポイント獲得（マイナス値）の設定を推奨します</li>
          <li>• 新規アクション追加時は少数のユーザーでテスト運用することをお勧めします</li>
        </ul>
      </div>
    </div>
  );
}
