'use client';

import React from 'react';
import Link from 'next/link';
import { FaFlag } from 'react-icons/fa';
import { useMission } from '../../contexts/MissionContext';

interface MissionBadgeProps {
  size?: number;
  className?: string;
}

export default function MissionBadge({ size = 22, className = '' }: MissionBadgeProps) {
  const { missions } = useMission();
  
  // 完了していないミッションの数をカウント
  const incompleteMissions = missions.filter(mission => !mission.isCompleted).length;
  
  // 達成可能なミッション（進捗が100%だが完了していないもの）をカウント
  const completableMissions = missions.filter(
    mission => !mission.isCompleted && mission.progress >= mission.target
  ).length;

  return (
    <div className={`relative inline-block ${className}`}>
      <Link href="/missions" className="text-gray-600 block">
        <FaFlag size={size} />
        {incompleteMissions > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {completableMissions > 0 ? '!' : incompleteMissions > 9 ? '9+' : incompleteMissions}
          </span>
        )}
      </Link>
    </div>
  );
}
