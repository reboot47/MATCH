"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiSearch } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function OccupationSelectionPage() {
  const router = useRouter();
  const [selectedOccupation, setSelectedOccupation] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOccupations, setFilteredOccupations] = useState<string[]>([]);

  // 職業の選択肢（50音順）
  const occupations = [
    "IT・通信", "アパレル・ファッション", "エンターテイメント", "エンジニア", 
    "カウンセラー", "コンサルタント", "デザイナー", "マスコミ・広告", 
    "医師", "医療関係", "音楽関係", "会社員", "会社役員", "海外勤務", 
    "教師・講師", "金融・保険", "公務員", "経営者・オーナー", 
    "芸能関係", "建築・土木", "航空関係", "自営業", "自動車関連", 
    "秘書", "士業（弁護士・会計士等）", "獣医師", "販売・サービス", 
    "看護師", "研究・開発", "税理士", "美容関係", "福祉・介護", 
    "翻訳・通訳", "保育士", "薬剤師", "旅行関係", "リモートワーク", 
    "学生", "専業主婦・主夫", "その他", "無職", "非公開"
  ];

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    setFilteredOccupations(occupations);
  }, []);

  // 検索フィルタリング
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOccupations(occupations);
    } else {
      const filtered = occupations.filter(occ => 
        occ.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOccupations(filtered);
    }
  }, [searchTerm]);

  // 職業選択
  const selectOccupation = (occupation: string) => {
    setSelectedOccupation(occupation);
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して職業情報を保存する処理を追加
    // 例: await saveOccupation(selectedOccupation);
    navigateBackWithScrollPosition(router);
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
              <span className="text-gray-600">キャンセル</span>
            </button>
            <h1 className="text-lg font-medium">職業</h1>
            <button 
              onClick={handleComplete}
              className={`font-medium ${selectedOccupation ? 'text-teal-500' : 'text-gray-300'}`}
              disabled={!selectedOccupation}
            >
              完了
            </button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="職業を検索"
              className="bg-gray-100 w-full py-2 pl-10 pr-4 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 職業選択リスト */}
        <div className="divide-y overflow-y-auto max-h-[calc(100vh-150px)]">
          {filteredOccupations.map((occupation) => (
            <button 
              key={occupation}
              className="flex items-center justify-between w-full p-4"
              onClick={() => selectOccupation(occupation)}
            >
              <span className="text-gray-800">{occupation}</span>
              {selectedOccupation === occupation && (
                <FiCheck className="text-teal-500" size={20} />
              )}
            </button>
          ))}
          {filteredOccupations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              検索結果がありません
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
