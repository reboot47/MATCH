'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import axios from 'axios';

// サンプルタグデータ（実際の実装ではAPIから取得）
const SAMPLE_TAGS = [
  '優しい', '誠実', '面白い', '真面目', '甘えん坊', '家庭的',
  '寂しがり', '穏やか', '積極的', '朗らか', '落ち着いてる', '話し上手',
  '聞き上手', '料理好き', '旅行好き', '映画好き', '音楽好き', '読書好き',
  'カフェ巡り', 'アウトドア', 'インドア', 'ゲーム好き', 'アニメ好き', 'スポーツ好き',
  '美容好き', 'おしゃれ', 'グルメ', 'お酒好き', 'カラオケ好き', 'ダンス好き',
  '写真好き', 'アート好き', 'DIY好き', 'ペット好き', '車好き', 'バイク好き'
];

export default function AppealTagsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ユーザーのアピールタグを取得
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      // ローカルストレージから事前選択したタグがあれば読み込む
      const storedTags = localStorage.getItem('currentAppealTags');
      if (storedTags) {
        try {
          const parsedTags = JSON.parse(storedTags);
          if (Array.isArray(parsedTags)) {
            setSelectedTags(parsedTags);
            // 使用後は削除
            localStorage.removeItem('currentAppealTags');
          }
        } catch (e) {
          console.error('保存されたタグの解析エラー:', e);
        }
      } else {
        // ローカルストレージに保存がなければAPIから取得
        fetchUserTags(session.user.id);
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);
  
  const fetchUserTags = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}/profile`);
      const userData = response.data;
      
      if (userData && userData.appealTags) {
        setSelectedTags(userData.appealTags.map((tag: any) => tag.appealTag.name));
      }
    } catch (error) {
      console.error('アピールタグ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // タグの選択・解除
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      // 最大5つまで選択可能
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        alert('アピールタグは最大5つまで選択できます');
      }
    }
  };
  
  // タグの保存
  const saveSelectedTags = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      await axios.put(`/api/users/${session.user.id}/profile`, {
        appealTags: selectedTags
      });
      router.push('/mypage/profile/edit');
    } catch (error) {
      console.error('アピールタグ保存エラー:', error);
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
          <h1 className="text-lg font-medium">アピールタグ</h1>
          <button 
            onClick={saveSelectedTags}
            className="text-teal-500 font-medium"
          >
            完了
          </button>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="flex-1 p-4">
        <p className="text-sm text-gray-500 mb-4">
          あなたの性格や趣味を表すタグを選択してください（最大5つ）
        </p>
        
        <div className="flex flex-wrap gap-2">
          {SAMPLE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-2 rounded-full text-sm flex items-center ${
                selectedTags.includes(tag)
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <FiCheck size={16} className="ml-1" />
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
