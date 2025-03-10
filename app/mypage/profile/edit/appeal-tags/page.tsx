"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiPlus } from 'react-icons/fi';

export default function AppealTagsPage() {
  const router = useRouter();
  
  // アピールタグの選択状態を管理
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // サンプルのアピールタグ
  const appealTags = [
    {
      id: 1,
      title: "まずはお茶から",
      image: "/images/profile/appeal_tea.jpg",
      selected: false
    },
    {
      id: 2,
      title: "仲良くなりたい",
      image: "/images/profile/appeal_friends.jpg",
      selected: false
    },
    {
      id: 3,
      title: "めざせともだち100人！",
      image: "/images/profile/appeal_many_friends.jpg",
      selected: false
    },
    {
      id: 4,
      title: "経験豊富な男性に話を聞きたい！",
      image: "/images/profile/appeal_talk.jpg",
      selected: false
    },
    {
      id: 5,
      title: "お食事したい",
      image: "/images/profile/appeal_dinner.jpg",
      selected: false
    },
    {
      id: 6,
      title: "お酒飲みに行きたい",
      image: "/images/profile/appeal_drink.jpg",
      selected: false
    }
  ];
  
  // タグの選択状態を切り替える
  const toggleTag = (id: number) => {
    const tag = appealTags.find(tag => tag.id === id);
    if (tag) {
      if (selectedTags.includes(tag.title)) {
        setSelectedTags(selectedTags.filter(t => t !== tag.title));
      } else {
        setSelectedTags([...selectedTags, tag.title]);
      }
    }
  };
  
  // ページのトランジション設定
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
          <div className="flex items-center px-4 py-3">
            <button 
              onClick={() => router.back()}
              className="text-gray-500 p-1"
            >
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-medium ml-2">アピールタグ設定</h1>
          </div>
        </div>

        {/* 説明テキスト */}
        <div className="bg-gray-100 p-4 flex items-start">
          <div className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">?</div>
          <p className="text-sm text-gray-700">アピールタグを設定すると、あなたの人柄が分かるためいいねをもらいやすくなります</p>
        </div>

        {/* アピールタググリッド */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {appealTags.map(tag => (
            <div key={tag.id} className="relative">
              <div 
                className={`rounded-lg overflow-hidden ${selectedTags.includes(tag.title) ? 'ring-2 ring-teal-400' : ''}`}
                onClick={() => toggleTag(tag.id)}
              >
                <div className="aspect-[4/3] relative">
                  <Image 
                    src={tag.image} 
                    alt={tag.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-sm font-medium">{tag.title}</p>
                  </div>
                </div>
                <div className="p-2 bg-white flex items-center justify-center">
                  <button className="text-gray-600 text-sm flex items-center">
                    <FiPlus className="mr-1" /> {selectedTags.includes(tag.title) ? '追加済み' : '追加する'}
                  </button>
                </div>
              </div>
              {/* 登録必須マーク（最後の2つのみ） */}
              {(tag.id === 5 || tag.id === 6) && (
                <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  N
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
