"use client";

import { useState } from 'react';
import { Policy } from '@/types/policy';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PolicyListProps {
  policies: Policy[];
  onEdit: (policy: Policy) => void;
  onDelete: (policyId: string) => void;
}

export default function PolicyList({ policies, onEdit, onDelete }: PolicyListProps) {
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  // ポリシーの詳細表示を切り替え
  const toggleExpand = (policyId: string) => {
    if (expandedPolicy === policyId) {
      setExpandedPolicy(null);
    } else {
      setExpandedPolicy(policyId);
    }
  };

  // 日付フォーマット
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: ja });
    } catch (error) {
      console.error('日付フォーマットエラー:', error);
      return '不明な日付';
    }
  };

  // コンテンツタイプのラベルとカラー
  const getContentTypeInfo = (contentType: string) => {
    switch (contentType) {
      case 'profile':
        return { label: 'プロフィール', color: 'bg-purple-100 text-purple-800' };
      case 'photo':
        return { label: '写真', color: 'bg-blue-100 text-blue-800' };
      case 'message':
        return { label: 'メッセージ', color: 'bg-green-100 text-green-800' };
      case 'livestream':
        return { label: 'ライブ配信', color: 'bg-red-100 text-red-800' };
      default:
        return { label: contentType, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {policies.map((policy) => {
          const isExpanded = expandedPolicy === policy.id;
          const contentTypeInfo = getContentTypeInfo(policy.contentType);
          
          return (
            <li key={policy.id} className="relative">
              <div className={`px-4 py-4 sm:px-6 ${isExpanded ? 'bg-gray-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {policy.name}
                      </p>
                      <span 
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contentTypeInfo.color}`}
                      >
                        {contentTypeInfo.label}
                      </span>
                      {!policy.isActive && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          無効
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {policy.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">
                      更新: {formatDate(policy.updatedAt)}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(policy)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(policy.id)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => toggleExpand(policy.id)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {isExpanded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 展開時の詳細表示 */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">ルール</h4>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600">
                          {policy.rules.map((rule, index) => (
                            <li key={index} className="ml-2">{rule}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">作成日</p>
                          <p className="font-medium">{formatDate(policy.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">更新日</p>
                          <p className="font-medium">{formatDate(policy.updatedAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">ステータス</p>
                          <p className="font-medium">
                            {policy.isActive ? (
                              <span className="text-green-600">有効</span>
                            ) : (
                              <span className="text-red-600">無効</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">ID</p>
                          <p className="font-mono text-xs text-gray-600 truncate">{policy.id}</p>
                        </div>
                      </div>
                      
                      <div className="pt-3 flex justify-end space-x-3">
                        <button
                          onClick={() => onEdit(policy)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => onDelete(policy.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
