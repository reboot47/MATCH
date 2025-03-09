'use client';

import React from 'react';
import Image from 'next/image';

type CampaignType = 'gold' | 'video' | 'event';

interface CampaignIconProps {
  type: CampaignType;
  className?: string;
}

export default function CampaignIcon({ type, className = '' }: CampaignIconProps) {
  const getBackground = () => {
    switch (type) {
      case 'gold':
        return 'bg-gradient-to-br from-yellow-300 to-amber-500';
      case 'video':
        return 'bg-gradient-to-br from-blue-300 to-indigo-500';
      case 'event':
        return 'bg-gradient-to-br from-pink-300 to-rose-500';
      default:
        return 'bg-gradient-to-br from-gray-200 to-gray-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'gold':
        return '💖';
      case 'video':
        return '🌟';
      case 'event':
        return '🎉';
      default:
        return '✨';
    }
  };

  return (
    <div className={`w-full h-full overflow-hidden rounded ${className}`}>
      <div className={`w-full h-full flex items-center justify-center ${getBackground()}`}>
        <div className="text-2xl">{getIcon()}</div>
      </div>
    </div>
  );
}
