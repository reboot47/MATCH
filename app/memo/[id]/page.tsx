"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiEdit2, FiShare, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// メモの型定義
interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function MemoDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = use(params as Promise<{ id: string }>);
  const router = useRouter();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // メモデータの取得（モック）
  useEffect(() => {
    const fetchMemo = async () => {
      setIsLoading(true);
      try {
        // 実際の実装ではAPIから取得
        // ここではモックデータ
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // モックデータを定義
        const mockMemos = [
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
          },
          {
            id: 'sample',
            title: 'サンプルメモ',
            content: 'これはサンプルメモの内容です。\n\n実際のアプリでは、ユーザーが作成したメモの内容が表示されます。',
            category: 'サンプル',
            createdAt: '2025-03-09 15:30',
            updatedAt: '2025-03-09 16:45'
          }
        ];
        
        // 指定されたIDのメモを探す
        const foundMemo = mockMemos.find(memo => memo.id === resolvedParams.id);
        
        if (foundMemo) {
          setMemo(foundMemo);
        } else {
          // 存在しないIDの場合はメモ一覧にリダイレクト
          toast.error('メモが見つかりませんでした');
          router.push('/memo');
        }
      } catch (error) {
        console.error('メモの取得に失敗しました', error);
        // トースト通知を削除
        router.push('/memo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemo();
  }, [resolvedParams.id, router]);

  const handleDelete = async () => {
    if (!memo) return;
    
    try {
      // 実際の実装ではAPIを呼び出して削除
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('メモを削除しました');
      router.push('/memo');
    } catch (error) {
      console.error('メモの削除に失敗しました', error);
      toast.error('メモの削除に失敗しました');
    }
  };

  const handleShare = () => {
    if (!memo) return;
    
    // シェア機能の実装（モバイルならネイティブのシェア機能を使う）
    if (navigator.share) {
      navigator.share({
        title: memo.title || '無題のメモ',
        text: memo.content,
      }).catch(error => {
        console.error('シェアに失敗しました', error);
      });
    } else {
      // クリップボードにコピー
      navigator.clipboard.writeText(`${memo.title || '無題のメモ'}\n\n${memo.content}`).then(() => {
        toast.success('クリップボードにコピーしました');
      }).catch(() => {
        toast.error('コピーに失敗しました');
      });
    }
    
    setShowMenu(false);
  };

  // メニュー以外をクリックした時にメニューを閉じる
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center">
          <button onClick={() => router.back()} className="text-gray-500 p-1">
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium ml-4">メモを読み込み中...</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-400 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!memo) {
    return null; // ローディング後にメモがない場合は何も表示しない（リダイレクト処理済み）
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 p-1"
          >
            <FiChevronLeft size={24} />
          </button>
          <div className="ml-auto flex items-center space-x-2">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
              onClick={() => router.push(`/memo/${memo.id}/edit`)}
            >
              <FiEdit2 size={20} />
            </button>
            <div className="relative">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <FiMoreVertical size={20} />
              </button>
              
              {showMenu && (
                <div 
                  className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-2 z-50 w-48 border border-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleShare}
                  >
                    <FiShare className="mr-2" />
                    共有
                  </button>
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    onClick={handleDelete}
                  >
                    <FiTrash2 className="mr-2" />
                    削除
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* メモ内容 */}
      <div className="flex-1 px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">
          {memo.title || '無題のメモ'}
        </h1>
        
        <div className="text-xs text-gray-500 mb-6">
          {memo.updatedAt ? `最終更新: ${memo.updatedAt}` : ''}
        </div>
        
        <div className="text-base whitespace-pre-wrap">
          {memo.content || '内容なし'}
        </div>
      </div>
    </div>
  );
}
