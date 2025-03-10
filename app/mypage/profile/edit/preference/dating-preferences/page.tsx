"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition, navigateWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel, formatPreferencesForApi } from '@/app/utils/userPreferences';

export default function DatingPreferencesPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);

  // デフォルトのマッチング条件設定
  const defaultPreferences = {
    ageRange: {
      min: 20,
      max: 40,
      label: '20〜40歳'
    },
    height: {
      min: isMale ? 150 : 160,
      max: isMale ? 170 : 190,
      label: isMale ? '150〜170cm' : '160〜190cm'
    },
    distance: {
      value: 30,
      label: '30km以内'
    },
    occupation: {
      values: [] as string[],
      label: '指定なし'
    },
    education: {
      values: [] as string[],
      label: '指定なし'
    },
    bodyType: {
      values: [] as string[],
      label: '指定なし'
    },
    income: {
      values: [] as string[],
      label: '指定なし'
    },
    smoking: {
      values: [] as string[],
      label: '指定なし'
    },
    drinking: {
      values: [] as string[],
      label: '指定なし'
    },
    marriageIntention: {
      values: [] as string[],
      label: '指定なし'
    },
    children: {
      values: [] as string[],
      label: '指定なし'
    },
    idealRelationship: {
      values: [] as string[],
      label: '指定なし'
    },
    hobbies: {
      values: [] as string[],
      label: '指定なし'
    },
    languages: {
      values: [] as string[],
      label: '指定なし'
    },
    nationality: {
      values: [] as string[],
      label: '指定なし'
    },
    religion: {
      values: [] as string[],
      label: '指定なし'
    }
  };
  
  // マッチング条件の状態管理
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 画面が表示されたときに設定とスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    loadPreferences();
  }, []);

  // 保存済みの設定を読み込む
  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      // ローカルストレージまたはAPIから設定を読み込む
      const savedPrefs = getPreference('all', defaultPreferences);
      
      // ラベルを再生成
      const prefsWithLabels = { ...savedPrefs };
      
      // 各設定項目のラベルを更新
      if (prefsWithLabels.occupation?.values) {
        prefsWithLabels.occupation.label = generatePreferenceLabel(prefsWithLabels.occupation.values);
      }
      
      if (prefsWithLabels.education?.values) {
        prefsWithLabels.education.label = generatePreferenceLabel(prefsWithLabels.education.values);
      }
      
      if (prefsWithLabels.bodyType?.values) {
        prefsWithLabels.bodyType.label = generatePreferenceLabel(prefsWithLabels.bodyType.values);
      }
      
      if (prefsWithLabels.income?.values) {
        prefsWithLabels.income.label = generatePreferenceLabel(prefsWithLabels.income.values);
      }
      
      if (prefsWithLabels.smoking?.values) {
        prefsWithLabels.smoking.label = generatePreferenceLabel(prefsWithLabels.smoking.values);
      }
      
      if (prefsWithLabels.drinking?.values) {
        prefsWithLabels.drinking.label = generatePreferenceLabel(prefsWithLabels.drinking.values);
      }
      
      if (prefsWithLabels.marriageIntention?.values) {
        prefsWithLabels.marriageIntention.label = generatePreferenceLabel(prefsWithLabels.marriageIntention.values);
      }
      
      if (prefsWithLabels.children?.values) {
        prefsWithLabels.children.label = generatePreferenceLabel(prefsWithLabels.children.values);
      }
      
      if (prefsWithLabels.idealRelationship?.values) {
        prefsWithLabels.idealRelationship.label = generatePreferenceLabel(prefsWithLabels.idealRelationship.values);
      }
      
      if (prefsWithLabels.hobbies?.values) {
        prefsWithLabels.hobbies.label = generatePreferenceLabel(prefsWithLabels.hobbies.values);
      }
      
      if (prefsWithLabels.languages?.values) {
        prefsWithLabels.languages.label = generatePreferenceLabel(prefsWithLabels.languages.values);
      }
      
      if (prefsWithLabels.nationality?.values) {
        prefsWithLabels.nationality.label = generatePreferenceLabel(prefsWithLabels.nationality.values);
      }
      
      if (prefsWithLabels.religion?.values) {
        prefsWithLabels.religion.label = generatePreferenceLabel(prefsWithLabels.religion.values);
      }
      
      setPreferences(prefsWithLabels);
    } catch (error) {
      console.error('マッチング条件の読み込み中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 条件設定画面への移動
  const navigateToPreference = (type: string) => {
    navigateWithScrollPosition(router, `/mypage/profile/edit/preference/${type}`);
  };

  // 保存して前のページに戻る
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API用にフォーマット
      const apiPreferences = formatPreferencesForApi(preferences);
      
      // APIを呼び出してマッチング条件を保存
      const success = await savePreference('all', preferences);
      
      if (success) {
        // 保存成功時の処理
        console.log('マッチング条件を保存しました:', apiPreferences);
        navigateBackWithScrollPosition(router);
      } else {
        // 保存失敗時の処理
        alert('マッチング条件の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('マッチング条件の保存中にエラーが発生しました:', error);
      alert('エラーが発生しました。再度お試しください。');
    } finally {
      setIsSaving(false);
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
        className="min-h-screen bg-gray-50"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">マッチング条件</h1>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`font-medium ${isSaving ? 'text-gray-400' : 'text-teal-500'}`}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {/* 説明テキスト */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-600">
            ここで設定した条件に合うお相手が優先的に表示されます。厳しい条件を設定すると、表示されるお相手の数が減少する可能性があります。
          </p>
          {isPremium ? (
            <div className="mt-2 p-2 bg-teal-50 border border-teal-100 rounded-md">
              <p className="text-xs text-teal-600">
                <span className="font-semibold">プレミアム会員特典:</span> すべての検索条件を詳細に設定できます。条件に最適なお相手を優先的に表示します。
              </p>
            </div>
          ) : isMale ? (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-md">
              <p className="text-xs text-amber-600">
                <span className="font-semibold">プレミアム会員になると:</span> 年収や学歴など、こだわり条件の詳細設定が可能になります。理想のお相手を効率的に見つけられます。
              </p>
            </div>
          ) : null}
        </div>

        {/* 条件リスト - ローディング中 */}
        {isLoading ? (
          <div className="mt-4 p-8 bg-white rounded-md shadow-sm flex justify-center items-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-sm text-gray-500">設定を読み込み中...</p>
            </div>
          </div>
        ) : (
        /* 条件リスト */
        <div className="mt-4 bg-white rounded-md shadow-sm">
          {/* 年齢 */}
          <button 
            onClick={() => navigateToPreference('age-range')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">年齢</p>
              <p className="text-sm text-gray-500">{preferences.ageRange.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 身長 */}
          <button 
            onClick={() => navigateToPreference('height-range')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">身長</p>
              <p className="text-sm text-gray-500">{preferences.height.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 距離 */}
          <button 
            onClick={() => navigateToPreference('distance')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">距離</p>
              <p className="text-sm text-gray-500">{preferences.distance.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 職業 */}
          <button 
            onClick={() => navigateToPreference('occupation')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">職業</p>
              <p className="text-sm text-gray-500">{preferences.occupation.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 学歴 */}
          <button 
            onClick={() => navigateToPreference('education')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">学歴</p>
              <p className="text-sm text-gray-500">{preferences.education.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 喫煙 */}
          <button 
            onClick={() => navigateToPreference('smoking')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">喫煙</p>
              <p className="text-sm text-gray-500">{preferences.smoking.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 飲酒 */}
          <button 
            onClick={() => navigateToPreference('drinking')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">お酒</p>
              <p className="text-sm text-gray-500">{preferences.drinking.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 体型 */}
          <button 
            onClick={() => navigateToPreference('body-type')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">体型</p>
              <p className="text-sm text-gray-500">{preferences.bodyType.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 年収 */}
          <button 
            onClick={() => navigateToPreference('income')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">年収</p>
              <p className="text-sm text-gray-500">{preferences.income.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 結婚に対する意思 */}
          <button 
            onClick={() => navigateToPreference('marriage-intention')}
            className="flex items-center justify-between w-full px-4 py-4 border-b"
          >
            <div>
              <p className="text-gray-800 font-medium">結婚への意向</p>
              <p className="text-sm text-gray-500">{preferences.marriageIntention.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* 子どもに関する意向 */}
          <button 
            onClick={() => navigateToPreference('children')}
            className="flex items-center justify-between w-full px-4 py-4"
          >
            <div>
              <p className="text-gray-800 font-medium">子どもについて</p>
              <p className="text-sm text-gray-500">{preferences.children.label}</p>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>
        </div>
        )}

        {/* プレミアム機能案内 - 非プレミアム男性ユーザーのみ表示 */}
        {!isPremium && isMale && (
          <div className="mt-4 bg-white rounded-md shadow-sm p-4">
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-700">
                プレミアム会員になると、より詳細なマッチング条件を設定できます。年収や趣味など、さらに条件を絞り込んで理想のお相手を見つけましょう。
              </p>
              <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                プレミアム会員になる
              </button>
            </div>
          </div>
        )}

        {/* 下部余白 */}
        <div className="h-20"></div>
      </motion.div>
    </AnimatePresence>
  );
}
