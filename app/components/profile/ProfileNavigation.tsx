"use client";

import React from 'react';
import Link from 'next/link';
import { 
  FaUser, 
  FaImages, 
  FaHeart, 
  FaCog, 
  FaHistory,
  FaChartLine,
  FaClipboardCheck,
  FaUserCheck,
  FaPhotoVideo
} from 'react-icons/fa';

interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: any;
  tabs: { id: string; label: string }[];
}

export default function ProfileNavigation({ activeTab, onTabChange, user, tabs }: ProfileNavigationProps) {
  // アイコンマッピング
  const iconMap: { [key: string]: JSX.Element } = {
    'profile': <FaUser className="text-pink-500" />,
    'media': <FaPhotoVideo className="text-pink-500" />,
    'interests': <FaHeart className="text-pink-500" />,
    'personality': <FaChartLine className="text-pink-500" />,
    'matching': <FaClipboardCheck className="text-pink-500" />,
    'verification': <FaUserCheck className="text-pink-500" />,
  };

  const linkItems = [
    { href: '/profile/settings', label: '設定', icon: <FaCog className="text-pink-500" /> },
    { href: '/profile/matches', label: 'マッチング履歴', icon: <FaHistory className="text-pink-500" /> },
  ];

  return (
    <div className="w-full">
      {/* モバイルビュー用水平スクロールタブ */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center px-4 py-3 whitespace-nowrap transition-colors
              ${activeTab === item.id 
                ? 'text-pink-600 border-b-2 border-pink-500 font-medium' 
                : 'text-gray-500 hover:text-pink-400'}
            `}
          >
            <div className="mb-1">
              {iconMap[item.id] || <FaUser className="text-pink-500" />}
            </div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>

      {/* リンク項目 - 小さいセカンダリーメニュー */}
      <div className="flex justify-center border-t border-gray-100 pt-2 mt-2">
        {linkItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-3 py-1 mx-1 text-xs text-gray-500 hover:text-pink-500"
          >
            <span className="mr-1">{item.icon}</span> 
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
