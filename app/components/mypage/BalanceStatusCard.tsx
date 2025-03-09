"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { HiOutlinePlus } from 'react-icons/hi';

type Props = {
  points: number;
  cash: number; // キャッシュは女性ユーザー向け
  hasPaymentInfo?: boolean;
};

const BalanceStatusCard: React.FC<Props> = ({ 
  points = 52, 
  cash = 0,
  hasPaymentInfo = false
}) => {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  
  // 決済情報の有無に応じたリンク先を指定
  const handlePointsClick = () => {
    router.push('/payment/points');
  };
  
  const handleCashClick = () => {
    router.push('/payment/cash');
  };

  return (
    <div className="flex justify-between px-2 py-1">
      {/* 残ポイント */}
      <div className="flex-1 bg-gray-50 rounded-lg p-3 mx-1 relative">
        <p className="text-gray-700 text-sm">残ポイント</p>
        <div className="flex items-center mt-1">
          <span className="text-yellow-400 mr-1">P</span>
          <p className="text-xl font-bold">{points}</p>
        </div>
        <button 
          onClick={handlePointsClick}
          className="absolute top-2 right-2 text-teal-500"
        >
          <HiOutlinePlus />
        </button>
      </div>
      
      {/* 残キャッシュ（女性）または 残コイン（男性） */}
      <div className="flex-1 bg-gray-50 rounded-lg p-3 mx-1 relative">
        <p className="text-gray-700 text-sm">
          {isMale ? '残コイン' : '残キャッシュ'}
        </p>
        <div className="flex items-center mt-1">
          <span className={isMale ? 'text-blue-500 mr-1' : 'text-pink-500 mr-1'}>
            {isMale ? 'C' : '¥'}
          </span>
          <p className="text-xl font-bold">{isMale ? cash : cash}</p>
        </div>
        <button 
          onClick={isMale ? handleCashClick : undefined}
          className="absolute top-2 right-2 text-teal-500"
        >
          <HiOutlinePlus />
        </button>
      </div>
    </div>
  );
};

export default BalanceStatusCard;
