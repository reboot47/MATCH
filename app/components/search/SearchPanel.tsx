'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { HiOutlineAdjustments } from 'react-icons/hi';

type SearchOption = {
  id: string;
  name: string;
};

type SearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (searchParams: SearchParams) => void;
  isMale: boolean;
  initialSearchParams?: SearchParams;
};

export type SearchParams = {
  freeWord: string;
  ageRange: [number, number];
  purpose: string[];
  meetingTime: string[];
  drinkingHabit: string[];
  smokingHabit?: string[];
  heightRange?: [number, number];
  areas: string[];
  preferredAgeRange?: [number, number];
  bodyTypes?: string[];
  incomeLevel?: string;
  lookingFor?: string[];
  hasPhoto?: boolean;
  isVerified?: boolean;
  hobbies?: string[];
};

const DEFAULT_SEARCH_PARAMS: SearchParams = {
  freeWord: '',
  ageRange: [18, 60],
  purpose: [],
  meetingTime: [],
  drinkingHabit: [],
  smokingHabit: [],
  heightRange: [140, 200],
  areas: [],
  preferredAgeRange: [18, 60],
  bodyTypes: [],
  incomeLevel: '',
  lookingFor: [],
  hasPhoto: false,
  isVerified: false,
  hobbies: [],
};

export default function SearchPanel({ isOpen, onClose, onSave, isMale, initialSearchParams }: SearchPanelProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams || DEFAULT_SEARCH_PARAMS);

  // パネルが開いているときは背景スクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    // 初期値がある場合はそれを使用
    if (initialSearchParams) {
      setSearchParams(initialSearchParams);
    }
  }, [initialSearchParams]);

  const handleSave = () => {
    onSave(searchParams);
    onClose();
  };

  const updateSearchParam = <K extends keyof SearchParams>(
    key: K,
    value: SearchParams[K]
  ) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  const handleAgeRangeChange = (min: number, max: number) => {
    updateSearchParam('ageRange', [min, max]);
  };
  
  const handleHeightRangeChange = (min: number, max: number) => {
    updateSearchParam('heightRange', [min, max]);
  };

  const toggleArrayItem = <K extends keyof SearchParams>(
    key: K,
    item: string
  ) => {
    if (Array.isArray(searchParams[key])) {
      const currentArray = searchParams[key] as string[];
      if (currentArray.includes(item)) {
        updateSearchParam(
          key,
          currentArray.filter(i => i !== item) as SearchParams[K]
        );
      } else {
        updateSearchParam(key, [...currentArray, item] as SearchParams[K]);
      }
    }
  };

  const renderSlider = (
    title: string,
    value: [number, number],
    min: number,
    max: number,
    onChange: (min: number, max: number) => void,
    unit: string = ''
  ) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-sm">
            {value[0]}{unit} 〜 {value[1]}{unit}
          </span>
        </div>
        <div className="relative h-4 mb-4">
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => onChange(parseInt(e.target.value), value[1])}
            className="absolute w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => onChange(value[0], parseInt(e.target.value))}
            className="absolute w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  };

  const renderCheckboxGroup = (
    title: string, 
    key: keyof SearchParams, 
    options: SearchOption[]
  ) => {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {options.map(option => {
            const isSelected = Array.isArray(searchParams[key]) && 
              (searchParams[key] as string[]).includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => toggleArrayItem(key, option.id)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-300 text-blue-800' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 各セクションによって異なるオプション
  const purposeOptions = [
    { id: 'casual', name: 'カジュアル' },
    { id: 'serious', name: '真剣交際' },
    { id: 'marriage', name: '結婚前提' },
    { id: 'friends', name: '友達作り' },
  ];

  const timeOptions = [
    { id: 'weekday', name: '平日' },
    { id: 'weekend', name: '週末' },
    { id: 'night', name: '夜' },
    { id: 'anytime', name: 'いつでも' },
  ];

  const drinkingOptions = [
    { id: 'yes', name: 'お酒飲みたい' },
    { id: 'no', name: '飲まない' },
    { id: 'either', name: 'どちらでも' },
  ];
  
  const smokingOptions = [
    { id: 'noSmoke', name: '吸わない' },
    { id: 'occasionally', name: 'たまに吸う' },
    { id: 'regular', name: '吸う' },
    { id: 'heated', name: '加熱式タバコ' },
  ];

  const bodyTypeOptions = [
    { id: 'slim', name: 'スリム' },
    { id: 'normal', name: '普通' },
    { id: 'athletic', name: '筋肉質' },
    { id: 'chubby', name: 'ぽっちゃり' },
  ];

  const areaOptions = [
    { id: 'all', name: '全国' },
    { id: 'hokkaido', name: '北海道' },
    { id: 'tohoku', name: '東北' },
    { id: 'kanto', name: '関東' },
    { id: 'tokyo', name: '東京' },
    { id: 'chubu', name: '中部' },
    { id: 'kansai', name: '関西' },
    { id: 'osaka', name: '大阪' },
    { id: 'chugoku', name: '中国' },
    { id: 'shikoku', name: '四国' },
    { id: 'kyushu', name: '九州' },
    { id: 'okinawa', name: '沖縄' },
    { id: 'umeda', name: '梅田・北新地' },
    { id: 'namba', name: '難波・心斎橋' },
    { id: 'tenma', name: '天満・天神橋' },
    { id: 'shinsaibashi', name: '心斎橋・南船場' },
  ];

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景オーバーレイ - クリックで閉じる */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* 検索パネル本体 */}
      <div 
        className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl overflow-y-auto"
      >
      <div className="sticky top-0 flex items-center justify-between p-4 border-b">
        <button onClick={onClose} className="p-2">
          <FaTimes />
        </button>
        <h2 className="text-lg font-medium">検索条件</h2>
        <button 
          onClick={handleSave}
          className="px-4 py-1.5 bg-cyan-500 text-white rounded-md"
        >
          検索条件で絞る
        </button>
      </div>

      <div className="p-4 pb-32 overflow-y-auto h-full">
        {/* フリーワード */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">フリーワード</label>
          <input
            type="text"
            value={searchParams.freeWord}
            onChange={(e) => updateSearchParam('freeWord', e.target.value)}
            placeholder="キーワードを入力"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            入力したキーワードで募集内容をさらに絞れます。
          </p>
        </div>

        {/* 年齢と身長 */}
        {renderSlider('年齢', searchParams.ageRange, 18, 70, handleAgeRangeChange, '歳')}
        
        {isMale && renderSlider('身長', searchParams.heightRange || [150, 190], 140, 200, handleHeightRangeChange, 'cm')}

        {/* 目的 */}
        {renderCheckboxGroup('目的・目標', 'purpose', purposeOptions)}

        {/* 時間と曜日 */}
        {renderCheckboxGroup('希望時間帯', 'meetingTime', timeOptions)}

        {/* お酒 */}
        {renderCheckboxGroup('お酒', 'drinkingHabit', drinkingOptions)}
        
        {/* タバコ */}
        {renderCheckboxGroup('タバコ', 'smokingHabit', smokingOptions)}

        {/* 体型（男性向け） */}
        {isMale && renderCheckboxGroup('体型・タイプ', 'bodyTypes', bodyTypeOptions)}

        {/* エリア・場所 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">地域</h3>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {areaOptions.map(area => {
              const isSelected = searchParams.areas.includes(area.id);
              
              // 全国オプションが選択された場合の特別処理
              const handleAreaClick = () => {
                if (area.id === 'all') {
                  // 全国オプションを選択した場合、すべての選択をクリア
                  updateSearchParam('areas', isSelected ? [] : ['all']);
                } else {
                  // 他のエリアを選択した場合、全国オプションを除去
                  const newAreas = searchParams.areas.filter(a => a !== 'all');
                  
                  if (isSelected) {
                    updateSearchParam('areas', newAreas.filter(a => a !== area.id));
                  } else {
                    updateSearchParam('areas', [...newAreas, area.id]);
                  }
                }
              };
              
              return (
                <button
                  key={area.id}
                  onClick={handleAreaClick}
                  className={`px-3 py-1.5 text-sm rounded-full border ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 text-blue-800' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {area.name}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            選択がない場合は全国から検索します
          </p>
        </div>

        {/* 女性向け: 希望年齢 */}
        {!isMale && renderSlider('希望年齢', searchParams.preferredAgeRange || [20, 45], 18, 70, (min, max) => 
          updateSearchParam('preferredAgeRange', [min, max]), '歳')}

        {/* 女性向け: 年収 */}
        {!isMale && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">年収・月収</h3>
            <select
              value={searchParams.incomeLevel}
              onChange={(e) => updateSearchParam('incomeLevel', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">指定なし</option>
              <option value="300-500">300万〜500万</option>
              <option value="500-800">500万〜800万</option>
              <option value="800-1200">800万〜1200万</option>
              <option value="1200+">1200万以上</option>
            </select>
          </div>
        )}

        {/* 写真有無・認証状態 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">写真・認証</h3>
          <div className="space-y-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={searchParams.hasPhoto}
                onChange={(e) => updateSearchParam('hasPhoto', e.target.checked)}
                className="rounded border-gray-300 text-teal-500 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">写真ありのみ表示</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={searchParams.isVerified}
                onChange={(e) => updateSearchParam('isVerified', e.target.checked)}
                className="rounded border-gray-300 text-teal-500 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">認証済みユーザーのみ</span>
            </label>
          </div>
        </div>
        
        {/* その他条件 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">その他の条件</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.lookingFor?.includes('now')}
                onChange={() => toggleArrayItem('lookingFor', 'now')}
                className="mr-2"
              />
              今すぐ会いたい
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.lookingFor?.includes('today')}
                onChange={() => toggleArrayItem('lookingFor', 'today')}
                className="mr-2"
              />
              今日会える
            </label>
          </div>
        </div>

        {/* 検索ボタン */}
        <div className="mt-8">
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-cyan-500 text-white rounded-md"
          >
            検索結果を表示
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
