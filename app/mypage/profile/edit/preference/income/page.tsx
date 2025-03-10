"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiLock } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function IncomePreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 収入の選択肢（万円/年）
  const incomeOptions = [
    { value: "300万円未満", premium: false },
    { value: "300〜400万円", premium: false },
    { value: "400〜500万円", premium: false },
    { value: "500〜600万円", premium: false },
    { value: "600〜800万円", premium: true },
    { value: "800〜1000万円", premium: true },
    { value: "1000〜1500万円", premium: true },
    { value: "1500〜2000万円", premium: true },
    { value: "2000万円以上", premium: true },
    { value: "未回答", premium: false }
  ];

  // 選択された収入のステート
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
      const savedPreference = getPreference('income', {
        isAny: true,
        values: [],
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedOptions(savedPreference.values || []);
      }
    } catch (error) {
      console.error('年収設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 収入の選択・解除
  const toggleIncome = (option: string, isPremiumOption: boolean) => {
    // プレミアム会員でない場合、プレミアムオプションは選択できない
    if (isPremiumOption && !isPremium) {
      return;
    }
    
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // 全ての収入を選択/解除（指定なし）
  const toggleAnyIncome = () => {
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
      const incomeData = {
        isAny: isAnySelected,
        values: selectedOptions,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedOptions)
      };
      
      // APIを呼び出して年収設定を保存
      const success = await savePreference('income', incomeData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('年収設定の保存中にエラーが発生しました:', error);
      alert('エラーが発生しました。再度お試しください。');
    }
  };

  // プレミアム会員になるボタンの処理
  const handleUpgradeToPremium = () => {
    // プレミアム会員登録画面に遷移
    router.push('/subscription/premium');
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
            <h1 className="text-lg font-medium">希望年収</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 収入条件の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            お相手の年収について、希望する条件を選択してください。複数選択が可能です。
            {!isPremium && isMale && (
              <span className="text-amber-600 block mt-1">
                ※高収入帯の設定はプレミアム会員限定機能です
              </span>
            )}
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyIncome}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">年収を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 収入オプションリスト */}
        <div className="bg-white">
          {incomeOptions.map((option, index) => (
            <button 
              key={index}
              onClick={() => toggleIncome(option.value, option.premium)}
              disabled={isAnySelected || (option.premium && !isPremium)}
              className={`flex items-center justify-between w-full px-4 py-4 border-b ${
                isAnySelected || (option.premium && !isPremium) ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="text-gray-800">{option.value}</span>
                {option.premium && !isPremium && (
                  <span className="ml-2 flex items-center text-amber-500">
                    <FiLock size={14} className="mr-1" />
                    <span className="text-xs">プレミアム</span>
                  </span>
                )}
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                selectedOptions.includes(option.value) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
              }`}>
                {selectedOptions.includes(option.value) && <FiCheck className="text-white" size={16} />}
              </div>
            </button>
          ))}
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="p-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、高収入のお相手を検索条件に設定できるようになります。また、収入条件を満たす人気会員と優先的にマッチングする「優先マッチング」機能も利用可能です。
              </p>
              <button 
                onClick={handleUpgradeToPremium}
                className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                プレミアム会員になる
              </button>
            </div>
          </div>
        )}

        {/* 収入別のマッチング成功率（プレミアム会員向け） */}
        {isPremium && (
          <div className="p-4 mt-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">収入別マッチング傾向</h3>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-3">
                当サービスでのマッチング成功率を収入別に分析した結果です。ご参考にしてください。
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">600〜800万円</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">40%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">800〜1000万円</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">65%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">1000万円以上</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">80%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
