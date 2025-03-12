"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiXCircle, FiSearch, FiFilter, FiDollarSign, FiPercent, FiClock } from 'react-icons/fi';
import Link from 'next/link';

// ポイントプランの型定義
interface PointPlan {
  id: string;
  name: string;
  points: number;
  price: number;
  discount: number;
  isPopular: boolean;
  isActive: boolean;
  limitedTime: boolean;
  limitedTimeEnd?: string;
  description?: string;
  displayOrder: number;
  applicableGenders: 'all' | 'men' | 'women';
}

// 性別表示用の定数
const GENDER_LABELS = {
  all: '全員',
  men: '男性のみ',
  women: '女性のみ',
};

// モックデータ - ポイントプラン
const initialPointPlans: PointPlan[] = [
  {
    id: '1',
    name: 'スターターパック',
    points: 500,
    price: 980,
    discount: 0,
    isPopular: false,
    isActive: true,
    limitedTime: false,
    description: '初めての方におすすめのスターターパック',
    displayOrder: 1,
    applicableGenders: 'men',
  },
  {
    id: '2',
    name: 'スタンダードパック',
    points: 1500,
    price: 2800,
    discount: 5,
    isPopular: true,
    isActive: true,
    limitedTime: false,
    description: '最もお得な標準パック',
    displayOrder: 2,
    applicableGenders: 'men',
  },
  {
    id: '3',
    name: 'プレミアムパック',
    points: 3000,
    price: 4800,
    discount: 10,
    isPopular: false,
    isActive: true,
    limitedTime: false,
    description: '長期利用の方におすすめ',
    displayOrder: 3,
    applicableGenders: 'men',
  },
  {
    id: '4',
    name: 'VIPパック',
    points: 10000,
    price: 12000,
    discount: 20,
    isPopular: false,
    isActive: true,
    limitedTime: false,
    description: '真剣な出会いを求める方向け最上級パッケージ',
    displayOrder: 4,
    applicableGenders: 'men',
  },
  {
    id: '5',
    name: '春の特別パック',
    points: 2000,
    price: 3000,
    discount: 15,
    isPopular: false,
    isActive: true,
    limitedTime: true,
    limitedTimeEnd: '2025-04-30',
    description: '期間限定！春の特別キャンペーン',
    displayOrder: 0,
    applicableGenders: 'men',
  },
];

// 編集用モーダルコンポーネント
interface EditModalProps {
  plan: PointPlan | null;
  onClose: () => void;
  onSave: (plan: PointPlan) => void;
  isNewPlan: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ plan, onClose, onSave, isNewPlan }) => {
  const [editedPlan, setEditedPlan] = useState<PointPlan>(plan || {
    id: String(Date.now()),
    name: '',
    points: 0,
    price: 0,
    discount: 0,
    isPopular: false,
    isActive: true,
    limitedTime: false,
    description: '',
    displayOrder: 999,
    applicableGenders: 'men',
  });

  const handleChange = (field: keyof PointPlan, value: any) => {
    setEditedPlan(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">{isNewPlan ? 'ポイントプラン新規作成' : 'ポイントプラン編集'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">プラン名</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedPlan.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ポイント数</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedPlan.points}
              onChange={(e) => handleChange('points', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">価格（円）</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedPlan.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">割引率（%）</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedPlan.discount}
              onChange={(e) => handleChange('discount', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示順序</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedPlan.displayOrder}
              onChange={(e) => handleChange('displayOrder', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">対象ユーザー</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedPlan.applicableGenders}
              onChange={(e) => handleChange('applicableGenders', e.target.value)}
            >
              <option value="all">全員</option>
              <option value="men">男性のみ</option>
              <option value="women">女性のみ</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              value={editedPlan.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-primary-600 rounded border-gray-300"
              checked={editedPlan.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">有効</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPopular"
              className="h-4 w-4 text-primary-600 rounded border-gray-300"
              checked={editedPlan.isPopular}
              onChange={(e) => handleChange('isPopular', e.target.checked)}
            />
            <label htmlFor="isPopular" className="ml-2 text-sm text-gray-700">人気プラン</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="limitedTime"
              className="h-4 w-4 text-primary-600 rounded border-gray-300"
              checked={editedPlan.limitedTime}
              onChange={(e) => handleChange('limitedTime', e.target.checked)}
            />
            <label htmlFor="limitedTime" className="ml-2 text-sm text-gray-700">期間限定</label>
          </div>
        </div>
        
        {editedPlan.limitedTime && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedPlan.limitedTimeEnd || ''}
              onChange={(e) => handleChange('limitedTimeEnd', e.target.value)}
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={() => onSave(editedPlan)}
            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function PointPlansAdminPage() {
  const [pointPlans, setPointPlans] = useState<PointPlan[]>(initialPointPlans);
  const [editingPlan, setEditingPlan] = useState<PointPlan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [filterGender, setFilterGender] = useState<"all" | "men" | "women">("all");

  // プランを編集モードに設定
  const handleEdit = (plan: PointPlan) => {
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
  const handleSavePlan = (plan: PointPlan) => {
    if (isNewPlan) {
      setPointPlans([...pointPlans, plan]);
    } else {
      setPointPlans(pointPlans.map(p => p.id === plan.id ? plan : p));
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
    setPointPlans(pointPlans.filter(plan => plan.id !== id));
    setConfirmDelete(null);
  };

  // キャンセル削除確認
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // プランの有効/無効を切り替え
  const toggleActive = (id: string) => {
    setPointPlans(pointPlans.map(plan => 
      plan.id === id ? { ...plan, isActive: !plan.isActive } : plan
    ));
  };

  // フィルタリングとソート
  const filteredAndSortedPlans = useMemo(() => {
    return [...pointPlans]
      .filter(plan => {
        // 検索フィルタリング
        const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (plan.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        
        // 有効/無効フィルタリング
        const matchesActive = filterActive === "all" ||
                           (filterActive === "active" && plan.isActive) ||
                           (filterActive === "inactive" && !plan.isActive);
        
        // 性別フィルタリング
        const matchesGender = filterGender === "all" ||
                           plan.applicableGenders === "all" ||
                           plan.applicableGenders === filterGender;
        
        return matchesSearch && matchesActive && matchesGender;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [pointPlans, searchTerm, filterActive, filterGender]);

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
          <h1 className="text-2xl font-bold text-gray-800">ポイントプラン管理</h1>
          <p className="text-gray-500 mt-1">ユーザーが購入できるポイントプランの設定</p>
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
            <select
              className="border border-gray-300 rounded-md py-2 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as "all" | "men" | "women")}
            >
              <option value="all">全ての性別</option>
              <option value="men">男性向け</option>
              <option value="women">女性向け</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">有効なプラン数</p>
              <p className="text-xl font-semibold">
                {pointPlans.filter(p => p.isActive).length}/{pointPlans.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiPercent className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">最大割引率</p>
              <p className="text-xl font-semibold">
                {Math.max(...pointPlans.map(p => p.discount))}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">期間限定プラン</p>
              <p className="text-xl font-semibold">
                {pointPlans.filter(p => p.limitedTime).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* プラン一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
              plan.isPopular ? 'border-primary-500' : 'border-transparent'
            } ${!plan.isActive ? 'opacity-60' : ''}`}
          >
            {plan.isPopular && (
              <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
                人気プラン
              </div>
            )}
            
            {plan.limitedTime && (
              <div className="bg-orange-500 text-white text-center py-1 text-sm font-medium">
                期間限定！{plan.limitedTimeEnd ? `（〜${plan.limitedTimeEnd}）` : ''}
              </div>
            )}
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-500 mt-1">{plan.description}</p>
                </div>
                <div className="flex">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-gray-600 hover:text-primary-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(plan.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900">¥{plan.price.toLocaleString()}</span>
                <span className="text-lg text-gray-500 ml-1">/ {plan.points.toLocaleString()} ポイント</span>
              </div>
              
              <div className="mt-1 text-sm text-gray-600">
                <span>1ポイント = ¥{(plan.price / plan.points).toFixed(2)}</span>
              </div>
              
              {plan.discount > 0 && (
                <p className="mt-1 text-sm text-green-600">
                  {plan.discount}% OFF
                </p>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  plan.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.isActive ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />}
                  {plan.isActive ? '有効' : '無効'}
                </span>
                
                <span className="text-sm text-gray-600">
                  {GENDER_LABELS[plan.applicableGenders]}
                </span>
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

      {/* プランがない場合 */}
      {pointPlans.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-500">ポイントプランが設定されていません</p>
          <button
            onClick={handleNewPlan}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            新規プラン追加
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
            <p className="text-gray-700 mb-6">このポイントプランを削除してもよろしいですか？この操作は取り消せません。</p>
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

      {/* プランが見つからない場合 */}
      {filteredAndSortedPlans.length === 0 && searchTerm && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center mb-6">
          <p className="text-lg text-gray-500">検索条件に一致するプランが見つかりませんでした</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            検索をクリア
          </button>
        </div>
      )}

      {/* 説明セクション */}
      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h3 className="font-medium text-blue-900 mb-2">ポイントプラン設定について</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 表示順序が小さいほど、ユーザーに先に表示されます</li>
          <li>• 「人気プラン」は特別な表示でユーザーに推奨されます</li>
          <li>• 期間限定プランは終了日を過ぎると自動的に表示されなくなります</li>
          <li>• 現在は男性ユーザーのみがポイントを購入できる設定になっています</li>
          <li>• 最も高い割引率のプランはユーザーに「お得」として表示されます</li>
          <li>• 1ポイントあたりの単価が低いプランほど、ユーザーにとって価値が高くなります</li>
        </ul>
      </div>
      
      {/* 運用のヒント */}
      <div className="bg-yellow-50 p-4 rounded-lg mt-4">
        <h3 className="font-medium text-yellow-900 mb-2">プラン運用のヒント</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 期間限定プランを定期的に更新することで、購入率が高まる傾向があります</li>
          <li>• 高額プランには20%以上の割引を設定すると、大口購入が促進されます</li>
          <li>• ポイント購入の平均単価は、基本アクション（メッセージ送信など）の5〜10倍が理想的です</li>
          <li>• 最低でも3種類のプランを用意し、中間のプランを「お得」として推奨するとコンバージョンが高まります</li>
        </ul>
      </div>
    </div>
  );
}
