"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaImage, FaVideo, FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useUser } from '@/components/UserContext';

export default function CreateDiscoveryPage() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [pointsToUnlock, setPointsToUnlock] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // ファイルタイプをチェック
    if (file.type.startsWith('image/')) {
      setContentType('image');
    } else if (file.type.startsWith('video/')) {
      setContentType('video');
    } else {
      toast.error('対応していないファイル形式です。画像または動画をアップロードしてください。');
      return;
    }
    
    // ファイルサイズをチェック (10MB以下)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ファイルサイズが大きすぎます（最大10MB）');
      return;
    }
    
    // プレビュー表示
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  };
  
  // ファイル選択ダイアログを開く
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  // 投稿する
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('ログインが必要です');
      return;
    }
    
    if (!previewUrl) {
      toast.error('画像または動画を選択してください');
      return;
    }
    
    if (!description.trim()) {
      toast.error('説明文を入力してください');
      return;
    }
    
    if (isLocked && (!pointsToUnlock || pointsToUnlock < 1)) {
      toast.error('有効なポイント数を設定してください');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 実際の実装ではAPIを呼び出してアップロード処理
      // const formData = new FormData();
      // formData.append('file', fileInputRef.current?.files?.[0]);
      // formData.append('description', description);
      // formData.append('isLocked', isLocked.toString());
      // formData.append('pointsToUnlock', pointsToUnlock.toString());
      
      // const response = await fetch('/api/discovery/create', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) throw new Error('アップロードに失敗しました');
      
      // モック実装ではタイムアウトで成功を模倣
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('投稿が完了しました！');
      
      // 投稿後は一覧ページに戻る
      setTimeout(() => {
        router.push('/discovery');
      }, 1000);
    } catch (error) {
      console.error('投稿エラー:', error);
      toast.error('投稿に失敗しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      
      
      {/* ヘッダー */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between p-4">
          <button 
            className="p-2"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-center flex-1">新規投稿</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-16 px-4">
        <form onSubmit={handleSubmit}>
          {/* ファイル選択エリア */}
          <div className="mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*, video/*"
              className="hidden"
            />
            
            {!previewUrl ? (
              <div 
                className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 cursor-pointer"
                onClick={handleSelectFile}
              >
                <div className="p-4 rounded-full bg-gray-100 mb-3">
                  <FaImage className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-1">画像または動画をアップロード</p>
                <p className="text-xs text-gray-500">タップして選択</p>
              </div>
            ) : (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black">
                {contentType === 'image' ? (
                  <Image
                    src={previewUrl}
                    alt="プレビュー"
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={previewUrl}
                      className="w-full h-full object-contain"
                      controls
                    />
                  </div>
                )}
                
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <motion.button
                    type="button"
                    className="p-2 bg-black bg-opacity-50 rounded-full text-white"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSelectFile}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </motion.button>
                </div>
                
                {isLocked && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-full p-2">
                    <FaLock className="text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 説明入力 */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 mb-2">説明</label>
            <textarea
              id="description"
              placeholder="投稿の説明を入力してください..."
              className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {description.length}/500文字
            </p>
          </div>
          
          {/* ロック設定 */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaLock className="text-gray-500 mr-2" />
                <span className="text-gray-700">ポイントロック</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isLocked}
                  onChange={() => setIsLocked(!isLocked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            
            {isLocked && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  このコンテンツを閲覧するために必要なポイント数を設定します。
                  {user?.gender === '女性' && (
                    <span className="block mt-1 text-primary-500">男性ユーザーがこのコンテンツを閲覧する際にポイントを消費します</span>
                  )}
                </p>
                
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-24 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={pointsToUnlock}
                    onChange={(e) => setPointsToUnlock(Number(e.target.value))}
                    disabled={!isLocked}
                  />
                  <span className="ml-2 text-gray-600">ポイント</span>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  推奨: 画像 10〜20ポイント / 動画 20〜50ポイント
                </p>
              </div>
            )}
          </div>
          
          {/* 投稿ボタン */}
          <motion.button
            type="submit"
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium"
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                投稿中...
              </div>
            ) : (
              '投稿する'
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
