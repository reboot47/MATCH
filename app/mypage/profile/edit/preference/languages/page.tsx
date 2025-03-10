"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiSearch } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function LanguagesPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = userContext?.user?.isPremium || false;
  
  // 言語の選択肢
  const languages = [
    "日本語", "英語", "中国語", "韓国語", "フランス語", "スペイン語", "イタリア語", 
    "ドイツ語", "ロシア語", "ポルトガル語", "ベトナム語", "タイ語", "インドネシア語", 
    "タガログ語", "ヒンディー語", "アラビア語", "トルコ語", "その他"
  ];

  // 選択された言語のステート
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAnySelected, setIsAnySelected] = useState<boolean>(true); // デフォルトで「指定なし」
  const [proficiencyLevels, setProficiencyLevels] = useState<{[key: string]: string}>({});

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 言語の選択・解除
  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      // 選択解除の場合、習熟度も削除
      const newProficiencyLevels = {...proficiencyLevels};
      delete newProficiencyLevels[language];
      setProficiencyLevels(newProficiencyLevels);
      
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      // プレミアムでない場合は2つまで、プレミアムの場合は5つまで選択可能
      const maxSelections = isPremium ? 5 : 2;
      if (selectedLanguages.length < maxSelections) {
        setSelectedLanguages([...selectedLanguages, language]);
        // デフォルトで「日常会話レベル」を設定
        setProficiencyLevels({...proficiencyLevels, [language]: '日常会話レベル'});
      }
    }
  };

  // 言語の指定なしを選択/解除
  const toggleAnyLanguage = () => {
    if (isAnySelected) {
      setIsAnySelected(false);
    } else {
      setIsAnySelected(true);
      setSelectedLanguages([]);
      setProficiencyLevels({});
    }
  };

  // 習熟度の変更
  const changeProficiencyLevel = (language: string, level: string) => {
    setProficiencyLevels({...proficiencyLevels, [language]: level});
  };

  // 検索クエリの変更
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 検索に一致する言語をフィルタリング
  const filteredLanguages = searchQuery
    ? languages.filter(language =>
        language.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : languages;

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して言語設定を保存する処理を追加
    // 例: await saveLanguagesPreference({ 
    //   isAny: isAnySelected, 
    //   languages: selectedLanguages.map(lang => ({
    //     name: lang,
    //     level: proficiencyLevels[lang] || '日常会話レベル'
    //   }))
    // });
    navigateBackWithScrollPosition(router);
  };

  // ページのトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  // 習熟度の選択肢
  const proficiencyOptions = [
    "ネイティブ",
    "ビジネスレベル",
    "日常会話レベル",
    "基礎レベル"
  ];

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
            <h1 className="text-lg font-medium">言語</h1>
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
              placeholder="言語を検索..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full text-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 言語指定の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            お相手が話せる言語について、希望する条件を選択してください。
            {!isPremium && (
              <span className="text-amber-600 block mt-1">
                ※無料会員は最大2つまで選択できます（プレミアム会員は5つまで）
              </span>
            )}
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyLanguage}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">言語を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 選択された言語の表示と習熟度設定 */}
        {!isAnySelected && selectedLanguages.length > 0 && (
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm font-medium text-gray-700 mb-2">選択中の言語（{selectedLanguages.length}/{isPremium ? 5 : 2}）</p>
            <div className="space-y-3">
              {selectedLanguages.map((language, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{language}</span>
                    <button 
                      onClick={() => toggleLanguage(language)}
                      className="text-red-500 text-sm"
                    >
                      削除
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">習熟度</p>
                    <div className="grid grid-cols-2 gap-2">
                      {proficiencyOptions.map((level, levelIndex) => (
                        <button
                          key={levelIndex}
                          onClick={() => changeProficiencyLevel(language, level)}
                          className={`text-xs py-1 px-2 rounded-full border ${
                            proficiencyLevels[language] === level
                              ? 'bg-teal-500 text-white border-teal-500'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 言語リスト */}
        {!isAnySelected && (
          <div className="pb-20">
            <div className="bg-white">
              {filteredLanguages.map((language, index) => (
                <button 
                  key={index}
                  onClick={() => toggleLanguage(language)}
                  disabled={selectedLanguages.length >= (isPremium ? 5 : 2) && !selectedLanguages.includes(language)}
                  className={`flex items-center justify-between w-full px-4 py-4 border-b ${
                    selectedLanguages.length >= (isPremium ? 5 : 2) && !selectedLanguages.includes(language) 
                      ? 'opacity-50' 
                      : ''
                  }`}
                >
                  <span className="text-gray-800">{language}</span>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedLanguages.includes(language) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                    {selectedLanguages.includes(language) && <FiCheck className="text-white" size={16} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 言語に関するヒント */}
        <div className="p-4 bg-gray-50 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">言語とマッチングについて</h3>
          <p className="text-sm text-gray-600">
            同じ言語を話すお相手を選ぶことで、コミュニケーションをスムーズに取ることができます。特に国際交流を希望する方は、共通の言語を持つことが重要です。
          </p>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、より多くの言語を条件に設定でき、言語習熟度による詳細な検索が可能になります。また、多言語対応のお相手と優先的にマッチングできます。
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
