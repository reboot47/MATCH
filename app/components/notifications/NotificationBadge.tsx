'use client';

import React from 'react';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa';
import { useNotification } from '../../contexts/NotificationContext';

interface NotificationBadgeProps {
  size?: number;
  className?: string;
}

export default function NotificationBadge({ size = 22, className = '' }: NotificationBadgeProps) {
  const { unreadCount } = useNotification();

  return (
    <div className={`relative inline-block ${className}`}>
      <Link href="/notifications" className="text-gray-600 block">
        <FaBell size={size} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}
