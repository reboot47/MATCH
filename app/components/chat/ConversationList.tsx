"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { HiSearch, HiOutlinePlus } from 'react-icons/hi';
import { Conversation } from '@/app/types/chat';
import { motion } from 'framer-motion';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  onNewConversation?: () => void;
}

export default function ConversationList({
  conversations,
  currentUserId,
  onNewConversation
}: ConversationListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // 検索フィルター
  const filteredConversations = conversations.filter(convo => {
    const name = convo.name || convo.participants.find(p => p.userId !== currentUserId)?.userId || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 会話アバター
  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.photoUrl) {
      return conversation.photoUrl;
    }
    
    if (!conversation.isGroup) {
      const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId);
      return otherParticipant ? `/avatars/${otherParticipant.userId}.jpg` : '/avatars/default.jpg';
    }
    
    return '/avatars/group-default.jpg';
  };

  // 会話名
  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) {
      return conversation.name;
    }
    
    if (!conversation.isGroup) {
      const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId);
      return otherParticipant ? otherParticipant.userId : '不明なユーザー';
    }
    
    return '新規グループ';
  };

  // 未読メッセージの有無
  const hasUnreadMessages = (conversation: Conversation) => {
    if (!conversation.lastMessage) return false;
    
    const participant = conversation.participants.find(p => p.userId === currentUserId);
    if (!participant) return false;
    
    return !participant.lastReadMessageId || 
           conversation.lastMessage.id !== participant.lastReadMessageId;
  };

  // 最新メッセージのプレビュー
  const getMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return '';
    
    if (conversation.lastMessage.isDeleted) {
      return 'メッセージは削除されました';
    }
    
    if (conversation.lastMessage.attachments.length > 0) {
      const attachment = conversation.lastMessage.attachments[0];
      
      switch (attachment.type) {
        case 'image': return '📷 画像';
        case 'video': return '🎥 動画';
        case 'location': return '📍 位置情報';
        case 'url': return '🔗 リンク';
        case 'sticker': return '😊 スタンプ';
        default: return '';
      }
    }
    
    return conversation.lastMessage.content || '';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">メッセージ</h1>
          <button 
            onClick={onNewConversation}
            className="rounded-full p-2 text-primary-500 hover:bg-primary-50"
          >
            <HiOutlinePlus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">メッセージがありません</p>
            <button
              onClick={onNewConversation}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-full text-sm hover:bg-primary-600 transition"
            >
              新しい会話を始める
            </button>
          </div>
        ) : (
          <ul>
            {filteredConversations.map((conversation) => (
              <motion.li
                key={conversation.id}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                onClick={() => router.push(`/messages/${conversation.id}`)}
                className="cursor-pointer px-4 py-3 border-b border-gray-100 relative"
              >
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={getConversationAvatar(conversation)}
                        alt={getConversationName(conversation)}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    
                    {/* オンラインステータス - 実装例 */}
                    {!conversation.isGroup && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={`font-medium truncate ${hasUnreadMessages(conversation) ? 'text-gray-900' : 'text-gray-700'}`}>
                        {getConversationName(conversation)}
                      </h3>
                      
                      <span className="ml-1 text-xs text-gray-500">
                        {conversation.lastMessage 
                          ? formatDistanceToNow(conversation.lastMessage.createdAt, { locale: ja, addSuffix: false })
                          : formatDistanceToNow(conversation.createdAt, { locale: ja, addSuffix: false })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between mt-1">
                      <p className={`text-sm truncate ${
                        hasUnreadMessages(conversation) 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {getMessagePreview(conversation)}
                      </p>
                      
                      {hasUnreadMessages(conversation) && (
                        <div className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-xs text-white">
                            {/* 未読メッセージ数を表示。実際の実装では計算する必要があります */}
                            1
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
