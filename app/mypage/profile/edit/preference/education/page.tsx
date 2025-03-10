"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function EducationPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 学歴の選択肢
  const educationOptions = [
    "中学卒業",
    "高校卒業",
    "専門学校卒業",
    "短大卒業",
    "大学卒業",
    "大学院卒業",
    "その他"
  ];

  // 選択された学歴のステート
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
      const savedPreference = getPreference('education', {
        isAny: true,
        values: [],
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedOptions(savedPreference.values || []);
      }
    } catch (error) {
      console.error('学歴設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 学歴の選択・解除
  const toggleEducation = (education: string) => {
    if (selectedOptions.includes(education)) {
      setSelectedOptions(selectedOptions.filter(e => e !== education));
    } else {
      setSelectedOptions([...selectedOptions, education]);
    }
  };

  // 全ての学歴を選択/解除（指定なし）
  const toggleAnyEducation = () => {
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
      const educationData = {
        isAny: isAnySelected,
        values: selectedOptions,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedOptions)
      };
      
      // APIを呼び出して学歴設定を保存
      const success = await savePreference('education', educationData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('学歴設定の保存中にエラーが発生しました:', error);
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
            <h1 className="text-lg font-medium">希望学歴</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 学歴の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            希望する学歴を選択してください。複数選択が可能です。
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyEducation}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">学歴を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 学歴オプションリスト */}
        <div className="bg-white">
          {educationOptions.map((education, index) => (
            <button 
              key={index}
              onClick={() => toggleEducation(education)}
              disabled={isAnySelected}
              className={`flex items-center justify-between w-full px-4 py-4 border-b ${isAnySelected ? 'opacity-50' : ''}`}
            >
              <span className="text-gray-800">{education}</span>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOptions.includes(education) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                {selectedOptions.includes(education) && <FiCheck className="text-white" size={16} />}
              </div>
            </button>
          ))}
        </div>

        {/* 選択ヒント */}
        <div className="p-4 bg-gray-50 mt-4">
          <p className="text-sm text-gray-600">
            よくある選択: 「大学卒業」と「大学院卒業」を合わせて選ぶと、高学歴のお相手が表示されやすくなります。
          </p>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="p-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、特定の学歴を持つ人気会員と優先的にマッチングできます。また、高学歴・海外大学卒などの特別なプロフィールを持つ方とのマッチング確率が高まります。
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
