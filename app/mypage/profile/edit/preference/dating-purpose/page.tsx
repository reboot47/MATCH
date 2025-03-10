"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiInfo } from 'react-icons/fi';
import { saveScrollPosition, restoreScrollPosition, navigateBackWithScrollPosition } from '@/app/utils/scrollPosition';
import { useUser } from '@/components/UserContext';
import { isPremiumUser, savePreference, getPreference, generatePreferenceLabel } from '@/app/utils/userPreferences';

export default function DatingPurposePage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.user?.gender === 'male';
  const isPremium = isPremiumUser(userContext?.user, userContext?.points);
  
  // 出会いの目的の選択肢
  const purposeOptions = [
    "真剣な出会い・結婚",
    "長期的な交際",
    "気軽な恋愛",
    "趣味友達・アクティビティパートナー",
    "ビジネス交流・人脈作り",
    "メッセージ友達",
    "恋愛相談・悩み相談",
    "デートやお出かけ",
    "言語交換",
    "特に決めていない"
  ];

  // 選択された目的のステート
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnySelected, setIsAnySelected] = useState<boolean>(true); // デフォルトで「指定なし」
  const [showInfo, setShowInfo] = useState<string | null>(null);

  // 画面が表示されたときに設定とスクロール位置を復元
  useEffect(() => {
    restoreScrollPosition();
    loadSavedPreferences();
  }, []);
  
  // 保存済みの設定を読み込む
  const loadSavedPreferences = () => {
    try {
      const savedPreference = getPreference('datingPurpose', {
        isAny: true,
        values: [],
        label: '指定なし'
      });
      
      if (savedPreference) {
        setIsAnySelected(savedPreference.isAny);
        setSelectedOptions(savedPreference.values || []);
      }
    } catch (error) {
      console.error('出会いの目的設定の読み込み中にエラーが発生しました:', error);
    }
  };

  // 目的の選択・解除
  const togglePurposeOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // 全ての目的を選択/解除（指定なし）
  const toggleAnyOption = () => {
    if (isAnySelected) {
      setIsAnySelected(false);
    } else {
      setIsAnySelected(true);
      setSelectedOptions([]);
    }
  };

  // 情報表示の切り替え
  const toggleInfo = (option: string) => {
    if (showInfo === option) {
      setShowInfo(null);
    } else {
      setShowInfo(option);
    }
  };

  // 目的の詳細説明
  const getPurposeDescription = (purpose: string) => {
    const descriptions: {[key: string]: string} = {
      "真剣な出会い・結婚": "将来的に結婚を視野に入れた真剣なお付き合いを希望する方向け。長期的なパートナーを探している方に最適です。",
      "長期的な交際": "結婚を急がなくても、安定した長期的な関係を築きたい方向け。お互いを大切にする関係を求める方に。",
      "気軽な恋愛": "あまり将来のことを考えず、今を楽しみたい方向け。プレッシャーなく楽しい時間を過ごせる関係を求める方に。",
      "趣味友達・アクティビティパートナー": "共通の趣味や興味を持つ友達や一緒に活動する相手を探している方向け。恋愛に限らない多様なつながりを求める方に。",
      "ビジネス交流・人脈作り": "キャリアやビジネスに関連した出会いを求める方向け。専門的なつながりや情報交換を重視する方に。",
      "メッセージ友達": "オンラインでの会話や交流を楽しみたい方向け。対面での出会いを急がず、まずは文字ベースでコミュニケーションを取りたい方に。",
      "恋愛相談・悩み相談": "恋愛や人間関係について相談したり意見を交換したりしたい方向け。経験や知恵を共有し合える関係を求める方に。",
      "デートやお出かけ": "一緒にお出かけしたり、デートを楽しんだりする相手を探している方向け。趣味や食事を共有する楽しい時間を求める方に。",
      "言語交換": "外国語の学習や文化交流に興味がある方向け。言語スキルの向上と異文化理解を深める機会を求める方に。",
      "特に決めていない": "特定の目的を定めず、様々な可能性に開かれた出会いを求める方向け。自然な関係の発展を重視する方に。"
    };
    return descriptions[purpose] || "";
  };

  // 完了して保存し、前のページに戻る
  const handleComplete = async () => {
    try {
      // 保存用データを作成
      const purposeData = {
        isAny: isAnySelected,
        values: selectedOptions,
        label: isAnySelected ? '指定なし' : generatePreferenceLabel(selectedOptions)
      };
      
      // APIを呼び出して出会いの目的設定を保存
      const success = await savePreference('datingPurpose', purposeData);
      
      if (success) {
        navigateBackWithScrollPosition(router);
      } else {
        alert('設定の保存に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('出会いの目的設定の保存中にエラーが発生しました:', error);
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
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => navigateBackWithScrollPosition(router)}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium">出会いの目的</h1>
            <button 
              onClick={handleComplete}
              className="text-teal-500 font-medium"
            >
              完了
            </button>
          </div>
        </div>

        {/* 出会いの目的の説明 */}
        <div className="p-4 bg-white border-b">
          <p className="text-sm text-gray-500">
            あなたが求める出会いの目的を選択してください。複数選択が可能です。あなたの価値観に合った出会いが見つかります。
          </p>
        </div>

        {/* 指定なしオプション */}
        <div className="p-4 bg-white border-b">
          <button 
            onClick={toggleAnyOption}
            className="flex items-center justify-between w-full"
          >
            <span className="text-gray-800">目的を指定しない</span>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
              {isAnySelected && <FiCheck className="text-white" size={16} />}
            </div>
          </button>
        </div>

        {/* 出会いの目的オプションリスト */}
        <div className="bg-white">
          {purposeOptions.map((option, index) => (
            <div key={index} className="border-b">
              <div className="flex items-center justify-between w-full px-4 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800">{option}</span>
                  <button 
                    onClick={() => toggleInfo(option)}
                    className="text-gray-400 hover:text-teal-500"
                  >
                    <FiInfo size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => togglePurposeOption(option)}
                  disabled={isAnySelected}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${isAnySelected ? 'opacity-50 border-gray-300' : selectedOptions.includes(option) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}
                >
                  {selectedOptions.includes(option) && !isAnySelected && <FiCheck className="text-white" size={16} />}
                </button>
              </div>
              
              {/* 情報表示部分 */}
              {showInfo === option && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                    {getPurposeDescription(option)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* マッチング説明 */}
        <div className="p-4 bg-gray-50 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">マッチングのヒント</h3>
          <p className="text-sm text-gray-600 mb-3">
            あなたの目的に近い相手とマッチングしやすくなります。複数の目的を選ぶことで、より多くの出会いの可能性が広がります。
          </p>
          <p className="text-sm text-gray-600">
            特に真剣な出会いを求める方は「真剣な出会い・結婚」「長期的な交際」を選ぶと、同じ価値観を持つ方とのマッチング率が高まります。
          </p>
        </div>

        {/* プレミアム会員向けの特典（非プレミアム男性ユーザー向け） */}
        {!isPremium && isMale && (
          <div className="p-4 mt-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-700 font-medium mb-2">プレミアム会員限定</h3>
              <p className="text-sm text-amber-600">
                プレミアム会員になると、あなたの目的に合ったお相手を優先的に表示します。また、お相手の目的もすべて確認できるようになり、価値観の合う方と効率的に出会えます。
              </p>
              <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                プレミアム会員になる
              </button>
            </div>
          </div>
        )}

        {/* 女性ユーザー向けのメッセージ */}
        {!isMale && (
          <div className="p-4 mt-4 mb-8">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <h3 className="text-teal-700 font-medium mb-2">相性の良いマッチング</h3>
              <p className="text-sm text-teal-600">
                あなたの目的をしっかり設定することで、同じ価値観を持つお相手とより出会いやすくなります。複数選択することで、より多くの素敵な出会いの可能性が広がります。
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
