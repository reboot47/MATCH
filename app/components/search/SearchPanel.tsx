'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { IoCloudUploadOutline, IoCloudDownloadOutline } from 'react-icons/io5';

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
  // 基本的な検索条件
  freeWord: string;
  ageRange: [number, number];
  purpose: string[];
  meetingTime: string[];
  drinkingHabit: string[];
  smokingHabit: string[];
  heightRange: [number, number];
  areas: string[];
  
  // 相手に求める条件
  bodyTypes: string[];
  occupation: string[];
  annualIncome: string;
  educationalBackground: string;
  
  // 他のフィルター条件
  hasPhoto: boolean;
  isVerified: boolean;
  hobbies: string[];
  
  // プロフィール情報（参照用）
  myProfile?: {
    age: number;
    gender: string;
    location: string;
    detailArea: string;
  };
};

const DEFAULT_SEARCH_PARAMS: SearchParams = {
  // 基本的な検索条件
  freeWord: '',
  ageRange: [18, 60],
  purpose: [],
  meetingTime: [],
  drinkingHabit: [],
  smokingHabit: [],
  heightRange: [140, 200],
  areas: [],
  
  // 相手に求める条件
  bodyTypes: [],
  occupation: [],
  annualIncome: '',
  educationalBackground: '',
  
  // 他のフィルター条件
  hasPhoto: false,
  isVerified: false,
  hobbies: [],
  
  // プロフィール情報は初期値では必要ない
};

export default function SearchPanel({ isOpen, onClose, onSave, isMale, initialSearchParams }: SearchPanelProps) {
  // 初期値を適切に設定（デフォルト値と統合して全てのフィールドに値を確保）
  const getInitialParams = (): SearchParams => {
    if (!initialSearchParams) return DEFAULT_SEARCH_PARAMS;
    
    return {
      ...DEFAULT_SEARCH_PARAMS,
      freeWord: initialSearchParams.freeWord ?? DEFAULT_SEARCH_PARAMS.freeWord,
      ageRange: initialSearchParams.ageRange ?? DEFAULT_SEARCH_PARAMS.ageRange,
      purpose: initialSearchParams.purpose ?? DEFAULT_SEARCH_PARAMS.purpose,
      meetingTime: initialSearchParams.meetingTime ?? DEFAULT_SEARCH_PARAMS.meetingTime,
      drinkingHabit: initialSearchParams.drinkingHabit ?? DEFAULT_SEARCH_PARAMS.drinkingHabit,
      smokingHabit: initialSearchParams.smokingHabit ?? DEFAULT_SEARCH_PARAMS.smokingHabit,
      heightRange: initialSearchParams.heightRange ?? DEFAULT_SEARCH_PARAMS.heightRange,
      areas: initialSearchParams.areas ?? DEFAULT_SEARCH_PARAMS.areas,
      bodyTypes: initialSearchParams.bodyTypes ?? DEFAULT_SEARCH_PARAMS.bodyTypes,
      occupation: initialSearchParams.occupation ?? DEFAULT_SEARCH_PARAMS.occupation,
      annualIncome: initialSearchParams.annualIncome ?? DEFAULT_SEARCH_PARAMS.annualIncome,
      educationalBackground: initialSearchParams.educationalBackground ?? DEFAULT_SEARCH_PARAMS.educationalBackground,
      hasPhoto: initialSearchParams.hasPhoto ?? DEFAULT_SEARCH_PARAMS.hasPhoto,
      isVerified: initialSearchParams.isVerified ?? DEFAULT_SEARCH_PARAMS.isVerified,
      hobbies: initialSearchParams.hobbies ?? DEFAULT_SEARCH_PARAMS.hobbies,
    };
  };
  
  const [searchParams, setSearchParams] = useState<SearchParams>(getInitialParams());
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  // パネルが開いているときは背景スクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // パネルが開かれたときに保存済みの検索設定を読み込む
      loadSearchSettings();
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    // 初期値がある場合は、デフォルト値と統合して全てのフィールドに値が確実に設定されるようにする
    if (initialSearchParams) {
      const mergedParams: SearchParams = {
        ...DEFAULT_SEARCH_PARAMS,
        ...initialSearchParams,
        // null/undefinedの場合はデフォルト値で補完
        freeWord: initialSearchParams.freeWord ?? DEFAULT_SEARCH_PARAMS.freeWord,
        ageRange: initialSearchParams.ageRange ?? DEFAULT_SEARCH_PARAMS.ageRange,
        purpose: initialSearchParams.purpose ?? DEFAULT_SEARCH_PARAMS.purpose,
        meetingTime: initialSearchParams.meetingTime ?? DEFAULT_SEARCH_PARAMS.meetingTime,
        drinkingHabit: initialSearchParams.drinkingHabit ?? DEFAULT_SEARCH_PARAMS.drinkingHabit,
        smokingHabit: initialSearchParams.smokingHabit ?? DEFAULT_SEARCH_PARAMS.smokingHabit,
        heightRange: initialSearchParams.heightRange ?? DEFAULT_SEARCH_PARAMS.heightRange,
        areas: initialSearchParams.areas ?? DEFAULT_SEARCH_PARAMS.areas,
        bodyTypes: initialSearchParams.bodyTypes ?? DEFAULT_SEARCH_PARAMS.bodyTypes,
        occupation: initialSearchParams.occupation ?? DEFAULT_SEARCH_PARAMS.occupation,
        annualIncome: initialSearchParams.annualIncome ?? DEFAULT_SEARCH_PARAMS.annualIncome,
        educationalBackground: initialSearchParams.educationalBackground ?? DEFAULT_SEARCH_PARAMS.educationalBackground,
        hasPhoto: typeof initialSearchParams.hasPhoto === 'boolean' ? initialSearchParams.hasPhoto : DEFAULT_SEARCH_PARAMS.hasPhoto,
        isVerified: typeof initialSearchParams.isVerified === 'boolean' ? initialSearchParams.isVerified : DEFAULT_SEARCH_PARAMS.isVerified,
        hobbies: initialSearchParams.hobbies ?? DEFAULT_SEARCH_PARAMS.hobbies,
        myProfile: initialSearchParams.myProfile ?? undefined,
      };
      setSearchParams(mergedParams);
    }
  }, [initialSearchParams]);

  const handleSave = async () => {
    try {
      // 検索条件をサーバーに自動保存
      await saveSearchSettings();
      console.log('検索設定が自動保存されました');
      onSave(searchParams);
      onClose();
    } catch (error) {
      // エラーが発生しても検索は実行
      console.error('設定の自動保存中にエラーが発生しました:', error);
      onSave(searchParams);
      onClose();
    }
  };

  // 検索設定をサーバーに保存する関数
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');

  const saveSearchSettings = async () => {
    setIsSavingSettings(true);
    setSaveError('');
    
    try {
      const response = await fetch('/api/search/saveSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || '検索設定の保存に失敗しました');
      }
      
      // 保存成功
      console.log('検索設定を保存しました');
    } catch (error) {
      console.error('検索設定の保存エラー:', error);
      setSaveError(error instanceof Error ? error.message : '検索設定の保存に失敗しました');
    } finally {
      setIsSavingSettings(false);
    }
  };
  
  // サーバーから検索設定を読み込む関数
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');
  
  const loadSearchSettings = async () => {
    setIsLoadingSettings(true);
    setLoadError('');
    
    try {
      const response = await fetch('/api/search/getSettings');
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || '検索設定の取得に失敗しました');
      }
      
      // 取得したデータで検索条件を更新
      if (data.data) {
        // デフォルト値と取得データを統合して、必ず全フィールドに値が設定されるようにする
        const mergedData: SearchParams = {
          // まずデフォルト値をコピー
          ...DEFAULT_SEARCH_PARAMS,
          // 取得したデータで上書き
          freeWord: data.data.freeWord ?? DEFAULT_SEARCH_PARAMS.freeWord,
          ageRange: data.data.ageRange ?? DEFAULT_SEARCH_PARAMS.ageRange,
          purpose: data.data.purpose ?? DEFAULT_SEARCH_PARAMS.purpose,
          meetingTime: data.data.meetingTime ?? DEFAULT_SEARCH_PARAMS.meetingTime,
          drinkingHabit: data.data.drinkingHabit ?? DEFAULT_SEARCH_PARAMS.drinkingHabit,
          smokingHabit: data.data.smokingHabit ?? DEFAULT_SEARCH_PARAMS.smokingHabit,
          heightRange: data.data.heightRange ?? DEFAULT_SEARCH_PARAMS.heightRange,
          areas: data.data.areas ?? DEFAULT_SEARCH_PARAMS.areas,
          bodyTypes: data.data.bodyTypes ?? DEFAULT_SEARCH_PARAMS.bodyTypes,
          occupation: data.data.occupation ?? DEFAULT_SEARCH_PARAMS.occupation,
          annualIncome: data.data.annualIncome ?? DEFAULT_SEARCH_PARAMS.annualIncome,
          educationalBackground: data.data.educationalBackground ?? DEFAULT_SEARCH_PARAMS.educationalBackground,
          hasPhoto: data.data.hasPhoto ?? DEFAULT_SEARCH_PARAMS.hasPhoto,
          isVerified: data.data.isVerified ?? DEFAULT_SEARCH_PARAMS.isVerified,
          hobbies: data.data.hobbies ?? DEFAULT_SEARCH_PARAMS.hobbies,
          myProfile: data.data.myProfile,
        };
        
        // マージしたデータでステートを更新
        setSearchParams(mergedData);
        
        // 地域情報の復元
        if (mergedData.areas && mergedData.areas.length > 0) {
          const prefecture = mergedData.areas.find((area: string) => prefectures.includes(area));
          if (prefecture) {
            setSelectedPrefecture(prefecture);
            
            if (areaData[prefecture]) {
              const detailArea = mergedData.areas.find((area: string) => 
                areaData[prefecture] && areaData[prefecture].includes(area)
              );
              if (detailArea) {
                setSelectedArea(detailArea);
              }
            }
          }
        }
      }
      
      console.log('検索設定を読み込みました');
    } catch (error) {
      console.error('検索設定の読み込みエラー:', error);
      setLoadError(error instanceof Error ? error.message : '検索設定の取得に失敗しました');
    } finally {
      setIsLoadingSettings(false);
    }
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
        // 安全な型変換のためにunknownを経由する
        updateSearchParam(
          key,
          currentArray.filter(i => i !== item) as unknown as SearchParams[K]
        );
      } else {
        // 安全な型変換のためにunknownを経由する
        updateSearchParam(key, [...currentArray, item] as unknown as SearchParams[K]);
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
    { id: 'seriousMarriage', name: '真剣な出会い・結婚' },
    { id: 'longTerm', name: '長期的な交際' },
    { id: 'casual', name: '気軽な恋愛' },
    { id: 'activityPartner', name: '趣味友達・アクティビティパートナー' },
    { id: 'business', name: 'ビジネス交流・人脈作り' },
    { id: 'messageFriend', name: 'メッセージ友達' },
    { id: 'advice', name: '恋愛相談・悩み相談' },
    { id: 'dating', name: 'デートやお出かけ' },
    { id: 'languageExchange', name: '言語交換' },
    { id: 'notSpecified', name: '特に決めていない' },
  ];

  const timeOptions = [
    { id: 'morning', name: '午前（9:00〜12:00）' },
    { id: 'noon', name: 'お昼（12:00〜15:00）' },
    { id: 'afternoon', name: '午後（15:00〜18:00）' },
    { id: 'evening', name: '夕方（18:00〜20:00）' },
    { id: 'night', name: '夜（20:00〜24:00）' },
    { id: 'latenight', name: '深夜（24:00〜）' },
  ];

  const drinkingOptions = [
    { id: 'often', name: 'よく飲む' },
    { id: 'sometimes', name: '時々飲む' },
    { id: 'rarely', name: 'ほとんど飲まない' },
    { id: 'social', name: 'お付き合い程度' },
    { id: 'no', name: '飲まない' },
    { id: 'unspecified', name: '未回答' },
  ];
  
  const smokingOptions = [
    { id: 'yes', name: '喫煙する' },
    { id: 'sometimes', name: '時々吸う' },
    { id: 'rarely', name: 'ほとんど吸わない' },
    { id: 'former', name: '以前は吸っていた' },
    { id: 'no', name: '喫煙しない' },
    { id: 'unspecified', name: '未回答' },
  ];

  // 性別によって体型選択肢を変更
  const femaleBodyTypes = [
    { id: 'slim', name: 'スリム' },
    { id: 'normal', name: '普通' },
    { id: 'glamorous', name: 'グラマー' },
    { id: 'athletic', name: '筋肉質' },
    { id: 'chubby', name: 'ぽっちゃり' },
    { id: 'fat', name: '太め' },
    { id: 'private', name: '非公開' },
  ];

  const maleBodyTypes = [
    { id: 'slim', name: 'スリム' },
    { id: 'normal', name: '普通' },
    { id: 'slimAthletic', name: '細マッチョ' },
    { id: 'sturdy', name: 'ガッチリ' },
    { id: 'muscular', name: 'マッチョ' },
    { id: 'chubby', name: 'ぽっちゃり' },
    { id: 'fat', name: '太め' },
    { id: 'private', name: '非公開' },
  ];
  
  // 表示用の体型選択肢
  const bodyTypeOptions = isMale ? maleBodyTypes : femaleBodyTypes;

  // 地域データの状態
  const [areaData, setAreaData] = useState<Record<string, string[]>>({});
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [isAreaDataLoading, setIsAreaDataLoading] = useState(false);

  // 都道府県リスト
  const prefectures = Object.keys(areaData).length > 0 
    ? Object.keys(areaData) 
    : [];

  // 都道府県に基づくエリアリスト
  const areaList = selectedPrefecture && areaData[selectedPrefecture] 
    ? areaData[selectedPrefecture] 
    : [];

  // APIから地域データとプロフィール情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsAreaDataLoading(true);
        setIsLoadingProfile(true);
        
        // 地域データを取得
        const areaResponse = await fetch('/api/prefectureAreas');
        if (!areaResponse.ok) {
          throw new Error('地域データの取得に失敗しました');
        }
        const areaData = await areaResponse.json();
        setAreaData(areaData);
        
        // ユーザープロフィールから検索条件を取得
        const profileResponse = await fetch('/api/profile/getSearchPreferences');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          
          // 検索条件を更新（既存の検索条件と統合）
          setSearchParams(prevParams => ({
            ...prevParams,
            // 検索パラメータにプロフィール情報を反映
            ageRange: profileData.ageRange || prevParams.ageRange,
            areas: profileData.areas || prevParams.areas,
            heightRange: profileData.heightRange || prevParams.heightRange,
            bodyTypes: profileData.bodyTypes || prevParams.bodyTypes,
          }));
          
          // 地域選択の状態を更新
          if (profileData.areas && profileData.areas.length > 0) {
            // 都道府県と詳細エリアを設定
            const areas = profileData.areas;
            const possiblePrefecture = Object.keys(areaData).find(pref => areas.includes(pref));
            
            if (possiblePrefecture) {
              setSelectedPrefecture(possiblePrefecture);
              
              // 詳細エリアがあれば設定
              const detailArea = areas.find((area: string) => 
                areaData[possiblePrefecture] && 
                areaData[possiblePrefecture].includes(area)
              );
              
              if (detailArea) {
                setSelectedArea(detailArea);
              }
            }
          }
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setIsAreaDataLoading(false);
        setIsLoadingProfile(false);
      }
    };

    fetchData();
  }, []);

  // 選択された地域情報をareas配列に変換
  // 地域選択が手動で変更された場合のみ実行されるフラグ
  const [manualAreaSelection, setManualAreaSelection] = useState<boolean>(false);
  
  useEffect(() => {
    if (manualAreaSelection) {
      const newAreas: string[] = [];
      
      if (selectedPrefecture) {
        newAreas.push(selectedPrefecture);
      }
      
      if (selectedArea) {
        newAreas.push(selectedArea);
      }
      
      // 安全な型変換のためにunknownを経由
      updateSearchParam('areas', newAreas as unknown as SearchParams['areas']);
      // 更新後にフラグをリセット
      setManualAreaSelection(false);
    }
  }, [selectedPrefecture, selectedArea, manualAreaSelection]);

  // パネルが開いたときに保存済みの地域情報を復元
  const [initialRenderComplete, setInitialRenderComplete] = useState<boolean>(false);
  
  useEffect(() => {
    // 初回レンダリング時のみ実行されるようにする
    if (isOpen && searchParams.areas.length > 0 && !initialRenderComplete) {
      // 都道府県が選択されているか確認
      const prefecture = searchParams.areas.find(area => prefectures.includes(area));
      if (prefecture) {
        setSelectedPrefecture(prefecture);
        
        // 詳細エリアが選択されているか確認
        if (areaData[prefecture]) {
          const detailArea = searchParams.areas.find(area => areaData[prefecture].includes(area));
          if (detailArea) {
            setSelectedArea(detailArea);
          }
        }
      }
      // 初回レンダリング完了フラグをセット
      setInitialRenderComplete(true);
    }
  }, [isOpen, areaData, prefectures, searchParams.areas, initialRenderComplete]);

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
      <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes size={18} />
          </button>
          <h2 className="text-lg font-medium">検索条件</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 設定保存ボタン */}
          <button 
            onClick={saveSearchSettings} 
            className="flex items-center gap-1 px-2 py-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors"
            disabled={isSavingSettings}
            title="現在の検索条件を保存"
          >
            {isSavingSettings ? (
              <span className="inline-block w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <IoCloudUploadOutline size={18} />
            )}
            <span className="text-sm">設定保存</span>
          </button>
          
          {/* 設定読み込みボタン */}
          <button 
            onClick={loadSearchSettings} 
            className="flex items-center gap-1 px-2 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            disabled={isLoadingSettings}
            title="保存済みの検索条件を読み込み"
          >
            {isLoadingSettings ? (
              <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <IoCloudDownloadOutline size={18} />
            )}
            <span className="text-sm">設定読込</span>
          </button>
          
          <button 
            onClick={handleSave}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md transition-colors flex items-center gap-1"
          >
            <HiOutlineAdjustments size={18} />
            <span>検索する</span>
          </button>
        </div>
      </div>
      
      {/* エラーメッセージの表示 */}
      {(saveError || loadError) && (
        <div className="mx-4 mt-3 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
          {saveError || loadError}
        </div>
      )}

      <div className="p-4 pb-32 overflow-y-auto h-full">
        {/* プロフィールから検索条件を読み込むボタン */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={async () => {
              try {
                setIsLoadingProfile(true);
                // プロフィールから条件を再読み込み
                const response = await fetch('/api/profile/getSearchPreferences');
                if (response.ok) {
                  const profileData = await response.json();
                  setSearchParams(prevParams => ({
                    ...DEFAULT_SEARCH_PARAMS,
                    ageRange: profileData.ageRange || DEFAULT_SEARCH_PARAMS.ageRange,
                    areas: profileData.areas || DEFAULT_SEARCH_PARAMS.areas,
                    heightRange: profileData.heightRange || DEFAULT_SEARCH_PARAMS.heightRange,
                    bodyTypes: profileData.bodyTypes || DEFAULT_SEARCH_PARAMS.bodyTypes,
                  }));
                  
                  // 地域選択の状態を更新
                  if (profileData.areas && profileData.areas.length > 0) {
                    const areas = profileData.areas;
                    const possiblePrefecture = Object.keys(areaData).find(pref => areas.includes(pref));
                    
                    if (possiblePrefecture) {
                      setSelectedPrefecture(possiblePrefecture);
                      
                      const detailArea = areas.find((area: string) => 
                        areaData[possiblePrefecture] && 
                        areaData[possiblePrefecture].includes(area)
                      );
                      
                      if (detailArea) {
                        setSelectedArea(detailArea);
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('プロフィール読み込みエラー:', error);
              } finally {
                setIsLoadingProfile(false);
              }
            }}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center gap-2 py-3 rounded-lg border border-blue-200 transition-colors"
          >
            {isLoadingProfile ? (
              <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            ) : null}
            <span className="font-medium">プロフィールから検索条件を設定</span>
          </button>
        </div>
        
        <button
          onClick={() => {
            setManualAreaSelection(true); // 手動選択フラグをセット
            setSearchParams(DEFAULT_SEARCH_PARAMS);
            setSelectedPrefecture('');
            setSelectedArea('');
          }}
          className="w-full mb-6 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg border border-gray-200 transition-colors text-sm font-medium"
        >
          すべての条件をリセット
        </button>
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

        {/* 体型 */}
        {renderCheckboxGroup('体型・タイプ', 'bodyTypes', bodyTypeOptions)}

        {/* 地域選択 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">地域</h3>
          
          {isAreaDataLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">地域データを読み込み中...</p>
            </div>
          ) : (
            <>
              {/* 都道府県選択 */}
              <div className="mb-3">
                <select
                  value={selectedPrefecture || ''}
                  onChange={(e) => {
                    const newPrefecture = e.target.value;
                    setManualAreaSelection(true); // 手動選択フラグをセット
                    setSelectedPrefecture(newPrefecture);
                    setSelectedArea(''); // 都道府県が変わったらエリアをリセット
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">都道府県を選択</option>
                  {prefectures.map(prefecture => (
                    <option key={prefecture} value={prefecture}>
                      {prefecture}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* エリア選択（都道府県が選択されている場合のみ表示） */}
              {selectedPrefecture && areaList.length > 0 && (
                <div>
                  <select
                    value={selectedArea || ''}
                    onChange={(e) => {
                      setManualAreaSelection(true); // 手動選択フラグをセット
                      setSelectedArea(e.target.value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">詳細エリアを選択（任意）</option>
                    {areaList.map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* 選択中の地域表示 */}
              {(selectedPrefecture || selectedArea) && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">選択中の地域:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrefecture && (
                      <span className="px-3 py-1.5 text-sm rounded-full bg-blue-50 border border-blue-300 text-blue-800">
                        {selectedPrefecture}
                      </span>
                    )}
                    {selectedArea && (
                      <span className="px-3 py-1.5 text-sm rounded-full bg-blue-50 border border-blue-300 text-blue-800">
                        {selectedArea}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            選択がない場合は全国から検索します
          </p>
        </div>

        {/* 女性向け: 希望年齢 */}
        {!isMale && renderSlider('希望年齢', searchParams.ageRange || [20, 45], 18, 70, (min, max) => 
          updateSearchParam('ageRange', [min, max]), '歳')}

        {/* 女性向け: 年収 */}
        {!isMale && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">年収・月収</h3>
            <select
              value={searchParams.annualIncome}
              onChange={(e) => updateSearchParam('annualIncome', e.target.value)}
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
        
        {/* 出会いの目的 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">出会いの目的</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.purpose.includes('love')}
                onChange={() => toggleArrayItem('purpose', 'love')}
                className="mr-2"
              />
              恋愛を探している
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.purpose.includes('marriage')}
                onChange={() => toggleArrayItem('purpose', 'marriage')}
                className="mr-2"
              />
              結婚を考えている
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.purpose.includes('friend')}
                onChange={() => toggleArrayItem('purpose', 'friend')}
                className="mr-2"
              />
              友達作り
            </label>
          </div>
        </div>
        
        {/* 会う時間 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">会う時間</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.meetingTime.includes('now')}
                onChange={() => toggleArrayItem('meetingTime', 'now')}
                className="mr-2"
              />
              今すぐ会いたい
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={searchParams.meetingTime.includes('today')}
                onChange={() => toggleArrayItem('meetingTime', 'today')}
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
