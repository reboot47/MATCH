'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext';
import { 
  Zap, CheckCircle2, Calendar, Camera, MessageCircle, Medal, 
  Clock, Gift, Award, Star, Mail, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

// ポイント獲得タスクの定義
const dailyTasks = [
  {
    id: 'login',
    name: '毎日ログイン',
    points: 10,
    description: '毎日アプリにログインするだけで獲得',
    icon: <Calendar className="text-blue-500" size={20} />,
    completed: true,
    cooldown: '24時間',
  },
  {
    id: 'profile_photo',
    name: 'プロフィール写真更新',
    points: 50,
    description: '週に1回、新しい写真をアップロード',
    icon: <Camera className="text-pink-500" size={20} />,
    completed: false,
    cooldown: '7日間',
  },
  {
    id: 'message_reply',
    name: 'メッセージ返信',
    points: 5,
    description: '男性からのメッセージに返信する',
    icon: <MessageCircle className="text-green-500" size={20} />,
    completed: false,
    cooldown: 'メッセージごと',
    perMessage: true,
  },
  {
    id: 'profile_complete',
    name: 'プロフィール完成度',
    points: 100,
    description: 'プロフィールを100%完成させる',
    icon: <CheckCircle2 className="text-purple-500" size={20} />,
    completed: false,
    oneTime: true,
  },
];

const achievementTasks = [
  {
    id: 'verification',
    name: '本人確認完了',
    points: 300,
    description: '身分証明書で本人確認を完了する',
    icon: <Medal className="text-amber-500" size={20} />,
    completed: true,
    progress: 100,
    oneTime: true,
  },
  {
    id: 'active_days',
    name: '継続ログイン',
    points: 500,
    description: '30日間連続でログイン',
    icon: <Clock className="text-blue-600" size={20} />,
    completed: false,
    progress: 70,
    maxProgress: 30,
  },
  {
    id: 'received_gifts',
    name: 'ギフト受取',
    points: 50,
    description: '男性ユーザーからギフトを受け取る',
    icon: <Gift className="text-pink-500" size={20} />,
    completed: false,
    progress: 3,
    maxProgress: 10,
  },
  {
    id: 'good_dates',
    name: '良いデート評価',
    points: 200,
    description: 'デート後に良い評価を獲得',
    icon: <Star className="text-yellow-500" size={20} />,
    completed: false,
    progress: 2,
    maxProgress: 5,
  },
];

const specialEvents = [
  {
    id: 'welcome_campaign',
    name: '新規登録キャンペーン',
    points: 500,
    description: '2025年3月31日までの限定キャンペーン',
    icon: <Award className="text-purple-500" size={20} />,
    endDate: '2025-03-31',
    completed: false,
  },
  {
    id: 'invite_friends',
    name: '友達招待',
    points: 300,
    description: '友達を招待して登録してもらう',
    icon: <Mail className="text-blue-500" size={20} />,
    perFriend: true,
    completed: false,
  },
  {
    id: 'special_event',
    name: '春の恋愛イベント参加',
    points: 200,
    description: 'オンラインの春恋愛イベントに参加',
    icon: <Bell className="text-pink-500" size={20} />,
    endDate: '2025-03-20',
    completed: false,
  },
];

export default function EarnPointsPage() {
  const { user, points, addPoints } = useUser();
  const [activeTab, setActiveTab] = useState<'daily' | 'achievements' | 'special'>('daily');
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null);

  // ポイント獲得処理
  const handleClaimPoints = async (taskId: string, amount: number) => {
    setClaimingTaskId(taskId);

    try {
      // 実際のAPI呼び出しはここで行う
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ポイント追加
      await addPoints(amount, `タスク「${taskId}」達成報酬`);
      
      // UI更新
      console.log(`${amount}ポイントを獲得しました！`);
    } catch (error) {
      console.error('ポイント獲得処理に失敗しました', error);
    } finally {
      setClaimingTaskId(null);
    }
  };

  const getTaskList = () => {
    switch(activeTab) {
      case 'daily':
        return dailyTasks;
      case 'achievements':
        return achievementTasks;
      case 'special':
        return specialEvents;
      default:
        return dailyTasks;
    }
  };

  return (
    <div className="max-w-md mx-auto pb-20 px-4">
      <header className="py-6">
        <h1 className="text-2xl font-bold text-center">ポイント獲得</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Zap size={24} className="text-primary" />
          <span className="text-xl font-semibold">{points?.balance || 0} ポイント</span>
        </div>
        <p className="text-center text-gray-500 mt-2">
          様々なタスクでポイントを獲得できます
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'daily' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('daily')}
          >
            デイリー
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'achievements' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('achievements')}
          >
            実績
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'special' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('special')}
          >
            特別
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {getTaskList().map((task) => (
              <motion.div
                key={task.id}
                className={`border rounded-lg p-4 ${
                  task.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${task.completed ? 'bg-gray-100' : 'bg-primary/10'}`}>
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{task.name}</h3>
                      <div className="flex items-center">
                        <Zap size={16} className={`${task.completed ? 'text-gray-400' : 'text-primary'} mr-1`} />
                        <span className={`font-bold ${task.completed ? 'text-gray-400' : 'text-primary'}`}>
                          {task.points} pts
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    
                    {/* 実績プログレスバー */}
                    {'progress' in task && !task.completed && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>進捗</span>
                          <span>{task.progress}/{task.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* クールダウン表示 */}
                    {'cooldown' in task && (
                      <div className="text-xs text-gray-500 mt-1">
                        リセット: {task.cooldown}
                      </div>
                    )}
                    
                    {/* 終了日表示 */}
                    {'endDate' in task && (
                      <div className="text-xs text-gray-500 mt-1">
                        終了日: {task.endDate}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-3">
                  {task.completed ? (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full flex items-center">
                      <CheckCircle2 size={16} className="mr-1" /> 獲得済み
                    </span>
                  ) : (
                    <button
                      className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
                        claimingTaskId === task.id || 'progress' in task && task.progress < task.maxProgress
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary-dark'
                      }`}
                      onClick={() => handleClaimPoints(task.id, task.points)}
                      disabled={claimingTaskId === task.id || ('progress' in task && task.progress < task.maxProgress)}
                    >
                      {claimingTaskId === task.id 
                        ? '処理中...' 
                        : 'progress' in task && task.progress < task.maxProgress
                          ? 'タスク完了が必要'
                          : 'ポイントを獲得'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold mb-3">ポイントの使い方</h2>
        <ul className="space-y-3">
          <li className="flex items-center p-2 border-b border-gray-100">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Star className="text-primary" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">プロフィール強調</h3>
              <p className="text-sm text-gray-500">あなたのプロフィールを目立たせます</p>
            </div>
            <div className="text-primary font-medium">100 pts</div>
          </li>
          <li className="flex items-center p-2 border-b border-gray-100">
            <div className="bg-blue-50 p-2 rounded-full mr-3">
              <Gift className="text-blue-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">ギフト交換</h3>
              <p className="text-sm text-gray-500">ポイントを各種ギフトに交換できます</p>
            </div>
            <div className="text-primary font-medium">500+ pts</div>
          </li>
          <li className="flex items-center p-2">
            <div className="bg-purple-50 p-2 rounded-full mr-3">
              <Award className="text-purple-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">特別イベント参加</h3>
              <p className="text-sm text-gray-500">特別なマッチングイベントに参加</p>
            </div>
            <div className="text-primary font-medium">300 pts</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
