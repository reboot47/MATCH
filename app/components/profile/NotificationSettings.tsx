import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaEnvelope, 
  FaMobile, 
  FaRegCalendarAlt, 
  FaUserFriends,
  FaComment,
  FaHeart,
  FaSpinner
} from 'react-icons/fa';

interface NotificationOption {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationSettingsProps {
  options?: NotificationOption[];
  onSave?: (data: NotificationOption[]) => Promise<boolean>;
}

const defaultOptions: NotificationOption[] = [
  {
    id: 'matches',
    label: '新しいマッチ',
    description: '新しいマッチングがあったときに通知します',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'messages',
    label: 'メッセージ',
    description: '新しいメッセージを受信したときに通知します',
    email: false,
    push: true,
    sms: false
  },
  {
    id: 'likes',
    label: 'いいね',
    description: '誰かがあなたにいいねしたときに通知します',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'profile_views',
    label: 'プロフィール閲覧',
    description: '誰かがあなたのプロフィールを見たときに通知します',
    email: false,
    push: true,
    sms: false
  },
  {
    id: 'events',
    label: 'イベント',
    description: '近くで開催されるイベントについて通知します',
    email: true,
    push: false,
    sms: false
  },
  {
    id: 'promotions',
    label: 'プロモーション',
    description: '特別なオファーやプロモーションについて通知します',
    email: true,
    push: false,
    sms: false
  }
];

export default function NotificationSettings({ options = defaultOptions, onSave }: NotificationSettingsProps) {
  const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>(options);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getIcon = (id: string) => {
    switch (id) {
      case 'matches':
        return <FaUserFriends className="w-5 h-5" />;
      case 'messages':
        return <FaComment className="w-5 h-5" />;
      case 'likes':
        return <FaHeart className="w-5 h-5" />;
      case 'profile_views':
        return <FaUserFriends className="w-5 h-5" />;
      case 'events':
        return <FaRegCalendarAlt className="w-5 h-5" />;
      case 'promotions':
        return <FaBell className="w-5 h-5" />;
      default:
        return <FaBell className="w-5 h-5" />;
    }
  };

  const handleToggle = (optionId: string, channel: 'email' | 'push' | 'sms') => {
    setNotificationOptions(options => 
      options.map(option => 
        option.id === optionId 
          ? { ...option, [channel]: !option[channel] }
          : option
      )
    );
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        const success = await onSave(notificationOptions);
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
        <h2 className="text-xl font-bold text-gray-800">通知設定</h2>
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

      {/* 通知チャネルの説明 */}
      <div className="mb-8">
        <div className="flex items-center mb-6 justify-between border-b border-gray-200 pb-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700">通知タイプ</p>
          </div>
          <div className="flex space-x-6 sm:space-x-10">
            <div className="flex flex-col items-center">
              <div className="p-2 bg-teal-100 rounded-full text-teal-600 mb-1">
                <FaEnvelope className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-600">メール</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-teal-100 rounded-full text-teal-600 mb-1">
                <FaBell className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-600">プッシュ</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-teal-100 rounded-full text-teal-600 mb-1">
                <FaMobile className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-600">SMS</p>
            </div>
          </div>
        </div>

        {notificationOptions.map((option) => (
          <div key={option.id} className="flex items-center py-4 border-b border-gray-100 last:border-none">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center mb-1">
                <div className="text-teal-600 mr-2">
                  {getIcon(option.id)}
                </div>
                <h4 className="font-medium text-gray-800">{option.label}</h4>
              </div>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            
            <div className="flex space-x-6 sm:space-x-10">
              <div className="flex items-center justify-center w-10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={option.email}
                    onChange={() => isEditing && handleToggle(option.id, 'email')}
                    disabled={!isEditing}
                  />
                  <div className={`w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isEditing ? 'peer-checked:bg-teal-600' : 'peer-checked:bg-teal-400'}`}></div>
                </label>
              </div>
              
              <div className="flex items-center justify-center w-10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={option.push}
                    onChange={() => isEditing && handleToggle(option.id, 'push')}
                    disabled={!isEditing}
                  />
                  <div className={`w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isEditing ? 'peer-checked:bg-teal-600' : 'peer-checked:bg-teal-400'}`}></div>
                </label>
              </div>
              
              <div className="flex items-center justify-center w-10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={option.sms}
                    onChange={() => isEditing && handleToggle(option.id, 'sms')}
                    disabled={!isEditing}
                  />
                  <div className={`w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isEditing ? 'peer-checked:bg-teal-600' : 'peer-checked:bg-teal-400'}`}></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 通知頻度設定 */}
      {isEditing && (
        <div className="mt-6 bg-teal-50 rounded-md p-4 text-sm text-teal-800">
          <h4 className="font-semibold mb-2">通知設定のヒント:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>重要な通知はプッシュ通知とメールの両方で受け取ることをお勧めします</li>
            <li>通知を受け取りすぎると感じる場合は、一部のチャネルをオフにしてください</li>
            <li>SMS通知は、重要な更新や緊急の連絡にのみ使用することをお勧めします</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
}
