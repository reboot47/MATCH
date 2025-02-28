'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiSearch, FiVideo, FiHome, FiMessageCircle, FiHeart, FiUser } from 'react-icons/fi';

// タブの種類を定義
const tabs = [
  { id: 'recommended', label: 'おすすめ' },
  { id: 'videos', label: 'アピール動画' },
  { id: 'tags', label: 'アピールタグ' },
  { id: 'new', label: '新着' }
];

// ユーザーカードコンポーネント（動画付き）
const VideoUserCard = ({ user }) => {
  // デフォルト画像パス
  const defaultImagePath = '/images/default-avatar.png';
  
  return (
    <div className="relative rounded-lg overflow-hidden h-56 min-w-[150px] bg-gray-200 mr-3 shadow-sm">
      <Image
        src={user.mainPhoto || defaultImagePath}
        alt={user.name || 'ユーザー'}
        fill
        sizes="150px"
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="text-sm font-medium">
          {user.age}歳 {user.location}
        </div>
      </div>
      {user.hasVideo && (
        <div className="absolute top-2 left-2 bg-teal-500 rounded-full p-1">
          <FiVideo size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

// ユーザーカードコンポーネント（一覧表示用）
const UserCard = ({ user }) => {
  // デフォルト画像パス
  const defaultImagePath = '/images/default-avatar.png';
  
  return (
    <div className="relative rounded-lg overflow-hidden h-64 bg-gray-200 shadow-sm">
      <Image
        src={user.mainPhoto || defaultImagePath}
        alt={user.name || 'ユーザー'}
        fill
        sizes="100%"
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="font-medium">
          {user.age}歳 {user.location}
        </div>
        {user.bio && (
          <p className="text-sm mt-1 line-clamp-2 text-gray-200">
            {user.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchArea, setSearchArea] = useState('梅田・北新地');
  const [videoUsers, setVideoUsers] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ユーザーデータの取得
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUsers();
    }
  }, [status, session, activeTab, searchArea]);
  
  // ユーザーデータ取得
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ダミーデータを設定
      const dummyUsers = [
        {
          id: 'user1',
          name: 'ユーザー1',
          age: 20,
          location: '大阪府',
          mainPhoto: '/images/default-avatar.png',
          bio: '暇な方遊びましょ',
          hasVideo: true,
          videoUrl: '/videos/sample.mp4'
        },
        {
          id: 'user2',
          name: 'ユーザー2',
          age: 36,
          location: '大阪府',
          mainPhoto: '/images/default-avatar.png',
          bio: 'よろしくお願いします',
          hasVideo: true,
          videoUrl: '/videos/sample.mp4'
        },
        {
          id: 'user3',
          name: 'ユーザー3',
          age: 33,
          location: '大阪府',
          mainPhoto: '/images/default-avatar.png',
          bio: '友達から始めましょう',
          hasVideo: true,
          videoUrl: '/videos/sample.mp4'
        },
        {
          id: 'user4',
          name: 'ユーザー4',
          age: 19,
          location: '大阪府',
          mainPhoto: '/images/default-avatar.png',
          bio: '暇な方遊びましよ',
          hasVideo: false
        },
        {
          id: 'user5',
          name: 'ユーザー5',
          age: 25,
          location: '大阪府',
          mainPhoto: '/images/default-avatar.png',
          bio: 'お互いに良い関係が築けたらいいなと思います',
          hasVideo: false
        }
      ];
      
      // 動画付きユーザーとそれ以外でフィルタリング
      const withVideo = dummyUsers.filter(user => user.hasVideo);
      const allUsers = dummyUsers;
      
      setVideoUsers(withVideo);
      setListUsers(allUsers);
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
      setError('ユーザー情報の取得中にエラーが発生しました。再読み込みしてください。');
    } finally {
      setLoading(false);
    }
  };
  
  // 検索エリア変更
  const handleSearchChange = (e) => {
    setSearchArea(e.target.value);
  };
  
  // ユーザープロフィールへの遷移
  const navigateToUserProfile = (userId) => {
    router.push(`/user/${userId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 検索バー */}
      <div className="sticky top-0 z-10 bg-white p-3 shadow-sm">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            value={searchArea}
            onChange={handleSearchChange}
            placeholder="エリアで検索"
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>
        <div className="flex mt-2 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium flex-1 ${
                activeTab === tab.id
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
            >
              再読み込み
            </button>
          </div>
        ) : (
          <>
            {/* 動画でさがすセクション */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FiVideo className="text-teal-500 mr-2" />
                <h2 className="text-base font-medium">動画でさがす</h2>
              </div>
              
              <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                {videoUsers.length > 0 ? (
                  videoUsers.map(user => (
                    <div key={user.id} onClick={() => navigateToUserProfile(user.id)}>
                      <VideoUserCard user={user} />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 py-4">
                    動画のあるユーザーが見つかりません
                  </div>
                )}
              </div>
            </div>
            
            {/* 一覧からさがすセクション */}
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <FiSearch className="text-teal-500 mr-2" />
                <h2 className="text-base font-medium">一覧からさがす</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {listUsers.length > 0 ? (
                  listUsers.map(user => (
                    <div key={user.id} onClick={() => navigateToUserProfile(user.id)}>
                      <UserCard user={user} />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 py-4 col-span-2 text-center">
                    ユーザーが見つかりません
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* フッターナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4">
        <button className="flex flex-col items-center justify-center text-teal-500">
          <FiHome size={22} />
          <span className="text-xs mt-1">ホーム</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-400">
          <FiMessageCircle size={22} />
          <span className="text-xs mt-1">メッセージ</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-400">
          <FiHeart size={22} />
          <span className="text-xs mt-1">いいね</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-400">
          <FiUser size={22} />
          <span className="text-xs mt-1">マイページ</span>
        </button>
      </div>
    </div>
  );
}
