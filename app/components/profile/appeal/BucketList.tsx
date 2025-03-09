"use client";

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { BucketListItem } from '@/app/types/profile';
import { toast } from 'react-hot-toast';

interface BucketListProps {
  items: BucketListItem[];
  onUpdate: (items: BucketListItem[]) => Promise<boolean>;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

// カテゴリーの定義
const CATEGORIES = [
  { value: 'travel', label: '旅行', icon: '✈️' },
  { value: 'experience', label: '体験', icon: '🌟' },
  { value: 'achievement', label: '達成', icon: '🏆' },
  { value: 'learning', label: '学習', icon: '📚' },
  { value: 'other', label: 'その他', icon: '🔖' }
];

// 優先度の定義
const PRIORITIES = [
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: '高', color: 'bg-red-100 text-red-800' }
];

export default function BucketList({
  items,
  onUpdate,
  isUpdating = false,
  isViewOnly = false
}: BucketListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<BucketListItem | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'pending' | 'completed'>('all');
  
  const [formData, setFormData] = useState<Partial<BucketListItem>>({
    category: 'travel',
    title: '',
    description: '',
    priority: 'medium',
    isCompleted: false
  });
  
  // フォームデータをリセット
  const resetForm = () => {
    setFormData({
      category: 'travel',
      title: '',
      description: '',
      priority: 'medium',
      isCompleted: false
    });
    setEditing(null);
  };
  
  // フォーム入力の変更処理
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // アイテムを保存
  const saveItem = async () => {
    if (!formData.category || !formData.title) {
      toast.error('必須項目を入力してください');
      return;
    }
    
    try {
      let updatedItems: BucketListItem[];
      
      if (editing) {
        // 既存のアイテムを更新
        updatedItems = items.map(item => 
          item.id === editing.id 
            ? { ...item, ...formData as BucketListItem }
            : item
        );
      } else {
        // 新規アイテムを追加
        const newItem: BucketListItem = {
          id: `bucket_${Date.now()}`,
          category: formData.category as 'travel' | 'experience' | 'achievement' | 'learning' | 'other',
          title: formData.title || '',
          description: formData.description,
          priority: formData.priority as 'low' | 'medium' | 'high',
          isCompleted: formData.isCompleted || false
        };
        updatedItems = [...items, newItem];
      }
      
      const success = await onUpdate(updatedItems);
      if (success) {
        toast.success(editing ? 'バケットリストを更新しました' : 'バケットリストに追加しました');
        setIsAdding(false);
        resetForm();
      }
    } catch (error) {
      console.error('バケットリスト保存エラー:', error);
      toast.error('バケットリストの保存に失敗しました');
    }
  };
  
  // アイテムを削除
  const deleteItem = async (id: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== id);
      const success = await onUpdate(updatedItems);
      if (success) {
        toast.success('アイテムを削除しました');
      }
    } catch (error) {
      console.error('バケットリスト削除エラー:', error);
      toast.error('アイテムの削除に失敗しました');
    }
  };
  
  // アイテムの完了状態を切り替え
  const toggleComplete = async (id: string) => {
    try {
      const updatedItems = items.map(item => 
        item.id === id 
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      );
      await onUpdate(updatedItems);
    } catch (error) {
      console.error('完了状態の更新エラー:', error);
      toast.error('状態の更新に失敗しました');
    }
  };
  
  // アイテム編集モードを開始
  const startEdit = (item: BucketListItem) => {
    setEditing(item);
    setFormData({ ...item });
    setIsAdding(true);
  };
  
  // フィルター適用後のアイテム
  const filteredItems = items.filter(item => {
    if (viewMode === 'all') return true;
    if (viewMode === 'pending') return !item.isCompleted;
    if (viewMode === 'completed') return item.isCompleted;
    return true;
  });
  
  // カテゴリーでアイテムをグループ化
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BucketListItem[]>);
  
  if (isAdding) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          {editing ? 'バケットリストを編集' : 'バケットリストに追加'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isUpdating}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isUpdating}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="例: パリのエッフェル塔を訪れる"
            disabled={isUpdating}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">説明（任意）</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px]"
            placeholder="詳細を入力してください..."
            disabled={isUpdating}
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCompleted"
              checked={formData.isCompleted || false}
              onChange={(e) => handleChange('isCompleted', e.target.checked)}
              className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              disabled={isUpdating}
            />
            <label htmlFor="isCompleted" className="ml-2 text-sm text-gray-700">
              達成済み
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setIsAdding(false);
              resetForm();
            }}
            className="px-4 py-2 border rounded-md"
            disabled={isUpdating}
          >
            キャンセル
          </button>
          <button
            onClick={saveItem}
            className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:opacity-50"
            disabled={isUpdating || !formData.title}
          >
            {isUpdating ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">まだバケットリストがありません</p>
        {!isViewOnly && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-teal-500 text-white rounded-md flex items-center mx-auto"
            disabled={isUpdating}
          >
            <FaPlus className="mr-2" /> アイテムを追加
          </button>
        )}
      </div>
    );
  }
  
  // カテゴリーのラベルとアイコンを取得
  const getCategoryInfo = (value: string) => {
    return CATEGORIES.find(cat => cat.value === value) || CATEGORIES[0];
  };
  
  // 優先度のラベルと色を取得
  const getPriorityInfo = (value: string) => {
    return PRIORITIES.find(pri => pri.value === value) || PRIORITIES[1];
  };
  
  return (
    <div>
      {/* フィルターボタン */}
      <div className="flex mb-6 bg-gray-100 p-1 rounded-lg justify-between">
        <div className="flex space-x-1">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              viewMode === 'all' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setViewMode('pending')}
            className={`px-3 py-1 text-sm rounded-md ${
              viewMode === 'pending' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            未達成
          </button>
          <button
            onClick={() => setViewMode('completed')}
            className={`px-3 py-1 text-sm rounded-md ${
              viewMode === 'completed' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            達成済み
          </button>
        </div>
        
        {!isViewOnly && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 text-sm bg-teal-500 text-white rounded-md flex items-center"
            disabled={isUpdating}
          >
            <FaPlus className="mr-1" size={12} /> 追加
          </button>
        )}
      </div>
      
      {/* バケットリスト表示 */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          const catInfo = getCategoryInfo(category);
          return (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                {catInfo.icon} {catInfo.label}
              </h3>
              <div className="space-y-3">
                {categoryItems.map((item) => {
                  const priorityInfo = getPriorityInfo(item.priority);
                  return (
                    <div 
                      key={item.id} 
                      className={`bg-white rounded-lg p-4 shadow-sm relative ${
                        item.isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {!isViewOnly && (
                              <button
                                onClick={() => toggleComplete(item.id)}
                                className={`mr-3 h-5 w-5 rounded-full flex items-center justify-center ${
                                  item.isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'border border-gray-300 text-transparent hover:border-teal-500'
                                }`}
                              >
                                {item.isCompleted && <FaCheck size={10} />}
                              </button>
                            )}
                            <h4 className={`font-medium ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {item.title}
                            </h4>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${priorityInfo.color}`}>
                              {priorityInfo.label}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-2 ml-8">{item.description}</p>
                          )}
                        </div>
                        
                        {!isViewOnly && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEdit(item)}
                              className="text-gray-500 hover:text-teal-600"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
