"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { HiPaperClip, HiPhotograph, HiLocationMarker, HiVideoCamera, HiEmojiHappy } from 'react-icons/hi';
import { RiSendPlaneFill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageAttachment, VideoAttachment, LocationAttachment, UrlAttachment } from '@/app/types/chat';

interface MessageInputProps {
  onSendMessage: (text: string, attachments: any[]) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingEnd,
  disabled = false,
  placeholder = 'メッセージを入力...'
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isEmoticonPickerOpen, setIsEmoticonPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // テキスト入力ハンドラー
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    // 入力中イベント発火
    if (e.target.value && !text) {
      onTypingStart?.();
    } else if (!e.target.value && text) {
      onTypingEnd?.();
    }
  };

  // Enterキーでの送信
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 画像添付ハンドラー
  const handleImageAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = Array.from(e.target.files).map(file => {
        const url = URL.createObjectURL(file);
        const attachment: ImageAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          url,
          createdAt: new Date()
        };
        return attachment;
      });
      
      setAttachments([...attachments, ...newAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 動画添付ハンドラー
  const handleVideoAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = Array.from(e.target.files).map(file => {
        const url = URL.createObjectURL(file);
        const attachment: VideoAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'video',
          url,
          createdAt: new Date()
        };
        return attachment;
      });
      
      setAttachments([...attachments, ...newAttachments]);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // 位置情報添付ハンドラー
  const handleLocationAttachment = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationAttachment: LocationAttachment = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: '現在地',
            createdAt: new Date()
          };
          
          setAttachments([...attachments, locationAttachment]);
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
          alert('位置情報の取得に失敗しました。位置情報の許可を確認してください。');
        }
      );
    } else {
      alert('お使いのブラウザは位置情報をサポートしていません。');
    }
  };

  // URL検出
  const detectUrlsInText = (text: string): UrlAttachment[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    
    if (!matches) return [];
    
    return matches.map(url => ({
      id: Math.random().toString(36).substr(2, 9),
      type: 'url',
      url,
      createdAt: new Date(),
    }));
  };

  // 添付ファイル削除
  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  // メッセージ送信
  const handleSendMessage = () => {
    if ((!text && attachments.length === 0) || disabled) return;
    
    // テキストからURL検出
    const urlAttachments = detectUrlsInText(text);
    const allAttachments = [...attachments];
    
    // URLが既に添付されていない場合のみ追加
    for (const urlAttachment of urlAttachments) {
      if (!allAttachments.some(a => a.type === 'url' && a.url === urlAttachment.url)) {
        allAttachments.push(urlAttachment);
      }
    }
    
    onSendMessage(text, allAttachments);
    setText('');
    setAttachments([]);
    onTypingEnd?.();
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      {/* 添付ファイルプレビュー */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              {attachment.type === 'image' && (
                <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-300">
                  <Image 
                    src={attachment.url} 
                    alt="添付画像" 
                    width={80} 
                    height={80} 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              {attachment.type === 'video' && (
                <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-300 bg-black flex items-center justify-center">
                  <HiVideoCamera className="text-white w-8 h-8" />
                </div>
              )}
              
              {attachment.type === 'location' && (
                <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                  <HiLocationMarker className="text-primary-500 w-8 h-8" />
                </div>
              )}
              
              <button
                className="absolute top-0 right-0 bg-gray-800 bg-opacity-70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                onClick={() => removeAttachment(attachment.id)}
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end">
        <div className="relative mr-2">
          <button
            className="text-gray-500 hover:text-primary-500 p-2 transition-colors"
            onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
          >
            <HiPaperClip className="w-6 h-6" />
          </button>
          
          {/* 添付メニュー */}
          <AnimatePresence>
            {isAttachmentMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 left-0 bg-white rounded-md shadow-lg p-1 w-48 z-10"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageAttachment}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoAttachment}
                />
                
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded text-left text-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <HiPhotograph className="w-5 h-5 mr-2 text-green-500" />
                  <span>画像</span>
                </button>
                
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded text-left text-sm"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <HiVideoCamera className="w-5 h-5 mr-2 text-red-500" />
                  <span>動画</span>
                </button>
                
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded text-left text-sm"
                  onClick={handleLocationAttachment}
                >
                  <HiLocationMarker className="w-5 h-5 mr-2 text-blue-500" />
                  <span>位置情報</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 bg-gray-100 rounded-2xl flex items-end">
          <textarea
            className="flex-1 bg-transparent border-none resize-none p-3 outline-none text-sm max-h-32"
            placeholder={placeholder}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ minHeight: '42px' }}
          />
          
          <button
            className="mx-2 text-gray-500 hover:text-primary-500 p-2 transition-colors"
            onClick={() => setIsEmoticonPickerOpen(!isEmoticonPickerOpen)}
          >
            <HiEmojiHappy className="w-5 h-5" />
          </button>
        </div>
        
        <button
          className={`ml-2 p-2 rounded-full ${
            (!text && attachments.length === 0) || disabled
              ? 'bg-gray-200 text-gray-400'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          } transition-colors`}
          disabled={(!text && attachments.length === 0) || disabled}
          onClick={handleSendMessage}
        >
          <RiSendPlaneFill className="w-5 h-5" />
        </button>
      </div>
      
      {/* 絵文字ピッカー - 実装は省略 */}
      {isEmoticonPickerOpen && (
        <div className="absolute bottom-16 right-4 z-10">
          {/* 絵文字ピッカーをここに実装 */}
          <div className="bg-white rounded-md shadow-lg p-4">
            <p className="text-sm text-gray-500">絵文字ピッカー (実装予定)</p>
          </div>
        </div>
      )}
    </div>
  );
}
