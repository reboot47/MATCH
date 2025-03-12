"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiDollarSign, FiUsers, FiActivity, FiGift, FiPackage, FiStar, FiCreditCard, FiCalendar, FiArrowRight, FiRepeat } from 'react-icons/fi';

// モックデータ - 課金プラン
const billingPlans = [
  {
    id: 1,
    name: 'ベーシック',
    price: 980,
    period: '月額',
    features: [
      'いいね！ 50回/日',
      'マッチング後メッセージ無制限',
      'プロフィール閲覧制限なし',
    ],
    isPopular: false,
    pointsIncluded: 100,
  },
  {
    id: 2,
    name: 'プレミアム',
    price: 3600,
    period: '月額',
    features: [
      'いいね！ 無制限',
      'マッチング後メッセージ無制限',
      'プロフィール閲覧制限なし',
      '既読表示機能',
      'マッチング優先表示',
      'プロフィールブースト 3回/月',
    ],
    isPopular: true,
    pointsIncluded: 500,
  },
  {
    id: 3,
    name: 'VIP',
    price: 9800,
    period: '月額',
    features: [
      'プレミアムのすべての機能',
      'VIP限定マッチング',
      '身分証明済みユーザーとのマッチング優先',
      'プロフィールブースト 10回/月',
      '24時間サポート',
      'デートプラン提案機能',
    ],
    isPopular: false,
    pointsIncluded: 2000,
  },
];

// モックデータ - ポイントパッケージ
const pointPackages = [
  {
    id: 1,
    name: 'スターター',
    points: 500,
    price: 980,
    discount: 0,
  },
  {
    id: 2,
    name: 'スタンダード',
    points: 1500,
    price: 2800,
    discount: 5,
  },
  {
    id: 3,
    name: 'プレミアム',
    points: 3000,
    price: 4800,
    discount: 10,
  },
  {
    id: 4,
    name: 'エリート',
    points: 10000,
    price: 12000,
    discount: 20,
  },
];

// モックデータ - 特別機能価格
const specialFeatures = [
  {
    id: 1,
    name: 'プロフィールブースト',
    description: '24時間、検索結果の上位に表示されます',
    points: 300,
    enabled: true,
  },
  {
    id: 2,
    name: '「スーパーいいね！」',
    description: '通常の3倍目立ついいね！でアピール',
    points: 200,
    enabled: true,
  },
  {
    id: 3,
    name: 'リマッチ',
    description: '過去にスキップしたユーザーともう一度マッチングチャンス',
    points: 150,
    enabled: true,
  },
  {
    id: 4,
    name: 'プロフィール閲覧履歴',
    description: '自分のプロフィールを見たユーザーを確認',
    points: 250,
    enabled: true,
  },
  {
    id: 5,
    name: 'プレミアムフィルター',
    description: '年収、学歴などの詳細条件でフィルタリング',
    points: 200,
    enabled: true,
  },
  {
    id: 6,
    name: '位置情報共有',
    description: 'マッチングしたユーザーと位置情報を共有',
    points: 100,
    enabled: false,
  },
];

// モックデータ - ギフトアイテム
const giftItems = [
  {
    id: 1,
    name: '花束',
    description: '美しいバーチャル花束を贈ります',
    points: 300,
    image: '🌹',
    enabled: true,
  },
  {
    id: 2,
    name: 'ケーキ',
    description: 'お祝いの気持ちを込めて',
    points: 400,
    image: '🍰',
    enabled: true,
  },
  {
    id: 3,
    name: 'ハート',
    description: '気持ちを伝える定番ギフト',
    points: 200,
    image: '❤️',
    enabled: true,
  },
  {
    id: 4,
    name: 'プレゼントボックス',
    description: '何が入っているかはお楽しみ',
    points: 500,
    image: '🎁',
    enabled: true,
  },
  {
    id: 5,
    name: 'シャンパン',
    description: '特別な日の celebration に',
    points: 1000,
    image: '🍾',
    enabled: true,
  },
];

// モックデータ - ダッシュボード統計
const dashboardStats = {
  totalRevenue: 12580000,  // 円
  monthlyRevenue: 3450000,  // 円
  activePlans: 3254,       // 件
  pointsSold: 2450000,     // ポイント
  activeFeatures: 12,      // 件
  activeGifts: 15,         // 件
  conversionRate: 8.5,     // %
  avgRevenuePerUser: 3500,  // 円
};

export default function BillingAdminPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">課金管理</h1>
        <p className="text-gray-500 mt-1">課金プラン、ポイントパッケージ、特別機能、ギフトの設定と管理</p>
      </div>

      {/* ダッシュボード統計 */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FiDollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">今月の売上</p>
                <p className="text-2xl font-bold text-gray-800">
                  ¥{dashboardStats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600">前月比 +12.5%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FiUsers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">アクティブプラン</p>
                <p className="text-2xl font-bold text-gray-800">
                  {dashboardStats.activePlans.toLocaleString()} 件
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600">前月比 +3.2%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FiCreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">平均単価</p>
                <p className="text-2xl font-bold text-gray-800">
                  ¥{dashboardStats.avgRevenuePerUser.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600">前月比 +5.7%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <FiActivity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">コンバージョン率</p>
                <p className="text-2xl font-bold text-gray-800">
                  {dashboardStats.conversionRate}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-red-600">前月比 -0.3%</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 課金管理メニュー */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/billing/actions" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FiActivity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">課金アクション管理</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">ポイントを消費・獲得するユーザーアクションの設定と管理</p>
              <div className="flex justify-end text-primary-600">
                <FiArrowRight />
              </div>
            </div>
          </Link>

          <Link href="/admin/billing/plans" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FiPackage className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">ポイントプラン管理</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">ポイントパッケージの設定と管理</p>
              <div className="flex justify-end text-primary-600">
                <FiArrowRight />
              </div>
            </div>
          </Link>

          <Link href="/admin/billing/subscriptions" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <FiRepeat className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">サブスクリプション管理</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">月額・年額などの定期課金プランの設定と管理</p>
              <div className="flex justify-end text-primary-600">
                <FiArrowRight />
              </div>
            </div>
          </Link>

          <Link href="/admin/billing/features" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FiStar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">特別機能管理</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">プレミアム機能や特別アクセス権の設定と価格管理</p>
              <div className="flex justify-end text-primary-600">
                <FiArrowRight />
              </div>
            </div>
          </Link>

          <Link href="/admin/billing/gifts" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
                  <FiGift className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">ギフト管理</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">ユーザー間で送信できるバーチャルギフトの設定と管理</p>
              <div className="flex justify-end text-primary-600">
                <FiArrowRight />
              </div>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* サブスクリプションプラン概要 */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">サブスクリプションプラン概要</h2>
            <p className="text-sm text-gray-500 mt-1">現在提供中のサブスクリプションプランの概要</p>
          </div>
          <Link href="/admin/billing/subscriptions" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center">
            <span>サブスクリプション管理</span>
            <FiArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {billingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                plan.isPopular ? 'border-primary-500' : 'border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
                  人気プラン
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">¥{plan.price.toLocaleString()}</span>
                  <span className="ml-1 text-gray-500">/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-primary-600">{plan.pointsIncluded} ポイント付与</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                    編集
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
                    無効化
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ポイントパッケージ概要 */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">ポイントパッケージ概要</h2>
            <p className="text-sm text-gray-500 mt-1">ユーザーが購入可能なポイントパッケージの概要</p>
          </div>
          <Link href="/admin/billing/plans" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center">
            <span>パッケージ管理</span>
            <FiArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  パッケージ名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ポイント数
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  価格
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  割引率
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pointPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.points.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">¥{pkg.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.discount}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">編集</button>
                      <button className="text-red-600 hover:text-red-900">削除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* 特別機能概要 */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">特別機能概要</h2>
            <p className="text-sm text-gray-500 mt-1">提供中のプレミアム機能と価格設定の概要</p>
          </div>
          <Link href="/admin/billing/features" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center">
            <span>機能管理</span>
            <FiArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  機能名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  説明
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ポイント数
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {specialFeatures.map((feature) => (
                <tr key={feature.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{feature.points}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      feature.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {feature.enabled ? '有効' : '無効'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">編集</button>
                      <button className={`${feature.enabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                        {feature.enabled ? '無効化' : '有効化'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ギフトアイテム概要 */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">ギフトアイテム概要</h2>
            <p className="text-sm text-gray-500 mt-1">ユーザー間で送信可能なギフトアイテムの概要</p>
          </div>
          <Link href="/admin/billing/gifts" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center">
            <span>ギフト管理</span>
            <FiArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftItems.map((gift) => (
            <div key={gift.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="text-center text-4xl mb-4">{gift.image}</div>
                <h3 className="text-lg font-semibold text-gray-800 text-center">{gift.name}</h3>
                <p className="mt-2 text-sm text-gray-600 text-center">{gift.description}</p>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {gift.points} ポイント
                  </span>
                </div>
                <div className="mt-6 flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                    編集
                  </button>
                  <button className={`flex-1 px-4 py-2 rounded-md text-sm ${
                    gift.enabled 
                      ? 'border border-red-300 text-red-700 hover:bg-red-50' 
                      : 'border border-green-300 text-green-700 hover:bg-green-50'
                  }`}>
                    {gift.enabled ? '無効化' : '有効化'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
