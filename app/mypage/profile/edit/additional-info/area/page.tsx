"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiChevronDown } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function AreaSelectionPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [expandedPrefectures, setExpandedPrefectures] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 都道府県と主要エリアの定義
  type PrefectureAreasType = {
    [key: string]: string[];
  };

  const [prefectureAreas, setPrefectureAreas] = useState<PrefectureAreasType>({});

  // 都道府県データをJSONファイルから読み込む
  useEffect(() => {
    const fetchPrefectureData = async () => {
      try {
        setIsLoading(true);
        // APIエンドポイントからデータを取得
        const response = await fetch('/api/prefectureAreas', {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('エリアデータの読み込みに失敗しました');
        }
        const data = await response.json();
        setPrefectureAreas(data);
        setIsLoading(false);
      } catch (error) {
        console.error('エリアデータの読み込みエラー:', error);
        setIsLoading(false);
      }
    };

    fetchPrefectureData();
  }, []);

  // 都道府県一覧（検索機能用）
  const prefectures = Object.keys(prefectureAreas);

  // 選択状態を切り替える
  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    );
  };

  // 都道府県の展開状態を切り替える
  const togglePrefectureExpand = (prefecture: string) => {
    setExpandedPrefectures(prev => 
      prev.includes(prefecture) 
        ? prev.filter(p => p !== prefecture) 
        : [...prev, prefecture]
    );
  };

  // 都道府県を選択した場合の処理
  const selectPrefecture = (prefecture: string) => {
    const areas = prefectureAreas[prefecture] || [];
    if (areas.length === 0) return;
    
    togglePrefectureExpand(prefecture);
  };

  // 検索機能
  const filteredPrefectures = searchTerm
    ? prefectures.filter(prefecture => 
        prefecture.toLowerCase().includes(searchTerm.toLowerCase()))
    : prefectures;

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // ここでデータを保存する処理を追加
    navigateBackWithScrollPosition(router);
  };

  // ページのトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      className="min-h-screen bg-white p-4"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateBackWithScrollPosition(router)}
            className="flex items-center text-gray-600"
          >
            <FiChevronLeft className="w-6 h-6 mr-1" />
            戻る
          </button>
          <h1 className="text-xl font-bold text-center flex-1 pr-8">エリア設定</h1>
        </div>

        {/* 検索欄 */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="都道府県を検索"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* エリア一覧 */}
        <div className="mb-20">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredPrefectures.length > 0 ? (
            filteredPrefectures.map(prefecture => (
              <div key={prefecture} className="border-b border-gray-200 py-2">
                <div
                  className="flex items-center justify-between py-2 cursor-pointer"
                  onClick={() => selectPrefecture(prefecture)}
                >
                  <span className="font-medium">{prefecture}</span>
                  <FiChevronDown
                    className={`w-5 h-5 transform transition-transform ${
                      expandedPrefectures.includes(prefecture) ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {expandedPrefectures.includes(prefecture) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {prefectureAreas[prefecture]?.map(area => (
                        <div
                          key={area}
                          className="flex items-center justify-between py-2 pl-4 pr-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleArea(area)}
                        >
                          <span className="text-gray-700">{area}</span>
                          {selectedAreas.includes(area) && (
                            <FiCheck className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              検索結果がありません
            </div>
          )}
        </div>

        {/* 完了ボタン */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleComplete}
            className={`w-full py-3 rounded-lg font-bold ${
              selectedAreas.length > 0
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
            disabled={selectedAreas.length === 0}
          >
            {selectedAreas.length > 0 ? `${selectedAreas.length}箇所を設定` : "エリアを選択してください"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
