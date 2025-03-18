"use client";

import { useEffect, useRef, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineDotsVertical, HiOutlinePhone, HiOutlineVideoCamera } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Conversation, Message, Reaction, MessageStatus } from '@/app/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatRoomProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onBackClick?: () => void;
  onSendMessage: (conversationId: string, content: string, attachments: any[]) => void;
  onReaction: (messageId: string, reaction: string) => void;
  onMessageDelete: (messageId: string) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onVideoCallStart?: () => void;
  onVoiceCallStart?: () => void;
  typingUsers?: string[];
}

export default function ChatRoom({
  conversation,
  messages,
  currentUserId,
  onBackClick,
  onSendMessage,
  onReaction,
  onMessageDelete,
  onTypingStart,
  onTypingEnd,
  onVideoCallStart,
  onVoiceCallStart,
  typingUsers = []
}: ChatRoomProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
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
    console.log('ChatRoom: メッセージ送信開始', { content, attachmentsCount: attachments.length });
    
    // 添付ファイルの詳細をログ
    if (attachments && attachments.length > 0) {
      console.log('ChatRoom: 添付ファイル詳細:', attachments.map(a => ({
        type: a.type,
        id: a.id,
        ...(a.type === 'gift' ? { 
          giftId: a.giftId,
          giftName: a.giftName,
          giftImageUrl: a.giftImageUrl,
          animation: a.animation 
        } : {})
      })));
    }
    
    // 送信処理を実行
    onSendMessage(conversation.id, content, attachments);
    console.log('ChatRoom: メッセージ送信完了');
    
    // 返信状態をリセット
    setReplyToMessage(null);
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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-50">
      {/* ヘッダー */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <button onClick={onBackClick} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="relative mr-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {getConversationAvatar() && getConversationAvatar().trim() !== '' ? (
              <Image
                src={getConversationAvatar()}
                alt={getConversationName()}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
                {getConversationName()?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
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
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-100">
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
        <div ref={messagesEndRef} />
      </div>
      
      {/* 入力エリア */}
      <div className="border-t border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-100 p-2">
        {renderReplyBanner()}
        <MessageInput
          onSendMessage={async (message: Message) => {
            // メッセージオブジェクトから必要な情報を取り出してhandleSendMessageに渡す
            const content = typeof message.content === 'string' ? message.content : '';
            const attachments = Array.isArray(message.attachments) ? message.attachments : [];
            handleSendMessage(content, attachments);
            return Promise.resolve();
          }}
          onTypingStart={onTypingStart}
          onTypingEnd={onTypingEnd}
          placeholder="メッセージを入力..."
          gender="male"
          currentPoints={100}
          requiredPoints={5}
          chatId={conversation.id}
        />
      </div>
    </div>
  );
}
