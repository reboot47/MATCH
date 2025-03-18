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
import type { ReactElement } from 'react';
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
import { SafeImage, GiftImage } from '@/app/components/common/SafeImage';

// メッセージの種類を表す列挙型
enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  LOCATION = 'location',
  GIFT = 'gift'
}

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
