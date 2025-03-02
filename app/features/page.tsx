'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  imageUrl?: string;
  reverse?: boolean;
}

const Feature = ({ icon, title, description, imageUrl, reverse = false }: FeatureProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 py-16`}
    >
      <div className="flex-1">
        <motion.div variants={itemVariants} className="inline-block p-3 bg-[#e6f7f3] rounded-full mb-4">
          <span className="text-2xl">{icon}</span>
        </motion.div>
        <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-4 text-gray-800">
          {title}
        </motion.h3>
        <motion.p variants={itemVariants} className="text-gray-600 leading-relaxed mb-6">
          {description}
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link 
            href="/contact" 
            className="inline-flex items-center text-[#66cdaa] hover:text-[#5bb799] font-medium"
          >
            詳細を見る
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </div>
      {imageUrl && (
        <motion.div 
          variants={itemVariants}
          className="flex-1 relative overflow-hidden rounded-2xl shadow-xl"
        >
          <div className="aspect-w-4 aspect-h-3">
            <Image
              src={imageUrl}
              alt={title}
              width={500}
              height={375}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function Features() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
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
            <Link href="/features" className="text-[#66cdaa] font-medium">
              機能
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              料金
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#66cdaa] transition-colors">
              お問い合わせ
            </Link>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 bg-gradient-to-b from-[#e6f7f3] to-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            LINEBUZZの機能
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            日本の出会いの文化に合わせた、使いやすく安心なマッチング体験を提供します。
          </motion.p>
        </div>
      </section>

      {/* 機能一覧 */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <Feature
            icon="💬"
            title="LINE風チャット機能"
            description="日本で最も使われているLINEに似たチャットインターフェースで、慣れ親しんだ使い心地を実現。吹き出し形式のメッセージ、スタンプ、画像共有など、会話をスムーズに楽しめます。既読表示や入力中表示などの機能も完備しています。"
            imageUrl="/images/app-screenshot.svg"
          />
          
          <div className="border-t border-gray-200"></div>
          
          <Feature
            icon="👥"
            title="価値観マッチング"
            description="外見だけでなく、価値観や趣味、ライフスタイルなど、より深い部分で相性の良いパートナーを見つけられます。日本人特有の恋愛観や結婚観も考慮したマッチングアルゴリズムを採用し、長期的な関係構築をサポートします。"
            imageUrl="/images/app-screenshot.svg"
            reverse
          />
          
          <div className="border-t border-gray-200"></div>
          
          <Feature
            icon="🔒"
            title="安心・安全なシステム"
            description="厳格な本人確認と24時間365日のモニタリングで、安心して利用できる環境を提供します。不適切なユーザーの排除や、プライバシー設定の充実など、日本のユーザーが求める高いセキュリティ基準を満たしています。"
            imageUrl="/images/app-screenshot.svg"
          />
          
          <div className="border-t border-gray-200"></div>
          
          <Feature
            icon="📱"
            title="ビデオ通話・音声通話"
            description="テキストだけでなく、ビデオ通話や音声通話機能も完備。対面で話すような自然なコミュニケーションが可能です。相手の表情や声のトーンからより深く相手を知ることができ、安心して実際に会う判断ができます。"
            imageUrl="/images/app-screenshot.svg"
            reverse
          />
          
          <div className="border-t border-gray-200"></div>
          
          <Feature
            icon="🎭"
            title="段階的な情報開示"
            description="相手とのやり取りが進むにつれて、段階的に情報を開示できる仕組みを採用。初めは基本的なプロフィールのみを共有し、信頼関係が築けるにつれて、より詳細な情報や写真を開示できます。日本人特有の慎重さに配慮した設計です。"
            imageUrl="/images/app-screenshot.svg"
          />
        </div>
      </section>

      {/* CTA部分 */}
      <section className="py-20 bg-gradient-to-b from-white to-[#e6f7f3]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="max-w-3xl mx-auto"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-gray-800">
              あなたにぴったりのパートナーを見つけませんか？
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8">
              LINEBUZZは日本の出会いの文化に特化した、使いやすく安心なマッチングアプリです。今すぐ無料でお試しください。
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href="/"
                className="inline-block bg-[#66cdaa] text-white font-medium px-8 py-4 rounded-lg hover:bg-[#5bb799] transition-colors shadow-md"
              >
                無料で始める
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-50 py-8">
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
