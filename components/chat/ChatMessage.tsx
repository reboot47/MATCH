import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Heart, ThumbsUp, SmilePlus, Reply, X, Trash2, Copy, Forward, Link, MapPin, Mic } from 'lucide-react';

export interface ChatMessageProps {
  id?: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead?: boolean;
  avatar?: string;
  attachments?: {
    type: 'image' | 'video' | 'link' | 'location' | 'audio';
    url: string;
    previewUrl?: string;
    title?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    duration?: number;
  }[];
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

const ChatMessage: React.FC<ChatMessageProps> = ({
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
}) => {
  // 正規表現でURLを検出する
  const detectUrls = (text: string | undefined) => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };
  
  // メッセージにURLが含まれているかチェック
  // コンポーネントのレンダリング時に一度だけ計算し、useEffectの依存配列に含めない
  const urlsInContent = React.useMemo(() => {
    return !isDeleted ? detectUrls(content) : [];
  }, [isDeleted, content]);

  const [isLongPressed, setIsLongPressed] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [urlPreviews, setUrlPreviews] = useState<Array<{url: string, title?: string, description?: string, image?: string, domain?: string, siteName?: string, isLoading?: boolean, error?: string}>>([]);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  // 長押し処理
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    longPressTimeoutRef.current = setTimeout(() => {
      setIsLongPressed(true);
    }, 500); // 500ms の長押しでメニュー表示
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };
  
  // ダブルタップ処理（いいねを付ける）
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onReactionAdd && id) {
      onReactionAdd(id, '❤️');
    }
  };
  
  // メッセージを削除する
  const handleDelete = () => {
    if (onMessageDelete && id) {
      onMessageDelete(id);
    }
    setShowDeleteConfirm(false);
  };

  // 削除をキャンセルする
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  // リアクション追加
  const handleReactionAdd = (type: string) => {
    if (onReactionAdd && id) {
      onReactionAdd(id, type);
    }
    setShowReactionPicker(false);
    setIsLongPressed(false);
  };
  
  // 返信
  const handleReply = () => {
    if (onReply && id) {
      onReply(id, content);
    }
    setIsLongPressed(false);
  };
  
  // URLを検出してAPIからプレビュー情報を取得
  useEffect(() => {
    // ローディング事前に初期プレビューを設定する
    if (!isDeleted && urlsInContent.length > 0) {
      // 初期ローディング状態を設定
      const initialPreviews = urlsInContent.map(url => ({
        url,
        title: 'リンクを読み込み中...',
        description: url,
        image: undefined,
        domain: url.split('/')[2],
        isLoading: true
      }));
      setUrlPreviews(initialPreviews);
      
      // APIからデータを取得する非同期関数
      const fetchUrlPreviews = async () => {
        try {
          const previews = await Promise.all(
            urlsInContent.map(async (url) => {
              try {
                // APIリクエストを送信
                const response = await fetch(`/api/url-preview?url=${encodeURIComponent(url)}`);
                
                if (!response.ok) {
                  throw new Error(`APIリクエストエラー: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.preview) {
                  // APIから取得したデータでプレビューを生成
                  return {
                    url,
                    title: data.preview.title || url.split('/')[2],
                    description: data.preview.description || '',
                    image: data.preview.image,
                    siteName: data.preview.siteName,
                    domain: data.preview.domain || url.split('/')[2],
                    isLoading: false
                  };
                } else {
                  // エラー時のフォールバック
                  console.error('URLプレビュー取得失敗:', data.error);
                  return {
                    url,
                    title: url.split('/')[2],
                    description: '',
                    image: undefined,
                    domain: url.split('/')[2],
                    isLoading: false,
                    error: data.error
                  };
                }
              } catch (error) {
                console.error(`URLプレビュー取得エラー (${url}):`, error);
                // エラーが発生しても基本的なプレビューは表示
                return {
                  url,
                  title: url.split('/')[2],
                  description: 'リンク情報を読み込めませんでした',
                  image: undefined,
                  domain: url.split('/')[2],
                  isLoading: false,
                  error: String(error)
                };
              }
            })
          );
          
          setUrlPreviews(previews);
        } catch (error) {
          console.error('URLプレビュー処理エラー:', error);
          // エラー時は初期状態のまま維持
        }
      };

      // APIリクエストを実行
      fetchUrlPreviews();
    } else {
      setUrlPreviews([]);
    }
  }, [isDeleted, urlsInContent]);

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderAttachment = (attachment: NonNullable<ChatMessageProps['attachments']>[number], index: number) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div key={index} className="relative mb-1 overflow-hidden rounded-lg w-full max-w-[200px]">
            <Image
              src={attachment.url}
              alt="Attached image"
              width={200}
              height={150}
              className="object-cover rounded-lg w-full"
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
      case 'audio':
        return (
          <div key={index} className="flex items-center mb-1 p-2 bg-white rounded-lg shadow-sm w-full max-w-[240px]">
            <div className="flex-shrink-0 mr-3 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Mic size={16} className="text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <audio controls className="w-full">
                <source src={attachment.url} type="audio/webm" />
                お使いのブラウザは音声再生に対応していません。
              </audio>
              {attachment.duration && (
                <p className="text-xs text-gray-500 mt-1">{Math.floor(attachment.duration / 60).toString().padStart(2, '0')}:{(attachment.duration % 60).toString().padStart(2, '0')}</p>
              )}
            </div>
          </div>
        );
      case 'location':
        return (
          <div key={index} className="mb-1 overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-full max-w-[240px]">
            <div className="relative w-full h-32 overflow-hidden">
              <a 
                href={`https://maps.google.com/maps?q=${attachment.latitude},${attachment.longitude}&z=16&output=embed`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+06c755(${attachment.longitude},${attachment.latitude})/${attachment.longitude},${attachment.latitude},14,0/240x180?access_token=pk.eyJ1IjoibGluZWJ1enoiLCJhIjoiY2xybngxazJlMGJ6NjJqbzJ6dWNjNHV1dCJ9.IH3_hXvKPVLYXpMlWMgpfA`}
                  alt="Location map"
                  width={240}
                  height={180}
                  className="object-cover w-full h-full"
                />
              </a>
            </div>
            <div className="p-2">
              <h4 className="font-medium text-sm text-gray-800 line-clamp-1">
                {attachment.title || '位置情報'}
              </h4>
              {attachment.address && (
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{attachment.address}</p>
              )}
              <div className="flex items-center mt-1.5">
                <MapPin className="h-3 w-3 text-primary-500 mr-1" />
                <a 
                  href={`https://maps.google.com/maps?q=${attachment.latitude},${attachment.longitude}&z=16`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 truncate"
                >
                  地図で見る
                </a>
              </div>
            </div>
          </div>
        );
      case 'link':
        return (
          <div key={index} className="flex flex-col mb-1 overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {attachment.previewUrl && (
              <div className="relative w-full h-24 overflow-hidden">
                <Image
                  src={attachment.previewUrl}
                  alt={attachment.title || 'Link preview'}
                  width={200}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="p-2">
              <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{attachment.title}</h4>
              {attachment.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{attachment.description}</p>
              )}
              <div className="flex items-center mt-1.5">
                <Link className="h-3 w-3 text-gray-400 mr-1" />
                <a 
                  href={attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 truncate"
                >
                  {attachment.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
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
      className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'} max-w-full clear-both relative`}
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar for sender - only show on the first message or after a gap */}
      {!isMe && avatar && (
        <div className="mr-1 flex-shrink-0 mt-auto mb-1">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={avatar}
              alt="Profile"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}
      
      <div 
        ref={messageRef}
        className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'} overflow-hidden`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onDoubleClick={handleDoubleClick}
      >
        {/* 引用返信表示 */}
        {replyTo && (
          <div className={`
            mb-1 px-2 py-1 text-xs border-l-2 rounded ${isMe ? 'border-white bg-[#05b64b] text-white' : 'border-[#06c755] bg-gray-100 text-gray-600'}
          `}>
            <p className="truncate max-w-full">{replyTo.content}</p>
          </div>
        )}

        <div 
          className={`
            rounded-xl px-3 py-2 inline-block max-w-full overflow-hidden
            ${isDeleted 
              ? 'bg-transparent p-0' 
              : isMe 
                ? 'bg-[#06c755] text-white rounded-tr-sm' 
                : 'bg-white text-gray-800 rounded-tl-sm border border-gray-200'
            }
          `}
        >
          {attachments && attachments.length > 0 && (
            <div className="mb-2 w-full overflow-hidden">
              {attachments.length === 1 ? (
                // 単一画像の場合
                <div className="w-full">
                  {renderAttachment(attachments[0], 0)}
                </div>
              ) : (
                // 複数画像の場合
                <div className={`grid gap-1 ${attachments.length === 2 ? 'grid-cols-2' : attachments.length >= 3 ? 'grid-cols-3' : ''}`}>
                  {attachments.map((attachment, idx) => (
                    <div key={idx} className={`
                      ${attachments.length === 3 && idx === 0 ? 'col-span-3' : ''}
                      ${attachments.length === 4 && idx < 2 ? 'col-span-2' : ''}
                      ${attachments.length > 4 ? 'max-h-24' : ''}
                    `}>
                      {renderAttachment(attachment, idx)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {isDeleted ? (
            <div className="flex justify-center w-full">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl py-2 px-4 text-center inline-flex items-center max-w-[85%]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">このメッセージは送信者によって取り消されました</span>
              </div>
            </div>
          ) : content ? (
            <>
              {/* メッセージ内のURLを検出してクリック可能なリンクにする */}
              <p className="text-sm whitespace-pre-wrap break-words w-full overflow-hidden">
                {urlsInContent.length > 0 ? (
                  <>
                    {content.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
                      if (part.match(/^https?:\/\//)) {
                        return (
                          <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline ${isMe ? 'text-white' : 'text-blue-500'}`}
                          >
                            {part}
                          </a>
                        );
                      }
                      return part;
                    })}
                  </>
                ) : (
                  content
                )}
              </p>
              
              {/* 検出したURLに対してLINE風のプレビュー表示を追加 */}
              {urlPreviews.length > 0 && (
                <div className="mt-2 space-y-2">
                  {urlPreviews.map((preview, idx) => (
                    <a 
                      key={`url-preview-${idx}`} 
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      style={{ maxWidth: '100%' }}
                    >
                      <div className="flex">
                        <div className="w-1/3 h-20 bg-gray-100 flex-shrink-0 relative">
                          {preview.image ? (
                            <Image 
                              src={preview.image} 
                              alt={preview.title || 'リンクプレビュー'}
                              width={100}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Link size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 w-2/3">
                          <h4 className="font-medium text-sm text-gray-800 truncate">{preview.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{preview.description}</p>
                          <span className="text-xs text-blue-500 block mt-1 truncate">{preview.domain || new URL(preview.url).hostname}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : null}
          
          {reactions && reactions.length > 0 && (
            <div className={`flex mt-1 space-x-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {reactions.map((reaction, index) => (
                <span 
                  key={index}
                  className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs ${isMe ? 'bg-white bg-opacity-20' : 'bg-[#06c755] bg-opacity-10 text-[#06c755]'} rounded-full`}
                >
                  {reaction.type} {reaction.count > 1 && reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {timestamp && (
          <div className={`flex items-center text-[10px] mt-1 ${isMe ? 'ml-1' : 'mr-1'} text-gray-500`}>
            {isMe && (
              <span className={`mr-1 flex items-center ${isRead ? 'text-blue-500' : 'text-gray-400'}`}>
                {isRead ? 
                  <CheckCheck size={10} className="mr-0.5" /> : 
                  <Check size={10} className="mr-0.5" />
                }
              </span>
            )}
            <span>{timestamp}</span>
          </div>
        )}

        {/* 長押しメニュー - LINE風のアクションメニュー */}
        <AnimatePresence>
          {isLongPressed && (
            <motion.div 
              className={`absolute ${isMe ? 'right-0 -translate-x-1/4' : 'left-0 translate-x-1/4'} -top-12 z-50 bg-white rounded-xl shadow-lg py-1 px-1 flex items-center space-x-1 border border-gray-200`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowReactionPicker(true)}
                aria-label="Add reaction"
              >
                <SmilePlus size={20} className="text-gray-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={handleReply}
                aria-label="Reply"
              >
                <Reply size={20} className="text-gray-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => navigator.clipboard.writeText(content)}
                aria-label="Copy"
              >
                <Copy size={20} className="text-gray-600" />
              </button>
              {isMe && !isDeleted && (
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setIsLongPressed(false);
                  }}
                  aria-label="Delete"
                >
                  <Trash2 size={20} className="text-gray-600" />
                </button>
              )}
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsLongPressed(false)}
                aria-label="Close"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </motion.div>
          )}

          {/* リアクション選択メニュー */}
          {showReactionPicker && (
            <motion.div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-50 bg-white rounded-xl shadow-lg p-2 flex items-center space-x-2 border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => handleReactionAdd('❤️')}
              >
                <Heart size={20} fill="#ff3b30" className="text-red-500" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => handleReactionAdd('👍')}
              >
                <ThumbsUp size={20} fill="#007aff" className="text-blue-500" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-xl"
                onClick={() => handleReactionAdd('😂')}
              >
                😂
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-xl"
                onClick={() => handleReactionAdd('😮')}
              >
                😮
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-xl"
                onClick={() => handleReactionAdd('😢')}
              >
                😢
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowReactionPicker(false)}
              >
                <X size={20} className="text-gray-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* メッセージ取り消し確認モーダル */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelDelete}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl w-[90%] max-w-sm overflow-hidden shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5">
                <h3 className="text-lg font-medium text-center mb-2">メッセージの取り消し</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-5">
                  このメッセージを取り消しますか？<br/>
                  <span className="text-xs text-gray-500">※相手には「メッセージが取り消されました」と表示されます</span>
                </p>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleDelete}
                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-colors"
                  >
                    取り消す
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-full transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatMessage;
