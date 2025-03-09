"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaVideo, FaInfoCircle, FaTimes, FaCheck, FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import MediaGallery from './MediaGallery';
import axios from 'axios';

// MediaItemの型定義
interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  isPrimary?: boolean;
  thumbnail?: string;
  publicId?: string;
  sortOrder?: number;
}

interface MediaUploadSectionProps {
  mediaItems: MediaItem[];
  onMediaUpdate: (items: MediaItem[]) => void;
  isLoading?: boolean;
  maxMediaCount?: number;
  userName?: string;
}

export default function MediaUploadSection({
  mediaItems,
  onMediaUpdate,
  isLoading = false,
  maxMediaCount = 9,
  userName = ''
}: MediaUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // メディアアップロード処理
  const onDrop = async (acceptedFiles: File[]) => {
    // 最大数チェック
    if (mediaItems.length + acceptedFiles.length > maxMediaCount) {
      toast.error(`メディアは最大${maxMediaCount}個までアップロードできます`);
      return;
    }

    // ファイルサイズチェック (10MB)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error('10MB以上のファイルはアップロードできません');
      return;
    }

    setIsUploading(true);
    const uploadPromises = acceptedFiles.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type.startsWith('video/') ? 'video' : 'image');

        const response = await axios.post('/api/profile/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            // アップロード進捗処理が必要な場合はここに実装
          },
        });

        return response.data;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const newMediaItems = [...mediaItems, ...results];
      
      // メディア情報を更新
      onMediaUpdate(newMediaItems);
      
      toast.success(`${results.length}個のメディアをアップロードしました`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('メディアのアップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  // ドロップゾーン設定
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.webm']
    },
    disabled: isUploading || isLoading || mediaItems.length >= maxMediaCount,
    maxFiles: maxMediaCount - mediaItems.length,
  });

  // メディア更新処理
  const handleMediaUpdate = async (updatedItems: MediaItem[]) => {
    try {
      onMediaUpdate(updatedItems);
      return true;
    } catch (error) {
      console.error('Error updating media:', error);
      toast.error('メディアの更新に失敗しました');
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">メディア</h3>
          <button 
            onClick={() => setShowTips(!showTips)}
            className="ml-2 text-gray-500 hover:text-teal-500 transition-colors"
            aria-label="メディアアップロードのヒントを表示"
          >
            <FaInfoCircle />
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {mediaItems.length}/{maxMediaCount}
        </span>
      </div>

      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium mb-2">メディアアップロードのヒント</h4>
              <button 
                onClick={() => setShowTips(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>最初の写真がプロフィールのメイン画像として使用されます</li>
              <li>写真や動画は10MB以下にしてください</li>
              <li>最大{maxMediaCount}個のメディアをアップロードできます</li>
              <li>写真はドラッグ＆ドロップで並べ替え可能です</li>
              <li>高画質の写真が効果的です</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* メディアギャラリー */}
      <MediaGallery 
        mediaItems={mediaItems} 
        editable={true}
        onUpdate={handleMediaUpdate}
        maxMediaCount={maxMediaCount}
        loading={isLoading}
        userName={userName}
      />
    </div>
  );
}
