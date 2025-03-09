"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiPencil, HiPlusCircle, HiInformationCircle } from 'react-icons/hi';
import { UserContext } from '../../../../components/UserContext';
import Footer from '../../../components/Footer';

// 各セクションの型定義
type ProfileSection = {
  title: string;
  description?: string;
  linkTo?: string;
  completed?: boolean;
  icon?: React.ReactNode;
  action?: () => void;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  
  const [mainPhotoHover, setMainPhotoHover] = useState(false);

  // ページ移行時のアニメーション設定
  const pageTransitionVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // プロフィール編集セクション
  const profileSections: ProfileSection[] = [
    {
      title: 'お気持ちからあなたのプロフィールを確認する',
      linkTo: '/mypage/profile/edit/basic',
      icon: <HiChevronRight className="text-teal-500" size={20} />
    },
    {
      title: 'メイン写真',
      description: 'あなたの魅力が一番伝わる写真を選びましょう'
    },
    {
      title: 'サブ写真',
      description: 'プライベート、趣味、職場、会食、ペット、旅行など'
    },
    {
      title: 'アピールタグ設定',
      description: 'アピールタグを設定するとあなたの特徴がもっと伝わるようになります'
    },
    {
      title: 'つぶやき',
      description: 'いつでも編集できます。ご遠慮なく',
      linkTo: '/mypage/profile/edit/status',
      icon: <HiChevronRight className="text-teal-500" size={20} />
    },
    {
      title: '出会いの目的',
      description: '選択してください',
      linkTo: '/mypage/profile/edit/purpose',
      icon: <HiChevronRight className="text-teal-500" size={20} />
    },
    {
      title: 'プロフィール設定',
      description: ''
    },
    {
      title: '自己紹介文を編集',
      linkTo: '/mypage/profile/edit/bio',
      completed: true,
      icon: <HiChevronRight className="text-teal-500" size={20} />
    },
    {
      title: '基本プロフを編集',
      linkTo: '/mypage/profile/edit/basic-info',
      completed: true,
      icon: <HiChevronRight className="text-teal-500" size={20} />
    },
    {
      title: 'その他プロフを編集',
      linkTo: '/mypage/profile/edit/additional-info',
      completed: true,
      icon: <HiChevronRight className="text-teal-500" size={20} />
    }
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="flex flex-col min-h-screen bg-gray-50"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransitionVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* ヘッダー */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 text-gray-600"
            aria-label="戻る"
          >
            <HiChevronLeft size={24} />
          </button>
          <h1 className="text-center flex-grow font-medium text-lg">プロフィール編集</h1>
          <div className="w-8"></div> {/* バランスのためのスペース */}
        </header>

        {/* メインコンテンツ */}
        <main className="flex-grow pt-16 pb-20">
          <div className="divide-y divide-gray-100">
            {/* 基本プロフィール編集セクション */}
            <section className="p-4 bg-white">
              {profileSections.slice(0, 1).map((section, index) => (
                <Link href={section.linkTo || '#'} key={index}>
                  <div className="flex justify-between items-center py-2 px-1">
                    <span className="text-teal-500 font-medium">{section.title}</span>
                    {section.icon}
                  </div>
                </Link>
              ))}
            </section>

            {/* メイン写真セクション */}
            <section className="p-4 bg-white">
              <h3 className="font-medium mb-2">{profileSections[1].title}</h3>
              <p className="text-sm text-gray-500 mb-3">{profileSections[1].description}</p>
              
              <div 
                className="relative rounded-lg overflow-hidden bg-gray-100 w-full h-64 mb-3"
                onMouseEnter={() => setMainPhotoHover(true)}
                onMouseLeave={() => setMainPhotoHover(false)}
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="プロフィール画像"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <HiPlusCircle className="text-gray-400" size={40} />
                  </div>
                )}
                
                <motion.div 
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: mainPhotoHover ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button className="bg-white text-gray-700 rounded-md py-2 px-4 mb-4 flex items-center">
                    <span className="mr-2">📷</span> 撮影する
                  </button>
                </motion.div>
              </div>
              
              <Link href="/mypage/profile/edit/photo-guide" className="flex items-center text-sm text-gray-600 mt-2">
                <HiInformationCircle className="mr-1" />
                <span>メイン写真の選び方について詳しく見る</span>
              </Link>
            </section>

            {/* サブ写真セクション */}
            <section className="p-4 bg-white">
              <h3 className="font-medium mb-2">{profileSections[2].title}</h3>
              <p className="text-sm text-gray-500 mb-3">{profileSections[2].description}</p>
              
              <motion.button 
                className="w-full flex items-center justify-center p-4 border-2 border-dashed border-teal-300 rounded-lg text-teal-500"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <HiPlusCircle size={24} className="mr-2" />
                <span>追加</span>
              </motion.button>
              
              <Link href="/mypage/profile/edit/sub-photo-guide" className="flex items-center text-sm text-gray-600 mt-3">
                <HiInformationCircle className="mr-1" />
                <span>サブ写真の選び方について詳しく見る</span>
              </Link>
            </section>

            {/* アピールタグセクション */}
            <section className="p-4 bg-white">
              <h3 className="font-medium mb-2">{profileSections[3].title}</h3>
              <p className="text-sm text-gray-500 mb-3">{profileSections[3].description}</p>
              
              <motion.button 
                className="w-full flex items-center justify-center p-4 border-2 border-dashed border-teal-300 rounded-lg text-teal-500"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <HiPlusCircle size={24} className="mr-2" />
                <span>追加</span>
              </motion.button>
            </section>

            {/* その他のセクション */}
            {profileSections.slice(4).map((section, index) => (
              <section key={index} className="bg-white">
                <Link href={section.linkTo || '#'}>
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="font-medium">{section.title}</h3>
                      {section.description && (
                        <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {section.completed && (
                        <span className="text-xs text-teal-500 mr-2">100%完了</span>
                      )}
                      {section.icon}
                    </div>
                  </div>
                </Link>
              </section>
            ))}
          </div>
        </main>

        {/* フッター */}
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <Footer activeTab="mypage" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
