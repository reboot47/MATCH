"use client";

import React, { 
  useState, 
  useRef, 
  useEffect, 
  useCallback, 
  ChangeEvent, 
  KeyboardEvent, 
  forwardRef, 
  ForwardedRef
} from 'react';
import type { ReactElement, MouseEvent as ReactMouseEvent } from 'react';
import { 
  HiPaperClip, 
  HiPhotograph, 
  HiLocationMarker, 
  HiVideoCamera, 
  HiEmojiHappy 
} from 'react-icons/hi';
import { RiSendPlaneFill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import { FaGift } from 'react-icons/fa';
import { MdWarning } from 'react-icons/md';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import GiftSelector from '@/components/chat/GiftSelector';
import GiftAnimator from './GiftAnimator';
import toast from 'react-hot-toast';
import { 
  Message, 
  AttachmentUnion, 
  ImageAttachment, 
  VideoAttachment, 
  LocationAttachment, 
  GiftAttachment, 
  MessageStatus 
} from '@/app/types/chat';
import { Gift } from '@/types/gift';
import { validateGiftImageUrl, isValidImageUrl } from '@/app/utils/imageHelpers';
import { SafeImage } from '@/app/components/common/SafeImage';
import GiftImage from '@/app/components/common/GiftImage';

// メッセージの添付ファイル種類を表す型
const AttachmentType = {
  IMAGE: 'image' as const,
  VIDEO: 'video' as const,
  LOCATION: 'location' as const,
  GIFT: 'gift' as const
};

// ファイルアップロード結果の型定義
interface FileUploadResult {
  url: string;
  thumbnailUrl?: string;
}

// ファイルタイプ
type FileType = 'image' | 'video';

// 位置情報の型定義
interface Location {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

// 絵文字カテゴリーの型定義
interface EmojiCategory {
  id: string;
  name: string;
  emojis: string[];
}

// MessageInputコンポーネントのprops型定義
interface MessageInputProps {
  onSendMessage: (message: Message) => Promise<void>;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  disabled?: boolean;
  placeholder?: string;
  gender: 'male' | 'female';
  currentPoints: number;
  requiredPoints?: number;
  onPointsUpdated?: (points: number) => void;
  chatId: string;
}

// サンプル絵文字カテゴリーデータ
const emojiCategories: EmojiCategory[] = [
  {
    id: 'recent',
    name: '最近',
    emojis: ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💯', '🙏', '😊', '🥰', '😎', '🤔']
  },
  {
    id: 'smileys',
    name: '笑顔',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊']
  },
  {
    id: 'love',
    name: '愛情',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💕', '💞', '💓', '💗', '💖']
  }
];

// MessageInputコンポーネント
const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>((
  {
    onSendMessage,
    onTypingStart,
    onTypingEnd,
    disabled = false,
    placeholder = 'メッセージを入力',
    gender,
    currentPoints,
    requiredPoints = 1,
    onPointsUpdated,
    chatId
  }: MessageInputProps,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement => {
  
  // ステート管理
  const [text, setText] = useState<string>('');
  const [attachments, setAttachments] = useState<AttachmentUnion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [giftAttachment, setGiftAttachment] = useState<GiftAttachment | null>(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState<boolean>(false);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [localPoints, setLocalPoints] = useState<number>(currentPoints);
  const [showGiftSelector, setShowGiftSelector] = useState<boolean>(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showGiftAnimation, setShowGiftAnimation] = useState<boolean>(false);
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<string>('recent');
  
  // 参照
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const emojiMenuRef = useRef<HTMLDivElement>(null);

  // ローカルポイントをpropsと同期
  useEffect(() => {
    setLocalPoints(currentPoints);
  }, [currentPoints]);

  // disabledが変更されたときに添付メニューの状態をリセット
  useEffect(() => {
    if (disabled) {
      setIsAttachmentMenuOpen(false);
      setIsEmojiMenuOpen(false);
    }
  }, [disabled]);

  // テキストが変更されたときにタイピング状態を通知
  const handleTextChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>): void => {
    const newText = e.target.value;
    setText(newText);

    // タイピング開始イベントを発火
    if (onTypingStart) {
      onTypingStart();
    }

    // タイピング終了タイマーをリセット
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 3秒後にタイピング終了イベントを発火
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingEnd) {
        onTypingEnd();
      }
    }, 3000);
  }, [onTypingStart, onTypingEnd]);

  // ポイント検証関数 - useCallbackで最適化
  const validatePoints = useCallback((points: number = requiredPoints): boolean => {
    // 男性ユーザーの場合のみポイントチェックを行う
    if (gender === 'male') {
      if (localPoints < points) {
        toast.error(`ポイントが不足しています（必要ポイント: ${points}）`);
        return false;
      }
    }
    return true;
  }, [gender, localPoints, requiredPoints]);

  // ギフト検証関数
  const validateGift = useCallback((gift: Gift): boolean => {
    if (gender === 'male' && gift.price) {
      // 男性ユーザーの場合、ギフト用のポイントチェック
      if (localPoints < gift.price) {
        toast.error(`ポイントが不足しています（必要ポイント: ${gift.price}）`);
        return false;
      }
    }
    return true;
  }, [gender, localPoints]);

  // ファイルからサムネイルを生成する関数
  const createVideoThumbnail = useCallback((videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 一時的なURLを作成
      const videoUrl = URL.createObjectURL(videoFile);
      const video = document.createElement('video');
      video.autoplay = false;
      video.muted = true;
      video.src = videoUrl;
      video.onloadeddata = () => {
        // ビデオが読み込まれたらサムネイル作成
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        
        // キャンバスにビデオのフレームを描画
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          
          // リソースを解放
          URL.revokeObjectURL(videoUrl);
          resolve(thumbnailUrl);
        } else {
          URL.revokeObjectURL(videoUrl);
          reject(new Error('キャンバスコンテキストの取得に失敗しました'));
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('ビデオの読み込みに失敗しました'));
      };
      
      // 1秒後にフレームをキャプチャ
      video.currentTime = 1.0;
    });
  }, []);

  // ファイルアップロード関数
  const uploadFile = useCallback(async (file: File, type: FileType): Promise<FileUploadResult> => {
    // 実際にアップロードされたファイルを使用するように修正
    try {
      // FileReaderを使用してファイルをデータ URLとして読み込む
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!event.target || typeof event.target.result !== 'string') {
            reject(new Error('ファイルの読み込みに失敗しました'));
            return;
          }
          resolve(event.target.result);
        };
        reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
        reader.readAsDataURL(file);
      });

      // 動画の場合はサムネイルを生成
      let thumbnailUrl: string | undefined;
      if (type === 'video') {
        try {
          thumbnailUrl = await createVideoThumbnail(file);
          console.log(`[ファイルアップロード] 動画サムネイル生成成功`);
        } catch (error) {
          console.error('[サムネイル生成失敗]', error);
          // サムネイル生成失敗時はデフォルトのサムネイルを使用
          thumbnailUrl = 'https://picsum.photos/id/335/400/300';
        }
      }

      console.log(`[ファイルアップロード] ファイルを読み込みました: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      
      return {
        url: dataUrl,
        thumbnailUrl
      };
    } catch (error) {
      console.error('[ファイル読み込みエラー]', file.name, error);
      
      // エラー時はフォールバック画像を返す
      const fallbackUrl = type === 'image' 
        ? 'https://picsum.photos/id/1/400/300' 
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      return {
        url: fallbackUrl,
        thumbnailUrl: type === 'video' ? 'https://picsum.photos/id/335/400/300' : undefined
      };
    }
  }, [createVideoThumbnail]);

  // 動画の再生時間をフォーマットする関数
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  // 添付ファイルメニューの表示切替
  const toggleAttachmentMenu = useCallback((): void => {
    setIsAttachmentMenuOpen(prev => !prev);
    if (isEmojiMenuOpen) {
      setIsEmojiMenuOpen(false);
    }
  }, [isEmojiMenuOpen]);

  // 絵文字メニューの表示切替
  const toggleEmojiMenu = useCallback((): void => {
    setIsEmojiMenuOpen(prev => !prev);
    if (isAttachmentMenuOpen) {
      setIsAttachmentMenuOpen(false);
    }
  }, [isAttachmentMenuOpen]);

  // 画像添付の処理
  const handleImageAttachment = useCallback(async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // ポイントチェック
    if (!validatePoints()) return;

    try {
      const file = e.target.files[0];
      const { url } = await uploadFile(file, 'image');
      
      // URLが無効な場合のログ
      if (!url || typeof url !== 'string' || url.trim() === '') {
        console.warn('[画像添付] 無効なURL:', url);
        toast.error('画像のアップロードに失敗しました');
        return;
      }
      
      // 画像タイプの添付ファイルを作成
      const imageAttachment = {
        type: 'image' as const,
        id: `img_${Date.now()}`,
        url: url.trim(), // URLを正規化
        width: 0,  // 実際の実装では画像サイズを取得する
        height: 0,
        createdAt: new Date()
      } as ImageAttachment;
      
      console.log('[画像添付] 画像URL:', url);
      
      setAttachments(prev => [...prev, imageAttachment]);
      setIsAttachmentMenuOpen(false);
      
      // 入力フィールドをクリア
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('画像のアップロードに失敗しました');
    }
  }, [validatePoints, uploadFile]);

  // 動画添付の処理
  const handleVideoAttachment = useCallback(async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // ポイントチェック
    if (!validatePoints()) return;

    try {
      const file = e.target.files[0];
      console.log(`[動画添付] 処理開始: ${file.name}, サイズ: ${Math.round(file.size / 1024)} KB`);
      
      // ローディング表示
      toast.loading('動画を処理中です...', { duration: 2000 });
      
      const { url, thumbnailUrl } = await uploadFile(file, 'video');
      
      // URLが無効な場合の処理
      if (!url || typeof url !== 'string' || url.trim() === '') {
        console.warn('[動画添付] 無効なURL:', url);
        toast.error('動画のアップロードに失敗しました');
        return;
      }
      
      console.log(`[動画添付] URL生成成功`, { url, hasThumbnail: !!thumbnailUrl });
      
      // 動画の長さを取得するヘルパー関数
      const getDuration = async (videoUrl: string): Promise<number> => {
        return new Promise((resolve) => {
          const video = document.createElement('video');
          video.onloadedmetadata = () => {
            resolve(video.duration);
          };
          video.onerror = () => {
            resolve(0); // エラー時は0を返す
          };
          video.src = videoUrl;
        });
      };
      
      // 動画の長さを取得
      const duration = await getDuration(url);
      console.log(`[動画添付] 動画長さ: ${formatDuration(duration)} (${duration}秒)`);
      
      // 動画タイプの添付ファイルを作成
      const videoAttachment = {
        type: 'video' as const,
        id: `vid_${Date.now()}`,
        url: url.trim(),  // URLを正規化
        thumbnailUrl: thumbnailUrl && typeof thumbnailUrl === 'string' ? thumbnailUrl.trim() : '',
        duration: duration, 
        createdAt: new Date()
      } as VideoAttachment;
      
      console.log('[動画添付] 動画データ:', { 
        url: videoAttachment.url, 
        thumbnail: videoAttachment.thumbnailUrl,
        duration: videoAttachment.duration
      });
      
      setAttachments(prev => [...prev, videoAttachment]);
      setIsAttachmentMenuOpen(false);
      
      // 入力フィールドをクリア
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
      
      toast.success('動画を添付しました');
    } catch (error) {
      console.error('Video upload failed:', error);
      toast.error('動画のアップロードに失敗しました');
    }
  }, [validatePoints, uploadFile, formatDuration]);

  // 位置情報添付の処理
  const handleLocationAttachment = useCallback((): void => {
    // ポイントチェック
    if (!validatePoints()) return;

    // ローディング表示
    toast.loading('位置情報を取得中...', { duration: 1500 });

    // 実際の実装では位置情報取得APIを利用する
    // デモ用のダミー位置情報 - 有名な場所を使用
    const locations = [
      {
        name: '東京スカイツリー',
        latitude: 35.7100,
        longitude: 139.8107,
        address: '東京都墨田区押上1-1-2'
      },
      {
        name: '渋谷スクランブル交差点',
        latitude: 35.6594,
        longitude: 139.7005,
        address: '東京都渋谷区道玄坪2-2-1'
      },
      {
        name: '大阪城',
        latitude: 34.6873,
        longitude: 135.5262,
        address: '大阪府大阪市中央区大阪城1-1'
      }
    ];

    try {
      // ランダムな場所を選択
      const randomIndex = Math.floor(Math.random() * locations.length);
      const dummyLocation: Location = locations[randomIndex];

      console.log(`[位置情報] 選択された場所: ${dummyLocation.name}`, { 
        lat: dummyLocation.latitude, 
        lng: dummyLocation.longitude 
      });
      setSelectedLocation(dummyLocation);

      // Google Mapsの静的地図URLが正しく生成されるか確認
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${dummyLocation.latitude},${dummyLocation.longitude}&zoom=14&size=400x240&markers=color:red%7C${dummyLocation.latitude},${dummyLocation.longitude}&key=AIzaSyBVZdKBMyVZVXYKLHO-gYkrVG-P8gvIzIM`;
      console.log(`[位置情報] 地図URL: ${mapUrl}`);

      // 位置情報タイプの添付ファイルを作成
      const locationAttachment = {
        type: 'location' as const,
        id: `loc_${Date.now()}`,
        name: dummyLocation.name,
        latitude: dummyLocation.latitude,
        longitude: dummyLocation.longitude,
        address: dummyLocation.address,
        createdAt: new Date()
      } as LocationAttachment;

      setAttachments(prev => [...prev, locationAttachment]);
      setIsAttachmentMenuOpen(false);
      
      toast.success('位置情報を添付しました');
    } catch (error) {
      console.error('[位置情報] エラー:', error);
      toast.error('位置情報の取得に失敗しました');
    }
  }, [validatePoints]);

  // 絵文字をテキストに挿入
  const insertEmoji = useCallback((emoji: string): void => {
    setText(prev => prev + emoji);
  }, []);

  // 添付ファイルを削除
  const removeAttachment = useCallback((index: number): void => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // キーボードイベント処理（Enterキーで送信）
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>): void => {
    // Enterキーを押し、Shiftキーを押していない場合にメッセージを送信
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, []);

  // ギフト選択時の処理
  const handleGiftSelection = useCallback((gift: Gift): void => {
    if (!validateGift(gift)) return;

    setSelectedGift(gift);
    setShowGiftSelector(false);

    // ギフト添付を作成
    const giftAttachment = {
      type: 'gift' as const,
      id: `gift_${Date.now()}`,
      giftId: gift.id,
      giftName: gift.name,
      giftImageUrl: gift.imageUrl,
      price: gift.price,
      message: '',
      animation: gift.animation || undefined,
      createdAt: new Date()
    } as GiftAttachment;

    setGiftAttachment(giftAttachment);
    setAttachments(prev => [...prev, giftAttachment]);

    // ギフトアニメーションがあれば表示
    if (gift.animation) {
      setCurrentAnimation(gift.animation);
      setShowGiftAnimation(true);

      // 5秒後にアニメーションを非表示
      setTimeout(() => {
        setShowGiftAnimation(false);
      }, 5000);
    }
  }, [validateGift]);

  // ギフト選択画面の表示切替
  const toggleGiftSelector = useCallback((): void => {
    // ポイントチェック
    if (!validatePoints()) return;
    
    setShowGiftSelector(prev => !prev);
    setIsAttachmentMenuOpen(false);
  }, [validatePoints]);

  // メッセージ送信処理
  const handleSendMessage = useCallback(async (): Promise<void> => {
    // 空メッセージで添付ファイルもない場合は送信しない
    if (text.trim() === '' && attachments.length === 0) return;
    
    // 送信中に二重送信されるのを防止
    if (sendingRef.current || isSending) return;
    sendingRef.current = true;
    setIsSending(true);

    // 男性ユーザーの場合はポイントチェック
    if (gender === 'male') {
      // ギフトの場合はギフトの価格、それ以外は標準ポイント
      const pointsToUse = giftAttachment ? giftAttachment.price || requiredPoints : requiredPoints;
      
      if (localPoints < pointsToUse) {
        toast.error(`ポイントが不足しています（必要ポイント: ${pointsToUse}）`);
        sendingRef.current = false;
        setIsSending(false);
        return;
      }

      // ポイントを引く
      const newPoints = localPoints - pointsToUse;
      setLocalPoints(newPoints);
      if (onPointsUpdated) {
        onPointsUpdated(newPoints);
      }
    }

    try {
      // メッセージオブジェクトを作成
      const message = {
        id: `msg_${Date.now()}`,
        conversationId: chatId,
        content: text.trim(),
        senderId: 'current_user', // 実際の実装ではユーザーIDを設定
        status: 'sending' as MessageStatus, // MessageStatusはenum型ではなく文字列型
        attachments: attachments.length > 0 ? attachments as AttachmentUnion[] : [],
        reactions: [],
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Message;

      // タイピング終了イベントを発火
      if (onTypingEnd) {
        onTypingEnd();
      }

      // メッセージ送信
      await onSendMessage(message);

      // 入力フィールドと添付ファイルをリセット
      setText('');
      setAttachments([]);
      setGiftAttachment(null);
      setSelectedLocation(null);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('メッセージの送信に失敗しました');
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  }, [text, attachments, isSending, gender, localPoints, requiredPoints, giftAttachment, chatId, onTypingEnd, onSendMessage, onPointsUpdated]);

  // メインメニュークリック時にメニューを閉じる処理
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 添付ファイルメニューが開いていて、クリックがメニュー外の場合
      if (
        isAttachmentMenuOpen &&
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(e.target as Node)
      ) {
        setIsAttachmentMenuOpen(false);
      }

      // 絵文字メニューが開いていて、クリックがメニュー外の場合
      if (
        isEmojiMenuOpen &&
        emojiMenuRef.current &&
        !emojiMenuRef.current.contains(e.target as Node)
      ) {
        setIsEmojiMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttachmentMenuOpen, isEmojiMenuOpen]);

  // ファイル入力をトリガーする処理
  const triggerFileInput = useCallback((): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // 動画入力をトリガーする処理
  const triggerVideoInput = useCallback((): void => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  }, []);

  // 添付ファイルのレンダリング
  const renderAttachments = (): ReactElement | null => {
    if (attachments.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2 mb-1">
        {attachments.map((attachment, index) => {
          // 添付ファイルのタイプに応じたレンダリング
          switch (attachment.type) {
            case AttachmentType.IMAGE:
              return (
                <div key={index} className="relative rounded-lg overflow-hidden w-20 h-20">
                  <SafeImage
                    src={(attachment as ImageAttachment).url}
                    alt="Image attachment"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                  <button
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1"
                    onClick={() => removeAttachment(index)}
                  >
                    <IoClose className="text-white" size={14} />
                  </button>
                </div>
              );

            case AttachmentType.VIDEO:
              return (
                <div key={index} className="relative rounded-lg overflow-hidden w-20 h-20">
                  <SafeImage
                    src={(attachment as VideoAttachment).thumbnailUrl || ''}
                    alt="Video thumbnail"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-1 right-1 bg-gray-800 bg-opacity-70 text-white text-xs px-1 rounded">
                    {formatDuration((attachment as VideoAttachment).duration || 0)}
                  </div>
                  <button
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1"
                    onClick={() => removeAttachment(index)}
                  >
                    <IoClose className="text-white" size={14} />
                  </button>
                </div>
              );

            case AttachmentType.LOCATION:
              return (
                <div key={index} className="relative rounded-lg bg-gray-100 dark:bg-gray-700 p-2 flex items-center max-w-xs">
                  <HiLocationMarker className="text-red-500 mr-2" size={20} />
                  <div className="flex-1 text-sm truncate">
                    <div className="font-medium truncate">{(attachment as LocationAttachment).name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {(attachment as LocationAttachment).address}
                    </div>
                  </div>
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => removeAttachment(index)}
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              );

            case AttachmentType.GIFT:
              return (
                <div key={index} className="relative rounded-lg bg-gray-100 dark:bg-gray-700 p-2 flex items-center max-w-xs">
                  <GiftImage
                    src={(attachment as GiftAttachment).giftImageUrl}
                    alt="Gift"
                    width={40}
                    height={40}
                    className="mr-2 object-contain"
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{(attachment as GiftAttachment).giftName}</div>
                    {(attachment as GiftAttachment).price && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {(attachment as GiftAttachment).price} ポイント
                      </div>
                    )}
                  </div>
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => removeAttachment(index)}
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  // 絵文字カテゴリーのレンダリング
  const renderEmojiCategories = (): ReactElement => {
    return (
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-2">
        {emojiCategories.map(category => (
          <button
            key={category.id}
            className={`px-3 py-2 text-sm ${activeEmojiCategory === category.id ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveEmojiCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  };

  // 絵文字メニューのレンダリング
  const renderEmojiMenu = (): ReactElement | null => {
    if (!isEmojiMenuOpen) return null;

    // 現在選択されているカテゴリーの絵文字を取得
    const currentCategory = emojiCategories.find(cat => cat.id === activeEmojiCategory);
    const emojis = currentCategory ? currentCategory.emojis : [];

    return (
      <div
        ref={emojiMenuRef}
        className="absolute bottom-full mb-2 left-0 right-0 md:right-auto md:w-64 lg:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
      >
        {renderEmojiCategories()}
        <div className="grid grid-cols-6 gap-1 p-2 max-h-48 overflow-y-auto">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => insertEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 添付ファイルメニューのレンダリング
  const renderAttachmentMenu = (): ReactElement | null => {
    if (!isAttachmentMenuOpen) return null;

    return (
      <div
        ref={attachmentMenuRef}
        className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
      >
        <div className="p-2 grid grid-cols-2 gap-1">
          <button
            className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={triggerFileInput}
            disabled={disabled}
          >
            <HiPhotograph className="text-blue-500 mb-1" size={24} />
            <span className="text-xs text-gray-600 dark:text-gray-300">写真</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={triggerVideoInput}
            disabled={disabled}
          >
            <HiVideoCamera className="text-red-500 mb-1" size={24} />
            <span className="text-xs text-gray-600 dark:text-gray-300">動画</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={handleLocationAttachment}
            disabled={disabled}
          >
            <HiLocationMarker className="text-green-500 mb-1" size={24} />
            <span className="text-xs text-gray-600 dark:text-gray-300">位置情報</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={toggleGiftSelector}
            disabled={disabled}
          >
            <FaGift className="text-purple-500 mb-1" size={24} />
            <span className="text-xs text-gray-600 dark:text-gray-300">ギフト</span>
          </button>
        </div>
      </div>
    );
  };

  // ポイント表示レンダリング
  const renderPointsInfo = (): ReactElement | null => {
    if (gender !== 'male') return null;

    return (
      <div className="absolute -top-12 right-3 text-sm bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2 z-10">
        <span className="font-medium">ポイント: </span>
        <span className="font-bold text-blue-300">{localPoints}</span>
        {requiredPoints && (
          <span className="ml-1 text-gray-300 dark:text-gray-200 flex items-center">
            <span className="mx-1">(送信に必要:</span>
            <span className="font-bold text-green-300">{requiredPoints}</span>
            <span>)</span>
          </span>
        )}
      </div>
    );
  };

  // ギフトアニメーションのレンダリング
  const renderGiftAnimation = (): ReactElement | null => {
    if (!showGiftAnimation || !currentAnimation) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <GiftAnimator 
          animationType={currentAnimation} 
          onAnimationComplete={() => setShowGiftAnimation(false)} 
          // NOTE: GiftAnimatorの実際の実装に合わせてpropsを調整する必要があります
        />
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* 全画面ギフトアニメーション */}
      <AnimatePresence>
        {renderGiftAnimation()}
      </AnimatePresence>

      {/* 男性ユーザーの場合のポイント表示 */}
      {renderPointsInfo()}

      {/* ギフト選択モーダル */}
      <AnimatePresence>
        {showGiftSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <GiftSelector
              onSelect={handleGiftSelection}
              onClose={() => setShowGiftSelector(false)}
              isOpen={showGiftSelector}
              context={{ type: 'chat' }}
              // NOTE: GiftSelectorの実際の実装に合わせてpropsを調整する必要があります
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-200 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-400">
        {/* 添付ファイルメニュー */}
        {renderAttachmentMenu()}
        
        {/* 絵文字メニュー */}
        {renderEmojiMenu()}

        {/* 添付ファイル表示エリア */}
        {renderAttachments()}

        {/* 非表示のファイル入力フィールド */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageAttachment}
          disabled={disabled}
        />
        <input
          type="file"
          ref={videoInputRef}
          accept="video/*"
          className="hidden"
          onChange={handleVideoAttachment}
          disabled={disabled}
        />

        <div className="flex items-center">
          {/* 添付ファイルボタン */}
          <button
            className="p-2 mr-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
            onClick={toggleAttachmentMenu}
            disabled={disabled || isSending}
          >
            <HiPaperClip size={20} />
          </button>

          {/* メッセージ入力フィールド */}
          <div className="flex-1 relative">
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full resize-none outline-none bg-white py-2 px-3 max-h-32 text-gray-800 dark:text-gray-800 rounded"
              style={{ minHeight: '40px' }}
              rows={1}
              disabled={disabled || isSending}
            />
          </div>

          {/* 絵文字ボタン */}
          <button
            className="p-2 mx-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
            onClick={toggleEmojiMenu}
            disabled={disabled || isSending}
          >
            <HiEmojiHappy size={20} />
          </button>

          {/* 送信ボタン */}
          <button
            className={`p-2 rounded-full disabled:opacity-50 ${isSending ? 'animate-pulse' : ''} ${(text.trim() === '' && attachments.length === 0) ? 'text-gray-400 dark:text-gray-500' : 'text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300'}`}
            onClick={handleSendMessage}
            disabled={disabled || isSending || (text.trim() === '' && attachments.length === 0)}
          >
            <RiSendPlaneFill size={20} />
          </button>
        </div>

        {/* 男性ユーザーがポイント不足の場合の警告 */}
        {gender === 'male' && localPoints < requiredPoints && (
          <div className="mt-2 text-xs text-red-500 flex items-center">
            <MdWarning className="mr-1" />
            ポイントが不足しています。メッセージを送信するには最低{requiredPoints}ポイント必要です。
          </div>
        )}
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
