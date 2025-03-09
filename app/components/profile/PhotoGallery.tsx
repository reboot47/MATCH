"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTrash, FaStar, FaUpload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

// react-beautiful-dndの代わりにシンプルな実装で並べ替え機能を提供
interface Photo {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
  publicId?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  editable: boolean;
  onUpdate?: (photos: Photo[]) => Promise<boolean>;
  maxPhotoCount?: number;
}

export default function PhotoGallery({ 
  photos, 
  editable, 
  onUpdate,
  maxPhotoCount = 9 
}: PhotoGalleryProps) {
  const [items, setItems] = useState<Photo[]>(photos);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      await saveChanges(orderedPhotos);
      toast.success('写真の並び順を保存しました');
    } catch (error) {
      console.error('Error saving photo order:', error);
      toast.error('写真の並び順の保存に失敗しました');
    }
  };

  // 写真の削除
  const handleDelete = async (photoId: string) => {
    // 確認ダイアログを表示
    if (confirm('この写真を削除してもよろしいですか？')) {
      try {
        const deletedPhoto = items.find(item => item.id === photoId);
        if (deletedPhoto && deletedPhoto.publicId) {
          // APIを呼び出して写真を削除
          await axios.delete(`/api/profile/media?mediaId=${photoId}`);
        }
        
        const newItems = items.filter(item => item.id !== photoId);
        await saveChanges(newItems);
        toast.success('写真を削除しました');
      } catch (error) {
        console.error('Error deleting photo:', error);
        toast.error('写真の削除に失敗しました');
      }
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
  const setPrimaryPhoto = async (photoId: string) => {
    const newItems = items.map(item => ({
      ...item,
      isPrimary: item.id === photoId
    }));
    await saveChanges(newItems);
    toast.success('プロフィール写真を設定しました');
  };

  // 写真のアップロード処理
  const handleUpload = async (files: File[]) => {
    if (files.length === 0) {
      toast.error('アップロードするファイルを選択してください');
      return;
    }
    
    if (items.length + files.length > maxPhotoCount) {
      toast.error(`写真は最大${maxPhotoCount}枚までアップロードできます`);
      return;
    }
    
    // 画像ファイルのみをフィルター
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('画像ファイルのみアップロードできます');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(10); // 初期進捗状況
      
      // FormDataの作成
      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
        formData.append(`type${index}`, 'image');
      });
      
      // プログレスイベントの設定
      const uploadProgress = {
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 90) / progressEvent.total
          );
          setUploadProgress(Math.min(90, percentCompleted));
        }
      };
      
      // API呼び出し
      const response = await axios.post('/api/profile/media', formData, uploadProgress);
      
      if (response.data.success) {
        setUploadProgress(100);
        toast.success(`${imageFiles.length}枚の写真をアップロードしました`);
        
        // アップロードされた写真を追加
        const newPhotos = [...items, ...response.data.mediaItems.filter((item: any) => item.type === 'image')];
        await saveChanges(newPhotos);
        setUploadOpen(false);
      } else {
        toast.error(response.data.error || '写真のアップロードに失敗しました');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('写真のアップロードに失敗しました');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Dropzone設定
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleUpload(acceptedFiles);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxPhotoCount - items.length,
  });
  
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
            className="bg-[#66cdaa] text-white px-4 py-2 rounded-md hover:bg-[#90ee90] transition flex items-center gap-2"
            disabled={isUploading}
          >
            {isUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />} 写真を追加
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
                photo.isPrimary ? 'ring-2 ring-[#66cdaa]' : ''
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `写真`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {editable && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setPrimaryPhoto(photo.id)}
                      className={`p-2 rounded-full ${photo.isPrimary ? 'bg-[#66cdaa] text-white' : 'bg-white/70 text-gray-800 hover:bg-[#66cdaa] hover:text-white'}`}
                      title="プロフィール写真に設定"
                    >
                      <FaStar size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(photo.id)}
                      className="p-2 rounded-full bg-white/70 text-gray-800 hover:bg-red-500 hover:text-white"
                      title="削除"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={photo.caption || ''}
                    onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                    onBlur={handleCaptionBlur}
                    placeholder="キャプションを追加"
                    className="w-full p-2 bg-white/70 text-sm rounded outline-none focus:ring-2 focus:ring-[#66cdaa]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FaImage className="text-gray-400 text-4xl mb-3" />
          <p className="text-gray-500 text-center">写真がありません</p>
          {editable && (
            <p className="text-gray-400 text-sm text-center mt-2">「写真を追加」ボタンをクリックして写真をアップロードしてください</p>
          )}
        </div>
      )}
      
      {/* アップロードモーダル */}
      <AnimatePresence>
        {uploadOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => !isUploading && setUploadOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">写真をアップロード</h3>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition cursor-pointer ${
                  isDragActive ? 'border-[#66cdaa] bg-[#66cdaa]/10' : 'border-gray-300 hover:border-[#66cdaa]'
                }`}
              >
                <input {...getInputProps()} />
                <FaImage className="mx-auto text-3xl text-gray-400 mb-3" />
                
                {isUploading ? (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-[#66cdaa] h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">アップロード中... {uploadProgress}%</p>
                  </div>
                ) : isDragActive ? (
                  <p className="text-[#66cdaa]">ファイルをドロップしてアップロード</p>
                ) : (
                  <>
                    <p className="text-gray-500">クリックまたはファイルをドラッグ&ドロップしてアップロード</p>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG, GIF, WEBP形式がサポートされています</p>
                    <p className="text-xs text-gray-400">最大10MBまで、{maxPhotoCount - items.length}枚まで追加可能</p>
                  </>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => !isUploading && setUploadOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={isUploading}
                >
                  キャンセル
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
