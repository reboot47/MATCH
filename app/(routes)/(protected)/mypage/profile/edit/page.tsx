'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiPlus, FiInfo } from 'react-icons/fi';
import { FaImage, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { VideoThumbnail } from '../../photos/components/VideoThumbnail';

// VideoThumbnailコンポーネントをインポート

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [mainPhoto, setMainPhoto] = useState<string | null>(null);
  const [mainPhotoId, setMainPhotoId] = useState<string | null>(null);
  const [mainPhotoType, setMainPhotoType] = useState<'image' | 'video'>('image');
  const [mainPhotoThumbnailUrl, setMainPhotoThumbnailUrl] = useState<string | null>(null);
  const [subPhotos, setSubPhotos] = useState<{
    id: string, 
    url: string, 
    type?: 'image' | 'video',
    thumbnailUrl?: string
  }[]>([]);
  const [appealTags, setAppealTags] = useState<string[]>([]);
  const [tweet, setTweet] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTagsChanged, setSelectedTagsChanged] = useState(false);
  const [savingTweet, setSavingTweet] = useState(false);
  
  // ユーザーデータの取得
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile(session.user.id);
    }
  }, [session, status]);
  
  // アピールタグページから戻ってきた時に再取得
  useEffect(() => {
    const handleRouteChange = () => {
      if (status === 'authenticated' && session?.user?.id) {
        fetchUserProfile(session.user.id);
      }
    };
    
    // ルート変更時にデータを再取得
    window.addEventListener('focus', handleRouteChange);
    
    return () => {
      window.removeEventListener('focus', handleRouteChange);
    };
  }, [session, status]);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // プロフィール情報の取得
      const profileResponse = await axios.get(`/api/users/${userId}/profile`);
      const profileData = profileResponse.data;
      
      // 写真の取得
      const photosResponse = await axios.get(`/api/users/${userId}/photos`);
      const photosData = photosResponse.data;
      
      console.log('写真データ:', photosData);
      
      if (profileData) {
        // プロフィールデータの設定
        const mainPhotoData = photosData?.find((photo: any) => photo.isMain) || null;
        const subPhotoData = photosData?.filter((photo: any) => !photo.isMain) || [];
        
        // 画像のセットアップ
        setMainPhoto(mainPhotoData?.url || null);
        setMainPhotoId(mainPhotoData?.id || null);
        setMainPhotoType(mainPhotoData?.type || 'image');
        setMainPhotoThumbnailUrl(mainPhotoData?.thumbnailUrl || null);
        
        // サブ写真の設定（タイプとサムネイル情報も保存）
        setSubPhotos(subPhotoData.map((photo: any) => ({
          id: photo.id,
          url: photo.url,
          type: photo.type || 'image',
          thumbnailUrl: photo.thumbnailUrl
        })));
        
        // アピールタグ
        const tags = profileData.appealTags?.map((tag: any) => tag.appealTag.name) || [];
        setAppealTags(tags);
        
        // つぶやき
        setTweet(profileData.tweet || '');
        
        // 出会いの目的
        setPurpose(profileData.purpose || '');
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
      toast.error('プロフィールの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  // アピールタグの追加処理
  const handleAddAppealTag = () => {
    // 現在のタグ情報を保存し、タグ選択ページへ遷移
    localStorage.setItem('currentAppealTags', JSON.stringify(appealTags));
    router.push('/mypage/profile/appeal-tags');
  };
  
  // アピールタグの保存
  const handleSaveAppealTags = async () => {
    if (!session?.user?.id) return;
    
    try {
      setSaving(true);
      await axios.put(`/api/users/${session.user.id}/appeal-tags`, { appealTags });
      setSelectedTagsChanged(false);
      toast.success('アピールタグを更新しました');
    } catch (error) {
      console.error('アピールタグ更新エラー:', error);
      toast.error('アピールタグの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };
  
  // アピールタグの削除処理
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = appealTags.filter(tag => tag !== tagToRemove);
    setAppealTags(updatedTags);
    setSelectedTagsChanged(true);
  };
  
  // アピールタグの変更を追跡
  const handleAppealTagChange = (newTags: string[]) => {
    setAppealTags(newTags);
    setSelectedTagsChanged(true);
  };
  
  // つぶやきの更新
  const handleTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  
  // つぶやき保存
  const handleSaveTweet = async () => {
    if (!session?.user?.id) return;
    
    try {
      setSavingTweet(true);
      await axios.put(`/api/users/${session.user.id}/tweet`, { tweet });
      toast.success('つぶやきを更新しました');
    } catch (error) {
      console.error('つぶやき更新エラー:', error);
      toast.error('つぶやきの更新に失敗しました');
    } finally {
      setSavingTweet(false);
    }
  };
  
  // 出会いの目的の更新
  const handlePurposeUpdate = () => {
    router.push('/mypage/profile/purpose');
  };
  
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ヘッダー */}
      <div className="bg-teal-400 text-white p-4 flex items-center justify-between">
        <button 
          onClick={() => router.push('/mypage')}
          className="flex items-center"
        >
          <FiChevronLeft size={24} />
          <span className="ml-1">戻る</span>
        </button>
        <h1 className="text-xl font-bold">プロフィール編集</h1>
        <div className="w-8"></div> {/* スペーサー */}
      </div>
      
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
      <motion.main 
        className="max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* メイン写真 */}
        <motion.div 
          className="bg-white p-4 border-b"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium">メイン写真</h2>
            <button
              onClick={() => router.push('/mypage/photos')}
              className="text-teal-600 text-sm font-medium hover:text-teal-800 transition"
            >
              すべての写真を管理
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">あなたの第一印象を決める写真を設定しましょう</p>
          
          <div className="flex justify-center">
            <div 
              className="relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            >
              {mainPhoto ? (
                <>
                  {mainPhotoType === 'video' ? (
                    <div className="relative w-full h-full">
                      <VideoThumbnail 
                        url={mainPhoto}
                        thumbnailUrl={mainPhotoThumbnailUrl || undefined}
                        className="w-full h-full"
                        clickToPlay={true}
                      />
                      <div className="absolute bottom-2 right-2 z-10">
                        <button 
                          onClick={() => router.push('/mypage/photos')}
                          className="bg-white bg-opacity-90 p-2 rounded-full shadow-md"
                          title="写真管理へ"
                        >
                          <FiPlus size={16} className="text-teal-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image 
                        src={mainPhoto} 
                        alt="プロフィール写真" 
                        fill={true}
                        style={{ objectFit: 'cover' }}
                        className="group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute bottom-2 right-2 z-10">
                        <button 
                          onClick={() => router.push('/mypage/photos')}
                          className="bg-white bg-opacity-90 p-2 rounded-full shadow-md"
                          title="写真管理へ"
                        >
                          <FiPlus size={16} className="text-teal-500" />
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-all">
                  <button 
                    onClick={() => router.push('/mypage/photos')}
                    className="flex flex-col items-center justify-center w-full h-full"
                  >
                    <FiPlus size={24} className="text-teal-400 mb-1" />
                    <p className="text-xs text-gray-600">写真管理へ</p>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <button className="w-full text-teal-500 mt-3 text-sm text-left">
            メイン写真の選び方について詳しく見る
          </button>
        </motion.div>
        
        {/* サブ写真 */}
        <motion.div 
          className="bg-white p-4 border-b"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium">サブ写真</h2>
            <button
              onClick={() => router.push('/mypage/photos')}
              className="text-teal-600 text-sm font-medium hover:text-teal-800 transition"
            >
              すべての写真を管理
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">プライベート、趣味、観光、仕事、ペット、旅行など</p>
          
          <div className="grid grid-cols-3 gap-2">
            <AnimatePresence>
              {subPhotos.map((photo, index) => (
                <motion.div 
                  key={photo.id} 
                  className="relative aspect-square bg-gray-200 rounded-md overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  {photo.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <VideoThumbnail 
                        url={photo.url}
                        thumbnailUrl={photo.thumbnailUrl}
                        className="w-full h-full"
                        clickToPlay={true}
                      />
                      <div className="absolute bottom-2 right-2 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/mypage/photos');
                          }}
                          className="bg-white bg-opacity-90 p-1 rounded-full shadow-md"
                          title="写真管理へ"
                        >
                          <FiPlus size={14} className="text-teal-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image 
                        src={photo.url}
                        alt={`サブ写真 ${index + 1}`}
                        fill={true}
                        style={{ objectFit: 'cover' }}
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 right-2 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/mypage/photos');
                          }}
                          className="bg-white bg-opacity-90 p-1 rounded-full shadow-md"
                          title="写真管理へ"
                        >
                          <FiPlus size={14} className="text-teal-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {subPhotos.length < 6 && (
              <motion.div 
                className="aspect-square bg-gray-100 rounded-md flex items-center justify-center cursor-pointer group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => router.push('/mypage/photos')}
              >
                <div className="flex flex-col items-center justify-center w-full h-full group-hover:bg-gray-200 transition-all">
                  <FiPlus size={24} className="text-teal-400 mb-1" />
                  <p className="text-xs text-gray-600">写真管理へ</p>
                </div>
              </motion.div>
            )}
          </div>
          
          <button className="w-full text-teal-500 mt-3 text-sm text-left">
            サブ写真の選び方について詳しく見る
          </button>
        </motion.div>
        
        {/* アピールタグ設定 */}
        <motion.div 
          className="bg-white p-4 border-b"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium">アピールタグ設定</h2>
            {selectedTagsChanged && (
              <button 
                onClick={handleSaveAppealTags}
                className="text-teal-500 text-sm"
                disabled={saving}
              >
                {saving ? '保存中...' : '保存'}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">アピールタグを設定すると他のあなたが分かりやすいユーザーになります</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {appealTags.map((tag, index) => (
              <div 
                key={index}
                className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-teal-700 hover:text-teal-900"
                >
                  ×
                </button>
              </div>
            ))}
            
            {appealTags.length < 5 && (
              <button 
                onClick={handleAddAppealTag}
                className="flex items-center justify-center bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm"
              >
                <FiPlus size={16} className="mr-1" />
              </button>
            )}
          </div>
        </motion.div>
        
        {/* つぶやき */}
        <motion.div 
          className="bg-white p-4 border-b"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium">つぶやき</h2>
            <button 
              onClick={handleSaveTweet}
              className={`text-teal-500 text-sm flex items-center ${savingTweet ? 'opacity-70' : ''}`}
              disabled={savingTweet}
            >
              {savingTweet ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full mr-1"></div>
                  保存中...
                </>
              ) : '保存'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">いつでも編集できます。ご遠慮なく。</p>
          
          <textarea
            value={tweet}
            onChange={handleTweetChange}
            placeholder="今の気持ちや近況など..."
            className="w-full border rounded-md p-3 text-sm h-24"
            maxLength={200}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {tweet.length}/200
          </div>
        </motion.div>
        
        {/* 出会いの目的 */}
        <motion.div 
          className="bg-white p-4 border-b"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2 className="text-md font-medium mb-2">出会いの目的</h2>
          <button 
            onClick={handlePurposeUpdate}
            className="w-full py-3 flex justify-between items-center border-b"
          >
            <span>{purpose || '選択してください'}</span>
            <FiChevronRight size={18} className="text-gray-400" />
          </button>
        </motion.div>
        
        {/* プロフィール設定 */}
        <motion.div 
          className="bg-white p-4 rounded-md shadow-sm mx-4 my-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-md font-medium mb-3 border-l-4 border-teal-500 pl-2">プロフィール設定</h2>
          
          <motion.button 
            onClick={() => router.push('/mypage/profile/bio')}
            className="w-full py-4 flex justify-between items-center border-b"
            whileHover={{ backgroundColor: '#f0f9f9' }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-medium">自己紹介を編集</span>
            <FiChevronRight size={18} className="text-gray-400" />
          </motion.button>
          
          <motion.button 
            onClick={() => router.push('/mypage/profile/basic')}
            className="w-full py-4 flex justify-between items-center border-b"
            whileHover={{ backgroundColor: '#f0f9f9' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              <span className="font-medium">基本プロフィールを編集</span>
              <span className="ml-2 text-teal-500 text-sm">100%完了</span>
            </div>
            <FiChevronRight size={18} className="text-gray-400" />
          </motion.button>
          
          <motion.button 
            onClick={() => router.push('/mypage/profile/details')}
            className="w-full py-4 flex justify-between items-center relative"
            whileHover={{ backgroundColor: '#f0f9f9' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              <span className="font-medium">その他詳細プロフィールを編集</span>
              <span className="ml-2 text-teal-500 text-sm">100%完了</span>
            </div>
            
            <motion.div
              className="absolute right-8 -top-3 bg-pink-100 text-pink-600 text-xs py-1 px-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15,
                delay: 1 
              }}
            >
              New!
            </motion.div>
            
            <FiChevronRight size={18} className="text-gray-400" />
          </motion.button>
        </motion.div>
      </motion.main>
      )}
    </div>
  );
}
