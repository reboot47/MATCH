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
      toast.error('アップロードするファイルを選択してください');
      return;
    }
    
    if (items.length + files.length > maxMediaCount) {
      console.log(`Max media count exceeded: current=${items.length}, new=${files.length}, max=${maxMediaCount}`);
      toast.error(`メディアは最大${maxMediaCount}個までアップロードできます`);
      return;
    }
    
    // 有効なファイルをフィルタリング
    const validFiles: { file: File; type: 'image' | 'video' }[] = [];
    
    for (const file of files) {
      // ファイルタイプをチェック
      if (file.type.startsWith('image/')) {
        // 画像サイズをチェック (10MB以下)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`画像${file.name}のサイズが大きすぎます。10MB以下にしてください。`);
          continue;
        }
        validFiles.push({ file, type: 'image' });
      } else if (file.type.startsWith('video/')) {
        // 動画サイズをチェック (50MB以下)
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`動画${file.name}のサイズが大きすぎます。50MB以下にしてください。`);
          continue;
        }
        validFiles.push({ file, type: 'video' });
      } else {
        toast.error(`${file.name}は対応していないファイル形式です。画像または動画をアップロードしてください。`);
      }
    }
    
    if (validFiles.length === 0) {
      toast.error('アップロードできるファイルがありません');
      return;
    }
    
    try {
      setIsLoading(true);
      setUploadProgress(5); // 初期進捗状況
      
      // FormDataの作成
      const formData = new FormData();
      validFiles.forEach(({ file, type }, index) => {
        console.log(`Adding file ${index} to FormData:`, file.name, file.type, file.size);
        formData.append(`file${index}`, file);
        formData.append(`type${index}`, type);
      });
      
      // アップロード中のメッセージ
      const toastId = toast.loading(`${validFiles.length}件のメディアをアップロード中...`);
      
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
      
      // API呼び出し
      console.log('Calling API endpoint: /api/profile/media');
      const response = await axios.post('/api/profile/media', formData, uploadProgress);
      console.log('API response:', response.data);
      
      if (response.data.success) {
        setUploadProgress(100);
        
        // デバッグモードのチェック
        if (response.data.debugMode) {
          toast.success('デバッグモード: サンプルメディアを表示します', {
            id: toastId
          });
          // サンプルのメディアデータを使用
          const newItems = [...items, ...response.data.mediaItems];
          setItems(newItems);
          setUploadOpen(false);
          return;
        }
        
        // アップロードされたアイテムを追加
        const newItems = [...items, ...response.data.mediaItems];
        setItems(newItems);
        setUploadOpen(false);
        toast.success(`${validFiles.length}件のメディアをアップロードしました`, {
          id: toastId
        });
        
        // 親コンポーネントに更新を通知
        if (onUpdate) {
          await onUpdate(newItems);
        }
      } else {
        console.error('API returned error:', response.data.error);
        toast.error(response.data.error || 'メディアのアップロードに失敗しました', {
          id: toastId
        });
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
      
      // エラーの詳細情報を表示
      if (axios.isAxiosError(error) && error.response) {
        // サーバーからのレスポンスがある場合
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        toast.error(`アップロードエラー: ${error.response.data.error || error.message}`);
      } else if (axios.isAxiosError(error) && error.request) {
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

  // アップロードのモックで成功をシミュレート
  const mockSuccessfulUpload = async (files) => {
    if (isDemo) {
      setIsLoading(true);
      setUploadProgress(10);
      
      // 進捗状況の模擬
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 150);
      
      // 新しいメディアアイテムを作成
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const newItems = [...items];
      
      files.forEach((file, index) => {
        const isImage = file.type.startsWith('image/');
        const newId = `mock-${Date.now()}-${index}`;
        
        if (isImage) {
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const newItem = {
              id: newId,
              url: e.target.result,
              type: 'image',
              caption: `アップロードした画像 ${items.length + index + 1}`,
              isPrimary: items.length === 0,
              publicId: newId
            };
            
            newItems.push(newItem);
            
            // 最後のファイルの処理が完了したら状態を更新
            if (index === files.length - 1) {
              setItems(newItems);
              setIsLoading(false);
              setUploadProgress(0);
              toast.success('メディアをアップロードしました（デモモード）');
            }
          };
          fileReader.readAsDataURL(file);
        } else {
          // 動画の場合はモックデータを使用
          const newItem = {
            id: newId,
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            type: 'video',
            caption: `アップロードした動画 ${items.length + index + 1}`,
            isPrimary: false,
            thumbnail: "https://peach.blender.org/wp-content/uploads/bbb-splash.png",
            publicId: newId
          };
          
          newItems.push(newItem);
          
          // 最後のファイルの処理が完了したら状態を更新
          if (index === files.length - 1) {
            setItems(newItems);
            setIsLoading(false);
            setUploadProgress(0);
            toast.success('メディアをアップロードしました（デモモード）');
          }
        }
      });
      
      return true;
    }
    
    return false; // デモモードでない場合は実際のアップロード処理へ
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

  // 変更: Dropzoneの実装を改善
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleMediaUpload(acceptedFiles);
  }, [items, maxMediaCount]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg', '.mov']
    },
    maxFiles: maxMediaCount - items.length,
    disabled: isLoading
  });

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">メディアギャラリー</h3>
        {editable && (
          <button
            onClick={() => setUploadOpen(true)}
            disabled={isLoading || loading || items.length >= maxMediaCount}
            className={`px-4 py-2 rounded-lg flex items-center ${
              isLoading || loading || items.length >= maxMediaCount
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            } transition-colors`}
          >
            <FaUpload className="mr-2" /> 
            アップロード
          </button>
        )}
      </div>

      {/* アップロード制限の警告 */}
      {items.length >= maxMediaCount && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <FaExclamationTriangle className="inline-block mr-2" />
          メディアのアップロード上限（{maxMediaCount}個）に達しています。新しいメディアをアップロードするには、既存のメディアを削除してください。
        </div>
      )}

      {/* メディア数が0の場合のプレースホルダー */}
      {items.length === 0 && !isLoading && !loading && (
        <div className="text-center py-8 px-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-6">
          <FaImage className="mx-auto text-gray-400 text-4xl mb-3" />
          <h4 className="text-gray-800 font-medium mb-2">まだメディアがありません</h4>
          <p className="text-gray-600 text-sm mb-4">
            写真や動画をアップロードして、あなたのプロフィールを充実させましょう。
            マッチング率を上げるためには、高品質な写真を追加することをおすすめします。
          </p>
          {editable && (
            <button
              onClick={() => setUploadOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors"
            >
              <FaUpload className="mr-2" /> 写真・動画をアップロード
            </button>
          )}
        </div>
      )}
      
      {/* メディアアイテムのグリッド表示 */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`relative group rounded-lg overflow-hidden shadow-sm border border-gray-200
                ${item.isPrimary ? 'ring-2 ring-teal-600' : ''}
                ${draggedItem === item ? 'opacity-50' : 'opacity-100'}
              `}
              draggable={editable}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e)}
              onDragLeave={(e) => handleDragLeave(e)}
              onDrop={(e) => handleDrop(e, item)}
              onDragEnd={() => setDraggedItem(null)}
              style={{ aspectRatio: '1/1', height: 'auto' }}
            >
              {/* メディアコンテンツ（画像または動画） */}
              {item.type === 'image' ? (
                <div className="w-full h-full">
                  <img
                    src={item.url}
                    alt={item.caption || `メディア ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-full relative cursor-pointer"
                  onClick={() => handleVideoClick(item)}
                  onMouseEnter={() => setHoveredVideoId(item.id)}
                  onMouseLeave={() => setHoveredVideoId(null)}
                >
                  <img
                    src={item.thumbnail || '/video-thumbnail-placeholder.jpg'}
                    alt={item.caption || `動画 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <FaPlayCircle className="text-white text-4xl" />
                  </div>
                </div>
              )}
              
              {/* プライマリーバッジ */}
              {item.isPrimary && (
                <div className="absolute top-2 right-2 bg-teal-600 text-white rounded-full px-2 py-1 text-xs">
                  メイン
                </div>
              )}

              {/* アクションオーバーレイ（編集モード時のみ表示） */}
              {editable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {!item.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(item.id)}
                      className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full"
                      title="メインに設定"
                    >
                      <FaStar />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
                    title="削除"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {/* アップロードボタンをグリッド内に表示（スペースがある場合） */}
          {editable && items.length < maxMediaCount && (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 transition-colors cursor-pointer
                ${isDragActive ? 'border-[#66cdaa] bg-[#66cdaa]/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
              `}
              style={{ aspectRatio: '1/1', height: 'auto' }}
            >
              <input {...getInputProps()} disabled={isLoading} />
              {isLoading ? (
                <FaSpinner className="mx-auto text-3xl text-[#66cdaa] mb-3 animate-spin" />
              ) : isDragActive ? (
                <FaUpload className="mx-auto text-3xl text-[#66cdaa] mb-3" />
              ) : (
                <div className="flex justify-center gap-4 mb-3">
                  <FaImage className="text-3xl text-gray-400" />
                  <FaVideo className="text-3xl text-gray-400" />
                </div>
              )}
              
              {isLoading ? (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#66cdaa] h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">アップロード中... {uploadProgress}%</p>
                </div>
              ) : isDragActive ? (
                <p className="text-[#66cdaa]">ファイルをドロップしてアップロード</p>
              ) : (
                <>
                  <p className="text-gray-500">クリックまたはファイルをドラッグ&ドロップしてアップロード</p>
                  <p className="text-xs text-gray-400 mt-2">画像: JPG, PNG, GIF, WEBP (最大10MB)</p>
                  <p className="text-xs text-gray-400">動画: MP4, WebM, Ogg, MOV (最大50MB)</p>
                  <p className="text-xs text-gray-400">あと{maxMediaCount - items.length}件アップロード可能</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* ローディングインジケーター */}
      {(isLoading || loading) && (
        <div className="flex flex-col items-center justify-center py-6">
          {uploadProgress > 0 ? (
            <div className="w-full max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">アップロード中...</span>
                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <FaSpinner className="animate-spin text-teal-600 text-2xl mb-2" />
              <p className="text-gray-700">読み込み中...</p>
            </>
          )}
        </div>
      )}

      {/* ビデオプレイヤーモーダル */}
      {isVideoModalOpen && selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => {
            setIsVideoModalOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}
      
      {/* アップロードモーダル */}
      {uploadOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !isLoading && setUploadOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">メディアをアップロード</h3>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition cursor-pointer ${
                isDragActive ? 'border-[#66cdaa] bg-[#66cdaa]/10' : 'border-gray-300 hover:border-[#66cdaa]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} disabled={isLoading} />
              {isLoading ? (
                <FaSpinner className="mx-auto text-3xl text-[#66cdaa] mb-3 animate-spin" />
              ) : isDragActive ? (
                <FaUpload className="mx-auto text-3xl text-[#66cdaa] mb-3" />
              ) : (
                <div className="flex justify-center gap-4 mb-3">
                  <FaImage className="text-3xl text-gray-400" />
                  <FaVideo className="text-3xl text-gray-400" />
                </div>
              )}
              
              {isLoading ? (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#66cdaa] h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">アップロード中... {uploadProgress}%</p>
                </div>
              ) : isDragActive ? (
                <p className="text-[#66cdaa]">ファイルをドロップしてアップロード</p>
              ) : (
                <>
                  <p className="text-gray-500">クリックまたはファイルをドラッグ&ドロップしてアップロード</p>
                  <p className="text-xs text-gray-400 mt-2">画像: JPG, PNG, GIF, WEBP (最大10MB)</p>
                  <p className="text-xs text-gray-400">動画: MP4, WebM, Ogg, MOV (最大50MB)</p>
                  <p className="text-xs text-gray-400">あと{maxMediaCount - items.length}件アップロード可能</p>
                </>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => !isLoading && setUploadOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition"
                disabled={isLoading}
              >
                キャンセル
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
