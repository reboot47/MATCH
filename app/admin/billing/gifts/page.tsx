"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiImage, FiDollarSign, FiHeart } from 'react-icons/fi';
import Link from 'next/link';

// ギフトの型定義
interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pointCost: number;
  popularity: number; // 0-100の人気度
  category: 'basic' | 'romantic' | 'seasonal' | 'luxury' | 'funny';
  isActive: boolean;
  isLimited: boolean;
  limitedTimeEnd?: string;
  receiverPointsGain: number; // 受け取り側が獲得するポイント
}

// カテゴリ表示用の定数
const CATEGORY_LABELS = {
  basic: '基本',
  romantic: 'ロマンチック',
  seasonal: '季節限定',
  luxury: '高級',
  funny: 'おもしろ',
};

// モックデータ - ギフト
const initialGifts: Gift[] = [
  {
    id: '1',
    name: '花束',
    description: '気持ちを伝える定番の花束ギフト',
    imageUrl: '/gifts/flower-bouquet.png',
    pointCost: 30,
    popularity: 85,
    category: 'romantic',
    isActive: true,
    isLimited: false,
    receiverPointsGain: 15,
  },
  {
    id: '2',
    name: 'チョコレート',
    description: '甘い気持ちを伝えるチョコレート',
    imageUrl: '/gifts/chocolate.png',
    pointCost: 20,
    popularity: 80,
    category: 'basic',
    isActive: true,
    isLimited: false,
    receiverPointsGain: 10,
  },
  {
    id: '3',
    name: 'ダイヤモンドリング',
    description: '最高級の輝きを持つリング、特別な人へ',
    imageUrl: '/gifts/diamond-ring.png',
    pointCost: 500,
    popularity: 60,
    category: 'luxury',
    isActive: true,
    isLimited: false,
    receiverPointsGain: 200,
  },
  {
    id: '4',
    name: '桜の花びら',
    description: '春の訪れを感じさせる桜のギフト',
    imageUrl: '/gifts/sakura.png',
    pointCost: 25,
    popularity: 70,
    category: 'seasonal',
    isActive: true,
    isLimited: true,
    limitedTimeEnd: '2025-04-30',
    receiverPointsGain: 12,
  },
  {
    id: '5',
    name: 'ビールジョッキ',
    description: '乾杯の気持ちを伝えるギフト',
    imageUrl: '/gifts/beer.png',
    pointCost: 15,
    popularity: 75,
    category: 'funny',
    isActive: true,
    isLimited: false,
    receiverPointsGain: 7,
  },
  {
    id: '6',
    name: '高級時計',
    description: 'あなたとの時間を大切にという想いを込めて',
    imageUrl: '/gifts/watch.png',
    pointCost: 300,
    popularity: 50,
    category: 'luxury',
    isActive: true,
    isLimited: false,
    receiverPointsGain: 120,
  },
  {
    id: '7',
    name: 'クリスマスツリー',
    description: '季節限定のクリスマスギフト',
    imageUrl: '/gifts/christmas-tree.png',
    pointCost: 50,
    popularity: 40,
    category: 'seasonal',
    isActive: false,
    isLimited: true,
    limitedTimeEnd: '2025-12-25',
    receiverPointsGain: 20,
  },
  {
    id: '8',
    name: 'ハート風船',
    description: '気持ちを膨らませる可愛いハートの風船',
    imageUrl: '/gifts/heart-balloon.png',
    pointCost: 15,
    popularity: 90,
    category: 'romantic',
    isActive: true,
    isLimited: false,
    receiverPointsGain: 7,
  },
];

// 編集用モーダルコンポーネント
interface EditModalProps {
  gift: Gift | null;
  onClose: () => void;
  onSave: (gift: Gift) => void;
  isNewGift: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ gift, onClose, onSave, isNewGift }) => {
  const [editedGift, setEditedGift] = useState<Gift>(gift || {
    id: String(Date.now()),
    name: '',
    description: '',
    imageUrl: '',
    pointCost: 0,
    popularity: 50,
    category: 'basic',
    isActive: true,
    isLimited: false,
    receiverPointsGain: 0,
  });

  const handleChange = (field: keyof Gift, value: any) => {
    setEditedGift(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">{isNewGift ? 'ギフト新規作成' : 'ギフト編集'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ギフト名</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedGift.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedGift.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="basic">基本</option>
              <option value="romantic">ロマンチック</option>
              <option value="seasonal">季節限定</option>
              <option value="luxury">高級</option>
              <option value="funny">おもしろ</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              value={editedGift.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">画像URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedGift.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">人気度 (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedGift.popularity}
              onChange={(e) => handleChange('popularity', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">送信側コスト (ポイント)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedGift.pointCost}
              onChange={(e) => handleChange('pointCost', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">受信側獲得ポイント</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedGift.receiverPointsGain}
              onChange={(e) => handleChange('receiverPointsGain', Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-primary-600 rounded border-gray-300"
              checked={editedGift.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">有効</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isLimited"
              className="h-4 w-4 text-primary-600 rounded border-gray-300"
              checked={editedGift.isLimited}
              onChange={(e) => handleChange('isLimited', e.target.checked)}
            />
            <label htmlFor="isLimited" className="ml-2 text-sm text-gray-700">期間限定</label>
          </div>
        </div>
        
        {editedGift.isLimited && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editedGift.limitedTimeEnd || ''}
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
            onClick={() => onSave(editedGift)}
            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function GiftsAdminPage() {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [isNewGift, setIsNewGift] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // フィルター適用後のギフト一覧を取得
  const filteredGifts = gifts.filter(gift => {
    return selectedCategory === 'all' || gift.category === selectedCategory;
  });

  // ギフトを編集モードに設定
  const handleEdit = (gift: Gift) => {
    setEditingGift({ ...gift });
    setIsNewGift(false);
  };

  // 新規ギフト作成モーダルを開く
  const handleNewGift = () => {
    setEditingGift(null);
    setIsNewGift(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setEditingGift(null);
    setIsNewGift(false);
  };

  // ギフト保存処理
  const handleSaveGift = (gift: Gift) => {
    if (isNewGift) {
      setGifts([...gifts, gift]);
    } else {
      setGifts(gifts.map(g => g.id === gift.id ? gift : g));
    }
    setEditingGift(null);
    setIsNewGift(false);
  };

  // ギフト削除前の確認
  const handleConfirmDelete = (id: string) => {
    setConfirmDelete(id);
  };

  // ギフト削除処理
  const handleDeleteGift = (id: string) => {
    setGifts(gifts.filter(gift => gift.id !== id));
    setConfirmDelete(null);
  };

  // キャンセル削除確認
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // ギフトの有効/無効を切り替え
  const toggleActive = (id: string) => {
    setGifts(gifts.map(gift => 
      gift.id === id ? { ...gift, isActive: !gift.isActive } : gift
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
          <h1 className="text-2xl font-bold text-gray-800">ギフト管理</h1>
          <p className="text-gray-500 mt-1">ユーザー間で送り合うギフトの設定</p>
        </div>
        <button
          onClick={handleNewGift}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
        >
          <FiPlus className="mr-2" />
          <span>新規ギフト追加</span>
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

      {/* ギフト一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              !gift.isActive ? 'opacity-60' : ''
            }`}
          >
            {gift.isLimited && (
              <div className="bg-orange-500 text-white text-center py-1 text-sm font-medium">
                期間限定！{gift.limitedTimeEnd ? `（〜${gift.limitedTimeEnd}）` : ''}
              </div>
            )}
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{gift.name}</h3>
                <div className="flex">
                  <button
                    onClick={() => handleEdit(gift)}
                    className="p-2 text-gray-600 hover:text-primary-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(gift.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-500 mt-1 text-sm">{gift.description}</p>
              
              <div className="flex justify-center my-4 h-36 bg-gray-100 rounded-md overflow-hidden items-center">
                {gift.imageUrl ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <FiImage className="text-4xl" />
                    </div>
                    <img
                      src={gift.imageUrl}
                      alt={gift.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-gray-400">
                    <FiImage className="text-4xl" />
                    <span className="ml-2">画像なし</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <FiDollarSign className="text-green-600 mr-1" />
                  <span className="text-lg font-semibold">{gift.pointCost} pt</span>
                </div>
                <div className="flex items-center">
                  <FiHeart className="text-red-500 mr-1" />
                  <span className="text-sm">人気度: {gift.popularity}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-blue-600">受取: +{gift.receiverPointsGain} pt</span>
                <span className={`px-2 py-1 rounded-full ${
                  gift.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {gift.isActive ? '有効' : '無効'}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleActive(gift.id)}
                  className={`w-full py-2 text-center rounded-md ${
                    gift.isActive
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {gift.isActive ? '無効にする' : '有効にする'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ギフトがない場合 */}
      {filteredGifts.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-500">該当するギフトが見つかりません</p>
          <button
            onClick={handleNewGift}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            新規ギフト追加
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
            <h2 className="text-xl font-bold mb-4">ギフト削除の確認</h2>
            <p className="text-gray-700 mb-6">このギフトを削除してもよろしいですか？この操作は取り消せません。</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeleteGift(confirmDelete)}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 編集モーダル */}
      {(editingGift !== null || isNewGift) && (
        <EditModal
          gift={editingGift}
          onClose={handleCloseModal}
          onSave={handleSaveGift}
          isNewGift={isNewGift}
        />
      )}

      {/* 説明セクション */}
      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h3 className="font-medium text-blue-900 mb-2">ギフト設定について</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• ギフトは男性ユーザーから女性ユーザーへ送ることで、感謝の気持ちを伝えるアイテムです</li>
          <li>• 送信側はポイントを消費し、受信側はポイントを獲得します</li>
          <li>• 期間限定ギフトは特別なイベントやシーズンに合わせて提供できます</li>
          <li>• 人気度の高いギフトはユーザーインターフェースで目立つ位置に表示されます</li>
        </ul>
      </div>
    </div>
  );
}
