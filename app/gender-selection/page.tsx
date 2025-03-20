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
  const { checkRegistrationStatus, setUser } = useUser();
  
  // URLパラメータとローカルストレージから情報取得
  useEffect(() => {
    // ページが読み込まれたことを記録
    localStorage.setItem('gender_selection_page_loaded', 'true');
    console.log('✅ 性別選択ページが読み込まれました');
    
    const checkUserStatus = async () => {
      // ローディング中は何もしない
      if (loading) return;

      // 登録フローからのアクセスか確認
      const isRegistration = searchParams.get("register") === "true";
      const fromGoogle = searchParams.get("provider") === "google";
      const email = searchParams.get("email");

      try {
        // デバッグデータを出力
        console.log('✅ 性別選択ページロード時のデータ:', { 
          isRegistration, 
          fromGoogle, 
          email,
          hasStoredUser: !!localStorage.getItem('linebuzz_user')
        });

        // Google認証からのループを防ぐ
        if (fromGoogle) {
          const googleAuthCompleted = sessionStorage.getItem('google_auth_completed');
          if (googleAuthCompleted === 'true') {
            console.log('ご利用ありがとうございます。性別を選択してください。');
            return;
          }
          sessionStorage.setItem('google_auth_completed', 'true');
        }

        // メールアドレスがある場合の処理
        if (email) {
          const isRegistered = await checkRegistrationStatus(email);
          if (isRegistered && !isRegistration) {
            setUserInfo({
              authProvider: searchParams.get("provider") || "credentials",
              email,
              name: searchParams.get("name") || ""
            });
          }
        }
      } catch (error) {
        console.error('ユーザー情報の処理中にエラーが発生しました:', error);
        setError('申し訳ございません。処理中にエラーが発生しました。');
      }
    };

    checkUserStatus();
  }, [searchParams]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gender) {
      setError('性別をお選びください。');
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // 登録フローからのアクセスか確認
      const isRegistration = searchParams.get("register") === "true";
      // Google認証からのアクセスか確認
      const fromGoogle = searchParams.get("provider") === "google";
      
      try {
        // ユーザー情報を作成
        const completeUserInfo = {
          id: Math.random().toString(36).substring(2, 9),
          name: userInfo?.name || '',
          email: userInfo?.email || '',
          gender,
          age: null,
          bio: '',
          location: '',
          profileCompletionPercentage: 30,
          isVerified: false,
          interests: [],
          isOnline: true,
          registeredAt: new Date().toISOString()
        };

        try {
          // リダイレクトの前にすべてのデータを確実に保存
          const genderValue = gender === '男性' ? 'male' : 'female';
          const timestamp = new Date().getTime();
          
          // ローカルストレージに確実に保存
          localStorage.setItem('linebuzz_user', JSON.stringify(completeUserInfo));
          localStorage.setItem('userGender', genderValue);
          localStorage.setItem('linebuzz_is_logged_in', 'true');
          localStorage.setItem('gender_value', genderValue);
          localStorage.setItem('gender_timestamp', timestamp.toString());
          localStorage.setItem('linebuzz_selected_gender', gender); // 日本語表記も保存
          
          // ユーザーコンテキストに保存
          setUser(completeUserInfo);
          
          // デバッグ情報
          console.log('✅ 性別選択完了', { gender, genderValue, timestamp });
          
          // 成功メッセージを表示
          setError('');
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-50 text-green-700 px-6 py-4 rounded-lg shadow-lg z-50';
          successMessage.innerHTML = '✅ 性別の設定が完了しました。';
          document.body.appendChild(successMessage);
          
          // 一部の古い必要ない項目だけを削除
          localStorage.removeItem('linebuzz_temp_user');
          
          // 処理中の表示を見せる
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // ブラウザのwindow.locationを使用して直接遷移
          // Next.jsのrouterではなく、ブラウザのナティブなナビゲーションを使用
          if (isRegistration) {
            if (fromGoogle) {
              // Google認証からの場合はマイページにリダイレクト
              window.location.href = `/mypage?from_google=true&gender_set=${timestamp}`;
            } else {
              // 登録ページへの遷移時にfrom_genderパラメータを追加
              window.location.href = `/register?from_gender=${timestamp}`;
            }
          } else {
            // マイページへの遷移
            window.location.href = `/mypage?gender_set=${timestamp}`;
          }
        } catch (err) {
          console.error('性別保存中にエラーが発生しました:', err);
          setError('すみません、保存中にエラーが発生しました。再度お試しください。');
          setLoading(false);
        }
      } catch (error) {
        console.error('処理中にエラーが発生しました:', error);
        setError('申し訳ございませんが、処理中にエラーが発生いたしました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    } catch (error: any) {
      setError('申し訳ございませんが、処理中にエラーが発生いたしました。お手数ですが、後ほど再度お試しください。');
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
            {searchParams.get("register") === "true" 
              ? "まずはあなたの性別を教えてください" 
              : "もう一歩です！あなたの性別を選択してください"}            
          </p>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-primary-500"
            >
              処理中です。しばらくお待ちください...
            </motion.div>
          )}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-error-50 text-error-300 p-4 rounded-lg mb-6 text-sm flex items-center justify-between"
          >
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-2 text-error-400 hover:text-error-500 focus:outline-none"
            >
              ✕
            </button>
          </motion.div>
        )}

        {userInfo && (
          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-primary-700">
              {userInfo.authProvider === "google" ? "Google" : "メール"}で登録: <span className="font-medium">{userInfo.email}</span>
            </p>
          </div>
        )}

        <div className="text-right mb-4">
          <button 
            type="button" 
            onClick={() => {
              if (typeof window !== 'undefined') {
                // 性別情報をリセット
                localStorage.removeItem('linebuzz_selected_gender');
                localStorage.removeItem('userGender');
                console.log('性別情報をリセットいたしました');
                
                // ページをリロード
                window.location.reload();
              }
            }}
            className="text-xs text-primary-300 hover:text-primary-400 underline"
          >
            性別の選択をやり直す
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-center font-medium text-gray-700 mb-6">
              あなたの性別を選択してください
            </h3>
            
            <div className="flex justify-center space-x-6">
              <motion.div
                className={`relative cursor-pointer w-36 flex flex-col items-center p-5 rounded-xl border-2 ${gender === '男性' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGender('男性');
                  // セッションストレージに保存
                  sessionStorage.setItem('selected_gender', '男性');
                }}
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
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGender('女性');
                  // セッションストレージに保存
                  sessionStorage.setItem('selected_gender', '女性');
                }}
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
              <p className="text-sm text-gray-600 leading-relaxed">
                お客様に最適なサービスをご提供するため、性別によって機能やサービスが異なります。<br />
                正確にお選びください。なお、この選択は後から変更できません。
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading || !gender}
              className="py-3 px-8 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-300 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ios-btn transform hover:scale-102 active:scale-98"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </span>
              ) : searchParams.get("register") === "true" ? (
                <span className="flex items-center">
                  次のステップへ
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              ) : (
                <span className="flex items-center">
                  登録を完了する
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="leading-relaxed">
            登録を完了すると、LINEBUZZ の
            <a href="/terms" className="text-primary-400 hover:text-primary-500 hover:underline transition-colors duration-200">利用規約</a>および
            <a href="/privacy" className="text-primary-400 hover:text-primary-500 hover:underline transition-colors duration-200">プライバシーポリシー</a>に同意したことになります。
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
