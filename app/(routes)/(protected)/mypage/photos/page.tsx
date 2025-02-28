'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FaCamera, 
  FaSpinner, 
  FaStar, 
  FaTrash,
  FaImage,
  FaVideo
} from 'react-icons/fa';
import { MdSort } from 'react-icons/md';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Image from 'next/image';

// 画像最適化ユーティリティをインポート
import { getProfileImageUrl, getThumbnailUrl, getGalleryImageUrl, getFullsizeImageUrl } from '@/app/utils/imageUtils';
import { PhotosGrid } from './components/PhotosGrid';
import { VideoThumbnail } from './components/VideoThumbnail';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
  type?: 'image' | 'video';
  thumbnailUrl?: string;
  displayOrder?: number;
  deleting?: boolean;
  updating?: boolean;
}

export default function PhotosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mainPhoto, setMainPhoto] = useState<Photo | null>(null);
  const [subPhotos, setSubPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingSub, setUploadingSub] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // 並べ替えモード
  const [isSortMode, setIsSortMode] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      // 遅延読み込み
      const timer = setTimeout(() => {
        fetchPhotos();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // セッションがないがロード中の場合は10秒後にタイムアウト
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('セッション取得タイムアウト');
          setLoading(false);
          toast.error('セッションの取得に失敗しました。再読み込みしてください。');
        }
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [session]);

  // 写真の取得
  const fetchPhotos = async (retryCount = 0) => {
    if (!session?.user?.id) return;
    
    let fetchError = null; // エラー変数をブロック外で定義
    
    try {
      setLoadingPhotos(true);
      
      console.log(`写真データを取得中... (試行回数: ${retryCount + 1})`);
      
      // axiosからfetchに変更、より効率的なエラーハンドリングのため
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`/api/users/${session.user.id}/photos`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const photos = await response.json();
      
      // メイン写真とサブ写真に分類
      const main = photos.find((photo: any) => photo.isMain);
      const subs = photos.filter((photo: any) => !photo.isMain).map((photo: any) => {
        // サーバーから返されたデータを優先的に使用
        const type = photo.type || 
          (photo.url && (photo.url.includes('.mp4') || photo.url.includes('.mov')) ? 'video' : 'image');
        
        // 動画の場合はサムネイルを確保
        const thumbnailUrl = photo.thumbnailUrl || 
          (type === 'video' ? 'https://placehold.co/400x300?text=Video' : null);
          
        return {
          ...photo,
          type,
          thumbnailUrl
        };
      });
      
      // 表示順でソート
      subs.sort((a: Photo, b: Photo) => (a.displayOrder || 0) - (b.displayOrder || 0));
      
      console.log('写真データ処理完了:', {
        main: main ? { type: main.type, hasThumb: !!main.thumbnailUrl } : null,
        subs: subs.map(s => ({ id: s.id, type: s.type, hasThumb: !!s.thumbnailUrl }))
      });
      
      setMainPhoto(main || null);
      setSubPhotos(subs || []);
    } catch (error: any) {
      console.error('写真取得エラー:', error);
      fetchError = error; // エラーを保存
      
      // AbortErrorの場合はタイムアウト
      if (error.name === 'AbortError') {
        if (retryCount < 2) {
          console.log(`タイムアウトしました。再試行します (${retryCount + 1}/2)...`);
          toast.info('写真の取得に時間がかかっています。再試行しています...');
          
          // 500msの遅延を入れてから再試行
          setTimeout(() => fetchPhotos(retryCount + 1), 500);
          return;
        } else {
          toast.error('写真の取得がタイムアウトしました。ネットワーク接続を確認するか、後ほど再度お試しください。');
        }
      } else {
        toast.error(`写真の取得に失敗しました: ${error.message}`);
      }
      
      // エラー時でもローディング状態を解除
      setMainPhoto(null);
      setSubPhotos([]);
    } finally {
      if (retryCount === 2 || !(fetchError && fetchError.name === 'AbortError')) {
        setLoadingPhotos(false);
        setLoading(false);
      }
    }
  };

  // 写真削除処理のエラーハンドリングを強化し、タイムアウト処理を追加します。
  const handleDeletePhoto = async (photoId: string, isMain: boolean) => {
    const toastId = toast.loading(isMain ? 'メイン写真を削除中...' : '写真を削除中...');
    
    try {
      // UI側の表示状態をまず更新
      if (isMain) {
        setMainPhoto(prev => prev ? { ...prev, deleting: true } : null);
      } else {
        // サブ写真の場合は対象の写真だけフェード処理
        setSubPhotos(prev => 
          prev.map(photo => 
            photo.id === photoId ? { ...photo, deleting: true } : photo
          )
        );
      }
      
      // API呼び出しの前にデバッグログ
      console.log(`写真削除リクエスト開始: ID=${photoId}, isMain=${isMain}`);
      
      // タイムアウト付きのAPIコール
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒タイムアウト
      
      // APIを呼び出し（axiosからfetchに変更）
      const response = await fetch(`/api/users/photos/${photoId}`, {
        method: 'DELETE',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`削除に失敗しました: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('削除API応答:', data);
      
      // 削除成功後の状態更新
      if (isMain) {
        setMainPhoto(null);
      } else {
        setSubPhotos(prev => prev.filter(photo => photo.id !== photoId));
      }
      
      // 成功通知
      toast.success(isMain ? 'メイン写真を削除しました' : '写真を削除しました', { id: toastId });
      
    } catch (error: any) {
      console.error('写真削除エラー:', error);
      
      // エラー時はdeleting状態を元に戻す
      if (isMain) {
        setMainPhoto(prev => prev ? { ...prev, deleting: false } : null);
      } else {
        setSubPhotos(prev => 
          prev.map(photo => 
            photo.id === photoId ? { ...photo, deleting: false } : photo
          )
        );
      }
      
      // エラー通知を詳細に
      let errorMessage = '写真の削除に失敗しました';
      if (error.response?.data?.error) {
        errorMessage += `: ${error.response.data.error}`;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast.error(errorMessage, { id: toastId });
      
      // エラー後に写真を再取得してUIを最新状態に更新
      await fetchPhotos();
    }
  };

  // 写真の並べ替え
  const handlePhotosReordered = (newOrder: Photo[]) => {
    // 新しいメイン写真と並べ替えられたサブ写真に分ける
    const newMain = newOrder.find(p => p.isMain) || null;
    const newSubs = newOrder.filter(p => !p.isMain);
    
    setMainPhoto(newMain);
    setSubPhotos(newSubs);
  };
  
  // 並べ替えモードの切り替え
  const toggleSortMode = () => {
    setIsSortMode(!isSortMode);
  };

  // メイン写真のアップロード処理
  const handleMainPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    // ファイルサイズとタイプをチェック
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('画像ファイルのみアップロードできます');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isMain', 'true');
    
    try {
      setUploadingMain(true);
      toast.loading('メイン写真をアップロード中...', { id: 'upload-main' });
      
      const response = await axios.post('/api/users/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.url) {
        // 直接ステートを更新して再フェッチを避ける
        if (mainPhoto) {
          // 既存のメイン写真があった場合、サブ写真としてステート更新
          setSubPhotos(prev => [...prev, { ...mainPhoto, isMain: false }]);
        }
        
        // 新しいメイン写真を設定
        setMainPhoto({
          id: response.data.id,
          url: response.data.url,
          isMain: true
        });
        toast.success('メイン写真をアップロードしました', { id: 'upload-main' });
      }
    } catch (error: any) {
      console.error('写真アップロードエラー:', error);
      
      if (error.response?.data?.error) {
        toast.error(`エラー: ${error.response.data.error}`, { id: 'upload-main' });
      } else {
        toast.error('写真のアップロードに失敗しました', { id: 'upload-main' });
      }
    } finally {
      setUploadingMain(false);
    }
  };

  // 動画のアップロード処理
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // ファイルサイズと形式をチェック
    if (file.size > 50 * 1024 * 1024) { // 50MB制限
      toast.error('ファイルサイズは50MB以下にしてください');
      return;
    }
    
    if (!file.type.startsWith('video/')) {
      toast.error('動画ファイルのみアップロードできます');
      return;
    }
    
    try {
      setUploadingVideo(true);
      const toastId = toast.loading('動画をアップロード中...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isMain', 'false');
      formData.append('fileType', 'video');
      
      console.log('動画アップロード開始:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      
      const response = await axios.post('/api/users/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          toast.loading(`動画をアップロード中... ${percentCompleted}%`, { id: toastId });
        }
      });
      
      console.log('動画アップロード応答:', response.data);
      
      if (response.data?.url) {
        // サムネイルURLの確認と生成（バックアップ戦略）
        let thumbnailUrl = response.data.thumbnailUrl;
        
        // サムネイルURLが存在しない場合は生成を試みる
        if (!thumbnailUrl) {
          console.log('サムネイルURLがレスポンスにありません - バックアップを生成します');
          
          // 拡張子を.jpgに置き換えたURLを作成
          thumbnailUrl = response.data.url.replace(/\.[^/.]+$/, ".jpg");
          console.log('生成したサムネイルURL:', thumbnailUrl);
        }
        
        // 動画をサブフォトリストに追加
        const newVideo = { 
          id: response.data.id, 
          url: response.data.url,
          isMain: false,
          type: 'video',
          thumbnailUrl: thumbnailUrl
        };
        
        console.log('追加する動画データ:', newVideo);
        
        setSubPhotos(prev => [...prev, newVideo]);
        toast.success('動画をアップロードしました', { id: toastId });
      } else {
        console.error('動画アップロードレスポンスにURLがありません');
        toast.error('動画のアップロードに失敗しました', { id: toastId });
      }
    } catch (error: any) {
      console.error('動画アップロードエラー:', error);
      
      if (error.response?.data?.error) {
        toast.error(`エラー: ${error.response.data.error}`, { id: 'upload-video' });
      } else {
        toast.error('動画のアップロードに失敗しました', { id: 'upload-video' });
      }
    } finally {
      setUploadingVideo(false);
    }
  };

  // サブ写真のアップロード処理
  const handleSubPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // 選択されたファイル数が残りのアップロード可能枚数を超えている場合は警告
    if (files.length > 20 - (subPhotos.length + (mainPhoto ? 1 : 0))) {
      toast.warning(`残り${20 - (subPhotos.length + (mainPhoto ? 1 : 0))}枚までアップロード可能です。最初の${20 - (subPhotos.length + (mainPhoto ? 1 : 0))}枚がアップロードされます。`);
      files.splice(20 - (subPhotos.length + (mainPhoto ? 1 : 0)));
    }
    
    // ファイルサイズと形式をチェック
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: ファイルサイズは5MB以下にしてください`);
        return false;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: 画像ファイルのみアップロードできます`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    try {
      setUploadingSub(true);
      const toastId = toast.loading(`写真をアップロード中... (0/${validFiles.length})`);
      
      // 完了したアップロード数を追跡
      let completedUploads = 0;
      const successfulUploads: Photo[] = [];
      
      // 並列アップロード用のPromiseの配列
      const uploadPromises = validFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isMain', 'false');
        
        try {
          const response = await axios.post('/api/users/photos', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          
          if (response.data?.url) {
            completedUploads++;
            toast.loading(`写真をアップロード中... (${completedUploads}/${validFiles.length})`, { id: toastId });
            
            successfulUploads.push({ 
              id: response.data.id, 
              url: response.data.url,
              isMain: false
            });
          }
        } catch (error: any) {
          console.error(`写真${index + 1}アップロードエラー:`, error);
          
          let errorMessage = `写真「${file.name}」のアップロードに失敗しました`;
          if (error.response?.data?.error) {
            errorMessage += `: ${error.response.data.error}`;
          }
          
          toast.error(errorMessage);
        }
      });
      
      // すべてのアップロードを待機
      await Promise.all(uploadPromises);
      
      // 成功したアップロードをステートに反映
      if (successfulUploads.length > 0) {
        setSubPhotos(prev => [...prev, ...successfulUploads]);
        toast.success(`${successfulUploads.length}枚の写真をアップロードしました`, { id: toastId });
      } else {
        toast.error('写真のアップロードに失敗しました', { id: toastId });
      }
    } catch (error: any) {
      console.error('写真アップロードエラー:', error);
      
      if (error.response?.data?.error) {
        toast.error(`エラー: ${error.response.data.error}`);
      } else {
        toast.error('写真のアップロードに失敗しました');
      }
    } finally {
      setUploadingSub(false);
    }
  };

  // サブ写真をメイン写真に設定
  const setAsMainPhoto = async (photoId: string) => {
    // 設定中を示すトースト
    const toastId = toast.loading('メイン写真に設定中...');
    
    try {
      // 対象の写真を取得
      const targetPhoto = subPhotos.find(photo => photo.id === photoId);
      if (!targetPhoto) {
        toast.error('写真が見つかりません', { id: toastId });
        return;
      }
      
      // アニメーション用に状態更新
      setSubPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId ? { ...photo, updating: true } : photo
        )
      );
      
      // API呼び出し
      const response = await axios.patch(`/api/users/photos/${photoId}`, {
        isMain: true
      });
      
      if (response.data) {
        // 現在のメイン写真をサブ写真リストに追加
        if (mainPhoto) {
          setSubPhotos([
            ...subPhotos.filter(photo => photo.id !== photoId),
            { ...mainPhoto, isMain: false }
          ]);
        } else {
          setSubPhotos(subPhotos.filter(photo => photo.id !== photoId));
        }
        
        // 選択した写真をメイン写真に設定
        setMainPhoto({ ...targetPhoto, isMain: true });
        
        toast.success('メイン写真を変更しました', { id: toastId });
      }
    } catch (error) {
      console.error('写真設定エラー:', error);
      
      // エラー時は状態を元に戻す
      setSubPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId ? { ...photo, updating: false } : photo
        )
      );
      
      toast.error('写真の設定に失敗しました', { id: toastId });
    }
  };

  // VideoThumbnail コンポーネント
  const VideoThumbnail = ({ url, thumbnailUrl, className = '' }: { url: string, thumbnailUrl?: string, className?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [localThumbnail, setLocalThumbnail] = useState<string | null>(null);
    // 実際に再生しているかどうかのフラグ
    const [effectivelyPlaying, setEffectivelyPlaying] = useState(false);
    
    useEffect(() => {
      // コンポーネントのマウント時にサムネイル生成を試みる
      console.log('動画情報:', { url, thumbnailUrl });

      const generateThumbnail = async () => {
        if (!videoRef.current) return;
        
        try {
          // MOVファイルがMP4に変換されている可能性があるので、URLを確認して対応
          let videoSrc = url;
          if (url.toLowerCase().endsWith('.mov')) {
            // MOVをMP4に置き換え
            videoSrc = url.replace(/\.mov$/i, '.mp4');
            console.log('URL変換: MOV → MP4', videoSrc);
          }
          
          // 動画のメタデータをロード
          await new Promise<void>((resolve, reject) => {
            const handleLoad = () => {
              console.log('動画メタデータロード成功');
              resolve();
            };
            
            const handleError = (e: any) => {
              console.error('動画メタデータロードエラー:', e);
              reject(e);
            };
            
            videoRef.current!.onloadedmetadata = handleLoad;
            videoRef.current!.onerror = handleError;
            // リロードを強制
            videoRef.current!.load();
            
            // タイムアウト - 正常に続行できるようrejectではなくresolveを使用
            let timeoutId = setTimeout(() => {
              console.warn('動画メタデータロードタイムアウト - サムネイル生成を続行');
              resolve(); // エラーにせず続行
            }, 15000); // 15秒に延長
            
            // クリーンアップ関数
            return () => clearTimeout(timeoutId);
          });
          
          // メタデータ読み込み後、1秒付近のフレームを取得
          videoRef.current.currentTime = 1.0;
          
          // フレームロード完了を待つ
          await new Promise<void>((resolve) => {
            videoRef.current!.onseeked = () => resolve();
          });
          
          // キャンバスにフレームを描画
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg');
            setLocalThumbnail(thumbnail);
            console.log('サムネイル生成成功');
          }
          
          // 動画時間を0に戻す
          videoRef.current.currentTime = 0;
        } catch (e) {
          console.error('サムネイル生成エラー:', e);
          setError(true);
        }
      };
      
      // フレーム取得を試みる
      generateThumbnail();
    }, [url]);
    
    const handleMouseEnter = () => {
      if (videoRef.current) {
        console.log('動画再生開始:', url);
        
        try {
          // 複数のソース要素があるか確認
          if (videoRef.current.childElementCount === 0) {
            // ソース要素が存在しない場合は再構築
            const mp4Source = document.createElement('source');
            mp4Source.src = url.replace(/\.[^/.]+$/, '.mp4');
            mp4Source.type = 'video/mp4';
            
            const originalSource = document.createElement('source');
            originalSource.src = url;
            originalSource.type = url.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4';
            
            // 一度クリア
            videoRef.current.innerHTML = '';
            videoRef.current.appendChild(mp4Source);
            videoRef.current.appendChild(originalSource);
          }
          
          // 再生前にロードを強制
          videoRef.current.load();
          
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('動画再生成功');
                setIsPlaying(true);
                setEffectivelyPlaying(true);
                setError(false); // エラー状態をリセット
              })
              .catch(e => {
                console.error('動画再生エラー:', e);
                setError(true);
                setEffectivelyPlaying(false);
                // 再生に失敗しても、サムネイルがある場合は処理を続行
                if (localThumbnail || thumbnailUrl) {
                  console.log('サムネイルで代替表示');
                }
              });
          }
        } catch (e) {
          console.error('動画再生例外:', e);
          setError(true);
        }
      }
    };
    
    const handleMouseLeave = () => {
      if (videoRef.current && isPlaying) {
        try {
          // 再生状態の時のみ停止を試みる
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          setIsPlaying(false);
        } catch (e) {
          console.error('動画停止エラー:', e);
        }
      }
    };
    
    // サムネイルの優先順位: ローカル生成 > サーバー > SVGプレースホルダー
    const effectiveThumbnail = localThumbnail || 
                               (!imageError && thumbnailUrl) || 
                               'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHBhdGggZD0iTTE2MCwxMzAgbDgwLDUwIC04MCw1MCB6IiBmaWxsPSIjYjBiMGIwIi8+PC9zdmc+';
    
    // サムネイルURLの管理
    const handleImageError = () => {
      console.log('サムネイル画像読み込みエラー:', thumbnailUrl);
      setImageError(true);
    };
    
    return (
      <div 
        className={`relative w-full h-full ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ビデオ要素（常に存在、表示/非表示を切り替え） */}
        <video 
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${isPlaying ? 'block' : 'hidden'}`}
          muted
          loop
          playsInline
          preload="auto"
          onError={(e) => {
            console.error('動画読み込みエラー:', e);
            setError(true);
            setEffectivelyPlaying(false);
          }}
          onPlaying={() => {
            // 実際に再生中であればエラー状態を解除
            setEffectivelyPlaying(true);
            setError(false);
          }}
          onEnded={() => {
            // ループが正しく動作しなかった場合のフォールバック
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(e => {
                console.error('ループ再生エラー:', e);
              });
            }
          }}
        >
          {/* 複数の形式をサポート */}
          <source src={url.replace(/\.mov$/i, '.mp4')} type="video/mp4" />
          <source src={url} type={url.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
          動画の再生に対応したブラウザが必要です
        </video>
        
        {/* サムネイル（動画非再生時） */}
        {!isPlaying && (
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gray-200"></div>
            <img 
              src={effectiveThumbnail}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <FaVideo className="text-white text-2xl" />
            </div>
          </div>
        )}
        
        {error && !effectivelyPlaying && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-1 text-xs">
            再生エラー
          </div>
        )}
      </div>
    );
  };

  // 残りのアップロード可能枚数
  const remainingUploads = 20 - (subPhotos.length + (mainPhoto ? 1 : 0));

  // スタイル
  const bgGradient = 'bg-teal-400';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <motion.div 
        className={`${bgGradient} text-white p-4 flex items-center justify-between`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => router.push('/mypage/profile/edit')}
          className="flex items-center text-white"
        >
          <AiOutlineArrowLeft size={20} />
          <span className="ml-2">戻る</span>
        </button>
        <h1 className="text-xl font-bold">写真管理</h1>
        <div className="w-8"></div> {/* スペーサー */}
      </motion.div>
      
      <div className="p-4 max-w-md mx-auto">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </motion.div>
          </div>
        ) : (
          <>
            {/* 写真アップロード上限の表示 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="text-sm font-medium text-gray-700">
                写真は最大20枚までアップロードできます (残り: {remainingUploads}枚)
              </p>
            </motion.div>
            
            {/* メイン写真 */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-md font-medium mb-2">メイン写真</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                {/* スケルトンローディング */}
                {loadingPhotos && !mainPhoto && (
                  <div className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-square w-full h-64"></div>
                  </div>
                )}
                
                {mainPhoto ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {mainPhoto.url.startsWith('data:') ? (
                      // Base64の場合
                      <img
                        src={mainPhoto.url}
                        alt="メイン写真"
                        className={`w-full h-full object-cover`}
                      />
                    ) : (
                      // 通常の画像URL
                      <Image
                        src={getGalleryImageUrl(mainPhoto.url)}
                        alt="メイン写真"
                        layout="fill"
                        objectFit="cover"
                        priority
                      />
                    )}
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleDeletePhoto(mainPhoto.id, true)}
                        className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
                        title="削除"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    onClick={() => document.getElementById('main-photo-upload')?.click()}
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  >
                    {uploadingMain ? (
                      <FaSpinner className="animate-spin text-teal-600 text-4xl" />
                    ) : (
                      <>
                        <FaCamera className="text-gray-400 text-4xl mb-2" />
                        <p className="text-gray-600 font-medium">メイン写真を追加</p>
                        <p className="text-gray-500 text-xs mt-1">ここをクリックして画像を選択</p>
                      </>
                    )}
                  </motion.div>
                )}
                <input
                  id="main-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainPhotoChange}
                  disabled={uploadingMain}
                />
              </div>
            </motion.div>
            
            {/* 写真・動画追加ボタンエリア */}
            {remainingUploads > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* 写真追加ボタン */}
                <motion.div
                  key="add-sub-photo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="relative group"
                >
                  <motion.div
                    onClick={() => document.getElementById('sub-photo-upload-box')?.click()}
                    className="flex flex-col items-center justify-center w-full h-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white"
                  >
                    {uploadingSub ? (
                      <FaSpinner className="animate-spin text-teal-600 text-3xl" />
                    ) : (
                      <>
                        <FaCamera className="text-gray-400 text-3xl mb-1" />
                        <p className="text-gray-600 text-sm font-medium">写真を追加（複数可）</p>
                        <p className="text-gray-500 text-xs mt-1">ここをクリック</p>
                      </>
                    )}
                  </motion.div>
                  <input
                    id="sub-photo-upload-box"
                    type="file"
                    accept="image/*"
                    onChange={handleSubPhotoChange}
                    className="hidden"
                    disabled={uploadingSub || remainingUploads <= 0}
                    multiple
                  />
                </motion.div>
                
                {/* 動画追加ボタン */}
                <motion.div
                  key="add-video"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="relative group"
                >
                  <motion.div
                    onClick={() => document.getElementById('video-upload-box')?.click()}
                    className="flex flex-col items-center justify-center w-full h-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white bg-opacity-80"
                  >
                    {uploadingVideo ? (
                      <FaSpinner className="animate-spin text-teal-600 text-3xl" />
                    ) : (
                      <>
                        <FaVideo className="text-gray-400 text-3xl mb-1" />
                        <p className="text-gray-600 text-sm font-medium">動画を追加</p>
                        <p className="text-gray-500 text-xs mt-1">ここをクリック</p>
                      </>
                    )}
                  </motion.div>
                  <input
                    id="video-upload-box"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo || remainingUploads <= 0}
                  />
                </motion.div>
              </div>
            )}
            
            {/* 写真一覧 */}
            <div className="mt-8 w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">写真・動画ギャラリー</h2>
                
                {/* 並べ替えモード切り替えボタン */}
                {(mainPhoto || subPhotos.length > 0) && (
                  <button
                    onClick={toggleSortMode}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                      isSortMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <MdSort />
                    {isSortMode ? '並べ替え完了' : '並べ替え'}
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <FaSpinner className="animate-spin text-3xl text-gray-500" />
                </div>
              ) : (
                <>
                  {mainPhoto || subPhotos.length > 0 ? (
                    <PhotosGrid 
                      photos={subPhotos} 
                      isSortMode={isSortMode}
                      onPhotosReordered={handlePhotosReordered}
                      onDelete={(photo) => handleDeletePhoto(photo.id, photo.isMain)}
                      onSetMain={photo => setAsMainPhoto(photo.id)}
                    />
                  ) : (
                    <div className="text-center p-8 bg-gray-100 rounded-lg">
                      <p>まだ写真がありません。写真を追加してください。</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* 写真のガイドライン */}
            <motion.div
              className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h3 className="text-sm font-bold text-teal-800 mb-2">写真・動画アップロードのガイドライン</h3>
              <ul className="text-xs text-teal-700 list-disc pl-4 space-y-1">
                <li>メイン写真はあなたの顔が明確に写っている写真を選びましょう</li>
                <li>動画は50MB以下、30秒程度の長さが推奨です</li>
                <li>不適切な写真や動画、プライバシーを侵害するコンテンツは避けてください</li>
                <li>高解像度の写真・動画がより良いプロフィール印象につながります</li>
                <li>最大20枚まで写真または動画をアップロードできます</li>
              </ul>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
