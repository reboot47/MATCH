"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { HiPaperClip, HiPhotograph, HiLocationMarker, HiVideoCamera, HiEmojiHappy } from 'react-icons/hi';
import { RiSendPlaneFill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import { MdWarning } from 'react-icons/md';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageAttachment, VideoAttachment, LocationAttachment, UrlAttachment } from '@/app/types/chat';
import toast from 'react-hot-toast';

interface MessageInputProps {
  onSendMessage: (text: string, attachments: any[]) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  disabled?: boolean;
  placeholder?: string;
  gender?: 'male' | 'female';
  currentPoints?: number;
  requiredPoints?: number;
  onPointsUpdated?: (points: number) => void;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingEnd,
  disabled = false,
  placeholder = 'メッセージを入力...',
  gender = 'male',
  currentPoints = 0,
  requiredPoints = 5,
  onPointsUpdated
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isEmoticonPickerOpen, setIsEmoticonPickerOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // 動画の再生時間をフォーマットする関数
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
    // ファイル選択メニューを自動的に閉じる
    setIsAttachmentMenuOpen(false);
    
    if (e.target.files && e.target.files.length > 0) {
      // 既存の画像添付ファイル数を取得
      const existingImageCount = attachments.filter(a => a.type === 'image').length;
      
      // 最大5枚までの制限（LINE仕様に準拠）
      const maxAdditionalImages = 5 - existingImageCount;
      
      if (maxAdditionalImages <= 0) {
        toast.error('画像は最大5枚までアップロードできます');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      // 追加できる画像数に制限
      const filesToAdd = Array.from(e.target.files).slice(0, maxAdditionalImages);
      
      const newAttachments = filesToAdd.map(file => {
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
      
      // 制限に達した場合は通知
      if (existingImageCount + filesToAdd.length >= 5) {
        toast.success('画像の最大数（5枚）に達しました', {
          icon: '📷',
          style: {
            background: '#4B5563',
            color: '#FFFFFF'
          }
        });
      }
    }
  };

  // 動画添付ハンドラー
  const handleVideoAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    // ファイル選択メニューを自動的に閉じる
    setIsAttachmentMenuOpen(false);
    
    if (e.target.files && e.target.files.length > 0) {
      // LINEでは動画ファイルを一度に1つのみ送信可能
      // 既存の動画がある場合はエラー通知
      if (attachments.some(a => a.type === 'video')) {
        toast.error('動画は一度に1つまで添付できます');
        if (videoInputRef.current) videoInputRef.current.value = '';
        return;
      }
      
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      toast.loading(
        <div className="flex items-center space-x-2">
          <div className="animate-pulse">
            <HiVideoCamera className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium">動画を処理中...</p>
            <p className="text-xs">{file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}</p>
          </div>
        </div>, 
        { id: 'video-toast', duration: 10000, style: { background: 'white', color: '#333' } }
      );
      
      try {
        // 動画のメタデータとサムネイルを取得するプロセス
        const video = document.createElement('video');
        video.muted = true; // 自動再生バグ回避用
        video.playsInline = true;
        video.preload = 'metadata';
        video.src = url;
        
        // タイムアウト処理の設定
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => {
            reject(new Error('動画のロードがタイムアウトしました'));
          }, 10000); // 10秒タイムアウト
        });
        
        // メタデータ読み込みのプロミス
        const metadataPromise = new Promise<VideoAttachment>((resolve) => {
          // メタデータがロードされたらサムネイル生成を試みる
          video.onloadedmetadata = () => {
            // 動画の中間付近のフレームにシーク
            video.currentTime = Math.min(1, video.duration / 2);
          };
          
          // シークが完了したらキャンバスに描画
          video.onseeked = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth || 320;
              canvas.height = video.videoHeight || 240;
              
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                // JPEG形式でサムネイルを作成
                const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                // ファイル名からタイトルを生成
                const title = file.name.split('.').slice(0, -1).join('.') || '動画';
                
                const attachment: VideoAttachment = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: 'video',
                  url,
                  thumbnailUrl,
                  duration: video.duration,
                  title,
                  createdAt: new Date()
                };
                
                resolve(attachment);
              } else {
                throw new Error('キャンバスコンテキストの取得に失敗しました');
              }
            } catch (e) {
              // サムネイルなしで添付
              const attachment: VideoAttachment = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'video',
                url,
                duration: video.duration,
                title: file.name.split('.').slice(0, -1).join('.') || '動画',
                createdAt: new Date()
              };
              resolve(attachment);
            }
          };
          
          // エラー発生時はサムネイルなしで添付
          video.onerror = () => {
            const attachment: VideoAttachment = {
              id: Math.random().toString(36).substr(2, 9),
              type: 'video',
              url,
              title: file.name.split('.').slice(0, -1).join('.') || '動画',
              createdAt: new Date()
            };
            resolve(attachment);
          };
          
          // SafariとIE対策としてロードを開始
          video.load();
        });
        
        // プロミスのレースを実行
        Promise.race([metadataPromise, timeoutPromise])
          .then((attachment: any) => {
            setAttachments([...attachments, attachment]);
            toast.dismiss('video-toast');
            toast.success(
              <div className="flex items-center space-x-2">
                <HiVideoCamera className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">動画を添付しました</p>
                  <p className="text-xs">{attachment.title || '動画'}{attachment.duration ? ` (${Math.floor(attachment.duration)}秒)` : ''}</p>
                </div>
              </div>,
              { duration: 3000, style: { background: 'white', color: '#333' } }
            );
          })
          .catch(error => {
            // タイムアウトまたは他のエラー時はサムネイルなしで添付
            console.error('動画処理エラー:', error);
            const attachment: VideoAttachment = {
              id: Math.random().toString(36).substr(2, 9),
              type: 'video',
              url,
              title: file.name.split('.').slice(0, -1).join('.') || '動画',
              createdAt: new Date()
            };
            setAttachments([...attachments, attachment]);
            toast.dismiss('video-toast');
            toast.success(
              <div className="flex items-center space-x-2">
                <HiVideoCamera className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">動画を添付しました</p>
                  <p className="text-xs">{attachment.title || '動画'}{attachment.duration ? ` (${Math.floor(attachment.duration)}秒)` : ''}</p>
                </div>
              </div>,
              { duration: 3000, style: { background: 'white', color: '#333' } }
            );
          });
      } catch (error) {
        // 全体的なエラー処理
        console.error('動画処理中の予期せぬエラー:', error);
        toast.dismiss('video-toast');
        toast.error('動画の処理中にエラーが発生しました');
      }
      
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // 位置情報添付ハンドラー
  const handleLocationAttachment = () => {
    // ファイル選択メニューを自動的に閉じる
    setIsAttachmentMenuOpen(false);
    
    // 位置情報取得中のローディング表示
    toast.loading(
      <div className="flex items-center space-x-2">
        <div className="animate-pulse">
          <HiLocationMarker className="w-5 h-5 text-[#06c755]" />
        </div>
        <span className="font-medium">位置情報を取得中...</span>
      </div>, 
      { id: 'location-toast', duration: 10000, style: { background: 'white', color: '#333' } }
    );
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // 緯度経度から住所情報を取得する
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // 逆ジオコーディングAPIを使用して住所を取得
            // 実験用にローカルデータを返す関数を使用
            const address = await getAddressFromCoordinates(lat, lng);
            
            // 地図の静的画像を生成 (実際の実装では環境変数からAPIキーを取得)
            // 注: 本番環境ではプロセス環境変数を使用することをお勧めします (process.env.GOOGLE_MAPS_API_KEY)
            const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
            const mapPreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red%7C${lat},${lng}&key=${mapApiKey}`;
            
            // スマートフォン用の地図URL
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            
            const locationAttachment: LocationAttachment = {
              id: Math.random().toString(36).substr(2, 9),
              type: 'location',
              latitude: lat,
              longitude: lng,
              name: '現在地',
              address: address,
              url: mapsUrl,
              previewUrl: mapPreviewUrl,
              createdAt: new Date()
            };
            
            setAttachments([...attachments, locationAttachment]);
            toast.dismiss('location-toast');
            toast.success(
              <div className="flex items-center space-x-2">
                <HiLocationMarker className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">位置情報を添付しました</p>
                  <p className="text-xs">{address || '現在地'}</p>
                </div>
              </div>, 
              { duration: 3000, style: { background: 'white', color: '#333' } }
            );
          } catch (error) {
            console.error('位置情報の処理中にエラーが発生しました:', error);
            toast.dismiss('location-toast');
            toast.error(
              <div className="flex items-center space-x-2">
                <div className="text-red-500">
                  <MdWarning className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">位置情報の処理に失敗しました</p>
                  <p className="text-xs">再度お試しください</p>
                </div>
              </div>,
              { duration: 4000, style: { background: 'white', color: '#333' } }
            );
          }
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
          toast.dismiss('location-toast');
          toast.error(
            <div className="flex items-center space-x-2">
              <div className="text-red-500">
                <MdWarning className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">位置情報へのアクセスが拒否されました</p>
                <p className="text-xs">ブラウザの設定から位置情報へのアクセスを許可してください</p>
              </div>
            </div>,
            { duration: 5000, style: { background: 'white', color: '#333' } }
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.dismiss('location-toast');
      toast.error(
        <div className="flex items-center space-x-2">
          <div className="text-red-500">
            <MdWarning className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">ブラウザがサポートしていません</p>
            <p className="text-xs">別のブラウザをお試しください</p>
          </div>
        </div>,
        { duration: 5000, style: { background: 'white', color: '#333' } }
      );
    }
  };
  
  // 座標から住所を取得する関数 (実験用に拡張)
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    // 実際のアプリでは、ここでGoogle Maps Geocoding APIなどを呼び出す
    // デモ用にダミーデータを生成
    
    // 日本の主要都市のリスト
    const cities = [
      '東京都渋谷区',
      '東京都新宿区',
      '東京都品川区',
      '東京都世田谷区',
      '大阪府大阪市',
      '京都府京都市',
      '福岡県福岡市',
      '兵庫県神戸市',
      '北海道札幌市',
    ];
    
    // ランダムな地名を生成
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomNumber = Math.floor(Math.random() * 20) + 1;
    const randomBlock = Math.floor(Math.random() * 10) + 1;
    
    return `${randomCity}${randomNumber}-${randomBlock}-${Math.floor(Math.random() * 10) + 1}`;
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
  
  // 位置情報の詳細表示
  const showLocationDetails = (location: LocationAttachment) => {
    setSelectedLocation(location);
  };
  
  // 位置情報詳細モーダルを閉じる
  const closeLocationDetails = () => {
    setSelectedLocation(null);
  };

  // メッセージ送信
  const handleSendMessage = () => {
    console.log('送信ボタンが押されました');
    console.log('テキスト:', text);
    console.log('添付ファイル:', attachments);
    
    // ディセーブル確認
    if ((!text && attachments.length === 0) || disabled) {
      console.log('送信条件を満たしていません:', {
        text: text.length > 0,
        attachments: attachments.length > 0,
        disabled: disabled
      });
      return;
    }
    
    // テキストからURL検出
    const urlAttachments = detectUrlsInText(text);
    const allAttachments = [...attachments];
    
    // URLが既に添付されていない場合のみ追加
    for (const urlAttachment of urlAttachments) {
      if (!allAttachments.some(a => a.type === 'url' && a.url === urlAttachment.url)) {
        allAttachments.push(urlAttachment);
      }
    }
    
    console.log('全添付ファイル:', allAttachments);
    
    // 男性ユーザーの場合、ポイントをチェック
    if (gender === 'male') {
      // 写真や動画の添付がある場合は追加ポイントが必要
      const mediaAttachmentCount = allAttachments.filter(
        att => att.type === 'image' || att.type === 'video'
      ).length;
      
      const totalRequiredPoints = requiredPoints + (mediaAttachmentCount * 3); // メディアごとに追加3ポイント
      
      if (currentPoints < totalRequiredPoints) {
        toast.error(`ポイントが不足しています。${totalRequiredPoints}ポイント必要です。`);
        return;
      }
      
      // ポイント消費
      if (onPointsUpdated) {
        onPointsUpdated(currentPoints - totalRequiredPoints);
        toast.success(`${totalRequiredPoints}ポイントを消費しました。`);
      }
    } else if (gender === 'female' && onPointsUpdated) {
      // 女性の場合、ポイント獲得
      const earnedPoints = requiredPoints;
      onPointsUpdated(currentPoints + earnedPoints);
      toast.success(`${earnedPoints}ポイントを獲得しました！`, {
        icon: '🎁',
        style: {
          background: '#10B981',
          color: '#FFFFFF'
        }
      });
    }
    
    setSending(true);
    toast.loading('メッセージを送信中...', { id: 'send-message-toast' });
    
    try {
      console.log('送信関数を呼び出します', onSendMessage);
      onSendMessage(text, allAttachments);
      console.log('送信関数の呼び出しが成功しました');
      
      setText('');
      setAttachments([]);
      onTypingEnd?.();
      
      // 送信成功時のアニメーションと通知
      setTimeout(() => {
        toast.dismiss('send-message-toast');
        toast.success('メッセージを送信しました', {
          icon: '👍',
          style: {
            background: '#06c755',
            color: '#FFFFFF'
          },
          duration: 3000
        });
        setSending(false);
        console.log('送信完了');
      }, 800);
      
    } catch (error) {
      console.error('送信関数の呼び出しに失敗しました:', error);
      toast.dismiss('send-message-toast');
      toast.error('メッセージの送信に失敗しました', {
        icon: '⚠️',
        duration: 4000
      });
      setSending(false);
    }
  };

  // 写真・動画添付時の追加ポイント計算
  const calculateAdditionalPointsForMedia = () => {
    if (gender !== 'male') return 0;
    
    const mediaCount = attachments.filter(att => att.type === 'image' || att.type === 'video').length;
    return mediaCount * 3; // メディア添付1つにつき3ポイント
  };

  // 送信に必要な合計ポイント
  const totalPointsRequired = gender === 'male' ? requiredPoints + calculateAdditionalPointsForMedia() : 0;
  
  // ポイント不足かどうか
  const isPointsInsufficient = gender === 'male' && totalPointsRequired > currentPoints;

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      {/* 添付ファイルプレビュー */}
      {attachments.length > 0 && (
        <div className="p-2 pb-0 bg-gray-50 rounded-t-xl border-t border-x border-gray-200">
          {/* 添付ファイル管理ヘッダー */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-semibold text-gray-600">
              添付ファイル ({attachments.length})
            </div>
            <div className="flex gap-1">
              {/* 画像が複数ある場合の一括削除ボタン */}
              {attachments.filter(a => a.type === 'image').length > 1 && (
                <button
                  onClick={() => setAttachments(attachments.filter(a => a.type !== 'image'))}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  画像を削除
                </button>
              )}
              {/* すべて削除ボタン */}
              {attachments.length > 1 && (
                <button
                  onClick={() => setAttachments([])}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  すべて削除
                </button>
              )}
            </div>
          </div>
          
          {/* 添付ファイルリスト */}
          <div className="flex flex-wrap gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
          
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group transition-transform duration-200 hover:scale-105">
              {/* 添付ファイルタイプバッジ */}
              <div className="absolute -top-1 -left-1 z-10 bg-white rounded-full shadow-sm p-0.5 border border-gray-200">
                {attachment.type === 'image' && <HiPhotograph className="w-3 h-3 text-green-500" />}
                {attachment.type === 'video' && <HiVideoCamera className="w-3 h-3 text-red-500" />}
                {attachment.type === 'location' && <HiLocationMarker className="w-3 h-3 text-blue-500" />}
              </div>
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
                <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-300 bg-black relative group transition-all duration-200 hover:shadow-md hover:border-[#06c755]">
                  {/* サムネイルがあれば表示 */}
                  {attachment.thumbnailUrl ? (
                    <div className="w-full h-full relative">
                      <Image 
                        src={attachment.thumbnailUrl} 
                        alt="動画サムネイル" 
                        width={80} 
                        height={80} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                      <HiVideoCamera className="text-white w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                  )}
                  {/* 動画再生アイコン */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="w-8 h-8 bg-[#06c755] bg-opacity-90 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-opacity-100 transition-all duration-200">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white ml-0.5"></div>
                    </div>
                  </div>
                  {/* 動画タイトルツールチップ */}
                  {attachment.title && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap max-w-[150px] truncate pointer-events-none z-10">
                      {attachment.title}
                    </div>
                  )}
                  {/* 動画の長さ表示 */}
                  {attachment.duration && (
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 font-medium rounded-tl-sm">
                      {formatDuration(attachment.duration)}
                    </div>
                  )}
                </div>
              )}
              
              {attachment.type === 'location' && (
                <div 
                  className="w-20 h-20 rounded-md overflow-hidden border border-gray-300 relative cursor-pointer"
                  onClick={() => showLocationDetails(attachment as LocationAttachment)}
                >
                  {/* 地図プレビュー画像 */}
                  {attachment.previewUrl ? (
                    <Image 
                      src={attachment.previewUrl} 
                      alt="地図" 
                      width={80} 
                      height={80} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <HiLocationMarker className="text-primary-500 w-8 h-8" />
                    </div>
                  )}
                  {/* 地図ピンアイコン */}
                  <div className="absolute top-1 left-1 bg-white rounded-full p-1 shadow-md">
                    <HiLocationMarker className="text-red-500 w-4 h-4" />
                  </div>
                  {/* 位置情報ラベル */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#06c755] bg-opacity-90 text-white text-xs px-1 py-0.5 truncate text-center">
                    現在地
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200">
                    <span className="text-transparent hover:text-white text-xs font-medium transition-colors duration-200">詳細を表示</span>
                  </div>
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
        </div>
      )}
      
      <div className="flex items-end flex-wrap gap-2">
        <div className="relative">
          <button
            className="text-gray-500 hover:text-[#06c755] p-1.5 transition-colors rounded-full hover:bg-gray-100"
            onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
            aria-label="添付ファイルの追加"
            title="添付ファイルの追加"
          >
            <HiPaperClip className="w-5 h-5" />
          </button>
          
          {/* 添付メニュー */}
          <AnimatePresence>
            {isAttachmentMenuOpen && (
              <>
                {/* オーバーレイ（クリックで閉じるため） */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-10"
                  onClick={() => setIsAttachmentMenuOpen(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  className="absolute bottom-14 left-0 bg-white rounded-2xl shadow-2xl p-3 w-56 z-20 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2 px-1">
                    <div className="text-sm font-semibold text-gray-700">添付ファイル</div>
                    <button 
                      onClick={() => setIsAttachmentMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-px bg-gray-100 w-full mb-2"></div>
                
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
                  className={`flex items-center w-full p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-left text-sm mb-2 transition-colors duration-150 ${attachments.filter(a => a.type === 'image').length >= 5 ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachments.filter(a => a.type === 'image').length >= 5}
                >
                  <div className="w-10 h-10 mr-3 rounded-full bg-[#06c755] bg-opacity-10 flex items-center justify-center shadow-sm">
                    <HiPhotograph className="w-6 h-6 text-[#06c755]" />
                  </div>
                  <div>
                    <div className="font-semibold">画像</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {attachments.filter(a => a.type === 'image').length >= 5 ? 
                        '最大数に達しました' : 
                        `${attachments.filter(a => a.type === 'image').length}/5枚選択可能`}
                    </div>
                  </div>
                </button>
                
                <button
                  className="flex items-center w-full p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-left text-sm mb-2 transition-colors duration-150"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <div className="w-10 h-10 mr-3 rounded-full bg-red-500 bg-opacity-10 flex items-center justify-center shadow-sm">
                    <HiVideoCamera className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <div className="font-semibold">動画</div>
                    <div className="text-xs text-gray-500 mt-0.5">ビデオを添付</div>
                  </div>
                </button>
                
                <button
                  className="flex items-center w-full p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-left text-sm transition-colors duration-150"
                  onClick={handleLocationAttachment}
                >
                  <div className="w-10 h-10 mr-3 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center shadow-sm">
                    <HiLocationMarker className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-semibold">位置情報</div>
                    <div className="text-xs text-gray-500 mt-0.5">現在地を共有</div>
                  </div>
                </button>
              </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 min-w-0 bg-white rounded-2xl flex items-end border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200" style={{ WebkitAppearance: 'none' }}>
          <textarea
            className="flex-1 min-w-0 bg-transparent border-none resize-none px-2 sm:px-3 py-2 outline-none text-sm max-h-32 overflow-auto"
            placeholder={placeholder}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{
              minHeight: '42px',
              WebkitAppearance: 'none',
              WebkitBorderRadius: '0px',
              caretColor: '#06c755',
              WebkitUserSelect: 'text',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              boxShadow: 'none'
            }}
          />
          
          <button
            className="mr-1 text-gray-400 hover:text-[#06c755] p-1.5 transition-colors rounded-full hover:bg-gray-100 active:bg-gray-200"
            onClick={() => setIsEmoticonPickerOpen(!isEmoticonPickerOpen)}
            aria-label="絵文字の選択"
            title="絵文字の選択"
          >
            <HiEmojiHappy className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <button
          className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full ${(!text && attachments.length === 0) || disabled || sending || isPointsInsufficient
              ? 'bg-gray-100 text-gray-400'
              : 'bg-[#06c755] text-white hover:bg-[#05b64b] active:bg-[#05a044] shadow-md hover:shadow-lg'
          } transition-all duration-200 transform hover:scale-105 ${sending ? 'animate-pulse' : ''}`}
          disabled={(!text && attachments.length === 0) || disabled || sending || isPointsInsufficient}
          onClick={handleSendMessage}
          aria-label="メッセージを送信"
          title={isPointsInsufficient ? `ポイントが不足しています (${currentPoints}/${totalPointsRequired})` : 'メッセージを送信'}
        >
          <div className="flex items-center justify-center">
            <RiSendPlaneFill className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>
      </div>
      
      {/* 絵文字ピッカー */}
      {isEmoticonPickerOpen && (
        <div className="absolute bottom-16 right-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.25 }}
            className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-100 p-3 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">絵文字</h3>
              <button 
                onClick={() => setIsEmoticonPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-2 grid grid-cols-8 gap-1 max-h-60 overflow-y-auto" style={{ width: '300px' }}>
              {/* サンプル絵文字 - 実際の実装では動的に生成 */}
              {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', 
                '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', 
                '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', 
                '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥'].map((emoji, index) => (
                <button 
                  key={index} 
                  className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => {
                    setText(prev => prev + emoji);
                    setIsEmoticonPickerOpen(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-100 p-2 flex justify-between bg-gray-50">
              <div className="flex space-x-1">
                <button className="px-2 py-1 text-xs bg-white hover:bg-gray-100 rounded-md border border-gray-200 text-gray-600 transition-colors">
                  よく使う
                </button>
                <button className="px-2 py-1 text-xs bg-white hover:bg-gray-100 rounded-md border border-gray-200 text-gray-600 transition-colors">
                  絵文字
                </button>
              </div>
              <button className="px-2 py-1 text-xs bg-[#06c755] text-white rounded-md hover:bg-[#05b64b] transition-colors">
                スタンプ
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* 位置情報詳細モーダル - LINE風 */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
          >
            {/* モーダルヘッダー - LINE風デザイン */}
            <div className="bg-[#06c755] text-white py-3 px-5 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-1.5 bg-white bg-opacity-20 rounded-full mr-3">
                  <HiLocationMarker className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">位置情報</h3>
              </div>
              <button 
                className="text-white hover:bg-white hover:text-[#06c755] rounded-full p-1.5 transition-colors duration-200"
                onClick={closeLocationDetails}
                aria-label="閉じる"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            
            {/* 地図プレビュー - 強調されたデザイン */}
            <div className="relative h-64 sm:h-72 bg-gray-200 overflow-hidden">
              {selectedLocation.previewUrl ? (
                <Image 
                  src={selectedLocation.previewUrl} 
                  alt="位置情報"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="flex flex-col items-center">
                    <HiLocationMarker className="text-[#06c755] w-16 h-16 mb-2" />
                    <p className="text-gray-500 text-sm">地図を読み込み中...</p>
                  </div>
                </div>
              )}
              
              {/* ピンアニメーション - より手の込んだアニメーション */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-8 h-8 bg-[#06c755] rounded-full border-2 border-white shadow-lg flex items-center justify-center z-20 relative">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="w-16 h-16 rounded-full absolute -top-4 -left-4 z-10">
                  <div className="w-full h-full bg-[#06c755] opacity-20 rounded-full animate-ping-slow"></div>
                </div>
                <div className="w-3 h-10 absolute bg-[#06c755] rounded-full -bottom-10 left-1/2 transform -translate-x-1/2 shadow-md z-0"></div>
              </div>
            </div>
            
            <div className="p-5">
              {/* 住所情報 - LINEのカード風 */}
              <div className="flex items-start mb-4">
                <div className="bg-[#06c755] bg-opacity-10 p-1.5 rounded-full mr-3 mt-0.5">
                  <HiLocationMarker className="w-5 h-5 text-[#06c755]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">現在地</h3>
                  <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                    {selectedLocation.address || '住所情報を取得できませんでした'}
                  </p>
                </div>
              </div>
              
              {/* ナビゲーションボタン - LINE風 */}
              <div className="flex space-x-3 mb-5">
                {selectedLocation.url && (
                  <a 
                    href={selectedLocation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#06c755] hover:bg-[#05b64b] text-white font-bold py-3 px-4 rounded-xl text-center transition-all duration-200 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <HiLocationMarker className="w-5 h-5" />
                    <span>Google Mapで見る</span>
                  </a>
                )}
                
                <button
                  onClick={() => {
                    // シェア機能は実装予定
                    toast.success(
                      <div className="flex items-center space-x-2">
                        <HiLocationMarker className="w-5 h-5 text-green-500" />
                        <span>位置情報をコピーしました</span>
                      </div>,
                      { duration: 3000, style: { background: 'white', color: '#333' } }
                    );
                  }}
                  className="bg-white border border-[#06c755] text-[#06c755] hover:bg-[#06c755] hover:text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>シェア</span>
                </button>
              </div>
              
              {/* 位置情報詳細 - LINE風カードデザイン */}
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="font-semibold mb-1 text-gray-500">緯度</p>
                    <p className="font-mono text-gray-800 select-all">{selectedLocation.latitude?.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-gray-500">経度</p>
                    <p className="font-mono text-gray-800 select-all">{selectedLocation.longitude?.toFixed(6)}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-gray-500">共有日時</p>
                  <p className="text-gray-800">{selectedLocation.createdAt ? new Date(selectedLocation.createdAt).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'medium' }) : '不明'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
