import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserCheck, 
  FaCheckCircle, 
  FaIdCard, 
  FaPhoneAlt,
  FaEnvelope,
  FaCamera,
  FaLinkedin,
  FaSpinner
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
      icon: <FaEnvelope className="w-5 h-5 text-teal-500" />,
      verified: user?.emailVerified != null,
      verifiedDate: user?.emailVerified,
      action: '認証する'
    },
    {
      id: 'photo',
      title: '写真認証',
      description: 'あなたの写真が本人であることを確認します',
      icon: <FaCamera className="w-5 h-5 text-teal-500" />,
      verified: user?.photoVerified,
      verifiedDate: user?.photoVerifiedDate,
      action: '認証する'
    },
    {
      id: 'phone',
      title: '電話番号認証',
      description: '電話番号の所有権を確認します',
      icon: <FaPhoneAlt className="w-5 h-5 text-teal-500" />,
      verified: user?.phoneVerified,
      verifiedDate: user?.phoneVerifiedDate,
      action: '認証する'
    },
    {
      id: 'id',
      title: '身分証明書認証',
      description: '身分証明書と本人の一致を確認します',
      icon: <FaIdCard className="w-5 h-5 text-teal-500" />,
      verified: user?.idVerified,
      verifiedDate: user?.idVerifiedDate,
      action: '認証する',
      premium: true
    },
    {
      id: 'linkedin',
      title: 'LinkedIn認証',
      description: 'LinkedInアカウントとの連携を確認します',
      icon: <FaLinkedin className="w-5 h-5 text-teal-500" />,
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
    if (!Array.isArray(verifications) || verifications.length === 0) {
      return 0; // 認証情報が無い場合は0を返す
    }
    const verifiedCount = verifications.filter(v => v.verified).length;
    return Math.min(Math.round((verifiedCount / verifications.length) * 10), 10);
  };

  // カード用のアニメーション
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <FaUserCheck className="mr-3 text-teal-500 w-5 h-5" /> 
        認証センター
      </h2>
      
      <div className="mb-8 bg-emerald-50 rounded-lg p-5 border border-emerald-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-lg font-bold text-teal-600">Lv{calculateVerificationLevel()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">認証レベル {calculateVerificationLevel()}/10</h3>
            <p className="text-sm text-gray-600">
              認証レベルが高いほど、マッチング率が上がります
            </p>
          </div>
        </div>
        
        <div className="w-full bg-white rounded-full h-3 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(calculateVerificationLevel() / 10) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-3 rounded-full bg-teal-500" 
          ></motion.div>
        </div>
      </div>
      
      <div className="space-y-4">
        {verifications.map((verification, index) => (
          <motion.div 
            key={verification.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className={`border rounded-lg p-5 transition-all ${
              verification.verified 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 hover:border-teal-200 hover:bg-emerald-50'
            }`}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{verification.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{verification.title}</h3>
                  {verification.verified && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20 
                      }}
                    >
                      <FaCheckCircle className="text-green-500" />
                    </motion.div>
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
                  <motion.button
                    onClick={() => startVerification(verification.id)}
                    disabled={isVerifying !== null}
                    className={`mt-3 px-4 py-2 text-sm rounded-md flex items-center justify-center ${
                      verification.premium 
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                        : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                    } transition-colors ${
                      isVerifying ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isVerifying === verification.id ? (
                      <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin h-4 w-4" />
                        処理中...
                      </span>
                    ) : verification.premium ? (
                      <>Premiumにアップグレードして{verification.action}</>
                    ) : (
                      verification.action
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-6 bg-emerald-50 rounded-md p-4 text-sm text-teal-800"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-semibold mb-2">認証のメリット:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>より多くのマッチング機会を得られます</li>
          <li>信頼性の高いユーザーとして表示されます</li>
          <li>特定の機能やサービスへのアクセス権が与えられます</li>
          <li>アカウントとプライバシーが強化されます</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
