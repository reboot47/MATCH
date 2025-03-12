"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';

// プロフィール項目の型定義
type ProfileItem = {
  id: string;
  name: string;
  completed: boolean;
  important: boolean;
  url: string;
};

type ProfileCompletionIndicatorProps = {
  profileItems?: ProfileItem[];
  completionPercentage?: number;
  onItemClick?: (url: string) => void;
};

export default function ProfileCompletionIndicator({
  profileItems,
  completionPercentage,
  onItemClick
}: ProfileCompletionIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [items, setItems] = useState<ProfileItem[]>([]);

  // デモ用データ（APIから取得するように変更予定）
  const demoItems: ProfileItem[] = [
    { id: 'main-photo', name: 'メイン写真', completed: true, important: true, url: '/mypage/profile/edit/main-photo/new' },
    { id: 'appeal-photos', name: 'アピール写真', completed: true, important: true, url: '/mypage/profile/edit/appeal-photo/new' },
    { id: 'appeal-video', name: 'アピール動画', completed: false, important: false, url: '/mypage/profile/edit/appeal-video/new' },
    { id: 'appeal-tags', name: 'アピールタグ', completed: true, important: true, url: '/mypage/profile/edit/appeal-tags' },
    { id: 'basic-info', name: '基本情報', completed: true, important: true, url: '/mypage/profile/new-edit' },
    { id: 'self-intro', name: '自己紹介', completed: true, important: true, url: '/mypage/profile/new-edit' },
    { id: 'personality', name: '性格・価値観', completed: false, important: false, url: '/mypage/profile/new-edit' },
    { id: 'lifestyle', name: '生活スタイル', completed: false, important: false, url: '/mypage/profile/new-edit' },
    { id: 'dating-preferences', name: '出会いの希望', completed: true, important: true, url: '/mypage/profile/new-edit' },
  ];

  useEffect(() => {
    // props経由またはAPIから取得
    setItems(profileItems || demoItems);
    
    // 完成度の計算（props経由かAPIから取得、または内部計算）
    if (completionPercentage !== undefined) {
      setPercentage(completionPercentage);
    } else {
      const totalItems = demoItems.length;
      const completedItems = demoItems.filter(item => item.completed).length;
      const calculatedPercentage = Math.round((completedItems / totalItems) * 100);
      setPercentage(calculatedPercentage);
    }
  }, [profileItems, completionPercentage]);

  // 未入力の重要項目を取得
  const incompleteImportantItems = items.filter(item => !item.completed && item.important);
  
  // 色とメッセージを決定
  const getStatusInfo = () => {
    if (percentage >= 90) {
      return {
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        trackColor: 'bg-green-100',
        message: '素晴らしい！プロフィールがほぼ完成しています',
        icon: <FiStar className="w-5 h-5" />
      };
    } else if (percentage >= 70) {
      return {
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
        trackColor: 'bg-blue-100',
        message: '良い感じです！もう少しで完成です',
        icon: <FiCheckCircle className="w-5 h-5" />
      };
    } else if (percentage >= 40) {
      return {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500',
        trackColor: 'bg-yellow-100',
        message: 'あと少し入力すると魅力的なプロフィールになります',
        icon: <FiAlertCircle className="w-5 h-5" />
      };
    } else {
      return {
        color: 'text-red-500',
        bgColor: 'bg-red-500',
        trackColor: 'bg-red-100',
        message: 'プロフィールの入力を始めましょう',
        icon: <FiAlertCircle className="w-5 h-5" />
      };
    }
  };

  const statusInfo = getStatusInfo();

  const handleItemClick = (url: string) => {
    if (onItemClick) {
      onItemClick(url);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 完成度表示ヘッダー */}
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className={`${statusInfo.color} mr-2`}>
              {statusInfo.icon}
            </div>
            <h3 className="font-medium">プロフィール完成度</h3>
          </div>
          <div className="flex items-center">
            <span className={`font-bold text-lg ${statusInfo.color}`}>{percentage}%</span>
            <div className="ml-2">
              {expanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        
        {/* プログレスバー */}
        <div className={`w-full h-2 ${statusInfo.trackColor} rounded-full overflow-hidden`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${statusInfo.bgColor} rounded-full`}
          ></motion.div>
        </div>
        
        <p className={`text-sm mt-2 ${statusInfo.color}`}>
          {statusInfo.message}
        </p>
      </div>
      
      {/* 展開時の詳細 */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            {/* 未入力の重要項目がある場合のアラート */}
            {incompleteImportantItems.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-md mb-3 text-sm">
                <h4 className="font-medium text-yellow-700 mb-1">優先して入力をおすすめする項目：</h4>
                <ul className="text-yellow-600 pl-2">
                  {incompleteImportantItems.map(item => (
                    <li key={item.id} className="flex items-center mt-1">
                      <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* すべての項目リスト */}
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.url)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    item.completed ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    {item.completed ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${item.important ? 'border-red-400' : 'border-gray-300'} mr-2`} />
                    )}
                    <span className={item.completed ? 'text-gray-700' : 'text-gray-900 font-medium'}>
                      {item.name}
                    </span>
                    {!item.completed && item.important && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                        必須
                      </span>
                    )}
                  </div>
                  {!item.completed && (
                    <span className="text-primary-500 text-sm">
                      入力する
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => onItemClick && onItemClick('/mypage/profile/new-edit')}
                className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600 transition-colors"
              >
                プロフィールを編集する
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
