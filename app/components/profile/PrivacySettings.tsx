import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEye, 
  FaComments, 
  FaShieldAlt, 
  FaUserShield, 
  FaGlobe, 
  FaLock,
  FaSpinner,
  FaInfoCircle,
  FaFileAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';
import Link from 'next/link';

interface PrivacyOption {
  id: string;
  label: string;
  description: string;
  value: string;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

interface PrivacySettingsProps {
  options?: PrivacyOption[];
  onSave?: (data: PrivacyOption[]) => Promise<boolean>;
}

// デフォルトのプライバシー設定
const defaultOptions: PrivacyOption[] = [
  {
    id: 'profile_visibility',
    label: 'プロフィール表示',
    description: 'あなたのプロフィールを誰に表示するか設定します',
    value: 'matches',
    options: [
      { value: 'everyone', label: '全員', description: 'すべてのユーザーがあなたのプロフィールを見ることができます' },
      { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーだけがあなたのプロフィールを見ることができます' },
      { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーだけがあなたのプロフィールを見ることができます' }
    ]
  },
  {
    id: 'messaging',
    label: 'メッセージ受信',
    description: '誰からメッセージを受け取るか設定します',
    value: 'matches',
    options: [
      { value: 'everyone', label: '全員', description: 'すべてのユーザーからメッセージを受け取ります' },
      { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーからのみメッセージを受け取ります' },
      { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーからのみメッセージを受け取ります' }
    ]
  },
  {
    id: 'location_sharing',
    label: '位置情報の共有',
    description: 'あなたの位置情報をどのように共有するか設定します',
    value: 'city',
    options: [
      { value: 'precise', label: '正確な位置', description: '正確な現在地を共有します（より良いマッチングのために推奨）' },
      { value: 'city', label: '市区町村のみ', description: '市区町村レベルの大まかな位置情報のみを共有します' },
      { value: 'region', label: '都道府県のみ', description: '都道府県レベルの大まかな位置情報のみを共有します' },
      { value: 'none', label: '共有しない', description: '位置情報を共有しません（マッチングの質が低下する可能性があります）' }
    ]
  },
  {
    id: 'activity_visibility',
    label: 'アクティビティ表示',
    description: 'あなたのオンライン状態や最終ログイン時間を表示するか設定します',
    value: 'matches',
    options: [
      { value: 'everyone', label: '全員に表示', description: 'すべてのユーザーにあなたのアクティビティ状態を表示します' },
      { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーにのみアクティビティ状態を表示します' },
      { value: 'none', label: '表示しない', description: '誰にもアクティビティ状態を表示しません' }
    ]
  },
  {
    id: 'data_usage',
    label: 'データ利用設定',
    description: 'あなたのデータをサービス改善のために使用することを許可するか設定します',
    value: 'personalized',
    options: [
      { value: 'personalized', label: 'パーソナライズド', description: 'すべてのデータを使用してパーソナライズされた体験を提供します' },
      { value: 'limited', label: '限定的', description: '限定的なデータのみを使用します' },
      { value: 'minimal', label: '最小限', description: 'サービス提供に必要な最小限のデータのみを使用します' }
    ]
  }
];

export default function PrivacySettings({ options = defaultOptions, onSave }: PrivacySettingsProps) {
  const [privacyOptions, setPrivacyOptions] = useState<PrivacyOption[]>(options);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  // オプション値の変更
  const handleOptionChange = (optionId: string, value: string) => {
    setPrivacyOptions(options => 
      options.map(option => 
        option.id === optionId 
          ? { ...option, value }
          : option
      )
    );
  };

  // オプションの説明を表示/非表示
  const toggleOptionExpansion = (optionId: string) => {
    setExpandedOption(expandedOption === optionId ? null : optionId);
  };

  // 設定を保存
  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        const success = await onSave(privacyOptions);
        if (success) {
          setIsEditing(false);
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">プライバシー設定</h2>
        {onSave && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md flex items-center ${
              isEditing 
                ? 'bg-[#66cdaa] hover:bg-[#90ee90] text-white' 
                : 'border border-[#66cdaa] text-[#66cdaa] hover:bg-teal-50'
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

      {/* プライバシー設定の概要説明 */}
      <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="text-teal-600 mr-3 mt-1">
            <FaShieldAlt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-teal-800 font-medium mb-1">プライバシーは私たちの最優先事項です</p>
            <p className="text-teal-700 text-sm">
              あなたの個人情報と体験を制御するためのプライバシー設定をカスタマイズできます。
              これらの設定はいつでも変更可能です。
            </p>
          </div>
        </div>
      </div>

      {/* プライバシーポリシーバナー */}
      <Link href="/privacy-policy">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mb-6 bg-gradient-to-r from-[#e6f7f2] to-[#f0faf0] border border-[#90ee90] rounded-lg p-4 cursor-pointer shadow-sm hover:shadow transition-all flex items-center justify-between"
        >
          <div className="flex items-center">
            <FaFileAlt className="w-5 h-5 text-[#66cdaa] mr-3" />
            <div>
              <h3 className="font-medium text-gray-800">プライバシーポリシー</h3>
              <p className="text-sm text-gray-600">LineBuzzがあなたの情報をどのように保護しているかご確認ください</p>
            </div>
          </div>
          <FaExternalLinkAlt className="text-[#66cdaa] w-4 h-4" />
        </motion.div>
      </Link>

      {/* 設定オプション */}
      <div className="space-y-6">
        {privacyOptions.map((option) => {
          const selectedOption = option.options.find(opt => opt.value === option.value);
          const isExpanded = expandedOption === option.id;
          
          return (
            <div key={option.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  {getOptionIcon(option.id)}
                  <h3 className="font-semibold text-gray-800">{option.label}</h3>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              
              <div className="p-4 pt-2">
                {isEditing ? (
                  // 編集モード - ラジオボタン
                  <div className="space-y-3">
                    {option.options.map((opt) => (
                      <label key={opt.value} className="flex items-start cursor-pointer">
                        <div className="flex items-center h-5">
                          <input
                            type="radio"
                            name={option.id}
                            checked={option.value === opt.value}
                            onChange={() => handleOptionChange(option.id, opt.value)}
                            className="w-4 h-4 text-[#66cdaa] border-gray-300 focus:ring-[#66cdaa]"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="font-medium text-gray-700">{opt.label}</p>
                          {opt.description && <p className="text-gray-500">{opt.description}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  // 表示モード - 現在の選択
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">{selectedOption?.label}</p>
                      <button
                        onClick={() => toggleOptionExpansion(option.id)}
                        className="text-[#66cdaa] hover:text-[#90ee90] text-sm font-medium flex items-center mt-1"
                      >
                        <FaInfoCircle className="mr-1" />
                        {isExpanded ? '説明を隠す' : '詳細を表示'}
                      </button>
                    </div>
                    
                    {/* モバイル対応のためのセレクトボックス（編集モードでないとき） */}
                    <div className="md:hidden">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm border border-[#66cdaa] text-[#66cdaa] rounded hover:bg-teal-50"
                      >
                        変更
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 説明の展開パネル */}
                {isExpanded && !isEditing && selectedOption?.description && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded"
                  >
                    {selectedOption.description}
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* プライバシーポリシーへのリンク */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          詳細については
          <Link href="/privacy-policy" className="text-[#66cdaa] hover:underline ml-1">
            プライバシーポリシー
          </Link>
          をご覧ください
        </p>
      </div>
    </motion.div>
  );
}

// オプションごとのアイコンを取得
function getOptionIcon(id: string) {
  switch (id) {
    case 'profile_visibility':
      return <FaEye className="w-5 h-5 text-[#66cdaa]" />;
    case 'messaging':
      return <FaComments className="w-5 h-5 text-[#66cdaa]" />;
    case 'location_sharing':
      return <FaGlobe className="w-5 h-5 text-[#66cdaa]" />;
    case 'activity_visibility':
      return <FaUserShield className="w-5 h-5 text-[#66cdaa]" />;
    case 'data_usage':
      return <FaLock className="w-5 h-5 text-[#66cdaa]" />;
    default:
      return <FaShieldAlt className="w-5 h-5 text-[#66cdaa]" />;
  }
}
