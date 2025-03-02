"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineShieldCheck } from "react-icons/hi";
import { toast } from "react-hot-toast";
import "../globals.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // ログイン試行制限を確認
  useEffect(() => {
    const attempts = localStorage.getItem('loginAttempts');
    const lockUntil = localStorage.getItem('lockUntil');
    
    if (attempts) {
      setLoginAttempts(parseInt(attempts, 10));
    }
    
    if (lockUntil) {
      const lockTime = parseInt(lockUntil, 10);
      if (lockTime > Date.now()) {
        setIsLocked(true);
        setLockTime(lockTime);
        
        // ロック解除までのカウントダウン
        const interval = setInterval(() => {
          if (lockTime <= Date.now()) {
            setIsLocked(false);
            localStorage.removeItem('lockUntil');
            localStorage.removeItem('loginAttempts');
            clearInterval(interval);
          } else {
            setLockTime(lockTime);
          }
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        localStorage.removeItem('lockUntil');
      }
    }
  }, []);

  // ログイン試行回数の増加と制限の設定
  const incrementLoginAttempts = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());
    
    // 5回失敗でロック（10分間）
    if (newAttempts >= 5) {
      const lockUntil = Date.now() + 10 * 60 * 1000; // 10分間
      setIsLocked(true);
      setLockTime(lockUntil);
      localStorage.setItem('lockUntil', lockUntil.toString());
      toast.error("セキュリティのため、アカウントが10分間ロックされました");
    }
  };

  // ログイン成功時のリセット
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockUntil');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // アカウントロック中の場合
    if (isLocked) {
      const remainingTime = Math.ceil((lockTime - Date.now()) / 1000 / 60);
      toast.error(`アカウントがロックされています。残り約${remainingTime}分でロックが解除されます。`);
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      console.log("ログイン試行:", { email, password });
      
      // 2要素認証が表示されている場合は、2FAコードを検証
      if (showTwoFactor) {
        // 実際のAPIエンドポイントと連携する場合には、ここでコードを検証
        if (twoFactorCode === "123456") { // デモ用コード、実際は動的に生成したものを検証
          toast.success("認証に成功しました");
          resetLoginAttempts();
          router.push("/admin/dashboard");
          return;
        } else {
          setError("認証コードが無効です。もう一度お試しください。");
          toast.error("認証コードが無効です");
          setLoading(false);
          return;
        }
      }
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/admin/dashboard",
      });

      console.log("ログイン結果:", result);

      if (result?.error) {
        console.error("ログインエラー詳細:", result.error);
        setError(`ログインエラー: ${result.error}`);
        toast.error("ログインに失敗しました");
        incrementLoginAttempts();
        setLoading(false);
        return;
      }

      // セッション取得を試みる
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        console.log("セッション情報:", session);
        
        // ADMINロールを確認
        if (session?.user?.role !== "ADMIN") {
          setError("管理者権限がありません。このアカウントには管理画面へのアクセス権限がありません。");
          toast.error("権限エラー");
          incrementLoginAttempts();
          setLoading(false);
          return;
        }
        
        // ここでは単純化のために、特定の管理者アカウントには2FAを要求
        // 実際の実装では、データベースで各管理者の2FA設定を確認する
        if (email === "admin@linebuzz.jp") {
          // 2FAの表示
          setShowTwoFactor(true);
          toast.success("認証コードを入力してください");
          // 実際のシステムでは、ここでSMSや認証アプリにコードを送信
          setLoading(false);
          return;
        }

        // ログイン成功（2FA不要の場合）
        toast.success("管理者としてログインしました");
        resetLoginAttempts();
        router.push("/admin/dashboard");
      } catch (sessionError) {
        console.error("セッション取得エラー:", sessionError);
        setError("セッション情報の取得に失敗しました。後でもう一度お試しください。");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("ログインエラー:", error);
      setError("ログイン中にエラーが発生しました。後でもう一度お試しください。");
      incrementLoginAttempts();
      setLoading(false);
    }
  };

  // ロック中の残り時間計算
  const getFormattedLockTime = () => {
    const remainingMs = lockTime - Date.now();
    if (remainingMs <= 0) return "0:00";
    
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // パスワードリセットリンクへの遷移
  const handleForgotPassword = () => {
    router.push("/admin-login/reset-password");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">LINEBUZZ</h1>
            <p className="text-gray-600">管理者パネルにログイン</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {isLocked && (
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg mb-6 text-sm">
              <p className="font-medium">アカウントが一時的にロックされています</p>
              <p>セキュリティのため、複数回のログイン失敗によりアカウントがロックされました。</p>
              <p className="mt-2">残り時間: {getFormattedLockTime()}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} method="post" className="space-y-6">
            {!showTwoFactor ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineMail className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLocked}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="example@linebuzz.jp"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    パスワード
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLocked}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLocked}
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      disabled={isLocked}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      ログイン状態を保持
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      パスワードをお忘れですか？
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-1">
                  認証コード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineShieldCheck className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="6桁のコードを入力"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  認証コードがメールまたはSMSで送信されました。有効期限は5分間です。
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {showTwoFactor ? "認証コードを確認" : "ログイン"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-xs text-center text-gray-500">
              管理者専用ページです。一般ユーザー向けのログインは
              <Link href="/login" className="text-blue-600 hover:text-blue-500">
                こちら
              </Link>
              から。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
