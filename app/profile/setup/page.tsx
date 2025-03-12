"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useUser, Gender } from "@/components/UserContext";
import { HiOutlineUser, HiOutlineLocationMarker, HiOutlinePencilAlt } from "react-icons/hi";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function ProfileSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  
  // URL パラメータから情報を取得
  useEffect(() => {
    const provider = searchParams.get("provider");
    const gender = searchParams.get("gender");
    
    // Google認証からのアクセスか確認
    const fromGoogle = provider === "google" || sessionStorage.getItem('is_google_registration') === 'true';
    
    // 性別がパラメータにない場合、ローカルストレージから取得
    let userGender = gender;
    if (typeof window !== 'undefined' && !userGender) {
      userGender = localStorage.getItem('linebuzz_selected_gender');
    }
    
    // Google認証からの場合で、性別情報があれば処理を継続
    if (fromGoogle && userGender) {
      console.log('Google認証からのアクセス、性別情報:', userGender);
      // セッションストレージのフラグをクリア
      sessionStorage.removeItem('is_google_registration');
      return;
    }
    
    // 必要な情報がない場合
    if (!userGender) {
      console.log('性別情報がありません');
      // 性別情報がない場合は性別選択ページにリダイレクト
      router.push("/gender-selection?register=true");
      return;
    }
    
    // Google認証の場合はNextAuthからユーザー情報を取得（実際のアプリではセッション情報から取得）
    // ここではダミーデータを使用
    if (provider === "google") {
      // セッションから取得するロジックをここに実装
      // 例: const session = await getSession();
      setName("Googleユーザー"); // 仮の名前
    }
  }, [searchParams, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!name || !age) {
        setError("すべての必須項目を入力してください");
        return;
      }
      setStep(2);
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const gender = searchParams.get("gender") || localStorage.getItem('linebuzz_selected_gender') || "未設定";
      
      // ユーザー情報を作成 (型エラーを修正)
      const userData = {
        id: Math.random().toString(36).substring(2, 9), // 実際のアプリでは適切なIDを生成
        name,
        age: parseInt(age),
        gender: gender as Gender,
        location,
        bio,
        profileCompletionPercentage: 60,
        isVerified: true, // インターフェースで必要なプロパティ
        interests: [], // 初期値は空配列
        isOnline: true, // オンライン状態
        isAuthenticated: true, // 追加プロパティ
      };
      
      // ローカルストレージに保存（実際のアプリではAPIに送信）
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isProfileComplete', 'true');
      
      // このフラグでリダイレクトループを防止
      sessionStorage.setItem('profile_completed', 'true');
      
      // Google認証関連のフラグをクリア
      sessionStorage.removeItem('is_google_registration');
      sessionStorage.removeItem('google_auth_completed');
      
      // UserContextに設定
      setUser(userData);
      
      console.log('プロフィール設定完了、マイページに遷移します');
      
      // 少し遅延を入れてアニメーションを見せる
      setTimeout(() => {
        // マイページに遷移
        router.push('/mypage');
      }, 800);
    } catch (error: any) {
      setError(error.message || "プロフィール設定中にエラーが発生しました。後でもう一度お試しください。");
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
              ? "基本プロフィール情報を設定してください" 
              : "あなたについてもう少し教えてください"}
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-4">
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
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
                    お名前（ニックネーム）
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineUser className="h-5 w-5 text-primary-300" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                      placeholder="ニックネーム"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    年齢
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineUser className="h-5 w-5 text-primary-300" />
                    </div>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="18"
                      max="100"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                      placeholder="20"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    住んでいる地域
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-primary-300" />
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                      placeholder="東京都新宿区"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    自己紹介
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <HiOutlinePencilAlt className="h-5 w-5 text-primary-300" />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition ios-form"
                      placeholder="あなたについて教えてください"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
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
                className={`py-3 px-6 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition ios-btn ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "処理中..." : step === 1 ? "次へ" : "プロフィールを設定"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            プロフィールは後からいつでも変更できます
          </p>
        </div>
      </motion.div>
    </div>
  );
}
