import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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

// デモ用のサンプルメディアアイテム
const demoMediaItems: MediaItem[] = [
  {
    id: 'demo-1',
    url: 'https://res.cloudinary.com/dslf46nht/image/upload/v1694789345/linebuzz/demo/photo1.jpg',
    type: 'image',
    caption: 'サンプル写真 1',
    isPrimary: true,
    sortOrder: 1
  },
  {
    id: 'demo-2',
    url: 'https://res.cloudinary.com/dslf46nht/image/upload/v1694789345/linebuzz/demo/photo2.jpg',
    type: 'image',
    caption: 'サンプル写真 2',
    sortOrder: 2
  },
  {
    id: 'demo-3',
    url: 'https://res.cloudinary.com/dslf46nht/video/upload/v1694789345/linebuzz/demo/video1.mp4',
    type: 'video',
    caption: 'サンプル動画 1',
    thumbnail: 'https://res.cloudinary.com/dslf46nht/image/upload/v1694789345/linebuzz/demo/video1_thumb.jpg',
    sortOrder: 3
  }
];

/**
 * ユーザーのメディアアイテムを管理するためのカスタムフック
 * @param initialItems 初期メディアアイテム（オプション）
 * @returns メディアアイテムと操作関数
 */
export function useMediaItems(initialItems: MediaItem[] = []) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // メディアデータを取得
  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsDemo(false);
      
      console.log('APIからメディアデータを取得します...');
      const response = await axios.get('/api/profile/media/get');
      
      console.log('APIレスポンス:', response.data);
      
      if (response.data.success) {
        setMediaItems(response.data.mediaItems || []);
        console.log('メディアデータを正常に取得しました:', response.data.mediaItems.length, '件');
      } else {
        console.warn('APIはsuccessを返しませんでした:', response.data);
        throw new Error(response.data.error || 'APIからの応答が不正です');
      }
    } catch (err) {
      console.error('メディア取得エラー:', err);
      
      // エラーの詳細をログに出力
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('APIエラーレスポンス:', err.response.data);
          console.error('APIエラーステータス:', err.response.status);
          
          // 認証エラーの場合、特別なメッセージを表示
          if (err.response.status === 401) {
            setError('認証に失敗しました。ログインしてください。');
            toast.error('認証に失敗しました。ログインしてください。');
          } else {
            setError(`メディアの取得に失敗しました: ${err.response.data.error || err.message}`);
            toast.error(`メディアの取得に失敗しました: ${err.response.data.error || err.message}`);
          }
        } else {
          setError('サーバーに接続できませんでした。ネットワーク接続を確認してください。');
          toast.error('サーバーに接続できませんでした');
        }
      } else {
        setError(`メディアの取得に失敗しました: ${err.message}`);
        toast.error(`メディアの取得に失敗しました: ${err.message}`);
      }
      
      // デモデータをフォールバックとして使用
      console.log('デモデータを表示します');
      setMediaItems(demoMediaItems);
      setIsDemo(true);
      toast.error('APIからのデータ取得に失敗しました。デモデータを表示しています。', {
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // メディアデータを更新
  const updateMediaItems = async (items: MediaItem[]) => {
    // デモモードの場合は更新をシミュレートするだけ
    if (isDemo) {
      console.log('デモモードのため、ローカルのみ更新します');
      setMediaItems(items);
      toast.success('デモモード: メディアをローカルで更新しました（サーバーには保存されません）');
      return true;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('APIにメディアデータを送信します:', items);
      const response = await axios.put('/api/profile/media', {
        mediaItems: items
      });
      
      console.log('API更新レスポンス:', response.data);
      
      if (response.data.success) {
        setMediaItems(response.data.mediaItems || items);
        return true;
      }
      return false;
    } catch (err) {
      console.error('メディア更新エラー:', err);
      
      // エラーの詳細をログに出力
      if (axios.isAxiosError(err) && err.response) {
        console.error('API更新エラーレスポンス:', err.response.data);
        console.error('API更新エラーステータス:', err.response.status);
        setError(`メディアの更新に失敗しました: ${err.response.data.error || err.message}`);
        toast.error(`メディアの更新に失敗しました: ${err.response.data.error || err.message}`);
      } else {
        setError(`メディアの更新に失敗しました: ${err.message}`);
        toast.error(`メディアの更新に失敗しました: ${err.message}`);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 初期ロード
  useEffect(() => {
    if (initialItems.length === 0) {
      fetchMediaItems();
    }
  }, []);

  return {
    mediaItems,
    setMediaItems,
    loading,
    error,
    isDemo,
    fetchMediaItems,
    updateMediaItems
  };
}
