'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

type CreateRecruitmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isMale: boolean;
};

export default function CreateRecruitmentModal({ isOpen, onClose, isMale }: CreateRecruitmentModalProps) {
  const router = useRouter();

  // モーダルのアニメーション設定
  const modalVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } }
  };
  
  // 背景のアニメーション設定
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  // 「今すぐ会いたい」をクリック
  const handleNowClick = () => {
    if (isMale) {
      // 男性ユーザーの場合、ポイント消費の確認
      const confirmUsePoints = confirm('この機能には50ポイントが必要です。利用しますか？');
      if (confirmUsePoints) {
        router.push('/recruitment/create?type=now');
      }
    } else {
      // 女性ユーザーの場合、ポイント獲得の通知
      alert('募集を作成すると、マッチング成立時に300ポイント獲得できます！');
      router.push('/recruitment/create?type=now');
    }
  };

  // 「日付指定する」をクリック
  const handleDateClick = () => {
    if (isMale) {
      // 男性ユーザーの場合、ポイント消費の確認
      const confirmUsePoints = confirm('この機能には30ポイントが必要です。利用しますか？');
      if (confirmUsePoints) {
        router.push('/recruitment/create?type=date');
      }
    } else {
      // 女性ユーザーの場合、ポイント獲得の通知
      alert('募集を作成すると、マッチング成立時に200ポイント獲得できます！');
      router.push('/recruitment/create?type=date');
    }
  };
  
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
    >
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <motion.div
        className="relative w-full max-w-lg bg-white rounded-t-2xl p-6 pb-8"
        variants={modalVariants}
      >
        {/* 閉じるボタン */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <IoClose size={24} />
        </button>
        
        <h2 className="text-xl font-bold text-center mb-6">募集する</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* 今すぐ会いたいボタン */}
          <button
            onClick={handleNowClick}
            className="flex flex-col items-center justify-center p-6 border-2 border-pink-400 rounded-xl bg-white hover:bg-pink-50 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <FaClock className="text-pink-500 text-2xl" />
            </div>
            <span className="text-lg font-medium text-pink-700">今すぐ会いたい</span>
            {isMale ? (
              <span className="text-xs mt-2 text-gray-500">50ポイント消費</span>
            ) : (
              <span className="text-xs mt-2 text-gray-500">300ポイント獲得可能</span>
            )}
          </button>
          
          {/* 日付指定するボタン */}
          <button
            onClick={handleDateClick}
            className="flex flex-col items-center justify-center p-6 border-2 border-cyan-400 rounded-xl bg-white hover:bg-cyan-50 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
              <FaCalendarAlt className="text-cyan-500 text-2xl" />
            </div>
            <span className="text-lg font-medium text-cyan-700">日付指定する</span>
            {isMale ? (
              <span className="text-xs mt-2 text-gray-500">30ポイント消費</span>
            ) : (
              <span className="text-xs mt-2 text-gray-500">200ポイント獲得可能</span>
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isMale 
              ? '※ポイント消費は募集が承認された時点で行われます' 
              : '※ポイント獲得はマッチング成立時に行われます'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isMale
              ? 'プレミアム会員は半額で利用できます' 
              : '特別会員はボーナスポイントが25%追加されます'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
