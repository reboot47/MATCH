import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClipboardCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface MatchingPreferencesProps {
  preferences: any;
  editable: boolean;
}

export default function MatchingPreferences({ preferences: initialPreferences, editable }: MatchingPreferencesProps) {
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
      setIsEditing(false);
      toast.success('マッチング設定を保存しました');
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

  // スライダーのレンダリング
  const renderSlider = (min: number, max: number, value: number, onChange: (val: number) => void) => (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      disabled={!isEditing}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  );

  // 範囲スライダーのレンダリング
  const RangeSlider = ({ min, max, value, onChange, disabled }: { 
    min: number;
    max: number;
    value: [number, number];
    onChange: (val: [number, number]) => void;
    disabled: boolean;
  }) => {
    return (
      <div className="relative pt-5 pb-1">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{
              left: `${((value[0] - min) / (max - min)) * 100}%`,
              width: `${((value[1] - value[0]) / (max - min)) * 100}%`
            }}
          ></div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val < value[1]) {
              onChange([val, value[1]]);
            }
          }}
          disabled={disabled}
          className="absolute top-0 h-2 w-full appearance-none bg-transparent pointer-events-none"
          style={{ appearance: 'none', WebkitAppearance: 'none' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val > value[0]) {
              onChange([value[0], val]);
            }
          }}
          disabled={disabled}
          className="absolute top-0 h-2 w-full appearance-none bg-transparent pointer-events-none"
          style={{ appearance: 'none', WebkitAppearance: 'none' }}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <FaClipboardCheck className="mr-2 text-blue-500" /> マッチング設定
        </h2>
        {editable && (
          <button
            onClick={() => {
              if (isEditing) savePreferences();
              else setIsEditing(true);
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              isEditing ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500'
            }`}
          >
            {isEditing ? '保存' : '編集'}
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* 年齢範囲 */}
        <div>
          <h3 className="text-lg font-medium mb-3">年齢範囲</h3>
          <div className="px-2">
            <RangeSlider
              min={18}
              max={80}
              value={formData.ageRange}
              onChange={val => handleChange('ageRange', val)}
              disabled={!isEditing}
            />
            <div className="flex justify-between mt-1 text-sm text-gray-600">
              <span>{formData.ageRange[0]}歳</span>
              <span>{formData.ageRange[1]}歳</span>
            </div>
          </div>
        </div>

        {/* 距離 */}
        <div>
          <h3 className="text-lg font-medium mb-3">検索距離: {formData.distance}km</h3>
          <div className="px-2">
            {renderSlider(1, 200, formData.distance, val => handleChange('distance', val))}
            <div className="flex justify-between mt-1 text-sm text-gray-600">
              <span>近距離</span>
              <span>遠距離</span>
            </div>
          </div>
        </div>

        {/* 性別設定 */}
        <div>
          <h3 className="text-lg font-medium mb-3">興味がある性別</h3>
          <div className="flex gap-4">
            {[
              { value: 'male', label: '男性' },
              { value: 'female', label: '女性' },
              { value: 'all', label: '全て' }
            ].map(gender => (
              <div key={gender.value} className="flex items-center">
                <input
                  type="radio"
                  id={`gender-${gender.value}`}
                  name="genderPreference"
                  checked={formData.genderPreference === gender.value}
                  onChange={() => handleChange('genderPreference', gender.value)}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`gender-${gender.value}`} className="ml-2 text-gray-700">
                  {gender.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* マッチング優先度 */}
        <div>
          <h3 className="text-lg font-medium mb-3">マッチング優先度</h3>
          <p className="text-sm text-gray-600 mb-4">各要素の重要度を設定してください（1: 重要ではない、5: 非常に重要）</p>

          <div className="space-y-6">
            {Object.entries(formData.priorities).map(([key, value]) => (
              <div key={key} className="mb-4">
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium">
                    {getPriorityLabel(key)}
                  </label>
                  <span className="text-sm text-gray-600">{value}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      className={`w-full h-2 rounded-full transition-all
                        ${num <= Number(value) ? 'bg-blue-500' : 'bg-gray-200'}
                        ${isEditing ? 'cursor-pointer' : 'cursor-default'}
                      `}
                      onClick={() => isEditing && handlePriorityChange(key, num)}
                      disabled={!isEditing}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
