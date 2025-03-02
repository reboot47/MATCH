"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineMail, HiArrowLeft } from "react-icons/hi";
import { toast } from "react-hot-toast";
import "../../globals.css";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 実際のAPIエンドポイントと連携する場合はここでパスワードリセットリクエストを送信
      console.log("パスワードリセットリクエスト:", email);
      
      // デモのため単純に成功扱い
      await new Promise(resolve => setTimeout(resolve, 1500)); // 遅延をシミュレート
      
      toast.success("パスワードリセットリンクを送信しました");
      setSubmitted(true);
    } catch (error) {
      console.error("パスワードリセットエラー:", error);
      toast.error("リクエスト処理中にエラーが発生しました。後でもう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">LINEBUZZ</h1>
            <p className="text-gray-600">管理者パスワードのリセット</p>
          </div>

          {!submitted ? (
            <>
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6">
                <p>管理者アカウントに登録されているメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="example@linebuzz.jp"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    リセットリンクを送信
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                <p className="font-semibold">リセットリンクを送信しました</p>
                <p className="mt-2">メールアドレス「{email}」にパスワードリセット用のリンクを送信しました。メールをご確認ください。</p>
                <p className="mt-2 text-sm">リンクの有効期限は30分間です。</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">メールが届かない場合は、迷惑メールフォルダをご確認いただくか、別のメールアドレスでお試しください。</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/admin-login" 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <HiArrowLeft className="mr-2 h-4 w-4" />
              ログイン画面に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
