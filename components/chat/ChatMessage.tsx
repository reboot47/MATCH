import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface ChatMessageProps {
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead?: boolean;
  attachments?: {
    type: 'image' | 'video' | 'link' | 'location';
    url: string;
    previewUrl?: string;
    title?: string;
    description?: string;
  }[];
  reactions?: {
    type: string;
    count: number;
  }[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  timestamp,
  isMe,
  isRead = false,
  attachments = [],
  reactions = [],
}) => {
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderAttachment = (attachment: ChatMessageProps['attachments'][0], index: number) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div key={index} className="relative mb-1 overflow-hidden rounded-lg">
            <Image
              src={attachment.url}
              alt="Attached image"
              width={200}
              height={150}
              className="object-cover rounded-lg"
            />
          </div>
        );
      case 'video':
        return (
          <div key={index} className="relative mb-1 overflow-hidden rounded-lg">
            <video 
              controls
              className="w-full max-w-[240px] rounded-lg"
              poster={attachment.previewUrl}
            >
              <source src={attachment.url} type="video/mp4" />
              お使いのブラウザは動画再生に対応していません。
            </video>
          </div>
        );
      case 'link':
        return (
          <div key={index} className="flex flex-col mb-1 overflow-hidden bg-white rounded-lg shadow-sm">
            {attachment.previewUrl && (
              <Image
                src={attachment.previewUrl}
                alt={attachment.title || 'Link preview'}
                width={200}
                height={100}
                className="object-cover w-full h-24"
              />
            )}
            <div className="p-2">
              <h4 className="font-medium text-sm text-gray-800">{attachment.title}</h4>
              {attachment.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{attachment.description}</p>
              )}
              <a 
                href={attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary-500 block mt-1 truncate"
              >
                {attachment.url}
              </a>
            </div>
          </div>
        );
      case 'location':
        return (
          <div key={index} className="relative mb-1 overflow-hidden rounded-lg">
            <Image
              src={attachment.previewUrl || '/images/map-placeholder.jpg'}
              alt="Location"
              width={200}
              height={120}
              className="object-cover w-full rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-75">
              <p className="text-xs font-medium text-gray-700 truncate">
                {attachment.title || '位置情報'}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      transition={{ duration: 0.3 }}
    >
      {!isMe && (
        <div className="mr-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            {/* User avatar would go here */}
            <div className="flex items-center justify-center h-full text-sm font-medium text-gray-500">
              相手
            </div>
          </div>
        </div>
      )}
      
      <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div 
          className={`
            rounded-2xl px-4 py-2 inline-block
            ${isMe 
              ? 'bg-primary-500 text-white rounded-br-sm' 
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }
          `}
        >
          {attachments.length > 0 && (
            <div className="mb-2 space-y-1">
              {attachments.map(renderAttachment)}
            </div>
          )}
          
          {content && (
            <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          )}
          
          {reactions.length > 0 && (
            <div className="flex mt-1 space-x-1 justify-end">
              {reactions.map((reaction, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs bg-white bg-opacity-20 rounded-full"
                >
                  {reaction.type} {reaction.count > 1 && reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-1 text-xs text-gray-500 space-x-1">
          <span>{timestamp}</span>
          {isMe && (
            <span className={isRead ? 'text-primary-500' : ''}>
              {isRead ? '既読' : '未読'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
