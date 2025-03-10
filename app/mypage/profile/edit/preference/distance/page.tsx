"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference } from '@/app/utils/userPreferences';

export default function DistancePreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 距離範囲のステート
  const [distance, setDistance] = useState<number>(30);

  // 画面が表示されたときに設定とスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    loadSavedPreferences();
  }, []);
  
  // 保存済みの設定を読み込む
  const loadSavedPreferences = () => {
    try {
      const savedPreference = getPreference('distance', {
        value: 30,
        label: '30km以内'
      });
      
      if (savedPreference && typeof savedPreference.value === 'number') {
        setDistance(savedPreference.value);
      }
    } catch (error) {
      console.error('距離設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 距離の変更
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(parseInt(e.target.value));
  };

  // 距離表示を整形する関数
  const formatDistance = (km: number) => {
    if (km >= 100) {
      return "100km以上";
    } else {
      return `${km}km以内`;
    }
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = async () => {
    try {
      // 保存用データを作成
      const distanceData = {
        value: distance,
        label: formatDistance(distance)
      };
      
      // APIを呼び出して距離設定を保存
      const success = await savePreference('distance', distanceData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('距離設定の保存中にエラーが発生しました:', error);
      alert('エラーが発生しました。再度お試しください。');
    }
  };

  // ページのトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-white"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">検索範囲</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 距離設定の説明 */}
        <div className="p-4 border-b">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-600">検索範囲</span>
            <span className="text-teal-500 font-medium">{formatDistance(distance)}</span>
          </div>
          <p className="text-sm text-gray-500">
            設定した距離内のお相手が優先的に表示されます
          </p>
        </div>

        {/* 距離スライダー */}
        <div className="p-6">
          <div className="mb-8">
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={distance}
              onChange={handleDistanceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>1km</span>
              <span>100km+</span>
            </div>
          </div>

          {/* 距離の説明 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">検索範囲とは</h3>
            <p className="text-sm text-gray-600">
              あなたの現在地または登録地域を中心とした円の範囲内にいるユーザーを表示します。
              範囲を広げるとより多くのお相手が表示されますが、遠方の方が多くなる可能性があります。
            </p>
          </div>
        </div>

        {/* 推奨距離設定 */}
        <div className="px-4 py-5 bg-gray-50 mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">おすすめの検索範囲</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setDistance(5)}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">5km以内</p>
              <p className="text-xs text-gray-500">近所で会える</p>
            </button>
            
            <button 
              onClick={() => setDistance(10)}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">10km以内</p>
              <p className="text-xs text-gray-500">同じエリア内</p>
            </button>
            
            <button 
              onClick={() => setDistance(30)}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">30km以内</p>
              <p className="text-xs text-gray-500">近隣の市区町村も</p>
            </button>
            
            <button 
              onClick={() => setDistance(100)}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center"
            >
              <p className="text-gray-800 font-medium">100km以上</p>
              <p className="text-xs text-gray-500">距離を気にしない</p>
            </button>
          </div>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="p-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、設定距離に関係なく、あなたのお相手候補を全国から表示できます。また、旅行先での一時的なエリア変更も可能になります。
              </p>
              <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                プレミアム会員になる
              </button>
            </div>
          </div>
        )}

        {/* 女性ユーザー向けの特典 */}
        {!isMale && (
          <div className="p-4 mt-4">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <h3 className="text-teal-700 font-medium mb-2">あなた限定の特典</h3>
              <p className="text-sm text-teal-600">
                人気度が高いあなたのプロフィールは、設定した範囲を超えても多くのユーザーに表示されます。プロフィールを充実させると、さらに多くの素敵な出会いがあるかもしれません。
              </p>
              <button className="mt-3 bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                プロフィールを完成させる
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
