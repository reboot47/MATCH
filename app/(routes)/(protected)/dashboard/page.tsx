'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiVideo, FiHome, FiMessageCircle, FiHeart, FiUser, FiFilter, FiChevronRight, FiSliders, FiPlay } from 'react-icons/fi';
import { RiStarLine, RiCameraLine, RiVideoLine, RiUserHeartLine } from 'react-icons/ri';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// 検索設定コンポーネントのインポート
import SearchSettings, { SearchParams, defaultSearchParams } from '@/app/components/SearchSettings';

// 画像最適化ユーティリティをインポート
import { getProfileImageUrl, getVideoThumbnailUrl } from '@/app/utils/imageUtils';

// ビデオプレーヤーをインポート
import VideoPlayer from '@/app/components/VideoPlayer';

// アニメーション用の変数
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  }
};

// タブの種類を定義
const tabs = [
  { id: 'recommended', label: 'おすすめ', icon: <RiStarLine /> },
  { id: 'videos', label: 'アピール動画', icon: <RiVideoLine /> },
  { id: 'tags', label: 'アピールタグ', icon: <RiUserHeartLine /> },
  { id: 'new', label: '新着', icon: <RiCameraLine /> }
];

// エリアのオプション
const areaOptions = [
  '全国',
  '北海道',
  '東京',
  '大阪',
  '福岡',
  '京都',
  '名古屋'
];

// ユーザーカードコンポーネント（動画付き）
const VideoUserCard = ({ user, onClick }) => {
  const defaultImagePath = '/images/default-avatar.png';
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  const isVideo = !!user.videoUrl;
  
  // サムネイルURLをデフォルト画像で初期化
  const [imageUrl, setImageUrl] = useState(defaultImagePath);
  
  useEffect(() => {
    // 動画サムネイルのURLまたはプロフィール画像のURLを取得
    let url = defaultImagePath; // 空文字列の代わりにデフォルト画像のパスで初期化
    
    // 常にメイン画像を優先
    if (user.mainPhoto) {
      url = getProfileImageUrl(user.mainPhoto);
    } else if (isVideo) {
      // メイン画像がない場合のみ動画サムネイルを使用
      if (!thumbnailError) {
        if (user.videoThumbnailUrl) {
          url = user.videoThumbnailUrl;
        } else {
          url = getVideoThumbnailUrl(user.videoUrl);
        }
      }
    }
    
    setImageUrl(url);
    
    console.log('VideoUserCard - サムネイル詳細情報:', {
      ユーザー名: user.name,
      hasVideo: isVideo,
      thumbnailError: thumbnailError,
      videoThumbnailUrl: user.videoThumbnailUrl,
      videoUrl: user.videoUrl,
      mainPhoto: user.mainPhoto,
      最終的なURL: url
    });
  }, [user, isVideo, thumbnailError]);
  
  // 動画再生ボタンのクリックハンドラ
  const handlePlayButtonClick = (e) => {
    e.stopPropagation(); // イベントの伝播を停止
    if (user.videoUrl) {
      // 親コンポーネントから渡された関数を呼び出し、動画情報を渡す
      onClick(user, true);
    }
  };
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative rounded-lg overflow-hidden h-56 min-w-[150px] bg-gray-200 mr-3 shadow-sm cursor-pointer"
      onClick={() => onClick(user, false)} // プロフィールページへの遷移
    >
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={user.name || 'ユーザー'}
          fill
          sizes="150px"
          style={{ objectFit: 'cover' }}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setThumbnailError(true);
            setIsLoading(false);
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="text-sm font-medium">
          {user.name || 'ユーザー'} {user.age && `${user.age}歳`}
        </div>
        <div className="text-xs text-gray-200">{user.location || '場所未設定'}</div>
      </div>
      {isVideo && (
        <div className="absolute top-2 right-2 flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 mr-2 shadow-sm cursor-pointer"
            onClick={handlePlayButtonClick}
          >
            <FiPlay size={14} className="text-teal-600" />
          </motion.div>
          <div className="bg-teal-500 rounded-full p-1">
            <FiVideo size={16} className="text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// SmallVideoUserCardコンポーネントの修正
const SmallVideoUserCard = ({ user, onClick }) => {
  const defaultImagePath = '/images/default-avatar.png';
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  const isVideo = !!user.videoUrl;
  
  // サムネイルURLをデフォルト画像で初期化
  const [imageUrl, setImageUrl] = useState(defaultImagePath);
  
  useEffect(() => {
    // 動画サムネイルのURLまたはプロフィール画像のURLを取得
    let url = defaultImagePath; // 空文字列の代わりにデフォルト画像のパスで初期化
    
    // 常にメイン画像を優先
    if (user.mainPhoto) {
      console.log(`${user.name} - メイン画像を優先使用`);
      url = getProfileImageUrl(user.mainPhoto);
    } else if (isVideo) {
      // メイン画像がない場合のみ動画サムネイルを使用
      if (!thumbnailError) {
        if (user.videoThumbnailUrl) {
          console.log(`${user.name} - メイン画像がないためDBに保存されたサムネイルURLを使用`);
          url = user.videoThumbnailUrl;
        } else if (user.videoUrl) {
          console.log(`${user.name} - メイン画像がないため動画URLからサムネイルを生成`);
          url = getVideoThumbnailUrl(user.videoUrl);
        }
      }
    }
    
    setImageUrl(url);
    
    console.log('SmallVideoUserCard - サムネイル詳細情報:', {
      ユーザー名: user.name,
      hasVideo: isVideo,
      thumbnailError: thumbnailError,
      videoThumbnailUrl: user.videoThumbnailUrl,
      videoUrl: user.videoUrl,
      mainPhoto: user.mainPhoto,
      最終的なURL: url
    });
  }, [user, isVideo, thumbnailError]);
  
  // 動画再生ボタンのクリックハンドラ
  const handlePlayButtonClick = (e) => {
    e.stopPropagation(); // イベントの伝播を停止
    if (user.videoUrl) {
      // 親コンポーネントから渡された関数を呼び出し、動画情報を渡す
      onClick(user, true);
    }
  };
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative rounded-lg overflow-hidden h-56 min-w-[150px] bg-gray-200 mr-3 shadow-sm cursor-pointer"
      onClick={() => onClick(user, false)} // プロフィールページへの遷移
    >
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={user.name || 'ユーザー'}
          fill
          sizes="150px"
          style={{ objectFit: 'cover' }}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setThumbnailError(true);
            setIsLoading(false);
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="text-sm font-medium">
          {user.name || 'ユーザー'} {user.age && `${user.age}歳`}
        </div>
        <div className="text-xs text-gray-200">{user.location || '場所未設定'}</div>
      </div>
      {isVideo && (
        <div className="absolute top-2 right-2 flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 mr-2 shadow-sm cursor-pointer"
            onClick={handlePlayButtonClick}
          >
            <FiPlay size={14} className="text-teal-600" />
          </motion.div>
          <div className="bg-teal-500 rounded-full p-1">
            <FiVideo size={16} className="text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ユーザーカードコンポーネント（一覧表示用）
const UserCard = ({ user, onClick }) => {
  const defaultImagePath = '/images/default-avatar.png';
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  const isVideo = !!user.videoUrl;
  
  // サムネイルURLをデフォルト画像で初期化
  const [imageUrl, setImageUrl] = useState(defaultImagePath);
  
  useEffect(() => {
    // 動画サムネイルのURLまたはプロフィール画像のURLを取得
    let url = defaultImagePath; // 空文字列の代わりにデフォルト画像のパスで初期化
    
    // 常にメイン画像を優先
    if (user.mainPhoto) {
      url = getProfileImageUrl(user.mainPhoto);
    } else if (isVideo) {
      // メイン画像がない場合のみ動画サムネイルを使用
      if (!thumbnailError) {
        if (user.videoThumbnailUrl) {
          url = user.videoThumbnailUrl;
        } else {
          url = getVideoThumbnailUrl(user.videoUrl);
        }
      }
    }
    
    setImageUrl(url);
    
    console.log('UserCard - サムネイル詳細情報:', {
      ユーザー名: user.name,
      hasVideo: isVideo,
      thumbnailError: thumbnailError,
      videoThumbnailUrl: user.videoThumbnailUrl,
      videoUrl: user.videoUrl,
      mainPhoto: user.mainPhoto,
      最終的なURL: url
    });
  }, [user, isVideo, thumbnailError]);
  
  // 動画再生ボタンのクリックハンドラ
  const handlePlayButtonClick = (e) => {
    e.stopPropagation(); // イベントの伝播を停止
    if (user.videoUrl) {
      // 親コンポーネントから渡された関数を呼び出し、動画情報を渡す
      onClick(user, true);
    }
  };
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative rounded-lg overflow-hidden h-64 bg-gray-200 shadow-sm cursor-pointer"
      onClick={() => onClick(user, false)} // プロフィールページへの遷移
    >
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={user.name || 'ユーザー'}
          fill
          sizes="100%"
          style={{ objectFit: 'cover' }}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setThumbnailError(true);
            setIsLoading(false);
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="font-medium">
          {user.name || 'ユーザー'} {user.age && `${user.age}歳`}
        </div>
        <div className="text-xs text-gray-200 mb-1">{user.location || '場所未設定'}</div>
        {user.bio && (
          <p className="text-sm mt-1 line-clamp-2 text-gray-200">
            {user.bio}
          </p>
        )}
        {user.appealTags && user.appealTags.length > 0 && (
          <div className="flex flex-wrap mt-1 gap-1">
            {user.appealTags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-[10px] bg-teal-500/80 text-white px-1.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
            {user.appealTags.length > 3 && (
              <span className="text-[10px] bg-gray-500/80 text-white px-1.5 py-0.5 rounded-full">
                +{user.appealTags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      {isVideo && (
        <div className="absolute top-2 right-2 flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 mr-2 shadow-sm cursor-pointer"
            onClick={handlePlayButtonClick}
          >
            <FiPlay size={14} className="text-teal-600" />
          </motion.div>
          <div className="bg-teal-500 rounded-full p-1">
            <FiVideo size={16} className="text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchArea, setSearchArea] = useState('');
  const [videoUsers, setVideoUsers] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAreaFilter, setShowAreaFilter] = useState(false);
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    ...defaultSearchParams,
    ignoreAge: false,
    ignoreHeight: false,
    ignorePhotoVideo: false,
    ignoreDrinking: false,
    ignoreSmoking: false,
    ignoreGender: false
  });
  
  // 動画再生用の状態
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  // ローカルストレージから検索条件を読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedParams = localStorage.getItem('searchParams');
        const savedArea = localStorage.getItem('searchArea');
        
        if (savedParams) {
          const parsedParams = JSON.parse(savedParams);
          // 新しいフィールドがない場合はデフォルト値を設定
          setSearchParams({
            ...defaultSearchParams,
            ...parsedParams,
            // 新しいフィールドを明示的に追加
            ignoreAge: parsedParams.ignoreAge ?? defaultSearchParams.ignoreAge,
            ignoreHeight: parsedParams.ignoreHeight ?? defaultSearchParams.ignoreHeight,
            ignorePhotoVideo: parsedParams.ignorePhotoVideo ?? defaultSearchParams.ignorePhotoVideo,
            ignoreDrinking: parsedParams.ignoreDrinking ?? defaultSearchParams.ignoreDrinking,
            ignoreSmoking: parsedParams.ignoreSmoking ?? defaultSearchParams.ignoreSmoking,
            ignoreGender: parsedParams.ignoreGender ?? defaultSearchParams.ignoreGender
          });
        }
        
        if (savedArea) {
          setSearchArea(savedArea);
        }
      } catch (error) {
        console.error('検索条件の読み込みエラー:', error);
      }
    }
  }, []);
  
  // ユーザーデータの取得
  const fetchUsers = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // APIからおすすめユーザーを取得
      const params = new URLSearchParams();
      if (searchArea && searchArea !== '全国') {
        params.append('area', searchArea);
      }
      params.append('limit', '20');
      
      // 検索条件を追加
      if (searchParams.keyword) params.append('keyword', searchParams.keyword);
      
      // undefinedの場合に備えてデフォルト値を使用
      const ignoreAge = searchParams.ignoreAge !== undefined ? searchParams.ignoreAge : false;
      const ignoreHeight = searchParams.ignoreHeight !== undefined ? searchParams.ignoreHeight : false;
      const ignorePhotoVideo = searchParams.ignorePhotoVideo !== undefined ? searchParams.ignorePhotoVideo : false;
      const ignoreDrinking = searchParams.ignoreDrinking !== undefined ? searchParams.ignoreDrinking : false;
      const ignoreSmoking = searchParams.ignoreSmoking !== undefined ? searchParams.ignoreSmoking : false;
      const ignoreGender = searchParams.ignoreGender !== undefined ? searchParams.ignoreGender : false;
      
      // ダッシュボードからのクエリパラメータをデバッグ
      console.log('ダッシュボードから送信される検索パラメータ:', { 
        hasPhoto: searchParams.hasPhoto,
        hasVideo: searchParams.hasVideo,
        ignorePhotoVideo
      });
      
      params.append('ignoreAge', ignoreAge.toString());
      params.append('ignoreHeight', ignoreHeight.toString());
      params.append('ignorePhotoVideo', ignorePhotoVideo.toString());
      params.append('ignoreDrinking', ignoreDrinking.toString());
      params.append('ignoreSmoking', ignoreSmoking.toString());
      params.append('ignoreGender', ignoreGender.toString());
      
      if (!ignoreAge) {
        if (searchParams.minAge) params.append('minAge', searchParams.minAge.toString());
        if (searchParams.maxAge) params.append('maxAge', searchParams.maxAge.toString());
      }
      if (!ignoreHeight) {
        if (searchParams.minHeight) params.append('minHeight', searchParams.minHeight.toString());
        if (searchParams.maxHeight) params.append('maxHeight', searchParams.maxHeight.toString());
      }
      if (!ignorePhotoVideo) {
        if (searchParams.hasPhoto) params.append('hasPhoto', searchParams.hasPhoto.toString());
        if (searchParams.hasVideo) params.append('hasVideo', searchParams.hasVideo.toString());
      }
      if (!ignoreDrinking && searchParams.drinking) {
        params.append('drinking', searchParams.drinking);
      }
      if (!ignoreSmoking && searchParams.smoking) {
        params.append('smoking', searchParams.smoking);
      }
      if (!ignoreGender && searchParams.gender) {
        params.append('gender', searchParams.gender);
      }
      if (searchParams.job) params.append('job', searchParams.job);
      
      const response = await axios.get(`/api/users/recommended?${params.toString()}`);
      const users = response.data.users;
      
      // APIレスポンスのデバッグ
      console.log('APIレスポンス（動画ユーザー）:', users.filter(user => user.hasVideo).map(user => ({
        id: user.id,
        name: user.name,
        videoUrl: user.videoUrl,
        videoThumbnailUrl: user.videoThumbnailUrl
      })));
      
      // 動画付きユーザーとそれ以外でフィルタリング
      const withVideo = users.filter(user => user.hasVideo);
      
      setVideoUsers(withVideo);
      setListUsers(users);
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
      setError('ユーザー情報の取得中にエラーが発生しました。再読み込みしてください。');
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [session, status, searchArea, searchParams]);
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUsers();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, fetchUsers, router, activeTab, searchArea]);
  
  // 検索エリア変更
  const handleSearchChange = (area) => {
    setSearchArea(area);
    setShowAreaFilter(false);
    
    // ローカルストレージに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchArea', area);
    }
  };
  
  // 検索条件の適用
  const handleApplySearchParams = (params: SearchParams) => {
    setSearchParams(params);
    
    // ローカルストレージに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchParams', JSON.stringify(params));
    }
    
    fetchUsers();
  };
  
  // ユーザープロフィールへの遷移
  const navigateToUserProfile = (userId) => {
    router.push(`/user/${userId}`);
  };
  
  // 動画を再生
  const playVideo = useCallback((videoUrl: string, userName: string) => {
    setSelectedVideo(videoUrl);
    setSelectedUserName(userName);
    setIsVideoPlayerOpen(true);
  }, []);
  
  // VideoUserCardのクリックハンドラ
  const handleVideoUserClick = useCallback((user, isPlay) => {
    if (isPlay) {
      // オブジェクトや複合的な形式の場合の処理を追加
      const videoUrl = typeof user.videoUrl === 'object' && user.videoUrl !== null
        ? user.videoUrl.url || user.videoUrl.toString()
        : user.videoUrl;
        
      console.log('再生しようとしている動画URL:', videoUrl);
      playVideo(videoUrl, user.name);
    } else {
      navigateToUserProfile(user.id);
    }
  }, [playVideo, navigateToUserProfile]);
  
  // クリックハンドラ
  const handleUserClick = useCallback((user, isPlay) => {
    if (isPlay) {
      // オブジェクトや複合的な形式の場合の処理を追加
      const videoUrl = typeof user.videoUrl === 'object' && user.videoUrl !== null
        ? user.videoUrl.url || user.videoUrl.toString()
        : user.videoUrl;
        
      console.log('再生しようとしている動画URL:', videoUrl);
      playVideo(videoUrl, user.name);
    } else {
      navigateToUserProfile(user.id);
    }
  }, [playVideo, navigateToUserProfile]);

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 検索バー */}
      <motion.div 
        variants={itemVariants}
        className="sticky top-0 z-10 bg-white p-3 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 bg-gray-100 rounded-full px-4 py-2">
            <FiSearch className="text-gray-500 mr-2" />
            <div
              onClick={() => setShowAreaFilter(!showAreaFilter)}
              className="flex-1 flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm">{searchArea || '全国'}</span>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSearchSettings(true);
                  }}
                  className="mr-2"
                >
                  <FiSliders className="text-gray-500" />
                </button>
                <FiFilter className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        
        {/* エリアフィルターのドロップダウン */}
        <AnimatePresence>
          {showAreaFilter && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-3 right-3 bg-white shadow-md rounded-lg z-20 border border-gray-200"
            >
              <div className="p-2">
                {areaOptions.map((area) => (
                  <div 
                    key={area}
                    onClick={() => handleSearchChange(area)}
                    className={`p-2 rounded-md ${
                      searchArea === area ? 'bg-teal-50 text-teal-500' : 'hover:bg-gray-50'
                    } cursor-pointer transition-colors`}
                  >
                    {area}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex mt-2 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium flex-1 flex flex-col items-center ${
                activeTab === tab.id
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-500'
              }`}
            >
              <span className="mb-1">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* 検索設定モーダル */}
      <AnimatePresence>
        {showSearchSettings && (
          <SearchSettings
            isOpen={showSearchSettings}
            onClose={() => setShowSearchSettings(false)}
            onApply={handleApplySearchParams}
            initialParams={searchParams}
          />
        )}
      </AnimatePresence>
      
      {/* メインコンテンツ */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-10 text-red-500"
          >
            <p>{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
            >
              再読み込み
            </button>
          </motion.div>
        ) : (
          <>
            {/* 動画でさがすセクション */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FiVideo className="text-teal-500 mr-2" />
                  <h2 className="text-base font-medium">動画でさがす</h2>
                </div>
                <Link href="/search/videos" className="text-xs text-teal-500 flex items-center">
                  すべて見る <FiChevronRight size={14} />
                </Link>
              </div>
              
              <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                {videoUsers.length > 0 ? (
                  videoUsers.map(user => (
                    <SmallVideoUserCard 
                      key={user.id} 
                      user={user}
                      onClick={handleVideoUserClick}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-500 py-4 px-2 bg-white rounded-lg shadow-sm w-full text-center">
                    動画のあるユーザーが見つかりません
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* 一覧からさがすセクション */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FiSearch className="text-teal-500 mr-2" />
                  <h2 className="text-base font-medium">一覧からさがす</h2>
                </div>
                <button
                  onClick={() => setShowSearchSettings(true)}
                  className="text-xs text-teal-500 flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm transition hover:shadow"
                >
                  <FiSliders className="mr-1" />
                  詳細検索
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {listUsers.length > 0 ? (
                  listUsers.map(user => (
                    <UserCard 
                      key={user.id} 
                      user={user}
                      onClick={handleUserClick}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-500 py-4 col-span-2 text-center bg-white rounded-lg shadow-sm">
                    ユーザーが見つかりません
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
      
      {/* 動画プレーヤー */}
      <VideoPlayer 
        videoUrl={selectedVideo || ''} 
        isOpen={isVideoPlayerOpen} 
        onClose={() => setIsVideoPlayerOpen(false)}
        userName={selectedUserName || undefined}
      />
      
      {/* フッターナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-teal-500">
          <FiHome size={22} />
          <span className="text-xs mt-1">ホーム</span>
        </Link>
        <Link href="/messages" className="flex flex-col items-center justify-center text-gray-400">
          <FiMessageCircle size={22} />
          <span className="text-xs mt-1">メッセージ</span>
        </Link>
        <Link href="/likes" className="flex flex-col items-center justify-center text-gray-400">
          <FiHeart size={22} />
          <span className="text-xs mt-1">いいね</span>
        </Link>
        <Link href="/mypage" className="flex flex-col items-center justify-center text-gray-400">
          <FiUser size={22} />
          <span className="text-xs mt-1">マイページ</span>
        </Link>
      </div>
    </motion.div>
  );
}
