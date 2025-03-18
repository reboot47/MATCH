"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface GiftAnimatorProps {
  animationType: string;
  onAnimationComplete?: () => void;
}

export default function GiftAnimator({ 
  animationType,
  onAnimationComplete 
}: GiftAnimatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  // アニメーションの持続時間に基づいて、表示を自動的に終了
  useEffect(() => {
    // アニメーションの時間を少し長くして、確実に表示されるようにする
    const animationDuration = 
      animationType === 'hearts' ? 3000 : 
      animationType === 'sparkle' ? 3000 : 
      animationType === 'luxury' ? 3000 : 3000;
    
    console.log(`アニメーション開始: ${animationType}, 持続時間: ${animationDuration}ms`);
    
    // アニメーション終了後にコールバックを実行
    const timer = setTimeout(() => {
      console.log(`アニメーション終了: ${animationType}`);
      setIsVisible(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, animationDuration);
    
    return () => clearTimeout(timer);
  }, [animationType, onAnimationComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`gift-animation ${animationType} fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
      aria-hidden="true"
    >
      {/* 背景をフルスクリーンで覆う */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* アニメーション内容 */}
      <div className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none">
        {/* アニメーションタイプに応じて表示内容を変更 */}
        {(animationType === 'hearts' || !animationType) && (
          <div className="hearts-container">
            <div className="hearts-animation">
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <div className="hearts-effect">
                  <div className="heart heart1"></div>
                  <div className="heart heart2"></div>
                  <div className="heart heart3"></div>
                  <div className="heart heart4"></div>
                  <div className="heart heart5"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {animationType === 'sparkle' && (
          <div className="sparkle-container">
            <div className="sparkle-animation">
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <div className="sparkle-effect">
                  <div className="sparkle sparkle1"></div>
                  <div className="sparkle sparkle2"></div>
                  <div className="sparkle sparkle3"></div>
                  <div className="sparkle sparkle4"></div>
                  <div className="sparkle sparkle5"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {animationType === 'luxury' && (
          <div className="luxury-container">
            <div className="luxury-animation">
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <div className="luxury-effect">
                  <div className="luxury luxury1"></div>
                  <div className="luxury luxury2"></div>
                  <div className="luxury luxury3"></div>
                  <div className="luxury luxury4"></div>
                  <div className="luxury luxury5"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
