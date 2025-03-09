"use client";

import { useEffect, useRef, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineDotsVertical, HiOutlinePhone, HiOutlineVideoCamera } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Conversation, Message, Reaction, MessageStatus } from '@/app/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import PointSystem from './PointSystem';

interface ChatRoomProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  userGender?: 'male' | 'female';
  userPoints?: number;
  onBackClick?: () => void;
  onSendMessage: (conversationId: string, content: string, attachments: any[]) => void;
  onReaction: (messageId: string, reaction: string) => void;
  onMessageDelete: (messageId: string) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onVideoCallStart?: () => void;
  onVoiceCallStart?: () => void;
  onPurchasePoints?: () => void;
  onPointsUpdated?: (newPoints: number) => void;
  typingUsers?: string[];
  requiredPointsPerMessage?: number;
}

export default function ChatRoom({
  conversation,
  messages,
  currentUserId,
  userGender = 'male',
  userPoints = 0,
  onBackClick,
  onSendMessage,
  onReaction,
  onMessageDelete,
  onTypingStart,
  onTypingEnd,
  onVideoCallStart,
  onVoiceCallStart,
  onPurchasePoints,
  onPointsUpdated,
  typingUsers = [],
  requiredPointsPerMessage = 5
}: ChatRoomProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [currentPoints, setCurrentPoints] = useState<number>(userPoints);
  const [lastPointTransaction, setLastPointTransaction] = useState<{amount: number; type: 'spent' | 'earned'; timestamp: Date;} | undefined>();
  
  // 会話相手またはグループの名前を取得
  const getConversationName = () => {
    if (conversation.name) {
      return conversation.name;
    }
    
    if (!conversation.isGroup) {
      const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId);
      return otherParticipant ? otherParticipant.userId : '不明なユーザー';
    }
    
    return 'グループチャット';
  };
  
  // 会話相手またはグループのアバターを取得
  const getConversationAvatar = () => {
    if (conversation.photoUrl) {
      return conversation.photoUrl;
    }
    
    if (!conversation.isGroup) {
      const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId);
      return otherParticipant ? `/avatars/${otherParticipant.userId}.jpg` : '/avatars/default.jpg';
    }
    
    return '/avatars/group-default.jpg';
  };
  
  // メッセージ送信ハンドラー
  const handleSendMessage = (content: string, attachments: any[]) => {
    onSendMessage(conversation.id, content, attachments);
    setReplyToMessage(null); // 返信をリセット
  };
  
  // ポイント更新ハンドラー
  const handlePointsUpdated = (newPoints: number) => {
    const pointDiff = Math.abs(newPoints - currentPoints);
    const transactionType = newPoints < currentPoints ? 'spent' : 'earned';
    
    setCurrentPoints(newPoints);
    setLastPointTransaction({
      amount: pointDiff,
      type: transactionType,
      timestamp: new Date()
    });
    
    // 親コンポーネントに通知
    if (onPointsUpdated) {
      onPointsUpdated(newPoints);
    }
  };
  
  // リアクション追加ハンドラー
  const handleReactionAdd = (messageId: string, reactionType: string) => {
    onReaction(messageId, reactionType);
  };
  
  // メッセージ削除ハンドラー
  const handleMessageDelete = (messageId: string) => {
    if (confirm('このメッセージを削除しますか？')) {
      onMessageDelete(messageId);
    }
  };
  
  // 返信ハンドラー
  const handleReply = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyToMessage(message);
    }
  };
  
  // 最新メッセージにスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // タイピングユーザーの表示
  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;
    
    return (
      <div className="flex items-center text-xs text-gray-500 my-2 ml-4">
        <div className="flex space-x-1 mr-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span>
          {typingUsers.join(', ')} が入力中...
        </span>
      </div>
    );
  };
  
  // 返信バナー
  const renderReplyBanner = () => {
    if (!replyToMessage) return null;
    
    return (
      <div className="mx-4 p-2 bg-gray-100 rounded-t-lg border-l-2 border-primary-500 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-primary-500 font-medium">
            {replyToMessage.senderId === currentUserId ? 'あなた' : replyToMessage.senderId} への返信
          </div>
          <div className="text-sm text-gray-600 truncate">
            {replyToMessage.content || (replyToMessage.attachments.length > 0 ? '添付ファイル' : '')}
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={() => setReplyToMessage(null)}
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // 日付セパレータ
  const renderDateSeparator = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateText = '';
    
    if (date.toDateString() === today.toDateString()) {
      dateText = '今日';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateText = '昨日';
    } else {
      dateText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
          {dateText}
        </div>
      </div>
    );
  };
  
  // メッセージのグループ化（同日のメッセージを日付セパレータで区切る）
  const groupMessagesByDate = () => {
    const groups: { date: Date; messages: Message[] }[] = [];
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      messageDate.setHours(0, 0, 0, 0);
      
      const existingGroup = groups.find(
        (group) => group.date.getTime() === messageDate.getTime()
      );
      
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({
          date: messageDate,
          messages: [message],
        });
      }
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();

  // ポイント表示
  const renderPointDisplay = () => {
    if (!userGender) return null;
    
    return (
      <div className="flex items-center px-3 py-1 bg-gray-50 border-b border-gray-200 text-sm">
        <IoMdWallet className="text-teal-500 mr-1" />
        <span className="text-gray-700 font-medium">
          {currentPoints} <span className="text-xs font-normal">ポイント</span>
        </span>
        {userGender === 'male' && (
          <button 
            onClick={onPurchasePoints}
            className="ml-auto text-xs bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 rounded transition"
          >
            チャージ
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* ヘッダー */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <button onClick={onBackClick} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="relative mr-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={getConversationAvatar()}
              alt={getConversationName()}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          
          {!conversation.isGroup && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-gray-900 truncate">{getConversationName()}</h2>
          <p className="text-xs text-gray-500 truncate">
            {!conversation.isGroup 
              ? 'オンライン' 
              : `${conversation.participants.length}人のメンバー`}
          </p>
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={onVoiceCallStart}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <HiOutlinePhone className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onVideoCallStart}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <HiOutlineVideoCamera className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <HiOutlineDotsVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 pb-2 bg-white" style={{ paddingBottom: "20px" }}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>まだメッセージはありません</p>
            <p className="text-sm mt-1">「こんにちは」と送ってみましょう！</p>
          </div>
        ) : (
          <div>
            {messageGroups.map((group, groupIndex) => (
              <div key={group.date.toISOString()}>
                {renderDateSeparator(group.date)}
                
                {group.messages.map((message, messageIndex) => {
                  const previousMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
                  const showAvatar = message.senderId !== previousMessage?.senderId;
                  
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isMine={message.senderId === currentUserId}
                      showAvatar={showAvatar}
                      senderName={message.senderId !== currentUserId ? message.senderId : undefined}
                      senderAvatar={message.senderId !== currentUserId ? `/avatars/${message.senderId}.jpg` : undefined}
                      onReactionAdd={handleReactionAdd}
                      onReply={handleReply}
                      onDelete={handleMessageDelete}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
        
        {renderTypingIndicator()}
        {/* メッセージの最後に十分な余白を追加して、自分のメッセージが入力欄に隠れないようにする */}
        <div ref={messagesEndRef} className="h-24 md:h-32" />
      </div>
      
      {/* 入力エリア */}
      <div className="border-t border-gray-200">
        {renderReplyBanner()}
        
        {/* ポイントシステム */}
        <PointSystem 
          gender={userGender}
          currentPoints={currentPoints}
          requiredPoints={requiredPointsPerMessage}
          onPurchasePoints={onPurchasePoints}
          showPointsUsage={true}
          lastPointTransaction={lastPointTransaction}
        />
        
        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingStart={onTypingStart}
          onTypingEnd={onTypingEnd}
          placeholder="メッセージを入力..."
          gender={userGender}
          currentPoints={currentPoints}
          requiredPoints={requiredPointsPerMessage}
          onPointsUpdated={handlePointsUpdated}
        />
      </div>
      
      {/* フローティングの戻るボタン - モバイルユーザー向け */}
      <div className="md:hidden fixed left-4 bottom-24 z-50">
        <button 
          onClick={onBackClick} 
          className="bg-white p-3 rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="メッセージ一覧に戻る"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-primary-500" />
        </button>
      </div>
    </div>
  );
}
