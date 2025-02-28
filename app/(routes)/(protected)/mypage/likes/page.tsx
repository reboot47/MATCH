'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';
import { getProfileImageUrl } from '@/app/utils/imageUtils';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

// アニメーション定義
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  }
};

// いいねの種類
type LikeType = 'sent' | 'received';

// いいねのタブコンポーネント
const LikeTabs = ({ activeTab, onTabChange }) => (
  <div className="flex mb-5 bg-gray-100 p-1 rounded-full">
    <button
      className={`flex-1 py-2 rounded-full text-center transition-all ${
        activeTab === 'received' ? 'bg-white shadow-sm text-teal-600 font-medium' : 'text-gray-600'
      }`}
      onClick={() => onTabChange('received')}
    >
      もらったいいね
    </button>
    <button
      className={`flex-1 py-2 rounded-full text-center transition-all ${
        activeTab === 'sent' ? 'bg-white shadow-sm text-teal-600 font-medium' : 'text-gray-600'
      }`}
      onClick={() => onTabChange('sent')}
    >
      送ったいいね
    </button>
  </div>
);

// ユーザーカードコンポーネント
const UserCard = ({ user, type, onAction }) => {
  const formattedDate = user.likeDate
    ? formatDistanceToNow(new Date(user.likeDate), { addSuffix: true, locale: ja })
    : '';
  
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg shadow-sm p-4 mb-3 relative"
    >
      <div className="flex items-center">
        <Link href={`/user/${user.id}`}>
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {user.image ? (
              <Image
                src={getProfileImageUrl(user.image)}
                alt={user.name || '名前なし'}
                fill
                sizes="64px"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                No Image
              </div>
            )}
          </div>
        </Link>
        
        <div className="ml-4 flex-1">
          <Link href={`/user/${user.id}`}>
            <h3 className="font-medium text-lg">{user.name || '名前なし'}</h3>
          </Link>
          <div className="text-sm text-gray-500">
            {user.age && `${user.age}歳`}{user.age && user.location && ' • '}{user.location}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {formattedDate}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {type === 'received' && (
            <>
              <button 
                onClick={() => onAction(user.id, 'message')}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-50 text-teal-500 hover:bg-teal-100 transition-colors"
              >
                <FiMessageCircle size={18} />
              </button>
              <button 
                onClick={() => onAction(user.id, 'like')}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  user.isMatched 
                    ? 'bg-pink-50 text-pink-500'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                } transition-colors`}
              >
                {user.isMatched ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              </button>
            </>
          )}
          {type === 'sent' && (
            <div className={`px-3 py-1 rounded-full text-xs ${
              user.isMatched ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {user.isMatched ? 'マッチ済み' : 'いいね済み'}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// いいねページコンポーネント
export default function LikesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<LikeType>('received');
  const [sentLikes, setSentLikes] = useState<any[]>([]);
  const [receivedLikes, setReceivedLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ユーザー認証状態の確認
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetchLikes();
    }
  }, [status, session, router, activeTab]);
  
  // いいねデータを取得
  const fetchLikes = async () => {
    setLoading(true);
    try {
      // 送ったいいねを取得
      const sentResponse = await fetch(`/api/users/${session.user.id}/likes/sent`);
      
      // 受け取ったいいねを取得
      const receivedResponse = await fetch(`/api/users/${session.user.id}/likes/received`);
      
      if (sentResponse.ok && receivedResponse.ok) {
        const sentData = await sentResponse.json();
        const receivedData = await receivedResponse.json();
        
        setSentLikes(sentData);
        setReceivedLikes(receivedData);
      }
    } catch (error) {
      console.error('いいねの取得に失敗しました', error);
    } finally {
      setLoading(false);
    }
  };
  
  // アクション（メッセージ送信、いいね返し）の処理
  const handleAction = async (userId: string, action: 'message' | 'like') => {
    if (action === 'message') {
      router.push(`/messages/${userId}`);
    } else if (action === 'like') {
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
          // いいねが成功したら、データを再取得
          fetchLikes();
        }
      } catch (error) {
        console.error('いいねの送信に失敗しました', error);
      }
    }
  };
  
  // 表示するリスト
  const displayLikes = activeTab === 'sent' ? sentLikes : receivedLikes;
  
  return (
    <main className="container max-w-xl mx-auto p-4 min-h-screen bg-gray-50">
      {/* ヘッダー部分 */}
      <div className="flex items-center mb-5">
        <button 
          onClick={() => router.push('/mypage')} 
          className="mr-3 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm"
        >
          <AiOutlineArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold flex-1">いいね</h1>
      </div>
      
      {/* いいねタブ */}
      <LikeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* いいねリスト */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : displayLikes.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
              <FaRegHeart size={24} />
            </div>
            <p className="text-gray-500 font-medium">
              {activeTab === 'received' ? 'まだいいねはありません' : 'まだいいねを送っていません'}
            </p>
            {activeTab === 'received' && (
              <p className="text-gray-400 text-sm mt-2">
                他のユーザーからいいねをもらうと表示されます
              </p>
            )}
            {activeTab === 'sent' && (
              <p className="text-gray-400 text-sm mt-2">
                他のユーザーにいいねを送ると表示されます
              </p>
            )}
          </div>
        ) : (
          displayLikes.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              type={activeTab}
              onAction={handleAction}
            />
          ))
        )}
      </motion.div>
    </main>
  );
}
