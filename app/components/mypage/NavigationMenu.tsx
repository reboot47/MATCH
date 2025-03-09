"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HiOutlineLightningBolt, 
  HiOutlineFlag, 
  HiOutlineCalendar, 
  HiOutlineBell,
  HiOutlineStar,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineUserGroup
} from 'react-icons/hi';



const menuItems = [
  { 
    id: 'live', 
    icon: <HiOutlineLightningBolt className="w-6 h-6 text-teal-400" />, 
    label: 'ライブ配信',
    badge: '3人配信中',
    badgeColor: 'bg-pink-400',
    href: '/live'
  },
  { 
    id: 'mission', 
    icon: <HiOutlineFlag className="w-6 h-6 text-teal-400" />, 
    label: 'ミッション',
    href: '/mission'
  },
  { 
    id: 'purchase', 
    icon: <HiOutlineCalendar className="w-6 h-6 text-teal-400" />, 
    label: '購入一覧',
    href: '/purchase' 
  },
  { 
    id: 'notification', 
    icon: <HiOutlineBell className="w-6 h-6 text-teal-400" />, 
    label: 'お知らせ',
    badge: '27',
    badgeColor: 'bg-teal-400',
    href: '/notification'
  },
  { 
    id: 'favorite', 
    icon: <HiOutlineStar className="w-6 h-6 text-teal-400" />, 
    label: 'お気に入り',
    href: '/favorite' 
  },
  { 
    id: 'memo', 
    icon: <HiOutlineDocumentText className="w-6 h-6 text-teal-400" />, 
    label: 'メモ',
    href: '/memo' 
  },
  { 
    id: 'history', 
    icon: <HiOutlineClock className="w-6 h-6 text-teal-400" />, 
    label: '履歴',
    href: '/history' 
  },
  { 
    id: 'invite', 
    icon: <HiOutlineUserGroup className="w-6 h-6 text-teal-400" />, 
    label: '友達招待',
    href: '/invite' 
  },
  {
    id: 'points-earn',
    icon: <HiOutlineLightningBolt className="w-6 h-6 text-yellow-500" />,
    label: 'ポイント獲得',
    href: '/mypage/points/earn',
    highlight: true
  }
];

export default function NavigationMenu() {
  return (
    <div className="bg-white rounded-lg shadow p-4 mx-4 mt-4">
      <div className="grid grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link 
              href={item.href || `/${item.id}`}
              className={`flex flex-col items-center justify-center p-2 ${item.highlight ? 'text-yellow-500' : ''}`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <div className={`${item.badgeColor} text-white text-xs rounded-full px-1 absolute -top-2 -right-2 min-w-[1.25rem] text-center`}>
                    {item.badge}
                  </div>
                )}
              </div>
              <span className={`text-xs mt-1 ${item.highlight ? 'text-yellow-500 font-medium' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
