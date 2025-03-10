"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiPlus, FiX } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function HobbiesEditPage() {
  const router = useRouter();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [customHobby, setCustomHobby] = useState('');
  const maxSelection = 5;
  
  // 趣味の選択肢
  const hobbyOptions = [
    'カフェ巡り', '映画鑑賞', '音楽鑑賞', 'ライブ・コンサート', '読書', '料理', 
    '旅行', 'ドライブ', 'カラオケ', 'アニメ・漫画', 'ゲーム', 'キャンプ', 
    'ショッピング', 'フィットネス', 'ヨガ', 'ジョギング', '写真撮影', 'アウトドア', 
    'インテリア', '美術館・博物館', '釣り', 'スキー・スノボ', 'サーフィン', '温泉巡り',
    'お酒', 'グルメ・食べ歩き', 'DIY', 'ガーデニング', 'ペット', 'ファッション',
    'スポーツ観戦', 'ダンス', '語学', 'プログラミング', '副業'
  ];
  
  // チェックボックス切り替え
  const toggleSelection = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(item => item !== hobby));
    } else {
      if (selectedHobbies.length < maxSelection) {
        setSelectedHobbies([...selectedHobbies, hobby]);
      }
    }
  };
  
  // カスタム趣味を追加
  const addCustomHobby = () => {
    if (customHobby.trim() && !selectedHobbies.includes(customHobby) && selectedHobbies.length < maxSelection) {
      setSelectedHobbies([...selectedHobbies, customHobby]);
      setCustomHobby('');
    }
  };
  
  // カスタム趣味を削除
  const removeHobby = (hobby: string) => {
    setSelectedHobbies(selectedHobbies.filter(item => item !== hobby));
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
    // ここでAPIを呼び出して趣味を保存
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
            <h1 className="text-lg font-medium">趣味・好きなこと</h1>
            <button 
              onClick={handleSave}
              className="text-teal-500 p-1"
            >
              <FiCheck size={24} />
            </button>
          </div>
        </div>
        
        {/* 選択した趣味の表示 */}
        <div className="p-4 bg-white border-b">
          <div className="mb-2">
            <h2 className="text-sm font-medium text-gray-700">選択した趣味（最大5つ）</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedHobbies.length > 0 ? (
              selectedHobbies.map((hobby) => (
                <div 
                  key={hobby}
                  className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {hobby}
                  <button onClick={() => removeHobby(hobby)} className="ml-1">
                    <FiX size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">未選択</p>
            )}
          </div>
        </div>
        
        {/* 自由入力フォーム */}
        <div className="p-4 bg-white border-b">
          <div className="flex">
            <input
              type="text"
              value={customHobby}
              onChange={(e) => setCustomHobby(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="その他の趣味を入力"
              maxLength={10}
              disabled={selectedHobbies.length >= maxSelection}
            />
            <button
              onClick={addCustomHobby}
              className="bg-teal-500 text-white p-2 rounded-r-lg disabled:bg-gray-300"
              disabled={!customHobby.trim() || selectedHobbies.length >= maxSelection}
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
        
        {/* 趣味の選択肢 */}
        <div className="bg-white">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-3">一般的な趣味から選ぶ</h2>
            <div className="grid grid-cols-2 gap-2">
              {hobbyOptions.map((hobby) => (
                <button
                  key={hobby}
                  className={`p-3 rounded-lg text-center text-sm border ${
                    selectedHobbies.includes(hobby)
                      ? 'bg-teal-50 border-teal-400 text-teal-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                  onClick={() => toggleSelection(hobby)}
                  disabled={selectedHobbies.length >= maxSelection && !selectedHobbies.includes(hobby)}
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
