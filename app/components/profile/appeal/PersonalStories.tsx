"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PersonalStory } from '@/app/types/profile';
import { toast } from 'react-hot-toast';

interface PersonalStoriesProps {
  stories: PersonalStory[];
  onUpdate: (stories: PersonalStory[]) => Promise<boolean>;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

// ストーリーの質問テンプレート
const STORY_TEMPLATES = [
  '休日の過ごし方について教えてください',
  '人生で最も誇りに思うことは何ですか？',
  'あなたの理想のデートを教えてください',
  '子供の頃の思い出で一番心に残っていることは？',
  '最近ハマっていることは何ですか？',
  '友達があなたを一言で表すとしたら何と言うでしょうか？',
  '5年後、どんな自分になっていたいですか？',
  '今までで一番の冒険は何でしたか？',
  'あなたの人生のモットーは？',
  '一番行きたい場所はどこですか？その理由は？'
];

export default function PersonalStories({ 
  stories, 
  onUpdate, 
  isUpdating = false,
  isViewOnly = false
}: PersonalStoriesProps) {
  const [editing, setEditing] = useState<PersonalStory | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 未使用のテンプレート質問を取得
  const getUnusedTemplates = () => {
    const usedQuestions = new Set(stories.map(s => s.question));
    return STORY_TEMPLATES.filter(q => !usedQuestions.has(q));
  };
  
  // ストーリーを保存
  const saveStory = async () => {
    if (!currentQuestion.trim() || !currentAnswer.trim()) {
      toast.error('質問と回答を入力してください');
      return;
    }
    
    try {
      let updatedStories: PersonalStory[];
      
      if (editing) {
        // 既存のストーリーを更新
        updatedStories = stories.map(story => 
          story.id === editing.id 
            ? { ...story, question: currentQuestion, answer: currentAnswer }
            : story
        );
      } else {
        // 新規ストーリーを追加
        const newStory: PersonalStory = {
          id: `story_${Date.now()}`,
          question: currentQuestion,
          answer: currentAnswer,
          createdAt: new Date()
        };
        updatedStories = [...stories, newStory];
      }
      
      const success = await onUpdate(updatedStories);
      if (success) {
        toast.success(editing ? 'ストーリーを更新しました' : 'ストーリーを追加しました');
        setIsAdding(false);
        setEditing(null);
        setCurrentQuestion('');
        setCurrentAnswer('');
      }
    } catch (error) {
      console.error('ストーリー保存エラー:', error);
      toast.error('ストーリーの保存に失敗しました');
    }
  };
  
  // ストーリーを削除
  const deleteStory = async (id: string) => {
    try {
      const updatedStories = stories.filter(story => story.id !== id);
      const success = await onUpdate(updatedStories);
      if (success) {
        toast.success('ストーリーを削除しました');
      }
    } catch (error) {
      console.error('ストーリー削除エラー:', error);
      toast.error('ストーリーの削除に失敗しました');
    }
  };
  
  // ストーリー編集モードを開始
  const startEdit = (story: PersonalStory) => {
    setEditing(story);
    setCurrentQuestion(story.question);
    setCurrentAnswer(story.answer);
    setIsAdding(true);
  };
  
  // 新規ストーリー追加モードを開始
  const startAdd = () => {
    setEditing(null);
    setCurrentQuestion(getUnusedTemplates()[0] || '');
    setCurrentAnswer('');
    setIsAdding(true);
  };
  
  // キャンセル処理
  const handleCancel = () => {
    setIsAdding(false);
    setEditing(null);
    setCurrentQuestion('');
    setCurrentAnswer('');
  };
  
  // ストーリー表示の前後移動
  const navigateStories = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(prev => (prev > 0 ? prev - 1 : stories.length - 1));
    } else {
      setCurrentIndex(prev => (prev < stories.length - 1 ? prev + 1 : 0));
    }
  };
  
  if (isAdding) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          {editing ? 'ストーリーを編集' : '新しいストーリーを追加'}
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">質問</label>
          <select
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled={isUpdating}
          >
            {editing && <option value={editing.question}>{editing.question}</option>}
            {getUnusedTemplates().map((template, index) => (
              <option key={index} value={template}>
                {template}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">回答</label>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[120px]"
            placeholder="あなたの回答を入力してください..."
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md"
            disabled={isUpdating}
          >
            キャンセル
          </button>
          <button
            onClick={saveStory}
            className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:opacity-50"
            disabled={isUpdating || !currentQuestion || !currentAnswer}
          >
            {isUpdating ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    );
  }
  
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">まだストーリーがありません</p>
        {!isViewOnly && (
          <button
            onClick={startAdd}
            className="px-4 py-2 bg-teal-500 text-white rounded-md flex items-center mx-auto"
            disabled={isUpdating}
          >
            <FaPlus className="mr-2" /> ストーリーを追加
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div>
      {/* ストーリー表示部分 */}
      {stories.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 relative">
          <motion.div
            key={stories[currentIndex].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-medium text-teal-600 mb-2">
              {stories[currentIndex].question}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">
              {stories[currentIndex].answer}
            </p>
            
            {stories[currentIndex].mediaUrl && (
              <div className="mt-4">
                {stories[currentIndex].mediaType === 'video' ? (
                  <video
                    src={stories[currentIndex].mediaUrl}
                    controls
                    className="w-full max-h-[300px] object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={stories[currentIndex].mediaUrl}
                    alt="ストーリー画像"
                    className="w-full max-h-[300px] object-cover rounded-lg"
                  />
                )}
              </div>
            )}
          </motion.div>
          
          {/* 前後ナビゲーション */}
          {stories.length > 1 && (
            <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2">
              <button
                onClick={() => navigateStories('prev')}
                className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-teal-600 -ml-4"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={() => navigateStories('next')}
                className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-teal-600 -mr-4"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          )}
          
          {/* 進行状況インジケーター */}
          {stories.length > 1 && (
            <div className="flex justify-center mt-4 space-x-1">
              {stories.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* 編集・削除ボタン */}
          {!isViewOnly && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => startEdit(stories[currentIndex])}
                className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-teal-600"
              >
                <FaEdit size={14} />
              </button>
              <button
                onClick={() => deleteStory(stories[currentIndex].id)}
                className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-red-600"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 追加ボタン */}
      {!isViewOnly && (
        <div className="flex justify-center">
          <button
            onClick={startAdd}
            className="px-4 py-2 bg-teal-500 text-white rounded-md flex items-center"
            disabled={isUpdating || getUnusedTemplates().length === 0}
          >
            <FaPlus className="mr-2" /> ストーリーを追加
          </button>
        </div>
      )}
    </div>
  );
}
