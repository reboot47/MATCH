"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoGift } from 'react-icons/io5';
import { TiShoppingCart } from 'react-icons/ti';

type Gender = 'male' | 'female';

interface PointSystemProps {
  gender: Gender;
  currentPoints: number;
  requiredPoints: number;
  onPurchasePoints?: () => void;
  showPointsUsage?: boolean;
  lastPointTransaction?: {
    amount: number;
    type: 'spent' | 'earned';
    timestamp: Date;
  };
}

const PointSystem = ({
  gender,
  currentPoints,
  requiredPoints,
  onPurchasePoints,
  showPointsUsage = false,
  lastPointTransaction
}: PointSystemProps) => {
  const [showPointAnimation, setShowPointAnimation] = useState(false);
  const [pointNotification, setPointNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  
  // 最新のポイント取引に基づいて通知を表示
  useEffect(() => {
    if (lastPointTransaction && showPointsUsage) {
      setShowPointAnimation(true);
      
      const message = lastPointTransaction.type === 'spent'
        ? `${lastPointTransaction.amount}ポイントを消費しました`
        : `${lastPointTransaction.amount}ポイントを獲得しました`;
        
      setPointNotification({
        message,
        type: lastPointTransaction.type === 'spent' ? 'warning' : 'success'
      });
      
      // 3秒後に非表示
      const timer = setTimeout(() => {
        setShowPointAnimation(false);
        setPointNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastPointTransaction, showPointsUsage]);
  
  // ポイント不足かどうか
  const isPointsInsufficient = gender === 'male' && currentPoints < requiredPoints;

  return (
    <>
      {/* ポイント情報表示 */}
      <div className="bg-white p-2 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-600 px-2">
          <div>
            {gender === 'male' ? (
              <>
                <span className="font-medium">メッセージ送信：</span> {requiredPoints} ポイント
              </>
            ) : (
              <>
                <span className="font-medium">メッセージ受信：</span> +{requiredPoints} ポイント
              </>
            )}
          </div>
          <div className="flex items-center">
            <span className="font-medium">残り：</span> 
            <span className={`ml-1 ${isPointsInsufficient ? 'text-red-500' : 'text-teal-600'}`}>
              {currentPoints} ポイント
            </span>
            
            {gender === 'male' && isPointsInsufficient && (
              <button 
                className="ml-2 bg-teal-500 text-white text-xs px-2 py-1 rounded flex items-center"
                onClick={onPurchasePoints}
              >
                <TiShoppingCart className="mr-1" />
                購入
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* ポイント使用/獲得のアニメーション */}
      <AnimatePresence>
        {showPointAnimation && pointNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 
              ${pointNotification.type === 'success' ? 'bg-teal-500' : 
                pointNotification.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'} 
              bg-opacity-85 text-white px-4 py-2 rounded-full text-sm z-50 flex items-center`}
          >
            {pointNotification.type === 'success' ? <IoGift className="mr-2" /> : null}
            {pointNotification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PointSystem;
