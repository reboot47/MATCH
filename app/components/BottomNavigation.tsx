'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  RiHome4Line, 
  RiSearchLine, 
  RiChat1Line, 
  RiUser3Line 
} from 'react-icons/ri';

export default function BottomNavigation() {
  const pathname = usePathname();
  
  // 現在のパスに基づいてアクティブなタブを判断
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10">
      <Link href="/dashboard" className="flex flex-col items-center">
        <RiHome4Line 
          size={24} 
          className={isActive('/dashboard') ? "text-teal-400" : "text-gray-400"} 
        />
        <span className={isActive('/dashboard') ? "text-xs text-teal-400" : "text-xs text-gray-500"}>
          ホーム
        </span>
      </Link>
      
      <Link href="/search" className="flex flex-col items-center">
        <RiSearchLine 
          size={24} 
          className={isActive('/search') ? "text-teal-400" : "text-gray-400"} 
        />
        <span className={isActive('/search') ? "text-xs text-teal-400" : "text-xs text-gray-500"}>
          さがす
        </span>
      </Link>
      
      <Link href="/messages" className="flex flex-col items-center">
        <div className="relative">
          <RiChat1Line 
            size={24} 
            className={isActive('/messages') ? "text-teal-400" : "text-gray-400"} 
          />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        </div>
        <span className={isActive('/messages') ? "text-xs text-teal-400" : "text-xs text-gray-500"}>
          メッセージ
        </span>
      </Link>
      
      <Link href="/mypage" className="flex flex-col items-center">
        <RiUser3Line 
          size={24} 
          className={isActive('/mypage') ? "text-teal-400" : "text-gray-400"} 
        />
        <span className={isActive('/mypage') ? "text-xs text-teal-400" : "text-xs text-gray-500"}>
          マイページ
        </span>
      </Link>
    </nav>
  );
}
