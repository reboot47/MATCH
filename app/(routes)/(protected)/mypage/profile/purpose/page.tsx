'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import axios from 'axios';

// 出会いの目的の選択肢
const PURPOSE_OPTIONS = [
  '恋人を探している',
  '結婚を前提にお付き合いしたい',
  '友達から発展したい',
  '気軽に話せる友達が欲しい',
  '趣味友達が欲しい',
  '相談できる人が欲しい',
  'とりあえず話してみたい'
];

export default function PurposePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [loading, setLoading] = useState(true);
  
  // ユーザーの出会いの目的を取得
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserPurpose(session.user.id);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);
  
  const fetchUserPurpose = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}/profile`);
      const userData = response.data;
      
      if (userData && userData.purpose) {
        setSelectedPurpose(userData.purpose);
      }
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 目的の選択
  const selectPurpose = (purpose: string) => {
    setSelectedPurpose(purpose);
  };
  
  // 目的の保存
  const saveSelectedPurpose = async () => {
    if (!session?.user?.id || !selectedPurpose) return;
    
    try {
      setLoading(true);
      await axios.put(`/api/users/${session.user.id}/profile`, {
        purpose: selectedPurpose
      });
      router.push('/mypage/profile/edit');
    } catch (error) {
      console.error('出会いの目的保存エラー:', error);
      setLoading(false);
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
          <h1 className="text-lg font-medium">出会いの目的</h1>
          <button 
            onClick={saveSelectedPurpose}
            className={`font-medium ${selectedPurpose ? 'text-teal-500' : 'text-gray-300'}`}
            disabled={!selectedPurpose}
          >
            完了
          </button>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="flex-1 p-4">
        <p className="text-sm text-gray-500 mb-4">
          あなたの出会いの目的を選択してください
        </p>
        
        <div className="bg-white rounded-md overflow-hidden">
          {PURPOSE_OPTIONS.map((purpose) => (
            <button
              key={purpose}
              onClick={() => selectPurpose(purpose)}
              className={`w-full p-4 text-left border-b flex justify-between items-center ${
                purpose === selectedPurpose ? 'bg-teal-50' : ''
              }`}
            >
              <span>{purpose}</span>
              {purpose === selectedPurpose && (
                <FiCheck size={20} className="text-teal-500" />
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
