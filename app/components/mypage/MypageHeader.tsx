"use client";

import React, { useContext } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaUserCircle, FaCog } from 'react-icons/fa';
import { UserContext } from '../../../components/UserContext';

/**
 * マイページ専用の簡易ヘッダーコンポーネント
 * シンプルで使いやすいUIを提供
 */
export default function MypageHeader() {
  const userContext = useContext(UserContext);
  const userName = userContext?.user?.name || 'ゲスト';

  return (
    <motion.header 
      className="py-3 px-4 flex justify-between items-center bg-white shadow-sm fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 左側のアイコン */}
      <div className="flex space-x-3">
        <Link href="/help" className="text-gray-500 hover:text-teal-500 transition-colors">
          <FaQuestionCircle size={24} />
        </Link>
        <Link href="/mypage/profile" className="text-gray-500 hover:text-teal-500 transition-colors">
          <FaUserCircle size={24} />
        </Link>
      </div>

      {/* 中央のロゴまたはタイトル */}
      <motion.div 
        className="font-semibold text-teal-500 text-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        マイページ
      </motion.div>

      {/* 右側の設定アイコン */}
      <Link href="/mypage/settings" className="text-gray-500 hover:text-teal-500 transition-colors">
        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <FaCog size={24} />
        </motion.div>
      </Link>
    </motion.header>
  );
}
