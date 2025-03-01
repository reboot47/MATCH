'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR, { SWRConfig, mutate } from 'swr';

// アイコンの最適化：必要なアイコンのみをインポート
import { FiSettings, FiEdit, FiPlusCircle, FiUser, FiChevronRight } from 'react-icons/fi';
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

// Fetcher関数
const fetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      'Cache-Control': 'max-age=30', // 30秒間キャッシュを有効に
    }
  });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
};

// 写真のFetcher
const photoFetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      'Cache-Control': 'max-age=30',
    }
  });
  if (!res.ok) throw new Error('Photos API error');
  return res.json();
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05 // スタガー時間を短縮
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 }, // 移動距離を短縮
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 } // スプリングの硬さを上げて速くする
  }
};

// バナーコンポーネントを分離して最適化
const RotatingBanner = ({ currentBanner }) => (
  <div className="relative w-full h-32 overflow-hidden rounded-lg">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentBanner}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <Image
          src={`/images/banner${currentBanner}.svg`}
          alt={`バナー ${currentBanner}`}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority={currentBanner === 1} // 最初のバナーだけpriorityを設定
          loading={currentBanner === 1 ? "eager" : "lazy"}
        />
      </motion.div>
    </AnimatePresence>
  </div>
);

// プロフィールセクションを分離
const ProfileSection = ({ userData, mainPhoto, navigateToProfileEdit }) => (
  <motion.div 
    variants={itemVariants}
    className="bg-white rounded-lg shadow-sm p-5"
  >
    <div className="flex items-center">
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
        {mainPhoto ? (
          <Image
            src={getProfileImageUrl(mainPhoto.url)}
            alt="プロフィール画像"
            fill
            sizes="80px"
            style={{ objectFit: 'cover' }}
            loading="eager"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FiUser size={30} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="ml-4 flex-1">
        <h2 className="text-xl font-semibold">{userData?.name || 'ユーザー名'}</h2>
        <p className="text-gray-500 text-sm">
          {userData?.age ? `${userData.age}歳` : ''} 
          {userData?.location ? ` • ${userData.location}` : ''}
        </p>
      </div>
      <button
        onClick={navigateToProfileEdit}
        className="p-2 text-teal-500 hover:bg-teal-50 rounded-full"
      >
        <FiEdit size={20} />
      </button>
    </div>
  </motion.div>
);

export default function MyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentBanner, setCurrentBanner] = useState(1);
  
  // SWRを使用してユーザーデータを取得
  const { data: userData, error: userError, isLoading: userLoading } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}/profile` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30秒間は重複リクエストを防止
      focusThrottleInterval: 10000, // フォーカス時の再検証を10秒間隔に制限
    }
  );
  
  // SWRを使用して写真データを取得
  const { data: photos, error: photoError, isLoading: photoLoading } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}/photos` : null,
    photoFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      focusThrottleInterval: 10000,
    }
  );
  
  // メイン写真を検索（photos配列が変更されるたびに再計算）
  const mainPhoto = photos?.find(photo => photo.isMain) || null;
  
  // 全体的なローディング状態
  const isLoading = userLoading || photoLoading || status === 'loading';
  
  // エラー状態
  const hasError = userError || photoError;
  
  // バナーの自動ローテーション
  useEffect(() => {
    // バナーローテーション用のタイマー設定
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev % 3) + 1);
    }, 5000);
    
    return () => {
      clearInterval(bannerTimer);
    };
  }, []);
  
  // セッションステータスの監視とリダイレクト
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // データの手動更新関数
  const refreshData = useCallback(() => {
    if (session?.user?.id) {
      mutate(`/api/users/${session.user.id}/profile`);
      mutate(`/api/users/${session.user.id}/photos`);
    }
  }, [session?.user?.id]);
  
  // 設定ページへ移動
  const navigateToSettings = () => {
    router.push('/settings');
  };

  // プロフィール編集ページへ移動
  const navigateToProfileEdit = () => {
    router.push('/mypage/profile/edit');
  };
  
  // ローディング状態の表示を最適化
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">読み込み中...</p>
        </motion.div>
      </div>
    );
  }
  
  // エラー状態
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-5 bg-white rounded-lg shadow-sm"
        >
          <FiUser size={32} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-3">ユーザー情報を読み込めませんでした</p>
          <button 
            onClick={() => {
              refreshData();
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm"
          >
            再読み込み
          </button>
        </motion.div>
      </div>
    );
  }

  // メインコンテンツ
  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ヘッダー */}
      <motion.header variants={itemVariants} className="bg-teal-500 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">マイページ</h1>
        </div>
        <button
          onClick={navigateToSettings}
          className="p-2 text-white hover:bg-teal-600 rounded-full"
        >
          <FiSettings size={20} />
        </button>
      </motion.header>

      {/* コンテンツエリア */}
      <div className="px-4 py-5 space-y-4">
        {/* バナー */}
        <motion.div variants={itemVariants}>
          <RotatingBanner currentBanner={currentBanner} />
        </motion.div>

        {/* プロフィール */}
        <ProfileSection 
          userData={userData} 
          mainPhoto={mainPhoto} 
          navigateToProfileEdit={navigateToProfileEdit} 
        />

        {/* プロフィール編集メニュー */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium mb-3">プロフィール編集</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/mypage/profile/basic" className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <RiUser3Line size={24} className="text-teal-500 mb-2" />
              <span className="text-sm">基本情報</span>
            </Link>
            <Link href="/mypage/profile/bio" className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <RiPencilLine size={24} className="text-teal-500 mb-2" />
              <span className="text-sm">自己紹介</span>
            </Link>
            <Link href="/mypage/profile/appeal-tags" className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <RiStarLine size={24} className="text-teal-500 mb-2" />
              <span className="text-sm">アピールポイント</span>
            </Link>
            <Link href="/mypage/profile/details" className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <RiFileListLine size={24} className="text-teal-500 mb-2" />
              <span className="text-sm">詳細プロフィール</span>
            </Link>
          </div>
        </motion.div>

        {/* 写真管理 */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">写真</h3>
            <Link href="/mypage/photos" className="text-teal-500 text-sm">
              すべて見る
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
            {mainPhoto ? (
              <div className="shrink-0 relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 mr-2">
                <Image
                  src={getProfileImageUrl(mainPhoto.url)}
                  alt="プロフィール"
                  fill
                  sizes="56px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : null}
            <Link 
              href="/mypage/photos" 
              className="shrink-0 w-14 h-14 rounded-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
            >
              <FiPlusCircle size={22} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">追加</span>
            </Link>
          </div>
        </motion.div>

        {/* アクティビティ */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium mb-3">アクティビティ</h3>
          <div className="space-y-3">
            <Link href="/mypage/likes" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center">
                <RiUserHeartLine size={20} className="text-teal-500 mr-3" />
                <span>いいね</span>
              </div>
              <span className="text-gray-400">
                <FiChevronRight size={18} />
              </span>
            </Link>
            <Link href="/mypage/footprints" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center">
                <RiFootprintLine size={20} className="text-teal-500 mr-3" />
                <span>足あと</span>
              </div>
              <span className="text-gray-400">
                <FiChevronRight size={18} />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
