"use client";

import { useState, useEffect } from 'react';
import { Policy } from '@/types/policy';
import { toast } from 'react-hot-toast';

interface PolicyEditFormProps {
  policy?: Policy;
  onClose: () => void;
  onSave: (policy: Policy) => void;
  isOpen: boolean;
}

export default function PolicyEditForm({ policy, onClose, onSave, isOpen }: PolicyEditFormProps) {
  const [formData, setFormData] = useState<Partial<Policy>>({
    id: '',
    name: '',
    description: '',
    contentType: 'profile',
    rules: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [rule, setRule] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ポリシーデータが提供された場合はフォームに設定
  useEffect(() => {
    if (policy) {
      setFormData({
        ...policy,
        // 日付文字列をDateオブジェクトに変換
        createdAt: policy.createdAt instanceof Date ? policy.createdAt : new Date(policy.createdAt),
        updatedAt: policy.updatedAt instanceof Date ? policy.updatedAt : new Date(policy.updatedAt),
      });
    } else {
      // 新規作成の場合はフォームをリセット
      setFormData({
        id: '',
        name: '',
        description: '',
        contentType: 'profile',
        rules: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [policy, isOpen]);

  // フォーム入力の変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ルール追加ハンドラ
  const handleAddRule = () => {
    if (!rule.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      rules: [...(prev.rules || []), rule.trim()]
    }));
    
    setRule('');
  };

  // ルール削除ハンドラ
  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: (prev.rules || []).filter((_, i) => i !== index)
    }));
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'ポリシー名は必須です';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = '説明は必須です';
    }
    
    if (!formData.contentType) {
      newErrors.contentType = 'コンテンツタイプは必須です';
    }
    
    if (!formData.rules?.length) {
      newErrors.rules = '少なくとも1つのルールが必要です';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 親コンポーネントに保存処理を委譲
      onSave(formData as Policy);
    } catch (error) {
      console.error('ポリシー保存エラー:', error);
      toast.error('ポリシーの保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景オーバーレイ */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* モーダルを中央に配置するためのトリック */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* モーダルパネル */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {policy ? 'ポリシーを編集' : '新規ポリシーを作成'}
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  {/* ポリシー名 */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      ポリシー名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      placeholder="例: プロフィール写真ガイドライン"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* 説明 */}
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      説明 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.description ? 'border-red-500' : ''
                      }`}
                      placeholder="このポリシーの目的と適用範囲を説明してください"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                  
                  {/* コンテンツタイプ */}
                  <div className="mb-4">
                    <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">
                      コンテンツタイプ <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="contentType"
                      name="contentType"
                      value={formData.contentType || 'profile'}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.contentType ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="profile">プロフィール</option>
                      <option value="photo">写真</option>
                      <option value="message">メッセージ</option>
                      <option value="livestream">ライブ配信</option>
                    </select>
                    {errors.contentType && (
                      <p className="mt-1 text-sm text-red-600">{errors.contentType}</p>
                    )}
                  </div>
                  
                  {/* ルール */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      ルール <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => setRule(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="新しいルールを入力"
                      />
                      <button
                        type="button"
                        onClick={handleAddRule}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        追加
                      </button>
                    </div>
                    
                    {errors.rules && (
                      <p className="mt-1 text-sm text-red-600">{errors.rules}</p>
                    )}
                    
                    {/* ルールリスト */}
                    <div className="mt-2 space-y-2">
                      {formData.rules?.map((ruleItem, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <span className="text-sm">{ruleItem}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 有効/無効状態 */}
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      このポリシーを有効にする
                    </label>
                  </div>
                  
                  {/* 保存 & キャンセルボタン */}
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm
                        ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          保存中...
                        </>
                      ) : (
                        '保存'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
