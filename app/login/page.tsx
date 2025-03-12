"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import AuthDebugger from "../components/debug/AuthDebugger";

// useSearchParamsを使用するコンポーネントを分離
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugger, setShowDebugger] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    setIsDevMode(process.env.NODE_ENV === "development");
    const debug = searchParams.get("debug") === "true";
    setShowDebugger(debug && isDevMode);
  }, [searchParams, isDevMode]);

  useEffect(() => {
    if (!isDevMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === "D") {
        setShowDebugger(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDevMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebugInfo(null);

    try {
      console.log('ログイン試行開始:', { email });
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log('認証結果:', result);
      
      if (result?.error) {
        console.error('認証エラー:', result.error);
        setError("メールアドレスまたはパスワードが正しくありません");
        setDebugInfo({
          type: 'AUTH_ERROR',
          error: result.error,
          ok: result.ok,
          status: result.status,
          url: result.url
        });
        setLoading(false);
        return;
      }

      // ログイン成功
      console.log('認証成功、リダイレクト開始');
      router.push("/home");
    } catch (error: any) {
      console.error('ログイン例外発生:', error);
      setError("ログイン中にエラーが発生しました。後でもう一度お試しください。");
      setDebugInfo({
        type: 'EXCEPTION',
        message: error.message,
        stack: error.stack,
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setDebugInfo(null);
    try {
      // Googleログインを実行
      await signIn("google", { 
        callbackUrl: '/mypage',
        redirect: true
      });
    } catch (error: any) {
      console.error('ログインエラー:', error);
      setError("申し訳ございません。ログインに失敗しました。しばらく時間をおいてから、もう一度お試しください。");
      setDebugInfo({
        type: 'GOOGLE_AUTH_ERROR',
        message: error.message,
        stack: error.stack
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-300 mb-2">LINEBUZZ</h1>
          <p className="text-gray-600">アカウントにログインして続けましょう</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error-50 text-error-300 p-3 rounded-lg mb-6 text-sm"
          >
            {error}
            {debugInfo && process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono overflow-auto">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineMail className="h-5 w-5 text-primary-300" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                placeholder="yourname@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-5 w-5 text-primary-300" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                className="h-4 w-4 text-primary-300 focus:ring-primary-300 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                ログイン状態を保存
              </label>
            </div>
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-primary-300 hover:text-primary-400">
                パスワードをお忘れですか？
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-primary-300 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition ios-btn"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition ios-btn"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              <span>Googleでログイン</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでないですか？{" "}
            <a 
              href="/gender-selection?register=true" 
              onClick={(e) => {
                e.preventDefault();
                // ローカルストレージのクリア
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('linebuzz_selected_gender');
                  localStorage.removeItem('userGender');
                  localStorage.removeItem('isAuthenticated');
                  localStorage.setItem('isAuthenticated', 'false');
                  sessionStorage.removeItem('from_gender_selection');
                  sessionStorage.removeItem('redirecting_to_gender');
                  
                  // 確実に新しいページ読み込みで性別選択ページに遷移
                  window.location.href = '/gender-selection?register=true';
                }
              }}
              className="font-medium text-primary-300 hover:text-primary-400"
            >
              新規登録
            </a>
          </p>
        </div>

        {isDevMode && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowDebugger(prev => !prev)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showDebugger ? "デバッグ情報を隠す" : "デバッグ情報を表示"}
            </button>
            <div className="mt-2 text-xs text-gray-400">
              (Alt+Shift+D でトグル)
            </div>
          </div>
        )}
        
        {showDebugger && <AuthDebugger />}
      </motion.div>
    </div>
  );
}

// メインページコンポーネント
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">読み込み中...</div>}>
      <LoginContent />
    </Suspense>
  );
}
