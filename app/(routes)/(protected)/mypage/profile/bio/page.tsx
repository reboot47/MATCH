'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiChevronLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function BioEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);
  
  const MAX_CHARS = 1000; // 最大文字数
  
  // ユーザーの自己紹介を取得
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserBio(session.user.id);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);
  
  const fetchUserBio = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}/profile`);
      const userData = response.data;
      
      if (userData && userData.selfIntroduction) {
        setBio(userData.selfIntroduction);
        setCharCount(userData.selfIntroduction.length);
      }
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 自己紹介の更新
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setBio(newValue);
      setCharCount(newValue.length);
    }
  };
  
  // 自己紹介の保存
  const saveBio = async () => {
    if (!session?.user?.id) return;
    
    try {
      setSaving(true);
      await axios.put(`/api/users/${session.user.id}/profile`, {
        selfIntroduction: bio
      });
      router.push('/mypage/profile/edit');
    } catch (error) {
      console.error('自己紹介保存エラー:', error);
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => router.back()}>
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">自己紹介</h1>
          <button 
            onClick={saveBio}
            className="text-teal-500 font-medium"
            disabled={saving}
          >
            {saving ? '保存中...' : '完了'}
          </button>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="flex-1 p-4">
        <p className="text-sm text-gray-500 mb-2">
          自己紹介文を入力してください
        </p>
        
        <div className="text-xs text-right text-gray-500 mb-2">
          {charCount}/{MAX_CHARS}文字
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-md overflow-hidden shadow-sm"
        >
          <textarea
            value={bio}
            onChange={handleBioChange}
            placeholder="あなたのことを教えてください。趣味や特技、休日の過ごし方、好きな食べ物など..."
            className="w-full h-64 p-4 border-0 resize-none focus:outline-none focus:ring-0"
            maxLength={MAX_CHARS}
          />
        </motion.div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            <span className="text-red-500">※</span> 個人情報（電話番号、メールアドレス、SNSのID、住所など）は記載しないでください。
          </p>
        </div>
      </main>
    </div>
  );
}
