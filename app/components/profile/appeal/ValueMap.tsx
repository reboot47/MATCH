"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ValueMap as ValueMapType } from '@/app/types/profile';
import { toast } from 'react-hot-toast';

// 価値観マップの型定義
interface ValueMapProps {
  valueMap?: ValueMapType;
  onUpdate: (data: ValueMapType) => void;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

interface ValueCategory {
  values: Record<string, { importance: number; description: string }>;
}

export default function ValueMap({
  valueMap,
  onUpdate,
  isUpdating = false,
  isViewOnly = false
}: ValueMapProps) {
  // コンポーネントマウント時のデバッグ情報
  useEffect(() => {
    console.log('ValueMap Component Mounted');
    console.log('Received valueMap prop:', valueMap);
    // VALUE_CATEGORIESが正しく定義されているか確認
    if (!Array.isArray(VALUE_CATEGORIES) || VALUE_CATEGORIES.length === 0) {
      console.warn('警告: VALUE_CATEGORIESが正しく定義されていないか空です');
    } else {
      setActiveCategory(VALUE_CATEGORIES[0].id);
    }
  }, []);

  // 価値観カテゴリを関数内で定義
  const VALUE_CATEGORIES = [
    {
      id: 'lifestyle',
      title: 'ライフスタイル',
      icon: '🏠',
      items: [
        { id: 'work_life_balance', name: 'ワークライフバランス', description: '仕事と私生活のバランス' },
        { id: 'career_focus', name: 'キャリア志向', description: '仕事やキャリアの優先度' },
        { id: 'social_activity', name: '社交性', description: '人との交流の頻度や重要度' },
        { id: 'living_environment', name: '住環境', description: '都会派か田舎派か、住む場所の好み' },
        { id: 'daily_rhythm', name: '生活リズム', description: '朝型か夜型か、日々の生活パターン' }
      ]
    },
    {
      id: 'relationships',
      title: '人間関係',
      icon: '👥',
      items: [
        { id: 'communication_style', name: 'コミュニケーションスタイル', description: '直接的か間接的か、表現の仕方' },
        { id: 'emotional_openness', name: '感情表現', description: '感情をどれだけオープンに表現するか' },
        { id: 'conflict_resolution', name: '対立解決方法', description: '対立や意見の相違にどう対処するか' },
        { id: 'trust_building', name: '信頼構築', description: '人との信頼関係をどう築くか' },
        { id: 'personal_space', name: '個人の領域', description: 'プライバシーや個人の時間の重要度' }
      ]
    },
    {
      id: 'personal_growth',
      title: '自己成長',
      icon: '🌱',
      items: [
        { id: 'learning_attitude', name: '学習姿勢', description: '新しいことを学ぶことへの意欲' },
        { id: 'challenge_comfort', name: 'チャレンジ意欲', description: '新しいことへの挑戦と快適さのバランス' },
        { id: 'self_improvement', name: '自己啓発', description: '自分自身を向上させることへの取り組み' },
        { id: 'goal_setting', name: '目標設定', description: '目標の立て方と達成への姿勢' },
        { id: 'adaptability', name: '適応力', description: '変化や新しい環境への対応力' }
      ]
    },
    {
      id: 'philosophy',
      title: '人生哲学',
      icon: '🔮',
      items: [
        { id: 'life_purpose', name: '人生の目的', description: '人生における目的や意義の考え方' },
        { id: 'ethical_values', name: '倫理観', description: '何が正しいか、道徳的な価値観' },
        { id: 'spirituality', name: 'スピリチュアリティ', description: '精神性や信念に関する考え' },
        { id: 'happiness_definition', name: '幸福の定義', description: '何があなたを本当に幸せにするか' },
        { id: 'legacy', name: '残したいもの', description: '将来に残したい影響や遺産' }
      ]
    },
    {
      id: 'future',
      title: '将来展望',
      icon: '🚀',
      items: [
        { id: 'family_plans', name: '家族計画', description: '将来の家族や子育てについての考え' },
        { id: 'career_aspirations', name: 'キャリア志向', description: '職業やキャリアについての長期的な目標' },
        { id: 'financial_attitude', name: '金銭感覚', description: 'お金の使い方や貯め方についての姿勢' },
        { id: 'long_term_goals', name: '長期目標', description: '5年後、10年後の自分のビジョン' },
        { id: 'risk_approach', name: 'リスク許容度', description: 'リスクに対する姿勢や考え方' }
      ]
    }
  ];

  // 初期値を設定
  const createInitialValueMap = (): ValueMapType => {
    try {
      const valueMap: ValueMapType = {
        categories: {}
      };
      
      if (Array.isArray(VALUE_CATEGORIES)) {
        VALUE_CATEGORIES.forEach(category => {
          valueMap.categories[category.id] = {
            values: {}
          };
          
          if (Array.isArray(category.items)) {
            category.items.forEach(item => {
              valueMap.categories[category.id].values[item.id] = {
                importance: 3, // 1-5のスケールで中間
                description: ''
              };
            });
          }
        });
      }
      
      return valueMap;
    } catch (error) {
      console.error("Error creating initial value map:", error);
      // 最低限の構造を持つフォールバック値を返す
      return {
        categories: {}
      };
    }
  };

  const [currentValues, setCurrentValues] = useState<ValueMapType>(() => {
    try {
      // valueMap が undefined または null の場合は初期値を生成
      if (!valueMap) {
        console.info('価値観マップの初期データを生成します');
        return createInitialValueMap();
      }
      
      // valueMap はあるが、categories がない場合
      if (!valueMap.categories) {
        console.info('valueMapは存在しますが、categoriesプロパティがありません。空のカテゴリを追加します');
        return {
          ...valueMap,
          categories: {}
        };
      }
      
      return valueMap;
    } catch (error) {
      console.warn("価値観マップの初期化中にエラーが発生しました:", error);
      return createInitialValueMap();
    }
  });
  
  // UIの状態管理
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    try {
      // VALUE_CATEGORIESが配列で、要素があるか確認
      if (Array.isArray(VALUE_CATEGORIES) && VALUE_CATEGORIES.length > 0) {
        return VALUE_CATEGORIES[0].id;
      }
      return ''; // 空の文字列を返す（デフォルト値）
    } catch (error) {
      console.error('Error setting initial active category:', error);
      return ''; // エラーが発生した場合も空の文字列を返す
    }
  });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // アクティブカテゴリオブジェクトを取得（安全にアクセス）
  const activeCtgObj = useMemo(() => {
    if (!Array.isArray(VALUE_CATEGORIES)) return null;
    return VALUE_CATEGORIES.find(c => c.id === activeCategory) || null;
  }, [activeCategory]);

  // アクティブカテゴリの設定
  const setActiveCategoryState = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  // 重要度の変更
  const handleImportanceChange = useCallback((categoryId: string, itemId: string, level: number) => {
    if (isViewOnly) return;
    
    setCurrentValues(prev => {
      const updated = { ...prev };
      
      // カテゴリが存在しない場合は作成
      if (!updated.categories) {
        updated.categories = {};
      }
      
      if (!updated.categories[categoryId]) {
        updated.categories[categoryId] = { values: {} };
      }
      
      if (!updated.categories[categoryId].values) {
        updated.categories[categoryId].values = {};
      }
      
      if (!updated.categories[categoryId].values[itemId]) {
        updated.categories[categoryId].values[itemId] = { importance: level, description: '' };
      } else {
        updated.categories[categoryId].values[itemId] = {
          ...updated.categories[categoryId].values[itemId],
          importance: level
        };
      }
      
      return updated;
    });
    
    setHasChanges(true);
  }, [isViewOnly]);
  
  // 説明の変更
  const handleDescriptionChange = useCallback((categoryId: string, itemId: string, description: string) => {
    if (isViewOnly) return;
    
    setCurrentValues(prev => {
      const updated = { ...prev };
      
      // カテゴリが存在しない場合は作成
      if (!updated.categories) {
        updated.categories = {};
      }
      
      if (!updated.categories[categoryId]) {
        updated.categories[categoryId] = { values: {} };
      }
      
      if (!updated.categories[categoryId].values) {
        updated.categories[categoryId].values = {};
      }
      
      if (!updated.categories[categoryId].values[itemId]) {
        updated.categories[categoryId].values[itemId] = { importance: 3, description };
      } else {
        updated.categories[categoryId].values[itemId] = {
          ...updated.categories[categoryId].values[itemId],
          description
        };
      }
      
      return updated;
    });
    
    setHasChanges(true);
  }, [isViewOnly]);

  // 変更の保存
  const saveChanges = useCallback(() => {
    try {
      console.log('Saving changes:', currentValues);
      setIsSaving(true);
      
      if (onUpdate) {
        onUpdate(currentValues);
      }
      
      setHasChanges(false);
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setIsSaving(false);
    }
  }, [currentValues, onUpdate]);

  // 変更をリセット
  const resetChanges = useCallback(() => {
    try {
      console.log('Resetting changes to:', valueMap);
      const initialValueMap = valueMap ? { ...valueMap } : createInitialValueMap();
      
      // もし valueMap.categories が undefined/null の場合は空のオブジェクトを設定
      if (!initialValueMap.categories) {
        initialValueMap.categories = {};
      }
      
      setCurrentValues(initialValueMap);
      setHasChanges(false);
    } catch (error) {
      console.error('Error resetting changes:', error);
      // エラーが発生した場合でも新しい値マップを作成
      setCurrentValues(createInitialValueMap());
      setHasChanges(false);
    }
  }, [valueMap]);

  return (
    <div className="bg-white rounded-lg">
      {/* カテゴリータブ */}
      <div className="overflow-x-auto mb-6">
        <div className="flex space-x-2 min-w-max pb-2">
          {Array.isArray(VALUE_CATEGORIES) && VALUE_CATEGORIES.length > 0 ? (
            VALUE_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategoryState(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span> {category.title}
              </button>
            ))
          ) : (
            <div>カテゴリが定義されていません</div>
          )}
        </div>
      </div>
      
      {/* アクティブカテゴリーの表示 */}
      {Array.isArray(VALUE_CATEGORIES) && VALUE_CATEGORIES.length > 0 ? (
        VALUE_CATEGORIES.map(category => {
          // カテゴリーID一致確認し、表示すべきかを決定
          const isActive = activeCategory === category.id;
          if (!isActive) return null; // 非アクティブなカテゴリーは表示しない

          return (
            <div 
              key={category.id} 
              className={isActive ? 'block' : 'hidden'}
            >
              <h3 className="text-lg font-medium mb-4">
                {category.icon} {category.title}
              </h3>
              
              <div className="space-y-6">
                {Array.isArray(category.items) && category.items.length > 0 ? (
                  category.items.map(item => {
                    // 値が見つからない場合は、デフォルト値を使用
                    const value = currentValues?.categories?.[category.id]?.values?.[item.id] || {
                      importance: 3,
                      description: ''
                    };
                    
                    return (
                      <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          {!isViewOnly && (
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map(level => (
                                <button
                                  key={level}
                                  onClick={() => {
                                    if (isViewOnly) return;
                                    handleImportanceChange(category.id, item.id, level);
                                  }}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    value.importance === level
                                      ? 'bg-teal-500 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  aria-label={`重要度 ${level}`}
                                  disabled={isViewOnly}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          )}
                          {isViewOnly && (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-500">重要度:</span>
                              <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                                {value.importance || 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        {!isViewOnly ? (
                          <textarea
                            value={value.description || ''}
                            onChange={(e) => handleDescriptionChange(category.id, item.id, e.target.value)}
                            placeholder="あなたの考えや価値観を入力してください"
                            className="w-full h-24 p-2 mt-2 border border-gray-200 rounded-lg text-sm resize-none"
                            disabled={isUpdating || isSaving}
                          />
                        ) : value.description ? (
                          <div className="mt-2 text-sm text-gray-700">
                            {value.description}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <div>アイテムが定義されていません</div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div>カテゴリが定義されていません</div>
      )}
      
      {/* 変更保存ボタン */}
      {!isViewOnly && hasChanges && (
        <div className="fixed bottom-4 right-4 flex space-x-2 p-2 bg-white rounded-lg shadow-md">
          <button
            onClick={resetChanges}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none"
            disabled={isSaving}
          >
            キャンセル
          </button>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="mr-2">保存中...</span>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              '変更を保存'
            )}
          </button>
        </div>
      )}
      
      {/* ヒント */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">価値観マップのヒント:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>自分にとって重要な価値観に高い重要度をつけましょう</li>
          <li>説明には具体的なエピソードや考えを含めるとよりあなたの人柄が伝わります</li>
          <li>ありのままの自分を表現することで、価値観の合うパートナーとマッチングしやすくなります</li>
          <li>すべての項目を埋める必要はありません。特に大切にしている価値観に焦点を当てましょう</li>
        </ul>
      </div>
    </div>
  );
}
