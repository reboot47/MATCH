import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserCheck, 
  FaCheckCircle, 
  FaIdCard, 
  FaPhoneAlt,
  FaEnvelope,
  FaCamera,
  FaLinkedin
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface VerificationCenterProps {
  user: any;
}

export default function VerificationCenter({ user }: VerificationCenterProps) {
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  const verifications = [
    {
      id: 'email',
      title: 'メール認証',
      description: 'メールアドレスの所有権を確認します',
      icon: <FaEnvelope className="text-blue-500" />,
      verified: user?.emailVerified != null,
      verifiedDate: user?.emailVerified,
      action: '認証する'
    },
    {
      id: 'photo',
      title: '写真認証',
      description: 'あなたの写真が本人であることを確認します',
      icon: <FaCamera className="text-indigo-500" />,
      verified: user?.photoVerified,
      verifiedDate: user?.photoVerifiedDate,
      action: '認証する'
    },
    {
      id: 'phone',
      title: '電話番号認証',
      description: '電話番号の所有権を確認します',
      icon: <FaPhoneAlt className="text-green-500" />,
      verified: user?.phoneVerified,
      verifiedDate: user?.phoneVerifiedDate,
      action: '認証する'
    },
    {
      id: 'id',
      title: '身分証明書認証',
      description: '身分証明書と本人の一致を確認します',
      icon: <FaIdCard className="text-amber-500" />,
      verified: user?.idVerified,
      verifiedDate: user?.idVerifiedDate,
      action: '認証する',
      premium: true
    },
    {
      id: 'linkedin',
      title: 'LinkedIn認証',
      description: 'LinkedInアカウントとの連携を確認します',
      icon: <FaLinkedin className="text-blue-700" />,
      verified: user?.linkedinVerified,
      verifiedDate: user?.linkedinVerifiedDate,
      action: '連携する',
      premium: true
    }
  ];

  // 認証開始
  const startVerification = (id: string) => {
    setIsVerifying(id);
    
    // 実際はAPIを呼び出して認証プロセスを開始する
    setTimeout(() => {
      setIsVerifying(null);
      toast.success(`${verifications.find(v => v.id === id)?.title}を開始しました`);
    }, 1500);
  };

  // 日付のフォーマット
  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ja-JP');
  };

  // ユーザーの認証レベルを計算
  const calculateVerificationLevel = () => {
    const verifiedCount = verifications.filter(v => v.verified).length;
    return Math.min(Math.round((verifiedCount / verifications.length) * 10), 10);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <FaUserCheck className="mr-2 text-blue-500" /> 
        認証センター
      </h2>
      
      <div className="mb-8 bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-blue-600">Lv{calculateVerificationLevel()}</span>
          </div>
          <div>
            <h3 className="font-semibold">認証レベル {calculateVerificationLevel()}/10</h3>
            <p className="text-sm text-gray-600">
              認証レベルが高いほど、マッチング率が上がります
            </p>
          </div>
        </div>
        
        <div className="w-full bg-white rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-blue-600" 
            style={{ width: `${(calculateVerificationLevel() / 10) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {verifications.map(verification => (
          <div 
            key={verification.id}
            className={`border rounded-lg p-4 ${
              verification.verified ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{verification.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{verification.title}</h3>
                  {verification.verified && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                  {verification.premium && !verification.verified && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{verification.description}</p>
                
                {verification.verified ? (
                  <p className="text-xs text-green-600 mt-2">
                    認証済み: {formatDate(verification.verifiedDate)}
                  </p>
                ) : (
                  <button
                    onClick={() => startVerification(verification.id)}
                    disabled={isVerifying !== null}
                    className={`mt-3 px-4 py-1.5 text-sm rounded-md ${
                      verification.premium 
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    } transition-colors ${
                      isVerifying ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isVerifying === verification.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        処理中...
                      </span>
                    ) : verification.premium ? (
                      <>Premiumにアップグレードして{verification.action}</>
                    ) : (
                      verification.action
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
