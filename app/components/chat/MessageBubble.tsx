"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Message, Reaction, MessageStatus } from '@/app/types/chat';
import { HiOutlineHeart, HiHeart, HiOutlineDotsHorizontal } from 'react-icons/hi';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderAvatar?: string;
  onReactionAdd?: (messageId: string, reactionType: string) => void;
  onReply?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export default function MessageBubble({
  message,
  isMine,
  showAvatar = true,
  senderName,
  senderAvatar,
  onReactionAdd,
  onReply,
  onDelete,
}: MessageBubbleProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  // 添付ファイルの表示
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="space-y-2 mt-2">
        {message.attachments.map((attachment) => {
          switch (attachment.type) {
            case 'image':
              return (
                <div 
                  key={attachment.id} 
                  className="relative rounded-lg overflow-hidden"
                  style={{ maxWidth: '240px' }}
                >
                  <Image
                    src={attachment.url}
                    alt="添付画像"
                    width={240}
                    height={240}
                    className="object-cover"
                    style={{ 
                      maxHeight: '240px', 
                      width: attachment.width && attachment.height 
                        ? `${Math.min(240, attachment.width)}px` 
                        : 'auto'
                    }}
                  />
                </div>
              );
            case 'video':
              return (
                <div key={attachment.id} className="relative rounded-lg overflow-hidden">
                  <video 
                    src={attachment.url} 
                    controls 
                    poster={attachment.thumbnailUrl}
                    className="max-w-[240px] max-h-[240px] rounded-lg"
                  />
                </div>
              );
            case 'location':
              return (
                <div key={attachment.id} className="rounded-lg overflow-hidden bg-gray-100 p-2">
                  <div className="text-xs text-gray-500 mb-1">{attachment.name || '位置情報'}</div>
                  <div className="relative h-[120px] w-[200px]">
                    <Image
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${attachment.latitude},${attachment.longitude}&zoom=15&size=200x120&markers=color:red%7C${attachment.latitude},${attachment.longitude}&key=YOUR_API_KEY`}
                      alt="地図"
                      fill
                      className="rounded-lg"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{attachment.address}</div>
                </div>
              );
            case 'url':
              return (
                <div key={attachment.id} className="flex rounded-lg overflow-hidden border border-gray-200">
                  {attachment.imageUrl && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={attachment.imageUrl}
                        alt={attachment.title || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-2 flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{attachment.title}</div>
                    <div className="text-xs text-gray-500 truncate">{attachment.description}</div>
                    <div className="text-xs text-blue-500 truncate">{attachment.url}</div>
                  </div>
                </div>
              );
            case 'sticker':
              return (
                <div key={attachment.id} className="relative w-[120px] h-[120px]">
                  <Image
                    src={`/stickers/${attachment.packageId}/${attachment.stickerId}.png`}
                    alt="スタンプ"
                    fill
                    className="object-contain"
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // メッセージステータスアイコンの表示
  const renderStatusIcon = () => {
    if (!isMine) return null;

    switch (message.status) {
      case 'sending':
        return <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-0.5 animate-pulse" />;
      case 'sent':
        return <FaCheck className="text-gray-400 text-[10px] mr-0.5" />;
      case 'delivered':
        return <FaCheckDouble className="text-gray-400 text-[10px] mr-0.5" />;
      case 'read':
        return (
          <span className="text-[10px] text-primary-400 mr-0.5 font-medium select-none">既読</span>
        );
      case 'failed':
        return <span className="text-error-300 text-[10px] mr-0.5">!</span>;
      default:
        return null;
    }
  };

  // リアクションの表示
  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    // リアクションタイプごとにカウント
    const reactionCounts: Record<string, number> = {};
    message.reactions.forEach((reaction) => {
      reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
    });

    return (
      <div className={`flex mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100">
          {Object.entries(reactionCounts).map(([type, count]) => (
            <div key={type} className="flex items-center">
              {type === 'like' && <HiHeart className="text-pink-500 w-3 h-3" />}
              {/* 他のリアクションタイプもここに追加 */}
              <span className="text-xs text-gray-600 ml-0.5 select-none">{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // フォーマットされた時間
  // LINEスタイルの簡潔な時間表示
  const formatMessageTime = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date >= today;
    const isYesterday = date >= yesterday && date < today;
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '午後' : '午前';
    const hour12 = hours % 12 || 12;
    
    if (isToday) {
      return `${ampm}${hour12}:${minutes.toString().padStart(2, '0')}`;
    } else if (isYesterday) {
      return `昨日 ${ampm}${hour12}:${minutes.toString().padStart(2, '0')}`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()} ${ampm}${hour12}:${minutes.toString().padStart(2, '0')}`;
    }
  };
  
  const formattedTime = formatMessageTime(message.createdAt);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMine ? 'mb-3' : 'mb-3'} ${isMine ? 'justify-end' : 'justify-start'} relative group`}
    >
      {!isMine && showAvatar && (
        <div className="mr-2 flex-shrink-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            {senderAvatar ? (
              <Image
                src={senderAvatar}
                alt={senderName || ''}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
                {senderName ? senderName.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`${isMine ? 'order-1 mr-1.5' : 'order-2'}`} style={{ maxWidth: 'calc(85% - 24px)' }}>
        {!isMine && senderName && (
          <div className="text-xs text-gray-500 mb-1 ml-1">{senderName}</div>
        )}

        <div 
          className="relative group"
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          <div
            className={`px-3 py-2.5 break-words ${
              isMine
                ? 'bg-primary-300 text-white rounded-2xl rounded-br-none shadow-sm transition-all duration-150 group-hover:bg-primary-400'
                : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none transition-all duration-150 group-hover:bg-gray-200'
            }`}
            style={{
              maxWidth: '85vw'
            }}
          >
            {message.isDeleted ? (
              <span className="italic text-xs opacity-60">
                {isMine ? 'このメッセージは削除されました' : 'メッセージは削除されました'}
              </span>
            ) : (
              <>
                {message.content && <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>}
                {renderAttachments()}
              </>
            )}
          </div>

          {showOptions && !message.isDeleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute ${isMine ? 'right-0' : 'left-0'} -top-8 flex items-center space-x-1 bg-white rounded-full shadow-md px-1 py-1 z-10`}
            >
              <button
                onClick={() => onReactionAdd?.(message.id, 'like')}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-pink-500 transition-colors"
              >
                <HiOutlineHeart className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReply?.(message.id)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-primary-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              {isMine && (
                <button
                  onClick={() => onDelete?.(message.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </motion.div>
          )}

          <div className={`flex items-center mt-0.5 text-[10px] text-gray-400 select-none ${isMine ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
            {isMine && renderStatusIcon()}
            <span>{formattedTime}</span>
          </div>

          {renderReactions()}
        </div>
      </div>
    </motion.div>
  );
}
