// メッセージタイプの定義
export type MessageType = 'text' | 'image' | 'video' | 'location' | 'url' | 'sticker';

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
}

// 動画添付ファイル
export interface VideoAttachment extends Attachment {
  type: 'video';
  url: string;
  thumbnailUrl?: string;
  duration?: number;
}

// 位置情報添付ファイル
export interface LocationAttachment extends Attachment {
  type: 'location';
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
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

// 全ての添付ファイルタイプの統合型
export type AttachmentUnion = 
  | ImageAttachment 
  | VideoAttachment 
  | LocationAttachment 
  | UrlAttachment
  | StickerAttachment;

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
