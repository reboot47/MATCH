'use client';

import React from 'react';
import { ChatList } from '@/components/chat';
import { motion } from 'framer-motion';
import Link from 'next/link';

const mockChats = [
  {
    id: '1',
    name: '田中さくら',
    lastMessage: 'はじめまして！よろしくお願いします😊',
    timestamp: '14:30',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: '鈴木ユウタ',
    lastMessage: '今度の週末、カフェでお茶しませんか？',
    timestamp: '昨日',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    name: '佐藤メイ',
    lastMessage: '写真ありがとう！とても素敵ですね！',
    timestamp: '昨日',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: '伊藤ケン',
    lastMessage: '映画、楽しかったです！また行きましょう',
    timestamp: '火曜日',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '5',
    name: '渡辺ハルカ',
    lastMessage: 'ありがとう！こちらこそよろしくお願いします✨',
    timestamp: '月曜日',
    unreadCount: 0,
    isOnline: false,
  },
];

export default function ChatPage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <motion.header 
        className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">メッセージ</h1>
          <div className="flex space-x-2">
            <button 
              className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="新規メッセージ"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="11"></line>
                <line x1="16" y1="11" x2="16" y2="11"></line>
                <line x1="8" y1="11" x2="8" y2="11"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-3 relative">
          <input 
            type="text" 
            placeholder="メッセージを検索" 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg 
            className="absolute left-3 top-2.5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500 mb-2">最近のマッチング</h2>
          <div className="flex space-x-4 overflow-x-auto py-2 px-1">
            {mockChats.slice(0, 4).map((chat) => (
              <Link key={chat.id} href={`/match/chat/${chat.id}`} passHref>
                <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      <span className="text-xl text-gray-500">{chat.name.charAt(0)}</span>
                    </div>
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <span className="text-xs text-center truncate w-full">{chat.name.split(' ')[0]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <h2 className="text-sm font-medium text-gray-500 mb-2">メッセージ</h2>
        <ChatList chats={mockChats} />
      </div>

      <nav className="mt-auto border-t border-gray-200 bg-white py-2 px-6 flex justify-around items-center">
        <Link href="/match" passHref>
          <div className="flex flex-col items-center space-y-1 text-gray-500 hover:text-primary-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs">ホーム</span>
          </div>
        </Link>
        
        <Link href="/match/discover" passHref>
          <div className="flex flex-col items-center space-y-1 text-gray-500 hover:text-primary-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span className="text-xs">発見</span>
          </div>
        </Link>
        
        <Link href="/match/chat" passHref>
          <div className="flex flex-col items-center space-y-1 text-primary-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span className="text-xs">メッセージ</span>
          </div>
        </Link>
        
        <Link href="/match/profile" passHref>
          <div className="flex flex-col items-center space-y-1 text-gray-500 hover:text-primary-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs">プロフィール</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
