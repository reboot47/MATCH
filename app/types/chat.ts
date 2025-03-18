// メッセージタイプの定義
export type MessageType = 'text' | 'image' | 'video' | 'location' | 'url' | 'sticker' | 'gift';

// 添付ファイルの基本タイプ
export interface Attachment {
  id: string;
  type: MessageType;
  createdAt: Date;
}

// 画像添付ファイル
export interface ImageAttachment extends Attachment {
  type: 'image';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  // ファイル情報用プロパティ
  name?: string;
  size?: number;
  file?: File;
  originalWidth?: number;
  originalHeight?: number;
}

// 動画添付ファイル
export interface VideoAttachment extends Attachment {
  type: 'video';
  url: string;
  thumbnailUrl?: string;  // 動画のサムネイル画像のURL
  duration?: number;      // 動画の再生時間（秒）
  title?: string;        // 動画のタイトル
  description?: string;  // 動画の説明
  // ファイル情報用プロパティ
  name?: string;
  size?: number;
  file?: File;
}

// 位置情報添付ファイル
export interface LocationAttachment extends Attachment {
  type: 'location';
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  url?: string;         // GoogleマップなURL
  previewUrl?: string;  // 地図画像のURL
}

// URL添付ファイル (OGP情報含む)
export interface UrlAttachment extends Attachment {
  type: 'url';
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

// スタンプ添付ファイル
export interface StickerAttachment extends Attachment {
  type: 'sticker';
  stickerId: string;
  packageId?: string;
}

// ギフト添付ファイル
export interface GiftAttachment extends Attachment {
  type: 'gift';
  giftId: string;
  giftName: string;
  giftImageUrl: string;
  price?: number;
  message?: string;
  animation?: string; // アニメーションのCSSクラス名
}

// 全ての添付ファイルタイプの統合型
export type AttachmentUnion = 
  | ImageAttachment 
  | VideoAttachment 
  | LocationAttachment 
  | UrlAttachment
  | StickerAttachment
  | GiftAttachment;

// リアクションタイプ
export type ReactionType = 'like' | 'love' | 'laugh' | 'surprise' | 'sad' | 'angry';

// リアクション
export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
  createdAt: Date;
}

// メッセージの状態
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// メッセージ
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  attachments: AttachmentUnion[];
  reactions: Reaction[];
  replyToId?: string;
  status: MessageStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 会話参加者
export interface Participant {
  id: string;
  userId: string;
  conversationId: string;
  joinedAt: Date;
  leftAt?: Date;
  isAdmin: boolean;
  name?: string; // ユーザー名
  age?: number; // 年齢
  location?: string; // 場所
  profileImage?: string; // プロフィール画像
  lastReadMessageId?: string;
}

// 会話（個人またはグループチャット）
export interface Conversation {
  id: string;
  name?: string; // グループチャットの場合
  isGroup: boolean;
  participants: Participant[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
  photoUrl?: string; // グループチャットのアイコン
}
