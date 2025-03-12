"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiCheck, FiUpload, FiPlay, FiPause } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function NewAppealVideoPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // 利用可能なタグオプション
  const tagOptions = [
    '趣味', '料理', '旅行', '仕事', 'スポーツ', '音楽', 
    '映画', 'ペット', '読書', 'アート', 'ファッション', '自己紹介'
  ];
  
  // ファイル選択処理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // 動画ファイルのみ受け付ける
    if (!file.type.includes('video/')) {
      toast.error('動画ファイルを選択してください');
      return;
    }
    
    // ファイルサイズチェック (50MB以下)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('動画サイズは50MB以下にしてください');
      return;
    }
    
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };
  
  // ファイル選択ダイアログを開く
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 動画再生・一時停止の切り替え
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // 動画メタデータ読み込み時
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(Math.floor(videoRef.current.duration));
    }
  };
  
  // タグの選択状態を切り替える
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      // 最大5つまで選択可能
      if (tags.length >= 5) {
        toast.error('タグは最大5つまで選択できます');
        return;
      }
      setTags([...tags, tag]);
    }
  };
  
  // 動画をアップロード
  const handleUpload = async () => {
    if (!videoFile) {
      toast.error('動画ファイルを選択してください');
      return;
    }
    
    if (!title.trim()) {
      toast.error('タイトルを入力してください');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // 実際の実装ではここでAPIを呼び出してアップロード処理を行う
      // モックとして遅延のみ実装
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('アピール動画をアップロードしました');
      router.back();
    } catch (error) {
      console.error('アップロード中にエラーが発生しました:', error);
      toast.error('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };
  
  // ページトランジション設定
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
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="text-gray-500 p-1"
                disabled={isUploading}
              >
                <FiChevronLeft size={24} />
              </button>
              <h1 className="text-lg font-medium ml-2">アピール動画を追加</h1>
            </div>
            <button 
              onClick={handleUpload}
              disabled={isUploading || !videoFile || !title.trim()}
              className={`px-4 py-1.5 rounded-full text-sm flex items-center ${
                isUploading || !videoFile || !title.trim() 
                  ? 'bg-gray-300 text-gray-500' 
                  : 'bg-teal-500 text-white'
              }`}
            >
              {isUploading ? '処理中...' : (
                <>
                  <FiCheck className="mr-1" /> 投稿する
                </>
              )}
            </button>
          </div>
        </div>

        {/* 説明テキスト */}
        <div className="bg-gray-100 p-4 flex items-start">
          <div className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">?</div>
          <p className="text-sm text-gray-700">実際のあなたの魅力をもっと伝えましょう。短い動画を通して、あなたの個性を相手に知ってもらえます。</p>
        </div>

        {/* 動画アップロードエリア */}
        <div className="p-4 bg-white shadow-sm">
          <input 
            type="file" 
            accept="video/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          
          {!videoPreview ? (
            <div 
              className="border-2 border-dashed border-teal-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
              onClick={openFileDialog}
            >
              <FiUpload className="text-teal-500 mb-2" size={48} />
              <p className="text-gray-600 font-medium">動画をアップロード</p>
              <p className="text-sm text-gray-500 mt-1">クリックして動画を選択</p>
              <p className="text-xs text-gray-400 mt-2">最大50MB, 60秒まで</p>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden relative">
              <video 
                ref={videoRef}
                src={videoPreview} 
                className="w-full h-auto"
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
              
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                onClick={togglePlayPause}
              >
                {!isPlaying && (
                  <div className="w-14 h-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                    <FiPlay size={24} className="text-gray-800 ml-1" />
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                <p className="text-white text-sm">
                  {duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '0:00'}
                </p>
              </div>
              
              <div className="mt-2 flex justify-end">
                <button 
                  className="text-red-500 text-sm"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                  }}
                >
                  削除して選び直す
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* タイトルと説明 */}
        <div className="p-4 bg-white mt-2 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="動画のタイトルを入力（30文字以内）"
              maxLength={30}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明文（任意）
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="動画の説明を入力（100文字以内）"
              maxLength={100}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
        </div>
        
        {/* タグ選択 */}
        <div className="p-4 bg-white mt-2 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ（最大5つまで）
          </label>
          
          <div className="flex flex-wrap gap-2">
            {tagOptions.map(tag => (
              <div
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                  tags.includes(tag)
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        
        {/* 注意事項 */}
        <div className="p-4 bg-white mt-2 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-2">注意事項</h3>
          <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
            <li>個人情報（電話番号、メールアドレスなど）を含む動画はアップロードできません</li>
            <li>不適切な内容の動画は削除され、アカウント停止の対象となる場合があります</li>
            <li>著作権を侵害するコンテンツのアップロードは禁止されています</li>
            <li>アップロードした動画は公開対象ユーザーに表示されます</li>
          </ul>
        </div>
        
        {/* 下部の固定ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button 
            onClick={handleUpload}
            disabled={isUploading || !videoFile || !title.trim()}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
              isUploading || !videoFile || !title.trim() 
                ? 'bg-gray-300 text-gray-500' 
                : 'bg-teal-500 text-white'
            }`}
          >
            {isUploading ? '処理中...' : 'アピール動画を投稿する'}
          </button>
        </div>
        
        {/* 下部ボタン用の余白 */}
        <div className="h-20"></div>
      </motion.div>
    </AnimatePresence>
  );
}
