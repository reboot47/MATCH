'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiPlus, FiInfo } from 'react-icons/fi';
import axios from 'axios';

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // ファイル選択用のref
  const mainPhotoInputRef = useRef<HTMLInputElement>(null);
  const subPhotoInputRef = useRef<HTMLInputElement>(null);
  
  const [mainPhoto, setMainPhoto] = useState<string | null>(null);
  const [mainPhotoId, setMainPhotoId] = useState<string | null>(null);
  const [subPhotos, setSubPhotos] = useState<{id: string, url: string}[]>([]);
  const [appealTags, setAppealTags] = useState<string[]>([]);
  const [tweet, setTweet] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTagsChanged, setSelectedTagsChanged] = useState(false);
  
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
  
  // ページロード時にフォーム送信イベントをキャンセルする処理
  useEffect(() => {
    const preventFormSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // フォーム要素にイベントリスナーを追加
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', preventFormSubmit);
    });

    // クリーンアップ関数
    return () => {
      document.querySelectorAll('form').forEach(form => {
        form.removeEventListener('submit', preventFormSubmit);
      });
    };
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}/profile`);
      const userData = response.data;
      
      if (userData) {
        // メイン写真
        const photos = userData.photos || [];
        const mainPhotoData = photos.find((p: any) => p.isMain);
        setMainPhoto(mainPhotoData?.url || null);
        setMainPhotoId(mainPhotoData?.id || null);
        
        // サブ写真
        const subPhotosData = photos.filter((p: any) => !p.isMain);
        setSubPhotos(subPhotosData.map((p: any) => ({ id: p.id, url: p.url })));
        
        // アピールタグ
        const tags = userData.appealTags?.map((tag: any) => tag.appealTag.name) || [];
        setAppealTags(tags);
        
        // つぶやき
        setTweet(userData.tweet || '');
        
        // 出会いの目的
        setPurpose(userData.purpose || '');
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // メイン写真のアップロード処理
  const handleMainPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // ファイルが選択されていない場合は何もしない
    if (!e.target.files || !e.target.files[0]) {
      console.log('ファイルが選択されていません');
      return;
    }
    
    const file = e.target.files[0];
    
    // ファイルタイプとサイズのバリデーション
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    console.log('アップロードファイル情報:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    if (!validTypes.includes(file.type)) {
      alert('JPG、PNG、またはWEBP形式の画像を選択してください');
      return;
    }
    
    if (file.size > maxSize) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    // ローディング状態の設定
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isMain', 'true');
      
      console.log('メイン画像アップロード開始...');
      
      const response = await axios.post('/api/users/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('メイン画像アップロード応答:', response.data);
      
      if (response.data?.url) {
        setMainPhoto(response.data.url);
        setMainPhotoId(response.data.id);
        console.log('メイン画像が更新されました', response.data.url);
      }
    } catch (error) {
      console.error('写真アップロードエラー:', error);
      
      // エラーの詳細情報を表示
      let errorMessage = '写真のアップロードに失敗しました';
      if (axios.isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data;
        errorMessage += responseData.details 
          ? `\n詳細: ${responseData.details}` 
          : '';
        console.log('詳細エラー:', responseData);
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
      // 入力フィールドをリセット
      if (mainPhotoInputRef.current) {
        mainPhotoInputRef.current.value = '';
      }
    }
  };
  
  // サブ写真のアップロード処理
  const handleSubPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // ファイルが選択されていない場合は何もしない
    if (!e.target.files || !e.target.files[0]) {
      console.log('ファイルが選択されていません');
      return;
    }
    
    const file = e.target.files[0];
    
    // ファイルタイプとサイズのバリデーション
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    console.log('アップロードファイル情報:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    if (!validTypes.includes(file.type)) {
      alert('JPG、PNG、またはWEBP形式の画像を選択してください');
      return;
    }
    
    if (file.size > maxSize) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    // ローディング状態の設定
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isMain', 'false');
      
      console.log('サブ画像アップロード開始...');
      
      const response = await axios.post('/api/users/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('サブ画像アップロード応答:', response.data);
      
      if (response.data?.url) {
        setSubPhotos([...subPhotos, { id: response.data.id, url: response.data.url }]);
        console.log('サブ画像が追加されました', response.data.url);
      }
    } catch (error) {
      console.error('写真アップロードエラー:', error);
      
      // エラーの詳細情報を表示
      let errorMessage = '写真のアップロードに失敗しました';
      if (axios.isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data;
        errorMessage += responseData.details 
          ? `\n詳細: ${responseData.details}` 
          : '';
        console.log('詳細エラー:', responseData);
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
      // 入力フィールドをリセット
      if (subPhotoInputRef.current) {
        subPhotoInputRef.current.value = '';
      }
    }
  };
  
  // サブ写真の削除
  const handleDeleteSubPhoto = async (photoId: string) => {
    if (!confirm('この写真を削除してもよろしいですか？')) return;
    
    try {
      await axios.delete(`/api/users/photos/${photoId}`);
      setSubPhotos(subPhotos.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('写真削除エラー:', error);
      alert('写真の削除に失敗しました');
    }
  };
  
  // サブ写真をメイン写真に設定
  const setAsMainPhoto = async (photoId: string) => {
    try {
      const response = await axios.patch(`/api/users/photos/${photoId}`, {
        isMain: true
      });
      
      if (response.data) {
        // 対象の写真を取得
        const targetPhoto = subPhotos.find(photo => photo.id === photoId);
        if (targetPhoto) {
          // メイン写真を更新
          setMainPhoto(targetPhoto.url);
          setMainPhotoId(photoId);
          
          // 以前のメイン写真があれば、サブ写真に追加
          if (mainPhotoId && mainPhoto) {
            setSubPhotos([
              ...subPhotos.filter(photo => photo.id !== photoId),
              { id: mainPhotoId, url: mainPhoto }
            ]);
          } else {
            // 以前のメイン写真がなければ、サブ写真から対象を削除
            setSubPhotos(subPhotos.filter(photo => photo.id !== photoId));
          }
        }
      }
    } catch (error) {
      console.error('メイン写真設定エラー:', error);
      alert('メイン写真の設定に失敗しました');
    }
  };
  
  // メイン写真の削除
  const handleDeleteMainPhoto = async () => {
    if (!mainPhotoId) return;
    if (!confirm('メイン写真を削除してもよろしいですか？')) return;
    
    try {
      await axios.delete(`/api/users/photos/${mainPhotoId}`);
      setMainPhoto(null);
      setMainPhotoId(null);
    } catch (error) {
      console.error('写真削除エラー:', error);
      alert('写真の削除に失敗しました');
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
      alert('アピールタグを更新しました');
    } catch (error) {
      console.error('アピールタグ更新エラー:', error);
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
      await axios.put(`/api/users/${session.user.id}/tweet`, { tweet });
      alert('つぶやきを更新しました');
    } catch (error) {
      console.error('つぶやき更新エラー:', error);
    }
  };
  
  // 出会いの目的の更新
  const handlePurposeUpdate = () => {
    router.push('/mypage/profile/purpose');
  };
  
  // ファイル選択ダイアログを手動で開く
  const openMainPhotoDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    // input要素を参照して手動でクリックする
    if (mainPhotoInputRef.current) mainPhotoInputRef.current.click();
  };
  
  // サブ写真用ファイル選択ダイアログを手動で開く
  const openSubPhotoDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    // input要素を参照して手動でクリックする
    if (subPhotoInputRef.current) subPhotoInputRef.current.click();
  };
  
  if (status === 'loading' || loading) {
    return <div className="p-4 text-center">読み込み中...</div>;
  }
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b">
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="mr-4"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">プロフィール編集</h1>
        </div>
      </header>
      
      {/* 保存中のオーバーレイ */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">保存中...</p>
            <p className="text-sm text-gray-500 mt-2">しばらくお待ちください</p>
          </div>
        </div>
      )}
      
      {/* メインコンテンツ */}
      <main className="flex-1 pb-20">
        {/* メイン写真 */}
        <div className="bg-white p-4 border-b">
          <h2 className="text-md font-medium mb-2">メイン写真</h2>
          <p className="text-sm text-gray-500 mb-3">あなたの第一印象を決める写真を設定しましょう</p>
          
          <div className="relative">
            {mainPhoto ? (
              <div className="relative w-full h-60 bg-gray-200 rounded-md overflow-hidden">
                <Image 
                  src={mainPhoto} 
                  alt="メイン写真" 
                  fill={true}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full h-60 bg-gray-200 rounded-md flex items-center justify-center">
                <input
                  type="file"
                  id="mainPhotoUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleMainPhotoUpload}
                  ref={mainPhotoInputRef}
                />
                <button 
                  onClick={openMainPhotoDialog}
                  className="flex flex-col items-center cursor-pointer bg-transparent border-0"
                >
                  <FiPlus size={40} className="text-gray-400" />
                  <span className="text-gray-500 mt-2">写真を追加</span>
                </button>
              </div>
            )}
            
            {mainPhoto && (
              <div className="absolute bottom-2 right-2">
                <input
                  type="file"
                  id="mainPhotoReplace"
                  className="hidden"
                  accept="image/*"
                  onChange={handleMainPhotoUpload}
                  ref={mainPhotoInputRef}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (mainPhotoInputRef.current) mainPhotoInputRef.current.click();
                    }}
                    className="bg-white text-gray-700 rounded-full p-2 shadow"
                  >
                    <FiPlus size={20} />
                  </button>
                  
                  <button
                    onClick={handleDeleteMainPhoto}
                    className="bg-white text-red-500 rounded-full p-2 shadow"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button className="w-full text-teal-500 mt-3 text-sm text-left">
            メイン写真の選び方について詳しく見る
          </button>
        </div>
        
        {/* サブ写真 */}
        <div className="bg-white p-4 border-b">
          <h2 className="text-md font-medium mb-2">サブ写真</h2>
          <p className="text-sm text-gray-500 mb-3">プライベート、趣味、観光、仕事、ペット、旅行など</p>
          
          <div className="grid grid-cols-3 gap-2">
            {subPhotos.map((photo, index) => (
              <div 
                key={index} 
                className="relative aspect-square bg-gray-200 rounded-md overflow-hidden"
              >
                <Image 
                  src={photo.url}
                  alt={`サブ写真 ${index + 1}`}
                  fill={true}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAsMainPhoto(photo.id)}
                      className="bg-white text-teal-500 p-2 rounded-full shadow"
                      title="メイン写真に設定"
                    >
                      ★
                    </button>
                    <button
                      onClick={() => handleDeleteSubPhoto(photo.id)}
                      className="bg-white text-red-500 p-2 rounded-full shadow"
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {subPhotos.length < 6 && (
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <input
                  type="file"
                  id="subPhotoUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleSubPhotoUpload}
                  ref={subPhotoInputRef}
                />
                <button 
                  onClick={openSubPhotoDialog}
                  className="flex items-center justify-center w-full h-full cursor-pointer bg-transparent border-0"
                >
                  <FiPlus size={24} className="text-teal-400" />
                </button>
              </div>
            )}
          </div>
          
          <button className="w-full text-teal-500 mt-3 text-sm text-left">
            サブ写真の選び方について詳しく見る
          </button>
        </div>
        
        {/* アピールタグ設定 */}
        <div className="bg-white p-4 border-b">
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
        </div>
        
        {/* つぶやき */}
        <div className="bg-white p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-medium">つぶやき</h2>
            <button 
              onClick={handleSaveTweet}
              className="text-teal-500 text-sm"
            >
              保存
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
        </div>
        
        {/* 出会いの目的 */}
        <div className="bg-white p-4 border-b">
          <h2 className="text-md font-medium mb-2">出会いの目的</h2>
          <button 
            onClick={handlePurposeUpdate}
            className="w-full py-3 flex justify-between items-center border-b"
          >
            <span>{purpose || '選択してください'}</span>
            <FiChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
        
        {/* プロフィール設定 */}
        <div className="bg-white p-4">
          <h2 className="text-md font-medium mb-3">プロフィール設定</h2>
          
          <button 
            onClick={() => router.push('/mypage/profile/bio')}
            className="w-full py-3 flex justify-between items-center border-b"
          >
            <span>自己紹介を編集</span>
            <FiChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button 
            onClick={() => router.push('/mypage/profile/basic')}
            className="w-full py-3 flex justify-between items-center border-b"
          >
            <div className="flex items-center">
              <span>基本プロフを編集</span>
              <span className="ml-2 text-teal-500 text-sm">100%完了</span>
            </div>
            <FiChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button 
            onClick={() => router.push('/mypage/profile/details')}
            className="w-full py-3 flex justify-between items-center"
          >
            <div className="flex items-center">
              <span>その他プロフを編集</span>
              <span className="ml-2 text-teal-500 text-sm">100%完了</span>
            </div>
            <FiChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </main>
    </div>
  );
}
