"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from '@/app/components/Header'; // Headerコンポーネントをインポート

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ローディングアニメーション
    console.log('ホームページがロードされました');
    let isMounted = true;
    
    // 認証状態を確認（デモ用に簡易実装）
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
      // 認証済みユーザーは /home へリダイレクト
      console.log('認証済みユーザーを/homeへリダイレクト');
      router.push('/home');
      return;
    }
    
    // メインタイマー
    const timer = setTimeout(() => {
      if (isMounted) {
        console.log('ホームページのロード完了');
        setLoading(false);
      }
    }, 1000); // 1.5秒から1秒に短縮
    
    // バックアップタイマー
    const backupTimer = setTimeout(() => {
      if (isMounted && loading) {
        console.log('バックアップタイマーによるローディング完了');
        setLoading(false);
      }
    }, 2000);
    
    // 絶対にローディングを終了させる最終手段
    const finalTimer = setTimeout(() => {
      if (isMounted && loading) {
        console.log('最終手段によるローディング強制終了');
        setLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(backupTimer);
      clearTimeout(finalTimer);
    };
  }, [loading, router]);

  const handleGetStarted = () => {
    // デモ用に認証済み状態をローカルストレージに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
    }
    router.push('/home');
  };

  return (
    <main className="min-h-screen flex flex-col">
      {loading ? (
        <motion.div 
          className="flex-1 flex items-center justify-center bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div className="flex justify-center mb-4">
              <Image
                src="/images/linebuzz-logo.svg"
                alt="LINEBUZZ"
                width={200}
                height={60}
                className="h-16 w-auto"
              />
            </motion.div>
            <p className="text-gray-600">ロード中...</p>
          </motion.div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* ヘッダーコンポーネントを使用 */}
          <Header />
          
          {/* メインコンテンツ - モバイル対応のパディング調整 */}
          <div className="flex-1 pt-16 md:pt-20">
            {/* ヒーローセクション */}
            <section className="relative bg-gradient-to-b from-[#e6f7f3] to-white py-20 md:py-32">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/background-pattern.svg')] opacity-10"></div>
              </div>
              
              <div className="relative z-10 container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                    <motion.h1 
                      className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      新しい出会いの<br className="md:hidden" />はじまり
                    </motion.h1>
                    
                    <motion.p 
                      className="text-lg sm:text-xl max-w-2xl mb-10 text-gray-600"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      LINEBUZZは、あなたにぴったりの素敵な出会いをお届けする日本発のマッチングアプリです。日本の文化や価値観に合わせた機能で、安心して使えるサービスを提供します。
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                    >
                      <button
                        onClick={handleGetStarted}
                        className="bg-[#66cdaa] hover:bg-[#5bb799] text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transform transition-all duration-300"
                      >
                        無料で始める
                      </button>
                      <button
                        onClick={() => router.push("/features")}
                        className="bg-white hover:bg-gray-100 text-[#66cdaa] font-bold text-lg px-8 py-4 rounded-lg shadow-lg border border-[#66cdaa] transform transition-all duration-300"
                      >
                        詳しく見る
                      </button>
                    </motion.div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="relative"
                    >
                      <div className="relative mx-auto w-[280px] md:w-[320px]">
                        <Image
                          src="/images/app-screenshot.svg"
                          alt="LINEBUZZ App Screenshot"
                          width={320}
                          height={640}
                          className="w-full h-auto shadow-2xl rounded-3xl border-8 border-white"
                          priority
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* 特徴セクション */}
            <section className="py-20 px-4 bg-white">
              <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
                  LINEBUZZが選ばれる理由
                </h2>
                <p className="text-lg text-center mb-16 text-gray-600 max-w-3xl mx-auto">
                  安心して使える、日本人のための日本人によるマッチングアプリ
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[
                    {
                      title: "LINE風チャット",
                      description: "日本で馴染みのあるLINE風インターフェースで、直感的に使えるメッセージやスタンプ機能を搭載。",
                      icon: "💬"
                    },
                    {
                      title: "安心の本人確認",
                      description: "徹底した本人確認と24時間365日のモニタリングで、安全なマッチング環境を提供します。",
                      icon: "🔒"
                    },
                    {
                      title: "価値観マッチング",
                      description: "外見だけでなく、趣味や価値観で繋がる。日本人の恋愛観に合わせたマッチングアルゴリズム。",
                      icon: "❤️"
                    },
                    {
                      title: "ビデオ通話機能",
                      description: "実際に会う前に、ビデオ通話でお互いの雰囲気がわかり、安心して次のステップに進めます。",
                      icon: "📱"
                    },
                    {
                      title: "プライバシー設定",
                      description: "細かなプライバシー設定で、自分に合った公開範囲を設定可能。段階的な情報開示をサポート。",
                      icon: "👤"
                    },
                    {
                      title: "日本語ネイティブ設計",
                      description: "日本語の敬語や婉曲的な表現など、日本人特有のコミュニケーションスタイルに最適化。",
                      icon: "🇯🇵"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-[#e6f7f3] w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* 使い方セクション */}
            <section className="py-20 px-4 bg-[#f8fbfa]">
              <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
                  簡単3ステップではじめる
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {[
                    {
                      step: "01",
                      title: "プロフィール作成",
                      description: "自分の写真やプロフィールを登録して、あなたらしさをアピール。",
                      icon: "📝"
                    },
                    {
                      step: "02",
                      title: "相性の良い相手を見つける",
                      description: "AIがあなたの好みや価値観を学習し、ぴったりの相手を紹介します。",
                      icon: "🔍"
                    },
                    {
                      step: "03",
                      title: "メッセージを送る",
                      description: "マッチングしたらLINE風チャットで自然な会話を楽しみましょう。",
                      icon: "📲"
                    }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg mx-auto mb-6 relative">
                        <span className="absolute -top-2 -right-2 bg-[#66cdaa] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {step.step}
                        </span>
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* CTAセクション */}
            <section className="py-20 px-4 bg-white">
              <div className="container mx-auto max-w-5xl">
                <div className="bg-gradient-to-r from-[#e6f7f3] to-[#f0faf7] rounded-2xl p-8 md:p-16 shadow-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                      今すぐ素敵な出会いを見つけよう
                    </h2>
                    <p className="text-lg mb-8 text-gray-700 max-w-3xl mx-auto">
                      LINEBUZZで新しい人間関係を広げましょう。あなたの人生を変える出会いが待っています。いつでも、どこでも、安心して使えるマッチングアプリです。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => router.push("/register")}
                        className="bg-[#66cdaa] hover:bg-[#5bb799] text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transform transition-all duration-300"
                      >
                        無料で登録する
                      </button>
                      <Link
                        href="/features"
                        className="bg-white hover:bg-gray-100 text-[#66cdaa] font-bold text-lg px-8 py-4 rounded-lg shadow-lg border border-[#66cdaa] transform transition-all duration-300"
                      >
                        詳しく見る
                      </Link>
                    </div>
                  </div>
                </div>
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
                    <p className="text-gray-600 text-sm mt-2"> 2023 LINEBUZZ. All rights reserved.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <Link href="/features" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                      機能
                    </Link>
                    <Link href="/pricing" className="text-gray-600 hover:text-[#66cdaa] text-sm">
                      料金
                    </Link>
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
        </div>
      )}
    </main>
  );
}
