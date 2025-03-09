"use client";

import React, { useContext } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserContext } from '../../../components/UserContext';
import { 
  HiOutlineLightningBolt, 
  HiOutlineCamera, 
  HiOutlineUserCircle, 
  HiOutlineChatAlt2,
  HiOutlineStar,
  HiOutlineHeart
} from 'react-icons/hi';

type PromotionCard = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  bgGradient: string;
  link: string;
  gender?: 'male' | 'female' | 'all';
};

const promotions: PromotionCard[] = [
  {
    id: 'points-buy',
    title: 'ポイント購入',
    description: 'メッセージの送信や特別な機能のご利用にポイントが必要です。',
    buttonText: 'ポイントを購入する',
    icon: <HiOutlineLightningBolt className="w-12 h-12 text-white" />,
    bgGradient: 'from-blue-400 to-teal-500',
    link: '/mypage/points/buy',
    gender: 'male'
  },
  {
    id: 'points-earn',
    title: 'ポイント獲得',
    description: 'プロフィール充実やログインでポイントを獲得できます。',
    buttonText: 'ポイントを獲得する',
    icon: <HiOutlineLightningBolt className="w-12 h-12 text-white" />,
    bgGradient: 'from-yellow-400 to-orange-500',
    link: '/mypage/points/earn',
    gender: 'female'
  },
  {
    id: 'profile',
    title: 'プロフィール編集',
    description: '魅力的なプロフィールで出会いの確率を上げましょう。',
    buttonText: 'プロフィールを編集',
    icon: <HiOutlineUserCircle className="w-12 h-12 text-white" />,
    bgGradient: 'from-teal-400 to-emerald-500',
    link: '/mypage/profile/edit',
    gender: 'all'
  },
  {
    id: 'photos',
    title: '写真を追加',
    description: '写真があると連絡が来る確率が5倍になります。',
    buttonText: '写真を追加する',
    icon: <HiOutlineCamera className="w-12 h-12 text-white" />,
    bgGradient: 'from-purple-400 to-indigo-500',
    link: '/mypage/profile/photos',
    gender: 'all'
  },
  {
    id: 'message-tips',
    title: 'メッセージのコツ',
    description: '返信率が高まるメッセージのコツをマスターしましょう。',
    buttonText: 'コツを見る',
    icon: <HiOutlineChatAlt2 className="w-12 h-12 text-white" />,
    bgGradient: 'from-pink-400 to-red-500',
    link: '/tips/messaging',
    gender: 'male'
  },
  {
    id: 'rewards',
    title: '特別報酬',
    description: '人気会員になると特別な報酬を受け取れます。',
    buttonText: '報酬を確認',
    icon: <HiOutlineStar className="w-12 h-12 text-white" />,
    bgGradient: 'from-pink-400 to-rose-500',
    link: '/rewards',
    gender: 'female'
  },
  {
    id: 'favorites',
    title: 'お気に入り',
    description: '気になるお相手をお気に入りに追加しましょう。',
    buttonText: 'お気に入りを見る',
    icon: <HiOutlineHeart className="w-12 h-12 text-white" />,
    bgGradient: 'from-red-400 to-pink-500',
    link: '/favorites',
    gender: 'all'
  },
];



export default function PromotionCards() {
  const userContext = useContext(UserContext);
  const isMale = userContext?.isGenderMale ? userContext.isGenderMale() : true;
  
  // ユーザーの性別に基づいてフィルタリング
  const filteredPromotions = promotions.filter(promo => {
    return promo.gender === 'all' || 
           (isMale && promo.gender === 'male') || 
           (!isMale && promo.gender === 'female');
  });
  
  return (
    <div className="space-y-4 mb-20">
      {filteredPromotions.map((promotion, index) => (
        <motion.div
          key={promotion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`bg-gradient-to-r ${promotion.bgGradient} rounded-lg overflow-hidden shadow`}
          whileHover={{ scale: 1.01 }}
        >
          <Link href={promotion.link}>
            <div className="p-4 relative">
              <div className="absolute top-4 right-4">
                <div className="relative">
                  {promotion.icon}
                </div>
              </div>
              <div className="pr-20">
                <h3 className="text-white text-lg font-bold mb-1">{promotion.title}</h3>
                <p className="text-white text-sm opacity-90 mb-3">{promotion.description}</p>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 transition text-white rounded-full px-4 py-2 text-sm font-medium inline-block"
                >
                  {promotion.buttonText}
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
