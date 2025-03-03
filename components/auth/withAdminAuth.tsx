'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// クライアントコンポーネント用の管理者認証HOC
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithAdminAuthComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      // セッションの読み込み中
      if (status === 'loading') return;

      // 未認証の場合
      if (status === 'unauthenticated' || !session) {
        toast.error('ログインしてください');
        router.push('/login');
        return;
      }

      // 管理者権限のチェック
      const userRole = session?.user?.role as string;
      if (userRole !== 'ADMIN' && userRole !== 'admin') {
        toast.error('管理者権限がありません');
        router.push('/');
        return;
      }

      // 認証＆権限OK
      setIsAuthorized(true);
    }, [session, status, router]);

    // 認証チェック中はローディング表示
    if (!isAuthorized) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">認証チェック中...</p>
          </div>
        </div>
      );
    }

    // 認証済みの場合、元のコンポーネントをレンダリング
    return <Component {...props} />;
  };
}
