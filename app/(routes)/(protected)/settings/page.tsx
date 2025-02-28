'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  // 実装済みのページパス
  const implementedPaths = [
    '/settings/email',
    '/settings/phone', 
    '/settings/password', 
    '/settings/notifications',
    '/settings/profile'
  ];

  const settingGroups = [
    {
      title: '',
      items: [
        {
          title: 'メールアドレスを登録・変更する',
          href: '/settings/email',
          disabled: false,
        },
        {
          title: '電話番号の変更',
          href: '/settings/phone',
          disabled: false,
        },
        {
          title: 'パスワードの変更',
          href: '/settings/password',
          disabled: false,
        },
        {
          title: '通知設定',
          href: '/settings/notifications',
          disabled: false,
        },
        {
          title: 'ブロックリスト',
          href: '/settings/blocks',
          disabled: true,
        },
        {
          title: '足あとリスト',
          href: '/settings/footprints',
          disabled: true,
        },
        {
          title: 'メッセージ非表示リスト',
          href: '/settings/hidden-messages',
          disabled: true,
        },
        {
          title: 'メッセージテンプレート設定',
          href: '/settings/message-templates',
          disabled: true,
        },
      ],
    },
    {
      title: 'お支払い情報',
      items: [
        {
          title: 'クレジットカード登録情報変更',
          href: '/settings/payment',
          disabled: true,
        },
        {
          title: '会員ステータス',
          href: '/settings/membership',
          disabled: true,
        },
      ],
    },
    {
      title: 'プライバシー設定',
      items: [
        {
          title: '足あと設定',
          href: '/settings/footprint-settings',
          disabled: true,
        },
        {
          title: 'プライベートモード設定',
          href: '/settings/private-mode',
          disabled: true,
        },
        {
          title: 'SMS自動ログイン機能設定',
          href: '/settings/sms-login',
          disabled: true,
        },
        {
          title: 'バッジ表示設定',
          href: '/settings/badge-settings',
          disabled: true,
        },
      ],
    },
    {
      title: '優待コード',
      items: [
        {
          title: '優待コード入力',
          href: '/settings/promotion-code',
          disabled: true,
        },
      ],
    },
    {
      title: 'サポート',
      items: [
        {
          title: 'ポイント・コインの履歴',
          href: '/settings/points-history',
          disabled: true,
        },
        {
          title: 'ヘルプ',
          href: '/help',
          disabled: true,
        },
        {
          title: '安心してご利用いただくために',
          href: '/settings/safety',
          disabled: true,
        },
        {
          title: 'お問い合わせ',
          href: '/settings/contact',
          disabled: true,
        },
      ],
    },
    {
      title: 'その他',
      items: [
        {
          title: '運営会社',
          href: '/settings/company',
          disabled: true,
        },
        {
          title: '利用規約',
          href: '/terms',
          disabled: true,
        },
        {
          title: 'プライバシーポリシー',
          href: '/privacy',
          disabled: true,
        },
        {
          title: '特定商取引法に基づく表示',
          href: '/legal/transactions',
          disabled: true,
        },
        {
          title: '資金決済法に基づく表示',
          href: '/legal/payments',
          disabled: true,
        },
      ],
    },
  ];

  // アニメーションのバリアント
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ヘッダー */}
      <motion.header 
        className="bg-white border-b"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center p-4">
          <motion.button
            onClick={() => router.back()}
            className="mr-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronLeft size={24} />
          </motion.button>
          <h1 className="text-lg font-medium">設定</h1>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <motion.main 
        className="flex-1 overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {settingGroups.map((group, groupIndex) => (
          <motion.div 
            key={groupIndex} 
            className="mb-4"
            variants={itemVariants}
          >
            {group.title && (
              <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                {group.title}
              </div>
            )}
            <div className="bg-white">
              {group.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  className={`w-full text-left border-b py-3 px-4 flex justify-between items-center ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => !item.disabled && router.push(item.href)}
                  variants={!item.disabled ? buttonVariants : {}}
                  whileHover={!item.disabled ? "hover" : ""}
                  whileTap={!item.disabled ? "tap" : ""}
                >
                  <span className="text-gray-800">{item.title}</span>
                  {!item.disabled && (
                    <FiChevronRight size={18} className="text-gray-400" />
                  )}
                  {item.disabled && (
                    <span className="text-xs text-gray-400">準備中</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* ログアウトボタン */}
        <motion.div 
          className="p-4"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleSignOut}
            className="w-full py-3 bg-white text-gray-800 rounded-md border"
            whileHover={{ backgroundColor: "#f7f7f7" }}
            whileTap={{ scale: 0.98 }}
          >
            ログアウト
          </motion.button>
        </motion.div>
      </motion.main>
    </motion.div>
  );
}
