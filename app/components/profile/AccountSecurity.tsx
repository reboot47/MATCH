import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaPhone, FaShieldAlt, FaIdCard, FaSpinner } from 'react-icons/fa';

interface AccountSecurityProps {
  user: any;
  onSave?: (data: any) => Promise<boolean>;
}

export default function AccountSecurity({ user, onSave }: AccountSecurityProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationStatus, setVerificationStatus] = useState({
    email: user?.emailVerified || false,
    phone: user?.phoneVerified || false,
    identity: user?.identityVerified || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // エラーをクリア
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (isEditing) {
      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword = 'パスワードは8文字以上である必要があります';
      }

      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワードが一致しません';
      }

      if (formData.newPassword && !formData.currentPassword) {
        newErrors.currentPassword = '現在のパスワードを入力してください';
      }

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'メールアドレスの形式が正しくありません';
      }

      if (formData.phone && !/^[0-9+-]+$/.test(formData.phone)) {
        newErrors.phone = '電話番号の形式が正しくありません';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (onSave) {
      setIsSaving(true);
      
      try {
        // パスワード関連のフィールドが空の場合は、保存データから除外
        const dataToSave = {
          ...formData
        };
        
        if (!dataToSave.newPassword) {
          delete dataToSave.newPassword;
          delete dataToSave.confirmPassword;
          delete dataToSave.currentPassword;
        }

        const success = await onSave(dataToSave);
        if (success) {
          setIsEditing(false);
          // パスワードフィールドをリセット
          setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('セキュリティ情報の保存に失敗しました', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const triggerVerification = (type: 'email' | 'phone') => {
    // ここに実際の認証処理を実装する
    alert(`${type === 'email' ? 'メールアドレス' : '電話番号'}の認証プロセスを開始します`);
  };

  const startIdentityVerification = () => {
    // 身分証明書の認証プロセスを開始
    alert('身分証明書の認証プロセスを開始します');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">アカウントとセキュリティ</h2>
        {onSave && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md flex items-center ${
              isEditing 
                ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
            } transition-colors`}
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                保存中...
              </>
            ) : (
              isEditing ? '保存' : '編集'
            )}
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* メールアドレス */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="text-teal-600"><FaEnvelope className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-800">メールアドレス</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              ) : (
                <div className="text-gray-800 py-2 px-1">{formData.email || <span className="text-gray-400 italic">未設定</span>}</div>
              )}
            </div>
            
            {!isEditing && (
              <div className="flex items-center">
                <div className={`mr-2 w-3 h-3 rounded-full ${verificationStatus.email ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  {verificationStatus.email ? '認証済み' : '未認証'}
                </span>
                {!verificationStatus.email && (
                  <button
                    onClick={() => triggerVerification('email')}
                    className="ml-3 text-sm text-teal-600 hover:text-teal-800"
                  >
                    認証する
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 電話番号 */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="text-teal-600"><FaPhone className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-800">電話番号</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話番号
              </label>
              
              {isEditing ? (
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              ) : (
                <div className="text-gray-800 py-2 px-1">{formData.phone || <span className="text-gray-400 italic">未設定</span>}</div>
              )}
            </div>
            
            {!isEditing && (
              <div className="flex items-center">
                <div className={`mr-2 w-3 h-3 rounded-full ${verificationStatus.phone ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  {verificationStatus.phone ? '認証済み' : '未認証'}
                </span>
                {!verificationStatus.phone && (
                  <button
                    onClick={() => triggerVerification('phone')}
                    className="ml-3 text-sm text-teal-600 hover:text-teal-800"
                  >
                    認証する
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* パスワード */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="text-teal-600"><FaLock className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-800">パスワード</h3>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  現在のパスワード
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新しいパスワード（確認）
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="mt-2 bg-teal-50 rounded-md p-3 text-sm text-teal-800">
                <p>
                  <strong>ヒント:</strong> 安全なパスワードは、大文字、小文字、数字、記号を含む8文字以上をお勧めします。
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-gray-800">••••••••</span>
              <span className="ml-2 text-sm text-gray-500">（セキュリティのため表示されません）</span>
            </div>
          )}
        </div>

        {/* 本人確認 */}
        <div className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-center gap-2 mb-5">
            <div className="text-teal-600"><FaIdCard className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-800">本人確認</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              より安全にサービスをご利用いただくため、身分証明書による本人確認を実施しています。
              認証済みユーザーはマッチングの優先度が上がり、より多くの機能が利用できるようになります。
            </p>
            
            <div className="flex items-center">
              <div className={`mr-2 w-3 h-3 rounded-full ${verificationStatus.identity ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm">
                {verificationStatus.identity ? '認証済み' : '未認証'}
              </span>
              {!verificationStatus.identity && (
                <button
                  onClick={startIdentityVerification}
                  className="ml-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm transition-colors"
                >
                  本人確認を始める
                </button>
              )}
            </div>
          </div>
        </div>

        {/* セキュリティ対策 */}
        <div className="last:border-b-0">
          <div className="flex items-center gap-2 mb-5">
            <div className="text-teal-600"><FaShieldAlt className="w-5 h-5" /></div>
            <h3 className="font-semibold text-gray-800">セキュリティ対策</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              あなたのアカウントを安全に保つために、以下のセキュリティ対策を実施しています：
            </p>
            
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>ログイン通知</li>
              <li>不審なアクティビティの監視</li>
              <li>定期的なセキュリティチェック</li>
              <li>データの暗号化</li>
            </ul>
            
            <div className="mt-2 bg-teal-50 rounded-md p-3 text-sm text-teal-800">
              <p className="font-semibold mb-1">セキュリティのヒント:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>定期的にパスワードを変更しましょう</li>
                <li>他のサービスと同じパスワードを使い回さないでください</li>
                <li>不審なメールやメッセージに注意してください</li>
                <li>公共のWi-Fiでのログインは避けてください</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
