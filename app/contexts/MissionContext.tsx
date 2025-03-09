'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/components/UserContext';
import toast from 'react-hot-toast';

// ポイントの型定義
interface PointsState {
  regular: number;
  limited: number;
  expiring: number;
  total: number;
}

// ミッションの型定義
interface Mission {
  id: string;
  title: string;
  type: 'easy' | 'normal' | 'premium';
  progress: number;
  target: number;
  reward: number;
  isCompleted: boolean;
  expiresAt?: string;
}

// ミッションコンテキストの型定義
interface MissionContextType {
  missions: Mission[];
  points: PointsState;
  setPoints: (points: PointsState) => void;
  completeMission: (missionId: string, reward: number) => void;
  updateMissionProgress: (missionId: string, progress: number) => void;
  getMissionById: (missionId: string) => Mission | undefined;
}

// デフォルト値
const defaultContext: MissionContextType = {
  missions: [],
  points: { regular: 0, limited: 0, expiring: 0, total: 0 },
  setPoints: () => {},
  completeMission: () => {},
  updateMissionProgress: () => {},
  getMissionById: () => undefined,
};

// コンテキスト作成
const MissionContext = createContext<MissionContextType>(defaultContext);

// プロバイダーの型
interface MissionProviderProps {
  children: ReactNode;
}

// ミッションプロバイダーコンポーネント
export const MissionProvider = ({ children }: MissionProviderProps) => {
  const { user } = useUser();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [points, setPoints] = useState<PointsState>({
    regular: 5,
    limited: 0,
    expiring: 5,
    total: 10,
  });

  // 日付をチェックしてミッションをリセットする関数
  const checkAndResetMissions = () => {
    // 最終チェック日を取得
    const lastChecked = localStorage.getItem('lastMissionCheck');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
    
    // 今週の月曜日を計算
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=日曜日, 1=月曜日, ...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 日曜日は特別処理
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const thisMonday = monday.toISOString().split('T')[0];
    
    if (!lastChecked || lastChecked !== today) {
      // デイリーミッションのリセット
      const updatedMissions = missions.map(mission => {
        // ミッションIDが「daily」で始まるものをリセット
        if (mission.id.startsWith('daily')) {
          return {
            ...mission,
            progress: 0,
            isCompleted: false
          };
        }
        
        // ウィークリーミッションのリセット（月曜日の場合）
        if (mission.id.startsWith('weekly') && mondayOffset === 0) {
          return {
            ...mission,
            progress: 0,
            isCompleted: false
          };
        }
        
        return mission;
      });
      
      setMissions(updatedMissions);
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      localStorage.setItem('lastMissionCheck', today);
      
      // 週の初めなら通知
      if (mondayOffset === 0) {
        toast('今週のミッションが更新されました！', { icon: '🎯' });
      }
    }
  };

  // 初期データのロード
  useEffect(() => {
    // ローカルストレージからミッションと進捗状況を取得
    const storedMissions = localStorage.getItem('missions');
    const storedPoints = localStorage.getItem('points');
    
    // 初期ミッションデータ
    const initialMissions: Mission[] = [
      {
        id: 'daily-1',
        title: 'いいね❤️を15人に送信してみよう！',
        type: 'easy',
        progress: 7,
        target: 15,
        reward: 1,
        isCompleted: false,
      },
      {
        id: 'daily-2',
        title: '20人のプロフィールを訪れてみよう👣',
        type: 'normal',
        progress: 17,
        target: 20,
        reward: 2,
        isCompleted: false,
      },
      {
        id: 'daily-3',
        title: '本日のピックアップを完了しよう！',
        type: 'premium',
        progress: 1,
        target: 1,
        reward: 3,
        isCompleted: true,
      },
      {
        id: 'weekly-1',
        title: 'プロフィール写真を更新しよう',
        type: 'premium',
        progress: 0,
        target: 1,
        reward: 5,
        isCompleted: false,
      },
      {
        id: 'weekly-2',
        title: 'メッセージを3人と交換しよう',
        type: 'normal',
        progress: 2,
        target: 3,
        reward: 10,
        isCompleted: false,
      },
      {
        id: 'weekly-3',
        title: 'ライブ配信を30分視聴しよう',
        type: 'easy',
        progress: 15,
        target: 30,
        reward: 8,
        isCompleted: false,
      },
    ];
    
    // 初期ポイントデータ
    const initialPoints: PointsState = {
      regular: 5,
      limited: 0,
      expiring: 5,
      total: 10,
    };
    
    if (storedMissions) {
      setMissions(JSON.parse(storedMissions));
    } else {
      setMissions(initialMissions);
      localStorage.setItem('missions', JSON.stringify(initialMissions));
    }
    
    if (storedPoints) {
      setPoints(JSON.parse(storedPoints));
    } else {
      setPoints(initialPoints);
      localStorage.setItem('points', JSON.stringify(initialPoints));
    }
    
    // ミッションリセットの確認
    checkAndResetMissions();
  }, []);
  
  // 定期的にミッションをチェック（タブが再アクティブ化された時など）
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndResetMissions();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [missions]);

  // ミッションを完了してポイントを付与する
  const completeMission = (missionId: string, reward: number) => {
    // ミッションの完了状態を更新
    const updatedMissions = missions.map(mission => 
      mission.id === missionId ? { ...mission, isCompleted: true } : mission
    );
    
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    // ポイントを加算
    const updatedPoints = {
      ...points,
      regular: points.regular + reward,
      total: points.total + reward,
    };
    
    setPoints(updatedPoints);
    localStorage.setItem('points', JSON.stringify(updatedPoints));
    
    // 男性ユーザーと女性ユーザーで異なるメッセージを表示
    if (user?.gender === 'male') {
      toast.success(`ミッション達成！+${reward}ポイント獲得しました！`);
    } else {
      toast.success(`ミッション達成！+${reward}ポイント獲得しました！報酬が増えました！`);
    }
  };

  // ミッションの進捗を更新する
  const updateMissionProgress = (missionId: string, progress: number) => {
    const mission = missions.find(m => m.id === missionId);
    
    if (!mission || mission.isCompleted) return;
    
    const updatedMissions = missions.map(m => 
      m.id === missionId ? { ...m, progress: Math.min(m.target, progress) } : m
    );
    
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    // 進捗が目標に達した場合は通知
    const updatedMission = updatedMissions.find(m => m.id === missionId);
    if (updatedMission && updatedMission.progress >= updatedMission.target && !updatedMission.isCompleted) {
      toast('ミッションが達成可能になりました！', {
        icon: '🎉',
      });
    }
  };

  // 特定のミッションを取得する
  const getMissionById = (missionId: string) => {
    return missions.find(mission => mission.id === missionId);
  };

  // ポイントを直接設定する関数
  const updatePoints = (newPoints: PointsState) => {
    setPoints(newPoints);
    localStorage.setItem('points', JSON.stringify(newPoints));
  };

  return (
    <MissionContext.Provider 
      value={{ 
        missions, 
        points, 
        setPoints: updatePoints,
        completeMission, 
        updateMissionProgress,
        getMissionById
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

// カスタムフック
export const useMission = () => useContext(MissionContext);
