"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronLeft, FiAlertCircle, FiCheck } from "react-icons/fi";
import { HiOutlinePhone } from "react-icons/hi";

export default function PhoneVerificationPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatPhoneNumber = (value: string) => {
    // 数字以外の文字を削除
    const numbers = value.replace(/[^\d]/g, "");
    
    // 日本の携帯電話番号フォーマット (090-1234-5678)
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSendVerificationCode = async () => {
    // 入力検証
    const numbersOnly = phoneNumber.replace(/[^\d]/g, "");
    if (numbersOnly.length !== 11) {
      setError("有効な携帯電話番号を入力してください");
      return;
    }

    setError("");
    setIsSendingCode(true);

    try {
      // 実際の実装では、ここでAPIを呼び出してSMSを送信
      console.log("認証コード送信先:", phoneNumber);
      
      // モック処理（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCodeSent(true);
      setTimeLeft(180); // 3分のカウントダウン
      setIsSendingCode(false);
    } catch (error) {
      setError("認証コードの送信に失敗しました。後でもう一度お試しください。");
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("6桁の認証コードを入力してください");
      return;
    }

    setError("");
    setIsVerifying(true);

    try {
      // 実際の実装では、ここでAPIを呼び出して検証
      console.log("検証コード:", verificationCode);
      
      // モック処理（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 成功演出を表示
      setSuccess(true);
      
      // 2秒後に次のステップへ進む
      setTimeout(() => {
        router.push("/register/verify-identity");
      }, 2000);
    } catch (error) {
      setError("認証コードが無効です。もう一度お試しください。");
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          <h1 className="text-lg font-medium ml-2">電話番号認証</h1>
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
            <HiOutlinePhone className="text-primary-500 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            電話番号認証
          </h2>
          <p className="text-gray-600 text-sm">
            安全なサービス利用のため、電話番号の認証をお願いします。SMSで認証コードをお送りします。
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
            <h3 className="text-green-800 font-medium text-lg">認証成功</h3>
            <p className="text-green-600 mt-1">電話番号の認証が完了しました</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {!codeSent ? (
              // 電話番号入力フォーム
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    携帯電話番号
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="090-1234-5678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    disabled={isSendingCode}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    ※日本国内の携帯電話番号を入力してください
                  </p>
                </div>
                
                <button
                  onClick={handleSendVerificationCode}
                  disabled={isSendingCode || phoneNumber.length < 10}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    isSendingCode || phoneNumber.length < 10
                      ? "bg-gray-200 text-gray-500"
                      : "bg-primary-500 text-white hover:bg-primary-600"
                  }`}
                >
                  {isSendingCode ? "送信中..." : "認証コードを送信"}
                </button>
              </>
            ) : (
              // 認証コード入力フォーム
              <>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    認証コード
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="6桁の認証コード"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    disabled={isVerifying}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {phoneNumber}に送信されたコードを入力
                    </p>
                    {timeLeft > 0 && (
                      <p className="text-xs text-primary-600 font-medium">
                        {formatTime(timeLeft)}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6 || timeLeft === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    isVerifying || verificationCode.length !== 6 || timeLeft === 0
                      ? "bg-gray-200 text-gray-500"
                      : "bg-primary-500 text-white hover:bg-primary-600"
                  }`}
                >
                  {isVerifying ? "認証中..." : "認証する"}
                </button>
                
                {timeLeft === 0 ? (
                  <button
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode}
                    className="w-full py-2 px-4 text-primary-500 font-medium"
                  >
                    {isSendingCode ? "送信中..." : "コードを再送信"}
                  </button>
                ) : (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    コードが届かない場合は、<span className="text-primary-500">{formatTime(timeLeft)}</span>後に再送できます
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>認証により、SMSメッセージを受信する場合があります。データ通信料がかかる場合があります。</p>
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
