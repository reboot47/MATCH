"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Message, Reaction, MessageStatus } from '@/app/types/chat';
import { HiOutlineHeart, HiHeart, HiOutlineDotsHorizontal } from 'react-icons/hi';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import SafeImage from '@/app/components/common/SafeImage';
import GiftImage from '@/app/components/common/GiftImage';
import MapImage from '@/app/components/common/MapImage';
import { getProxiedImageUrl } from '@/app/utils/proxyHelpers';

/**
 * 画像のプリロードを行うカスタムフック
 * @param url 画像のURL
 * @returns { loaded, error }
 */
const useImagePreload = (url?: string | null) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    if (!url) return;
    
    const img = new window.Image();
    img.onload = () => {
      setLoaded(true);
      setError(false);
    };
    img.onerror = () => {
      setError(true);
      console.error('[Image Preload] Failed to load:', url);
    };
    img.src = url;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);
  
  return { loaded, error };
};

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
        {message.attachments.map((attachment: any) => {
          switch (attachment.type) {
            case 'image':
              // 画像URLの安全性チェック - 完全に無効な値は除外
              const imageUrl = attachment.url && typeof attachment.url === 'string' && attachment.url.trim() !== '' 
                ? attachment.url 
                : null;
              
              // プリロードフックを使用して画像の読み込み状態を管理
              const { loaded, error } = useImagePreload(imageUrl);
              
              return (
                <motion.div 
                  key={attachment.id || `image-${Math.random().toString(36).substring(2, 9)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-lg overflow-hidden max-w-xs mx-auto ${isMine ? 'ml-auto' : 'mr-auto'}`}
                >
                  {imageUrl ? (
                    <SafeImage
                      src={imageUrl}
                      alt={attachment.description || '画像'}
                      className="w-full h-auto max-h-60 object-contain"
                      fallbackSrc="/images/placeholder-image.svg"
                    />
                  ) : (
                    <div className="bg-gray-100 p-4 text-center text-gray-500 rounded-lg">
                      画像を読み込めませんでした
                    </div>
                  )}
                  
                  {/* キャプションがある場合は表示 */}
                  {attachment.caption && typeof attachment.caption === 'string' && (
                    <div className="p-2 text-sm text-gray-700 bg-white">
                      {attachment.caption}
                    </div>
                  )}
                </motion.div>
              );
              
            case 'gift':
              // デバッグ用にギフト情報をコンソールに表示
              console.log('【MessageBubble】ギフト表示:', {
                giftId: attachment.giftId,
                giftName: attachment.giftName,
                giftImageUrl: attachment.giftImageUrl,
                message: attachment.message
              });
              
              return (
                <motion.div 
                  key={attachment.id || `gift-${Math.random().toString(36).substring(2, 9)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-center mb-2">
                    <motion.div 
                      className="mr-3 bg-white rounded-full p-1.5 shadow-sm relative"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* ギフト画像がある場合は表示、ない場合はエモジを表示 */}
                      {attachment.giftImageUrl || typeof attachment.giftId === 'string' ? (
                        (() => {
                          // ギフトIDからギフト名を取得
                          const giftId = typeof attachment.giftId === 'string' ? attachment.giftId : '';
                          let giftName = '';
                          
                          // ギフトIDから既知のギフト名を解決
                          switch(giftId) {
                            case '1': giftName = 'heart'; break;
                            case '2': giftName = 'flowers'; break;
                            case '3': giftName = 'cake'; break;
                            case '4': giftName = 'dinner'; break;
                            case '5': giftName = 'wine'; break;
                            default: giftName = '';
                          }
                          
                          // 最終的なギフト画像ソースを決定
                          let finalSrc = attachment.giftImageUrl;
                          
                          // ギフト名が存在し、URLが無い場合はギフト名を使用
                          if (giftName && (!finalSrc || typeof finalSrc !== 'string' || finalSrc.trim() === '')) {
                            finalSrc = giftName; // GiftImageコンポーネント内でパス解決される
                          }
                          
                          return (
                            <div className="w-12 h-12 relative gift-image-container">
                              <GiftImage 
                                src={finalSrc}
                                alt={typeof attachment.giftName === 'string' ? attachment.giftName : giftName || 'ギフト'}
                                width={48}
                                height={48}
                                objectFit="contain"
                                priority={true}
                                className="object-contain"
                                onError={(e) => {
                                  console.error(`[ギフト画像] 読み込みエラー: giftId=${giftId}, giftName=${giftName}, src=${finalSrc}`);
                                  
                                  // エモジ要素を佼う
                                  let emoji = '🎁'; // デフォルトはプレゼント
                                  switch(giftId) {
                                    case '1': emoji = '❤️'; break;
                                    case '2': emoji = '💐'; break;
                                    case '3': emoji = '🎂'; break;
                                    case '4': emoji = '🍽️'; break;
                                    case '5': emoji = '🍷'; break;
                                  }
                                  
                                  // DOM操作は最小限に
                                  const container = (e.currentTarget as HTMLImageElement).closest('.gift-image-container');
                                  if (container) {
                                    // すでにフォールバック要素があれば再利用
                                    const existingFallback = container.querySelector('.gift-fallback');
                                    if (existingFallback) {
                                      existingFallback.textContent = emoji;
                                      existingFallback.classList.remove('hidden');
                                    } else {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'text-4xl flex items-center justify-center w-full h-full gift-fallback';
                                      fallback.textContent = emoji;
                                      container.appendChild(fallback);
                                    }
                                  }
                                }}
                              />
                            </div>
                          );
                        })()
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center">
                          <div className="text-4xl">
                            {(() => {
                              // エモジ表示
                              const giftId = typeof attachment.giftId === 'string' ? attachment.giftId : '';
                              switch(giftId) {
                                case '1': return '❤️';
                                case '2': return '💐';
                                case '3': return '🎂';
                                case '4': return '🍽️';
                                case '5': return '🍷';
                                default: return '🎁';
                              }
                            })()}
                          </div>
                        </div>
                      )}
                    </motion.div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        ギフトを送信しました
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {typeof attachment.giftName === 'string' && attachment.giftName ? attachment.giftName : 'ギフト'}
                        {typeof attachment.price === 'number' && (
                          <span className="text-xs ml-1 text-gray-500">{attachment.price}pt</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* ギフトメッセージがある場合は表示 */}
                  {typeof attachment.message === 'string' && attachment.message && (
                    <div className="mt-1 p-2 bg-gray-50 rounded-lg text-sm text-gray-700 w-full">
                      {attachment.message}
                    </div>
                  )}
                </motion.div>
              );
              
            case 'video':
              // 無効なURLをチェック
              const validVideoUrl = attachment.url && typeof attachment.url === 'string' && attachment.url.trim() !== ''
                ? attachment.url : null;
                
              return (
                <motion.div 
                  key={attachment.id || `video-${Math.random().toString(36).substring(2, 9)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg overflow-hidden max-w-xs mx-auto"
                >
                  {validVideoUrl ? (
                    <video 
                      controls 
                      className="w-full h-auto max-h-60"
                      poster={attachment.thumbnail || '/images/video-placeholder.jpg'}
                    >
                      <source src={validVideoUrl} type={attachment.mimeType || 'video/mp4'} />
                      お使いのブラウザは動画の再生に対応していません
                    </video>
                  ) : (
                    <div className="bg-gray-100 p-4 text-center text-gray-500 rounded-lg">
                      動画を読み込めませんでした
                    </div>
                  )}
                </motion.div>
              );
              
            case 'location':
              return (
                <motion.div 
                  key={attachment.id || `location-${Math.random().toString(36).substring(2, 9)}`} 
                  className="rounded-lg overflow-hidden bg-gray-100 p-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-2 text-sm font-medium">
                    {attachment.name || '位置情報'}
                  </div>
                  
                  {/* 地図表示部分 */}
                  {attachment.latitude && attachment.longitude ? (
                    <div className="relative h-40 w-full">
                      <MapImage
                        latitude={attachment.latitude}
                        longitude={attachment.longitude}
                        name={attachment.name || '地図'}
                        className="rounded-md w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-200 h-40 rounded-md flex items-center justify-center">
                      <div className="text-gray-500">位置情報がありません</div>
                    </div>
                  )}
                  
                  {/* 住所情報があれば表示 */}
                  {attachment.address && (
                    <div className="mt-2 text-xs text-gray-600">
                      {attachment.address}
                    </div>
                  )}
                </motion.div>
              );
              
            case 'url':
              return (
                <motion.div 
                  key={attachment.id || `url-${Math.random().toString(36).substring(2, 9)}`}
                  className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 flex flex-col flex-grow">
                    <div className="text-sm font-bold text-blue-600 truncate">
                      {attachment.title || attachment.url || 'リンク'}
                    </div>
                    
                    {attachment.description && (
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {attachment.description}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {attachment.url || ''}
                    </div>
                  </div>
                  
                  {attachment.thumbnail && (
                    <div className="w-20 h-20 bg-gray-100">
                      <img 
                        src={attachment.thumbnail} 
                        alt={attachment.title || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              );
              
            case 'sticker':
              return (
                <motion.div 
                  key={attachment.id || `sticker-${Math.random().toString(36).substring(2, 9)}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                  className="max-w-xs mx-auto"
                >
                  {attachment.url ? (
                    <SafeImage
                      src={attachment.url}
                      alt="スタンプ"
                      width={120}
                      height={120}
                      className="max-w-full h-auto max-h-32"
                      fallbackSrc="/images/sticker-placeholder.svg"
                    />
                  ) : (
                    <div className="bg-gray-100 p-4 text-center text-gray-500 rounded-lg">
                      スタンプを読み込めませんでした
                    </div>
                  )}
                </motion.div>
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
      case 'sent':
        return <FaCheck className="text-gray-400" size={12} />;
      case 'delivered':
        return <FaCheckDouble className="text-gray-400" size={12} />;
      case 'read':
        return <FaCheckDouble className="text-blue-500" size={12} />;
      default:
        return null;
    }
  };
  
  // リアクションの表示
  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;
    
    // リアクションをタイプごとにグループ化
    const reactionGroups: { [key: string]: Reaction[] } = {};
    message.reactions.forEach((reaction: any) => {
      if (!reactionGroups[reaction.type]) {
        reactionGroups[reaction.type] = [];
      }
      reactionGroups[reaction.type].push(reaction);
    });
    
    return (
      <div className={`flex mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className="flex space-x-1">
          {Object.entries(reactionGroups).map(([type, reactions]) => (
            <div 
              key={type}
              className="bg-white rounded-full px-2 py-0.5 shadow-sm flex items-center text-xs"
            >
              {type === 'heart' ? <HiHeart className="text-red-500 mr-1" size={12} /> : null}
              {reactions.length}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // 日付の表示
  const renderTimestamp = () => {
    return message.createdAt ? (
      <div className="text-xs text-gray-500">
        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: ja })}
      </div>
    ) : null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4 relative`}
    >
      {/* 左側（相手のメッセージの場合はアバターを表示） */}
      {!isMine && showAvatar && (
        <div className="flex-shrink-0 mr-3">
          <SafeImage
            src={senderAvatar || '/images/default-avatar.svg'}
            alt={senderName || ''}
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
      
      {/* 中央（メッセージの内容） */}
      <div className={`max-w-[70%] ${isMine ? 'order-1' : 'order-2'}`}>
        {/* 送信者名（相手のメッセージで名前がある場合のみ表示） */}
        {!isMine && senderName && (
          <div className="text-xs font-medium text-gray-700 mb-1">
            {senderName}
          </div>
        )}
        
        {/* メッセージ本文（テキストがある場合） */}
        {message.content && (
          <div className={`rounded-lg p-3 inline-block max-w-full ${
            isMine 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}>
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
        )}
        
        {/* 添付ファイル（画像、動画、位置情報など） */}
        {renderAttachments()}
        
        {/* リアクション表示 */}
        {renderReactions()}
        
        {/* メッセージ送信日時とステータス */}
        <div className={`flex items-center mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
          {renderTimestamp()}
          {renderStatusIcon() && (
            <span className="ml-1">
              {renderStatusIcon()}
            </span>
          )}
        </div>
      </div>
      
      {/* 右側（自分のメッセージの場合はメニューを表示） */}
      <div className={`flex-shrink-0 ${isMine ? 'mr-3 order-0' : 'ml-3 order-3'}`}>
        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowOptions(!showOptions)}
          >
            <HiOutlineDotsHorizontal className="text-gray-500" />
          </button>
          
          {/* オプションメニュー */}
          {showOptions && (
            <div className="absolute z-10 right-0 mt-1 bg-white rounded-md shadow-lg py-1 min-w-[120px]">
              {/* リアクション追加ボタン */}
              {onReactionAdd && (
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onReactionAdd(message.id, 'heart');
                    setShowOptions(false);
                  }}
                >
                  <HiOutlineHeart className="mr-2" />
                  いいね
                </button>
              )}
              
              {/* 返信ボタン */}
              {onReply && (
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onReply(message.id);
                    setShowOptions(false);
                  }}
                >
                  返信
                </button>
              )}
              
              {/* 削除ボタン（自分のメッセージのみ） */}
              {isMine && onDelete && (
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    onDelete(message.id);
                    setShowOptions(false);
                  }}
                >
                  削除
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
