"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaImage, 
  FaHeart, 
  FaCog, 
  FaClipboardCheck,
  FaUserCheck,
  FaLock,
  FaBell,
  FaBrain,
  FaShieldAlt,
  FaExclamationCircle,
  FaStar
} from 'react-icons/fa';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

interface ProfileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  completionPercentage?: number;
  missingItems?: {
    category: string;
    items: string[];
  }[];
  navigationItems?: NavigationItem[];
}

// デフォルトのセクション定義
const defaultSections = [
  { id: 'profile', label: 'プロフィール', icon: 'user', category: 'basic' },
  { id: 'appeal', label: 'アピールポイント', icon: 'sparkles', category: 'basic' },
  { id: 'personality', label: '性格診断', icon: 'brain', category: 'personality' },
  { id: 'preferences', label: 'マッチング設定', icon: 'heart', category: 'preferences' },
  { id: 'verification', label: '認証', icon: 'shield-check', category: 'verification' },
  { id: 'security', label: 'セキュリティ', icon: 'lock-closed', category: 'security' },
  { id: 'notifications', label: '通知設定', icon: 'bell', category: 'notifications' },
  { id: 'privacy', label: 'プライバシー', icon: 'eye-slash', category: 'privacy' }
];

// アイコン名をコンポーネントにマッピングする関数
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'user': return <FaUser className="w-5 h-5" />;
    case 'brain': return <FaBrain className="w-5 h-5" />;
    case 'heart': return <FaHeart className="w-5 h-5" />;
    case 'cog': return <FaCog className="w-5 h-5" />;
    case 'shield-check': return <FaShieldAlt className="w-5 h-5" />;
    case 'lock-closed': return <FaLock className="w-5 h-5" />;
    case 'bell': return <FaBell className="w-5 h-5" />;
    case 'eye-slash': return <FaShieldAlt className="w-5 h-5" />;
    case 'sparkles': return <FaStar className="w-5 h-5" />;
    default: return <FaUser className="w-5 h-5" />;
  }
};

// カテゴリーマッピング
const categoryMapping = {
  'profile': 'basic',
  'appeal': 'basic',
  'personality': 'personality',
  'preferences': 'preferences',
  'verification': 'verification',
  'security': 'security',
  'notifications': 'notifications',
  'privacy': 'privacy'
};

export default function ProfileNavigation({ 
  activeSection, 
  onSectionChange,
  completionPercentage = 0,
  missingItems = [],
  navigationItems = defaultSections
}: ProfileNavigationProps) {
  
  // ナビゲーション項目を準備（カテゴリー付与）
  const sectionsWithCategory = navigationItems.map(item => ({
    ...item,
    category: categoryMapping[item.id as keyof typeof categoryMapping] || 'basic'
  }));
  
  // 特定のカテゴリーに対応する不足項目の数を取得
  const getMissingItemsCount = (category: string) => {
    const categoryItems = missingItems.find(item => item.category === category);
    return categoryItems ? categoryItems.items.length : 0;
  };

  return (
    <>
      {/* デスクトップ表示 */}
      <div className="hidden md:block">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex">
            {sectionsWithCategory.map((section) => {
              const missingCount = getMissingItemsCount(section.category);
              
              return (
                <motion.button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={`flex items-center px-4 py-3 transition-colors ${
                    activeSection === section.id 
                      ? 'bg-teal-50 border-b-2 border-teal-500 text-teal-700 font-medium' 
                      : 'text-gray-700 border-b-2 border-transparent hover:bg-gray-50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <span className={`mr-2 ${activeSection === section.id ? 'text-teal-500' : 'text-gray-500'}`}>
                    {getIconComponent(section.icon)}
                  </span>
                  <span>{section.label}</span>
                  
                  {/* プロフィール完成度がメインタブに表示 */}
                  {section.id === 'profile' && completionPercentage < 100 && (
                    <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {completionPercentage}%
                    </span>
                  )}
                  
                  {/* 不足項目がある場合に通知バッジを表示 */}
                  {section.id !== 'profile' && missingCount > 0 && (
                    <span className="ml-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                      <FaExclamationCircle className="mr-1" size={10} />
                      {missingCount}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* モバイル表示 */}
      <div className="md:hidden">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-4 gap-2">
            {sectionsWithCategory.map((section) => {
              const missingCount = getMissingItemsCount(section.category);
              
              return (
                <motion.button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    activeSection === section.id 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`relative ${activeSection === section.id ? 'text-teal-500' : 'text-gray-500'}`}>
                    {getIconComponent(section.icon)}
                    
                    {/* 不足項目がある場合に通知バッジを表示 */}
                    {missingCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full" />
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center">{section.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
