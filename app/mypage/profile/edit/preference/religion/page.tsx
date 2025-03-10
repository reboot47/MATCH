"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiInfo } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function ReligionPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 宗教・信条の選択肢
  const religionOptions = [
    "仏教", "神道", "キリスト教（カトリック）", "キリスト教（プロテスタント）", 
    "イスラム教", "ヒンドゥー教", "ユダヤ教", "無宗教", "その他", "未回答"
  ];

  // 宗教観の重要度
  const importanceOptions = [
    "非常に重要（同じ宗教の人を希望）",
    "やや重要（宗教観が近い人を希望）",
    "どちらでもない",
    "重要ではない"
  ];

  // 選択された宗教・信条のステート
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [importanceLevel, setImportanceLevel] = useState<string>("どちらでもない");
  const [isAnySelected, setIsAnySelected] = useState<boolean>(true); // デフォルトで「指定なし」
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // 画面が表示されたときに設定とスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    loadSavedPreferences();
  }, []);
  
  // 保存済みの設定を読み込む
  const loadSavedPreferences = () => {
    try {
      const savedPreference = getPreference('religion', {
        isAny: true,
        values: [],
        importanceLevel: 'どちらでもない',
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedReligions(savedPreference.values || []);
        if (savedPreference.importanceLevel) {
          setImportanceLevel(savedPreference.importanceLevel);
        }
      }
    } catch (error) {
      console.error('宗教設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 宗教・信条の選択・解除
  const toggleReligion = (religion: string) => {
    if (selectedReligions.includes(religion)) {
      setSelectedReligions(selectedReligions.filter(r => r !== religion));
    } else {
      setSelectedReligions([...selectedReligions, religion]);
    }
  };

  // 全ての宗教・信条を選択に含める/外す（指定なし）
  const toggleAnyReligion = () => {
    if (isAnySelected) {
      setIsAnySelected(false);
    } else {
      setIsAnySelected(true);
      setSelectedReligions([]);
    }
  };

  // 重要度の変更
  const handleImportanceChange = (level: string) => {
    setImportanceLevel(level);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = async () => {
    try {
      // 保存用データを作成
      const religionData = {
        isAny: isAnySelected,
        values: selectedReligions,
        importanceLevel: importanceLevel,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedReligions)
      };
      
      // APIを呼び出して宗教・信条設定を保存
      const success = await savePreference('religion', religionData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('宗教設定の保存中にエラーが発生しました:', error);
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
            <h1 className="text-lg font-medium">宗教・信条</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 宗教・信条指定の説明 */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-start">
            <p className="text-sm text-gray-500 flex-1">
              お相手の宗教・信条について、希望する条件を選択してください。複数選択が可能です。
              <button 
                onClick={() => setShowInfoModal(true)}
                className="inline-flex items-center ml-1 text-teal-500"
              >
                <FiInfo size={16} />
              </button>
            </p>
          </div>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyReligion}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">宗教・信条を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 宗教・信条の重要度 - 指定ありの場合のみ表示 */}
        {!isAnySelected && (
          <div className="p-4 bg-white border-b">
            <p className="text-sm font-medium text-gray-700 mb-3">宗教観の重要度</p>
            {importanceOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleImportanceChange(option)}
                className="flex items-center justify-between w-full py-2"
              >
                <span className="text-gray-800 text-sm">{option}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${importanceLevel === option ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                  {importanceLevel === option && <FiCheck className="text-white" size={14} />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 宗教・信条オプションリスト - 指定ありの場合のみ表示 */}
        {!isAnySelected && (
          <div className="bg-white">
            {religionOptions.map((religion, index) => (
              <button 
                key={index}
                onClick={() => toggleReligion(religion)}
                className="flex items-center justify-between w-full px-4 py-4 border-b"
              >
                <span className="text-gray-800">{religion}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedReligions.includes(religion) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                  {selectedReligions.includes(religion) && <FiCheck className="text-white" size={16} />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 宗教・信条に関する説明 */}
        <div className="p-4 bg-gray-50 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">宗教観について</h3>
          <p className="text-sm text-gray-600">
            宗教や信条は価値観や生活習慣に大きく影響することがあります。特に結婚や家族のあり方について共通の考え方を持つことが重要な方は、この条件を設定することをおすすめします。
          </p>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="p-4 mt-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、宗教観や人生の価値観が近いお相手を優先的に表示する「価値観マッチング」機能が利用できます。共通の価値観を持つパートナーを見つけるのに役立ちます。
              </p>
              <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                プレミアム会員になる
              </button>
            </div>
          </div>
        )}

        {/* 宗教・信条に関する情報モーダル */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-3">宗教・信条について</h3>
                <div className="text-sm text-gray-600 space-y-3">
                  <p>
                    宗教や信条は個人のプライバシーに関わる情報です。このマッチング設定は、あなたの価値観に合う方との出会いをサポートするためのものです。
                  </p>
                  <p>
                    宗教・信条を指定すると、同じまたは近い価値観を持つお相手との出会いを優先することができます。特に結婚や家族形成を考えている方にとって、この条件は重要になることがあります。
                  </p>
                  <p>
                    当サービスは異なる宗教・信条を尊重し、多様な価値観を持つ方々の出会いをサポートしています。
                  </p>
                </div>
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="mt-5 w-full bg-teal-500 text-white py-2 rounded-lg"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
