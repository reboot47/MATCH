'use client';

import React from 'react';
import { useMission } from '../../contexts/MissionContext';
import { motion } from 'framer-motion';

interface MissionItemProps {
  id: string;
  type: 'easy' | 'normal' | 'premium';
  title: string;
  progress: number;
  target: number;
  reward: number;
  icon: React.ReactNode;
  description?: string;
  note?: string;
  isCompleted?: boolean;
}

export default function MissionItem({
  id,
  type,
  title,
  progress,
  target,
  reward,
  icon,
  description,
  note,
  isCompleted = false
}: MissionItemProps) {
  const { completeMission } = useMission();
  
  const getTypeColor = () => {
    switch (type) {
      case 'easy': return 'bg-teal-100 text-teal-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getProgressColor = () => {
    if (isCompleted || progress >= target) {
      return 'bg-gradient-to-r from-pink-500 to-purple-500';
    }
    
    const percentage = (progress / target) * 100;
    if (percentage >= 75) {
      return 'bg-gradient-to-r from-pink-400 to-purple-400';
    } else if (percentage >= 50) {
      return 'bg-gradient-to-r from-pink-300 to-purple-300';
    } else if (percentage >= 25) {
      return 'bg-gradient-to-r from-pink-200 to-purple-200';
    } else {
      return 'bg-gray-200';
    }
  };
  
  const handleComplete = () => {
    if (!isCompleted && progress >= target) {
      completeMission(id, reward);
    }
  };
  
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm mb-4 overflow-hidden border ${isCompleted ? 'border-teal-200' : 'border-gray-100'}`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor()}`}>
              {type === 'easy' ? '★' : type === 'normal' ? '★★' : '★★★'}
            </span>
          </div>
        </div>
        
        <div className="flex mb-2">
          <div className="mr-3 mt-1">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">{title}</h3>
            {description && (
              <p className="text-xs text-gray-600 mb-1">{description}</p>
            )}
            {note && (
              <p className="text-xs text-gray-500 italic">{note}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex-1 pr-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor()}`} 
                style={{ 
                  width: `${Math.min(100, (progress / target) * 100)}%` 
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              クリアまで {progress}/{target}
            </div>
          </div>
          
          <button
            className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg ${
              isCompleted 
                ? 'bg-gray-200 text-gray-400 cursor-default' 
                : progress >= target 
                  ? 'bg-teal-500 text-white hover:bg-teal-600' 
                  : 'bg-gray-200 text-gray-600'
            }`}
            onClick={handleComplete}
            disabled={isCompleted || progress < target}
          >
            {isCompleted ? (
              <span className="text-sm font-bold">クリア</span>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mb-1">
                  <span className="text-teal-500 text-xs font-bold">P</span>
                </div>
                <span className="text-xs font-bold">+{reward}pt</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
