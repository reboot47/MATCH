"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCamera, FiPlus, FiInfo, FiImage } from 'react-icons/fi';
import { UserContext } from '../../../../components/UserContext';
import BottomNavigation from '@/app/components/BottomNavigation';

export default function ProfileNewEditPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  
  // 性別に基づいてUI表示を切り替える（デモ用：実際にはユーザー情報から取得）
  const [gender, setGender] = useState<'male' | 'female'>('female');
  
  // 画像のホバー状態を管理
  const [mainPhotoHover, setMainPhotoHover] = useState(false);
  
  // デモ用：性別切り替えボタン（実装時には不要）
  const toggleGender = () => {
    setGender(prev => prev === 'male' ? 'female' : 'male');
  };

  // ページトランジションのアニメーション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  // アピール写真（女性用）
  const appealPhotos = [
    { id: 1, url: '/images/profile/female_appeal1.jpg' },
    { id: 2, url: '/images/profile/female_appeal2.jpg' },
    { id: 3, url: '/images/profile/female_appeal3.jpg' }
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-gray-50 pb-16"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center px-4 py-3">
            <button 
              onClick={() => router.back()}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium ml-2">プロフィール編集</h1>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="pb-16">
          {/* お気持ちからプロフィール確認 */}
          <Link href="/mypage/profile/view" className="block bg-white mb-2">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <span className="text-teal-500">相手から見たあなたのプロフィールを確認する</span>
              <FiChevronRight className="text-teal-500" size={20} />
            </div>
          </Link>

          {/* メイン写真 */}
          <div className="bg-white mb-2 p-4">
            <h2 className="font-medium">メイン写真</h2>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              {gender === 'female' 
                ? 'あなたの魅力が一番伝わる写真を選びましょう' 
                : 'あなたの魅力が一番伝わる写真を選びましょう'}
            </p>
            
            <div 
              className="relative w-full aspect-square bg-gray-100 rounded overflow-hidden"
              onMouseEnter={() => setMainPhotoHover(true)}
              onMouseLeave={() => setMainPhotoHover(false)}
            >
              {gender === 'female' ? (
                <Image 
                  src="/images/profile/profile_placeholder_female.jpg" 
                  alt="プロフィール写真" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <Image 
                  src="/images/profile/car_placeholder.jpg" 
                  alt="プロフィール写真" 
                  fill 
                  className="object-cover"
                />
              )}
              
              <div className="absolute bottom-4 right-4 z-10">
                <motion.button 
                  className="bg-white rounded-full p-3 shadow-md"
                  onClick={() => router.push('/mypage/profile/edit/main-photo/new')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiCamera size={24} className="text-gray-600" />
                </motion.button>
              </div>
            </div>
            
            <Link href="#" className="flex items-center mt-3 text-sm text-gray-600">
              <FiInfo size={16} className="mr-1" />
              <span>メイン写真の選び方について詳しく見る</span>
            </Link>
          </div>

          {/* サブ写真（男性）または アピール系（女性） */}
          {gender === 'male' ? (
            <div className="bg-white mb-2 p-4">
              <h2 className="font-medium">サブ写真</h2>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                プライベート、趣味、職種、会食、ペット、旅行など
              </p>
              
              <button className="w-full flex items-center justify-center py-6 border-2 border-dashed border-teal-300 rounded-lg text-teal-500">
                <FiPlus size={24} className="mr-2" />
                <span>追加</span>
              </button>
              
              <Link href="#" className="flex items-center mt-3 text-sm text-gray-600">
                <FiInfo size={16} className="mr-1" />
                <span>サブ写真の選び方について詳しく見る</span>
              </Link>
            </div>
          ) : (
            <>
              {/* アピール動画 */}
              <div className="bg-white mb-2 p-4">
                <h2 className="font-medium">アピール動画</h2>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  実際であなたの魅力をもっと伝えましょう
                </p>
                
                <motion.button 
                  className="w-full flex items-center justify-center py-6 border-2 border-dashed border-teal-300 rounded-lg text-teal-500"
                  onClick={() => router.push('/mypage/profile/edit/appeal-video/new')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus size={24} className="mr-2" />
                  <span>追加</span>
                </motion.button>
                
                <Link href="#" className="flex items-center mt-3 text-sm text-gray-600">
                  <FiInfo size={16} className="mr-1" />
                  <span>アピール動画の選び方について詳しく見る</span>
                </Link>
              </div>
              
              {/* アピール写真 */}
              <div className="bg-white mb-2 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-medium">アピール写真</h2>
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">おすすめ：設定</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  魅力が伝わる写真は、マッチング率がアップします！
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {appealPhotos.map(photo => (
                    <div key={photo.id} className="aspect-square relative bg-gray-200 rounded overflow-hidden">
                      <Image 
                        src={photo.url} 
                        alt={`アピール写真 ${photo.id}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <motion.div 
                    className="aspect-square bg-gray-100 rounded flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-teal-300"
                    onClick={() => router.push('/mypage/profile/edit/appeal-photo/new')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlus size={20} className="text-teal-500 mb-1" />
                    <span className="text-xs text-teal-500">追加</span>
                  </motion.div>
                </div>
                
                <Link href="#" className="flex items-center mt-1 text-sm text-gray-600">
                  <FiInfo size={16} className="mr-1" />
                  <span>アピール写真の選び方について詳しく見る</span>
                </Link>
              </div>
            </>
          )}

          {/* アピールタグ設定 */}
          <div className="bg-white mb-2 p-4">
            <h2 className="font-medium">アピールタグ設定</h2>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              アピールタグを設定するとあなたの特徴がもっと伝わるようになります
            </p>
            
            <motion.button 
              className="w-full flex items-center justify-center py-6 border-2 border-dashed border-teal-300 rounded-lg text-teal-500"
              onClick={() => router.push('/mypage/profile/edit/appeal-tags/new')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={24} className="mr-2" />
              <span>追加</span>
            </motion.button>
          </div>

          {/* つぶやき */}
          <Link href="/mypage/profile/edit/status" className="block bg-white mb-2">
            <div className="flex justify-between items-center p-4">
              <div>
                <h2 className="font-medium">つぶやき</h2>
                <p className="text-sm text-gray-500 mt-1">
                  いつでも編集できます。ご遠慮なく 😊
                </p>
              </div>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </Link>

          {/* 出会いの目的 */}
          <Link href="/mypage/profile/edit/preference/dating-purpose" className="block bg-white mb-2">
            <div className="flex justify-between items-center p-4">
              <div>
                <h2 className="font-medium">出会いの目的</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {gender === 'female' ? '♥ 恋愛目的 ♥' : '選択してください'}
                </p>
              </div>
              <FiChevronRight className="text-gray-400" size={20} />
            </div>
          </Link>

          {/* プロフィール設定 */}
          <div className="bg-white mb-2">
            <h2 className="font-medium p-4 pb-2">プロフィール設定</h2>
            
            {/* 自己紹介文 */}
            <Link href="/mypage/profile/edit/bio" className="block">
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                <div>
                  <h3 className="text-gray-800">自己紹介文を編集</h3>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-teal-500 mr-2">{gender === 'male' ? '100%完了' : '100%完了'}</span>
                  <FiChevronRight className="text-gray-400" size={20} />
                </div>
              </div>
            </Link>
            
            {/* 基本プロフィール */}
            <Link href="/mypage/profile/edit/basic-info" className="block">
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                <div>
                  <h3 className="text-gray-800">基本プロフを編集</h3>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-teal-500 mr-2">100%完了</span>
                  <FiChevronRight className="text-gray-400" size={20} />
                </div>
              </div>
            </Link>
            
            {/* その他プロフィール */}
            <Link href="/mypage/profile/edit/additional-info" className="block">
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                <div>
                  <h3 className="text-gray-800">その他プロフを編集</h3>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-teal-500 mr-2">100%完了</span>
                  <FiChevronRight className="text-gray-400" size={20} />
                </div>
              </div>
            </Link>
          </div>

          {/* 設計用ボタン：性別切り替え（実際の実装では削除） */}
          <div className="p-4">
            <button 
              onClick={toggleGender}
              className="w-full bg-gray-200 py-2 rounded text-gray-700 text-sm"
            >
              現在の表示: {gender === 'female' ? '女性用' : '男性用'} (切り替える)
            </button>
          </div>
        </div>

        {/* ボトムナビゲーション */}
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <BottomNavigation />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
