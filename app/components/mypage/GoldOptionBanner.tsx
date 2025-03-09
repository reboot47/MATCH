"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCrown, FaChevronRight } from 'react-icons/fa';
import { UserContext } from '../../../components/UserContext';

export default function GoldOptionBanner() {
  const userContext = useContext(UserContext);
  
  // ユーザーの性別に基づいて異なるメッセージとオプションを表示
  const isMale = userContext?.isGenderMale ? userContext.isGenderMale() : true;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mr-3">
            <FaCrown className="text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {isMale ? "プレミアムプラン" : "特別報酬プラン"}
            </h3>
            <p className="text-sm text-gray-600">
              {isMale 
                ? "マッチング率UP！特別な機能を解放" 
                : "ポイント還元率UP！特別報酬を獲得"}
            </p>
          </div>
        </div>
        
        <Link href={isMale ? "/premium-plan" : "/premium-rewards"}>
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-teal-500"
          >
            <span className="mr-1 text-sm font-medium">
              {isMale ? "詳細を見る" : "特典を見る"}
            </span>
            <FaChevronRight size={12} />
          </motion.div>
        </Link>
      </div>
      
      {/* キャンペーン表示 */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-teal-500 font-bold">期間限定</span>
            <span className="text-sm ml-2 text-gray-700">
              {isMale ? "50%オフキャンペーン中！" : "ポイント2倍キャンペーン中！"}
            </span>
          </div>
          <Link href={isMale ? "/premium-campaign" : "/premium-points-campaign"}>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-400 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
            >
              {isMale ? "今すぐ登録" : "詳細を見る"}
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
