'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNavigation from '@/app/components/BottomNavigation';

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // チャットページ用のパスかどうかを確認
  const isChatPage = pathname.includes('/chat/');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full max-w-screen-lg mx-auto">
      <main className={`flex-1 w-full ${isChatPage ? '' : 'pb-16'}`}>
        {children}
      </main>
      {!isChatPage && <BottomNavigation />}
    </div>
  );
}
