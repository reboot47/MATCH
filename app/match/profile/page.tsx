'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/components/UserContext';
import {
  User, Edit, Settings, Shield, LogOut, Heart, MessageCircle,
  Calendar, MapPin, Briefcase, GraduationCap, CheckCircle, Camera,
  Star, Zap, Clock, Gift, AlertCircle
} from 'lucide-react';

// 写真ギャラリーの仮データ
const MOCK_PHOTOS = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80',
    isPrimary: true,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    isPrimary: false,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    isPrimary: false,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    isPrimary: false,
  },
];

export default function ProfilePage() {
  const { user, points, isGenderMale, isGenderFemale, logout } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'photos' | 'settings'>('profile');

  if (!user) return <div className="p-8 text-center">ログインしてください</div>;

  const renderBadges = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {user.isVerified && (
          <div className="flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
            <Shield size={12} className="mr-1" />
            <span>認証済み</span>
          </div>
        )}
        {points?.subscription?.plan !== 'none' && (
          <div className="flex items-center bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">
            <Star size={12} className="mr-1" />
            <span>{points?.subscription?.plan}</span>
          </div>
        )}
        <div className="flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
          <Clock size={12} className="mr-1" />
          <span>{user.isOnline ? 'オンライン' : '最近アクティブ'}</span>
        </div>
      </div>
    );
  };

  const renderProfileTab = () => {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">基本情報</h2>
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
            <div className="flex items-center">
              <Calendar className="text-gray-400 w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">年齢</div>
                <div>{user.age}歳</div>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="text-gray-400 w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">場所</div>
                <div>{user.location}</div>
              </div>
            </div>
            {user.occupation && (
              <div className="flex items-center">
                <Briefcase className="text-gray-400 w-5 h-5 mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">職業</div>
                  <div>{user.occupation}</div>
                </div>
              </div>
            )}
            {user.education && (
              <div className="flex items-center">
                <GraduationCap className="text-gray-400 w-5 h-5 mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">学歴</div>
                  <div>{user.education}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">自己紹介</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="whitespace-pre-line">{user.bio}</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">趣味・興味</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">ポイント情報</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Zap className="text-primary w-5 h-5 mr-2" />
                <span className="font-semibold text-lg">{points?.balance || 0} ポイント</span>
              </div>
              <Link 
                href={isGenderMale() ? "/match/points/buy" : "/match/points/earn"} 
                className="text-primary text-sm font-medium"
              >
                {isGenderMale() ? "ポイントを購入" : "ポイントを獲得"}
                <ChevronRight className="inline ml-1 w-4 h-4" />
              </Link>
            </div>

            {points?.subscription?.plan !== 'none' && (
              <div className="border-t pt-3">
                <div className="text-sm text-gray-500 mb-1">現在のプラン</div>
                <div className="flex justify-between">
                  <div className="font-medium">{points?.subscription?.plan}</div>
                  <div className="text-sm text-gray-500">
                    {points?.subscription?.expiresAt} まで
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderPhotosTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">写真</h2>
          <button className="flex items-center text-primary text-sm font-medium">
            <Camera size={16} className="mr-1" />
            <span>追加</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOCK_PHOTOS.map((photo) => (
            <div key={photo.id} className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <img 
                src={photo.url} 
                alt="" 
                className="w-full h-full object-cover"
              />
              {photo.isPrimary && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  メイン
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <button className="p-2 bg-white rounded-full text-gray-700 mr-2">
                  <Edit size={16} />
                </button>
                {!photo.isPrimary && (
                  <button className="p-2 bg-white rounded-full text-gray-700">
                    <Star size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="space-y-4">
        <section>
          <h2 className="text-lg font-semibold mb-3">アカウント設定</h2>
          <div className="bg-white rounded-lg shadow-sm divide-y">
            <Link href="/match/profile/edit" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <User className="text-gray-400 w-5 h-5 mr-3" />
                <span>プロフィール編集</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link href="/match/profile/privacy" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Shield className="text-gray-400 w-5 h-5 mr-3" />
                <span>プライバシー設定</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link href="/match/profile/notifications" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Bell className="text-gray-400 w-5 h-5 mr-3" />
                <span>通知設定</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link href="/match/profile/subscription" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Zap className="text-gray-400 w-5 h-5 mr-3" />
                <span>サブスクリプション管理</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">サポート</h2>
          <div className="bg-white rounded-lg shadow-sm divide-y">
            <Link href="/match/profile/help" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <HelpCircle className="text-gray-400 w-5 h-5 mr-3" />
                <span>ヘルプセンター</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link href="/match/profile/contact" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <MessageCircle className="text-gray-400 w-5 h-5 mr-3" />
                <span>お問い合わせ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </section>

        <button 
          onClick={() => logout()}
          className="w-full py-3 text-red-500 font-medium bg-white rounded-lg shadow-sm mt-6"
        >
          ログアウト
        </button>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'photos':
        return renderPhotosTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="pb-20">
      {/* プロフィールヘッダー */}
      <div className="bg-gradient-to-b from-primary/20 to-white pt-8 pb-4">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img 
                  src={MOCK_PHOTOS[0].url} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {user.isVerified && (
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                  <CheckCircle size={12} />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h1 className="text-xl font-bold flex items-center">
                {user.name}
                <span className="ml-1 text-gray-500">{user.age}</span>
              </h1>
              <div className="text-gray-600 text-sm flex items-center mt-1">
                <MapPin size={14} className="mr-1" />
                {user.location}
              </div>
              {renderBadges()}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className={`flex-1 pb-2 font-medium ${
                activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              プロフィール
            </button>
            <button
              className={`flex-1 pb-2 font-medium ${
                activeTab === 'photos' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('photos')}
            >
              写真
            </button>
            <button
              className={`flex-1 pb-2 font-medium ${
                activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              設定
            </button>
          </div>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

// 不足しているChevronRightとBellとHelpCircleをインポート
import { ChevronRight, Bell, HelpCircle } from 'lucide-react';
