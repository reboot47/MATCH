"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiSearch } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';

export default function OccupationPreferencePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  
  // 職業カテゴリとリスト
  const occupationCategories = [
    {
      name: "企業・経営",
      occupations: ["会社経営者", "会社役員", "管理職", "起業家", "コンサルタント"]
    },
    {
      name: "金融・不動産",
      occupations: ["銀行員", "証券会社", "保険会社", "不動産", "ファイナンシャルプランナー"]
    },
    {
      name: "IT・エンジニア",
      occupations: ["エンジニア", "プログラマー", "SE", "デザイナー", "ゲーム業界", "Web業界"]
    },
    {
      name: "医療・福祉",
      occupations: ["医者", "歯科医師", "看護師", "薬剤師", "歯科衛生士", "理学療法士", "介護士", "福祉関係"]
    },
    {
      name: "教育・研究",
      occupations: ["教師", "教授", "研究者", "塾講師"]
    },
    {
      name: "公務員・団体職員",
      occupations: ["公務員", "自衛隊", "警察官", "消防士", "団体職員"]
    },
    {
      name: "クリエイティブ",
      occupations: ["芸能関係", "アーティスト", "音楽関係", "映像制作", "出版関係", "マスコミ関係"]
    },
    {
      name: "専門職",
      occupations: ["弁護士", "税理士", "会計士", "パイロット", "客室乗務員"]
    },
    {
      name: "接客・サービス",
      occupations: ["販売員", "ショップ店員", "アパレル", "美容師", "ネイリスト", "エステティシャン", "ホテルスタッフ", "旅行関係"]
    },
    {
      name: "事務・総務",
      occupations: ["一般事務", "OL", "受付", "秘書", "総務", "人事"]
    },
    {
      name: "その他",
      occupations: ["会社員", "自営業", "フリーランス", "派遣社員", "契約社員", "パート・アルバイト", "学生", "専業主婦（主夫）", "無職"]
    }
  ];

  // 選択された職業のステート
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAnySelected, setIsAnySelected] = useState<boolean>(false);

  // 画面が表示されたときにスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  // 職業の選択・解除
  const toggleOccupation = (occupation: string) => {
    if (selectedOccupations.includes(occupation)) {
      setSelectedOccupations(selectedOccupations.filter(o => o !== occupation));
    } else {
      setSelectedOccupations([...selectedOccupations, occupation]);
    }
  };

  // 全ての職業を選択/解除
  const toggleAnyOccupation = () => {
    if (isAnySelected) {
      setIsAnySelected(false);
      setSelectedOccupations([]);
    } else {
      setIsAnySelected(true);
      setSelectedOccupations([]);
    }
  };

  // 検索クエリの変更
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 検索に一致する職業をフィルタリング
  const filteredCategories = searchQuery
    ? occupationCategories.map(category => ({
        name: category.name,
        occupations: category.occupations.filter(occupation =>
          occupation.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.occupations.length > 0)
    : occupationCategories;

  // 完了して保存し、前のページに戻る
  const handleComplete = () => {
    // APIを呼び出して職業設定を保存する処理を追加
    // 例: await saveOccupationPreference({ isAny: isAnySelected, occupations: selectedOccupations });
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
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">希望職業</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="p-4 bg-white border-b sticky top-0 z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="職業を検索..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full text-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 職業の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            希望する職業を選択してください。複数選択が可能です。
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyOccupation}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">職業を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 職業カテゴリとリスト */}
        <div className="pb-20">
          {filteredCategories.map((category, categoryIndex) => (
            category.occupations.length > 0 && (
              <div key={categoryIndex} className="mt-4">
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700">{category.name}</h3>
                </div>
                <div className="bg-white">
                  {category.occupations.map((occupation, occupationIndex) => (
                    <button 
                      key={occupationIndex}
                      onClick={() => toggleOccupation(occupation)}
                      disabled={isAnySelected}
                      className={`flex items-center justify-between w-full px-4 py-3 border-b ${occupationIndex === category.occupations.length - 1 ? 'border-b-0' : ''} ${isAnySelected ? 'opacity-50' : ''}`}
                    >
                      <span className="text-gray-800">{occupation}</span>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOccupations.includes(occupation) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                        {selectedOccupations.includes(occupation) && <FiCheck className="text-white" size={16} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* プレミアム会員向けの特典（男性ユーザー向け） */}
        {isMale && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、特定の職業を持つ人気会員と優先的にマッチングできます。また、高収入職業の方と出会える確率が3倍になります。
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
