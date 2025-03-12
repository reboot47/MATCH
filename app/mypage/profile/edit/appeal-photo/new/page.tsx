"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiImage, 
  FiCamera, 
  FiCheck,
  FiInfo,
  FiX,
  FiPlus
} from 'react-icons/fi';

interface AppealPhoto {
  id: string;
  url: string;
}

export default function AppealPhotoEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 選択した写真の状態管理
  const [selectedPhotos, setSelectedPhotos] = useState<AppealPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 最大選択可能枚数
  const MAX_PHOTOS = 6;
  
  // ページトランジションのアニメーション設定
  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  };

  // ファイル選択ハンドラ
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // 新しい写真を追加
        const newPhoto: AppealPhoto = {
          id: Date.now().toString(),
          url: reader.result as string
        };
        
        setSelectedPhotos(prev => [...prev, newPhoto]);
        setIsLoading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // 写真選択ボタンをクリック
  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 特定の写真を削除
  const handleRemovePhoto = (id: string) => {
    setSelectedPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  // 写真保存処理
  const handleSavePhotos = () => {
    // ここで実際のAPIへの保存処理を実装
    console.log('アピール写真を保存しました', selectedPhotos);
    
    // 保存完了後に前のページに戻る
    router.back();
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 p-1"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">アピール写真編集</h1>
          <button 
            className="text-teal-500 font-medium"
            onClick={handleSavePhotos}
          >
            保存
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        {/* 写真枚数カウント */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium">アピール写真</h2>
          <span className="text-sm text-gray-500">
            {selectedPhotos.length}/{MAX_PHOTOS}枚
          </span>
        </div>
        
        {/* 説明文 */}
        <p className="text-sm text-gray-600 mb-4">
          あなたの魅力が伝わる写真を追加しましょう。最大6枚まで設定できます。
        </p>
        
        {/* 写真グリッド */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* 既存の写真 */}
          {selectedPhotos.map(photo => (
            <div key={photo.id} className="relative aspect-square bg-white rounded-lg overflow-hidden shadow">
              <Image 
                src={photo.url}
                alt="アピール写真"
                fill
                className="object-cover"
              />
              <button 
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                onClick={() => handleRemovePhoto(photo.id)}
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
          
          {/* 追加ボタン (最大枚数未満の場合のみ表示) */}
          {selectedPhotos.length < MAX_PHOTOS && (
            <motion.div 
              className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-teal-300"
              onClick={handleSelectClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={24} className="text-teal-500 mb-1" />
              <span className="text-xs text-teal-500">追加</span>
            </motion.div>
          )}
          
          {/* プレースホルダー (グリッドを埋めるため) */}
          {Array.from({ length: Math.max(0, MAX_PHOTOS - selectedPhotos.length - 1) }).map((_, index) => (
            <div key={`placeholder-${index}`} className="aspect-square bg-gray-100 rounded-lg" />
          ))}
        </div>
        
        {/* 隠しファイル入力 */}
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        
        {/* 写真選択ボタン */}
        <motion.button
          className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium flex items-center justify-center mb-4"
          onClick={handleSelectClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={selectedPhotos.length >= MAX_PHOTOS}
        >
          <FiImage className="mr-2" size={20} />
          写真を選択する
        </motion.button>
      </div>
      
      {/* 注意書き */}
      <div className="p-4 mt-2">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-start mb-2">
            <FiInfo size={18} className="text-gray-500 mr-2 mt-0.5" />
            <h3 className="font-medium">アピール写真のポイント</h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>・あなたの趣味や特技が伝わる写真が効果的です</li>
            <li>・旅行先や思い出の場所での写真も魅力的です</li>
            <li>・明るく鮮明な写真を選びましょう</li>
            <li>・他人が写っている写真は避けましょう</li>
          </ul>
        </div>
      </div>

      {/* 保存ボタン */}
      {selectedPhotos.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-top">
          <motion.button
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
            onClick={handleSavePhotos}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiCheck className="mr-2" size={20} />
            写真を保存する ({selectedPhotos.length}枚)
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
