"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function NewMemoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      toast.error('タイトルまたは内容を入力してください');
      return;
    }

    setIsSaving(true);

    try {
      // 実際の実装ではAPIを呼び出して保存
      // ここではモックとして単にタイムアウトを設定
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // トースト通知を削除
      router.back();
    } catch (error) {
      console.error('メモの保存に失敗しました', error);
      // トースト通知を削除
    } finally {
      setIsSaving(false);
    }
  };

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
          <h1 className="text-lg font-medium">新規メモ</h1>
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
