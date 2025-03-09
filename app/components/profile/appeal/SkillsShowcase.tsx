"use client";

import React, { useState } from 'react';
import { FaPlus, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { Skill } from '@/app/types/profile';
import { toast } from 'react-hot-toast';

interface SkillsShowcaseProps {
  skills: Skill[];
  onUpdate: (skills: Skill[]) => Promise<boolean>;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

// スキルカテゴリー
const SKILL_CATEGORIES = [
  '料理', 'スポーツ', '音楽', 'アート', '言語', 'テクノロジー', 
  'ダンス', '写真', '執筆', '工芸', 'ファッション', 'アウトドア', 'その他'
];

// スキルレベル
const SKILL_LEVELS = [
  { value: 'beginner', label: '初級', stars: 1 },
  { value: 'intermediate', label: '中級', stars: 2 },
  { value: 'advanced', label: '上級', stars: 3 },
  { value: 'expert', label: 'エキスパート', stars: 4 },
  { value: 'professional', label: 'プロ級', stars: 5 }
];

export default function SkillsShowcase({ 
  skills, 
  onUpdate, 
  isUpdating = false,
  isViewOnly = false
}: SkillsShowcaseProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  
  const [formData, setFormData] = useState<Partial<Skill>>({
    category: '',
    name: '',
    level: 'intermediate',
    description: ''
  });
  
  // フォームデータをリセット
  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      level: 'intermediate',
      description: ''
    });
    setEditing(null);
  };
  
  // フォーム入力の変更処理
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // スキルを保存
  const saveSkill = async () => {
    if (!formData.category || !formData.name || !formData.level) {
      toast.error('必須項目を入力してください');
      return;
    }
    
    try {
      let updatedSkills: Skill[];
      
      if (editing) {
        // 既存のスキルを更新
        updatedSkills = skills.map(skill => 
          skill.id === editing.id 
            ? { ...skill, ...formData as Skill }
            : skill
        );
      } else {
        // 新規スキルを追加
        const newSkill: Skill = {
          id: `skill_${Date.now()}`,
          ...formData as Skill
        };
        updatedSkills = [...skills, newSkill];
      }
      
      const success = await onUpdate(updatedSkills);
      if (success) {
        toast.success(editing ? 'スキルを更新しました' : 'スキルを追加しました');
        setIsAdding(false);
        resetForm();
      }
    } catch (error) {
      console.error('スキル保存エラー:', error);
      toast.error('スキルの保存に失敗しました');
    }
  };
  
  // スキルを削除
  const deleteSkill = async (id: string) => {
    try {
      const updatedSkills = skills.filter(skill => skill.id !== id);
      const success = await onUpdate(updatedSkills);
      if (success) {
        toast.success('スキルを削除しました');
      }
    } catch (error) {
      console.error('スキル削除エラー:', error);
      toast.error('スキルの削除に失敗しました');
    }
  };
  
  // スキル編集モードを開始
  const startEdit = (skill: Skill) => {
    setEditing(skill);
    setFormData({ ...skill });
    setIsAdding(true);
  };
  
  // スキルレベルに応じた星評価を表示
  const renderStars = (level: string) => {
    const skillLevel = SKILL_LEVELS.find(l => l.value === level);
    const starCount = skillLevel?.stars || 0;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={i < starCount ? "text-yellow-400" : "text-gray-300"} 
            size={16} 
          />
        ))}
      </div>
    );
  };
  
  // カテゴリーでスキルをグループ化
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  if (isAdding) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          {editing ? 'スキルを編集' : '新しいスキルを追加'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isUpdating}
            >
              <option value="">カテゴリーを選択</option>
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">スキル名</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="例: フレンチ料理"
              disabled={isUpdating}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">レベル</label>
            <select
              value={formData.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isUpdating}
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label} {[...Array(level.stars)].map(() => '★').join('')}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">詳細説明（任意）</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px]"
            placeholder="スキルについて詳しく教えてください..."
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setIsAdding(false);
              resetForm();
            }}
            className="px-4 py-2 border rounded-md"
            disabled={isUpdating}
          >
            キャンセル
          </button>
          <button
            onClick={saveSkill}
            className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:opacity-50"
            disabled={isUpdating || !formData.category || !formData.name || !formData.level}
          >
            {isUpdating ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    );
  }
  
  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">まだスキルがありません</p>
        {!isViewOnly && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-teal-500 text-white rounded-md flex items-center mx-auto"
            disabled={isUpdating}
          >
            <FaPlus className="mr-2" /> スキルを追加
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <div className="space-y-6 mb-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="bg-white rounded-lg p-4 shadow-sm relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-teal-700">{skill.name}</h4>
                      <div className="mt-1 mb-2">
                        {renderStars(skill.level)}
                      </div>
                      {skill.description && (
                        <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
                      )}
                    </div>
                    
                    {!isViewOnly && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(skill)}
                          className="text-gray-500 hover:text-teal-600"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {!isViewOnly && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-teal-500 text-white rounded-md flex items-center"
            disabled={isUpdating}
          >
            <FaPlus className="mr-2" /> スキルを追加
          </button>
        </div>
      )}
    </div>
  );
}
