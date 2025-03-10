"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiPlus, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import BottomNavigation from '@/app/components/BottomNavigation';

// メモの型定義
interface Memo {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function MemoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMemo, setSelectedMemo] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('すべて');

  // URLクエリパラメータからフィルターを取得
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setCurrentFilter(filter);
    }
  }, [searchParams]);

  // メモデータの取得（モック）
  useEffect(() => {
    // 実際の実装ではAPIからデータを取得
    setTimeout(() => {
      // モックデータを追加
      const mockMemos: Memo[] = [
        {
          id: '1',
          title: 'タロウさんからの連絡先',
          content: 'LINE ID: taro-2023\n電話番号: 090-XXXX-XXXX',
          category: '未設定',
          createdAt: '2025-03-01 10:00',
          updatedAt: '2025-03-01 10:00'
        },
        {
          id: '2',
          title: 'ハナコさんの好きなもの',
          content: 'スイーツ（特にチョコレート）\n映画鑑賞\nカフェ巡り',
          category: 'お気に入り',
          createdAt: '2025-03-03 15:30',
          updatedAt: '2025-03-03 15:30'
        },
        {
          id: '3',
          title: '香港までの渡航情報',
          content: '航空会社: ANA\n便名: NH1140\n出発: 15:30 成田\n到着: 19:00 香港',
          category: '日程調整済み',
          createdAt: '2025-03-05 09:15',
          updatedAt: '2025-03-05 09:15'
        },
        {
          id: '4',
          title: 'サブスク解約するサービス',
          content: 'Netflix\nAmazon Prime\nDisney+\nApple Music',
          category: '要注意リスト',
          createdAt: '2025-03-07 18:45',
          updatedAt: '2025-03-07 18:45'
        },
        {
          id: '5',
          title: 'ジムようさんとの関係',
          content: '初デート: 2025/2/15 六本木カフェ\n共通の趣味: レコードコレクション\n次回: レコード店巡り予定',
          category: 'お会い済み',
          createdAt: '2025-03-10 11:30',
          updatedAt: '2025-03-10 11:30'
        },
        {
          id: '6',
          title: '金曜日の予定',
          content: '19:00 - 渋谷で食事\n21:00 - カラオケ',
          category: '日程調整中',
          createdAt: '2025-03-10 12:00',
          updatedAt: '2025-03-10 12:00'
        },
        {
          id: '7',
          title: 'プレゼント候補',
          content: 'アロマキャンドル\n手作りクッキー\n観葉植物',
          category: '気になる',
          createdAt: '2025-03-10 14:20',
          updatedAt: '2025-03-10 14:20'
        },
        {
          id: '8',
          title: '4月の東京出張',
          content: '4/10-4/12\nホテル: ビジネスホテル東京\n打ち合わせ: 午後2時〜',
          category: '日程調整前',
          createdAt: '2025-03-10 15:00',
          updatedAt: '2025-03-10 15:00'
        }
      ];
      
      // フィルターに基づいてメモを表示
      if (currentFilter === 'すべて') {
        setMemos(mockMemos);
      } else {
        setMemos(mockMemos.filter(memo => memo.category === currentFilter));
      }
      
      setIsLoading(false);
    }, 500);
  }, []);

  // メモを追加する関数
  const handleAddMemo = () => {
    router.push('/memo/new');
  };

  // メモを選択した時の関数
  const handleSelectMemo = (id: string) => {
    router.push(`/memo/${id}`);
  };

  // メニューを開く関数
  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMemo(selectedMemo === id ? null : id);
  };

  // メモを削除する関数
  const handleDeleteMemo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // 実際の実装ではAPIを呼び出して削除
    setMemos(prev => prev.filter(memo => memo.id !== id));
    setSelectedMemo(null);
  };

  // メニュー以外をクリックした時にメニューを閉じる
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedMemo(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 p-1"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">メモ</h1>
          <div className="relative">
            <button 
              className="text-[#06c755] font-medium p-1 px-2 rounded"
              onClick={() => router.push('/memo/filter')}
            >
              {currentFilter}
            </button>
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin h-8 w-8 border-4 border-teal-400 rounded-full border-t-transparent"></div>
          </div>
        ) : memos.length > 0 ? (
          <ul className="divide-y divide-gray-100 bg-white">
            {memos.map((memo) => (
              <li 
                key={memo.id} 
                className="px-4 py-3 hover:bg-gray-50 relative"
                onClick={() => handleSelectMemo(memo.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {memo.title || '無題のメモ'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {memo.content || '内容なし'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {memo.updatedAt}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                      onClick={(e) => toggleMenu(memo.id, e)}
                    >
                      <FiMoreVertical size={18} />
                    </button>
                    
                    {selectedMemo === memo.id && (
                      <div 
                        className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-2 z-50 w-48 border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/memo/${memo.id}/edit`);
                          }}
                        >
                          <FiEdit2 className="mr-2" />
                          編集
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                          onClick={(e) => handleDeleteMemo(memo.id, e)}
                        >
                          <FiTrash2 className="mr-2" />
                          削除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-gray-500">
            <div className="bg-gray-100 rounded-full p-16 mb-6">
              <div className="w-24 h-24 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                  <path d="M9 8h6"></path>
                </svg>
              </div>
            </div>
            <p className="text-center text-lg font-medium">まだ登録されたメモはありません</p>
          </div>
        )}
      </div>

      {/* 新規作成ボタン */}
      <div className="fixed right-4 bottom-20 z-20">
        <motion.button
          className="bg-[#06c755] text-white p-4 rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddMemo}
        >
          <FiPlus size={24} />
        </motion.button>
      </div>

      {/* フッターナビゲーション */}
      <BottomNavigation />
    </div>
  );
}
