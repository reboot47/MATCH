'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiVideo, 
  FiHome, 
  FiMessageCircle, 
  FiHeart, 
  FiUser, 
  FiFilter, 
  FiChevronRight, 
  FiSliders, 
  FiPlay,
  FiX,
  FiCheckCircle,
  FiZap
} from 'react-icons/fi';
import { RiStarLine, RiCameraLine, RiVideoLine, RiUserHeartLine, RiListCheck2 } from 'react-icons/ri';
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from 'react-icons/md';
import { FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaFilter, FaSearch, FaTimes, FaHeart, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

// 検索設定コンポーネントのインポート
import SearchSettings, { SearchParams, defaultSearchParams } from '@/app/components/SearchSettings';

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
  { id: 'newest', label: '新着', icon: <RiCameraLine /> }, 
  { id: 'tags', label: 'アピールタグ', icon: <RiUserHeartLine /> },
  { id: 'videos', label: 'アピール動画', icon: <RiVideoLine /> }
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

// ユーザーカードコンポーネント
const UserCard = ({ user, watchingVideo, setWatchingVideo, isLive = false }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isHovering, setIsHovering] = useState(false);
  
  // APIから返されるデータ形式の違いに対応
  const hasPhotos = user.photos && Array.isArray(user.photos);
  const hasVideo = hasPhotos 
    ? user.photos.some(photo => photo.type === 'video')
    : !!user.videoUrl;
    
  const videoUrl = hasPhotos
    ? (hasVideo ? user.photos.find(photo => photo.type === 'video')?.url : null)
    : user.videoUrl;
    
  const imageUrl = hasPhotos
    ? (user.photos.find(photo => photo.isMain)?.url || user.photos[0]?.url || '/images/default-avatar.png')
    : (user.mainPhoto || user.imageUrl || '/images/default-avatar.png');
  
  const handleClick = () => {
    router.push(`/users/${user.id}`);
  };
  
  const handleVideoIconClick = (e) => {
    e.stopPropagation();
    setWatchingVideo({ 
      isOpen: true, 
      user, 
      videoUrl 
    });
  };
  
  return (
    <div
      className="relative bg-white rounded-xl overflow-hidden shadow-sm transition-shadow border border-gray-100 cursor-pointer z-10"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={imageUrl}
          alt={user.name || 'ユーザー'}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEhAJgvsPkgAAAABJRU5ErkJggg=="
          className="object-cover"
        />
        
        {/* ライブ配信アイコン */}
        {isLive && (
          <div className="absolute top-1 left-1 z-20">
            <div className="bg-purple-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm flex items-center shadow-sm">
              <FiZap className="mr-0.5" size={8} />
              <span>LIVE</span>
            </div>
          </div>
        )}
        
        {/* 動画ありアイコン */}
        {hasVideo && (
          <div className="absolute top-2 right-2 z-20">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm cursor-pointer"
              onClick={handleVideoIconClick}
            >
              <FiPlay size={18} className="text-teal-600" />
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-3">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">{user.name || 'ユーザー'} {user.age && `${user.age}歳`}</h3>
              <p className="text-white/90 text-sm">{user.location || '場所未設定'}</p>
            </div>
            <div className="flex items-center space-x-1">
              {user.online && (
                <span className="inline-flex items-center bg-green-500/90 text-white text-xs px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                  オンライン
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        {user.tags && user.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {user.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {user.tags.length > 3 && (
              <span
                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded cursor-pointer"
              >
                +{user.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {user.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
        )}
      </div>
    </div>
  );
};

// SmallVideoUserCardコンポーネント
const SmallVideoUserCard = ({ user, setWatchingVideo, isLive = false }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  
  // APIから返されるデータ形式の違いに対応
  const hasPhotos = user.photos && Array.isArray(user.photos);
  const hasVideo = hasPhotos 
    ? user.photos.some(photo => photo.type === 'video')
    : !!user.videoUrl;
    
  const videoUrl = hasPhotos
    ? (hasVideo ? user.photos.find(photo => photo.type === 'video')?.url : null)
    : user.videoUrl;
    
  const videoThumbnailUrl = hasPhotos
    ? (hasVideo ? user.photos.find(photo => photo.type === 'video')?.thumbnailUrl : null)
    : user.videoThumbnailUrl;
    
  const imageUrl = hasPhotos
    ? (user.photos.find(photo => photo.isMain)?.url || user.photos[0]?.url || '/images/default-avatar.png')
    : (user.mainPhoto || user.imageUrl || '/images/default-avatar.png');
  
  // マウスホバー時に動画を再生
  useEffect(() => {
    if (isHovered && videoRef.current && hasVideo) {
      videoRef.current.play().catch(err => {
        console.log('動画の自動再生に失敗しました:', err);
      });
    } else if (!isHovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, hasVideo]);
  
  const handlePlayButtonClick = (e) => {
    e.stopPropagation();
    setWatchingVideo({ 
      isOpen: true, 
      user, 
      videoUrl 
    });
  };
  
  const handleCardClick = () => {
    // プロフィールページに遷移
    router.push(`/users/${user.id}`);
  };
  
  return (
    <div
      className="w-32 flex-shrink-0 mr-3 relative overflow-hidden rounded-xl shadow-sm cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="aspect-[3/4] relative">
        {hasVideo && isHovered ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={imageUrl}
            alt={user.name || 'ユーザー'}
            fill
            priority
            sizes="128px"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEhAJgvsPkgAAAABJRU5ErkJggg=="
            className="object-cover"
          />
        )}
        
        {/* ライブ配信アイコン */}
        {isLive && (
          <div className="absolute top-1 left-1 z-20">
            <div className="bg-purple-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm flex items-center shadow-sm">
              <FiZap className="mr-0.5" size={8} />
              <span>LIVE</span>
            </div>
          </div>
        )}
        
        {hasVideo && (
          <div className="absolute top-2 right-2 z-20">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm cursor-pointer"
              onClick={handlePlayButtonClick}
            >
              <FiPlay size={16} className="text-teal-600" />
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <p className="text-white text-xs font-medium truncate">{user.name}</p>
          {user.age && (
            <p className="text-white text-xs opacity-80">{user.age}歳</p>
          )}
        </div>
      </div>
    </div>
  );
};

// 動画再生モーダルコンポーネント
const VideoPlayerModal = ({ isOpen, onClose, user, videoUrl }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || !user || !videoUrl) return null;
  
  // APIから返されるデータ形式の違いに対応
  const hasPhotos = user.photos && Array.isArray(user.photos);
  const imageUrl = hasPhotos
    ? (user.photos.find(photo => photo.isMain)?.url || user.photos[0]?.url || '/images/default-avatar.png')
    : (user.mainPhoto || user.imageUrl || '/images/default-avatar.png');
  
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl overflow-hidden max-w-2xl w-full"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={imageUrl}
                alt={user.name || 'ユーザー'}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{user.name} {user.age && `${user.age}歳`}</h3>
              <p className="text-sm text-gray-500">{user.location}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="relative aspect-video">
          <video
            src={videoUrl}
            className="w-full h-full object-contain bg-black"
            controls
            autoPlay
            playsInline
          />
        </div>
        
        {user.bio && (
          <div className="p-4 border-t">
            <p className="text-sm text-gray-700">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchArea, setSearchArea] = useState('');
  const [listUsers, setListUsers] = useState([]);
  const [newestUsers, setNewestUsers] = useState([]); // 新着ユーザーを格納するステートを追加
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAreaFilter, setShowAreaFilter] = useState(false);
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [showAppealTagsModal, setShowAppealTagsModal] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    ...defaultSearchParams,
    ignoreAge: false,
    ignoreHeight: false,
    ignorePhotoVideo: false,
    ignoreDrinking: false,
    ignoreSmoking: false,
    ignoreGender: false,
    selectedAppealTags: []
  });
  
  // 動画再生用の状態
  const [watchingVideo, setWatchingVideo] = useState({ isOpen: false, user: null, videoUrl: null });

  // アピールタグのリスト
  const appealTags = [
    '優しい', '誠実', '面白い', '真面目', '甘えん坊', '家庭的',
    '寂しがり', '穏やか', '積極的', '朗らか', '落ち着いてる', '話し上手',
    '聞き上手', '料理好き', '旅行好き', '映画好き', '音楽好き', '読書好き',
    'カフェ巡り', 'アウトドア', 'インドア', 'ゲーム好き', 'アニメ好き', 'スポーツ好き',
    '美容好き', 'おしゃれ', 'グルメ', 'お酒好き', 'カラオケ好き', 'ダンス好き',
    '写真好き', 'アート好き', 'DIY好き', 'ペット好き', '車好き', 'バイク好き'
  ];

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
            ignoreGender: parsedParams.ignoreGender ?? defaultSearchParams.ignoreGender,
            selectedAppealTags: parsedParams.selectedAppealTags ?? defaultSearchParams.selectedAppealTags
          });
        }
        
        if (savedArea) {
          setSearchArea(savedArea);
          console.log('保存されていた地域を読み込みました:', savedArea);
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
        console.log('検索エリアをAPIに適用:', searchArea);
      }
      params.append('limit', '20');
      
      // 新着タブの場合は新着順でソート
      if (activeTab === 'newest') {
        params.append('sortBy', 'createdAt');
        params.append('sortOrder', 'desc');
      }
      
      // 検索条件を追加
      if (searchParams.keyword) params.append('keyword', searchParams.keyword);
      
      // 選択されたアピールタグがあれば、それらをORでつないだキーワードにする
      if (searchParams.selectedAppealTags && searchParams.selectedAppealTags.length > 0) {
        // すでにキーワードがある場合は追加
        if (searchParams.keyword) {
          params.set('keyword', `${searchParams.keyword} ${searchParams.selectedAppealTags.join(' ')}`);
        } else {
          params.set('keyword', searchParams.selectedAppealTags.join(' '));
        }
      }
      
      // undefinedの場合に備えてデフォルト値を使用
      const ignoreAge = searchParams.ignoreAge !== undefined ? searchParams.ignoreAge : false;
      const ignoreHeight = searchParams.ignoreHeight !== undefined ? searchParams.ignoreHeight : false;
      const ignorePhotoVideo = searchParams.ignorePhotoVideo !== undefined ? searchParams.ignorePhotoVideo : false;
      const ignoreDrinking = searchParams.ignoreDrinking !== undefined ? searchParams.ignoreDrinking : false;
      const ignoreSmoking = searchParams.ignoreSmoking !== undefined ? searchParams.ignoreSmoking : false;
      const ignoreGender = searchParams.ignoreGender !== undefined ? searchParams.ignoreGender : false;
      
      // ダッシュボードからのクエリパラメータをデバッグ
      console.log('ダッシュボードから送信される検索パラメータ:', { 
        keyword: searchParams.keyword,
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
        // 明示的にboolean値を文字列に変換して渡す
        params.append('hasPhoto', searchParams.hasPhoto === true ? 'true' : 'false');
        params.append('hasVideo', searchParams.hasVideo === true ? 'true' : 'false');
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
      
      // APIレスポンスのデバッグ（詳細情報）
      console.log('APIレスポンス全体:', {
        総ユーザー数: users.length,
        pagination: response.data.pagination
      });
      
      if (users.length > 0) {
        console.log('最初のユーザーの詳細:', {
          id: users[0].id,
          name: users[0].name,
          age: users[0].age,
          location: users[0].location,
          mainPhoto: users[0].mainPhoto,
          bio: users[0].bio,
          hasVideo: users[0].hasVideo,
          videoUrl: users[0].videoUrl,
          videoThumbnailUrl: users[0].videoThumbnailUrl,
          appealTags: users[0].appealTags
        });
      } else {
        console.log('ユーザーが見つかりませんでした');
      }
      
      // ユーザーデータ構造を修正
      const usersWithTags = users.map(user => ({
        ...user,
        tags: user.appealTags || [] // appealTagsをtags属性として追加
      }));
      
      setListUsers(usersWithTags);
      setNewestUsers(usersWithTags); // 新着ユーザーを設定
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
      setError('ユーザー情報の取得中にエラーが発生しました。再読み込みしてください。');
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [session, status, searchArea, searchParams, activeTab]);
  
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [activeTab, fetchUsers, status, searchArea, searchParams]);
  
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
  
  // アピールタグの選択/解除を処理する関数
  const handleAppealTagToggle = (tag: string) => {
    setSearchParams(prev => {
      const currentTags = prev.selectedAppealTags || [];
      let newTags;
      
      if (currentTags.includes(tag)) {
        // タグがすでに選択されている場合は解除
        newTags = currentTags.filter(t => t !== tag);
      } else {
        // タグがまだ選択されていない場合は追加
        newTags = [...currentTags, tag];
      }
      
      const newParams = {
        ...prev,
        selectedAppealTags: newTags
      };
      
      // ローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchParams', JSON.stringify(newParams));
      }
      
      return newParams;
    });
  };

  // 選択されたアピールタグを使って検索を実行
  const handleSearchWithAppealTags = () => {
    fetchUsers();
    setShowAppealTagsModal(false);
    
    // 選択されたタグの数を表示
    const tagCount = searchParams.selectedAppealTags?.length || 0;
    if (tagCount > 0) {
      toast.success(`${tagCount}個のアピールタグで検索します`, {
        icon: '🔍',
        duration: 3000
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 pb-20"
    >
      {/* ヘッダーセクション */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          {/* 上部ナビゲーション */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-full bg-gray-50"
                onClick={() => setShowAreaFilter(!showAreaFilter)}
              >
                <FaMapMarkerAlt className="text-teal-500" />
              </button>
              <span className="text-sm font-medium truncate max-w-[100px]">
                {searchArea || '全国'}
              </span>
            </div>
            
            <h1 className="text-lg font-semibold">マッチ</h1>
            
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-full bg-gray-50 relative"
                onClick={() => setShowAppealTagsModal(true)}
              >
                <RiUserHeartLine className="text-teal-500" />
                {searchParams.selectedAppealTags && searchParams.selectedAppealTags.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {searchParams.selectedAppealTags.length}
                  </span>
                )}
              </button>
              
              <button
                className={`
                  p-2 rounded-full relative
                  ${(searchParams.keyword || 
                     searchParams.hasPhoto || 
                     searchParams.hasVideo || 
                     searchParams.minAge !== defaultSearchParams.minAge || 
                     searchParams.maxAge !== defaultSearchParams.maxAge ||
                     searchParams.drinking?.length || 
                     searchParams.smoking?.length || 
                     searchParams.gender?.length ||
                     (searchParams.selectedAppealTags && searchParams.selectedAppealTags.length > 0)) 
                    ? 'bg-teal-50' : 'bg-gray-50'}
                `}
                onClick={() => setShowSearchSettings(true)}
              >
                <FaSearch className={`
                  ${(searchParams.keyword || 
                     searchParams.hasPhoto || 
                     searchParams.hasVideo || 
                     searchParams.minAge !== defaultSearchParams.minAge || 
                     searchParams.maxAge !== defaultSearchParams.maxAge ||
                     searchParams.drinking?.length || 
                     searchParams.smoking?.length || 
                     searchParams.gender?.length ||
                     (searchParams.selectedAppealTags && searchParams.selectedAppealTags.length > 0)) 
                    ? 'text-teal-500' : 'text-gray-500'}
                `} />
              </button>
            </div>
          </div>
          
          {/* タブナビゲーション */}
          <div className="overflow-x-auto scrollbar-hide border-t border-gray-200">
            <div className="flex whitespace-nowrap min-w-full">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'tags') {
                      setShowAppealTagsModal(true);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium flex items-center justify-center ${
                    activeTab === tab.id || (tab.id === 'tags' && showAppealTagsModal)
                      ? 'text-teal-500 border-b-2 border-teal-500'
                      : 'text-gray-500'
                  }`}
                >
                  <span className="flex items-center">
                    {tab.icon}
                    <span className="ml-1">{tab.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* エリアフィルターのドロップダウン */}
          <div>
            {showAreaFilter && (
              <div 
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
              </div>
            )}
          </div>
        </div>
        
        {/* 検索設定モーダル */}
        <div>
          {showSearchSettings && (
            <SearchSettings
              isOpen={showSearchSettings}
              onClose={() => setShowSearchSettings(false)}
              onApply={handleApplySearchParams}
              initialParams={searchParams}
            />
          )}
        </div>
        
        {/* アピールタグ選択モーダル */}
        {showAppealTagsModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAppealTagsModal(false)}
          >
            <div 
              className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="border-b p-4 flex items-center justify-between">
                <h2 className="font-medium text-lg">アピールタグを選択</h2>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500">
                    {searchParams.selectedAppealTags?.length || 0}/5
                  </div>
                  <button 
                    onClick={() => setShowAppealTagsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {appealTags.map(tag => {
                    const isSelected = searchParams.selectedAppealTags?.includes(tag) || false;
                    return (
                      <div
                        key={tag}
                        className={`
                          py-2 px-2 rounded-full text-center text-sm font-medium cursor-pointer transition-all duration-200
                          flex items-center justify-center
                          ${isSelected 
                            ? 'bg-teal-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}
                        `}
                        onClick={() => handleAppealTagToggle(tag)}
                      >
                        <span className="truncate">{tag}</span>
                        {isSelected && <FiCheckCircle className="flex-shrink-0 ml-1 w-4 h-4" />}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t p-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSearchWithAppealTags();
                    setActiveTab('recommended');
                  }}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-full transition duration-200 font-medium"
                >
                  検索する
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchParams(prev => ({
                      ...prev,
                      selectedAppealTags: []
                    }));
                    localStorage.setItem('searchParams', JSON.stringify({
                      ...searchParams,
                      selectedAppealTags: []
                    }));
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-full transition duration-200 font-medium"
                >
                  クリア
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* メインコンテンツ */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div 
              className="text-center py-10 text-red-500"
            >
              <p>{error}</p>
              <button 
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
              >
                再読み込み
              </button>
            </div>
          ) : (
            <>
              {/* ライブ配信中セクション - おすすめタブまたは新着タブのときに表示 */}
              {(activeTab === 'recommended' || activeTab === 'newest') && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-medium flex items-center">
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-md flex items-center mr-2">
                        <FiZap className="mr-1" size={10} />
                        LIVE
                      </span>
                      ライブ配信中
                    </h3>
                    <button
                      className="text-purple-500 text-sm flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm transition hover:shadow"
                      onClick={() => {
                        toast.success('ライブ配信中のユーザーを表示しています');
                      }}
                    >
                      すべて見る <FiChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                    {listUsers.length > 0 ? (
                      listUsers.slice(0, 5).map((user, index) => (
                        <SmallVideoUserCard 
                          key={user.id} 
                          user={user}
                          setWatchingVideo={setWatchingVideo}
                          isLive={index < 5}
                        />
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 py-4 px-2 bg-white rounded-lg shadow-sm w-full text-center">
                        ライブ配信中のユーザーが見つかりません
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 動画でさがすセクション - おすすめタブまたは新着タブのときに表示 */}
              {(activeTab === 'recommended' || activeTab === 'newest') && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-medium">動画でさがす</h3>
                    <button
                      className="text-teal-500 text-sm flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm transition hover:shadow"
                      onClick={() => {
                        // 一時的に動画あり検索条件を適用
                        setSearchParams({
                          ...searchParams,
                          hasVideo: true
                        });
                        setActiveTab('recommended');
                        toast.success('動画ありのユーザーを表示しています');
                      }}
                    >
                      すべて見る <FiChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                    {listUsers.filter(user => {
                      // 古いデータ形式と新しいデータ形式の両方に対応
                      const hasPhotos = user.photos && Array.isArray(user.photos);
                      return hasPhotos 
                        ? user.photos.some(photo => photo.type === 'video')
                        : !!user.videoUrl;
                    }).length > 0 ? (
                      listUsers.filter(user => {
                        // 古いデータ形式と新しいデータ形式の両方に対応
                        const hasPhotos = user.photos && Array.isArray(user.photos);
                        return hasPhotos 
                          ? user.photos.some(photo => photo.type === 'video')
                          : !!user.videoUrl;
                      }).map(user => (
                        <SmallVideoUserCard 
                          key={user.id} 
                          user={user}
                          setWatchingVideo={setWatchingVideo}
                        />
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 py-4 px-2 bg-white rounded-lg shadow-sm w-full text-center">
                        動画のあるユーザーが見つかりません
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 新着ユーザーセクション - 新着タブのときに表示 */}
              {activeTab === 'newest' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-medium">新着ユーザー</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {newestUsers.length > 0 ? (
                      newestUsers.map((user, index) => (
                        <UserCard 
                          key={user.id} 
                          user={user}
                          watchingVideo={watchingVideo}
                          setWatchingVideo={setWatchingVideo}
                          isLive={index === 0 || index === 2 || index === 5} // 特定のインデックスのユーザーをライブにする
                        />
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 py-4 col-span-2 text-center bg-white rounded-lg shadow-sm">
                        ユーザーが見つかりません
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 一覧からさがすセクション - どのタブでも表示（条件追加なし） */}
              <div className="mb-4">
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
                    listUsers.map((user, index) => (
                      <UserCard 
                        key={user.id} 
                        user={user}
                        watchingVideo={watchingVideo}
                        setWatchingVideo={setWatchingVideo}
                        isLive={index === 0 || index === 2 || index === 5} // 特定のインデックスのユーザーをライブにする
                      />
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 py-4 col-span-2 text-center bg-white rounded-lg shadow-sm">
                      ユーザーが見つかりません
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* 動画プレーヤーモーダル */}
        <VideoPlayerModal
          isOpen={watchingVideo.isOpen}
          onClose={() => setWatchingVideo({ isOpen: false, user: null, videoUrl: null })}
          user={watchingVideo.user}
          videoUrl={watchingVideo.videoUrl}
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
      </div>
    </div>
  );
}
