import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClipboardCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface MatchingPreferencesProps {
  preferences?: {
    ageRange?: [number, number];
    distance?: number;
    genderPreference?: string;
    dealbreakers?: string[];
    priorities?: {
      age?: number;
      distance?: number;
      interests?: number;
      occupation?: number;
      personality?: number;
    };
  };
  onSave: (preferences: any) => Promise<boolean>;
  isUpdating?: boolean;
}

export default function MatchingPreferences({ 
  preferences: initialPreferences, 
  onSave,
  isUpdating
}: MatchingPreferencesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialPreferences || {
    ageRange: [20, 40],
    distance: 50,
    genderPreference: 'all',
    dealbreakers: [],
    priorities: {
      age: 3,
      distance: 4,
      interests: 5,
      occupation: 2,
      personality: 4
    }
  });

  // フォームデータの変更ハンドラ
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 優先度の変更
  const handlePriorityChange = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [key]: value
      }
    }));
  };

  // 設定の保存
  const savePreferences = async () => {
    try {
      // 実際のAPIエンドポイントに合わせて変更
      /*
      await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      */
      
      // モックレスポンス
      const success = await onSave(formData);
      if (success) {
        setIsEditing(false);
        toast.success('マッチング設定を保存しました');
      } else {
        toast.error('設定の保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('設定の保存に失敗しました');
    }
  };

  // 優先度ラベルの取得
  const getPriorityLabel = (key: string) => {
    const labels: Record<string, string> = {
      age: '年齢',
      distance: '距離',
      interests: '共通の興味',
      occupation: '職業',
      personality: '性格の相性'
    };
    return labels[key] || key;
  };

  // 性別ラベルの取得
  const genderLabel = (gender: string) => {
    const labels: Record<string, string> = {
      all: '全て',
      male: '男性',
      female: '女性',
      'non-binary': 'ノンバイナリー'
    };
    return labels[gender] || gender;
  };

  // 優先度値の取得
  const getPriorityValue = (value: number) => {
    const values: Record<number, string> = {
      1: '重要ではない',
      2: 'やや重要',
      3: '普通',
      4: 'やや重要',
      5: '非常に重要'
    };
    return values[value] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <FaClipboardCheck className="mr-2 text-teal-500" /> マッチング設定
        </h2>
        <button
          onClick={() => {
            if (isEditing) savePreferences();
            else setIsEditing(true);
          }}
          className={`px-4 py-2 rounded-md transition-colors ${
            isEditing ? 'bg-teal-500 text-white' : 'border border-teal-500 text-teal-500'
          }`}
          disabled={isUpdating}
        >
          {isUpdating ? '保存中...' : isEditing ? '保存' : '編集'}
        </button>
      </div>

      <div className="space-y-8">
        {/* 年齢範囲 */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">年齢範囲</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">{formData.ageRange?.[0] || 18}</div>
            <div className="flex-1 relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-2 bg-teal-500 rounded-full"
                  style={{ 
                    left: `${((formData.ageRange?.[0] || 18) - 18) / (70 - 18) * 100}%`, 
                    right: `${100 - ((formData.ageRange?.[1] || 50) - 18) / (70 - 18) * 100}%`
                  }}
                ></div>
              </div>
              <input 
                type="range" 
                min="18" 
                max="70" 
                step="1"
                disabled={!isEditing}
                value={formData.ageRange?.[0] || 18}
                onChange={(e) => {
                  const min = parseInt(e.target.value);
                  const max = formData.ageRange?.[1] || 50;
                  if (min < max) {
                    handleChange('ageRange', [min, max]);
                  }
                }}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
              />
              <input 
                type="range" 
                min="18" 
                max="70" 
                step="1"
                disabled={!isEditing}
                value={formData.ageRange?.[1] || 50}
                onChange={(e) => {
                  const max = parseInt(e.target.value);
                  const min = formData.ageRange?.[0] || 18;
                  if (max > min) {
                    handleChange('ageRange', [min, max]);
                  }
                }}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm font-medium">{formData.ageRange?.[1] || 50}</div>
          </div>
        </div>

        {/* 距離 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">検索半径</h3>
            <span className="text-sm text-gray-600">{formData.distance || 50}km</span>
          </div>
          <input
            type="range"
            min="1"
            max="300"
            step="1"
            disabled={!isEditing}
            value={formData.distance || 50}
            onChange={(e) => handleChange('distance', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer disabled:cursor-default"
          />
        </div>

        {/* 性別設定 */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">興味のある性別</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'male', 'female', 'non-binary'].map(gender => (
              <button
                key={gender}
                onClick={() => isEditing && handleChange('genderPreference', gender)}
                disabled={!isEditing}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  formData.genderPreference === gender
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {genderLabel(gender)}
              </button>
            ))}
          </div>
        </div>

        {/* 重要な要素 */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-4">優先事項</h3>
          <div className="space-y-4">
            {Object.entries(formData.priorities || {}).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{getPriorityLabel(key)}</span>
                  <span className="text-sm text-gray-500">{getPriorityValue(value as number)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  disabled={!isEditing}
                  value={value}
                  onChange={(e) => handlePriorityChange(key, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer disabled:cursor-default"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
