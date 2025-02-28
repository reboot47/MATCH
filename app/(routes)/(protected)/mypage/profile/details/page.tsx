'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiChevronLeft, FiChevronRight, FiSave } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// ドリンク選択肢
const drinkOptions = ['飲まない', '時々飲む', '飲む', 'ガンガン飲む'];

// タバコ選択肢
const smokeOptions = ['吸わない', '時々吸う', '吸う', '電子タバコ'];

// 子供希望選択肢
const childrenOptions = ['いつか欲しい', '欲しくない', 'どちらでもよい', '既にいる'];

// 結婚観選択肢
const marriageOptions = ['いつかしたい', 'すぐにでもしたい', '考え中', 'したくない'];

type DetailsProfileData = {
  drinking?: string;
  smoking?: string;
  childrenPlan?: string;
  marriageIntention?: string;
  languages?: string[];
  interests?: string[];
};

export default function DetailsProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<DetailsProfileData>({
    languages: [],
    interests: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState('');
  const [interest, setInterest] = useState('');
  const [isFormChanged, setIsFormChanged] = useState(false);
  
  // ユーザーのプロフィール詳細情報を取得
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile(session.user.id);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}/profile`);
      const userData = response.data;
      
      // 必要なプロフィールデータを設定
      setProfileData({
        drinking: userData.drinking || '',
        smoking: userData.smoking || '',
        childrenPlan: userData.childrenPlan || '',
        marriageIntention: userData.marriageIntention || '',
        languages: userData.languages || [],
        interests: userData.interests || []
      });
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      toast.error('プロフィール情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  // プロフィール更新の処理
  const handleInputChange = (key: keyof DetailsProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
    setIsFormChanged(true);
  };
  
  // 言語追加
  const addLanguage = () => {
    if (language.trim() && !profileData.languages?.includes(language.trim())) {
      const updatedLanguages = [...(profileData.languages || []), language.trim()];
      handleInputChange('languages', updatedLanguages);
      setLanguage('');
    }
  };
  
  // 言語削除
  const removeLanguage = (index: number) => {
    const updatedLanguages = [...(profileData.languages || [])];
    updatedLanguages.splice(index, 1);
    handleInputChange('languages', updatedLanguages);
  };
  
  // 趣味・興味追加
  const addInterest = () => {
    if (interest.trim() && !profileData.interests?.includes(interest.trim())) {
      const updatedInterests = [...(profileData.interests || []), interest.trim()];
      handleInputChange('interests', updatedInterests);
      setInterest('');
    }
  };
  
  // 趣味・興味削除
  const removeInterest = (index: number) => {
    const updatedInterests = [...(profileData.interests || [])];
    updatedInterests.splice(index, 1);
    handleInputChange('interests', updatedInterests);
  };
  
  // プロフィール詳細の保存
  const saveProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      setSaving(true);
      
      // 安全なデータを作成
      const safeProfileData = {
        ...profileData,
        languages: Array.isArray(profileData.languages) ? profileData.languages : [],
        interests: Array.isArray(profileData.interests) ? profileData.interests : []
      };
      
      console.log('送信するデータ:', JSON.stringify(safeProfileData, null, 2));
      await axios.put(`/api/users/${session.user.id}/profile`, safeProfileData);
      toast.success('プロフィールを保存しました');
      setIsFormChanged(false);
      setTimeout(() => {
        router.push('/mypage/profile/edit');
      }, 500);
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
      toast.error('プロフィールの保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // Enter キーでの追加処理
  const handleKeyPress = (e: React.KeyboardEvent, addFunction: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFunction();
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <motion.header 
        className="bg-white border-b sticky top-0 z-10 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.button 
            onClick={() => router.back()} 
            className="focus:outline-none text-gray-700 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronLeft size={24} />
            <span className="text-sm ml-1">戻る</span>
          </motion.button>
          <h1 className="text-lg font-medium text-gray-800">その他プロフィール</h1>
          <motion.button 
            onClick={saveProfile}
            className={`text-teal-500 font-medium flex items-center ${saving || !isFormChanged ? 'opacity-70' : ''}`}
            disabled={saving || !isFormChanged}
            whileHover={!saving && isFormChanged ? { scale: 1.05 } : {}}
            whileTap={!saving && isFormChanged ? { scale: 0.95 } : {}}
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full mr-1"></div>
                保存中...
              </>
            ) : (
              <>
                <FiSave className="mr-1" />
                完了
              </>
            )}
          </motion.button>
        </div>
      </motion.header>
      
      {/* メインコンテンツ */}
      <main className="flex-1 p-4 space-y-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="border-b py-3 px-4 bg-gradient-to-r from-teal-50 to-white">
            <h2 className="text-teal-700 font-medium">基本情報</h2>
          </div>
          
          {/* お酒 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-3">お酒</h3>
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {drinkOptions.map(option => (
                  <motion.button
                    key={option}
                    onClick={() => handleInputChange('drinking', option)}
                    className={`py-3 rounded-md ${
                      profileData.drinking === option
                        ? 'bg-teal-100 text-teal-700 border border-teal-300 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    animate={profileData.drinking === option ? 
                      { scale: [1, 1.05, 1], backgroundColor: ["#d1fae5", "#99f6e4", "#d1fae5"] } : 
                      {}
                    }
                  >
                    {option}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* タバコ */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-3">タバコ</h3>
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {smokeOptions.map(option => (
                  <motion.button
                    key={option}
                    onClick={() => handleInputChange('smoking', option)}
                    className={`py-3 rounded-md ${
                      profileData.smoking === option
                        ? 'bg-teal-100 text-teal-700 border border-teal-300 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    animate={profileData.smoking === option ? 
                      { scale: [1, 1.05, 1], backgroundColor: ["#d1fae5", "#99f6e4", "#d1fae5"] } : 
                      {}
                    }
                  >
                    {option}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* 子どもの希望 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-3">子どもの希望</h3>
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {childrenOptions.map(option => (
                  <motion.button
                    key={option}
                    onClick={() => handleInputChange('childrenPlan', option)}
                    className={`py-3 rounded-md ${
                      profileData.childrenPlan === option
                        ? 'bg-teal-100 text-teal-700 border border-teal-300 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    animate={profileData.childrenPlan === option ? 
                      { scale: [1, 1.05, 1], backgroundColor: ["#d1fae5", "#99f6e4", "#d1fae5"] } : 
                      {}
                    }
                  >
                    {option}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* 結婚観 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-3">結婚観</h3>
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {marriageOptions.map(option => (
                  <motion.button
                    key={option}
                    onClick={() => handleInputChange('marriageIntention', option)}
                    className={`py-3 rounded-md ${
                      profileData.marriageIntention === option
                        ? 'bg-teal-100 text-teal-700 border border-teal-300 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    animate={profileData.marriageIntention === option ? 
                      { scale: [1, 1.05, 1], backgroundColor: ["#d1fae5", "#99f6e4", "#d1fae5"] } : 
                      {}
                    }
                  >
                    {option}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="border-b py-3 px-4 bg-gradient-to-r from-teal-50 to-white">
            <h2 className="text-teal-700 font-medium">プロフィール情報</h2>
          </div>
          
          {/* 言語 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-3">話せる言語</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <AnimatePresence>
                {profileData.languages?.map((lang, index) => (
                  <motion.div 
                    key={lang}
                    className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center shadow-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <span>{lang}</span>
                    <motion.button
                      onClick={() => removeLanguage(index)}
                      className="ml-2 text-teal-700 hover:text-teal-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex">
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addLanguage)}
                placeholder="言語を入力"
                className="flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <motion.button
                onClick={addLanguage}
                className="bg-teal-500 text-white px-4 py-3 rounded-r-md"
                whileHover={{ backgroundColor: "#0d9488" }}
                whileTap={{ scale: 0.95 }}
                disabled={!language.trim()}
              >
                追加
              </motion.button>
            </div>
          </div>
          
          {/* 趣味・興味 */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">趣味・興味</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <AnimatePresence>
                {profileData.interests?.map((item, index) => (
                  <motion.div 
                    key={item}
                    className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center shadow-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <span>{item}</span>
                    <motion.button
                      onClick={() => removeInterest(index)}
                      className="ml-2 text-teal-700 hover:text-teal-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex">
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addInterest)}
                placeholder="趣味・興味を入力"
                className="flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <motion.button
                onClick={addInterest}
                className="bg-teal-500 text-white px-4 py-3 rounded-r-md"
                whileHover={{ backgroundColor: "#0d9488" }}
                whileTap={{ scale: 0.95 }}
                disabled={!interest.trim()}
              >
                追加
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* 保存ボタン（フローティング） */}
        {isFormChanged && (
          <motion.div 
            className="fixed bottom-8 left-0 right-0 flex justify-center z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <motion.button
              onClick={saveProfile}
              className="bg-teal-500 text-white px-10 py-3 rounded-full shadow-lg flex items-center"
              whileHover={{ scale: 1.05, backgroundColor: "#0d9488" }}
              whileTap={{ scale: 0.95 }}
              disabled={saving}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {saving ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  変更を保存
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
