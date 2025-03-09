"use client";

import React, { useState, useContext, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { HiSearch, HiOutlinePlay, HiOutlineVideoCamera, HiOutlineLocationMarker, HiOutlineCurrencyYen, HiOutlineAdjustments } from 'react-icons/hi';
import { FaFire, FaFlag, FaCrown, FaGift, FaHeart } from 'react-icons/fa';
import NotificationBadge from '../components/notifications/NotificationBadge';
import MissionBadge from '../components/missions/MissionBadge';
import BoostModal from '../components/boost/BoostModal';
import { useBoost } from '../contexts/BoostContext';
import BottomNavigation from '../components/BottomNavigation';
import { useUser } from '@/components/UserContext';
import SearchPanel, { SearchParams } from '../components/search/SearchPanel';
import { MOCK_USERS, MockUser } from '../mock/users';
import TagSection from '../components/tags/TagSection';
import { TagData } from '../components/tags/TagCard';
import AppealVideoSection from '../components/videos/AppealVideoSection';
import { AppealVideo } from '../data/appealVideoData';

// タブのタイプ定義
type TabType = 'おすすめ' | 'アピール動画' | 'アピールタグ' | '新着';

// ライブユーザーのタイプ定義
type LiveUser = {
  id: string;
  name: string;
  age: number;
  location: string;
  profileImage: string;
  isLive: boolean;
};

// 動画ユーザーのタイプ定義
type VideoUser = {
  id: string;
  age: number;
  location: string;
  profileImage: string;
  videoThumbnail: string;
};

// 一般ユーザーのタイプ定義
type ListUser = {
  id: string;
  age: number;
  location: string;
  profileImage: string;
  isOnline: boolean;
};

export default function HomePage() {
  // ページがロードされた時間を記録
  const mountKey = Date.now();
  console.log('ページの初期化開始:', new Date().toISOString());
  
  const [activeTab, setActiveTab] = useState<TabType>('おすすめ');
  const [searchArea, setSearchArea] = useState('');
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  const { activateBoost } = useBoost();
  const [localShowBoostModal, setLocalShowBoostModal] = useState(false);
  
  // アプリで指定された性別をコンソールに表示
  console.log('ユーザー性別:', isMale ? '男性' : '女性');
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    freeWord: '',
    ageRange: [18, 60],
    purpose: [],
    meetingTime: [],
    drinkingHabit: [],
    heightRange: isMale ? [140, 200] : undefined,
    areas: [],
    preferredAgeRange: !isMale ? [18, 60] : undefined,
    bodyTypes: isMale ? [] : undefined,
    incomeLevel: !isMale ? '' : undefined,
    lookingFor: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false); // エラー状態管理用
  const [initialDataLoaded, setInitialDataLoaded] = useState(false); // 初期データロード完了フラグ

  const router = useRouter();
  // 即時計算でユーザーデータを指定
  const [users, setUsers] = useState<MockUser[]>(() => {
    // 即時関数で初期化時にデータを計算
    try {
      console.log('初期ロード時にユーザーデータを計算します');
      // 異性のユーザーのみを表示
      return MOCK_USERS.filter(user => user.gender !== (isMale ? 'male' : 'female'));
    } catch (error) {
      console.error('ユーザーデータの計算中にエラーが発生しました:', error);
      setIsError(true);
      return [];
    }
  });
  
  // 検索結果のユーザー
  const [filteredUsers, setFilteredUsers] = useState<MockUser[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // ユーザープロフィールへの遷移
  const navigateToUserProfile = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  // ページマウント時に初期データを設定
  useEffect(() => {
    console.log('ホームページがマウントされました - キー:', mountKey);
    setIsLoaded(true);
    
    // 初期データがまだロードされていない場合のみ再設定
    if (!initialDataLoaded) {
      // ユーザーの性別に基づいて対象ユーザーを取得
      const oppositeGenderUsers = MOCK_USERS.filter(user => 
        user.gender !== (isMale ? 'male' : 'female')
      );
      
      console.log('初期データロード: 表示対象ユーザー数', oppositeGenderUsers.length);
      
      // 初期データを必ず設定
      setUsers(oppositeGenderUsers);
      setFilteredUsers(oppositeGenderUsers);
      setInitialDataLoaded(true);
    }
  }, [isMale, initialDataLoaded, mountKey]);
  
  // データが変わったときにログ出力
  useEffect(() => {
    if (users.length > 0) {
      console.log('ユーザーデータ更新: 全ユーザー数', users.length);
    }
    
    if (filteredUsers.length > 0) {
      console.log('フィルター後ユーザー更新: ユーザー数', filteredUsers.length);
    }
  }, [users, filteredUsers]);
  
  
  // ディスマウント時の処理
  useEffect(() => {
    return () => {
      console.log('ホームページがアンマウントされました - キー:', mountKey);
    };
  }, []);
  
  // 検索条件が変更されたときにユーザーをフィルタリング
  useEffect(() => {
    // 初回ロード時はデフォルトユーザーを表示
    if (hasSearched) {
      console.log('検索条件変更を検知しました - フィルターを適用します');
      applyFilterToUsers(searchParams);
    } else {
      // 初期表示用にユーザーを設定
      console.log('初期表示用にデフォルトユーザーを設定します');
      setFilteredUsers(users);
    }
  }, [searchParams, hasSearched, users, isMale]);
  
  // 検索パラメータに基づいてユーザーをフィルタリングする関数
  const applyFilterToUsers = (params: SearchParams) => {
    console.log('検索フィルターを適用します:', params);
    
    try {
      // 基本的なフィルタリング（性別）
      let filtered = MOCK_USERS.filter(user => 
        user.gender !== (isMale ? 'male' : 'female')
      );
      
      // 年齢でフィルタリング
      filtered = filtered.filter(user => 
        user.age >= params.ageRange[0] && 
        user.age <= params.ageRange[1]
      );
      
      // フリーワードでフィルタリング（名前と自己紹介）
      if (params.freeWord) {
        const keyword = params.freeWord.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(keyword) || 
          (user.bio && user.bio.toLowerCase().includes(keyword))
        );
      }
      
      // エリアでフィルタリング
      if (params.areas.length > 0) {
        filtered = filtered.filter(user => 
          params.areas.some(area => 
            user.location.includes(area) || user.location.includes('梅田')
          )
        );
      }
      
      // 目的でフィルタリング
      if (params.purpose.length > 0) {
        filtered = filtered.filter(user => 
          user.interests && params.purpose.some(purpose => 
            user.interests?.includes(purpose)
          )
        );
      }
      
      // 身長でフィルタリング（男性向け）
      if (isMale && params.heightRange) {
        filtered = filtered.filter(user => {
          // 身長が設定されている場合のみフィルタリング
          if (user.height) {
            const height = parseInt(user.height.toString());
            return height >= params.heightRange![0] && height <= params.heightRange![1];
          }
          return true; // 身長がない場合は除外しない
        });
      }
      
      // 「今すぐ会いたい」などのフィルタリング
      if (params.lookingFor && params.lookingFor.includes('now')) {
        filtered = filtered.filter(user => user.isOnline);
      }
      
      // 「写真あり」のフィルタリング
      if (params.hasPhoto) {
        filtered = filtered.filter(user => user.images && user.images.length > 0);
      }
      
      // 「認証済みユーザー」のフィルタリング
      if (params.isVerified) {
        filtered = filtered.filter(user => user.isVerified);
      }
      
      // 結果がゼロの場合はログ出力
      if (filtered.length === 0) {
        console.log('警告: 検索条件に一致するユーザーがいません');
      }
      
      // 検索結果を設定
      setFilteredUsers(filtered);
      console.log('検索結果設定完了:', filtered.length, '件');
      
      // 検索完了フラグを設定
      setHasSearched(true);
      
      // 検索結果をローカルストレージに保存
      try {
        localStorage.setItem('lastSearchParams', JSON.stringify(params));
        localStorage.setItem('lastSearchTime', new Date().toISOString());
      } catch (e) {
        console.warn('検索条件の保存に失敗しました', e);
      }
      
      // 検索結果を返す
      return filtered;
      
    } catch (error) {
      console.error('検索フィルタリング中にエラーが発生しました:', error);
      setFilteredUsers([]);
      return [];
    }
  };
  
  // 検索条件を保存して検索を実行 (改善版)
  const handleSaveSearch = (params: SearchParams) => {
    console.log('検索ボタン押下: ', params);
    
    // 検索パラメータ設定
    setSearchParams(params);
    setHasSearched(true);
    
    // 検索条件を使用してユーザーをフィルタリング
    try {
      const results = applyFilterToUsers(params);
      console.log('検索結果:', results.length, '件');
      
      // 検索結果がある場合は正常に表示
      // 改善: 結果が空の場合は更に明確なメッセージを表示
      if (results.length === 0) {
        console.log('検索結果が空のためデフォルトユーザーを表示');
        // デフォルトユーザーを代替表示
        const defaultUsers = MOCK_USERS.filter(user => 
          user.gender !== (isMale ? 'male' : 'female')
        );
        
        // 空の検索結果を防ぐためデフォルトユーザーを表示
        setFilteredUsers(defaultUsers);
        
        // ユーザーにお知らせ
        alert('条件に一致するユーザーが見つかりませんでした。');
      }
    } catch (error) {
      console.error('検索処理中にエラーが発生しました:', error);
      // エラー時はデフォルトユーザーを表示
      const defaultUsers = MOCK_USERS.filter(user => 
        user.gender !== (isMale ? 'male' : 'female')
      );
      setFilteredUsers(defaultUsers);
    }
    
    // エリアを表示用に変換
    const areaMapping: {[key: string]: string} = {
      'umeda': '梅田・北新地',
      'namba': '難波・心斎橋',
      'tenma': '天満・天神橋',
      'shinsaibashi': '心斎橋・南船場',
    };
    
    if (params.areas.length > 0) {
      const areaName = areaMapping[params.areas[0]] || params.areas[0];
      setSearchArea(params.areas.length > 1 ? `${areaName} 他` : areaName);
    }
  };
  
  // 前回の検索条件を読み込む
  useEffect(() => {
    try {
      const savedParams = localStorage.getItem('lastSearchParams');
      const lastSearchTime = localStorage.getItem('lastSearchTime');
      
      if (savedParams) {
        const parsedParams = JSON.parse(savedParams) as SearchParams;
        setSearchParams(parsedParams);
        
        // 検索エリアを更新
        if (parsedParams.areas && parsedParams.areas.length > 0) {
          const areaMapping: {[key: string]: string} = {
            'umeda': '梅田・北新地',
            'namba': '難波・心斎橋',
            'tenma': '天満・天神橋',
            'shinsaibashi': '心斎橋・南船場',
          };
          const areaName = areaMapping[parsedParams.areas[0]] || parsedParams.areas[0];
          setSearchArea(parsedParams.areas.length > 1 ? `${areaName} 他` : areaName);
        }
        
        // 最後の検索から24時間以内なら検索を実行
        if (lastSearchTime) {
          const lastTime = new Date(lastSearchTime);
          const now = new Date();
          const diffHours = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
          
          if (diffHours < 24) {
            setHasSearched(true);
          }
        }
      }
    } catch (e) {
      console.warn('検索条件の読み込みに失敗しました', e);
    }
  }, []);

  
  // ユーザーデータが空の場合のフォールバック
  useEffect(() => {
    if (users.length === 0 && !isError) {
      console.log('ユーザーデータが空です、再計算します');
      try {
        const filteredUsers = MOCK_USERS.filter(user => 
          user.gender !== (isMale ? 'male' : 'female')
        );
        
        if (filteredUsers.length > 0) {
          setUsers(filteredUsers);
          // 初期表示用にフィルタリング結果も設定
          setFilteredUsers(filteredUsers);
          console.log('再計算に成功しました、ユーザー数:', filteredUsers.length);
        } else {
          console.warn('フィルタリング後にユーザーが見つかりません');
        }
      } catch (error) {
        console.error('ユーザーデータ再計算中にエラーが発生しました:', error);
        setIsError(true);
      }
    }
  }, [users.length, isError, isMale]);
  
  // マウント時に初期データを弾く確実に設定
  useEffect(() => {
    // 常に初期データを設定する
    console.log('マウント時にデータを設定します');
    const allUsers = MOCK_USERS.filter(user => 
      user.gender !== (isMale ? 'male' : 'female')
    );
    
    // 初期状態では全てのユーザーを表示
    if (!hasSearched) {
      console.log('初期データロード: 全ユーザー数', allUsers.length);
      setUsers(allUsers);
      setFilteredUsers(allUsers); // 必ずフィルター結果も設定する
    }
  }, [isMale]); // isMaleが変わったときのみ再実行

  // データ生成関数 - MOCK_USERSから直接データを取得
  const getFilteredUsers = () => {
    // 状態管理に依存せず、常に直接MOCK_USERSからフィルタリング
    const result = MOCK_USERS.filter(user => 
      user.gender !== (isMale ? 'male' : 'female')
    );
    console.log('getFilteredUsersの呼び出し結果: ユーザー数', result.length);
    return result;
  };

  // 表示用ユーザーリストの取得 - 常に有効なユーザーリストを返す
  const getDisplayUsers = () => {
    if (filteredUsers && filteredUsers.length > 0) {
      // 検索結果があれば、それを表示
      console.log('検索結果からユーザーを表示: ユーザー数', filteredUsers.length);
      return filteredUsers;
    } else {
      // なければ全ユーザーを表示
      const allUsers = getFilteredUsers();
      console.log('全ユーザーから表示: ユーザー数', allUsers.length);
      return allUsers;
    }
  };

  // 必ずユーザーリストを表示するための関数 (改善版)
  const getDisplayUserList = () => {
    console.log('表示ユーザー生成中 - 検索状態:', hasSearched ? '検索済み' : '未検索', 
              ', 検索結果:', filteredUsers.length, '件, 全ユーザー:', users.length, '件');
    
    // 改善版: 検索結果がある場合はそれを優先
    if (hasSearched && filteredUsers && filteredUsers.length > 0) {
      console.log('表示ユーザー決定: 有効な検索結果', filteredUsers.length, '件');
      return filteredUsers;
    } 
    
    // 検索したが結果が空の場合、または通常状態でユーザーがあればそれを表示
    if (users && users.length > 0) {
      console.log('表示ユーザー決定: デフォルトユーザー', users.length, '件');
      return users;
    }
    
    // 安全策: いかなる場合もユーザーリストが空にならないようデフォルトを返す
    const defaultUsers = MOCK_USERS.filter(user => 
      user.gender !== (isMale ? 'male' : 'female')
    );
    console.log('表示ユーザー決定: 最終フォールバック', defaultUsers.length, '件');
    
    // 状態正規化: 表示用データが空の場合は初期化する
    if (!hasSearched && users.length === 0) {
      console.log('状態正規化: 初期ユーザーデータをセット');
      setUsers(defaultUsers);
    }
    
    return defaultUsers;
  };
  
  // 表示用ユーザーリストの取得 - 常に空にならないようチェック
  const usersToDisplay = getDisplayUserList();
  console.log('最終表示ユーザー数:', usersToDisplay.length, '件');
  
  // もし表示するユーザーが空の場合は強制的にデフォルトユーザーを設定するセーフガード
  useEffect(() => {
    if (usersToDisplay.length === 0) {
      console.log('警告: 表示ユーザーがゼロです。強制的にデフォルトユーザーを設定します');
      const defaultUsers = MOCK_USERS.filter(user => 
        user.gender !== (isMale ? 'male' : 'female')
      );
      
      // 登録されているすべての状態をデフォルトに復元
      setUsers(defaultUsers);
      setFilteredUsers(defaultUsers);
      if (hasSearched) setHasSearched(false); // 検索状態をリセット
    }
  }, [usersToDisplay, isMale, hasSearched]);
  
  // 追加: 検索パネルの開閉状態やタブ切り替え時にユーザー表示を確認
  useEffect(() => {
    // タブ切り替えや検索パネル開閉時にユーザー表示が正しいか確認
    console.log('状態変化検知: 検索パネル=', isSearchPanelOpen ? '開' : '閉', ', タブ=', activeTab);
    
    const timer = setTimeout(() => {
      // 失敗セーフガード: 300ms後にもユーザーリストが空の場合は強制的に表示
      if (usersToDisplay.length === 0) {
        console.log('失敗セーフガード: ユーザー表示を復元しています');
        const defaultUsers = MOCK_USERS.filter(user => 
          user.gender !== (isMale ? 'male' : 'female')
        );
        setUsers(defaultUsers);
        setFilteredUsers(defaultUsers);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isSearchPanelOpen, activeTab, isMale, usersToDisplay]);
  
  // モックデータ: ライブ配信中のユーザー - 安全に生成
  const liveUsers = usersToDisplay.slice(0, 4).map(user => ({
    id: user.id,
    name: user.name,
    age: user.age,
    location: user.location,
    profileImage: user.profileImage,
    isLive: true
  }));

  // モックデータ: 動画ユーザー - 確実に正しいユーザーリストから生成
  const videoUsers = usersToDisplay.map(user => ({
    id: user.id,
    age: user.age,
    location: user.location,
    profileImage: user.profileImage,
    // それぞれ異なるサムネイル画像を使用
    videoThumbnail: `/images/dummy/thumbnails/${(Number(user.id.replace('user', '')) % 10) + 1}.jpg`
  }));

  // モックデータ: 一覧ユーザー - 確実に正しいユーザーリストから生成
  const listUsers = usersToDisplay.map(user => ({
    id: user.id,
    age: user.age,
    location: user.location,
    profileImage: user.profileImage,
    isOnline: user.isOnline
  }));

  // タブの切り替え
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    console.log(`${tab}タブに切り替えました`);
  };
  
  // タグ選択時の処理
  const handleTagSelect = (tag: TagData) => {
    console.log('選択されたタグ:', tag.name);
    // タグに基づいた検索パラメータの更新などをここで行う
    // 例：特定の趣味や属性に基づくフィルタリング
  };
  
  // 動画選択時の処理
  const handleVideoSelect = (video: AppealVideo) => {
    console.log('選択された動画:', video.title);
    // 動画選択時の処理を実装
    // 例：動画詳細ページへの遷移など
  };

  // iOS風のスワイプアニメーション用の参照とモーションの値
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const xInput = [-100, 0, 100];
  const opacityOutput = [0.5, 1, 0.5];
  const opacity = useTransform(x, xInput, opacityOutput);
  
  // ポイント表示関連
  const [showPoints, setShowPoints] = useState(false);
  const points = isMale ? { total: 120, free: 20 } : { total: 5800, earnings: 1200 };

  // マウントキーを追加して強制的に再マウントさせる
  return (
    <div key={mountKey} className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white shadow-sm z-50 px-4 py-3">
        {/* 性別表示バナー */}
        <div className={`mb-3 py-1.5 px-4 rounded-lg text-white text-center text-sm font-medium ${isMale ? 'bg-blue-500' : 'bg-pink-500'}`}>
          {isMale ? '男性ユーザーとしてログイン中' : '女性ユーザーとしてログイン中'}
          {isMale ? ' • ポイントを使って特典機能を利用できます' : ' • ポイントを獲得して特典と交換できます'}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          {/* 検索バー */}
          <div 
            className="flex-1 max-w-md bg-gray-100 rounded-full px-4 py-2 flex items-center justify-between text-gray-600 cursor-pointer"
            onClick={() => setIsSearchPanelOpen(true)}
          >
            <div className="flex items-center">
              <HiSearch className="mr-2 text-gray-400" />
              <span>{searchArea}</span>
            </div>
            <HiOutlineAdjustments className="text-gray-500" />
          </div>
          
          {/* ポイント表示 - 性別によって異なる表示 */}
          <button 
            onClick={() => setShowPoints(!showPoints)}
            className="flex items-center bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-full px-3 py-1 mr-2 shadow-sm"
          >
            <HiOutlineCurrencyYen className="mr-1" />
            <span className="text-sm font-medium">{isMale ? points.total : `${points.total}P`}</span>
          </button>
          
          {/* 右側のアイコン */}
          <div className="flex space-x-4">
            {isMale && (
              <button 
                onClick={() => setLocalShowBoostModal(true)}
                className="text-gray-600"
                aria-label="ブースト機能"
              >
                <FaCrown size={22} className="text-yellow-500" />
              </button>
            )}
            {!isMale && (
              <button 
                onClick={() => setLocalShowBoostModal(true)}
                className="text-gray-600"
                aria-label="プロフィール強化"
              >
                <FaCrown size={22} className="text-pink-400" />
              </button>
            )}
            <MissionBadge size={22} />
            <NotificationBadge size={22} />
          </div>
        </div>
        
        {/* ポイント詳細（表示/非表示） */}
        <AnimatePresence>
          {showPoints && (
            <motion.div 
              className="bg-white rounded-lg shadow-md p-3 mb-3 border border-gray-100"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {isMale ? (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">合計ポイント</div>
                    <div className="text-lg font-bold">{points.total}<span className="text-sm font-normal ml-1">ポイント</span></div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">無料ポイント</div>
                    <div className="text-lg font-bold text-teal-500">{points.free}<span className="text-sm font-normal ml-1">ポイント</span></div>
                  </div>
                  <Link 
                    href="/points/purchase"
                    className="bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-full px-4 py-2 text-sm font-medium"
                  >
                    ポイント購入
                  </Link>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">合計ポイント</div>
                    <div className="text-lg font-bold">{points.total}<span className="text-sm font-normal ml-1">ポイント</span></div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">今月の獲得</div>
                    <div className="text-lg font-bold text-pink-500">+{points.earnings}<span className="text-sm font-normal ml-1">ポイント</span></div>
                  </div>
                  <Link 
                    href="/points/earnings"
                    className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full px-4 py-2 text-sm font-medium"
                  >
                    ポイント履歴
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* タブメニュー */}
        <div className="flex border-b border-gray-200">
          {(['おすすめ', 'アピール動画', 'アピールタグ', '新着'] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-500'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pb-20">
        <motion.div
          ref={constraintsRef}
          className="overflow-hidden"
          style={{ touchAction: "pan-y" }}
        >
          {/* AnimatePresenceのmodeを変更してアニメーション中にも要素が消えないようにする */}
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0.8, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0.8, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="pb-4"
              drag="x"
              dragConstraints={constraintsRef}
              style={{ x, opacity }}
              onDragEnd={(event, info: PanInfo) => {
                const threshold = 100; // スワイプの閾値
                if (info.offset.x > threshold) {
                  // 右スワイプ - 前のタブへ
                  const tabs = ['おすすめ', 'アピール動画', 'アピールタグ', '新着'] as TabType[];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex > 0) {
                    handleTabChange(tabs[currentIndex - 1]);
                  }
                } else if (info.offset.x < -threshold) {
                  // 左スワイプ - 次のタブへ
                  const tabs = ['おすすめ', 'アピール動画', 'アピールタグ', '新着'] as TabType[];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) {
                    handleTabChange(tabs[currentIndex + 1]);
                  }
                }
              }}
            >
            {/* アピールタグが選択されていればTagSectionを表示 */}
            {activeTab === 'アピールタグ' ? (
              <TagSection onTagSelect={(tag) => {
                console.log('選択されたタグ:', tag.name);
                // タグを選択した時の処理をここに実装
                // 例：選択したタグに基づいてユーザーフィルタリングを行うなど
              }} />
            ) : activeTab === 'アピール動画' ? (
              <AppealVideoSection onVideoSelect={(video) => {
                console.log('選択された動画:', video.title);
                // 動画を選択した時の処理をここに実装
                // 例：動画詳細ページへの遷移など
              }} />
            ) : (
            <>
            {/* 通常のコンテンツ表示 */}
            {/* ライブ配信セクション */}
            <section className="py-4">
              <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2 space-x-3">
                {liveUsers.map(user => (
                  <div key={user.id} className="flex-shrink-0">
                    <Link href={`/user/${user.id}`}>
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-400">
                          <Image
                            src={user.profileImage}
                            alt={`${user.age}歳 ${user.location}`}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                        <motion.div 
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * Number(user.id), duration: 0.3 }}
                        >
                          <HiOutlinePlay className="mr-1" />
                          <span>LIVE</span>
                        </motion.div>
                      </motion.div>
                      <div className="text-center text-xs mt-1 text-gray-700">
                        {user.age}歳 {user.location}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* 動画でさがすセクション */}
            <section className="py-2 px-4">
              <div className="flex items-center mb-3">
                <HiOutlineVideoCamera className="mr-2 text-teal-500" size={20} />
                <h2 className="text-gray-700 font-medium">動画でさがす</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {videoUsers.slice(0, 6).map(user => (
                  <Link key={user.id} href={`/user/${user.id}`}>
                    <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-200">
                      <Image
                        src={user.videoThumbnail}
                        alt={`${user.age}歳 ${user.location}`}
                        width={150}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="text-white text-xs font-medium">
                            {user.age}歳 {user.location}
                          </div>
                        </div>
                        {/* 再生アイコン */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full p-2">
                          <HiOutlinePlay className="text-white" size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 一覧からさがすセクション */}
            <section className="py-4 px-4">
              <div className="flex items-center mb-3">
                <HiSearch className="mr-2 text-teal-500" size={20} />
                <h2 className="text-gray-700 font-medium">一覧からさがす</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {listUsers.slice(0, 6).map(user => (
                  <Link key={user.id} href={`/user/${user.id}`}>
                    <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-200 shadow-md">
                      <Image
                        src={user.profileImage}
                        alt={`${user.age}歳 ${user.location}`}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="flex justify-between items-center">
                            <div className="text-white text-sm font-medium">
                              {user.age}歳 {user.location}
                            </div>
                            <div className="flex items-center">
                              {user.isOnline && (
                                <div className="flex items-center bg-black/40 rounded-full px-2 py-0.5">
                                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                  <span className="text-white text-xs">オンライン</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* いいねアイコン */}
                      <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm rounded-full p-1.5">
                        <FaHeart className="text-pink-500" size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            </>
            )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* 性別に応じた追加メニュー */}
        {isMale && (
          <motion.div
            className="fixed bottom-20 right-4 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/premium">
              <motion.button
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaCrown size={24} className="text-white" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </main>

      {/* フッターナビゲーション */}
      <BottomNavigation />
      
      {/* 検索パネル - オーバーレイとして表示 */}
      <SearchPanel 
        isOpen={isSearchPanelOpen} 
        onClose={() => {
          console.log('検索パネルを閉じます: 検索状態=' + (hasSearched ? '検索済み' : '未検索') + 
                    ', 結果数=' + filteredUsers.length);
          
          // 検索パネルを閉じた後もユーザー表示を維持
          if (filteredUsers.length === 0) {
            // 検索結果が空の場合は初期状態にリセット
            const defaultUsers = MOCK_USERS.filter(user => 
              user.gender !== (isMale ? 'male' : 'female')
            );
            console.log('リセット: デフォルトユーザー設定 ' + defaultUsers.length + '件');
            
            // デフォルト状態に戻す
            setUsers(defaultUsers); // 元のユーザーリストを設定
            setFilteredUsers(defaultUsers); // フィルタ結果も同じデータで初期化
            setHasSearched(false); // 検索状態をリセット
          } else if (hasSearched) {
            // 検索結果が有効な場合は結果を維持
            console.log('検索結果を維持: ' + filteredUsers.length + '件');
            // 変更なし（現状維持）
          } else {
            // 検索していない場合は通常表示を維持
            console.log('通常表示を維持: ' + users.length + '件');
            // 変更なし（現状維持）
          }
          
          // 検索パネルを閉じる
          setIsSearchPanelOpen(false);
        }} 
        onSave={handleSaveSearch}
        isMale={isMale}
        initialSearchParams={searchParams}
      />
      
      {/* 検索結果バナー */}
      {hasSearched && (
        <div className="fixed bottom-20 left-0 right-0 mx-auto w-5/6 bg-white shadow-lg rounded-lg p-3 flex justify-between items-center z-40">
          <div>
            <p className="text-sm font-medium">検索結果: {filteredUsers.length}件</p>
            <p className="text-xs text-gray-500">条件: {searchArea} / {searchParams.ageRange[0]}〜{searchParams.ageRange[1]}歳</p>
          </div>
          <button 
            onClick={() => setIsSearchPanelOpen(true)}
            className="px-3 py-1.5 bg-gray-100 rounded-full text-xs"
          >
            条件変更
          </button>
        </div>
      )}
      {/* ブーストモーダル */}
      {localShowBoostModal && (
        <BoostModal 
          isOpen={localShowBoostModal} 
          onClose={() => setLocalShowBoostModal(false)} 
          onSelect={(option) => {
            activateBoost(option.id as any, option.duration, option.duration, option.points);
            setLocalShowBoostModal(false);
          }}
        />
      )}
    </div>
  );
}
