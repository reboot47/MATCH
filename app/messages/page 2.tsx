"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConversationList from '../components/chat/ConversationList';
import { Conversation, Message, MessageStatus } from '../types/chat';

// モックデータ（実際には API から取得）
const mockCurrentUserId = "user1";

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    isGroup: false,
    participants: [
      {
        id: "p1",
        userId: "user1",
        conversationId: "conv1",
        joinedAt: new Date("2023-01-01"),
        isAdmin: false,
        lastReadMessageId: "msg1",
      },
      {
        id: "p2",
        userId: "佐藤健",
        conversationId: "conv1",
        joinedAt: new Date("2023-01-01"),
        isAdmin: false,
      },
    ],
    lastMessage: {
      id: "msg1",
      conversationId: "conv1",
      senderId: "佐藤健",
      content: "次の週末、一緒に食事に行きませんか？",
      attachments: [],
      reactions: [],
      status: "delivered" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分前
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "conv2",
    name: "旅行計画グループ",
    isGroup: true,
    participants: [
      {
        id: "p3",
        userId: "user1",
        conversationId: "conv2",
        joinedAt: new Date("2023-02-01"),
        isAdmin: true,
      },
      {
        id: "p4",
        userId: "山田花子",
        conversationId: "conv2",
        joinedAt: new Date("2023-02-01"),
        isAdmin: false,
      },
      {
        id: "p5",
        userId: "田中太郎",
        conversationId: "conv2",
        joinedAt: new Date("2023-02-01"),
        isAdmin: false,
      },
    ],
    lastMessage: {
      id: "msg2",
      conversationId: "conv2",
      senderId: "山田花子",
      content: "私は温泉旅館がいいと思います！",
      attachments: [],
      reactions: [],
      status: "sent" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    photoUrl: "/avatars/group1.jpg",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01"),
  },
  {
    id: "conv3",
    isGroup: false,
    participants: [
      {
        id: "p6",
        userId: "user1",
        conversationId: "conv3",
        joinedAt: new Date("2023-03-01"),
        isAdmin: false,
      },
      {
        id: "p7",
        userId: "鈴木愛",
        conversationId: "conv3",
        joinedAt: new Date("2023-03-01"),
        isAdmin: false,
      },
    ],
    lastMessage: {
      id: "msg3",
      conversationId: "conv3",
      senderId: "user1",
      content: "先日はありがとうございました。また機会があればよろしくお願いします。",
      attachments: [],
      reactions: [],
      status: "read" as MessageStatus,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2日前
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-03-01"),
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 実際のアプリではAPIからデータを取得
    setConversations(mockConversations);
  }, []);

  const handleNewConversation = () => {
    // 新規会話作成ページに遷移
    // router.push('/messages/new');
    alert('新規会話作成機能は実装中です');
  };

  return (
    <main className="flex min-h-screen bg-white">
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 min-h-screen">
        <ConversationList
          conversations={conversations}
          currentUserId={mockCurrentUserId}
          onNewConversation={handleNewConversation}
        />
      </div>
      
      <div className="hidden md:flex flex-col items-center justify-center flex-1 text-gray-500 bg-gray-50">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">メッセージを選択</h3>
        <p className="text-sm text-center max-w-xs">
          左側のリストから会話を選択するか、新しい会話を始めてください。
        </p>
      </div>
    </main>
  );
}
