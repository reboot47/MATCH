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
    'profile': <FaUser className="text-[#66cdaa]" />,
    'media': <FaPhotoVideo className="text-[#66cdaa]" />,
    'interests': <FaHeart className="text-[#66cdaa]" />,
    'personality': <FaChartLine className="text-[#66cdaa]" />,
    'matching': <FaClipboardCheck className="text-[#66cdaa]" />,
    'verification': <FaUserCheck className="text-[#66cdaa]" />,
  };

  const linkItems = [
    { href: '/profile/settings', label: '設定', icon: <FaCog className="text-[#66cdaa]" /> },
    { href: '/profile/matches', label: 'マッチング履歴', icon: <FaHistory className="text-[#66cdaa]" /> },
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
                ? 'text-[#66cdaa] border-b-2 border-[#90ee90] font-medium' 
                : 'text-[#808080] hover:text-[#66cdaa]'}
            `}
          >
            <div className="mb-1">
              {iconMap[item.id] || <FaUser className="text-[#66cdaa]" />}
            </div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>

      {/* リンク項目 - 小さいセカンダリーメニュー */}
      <div className="flex justify-center border-t border-[#808080] pt-2 mt-2">
        {linkItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-3 py-1 mx-1 text-xs text-[#808080] hover:text-[#66cdaa]"
          >
            <span className="mr-1">{item.icon}</span> 
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
