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
  FiRotateCw,
  FiCrop,
  FiFilter
} from 'react-icons/fi';

export default function MainPhotoEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'gallery'>('gallery');
  
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
        setSelectedImage(reader.result as string);
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

  // 写真保存処理
  const handleSavePhoto = () => {
    // ここで実際のAPIへの保存処理を実装
    console.log('メイン写真を保存しました', selectedImage);
    
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
          <h1 className="text-lg font-medium">メイン写真編集</h1>
          {selectedImage && (
            <button 
              className="text-teal-500 font-medium"
              onClick={handleSavePhoto}
            >
              保存
            </button>
          )}
        </div>
      </div>

      {/* タブ切り替え */}
      <div className="flex border-b bg-white">
        <button
          className={`flex-1 py-3 text-center ${activeTab === 'gallery' ? 'text-teal-500 border-b-2 border-teal-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('gallery')}
        >
          ギャラリー
        </button>
        <button
          className={`flex-1 py-3 text-center ${activeTab === 'camera' ? 'text-teal-500 border-b-2 border-teal-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('camera')}
        >
          カメラ
        </button>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        {activeTab === 'gallery' && (
          <>
            {/* 写真プレビュー */}
            {selectedImage ? (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-white shadow">
                <Image 
                  src={selectedImage}
                  alt="メイン写真プレビュー"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-square rounded-lg mb-4 bg-white shadow flex flex-col items-center justify-center">
                <FiImage size={48} className="text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">写真を選択してください</p>
              </div>
            )}
            
            {/* 操作ボタン */}
            <div className="flex flex-col gap-3">
              <motion.button
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                onClick={handleSelectClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiImage className="mr-2" size={20} />
                写真を選択する
              </motion.button>
              
              {/* 隠しファイル入力 */}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {selectedImage && (
                <div className="flex gap-2 mt-2">
                  <motion.button
                    className="flex-1 py-3 bg-white rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiRotateCw className="mr-2" size={18} />
                    回転
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 py-3 bg-white rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiCrop className="mr-2" size={18} />
                    トリミング
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 py-3 bg-white rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiFilter className="mr-2" size={18} />
                    フィルター
                  </motion.button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'camera' && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
            <FiCamera size={48} className="text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm mb-4">カメラで撮影する</p>
            
            <button className="bg-teal-500 text-white px-6 py-2 rounded-full">
              撮影する
            </button>
          </div>
        )}
      </div>

      {/* 注意書き */}
      <div className="p-4 mt-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-medium mb-2">メイン写真のポイント</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>・あなたの顔がはっきりと分かり、魅力が伝わる写真を選びましょう</li>
            <li>・明るい場所で撮影された写真が印象アップに繋がります</li>
            <li>・自然な笑顔の写真が好印象を与えます</li>
          </ul>
        </div>
      </div>

      {/* 保存ボタン */}
      {selectedImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-top">
          <motion.button
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
            onClick={handleSavePhoto}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiCheck className="mr-2" size={20} />
            この写真を使用する
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
