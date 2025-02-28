'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

type NotificationSettings = {
  sms: {
    campaigns: boolean;
  };
  email: {
    likes: boolean;
    matches: boolean;
    messages: boolean;
    footprints: boolean;
    others: boolean;
  };
};

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    sms: {
      campaigns: false,
    },
    email: {
      likes: false,
      matches: false,
      messages: false,
      footprints: false,
      others: false,
    },
  });

  // 設定を読み込む
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/notification-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings || defaultSettings);
        }
      } catch (error) {
        console.error('通知設定の読み込みに失敗しました:', error);
      }
    };

    fetchSettings();
  }, []);

  // 設定変更時の処理
  const handleToggle = async (type: 'sms' | 'email', key: string) => {
    try {
      setIsLoading(true);
      
      // 設定を更新
      const newSettings = { ...settings };
      if (type === 'sms') {
        newSettings.sms = {
          ...newSettings.sms,
          [key]: !newSettings.sms[key as keyof typeof newSettings.sms],
        };
      } else {
        newSettings.email = {
          ...newSettings.email,
          [key]: !newSettings.email[key as keyof typeof newSettings.email],
        };
      }
      
      setSettings(newSettings);
      
      // APIに設定を保存
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: newSettings }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('APIエラー:', responseData);
        throw new Error(responseData.error || '設定の保存に失敗しました');
      }
      
      toast.success('通知設定を更新しました');
    } catch (error) {
      console.error('設定の更新に失敗しました:', error);
      toast.error(error instanceof Error ? error.message : '設定の保存に失敗しました');
      
      // エラー時は元の設定に戻す
      try {
        const response = await fetch('/api/user/notification-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings || defaultSettings);
        }
      } catch (fetchError) {
        console.error('元の設定の取得に失敗しました:', fetchError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // トグルスイッチのアニメーション
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30
  };

  const defaultSettings = {
    sms: {
      campaigns: false,
    },
    email: {
      likes: false,
      matches: false,
      messages: false,
      footprints: false,
      others: false,
    },
  };

  // スイッチコンポーネント
  const Switch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => {
    // 各スイッチ独自のアニメーション状態を持つ
    const [xPosition, setXPosition] = useState(isOn ? 26 : 2);

    // 状態が変わったら位置を更新
    useEffect(() => {
      setXPosition(isOn ? 26 : 2);
    }, [isOn]);

    return (
      <div 
        className={`relative w-14 h-7 flex items-center rounded-full px-1 transition-colors duration-300 ${
          isOn ? 'bg-blue-500' : 'bg-gray-200'
        } shadow-inner cursor-pointer`}
        onClick={onToggle}
        style={{ border: isOn ? 'none' : '1px solid #E5E5E5' }}
      >
        <motion.div 
          className="absolute w-6 h-6 bg-white rounded-full shadow-md"
          initial={false}
          animate={{ x: xPosition }}
          transition={spring}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <motion.header 
        className="bg-white border-b"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="mr-4"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">通知設定</h1>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* 注意書き */}
        <div className="p-4 text-xs text-gray-500 bg-gray-50">
          ※ 反映に時間がかかることがあります。
        </div>
        
        {/* SMS通知設定 */}
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-white py-5 px-4">
            <h2 className="text-base font-bold text-gray-800 mb-6">SMS通知の配信設定</h2>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">キャンペーンなどのお得な情報</span>
                <Switch 
                  isOn={settings.sms.campaigns} 
                  onToggle={() => handleToggle('sms', 'campaigns')} 
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* メール通知設定 */}
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="bg-white py-5 px-4">
            <h2 className="text-base font-bold text-gray-800 mb-6">メールの配信設定</h2>
            <div className="divide-y">
              {Object.entries(settings.email).map(([key, value], index) => (
                <motion.div 
                  key={key}
                  className="py-4 flex justify-between items-center"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 + index * 0.1 }}
                >
                  <span className="text-gray-700">
                    {key === 'likes' && 'いいね！をもらった時'}
                    {key === 'matches' && 'マッチングした時'}
                    {key === 'messages' && 'メッセージをもらった時'}
                    {key === 'footprints' && '足あとがついた時'}
                    {key === 'others' && 'その他のお知らせ'}
                  </span>
                  <Switch 
                    isOn={value} 
                    onToggle={() => handleToggle('email', key)} 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* メールアドレス変更リンク */}
        <motion.div 
          className="mt-4 bg-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <button
            onClick={() => router.push('/settings/email')}
            className="w-full text-left py-4 px-4 flex justify-between items-center"
          >
            <span className="text-blue-600">配信先メールアドレスを変更する</span>
            <FiChevronRight size={18} className="text-blue-600" />
          </button>
        </motion.div>
      </motion.main>
    </div>
  );
}
