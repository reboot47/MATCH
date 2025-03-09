"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FaMars, FaVenus } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ユーザー情報
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<'男性' | '女性' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    // 性別が選択されていない場合はエラー
    if (!gender) {
      setError("性別を選択してください");
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

    try {
      // 注: APIエンドポイントは後で実装されるため、一時的に直接成功フローに進みます
      console.log("登録情報：", { name, email, password, gender });
      
      // 2秒間のディレイを入れて処理中の表示を見せる
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // テスト用: ユーザーデータをローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('linebuzz_temp_user', JSON.stringify({
          name,
          email,
          registeredAt: new Date().toISOString()
        }));
      }

      // 登録フローをリファクタリングしたため、ここでは性別選択ページにリダイレクト
      router.push("/gender-selection");
    } catch (error: any) {
      setError(error.message || "登録中にエラーが発生しました。後でもう一度お試しください。");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Google認証処理は後で実装
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
              : step === 2 
              ? "あなたについて教えてください" 
              : step === 3 
              ? "安全なパスワードを設定してください"
              : "最後に性別を選択してください"}
          </p>
        </div>

        {/* ステップインジケーター */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((i) => (
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
                {i === 1 ? "基本" : i === 2 ? "詳細" : i === 3 ? "設定" : "性別"}
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
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
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
            
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-center font-medium text-gray-700 mb-6">
                    あなたの性別を選択してください
                  </h3>
                  
                  <div className="flex justify-center space-x-6">
                    <motion.div
                      className={`relative cursor-pointer w-36 flex flex-col items-center p-5 rounded-xl border-2 ${gender === '男性' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender('男性')}
                    >
                      <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                        <FaMars className="text-blue-500 text-4xl" />
                      </div>
                      <span className="font-medium text-gray-800">男性</span>
                      {gender === '男性' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                    
                    <motion.div
                      className={`relative cursor-pointer w-36 flex flex-col items-center p-5 rounded-xl border-2 ${gender === '女性' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender('女性')}
                    >
                      <div className="w-20 h-20 flex items-center justify-center bg-pink-100 rounded-full mb-4">
                        <FaVenus className="text-pink-500 text-4xl" />
                      </div>
                      <span className="font-medium text-gray-800">女性</span>
                      {gender === '女性' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      性別によって機能や課金体系が異なります。正確に選択してください。<br />
                      この選択は後から変更できません。
                    </p>
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
              {loading ? "処理中..." : step < 4 ? "次へ" : "登録する"}
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
