/**
 * 管理者認証チェック用コンポーネント
 */
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

/**
 * 管理者ロールをチェックするHOC
 */
export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function WithAdminAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    
    useEffect(() => {
      // セッションのロード中は何もしない
      if (status === 'loading') return;
      
      // ログインしていない場合はログインページへリダイレクト
      if (status === 'unauthenticated') {
        toast.error('ログインが必要です');
        router.push('/admin-login?callbackUrl=/admin/dashboard');
        return;
      }
      
      // セッションからロールを直接チェック（高速パス）
      if (session?.user?.role === 'ADMIN' || session?.user?.role === 'admin') {
        console.log('セッションから管理者権限を検出:', session.user.role);
        setIsAdmin(true);
        setIsChecking(false);
        return;
      }
      
      // セッションからの高速チェックに失敗した場合はAPIで詳細チェック
      const checkAdminStatus = async () => {
        try {
          console.log('管理者APIチェックを実行...', { session });
          // 管理者ユーザー情報を取得
          const response = await fetch('/api/auth/admin-check');
          const data = await response.json();
          
          console.log('管理者APIチェック結果:', data);
          
          if (response.ok && data.isAdmin) {
            setIsAdmin(true);
          } else {
            console.error('管理者権限なし:', data.error);
            toast.error('管理者権限がありません');
            setIsAdmin(false);
            router.push('/admin-login'); // 権限がない場合は管理者ログインページへ
          }
        } catch (error) {
          console.error('管理者権限チェックエラー:', error);
          setIsAdmin(false);
          router.push('/admin-login');
        } finally {
          setIsChecking(false);
        }
      };
      
      checkAdminStatus();
    }, [status, router]);
    
    // ローディング中
    if (isChecking) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">管理者権限を確認中...</p>
          </div>
        </div>
      );
    }
    
    // 管理者の場合のみコンテンツを表示
    return isAdmin ? <WrappedComponent {...props} /> : null;
  };
}

/**
 * 管理者かどうかを確認するAPIエンドポイント
 */
export async function checkAdminStatus() {
  try {
    const response = await fetch('/api/auth/admin-check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('管理者権限確認エラー:', error);
    return false;
  }
}
