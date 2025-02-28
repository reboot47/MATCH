'use client';

import { useState, useEffect } from 'react';
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
  FaImage
} from 'react-icons/fa';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Image from 'next/image';

// 画像最適化ユーティリティをインポート
import { getProfileImageUrl, getThumbnailUrl, getGalleryImageUrl, getFullsizeImageUrl } from '@/app/utils/imageUtils';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
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
  const [confirmDelete, setConfirmDelete] = useState<{id: string, isMain: boolean} | null>(null);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

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
      const subs = photos.filter((photo: any) => !photo.isMain);
      
      setMainPhoto(main || null);
      setSubPhotos(subs || []);
      console.log(`写真データを取得しました: メイン写真=${!!main}, サブ写真=${subs.length}枚`);
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

  // 写真削除の確認モーダル
  const DeleteConfirmModal = ({ photoId, isMain, onCancel, onConfirm }) => {
    const [deleting, setDeleting] = useState(false);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-xl p-5 max-w-sm w-full shadow-xl"
        >
          <h3 className="text-lg font-bold mb-3 text-gray-800">写真を削除しますか？</h3>
          <p className="text-gray-600 mb-4">
            {isMain 
              ? 'メイン写真を削除すると、プロフィールに表示される写真がなくなります。'
              : 'この写真を削除すると、復元することはできません。'
            }
          </p>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded-md text-gray-800"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                setDeleting(true);
                onConfirm();
                onCancel();
              }}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 transition-colors rounded-md text-white flex items-center"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  削除中...
                </>
              ) : '削除する'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 写真の削除
  const handleDeletePhoto = async (photoId: string, isMain: boolean) => {
    // 削除確認のモーダルを表示
    setConfirmDelete({ id: photoId, isMain });
  };

  // 写真削除の実行
  const confirmDeletePhoto = async (photoId: string, isMain: boolean) => {
    try {
      // ローディング通知
      const toastId = toast.loading('写真を削除中...');
      
      // アニメーション用に削除対象のステートを更新（視覚的フィードバック）
      if (isMain) {
        // メイン写真の場合はフェード処理
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
      
      // APIを呼び出し
      const response = await axios.delete(`/api/users/photos/${photoId}`);
      console.log('削除API応答:', response.data);
      
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
      
      toast.error(errorMessage);
    }
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
                        className={`w-full h-full object-cover ${mainPhoto.deleting ? 'opacity-30' : ''}`}
                      />
                    ) : (
                      // 通常の画像URL
                      <Image
                        src={getGalleryImageUrl(mainPhoto.url)}
                        alt="メイン写真"
                        layout="fill"
                        objectFit="cover"
                        className={mainPhoto.deleting ? 'opacity-30' : ''}
                        priority
                      />
                    )}
                    {mainPhoto.deleting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaSpinner className="animate-spin text-red-500 text-4xl" />
                      </div>
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
            
            {/* サブ写真 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-md font-medium mb-2">サブ写真</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* スケルトンローディング */}
                {loadingPhotos && subPhotos.length === 0 && (
                  <>
                    <div className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg aspect-square w-full h-32"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg aspect-square w-full h-32"></div>
                    </div>
                  </>
                )}
                
                {subPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: photo.deleting ? 0.5 : 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    {photo.url.startsWith('data:') ? (
                      // Base64の場合
                      <img
                        src={photo.url}
                        alt={`サブ写真 ${index + 1}`}
                        className={`w-full h-full object-cover ${photo.deleting ? 'opacity-30' : ''}`}
                      />
                    ) : (
                      // 通常の画像URL
                      <Image
                        src={getThumbnailUrl(photo.url)}
                        alt={`サブ写真 ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className={photo.deleting ? 'opacity-30' : ''}
                      />
                    )}
                    {photo.deleting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaSpinner className="animate-spin text-red-500 text-3xl" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                      <button
                        onClick={() => setAsMainPhoto(photo.id)}
                        className="bg-teal-500 text-white p-2 rounded-full shadow hover:bg-teal-600 transition"
                        title="メイン写真に設定"
                      >
                        <FaStar />
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id, false)}
                        className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
                        title="削除"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {photo.updating && (
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-100 opacity-50 flex justify-center items-center">
                        <FaSpinner className="animate-spin text-teal-600 text-3xl" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* 写真追加ボタン */}
                {remainingUploads > 0 && (
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
                )}
              </div>
            </motion.div>
            
            {/* 写真のガイドライン */}
            <motion.div
              className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h3 className="text-sm font-bold text-teal-800 mb-2">写真アップロードのガイドライン</h3>
              <ul className="text-xs text-teal-700 list-disc pl-4 space-y-1">
                <li>メイン写真はあなたの顔が明確に写っている写真を選びましょう</li>
                <li>不適切な写真やプライバシーを侵害する写真は避けてください</li>
                <li>高解像度の写真がより良いプロフィール印象につながります</li>
                <li>最大20枚まで写真をアップロードできます</li>
              </ul>
            </motion.div>
          </>
        )}
      </div>
      
      {/* 削除確認モーダル */}
      {confirmDelete && (
        <DeleteConfirmModal
          photoId={confirmDelete.id}
          isMain={confirmDelete.isMain}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => confirmDeletePhoto(confirmDelete.id, confirmDelete.isMain)}
        />
      )}
    </div>
  );
}
