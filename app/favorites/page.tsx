"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import BottomNavigation from '@/app/components/BottomNavigation';
import { FiMoreVertical, FiMessageCircle, FiArrowRight, FiX, FiHeart } from 'react-icons/fi';
import { HiDotsVertical } from 'react-icons/hi';

// お気に入りユーザーの型定義
interface FavoriteUser {
  id: string;
  name: string;
  age: number;
  location: string;
  profileImage: string;
  lastActive?: string;
  isOnline?: boolean;
  lastMessage?: {
    text: string;
    timestamp: string;
    isUnread?: boolean;
  };
}

export default function FavoritesPage() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  // モック：お気に入りユーザーデータ
  const [favorites, setFavorites] = useState<FavoriteUser[]>([
    {
      id: '1',
      name: 'れいな',
      age: 23,
      location: '大阪府',
      profileImage: '/images/profile/user1.jpg',
      lastActive: '3時間前',
      isOnline: false,
      lastMessage: {
        text: '今週の土曜日、空いてる？',
        timestamp: '昨日',
        isUnread: true
      }
    },
    {
      id: '2',
      name: 'さやか',
      age: 25,
      location: '大阪府',
      profileImage: '/images/profile/user2.jpg',
      lastActive: '1時間前',
      isOnline: true,
      lastMessage: {
        text: 'ありがとう！了解です😊',
        timestamp: '3時間前'
      }
    },
    {
      id: '3',
      name: 'みき',
      age: 27,
      location: '大阪府',
      profileImage: '/images/profile/user3.jpg',
      lastActive: '30分前',
      isOnline: true,
      lastMessage: {
        text: '写真ありがとう！素敵ですね✨',
        timestamp: '1日前'
      }
    },
    {
      id: '4',
      name: 'あい',
      age: 25,
      location: '東京都',
      profileImage: '/images/profile/user4.jpg',
      lastActive: '5時間前',
      isOnline: false
    },
    {
      id: '5',
      name: 'ゆき',
      age: 30,
      location: '京都府',
      profileImage: '/images/profile/user5.jpg',
      lastActive: '昨日',
      isOnline: false
    },
    {
      id: '6',
      name: 'めい',
      age: 24,
      location: '兵庫県',
      profileImage: '/images/profile/user6.jpg',
      lastActive: '2日前',
      isOnline: false
    },
    {
      id: '7',
      name: 'りさ',
      age: 29,
      location: '奈良県',
      profileImage: '/images/profile/user7.jpg',
      lastActive: 'オンライン',
      isOnline: true
    },
    {
      id: '8',
      name: 'かな',
      age: 26,
      location: '滋賀県',
      profileImage: '/images/profile/user1.jpg',
      lastActive: '3日前',
      isOnline: false
    },
    {
      id: '9',
      name: 'はな',
      age: 24,
      location: '和歌山県',
      profileImage: '/images/profile/user2.jpg',
      lastActive: '1週間前',
      isOnline: false
    },
    {
      id: '10',
      name: 'みほ',
      age: 28,
      location: '大阪府',
      profileImage: '/images/profile/user3.jpg',
      lastActive: '昨日',
      isOnline: false
    },
    {
      id: '11',
      name: 'ゆり',
      age: 32,
      location: '東京都',
      profileImage: '/images/profile/user4.jpg',
      lastActive: '4時間前',
      isOnline: false
    },
    {
      id: '12',
      name: 'さき',
      age: 23,
      location: '大阪府',
      profileImage: '/images/profile/user5.jpg',
      lastActive: '3時間前',
      isOnline: false
    },
    {
      id: '13',
      name: 'あかり',
      age: 26,
      location: '兵庫県',
      profileImage: '/images/profile/user6.jpg',
      lastActive: '2時間前',
      isOnline: false
    },
    {
      id: '14',
      name: 'のぞみ',
      age: 29,
      location: '京都府',
      profileImage: '/images/profile/user7.jpg',
      lastActive: '1日前',
      isOnline: false
    },
    {
      id: '15',
      name: 'まりこ',
      age: 31,
      location: '大阪府',
      profileImage: '/images/profile/user1.jpg',
      lastActive: '昨日',
      isOnline: false
    },
    {
      id: '16',
      name: 'なつみ',
      age: 24,
      location: '愛知県',
      profileImage: '/images/profile/user2.jpg',
      lastActive: '3日前',
      isOnline: false
    },
    {
      id: '17',
      name: 'あゆみ',
      age: 27,
      location: '大阪府',
      profileImage: '/images/profile/user3.jpg',
      lastActive: '5日前',
      isOnline: false
    },
    {
      id: '18',
      name: 'ともみ',
      age: 25,
      location: '福岡県',
      profileImage: '/images/profile/user4.jpg',
      lastActive: '1週間前',
      isOnline: false
    },
    {
      id: '19',
      name: 'えり',
      age: 28,
      location: '静岡県',
      profileImage: '/images/profile/user5.jpg',
      lastActive: '2週間前',
      isOnline: false
    },
    {
      id: '20',
      name: 'まい',
      age: 26,
      location: '北海道',
      profileImage: '/images/profile/user6.jpg',
      lastActive: '1か月前',
      isOnline: false
    },
    {
      id: '21',
      name: 'ちか',
      age: 24,
      location: '沖縄県',
      profileImage: '/images/profile/user7.jpg',
      lastActive: '2週間前',
      isOnline: false
    }
  ]);

  useEffect(() => {
    // 実際の実装では、ここでAPIからデータを取得する
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // チャットページへ移動
  const handleChatWithUser = (userId: string) => {
    // 実際の実装では、ここでチャットページへ遷移する
    window.location.href = `/match/chat/${userId}`;
    toast.success('チャットを開始します');
  };

  // お気に入りから削除
  const handleRemoveFavorite = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // 実際の実装では、ここでAPIを呼び出してお気に入りから削除する
    setFavorites(prev => prev.filter(favorite => favorite.id !== userId));
    toast.success('お気に入りから削除しました');
  };
  
  // お気に入りアクションメニューの表示
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const toggleMenu = (userId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // クリックしたメニューをトグルする
    setActiveMenu(activeMenu === userId ? null : userId);
    
    // クリックした要素以外でメニューを閉じるためのハンドラー登録
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdowns = document.querySelectorAll('.dropdown-container');
      let isClickInsideDropdown = false;
      
      dropdowns.forEach(dropdown => {
        if (dropdown.contains(target)) {
          isClickInsideDropdown = true;
        }
      });
      
      if (!isClickInsideDropdown) {
        setActiveMenu(null);
      }
    };
    
    // メニューが開かれたらクリックイベントを追加
    if (activeMenu !== userId) {
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 0);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
  };
  
  // メニューのクリーンアップ
  useEffect(() => {
    return () => {
      // コンポーネントアンマウント時にクリーンアップ
      document.removeEventListener('click', () => setActiveMenu(null));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link href="/home" className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-medium">お気に入り</h1>
          <div className="w-6"></div> {/* 左右対称にするためのダミー要素 */}
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin h-8 w-8 border-4 border-teal-400 rounded-full border-t-transparent"></div>
          </div>
        ) : favorites.length > 0 ? (
          <ul className="divide-y divide-gray-100 bg-white">
            {favorites.map((favorite) => (
              <li key={favorite.id} className="px-4 py-3 hover:bg-gray-50 relative" onClick={() => handleChatWithUser(favorite.id)}>
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={favorite.profileImage}
                      alt={favorite.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                    {favorite.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-teal-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {favorite.name} <span className="text-gray-500">{favorite.age}歳</span>
                      </h3>
                      <span className="text-xs text-gray-500">{favorite.lastActive}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{favorite.location}</p>
                    
                    {/* 最後のメッセージ表示 */}
                    {favorite.lastMessage && (
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs truncate ${favorite.lastMessage.isUnread ? 'text-black font-medium' : 'text-gray-500'}`}>
                          {favorite.lastMessage.text}
                        </p>
                        {favorite.lastMessage.isUnread && (
                          <span className="ml-2 w-2 h-2 bg-teal-400 rounded-full"></span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-2 flex items-center relative">
                    {/* アクションメニューボタン - LINE風UI */}
                    <div className="dropdown-container" style={{ position: 'relative' }}>
                      <button 
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                        onClick={(e) => toggleMenu(favorite.id, e)}
                        aria-label="メニューを開く"
                      >
                        <HiDotsVertical size={18} />
                      </button>
                      
                      {/* アクションメニュー - LINE風デザイン */}
                      {activeMenu === favorite.id && (
                        <div 
                          style={{
                            position: 'absolute',
                            right: '0',
                            top: '100%',
                            marginTop: '4px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 100,
                            width: '160px',
                            border: '1px solid #eaeaea'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                            onClick={(e) => handleRemoveFavorite(favorite.id, e)}
                          >
                            <FiHeart className="mr-2 text-red-500" />
                            お気に入りから削除
                          </button>
                          <Link 
                            href={`/user/${favorite.id}`}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiArrowRight className="mr-2" />
                            プロフィールを見る
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    {/* チャットボタン */}
                    <button 
                      className="ml-2 p-2 bg-teal-400 text-white rounded-full flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatWithUser(favorite.id);
                      }}
                    >
                      <FiMessageCircle size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-gray-500 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-center text-lg">お気に入りのユーザーはまだいません</p>
            <p className="text-center text-sm mt-2">気になる相手をお気に入りに追加しましょう</p>
          </div>
        )}
      </div>

      {/* フッターナビゲーション */}
      <BottomNavigation />
    </div>
  );
}
