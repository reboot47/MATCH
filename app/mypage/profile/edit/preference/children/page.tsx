"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function ChildrenPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 子どもへの意向の選択肢
  const childrenOptions = [
    "子どもがいる",
    "子どもはいないが、欲しい",
    "子どもは欲しくない",
    "子どもの有無は気にしない",
    "未回答"
  ];

  // 選択された子どもへの意向のステート
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnySelected, setIsAnySelected] = useState<boolean>(true); // デフォルトで「指定なし」

  // 画面が表示されたときに設定とスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    loadSavedPreferences();
  }, []);
  
  // 保存済みの設定を読み込む
  const loadSavedPreferences = () => {
    try {
      const savedPreference = getPreference('children', {
        isAny: true,
        values: [],
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedOptions(savedPreference.values || []);
      }
    } catch (error) {
      console.error('子どもへの意向設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 子どもへの意向の選択・解除
  const toggleChildrenOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // 全ての子どもへの意向を選択/解除（指定なし）
  const toggleAnyOption = () => {
    if (isAnySelected) {
      setIsAnySelected(false);
    } else {
      setIsAnySelected(true);
      setSelectedOptions([]);
    }
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = async () => {
    try {
      // 保存用データを作成
      const childrenData = {
        isAny: isAnySelected,
        values: selectedOptions,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedOptions)
      };
      
      // APIを呼び出して子どもへの意向設定を保存
      const success = await savePreference('children', childrenData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('子どもへの意向設定の保存中にエラーが発生しました:', error);
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
            <h1 className="text-lg font-medium">子どもについて</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 子どもへの意向条件の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            お相手の子どもに対する考え方について、希望する条件を選択してください。複数選択が可能です。
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyOption}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">子どもへの意向を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 子どもへの意向オプションリスト */}
        <div className="bg-white">
          {childrenOptions.map((option, index) => (
            <button 
              key={index}
              onClick={() => toggleChildrenOption(option)}
              disabled={isAnySelected}
              className={`flex items-center justify-between w-full px-4 py-4 border-b ${isAnySelected ? 'opacity-50' : ''}`}
            >
              <span className="text-gray-800">{option}</span>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOptions.includes(option) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                {selectedOptions.includes(option) && <FiCheck className="text-white" size={16} />}
              </div>
            </button>
          ))}
        </div>

        {/* 選択ヒント */}
        <div className="p-4 bg-gray-50 mt-4">
          <p className="text-sm text-gray-600">
            家族を望む方は「子どもがいる」「子どもはいないが、欲しい」を選ぶと、将来的に家族を持ちたいお相手とマッチングしやすくなります。
          </p>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="p-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、子どもや家族に対する考え方が近いお相手と優先的にマッチングできます。価値観の近いパートナー探しに役立ちます。
              </p>
              <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                プレミアム会員になる
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
