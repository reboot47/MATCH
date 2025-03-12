"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { popularTags, categoryTags } from '@/app/data/tagData';
import Image from 'next/image';
import { TagData } from '@/app/components/tags/TagCard';
import { toast } from 'react-hot-toast';

export default function NewAppealTagsPage() {
  const router = useRouter();
  
  // 選択されたタグのIDを管理
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  
  // 全てのタグを結合したリスト
  const allTags = [...popularTags, ...categoryTags];
  
  // 保存済みのタグを取得（実際の実装ではAPIからデータを取得）
  useEffect(() => {
    // モックデータとしていくつかのタグを選択済みとして設定
    // 実際の実装ではAPIから現在のユーザータグを取得する
    setSelectedTagIds(['golf', 'tea']);
  }, []);
  
  // タグの選択状態を切り替える
  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      // 最大5つまで選択可能
      if (selectedTagIds.length >= 5) {
        toast.error('アピールタグは最大5つまで選択できます');
        return;
      }
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };
  
  // 保存処理
  const handleSave = async () => {
    try {
      // ここでAPIを呼び出してタグを保存
      // 実際の実装では選択されたタグIDをサーバーに送信する
      toast.success('アピールタグを保存しました');
      
      // 保存後に前のページに戻る
      router.back();
    } catch (error) {
      console.error('タグの保存中にエラーが発生しました:', error);
      toast.error('保存に失敗しました。もう一度お試しください');
    }
  };
  
  // ページトランジション設定
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {/* ヘッダー */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="text-gray-500 p-1"
              >
                <FiChevronLeft size={24} />
              </button>
              <h1 className="text-lg font-medium ml-2">アピールタグ設定</h1>
            </div>
            <button 
              onClick={handleSave}
              className="bg-teal-500 text-white px-4 py-1.5 rounded-full text-sm flex items-center"
            >
              <FiCheck className="mr-1" /> 保存
            </button>
          </div>
        </div>

        {/* 説明テキスト */}
        <div className="bg-gray-100 p-4 flex items-start">
          <div className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">?</div>
          <p className="text-sm text-gray-700">あなたの魅力や興味を伝えるタグを選びましょう（最大5つまで）。ホーム画面でもこのタグが表示されます。</p>
        </div>

        {/* 選択中のタグ表示エリア */}
        <div className="p-4 bg-white shadow-sm">
          <h2 className="text-md font-medium mb-2">選択中のタグ（{selectedTagIds.length}/5）</h2>
          {selectedTagIds.length === 0 ? (
            <p className="text-sm text-gray-500">タグが選択されていません</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTagIds.map(tagId => {
                const tag = allTags.find(t => t.id === tagId);
                if (!tag) return null;
                
                return (
                  <div 
                    key={tag.id}
                    className={`${tag.backgroundColor || 'bg-gradient-to-r from-blue-400 to-indigo-500'} text-white px-3 py-1.5 rounded-full text-sm flex items-center`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 人気のタグ */}
        <div className="p-4">
          <h2 className="text-md font-medium mb-3">人気のタグ</h2>
          <div className="grid grid-cols-2 gap-3">
            {popularTags.map(tag => (
              <div 
                key={tag.id}
                className={`rounded-lg border ${selectedTagIds.includes(tag.id) ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'} p-3 shadow-sm`}
                onClick={() => toggleTag(tag.id)}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${tag.backgroundColor || 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}></div>
                  <p className="font-medium">{tag.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tag.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* カテゴリータグ */}
        <div className="p-4 mb-20">
          <h2 className="text-md font-medium mb-3">カテゴリー別タグ</h2>
          <div className="grid grid-cols-2 gap-3">
            {categoryTags.map(tag => (
              <div 
                key={tag.id}
                className={`rounded-lg border ${selectedTagIds.includes(tag.id) ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'} p-3 shadow-sm`}
                onClick={() => toggleTag(tag.id)}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${tag.backgroundColor || 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}></div>
                  <p className="font-medium">{tag.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tag.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* 下部の固定ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button 
            onClick={handleSave}
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          >
            <FiCheck className="mr-2" /> 選択したタグを保存する
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
