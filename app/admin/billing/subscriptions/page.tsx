"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiXCircle, FiSearch, FiFilter, FiCalendar, FiUsers, FiPackage, FiStar } from 'react-icons/fi';
import Link from 'next/link';

// サブスクリプションプランの型定義
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  description?: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  pointsIncluded: number;
  applicableGenders: 'all' | 'men' | 'women';
  displayOrder: number;
  specialBadge?: string;
  createdAt: string;
  updatedAt: string;
  activeSubscribers: number;
}

// 性別表示用の定数
const GENDER_LABELS = {
  all: '全員',
  men: '男性のみ',
  women: '女性のみ',
};

// 期間表示用の定数
const PERIOD_LABELS = {
  monthly: '月額',
  quarterly: '3ヶ月',
  yearly: '年額',
};

// モックデータ - サブスクリプションプラン
const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'ベーシック',
    price: 980,
    period: 'monthly',
    description: '基本的な機能を利用できるエントリープラン',
    features: [
      'いいね！ 50回/日',
      'マッチング後メッセージ無制限',
      'プロフィール閲覧制限なし',
    ],
    isPopular: false,
    isActive: true,
    pointsIncluded: 100,
    applicableGenders: 'men',
    displayOrder: 1,
    createdAt: '2024-12-01',
    updatedAt: '2025-01-15',
    activeSubscribers: 2458,
  },
  {
    id: '2',
    name: 'プレミアム',
    price: 3600,
    period: 'monthly',
    description: '人気のスタンダードプラン、多くの特典付き',
    features: [
      'いいね！ 無制限',
      'マッチング後メッセージ無制限',
      'プロフィール閲覧制限なし',
      '既読表示機能',
      'マッチング優先表示',
      'プロフィールブースト 3回/月',
    ],
    isPopular: true,
    isActive: true,
    pointsIncluded: 500,
    applicableGenders: 'men',
    displayOrder: 2,
    createdAt: '2024-12-01',
    updatedAt: '2025-02-10',
    activeSubscribers: 5670,
  },
  {
    id: '3',
    name: 'VIP',
    price: 9800,
    period: 'monthly',
    description: '最高級の体験を提供する特別プラン',
    features: [
      'プレミアムのすべての機能',
      'VIP限定マッチング',
      '身分証明済みユーザーとのマッチング優先',
      'プロフィールブースト 10回/月',
      '24時間サポート',
      'デートプラン提案機能',
    ],
    isPopular: false,
    isActive: true,
    pointsIncluded: 2000,
    applicableGenders: 'men',
    displayOrder: 3,
    specialBadge: 'VIP',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-30',
    activeSubscribers: 943,
  },
  {
    id: '4',
    name: 'プレミアム年間プラン',
    price: 32800,
    period: 'yearly',
    description: '年間契約でお得なプレミアムプラン',
    features: [
      'プレミアムのすべての機能',
      '2ヶ月分無料（年間契約特典）',
      'プロフィールブースト 5回/月',
      '特別イベント優先参加権',
    ],
    isPopular: false,
    isActive: true,
    pointsIncluded: 6000,
    applicableGenders: 'men',
    displayOrder: 4,
    createdAt: '2025-01-10',
    updatedAt: '2025-03-01',
    activeSubscribers: 1248,
  },
  {
    id: '5',
    name: '春の特別プラン',
    price: 2800,
    period: 'monthly',
    description: '期間限定！春の特別キャンペーンプラン',
    features: [
      'いいね！ 100回/日',
      'マッチング後メッセージ無制限',
      'プロフィール閲覧制限なし',
      '既読表示機能',
      'プロフィールブースト 1回/月',
    ],
    isPopular: false,
    isActive: false,
    pointsIncluded: 300,
    applicableGenders: 'men',
    displayOrder: 0,
    specialBadge: '期間限定',
    createdAt: '2025-02-15',
    updatedAt: '2025-03-01',
    activeSubscribers: 0,
  },
];

// 編集用モーダルのProps定義
interface EditModalProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (plan: SubscriptionPlan) => void;
  isNewPlan: boolean;
}

// 編集モーダルコンポーネント
const EditModal: React.FC<EditModalProps> = ({ plan, onClose, onSave, isNewPlan }) => {
  // 初期値の設定
  const initialFormData: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt' | 'activeSubscribers'> = {
    name: '',
    price: 980,
    period: 'monthly',
    description: '',
    features: [''],
    isPopular: false,
    isActive: true,
    pointsIncluded: 100,
    applicableGenders: 'men',
    displayOrder: 99,
    specialBadge: '',
  };

  // フォームの状態管理
  const [formData, setFormData] = useState(
    plan ? {
      name: plan.name,
      price: plan.price,
      period: plan.period,
      description: plan.description || '',
      features: [...plan.features],
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      pointsIncluded: plan.pointsIncluded,
      applicableGenders: plan.applicableGenders,
      displayOrder: plan.displayOrder,
      specialBadge: plan.specialBadge || '',
    } : initialFormData
  );

  // 新しい特典フィールドを追加
  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  // 特典フィールドを削除
  const removeFeatureField = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  // 特典フィールドの値を更新
  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  // フォーム送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 空の特典フィールドを除去
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');
    
    // 新規プランの場合はIDを生成、既存プランの場合は既存のIDを使用
    const newPlan: SubscriptionPlan = {
      id: plan?.id || `new-${Date.now()}`,
      ...formData,
      features: filteredFeatures,
      createdAt: plan?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      activeSubscribers: plan?.activeSubscribers || 0,
    };
    
    onSave(newPlan);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {isNewPlan ? '新規サブスクリプションプラン' : 'サブスクリプションプランの編集'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FiXCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報セクション */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">プラン名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">価格（円） <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">課金期間 <span className="text-red-500">*</span></label>
                  <select
                    id="period"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value as 'monthly' | 'quarterly' | 'yearly'})}
                    required
                  >
                    <option value="monthly">月額</option>
                    <option value="quarterly">3ヶ月</option>
                    <option value="yearly">年額</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="pointsIncluded" className="block text-sm font-medium text-gray-700">付与ポイント <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="pointsIncluded"
                    min="0"
                    step="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.pointsIncluded}
                    onChange={(e) => setFormData({...formData, pointsIncluded: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700">表示順</label>
                  <input
                    type="number"
                    id="displayOrder"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500 mt-1">数値が小さいほど先に表示されます</p>
                </div>
                
                <div>
                  <label htmlFor="applicableGenders" className="block text-sm font-medium text-gray-700">対象性別 <span className="text-red-500">*</span></label>
                  <select
                    id="applicableGenders"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.applicableGenders}
                    onChange={(e) => setFormData({...formData, applicableGenders: e.target.value as 'all' | 'men' | 'women'})}
                    required
                  >
                    <option value="all">全員</option>
                    <option value="men">男性のみ</option>
                    <option value="women">女性のみ</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">説明</label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="specialBadge" className="block text-sm font-medium text-gray-700">特別バッジ</label>
                <input
                  type="text"
                  id="specialBadge"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.specialBadge}
                  onChange={(e) => setFormData({...formData, specialBadge: e.target.value})}
                  placeholder="例: VIP、期間限定等（空白の場合は表示されません）"
                />
              </div>
            </div>
            
            {/* オプションセクション */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900">オプション</h3>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="isPopular"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                  />
                  <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700">人気プランとして表示</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">有効にする</label>
                </div>
              </div>
            </div>
            
            {/* 特典リストセクション */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">特典リスト</h3>
                <button
                  type="button"
                  onClick={addFeatureField}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none"
                >
                  <FiPlus className="mr-1" /> 特典を追加
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`特典 ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800 focus:outline-none"
                      disabled={formData.features.length <= 1}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">少なくとも1つの特典を設定してください</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              {isNewPlan ? '作成' : '更新'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function SubscriptionsAdminPage() {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(initialSubscriptionPlans);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "monthly" | "quarterly" | "yearly">("all");
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // フィルタリングとソート
  const filteredAndSortedPlans = useMemo(() => {
    return [...subscriptionPlans]
      .filter(plan => {
        // 検索フィルタリング
        const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (plan.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        
        // 有効/無効フィルタリング
        const matchesActive = filterActive === "all" ||
                           (filterActive === "active" && plan.isActive) ||
                           (filterActive === "inactive" && !plan.isActive);
        
        // 期間フィルタリング
        const matchesPeriod = filterPeriod === "all" || plan.period === filterPeriod;
        
        return matchesSearch && matchesActive && matchesPeriod;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [subscriptionPlans, searchTerm, filterActive, filterPeriod]);
  
  // 統計データの計算
  const stats = useMemo(() => {
    const activePlans = subscriptionPlans.filter(p => p.isActive);
    return {
      totalPlans: subscriptionPlans.length,
      activePlans: activePlans.length,
      totalSubscribers: subscriptionPlans.reduce((acc, plan) => acc + plan.activeSubscribers, 0),
      avgPriceMonthly: activePlans.length ? 
        Math.round(activePlans.filter(p => p.period === 'monthly').reduce((acc, plan) => acc + plan.price, 0) / 
        activePlans.filter(p => p.period === 'monthly').length) : 0
    };
  }, [subscriptionPlans]);

  // プラン編集モードに設定
  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan({ ...plan });
    setIsNewPlan(false);
  };

  // 新規プラン作成モーダルを開く
  const handleNewPlan = () => {
    setEditingPlan(null);
    setIsNewPlan(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setEditingPlan(null);
    setIsNewPlan(false);
  };

  // プラン保存処理
  const handleSavePlan = (plan: SubscriptionPlan) => {
    if (isNewPlan) {
      setSubscriptionPlans([...subscriptionPlans, plan]);
    } else {
      setSubscriptionPlans(subscriptionPlans.map(p => p.id === plan.id ? plan : p));
    }
    setEditingPlan(null);
    setIsNewPlan(false);
  };

  // プラン削除前の確認
  const handleConfirmDelete = (id: string) => {
    setConfirmDelete(id);
  };

  // プラン削除処理
  const handleDeletePlan = (id: string) => {
    setSubscriptionPlans(subscriptionPlans.filter(plan => plan.id !== id));
    setConfirmDelete(null);
  };

  // キャンセル削除確認
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // プランの有効/無効を切り替え
  const toggleActive = (id: string) => {
    setSubscriptionPlans(subscriptionPlans.map(plan => 
      plan.id === id ? { ...plan, isActive: !plan.isActive } : plan
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">サブスクリプション管理</h1>
          <p className="text-gray-500 mt-1">月額・年額などの定期課金プランの設定</p>
        </div>
        <button
          onClick={handleNewPlan}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
        >
          <FiPlus className="mr-2" />
          <span>新規プラン追加</span>
        </button>
      </div>
      
      {/* 検索・フィルターセクション */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="プラン名や説明で検索"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FiFilter className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-md py-2 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as "all" | "active" | "inactive")}
            >
              <option value="all">全てのステータス</option>
              <option value="active">有効のみ</option>
              <option value="inactive">無効のみ</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <FiCalendar className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-md py-2 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as "all" | "monthly" | "quarterly" | "yearly")}
            >
              <option value="all">全ての期間</option>
              <option value="monthly">月額プラン</option>
              <option value="quarterly">3ヶ月プラン</option>
              <option value="yearly">年額プラン</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiPackage className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">有効なプラン</p>
              <p className="text-xl font-semibold">
                {stats.activePlans}/{stats.totalPlans}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">総会員数</p>
              <p className="text-xl font-semibold">
                {stats.totalSubscribers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiStar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">月額平均</p>
              <p className="text-xl font-semibold">
                ¥{stats.avgPriceMonthly.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">最終更新日</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* プラン一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
              plan.isPopular ? 'border-primary-500' : 'border-transparent'
            } ${!plan.isActive ? 'opacity-70' : ''}`}
          >
            {plan.isPopular && (
              <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
                人気プラン
              </div>
            )}
            
            {plan.specialBadge && !plan.isPopular && (
              <div className="bg-orange-500 text-white text-center py-1 text-sm font-medium">
                {plan.specialBadge}
              </div>
            )}
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-500 mt-1">{plan.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100"
                    title="編集"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(plan.id)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                    title="削除"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900">¥{plan.price.toLocaleString()}</span>
                <span className="text-lg text-gray-500 ml-1">/ {PERIOD_LABELS[plan.period]}</span>
              </div>
              
              <div className="mt-1 text-sm text-primary-600">
                <span>{plan.pointsIncluded.toLocaleString()} ポイント付与</span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">期間</p>
                  <p className="font-medium">{PERIOD_LABELS[plan.period]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">対象</p>
                  <p className="font-medium">{GENDER_LABELS[plan.applicableGenders]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">会員数</p>
                  <p className="font-medium">{plan.activeSubscribers.toLocaleString()} 人</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ステータス</p>
                  <span className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${
                    plan.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.isActive ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />}
                    {plan.isActive ? '有効' : '無効'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">特典</p>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-primary-600">
                      他 {plan.features.length - 3} 項目...
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleActive(plan.id)}
                  className={`w-full py-2 text-center rounded-md ${
                    plan.isActive
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {plan.isActive ? '無効にする' : '有効にする'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* プランが見つからない場合 */}
      {filteredAndSortedPlans.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-500">条件に一致するサブスクリプションプランが見つかりません</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterActive("all");
              setFilterPeriod("all");
            }}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            フィルターをクリア
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
            <h2 className="text-xl font-bold mb-4">プラン削除の確認</h2>
            <p className="text-gray-700 mb-6">このサブスクリプションプランを削除してもよろしいですか？この操作は取り消せません。</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeletePlan(confirmDelete)}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* 編集モーダル */}
      {(editingPlan !== null || isNewPlan) && (
        <EditModal
          plan={editingPlan}
          onClose={handleCloseModal}
          onSave={handleSavePlan}
          isNewPlan={isNewPlan}
        />
      )}
      
      {/* 説明セクション */}
      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h3 className="font-medium text-blue-900 mb-2">サブスクリプションプラン設定について</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 「人気プラン」は特別な表示でユーザーに推奨されます</li>
          <li>• プランに付与されるポイントは、購入時に一括で付与されます</li>
          <li>• 現在は男性ユーザーのみが有料サブスクリプションに登録できます</li>
          <li>• 年間プランはユーザーの継続率を高める効果があります</li>
          <li>• 各プランの特典は明確に記載し、上位プランほど魅力的な特典を設定してください</li>
        </ul>
      </div>
      
      {/* 運用のヒント */}
      <div className="bg-yellow-50 p-4 rounded-lg mt-4">
        <h3 className="font-medium text-yellow-900 mb-2">サブスクリプション運用のヒント</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 3種類のプランを基本として提供し、中間価格帯のプランを「人気」として推奨すると効果的です</li>
          <li>• 年間プランには1〜2ヶ月分の割引を設定すると、長期契約を促進できます</li>
          <li>• 各プランにポイントを付与することで、サブスクリプション登録の価値を高められます</li>
          <li>• 定期的に期間限定プランを提供することで、登録率の向上が期待できます</li>
        </ul>
      </div>
    </div>
  );
}
