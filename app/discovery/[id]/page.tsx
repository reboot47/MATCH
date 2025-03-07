"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHeart, FaRegHeart, FaComment, FaUserPlus, FaPlay } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';

// コンテンツの型定義
interface DiscoveryContent {
  id: string;
  userId: string;
  userName: string;
  age: number;
  location: string;
  profileImage: string;
  contentType: 'image' | 'video';
  thumbnailUrl: string;
  contentUrl: string;
  isLocked: boolean;
  pointsToUnlock: number;
  likes: number;
  description?: string;
  postedAt: string;
  comments?: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  profileImage: string;
  content: string;
  postedAt: string;
}

// モックのコンテンツデータ
const mockContents: Record<string, DiscoveryContent> = {
  '1': {
    id: '1',
    userId: 'user1',
    userName: 'みーしゃん',
    age: 22,
    location: '東京都',
    profileImage: '/images/profile/user1.jpg',
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/1.jpg',
    contentUrl: '/images/dummy/thumbnails/1.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 24,
    description: '今日も元気に出勤！今日のコーデはどうかな？💕',
    postedAt: '2時間前',
    comments: [
      {
        id: 'c1',
        userId: 'user5',
        userName: 'たろう',
        profileImage: '/images/profile/user5.jpg',
        content: 'おしゃれだね！似合ってるよ👍',
        postedAt: '1時間前'
      },
      {
        id: 'c2',
        userId: 'user6',
        userName: 'けんた',
        profileImage: '/images/profile/user6.jpg',
        content: '今日も可愛いね！✨',
        postedAt: '30分前'
      }
    ]
  },
  '2': {
    id: '2',
    userId: 'user2',
    userName: 'まりこ',
    age: 25,
    location: '神奈川県',
    profileImage: '/images/profile/user2.jpg',
    contentType: 'video',
    thumbnailUrl: '/images/dummy/thumbnails/2.jpg', // 実際に存在する画像に変更
    contentUrl: '/videos/gallery/vid1.mp4',
    isLocked: true,
    pointsToUnlock: 20,
    likes: 156,
    description: '今日のランチ🍣特上寿司おいしかった！',
    postedAt: '3時間前',
    comments: []
  },
  '3': {
    id: '3',
    userId: 'user3',
    userName: 'あおい',
    age: 20,
    location: '大阪府',
    profileImage: '/images/profile/user3.jpg',
    contentType: 'image',
    thumbnailUrl: '/images/dummy/thumbnails/3.jpg',
    contentUrl: '/images/dummy/thumbnails/3.jpg', // 実際に存在する画像に変更
    isLocked: false,
    pointsToUnlock: 0,
    likes: 83,
    description: 'プールサイドでまったり☀️',
    postedAt: '5時間前',
    comments: [
      {
        id: 'c3',
        userId: 'user7',
        userName: 'しょうた',
        profileImage: '/images/profile/user7.jpg',
        content: '楽しそう！いいところだね！',
        postedAt: '4時間前'
      }
    ]
  }
  // 他のコンテンツも同様に定義...
};

export default function DiscoveryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useUser();
  const [content, setContent] = useState<DiscoveryContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  // いいね状態の切り替え
  const toggleLike = () => {
    if (!user) {
      toast.error('ログインが必要です');
      return;
    }
    
    setLiked(!liked);
    if (!liked) {
      toast.success('いいねしました！');
      // 実際の実装ではAPIを呼び出していいね処理
      // await fetch('/api/discovery/like', {...});
    }
  };

  // コメント送信
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('ログインが必要です');
      return;
    }
    
    if (!commentText.trim()) {
      toast.error('コメントを入力してください');
      return;
    }
    
    // 実際の実装ではAPIを呼び出してコメント送信
    // await fetch('/api/discovery/comment', {...});
    
    toast.success('コメントを送信しました！');
    setCommentText('');
    
    // モックデータ更新
    if (content && content.comments) {
      const newComment: Comment = {
        id: `c${content.comments.length + 1}`,
        userId: user.id || 'temp',
        userName: user.name || 'ゲスト',
        profileImage: user.profileImage || '/images/profile/default.jpg',
        content: commentText,
        postedAt: 'たった今'
      };
      
      setContent({
        ...content,
        comments: [...content.comments, newComment]
      });
    }
  };

  // 投稿者をフォローする
  const handleFollow = () => {
    if (!user || !content) {
      toast.error('ログインが必要です');
      return;
    }
    
    // 実際の実装ではAPIを呼び出してフォロー処理
    // await fetch('/api/follow', {...});
    
    toast.success(`${content.userName}さんをフォローしました！`);
  };

  useEffect(() => {
    const fetchContent = async () => {
      // 実際の実装ではAPIからデータを取得
      try {
        // const response = await fetch(`/api/discovery/${id}`);
        // const data = await response.json();
        
        // モックデータを使用
        const data = mockContents[id];
        
        if (!data) {
          toast.error('コンテンツが見つかりませんでした');
          router.push('/discovery');
          return;
        }
        
        setContent(data);
      } catch (error) {
        console.error('コンテンツ取得エラー:', error);
        toast.error('コンテンツの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <p className="text-gray-600 mb-4">コンテンツが見つかりませんでした</p>
        <button 
          className="px-4 py-2 bg-primary-500 text-white rounded-md"
          onClick={() => router.push('/discovery')}
        >
          発見ページに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      
      
      {/* ヘッダー */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-50">
        <div className="flex items-center justify-between p-4">
          <button 
            className="p-2 text-white"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1"></div>
          <div className="w-9"></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-16 pb-20">
        {/* コンテンツ表示 */}
        <div className="relative w-full aspect-square bg-black">
          {content.contentType === 'image' ? (
            <Image
              src={content.contentUrl}
              alt={content.description || `${content.userName}のコンテンツ`}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={content.thumbnailUrl}
                  alt={content.description || `${content.userName}のコンテンツ`}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'contain' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-white bg-opacity-30 flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay className="text-white text-3xl ml-2" />
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* ユーザー情報とアクションボタン */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <Link href={`/user/${content.userId}`}>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src={content.profileImage}
                    alt={content.userName}
                    fill
                    sizes="48px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h2 className="font-medium">{content.userName}</h2>
                  <p className="text-sm text-gray-500">{content.age}歳 {content.location}</p>
                </div>
              </div>
            </Link>
            
            <motion.button
              className="px-3 py-1.5 bg-primary-100 text-primary-500 rounded-full text-sm font-medium flex items-center"
              whileTap={{ scale: 0.95 }}
              onClick={handleFollow}
            >
              <FaUserPlus className="mr-1" />
              フォロー
            </motion.button>
          </div>
          
          {/* 投稿内容 */}
          <p className="mb-4 text-gray-800 whitespace-pre-line">{content.description}</p>
          
          {/* アクションボタン */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center">
              <motion.button
                className="flex items-center mr-6"
                whileTap={{ scale: 0.95 }}
                onClick={toggleLike}
              >
                {liked ? (
                  <FaHeart className="text-red-500 mr-1 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-500 mr-1 text-xl" />
                )}
                <span className="text-gray-700">{liked ? content.likes + 1 : content.likes}</span>
              </motion.button>
              
              <motion.button
                className="flex items-center"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComments(!showComments)}
              >
                <FaComment className="text-gray-500 mr-1 text-xl" />
                <span className="text-gray-700">{content.comments?.length || 0}</span>
              </motion.button>
            </div>
            
            <span className="text-gray-500 text-sm">{content.postedAt}</span>
          </div>
        </div>
        
        {/* コメント表示領域 */}
        {showComments && (
          <div className="bg-gray-50 p-4">
            <h3 className="font-medium mb-4">コメント ({content.comments?.length || 0})</h3>
            
            {/* コメント入力フォーム */}
            <form onSubmit={handleSubmitComment} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  placeholder="コメントを入力..."
                  className="flex-1 border border-gray-200 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary-500 text-white py-2 px-4 rounded-r-lg"
                >
                  送信
                </button>
              </div>
            </form>
            
            {/* コメント一覧 */}
            <div className="space-y-4">
              {content.comments && content.comments.length > 0 ? (
                content.comments.map((comment) => (
                  <div key={comment.id} className="flex">
                    <Link href={`/user/${comment.userId}`}>
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <Image
                          src={comment.profileImage}
                          alt={comment.userName}
                          fill
                          sizes="40px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="bg-white p-3 rounded-lg">
                        <Link href={`/user/${comment.userId}`}>
                          <p className="font-medium">{comment.userName}</p>
                        </Link>
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{comment.postedAt}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">コメントはまだありません</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
