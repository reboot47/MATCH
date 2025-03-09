"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from '../../../components/UserContext';
import { FaMars, FaVenus } from 'react-icons/fa';

/**
 * 開発モードでのみ表示される性別切り替えボタン
 * 本番環境では表示されません
 */
export default function GenderToggle() {
  const userContext = useContext(UserContext);
  
  if (!userContext) return null;
  
  const isMale = userContext.isGenderMale();
  
  const handleToggle = () => {
    userContext.toggleGender();
  };
  
  // 環境変数でこれが開発モードかどうかをチェック（本番環境では表示しない）
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) return null;
  
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <motion.button
        onClick={handleToggle}
        className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg 
                   ${isMale ? 'bg-blue-600' : 'bg-pink-500'} text-white
                   border-2 border-white`}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isMale ? <FaMars size={16} /> : <FaVenus size={16} />}
      </motion.button>
      <div className="absolute -top-6 left-0 bg-gray-800 bg-opacity-80 px-2 py-1 rounded-md text-xs text-white whitespace-nowrap">
        {isMale ? '男性' : '女性'}モード
      </div>
    </div>
  );
}
