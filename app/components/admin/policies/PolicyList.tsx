"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

interface PolicyListProps {
  policies: Policy[];
  onEdit: (policy: Policy) => void;
  onDelete: (policyId: string) => void;
}

const PolicyList: React.FC<PolicyListProps> = ({
  policies,
  onEdit,
  onDelete
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // コンテンツタイプに応じたラベル
  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'profile': return 'プロフィール';
      case 'photo': return '写真';
      case 'message': return 'メッセージ';
      case 'livestream': return 'ライブ配信';
      case 'comment': return 'コメント';
      default: return type;
    }
  };
  
  // 重大度に応じたラベルとスタイル
  const getSeverityBadge = (severity: string) => {
    let color = '';
    let label = '';
    
    switch (severity) {
      case 'low':
        color = 'bg-green-100 text-green-700';
        label = '低';
        break;
      case 'medium':
        color = 'bg-yellow-100 text-yellow-700';
        label = '中';
        break;
      case 'high':
        color = 'bg-red-100 text-red-700';
        label = '高';
        break;
      default:
        color = 'bg-gray-100 text-gray-700';
        label = severity;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };
  
  // アクションに応じたラベル
  const getActionLabel = (action: string) => {
    switch (action) {
      case 'warn': return '警告';
      case 'remove': return 'コンテンツ削除';
      case 'ban': return 'アカウント停止';
      default: return action;
    }
  };
  
  // 折りたたみ/展開トグル
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // 削除確認
  const confirmDelete = (policy: Policy) => {
    if (window.confirm(`「${policy.name}」を削除してもよろしいですか？この操作は元に戻せません。`)) {
      onDelete(policy.id);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ポリシー名
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              対象
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              重大度
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              アクション
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {policies.map((policy) => (
            <React.Fragment key={policy.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="flex items-center text-sm font-medium text-gray-900"
                    onClick={() => toggleExpand(policy.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 mr-2 transition-transform ${expandedId === policy.id ? 'transform rotate-90' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {policy.name}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getContentTypeLabel(policy.contentType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSeverityBadge(policy.severity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${policy.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {policy.isActive ? '有効' : '無効'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getActionLabel(policy.actionRequired)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(policy)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => confirmDelete(policy)}
                    className="text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                </td>
              </tr>
              
              {/* 詳細表示行 */}
              {expandedId === policy.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm"
                    >
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">説明</h4>
                        <p className="text-gray-700">{policy.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">ルール</h4>
                        <ul className="list-disc pl-5 text-gray-700">
                          {policy.rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        作成日: {new Date(policy.createdAt).toLocaleDateString('ja-JP')} | 
                        最終更新: {new Date(policy.updatedAt).toLocaleDateString('ja-JP')}
                      </div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          
          {policies.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                モデレーションポリシーが登録されていません。「新規ポリシー」ボタンから作成してください。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PolicyList;
