"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaImage, FaTrash, FaStar, FaUpload, FaVideo, FaPlayCircle, FaPause } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

// メディアアイテムのインターフェース
interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  isPrimary?: boolean;
  thumbnail?: string; // ビデオのサムネイル画像URL
}

interface MediaGalleryProps {
  mediaItems: MediaItem[];
  editable: boolean;
  onUpdate?: (items: MediaItem[]) => Promise<boolean>;
  maxMediaCount?: number; // 最大アップロード可能なメディア数
}

export default function MediaGallery({ 
  mediaItems, 
  editable, 
  onUpdate, 
  maxMediaCount = 9 
}: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>(mediaItems);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<MediaItem | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});

  // 変更を保存
  const saveChanges = async (newItems: MediaItem[]) => {
    setItems(newItems);
    
    if (onUpdate) {
      try {
        await onUpdate(newItems);
      } catch (error) {
        console.error('Error updating media items:', error);
        toast.error('メディアの更新に失敗しました');
      }
    }
  };

  // メディアを並べ替え
  const handleDragStart = (item: MediaItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: MediaItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);
    
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    // APIを呼び出して順序を保存
    saveMediaOrder(items);
  };

  // メディア順序を保存
  const saveMediaOrder = async (orderedItems: MediaItem[]) => {
    try {
      await saveChanges(orderedItems);
      toast.success('メディアの並び順を保存しました');
    } catch (error) {
      console.error('Error saving media order:', error);
      toast.error('メディアの並び順の保存に失敗しました');
    }
  };

  // メディアの削除
  const handleDelete = (itemId: string) => {
    if (confirm('このメディアを削除してもよろしいですか？')) {
      const newItems = items.filter(item => item.id !== itemId);
      saveChanges(newItems);
      toast.success('メディアを削除しました');
    }
  };

  // キャプションの変更
  const handleCaptionChange = (itemId: string, caption: string) => {
    const newItems = items.map(item => 
      item.id === itemId ? { ...item, caption } : item
    );
    setItems(newItems); // リアルタイムで更新（APIは呼ばない）
  };

  // キャプション編集完了時に保存
  const handleCaptionBlur = () => {
    saveChanges(items);
  };

  // プライマリメディアの設定
  const setPrimaryMedia = (itemId: string) => {
    const newItems = items.map(item => ({
      ...item,
      isPrimary: item.id === itemId
    }));
    saveChanges(newItems);
    toast.success('プロフィールメディアを設定しました');
  };

  // ビデオ再生の制御
  const toggleVideoPlay = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    if (!videoElement) return;
    
    if (playingVideo === videoId) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // 他のビデオが再生中なら停止
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }
      
      videoElement.play();
      setPlayingVideo(videoId);
    }
  };

  // ファイルドロップゾーン設定
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: maxMediaCount - items.length > 0 ? maxMediaCount - items.length : 1,
    onDrop: (acceptedFiles) => {
      handleMediaUpload(acceptedFiles);
    }
  });

  // メディアのアップロード（モック）
  const handleMediaUpload = (files: File[]) => {
    if (items.length + files.length > maxMediaCount) {
      toast.error(`メディアは最大${maxMediaCount}個までアップロードできます`);
      return;
    }

    // 実際のアプリではここでファイルアップロードのAPIを呼び出します
    // ここではモックデータを生成します
    const newMediaItems: MediaItem[] = files.map((file, index) => {
      const isVideo = file.type.startsWith('video/');
      const id = `temp-${Date.now()}-${index}`;
      
      // 実際のアプリではアップロード後のURLを使います
      const fileUrl = isVideo 
        ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        : URL.createObjectURL(file);
      
      return {
        id,
        url: fileUrl,
        type: isVideo ? 'video' : 'image',
        caption: file.name,
        isPrimary: items.length === 0,
        thumbnail: isVideo ? "https://peach.blender.org/wp-content/uploads/bbb-splash.png" : undefined
      };
    });

    const updatedItems = [...items, ...newMediaItems];
    saveChanges(updatedItems);
    toast.success(`${files.length}個のメディアをアップロードしました`);
    setUploadOpen(false);
  };
  
  // アップロードモーダル
  const UploadModal = ({ open }: { open: boolean }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">メディアをアップロード</h3>
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition cursor-pointer"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-2">
                <FaImage className="text-pink-500 text-2xl" />
                <FaVideo className="text-pink-500 text-2xl" />
              </div>
              <p className="text-gray-600">
                クリックまたはドラッグ＆ドロップで写真・動画をアップロード
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, GIF, MP4, WebM, Ogg形式がサポートされています
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setUploadOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    );
  };

  // メディアアイテムのレンダリング
  const renderMediaItem = (item: MediaItem) => {
    return (
      <div
        key={item.id}
        draggable={editable}
        onDragStart={() => handleDragStart(item)}
        onDragOver={(e) => handleDragOver(e, item)}
        onDragEnd={handleDragEnd}
        className={`relative aspect-square rounded-lg overflow-hidden group ${
          draggedItem?.id === item.id ? 'opacity-50' : 'opacity-100'
        } ${
          item.isPrimary ? 'ring-2 ring-pink-500' : ''
        }`}
      >
        {item.type === 'image' ? (
          <Image
            src={item.url}
            alt={item.caption || `写真`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.caption || "ビデオのサムネイル"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <FaVideo className="text-gray-400 text-4xl" />
                </div>
              )}
              <button 
                onClick={() => toggleVideoPlay(item.id)}
                className="absolute z-10 text-white text-4xl hover:text-pink-500 transition"
              >
                {playingVideo === item.id ? <FaPause /> : <FaPlayCircle />}
              </button>
            </div>
            <video 
              ref={el => videoRefs.current[item.id] = el}
              src={item.url}
              className="hidden"
              onEnded={() => setPlayingVideo(null)}
            />
          </>
        )}
        
        {editable && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPrimaryMedia(item.id)}
                className={`p-2 rounded-full ${
                  item.isPrimary 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white/80 text-gray-800 hover:bg-pink-500 hover:text-white'
                } transition`}
                title="プロフィールに設定"
              >
                <FaStar size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-red-500 hover:text-white transition"
                title="削除"
              >
                <FaTrash size={14} />
              </button>
            </div>
            
            <div className="w-full">
              <input
                type="text"
                defaultValue={item.caption || ''}
                onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                onBlur={handleCaptionBlur}
                placeholder="キャプションを追加"
                className="w-full bg-white/80 p-2 text-sm rounded-md"
              />
            </div>
          </div>
        )}
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
        <h2 className="text-xl font-bold">メディアギャラリー</h2>
        {editable && (
          <button
            onClick={() => setUploadOpen(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition flex items-center gap-2"
            disabled={items.length >= maxMediaCount}
          >
            <FaUpload /> メディアを追加
          </button>
        )}
      </div>
      
      <p className="text-gray-500 mb-4 text-sm">
        写真や動画をアップロードして、あなたの魅力をアピールしましょう。
        {editable && `（最大${maxMediaCount}個）`}
      </p>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(renderMediaItem)}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaImage className="text-gray-300 text-4xl mx-auto mb-4" />
          <p className="text-gray-500">まだメディアがありません</p>
          {editable && (
            <button
              onClick={() => setUploadOpen(true)}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
            >
              メディアをアップロード
            </button>
          )}
        </div>
      )}
      
      <UploadModal open={uploadOpen} />
    </motion.div>
  );
}
