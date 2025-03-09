"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type FooterProps = {
  activeTab?: 'home' | 'notifications' | 'search' | 'likes' | 'messages' | 'mypage';
};

export default function Footer({ activeTab }: FooterProps) {
  const pathname = usePathname();
  const currentPath = activeTab || pathname.split('/')[1] || 'home';
  
  return (
    <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-2">
        <div className="flex justify-between items-center h-16">
          {/* ホーム */}
          <Link 
            href="/home" 
            className={`flex flex-col items-center justify-center w-1/5 py-2 text-xs ${
              currentPath === 'home' || currentPath === '' 
                ? 'text-rose-500' 
                : 'text-gray-500'
            }`}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 mb-1" 
              fill={currentPath === 'home' || currentPath === '' ? '#f43f5e' : '#9ca3af'}
            >
              <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
            </svg>
            <span>ホーム</span>
          </Link>
          
          {/* 通知 */}
          <Link 
            href="/notifications" 
            className={`flex flex-col items-center justify-center w-1/5 py-2 text-xs ${
              currentPath === 'notifications' 
                ? 'text-rose-500' 
                : 'text-gray-500'
            }`}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 mb-1" 
              fill={currentPath === 'notifications' ? '#f43f5e' : '#9ca3af'}
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            <span>通知</span>
          </Link>
          
          {/* 検索 */}
          <Link 
            href="/search" 
            className={`flex flex-col items-center justify-center w-1/5 py-2 text-xs ${
              currentPath === 'search' 
                ? 'text-rose-500' 
                : 'text-gray-500'
            }`}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 mb-1" 
              fill={currentPath === 'search' ? '#f43f5e' : '#9ca3af'}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span>検索</span>
          </Link>
          
          {/* いいね */}
          <Link 
            href="/likes" 
            className={`flex flex-col items-center justify-center w-1/5 py-2 text-xs ${
              currentPath === 'likes' 
                ? 'text-rose-500' 
                : 'text-gray-500'
            }`}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 mb-1" 
              fill={currentPath === 'likes' ? '#f43f5e' : '#9ca3af'}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>いいね</span>
          </Link>
          
          {/* メッセージ */}
          <Link 
            href="/messages" 
            className={`flex flex-col items-center justify-center w-1/5 py-2 text-xs ${
              currentPath === 'messages' 
                ? 'text-teal-500' 
                : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 mb-1" 
                fill={currentPath === 'messages' ? '#14b8a6' : '#9ca3af'}
              >
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
            </div>
            <span>トーク</span>
          </Link>
          
          {/* マイページ */}
          <Link 
            href="/mypage" 
            className={`flex flex-col items-center justify-center w-1/5 py-2 text-xs ${
              currentPath === 'mypage' 
                ? 'text-teal-500' 
                : 'text-gray-500'
            }`}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 mb-1" 
              fill={currentPath === 'mypage' ? '#14b8a6' : '#9ca3af'}
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>マイページ</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
