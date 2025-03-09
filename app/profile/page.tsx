"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

// 新しいコンポーネントとフックのインポート
import Header from '@/app/components/Header';
import ProfileNavigation from '@/app/components/profile/ProfileNavigation';
import ProfileCompletionCard from '@/app/components/profile/ProfileCompletionCard';
import MediaUploadSection from '@/app/components/profile/MediaUploadSection';
import PersonalityTest from '@/app/components/profile/PersonalityTest';
import ProfileDetails from '@/app/components/profile/ProfileDetails';
import MatchingPreferences from '@/app/components/profile/MatchingPreferences';
import VerificationCenter from '@/app/components/profile/VerificationCenter';
import AccountSecurity from '@/app/components/profile/AccountSecurity';
import NotificationSettings from '@/app/components/profile/NotificationSettings';
import PrivacySettings from '@/app/components/profile/PrivacySettings';
import AppealProfile from '@/app/components/profile/AppealProfile';
import AuthDebugger from '@/app/components/AuthDebugger'; // 認証デバッガーコンポーネントをインポート
import { useMediaItems } from '@/app/hooks/useMediaItems';
import { useProfile } from '@/app/hooks/useProfile';

// 動的レンダリングの設定
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const { 
    profile, 
    loading: profileLoading, 
    error, 
    completionPercentage, 
    missingItems, 
    saveStatus,
    updateProfile: handleProfileUpdate,
    updateField: autoSaveField,
    updateMultipleFields: autoSaveFields,
    savePersonalityTest,
    updateMatchingPreferences,
    updateAppealProfile
  } = useProfile();
  const { mediaItems, loading: mediaLoading, updateMediaItems, isDemo } = useMediaItems();

  // ユーザーが未認証の場合はログインページにリダイレクト
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // プロフィール写真更新ハンドラー
  const handleMediaUpdate = async (items: any[]) => {
    return await updateMediaItems(items);
  };

  // メインコンテンツのレンダリング
  const renderMainContent = () => {
    if (profileLoading) {
      return (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-50 rounded-xl border border-red-100 text-center">
          <p className="text-red-600 font-medium mb-3">データの読み込みに失敗しました</p>
          <p className="text-gray-600">しばらく経ってからもう一度お試しください。</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'profile':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MediaUploadSection 
                  mediaItems={profile?.mediaItems || []}
                  onMediaUpdate={handleMediaUpdate}
                  isLoading={mediaLoading}
                  maxMediaCount={9}
                  userName={profile?.name || ""}
                />
              </div>
              <div>
                <ProfileCompletionCard 
                  completionPercentage={completionPercentage} 
                  missingItems={missingItems}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <ProfileDetails 
                user={profile} 
                editable={true} 
                onSave={handleProfileUpdate}
                autoSave={true}
                saveStatus={saveStatus}
                onAutoSave={(name, value) => {
                  console.log(`ProfilePage: calling autoSaveField with ${name}=${JSON.stringify(value).substring(0, 100)}`);
                  autoSaveField(name, value);
                }}
                onAutoSaveMultiple={(fields) => {
                  console.log(`ProfilePage: calling autoSaveFields with ${Object.keys(fields).join(',')}`);
                  autoSaveFields(fields);
                }}
              />
            </div>
          </>
        );
      
      case 'personality':
        return (
          <PersonalityTest 
            personalityType={profile?.personalityType || null}
            personalityTraits={profile?.personalityTraits || {}}
            completed={profile?.personalityTestCompleted || false}
            onSaveTest={savePersonalityTest}
          />
        );
      
      case 'appeal':
        return (
          <AppealProfile 
            appealProfile={profile?.appealProfile}
            onUpdate={updateAppealProfile}
            isUpdating={saveStatus === 'saving'}
            isViewOnly={false}
          />
        );
      
      case 'preferences':
        return (
          <MatchingPreferences
            preferences={profile?.matchingPreferences} 
            onSave={updateMatchingPreferences}
            isUpdating={saveStatus === 'saving'}
          />
        );
      
      case 'verification':
        return (
          <VerificationCenter
            user={profile}
            onVerify={handleProfileUpdate}
          />
        );
      
      case 'security':
        return (
          <AccountSecurity
            user={profile}
            onUpdate={handleProfileUpdate}
          />
        );
      
      case 'notifications':
        return (
          <NotificationSettings
            user={profile}
            onUpdate={handleProfileUpdate}
          />
        );
      
      case 'privacy':
        return (
          <PrivacySettings
            user={profile}
            onUpdate={handleProfileUpdate}
          />
        );
        
      default:
        return null;
    }
  };

  // 認証状態に基づくコンテンツ表示
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  // プロフィールナビゲーションのアイテムを定義
  const navigationItems = [
    { id: 'profile', label: 'プロフィール', icon: 'user' },
    { id: 'appeal', label: 'アピールプロフィール', icon: 'sparkles' },
    { id: 'personality', label: '性格診断', icon: 'brain' },
    { id: 'preferences', label: 'マッチング設定', icon: 'heart' },
    { id: 'verification', label: '認証センター', icon: 'shield-check' },
    { id: 'security', label: 'セキュリティ', icon: 'lock-closed' },
    { id: 'notifications', label: '通知設定', icon: 'bell' },
    { id: 'privacy', label: 'プライバシー', icon: 'eye-slash' }
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-16 md:pt-20 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">マイプロフィール</h1>
          <p className="text-gray-600">プロフィール情報を編集して、マッチングの可能性を高めましょう</p>
        </div>
        
        <div className="mb-8">
          <ProfileNavigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            completionPercentage={completionPercentage}
            missingItems={missingItems}
            navigationItems={navigationItems}
          />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 md:p-6"
          >
            {renderMainContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* 開発環境のみ表示される認証デバッガー */}
        {process.env.NODE_ENV === 'development' && <AuthDebugger />}
      </div>
    </>
  );
}
