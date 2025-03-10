"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function HobbiesSelectionPage() {
  const router = useRouter();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredHobbies, setFilteredHobbies] = useState<string[]>([]);

  // 趣味の選択肢（カテゴリー別）
  const hobbiesMap = {
    "アウトドア": [
      "キャンプ", "釣り", "登山", "ハイキング", "サイクリング", "バーベキュー", 
      "旅行", "スキューバダイビング", "スキー", "スノーボード", "サーフィン"
    ],
    "スポーツ": [
      "ゴルフ", "テニス", "サッカー", "野球", "バスケットボール", "バレーボール", 
      "水泳", "ヨガ", "ランニング", "トレーニング", "卓球", "筋トレ", "マラソン"
    ],
    "文化・芸術": [
      "映画鑑賞", "読書", "音楽鑑賞", "美術館巡り", "博物館巡り", "舞台鑑賞", 
      "写真撮影", "カラオケ", "絵を描く", "楽器演奏", "書道", "茶道"
    ],
    "インドア": [
      "料理", "パン作り", "お菓子作り", "ゲーム", "アニメ", "漫画", "園芸", 
      "DIY", "ショッピング", "ファッション", "ハンドメイド", "コスプレ", "ボードゲーム"
    ],
    "社交": [
      "飲み会", "カフェ巡り", "食べ歩き", "フェス", "ライブ", "ナイトクラブ", 
      "友達と過ごす", "パーティー", "合コン"
    ],
    "その他": [
      "ペット", "ドライブ", "ビジネス", "投資", "プログラミング", "勉強", 
      "語学", "ボランティア", "占い", "瞑想", "ヨガ", "スピリチュアル"
    ]
  };

  // 全趣味リスト（検索用）
  const allHobbies = Object.values(hobbiesMap).flat();

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    setFilteredHobbies(allHobbies);
  }, []);

  // 検索フィルタリング
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHobbies(allHobbies);
    } else {
      const filtered = allHobbies.filter(hobby => 
        hobby.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHobbies(filtered);
    }
  }, [searchTerm]);

  // 趣味の選択・解除
  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(h => h !== hobby));
    } else {
      if (selectedHobbies.length < 10) {
        setSelectedHobbies([...selectedHobbies, hobby]);
      }
    }
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して趣味情報を保存する処理を追加
    // 例: await saveHobbies(selectedHobbies);
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
            <h1 className="text-lg font-medium">趣味・興味</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 選択した趣味タグ */}
        {selectedHobbies.length > 0 && (
          <div className="p-4 bg-white">
            <div className="flex flex-wrap gap-2">
              {selectedHobbies.map(hobby => (
                <div key={hobby} className="flex items-center bg-teal-100 text-teal-700 rounded-full px-3 py-1">
                  <span>{hobby}</span>
                  <button onClick={() => toggleHobby(hobby)} className="ml-1">
                    <FiX size={16} className="text-teal-700" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {selectedHobbies.length}/10 選択中
            </p>
          </div>
        )}

        {/* 検索バー */}
        <div className="p-4 bg-gray-50 sticky top-0 z-10">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="趣味を検索"
              className="bg-white w-full py-2 pl-10 pr-4 rounded-full border border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 検索結果表示 */}
        {searchTerm && (
          <div className="bg-white p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">検索結果</h2>
            <div className="flex flex-wrap gap-2">
              {filteredHobbies.map(hobby => (
                <button 
                  key={hobby}
                  onClick={() => toggleHobby(hobby)}
                  className={`rounded-full px-3 py-1 text-sm border ${
                    selectedHobbies.includes(hobby) 
                      ? 'bg-teal-500 text-white border-teal-500' 
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {hobby}
                </button>
              ))}
            </div>
            {filteredHobbies.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                検索結果がありません
              </p>
            )}
          </div>
        )}

        {/* カテゴリー別趣味リスト（検索していない場合のみ表示） */}
        {!searchTerm && (
          <div className="p-4 pb-20">
            {Object.entries(hobbiesMap).map(([category, hobbies]) => (
              <div key={category} className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">{category}</h2>
                <div className="flex flex-wrap gap-2">
                  {hobbies.map(hobby => (
                    <button 
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      className={`rounded-full px-3 py-1 text-sm border ${
                        selectedHobbies.includes(hobby) 
                          ? 'bg-teal-500 text-white border-teal-500' 
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ガイダンステキスト */}
        <div className="p-4 text-sm text-gray-500 bg-white fixed bottom-0 w-full border-t">
          <p>最大10個まで選択できます。共通の趣味や興味があるユーザーとマッチングされやすくなります。</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
