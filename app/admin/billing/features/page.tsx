"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlusCircle, FiStar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import Link from 'next/link';

// 特別機能の型定義
interface SpecialFeature {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  duration: string; // '24h', '7d', '30d', 'permanent'
  requiredSubscription: string[]; // ['basic', 'premium', 'vip']
  isActive: boolean;
  category: 'communication' | 'matching' | 'profile' | 'accessibility' | 'privacy';
  applicableGenders: 'all' | 'men' | 'women';
  icon: string;
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
  profile: 'プロフィール',
  accessibility: 'アクセシビリティ',
  privacy: 'プライバシー',
};

// 期間表示用の定数
const DURATION_LABELS = {
  '24h': '24時間',
  '7d': '7日間',
  '30d': '30日間',
  'permanent': '永続',
};

// サブスクリプション表示用の定数
const SUBSCRIPTION_LABELS = {
  'free': '無料プラン',
  'basic': 'ベーシック',
  'premium': 'プレミアム',
  'vip': 'VIP',
};

// モックデータ - 特別機能
const initialSpecialFeatures: SpecialFeature[] = [
  {
    id: '1',
    name: 'プロフィールブースト',
    description: '24時間、検索結果の上位に表示されます',
    pointCost: 50,
    duration: '24h',
    requiredSubscription: ['free', 'basic', 'premium', 'vip'],
    isActive: true,
    category: 'profile',
    applicableGenders: 'all',
    icon: '⚡',
  },
  {
    id: '2',
    name: '既読確認',
    description: 'メッセージの既読状態を確認できます',
    pointCost: 20,
    duration: '7d',
    requiredSubscription: ['basic', 'premium', 'vip'],
    isActive: true,
    category: 'communication',
    applicableGenders: 'all',
    icon: '👁️',
  },
  {
    id: '3',
    name: 'スーパーいいね！',
    description: '通常より3倍目立つ特別ないいね！を送信',
    pointCost: 30,
    duration: 'permanent',
    requiredSubscription: ['free', 'basic', 'premium', 'vip'],
    isActive: true,
    category: 'matching',
    applicableGenders: 'all',
    icon: '❤️',
  },
  {
    id: '4',
    name: 'VIP検索フィルター',
    description: '詳細条件で相手を検索できる高度なフィルター',
    pointCost: 100,
    duration: '30d',
    requiredSubscription: ['premium', 'vip'],
    isActive: true,
    category: 'matching',
    applicableGenders: 'all',
    icon: '🔍',
  },
  {
    id: '5',
    name: 'シークレットモード',
    description: 'プロフィール閲覧履歴を残さずに相手を見られます',
    pointCost: 30,
    duration: '24h',
    requiredSubscription: ['basic', 'premium', 'vip'],
    isActive: true,
    category: 'privacy',
    applicableGenders: 'all',
    icon: '🕵️',
  },
  {
    id: '6',
    name: 'リマッチング',
    description: '過去にスキップした相手ともう一度マッチングチャンス',
    pointCost: 25,
    duration: 'permanent',
    requiredSubscription: ['free', 'basic', 'premium', 'vip'],
    isActive: true,
    category: 'matching',
    applicableGenders: 'all',
    icon: '🔄',
  },
  {
    id: '7',
    name: '位置情報共有',
    description: 'マッチングした相手と現在地を共有',
    pointCost: 15,
    duration: '24h',
    requiredSubscription: ['basic', 'premium', 'vip'],
    isActive: false,
    category: 'communication',
    applicableGenders: 'all',
    icon: '📍',
  },
  {
    id: '8',
    name: 'プレミアムプロフィール',
    description: 'プロフィールにビデオや追加写真を設定可能',
    pointCost: 80,
    duration: '30d',
    requiredSubscription: ['premium', 'vip'],
    isActive: true,
    category: 'profile',
    applicableGenders: 'all',
    icon: '🌟',
  },
];

// 編集用モーダルコンポーネント
interface EditModalProps {
  feature: SpecialFeature | null;
  onClose: () => void;
  onSave: (feature: SpecialFeature) => void;
  isNewFeature: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ feature, onClose, onSave, isNewFeature }) => {
  const [editedFeature, setEditedFeature] = useState<SpecialFeature>(feature || {
    id: String(Date.now()),
    name: '',
    description: '',
    pointCost: 0,
    duration: '24h',
    requiredSubscription: ['free', 'basic', 'premium', 'vip'],
    isActive: true,
    category: 'communication',
    applicableGenders: 'all',
    icon: '⭐',
  });

  const handleChange = (field: keyof SpecialFeature, value: any) => {
    setEditedFeature(prev => ({ ...prev, [field]: value }));
  };

  const handleSubscriptionChange = (subscription: string, checked: boolean) => {
    const newSubscriptions = checked
      ? [...editedFeature.requiredSubscription, subscription]
      : editedFeature.requiredSubscription.filter(sub => sub !== subscription);
    
    setEditedFeature(prev => ({
      ...prev,
      requiredSubscription: newSubscriptions,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">{isNewFeature ? '特別機能新規作成' : '特別機能編集'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">機能名</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedFeature.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">アイコン</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedFeature.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              placeholder="絵文字を入力 (例: ⭐)"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              value={editedFeature.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ポイントコスト</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedFeature.pointCost}
              onChange={(e) => handleChange('pointCost', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">有効期間</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedFeature.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
            >
              <option value="24h">24時間</option>
              <option value="7d">7日間</option>
              <option value="30d">30日間</option>
              <option value="permanent">永続</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedFeature.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="communication">コミュニケーション</option>
              <option value="matching">マッチング</option>
              <option value="profile">プロフィール</option>
              <option value="accessibility">アクセシビリティ</option>
              <option value="privacy">プライバシー</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">対象ユーザー</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedFeature.applicableGenders}
              onChange={(e) => handleChange('applicableGenders', e.target.value)}
            >
              <option value="all">全員</option>
              <option value="men">男性のみ</option>
              <option value="women">女性のみ</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">必要サブスクリプション</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {['free', 'basic', 'premium', 'vip'].map(subscription => (
                <div key={subscription} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`subscription-${subscription}`}
                    className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    checked={editedFeature.requiredSubscription.includes(subscription)}
                    onChange={(e) => handleSubscriptionChange(subscription, e.target.checked)}
                  />
                  <label htmlFor={`subscription-${subscription}`} className="ml-2 text-sm text-gray-700">
                    {SUBSCRIPTION_LABELS[subscription as keyof typeof SUBSCRIPTION_LABELS]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-primary-600 rounded border-gray-300"
            checked={editedFeature.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">有効</label>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={() => onSave(editedFeature)}
            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function SpecialFeaturesAdminPage() {
  const [specialFeatures, setSpecialFeatures] = useState<SpecialFeature[]>(initialSpecialFeatures);
  const [editingFeature, setEditingFeature] = useState<SpecialFeature | null>(null);
  const [isNewFeature, setIsNewFeature] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // フィルター適用後の機能一覧を取得
  const filteredFeatures = specialFeatures.filter(feature => {
    return selectedCategory === 'all' || feature.category === selectedCategory;
  });

  // 機能を編集モードに設定
  const handleEdit = (feature: SpecialFeature) => {
    setEditingFeature({ ...feature });
    setIsNewFeature(false);
  };

  // 新規機能作成モーダルを開く
  const handleNewFeature = () => {
    setEditingFeature(null);
    setIsNewFeature(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setEditingFeature(null);
    setIsNewFeature(false);
  };

  // 機能保存処理
  const handleSaveFeature = (feature: SpecialFeature) => {
    if (isNewFeature) {
      setSpecialFeatures([...specialFeatures, feature]);
    } else {
      setSpecialFeatures(specialFeatures.map(f => f.id === feature.id ? feature : f));
    }
    setEditingFeature(null);
    setIsNewFeature(false);
  };

  // 機能削除前の確認
  const handleConfirmDelete = (id: string) => {
    setConfirmDelete(id);
  };

  // 機能削除処理
  const handleDeleteFeature = (id: string) => {
    setSpecialFeatures(specialFeatures.filter(feature => feature.id !== id));
    setConfirmDelete(null);
  };

  // キャンセル削除確認
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // 機能の有効/無効を切り替え
  const toggleActive = (id: string) => {
    setSpecialFeatures(specialFeatures.map(feature => 
      feature.id === id ? { ...feature, isActive: !feature.isActive } : feature
    ));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-4">
        <Link href="/admin/billing" className="flex items-center text-gray-600 hover:text-gray-900">
          <FiArrowLeft className="mr-2" />
          <span>課金管理に戻る</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">特別機能管理</h1>
          <p className="text-gray-500 mt-1">追加料金で利用できる特別機能の設定</p>
        </div>
        <button
          onClick={handleNewFeature}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
        >
          <FiPlusCircle className="mr-2" />
          <span>新規機能追加</span>
        </button>
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 機能一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              !feature.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-2xl mr-2" role="img" aria-label={feature.name}>
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{feature.name}</h3>
                    <p className="text-gray-500 mt-1 text-sm">{feature.description}</p>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => handleEdit(feature)}
                    className="p-2 text-gray-600 hover:text-primary-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(feature.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <span className="text-2xl font-extrabold text-gray-900">{feature.pointCost}</span>
                <span className="text-lg text-gray-500 ml-1">ポイント</span>
                <span className="text-sm text-blue-600 ml-3 bg-blue-50 px-2 py-1 rounded-full">
                  {DURATION_LABELS[feature.duration as keyof typeof DURATION_LABELS]}
                </span>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1">
                {feature.requiredSubscription.map(sub => (
                  <span key={sub} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {SUBSCRIPTION_LABELS[sub as keyof typeof SUBSCRIPTION_LABELS]}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  feature.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {feature.isActive ? '有効' : '無効'}
                </span>
                
                <span className="text-sm text-gray-600">
                  {GENDER_LABELS[feature.applicableGenders]}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleActive(feature.id)}
                  className="w-full py-2 text-center rounded-md flex items-center justify-center"
                >
                  {feature.isActive ? (
                    <>
                      <FiToggleRight className="mr-2 text-green-600 text-lg" />
                      <span className="text-green-600">有効</span>
                    </>
                  ) : (
                    <>
                      <FiToggleLeft className="mr-2 text-gray-600 text-lg" />
                      <span className="text-gray-600">無効</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 機能がない場合 */}
      {filteredFeatures.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-500">該当する特別機能が見つかりません</p>
          <button
            onClick={handleNewFeature}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            新規機能追加
          </button>
        </div>
      )}

      {/* 削除確認モーダル */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">機能削除の確認</h2>
            <p className="text-gray-700 mb-6">この特別機能を削除してもよろしいですか？この操作は取り消せません。</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeleteFeature(confirmDelete)}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 編集モーダル */}
      {(editingFeature !== null || isNewFeature) && (
        <EditModal
          feature={editingFeature}
          onClose={handleCloseModal}
          onSave={handleSaveFeature}
          isNewFeature={isNewFeature}
        />
      )}

      {/* 説明セクション */}
      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h3 className="font-medium text-blue-900 mb-2">特別機能設定について</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 特別機能は追加料金（ポイント）で利用できる機能です</li>
          <li>• 各機能は有効期間が設定でき、永続的なものと期間限定のものがあります</li>
          <li>• 必要サブスクリプションを設定すると、そのプラン以上のユーザーのみが利用できます</li>
          <li>• アイコンは絵文字を使用してください（Unicode絵文字）</li>
        </ul>
      </div>
    </div>
  );
}
