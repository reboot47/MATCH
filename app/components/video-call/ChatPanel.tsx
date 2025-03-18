"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HiX, HiPaperAirplane, HiPhotograph } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useUser } from '@/components/UserContext';

interface ChatPanelProps {
  chatId: string;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
  authorName: string;
  authorAvatar: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatId, onClose }) => {
  const userContext = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // サンプルメッセージ (実際のアプリではAPIから取得)
  useEffect(() => {
    // デモ用のサンプルメッセージ
    const sampleMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'こんにちは！ビデオ通話楽しいですね！',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isMe: false,
        authorName: '田中さくら',
        authorAvatar: '/images/avatars/female-1.jpg'
      },
      {
        id: '2',
        content: 'はい、とても楽しいです！',
        timestamp: new Date(Date.now() - 1000 * 60 * 9),
        isMe: true,
        authorName: '自分',
        authorAvatar: '/images/avatars/default.jpg'
      },
      {
        id: '3',
        content: '趣味は何ですか？',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isMe: false,
        authorName: '田中さくら',
        authorAvatar: '/images/avatars/female-1.jpg'
      }
    ];
    
    setMessages(sampleMessages);
  }, []);
  
  // チャット送信時に自動スクロール
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // メッセージ送信処理
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // 新しいメッセージを追加
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      isMe: true,
      authorName: '自分',
      authorAvatar: '/images/avatars/default.jpg'
    }]);
    
    // 入力欄をクリア
    setMessage('');
    
    // 実際のアプリではここでAPIリクエスト
  };
  
  // 時刻フォーマット
  const formatTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.div 
      className="absolute inset-y-0 right-0 w-80 bg-white shadow-xl z-30 flex flex-col"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ヘッダー */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="font-bold">チャット</h3>
        <button onClick={onClose} className="p-1">
          <HiX className="text-xl" />
        </button>
      </div>
      
      {/* メッセージリスト */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isMe && (
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={msg.authorAvatar}
                    alt={msg.authorName}
                    width={32}
                    height={32}
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/avatar-placeholder.svg';
                    }}
                  />
                </div>
              </div>
            )}
            <div className={`max-w-[70%]`}>
              <div 
                className={`p-2 rounded-lg ${
                  msg.isMe 
                    ? 'bg-purple-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
              <div 
                className={`text-xs text-gray-500 mt-1 ${
                  msg.isMe ? 'text-right' : 'text-left'
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* メッセージ入力 */}
      <div className="p-3 border-t">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
          <button className="p-1 mr-1">
            <HiPhotograph className="text-gray-500 text-xl" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 bg-transparent outline-none py-2 px-1"
          />
          <button 
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`p-1 ml-1 ${!message.trim() ? 'text-gray-400' : 'text-purple-600'}`}
          >
            <HiPaperAirplane className="text-xl transform rotate-90" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPanel;
