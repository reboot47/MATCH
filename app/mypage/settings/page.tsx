"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

// 設定メニュー項目のタイプ定義
type SettingItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  divider?: boolean;
};

type SettingSection = {
  title?: string;
  items: SettingItem[];
};

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    // ログアウト処理
    console.log('ログアウトしました');
    router.push('/login');
  };

  // 設定メニューのセクションとアイテム
  const settingSections: SettingSection[] = [
    {
      title: 'アカウント設定',
      items: [
        { label: 'メールアドレスを登録・変更する', href: '/mypage/settings/email' },
        { label: '電話番号の変更', href: '/mypage/settings/phone' },
        { label: 'パスワードの変更', href: '/mypage/settings/password' },
        { label: '通知設定', href: '/mypage/settings/notifications' },
        { label: 'ブロックリスト', href: '/mypage/settings/blocklist' },
        { label: '足あとリスト', href: '/mypage/settings/footprints' },
        { label: 'メッセージ非表示リスト', href: '/mypage/settings/hidden-messages' },
        { label: 'メッセージテンプレート設定', href: '/mypage/settings/message-templates' },
      ],
    },
    {
      title: 'お支払い情報',
      items: [
        { label: 'クレジットカード登録情報変更', href: '/mypage/settings/payment' },
        { label: '会員ステータス', href: '/mypage/membership' },
      ],
    },
    {
      title: 'プライバシー設定',
      items: [
        { label: 'プライバシー設定', href: '/mypage/settings/privacy' },
        { label: '足あと設定', href: '/mypage/settings/privacy-footprints' },
        { label: 'プライベートモード設定', href: '/mypage/settings/private-mode' },
        { label: 'パスコード設定', href: '/mypage/settings/passcode' },
        { label: 'バッジ表示設定', href: '/mypage/settings/badges' },
      ],
    },
    {
      title: '優待コード',
      items: [
        { label: '優待コード入力', href: '/mypage/settings/campaign-code' },
      ],
    },
    {
      title: 'サポート',
      items: [
        { label: 'ポイント・コインの履歴', href: '/mypage/settings/points-history' },
        { label: 'ヘルプ', href: '/mypage/settings/help' },
        { label: '安心してご利用いただくために', href: '/mypage/settings/safety' },
        { label: 'お問い合わせ', href: '/mypage/settings/contact' },
      ],
    },
    {
      title: 'その他',
      items: [
        { label: '運営会社', href: '/mypage/settings/company' },
        { label: '利用規約', href: '/mypage/settings/terms' },
        { label: 'プライバシーポリシー', href: '/mypage/settings/privacy-policy' },
        { label: '特定商取引法に基づく表示', href: '/mypage/settings/legal/business' },
        { label: '資金決済法に基づく表示', href: '/mypage/settings/legal/payment' },
      ],
    },
    {
      items: [
        { 
          label: 'ログアウト', 
          onClick: handleLogout,
          divider: true
        }
      ],
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="mr-4 text-gray-600"
          aria-label="戻る"
        >
          <HiChevronLeft size={24} />
        </button>
        <h1 className="text-center flex-grow font-medium text-lg">設定</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20">
        <motion.div 
          className="bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              {section.title && (
                <div className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium">
                  {section.title}
                </div>
              )}
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    className={`border-b border-gray-100 ${item.divider ? 'mt-4' : ''}`}
                  >
                    {item.href ? (
                      <Link 
                        href={item.href} 
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        <span>{item.label}</span>
                        <HiChevronRight className="text-gray-400" size={20} />
                      </Link>
                    ) : (
                      <button 
                        onClick={item.onClick} 
                        className={`w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                          item.label === 'ログアウト' ? 'flex justify-center text-center mx-auto my-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 max-w-sm' : ''
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
