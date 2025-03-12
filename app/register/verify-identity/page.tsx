"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChevronLeft, FiAlertCircle, FiCheck, FiCamera, FiUpload, FiInfo } from "react-icons/fi";

export default function IdentityVerificationPage() {
  const router = useRouter();
  const [verificationMethod, setVerificationMethod] = useState<"id" | "passport" | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleMethodSelect = (method: "id" | "passport") => {
    setVerificationMethod(method);
    setFrontImage(null);
    setBackImage(null);
    setError("");
  };

  const triggerImageUpload = (side: "front" | "back") => {
    if (side === "front" && frontInputRef.current) {
      frontInputRef.current.click();
    } else if (side === "back" && backInputRef.current) {
      backInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB未満)
    if (file.size > 5 * 1024 * 1024) {
      setError("画像サイズは5MB以下である必要があります");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (side === "front") {
        setFrontImage(event.target?.result as string);
      } else {
        setBackImage(event.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // 画像がアップロードされているか確認
    if (!frontImage) {
      setError(`${verificationMethod === "id" ? "身分証明書" : "パスポート"}の表面画像をアップロードしてください`);
      return;
    }

    if (verificationMethod === "id" && !backImage) {
      setError("身分証明書の裏面画像をアップロードしてください");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // 実際の実装では、ここでAPIを呼び出して画像をアップロード・検証
      console.log("本人確認書類をアップロード", {
        method: verificationMethod,
        hasFrontImage: !!frontImage,
        hasBackImage: !!backImage
      });
      
      // モック処理（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 成功演出を表示
      setSuccess(true);
      
      // 3秒後にプロフィール作成ページへ
      setTimeout(() => {
        router.push("/mypage/profile/new-edit");
      }, 3000);
    } catch (error) {
      setError("書類のアップロードに失敗しました。後でもう一度お試しください。");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 p-1"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium ml-2">本人確認</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto p-4"
      >
        <div className="text-center mb-8">
          <div className="bg-primary-50 inline-flex p-4 rounded-full mb-4">
            <FiCamera className="text-primary-500 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            本人確認書類の提出
          </h2>
          <p className="text-gray-600 text-sm">
            安全なコミュニティを維持するため、本人確認書類の提出をお願いしています。すべての情報は厳重に保護され、確認後に安全に保管されます。
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-start"
          >
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 p-6 rounded-xl text-center mb-6"
          >
            <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <FiCheck className="text-green-600 w-8 h-8" />
            </div>
            <h3 className="text-green-800 font-medium text-lg">確認書類を受領しました</h3>
            <p className="text-green-600 mt-1">
              審査には1〜2営業日ほどかかります。<br />
              結果はメールでお知らせします。
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* 確認書類の種類選択 */}
            {!verificationMethod ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 font-medium">確認書類を選択してください：</p>
                
                <button
                  onClick={() => handleMethodSelect("id")}
                  className="w-full p-4 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-primary-50 p-2 rounded-lg mr-3">
                    <FiInfo className="text-primary-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">身分証明書</h3>
                    <p className="text-xs text-gray-500">運転免許証、マイナンバーカード、健康保険証など</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleMethodSelect("passport")}
                  className="w-full p-4 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-primary-50 p-2 rounded-lg mr-3">
                    <FiInfo className="text-primary-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">パスポート</h3>
                    <p className="text-xs text-gray-500">顔写真ページが必要です</p>
                  </div>
                </button>
              </div>
            ) : (
              // 画像アップロードフォーム
              <>
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {verificationMethod === "id" ? "身分証明書" : "パスポート"}のアップロード
                  </h3>
                  
                  {/* 表面の画像アップロード */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2">
                      {verificationMethod === "id" ? "表面" : "顔写真ページ"}：
                    </p>
                    <input
                      type="file"
                      ref={frontInputRef}
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "front")}
                      disabled={uploading}
                    />
                    
                    {frontImage ? (
                      <div className="relative w-full h-48 mb-2">
                        <Image
                          src={frontImage}
                          alt="ID Front"
                          fill
                          className="object-contain rounded-lg border border-gray-300"
                        />
                        <button
                          onClick={() => setFrontImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          disabled={uploading}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => triggerImageUpload("front")}
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={uploading}
                      >
                        <FiUpload className="text-gray-400 w-8 h-8 mb-2" />
                        <p className="text-gray-500">クリックして画像をアップロード</p>
                        <p className="text-xs text-gray-400 mt-1">JPG、PNG形式（5MB以下）</p>
                      </button>
                    )}
                  </div>
                  
                  {/* 身分証明書の場合は裏面も要求 */}
                  {verificationMethod === "id" && (
                    <div>
                      <p className="text-sm text-gray-700 mb-2">裏面：</p>
                      <input
                        type="file"
                        ref={backInputRef}
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, "back")}
                        disabled={uploading}
                      />
                      
                      {backImage ? (
                        <div className="relative w-full h-48 mb-2">
                          <Image
                            src={backImage}
                            alt="ID Back"
                            fill
                            className="object-contain rounded-lg border border-gray-300"
                          />
                          <button
                            onClick={() => setBackImage(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            disabled={uploading}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerImageUpload("back")}
                          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                          disabled={uploading}
                        >
                          <FiUpload className="text-gray-400 w-8 h-8 mb-2" />
                          <p className="text-gray-500">クリックして画像をアップロード</p>
                          <p className="text-xs text-gray-400 mt-1">JPG、PNG形式（5MB以下）</p>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setVerificationMethod(null)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={uploading}
                  >
                    戻る
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={uploading || !frontImage || (verificationMethod === "id" && !backImage)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      uploading || !frontImage || (verificationMethod === "id" && !backImage)
                        ? "bg-gray-200 text-gray-500"
                        : "bg-primary-500 text-white hover:bg-primary-600"
                    }`}
                  >
                    {uploading ? "送信中..." : "提出する"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>アップロードされた画像は本人確認にのみ使用され、審査完了後も適切に保管されます。</p>
          <p className="mt-2">
            <Link href="/terms" className="text-primary-500 hover:underline">
              利用規約
            </Link>
            {" および "}
            <Link href="/privacy" className="text-primary-500 hover:underline">
              プライバシーポリシー
            </Link>
            に同意の上ご利用ください。
          </p>
        </div>
      </motion.div>
    </div>
  );
}
