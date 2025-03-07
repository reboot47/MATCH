"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlay, FaLock, FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';
import BottomNavigation from '../components/BottomNavigation';

// コンテンツの型定義
interface DiscoveryContent {
  id: string;
  userId: string;
  userName: string;
  age: number;
  contentType: 'image' | 'video';
  thumbnailUrl: string;
  contentUrl: string;
  isLocked: boolean;
  pointsToUnlock: number;
  likes: number;
  description?: string;
  postedAt: string;
}

// モックのコンテンツデータ
const mockContents: DiscoveryContent[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'みーしゃん',
    age: 22,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/1.jpg',
    contentUrl: '/images/dummy/thumbnails/1.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 24,
    postedAt: '2時間前'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'まりこ',
    age: 25,
    contentType: 'video',
    thumbnailUrl: '/images/dummy/thumbnails/2.jpg', // 実際に存在する画像に変更
    contentUrl: '/videos/gallery/vid1.mp4',
    isLocked: true,
    pointsToUnlock: 20,
    likes: 156,
    description: '今日のランチ🍣',
    postedAt: '3時間前'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'あおい',
    age: 20,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/3.jpg',
    contentUrl: '/images/dummy/thumbnails/3.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 83,
    postedAt: '5時間前'
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'さくら',
    age: 23,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/4.jpg',
    contentUrl: '/images/dummy/thumbnails/4.jpg', // 実際に存在する画像に変更
    isLocked: true,
    pointsToUnlock: 15,
    likes: 47,
    description: '昨日の夜景✨',
    postedAt: '1日前'
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'ひなた',
    age: 26,
    contentType: 'video',
    thumbnailUrl: '/images/dummy/thumbnails/5.jpg', // 実際に存在する画像に変更
    contentUrl: '/videos/gallery/vid2.mp4',
    isLocked: true,
    pointsToUnlock: 25,
    likes: 201,
    description: 'おはよう☀️今日のコーデ',
    postedAt: '6時間前'
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'るみ',
    age: 24,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/6.jpg',
    contentUrl: '/images/dummy/thumbnails/6.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 118,
    postedAt: '1日前'
  },
  {
    id: '7',
    userId: 'user7',
    userName: 'みき',
    age: 21,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/7.jpg',
    contentUrl: '/images/dummy/thumbnails/7.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 64,
    postedAt: '2日前'
  },
  {
    id: '8',
    userId: 'user8',
    userName: 'えみり',
    age: 27,
    contentType: 'video',
    thumbnailUrl: '/images/dummy/thumbnails/8.jpg', // 実際に存在する画像に変更
    contentUrl: '/videos/gallery/vid3.mp4',
    isLocked: true,
    pointsToUnlock: 30,
    likes: 243,
    description: 'カラオケ動画🎤',
    postedAt: '8時間前'
  },
  {
    id: '9',
    userId: 'user9',
    userName: 'ゆか',
    age: 22,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/9.jpg',
    contentUrl: '/images/dummy/thumbnails/9.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 91,
    postedAt: '1日前'
  },
  {
    id: '10',
    userId: 'user10',
    userName: 'ありさ',
    age: 23,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/10.jpg',
    contentUrl: '/images/dummy/thumbnails/10.jpg', // 実際に存在する画像に変更
    isLocked: true,
    pointsToUnlock: 15,
    likes: 75,
    description: '新しい水着👙',
    postedAt: '2日前'
  },
  {
    id: '11',
    userId: 'user11',
    userName: 'まな',
    age: 25,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/avatar1.jpg',
    contentUrl: '/images/dummy/thumbnails/avatar1.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 107,
    postedAt: '3日前'
  },
  {
    id: '12',
    userId: 'user12',
    userName: 'かな',
    age: 24,
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/avatar2.jpg',
    contentUrl: '/images/dummy/thumbnails/avatar2.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 52,
    postedAt: '1日前'
  }
];

export default function DiscoveryPage() {
  const router = useRouter();
  const { user, points } = useUser();
  const [contents, setContents] = useState<DiscoveryContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<DiscoveryContent | null>(null);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);

  useEffect(() => {
    const fetchContents = async () => {
      // 実際の実装ではAPIからデータを取得
      try {
        // const response = await fetch('/api/discovery');
        // const data = await response.json();
        
        // モックデータを使用
        setContents(mockContents);
      } catch (error) {
        console.error('ギャラリーの取得に失敗しました:', error);
        toast.error('コンテンツの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContents();
  }, []);

  // コンテンツをタップした時の処理
  const handleContentClick = (content: DiscoveryContent) => {
    setSelectedContent(content);
    
    // ロックされたコンテンツの場合
    if (content.isLocked) {
      setShowUnlockConfirm(true);
    } else {
      // ロックされていない場合は詳細ページに遷移
      router.push(`/discovery/${content.id}`);
    }
  };

  // ロック解除処理
  const handleUnlock = async () => {
    if (!user || !selectedContent) return;
    
    // 男性ユーザーの場合のみポイント消費
    if (user.gender === '男性') {
      // ポイント残高チェック
      if (!points || points.balance < selectedContent.pointsToUnlock) {
        toast.error(`ポイントが不足しています。必要ポイント: ${selectedContent.pointsToUnlock}`);
        setShowUnlockConfirm(false);
        router.push('/points/purchase');
        return;
      }
      
      try {
        // 実際の実装ではAPIを呼び出してポイント消費処理
        // await fetch('/api/points/consume', {...});
        
        toast.success(`${selectedContent.pointsToUnlock}ポイントを消費しました`);
        
        // コンテンツのロックを解除して詳細ページに遷移
        router.push(`/discovery/${selectedContent.id}`);
      } catch (error) {
        console.error('ポイント消費エラー:', error);
        toast.error('ポイント消費に失敗しました');
      }
    } else {
      // 女性ユーザーの場合はポイント消費なしで詳細ページに遷移
      router.push(`/discovery/${selectedContent.id}`);
    }
    
    setShowUnlockConfirm(false);
  };

  // 投稿ボタンのクリック
  const handlePostClick = () => {
    if (!user) {
      toast.error('ログインが必要です');
      return;
    }
    
    router.push('/discovery/create');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      
      {/* ヘッダー */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-center flex-1">発見</h1>
          <button 
            className="p-2 text-primary-500"
            onClick={() => router.push('/discovery/search')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-16 px-1">
        {/* コンテンツグリッド */}
        <div className="grid grid-cols-3 gap-1">
          {contents.map((content) => (
            <div 
              key={content.id}
              className="relative aspect-square cursor-pointer overflow-hidden"
              onClick={() => handleContentClick(content)}
            >
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity z-10"></div>
              
              {/* サムネイル画像 */}
              <div className="relative w-full h-full">
                <Image
                  src={content.thumbnailUrl}
                  alt={`${content.userName}のコンテンツ`}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  priority={content.thumbnailUrl === '/images/dummy/thumbnails/6.jpg' || 
                          content.thumbnailUrl === '/images/dummy/thumbnails/10.jpg' || 
                          parseInt(content.id) <= 6}
                />
              </div>
              
              {/* 動画マーク */}
              {content.contentType === 'video' && (
                <div className="absolute top-2 right-2 z-20">
                  <FaPlay className="text-white drop-shadow-lg" />
                </div>
              )}
              
              {/* ロックマーク */}
              {content.isLocked && (
                <div className="absolute top-2 left-2 z-20 flex items-center">
                  <FaLock className="text-white drop-shadow-lg" />
                  <span className="ml-1 text-xs text-white font-medium drop-shadow-lg">
                    {content.pointsToUnlock}pt
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 投稿ボタン */}
      <motion.button
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg z-30"
        whileTap={{ scale: 0.95 }}
        onClick={handlePostClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </motion.button>
      
      {/* ロック解除確認モーダル */}
      {showUnlockConfirm && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-lg p-5 w-full max-w-xs"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-center">コンテンツのロック解除</h3>
            
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedContent.thumbnailUrl}
                alt="ロック解除するコンテンツ"
                fill
                sizes="300px"
                style={{ objectFit: 'cover' }}
              />
              {selectedContent.contentType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaPlay className="text-white text-4xl drop-shadow-lg" />
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-1">{selectedContent.userName} ({selectedContent.age})</p>
            {selectedContent.description && (
              <p className="text-sm text-gray-700 mb-3">{selectedContent.description}</p>
            )}
            
            {user?.gender === '男性' && (
              <p className="text-center text-red-500 mb-4">
                ロック解除には{selectedContent.pointsToUnlock}ポイント必要です
              </p>
            )}
            
            <div className="flex space-x-3">
              <button 
                className="flex-1 py-2 bg-gray-200 rounded-md text-gray-700"
                onClick={() => setShowUnlockConfirm(false)}
              >
                キャンセル
              </button>
              <button 
                className="flex-1 py-2 bg-primary-500 text-white rounded-md"
                onClick={handleUnlock}
              >
                ロック解除
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* フッターナビゲーション */}
      <BottomNavigation />
    </div>
  );
}
