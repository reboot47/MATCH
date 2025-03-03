"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaImage, FaTrash, FaStar, FaUpload, FaVideo, FaPlayCircle, FaPause, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

// VideoPlayerModal コンポーネントをインポート
import VideoPlayerModal from './VideoPlayerModal';

// メディアアイテムのインターフェース
interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  isPrimary?: boolean;
  thumbnail?: string; // ビデオのサムネイル画像URL
  publicId?: string;  // Cloudinaryの公開ID
  sortOrder?: number; // 表示順序
}

interface MediaGalleryProps {
  mediaItems: MediaItem[];
  editable: boolean;
  onUpdate?: (items: MediaItem[]) => Promise<boolean>;
  maxMediaCount?: number; // 最大アップロード可能なメディア数
  loading?: boolean; // 外部からのローディング状態
  userName?: string; // ユーザー名
  userImage?: string; // ユーザープロフィール画像
  isDemo?: boolean; // デモモード
}

export default function MediaGallery({ 
  mediaItems, 
  editable, 
  onUpdate, 
  maxMediaCount = 9,
  loading = false,
  userName = "",
  userImage = "",
  isDemo = false
}: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>(mediaItems);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<MediaItem | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});

  // ホバー状態と動画モーダル用のステート
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // モバイルデバイスの検出
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // 外部のメディアアイテムが更新されたら内部状態も更新
  useEffect(() => {
    setItems(mediaItems);
  }, [mediaItems]);

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
    } else {
      // APIを使用してメディアを更新
      try {
        setIsLoading(true);
        const response = await axios.put('/api/profile/media', {
          mediaItems: newItems
        });
        
        if (response.data.success) {
          toast.success('メディア情報を更新しました');
        } else {
          toast.error('メディアの更新に失敗しました');
        }
      } catch (error) {
        console.error('メディア更新API呼び出しエラー:', error);
        toast.error('メディアの更新に失敗しました');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // メディアのアップロード処理
  const handleMediaUpload = async (files: File[]) => {
    console.log('handleMediaUpload called with files:', files);
    
    if (files.length === 0) {
      console.log('No files to upload');
      return;
    }
    
    if (items.length + files.length > maxMediaCount) {
      console.log(`Max media count exceeded: current=${items.length}, new=${files.length}, max=${maxMediaCount}`);
      toast.error(`メディアは最大${maxMediaCount}個までアップロードできます`);
      return;
    }
    
    // FormDataの作成
    const formData = new FormData();
    files.forEach((file, index) => {
      console.log(`Adding file ${index} to FormData:`, file.name, file.type, file.size);
      formData.append(`file${index}`, file);
      formData.append(`type${index}`, file.type.startsWith('video/') ? 'video' : 'image');
    });
    
    try {
      setIsLoading(true);
      setUploadProgress(10); // 初期進捗状況
      console.log('Starting upload to API...');
      
      // プログレスイベントの設定
      const uploadProgress = {
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 90) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
          setUploadProgress(percentCompleted);
        }
      };
      
      // API呼び出し前にデバッグエンドポイントをチェック
      try {
        console.log('Checking Cloudinary configuration...');
        const debugResponse = await axios.get('/api/profile/media/debug');
        console.log('Cloudinary debug info:', debugResponse.data);
      } catch (debugError) {
        console.error('Cloudinaryデバッグエラー:', debugError);
      }
      
      // API呼び出し
      console.log('Calling API endpoint: /api/profile/media');
      const response = await axios.post('/api/profile/media', formData, uploadProgress);
      console.log('API response:', response.data);
      
      if (response.data.success) {
        setUploadProgress(100);
        
        // アップロードされたアイテムを追加
        const newItems = [...items, ...response.data.mediaItems];
        setItems(newItems);
        setUploadOpen(false);
        toast.success('メディアをアップロードしました');
      } else {
        console.error('API returned error:', response.data.error);
        toast.error(response.data.error || 'メディアのアップロードに失敗しました');
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
      // エラーの詳細情報を表示
      if (error.response) {
        // サーバーからのレスポンスがある場合
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        toast.error(`アップロードエラー: ${error.response.data.error || error.message}`);
      } else if (error.request) {
        // リクエストは送信されたがレスポンスがない場合
        console.error('Error request:', error.request);
        toast.error('サーバーからの応答がありません。ネットワーク接続を確認してください。');
      } else {
        // リクエスト設定中にエラーが発生した場合
        console.error('Error message:', error.message);
        toast.error(`エラー: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // メディアの削除
  const handleDelete = async (itemId: string) => {
    try {
      setIsLoading(true);
      
      // API呼び出し
      const response = await axios.delete(`/api/profile/media?id=${itemId}`);
      
      if (response.data.success) {
        // 削除成功したら、ローカルの状態も更新
        const newItems = items.filter(item => item.id !== itemId);
        setItems(newItems);
        toast.success('メディアを削除しました');
      } else {
        toast.error('メディアの削除に失敗しました');
      }
    } catch (error) {
      console.error('メディア削除エラー:', error);
      toast.error('メディアの削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドラッグアンドドロップによる並べ替え
  const handleDragStart = (item: MediaItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: MediaItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetItem.id);
    
    if (draggedIndex !== targetIndex) {
      const newItems = [...items];
      newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      
      // 順序番号の更新
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        sortOrder: index
      }));
      
      setItems(updatedItems);
    }
  };

  const handleDragEnd = () => {
    if (draggedItem) {
      saveChanges(items);
      setDraggedItem(null);
    }
  };

  // キャプションの編集
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

  // ビデオのホバー時の自動再生
  const handleVideoHover = (videoId: string, isHovering: boolean) => {
    const videoElement = videoRefs.current[videoId];
    if (!videoElement) return;
    
    if (isHovering) {
      setHoveredVideoId(videoId);
      videoElement.muted = true;
      videoElement.play().catch(() => {
        // 自動再生がブロックされた場合は無視
      });
    } else {
      setHoveredVideoId(null);
      if (playingVideo !== videoId) { // 明示的に再生されていなければ停止
        videoElement.pause();
      }
    }
  };
  
  // モバイル用のタッチイベント処理
  const handleTouchStart = (videoId: string) => {
    if (isMobile) {
      handleVideoHover(videoId, true);
    }
  };
  
  const handleTouchEnd = (videoId: string) => {
    if (isMobile) {
      // モバイルでは短いタップでビデオモーダルを開かないようにする
      // 代わりに少し長押しで自動再生を停止する
      setTimeout(() => {
        handleVideoHover(videoId, false);
      }, 300);
    }
  };

  // ビデオモーダルを開く
  const openVideoModal = (item: MediaItem) => {
    setSelectedVideo(item);
    setIsVideoModalOpen(true);
  };

  // ファイルドロップゾーン設定
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: maxMediaCount - items.length > 0 ? maxMediaCount - items.length : 1,
    onDrop: (acceptedFiles) => {
      console.log('Files dropped:', acceptedFiles);
      handleMediaUpload(acceptedFiles);
    },
    onDragEnter: () => {
      console.log('Drag enter event triggered');
    },
    onDragOver: () => {
      console.log('Drag over event triggered');
    },
    onDropRejected: (fileRejections) => {
      console.log('Files rejected:', fileRejections);
    },
    noClick: true, // クリックによるファイル選択ダイアログを無効化（カスタムボタンを使用）
    noKeyboard: true, // キーボードナビゲーションを無効化
    preventDropOnDocument: true, // ドキュメント全体へのドロップを防止
    useFsAccessApi: false // macOSでのFileSystem Access APIを無効化（一部ブラウザの互換性問題を回避）
  });

  // アップロードモーダル
  const UploadModal = ({ open }: { open: boolean }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold mb-4">メディアをアップロード</h3>
          
          {isLoading ? (
            <div className="py-12 flex flex-col items-center">
              <FaSpinner className="text-[#66cdaa] text-4xl animate-spin mb-4" />
              <p className="text-gray-600 mb-2">アップロード中... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#66cdaa] h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div 
              {...getRootProps()} 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-[#66cdaa] transition min-h-[200px] relative z-[60]"
              style={{ touchAction: 'none' }} // モバイルデバイスでのタッチイベントを制御
            >
              <input {...getInputProps()} />
              <div className="flex space-x-4 mb-4">
                <FaImage className="text-[#66cdaa] text-2xl" />
                <FaVideo className="text-[#66cdaa] text-2xl" />
              </div>
              <p className="text-gray-600">
                クリックまたはドラッグ＆ドロップで写真・動画をアップロード
              </p>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, GIF, MP4, WebM, Ogg形式がサポートされています
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // イベントの伝播を停止
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*,video/*';
                  input.onchange = (event) => {
                    // @ts-ignore
                    const files = event.target.files;
                    if (files && files.length > 0) {
                      const fileArray = Array.from(files);
                      console.log('Files selected:', fileArray);
                      handleMediaUpload(fileArray);
                    }
                  };
                  input.click();
                }}
                className="mt-4 px-4 py-2 bg-[#66cdaa] text-white rounded-md hover:bg-[#90ee90] transition"
              >
                ファイルを選択
              </button>
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => {
                setUploadOpen(false);
                setUploadProgress(0);
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
              disabled={isLoading}
            >
              {isLoading ? 'アップロード中...' : 'キャンセル'}
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
        onMouseEnter={() => item.type === 'video' && !isMobile && handleVideoHover(item.id, true)}
        onMouseLeave={() => item.type === 'video' && !isMobile && handleVideoHover(item.id, false)}
        onTouchStart={() => item.type === 'video' && handleTouchStart(item.id)}
        onTouchEnd={() => item.type === 'video' && handleTouchEnd(item.id)}
        className={`relative aspect-square rounded-lg overflow-hidden group ${
          draggedItem?.id === item.id ? 'opacity-50' : 'opacity-100'
        } ${
          item.isPrimary ? 'ring-2 ring-[#66cdaa]' : ''
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
                onClick={() => openVideoModal(item)}
                className="absolute z-10 text-white text-4xl hover:text-[#66cdaa] transition-all transform hover:scale-110"
              >
                {playingVideo === item.id ? <FaPause /> : <FaPlayCircle />}
              </button>
            </div>
            <video 
              ref={el => videoRefs.current[item.id] = el}
              src={item.url}
              className={`absolute inset-0 object-cover w-full h-full ${hoveredVideoId === item.id ? 'opacity-100' : 'opacity-0'}`}
              onEnded={() => setPlayingVideo(null)}
              playsInline
              muted
              loop
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
                    ? 'bg-[#66cdaa] text-white' 
                    : 'bg-white/80 text-gray-800 hover:bg-[#66cdaa] hover:text-white'
                } transition`}
                title="プロフィールに設定"
                disabled={isLoading}
              >
                <FaStar size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-red-500 hover:text-white transition"
                title="削除"
                disabled={isLoading}
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
                disabled={isLoading}
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
      className="bg-white rounded-xl shadow-sm p-6 relative"
    >
      {(isLoading || loading) && !uploadOpen && (
        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl">
          <FaSpinner className="text-[#66cdaa] text-4xl animate-spin" />
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">メディアギャラリー</h2>
        {editable && (
          <button
            onClick={() => setUploadOpen(true)}
            className="bg-[#66cdaa] text-white px-4 py-2 rounded-md hover:bg-[#90ee90] transition flex items-center gap-2"
            disabled={items.length >= maxMediaCount || isLoading}
          >
            <FaUpload /> メディアを追加
          </button>
        )}
      </div>
      
      <p className="text-gray-500 mb-4 text-sm">
        写真や動画をアップロードして、あなたの魅力をアピールしましょう。
        {editable && `（最大${maxMediaCount}個）`}
      </p>
      
      {/* デモモード通知 */}
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-yellow-700 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            APIからのデータ取得に失敗したため、デモデータを表示しています。ログインしているか確認してください。
          </p>
        </div>
      )}
      
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
              className="mt-4 px-4 py-2 bg-[#66cdaa] text-white rounded-md hover:bg-[#90ee90] transition"
              disabled={isLoading}
            >
              メディアをアップロード
            </button>
          )}
        </div>
      )}
      
      <UploadModal open={uploadOpen} />
      
      {/* ビデオプレーヤーモーダル */}
      <VideoPlayerModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={selectedVideo?.url || ''}
        caption={selectedVideo?.caption}
        thumbnail={selectedVideo?.thumbnail}
        userName={userName}
        userImage={userImage}
      />
    </motion.div>
  );
}
