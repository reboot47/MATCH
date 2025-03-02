import React from 'react';
import Link from 'next/link';
import { ChatHeader, ChatMessage, ChatInput } from '@/components/chat';
import { motion } from 'framer-motion';

// Mock data for chat messages
const mockMessages = [
  {
    id: '1',
    content: 'こんにちは！LINEBUZZを使ってくれてありがとう😊',
    timestamp: '14:30',
    isMe: false,
    isRead: true,
  },
  {
    id: '2',
    content: 'はじめまして！よろしくお願いします。',
    timestamp: '14:32',
    isMe: true,
    isRead: true,
  },
  {
    id: '3',
    content: '趣味は何ですか？',
    timestamp: '14:33',
    isMe: false,
    isRead: true,
  },
  {
    id: '4',
    content: '音楽を聴くことと、カフェ巡りが好きです！あなたは？',
    timestamp: '14:35',
    isMe: true,
    isRead: true,
  },
  {
    id: '5',
    content: '私は映画鑑賞と旅行が好きです。最近見た映画はありますか？',
    timestamp: '14:36',
    isMe: false,
    isRead: true,
    attachments: [
      {
        type: 'image',
        url: 'https://placehold.jp/300x200.png',
      }
    ]
  },
  {
    id: '6',
    content: '最近「君の名は。」を再見しました！何度見ても素晴らしい作品ですね。',
    timestamp: '14:40',
    isMe: true,
    isRead: false,
  },
];

// Mock user data
const mockUser = {
  id: '1',
  name: '田中さくら',
  isOnline: true,
  lastSeen: '1時間前',
};

export default function ChatDetail({ params }: { params: { chatId: string } }) {
  const { chatId } = params;
  
  const handleSendMessage = (content: string, attachments?: any[]) => {
    console.log('Sending message:', content, attachments);
    // Here we would typically send the message to the backend
  };

  const handleBackClick = () => {
    // In a real app, this would use router.back() or similar
    console.log('Back button clicked');
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <ChatHeader
        partnerName={mockUser.name}
        isOnline={mockUser.isOnline}
        lastSeen={mockUser.lastSeen}
        onBackClick={handleBackClick}
        onCallClick={() => console.log('Call clicked')}
        onVideoClick={() => console.log('Video clicked')}
        onInfoClick={() => console.log('Info clicked')}
      />

      <div 
        className="flex-1 overflow-y-auto p-4" 
        style={{ 
          backgroundImage: 'url(/images/background-pattern.svg)',
          backgroundSize: '300px',
          backgroundOpacity: 0.1
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-full px-3 py-1">
            <span className="text-xs text-gray-600">今日</span>
          </div>
        </div>

        {mockMessages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            isMe={message.isMe}
            isRead={message.isRead}
            attachments={message.attachments}
          />
        ))}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />

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
