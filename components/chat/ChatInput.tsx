'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Mic, Camera, Image as ImageIcon, MapPin, Sticker, Smile, X, Send, Paperclip, Trash2 } from 'lucide-react';
import AttachmentMenu from './AttachmentMenu';
import CameraCapture from './CameraCapture';
import AudioRecorder from './AudioRecorder';
import LocationPicker from './LocationPicker';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: any[]) => void;
  isReplying?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isReplying = false }) => {
  console.log('ChatInput component rendering'); // 表示確認用ログ
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStampPicker, setShowStampPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [activeAttachmentType, setActiveAttachmentType] = useState<'camera' | 'audio' | 'location' | 'image' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setIsExpanded(textareaRef.current.scrollHeight > 40);
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      // 添付ファイルがある場合
      if (attachments.length > 0) {
        // 画像ファイルの添付がある場合
        const imageAttachments = attachments
          .filter(file => file.type.startsWith('image/'))
          .map(file => ({
            type: 'image',
            url: URL.createObjectURL(file),
          }));

        // 他のファイルタイプの場合
        const otherAttachments = attachments
          .filter(file => !file.type.startsWith('image/'))
          .map(file => file);

        // 全ての添付ファイルを送信
        onSendMessage(message, [...imageAttachments, ...otherAttachments]);
      } else {
        // 添付ファイルなしのテキストのみの場合
        onSendMessage(message, []);
      }
      
      setMessage('');
      setAttachments([]);
      setAttachmentPreviews([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(true);
    setActiveAttachmentType(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 複数のファイルを配列に変換
      const fileArray = Array.from(files);
      
      // 最大5枚までの制限
      const newFiles = [...attachments, ...fileArray].slice(0, 5);
      setAttachments(newFiles);
      
      // 画像プレビューの作成
      Promise.all(
        fileArray.map(file => {
          // 画像ファイルの場合はプレビュー作成
          if (file.type.startsWith('image/')) {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(file);
            });
          }
          // その他のファイルタイプの場合はnullを返す
          return Promise.resolve('');
        })
      ).then(previews => {
        // 空文字列でないプレビューだけをフィルタリング
        const validPreviews = previews.filter(preview => preview !== '');
        setAttachmentPreviews([...attachmentPreviews, ...validPreviews].slice(0, 5));
      });
      
      setActiveAttachmentType(null);
    }
  };
  
  // カメラで撮影した画像の処理
  const handleCameraCapture = (imageUrl: string) => {
    // 現在のプレビューに追加
    setAttachmentPreviews([...attachmentPreviews, imageUrl].slice(0, 5));
    
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        // 現在の添付ファイルに追加
        setAttachments([...attachments, file].slice(0, 5));
        setActiveAttachmentType(null);
        setShowAttachmentMenu(false);
      })
      .catch(err => console.error("カメラ画像の処理エラー:", err));
  };
  
  // 音声メッセージの処理
  const handleAudioRecording = (audioUrl: string) => {
    fetch(audioUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `audio-message-${Date.now()}.webm`, { type: "audio/webm" });
        // 現在の添付ファイルリストに追加
        setAttachments([...attachments, file]);
        // 音声メッセージの場合は特別な処理を行う
        onSendMessage("", [{
          type: 'audio',
          url: URL.createObjectURL(file),
        }]);
        setActiveAttachmentType(null);
        setShowAttachmentMenu(false);
      })
      .catch(err => console.error("音声メッセージの処理エラー:", err));
  };
  
  // 位置情報の処理
  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    address?: string;
    mapUrl?: string;
  }) => {
    // 位置情報の場合は特別な処理を行う
    onSendMessage("", [{
      type: 'location',
      url: location.mapUrl || `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=16`,
      latitude: location.latitude,
      longitude: location.longitude,
      title: '位置情報',
      address: location.address,
    }]);
    setActiveAttachmentType(null);
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (index: number) => {
    // 指定されたインデックスの添付ファイルを削除
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    
    // 対応するプレビューも削除
    const newPreviews = [...attachmentPreviews];
    newPreviews.splice(index, 1);
    setAttachmentPreviews(newPreviews);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // すべての添付ファイルを削除
  const removeAllAttachments = () => {
    setAttachments([]);
    setAttachmentPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const emojiList = [
    '😊', '😂', '❤️', '👍', '🎉', '✨', '🙏', '🥺', '😭', '😍',
    '😎', '🥰', '😇', '🤔', '😋', '🤩', '😴', '🤗', '🙄', '😮',
    '😳', '🥳', '😘', '🤣', '😁', '😉', '🤭', '🤫', '🥴', '🤪',
    '😝', '😜', '😛', '😌', '🧐', '😤', '😠', '😡', '🤬', '💩'
  ];

  const stampList = [
    '/images/stamps/stamp1.png',
    '/images/stamps/stamp2.png',
    '/images/stamps/stamp3.png',
    '/images/stamps/stamp4.png',
    '/images/stamps/stamp5.png',
    '/images/stamps/stamp6.png',
    '/images/stamps/stamp7.png',
    '/images/stamps/stamp8.png',
  ];

  // LINEデフォルトスタンプ代わりに使用する絵文字コンビネーション
  const quickStamps = [
    '👋😊', '❤️😍', '🎉🥳', '👍✨', '🤗💕', '😂🤣', '🙏✨', '😭💦'
  ];

  return (
    <div className={`border-t border-gray-200 bg-white p-2 ${isReplying ? 'pb-3' : ''}`} ref={inputContainerRef}>
      {/* Attachment previews */}
      {attachmentPreviews.length > 0 && (
        <div className="flex flex-wrap mb-2 gap-2">
          {attachmentPreviews.map((preview, index) => (
            <div key={index} className="relative inline-block">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={preview}
                  alt={`Attachment preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                  aria-label="Remove attachment"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
          {attachmentPreviews.length > 1 && (
            <button
              onClick={removeAllAttachments}
              className="text-xs text-gray-500 hover:text-red-500 ml-1 mt-1 flex items-center"
            >
              <Trash2 size={14} className="mr-1" />
              すべて削除
            </button>
          )}
        </div>
      )}
      
      <AnimatePresence>
        {/* Emoji picker */}
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 mb-2 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto"
          >
            {emojiList.map((emoji, index) => (
              <button
                key={index}
                className="p-1.5 text-xl hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {
                  setMessage(prev => prev + emoji);
                  textareaRef.current?.focus();
                }}
              >
                {emoji}
              </button>
            ))}
            <button 
              className="col-span-8 mt-1 text-xs text-gray-500 hover:text-[#06c755] transition-colors flex items-center justify-center py-1 border-t"
              onClick={() => {
                setShowEmojiPicker(false);
                setShowStampPicker(true);
              }}
            >
              <Sticker size={14} className="mr-1" /> スタンプを表示
            </button>
          </motion.div>
        )}

        {/* Stamp picker */}
        {showStampPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 mb-2"
          >
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {quickStamps.map((stamp, index) => (
                <button
                  key={`quick-${index}`}
                  className="p-2 text-2xl hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center h-14"
                  onClick={() => {
                    onSendMessage(stamp, []);
                    setShowStampPicker(false);
                  }}
                >
                  {stamp}
                </button>
              ))}
            </div>
            <button 
              className="w-full mt-1 text-xs text-gray-500 hover:text-[#06c755] transition-colors flex items-center justify-center py-1 border-t"
              onClick={() => {
                setShowStampPicker(false);
                setShowEmojiPicker(true);
              }}
            >
              <Smile size={14} className="mr-1" /> 絵文字を表示
            </button>
          </motion.div>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 bg-white shadow-lg rounded-t-lg border border-gray-200 z-20"
          >
            {activeAttachmentType === null ? (
              <AttachmentMenu 
                onAttach={(type, data) => {
                  console.log(`添付ファイル選択: ${type}`, data);
                  if (type === 'image') {
                    // 画像選択ダイアログを表示
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  } else if (type === 'camera') {
                    if (data) {
                      // カメラデータが直接渡された場合（モック）
                      console.log('カメラデータ:', data);
                      onSendMessage("", [{
                        type: 'image',
                        url: data.imageUrl || 'https://via.placeholder.com/400x300?text=Camera+Image',
                        title: '写真',
                      }]);
                      setShowAttachmentMenu(false);
                    } else {
                      // カメラモードを表示
                      setActiveAttachmentType('camera');
                    }
                  } else if (type === 'audio') {
                    if (data) {
                      // 音声データが直接渡された場合（モック）
                      console.log('音声データ:', data);
                      onSendMessage("", [{
                        type: 'audio',
                        url: data.audioUrl || 'https://example.com/mock-audio.mp3',
                        title: '音声メッセージ',
                      }]);
                      setShowAttachmentMenu(false);
                    } else {
                      // 録音モードを表示
                      setActiveAttachmentType('audio');
                    }
                  } else if (type === 'location') {
                    if (data && data.latitude && data.longitude) {
                      // 位置情報が直接渡された場合
                      console.log('位置情報:', data);
                      handleLocationSelect(data);
                    } else {
                      // 位置選択モードを表示
                      setActiveAttachmentType('location');
                    }
                  }
                }}
                onClose={() => setShowAttachmentMenu(false)}
              />
            ) : activeAttachmentType === 'camera' ? (
              <CameraCapture onCapture={handleCameraCapture} />
            ) : activeAttachmentType === 'audio' ? (
              <AudioRecorder onRecordingComplete={handleAudioRecording} />
            ) : activeAttachmentType === 'location' ? (
              <LocationPicker onLocationSelect={handleLocationSelect} />
            ) : null}
          </motion.div>
        )}
        
        {/* Old Attachment options */}
        {showAttachmentOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 mb-2 flex justify-around"
          >
            <button
              className="p-2 text-gray-600 hover:text-[#06c755] flex flex-col items-center rounded-md transition-colors"
              onClick={() => {
                fileInputRef.current?.click();
                setShowAttachmentOptions(false);
              }}
            >
              <ImageIcon size={22} />
              <span className="text-xs mt-1">画像</span>
            </button>
            <button
              className="p-2 text-gray-600 hover:text-[#06c755] flex flex-col items-center rounded-md transition-colors"
              onClick={() => {
                // カメラAPIにアクセス
                try {
                  navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                      // ストリームを停止（テスト目的のみ）
                      stream.getTracks().forEach(track => track.stop());
                      // カメラアクセスが許可されたらカメラデータを送信
                      const mockCameraData = {
                        imageUrl: 'https://via.placeholder.com/400x300?text=Camera+Image',
                        timestamp: new Date().toISOString()
                      };
                      onSendMessage("", [{
                        type: 'image',
                        url: mockCameraData.imageUrl,
                        title: '写真'
                      }]);
                    })
                    .catch(err => {
                      console.error('カメラへのアクセスが拒否されました:', err);
                      alert('カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。');
                    });
                } catch (err) {
                  console.error('カメラ機能エラー:', err);
                  alert('カメラ機能にアクセスできません。');
                }
                setShowAttachmentOptions(false);
              }}
            >
              <Camera size={22} />
              <span className="text-xs mt-1">カメラ</span>
            </button>
            <button
              className="p-2 text-gray-600 hover:text-[#06c755] flex flex-col items-center rounded-md transition-colors"
              onClick={() => {
                // 音声APIにアクセス
                try {
                  navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                      // ストリームを停止（テスト目的のみ）
                      stream.getTracks().forEach(track => track.stop());
                      // マイクアクセスが許可されたら音声メッセージを送信
                      const mockAudioData = {
                        audioUrl: 'https://example.com/mock-audio.mp3',
                        duration: 5.2
                      };
                      onSendMessage("", [{
                        type: 'audio',
                        url: mockAudioData.audioUrl,
                        title: '音声メッセージ'
                      }]);
                    })
                    .catch(err => {
                      console.error('マイクへのアクセスが拒否されました:', err);
                      alert('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。');
                    });
                } catch (err) {
                  console.error('音声機能エラー:', err);
                  alert('音声機能にアクセスできません。');
                }
                setShowAttachmentOptions(false);
              }}
            >
              <Mic size={22} />
              <span className="text-xs mt-1">音声</span>
            </button>
            <button
              className="p-2 text-gray-600 hover:text-[#06c755] flex flex-col items-center rounded-md transition-colors"
              onClick={() => {
                // 位置情報APIにアクセス
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        address: '位置情報を取得しました',
                        mapUrl: `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`
                      };
                      
                      // 位置情報を送信
                      onSendMessage("", [{
                        type: 'location',
                        url: locationData.mapUrl,
                        latitude: locationData.latitude,
                        longitude: locationData.longitude,
                        title: '位置情報',
                        address: locationData.address
                      }]);
                    },
                    (error) => {
                      console.error('位置情報の取得に失敗しました:', error);
                      alert('位置情報の取得に失敗しました。ブラウザの設定を確認してください。');
                    }
                  );
                } else {
                  alert('お使いのブラウザは位置情報に対応していません。');
                }
                setShowAttachmentOptions(false);
              }}
            >
              <MapPin size={22} />
              <span className="text-xs mt-1">位置</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex items-end ${isReplying ? 'border-l-2 border-[#06c755] pl-2' : ''}`}>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowEmojiPicker(false);
              setShowStampPicker(false);
              setShowAttachmentOptions(!showAttachmentOptions);
            }}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#06c755] transition-colors rounded-full focus:outline-none"
            aria-label="Add attachment"
          >
            <Paperclip size={20} />
          </button>
          <button
            onClick={() => {
              setShowAttachmentOptions(false);
              setShowStampPicker(false);
              setShowEmojiPicker(!showEmojiPicker);
            }}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#06c755] transition-colors rounded-full focus:outline-none"
            aria-label="Add emoji"
          >
            <Smile size={20} />
          </button>
        </div>

        <div className="flex-1 relative mx-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isReplying ? '返信を入力...' : 'メッセージを入力...'}
            className={`w-full border ${isReplying ? 'border-[#06c755] bg-[#f0fff8]' : 'border-gray-300'} rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#06c755] focus:border-[#06c755] resize-none max-h-32 transition-all text-sm`}
            style={{ minHeight: '40px' }}
            rows={1}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*"
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && attachments.length === 0}
          className={`w-10 h-10 rounded-full flex items-center justify-center focus:outline-none transition-colors ${
            message.trim() || attachments.length > 0
              ? isReplying 
                ? 'bg-[#0551b6] text-white hover:opacity-90' 
                : 'bg-[#06c755] text-white hover:bg-[#05b64b]'
              : 'bg-gray-200 text-gray-400'
          }`}
          aria-label="Send message"
          title={isReplying ? '返信を送信' : 'メッセージを送信'}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
