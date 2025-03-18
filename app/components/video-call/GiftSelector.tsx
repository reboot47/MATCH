"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiX, HiCurrencyYen } from 'react-icons/hi';
import { BsCoin } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface GiftSelectorProps {
  onClose: () => void;
  onSelectGift: (giftId: string) => void;
}

interface Gift {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  points: number;
  animation?: string;
}

const GiftSelector: React.FC<GiftSelectorProps> = ({ onClose, onSelectGift }) => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [userPoints, setUserPoints] = useState<number>(100); // ユーザーのポイント（実際のアプリではAPIから取得）
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // ユーザーポイント実装例　（実際のアプリではAPIから取得）
  useEffect(() => {
    // APIからポイント残高を取得するロジックを実装
    const fetchUserPoints = async () => {
      try {
        // 例: const response = await fetch('/api/user/points');
        // const data = await response.json();
        // setUserPoints(data.points);
        
        // モックデータ
        setUserPoints(100);
      } catch (error) {
        console.error('ポイント取得エラー', error);
        toast.error('ポイント情報の取得に失敗しました');
      }
    };
    
    fetchUserPoints();
  }, []);
  
  // ギフトリスト (実際のアプリではAPIから取得)
  const gifts: Gift[] = [
    {
      id: 'heart',
      name: 'ハート',
      description: '好意を表現するシンプルなギフト',
      imagePath: '/images/gifts/heart.svg',
      points: 5,
      animation: 'floating'
    },
    {
      id: 'rose',
      name: 'バラ',
      description: 'ロマンチックな気持ちを伝えるギフト',
      imagePath: '/images/gifts/rose.svg',
      points: 10,
      animation: 'rotating'
    },
    {
      id: 'crown',
      name: 'クラウン',
      description: '特別な存在であることを示すギフト',
      imagePath: '/images/gifts/crown.svg',
      points: 25,
      animation: 'shining'
    },
    {
      id: 'diamond',
      name: 'ダイヤモンド',
      description: '最高級の価値を持つプレミアムギフト',
      imagePath: '/images/gifts/diamond.svg',
      points: 50,
      animation: 'sparkling'
    },
    {
      id: 'fireworks',
      name: '花火',
      description: 'お祝いの気持ちを表現するギフト',
      imagePath: '/images/gifts/fireworks.svg',
      points: 15,
      animation: 'exploding'
    },
    {
      id: 'cake',
      name: 'ケーキ',
      description: 'お祝いやお礼の気持ちを伝えるギフト',
      imagePath: '/images/gifts/cake.svg',
      points: 20,
      animation: 'none'
    },
    {
      id: 'ring',
      name: 'リング',
      description: '永続的な絆を象徴するギフト',
      imagePath: '/images/gifts/ring.svg',
      points: 40,
      animation: 'rotating'
    },
    {
      id: 'star',
      name: 'スター',
      description: '輝かしい存在であることを伝えるギフト',
      imagePath: '/images/gifts/star.svg',
      points: 15,
      animation: 'pulsing'
    }
  ];
  
  // ギフト選択処理
  const handleSelectGift = (gift: Gift) => {
    setSelectedGift(gift);
  };
  
  // ギフト送信処理 - 改善版
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleSendGift = async () => {
    if (!selectedGift) {
      toast.error('ギフトを選択してください');
      return;
    }
    
    if (userPoints < selectedGift.points) {
      toast.error(`ポイントが足りません。あと${selectedGift.points - userPoints}ポイント必要です。`);
      return;
    }
    
    // 処理中ステートに設定
    setIsProcessing(true);
    
    try {
      // 実際のアプリではAPI通信を実装
      // ここではモック遅延を追加
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // ポイント減算
      setUserPoints(prev => prev - selectedGift.points);
      
      // ギフト送信
      onSelectGift(selectedGift.id);
      toast.success(`${selectedGift.name}を送信しました！`);
      
      // 送信後に閉じる
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('ギフト送信エラー', error);
      toast.error('ギフト送信に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <motion.div 
      className="absolute inset-0 bg-black bg-opacity-70 flex items-end justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-4 sm:p-6 overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold dark:text-white">ギフトを送る</h3>
            <div className="flex items-center text-sm text-green-600 font-medium mt-1">
              <BsCoin className="mr-1" />
              <span>残り {userPoints} ポイント</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <HiX className="text-xl dark:text-white" />
          </button>
        </div>
        
        {/* ギフトグリッド - モバイル対応 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-h-60 overflow-y-auto pr-1">
          {gifts.map((gift) => (
            <div 
              key={gift.id} 
              className={`relative p-2 sm:p-3 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                selectedGift?.id === gift.id 
                  ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500'
                  : 'border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              } ${
                userPoints < gift.points ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => userPoints >= gift.points && handleSelectGift(gift)}
            >
              <div className="relative w-full aspect-square mb-1">
                <Image
                  src={gift.imagePath}
                  alt={gift.name}
                  width={60}
                  height={60}
                  className="mx-auto object-contain drop-shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = '/images/gifts/placeholder.svg';
                  }}
                />
              </div>
              <div className="text-xs font-medium dark:text-white truncate">{gift.name}</div>
              <div className={`text-xs font-bold flex items-center justify-center ${
                userPoints < gift.points ? 'text-red-500' : 'text-green-600 dark:text-green-400'
              }`}>
                <BsCoin className="mr-0.5" />{gift.points}
              </div>
            </div>
          ))}
        </div>
        
        {/* ギフト詳細とアクション - 改善版 */}
        {selectedGift && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center">
              <div className="relative w-14 h-14 mr-3">
                <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Image
                    src={selectedGift.imagePath}
                    alt={selectedGift.name}
                    width={48}
                    height={48}
                    className="object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.src = '/images/gifts/placeholder.svg';
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold dark:text-white">{selectedGift.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedGift.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 dark:text-green-400 font-bold">
                  <BsCoin className="mr-1" />
                  {selectedGift.points}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 送信ボタン - 改善版 */}
        <div className="mt-5">
          <button
            onClick={handleSendGift}
            disabled={!selectedGift || userPoints < (selectedGift?.points || 0) || isProcessing}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              selectedGift && userPoints >= selectedGift.points && !isProcessing
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-md'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            } ${
              isProcessing ? 'animate-pulse' : ''
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                処理中...
              </span>
            ) : !selectedGift ? (
              'ギフトを選択してください'
            ) : userPoints < selectedGift.points ? (
              `ポイントが足りません (あと${selectedGift.points - userPoints}ポイント必要)`
            ) : (
              `${selectedGift.name}を送る`
            )}
          </button>
          
          {selectedGift && userPoints >= selectedGift.points && !isProcessing && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              ギフト送信後、{selectedGift.points}ポイントが消費されます
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GiftSelector;
