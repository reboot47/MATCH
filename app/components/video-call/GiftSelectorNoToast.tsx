"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiX, HiCurrencyYen } from 'react-icons/hi';
import { BsCoin } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
// トースト通知なし

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
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // ユーザーポイント実装例　（実際のアプリではAPIから取得）
  useEffect(() => {
    // APIからポイント残高を取得するロジックを実装
    const fetchUserPoints = async () => {
      try {
        // 実際のアプリでは：
        // const response = await fetch('/api/user/points');
        // const data = await response.json();
        // setUserPoints(data.points);
        
        // デモ用仮データ
        setUserPoints(100);
      } catch (error) {
        console.error('ポイント取得エラー', error);
        console.error('ポイント情報の取得に失敗しました');
      }
    };
    
    fetchUserPoints();
  }, []);

  // ギフト一覧（実際のアプリではAPIから取得）
  const gifts: Gift[] = [
    {
      id: 'heart',
      name: 'ハート',
      description: '定番の可愛いハートギフト',
      imagePath: '/gifts/heart.png',
      points: 5,
      animation: 'floating'
    },
    {
      id: 'flower',
      name: 'フラワー',
      description: '華やかな桜の花をプレゼント',
      imagePath: '/gifts/flower.png',
      points: 10,
      animation: 'rotating'
    },
    {
      id: 'crown',
      name: 'クラウン',
      description: '王冠でVIP待遇を！',
      imagePath: '/gifts/crown.png',
      points: 25,
      animation: 'shining'
    },
    {
      id: 'diamond',
      name: 'ダイヤモンド',
      description: '最高級の輝き',
      imagePath: '/gifts/diamond.png',
      points: 50,
      animation: 'exploding'
    },
    {
      id: 'star',
      name: 'スター',
      description: 'キラキラ輝く星',
      imagePath: '/gifts/star.png',
      points: 30,
      animation: 'twinkling'
    },
    {
      id: 'cake',
      name: 'ケーキ',
      description: 'お祝いの気持ちを込めて',
      imagePath: '/gifts/cake.png',
      points: 20,
      animation: 'rising'
    },
    {
      id: 'rocket',
      name: 'ロケット',
      description: '宇宙まで届け！',
      imagePath: '/gifts/rocket.png',
      points: 40,
      animation: 'flying'
    },
    {
      id: 'fire',
      name: 'ファイヤー',
      description: '熱い想いを伝える炎',
      imagePath: '/gifts/fire.png',
      points: 15,
      animation: 'burning'
    },
    {
      id: 'rainbow',
      name: 'レインボー',
      description: '幸運の虹',
      imagePath: '/gifts/rainbow.png',
      points: 60,
      animation: 'rainbow'
    },
    {
      id: 'kiss',
      name: 'キス',
      description: '特別な気持ちを込めて',
      imagePath: '/gifts/kiss.png',
      points: 35,
      animation: 'pulsing'
    }
  ];
  
  const handleSendGift = async () => {
    if (!selectedGift) {
      console.error('ギフトを選択してください');
      return;
    }
    
    if (userPoints < selectedGift.points) {
      console.error(`ポイントが足りません。あと${selectedGift.points - userPoints}ポイント必要です。`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // APIリクエスト（実際のアプリで実装）
      // await fetch('/api/gifts/send', { /* ... */ });
      
      // ポイント減算
      setUserPoints(prev => prev - selectedGift.points);
      
      // ギフト送信
      onSelectGift(selectedGift.id);
      console.log(`${selectedGift.name}を送信しました！`);
      
      // 送信後に閉じる
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('ギフト送信エラー', error);
      console.error('ギフト送信に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">ギフトを送る</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <HiX size={24} />
        </button>
      </div>
      
      {/* 残高表示 */}
      <div className="bg-yellow-50 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <BsCoin className="text-yellow-500 mr-2" size={18} />
          <span className="font-medium">残高:</span>
        </div>
        <div className="font-semibold text-lg">{userPoints} ポイント</div>
      </div>
      
      {/* ギフト一覧 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {gifts.map(gift => (
            <div
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className={`p-3 border rounded-lg flex flex-col items-center transition-all cursor-pointer hover:shadow-md ${
                selectedGift?.id === gift.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="text-4xl mb-2">
                {gift.id === 'heart' && '❤️'}
                {gift.id === 'flower' && '🌸'}
                {gift.id === 'crown' && '👑'}
                {gift.id === 'diamond' && '💎'}
                {gift.id === 'star' && '⭐'}
                {gift.id === 'cake' && '🎂'}
                {gift.id === 'rocket' && '🚀'}
                {gift.id === 'fire' && '🔥'}
                {gift.id === 'rainbow' && '🌈'}
                {gift.id === 'kiss' && '💋'}
              </div>
              <div className="text-center">
                <div className="font-medium mb-1">{gift.name}</div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <HiCurrencyYen size={14} className="mr-0.5" />
                  <span>{gift.points}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* フッター */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600">
            選択中: <span className="font-medium">{selectedGift?.name || 'なし'}</span>
          </div>
          <div className="text-gray-600">
            消費: <span className="font-medium">{selectedGift?.points || 0} ポイント</span>
          </div>
        </div>
        <button
          onClick={handleSendGift}
          disabled={!selectedGift || isProcessing}
          className={`w-full py-3 rounded-lg font-medium ${
            !selectedGift || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <span className="mr-2">送信中</span>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
          ) : (
            '送信する'
          )}
        </button>
      </div>
    </div>
  );
};

export default GiftSelector;
