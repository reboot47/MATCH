"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { FaHeart, FaComment, FaCalendarAlt, FaSearch, FaUser } from 'react-icons/fa';

// マッチングインターフェース
interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: string;
  lastMessageAt: string | null;
  matchedUser: {
    id: string;
    name: string;
    image: string | null;
    bio: string | null;
  };
  messageCount: number;
}

export default function MatchesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'recent' | 'oldest' | 'active'>('recent');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (status === 'loading') return;
        
        if (!session || !session.user) {
          router.push('/login');
          return;
        }
        
        // ここでは仮のモックデータを使用
        const mockMatches: Match[] = [
          {
            id: 'm1',
            userId: session.user.id,
            matchedUserId: 'u2',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            lastMessageAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            matchedUser: {
              id: 'u2',
              name: '田中美咲',
              image: 'https://randomuser.me/api/portraits/women/1.jpg',
              bio: '音楽と旅行が好きです。新しい出会いを楽しみにしています。',
            },
            messageCount: 24,
          },
          {
            id: 'm2',
            userId: session.user.id,
            matchedUserId: 'u3',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            lastMessageAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            matchedUser: {
              id: 'u3',
              name: '山田花子',
              image: 'https://randomuser.me/api/portraits/women/2.jpg',
              bio: 'カフェ巡りが趣味です。映画も好きです。',
            },
            messageCount: 8,
          },
          {
            id: 'm3',
            userId: session.user.id,
            matchedUserId: 'u4',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            lastMessageAt: null,
            matchedUser: {
              id: 'u4',
              name: '佐藤太郎',
              image: 'https://randomuser.me/api/portraits/men/2.jpg',
              bio: 'スポーツ観戦が好きです。特にサッカーが大好きです。',
            },
            messageCount: 0,
          },
          {
            id: 'm4',
            userId: session.user.id,
            matchedUserId: 'u5',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            lastMessageAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            matchedUser: {
              id: 'u5',
              name: '鈴木健太',
              image: 'https://randomuser.me/api/portraits/men/3.jpg',
              bio: '料理が趣味です。休日は新しいレシピに挑戦しています。',
            },
            messageCount: 15,
          },
        ];
        
        setMatches(mockMatches);
        setFilteredMatches(mockMatches);
      } catch (error) {
        console.error('マッチング履歴取得エラー:', error);
        toast.error('マッチング履歴の読み込み中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [router, status]);

  // 検索とフィルタリング
  useEffect(() => {
    const filtered = matches.filter((match) => 
      match.matchedUser.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    let sorted = [...filtered];
    
    switch (sortOption) {
      case 'recent':
        sorted = sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        sorted = sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'active':
        sorted = sorted.sort((a, b) => {
          if (!a.lastMessageAt) return 1;
          if (!b.lastMessageAt) return -1;
          return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        });
        break;
    }
    
    setFilteredMatches(sorted);
  }, [matches, searchTerm, sortOption]);

  // メッセージページへ移動
  const navigateToMessages = (matchId: string, userId: string) => {
    router.push(`/messages/${matchId}?userId=${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">マッチング履歴</h1>
        
        {/* 検索とフィルター */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="名前で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="min-w-[180px]">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'recent' | 'oldest' | 'active')}
              >
                <option value="recent">最近マッチした順</option>
                <option value="oldest">古いマッチ順</option>
                <option value="active">最近のメッセージ順</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* マッチング一覧 */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-2">マッチングが見つかりません</p>
            <p className="text-gray-400 text-sm">新しい出会いを探してみましょう</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <motion.div
                key={match.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                  {/* プロフィール画像 */}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 mx-auto sm:mx-0">
                    {match.matchedUser.image ? (
                      <Image
                        src={match.matchedUser.image}
                        alt={match.matchedUser.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <FaUser size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* ユーザー情報 */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{match.matchedUser.name}</h2>
                    
                    {match.matchedUser.bio && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{match.matchedUser.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaHeart className="text-pink-500" />
                        <span>マッチング: {format(new Date(match.createdAt), 'yyyy/MM/dd')}</span>
                      </div>
                      
                      {match.lastMessageAt && (
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" />
                          <span>最終メッセージ: {format(new Date(match.lastMessageAt), 'yyyy/MM/dd')}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <FaComment className="text-green-500" />
                        <span>メッセージ数: {match.messageCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* アクションボタン */}
                  <div className="flex justify-center sm:justify-end items-center space-x-2">
                    <button
                      onClick={() => navigateToMessages(match.id, match.matchedUserId)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2"
                    >
                      <FaComment />
                      <span>メッセージ</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
