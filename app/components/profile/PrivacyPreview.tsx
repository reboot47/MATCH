import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEye, 
  FaEyeSlash, 
  FaLocationArrow, 
  FaLock, 
  FaShieldAlt, 
  FaUserCircle,
  FaInfoCircle,
  FaRegClock
} from 'react-icons/fa';
import Image from 'next/image';

interface PrivacyPreviewProps {
  userName: string;
  userImage?: string;
  privacySettings: {
    profileVisibility: string;
    locationSharing: string;
    activityVisibility: string;
  };
  viewerType: 'everyone' | 'matches' | 'verified' | 'none';
}

export default function PrivacyPreview({
  userName,
  userImage = '/images/default-avatar.png',
  privacySettings,
  viewerType
}: PrivacyPreviewProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  // 閲覧者タイプに基づいてプロフィールが表示可能かどうかを確認
  const canViewProfile = () => {
    const { profileVisibility } = privacySettings;
    
    switch (profileVisibility) {
      case 'everyone':
        return true;
      case 'matches':
        return viewerType === 'matches' || viewerType === 'verified';
      case 'verified':
        return viewerType === 'verified';
      default:
        return false;
    }
  };

  // 位置情報の表示レベルを計算
  const getLocationDisplay = () => {
    if (!canViewProfile()) return null;
    
    const { locationSharing } = privacySettings;
    
    // 例として、実際の位置情報をモック
    switch (locationSharing) {
      case 'precise':
        return '東京都渋谷区道玄坂2-11-1（500m）';
      case 'city':
        return '東京都渋谷区';
      case 'region':
        return '東京都';
      case 'none':
      default:
        return null;
    }
  };

  // アクティビティ情報の表示を計算
  const getActivityDisplay = () => {
    if (!canViewProfile()) return null;
    
    const { activityVisibility } = privacySettings;
    
    // 閲覧者タイプに基づいてアクティビティが表示可能かどうかを確認
    let canViewActivity = false;
    
    switch (activityVisibility) {
      case 'everyone':
        canViewActivity = true;
        break;
      case 'matches':
        canViewActivity = viewerType === 'matches' || viewerType === 'verified';
        break;
      case 'none':
      default:
        canViewActivity = false;
        break;
    }
    
    return canViewActivity ? '最終ログイン: 3時間前' : null;
  };

  // 閲覧者タイプに基づくラベルを取得
  const getViewerTypeLabel = () => {
    switch (viewerType) {
      case 'matches':
        return 'マッチしたユーザー';
      case 'verified':
        return '認証済みユーザー';
      case 'none':
        return '閲覧不可能';
      case 'everyone':
      default:
        return '一般ユーザー';
    }
  };

  return (
    <div className="relative">
      {/* インフォメーションアイコン */}
      <button 
        onClick={() => setShowInfoModal(!showInfoModal)}
        className="absolute top-2 right-2 text-gray-500 hover:text-[#66cdaa] z-10"
        aria-label="情報"
      >
        <FaInfoCircle className="w-5 h-5" />
      </button>
      
      {/* インフォメーションモーダル */}
      {showInfoModal && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-9 right-0 bg-white p-3 rounded-md shadow-lg z-20 w-64 text-sm"
        >
          <h4 className="font-medium text-gray-800 mb-1">プレビューについて</h4>
          <p className="text-gray-600 mb-2">
            これは、あなたのプロフィールが他のユーザーにどのように表示されるかを示すプレビューです。
            上部のタブを切り替えることで、異なるタイプのユーザーから見た表示を確認できます。
          </p>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowInfoModal(false)}
              className="text-[#66cdaa] hover:underline"
            >
              閉じる
            </button>
          </div>
          <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white transform rotate-45"></div>
        </motion.div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* ヘッダー部分 - 閲覧者タイプセレクター */}
        <div className="bg-gray-50 border-b border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FaEye className="w-4 h-4 mr-2 text-gray-500" />
              <span>表示プレビュー: <span className="font-medium text-gray-700">{getViewerTypeLabel()}</span></span>
            </div>
          </div>
        </div>
        
        {/* プレビューコンテンツ */}
        <div className="p-4">
          {canViewProfile() ? (
            <div className="space-y-4">
              {/* プロフィールヘッダー */}
              <div className="flex items-center">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mr-3 border border-gray-200">
                  <Image
                    src={userImage}
                    alt={userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{userName}</h3>
                  
                  {/* アクティビティステータス */}
                  {getActivityDisplay() && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <FaRegClock className="w-3 h-3 mr-1" />
                      {getActivityDisplay()}
                    </div>
                  )}
                  
                  {/* 位置情報 */}
                  {getLocationDisplay() && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <FaLocationArrow className="w-3 h-3 mr-1" />
                      {getLocationDisplay()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* プレースホルダーコンテンツ */}
              <div className="space-y-3">
                <div className="h-16 rounded-md bg-gray-100 animate-pulse"></div>
                <div className="h-6 w-3/4 rounded-md bg-gray-100 animate-pulse"></div>
                <div className="h-6 w-1/2 rounded-md bg-gray-100 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-gray-50 rounded-full p-4 mb-3">
                <FaEyeSlash className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">プロフィールは非公開です</h3>
              <p className="text-gray-500 text-sm text-center max-w-xs">
                あなたのプライバシー設定では、このタイプのユーザーはあなたのプロフィールを閲覧できません。
              </p>
            </div>
          )}
        </div>
        
        {/* プライバシー設定のサマリー */}
        <div className="bg-gray-50 border-t border-gray-100 p-3">
          <div className="flex items-center justify-center text-xs">
            <div className="flex items-center mx-2">
              <FaUserCircle className="w-3 h-3 mr-1 text-gray-500" />
              <span className={`${canViewProfile() ? 'text-[#66cdaa]' : 'text-gray-500'}`}>
                プロフィール: {canViewProfile() ? '表示' : '非表示'}
              </span>
            </div>
            <div className="flex items-center mx-2">
              <FaLocationArrow className="w-3 h-3 mr-1 text-gray-500" />
              <span className={`${getLocationDisplay() ? 'text-[#66cdaa]' : 'text-gray-500'}`}>
                位置: {getLocationDisplay() ? (privacySettings.locationSharing === 'precise' ? '正確' : '一部') : '非表示'}
              </span>
            </div>
            <div className="flex items-center mx-2">
              <FaRegClock className="w-3 h-3 mr-1 text-gray-500" />
              <span className={`${getActivityDisplay() ? 'text-[#66cdaa]' : 'text-gray-500'}`}>
                アクティビティ: {getActivityDisplay() ? '表示' : '非表示'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
