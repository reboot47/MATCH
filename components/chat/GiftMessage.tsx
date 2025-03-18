import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from '@/types/gift';

interface GiftMessageProps {
  gift: Gift;
  isMe: boolean;
  message?: string;
  senderName: string;
  timestamp: string;
}

const GiftMessage: React.FC<GiftMessageProps> = ({
  gift,
  isMe,
  message,
  senderName,
  timestamp
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4`}
    >
      <div className={`rounded-lg p-4 max-w-[80%] ${isMe ? 'bg-primary-100' : 'bg-white border border-gray-200'}`}>
        <div className="flex items-center justify-center mb-2">
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="text-center mb-2">
          <span className="text-sm text-gray-600">
            {isMe ? `${senderName}さんに` : `${senderName}さんから`}
          </span>
          <h4 className="font-bold text-primary-600">{gift.name}</h4>
          {message && (
            <p className="text-sm text-gray-700 mt-1">{message}</p>
          )}
        </div>
        <div className="text-xs text-gray-500 text-right mt-1">
          {timestamp}
        </div>
      </div>
    </motion.div>
  );
};

export default GiftMessage;
