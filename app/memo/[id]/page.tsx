"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiEdit2, FiShare, FiTrash2 } from 'react-icons/fi';
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
  // Next.js 15では、paramsはPromiseなのでuse()で展開する
  const resolvedParams = use(params as Promise<{ id: string }>);
  const router = useRouter();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // メモデータの取得
  useEffect(() => {
    const fetchMemo = async () => {
      try {
        setIsLoading(true);
        // モックデータ取得（実際はAPIから取得）
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // モックデータ
        const mockMemos = [
          {
            id: '1',
            title: 'サンプルメモ1',
            content: 'これはサンプルメモ1の内容です。',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02'
          },
          {
            id: '2',
            title: 'サンプルメモ2',
            content: 'これはサンプルメモ2の内容です。',
            createdAt: '2023-02-01',
            updatedAt: '2023-02-01'
          },
        ];
        
        const foundMemo = mockMemos.find(m => m.id === resolvedParams.id);
        if (foundMemo) {
          setMemo(foundMemo);
        } else {
          toast.error('メモが見つかりませんでした');
          router.push('/memo');
        }
      } catch (error) {
        console.error('メモの取得に失敗しました', error);
        toast.error('メモの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemo();
  }, [resolvedParams.id, router]);

  // 戻るボタンのハンドラー
  const handleBack = () => {
    router.push('/memo');
  };

  // 編集ボタンのハンドラー
  const handleEdit = () => {
    if (memo) {
      router.push(`/memo/${memo.id}/edit`);
    }
  };

  // 共有ボタンのハンドラー
  const handleShare = () => {
    if (!memo) return;
    
    if (navigator.share) {
      navigator.share({
        title: memo.title || '無題のメモ',
        text: memo.content,
      })
      .then(() => {
        toast.success('共有しました');
        setShowShareModal(false);
      })
      .catch(error => {
        console.error('共有に失敗しました', error);
        toast.error('共有に失敗しました');
        setShowShareModal(false);
      });
    } else {
      // ブラウザが共有APIをサポートしていない場合
      navigator.clipboard.writeText(`${memo.title || '無題のメモ'}\n\n${memo.content}`)
        .then(() => {
          toast.success('クリップボードにコピーしました');
          setShowShareModal(false);
        })
        .catch(() => {
          toast.error('コピーに失敗しました');
          setShowShareModal(false);
        });
    }
  };

  // 削除ボタンのハンドラー
  const handleDelete = async () => {
    if (!memo) return;
    
    try {
      // 実際のAPIリクエスト（ここではモック）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('メモを削除しました');
      router.push('/memo');
    } catch (error) {
      console.error('削除に失敗しました', error);
      toast.error('削除に失敗しました');
      setShowDeleteModal(false);
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center">
          <button 
            onClick={handleBack}
            className="text-gray-500 p-1 hover:text-gray-800 transition-colors"
            aria-label="戻る"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="ml-4 font-medium text-lg">メモ詳細</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="ml-2 text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  // メインコンテンツ
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={handleBack}
            className="text-gray-500 p-1 hover:text-gray-800 transition-colors"
            aria-label="戻る"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">メモ詳細</h1>
          <div className="flex items-center space-x-2">
            {/* 編集ボタン */}
            <button 
              className="p-2 text-gray-500 hover:text-blue-500 rounded-full transition-colors"
              onClick={handleEdit}
              aria-label="編集"
            >
              <FiEdit2 size={20} />
            </button>
            
            {/* 共有ボタン */}
            <button 
              className="p-2 text-gray-500 hover:text-green-500 rounded-full transition-colors"
              onClick={() => setShowShareModal(true)}
              aria-label="共有"
            >
              <FiShare size={20} />
            </button>
            
            {/* 削除ボタン */}
            <button 
              className="p-2 text-gray-500 hover:text-red-500 rounded-full transition-colors"
              onClick={() => setShowDeleteModal(true)}
              aria-label="削除"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 共有モーダル */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="bg-white rounded-lg p-6 w-4/5 max-w-sm shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">共有</h3>
            <p className="mb-6 text-gray-600">このメモを共有しますか？</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                onClick={() => setShowShareModal(false)}
              >
                キャンセル
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                onClick={handleShare}
              >
                共有する
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 削除モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="bg-white rounded-lg p-6 w-4/5 max-w-sm shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-red-500">削除の確認</h3>
            <p className="mb-6 text-gray-600">このメモを削除してもよろしいですか？この操作は取り消せません。</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                キャンセル
              </button>
              <button 
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                onClick={handleDelete}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* メモ本文 */}
      <div className="flex-1 p-4">
        {memo ? (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{memo.title || '無題のメモ'}</h2>
            <div className="whitespace-pre-wrap text-gray-700 break-words">{memo.content}</div>
            
            <div className="mt-6 text-sm text-gray-500 flex flex-col">
              <span>作成日時: {memo.createdAt}</span>
              {memo.updatedAt !== memo.createdAt && (
                <span>更新日時: {memo.updatedAt}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p>メモが見つかりません。</p>
          </div>
        )}
      </div>
    </div>
  );
}