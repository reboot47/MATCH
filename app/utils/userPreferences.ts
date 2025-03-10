/**
 * マッチング条件設定に関するユーティリティ関数
 */

import { UserPoints, UserProfile } from "@/components/UserContext";

/**
 * ユーザーがプレミアム会員かどうかを判定
 */
export const isPremiumUser = (user: UserProfile | null, points: UserPoints | null): boolean => {
  if (!user || !points || !points.subscription) return false;
  
  // プレミアムまたはVIPプランの場合はプレミアム会員と判定
  return ['premium', 'vip'].includes(points.subscription.plan);
};

/**
 * 条件設定の変更をAPIに保存するための汎用関数
 */
export const savePreference = async (
  preferenceType: string, 
  preferences: any
): Promise<boolean> => {
  try {
    // TODO: 実際のAPI呼び出しを実装
    console.log(`[API] ${preferenceType}の設定を保存:`, preferences);
    
    // ローカルストレージにも保存（開発用）
    localStorage.setItem(`preference_${preferenceType}`, JSON.stringify(preferences));
    
    return true;
  } catch (error) {
    console.error(`${preferenceType}の設定保存中にエラーが発生しました:`, error);
    return false;
  }
};

/**
 * 保存済みの条件設定を取得するための汎用関数
 */
export const getPreference = <T>(preferenceType: string, defaultValue: T): T => {
  try {
    // ローカルストレージから取得（開発用）
    const saved = localStorage.getItem(`preference_${preferenceType}`);
    
    if (!saved) return defaultValue;
    
    return JSON.parse(saved) as T;
  } catch (error) {
    console.error(`${preferenceType}の設定取得中にエラーが発生しました:`, error);
    return defaultValue;
  }
};

/**
 * 条件設定の表示用ラベルを生成（例：選択された項目が多い場合は「〇〇 他N項目」と表示）
 */
export const generatePreferenceLabel = (
  values: string[], 
  anyValue: boolean = false,
  maxDisplayItems: number = 2
): string => {
  if (anyValue || values.length === 0) {
    return '指定なし';
  }
  
  if (values.length <= maxDisplayItems) {
    return values.join('、');
  }
  
  return `${values.slice(0, maxDisplayItems).join('、')} 他${values.length - maxDisplayItems}項目`;
};

/**
 * 検索条件のオブジェクトをAPI用にフォーマット
 */
export const formatPreferencesForApi = (allPreferences: Record<string, any>): Record<string, any> => {
  const formattedPreferences: Record<string, any> = {};
  
  // 各条件をAPIに送信する形式に変換
  Object.entries(allPreferences).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      if ('min' in value && 'max' in value) {
        // 範囲指定の場合
        formattedPreferences[key] = {
          min: value.min,
          max: value.max
        };
      } else if ('values' in value) {
        // 複数選択の場合
        formattedPreferences[key] = value.values;
      } else {
        // その他の場合はそのまま
        formattedPreferences[key] = value;
      }
    } else {
      // プリミティブ値の場合はそのまま
      formattedPreferences[key] = value;
    }
  });
  
  return formattedPreferences;
};
