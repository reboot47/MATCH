import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';  

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
 * リトライ可能なfetch関数
 * @param fetchFn 実行する非同期関数
 * @param maxRetries 最大リトライ回数
 * @param baseDelay ベース待機時間（ミリ秒）
 */
async function retryFetch<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (err) {
      lastError = err;
      
      // 認証エラーの場合はリトライせずにすぐエラーを投げる
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.log(`認証エラー（401）が発生したため、リトライをスキップします。`);
        throw err;
      }
      
      // 最後のリトライだった場合はエラーを投げる
      if (attempt === maxRetries - 1) {
        throw err;
      }
      
      // エクスポネンシャルバックオフ（指数関数的に待機時間を増やす）
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`APIリクエスト失敗（${attempt + 1}/${maxRetries}）。${delay}ms後にリトライします...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

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
  const router = useRouter();
  const { data: session, status } = useSession();  

  // セッション状態に変更があったときに実行
  useEffect(() => {
    // セッションの状態をログに出力（デバッグ用）
    console.log('セッション状態:', {
      status,
      isAuthenticated: !!session,
      userId: session?.user?.id
    });
    
    // ログアウト状態でメディアデータが必要な場合はデモデータを表示
    if (status === 'unauthenticated' && !isDemo && mediaItems.length === 0) {
      console.log('未ログイン状態のため、デモデータを表示します');
      setMediaItems(demoMediaItems);
      setIsDemo(true);
      toast.error('ログインしていません。デモデータを表示しています。', {
        id: 'auth-demo-data',
        duration: 5000
      });
    }
  }, [status, session, isDemo, mediaItems.length]);

  // メディアデータを取得
  const fetchMediaItems = async () => {
    // 未ログイン状態ならデモデータを返す
    if (status === 'unauthenticated') {
      console.log('未ログイン状態のため、APIリクエストをスキップしてデモデータを表示します');
      setMediaItems(demoMediaItems);
      setIsDemo(true);
      setLoading(false);
      setError(null);
      toast.error('ログインしていません。デモデータを表示しています。', {
        id: 'auth-demo-data',
        duration: 5000
      });
      
      // ユーザーにログインを促す
      setTimeout(() => {
        router.push('/login?callbackUrl=/profile');
      }, 2000);
      
      return;
    }
    
    // セッションがロード中の場合は待機
    if (status === 'loading') {
      console.log('セッション読み込み中...');
      setLoading(true);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setIsDemo(false);
      
      console.log('APIからメディアデータを取得します...');
      
      const response = await retryFetch(
        () => axios.get('/api/profile/media/get', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }),
        3,  // 最大3回リトライ
        1000 // 初回リトライは1秒後
      );
      
      console.log('APIレスポンス:', response.data);
      
      // モックデータかどうかを確認
      const isMockData = response.headers['x-mock-data'] === 'true';
      if (isMockData) {
        console.log('モックデータが返されました:', response.headers);
        setIsDemo(true);
      }
      
      if (response.data.success) {
        setMediaItems(response.data.mediaItems || []);
        console.log('メディアデータを正常に取得しました:', response.data.mediaItems.length, '件');
        
        if (isMockData) {
          toast.error('APIからのデータ取得に問題があります。デモデータを表示しています。', {
            id: 'mock-data',
            duration: 5000
          });
        }
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
            toast.error('認証エラー: ログインが必要です', {
              id: 'auth-error',
              duration: 5000
            });
            
            // 認証エラーの場合はログインページにリダイレクト
            console.log('認証エラーのため、ログインページにリダイレクトします');
            setTimeout(() => {
              router.push('/login?callbackUrl=/profile');
            }, 1500);
            
            return; // 早期リターン
          } else {
            setError(`メディアの取得に失敗しました: ${err.response.data.error || err.message}`);
            toast.error(`メディアの取得に失敗しました: ${err.response.data.error || err.message}`, {
              id: 'fetch-error',
            });
          }
        } else if (err.request) {
          // リクエストは送信されたがレスポンスがない場合（サーバー接続エラー）
          setError('サーバー接続に問題があります。管理者にお問い合わせください。');
          toast.error('サーバー接続に問題があります。管理者にお問い合わせください。', {
            id: 'server-connection-error',
            duration: 7000
          });
        } else {
          setError('サーバーに接続できませんでした。ネットワーク接続を確認してください。');
          toast.error('サーバーに接続できませんでした', {
            id: 'network-error',
          });
        }
      } else {
        setError(`メディアの取得に失敗しました: ${err.message}`);
        toast.error(`メディアの取得に失敗しました: ${err.message}`, {
          id: 'unknown-error',
        });
      }
      
      // デモデータをフォールバックとして使用
      console.log('デモデータを表示します');
      setMediaItems(demoMediaItems);
      setIsDemo(true);
      toast.error('APIからのデータ取得に失敗しました。デモデータを表示しています。', {
        id: 'fallback-demo-data',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // メディアデータを更新
  const updateMediaItems = async (items: MediaItem[]) => {
    // 未ログイン状態なら更新できないことを通知
    if (status === 'unauthenticated') {
      toast.error('ログインしていないため更新できません。ログインしてください。', {
        id: 'auth-update-error',
        duration: 5000
      });
      
      // ユーザーにログインを促す
      setTimeout(() => {
        router.push('/login?callbackUrl=/profile');
      }, 2000);
      
      return false;
    }
    
    // デモモードの場合は更新をシミュレートするだけ
    if (isDemo) {
      console.log('デモモードのため、ローカルのみ更新します');
      setMediaItems(items);
      toast.success('デモモード: メディアをローカルで更新しました（サーバーには保存されません）', {
        id: 'demo-update',
      });
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
        setMediaItems(items);
        toast.success('メディアを正常に更新しました', {
          id: 'update-success',
        });
        return true;
      } else {
        throw new Error(response.data.error || 'APIからの応答が不正です');
      }
    } catch (err) {
      console.error('メディア更新エラー:', err);
      
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('認証に失敗しました。ログインしてください。');
        toast.error('認証エラー: ログインが必要です', {
          id: 'auth-update-error',
          duration: 5000
        });
        
        // 認証エラーの場合はログインページにリダイレクト
        setTimeout(() => {
          router.push('/login?callbackUrl=/profile');
        }, 1500);
      } else if (axios.isAxiosError(err) && !err.response) {
        // サーバー接続エラー
        setError('サーバー接続に問題があります。管理者にお問い合わせください。');
        toast.error('サーバー接続に問題があります。管理者にお問い合わせください。', {
          id: 'server-connection-error',
          duration: 7000
        });
      } else {
        setError(`メディアの更新に失敗しました: ${err.message}`);
        toast.error(`メディアの更新に失敗しました: ${axios.isAxiosError(err) ? err.response?.data?.error || err.message : err.message}`, {
          id: 'update-error',
          duration: 5000
        });
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    mediaItems,
    loading,
    error,
    isDemo,
    fetchMediaItems,
    updateMediaItems,
    setMediaItems,
    isAuthenticated: status === 'authenticated'
  };
}
