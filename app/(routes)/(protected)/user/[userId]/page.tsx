'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMapPin, 
  FiBriefcase,
  FiCalendar 
} from 'react-icons/fi';
import { 
  RiHeartLine, 
  RiHeartFill,
  RiArrowLeftLine,
  RiInformationLine,
  RiMore2Fill,
  RiUserSmileLine,
  RiChat1Line,
  RiBookmarkLine,
  RiBookmarkFill
} from 'react-icons/ri';
import { getProfileImageUrl } from '@/app/utils/imageUtils';

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

// ユーザープロフィールコンポーネント
export default function UserProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const params = useParams();
  const userId = params.userId as string;
  
  const [userData, setUserData] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // ユーザーデータの取得と足あとの記録
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      // 自分自身のプロフィールの場合はマイページにリダイレクト
      if (session.user.id === userId) {
        router.push('/mypage');
        return;
      }
      
      // ユーザーデータと写真を取得
      Promise.all([
        fetch(`/api/users/${userId}/profile`).then(res => {
          if (!res.ok) {
            throw new Error('ユーザー情報の取得に失敗しました');
          }
          return res.json();
        }),
        fetch(`/api/users/${userId}/photos`).then(res => {
          if (!res.ok) {
            throw new Error('写真の取得に失敗しました');
          }
          return res.json();
        }),
        fetch(`/api/users/${session.user.id}/likes/check/${userId}`).then(res => {
          if (!res.ok) {
            return { isLiked: false };
          }
          return res.json();
        }),
        fetch(`/api/users/${session.user.id}/favorites/check/${userId}`).then(res => {
          if (!res.ok) {
            return { isFavorited: false };
          }
          return res.json();
        })
      ])
      .then(([user, photos, likeStatus, favoriteStatus]) => {
        setUserData(user);
        setPhotos(photos);
        setIsLiked(likeStatus.isLiked);
        setIsFavorited(favoriteStatus.isFavorited);
        setLoading(false);
      })
      .catch(error => {
        console.error('データ取得エラー:', error);
        setLoading(false);
      });
      
      // 足あとを残す
      leaveFootprint();
    }
  }, [status, session, userId, router]);
  
  // 足あとを残す関数
  const leaveFootprint = async () => {
    if (status === 'authenticated' && session?.user?.id) {
      try {
        await fetch(`/api/users/${session.user.id}/footprints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitedId: userId
          }),
        });
      } catch (error) {
        console.error('足あと記録エラー:', error);
      }
    }
  };
  
  // いいねボタン処理
  const handleLike = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/users/${session.user.id}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: userId
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(true);
        
        // マッチした場合
        if (data.isMatched) {
          // マッチ通知などを表示
          showMatchNotification();
        }
      }
    } catch (error) {
      console.error('いいねエラー:', error);
    }
  };
  
  // お気に入りボタン処理
  const handleFavorite = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/users/${session.user.id}/favorites`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId: userId
        }),
      });
      
      if (response.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error('お気に入りエラー:', error);
    }
  };
  
  // マッチ通知表示処理
  const showMatchNotification = () => {
    // アニメーションやポップアップでマッチを祝福
    // 今回は実装省略
  };
  
  // 次の写真に進む
  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };
  
  // 前の写真に戻る
  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  
  // メッセージ画面に移動
  const goToChat = () => {
    router.push(`/messages/${userId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">読み込み中...</p>
        </motion.div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-5 bg-white rounded-lg shadow-sm"
        >
          <FiUser size={32} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-3">ユーザーが見つかりませんでした</p>
          <button 
            onClick={() => router.push('/search')}
            className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm"
          >
            ユーザーを探す
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ヘッダー */}
      <div className="relative">
        {/* 写真カルーセル */}
        <div className="relative h-[400px] w-full bg-gray-200 overflow-hidden">
          {photos.length > 0 ? (
            <motion.div
              key={activePhotoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={getProfileImageUrl(photos[activePhotoIndex].url)}
                alt={userData.name || 'プロフィール画像'}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
              
              {/* 写真ナビゲーションドット */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePhotoIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === activePhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* 写真スワイプエリア */}
              <div className="absolute inset-0 flex">
                <div className="w-1/3 h-full" onClick={prevPhoto} />
                <div className="w-1/3 h-full" />
                <div className="w-1/3 h-full" onClick={nextPhoto} />
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <FiUser size={64} className="text-gray-400" />
            </div>
          )}
          
          {/* ヘッダーコントロール */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white"
            >
              <RiArrowLeftLine size={20} />
            </button>
            
            <button
              onClick={handleFavorite}
              className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white"
            >
              {isFavorited ? <RiBookmarkFill size={20} /> : <RiBookmarkLine size={20} />}
            </button>
          </div>
        </div>
        
        {/* プロフィール基本情報 */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-t-3xl -mt-6 relative z-10 pt-5 px-5 pb-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                {userData.name}
                {userData.age && <span className="ml-2">{userData.age}歳</span>}
              </h1>
              
              {userData.location && (
                <div className="flex items-center text-gray-500 mt-1">
                  <FiMapPin size={14} className="mr-1" />
                  <span className="text-sm">{userData.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleLike}
                className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  isLiked 
                    ? 'bg-pink-100 text-pink-500'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isLiked ? <RiHeartFill size={22} /> : <RiHeartLine size={22} />}
              </button>
              
              <button
                onClick={goToChat}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white"
              >
                <RiChat1Line size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* プロフィール詳細 */}
      <motion.div
        variants={itemVariants}
        className="bg-white px-5 py-4 mt-2"
      >
        {userData.bio && (
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-1">自己紹介</h3>
            <p className="text-gray-800 whitespace-pre-line">{userData.bio}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 my-3">
          {userData.occupation && (
            <div className="flex items-center">
              <FiBriefcase size={16} className="text-gray-400 mr-2" />
              <span className="text-sm">{userData.occupation}</span>
            </div>
          )}
          
          {userData.height && (
            <div className="flex items-center">
              <RiUserSmileLine size={16} className="text-gray-400 mr-2" />
              <span className="text-sm">{userData.height}cm</span>
            </div>
          )}
          
          {userData.educationLevel && (
            <div className="flex items-center">
              <RiInformationLine size={16} className="text-gray-400 mr-2" />
              <span className="text-sm">{userData.educationLevel}</span>
            </div>
          )}
          
          {userData.drinking && (
            <div className="flex items-center">
              <RiInformationLine size={16} className="text-gray-400 mr-2" />
              <span className="text-sm">お酒: {userData.drinking}</span>
            </div>
          )}
        </div>
        
        {/* 趣味タグ */}
        {userData.interests && userData.interests.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-500 mb-2">趣味・興味</h3>
            <div className="flex flex-wrap gap-2">
              {userData.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
