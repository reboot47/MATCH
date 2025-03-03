"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaImage, FaTrash, FaStar, FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// react-beautiful-dndの代わりにシンプルな実装で並べ替え機能を提供
interface Photo {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

interface PhotoGalleryProps {
  photos: Photo[];
  editable: boolean;
  onUpdate?: (photos: Photo[]) => Promise<boolean>;
}

export default function PhotoGallery({ photos, editable, onUpdate }: PhotoGalleryProps) {
  const [items, setItems] = useState<Photo[]>(photos);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Photo | null>(null);

  // 変更を保存
  const saveChanges = async (newItems: Photo[]) => {
    setItems(newItems);
    
    if (onUpdate) {
      try {
        await onUpdate(newItems);
      } catch (error) {
        console.error('Error updating photos:', error);
        toast.error('写真の更新に失敗しました');
      }
    }
  };

  // 写真を並べ替え
  const handleDragStart = (photo: Photo) => {
    setDraggedItem(photo);
  };

  const handleDragOver = (e: React.DragEvent, targetPhoto: Photo) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetPhoto.id) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetPhoto.id);
    
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    // APIを呼び出して順序を保存
    savePhotoOrder(items);
  };

  // 写真の順序を保存
  const savePhotoOrder = async (orderedPhotos: Photo[]) => {
    try {
      // 実際のAPIエンドポイントに合わせて変更
      /*
      await fetch('/api/photos/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: orderedPhotos.map(p => p.id) }),
      });
      */
      
      await saveChanges(orderedPhotos);
      toast.success('写真の並び順を保存しました');
    } catch (error) {
      console.error('Error saving photo order:', error);
      toast.error('写真の並び順の保存に失敗しました');
    }
  };

  // 写真の削除
  const handleDelete = (photoId: string) => {
    // 実際には確認ダイアログを表示
    if (confirm('この写真を削除してもよろしいですか？')) {
      const newItems = items.filter(item => item.id !== photoId);
      saveChanges(newItems);
      toast.success('写真を削除しました');
    }
  };

  // キャプションの変更
  const handleCaptionChange = (photoId: string, caption: string) => {
    const newItems = items.map(item => 
      item.id === photoId ? { ...item, caption } : item
    );
    setItems(newItems); // リアルタイムで更新（APIは呼ばない）
  };

  // キャプション編集完了時に保存
  const handleCaptionBlur = () => {
    saveChanges(items);
  };

  // プライマリ写真の設定
  const setPrimaryPhoto = (photoId: string) => {
    const newItems = items.map(item => ({
      ...item,
      isPrimary: item.id === photoId
    }));
    saveChanges(newItems);
    toast.success('プロフィール写真を設定しました');
  };

  // 写真のアップロード（モック）
  const handleUpload = (files: File[]) => {
    // ここで実際のアップロード処理を実装
    toast.success(`${files.length}枚の写真をアップロードしました`);
    setUploadOpen(false);
  };
  
  // アップロードモーダル（簡易版）
  const UploadModal = ({ open, onClose, onUpload }: { 
    open: boolean; 
    onClose: () => void; 
    onUpload: (files: File[]) => void;
  }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">写真をアップロード</h3>
          <p className="text-gray-600 mb-4">現実装ではアップロード機能を実装予定です</p>
          <div className="flex justify-end gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              キャンセル
            </button>
            <button 
              onClick={() => onUpload([])}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              アップロード
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">写真ギャラリー</h2>
        {editable && (
          <button
            onClick={() => setUploadOpen(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition flex items-center gap-2"
          >
            <FaUpload /> 写真を追加
          </button>
        )}
      </div>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((photo) => (
            <div
              key={photo.id}
              draggable={editable}
              onDragStart={() => handleDragStart(photo)}
              onDragOver={(e) => handleDragOver(e, photo)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square rounded-lg overflow-hidden group ${
                draggedItem?.id === photo.id ? 'opacity-50' : 'opacity-100'
              } ${
                photo.isPrimary ? 'ring-2 ring-pink-500' : ''
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `写真`}
                fill
                className="object-cover"
                unoptimized
              />
              {editable && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="text-white p-1.5 rounded-full bg-pink-500 hover:bg-pink-600 transition"
                      onClick={() => setPrimaryPhoto(photo.id)}
                      title="プロフィール写真に設定"
                    >
                      <FaStar className="text-white" />
                    </button>
                    <button 
                      className="text-white p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition"
                      onClick={() => handleDelete(photo.id)}
                      title="削除"
                    >
                      <FaTrash className="text-white" />
                    </button>
                  </div>
                  <input 
                    type="text"
                    placeholder="キャプションを追加"
                    defaultValue={photo.caption || ''}
                    onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                    onBlur={handleCaptionBlur}
                    className="bg-transparent border-b border-white text-white placeholder-gray-300 w-full"
                  />
                </div>
              )}
              {photo.isPrimary && (
                <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  メイン
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">写真を追加してプロフィールを充実させましょう</p>
          <p className="text-sm text-gray-400 mt-2">写真があると、マッチング率が10倍に上がります！</p>
        </div>
      )}
      
      {/* 写真アップロードモーダル */}
      <UploadModal 
        open={uploadOpen} 
        onClose={() => setUploadOpen(false)} 
        onUpload={handleUpload} 
      />
    </motion.div>
  );
}
