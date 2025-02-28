'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// アイコン
import { FiSettings, FiHelpCircle, FiEdit, FiPlusCircle, FiUser } from 'react-icons/fi';
import { 
  RiLiveLine, 
  RiCalendarCheckLine, 
  RiNotification3Line, 
  RiStarLine, 
  RiFileListLine, 
  RiFootprintLine, 
  RiUserHeartLine,
  RiHome4Line,
  RiSearchLine,
  RiChat1Line,
  RiUser3Line,
  RiPencilLine
} from 'react-icons/ri';

// 画像最適化ユーティリティをインポート
import { getProfileImageUrl } from '@/app/utils/imageUtils';

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
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function MyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(1);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      // ユーザーデータをフェッチ
      fetch(`/api/users/${session.user.id}/profile`)
        .then(res => res.json())
        .then(data => {
          setUserData(data);
          fetchPhotos(session.user.id);
        })
        .catch(err => {
          console.error('Failed to fetch user data:', err);
          setLoading(false);
        });
    }
    
    // バナーローテーション用のタイマー設定
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev % 3) + 1);
    }, 5000); // 5秒ごとに切り替え
    
    return () => {
      clearInterval(bannerTimer);
    };
  }, [status, session, router]);

  // 写真を取得する関数
  const fetchPhotos = async (userId) => {
    try {
      setLoading(true);
      console.log(`写真データを取得中...`);
      
      // タイムアウト処理の実装
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`/api/users/${userId}/photos`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const photos = await response.json();
      console.log(`写真データを取得しました: ${photos.length}枚`);
      
      // メイン写真を設定
      const main = photos.find(photo => photo.isMain);
      if (main) {
        setMainPhoto(main);
      }
    } catch (error) {
      console.error('写真の取得に失敗しました:', error);
      
      // AbortErrorの場合はタイムアウト
      if (error.name === 'AbortError') {
        console.log('写真取得がタイムアウトしました');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 設定ページへ移動
  const navigateToSettings = () => {
    router.push('/settings');
  };

  // プロフィール編集ページへ移動
  const navigateToProfileEdit = () => {
    router.push('/mypage/profile/edit');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </motion.div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-6 bg-white rounded-lg shadow-sm"
        >
          <FiUser size={40} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">ユーザー情報を読み込めませんでした</p>
          <button 
            onClick={() => router.refresh()}
            className="bg-teal-500 text-white px-4 py-2 rounded-full"
          >
            再読み込み
          </button>
        </motion.div>
      </div>
    );
  }
  
  // モックデータ（APIから取得するデータに置き換えることが可能）
  const likesCount = 16;
  const pointsTotal = 48;
  const coinsTotal = 12;
  const notificationCount = 25;
  const footprintCount = 27;
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col min-h-screen bg-gray-50"
    >
      {/* ヘッダー */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-teal-400 text-white p-4 flex justify-between items-center"
      >
        <Link href="/help" className="flex flex-col items-center">
          <FiHelpCircle size={24} />
          <span className="text-xs">ヘルプ</span>
        </Link>
        <div className="text-center font-bold text-xl">マイページ</div>
        <button 
          onClick={navigateToSettings} 
          className="flex flex-col items-center bg-transparent border-none text-white"
        >
          <FiSettings size={24} />
          <span className="text-xs">設定</span>
        </button>
      </motion.header>
      
      {/* プロフィール概要 */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-4 flex flex-col items-center border-b relative"
      >
        <div className="relative mb-2">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-teal-400">
            {mainPhoto ? (
              <Image 
                src={getProfileImageUrl(mainPhoto.url, 100)}
                alt={userData.name || 'プロフィール'} 
                width={80} 
                height={80} 
                className="object-cover w-full h-full"
                priority
              />
            ) : userData.image ? (
              <Image 
                src={getProfileImageUrl(userData.image, 100)}
                alt={userData.name || 'プロフィール'} 
                width={80} 
                height={80} 
                className="object-cover w-full h-full"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <RiUser3Line size={40} color="#666" />
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/mypage/profile/edit" 
              className="absolute bottom-0 right-0 bg-teal-400 rounded-full p-1 shadow-md"
            >
              <FiEdit size={16} color="white" />
            </Link>
          </motion.div>
        </div>
        
        <h2 className="text-xl font-semibold mb-1">{userData.name || 'ゲスト'}</h2>
        <Link href="/subscription" className="text-gray-500 flex items-center mb-2">
          <span>スタンダードプラン</span>
          <span className="ml-1">＞</span>
        </Link>

        {/* プロフィール編集ボタン */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={navigateToProfileEdit}
          className="mt-2 bg-teal-50 border border-teal-200 text-teal-600 rounded-full py-2 px-6 flex items-center shadow-sm w-full max-w-xs justify-center"
        >
          <RiPencilLine className="mr-2" />
          プロフィールを編集する
        </motion.button>
        
        {/* 写真管理ボタン */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/mypage/photos')}
          className="mt-2 bg-teal-50 border border-teal-200 text-teal-600 rounded-full py-2 px-6 flex items-center shadow-sm w-full max-w-xs justify-center"
        >
          <RiPencilLine className="mr-2" />
          写真を管理する
        </motion.button>
      </motion.div>
      
      {/* アクティビティ情報 */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 bg-white mb-4"
      >
        <div className="flex flex-col items-center p-3 border-r">
          <span className="text-gray-600 text-sm mb-1">貰いいね!</span>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-pink-400 flex items-center justify-center mr-1">
              <span className="text-white text-xs">♥</span>
            </div>
            <span className="font-bold">{likesCount}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center p-3 border-r">
          <span className="text-gray-600 text-sm mb-1">貰ポイント</span>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center mr-1">
              <span className="text-white text-xs">P</span>
            </div>
            <span className="font-bold">{pointsTotal}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center p-3">
          <span className="text-gray-600 text-sm mb-1">貰コイン</span>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center mr-1">
              <span className="text-white text-xs">C</span>
            </div>
            <span className="font-bold">{coinsTotal}</span>
          </div>
        </div>
      </motion.div>
      
      {/* 機能一覧（上段） */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 bg-white mb-1"
      >
        <motion.div whileHover={{ backgroundColor: '#f0f9f9' }}>
          <Link href="/live" className="flex flex-col items-center p-4 h-full w-full">
            <RiLiveLine size={28} className="text-teal-400 mb-1" />
            <span className="text-gray-700 text-sm">ライブ配信</span>
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ backgroundColor: '#f0f9f9' }}>
          <Link href="/appointments" className="flex flex-col items-center p-4 h-full w-full">
            <RiCalendarCheckLine size={28} className="text-teal-400 mb-1" />
            <span className="text-gray-700 text-sm">約束一覧</span>
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ backgroundColor: '#f0f9f9' }}>
          <Link href="/notifications" className="flex flex-col items-center p-4 h-full w-full relative">
            <RiNotification3Line size={28} className="text-teal-400 mb-1" />
            <span className="text-gray-700 text-sm">お知らせ</span>
            {notificationCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute top-3 right-8 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </motion.span>
            )}
          </Link>
        </motion.div>
      </motion.div>
      
      {/* 機能一覧（下段） */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 bg-white mb-4"
      >
        <motion.div whileHover={{ backgroundColor: '#f0f9f9' }}>
          <Link href="/favorites" className="flex flex-col items-center p-4 h-full w-full">
            <RiStarLine size={28} className="text-teal-400 mb-1" />
            <span className="text-gray-700 text-sm">お気に入り</span>
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ backgroundColor: '#f0f9f9' }}>
          <Link href="/memos" className="flex flex-col items-center p-4 h-full w-full">
            <RiFileListLine size={28} className="text-teal-400 mb-1" />
            <span className="text-gray-700 text-sm">メモ</span>
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ backgroundColor: '#f0f9f9' }}>
          <Link href="/footprints" className="flex flex-col items-center p-4 h-full w-full relative">
            <RiFootprintLine size={28} className="text-teal-400 mb-1" />
            <span className="text-gray-700 text-sm">足あと</span>
            {footprintCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute top-3 right-8 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {footprintCount > 99 ? '99+' : footprintCount}
              </motion.span>
            )}
          </Link>
        </motion.div>
      </motion.div>
      
      {/* メニューリスト */}
      <motion.div
        variants={itemVariants}
        className="mb-6"
      >
        <h3 className="text-gray-600 text-sm font-medium mb-3">プロフィール</h3>
        <div className="space-y-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <Link 
            href="/mypage/profile/details" 
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <RiUserHeartLine className="text-teal-500 mr-3" size={24} />
              <span>プロフィール詳細</span>
            </div>
            <span className="text-gray-400">＞</span>
          </Link>
          
          <Link 
            href="/mypage/profile/edit" 
            className="flex items-center justify-between p-4 border-t border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <RiPencilLine className="text-teal-500 mr-3" size={24} />
              <span>プロフィール編集</span>
            </div>
            <span className="text-gray-400">＞</span>
          </Link>
          
          <Link 
            href="/mypage/photos" 
            className="flex items-center justify-between p-4 border-t border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <RiFileListLine className="text-teal-500 mr-3" size={24} />
              <span>写真管理</span>
            </div>
            <span className="text-gray-400">＞</span>
          </Link>
        </div>
      </motion.div>
      
      {/* 広告バナー */}
      <motion.div
        variants={itemVariants}
        className="mx-4 mb-20"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-lg overflow-hidden shadow-sm relative"
        >
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image 
              src={`/images/banner${currentBanner}.svg`} 
              alt="広告" 
              width={800} 
              height={240} 
              className="w-full h-auto" 
              priority
            />
          </motion.div>
          
          {/* インジケーター */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {[1, 2, 3].map((num) => (
              <motion.div
                key={num}
                className={`w-2 h-2 rounded-full ${num === currentBanner ? 'bg-white' : 'bg-white/50'}`}
                initial={false}
                animate={{ scale: num === currentBanner ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setCurrentBanner(num)}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
