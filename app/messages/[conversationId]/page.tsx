"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from '@/app/components/chat/ChatRoom';
import { Conversation, Message, MessageStatus, ImageAttachment, VideoAttachment, LocationAttachment, UrlAttachment } from '@/app/types/chat';

interface Params {
  conversationId: string;
}

// モックデータ
const mockCurrentUserId = "user1";

// モックメッセージデータ
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
      senderId: "佐藤健",
      content: "元気ですよ！昨日新しいカメラを買いました。",
      attachments: [],
      reactions: [],
      status: "delivered" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 23), // 23時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 23),
    },
    {
      id: "msg3",
      conversationId: conversationId,
      senderId: "佐藤健",
      content: "これが最初に撮った写真です！",
      attachments: [
        {
          id: "att1",
          type: "image" as const,
          url: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621",
          thumbnailUrl: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=200",
          width: 1200,
          height: 800,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 22), // 22時間前
        }
      ],
      reactions: [
        {
          id: "react1",
          type: "like",
          userId: mockCurrentUserId,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 21), // 21時間前
        }
      ],
      status: "delivered" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 22), // 22時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 22),
    },
    {
      id: "msg4",
      conversationId: conversationId,
      senderId: mockCurrentUserId,
      content: "素晴らしい写真ですね！どこで撮ったんですか？",
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
      senderId: "佐藤健",
      content: "近くの公園です。ここの場所です：",
      attachments: [
        {
          id: "att2",
          type: "location" as const,
          latitude: 35.6895,
          longitude: 139.6917,
          name: "代々木公園",
          address: "東京都渋谷区代々木神園町２−１",
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 20), // 20時間前
        }
      ],
      reactions: [],
      status: "delivered" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 20), // 20時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 20),
    },
    {
      id: "msg6",
      conversationId: conversationId,
      senderId: mockCurrentUserId,
      content: "すごい！カメラについてもっと知りたいです。",
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
      senderId: "佐藤健",
      content: "このレビュー記事がわかりやすいですよ：",
      attachments: [
        {
          id: "att3",
          type: "url" as const,
          url: "https://www.dpreview.com/",
          title: "デジタルカメラレビュー",
          description: "最新のカメラレビューと撮影テクニック",
          imageUrl: "https://www.dpreview.com/files/p/articles/4777513881/sony-a7r-v-review-1.jpeg",
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5時間前
        }
      ],
      reactions: [],
      status: "delivered" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 5),
    },
    {
      id: "msg8",
      conversationId: conversationId,
      senderId: "佐藤健",
      content: "あと、公園で短い動画も撮りました。",
      attachments: [
        {
          id: "att4",
          type: "video" as const,
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          thumbnailUrl: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
          duration: 15,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 4), // 4時間前
        }
      ],
      reactions: [],
      status: "delivered" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 4), // 4時間前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 4),
    },
    {
      id: "msg9",
      conversationId: conversationId,
      senderId: mockCurrentUserId,
      content: "素晴らしいですね！今度一緒に撮影に行きましょう！",
      attachments: [],
      reactions: [],
      status: "sent" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 30), // 30分前
      updatedAt: new Date(now.getTime() - 1000 * 60 * 30),
    },
  ];
};

// モック会話データ
const getMockConversation = (conversationId: string): Conversation => {
  return {
    id: conversationId,
    isGroup: false,
    participants: [
      {
        id: "p1",
        userId: mockCurrentUserId,
        conversationId: conversationId,
        joinedAt: new Date("2023-01-01"),
        isAdmin: false,
        lastReadMessageId: "msg8",
      },
      {
        id: "p2",
        userId: "佐藤健",
        conversationId: conversationId,
        joinedAt: new Date("2023-01-01"),
        isAdmin: false,
      },
    ],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  };
};

export default function ConversationPage({ params }: { params: Params }) {
  const { conversationId } = params;
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  useEffect(() => {
    // 実際のアプリではAPIから会話データを取得
    const mockConversation = getMockConversation(conversationId);
    setConversation(mockConversation);
    
    // 実際のアプリではAPIからメッセージを取得
    const mockMessages = generateMockMessages(conversationId);
    setMessages(mockMessages);
    
    // タイピング状態のシミュレーション（デモ用）
    const typingTimer = setTimeout(() => {
      setTypingUsers(["佐藤健"]);
      
      setTimeout(() => {
        setTypingUsers([]);
        
        // 新しいメッセージの追加（デモ用）
        const newMessage: Message = {
          id: "msg10",
          conversationId: conversationId,
          senderId: "佐藤健",
          content: "いいですね！次の週末はどうですか？",
          attachments: [],
          reactions: [],
          status: "delivered" as MessageStatus,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setMessages(prev => [...prev, newMessage]);
      }, 3000);
    }, 5000);
    
    return () => clearTimeout(typingTimer);
  }, [conversationId]);
  
  const handleBackClick = () => {
    router.push('/messages');
  };
  
  const handleSendMessage = (conversationId: string, content: string, attachments: any[]) => {
    // 実際のアプリではAPIを呼び出してメッセージを送信
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: mockCurrentUserId,
      content,
      attachments,
      reactions: [],
      status: "sending" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // メッセージ送信成功シミュレーション（デモ用）
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: "sent" as MessageStatus } 
            : msg
        )
      );
      
      // メッセージ配信シミュレーション（デモ用）
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: "delivered" as MessageStatus } 
              : msg
          )
        );
        
        // 既読シミュレーション（デモ用）
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === newMessage.id 
                ? { ...msg, status: "read" as MessageStatus } 
                : msg
            )
          );
        }, 2000);
      }, 1000);
    }, 1000);
  };
  
  const handleReaction = (messageId: string, reaction: string) => {
    // 実際のアプリではAPIを呼び出してリアクションを追加
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReactionIndex = msg.reactions.findIndex(
            r => r.userId === mockCurrentUserId && r.type === reaction
          );
          
          if (existingReactionIndex >= 0) {
            // 既存のリアクションを削除
            const newReactions = [...msg.reactions];
            newReactions.splice(existingReactionIndex, 1);
            return { ...msg, reactions: newReactions };
          } else {
            // 新しいリアクションを追加
            const newReaction = {
              id: `react-${Date.now()}`,
              type: reaction as any,
              userId: mockCurrentUserId,
              createdAt: new Date(),
            };
            return { ...msg, reactions: [...msg.reactions, newReaction] };
          }
        }
        return msg;
      })
    );
  };
  
  const handleMessageDelete = (messageId: string) => {
    // 実際のアプリではAPIを呼び出してメッセージを削除
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isDeleted: true } : msg
      )
    );
  };
  
  const handleTypingStart = () => {
    // 実際のアプリではリアルタイム通信でタイピング状態を送信
    console.log("Typing started");
  };
  
  const handleTypingEnd = () => {
    // 実際のアプリではリアルタイム通信でタイピング終了を送信
    console.log("Typing ended");
  };
  
  const handleVideoCallStart = () => {
    // ビデオ通話機能へのナビゲーション（今後実装）
    alert("ビデオ通話機能は実装中です");
  };
  
  const handleVoiceCallStart = () => {
    // 音声通話機能へのナビゲーション（今後実装）
    alert("音声通話機能は実装中です");
  };

  if (!conversation) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen bg-white">
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200">
        {/* 会話リストは別コンポーネントとして実装 - 省略 */}
        <div className="p-4 text-center">
          <button
            onClick={handleBackClick}
            className="text-primary-500 hover:underline text-sm"
          >
            ← 会話一覧に戻る
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <ChatRoom
          conversation={conversation}
          messages={messages}
          currentUserId={mockCurrentUserId}
          onBackClick={handleBackClick}
          onSendMessage={handleSendMessage}
          onReaction={handleReaction}
          onMessageDelete={handleMessageDelete}
          onTypingStart={handleTypingStart}
          onTypingEnd={handleTypingEnd}
          onVideoCallStart={handleVideoCallStart}
          onVoiceCallStart={handleVoiceCallStart}
          typingUsers={typingUsers}
        />
      </div>
    </main>
  );
}
