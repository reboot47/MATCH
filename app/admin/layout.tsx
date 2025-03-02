"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  // ログインページの場合はナビゲーションを表示しない
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // ログインしていない場合の処理はコンテンツ側で行うため、ここでは単にレンダリング
  if (status === "loading" || status === "unauthenticated") {
    return <>{children}</>;
  }

  // 緑のメニュー（components/admin/AdminLayout.tsx）を使用するため、
  // ここではシンプルに子コンポーネントを返すだけ
  return <>{children}</>;
}
