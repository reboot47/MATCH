"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiPlus, FiX } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function LanguagesEditPage() {
  const router = useRouter();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const maxSelection = 5;
  
  // 言語の選択肢と難易度
  const languagesOptions = [
    { name: '日本語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: '英語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: '中国語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: '韓国語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'フランス語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'スペイン語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'イタリア語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'ドイツ語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'ポルトガル語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'ロシア語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'アラビア語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'タイ語', level: ['ネイティブ', '上級', '中級', '初級'] },
    { name: 'ベトナム語', level: ['ネイティブ', '上級', '中級', '初級'] }
  ];
  
  const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);
  
  // 言語の展開と折りたたみ
  const toggleLanguageExpand = (language: string) => {
    if (expandedLanguage === language) {
      setExpandedLanguage(null);
    } else {
      setExpandedLanguage(language);
    }
  };
  
  // 言語と習熟度を選択
  const selectLanguageLevel = (language: string, level: string) => {
    const newLanguage = `${language}（${level}）`;
    
    // すでに同じ言語で別のレベルが選択されている場合は削除
    const filteredLanguages = selectedLanguages.filter(lang => !lang.startsWith(language));
    
    // 最大選択数をチェック
    if (filteredLanguages.length < maxSelection) {
      setSelectedLanguages([...filteredLanguages, newLanguage]);
    }
    
    setExpandedLanguage(null);
  };
  
  // 選択した言語を削除
  const removeLanguage = (fullLanguage: string) => {
    setSelectedLanguages(selectedLanguages.filter(lang => lang !== fullLanguage));
  };
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出して言語情報を保存
    // 実際の実装ではAPIコールを行う
    navigateBackWithScrollPosition(router);
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
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">語学力</h1>
            <button 
              onClick={handleSave}
              className="text-teal-500 p-1"
            >
              <FiCheck size={24} />
            </button>
          </div>
        </div>
        
        {/* 選択した言語の表示 */}
        <div className="p-4 bg-white border-b">
          <div className="mb-2">
            <h2 className="text-sm font-medium text-gray-700">選択した言語（最大5つ）</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.length > 0 ? (
              selectedLanguages.map((language) => (
                <div 
                  key={language}
                  className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {language}
                  <button onClick={() => removeLanguage(language)} className="ml-1">
                    <FiX size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">未選択</p>
            )}
          </div>
        </div>
        
        {/* 言語一覧 */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
            {languagesOptions.map((language) => (
              <div key={language.name} className="overflow-hidden">
                <button
                  className={`w-full py-4 px-4 text-left flex justify-between items-center ${
                    expandedLanguage === language.name ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => toggleLanguageExpand(language.name)}
                  disabled={selectedLanguages.length >= maxSelection && !selectedLanguages.some(lang => lang.startsWith(language.name))}
                >
                  <span>{language.name}</span>
                  <span className="text-gray-400">
                    {expandedLanguage === language.name ? '↑' : '↓'}
                  </span>
                </button>
                
                {/* 習熟度選択 */}
                {expandedLanguage === language.name && (
                  <div className="bg-gray-50 px-4 py-2">
                    <div className="grid grid-cols-2 gap-2">
                      {language.level.map((level) => (
                        <button
                          key={level}
                          className="p-2 bg-white border border-gray-200 rounded text-center text-sm hover:bg-teal-50 hover:border-teal-500"
                          onClick={() => selectLanguageLevel(language.name, level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">語学力について</h3>
            <p className="text-sm text-gray-600">
              ・語学力は国際的なコミュニケーションにおいて重要なスキルです<br />
              ・特に外国語が話せる場合は、相手の興味を引くポイントになります<br />
              ・共通の外国語があると話題になりやすく、コミュニケーションのきっかけになります
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
