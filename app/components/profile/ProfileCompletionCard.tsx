"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';

interface ProfileCompletionCardProps {
  completionPercentage: number;
  missingItems?: {
    category: string;
    items: string[];
  }[];
  onEditProfile?: () => void;
}

// カテゴリーの日本語表示マッピング
const categoryLabels: Record<string, string> = {
  'basic': '基本情報',
  'personality': '性格診断',
  'preferences': 'マッチング設定',
  'verification': '認証情報',
  'security': 'セキュリティ',
  'notifications': '通知設定',
  'privacy': 'プライバシー',
  'media': 'メディア',
  'location': '居住地',
  'interests': '趣味・興味'
};

export default function ProfileCompletionCard({
  completionPercentage,
  missingItems = [],
  onEditProfile
}: ProfileCompletionCardProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // カテゴリーの開閉を切り替え
  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // 完成度に基づく色とメッセージの決定
  const getColorClass = () => {
    if (completionPercentage === 100) return 'bg-green-100 text-green-800 border-green-200';
    if (completionPercentage >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (completionPercentage >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getMessage = () => {
    if (completionPercentage === 100) return '完璧です！プロフィールが完成しています。';
    if (completionPercentage >= 70) return 'あと少しです！プロフィールをもう少し充実させましょう。';
    if (completionPercentage >= 40) return '良い調子です！プロフィールを引き続き充実させましょう。';
    return 'プロフィールを充実させてマッチング率を上げましょう！';
  };

  // プログレスバーの色
  const getProgressBarColor = () => {
    if (completionPercentage === 100) return 'bg-green-500';
    if (completionPercentage >= 70) return 'bg-blue-500';
    if (completionPercentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // アニメーション設定
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const categoryVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  // 欠けているカテゴリーがあるかをチェック
  const hasMissingItems = Array.isArray(missingItems) && missingItems.length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl p-5 border ${getColorClass()} shadow-sm mb-6`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          {completionPercentage === 100 ? (
            <FaCheckCircle className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <FaExclamationCircle className="h-5 w-5 mr-2 text-amber-500" />
          )}
          プロフィール完成度: {completionPercentage}%
        </h3>
        
        {onEditProfile && completionPercentage < 100 && (
          <motion.button
            onClick={onEditProfile}
            className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            編集する
          </motion.button>
        )}
      </div>

      <div className="w-full bg-white rounded-full h-2.5 mb-4">
        <motion.div 
          className={`h-2.5 rounded-full ${getProgressBarColor()}`}
          style={{ width: `${completionPercentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <p className="text-sm mb-3">{getMessage()}</p>

      {hasMissingItems && completionPercentage < 100 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">未入力の項目があります:</p>
          
          <div className="space-y-2">
            {Array.isArray(missingItems) && missingItems.map((category) => {
              // カテゴリオブジェクトの構造を確認
              if (!category || typeof category !== 'object') return null;
              // items配列の存在確認
              const items = Array.isArray(category.items) ? category.items : [];
              
              return (
                <div 
                  key={category.category || 'unknown'} 
                  className="bg-white bg-opacity-50 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category.category || 'unknown')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-white hover:bg-opacity-30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span>{categoryLabels[category.category] || category.category || 'その他'}</span>
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                        {items.length}項目
                      </span>
                    </div>
                    {expandedCategory === category.category ? (
                      <FaChevronUp className="text-gray-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategory === category.category && (
                      <motion.ul
                        variants={categoryVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="px-4 py-2 text-sm border-t border-gray-200 bg-white bg-opacity-30"
                      >
                        {items.map((item, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-start py-1"
                            variants={itemVariants}
                          >
                            <FaArrowRight className="h-3.5 w-3.5 mt-0.5 mr-2 flex-shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-gray-600">
              プロフィールを完成させると、より良いマッチングが期待できます
            </p>
          </motion.div>
        </div>
      )}
      
      {completionPercentage === 100 && (
        <motion.div 
          className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg text-green-700 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FaCheckCircle className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm font-medium">素晴らしい！プロフィールは完璧です</p>
          <p className="text-xs mt-1">マッチングの可能性が最も高い状態です</p>
        </motion.div>
      )}
    </motion.div>
  );
}
