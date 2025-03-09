import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = '#66cdaa',
  text
}: LoadingSpinnerProps) {
  // サイズに基づく直径
  const diameters = {
    small: 24,
    medium: 40,
    large: 64
  };

  const diameter = diameters[size];
  const strokeWidth = diameter * 0.1;
  
  // 円のパラメータ
  const center = diameter / 2;
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // アニメーションバリアント
  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
        className="relative"
        style={{ width: diameter, height: diameter }}
      >
        {/* 背景円 */}
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={`${color}40`}
            strokeWidth={strokeWidth}
          />
        </svg>
        
        {/* 回転する円 */}
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      
      {text && (
        <p className="mt-3 text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
}
