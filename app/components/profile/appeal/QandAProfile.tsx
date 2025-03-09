"use client";

import React, { useState } from 'react';
import { FaQuestion, FaPlus, FaChevronDown, FaChevronUp, FaTrash, FaEdit } from 'react-icons/fa';
import { QandA } from '@/app/types/profile';
import { toast } from 'react-hot-toast';

interface QandAProfileProps {
  items?: QandA[];
  onUpdate: (items: QandA[]) => Promise<boolean>;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

// 事前定義された質問集
const PREDEFINED_QUESTIONS = [
  '休日はどのように過ごしますか？',
  '人生で最も影響を受けた本や映画は何ですか？',
  '理想のデートはどんな感じですか？',
  '自分の性格を3つの単語で表すと？',
  '今までで最も印象に残っている旅行先は？',
  '自分の中で譲れないことはありますか？',
  '5年後、どんな生活をしていたいですか？',
  '自分の長所と短所は何だと思いますか？',
  'ストレス解消法は何ですか？',
  'どんな料理が得意ですか？',
  '幸せを感じる瞬間はどんな時ですか？',
  '子供の頃の夢は何でしたか？',
  '大切にしている価値観は何ですか？',
  'あなたの趣味は何ですか？そのきっかけは？',
  '理想の休暇の過ごし方は？'
];

export default function QandAProfile({
  items = [],
  onUpdate,
  isUpdating = false,
  isViewOnly = false
}: QandAProfileProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<QandA>>({
    question: '',
    answer: '',
    isCustomQuestion: false
  });
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  
  // Q&Aアイテムの追加または更新
  const saveItem = async () => {
    const question = newItem.isCustomQuestion 
      ? customQuestion 
      : (selectedQuestion || PREDEFINED_QUESTIONS[0]);
    
    if (!question || !newItem.answer) {
      toast.error('質問と回答は必須です');
      return;
    }
    
    try {
      let updatedItems: QandA[];
      
      if (isEditing) {
        // 既存アイテムを更新
        updatedItems = items.map(item => {
          if (item.id === isEditing) {
            return { 
              ...item, 
              question,
              answer: newItem.answer || '',
              isCustomQuestion: newItem.isCustomQuestion || false
            } as QandA;
          }
          return item;
        });
      } else {
        // 新規アイテムを追加
        const newQandA: QandA = {
          id: `qanda_${Date.now()}`,
          question,
          answer: newItem.answer || '',
          isCustomQuestion: newItem.isCustomQuestion || false,
          createdAt: new Date()
        };
        
        updatedItems = [...items, newQandA];
      }
      
      const success = await onUpdate(updatedItems);
      if (success) {
        toast.success(isEditing ? '回答を更新しました' : '回答を追加しました');
        resetForm();
      }
    } catch (error) {
      console.error('Q&A保存エラー:', error);
      toast.error('回答の保存に失敗しました');
    }
  };
  
  // Q&Aアイテムの削除
  const deleteItem = async (id: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== id);
      const success = await onUpdate(updatedItems);
      if (success) {
        toast.success('回答を削除しました');
      }
    } catch (error) {
      console.error('Q&A削除エラー:', error);
      toast.error('回答の削除に失敗しました');
    }
  };
  
  // 編集開始
  const startEdit = (item: QandA) => {
    setIsAdding(true);
    setIsEditing(item.id);
    setNewItem({
      ...item
    });
    
    if (item.isCustomQuestion) {
      setCustomQuestion(item.question);
    } else {
      setSelectedQuestion(item.question);
    }
  };
  
  // フォームのリセット
  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setNewItem({
      question: '',
      answer: '',
      isCustomQuestion: false
    });
    setSelectedQuestion(PREDEFINED_QUESTIONS[0]);
    setCustomQuestion('');
  };
  
  // アコーディオン切り替え
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // 質問タイプの切り替え
  const toggleQuestionType = (isCustom: boolean) => {
    setNewItem({
      ...newItem,
      isCustomQuestion: isCustom
    });
  };
  
  return (
    <div className="bg-white rounded-lg">
      {!isViewOnly && !isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg flex items-center justify-center mb-6 hover:bg-gray-50"
          disabled={isUpdating}
        >
          <FaPlus className="mr-2 text-gray-500" />
          <span className="text-gray-500">質問に回答する</span>
        </button>
      )}
      
      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? '回答を編集' : '新しい回答を追加'}
          </h3>
          
          <div className="mb-4">
            <div className="flex space-x-4 mb-2">
              <button
                onClick={() => toggleQuestionType(false)}
                className={`px-3 py-1 text-sm rounded-md ${
                  !newItem.isCustomQuestion 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                disabled={isUpdating}
              >
                質問を選択
              </button>
              <button
                onClick={() => toggleQuestionType(true)}
                className={`px-3 py-1 text-sm rounded-md ${
                  newItem.isCustomQuestion 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                disabled={isUpdating}
              >
                質問を作成
              </button>
            </div>
            
            {newItem.isCustomQuestion ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">質問を入力 *</label>
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="例: あなたの将来の夢は何ですか？"
                  disabled={isUpdating}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">質問を選択 *</label>
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={isUpdating}
                >
                  {PREDEFINED_QUESTIONS.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">回答 *</label>
            <textarea
              value={newItem.answer || ''}
              onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
              className="w-full p-2 border rounded-md h-32"
              placeholder="質問に対する答えを入力してください"
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 border rounded-md"
              disabled={isUpdating}
            >
              キャンセル
            </button>
            <button
              onClick={saveItem}
              className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:opacity-50"
              disabled={isUpdating || (!selectedQuestion && !customQuestion) || !newItem.answer}
            >
              {isUpdating ? '保存中...' : (isEditing ? '更新' : '保存')}
            </button>
          </div>
        </div>
      )}
      
      {items.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-gray-500">
          <FaQuestion size={32} className="mx-auto mb-3 text-gray-300" />
          <p>まだ質問に回答していません</p>
          {!isViewOnly && (
            <p className="text-sm mt-2">質問に回答して、あなたのことをもっと知ってもらいましょう</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="px-4 py-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <h3 className="font-medium">{item.question}</h3>
                <div className="flex items-center">
                  {!isViewOnly && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(item);
                        }}
                        className="p-2 text-gray-500 hover:text-gray-700"
                        disabled={isUpdating}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        disabled={isUpdating}
                      >
                        <FaTrash size={14} />
                      </button>
                    </>
                  )}
                  {expandedId === item.id ? (
                    <FaChevronUp className="text-gray-500 ml-2" />
                  ) : (
                    <FaChevronDown className="text-gray-500 ml-2" />
                  )}
                </div>
              </div>
              
              {expandedId === item.id && (
                <div className="p-4 bg-white">
                  <p className="text-gray-700 whitespace-pre-line">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* ヒント */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Q&Aプロフィールのヒント:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>ユニークで個性的な回答を心がけましょう</li>
          <li>回答は簡潔ですが、具体的なエピソードを入れるとより魅力的になります</li>
          <li>あなたの価値観や人生観が伝わる質問を選びましょう</li>
          <li>ユーモアを取り入れるとあなたの人柄が伝わります</li>
        </ul>
      </div>
    </div>
  );
}
