'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { RiFootprintLine } from 'react-icons/ri';
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

// 足あとの種類
type FootprintType = 'received';

// 足あとのユーザーカードコンポーネント
const FootprintCard = ({ user, onLike }) => {
  const formattedDate = user.visitDate
    ? formatDistanceToNow(new Date(user.visitDate), { addSuffix: true, locale: ja })
    : '';

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg shadow-sm p-4 mb-3"
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
                <FiUser size={24} />
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
        
        <button 
          onClick={() => onLike(user.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            user.isLiked 
              ? 'bg-pink-50 text-pink-500' 
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          } transition-colors`}
        >
          {user.isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>
      </div>
    </motion.div>
  );
};

// 足あとページコンポーネント
export default function FootprintsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [footprints, setFootprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ユーザー認証状態の確認
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetchFootprints();
    }
  }, [status, session, router]);
  
  // 足あとデータを取得
  const fetchFootprints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}/footprints/received`);
      
      if (response.ok) {
        const data = await response.json();
        setFootprints(data);
      }
    } catch (error) {
      console.error('足あとの取得に失敗しました', error);
    } finally {
      setLoading(false);
    }
  };
  
  // いいねボタンクリック時の処理
  const handleLike = async (userId: string) => {
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
        // いいねが成功したら、その足あとユーザーのいいね状態を更新
        setFootprints(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, isLiked: true } 
              : user
          )
        );
      }
    } catch (error) {
      console.error('いいねの送信に失敗しました', error);
    }
  };
  
  return (
    <main className="container max-w-xl mx-auto p-4 min-h-screen bg-gray-50">
      {loading ? (
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
      ) : (
        <>
          {/* ヘッダー部分 */}
          <div className="flex items-center mb-5">
            <button 
              onClick={() => router.push('/mypage')} 
              className="mr-3 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm"
            >
              <AiOutlineArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold flex-1">足あと</h1>
          </div>
          
          {/* 足あとリスト */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {footprints.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                  <RiFootprintLine size={24} />
                </div>
                <p className="text-gray-500 font-medium">
                  足あとはありません
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  あなたのプロフィールを見たユーザーが表示されます
                </p>
              </div>
            ) : (
              footprints.map((user) => (
                <FootprintCard
                  key={user.id}
                  user={user}
                  onLike={handleLike}
                />
              ))
            )}
          </motion.div>
        </>
      )}
    </main>
  );
}
