"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaPhone, FaEllipsisH } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { IoGift } from 'react-icons/io5';
import { motion } from 'framer-motion';

// メッセージの状態定義
type MessageStatus = 'sent' | 'delivered' | 'read';

// 添付ファイル型定義
type ImageAttachment = {
  type: 'image';
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
};

type VideoAttachment = {
  type: 'video';
  url: string;
  thumbnailUrl: string;
  duration: number;
};

type LocationAttachment = {
  type: 'location';
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
};

type UrlAttachment = {
  type: 'url';
  url: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
};

type Attachment = ImageAttachment | VideoAttachment | LocationAttachment | UrlAttachment;

// メッセージリアクション型定義
type Reaction = {
  userId: string;
  emoji: string;
};

// メッセージ型定義
type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments: Attachment[];
  reactions: Reaction[];
  status: MessageStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// 会話参加者型定義
type Participant = {
  userId: string;
  displayName: string;
  profileImageUrl: string;
  isOnline: boolean;
  lastOnline?: Date;
  isTyping: boolean;
};

// 会話型定義
type Conversation = {
  id: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  isGroup: boolean;
  groupName?: string;
  groupImageUrl?: string;
};

interface Params {
  id: string;
}

// モックデータ
const mockCurrentUserId = "user1";

// モックメッセージデータを生成
const generateMockMessages = (conversationId: string) => {
  const now = new Date();
  
  return [
    {
      id: "msg1",
      conversationId: conversationId,
      senderId: mockCurrentUserId,
      content: "こんにちは、元気ですか？",
      attachments: [],
      reactions: [],
      status: "read" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1日前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    },
    {
      id: "msg2",
      conversationId: conversationId,
      senderId: "user2",
      content: "はい、元気です！今日は何をしていますか？",
      attachments: [],
      reactions: [{ userId: mockCurrentUserId, emoji: "❤️" }],
      status: "read" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 23), // 23時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 23),
    },
    {
      id: "msg3",
      conversationId: conversationId,
      senderId: mockCurrentUserId,
      content: "新しいレストランに行ってきました。とても美味しかったです！",
      attachments: [{
        type: 'image',
        url: '/images/restaurant.jpg',
        thumbnailUrl: '/images/restaurant.jpg',
        width: 800,
        height: 600
      } as ImageAttachment],
      reactions: [],
      status: "read" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 22), // 22時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 22),
    },
    {
      id: "msg4",
      conversationId: conversationId,
      senderId: "user2",
      content: "いいですね！どこのレストランですか？今度私も行ってみたいです。",
      attachments: [],
      reactions: [],
      status: "read" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 21), // 21時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 21),
    },
    {
      id: "msg5",
      conversationId: conversationId,
      senderId: mockCurrentUserId,
      content: "渋谷にある「さくら」というレストランです。予約してから行くことをお勧めします！",
      attachments: [],
      reactions: [],
      status: "read" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 20), // 20時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 20),
    },
    {
      id: "msg6",
      conversationId: conversationId,
      senderId: "user2",
      content: "ありがとう！今週末に予約してみます。他にお勧めはありますか？",
      attachments: [],
      reactions: [],
      status: "read" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 10), // 10時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 10),
    },
    {
      id: "msg7",
      conversationId: conversationId,
      senderId: mockCurrentUserId,
      content: "デザートが特においしいですよ！モンブランがおすすめです。",
      attachments: [],
      reactions: [],
      status: "delivered" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 30), // 30分前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 30),
    },
    {
      id: "msg8",
      conversationId: conversationId,
      senderId: "user2",
      content: "わかりました！楽しみにしています。ありがとう😊",
      attachments: [],
      reactions: [],
      status: "sent" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 5), // 5分前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 5),
    }
  ];
};

// モック会話データ取得
const getMockConversation = (id: string): Conversation => {
  const now = new Date();
  return {
    id,
    participants: [
      {
        userId: mockCurrentUserId,
        displayName: "山田太郎",
        profileImageUrl: "/images/avatar1.jpg",
        isOnline: true,
        isTyping: false
      },
      {
        userId: "user2",
        displayName: "佐藤花子",
        profileImageUrl: "/images/avatar2.jpg",
        isOnline: true,
        lastOnline: new Date(now.getTime() - 1000 * 60 * 5),
        isTyping: false
      }
    ],
    unreadCount: 0,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7), // 1週間前
    updatedAt: new Date(now.getTime() - 1000 * 60 * 5),
    isGroup: false
  };
};

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatPartner, setChatPartner] = useState<Participant | null>(null);
  const [showReservationBanner, setShowReservationBanner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // ポイントシステム関連
  const [pointsRequired, setPointsRequired] = useState(5); // メッセージ送信に必要なポイント
  const [currentPoints, setCurrentPoints] = useState(100); // ユーザーの所持ポイント
  const [isMessageSending, setIsMessageSending] = useState(false); // 送信中かどうか
  const [userGender, setUserGender] = useState<'male' | 'female'>('male'); // ユーザーの性別

  // スクロールを最新のメッセージに合わせる
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 会話データとメッセージを取得
  useEffect(() => {
    if (!params.id) return;
    
    // モックデータを取得
    const conversationId = params.id;
    setIsLoading(true);
    
    // 非同期データ取得をシミュレート
    setTimeout(() => {
      const conversation = getMockConversation(conversationId);
      setConversation(conversation);
      
      // チャット相手の情報を設定
      const partner = conversation.participants.find(p => p.userId !== mockCurrentUserId) || null;
      setChatPartner(partner);
      
      // メッセージデータを設定
      const msgs = generateMockMessages(conversationId);
      setMessages(msgs);
      
      setIsLoading(false);
      
      // 読み込み完了後にスクロール
      setTimeout(scrollToBottom, 100);
    }, 500);
  }, [params.id]);

  // 新しいメッセージが追加されたらスクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // メッセージ送信処理
  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return;
    
    const now = new Date();
    const newMsg: Message = {
      id: `msg${Math.random().toString(36).substr(2, 9)}`,
      conversationId: conversation.id,
      senderId: mockCurrentUserId,
      content: newMessage,
      attachments: [],
      reactions: [],
      status: 'sent',
      isDeleted: false,
      createdAt: now,
      updatedAt: now
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // 自動返信をシミュレート
    setTimeout(() => {
      // メッセージのステータスを「配信済み」に更新
      setMessages(prev => prev.map(msg => 
        msg.id === newMsg.id ? { ...msg, status: 'delivered' as MessageStatus } : msg
      ));
      
      // 相手のタイピング状態をシミュレート
      if (chatPartner) {
        setChatPartner(prev => prev ? { ...prev, isTyping: true } : null);
        
        // 数秒後に自動返信
        setTimeout(() => {
          const replyMsg: Message = {
            id: `msg${Math.random().toString(36).substr(2, 9)}`,
            conversationId: conversation.id,
            senderId: chatPartner.userId,
            content: '返信ありがとうございます！また連絡します😊',
            attachments: [],
            reactions: [],
            status: 'sent',
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          setChatPartner(prev => prev ? { ...prev, isTyping: false } : null);
          setMessages(prev => [...prev, replyMsg]);
          
          // 先ほど送信したメッセージを「既読」に更新
          setTimeout(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === newMsg.id ? { ...msg, status: 'read' as MessageStatus } : msg
            ));
          }, 1000);
        }, 3000);
      }
    }, 1000);
  };

  // メッセージの日付フォーマット
  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return '今日';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return '昨日';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };
  
  // メッセージの時間フォーマット
  const formatMessageTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // メッセージの既読状態表示
  const getMessageStatusText = (status: MessageStatus) => {
    switch (status) {
      case 'sent': return '送信済み';
      case 'delivered': return '配信済み';
      case 'read': return '既読';
      default: return '';
    }
  };

  // 新しいメッセージが追加されたらスクロールダウン
  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  // 戻るボタン処理
  const handleBack = () => {
    router.push('/messages');
  };
  
  // ユーザー詳細ページへの遷移
  const navigateToUserProfile = () => {
    if (chatPartner) {
      router.push(`/user/${chatPartner.userId}`);
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // チャットパートナー情報の取得
  const partnerInfo = conversation?.participants.find(p => p.userId !== mockCurrentUserId);
  
  // 状態管理に合わせてパートナー情報を設定
  useEffect(() => {
    if (partnerInfo) {
      setChatPartner(partnerInfo);
    }
  }, [partnerInfo]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white p-3 border-b border-gray-200 flex items-center sticky top-0 z-10">
        <button onClick={handleBack} className="mr-3 text-gray-600">
          <FaArrowLeft size={18} />
        </button>
        
        <div className="relative h-10 w-10 mr-3" onClick={navigateToUserProfile}>
          <Image
            src={chatPartner?.profileImageUrl || '/images/default-avatar.jpg'}
            alt={chatPartner?.displayName || 'ユーザー'}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          {chatPartner?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1" onClick={navigateToUserProfile}>
          <h2 className="font-medium text-gray-900">{chatPartner?.displayName}</h2>
          <p className="text-xs text-gray-500">
            {chatPartner?.isOnline ? 'オンライン' : chatPartner?.lastOnline ? 
              `最終アクティブ: ${formatMessageDate(chatPartner.lastOnline)}` : ''}
          </p>
        </div>
        
        <button className="mx-2 text-gray-600">
          <FaPhone size={18} />
        </button>
        
        <button className="text-gray-600">
          <FaEllipsisH size={18} />
        </button>
      </header>
      
      {/* 予約バナー */}
      {showReservationBanner && (
        <div className="bg-teal-50 p-3 flex justify-between items-center border-b border-teal-100">
          <p className="text-xs text-teal-600">
            デート日の予定調整は約束機能で！<br />
            カンタンステップで予約完了
          </p>
          <button 
            className="bg-teal-500 text-white rounded-lg px-4 py-2 text-xs"
            onClick={() => alert('予約機能は開発中です')}
          >
            約束をする
          </button>
          <button 
            className="text-gray-400 text-xs ml-2"
            onClick={() => setShowReservationBanner(false)}
          >
            ×
          </button>
        </div>
      )}
      
      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 日付ごとにメッセージをグループ化 */}
        {messages && messages.length > 0 ? (
          <>
            {/* 日付セパレーターを表示 */}
            {[...new Set(messages.map(msg => formatMessageDate(msg.createdAt)))].map(date => (
              <div key={date}>
                {/* 日付ヘッダー */}
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">{date}</span>
                </div>
                
                {/* その日付のメッセージを表示 */}
                {messages
                  .filter(msg => formatMessageDate(msg.createdAt) === date)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === mockCurrentUserId ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      {msg.senderId !== mockCurrentUserId && chatPartner && (
                        <div className="mr-2 flex-shrink-0">
                          <Image
                            src={chatPartner.profileImageUrl || '/images/default-avatar.jpg'}
                            alt={chatPartner.displayName}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`relative max-w-[70%] break-words rounded-lg p-3 ${
                          msg.senderId === mockCurrentUserId 
                            ? 'bg-teal-500 text-white rounded-tr-none' 
                            : 'bg-white border border-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        
                        {/* 添付ファイルがあれば表示 */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2">
                            {msg.attachments.map((attachment, index) => {
                              if (attachment.type === 'image') {
                                return (
                                  <div key={index} className="relative">
                                    <Image 
                                      src={attachment.url} 
                                      alt="画像添付ファイル" 
                                      width={200} 
                                      height={150}
                                      className="rounded-md max-w-full"
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                        
                        {/* 時間表示 */}
                        <div className={`text-xs mt-1 text-right ${
                          msg.senderId === mockCurrentUserId ? 'text-gray-200' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(msg.createdAt)}
                          {msg.senderId === mockCurrentUserId && (
                            <span className="ml-2">{getMessageStatusText(msg.status)}</span>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  ))}
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>メッセージがありません</p>
            <p className="text-sm mt-2">新しいメッセージを送ってみましょう</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* ポイント情報バナー */}
      {pointsRequired > 0 && (
        <div className="bg-white p-2 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-600 px-2">
            <div>
              <span className="font-medium">メッセージ送信：</span> {pointsRequired} ポイント
            </div>
            <div>
              <span className="font-medium">残りポイント：</span> {currentPoints} ポイント
              {currentPoints < pointsRequired && (
                <button 
                  className="ml-2 bg-teal-500 text-white text-xs px-2 py-1 rounded"
                  onClick={() => alert('ポイント購入画面は開発中です')}
                >
                  ポイント購入
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 入力エリア */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2"
      >
        <button 
          type="button"
          className="text-gray-500 p-2"
          onClick={() => alert('ギフト機能は開発中です')}
        >
          <IoGift size={24} />
        </button>
        
        <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        
        <button 
          type="submit"
          disabled={!newMessage.trim() || (pointsRequired > 0 && currentPoints < pointsRequired)}
          className={`${
            newMessage.trim() && (pointsRequired === 0 || currentPoints >= pointsRequired) 
              ? 'text-teal-500' 
              : 'text-gray-400'
          } p-2`}
          title={currentPoints < pointsRequired ? 'ポイントが足りません' : ''}
        >
          <IoMdSend size={24} />
        </button>
      </form>
      
      {/* メッセージ送信時のポイント表示 */}
      {isMessageSending && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm z-50"
        >
          {userGender === 'male' 
            ? `${pointsRequired}ポイントを使用しました` 
            : `${pointsRequired}ポイントを獲得しました`}
        </motion.div>
      )}
    </div>
  );
}
