"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaMars, FaVenus } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";

// SearchParamsを使用するコンポーネントを分離
// Suspenseでラップするため
 function GenderSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gender, setGender] = useState<'男性' | '女性' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const { checkRegistrationStatus, saveUser } = useUser();
  
  // URLパラメータからユーザー情報を取得し、既存ユーザーかチェック
  useEffect(() => {
    const authProvider = searchParams.get("provider");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    
    // メールアドレスがあれば、既存ユーザーかチェック
    if (email) {
      // 既に登録済みのユーザーかチェック
      const isRegistered = checkRegistrationStatus(email);
      
      if (isRegistered) {
        console.log('既存ユーザーを検出しました。ダッシュボードにリダイレクトします。');
        // 既存ユーザーの場合はダッシュボードにリダイレクト
        router.push('/dashboard');
        return;
      }
      
      // 新規ユーザーの場合は情報を設定
      setUserInfo({
        authProvider: authProvider || "credentials",
        email: email,
        name: name || "",
      });
    } else {
      // URLパラメータがない場合はローカルストレージから取得
      const storedUser = localStorage.getItem('linebuzz_temp_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserInfo({
            ...parsedUser,
            authProvider: "credentials"
          });
        } catch (e) {
          console.error("ユーザー情報の解析に失敗しました", e);
        }
      }
    }
  }, [searchParams, router, checkRegistrationStatus]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gender) {
      setError("性別を選択してください");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // ユーザー情報と性別を結合
      const completeUserInfo = {
        ...userInfo,
        gender,
        isRegistered: true,
        registeredAt: new Date().toISOString()
      };
      
      console.log("登録完了情報:", completeUserInfo);
      
      // UserContextを使用してユーザー情報を保存
      saveUser(completeUserInfo);
      
      // 登録済みユーザーをローカルストレージからクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem('linebuzz_temp_user');
      }
      
      // 1.5秒間のディレイを入れて処理中の表示を見せる
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 登録完了後、ホームページへリダイレクト
      router.push("/home");
    } catch (error: any) {
      setError(error.message || "登録中にエラーが発生しました。後でもう一度お試しください。");
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
          <p className="text-gray-600">もう一歩です！あなたの性別を選択してください</p>
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

        {userInfo && (
          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-primary-700">
              {userInfo.authProvider === "google" ? "Google" : "メール"}で登録: <span className="font-medium">{userInfo.email}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading || !gender}
              className="py-3 px-8 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-300 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition ios-btn"
            >
              {loading ? "処理中..." : "登録を完了する"}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            登録することで、LINEBUZZ の
            <a href="/terms" className="text-primary-300 hover:underline">利用規約</a>および
            <a href="/privacy" className="text-primary-300 hover:underline">プライバシーポリシー</a>に同意したことになります。
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// メインページコンポーネント
export default function GenderSelectionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">読み込み中...</div>}>
      <GenderSelectionContent />
    </Suspense>
  );
}
