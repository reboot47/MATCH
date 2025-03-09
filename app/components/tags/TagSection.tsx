'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TagCard, { TagData } from './TagCard';
import { getTagsByPopularity, popularTags, categoryTags } from '@/app/data/tagData';
import { IoAdd } from 'react-icons/io5';

interface TagSectionProps {
  onTagSelect?: (tag: TagData) => void;
}

const TagSection: React.FC<TagSectionProps> = ({ onTagSelect }) => {
  // 選択したタグを管理
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // タグ選択の処理
  const handleTagSelect = (tag: TagData) => {
    if (onTagSelect) {
      onTagSelect(tag);
    }
    
    // 選択済みタグの切り替え
    setSelectedTags(prev => {
      if (prev.includes(tag.id)) {
        return prev.filter(id => id !== tag.id);
      } else {
        return [...prev, tag.id];
      }
    });
  };

  // タグ設定モーダル
  const [showTagSettings, setShowTagSettings] = useState(false);

  // タグ設定をひらく
  const openTagSettings = () => {
    setShowTagSettings(true);
  };

  // 人気のタグ
  const topTags = getTagsByPopularity(4);

  return (
    <div className="bg-gray-50 pb-4">
      {/* 人気のタグセクション */}
      <div className="mb-6">
        <h3 className="text-lg font-bold px-4 pt-4 pb-2 text-gray-800">人気のタグ</h3>
        <div className="flex overflow-x-auto px-4 pb-2 gap-3 no-scrollbar">
          {topTags.map((tag) => (
            <div key={tag.id} className="flex-shrink-0">
              <TagCard 
                tag={tag} 
                onClick={handleTagSelect} 
                size="medium"
              />
            </div>
          ))}
        </div>
      </div>

      {/* タグからさがすセクション */}
      <div>
        <h3 className="text-lg font-bold px-4 pb-2 text-gray-800">タグからさがす</h3>
        <div className="flex overflow-x-auto px-4 pb-2 gap-3 no-scrollbar">
          {categoryTags.map((tag) => (
            <div key={tag.id} className="flex-shrink-0">
              <TagCard 
                tag={tag} 
                onClick={handleTagSelect} 
                size="small"
              />
            </div>
          ))}
          {/* タグ設定ボタン */}
          <div className="flex-shrink-0">
            <motion.div
              className="h-24 w-32 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={openTagSettings}
            >
              <div className="flex flex-col items-center text-gray-500">
                <IoAdd size={24} />
                <span className="text-sm mt-1">タグ設定</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 選択したタグの表示エリア */}
      {selectedTags.length > 0 && (
        <div className="mt-4 px-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-2">選択したタグ</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tagId => {
                const tag = getTagsByPopularity().find(t => t.id === tagId);
                return tag ? (
                  <div 
                    key={tag.id}
                    className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag.name} ✕
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSection;
