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
      {/* 下部の余白を追加してBottomNavigationと重ならないようにする */}
      <div className="pb-20"></div>
    </div>
  );
}
