"use client";

import React, { useState } from 'react';
import { FaCalendarAlt, FaPlus, FaTrash, FaEdit, FaClock, FaMapMarkerAlt, FaUsers, FaCamera } from 'react-icons/fa';
import { EventHistory } from '@/app/types/profile';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';

interface EventTimelineProps {
  events?: EventHistory[];
  onUpdate: (events: EventHistory[]) => Promise<boolean>;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

// イベントカテゴリー
const EVENT_CATEGORIES = [
  { id: 'party', name: 'パーティー・社交イベント', icon: '🎉' },
  { id: 'learning', name: '学習・自己啓発', icon: '📚' },
  { id: 'outdoor', name: 'アウトドア・スポーツ', icon: '🏕️' },
  { id: 'culture', name: '文化・芸術イベント', icon: '🎭' },
  { id: 'travel', name: '旅行・観光', icon: '✈️' },
  { id: 'food', name: 'グルメ・飲食イベント', icon: '🍽️' },
  { id: 'music', name: '音楽・ライブ', icon: '🎵' },
  { id: 'volunteer', name: 'ボランティア活動', icon: '🤝' },
  { id: 'tech', name: 'テクノロジー・IT', icon: '💻' },
  { id: 'other', name: 'その他', icon: '📌' }
];

export default function EventTimeline({
  events = [],
  onUpdate,
  isUpdating = false,
  isViewOnly = false
}: EventTimelineProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<EventHistory>>({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'party',
    description: '',
    location: '',
    participants: '',
    imageUrl: ''
  });
  
  // 日付をフォーマット
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'yyyy年MM月dd日', { locale: ja });
    } catch (error) {
      return '日付不明';
    }
  };
  
  // イベントの追加または更新
  const saveEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('タイトルと日付は必須です');
      return;
    }
    
    try {
      let updatedEvents: EventHistory[];
      
      if (isEditing) {
        // 既存イベントを更新
        updatedEvents = events.map(event => {
          if (event.id === isEditing) {
            return { ...event, ...newEvent, id: event.id } as EventHistory;
          }
          return event;
        });
      } else {
        // 新規イベントを追加
        const newEventWithId: EventHistory = {
          id: `event_${Date.now()}`,
          title: newEvent.title || '',
          date: new Date(newEvent.date || Date.now()),
          category: newEvent.category || 'other',
          description: newEvent.description || '',
          location: newEvent.location || '',
          participants: newEvent.participants || '',
          imageUrl: newEvent.imageUrl || '',
          createdAt: new Date()
        };
        
        updatedEvents = [...events, newEventWithId];
      }
      
      // 日付順に並べ替え
      updatedEvents.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      const success = await onUpdate(updatedEvents);
      if (success) {
        toast.success(isEditing ? 'イベントを更新しました' : 'イベントを追加しました');
        resetForm();
      }
    } catch (error) {
      console.error('イベント保存エラー:', error);
      toast.error('イベントの保存に失敗しました');
    }
  };
  
  // イベントの削除
  const deleteEvent = async (id: string) => {
    try {
      const updatedEvents = events.filter(event => event.id !== id);
      const success = await onUpdate(updatedEvents);
      if (success) {
        toast.success('イベントを削除しました');
      }
    } catch (error) {
      console.error('イベント削除エラー:', error);
      toast.error('イベントの削除に失敗しました');
    }
  };
  
  // 編集開始
  const startEdit = (event: EventHistory) => {
    setIsAdding(true);
    setIsEditing(event.id);
    setNewEvent({
      ...event,
      date: format(new Date(event.date), 'yyyy-MM-dd')
    });
  };
  
  // フォームのリセット
  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setNewEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'party',
      description: '',
      location: '',
      participants: '',
      imageUrl: ''
    });
  };
  
  // イベントカテゴリー表示
  const getCategoryInfo = (categoryId: string) => {
    const category = EVENT_CATEGORIES.find(cat => cat.id === categoryId) || EVENT_CATEGORIES[9]; // デフォルトはその他
    return category;
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
          <span className="text-gray-500">イベント参加履歴を追加</span>
        </button>
      )}
      
      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? 'イベントを編集' : '新しいイベントを追加'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">イベント名 *</label>
              <input
                type="text"
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="例: 東京国際交流パーティー"
                disabled={isUpdating}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日付 *</label>
              <input
                type="date"
                value={newEvent.date || ''}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full p-2 border rounded-md"
                disabled={isUpdating}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
              <select
                value={newEvent.category || 'other'}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="w-full p-2 border rounded-md"
                disabled={isUpdating}
              >
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開催場所</label>
              <input
                type="text"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="例: 渋谷ヒカリエホール"
                disabled={isUpdating}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">参加者情報</label>
            <input
              type="text"
              value={newEvent.participants || ''}
              onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="例: 国際交流に興味がある20〜30代約100名"
              disabled={isUpdating}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">詳細・感想</label>
            <textarea
              value={newEvent.description || ''}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full p-2 border rounded-md h-24"
              placeholder="イベントの感想や学んだことなどを記入してください"
              disabled={isUpdating}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">画像URL</label>
            <input
              type="text"
              value={newEvent.imageUrl || ''}
              onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="例: https://example.com/event-image.jpg"
              disabled={isUpdating}
            />
            <p className="text-xs text-gray-500 mt-1">
              イベントの雰囲気がわかる画像URLを入力してください。実際の実装では画像アップロード機能が必要です。
            </p>
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
              onClick={saveEvent}
              className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:opacity-50"
              disabled={isUpdating || !newEvent.title || !newEvent.date}
            >
              {isUpdating ? '保存中...' : (isEditing ? '更新' : '保存')}
            </button>
          </div>
        </div>
      )}
      
      {events.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-gray-500">
          <FaCalendarAlt size={32} className="mx-auto mb-3 text-gray-300" />
          <p>参加したイベントの記録はありません</p>
          {!isViewOnly && (
            <p className="text-sm mt-2">イベントに参加した経験を追加して、自分の興味や活動をアピールしましょう</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="space-y-6">
            {events.map((event) => (
              <li key={event.id} className="border border-gray-200 rounded-lg p-4 relative">
                {!isViewOnly && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => startEdit(event)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      disabled={isUpdating}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      disabled={isUpdating}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-start mb-3">
                  <div className="h-10 w-10 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full mr-3 flex-shrink-0">
                    <span className="text-lg">{getCategoryInfo(event.category).icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaClock className="mr-1" size={14} />
                        {formatDate(event.date)}
                      </span>
                      {event.location && (
                        <span className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" size={14} />
                          {event.location}
                        </span>
                      )}
                      {event.participants && (
                        <span className="flex items-center">
                          <FaUsers className="mr-1" size={14} />
                          {event.participants}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {event.imageUrl && (
                  <div className="mb-3 relative rounded-lg overflow-hidden h-48 bg-gray-100">
                    {/* 実際の実装では適切な画像コンポーネントを使用する */}
                    <div className="relative w-full h-full">
                      <Image 
                        src={event.imageUrl}
                        alt={event.title} 
                        fill
                        style={{objectFit: 'cover'}}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}
                
                {event.description && (
                  <p className="text-gray-700 whitespace-pre-line">
                    {event.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* ヒント */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">イベント参加履歴のヒント:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>最近参加したイベントほど、あなたの現在の関心を表しています</li>
          <li>写真があるとイベントの雰囲気がよく伝わります</li>
          <li>感想や学びを書くと、あなたの価値観や考え方が伝わります</li>
          <li>多様なカテゴリのイベントを追加すると、幅広い興味関心をアピールできます</li>
        </ul>
      </div>
    </div>
  );
}
