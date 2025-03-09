"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BottomNavigation from '../components/BottomNavigation';
import NavigationMenu from '../components/mypage/NavigationMenu';
import GoldOptionBanner from '../components/mypage/GoldOptionBanner';
import PromotionCards from '../components/mypage/PromotionCards';
import ProfileSummary from '../components/mypage/ProfileSummary';
import BalanceStatusCard from '../components/mypage/BalanceStatusCard';
import AgeVerificationBadge from '../components/mypage/AgeVerificationBadge';
import GenderToggle from '../components/DevTools/GenderToggle';
import MypageHeader from '../components/mypage/MypageHeader';
import { useUser } from '@/components/UserContext';
import { HiOutlinePencil, HiQuestionMarkCircle, HiOutlineUserCircle, HiOutlineCog, HiOutlinePlus } from 'react-icons/hi';
import { RiVipCrownLine } from 'react-icons/ri';
import { HiLightningBolt, HiFlag, HiCalendar, HiBell, HiStar, HiDocumentText, HiClock, HiUserAdd } from 'react-icons/hi';

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? false; // デフォルトを女性に変更
  
  // 残高情報（実際のアプリではAPIから取得）
  const [balances, setBalances] = useState({
    likes: 5,
    points: 52,
    cash: 0,
    hasPaymentInfo: true
  });
  
  // ユーザーデータのロード（モック）
  useEffect(() => {
    // 実際のアプリではAPIからデータをフェッチします
    // ここではモックデータを使用
    const mockData = {
      likes: isMale ? 5 : 0, // 男性ユーザーのみいいねを表示
      points: isMale ? 3 : 52,
      cash: isMale ? 5 : 0,
      // 決済情報の有無（実際にはAPIから取得）
      hasPaymentInfo: true
    };
    
    setBalances(mockData);
  }, [isMale]);
  
  // ナビゲーションメニュー項目
  const navigationItems = [
    { icon: <HiLightningBolt className="text-teal-500 text-xl" />, label: 'ライブ配信', href: '/live' },
    { icon: <HiFlag className="text-teal-500 text-xl" />, label: 'ミッション', href: '/missions' },
    { icon: <HiCalendar className="text-teal-500 text-xl" />, label: '約束一覧', href: '/appointments' },
    { icon: <HiBell className="text-teal-500 text-xl" />, label: 'お知らせ', href: '/notifications', badge: 3 },
    { icon: <HiStar className="text-teal-500 text-xl" />, label: 'お気に入り', href: '/favorites' },
    { icon: <HiDocumentText className="text-teal-500 text-xl" />, label: 'メモ', href: '/memo' },
    { icon: <HiClock className="text-teal-500 text-xl" />, label: '履歴', href: '/history' },
    { icon: <HiUserAdd className="text-teal-500 text-xl" />, label: '友達招待', href: '/invite' }
  ];

  // ユーザーが未認証の場合はログインページにリダイレクト
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-gradient-to-b from-teal-400 to-teal-300">
      {/* 上部ヘッダー */}
      <div className="pt-8 px-4 pb-20 relative">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center space-x-6">
            <Link href="/help" className="flex flex-col items-center">
              <HiQuestionMarkCircle className="text-white text-xl mb-1" />
              <span className="text-xs">ヘルプ</span>
            </Link>
            <Link href="/mypage/settings/privacy" className="flex flex-col items-center">
              <HiOutlineUserCircle className="text-white text-xl mb-1" />
              <span className="text-xs">プライバシー</span>
            </Link>
            <Link href="/mypage/membership" className="flex flex-col items-center">
              <RiVipCrownLine className="text-white text-xl mb-1" />
              <span className="text-xs">会員ステータス</span>
            </Link>
          </div>
          
          <Link href="/mypage/settings" className="flex flex-col items-center">
            <HiOutlineCog className="text-white text-xl mb-1" />
            <span className="text-xs">設定</span>
          </Link>
        </div>
      </div>
      
      {/* 開発モード用の性別切り替え */}
      <div className="fixed top-4 right-20 z-50">
        <GenderToggle />
      </div>
      
      {/* メインコンテンツ */}
      <div className="-mt-16 relative z-10 px-6">
        <div className="bg-white rounded-t-3xl pb-4">
          {/* プロフィール画像と名前 */}
          <div className="flex flex-col items-center -mt-12">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                {isMale ? (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold">
                    M
                  </div>
                ) : (
                  <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-500 text-4xl font-bold">
                    F
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 flex items-center">
              <h2 className="text-xl font-bold">yuki</h2>
              <button className="ml-2 text-teal-500">
                <HiOutlinePencil />
              </button>
            </div>
            
            {/* 年齢未確認バッジ - 女性のみ */}
            {!isMale && <AgeVerificationBadge />}
            
            {/* 残高表示 */}
            <div className="w-full mt-2">
              <div className="flex justify-between px-2 py-1">
                {/* 男性専用: 残いいね */}
                {isMale && (
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 mx-1 relative">
                    <p className="text-gray-700 text-sm">残いいね</p>
                    <div className="flex items-center mt-1">
                      <span className="text-red-400 mr-1 font-bold">♥</span>
                      <p className="text-xl font-bold">{balances.likes}</p>
                    </div>
                    <button 
                      onClick={() => router.push('/likes/exchange')}
                      className="absolute top-2 right-2 text-teal-500"
                    >
                      <HiOutlinePlus />
                    </button>
                  </div>
                )}
                
                {/* 残ポイント */}
                <div className={`flex-1 bg-gray-50 rounded-lg p-3 mx-1 relative ${!isMale ? 'flex-grow' : ''}`}>
                  <p className="text-gray-700 text-sm">残ポイント</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400 mr-1 font-bold">P</span>
                    <p className="text-xl font-bold">{balances.points}</p>
                  </div>
                  <button 
                    onClick={() => router.push('/payment/points')}
                    className="absolute top-2 right-2 text-teal-500"
                  >
                    <HiOutlinePlus />
                  </button>
                </div>
                
                {/* 残キャッシュ（女性）または 残コイン（男性） */}
                <div className={`flex-1 bg-gray-50 rounded-lg p-3 mx-1 relative ${!isMale ? 'flex-grow' : ''}`}>
                  <p className="text-gray-700 text-sm">
                    {isMale ? '残コイン' : '残キャッシュ'}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={isMale ? 'text-blue-500 mr-1 font-bold' : 'text-pink-500 mr-1 font-bold'}>
                      {isMale ? 'C' : '¥'}
                    </span>
                    <p className="text-xl font-bold">{balances.cash}</p>
                  </div>
                  <button 
                    onClick={() => router.push(isMale ? '/payment/coins' : '/payment/cash')}
                    className="absolute top-2 right-2 text-teal-500"
                  >
                    <HiOutlinePlus />
                  </button>
                </div>
              </div>
            </div>
            
            {/* PASSモード部分 */}
            <div className="flex items-center justify-between w-full px-6 mt-4">
              <div className="flex items-center">
                <span className="inline-block px-2 py-1 bg-pink-100 text-pink-500 rounded-md text-xs mr-2">お得</span>
                <span className="font-bold">PASSモード</span>
                <HiQuestionMarkCircle className="text-gray-400 ml-1" />
              </div>
            </div>
            
            {/* トグルスイッチ */}
            <div className="flex justify-between w-full px-6 mt-2">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">ポイント</span>
                <div className="w-14 h-7 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">コイン</span>
                <div className="w-14 h-7 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ナビゲーションメニュー */}
          <div className="mt-6 px-4 grid grid-cols-4 gap-4">
            {navigationItems.map((item, index) => (
              <Link href={item.href} key={index} className="flex flex-col items-center py-2">
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full text-white text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* 女性向け安全プラン - 女性のみ表示 */}
          {!isMale && (
            <div className="mt-6 px-4">
              <div className="bg-pink-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-pink-500 font-bold mr-1">paters</span>
                    <span className="bg-teal-500 text-white text-xs px-1 rounded">PRO</span>
                  </div>
                </div>
                <p className="text-sm text-pink-500 font-bold mt-2">女性のための安心安全プラン</p>
                
                {/* 機能比較表 */}
                <div className="mt-4">
                  <div className="flex border-b border-pink-100 py-2">
                    <div className="flex-1 text-sm">使える機能</div>
                    <div className="flex-1 text-center text-sm">無料会員</div>
                    <div className="flex-1 text-center text-sm font-bold text-pink-500">プラス</div>
                  </div>
                  <div className="flex border-b border-pink-100 py-2">
                    <div className="flex-1 text-sm">セーフティチェック</div>
                    <div className="flex-1 text-center text-sm">—</div>
                    <div className="flex-1 text-center text-sm font-bold text-pink-500">見放題</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* ゴールドオプションバナー - 男性のみ表示 */}
          {isMale && (
            <div className="mt-6 px-4">
              <GoldOptionBanner />
            </div>
          )}
          
          {/* プロモーションカード */}
          <div className="mt-6 px-4 mb-4">
            <PromotionCards />
          </div>
        </div>
      </div>

      {/* 下部ナビゲーション */}
      <BottomNavigation />
    </div>
  );
}
