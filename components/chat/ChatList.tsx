'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface ChatListItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatListProps {
  chats: ChatListItemProps[];
  onChatSelect?: (chatId: string) => void;
}

const ChatListItem: React.FC<ChatListItemProps & { onClick?: () => void }> = ({
  id,
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
  onClick,
}) => {
  return (
    <Link href={`/match/chat/${id}`} passHref>
      <motion.div
        className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        onClick={onClick}
      >
        <div className="relative mr-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {avatar ? (
              <Image src={avatar} alt={`${name}のプロフィール画像`} width={48} height={48} className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-lg font-medium text-gray-500">
                {name.charAt(0)}
              </div>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="text-base font-medium text-gray-900 truncate">{name}</h3>
            {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
          </div>
          {lastMessage && (
            <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="ml-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </div>
        )}
      </motion.div>
    </Link>
  );
};

const ChatList: React.FC<ChatListProps> = ({ chats, onChatSelect }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      className="space-y-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {chats.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">マッチングした相手とのチャットがここに表示されます</p>
        </div>
      ) : (
        chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            onClick={() => onChatSelect && onChatSelect(chat.id)}
          />
        ))
      )}
    </motion.div>
  );
};

export default ChatList;
export { ChatListItem };
