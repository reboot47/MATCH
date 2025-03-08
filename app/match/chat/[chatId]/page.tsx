"use client";

import React, { useState, use, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatHeader, ChatMessage, ChatInput } from '@/components/chat';
import { AppointmentModal } from '@/app/components/chat';
import { motion } from 'framer-motion';
import { useUser } from '../../../../components/UserContext';

// メッセージタイプの定義
type MessageType = 'date' | 'text' | 'notification';

// メッセージの基本インターフェース
interface BaseMessage {
  id: string;
  type: MessageType;
}

// 日付表示用メッセージ
interface DateMessage extends BaseMessage {
  type: 'date';
  date: string;
}

// テキストメッセージ
interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead: boolean;
  avatar?: string;
  isDeleted?: boolean;
  attachments?: Array<{
    type: 'image' | 'video' | 'link' | 'location';
    url: string;
    previewUrl?: string;
    title?: string;
    description?: string;
  }>;
  reactions?: Array<{
    type: string;
    count: number;
    users?: string[];
  }>;
  replyTo?: {
    id: string;
    content: string;
    isMe: boolean;
  };
}

// 通知メッセージ
interface NotificationMessage extends BaseMessage {
  type: 'notification';
  content: string;
  actionButton?: string;
}

// すべてのメッセージタイプの統合型
type Message = DateMessage | TextMessage | NotificationMessage;

// Mock data for chat messages - ※画像を参考に修正
const mockMessages: Message[] = [
  {
    id: '1',
    type: 'date',
    date: '2025年3月6日',
  },
  {
    id: '3',
    type: 'text',
    content: '初めまして✨\nお忙しい中マッチングいただきありがとうございます😊✨\nまずはメッセージでお話し出来ますと幸いです🎶\n\n元々、大阪出身なので大阪へは月に1週間ほど帰る事が多々あるので仲良くしてくださると喜びます🎵今月末も大阪帰りますー♩(*^_^)♩\n\n希望や条件などこちらから申し伝えるのは恐縮なので、hideoさんのご要望があればお伺いさせていただきたいです🍀✨よろしくお願いいたします🍀',
    timestamp: '19:39',
    isMe: false,
    isRead: true,
    avatar: 'https://placehold.jp/150x150.png',
  },
  {
    id: '4',
    type: 'text',
    content: 'ぜひ大人希望です',
    timestamp: '21:44',
    isMe: true,
    isRead: true,
  },
  {
    id: '5',
    type: 'date',
    date: '3/7',
  },
  {
    id: '6',
    type: 'text',
    content: 'メッセージありがとうございます😊\nまだ始めたばかりで活用していない事もあって大人で会いした事無いのですが、大人へのご希望をお伺いできますでしょうか？🍀',
    timestamp: '05:01',
    isMe: false,
    isRead: true,
    avatar: 'https://placehold.jp/150x150.png',
  },

  {
    id: '8',
    type: 'text',
    content: '最近「君の名は。」を再見しました！何度見ても素晴らしい作品ですね。',
    timestamp: '14:40',
    isMe: true,
    isRead: false,
  },
];

// Mock user data - 画像参考
const mockUser = {
  id: '1',
  name: 'Mika',
  isOnline: true,
  lastSeen: '今オンライン',
  avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
};

// Next.js 15でのリクエストパラメータ型を定義
type ChatParams = {
  params: Promise<{ chatId: string }>
};

export default function ChatDetail({ params }: ChatParams) {
  // Next.js 15ではparamsがPromiseになったため、use()を使用してアンラップする
  const userContext = useUser();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [mockMessagesState, setMockMessages] = useState<Message[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{id: string, content: string, isMe: boolean} | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showUnreadJumpButton, setShowUnreadJumpButton] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unreadRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null); // メッセージコンテナへの参照を追加
  const observerRef = useRef<IntersectionObserver | null>(null); // Intersection Observerの参照
  const visibleMessageIds = useRef<Set<string>>(new Set()); // 画面に表示されているメッセージIDを管理
  
  // パラメータからchatIdを取得
  const { chatId } = use(params);
  
  // メッセージを最後までスクロール - 他の関数より先に定義して参照できるようにする
  const scrollToBottom = useCallback(() => {
    // 強制的にスクロール処理を行う改善版
    if (messageContainerRef.current) {
      try {
        // スクロール先を明確に計算
        const container = messageContainerRef.current;
        const scrollHeight = container.scrollHeight;
        
        // 直接スクロール位置を設定
        container.scrollTop = scrollHeight;
        
        // デバッグ用に詳細情報を出力
        console.log('スクロール処理実行', {
          scrollTop: container.scrollTop,
          scrollHeight: scrollHeight,
          containerHeight: container.clientHeight,
          shouldScrollTo: scrollHeight - container.clientHeight
        });

        // バックアップ方法としてmessagesEndRefも使用
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
          console.log('スクロール参照点を表示');
        }
      } catch (err) {
        console.error('スクロール処理中にエラー発生:', err);
      }
    } else {
      console.warn('メッセージコンテナ参照が存在しません');
    }
  }, []);
  
  // メッセージにリアクションを追加するハンドラー
  const handleReactionAdd = (messageId: string | undefined, reactionType: string) => {
    if (!messageId) return;
    
    setMockMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId && message.type === 'text') {
          const existingReactions = message.reactions || [];
          const existingReactionIndex = existingReactions.findIndex(r => r.type === reactionType);
          
          let updatedReactions;
          if (existingReactionIndex >= 0) {
            // 既存のリアクションの場合、カウントを増やす
            updatedReactions = [...existingReactions];
            updatedReactions[existingReactionIndex] = {
              ...updatedReactions[existingReactionIndex],
              count: updatedReactions[existingReactionIndex].count + 1
            };
          } else {
            // 新しいリアクションの場合、追加する
            updatedReactions = [...existingReactions, { type: reactionType, count: 1 }];
          }
          
          return {
            ...message,
            reactions: updatedReactions
          };
        }
        return message;
      })
    );
  };
  
  // メッセージを削除するハンドラー
  const handleMessageDelete = (messageId: string | undefined) => {
    if (!messageId) return;
    
    setMockMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId && message.type === 'text') {
          return {
            ...message,
            isDeleted: true,
            content: 'このメッセージは送信者によって取り消されました'
          };
        }
        return message;
      })
    );
  };
  
  // メッセージに返信するハンドラー
  const handleReply = (messageId: string | undefined, content: string) => {
    if (!messageId) return;
    
    // 返信元のメッセージを検索
    const replyToMessage = mockMessagesState.find(m => m.id === messageId);
    if (replyToMessage && replyToMessage.type === 'text') {
      setReplyingTo({
        id: messageId,
        content: replyToMessage.content,
        isMe: replyToMessage.isMe
      });
    }
  };
  
  // 返信をキャンセルするハンドラー
  const handleCancelReply = () => {
    setReplyingTo(null);
  };
  
  // テキストメッセージ送信ハンドラー
  const handleSendMessage = useCallback((content: string, attachments?: any[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    
    // 新しいメッセージオブジェクトを作成
    const newMessage: TextMessage = {
      id: `msg-${Date.now()}`,
      type: 'text',
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      isRead: false,
      attachments: attachments && attachments.length > 0 ? [
        {
          type: 'image',
          url: URL.createObjectURL(attachments[0]),
          previewUrl: URL.createObjectURL(attachments[0])
        }
      ] : undefined,
      // 返信の場合、返信情報を追加
      replyTo: replyingTo || undefined
    };
    
    // メッセージリストに追加
    setMockMessages(prev => [...prev, newMessage]);
    
    // 返信状態をリセット
    setReplyingTo(null);
    
    // メッセージ送信時に自動的に一番下までスクロール - 複数回呼び出して確実に動作させる
    requestAnimationFrame(() => {
      scrollToBottom();
    });
    
    setTimeout(() => {
      scrollToBottom();
      console.log('Scrolled after sending message - 1st timeout');
    }, 50);
    
    setTimeout(() => {
      scrollToBottom();
      console.log('Scrolled after sending message - 2nd timeout');
    }, 200);
    
    // 自動返信機能
    setIsTyping(true);
    setTimeout(() => {
      // 入力中状態になった後にもスクロール
      scrollToBottom();
      
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage: TextMessage = {
          id: `msg-${Date.now() + 1}`,
          type: 'text',
          content: '了解しました！ありがとうございます😊\nまたお気軽にお声がけください♪',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          isRead: true,
          avatar: mockUser.avatar,
          // 時々返信をつける
          replyTo: Math.random() > 0.5 ? {
            id: newMessage.id,
            content: newMessage.content,
            isMe: true
          } : undefined
        };
        
        setMockMessages(prev => [...prev, replyMessage]);
        
        // 返信メッセージ受信時にも自動的に一番下までスクロール - 複数回呼び出して確実に動作させる
        requestAnimationFrame(() => {
          scrollToBottom();
        });
        
        setTimeout(() => {
          scrollToBottom();
          console.log('Scrolled after receiving reply - 1st timeout');
        }, 50);
        
        setTimeout(() => {
          scrollToBottom();
          console.log('Scrolled after receiving reply - 2nd timeout');
        }, 200);
        
        setTimeout(() => {
          scrollToBottom();
          console.log('Scrolled after receiving reply - 3rd timeout');
        }, 500);
      }, 2000);
    }, 1000);
  }, [replyingTo, scrollToBottom]);
  
  // 未読メッセージを既読にする - 循環参照を解決するため先に定義
  const markMessagesAsRead = useCallback((specificIds?: string[]) => {
    // 未読メッセージが存在するかチェック
    const hasUnread = mockMessagesState.some(
      m => m.type === 'text' && !m.isMe && !(m as TextMessage).isRead && 
           (!specificIds || specificIds.includes(m.id))
    );
    
    // 未読メッセージがある場合のみ更新
    if (hasUnread) {
      setMockMessages(prev => 
        prev.map(message => {
          if (message.type === 'text' && !message.isMe && !(message as TextMessage).isRead &&
              (!specificIds || specificIds.includes(message.id))) {
            // デバッグ情報
            console.log(`メッセージを既読にしました: ID ${message.id}`);
            return { ...message, isRead: true };
          }
          return message;
        })
      );
      
      // メッセージを更新した後、明示的にカウントをリセット
      if (!specificIds) {
        // 全てのメッセージを既読にした場合のみボタンを非表示にする
        setUnreadCount(0);
        setShowUnreadJumpButton(false);
      } else {
        // 一部のメッセージを既読にした場合は未読カウントを再計算
        const remainingUnread = mockMessagesState.filter(
          m => m.type === 'text' && !m.isMe && !(m as TextMessage).isRead && 
               !specificIds.includes(m.id)
        ).length;
        setUnreadCount(remainingUnread);
        setShowUnreadJumpButton(remainingUnread > 0);
      }
    }
  }, [mockMessagesState]);
  
  // 未読メッセージにスクロール
  const scrollToUnread = useCallback(() => {
    if (unreadRef.current) {
      unreadRef.current.scrollIntoView({ behavior: 'auto' });
      setShowUnreadJumpButton(false);
      
      // スクロール後に、未読メッセージを既読にする
      markMessagesAsRead();
    } else {
      // 未読メッセージがない場合は最下部にスクロール
      scrollToBottom();
    }
  }, [markMessagesAsRead, scrollToBottom]);

  const router = useRouter();
  
  const handleBackClick = () => {
    console.log('Back button clicked');
    router.back();
  };

  // スタイル変数を使って、フッターが表示されないようにする
  useEffect(() => {
    // フッターを非表示にする
    const footer = document.querySelector('nav[role="navigation"]');
    if (footer) {
      (footer as HTMLElement).style.display = 'none';
    }
    
    return () => {
      // コンポーネントのアンマウント時にフッターを再表示
      const footer = document.querySelector('nav[role="navigation"]');
      if (footer) {
        (footer as HTMLElement).style.display = 'flex';
      }
    };
  }, []);
  
  // この部分は上に移動しました
  
  // メッセージの既読状態を監視するIntersection Observerを設定
  useEffect(() => {
    // 画面内に表示されたメッセージを検出するハンドラー
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // 画面に表示されているメッセージIDを収集
      const visibleMessages: string[] = [];
      
      entries.forEach(entry => {
        const messageId = entry.target.getAttribute('data-message-id');
        if (!messageId) return;
        
        // 相手からのメッセージが画面に表示された場合のみ処理
        const message = mockMessagesState.find(m => m.id === messageId);
        if (!message || message.type !== 'text' || message.isMe || (message as TextMessage).isRead) return;
        
        if (entry.isIntersecting) {
          // メッセージが画面に表示された
          visibleMessageIds.current.add(messageId);
          visibleMessages.push(messageId);
          console.log(`メッセージがIntersection Observerで検出されました: ID ${messageId}`);
        }
      });
      
      // 画面に表示された相手からのメッセージを既読にする
      if (visibleMessages.length > 0) {
        // 少し遅延させて既読にする（LINE風）
        setTimeout(() => {
          markMessagesAsRead(visibleMessages);
        }, 1000);
      }
    };
    
    // IntersectionObserverの作成
    if (!observerRef.current && messageContainerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersect, {
        root: messageContainerRef.current,
        threshold: 0.7, // 70%以上表示されたら可視とみなす
        rootMargin: '0px'
      });
      
      // メッセージ要素を監視する
      document.querySelectorAll('[data-message-id]').forEach(element => {
        observerRef.current?.observe(element);
      });
    }
    
    return () => {
      // クリーンアップ
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [mockMessagesState, markMessagesAsRead]);

  // メッセージが追加された時に一番下までスクロール
  useEffect(() => {
    // メッセージが変更された直後にスクロール
    scrollToBottom();
    
    // 複数のタイミングでスクロールを試行
    const timers: NodeJS.Timeout[] = [];
    
    // アニメーションフレームでのスクロール
    const rafId = requestAnimationFrame(() => {
      scrollToBottom();
      console.log('メッセージ更新後、RAFでのスクロール');
    });
    
    // 急ぎすぎないように、複数のタイミングでスクロールを実行
    [50, 100, 300, 500].forEach(delay => {
      const timer = setTimeout(() => {
        scrollToBottom();
        console.log(`メッセージ更新後 ${delay}ms でのスクロール`);
      }, delay);
      timers.push(timer);
    });
    
    // メッセージが更新された後、DOM要素を再度監視する
    setTimeout(() => {
      if (observerRef.current) {
        document.querySelectorAll('[data-message-id]').forEach(element => {
          observerRef.current?.observe(element);
        });
      }
    }, 300);
    
    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [mockMessagesState, scrollToBottom]); // メッセージ状態全体を監視
  
  // コンポーネント初期読み込み時にメッセージの最後にスクロールする
  useEffect(() => {
    console.log('初期表示時のスクロール処理開始');
    
    // 初期化直後のスクロール
    scrollToBottom();
    
    // 全ての要素が描画された後に確実にスクロールするため、複数の手法で試行
    // 1. アニメーションフレームを使用
    const rafId = requestAnimationFrame(() => {
      scrollToBottom();
      console.log('初期表示時、RAFでのスクロール');
    });
    
    // 2. 複数のタイミングで直接DOM操作と関数呼び出しの両方でスクロールさせる
    const timers: NodeJS.Timeout[] = [];
    [50, 100, 200, 300, 500, 1000, 2000].forEach(time => {
      const timer = setTimeout(() => {
        // 直接DOM操作
        if (messageContainerRef.current) {
          const container = messageContainerRef.current;
          // スクロール位置を計算
          const scrollHeight = container.scrollHeight;
          const clientHeight = container.clientHeight;
          const scrollTo = scrollHeight - clientHeight;
          
          // スクロール実行
          container.scrollTop = scrollTo > 0 ? scrollTo : 0;
          console.log(`初期表示 ${time}ms 後のスクロール: scrollTop=${container.scrollTop}, target=${scrollTo}`);
        }
        
        // 関数経由でも実行
        scrollToBottom();
      }, time);
      timers.push(timer);
    });
    
    // 3. 要素がロードされたことを確認するためのオブザーバーを使用
    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        // messagesEndRefの要素が表示されたらスクロールする
        if (entries[0].isIntersecting) {
          scrollToBottom();
          console.log('オブザーバー検出によるスクロール');
          observer.disconnect();
        }
      });
      
      if (messagesEndRef.current) {
        observer.observe(messagesEndRef.current);
      }
      
      return () => {
        cancelAnimationFrame(rafId);
        timers.forEach(timer => clearTimeout(timer));
        observer.disconnect();
      };
    }
    
    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []); // 空の依存配列で初回のみ実行
  

  
  // 未読メッセージ数をカウントするエフェクト
  useEffect(() => {
    // 未読メッセージをカウント
    const countUnread = mockMessagesState.filter(
      m => m.type === 'text' && !m.isMe && !(m as TextMessage).isRead
    ).length;
    
    // 変更が必要な場合のみ更新
    if (unreadCount !== countUnread) {
      setUnreadCount(countUnread);
      setShowUnreadJumpButton(countUnread > 0);
    }
  }, [mockMessagesState]); // unreadCountを依存配列から除去 // 依存配列にunreadCountを含める

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col relative overflow-hidden">
      <ChatHeader
        partnerName={mockUser.name}
        isOnline={mockUser.isOnline}
        lastSeen={mockUser.lastSeen}
        onBackClick={handleBackClick}
        onCallClick={() => console.log('Call clicked')}
        onVideoClick={() => console.log('Video clicked')}
        onInfoClick={() => console.log('Info clicked')}
        onAppointmentClick={() => setIsAppointmentModalOpen(true)}
      />

      {/* チャットコンテンツ - 高さを固定し、スクロールを有効化 */}
      <div 
        className="pt-16 pb-16 flex-1 flex flex-col relative overflow-hidden"
        style={{ height: 'calc(100vh - 60px)' }}
      >
        {/* ヘッダー直下のLINE風約束機能バナー */}
        <div className="sticky top-0 z-20 bg-[#06c755] bg-opacity-10 border-b border-[#06c755] border-opacity-20 py-2.5 px-3 shadow-sm">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center">
              <div className="bg-[#06c755] bg-opacity-20 rounded-full p-1.5 mr-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#06c755]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">デート日の予定調整は約束機能で！</p>
                <p className="text-xs text-gray-500">カンタンステップで予約完了♪</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-[#06c755] hover:bg-[#05b64b] transition-colors text-white text-sm py-1.5 px-4 rounded-full font-medium shadow-sm"
            >
              約束をする
            </button>
          </div>
        </div>
      
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto py-3 px-4 w-full bg-gray-100" 
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overflowX: 'hidden',
            overflowY: 'auto', // overflow-yを明示的に設定
            height: 'calc(100vh - 180px)',
            maxHeight: 'calc(100vh - 180px)', // 最大高さも設定
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239fa6ae\' fill-opacity=\'0.06\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px'
          }}
        >

        <div className="w-full space-y-3 max-w-full py-1">
          {/* 未読メッセージジャンプボタン */}
          {showUnreadJumpButton && (
            <div className="sticky top-2 flex justify-center z-10">
              <button 
                onClick={scrollToUnread}
                className="bg-[#06c755] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md animate-pulse flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                未読メッセージ ({unreadCount})
              </button>
            </div>
          )}
          
          {/* メッセージをマップして表示 */}
          {mockMessagesState.map((message, index) => {
            if (message.type === 'date') {
              // 日付表示メッセージ
              return (
                <div key={message.id} className="flex justify-center my-4">
                  <div className="bg-white bg-opacity-90 rounded-full px-4 py-1 shadow-sm">
                    <span className="text-xs font-medium text-gray-500">{message.date}</span>
                  </div>
                </div>
              );
            } else if (message.type === 'notification') {
              // 通知メッセージ - LINE風システムメッセージ
              return (
                <div key={message.id} className="flex flex-col items-center my-5">
                  <div className="bg-gray-700 bg-opacity-90 text-white rounded-lg py-2.5 px-4 max-w-[85%] shadow-md">
                    <p className="text-sm text-center whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.actionButton && (
                    <button 
                      onClick={() => setIsAppointmentModalOpen(true)}
                      className="mt-3 bg-[#06c755] hover:bg-[#05b64b] transition-colors text-white text-sm py-1.5 px-5 rounded-full font-medium shadow-sm"
                    >
                      {message.actionButton}
                    </button>
                  )}
                </div>
              );

            } else if (message.type === 'text') {
              // 通常のテキストメッセージ
              // 最初の未読メッセージの位置を参照に設定
              const isFirstUnread = !message.isMe && !(message as TextMessage).isRead && 
                           !mockMessagesState.slice(0, index).some(m => m.type === 'text' && !m.isMe && !(m as TextMessage).isRead);
              
              return (
                <div 
                  key={message.id} 
                  ref={isFirstUnread ? unreadRef : null}
                  data-message-id={message.id} // Intersection Observerでメッセージを検出するための属性
                >
                  <ChatMessage
                    id={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    isMe={message.isMe}
                    isRead={message.isRead}
                    attachments={message.attachments}
                    avatar={message.avatar}
                    reactions={message.reactions}
                    isDeleted={message.isDeleted}
                    replyTo={message.replyTo}
                    onReactionAdd={handleReactionAdd}
                    onMessageDelete={handleMessageDelete}
                    onReply={handleReply}
                  />
                  {isFirstUnread && (
                    <div className="w-full flex justify-center my-2">
                      <div className="bg-[#06c755] bg-opacity-10 text-[#06c755] px-3 py-1 rounded-full text-xs">
                        ここから未読メッセージ
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return null; // 未知のメッセージタイプの場合
          })}
          
          {/* メッセージの最後にスクロール位置の参照点を配置 - より明確な高さと位置を指定 */}
          <div ref={messagesEndRef} style={{ height: '20px', margin: '20px 0 40px', opacity: 0 }} />
        </div>
        </div>
      </div>

      {/* チャット入力フォーム - 固定配置 */}
      <div className="bg-white border-t border-gray-200 py-2 px-3 w-full fixed bottom-0 left-0 right-0 z-10 shadow-md" style={{ maxWidth: '100vw' }}>
        {replyingTo && (
          <div className="flex items-center justify-between bg-gray-100 rounded-md p-2 mb-2 border-l-2 border-[#06c755]">
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500">返信先:</p>
              <p className="text-xs font-medium text-gray-700 truncate">{replyingTo.content}</p>
            </div>
            <button 
              onClick={handleCancelReply}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <ChatInput 
          onSendMessage={handleSendMessage}
          isReplying={!!replyingTo}
        />
        
        {/* 入力中表示 - LINE風タイピングインジケーター */}
        {isTyping && (
          <div className="absolute top-0 left-0 right-0 -translate-y-full p-1 bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 animate-pulse">
              <span className="inline-block mr-1 w-1.5 h-1.5 bg-[#06c755] rounded-full animate-pulse"></span>
              <span className="inline-block mr-1 w-1.5 h-1.5 bg-[#06c755] rounded-full animate-[pulse_1.5s_0.2s_infinite]"></span>
              <span className="inline-block mr-1 w-1.5 h-1.5 bg-[#06c755] rounded-full animate-[pulse_1.5s_0.4s_infinite]"></span>
              相手が入力中...
            </p>
          </div>
        )}
      </div>
      
      {/* 約束機能モーダル */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        partnerId={chatId}
        partnerName={mockUser.name}
        partnerImage={mockUser.avatar || '/images/avatar-placeholder.jpg'}
      />
    </div>
  );
}
