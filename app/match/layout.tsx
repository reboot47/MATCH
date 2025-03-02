'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { 
  Home, Heart, MessageCircle, User, Zap, 
  Bell, Settings, Search
} from 'lucide-react';

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MainContent>{children}</MainContent>
      <BottomNavigation />
    </div>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 pb-16">
      {children}
    </main>
  );
}

function BottomNavigation() {
  const pathname = usePathname();
  const { isGenderMale, isGenderFemale, user, points } = useUser();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // 性別に応じたナビゲーションアイテム
  const getGenderSpecificNavItem = () => {
    if (isGenderMale()) {
      return (
        <Link href="/match/points/buy" 
          className={`flex flex-col items-center text-xs ${
            isActive('/match/points/buy') 
              ? 'text-primary font-medium' 
              : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <Zap size={24} />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-auto min-w-4 flex items-center justify-center px-1">
              {points?.balance || 0}
            </span>
          </div>
          <span>ポイント購入</span>
        </Link>
      );
    } else if (isGenderFemale()) {
      return (
        <Link href="/match/points/earn" 
          className={`flex flex-col items-center text-xs ${
            isActive('/match/points/earn') 
              ? 'text-primary font-medium' 
              : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <Zap size={24} />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-auto min-w-4 flex items-center justify-center px-1">
              {points?.balance || 0}
            </span>
          </div>
          <span>ポイント獲得</span>
        </Link>
      );
    } else {
      // 性別未設定またはその他の場合
      return (
        <Link href="/match/points" 
          className={`flex flex-col items-center text-xs ${
            isActive('/match/points') 
              ? 'text-primary font-medium' 
              : 'text-gray-500'
          }`}
        >
          <Zap size={24} />
          <span>ポイント</span>
        </Link>
      );
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-2 pb-3 px-2 z-50">
      <div className="grid grid-cols-5 gap-1">
        <Link href="/match" 
          className={`flex flex-col items-center text-xs ${
            isActive('/match') && !isActive('/match/chat') && !isActive('/match/profile') && !isActive('/match/points')  
              ? 'text-primary font-medium' 
              : 'text-gray-500'
          }`}
        >
          <Home size={24} />
          <span>ホーム</span>
        </Link>
        
        <Link href="/match/discover" 
          className={`flex flex-col items-center text-xs ${
            isActive('/match/discover') 
              ? 'text-primary font-medium' 
              : 'text-gray-500'
          }`}
        >
          <Heart size={24} />
          <span>マッチング</span>
        </Link>
        
        <Link href="/match/chat" 
          className={`flex flex-col items-center text-xs ${
            isActive('/match/chat') 
              ? 'text-primary font-medium' 
              : 'text-gray-500'
          }`}
        >
          <MessageCircle size={24} />
          <span>チャット</span>
        </Link>
        
        {getGenderSpecificNavItem()}
        
        <Link href="/match/profile" 
          className={`flex flex-col items-center text-xs ${
            isActive('/match/profile') 
              ? 'text-primary font-medium' 
              : 'text-gray-500'
          }`}
        >
          <User size={24} />
          <span>プロフィール</span>
        </Link>
      </div>
    </nav>
  );
}
