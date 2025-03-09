"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AppealProfile as AppealProfileType,
  PersonalStory,
  Skill,
  BucketListItem,
  IntroductionVideo,
  EventHistory,
  QandA,
  ValueMap
} from '@/app/types/profile';
import PersonalStories from './appeal/PersonalStories';
import SkillsShowcase from './appeal/SkillsShowcase';
import BucketList from './appeal/BucketList';
import IntroVideo from './appeal/IntroVideo';
import EventTimeline from './appeal/EventTimeline';
import QandAProfile from './appeal/QandAProfile';
import ValueMapComponent from './appeal/ValueMap';
import { toast } from 'react-hot-toast';

interface AppealProfileProps {
  appealProfile?: AppealProfileType;
  updateAppealProfile: (data: AppealProfileType) => void;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

// セクション定義
const SECTIONS = [
  { id: 'stories', label: 'パーソナルストーリー', emoji: '📖' },
  { id: 'skills', label: 'スキル・才能', emoji: '🎯' },
  { id: 'bucket', label: 'バケットリスト', emoji: '🪣' },
  { id: 'video', label: 'ビデオ自己紹介', emoji: '🎬' },
  { id: 'events', label: 'イベント参加履歴', emoji: '🗓️' },
  { id: 'qanda', label: 'Q&Aプロフィール', emoji: '💬' },
  { id: 'values', label: '価値観マップ', emoji: '🧭' },
];

export default function AppealProfile({ 
  appealProfile, 
  updateAppealProfile, 
  isUpdating = false,
  isViewOnly = false
}: AppealProfileProps) {
  const [activeSection, setActiveSection] = useState<string>('stories');
  const [isChangingSection, setIsChangingSection] = useState(false);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string | null>>({});
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const maxRetries = 3;
  
  // profile初期値の定義
  const [profile, setProfile] = useState<AppealProfileType>(() => {
    if (!appealProfile) {
      // アピールプロフィールがnullの場合、デフォルト値を設定
      console.info("初期アピールプロファイルが見つかりません。デフォルト値を使用します。");
      return {
        id: '',
        userId: '',
        intro: { text: '', interests: [] },
        photos: [],
        videos: [],
        qAndA: [],
        timeline: [],
        valueMap: {
          categories: {}
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return appealProfile;
  });
  
  // セクション切り替え時のローディング処理
  const changeSection = (sectionId: string) => {
    setIsChangingSection(true);
    setActiveSection(sectionId);
    
    // 短いタイムアウトでローディング状態を解除
    setTimeout(() => {
      setIsChangingSection(false);
    }, 300);
  };
  
  // 各セクションのデータを更新する関数
  const updateSection = (section: string, data: any) => {
    console.log(`Updating section: ${section} with data:`, data);
    
    try {
      const updatedProfile = {
        ...profile,
        [section]: data
      };
      
      setProfile(updatedProfile);
      
      if (updateAppealProfile) {
        updateAppealProfile(updatedProfile);
      }
    } catch (error) {
      console.error(`Error updating section ${section}:`, error);
    }
  };
  
  // ローディングスケルトン
  const renderSkeleton = () => {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  };
  
  // エラー表示コンポーネント
  const renderErrorMessage = (section: string) => {
    const error = sectionErrors[section];
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
        <p className="font-medium">エラーが発生しました</p>
        <p className="text-sm">{error}</p>
        <button 
          className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
          onClick={() => setSectionErrors(prev => ({ ...prev, [section]: null }))}
        >
          閉じる
        </button>
      </div>
    );
  };
  
  // セクションのレンダリング
  const renderSection = () => {
    if (isChangingSection) {
      return renderSkeleton();
    }
    
    // 現在のセクションのエラーメッセージを表示
    const errorMessage = renderErrorMessage(activeSection);
    
    // セクションコンテンツのレンダリング
    let sectionContent;
    switch (activeSection) {
      case 'stories':
        sectionContent = (
          <PersonalStories 
            stories={profile.personalStories || []} 
            onUpdate={(data) => updateSection('personalStories', data)}
            isUpdating={isUpdating}
            isViewOnly={isViewOnly}
          />
        );
        break;
      case 'skills':
        sectionContent = (
          <SkillsShowcase 
            skills={profile.skills || []} 
            onUpdate={(data) => updateSection('skills', data)}
            isUpdating={isUpdating}
            isViewOnly={isViewOnly}
          />
        );
        break;
      case 'bucket':
        sectionContent = (
          <BucketList 
            items={profile.bucketList || []} 
            onUpdate={(data) => updateSection('bucketList', data)}
            isUpdating={isUpdating}
            isViewOnly={isViewOnly}
          />
        );
        break;
      case 'video':
        sectionContent = (
          <IntroVideo 
            video={profile.introVideo} 
            onUpdate={(data) => updateSection('introVideo', data)}
            isUpdating={isUpdating}
            isViewOnly={isViewOnly}
          />
        );
        break;
      case 'events':
        sectionContent = (
          <EventTimeline 
            events={profile.eventHistory || []} 
            onUpdate={(data) => updateSection('eventHistory', data)}
            isUpdating={isUpdating}
            isViewOnly={isViewOnly}
          />
        );
        break;
      case 'qanda':
        sectionContent = (
          <QandAProfile 
            items={profile.qAndA || []} 
            onUpdate={(data) => updateSection('qAndA', data)}
            isUpdating={isUpdating}
            isViewOnly={isViewOnly}
          />
        );
        break;
      case 'values':
        console.log('AppealProfile Debug - valueMap section:', profile.valueMap);
        // valueMapが未定義の場合は、確実に空のオブジェクトを渡す
        const valueMapData = profile.valueMap && typeof profile.valueMap === 'object' 
          ? profile.valueMap 
          : { categories: {} };
        
        sectionContent = (
          <ValueMapComponent 
            valueMap={valueMapData} 
            onUpdate={(data) => updateSection('valueMap', data)}
            isUpdating={isUpdating}
            isViewOnly={isViewOnly}
          />
        );
        break;
      default:
        sectionContent = <div>セクションが選択されていません</div>;
    }
    
    // エラーメッセージとセクションコンテンツを表示
    return (
      <>
        {errorMessage}
        {sectionContent}
      </>
    );
  };
  
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">アピールプロフィール</h2>
      
      {/* セクションナビゲーション */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4 overflow-x-auto">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => changeSection(section.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${sectionErrors[section.id] ? 'border-2 border-red-400' : ''}`}
            disabled={isUpdating || isChangingSection}
          >
            <span className="mr-1">{section.emoji}</span> {section.label}
            {sectionErrors[section.id] && <span className="ml-1 text-xs">⚠️</span>}
          </button>
        ))}
      </div>
      
      {/* アクティブセクションの表示 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
      
      {/* 全体更新中ローディングオーバーレイ */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
            <p className="text-gray-700">更新中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
