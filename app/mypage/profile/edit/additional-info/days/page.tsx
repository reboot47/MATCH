"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function DaysEditPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  // 曜日の選択肢
  const daysOfWeek = [
    { id: 'monday', label: '月曜日' },
    { id: 'tuesday', label: '火曜日' },
    { id: 'wednesday', label: '水曜日' },
    { id: 'thursday', label: '木曜日' },
    { id: 'friday', label: '金曜日' },
    { id: 'saturday', label: '土曜日', isWeekend: true },
    { id: 'sunday', label: '日曜日', isWeekend: true },
  ];
  
  // 曜日のパターン
  const dayPatterns = [
    { id: 'weekdays', label: '平日（月〜金）', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'weekends', label: '週末（土・日）', days: ['saturday', 'sunday'] },
    { id: 'all_days', label: '毎日', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
  ];
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 曜日の選択状態を切り替える
  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId)
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };
  
  // パターンを選択する
  const selectPattern = (days: string[]) => {
    setSelectedDays(days);
  };
  
  // 保存処理
  const handleSave = () => {
    // ここでAPIを呼び出して曜日の設定を保存
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
            <h1 className="text-lg font-medium">空いている曜日</h1>
            <button 
              onClick={handleSave}
              className="text-teal-500 p-1"
            >
              <FiCheck size={24} />
            </button>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="p-4">
          {/* 曜日パターン */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">よく使うパターン</h3>
            <div className="bg-white rounded-lg shadow">
              {dayPatterns.map((pattern) => (
                <button
                  key={pattern.id}
                  className="w-full py-4 px-4 text-left border-b border-gray-100 flex justify-between items-center"
                  onClick={() => selectPattern(pattern.days)}
                >
                  <span>{pattern.label}</span>
                  {JSON.stringify(selectedDays.sort()) === JSON.stringify(pattern.days.sort()) && (
                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                      <FiCheck size={14} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* 個別の曜日選択 */}
          <div className="bg-white rounded-lg shadow">
            <h3 className="text-sm font-medium p-4 border-b border-gray-100">個別に選択</h3>
            <div className="max-h-80 overflow-y-auto">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  className={`w-full py-4 px-4 text-left border-b border-gray-100 flex justify-between items-center ${
                    day.isWeekend ? 'text-red-500' : ''
                  }`}
                  onClick={() => toggleDay(day.id)}
                >
                  <span>{day.label}</span>
                  {selectedDays.includes(day.id) && (
                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                      <FiCheck size={14} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">空いている曜日について</h3>
            <p className="text-sm text-gray-600">
              ・あなたの予定が空いている曜日をチェックしてください<br />
              ・{isMale ? 
                '相手が予定を合わせやすくなります' : 
                '相手があなたと合う日程を調整しやすくなります'}<br />
              ・重複する人が多い平日よりも、自由度が高い週末の方が会いやすい傾向があります<br />
              ・スケジュールは定期的に更新することをおすすめします
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
