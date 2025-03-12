"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiSearch } from 'react-icons/fi';
import { navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';

export default function LocationEditPage() {
  const router = useRouter();
  const [location, setLocation] = useState('大阪府');
  const [searchTerm, setSearchTerm] = useState('');
  const [areaData, setAreaData] = useState<Record<string, string[]>>({});
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // 都道府県リストをAPIから取得
  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/prefectureAreas');
        if (!response.ok) {
          throw new Error('地域データの取得に失敗しました');
        }
        const data = await response.json();
        setAreaData(data);
        
        // 初期値が設定されている場合は選択状態を更新
        if (location && Object.keys(data).includes(location)) {
          setSelectedPrefecture(location);
        }
      } catch (error) {
        console.error('地域データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreaData();
  }, [location]);
  
  // 都道府県リスト
  const prefectures = Object.keys(areaData).length > 0 
    ? Object.keys(areaData) 
    : [];
  
  // 検索フィルター
  const filteredPrefectures = prefectures.filter(prefecture => 
    prefecture.includes(searchTerm)
  );
  
  // 選択された都道府県に基づくエリアリスト
  const areaList = selectedPrefecture && areaData[selectedPrefecture] 
    ? areaData[selectedPrefecture] 
    : [];
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };
  
  // 都道府県および詳細エリアを選択したときの処理
  useEffect(() => {
    if (selectedPrefecture) {
      setLocation(selectedPrefecture);
    }
    
    if (selectedArea) {
      // 詳細エリアも選択されていれば、居住地設定に追加情報として反映させることも可能
      // 例: `${selectedPrefecture} (${selectedArea})`
    }
  }, [selectedPrefecture, selectedArea]);
  
  // 保存処理
  const handleSave = async () => {
    if (!selectedPrefecture) {
      setError('都道府県を選択してください');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      // 保存用のデータを準備
      const locationData = {
        prefecture: selectedPrefecture,
        detailArea: selectedArea || '',
        displayName: selectedArea 
          ? `${selectedPrefecture} (${selectedArea})` 
          : selectedPrefecture
      };
      
      // APIを呼び出してプロフィール情報を更新
      const response = await fetch('/api/profile/updateBasicInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'location',
          location: locationData
        }),
      });
      
      if (!response.ok) {
        throw new Error('プロフィールの更新に失敗しました');
      }
      
      const result = await response.json();
      console.log('居住地が更新されました:', result);
      
      // 前のページに戻る
      navigateBackWithScrollPosition(router);
    } catch (error) {
      console.error('保存エラー:', error);
      setError('保存中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
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
            <h1 className="text-lg font-medium">居住地</h1>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`${isSaving ? 'text-gray-400' : 'text-teal-500'} p-1`}
            >
              {isSaving ? (
                <span className="inline-block w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <FiCheck size={24} />
              )}
            </button>
          </div>
        </div>
        
        {/* 検索フィールド */}
        <div className="p-4 bg-white border-b">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="都道府県を検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        
        {/* 地域データ */}
        {isLoading ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">地域データを読み込み中...</p>
          </div>
        ) : (
          <>
            {/* 都道府県リスト */}
            <div className="bg-white">
              <div className="max-h-screen overflow-y-auto">
                {filteredPrefectures.map((prefecture) => (
                  <button
                    key={prefecture}
                    className={`w-full py-4 px-4 text-left border-b border-gray-100 ${
                      selectedPrefecture === prefecture ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                    onClick={() => {
                      setSelectedPrefecture(prefecture);
                      setSelectedArea(''); // 都道府県変更時に詳細エリアをリセット
                    }}
                  >
                    {prefecture}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 詳細エリア選択 - 都道府県選択後に表示 */}
            {selectedPrefecture && areaList.length > 0 && (
              <div className="bg-gray-50 p-4">
                <h3 className="text-sm font-medium mb-2">詳細エリア（任意）</h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {areaList.map((area) => (
                      <button
                        key={area}
                        className={`w-full py-3 px-4 text-left border-b border-gray-100 ${
                          selectedArea === area ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                        onClick={() => setSelectedArea(area)}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* エラーメッセージ */}
        {error && (
          <div className="fixed bottom-6 left-4 right-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-md animate-fadeIn">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        {/* 保存ボタン（フッター） */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-md">
          <button
            onClick={handleSave}
            disabled={isSaving || !selectedPrefecture}
            className={`w-full py-3 rounded-lg font-medium transition flex justify-center items-center ${isSaving || !selectedPrefecture ? 'bg-gray-300 text-gray-500' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
          >
            {isSaving ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                保存中...
              </>
            ) : (
              <>
                <FiCheck className="mr-2" />
                居住地を保存
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
