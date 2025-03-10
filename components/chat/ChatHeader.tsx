import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BsCalendar, BsStar, BsStarFill, BsVolumeUp, BsVolumeMute, BsShield, BsXCircle, BsPencilSquare } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  partnerName: string;
  partnerAvatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  onBackClick?: () => void;
  onInfoClick?: () => void;
  onCallClick?: () => void;
  onVideoClick?: () => void;
  onAppointmentClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onReportUser?: () => void;
  onBlockUser?: () => void;
  onMuteUser?: () => void;
  isMuted?: boolean;
  partnerId?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = (props) => {
  // 安全にプロパティを分解し、デフォルト値を設定
  const {
    partnerName = '名前なし',
    partnerAvatar = '',
    isOnline = false,
    lastSeen = '',
    onBackClick = () => {},
    onInfoClick = () => {},
    onCallClick = () => {},
    onVideoClick = () => {},
    onAppointmentClick,
    isFavorite = false,
    onToggleFavorite = () => {},
    onReportUser = () => {},
    onBlockUser = () => {},
    onMuteUser = () => {},
    isMuted = false,
    partnerId = '',
  } = props;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // メニュー外クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <motion.header
      className="flex items-center px-4 py-3 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 max-w-md mx-auto z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onBackClick}
        className="mr-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="戻る"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {partnerAvatar ? (
            <Image
              src={partnerAvatar}
              alt={`${partnerName}のプロフィール画像`}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-lg font-medium text-gray-500">
              {partnerName.charAt(0)}
            </div>
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-base font-medium text-gray-900">{partnerName}</h2>
        {isOnline ? (
          <p className="text-xs text-green-600">オンライン</p>
        ) : lastSeen ? (
          <p className="text-xs text-gray-500">{`最終オンライン：${lastSeen}`}</p>
        ) : null}
      </div>

      <div className="flex items-center space-x-1">
        {onAppointmentClick && (
          <button
            onClick={onAppointmentClick}
            className="p-2 text-teal-600 hover:text-teal-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 relative"
            aria-label="約束"
          >
            <BsCalendar size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>
          </button>
        )}
        {onCallClick && (
          <button
            onClick={onCallClick}
            className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="通話"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </button>
        )}

        {onVideoClick && (
          <button
            onClick={onVideoClick}
            className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="ビデオ通話"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="メニュー"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          
          {/* ドロップダウンメニュー */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    onToggleFavorite();
                  } catch (error) {
                    console.error('Failed to toggle favorite', error);
                  }
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                {isFavorite ? (
                  <>
                    <BsStarFill className="text-yellow-400 mr-2" />お気に入りから削除
                  </>
                ) : (
                  <>
                    <BsStar className="mr-2" />お気に入りに追加
                  </>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    onMuteUser();
                  } catch (error) {
                    console.error('Failed to toggle mute', error);
                  }
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                {isMuted ? (
                  <>
                    <BsVolumeUp className="mr-2" />ミュート解除
                  </>
                ) : (
                  <>
                    <BsVolumeMute className="mr-2" />ミュート
                  </>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    onReportUser();
                  } catch (error) {
                    console.error('Failed to report user', error);
                  }
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <BsShield className="mr-2" />報告する
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`${partnerName}さんをブロックしますか？ブロックすると、このユーザーからのメッセージを受信できなくなります。`)) {
                    try {
                      onBlockUser();
                    } catch (error) {
                      console.error('Failed to block user', error);
                    }
                    setShowMenu(false);
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <BsXCircle className="mr-2" />ブロック
              </button>

              {/* メモボタン */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  // メモページに遷移する
                  router.push('/memo/new?title=' + encodeURIComponent(`${partnerName}とのメモ`));
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <BsPencilSquare className="mr-2" />メモを作成
              </button>
              
              {onInfoClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInfoClick();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  プロフィール詳細
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
