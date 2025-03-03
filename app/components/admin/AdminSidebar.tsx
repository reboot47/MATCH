"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  icon: (props: { className: string }) => JSX.Element;
  subItems?: {
    name: string;
    href: string;
  }[];
}

// アイコンコンポーネント - Heroiconsのパスを使用
const DashboardIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ModerationIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ReportsIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const AnalyticsIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const navigation: NavItem[] = [
  { name: 'ダッシュボード', href: '/admin', icon: DashboardIcon },
  { 
    name: 'ユーザー管理', 
    href: '/admin/users', 
    icon: UsersIcon,
    subItems: [
      { name: 'ユーザー一覧', href: '/admin/users' },
      { name: '承認リクエスト', href: '/admin/users/approvals' },
      { name: '禁止ユーザー', href: '/admin/users/banned' }
    ]
  },
  { 
    name: 'モデレーション', 
    href: '/admin/moderation', 
    icon: ModerationIcon,
    subItems: [
      { name: 'モデレーション管理', href: '/admin/moderation' },
      { name: 'モデレーションポリシー', href: '/admin/policies' },
      { name: '自動モデレーション設定', href: '/admin/moderation/auto' }
    ]
  },
  { 
    name: '報告管理', 
    href: '/admin/reports', 
    icon: ReportsIcon,
    subItems: [
      { name: '報告一覧', href: '/admin/reports' },
      { name: '解決済み報告', href: '/admin/reports/resolved' }
    ]
  },
  { 
    name: '分析・統計', 
    href: '/admin/analytics', 
    icon: AnalyticsIcon,
    subItems: [
      { name: 'ユーザー統計', href: '/admin/analytics/users' },
      { name: '利用統計', href: '/admin/analytics/usage' },
      { name: '売上分析', href: '/admin/analytics/revenue' }
    ]
  },
  { name: 'システム設定', href: '/admin/settings', icon: SettingsIcon },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // サブメニューの開閉トグル
  const toggleExpand = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };
  
  // 現在のページがアクティブかどうかを判定
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-800 text-white shadow-lg w-64">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-center">
        <div className="flex items-center">
          {/* ロゴ */}
          <div className="mr-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              LB
            </div>
          </div>
          <div>
            <div className="text-lg font-bold">LineBuzz</div>
            <div className="text-xs text-gray-400">管理者パネル</div>
          </div>
        </div>
      </div>
      
      {/* ナビゲーション */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => (
            <li key={item.name} className="mb-2">
              {item.subItems ? (
                // サブメニューがある場合
                <div>
                  <button 
                    onClick={() => toggleExpand(item.name)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
                      isActive(item.href) ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    <span className="flex-1">{item.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`ml-auto h-4 w-4 transition-transform ${expandedItem === item.name ? 'transform rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  
                  {/* サブメニュー */}
                  {expandedItem === item.name && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 pl-10 space-y-1"
                    >
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link href={subItem.href}>
                            <span className={`block px-3 py-2 text-sm font-medium rounded-md ${
                              isActive(subItem.href) ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}>
                              {subItem.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              ) : (
                // サブメニューがない場合
                <Link href={item.href}>
                  <span className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href) ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}>
                    <item.icon className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                    }`} />
                    {item.name}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* フッター */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium text-white">
              管理
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">管理者</p>
            <p className="text-xs text-gray-400">管理者アカウント</p>
          </div>
          <button className="ml-auto bg-gray-700 p-1 rounded-full text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
