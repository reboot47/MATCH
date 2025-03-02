import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  partnerName: string;
  partnerAvatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  onBackClick?: () => void;
  onInfoClick?: () => void;
  onCallClick?: () => void;
  onVideoClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  partnerName,
  partnerAvatar,
  isOnline = false,
  lastSeen,
  onBackClick,
  onInfoClick,
  onCallClick,
  onVideoClick,
}) => {
  return (
    <motion.header
      className="flex items-center px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onBackClick}
        className="mr-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="戻る"
      >
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
          className="text-gray-600"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {partnerAvatar ? (
            <Image
              src={partnerAvatar}
              alt={`${partnerName}のプロフィール画像`}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-lg font-medium text-gray-500">
              {partnerName.charAt(0)}
            </div>
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-base font-medium text-gray-900">{partnerName}</h2>
        {isOnline ? (
          <p className="text-xs text-green-600">オンライン</p>
        ) : lastSeen ? (
          <p className="text-xs text-gray-500">{`最終オンライン：${lastSeen}`}</p>
        ) : null}
      </div>

      <div className="flex items-center space-x-1">
        {onCallClick && (
          <button
            onClick={onCallClick}
            className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="通話"
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
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </button>
        )}

        {onVideoClick && (
          <button
            onClick={onVideoClick}
            className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="ビデオ通話"
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
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </button>
        )}

        {onInfoClick && (
          <button
            onClick={onInfoClick}
            className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="詳細情報"
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
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        )}
      </div>
    </motion.header>
  );
};

export default ChatHeader;
