"use client";

import React, { useState, useRef } from 'react';
import { FaVideo, FaUpload, FaTrash, FaPlay } from 'react-icons/fa';
import { IntroductionVideo } from '@/app/types/profile';
import { toast } from 'react-hot-toast';

interface IntroVideoProps {
  video?: IntroductionVideo;
  onUpdate: (video: IntroductionVideo | undefined) => Promise<boolean>;
  isUpdating?: boolean;
  isViewOnly?: boolean;
}

// 自己紹介プロンプト
const VIDEO_PROMPTS = [
  '自己紹介をしてください',
  'あなたの趣味について教えてください',
  '理想のパートナーについて教えてください',
  '休日の過ごし方について教えてください',
  'あなたの長所と短所を教えてください',
  '好きな映画や音楽について教えてください'
];

export default function IntroVideo({
  video,
  onUpdate,
  isUpdating = false,
  isViewOnly = false
}: IntroVideoProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(VIDEO_PROMPTS[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(video?.url || null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // ビデオ録画を開始
  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // ストリームを停止
        const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((track) => track.stop());
        
        videoRef.current!.srcObject = null;
        videoRef.current!.src = url;
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // 30秒後に自動停止
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      console.error('録画開始エラー:', error);
      toast.error('カメラとマイクの許可が必要です');
    }
  };
  
  // ビデオ録画を停止
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // プレビュー用のサムネイル生成（実際の実装ではサーバー側で処理）
  const generateThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.currentTime = 1; // 1秒目のフレームを使用
      video.muted = true;
      
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        resolve(thumbnailUrl);
      };
      
      video.load();
    });
  };
  
  // ビデオをアップロード
  const handleUpload = async () => {
    if (!previewUrl) return;
    
    setIsUploading(true);
    
    try {
      // 実際の実装ではサーバーにアップロードする処理が必要
      // ここではモック実装
      
      // サムネイル生成
      const thumbnailUrl = await generateThumbnail(previewUrl);
      
      const mockVideo: IntroductionVideo = {
        id: `video_${Date.now()}`,
        url: previewUrl,
        thumbnailUrl,
        prompt: selectedPrompt,
        duration: videoRef.current?.duration || 0,
        createdAt: new Date(),
        // テキスト起こしとキーワードはサーバー側で生成
        transcript: '自己紹介ビデオのテキスト起こしです。実際の実装ではAIを使用して生成します。',
        keywords: ['自己紹介', '趣味', '特技']
      };
      
      const success = await onUpdate(mockVideo);
      if (success) {
        toast.success('自己紹介ビデオを保存しました');
      }
    } catch (error) {
      console.error('ビデオアップロードエラー:', error);
      toast.error('ビデオの保存に失敗しました');
    } finally {
      setIsUploading(false);
    }
  };
  
  // ビデオを削除
  const deleteVideo = async () => {
    try {
      const success = await onUpdate(undefined);
      if (success) {
        setPreviewUrl(null);
        toast.success('ビデオを削除しました');
      }
    } catch (error) {
      console.error('ビデオ削除エラー:', error);
      toast.error('ビデオの削除に失敗しました');
    }
  };
  
  // ビデオの再生/一時停止
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // ファイルアップロードハンドラー
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast.error('ビデオファイルを選択してください');
      return;
    }
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };
  
  return (
    <div className="bg-white rounded-lg">
      {/* 現在のビデオ表示 */}
      {(video || previewUrl) && !isRecording ? (
        <div className="mb-6">
          <div className="relative">
            <video
              ref={videoRef}
              src={previewUrl || video?.url}
              className="w-full rounded-lg max-h-[400px] bg-black"
              poster={video?.thumbnailUrl}
              playsInline
              onEnded={() => setIsPlaying(false)}
            />
            
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white rounded-lg"
              style={{ display: isPlaying ? 'none' : 'flex' }}
            >
              <FaPlay size={48} />
            </button>
          </div>
          
          {video?.prompt && (
            <p className="mt-3 text-sm text-gray-600">
              <span className="font-medium">プロンプト: </span>{video.prompt}
            </p>
          )}
          
          {video?.transcript && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">テキスト起こし:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {video.transcript}
              </p>
            </div>
          )}
          
          {video?.keywords && video.keywords.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">キーワード:</h4>
              <div className="flex flex-wrap gap-2">
                {video.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {!isViewOnly && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={deleteVideo}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-md flex items-center"
                disabled={isUpdating}
              >
                <FaTrash className="mr-2" size={14} /> 削除
              </button>
            </div>
          )}
        </div>
      ) : isRecording ? (
        <div className="mb-6">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full rounded-lg max-h-[400px] bg-black"
          />
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-600 text-white rounded-full flex items-center"
            >
              <FaStop className="mr-2" /> 録画停止 (最大30秒)
            </button>
          </div>
        </div>
      ) : !isViewOnly && (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-6">
          <FaVideo size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-500 mb-6">自己紹介ビデオがありません</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-teal-500 text-white rounded-md flex items-center"
              disabled={isUpdating}
            >
              <FaVideo className="mr-2" /> 録画開始
            </button>
            
            <label className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center cursor-pointer">
              <FaUpload className="mr-2" /> ファイルをアップロード
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUpdating}
              />
            </label>
          </div>
        </div>
      )}
      
      {/* 新規録画の設定 */}
      {!isRecording && !video && previewUrl && !isViewOnly && (
        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">プロンプト (質問)</label>
            <select
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isUploading}
            >
              {VIDEO_PROMPTS.map((prompt, index) => (
                <option key={index} value={prompt}>{prompt}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setPreviewUrl(null)}
              className="px-4 py-2 border rounded-md"
              disabled={isUploading}
            >
              キャンセル
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-teal-500 text-white rounded-md flex items-center disabled:opacity-50"
              disabled={isUploading || !previewUrl}
            >
              {isUploading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      )}
      
      {/* ビデオ自己紹介のヒント */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">自己紹介ビデオのヒント:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>明るく、自然な表情で話しましょう</li>
          <li>30秒以内で簡潔に伝えましょう</li>
          <li>趣味や関心事を具体的に伝えるとマッチングの確率が上がります</li>
          <li>背景や照明に気を配ると印象が良くなります</li>
        </ul>
      </div>
    </div>
  );
}
