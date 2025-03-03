"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  // サーバーサイドでリダイレクト
  redirect('/admin-login');
  
  // クライアントサイドでリダイレクト（念のため）
  useEffect(() => {
    window.location.href = '/admin-login';
  }, []);
  
  // 下記のコードは実行されない
  return null;
}
