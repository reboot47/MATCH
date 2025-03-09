'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaLock, 
  FaServer, 
  FaGlobe, 
  FaHandshake, 
  FaCookieBite,
  FaArrowLeft,
  FaClipboardList
} from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'introduction',
      title: 'はじめに',
      icon: <FaShieldAlt className="w-6 h-6" />,
      content: `
        LineBuzzへようこそ。私たちは、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
        このプライバシーポリシーは、当社のサービスをご利用いただく際に収集・使用する情報と、
        お客様がその情報についてどのような選択肢を持っているかを説明するものです。
        
        LineBuzzをご利用いただくことにより、お客様はこのプライバシーポリシーに記載されている
        情報の収集と使用に同意されたものとみなされます。
      `
    },
    {
      id: 'collected-info',
      title: '収集する情報',
      icon: <FaClipboardList className="w-6 h-6" />,
      content: `
        当社が収集する情報には以下が含まれます：

        • アカウント情報：氏名、メールアドレス、生年月日、性別など
        • プロフィール情報：写真、興味・関心、自己紹介文など
        • 位置情報：現在地、活動地域など（設定により制御可能）
        • 利用情報：アクセス履歴、利用頻度、利用機能など
        • デバイス情報：IPアドレス、デバイスの種類、オペレーティングシステムなど
      `
    },
    {
      id: 'information-usage',
      title: '情報の利用方法',
      icon: <FaServer className="w-6 h-6" />,
      content: `
        収集した情報は以下の目的で利用されます：

        • サービスの提供と改善：最適なマッチングの提供、機能の向上など
        • カスタマイズ：個人の好みに合わせたコンテンツや広告の提供
        • コミュニケーション：重要な通知、アップデート情報、キャンペーンなどの送信
        • セキュリティ：不正利用の検出と防止、アカウントの保護
        • 分析：サービス利用状況の分析、統計情報の作成

        すべての情報利用はお客様の同意に基づいて行われ、プライバシー設定でカスタマイズできます。
      `
    },
    {
      id: 'data-sharing',
      title: '情報の共有',
      icon: <FaHandshake className="w-6 h-6" />,
      content: `
        当社はお客様の個人情報を以下の場合を除き、第三者と共有することはありません：

        • お客様の同意がある場合
        • 法的要請に応じる必要がある場合
        • サービス提供に必要なパートナー企業との共有（データ処理業者など）
        • 匿名化された集計データの分析目的での共有

        当社はお客様のデータを販売することはありません。
      `
    },
    {
      id: 'data-security',
      title: 'データセキュリティ',
      icon: <FaLock className="w-6 h-6" />,
      content: `
        お客様の個人情報を保護するために、当社は以下の対策を講じています：

        • 暗号化技術：すべての通信とデータ保存において最新の暗号化技術を使用
        • アクセス制限：従業員のデータアクセスを厳しく制限し、適切な認証を要求
        • 定期的なセキュリティレビュー：システムのセキュリティを定期的に評価・更新
        • インシデント対応：セキュリティインシデントに迅速に対応するための体制を整備

        しかしながら、インターネット上での完全なセキュリティは保証できないことをご了承ください。
      `
    },
    {
      id: 'data-retention',
      title: 'データ保持期間',
      icon: <FaUserShield className="w-6 h-6" />,
      content: `
        当社はお客様の個人情報を、サービス提供に必要な期間、または法律で定められた期間保持します。
        アカウントを削除された場合、お客様の個人情報は30日以内に完全に削除されます
        （法的義務がある場合を除く）。
        
        匿名化されたデータは、サービスの改善やトレンド分析のために
        より長期間保持される場合があります。
      `
    },
    {
      id: 'cookies',
      title: 'クッキーの使用',
      icon: <FaCookieBite className="w-6 h-6" />,
      content: `
        当社はウェブサイトとアプリケーションでクッキーと類似の技術を使用して、
        ユーザー体験の向上、セッション管理、利用状況の把握を行っています。
        
        ブラウザの設定でクッキーの使用を制限することができますが、
        一部の機能が正常に動作しなくなる可能性があります。
      `
    },
    {
      id: 'international-transfers',
      title: '国際データ転送',
      icon: <FaGlobe className="w-6 h-6" />,
      content: `
        LineBuzzはグローバルに展開しているため、お客様のデータが他国に転送される場合があります。
        当社はそのような転送が安全に行われるよう、適切な保護措置を講じています。
        
        国際転送されるデータは、転送先の国が同等のデータ保護レベルを
        提供していない場合でも、このプライバシーポリシーに従って保護されます。
      `
    },
    {
      id: 'your-rights',
      title: 'お客様の権利',
      icon: <FaUserShield className="w-6 h-6" />,
      content: `
        お客様には以下の権利があります：

        • アクセス権：当社が保持するあなたの個人情報にアクセスする権利
        • 修正権：不正確または不完全な個人情報を修正する権利
        • 削除権：特定の状況下で個人情報の削除を要求する権利
        • 処理制限権：特定の状況下で個人情報の処理を制限する権利
        • 異議申立権：正当な利益に基づく処理に異議を唱える権利
        • データポータビリティ権：当社が保持するあなたのデータを構造化された形式で受け取る権利

        これらの権利を行使するには、アプリケーション内の設定や
        サポートチームへの連絡を通じてリクエストを提出してください。
      `
    },
    {
      id: 'policy-changes',
      title: 'ポリシーの変更',
      icon: <FaClipboardList className="w-6 h-6" />,
      content: `
        当社は、このプライバシーポリシーを随時更新することがあります。
        重要な変更がある場合は、アプリケーション内の通知や登録されたメールアドレスへの
        通知などの方法でお知らせします。
        
        最新のプライバシーポリシーはウェブサイトで常に確認できます。
        ポリシー変更後もLineBuzzを継続して利用された場合、
        変更されたポリシーに同意されたものとみなされます。
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7f2] to-[#f0faf0]">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm py-3 fixed w-full z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image
                src="/images/linebuzz-logo.svg"
                alt="LINEBUZZ"
                width={150}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="pt-[72px]">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/profile/privacy" className="inline-flex items-center text-[#66cdaa] hover:text-teal-600 transition-colors">
              <FaArrowLeft className="mr-2" />
              プライバシー設定に戻る
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
          >
            <div className="border-b border-gray-100 p-6 flex items-center">
              <FaShieldAlt className="w-8 h-8 text-[#66cdaa] mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">プライバシーポリシー</h1>
                <p className="text-gray-600">最終更新日: 2025年3月1日</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  LineBuzzでは、ユーザーのプライバシーを非常に重要視しています。
                  このプライバシーポリシーでは、当社がどのように個人情報を収集、使用、保護するか、
                  また、ユーザーが自分の情報をどのように管理できるかについて説明します。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 目次 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">目次</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-teal-50 hover:border-teal-100 transition-colors"
                >
                  <div className="text-[#66cdaa] mr-3">
                    {section.icon}
                  </div>
                  <span className="text-gray-700 font-medium">{section.title}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* 各セクション */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                key={section.id}
                id={section.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden scroll-mt-24"
              >
                <div className="border-b border-gray-100 p-5 flex items-center bg-gray-50">
                  <div className="text-[#66cdaa] mr-3">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                </div>
                <div className="p-6">
                  <div className="prose prose-lg max-w-none">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* フッター */}
          <div className="mt-10 text-center p-6 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 mb-2">
              ご質問やご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
            <div className="flex justify-center space-x-4">
              <a href="mailto:privacy@linebuzz.jp" className="text-[#66cdaa] hover:underline">
                privacy@linebuzz.jp
              </a>
              <span className="text-gray-400">|</span>
              <a href="/contact" className="text-[#66cdaa] hover:underline">
                お問い合わせフォーム
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
