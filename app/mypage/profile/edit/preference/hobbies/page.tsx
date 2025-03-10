"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiSearch, FiStar } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function HobbiesPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 趣味カテゴリとリスト
  const hobbyCategories = [
    {
      name: "アウトドア・スポーツ",
      hobbies: ["ランニング", "ヨガ", "登山", "ゴルフ", "テニス", "サイクリング", "キャンプ", "釣り", "サーフィン", "スキー・スノボ"]
    },
    {
      name: "インドア・文化",
      hobbies: ["読書", "映画鑑賞", "音楽鑑賞", "美術館巡り", "カフェ巡り", "料理", "ゲーム", "アニメ・漫画", "写真撮影", "DIY"]
    },
    {
      name: "社交・コミュニケーション",
      hobbies: ["旅行", "ドライブ", "飲み会", "ライブ・フェス", "ダンス", "カラオケ", "パーティー", "ボランティア", "副業・投資", "外国語"]
    },
    {
      name: "食・グルメ",
      hobbies: ["グルメ巡り", "カフェ巡り", "お酒", "料理", "パン作り", "スイーツ巡り", "ワイン", "居酒屋巡り", "コーヒー", "家庭菜園"]
    },
    {
      name: "芸術・クリエイティブ",
      hobbies: ["楽器演奏", "絵画", "ファッション", "音楽制作", "デザイン", "書道", "陶芸", "ハンドメイド", "舞台観劇", "コスプレ"]
    }
  ];

  // 選択された趣味のステート
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAnySelected, setIsAnySelected] = useState<boolean>(true); // デフォルトで「指定なし」
  const [importanceLevel, setImportanceLevel] = useState<number>(3); // 趣味の重要度（1-5）

  // 画面が表示されたときに設定とスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    loadSavedPreferences();
  }, []);
  
  // 保存済みの設定を読み込む
  const loadSavedPreferences = () => {
    try {
      const savedPreference = getPreference('hobbies', {
        isAny: true,
        values: [],
        importanceLevel: 3,
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedHobbies(savedPreference.values || []);
        if (savedPreference.importanceLevel !== undefined) {
          setImportanceLevel(savedPreference.importanceLevel);
        }
      }
    } catch (error) {
      console.error('趣味設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 趣味の選択・解除
  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(h => h !== hobby));
    } else {
      // プレミアムでない場合は3つまで、プレミアムの場合は10つまで選択可能
      const maxSelections = isPremium ? 10 : 3;
      if (selectedHobbies.length < maxSelections) {
        setSelectedHobbies([...selectedHobbies, hobby]);
      }
    }
  };

  // 趣味の指定なしを選択/解除
  const toggleAnyHobby = () => {
    if (isAnySelected) {
      setIsAnySelected(false);
    } else {
      setIsAnySelected(true);
      setSelectedHobbies([]);
    }
  };

  // 重要度の変更
  const handleImportanceChange = (level: number) => {
    setImportanceLevel(level);
  };

  // 検索クエリの変更
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 検索に一致する趣味をフィルタリング
  const filteredCategories = searchQuery
    ? hobbyCategories.map(category => ({
        name: category.name,
        hobbies: category.hobbies.filter(hobby =>
          hobby.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.hobbies.length > 0)
    : hobbyCategories;

  // 完了して保存し、前のページに戻る
  const handleComplete = async () => {
    try {
      // 保存用データを作成
      const hobbiesData = {
        isAny: isAnySelected,
        values: selectedHobbies,
        importanceLevel: importanceLevel,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedHobbies)
      };
      
      // APIを呼び出して趣味設定を保存
      const success = await savePreference('hobbies', hobbiesData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('趣味設定の保存中にエラーが発生しました:', error);
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
            <h1 className="text-lg font-medium">共通の趣味</h1>
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
              placeholder="趣味を検索..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full text-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 趣味指定の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            お相手と共通の趣味を持ちたい場合は、希望する趣味を選択してください。
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
            onClick={toggleAnyHobby}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">趣味を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 趣味の重要度（プレミアム会員限定） */}
        {!isAnySelected && (
          <div className="p-4 bg-white border-b">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700">趣味の重要度</p>
              <p className="text-xs text-gray-500">趣味の一致がどれくらい重要か設定します</p>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">あまり重要でない</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleImportanceChange(level)}
                    disabled={!isPremium && level > 3}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      level <= importanceLevel 
                        ? 'bg-teal-500 text-white' 
                        : !isPremium && level > 3 
                          ? 'bg-gray-200 text-gray-400' 
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <FiStar size={16} />
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-500">非常に重要</span>
            </div>
            {!isPremium && (
              <p className="text-xs text-amber-600 mt-2">
                ※4〜5の重要度設定はプレミアム会員専用です
              </p>
            )}
          </div>
        )}

        {/* 選択された趣味の表示 */}
        {!isAnySelected && selectedHobbies.length > 0 && (
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm font-medium text-gray-700 mb-2">選択中の趣味（{selectedHobbies.length}/{isPremium ? 10 : 3}）</p>
            <div className="flex flex-wrap gap-2">
              {selectedHobbies.map((hobby, index) => (
                <div 
                  key={index} 
                  className="bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {hobby}
                  <button 
                    onClick={() => toggleHobby(hobby)}
                    className="ml-1 text-teal-500 p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 趣味カテゴリとリスト */}
        {!isAnySelected && (
          <div className="pb-20">
            {filteredCategories.map((category, categoryIndex) => (
              category.hobbies.length > 0 && (
                <div key={categoryIndex} className="mt-2">
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">{category.name}</h3>
                  </div>
                  <div className="bg-white">
                    <div className="grid grid-cols-2 gap-x-2">
                      {category.hobbies.map((hobby, hobbyIndex) => (
                        <button 
                          key={hobbyIndex}
                          onClick={() => toggleHobby(hobby)}
                          disabled={selectedHobbies.length >= (isPremium ? 10 : 3) && !selectedHobbies.includes(hobby)}
                          className={`flex items-center justify-between px-4 py-3 border-b ${
                            selectedHobbies.length >= (isPremium ? 10 : 3) && !selectedHobbies.includes(hobby) 
                              ? 'opacity-50' 
                              : ''
                          }`}
                        >
                          <span className="text-gray-800">{hobby}</span>
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedHobbies.includes(hobby) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                            {selectedHobbies.includes(hobby) && <FiCheck className="text-white" size={16} />}
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

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、最大10個の趣味を選択でき、趣味の一致度を「非常に重要」まで設定できます。さらに、共通の趣味を持つお相手との「趣味マッチング」機能も利用可能になります。
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
