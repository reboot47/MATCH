'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type PlanType = 'monthly' | 'yearly';

interface PricingFeature {
  title: string;
  free: boolean;
  premium: boolean;
  vip: boolean;
}

const pricingFeatures: PricingFeature[] = [
  { title: 'プロフィール閲覧', free: true, premium: true, vip: true },
  { title: '1日20人までのいいね送信', free: true, premium: true, vip: true },
  { title: 'メッセージ送受信（マッチ後）', free: true, premium: true, vip: true },
  { title: '無制限のいいね送信', free: false, premium: true, vip: true },
  { title: '既読確認', free: false, premium: true, vip: true },
  { title: 'プロフィール優先表示', free: false, premium: true, vip: true },
  { title: '相手からの「いいね」確認', free: false, premium: true, vip: true },
  { title: 'プロフィール写真追加（9枚まで）', free: false, premium: true, vip: true },
  { title: 'VIPバッジ表示', free: false, premium: false, vip: true },
  { title: 'スーパーいいね（最優先表示）', free: false, premium: false, vip: true },
  { title: '専属コンシェルジュサポート', free: false, premium: false, vip: true },
  { title: 'プロフィール作成支援', free: false, premium: false, vip: true },
];

export default function Pricing() {
  const [planType, setPlanType] = useState<PlanType>('monthly');
  
  const planPricing = {
    free: { monthly: '¥0', yearly: '¥0' },
    premium: { monthly: '¥3,900', yearly: '¥2,900/月' },
    vip: { monthly: '¥9,800', yearly: '¥7,800/月' },
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image
                src="/images/linebuzz-logo.svg"
                alt="LINEBUZZ"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              ホーム
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              機能
            </Link>
            <Link href="/pricing" className="text-[#66cdaa] font-medium">
              料金
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              お問い合わせ
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4 text-gray-800">
            シンプルな料金プラン
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            あなたのニーズに合わせて選べる、わかりやすい料金体系をご用意しました。
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex justify-center mt-8 mb-12">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setPlanType('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  planType === 'monthly'
                    ? 'bg-white text-[#66cdaa] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                月額プラン
              </button>
              <button
                onClick={() => setPlanType('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  planType === 'yearly'
                    ? 'bg-white text-[#66cdaa] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                年額プラン（お得）
              </button>
            </div>
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 無料プラン */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-105"
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">無料プラン</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">{planPricing.free[planType]}</span>
                {planType === 'monthly' && <span className="text-gray-600 ml-1">/月</span>}
              </div>
              <p className="text-gray-600 mb-6">LINEBUZZの基本機能を無料で体験できます。</p>
              <Link
                href="/"
                className="block w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg text-center font-medium hover:bg-gray-300 transition-colors"
              >
                無料で始める
              </Link>
            </div>
            <div className="bg-gray-50 px-8 py-6">
              <h4 className="font-medium text-gray-800 mb-4">含まれる機能：</h4>
              <ul className="space-y-3">
                {pricingFeatures.map((feature, index) => 
                  feature.free && (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature.title}
                    </li>
                  )
                )}
              </ul>
            </div>
          </motion.div>
          
          {/* プレミアムプラン */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#66cdaa] transition-transform hover:scale-105 transform scale-105 z-10"
          >
            <div className="bg-[#66cdaa] py-2 text-center text-white text-sm font-medium">
              人気プラン
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">プレミアムプラン</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">{planPricing.premium[planType]}</span>
                {planType === 'monthly' && <span className="text-gray-600 ml-1">/月</span>}
                {planType === 'yearly' && (
                  <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    25%お得
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-6">より多くの出会いを求める方におすすめのプランです。</p>
              <Link
                href="/"
                className="block w-full py-3 px-4 bg-[#66cdaa] text-white rounded-lg text-center font-medium hover:bg-[#5bb799] transition-colors"
              >
                プレミアムを選ぶ
              </Link>
            </div>
            <div className="bg-[#e6f7f3] px-8 py-6">
              <h4 className="font-medium text-gray-800 mb-4">含まれる機能：</h4>
              <ul className="space-y-3">
                {pricingFeatures.map((feature, index) => 
                  feature.premium && (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature.title}
                    </li>
                  )
                )}
              </ul>
            </div>
          </motion.div>
          
          {/* VIPプラン */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-105"
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">VIPプラン</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">{planPricing.vip[planType]}</span>
                {planType === 'monthly' && <span className="text-gray-600 ml-1">/月</span>}
                {planType === 'yearly' && (
                  <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    20%お得
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-6">最高のマッチング体験を追求する方へのプレミアムサービス。</p>
              <Link
                href="/"
                className="block w-full py-3 px-4 bg-gray-800 text-white rounded-lg text-center font-medium hover:bg-gray-700 transition-colors"
              >
                VIPを選ぶ
              </Link>
            </div>
            <div className="bg-gray-50 px-8 py-6">
              <h4 className="font-medium text-gray-800 mb-4">含まれる機能：</h4>
              <ul className="space-y-3">
                {pricingFeatures.map((feature, index) => 
                  feature.vip && (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature.title}
                    </li>
                  )
                )}
              </ul>
            </div>
          </motion.div>
        </div>
        
        {/* FAQ */}
        <motion.div variants={containerVariants} className="max-w-4xl mx-auto mt-20">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12 text-gray-800">
            よくあるご質問
          </motion.h2>
          
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">プランはいつでも変更できますか？</h3>
              <p className="text-gray-600">はい、いつでもプランを変更することができます。アップグレードの場合は即時反映され、ダウングレードの場合は現在の請求期間の終了時に反映されます。</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">支払い方法は何がありますか？</h3>
              <p className="text-gray-600">クレジットカード（Visa、MasterCard、American Express、JCB）、デビットカード、各種電子マネー、キャリア決済に対応しています。</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">解約はいつでもできますか？</h3>
              <p className="text-gray-600">はい、いつでも解約可能です。解約は設定画面から簡単に行えます。なお、解約後も現在の請求期間の終了までサービスをご利用いただけます。</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">無料プランでもパートナーを見つけることはできますか？</h3>
              <p className="text-gray-600">もちろん可能です。無料プランでも基本的なマッチング機能やメッセージのやり取りが利用できます。ただし、有料プランではより多くの機能が利用でき、マッチングの可能性が高まります。</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">プライバシーは守られますか？</h3>
              <p className="text-gray-600">プライバシー保護は最優先事項です。厳格な本人確認を行うとともに、個人情報の取り扱いには細心の注意を払っています。詳細はプライバシーポリシーをご覧ください。</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          variants={containerVariants}
          className="text-center mt-20 py-12 px-4 bg-[#e6f7f3] rounded-3xl max-w-5xl mx-auto"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4 text-gray-800">
            さあ、素敵な出会いを始めましょう
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            LINEBUZZは、日本の出会いの文化に合わせた、使いやすく安心なマッチングアプリです。
            無料プランからお試しいただけます。
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className="inline-block bg-[#66cdaa] text-white font-medium px-8 py-4 rounded-lg hover:bg-[#5bb799] transition-colors shadow-md mx-2"
            >
              無料で始める
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white text-[#66cdaa] font-medium px-8 py-4 rounded-lg border border-[#66cdaa] hover:bg-gray-50 transition-colors mx-2 mt-4 md:mt-0"
            >
              詳細を問い合わせる
            </Link>
          </motion.div>
        </motion.div>
      </main>
      
      {/* フッター */}
      <footer className="bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image
                src="/images/linebuzz-logo.svg"
                alt="LINEBUZZ"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
              <p className="text-gray-600 text-sm mt-2">© {new Date().getFullYear()} LINEBUZZ. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                利用規約
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                プライバシーポリシー
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
