"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, Gender } from "@/components/UserContext";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FaMars, FaVenus } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ユーザー情報
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<'男性' | '女性' | "">("");

  // 必ず性別選択から始めるようにするためのリダイレクト処理
  useEffect(() => {
    console.log('レジスターページ読み込み: 初期チェック開始');
    // 画面表示前に即座にチェック
    if (typeof window !== 'undefined') {
      // URLパラメータから直接性別選択ページから来たか確認
      const urlParams = new URLSearchParams(window.location.search);
      const fromGenderParam = urlParams.get('from_gender');
      
      // 可能な限りすべてのソースから性別情報を取得
      const genderInStorage = localStorage.getItem('gender_value');
      const userGender = localStorage.getItem('userGender');
      const linebuzzGender = localStorage.getItem('linebuzz_selected_gender');
      
      // デバッグ情報ログ
      console.log('登録ページチェック:', {
        fromGenderParam,
        hasGenderValue: !!genderInStorage,
        genderValue: genderInStorage,
        hasUserGender: !!userGender,
        userGender: userGender,
        hasLinebuzzGender: !!linebuzzGender,
        linebuzzGender: linebuzzGender,
        url: window.location.href
      });
      
      // 性別選択ページからのリダイレクトパラメータがない場合
      if (!fromGenderParam) {
        // いずれかの場所に性別情報があれば登録続行
        const hasGenderInfo = genderInStorage || userGender || linebuzzGender;
        
        if (!hasGenderInfo) {
          // 直接登録ページにアクセスした場合、データもない場合は強制的に性別選択ページにリダイレクト
          console.log('性別情報が見つかりません。性別選択ページにリダイレクトします');
          
          // window.locationを使用して直接ナビゲーション
          window.location.href = '/gender-selection?register=true&redirect=register';
          return;
        } else {
          console.log('性別情報がすでに存在します:', { genderInStorage, userGender, linebuzzGender });
          // 性別情報がある場合は、そのまま登録処理を進める
        }
      } else {
        // URLからパラメータを削除するため、クリーンなURLをブラウザ履歴に追加
        window.history.replaceState({}, document.title, '/register');
        console.log('性別選択ページからの遷移を検出しました。登録処理を続行します');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    setError("");

    // パスワード確認
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }
    
    // ローカルストレージから性別を取得 - 複数のソースを確認
    const genderValue = localStorage.getItem('gender_value');
    const userGender = localStorage.getItem('userGender');
    const legacyGender = localStorage.getItem('linebuzz_selected_gender');
    
    // いずれかのソースから性別をチェック
    let detectedGender = genderValue || userGender || legacyGender;
    if (!detectedGender || (detectedGender !== 'male' && detectedGender !== 'female' && detectedGender !== '男性' && detectedGender !== '女性')) {
      console.log('有効な性別情報が見つかりません:', { genderValue, userGender, legacyGender });
      setError('性別情報が見つかりません。性別選択に移動します。');
      window.location.href = '/gender-selection?register=true&redirect=register';
      setLoading(false);
      return;
    }
    
    // 形式を統一して日本語表記にする
    const selectedGender = (detectedGender === 'male' || detectedGender === '男性') ? '男性' : '女性';

    try {
      // 注: APIエンドポイントは後で実装されるため、一時的に直接成功フローに進みます
      console.log("登録情報：", { name, email, password });
      
      // 2秒間のディレイを入れて処理中の表示を見せる
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ユーザーデータの作成 - UserProfile型に互換性を持たせる
      const userData = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        gender: selectedGender as '男性' | '女性', // Gender型に互換性を持たせる
        age: 25, // デフォルト値を設定
        bio: "",
        location: "",
        profileCompletionPercentage: 30,
        isVerified: true,
        interests: [],
        isOnline: true,
        registeredAt: new Date().toISOString()
      };
      
      // ユーザーデータをローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('linebuzz_temp_user', JSON.stringify(userData));
        // ログイン状態を保存
        localStorage.setItem('linebuzz_is_logged_in', 'true');
        console.log('ユーザー情報をローカルストレージに保存しました', userData);
      }
      
      // UserContextにユーザー情報を保存
      setUser(userData);
      console.log('UserContextにユーザー情報を保存しました', userData);

      // 登録完了後、マイページに強制リダイレクト
      // ディレイを少し長めにしてデータが確実に保存されるようにする
      setTimeout(() => {
        router.push('/mypage');
      }, 500);
    } catch (error: any) {
      setError(error.message || "登録中にエラーが発生しました。後でもう一度お試しください。");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      console.log('Google認証開始');

      // 必要なローカルストレージの値をクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem('linebuzz_selected_gender');
        localStorage.removeItem('userGender');
        localStorage.removeItem('isAuthenticated');
        localStorage.setItem('isAuthenticated', 'false');
        sessionStorage.removeItem('from_gender_selection');
        sessionStorage.removeItem('redirecting_to_gender');
      }

      // Google認証後、性別選択ページにリダイレクト
      // 型別選択の情報を保持し、直接マイページかプロフィール設定ページに進む
      const storedGender = localStorage.getItem('linebuzz_selected_gender');
      if (storedGender) {
        // Google認証後に直接プロフィール設定ページにリダイレクト
        localStorage.setItem('auth_redirect', `/profile/setup?provider=google&gender=${storedGender}`);
      } else {
        // 性別がない場合は引き続き性別選択ページへ
        localStorage.setItem('auth_redirect', '/gender-selection?register=true&provider=google');
      }
      
      // Google認証情報を保持
      sessionStorage.setItem('is_google_registration', 'true');
      
      await signIn("google", { 
        // 一時的にホームページにリダイレクト
        callbackUrl: "/" 
      });
    } catch (error: any) {
      console.error('Google登録エラー:', error);
      setError("Googleアカウントでの登録中にエラーが発生しました。後でもう一度お試しください。");
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
          <p className="text-gray-600">
            {step === 1 
              ? "基本情報を入力してください" 
              : "安全なパスワードを設定してください"}
          </p>
        </div>

        {/* ステップインジケーター */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  i <= step 
                    ? "border-primary-300 bg-primary-300 text-white" 
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {i < step ? "✓" : i}
              </div>
              <span 
                className={`text-xs mt-1 ${
                  i <= step ? "text-primary-300" : "text-gray-400"
                }`}
              >
                {i === 1 ? "基本情報" : "パスワード設定"}
              </span>
            </div>
          ))}
          
          {/* 繋ぐライン */}
          <div className="absolute left-1/2 top-40 transform -translate-x-1/2 w-full max-w-[300px] z-0">
            <div className="relative h-[2px] bg-gray-300">
              <motion.div 
                className="absolute h-full bg-primary-300"
                initial={{ width: "0%" }}
                animate={{ width: `${(step - 1) * 33.33}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error-50 text-error-300 p-3 rounded-lg mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">


            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    お名前
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineUser className="h-5 w-5 text-primary-300" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                      placeholder="田中 太郎"
                    />
                  </div>
                </div>

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
                      placeholder="example@example.com"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-primary-300 hover:text-primary-400 focus:outline-none ios-btn"
                      >
                        {showPassword ? (
                          <HiOutlineEyeOff className="h-5 w-5" />
                        ) : (
                          <HiOutlineEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    パスワード（確認）
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-primary-300" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                

              </motion.div>
            )}
            

          </AnimatePresence>

          <div className="flex justify-between items-center pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition ios-btn"
              >
                戻る
              </button>
            ) : (
              <div></div> 
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-300 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition ios-btn"
            >
              {loading ? "処理中..." : step < 2 ? "次へ" : "登録する"}
            </button>
          </div>
        </form>

        {step === 1 && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  または
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 ios-btn"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                <span>Googleで登録</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちですか？{" "}
            <Link
              href="/login"
              className="font-medium text-primary-300 hover:underline"
            >
              ログイン
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
