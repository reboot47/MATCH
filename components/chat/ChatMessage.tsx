import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Heart, ThumbsUp, SmilePlus, Reply, X, Trash2, Copy, Forward, Link, MapPin, Mic } from 'lucide-react';
import UrlPreview from './UrlPreview';
import { useUrlPreviews } from './ChatMessageHelper';
import GiftImage from '@/app/components/common/GiftImage';
import MapImage from '@/app/components/common/MapImage';
import { SafeImage } from '@/app/components/common/SafeImage';

export interface ChatMessageProps {
  id?: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead?: boolean;
  avatar?: string;
  attachments?: ({
    type: 'image' | 'video' | 'link' | 'location' | 'audio';
    url: string;
    previewUrl?: string;
    title?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    duration?: number;
  } | {
    type: 'gift';
    url: string;
    giftId: string;
    giftName: string;
    price: number;
    message?: string;
    animation?: string;
  })[];
  reactions?: {
    type: string;
    count: number;
    users?: string[];
  }[];
  isDeleted?: boolean;
  replyTo?: {
    id: string;
    content: string;
    isMe: boolean;
  };
  onReactionAdd?: (messageId: string | undefined, reactionType: string) => void;
  onMessageDelete?: (messageId: string | undefined) => void;
  onReply?: (messageId: string | undefined, content: string) => void;
}

const ChatMessage = ({
  id,
  content,
  timestamp,
  isMe,
  isRead = false,
  avatar,
  attachments = [],
  reactions = [],
  isDeleted = false,
  replyTo,
  onReactionAdd,
  onMessageDelete,
  onReply,
}: ChatMessageProps): React.ReactNode => {
  // UI状態管理
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // URLプレビュー機能をカスタムフックから取得
  const { urlPreviews } = useUrlPreviews(content, isDeleted);
  
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  // 長押し処理
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    longPressTimeoutRef.current = setTimeout(() => {
      setIsLongPressed(true);
    }, 500); // 500ms の長押しでメニュー表示
  };
  
  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };
  
  const handleTouchMove = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };
  
  // ダブルタップ処理（いいねを付ける）
  const handleDoubleClick = () => {
    if (onReactionAdd && id) {
      onReactionAdd(id, '♥️');
    }
  };
  
  // メッセージを削除する
  const handleDelete = () => {
    if (onMessageDelete && id) {
      onMessageDelete(id);
    }
    setIsLongPressed(false);
    setShowDeleteConfirm(false);
  };
  
  // テキストをコピー
  const handleCopy = () => {
    if (content && !isDeleted) {
      navigator.clipboard.writeText(content).then(
        () => {
          console.log('テキストがコピーされました');
        },
        (err) => {
          console.error('コピーに失敗しました', err);
        }
      );
    }
    setIsLongPressed(false);
  };

  // 返信
  const handleReply = () => {
    if (onReply && id) {
      onReply(id, content);
    }
    setIsLongPressed(false);
  };

  // URLプレビューのレンダリング処理
  const renderUrlPreview = React.useCallback(() => {
    return (
      <div className="mt-1 space-y-2">
        {urlPreviews.map((preview, index) => (
          <div key={`${preview.url}-${index}`} className="max-w-md">
            <UrlPreview preview={preview} isMe={isMe} />
          </div>
        ))}
      </div>
    );
  }, [urlPreviews, isMe]);
  
  // 削除確認モーダル
  const renderDeleteConfirm = () => {
    return (
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-medium mb-2">メッセージを削除しますか？</h3>
              <p className="text-gray-500 text-sm mb-4">この操作は取り消せません。</p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  キャンセル
                </button>
                <button
                  className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600"
                  onClick={handleDelete}
                >
                  削除
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  // リアクションピッカー
  const renderReactionPicker = () => {
    const reactions = ['♥️', '👍', '😂', '😮', '😢', '😠'];
    
    return (
      <AnimatePresence>
        {showReactionPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-full mb-2 bg-white rounded-full shadow-lg p-1 flex items-center ${isMe ? 'right-0' : 'left-0'}`}
          >
            {reactions.map((reaction) => (
              <button
                key={reaction}
                className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full"
                onClick={() => {
                  if (onReactionAdd && id) {
                    onReactionAdd(id, reaction);
                  }
                  setShowReactionPicker(false);
                  setIsLongPressed(false);
                }}
              >
                {reaction}
              </button>
            ))}
            <button 
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full ml-1"
              onClick={() => setShowReactionPicker(false)}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  // アクションメニュー
  const renderActionMenu = () => {
    return (
      <AnimatePresence>
        {isLongPressed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute ${isMe ? 'right-0' : 'left-0'} bottom-full mb-2 bg-white rounded-lg shadow-lg overflow-hidden z-20`}
          >
            <div className="p-1 flex flex-col">
              <button 
                className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => {
                  setShowReactionPicker(true);
                  setIsLongPressed(false);
                }}
              >
                <SmilePlus size={18} className="mr-2" />
                リアクションを追加
              </button>
              <button 
                className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={handleReply}
              >
                <Reply size={18} className="mr-2" />
                返信
              </button>
              <button 
                className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={handleCopy}
              >
                <Copy size={18} className="mr-2" />
                コピー
              </button>
              {isMe && (
                <button 
                  className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setIsLongPressed(false);
                  }}
                >
                  <Trash2 size={18} className="mr-2" />
                  削除
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  // 添付ファイルの表示処理
  const renderAttachments = () => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className="mt-1 space-y-2">
        {attachments.map((attachment, index) => {
          if (attachment.type === 'gift') {
            // ギフト情報の処理
            const giftId = attachment.giftId || 'default-gift';
            const giftName = attachment.giftName || '素敵なギフト';
            const giftMessage = attachment.message || '';
            
            // ギフト画像のソースURLを設定
            // ここでは優先順位：1. attachment.url 2. ギフトID 3. デフォルト
            // GiftImageコンポーネントは内部で適切なURLを解決します
            const giftImageSrc = attachment.url && attachment.url.trim() !== '' 
              ? attachment.url 
              : giftId;
            
            // デバッグログ
            console.log(`[ChatMessage:Gift] ID: ${giftId}, 提供画像URL: ${giftImageSrc}`);
            
            // 安全なギフト名・ギフト画像処理
            const safeGiftName = giftName || 'ギフト';
            
            // ギフトIDがあるが画像がない場合はギフトIDをキーとして使用
            const effectiveSrc = giftImageSrc || (giftId ? giftId.toLowerCase() : null);
            
            return (
              <div
                key={`gift-${index}-${giftId}`}
                className="relative max-w-[240px] mx-auto"
              >
                <div className="bg-[#06c755] bg-gradient-to-r from-[#06c755] to-[#04b349] text-white text-center py-2.5 px-4 rounded-t-xl shadow-sm h-10 flex items-center justify-center">
                  <span className="text-sm font-medium flex items-center justify-center space-x-1">
                    <span className="text-lg">🎁</span>
                    <span>ギフトを受け取りました</span>
                  </span>
                </div>
                <div className="bg-white rounded-b-xl overflow-hidden shadow-md">
                  {/* LINE風のギフト表示 - 改良版GiftImageコンポーネントを使用 */}
                  <div className="w-[200px] h-[200px] mx-auto flex items-center justify-center p-4">
                    <GiftImage 
                      src={effectiveSrc || 'heart'}
                      alt={safeGiftName}
                      width={140}
                      height={140}
                      priority={true}
                      style={{ margin: '0 auto' }}
                    />
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <div className="text-center">
                      <span className="inline-block bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                        {giftName}
                      </span>
                    </div>
                    {giftMessage && (
                      <div className="text-sm text-gray-600 text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                        {giftMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          } else if (attachment.type === 'image') {
            // 画像URLのチェックと設定
            const imageUrl = attachment.url || '/images/placeholder.svg';
            
            return (
              <div key={`image-${index}`} className="relative rounded-lg overflow-hidden max-w-xs">
                {/* SafeImageコンポーネントを使用して、プロキシとエラーハンドリングを適用 */}
                <SafeImage 
                  src={imageUrl}
                  alt="添付画像"
                  className="w-full max-h-60"
                  fallbackSrc="/images/placeholder.svg"
                  defaultAlt="添付画像"
                  objectFit="cover"
                  width={300}
                  height={200}
                />
              </div>
            );
          } else if (attachment.type === 'video') {
            return (
              <div key={`${attachment.url}-${index}`} className="relative rounded-md overflow-hidden max-w-xs shadow-sm">
                <div className="aspect-video bg-black rounded-md overflow-hidden">
                  <video 
                    src={attachment.url}
                    controls
                    poster={attachment.previewUrl}
                    className="w-full h-full object-contain"
                    preload="metadata"
                    controlsList="nodownload"
                    playsInline
                  />
                </div>
                {attachment.title && (
                  <div className="text-xs px-2 py-1 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white">
                    <p className="font-medium truncate">{attachment.title}</p>
                  </div>
                )}
                {/* 動画のタイトルの表示を改善 */}
              </div>
            );
          } else if (attachment.type === 'location') {
            // シンプルな位置情報処理
            const latitude = attachment.latitude;
            const longitude = attachment.longitude;
            
            const locationTitle = attachment.title || '位置情報';
            const locationAddress = attachment.address || '';
            
            return (
              <div key={`location-${index}`} className="bg-gray-100 rounded-lg p-2 max-w-xs">
                <div className="flex items-start">
                  <MapPin className="text-blue-500 mt-1 mr-2 flex-shrink-0" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{locationTitle}</p>
                    {locationAddress && (
                      <p className="text-xs text-gray-500 mt-1">{locationAddress}</p>
                    )}
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-2 rounded overflow-hidden"
                    >
                      <div className="relative w-full h-[150px] bg-gray-200 rounded-t-md overflow-hidden">
                        {/* MapImageコンポーネントを使用 */}
                        <MapImage
                          latitude={latitude}
                          longitude={longitude}
                          name={locationTitle}
                          className="w-full h-full"
                          height="150px"
                          objectFit="cover"
                        />
                      </div>
                      <div className="bg-[#06c755] text-white text-xs font-medium py-1 px-2 text-center">
                        Googleマップで見る
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            );
          } else if (attachment.type === 'audio') {
            return (
              <div key={`${attachment.url}-${index}`} className="bg-gray-100 rounded-lg p-3 flex items-center max-w-xs">
                <Mic className="text-blue-500 mr-2" size={18} />
                <div className="flex-1">
                  <div className="text-sm">{attachment.title || '音声メッセージ'}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {attachment.duration ? `${Math.floor(attachment.duration / 60)}:${(attachment.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  ▶
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };
  
  // メッセージの内容をマークアップする（URLとテキストを分離）
  const renderMessageContent = () => {
    if (isDeleted) {
      return <span className="italic text-gray-500">このメッセージは削除されました</span>;
    }
    
    return content;
  };
  
  // リアクションの表示
  const renderReactions = () => {
    if (reactions.length === 0) return null;
    
    return (
      <div className={`flex gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
        {reactions.map((reaction, index) => (
          <div
            key={`${reaction.type}-${index}`}
            className="inline-flex items-center bg-white rounded-full px-2 py-1 shadow-sm text-xs"
          >
            <span className="mr-1">{reaction.type}</span>
            <span className="text-gray-500">{reaction.count}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // 返信表示
  const renderReplyTo = () => {
    if (!replyTo) return null;
    
    return (
      <div className={`mb-1 p-2 rounded-md text-xs border-l-2 ${replyTo.isMe ? 'border-[#06c755]' : 'border-gray-300'}`}>
        <div className={`font-semibold ${replyTo.isMe ? 'text-[#06c755]' : 'text-gray-500'}`}>
          {replyTo.isMe ? 'あなた' : '相手'}からの返信
        </div>
        <div className="line-clamp-1 mt-1">{replyTo.content}</div>
      </div>
    );
  };
  
  // 既読表示
  const renderReadStatus = () => {
    if (!isMe) return null;
    
    return (
      <div className="text-xs text-right mt-1 text-gray-500 mr-1">
        {isRead ? (
          <span className="flex items-center justify-end">
            既読 <CheckCheck size={12} className="ml-0.5" />
          </span>
        ) : (
          <span className="flex items-center justify-end">
            送信済み <Check size={12} className="ml-0.5" />
          </span>
        )}
      </div>
    );
  };
  
  // メイン表示
  return (
    <div 
      className={`flex mb-4 relative ${isMe ? 'justify-end' : 'justify-start'}`}
      ref={messageRef}
    >
      {!isMe && avatar && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={avatar}
              alt="アバター"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
        <div 
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onDoubleClick={handleDoubleClick}
        >
          {renderReplyTo()}
          
          <div 
            className={`relative p-3 rounded-lg ${
              isMe 
                ? 'bg-[#06c755] text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
            }`}
          >
            {renderMessageContent()}
            {renderUrlPreview()}
            {renderAttachments()}
          </div>
          
          <div className="flex flex-wrap items-end justify-between mt-1 text-xs text-gray-500">
            <div>{timestamp}</div>
            {renderReadStatus()}
          </div>
          
          {renderReactions()}
          {renderActionMenu()}
          {renderReactionPicker()}
        </div>
      </div>
      
      {renderDeleteConfirm()}
    </div>
  );
};

export default ChatMessage;
