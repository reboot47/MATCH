"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiSearch } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function NationalityPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 国・地域のカテゴリとリスト
  const regionCategories = [
    {
      name: "アジア",
      countries: ["日本", "中国", "韓国", "台湾", "香港", "シンガポール", "マレーシア", "タイ", "ベトナム", "フィリピン", "インドネシア", "インド"]
    },
    {
      name: "北米・南米",
      countries: ["アメリカ", "カナダ", "ブラジル", "メキシコ", "アルゼンチン", "コロンビア", "ペルー", "チリ"]
    },
    {
      name: "ヨーロッパ",
      countries: ["イギリス", "フランス", "ドイツ", "イタリア", "スペイン", "ポルトガル", "オランダ", "ベルギー", "スイス", "スウェーデン", "ノルウェー", "フィンランド", "ロシア"]
    },
    {
      name: "オセアニア",
      countries: ["オーストラリア", "ニュージーランド"]
    },
    {
      name: "中東・アフリカ",
      countries: ["トルコ", "エジプト", "モロッコ", "南アフリカ", "UAE", "サウジアラビア"]
    }
  ];

  // 選択された国・地域のステート
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAnySelected, setIsAnySelected] = useState<boolean>(true); // デフォルトで「指定なし」

  // 画面が表示されたときに設定とスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    loadSavedPreferences();
  }, []);
  
  // 保存済みの設定を読み込む
  const loadSavedPreferences = () => {
    try {
      const savedPreference = getPreference('nationality', {
        isAny: true,
        values: [],
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedCountries(savedPreference.values || []);
      }
    } catch (error) {
      console.error('国籍設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 国・地域の選択・解除
  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      // プレミアムでない場合は3つまで、プレミアムの場合は10つまで選択可能
      const maxSelections = isPremium ? 10 : 3;
      if (selectedCountries.length < maxSelections) {
        setSelectedCountries([...selectedCountries, country]);
      }
    }
  };

  // 全ての国・地域を選択に含める/外す（指定なし）
  const toggleAnyCountry = () => {
    if (isAnySelected) {
      setIsAnySelected(false);
    } else {
      setIsAnySelected(true);
      setSelectedCountries([]);
    }
  };

  // 検索クエリの変更
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 検索に一致する国・地域をフィルタリング
  const filteredCategories = searchQuery
    ? regionCategories.map(category => ({
        name: category.name,
        countries: category.countries.filter(country =>
          country.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.countries.length > 0)
    : regionCategories;

  // 完了して保存し、前のページに戻る
  const handleComplete = async () => {
    try {
      // 保存用データを作成
      const nationalityData = {
        isAny: isAnySelected,
        values: selectedCountries,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedCountries)
      };
      
      // APIを呼び出して国籍設定を保存
      const success = await savePreference('nationality', nationalityData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('国籍設定の保存中にエラーが発生しました:', error);
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
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">国籍・文化背景</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="p-4 bg-white border-b sticky top-14 z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="国・地域を検索..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full text-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 国籍・文化背景指定の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            お相手の国籍・文化背景について、希望する条件を選択してください。
            {!isPremium && (
              <span className="text-amber-600 block mt-1">
                ※無料会員は最大3つまで選択できます（プレミアム会員は10つまで）
              </span>
            )}
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyCountry}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">国籍・文化背景を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 選択された国・地域の表示 */}
        {!isAnySelected && selectedCountries.length > 0 && (
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm font-medium text-gray-700 mb-2">選択中の国・地域（{selectedCountries.length}/{isPremium ? 10 : 3}）</p>
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((country, index) => (
                <div 
                  key={index} 
                  className="bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {country}
                  <button 
                    onClick={() => toggleCountry(country)}
                    className="ml-1 text-teal-500 p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 国・地域カテゴリとリスト */}
        {!isAnySelected && (
          <div className="pb-20">
            {filteredCategories.map((category, categoryIndex) => (
              category.countries.length > 0 && (
                <div key={categoryIndex} className="mt-2">
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">{category.name}</h3>
                  </div>
                  <div className="bg-white">
                    <div className="grid grid-cols-2 gap-x-2">
                      {category.countries.map((country, countryIndex) => (
                        <button 
                          key={countryIndex}
                          onClick={() => toggleCountry(country)}
                          disabled={selectedCountries.length >= (isPremium ? 10 : 3) && !selectedCountries.includes(country)}
                          className={`flex items-center justify-between px-4 py-3 border-b ${
                            selectedCountries.length >= (isPremium ? 10 : 3) && !selectedCountries.includes(country) 
                              ? 'opacity-50' 
                              : ''
                          }`}
                        >
                          <span className="text-gray-800">{country}</span>
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedCountries.includes(country) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                            {selectedCountries.includes(country) && <FiCheck className="text-white" size={16} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* 国際交流に関するヒント */}
        <div className="p-4 bg-gray-50 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">国際交流について</h3>
          <p className="text-sm text-gray-600">
            異なる文化背景を持つお相手との出会いは、新しい価値観や考え方に触れる機会になります。言語や文化の違いを超えた素敵な出会いを見つけましょう。
          </p>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、より多くの国・地域を条件に設定でき、国際的な出会いの可能性が広がります。また、特定の文化背景を持つお相手との優先マッチングも利用可能になります。
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
