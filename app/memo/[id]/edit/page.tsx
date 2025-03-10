"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditMemoPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = use(params as Promise<{ id: string }>);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // メモデータの取得（モック）
  useEffect(() => {
    const fetchMemo = async () => {
      setIsLoading(true);
      try {
        // 実際の実装ではAPIから取得
        // ここではモックデータ
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // モックデータを表示
        if (resolvedParams.id === 'sample') {
          setTitle('サンプルメモ');
          setContent('これはサンプルメモの内容です。\n\n実際のアプリでは、ユーザーが作成したメモの内容が表示されます。');
        } else {
          // APIからの取得に失敗したケース（モック）
          router.push('/memo');
          // トースト通知を削除
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

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      toast.error('タイトルまたは内容を入力してください');
      return;
    }

    setIsSaving(true);

    try {
      // 実際の実装ではAPIを呼び出して保存
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('メモを保存しました');
      router.push(`/memo/${resolvedParams.id}`);
    } catch (error) {
      console.error('メモの保存に失敗しました', error);
      toast.error('メモの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 p-1"
            disabled={isSaving}
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">メモを編集</h1>
          <button 
            className={`text-[#06c755] font-medium p-1 px-2 rounded ${isSaving ? 'opacity-50' : ''}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="h-6 w-6 border-2 border-[#06c755] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiCheck size={24} />
            )}
          </button>
        </div>
      </div>

      {/* メモ入力フォーム */}
      <div className="flex-1 px-4 py-3">
        <input
          type="text"
          placeholder="タイトル"
          className="w-full text-lg font-medium border-none outline-none mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
        />
        
        <textarea
          placeholder="メモを入力..."
          className="w-full h-[calc(100vh-180px)] resize-none border-none outline-none text-base"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
