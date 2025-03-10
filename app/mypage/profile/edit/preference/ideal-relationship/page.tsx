"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function IdealRelationshipPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 理想の関係性の選択肢
  const relationshipOptions = [
    "真剣な交際・結婚",
    "まずは友達から",
    "気軽に会える関係",
    "デートを楽しみたい",
    "話し相手・相談相手",
    "特に決めていない"
  ];

  // 選択された関係性のステート
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
      const savedPreference = getPreference('idealRelationship', {
        isAny: true,
        values: [],
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedOptions(savedPreference.values || []);
      }
    } catch (error) {
      console.error('理想の関係性設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 関係性の選択・解除
  const toggleRelationshipOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // 全ての関係性を選択/解除（指定なし）
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
      const relationshipData = {
        isAny: isAnySelected,
        values: selectedOptions,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedOptions)
      };
      
      // APIを呼び出して理想の関係性設定を保存
      const success = await savePreference('idealRelationship', relationshipData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('理想の関係性設定の保存中にエラーが発生しました:', error);
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
            <h1 className="text-lg font-medium">理想の関係性</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 理想の関係性条件の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            希望する関係性を選択してください。お相手との関係性の希望が一致すると、マッチング率が高まります。
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyOption}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">関係性を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 関係性オプションリスト */}
        <div className="bg-white">
          {relationshipOptions.map((option, index) => (
            <button 
              key={index}
              onClick={() => toggleRelationshipOption(option)}
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

        {/* 関係性についての説明 */}
        <div className="p-4 bg-gray-50 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">関係性について</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-800">真剣な交際・結婚</p>
              <p className="text-xs text-gray-500 mt-1">
                将来を見据えた真剣な出会いを求めている人向け。結婚や長期的な関係を望む方が選びます。
              </p>
            </div>

            <div className="bg-white p-3 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-800">まずは友達から</p>
              <p className="text-xs text-gray-500 mt-1">
                友情から始めて、徐々に関係を深めていきたい人向け。プレッシャーなく自然な関係を望む方に。
              </p>
            </div>

            <div className="bg-white p-3 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-800">気軽に会える関係</p>
              <p className="text-xs text-gray-500 mt-1">
                お互いの生活を尊重しながら、時々会える関係を望む人向け。束縛されたくない方に。
              </p>
            </div>
          </div>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="p-4 mt-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、特別なアルゴリズムがあなたの希望する関係性に基づいて相性の良いお相手を優先的に表示します。マッチング時にお相手の希望する関係性も確認できるようになります。
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
