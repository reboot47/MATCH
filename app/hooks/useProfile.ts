"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { validateSession, generateSessionDiagnostics } from "@/lib/auth/session-helper";

// プロフィールユーザータイプの定義
export interface ProfileUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  age?: number;
  gender?: string;
  location?: string;
  occupation?: string;
  interests?: string[];
  company?: string | null;
  education?: string | null;
  height?: number | null;
  drinking?: string | null;
  smoking?: string | null;
  children?: number | null;
  emailVerified?: Date | null;
  mediaItems?: {
    id: string;
    url: string;
    type: 'image' | 'video';
    caption?: string;
    isPrimary?: boolean;
    thumbnail?: string;
    sortOrder?: number;
    publicId?: string;
  }[];
  personalityType?: string;
  personalityTraits?: Record<string, number>;
  personalityTestCompleted?: boolean;
  preferences?: {
    ageRange?: [number, number];
    distance?: number;
    genderPreference?: string[];
    notificationEnabled?: boolean;
  };
  matchingPreferences?: {
    ageMin?: number;
    ageMax?: number;
    distance?: number;
    genderPreference?: string[];
    relationshipType?: string;
    lookingFor?: string[];
  };
  verificationStatus?: {
    email?: boolean;
    phone?: boolean;
    photo?: boolean;
    identity?: boolean;
  };
  securitySettings?: {
    twoFactorEnabled?: boolean;
    lastPasswordChange?: Date;
    loginNotifications?: boolean;
  };
  notificationSettings?: {
    messages?: boolean;
    matches?: boolean;
    likes?: boolean;
    system?: boolean;
    email?: boolean;
    push?: boolean;
  };
  privacySettings?: {
    profileVisibility?: 'public' | 'matches' | 'private';
    showOnlineStatus?: boolean;
    showLastActive?: boolean;
    blockList?: string[];
  };
  appealProfile?: {
    personalStories?: Array<{
      id: string;
      question: string;
      answer: string;
      mediaUrl?: string;
      mediaType?: 'image' | 'video';
      createdAt: Date;
    }>;
    skills?: Array<{
      id: string;
      category: string;
      name: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'professional';
      description?: string;
      mediaUrls?: string[];
    }>;
    bucketList?: Array<{
      id: string;
      category: 'travel' | 'experience' | 'achievement' | 'learning' | 'other';
      title: string;
      description?: string;
      priority: 'low' | 'medium' | 'high';
      targetDate?: Date;
      isCompleted: boolean;
      mediaUrl?: string;
    }>;
    introVideo?: {
      id: string;
      url: string;
      thumbnailUrl: string;
      prompt?: string;
      transcript?: string;
      keywords?: string[];
      duration: number;
      createdAt: Date;
    };
    eventHistory?: Array<{
      id: string;
      title: string;
      category: string;
      date: Date;
      location?: string;
      description?: string;
      participants?: string;
      imageUrl?: string;
      createdAt: Date;
    }>;
    qAndA?: Array<{
      id: string;
      question: string;
      answer: string;
      isCustomQuestion?: boolean;
      createdAt: Date;
    }>;
    valueMap?: {
      categories: {
        [key: string]: {
          values: {
            [key: string]: {
              importance: number;
              description?: string;
            };
          };
        };
      };
    };
  };
  isMockData?: boolean; // モックデータフラグ
}

// エラータイプを定義
export enum ProfileErrorType {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  SERVER = 'server',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

// エラーオブジェクト
interface ProfileError {
  type: ProfileErrorType;
  message: string;
  status?: number;
  timestamp: number;
  retryable: boolean;
}

// プロフィールデータを取得および管理するフック
export function useProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ProfileError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const profileFetchedRef = useRef(false);
  
  // 自動保存状態の管理
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<Record<string, any>>({});
  
  // プロフィール完成度の計算
  const completionPercentage = useMemo(() => {
    if (!profile) return 0;
    
    // 必須フィールドリスト
    const requiredFields = [
      'name', 'bio', 'age', 'gender', 'location', 'occupation', 
      'interests', 'mediaItems'
    ];
    
    // 任意フィールドリスト（追加ポイント用）
    const optionalFields = [
      'company', 'education', 'height', 'drinking', 'smoking',
      'personalityType', 'personalityTestCompleted'
    ];
    
    // 必須フィールドの充足率
    let filledRequired = 0;
    for (const field of requiredFields) {
      const value = profile[field as keyof ProfileUser];
      if (field === 'mediaItems') {
        // メディアアイテムは少なくとも1つ以上必要
        if (Array.isArray(value) && value.length > 0) filledRequired++;
      } else if (field === 'interests') {
        // 興味は少なくとも3つ以上必要
        if (Array.isArray(value) && value.length >= 3) filledRequired++;
      } else if (value) {
        filledRequired++;
      }
    }
    
    // 任意フィールドの充足率（ボーナスポイント）
    let filledOptional = 0;
    for (const field of optionalFields) {
      const value = profile[field as keyof ProfileUser];
      if (value) filledOptional++;
    }
    
    // 合計スコアの計算（必須フィールドは高い比重、任意フィールドは低い比重）
    const requiredWeight = 0.7;
    const optionalWeight = 0.3;
    
    const requiredScore = (filledRequired / requiredFields.length) * requiredWeight * 100;
    const optionalScore = (filledOptional / optionalFields.length) * optionalWeight * 100;
    
    return Math.round(requiredScore + optionalScore);
  }, [profile]);

  // 未入力項目の特定
  const missingItems = useMemo(() => {
    if (!profile) return [];
    
    const missingFields = [];
    
    // 必須フィールドのチェック
    if (!profile.name) missingFields.push('名前');
    if (!profile.bio) missingFields.push('自己紹介');
    if (!profile.age) missingFields.push('年齢');
    if (!profile.gender) missingFields.push('性別');
    if (!profile.location) missingFields.push('居住地');
    if (!profile.occupation) missingFields.push('職業');
    if (!profile.interests || profile.interests.length < 3) missingFields.push('興味関心 (3つ以上)');
    if (!profile.mediaItems || profile.mediaItems.length === 0) missingFields.push('写真');
    
    return missingFields;
  }, [profile]);

  // プロフィールデータ取得
  const fetchProfile = useCallback(async () => {
    // セッション検証
    console.log('fetchProfile called. session:', session ? 'exists' : 'null', 'status:', status);
    
    if (!validateSession(session)) {
      console.log('💥 セッション無効: ', generateSessionDiagnostics(session));
      if (retryCount < maxRetries) {
        console.log(`🔄 リトライ ${retryCount + 1}/${maxRetries}...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, Math.pow(2, retryCount) * 1000); // エクスポネンシャルバックオフ
        return;
      }
      
      // モックデータを返す
      console.log('⚠️ セッション無効が続くため、モックデータを使用します');
      setProfile({
        id: 'mock-user-id',
        name: 'お試しユーザー',
        email: 'example@example.com',
        bio: 'これはデモ用のプロフィールです。',
        age: 28,
        gender: '男性',
        location: '東京',
        occupation: 'エンジニア',
        interests: ['テクノロジー', '旅行', '写真'],
        company: 'テック企業',
        education: '大学卒',
        height: 175,
        mediaItems: [
          {
            id: 'mock-media-1',
            url: 'https://example.com/placeholder.jpg',
            type: 'image',
            isPrimary: true
          }
        ],
        isMockData: true
      });
      setLoading(false);
      setError({
        type: ProfileErrorType.AUTHENTICATION,
        message: '認証エラー: モックデータを表示しています',
        timestamp: Date.now(),
        retryable: false
      });
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/profile');
      setProfile(response.data);
      profileFetchedRef.current = true;
      console.log('[fetchProfile] プロファイルロード成功、フェッチ済みフラグをtrueに設定');
      setLoading(false);
    } catch (err: any) {
      console.error('💥 プロフィール取得エラー:', err);
      
      // エラー詳細ログ
      if (err.response) {
        console.error('💥 エラーレスポンス:', {
          status: err.response.status,
          headers: err.response.headers,
          data: err.response.data
        });
      } else if (err.request) {
        console.error('💥 レスポンスなし:', err.request);
      } else {
        console.error('💥 リクエスト設定エラー:', err.message);
      }
      
      // エラーオブジェクトを作成
      const profileError: ProfileError = {
        type: ProfileErrorType.UNKNOWN,
        message: 'プロファイルの取得中にエラーが発生しました',
        timestamp: Date.now(),
        retryable: true
      };
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
          case 403:
            profileError.type = ProfileErrorType.AUTHENTICATION;
            profileError.retryable = false;
            break;
          case 422:
            profileError.type = ProfileErrorType.VALIDATION;
            profileError.retryable = false;
            break;
          case 500:
          case 502:
          case 503:
            profileError.type = ProfileErrorType.SERVER;
            profileError.retryable = true;
            break;
        }
      }
      
      setError(profileError);
      
      // リトライ可能なエラーかつリトライ回数が上限未満の場合
      if (profileError.retryable && retryCount < maxRetries) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        // エクスポネンシャルバックオフでリトライ
        const backoffTime = Math.pow(2, nextRetryCount) * 1000;
        console.log(`${backoffTime}ms後にプロファイル取得をリトライします (${nextRetryCount}/${maxRetries})`);
        
        setTimeout(() => {
          console.log(`プロファイル取得リトライ実行 (${nextRetryCount}/${maxRetries})`);
          fetchProfile();
        }, backoffTime);
      } else if (!profileError.retryable && profileError.type === ProfileErrorType.AUTHENTICATION) {
        // 認証エラーの場合はモックデータを返す（開発環境のみ）
        if (process.env.NODE_ENV === 'development') {
          console.log('開発環境: モックプロファイルを使用します');
          setProfile({
            id: 'mock-user-id',
            name: 'お試しユーザー',
            email: 'example@example.com',
            bio: 'これはデモ用のプロフィールです。',
            age: 28,
            gender: '男性',
            location: '東京',
            occupation: 'エンジニア',
            interests: ['テクノロジー', '旅行', '写真'],
            company: 'テック企業',
            education: '大学卒',
            height: 175,
            mediaItems: [
              {
                id: 'mock-media-1',
                url: 'https://example.com/placeholder.jpg',
                type: 'image',
                isPrimary: true
              }
            ],
            isMockData: true
          });
        }
      } else if (retryCount >= maxRetries) {
        toast.error(`プロファイル取得に失敗しました。しばらく経ってから再度お試しください。(${maxRetries}回試行)`);
        
        // モックデータを使用（開発環境のみ）
        if (process.env.NODE_ENV === 'development') {
          console.log('開発環境: リトライ失敗後のモックプロファイルを使用します');
          setProfile({
            id: 'mock-user-id',
            name: 'お試しユーザー',
            email: 'example@example.com',
            bio: 'これはデモ用のプロフィールです。',
            age: 28,
            gender: '男性',
            location: '東京',
            occupation: 'エンジニア',
            interests: ['テクノロジー', '旅行', '写真'],
            company: 'テック企業',
            education: '大学卒',
            height: 175,
            mediaItems: [
              {
                id: 'mock-media-1',
                url: 'https://example.com/placeholder.jpg',
                type: 'image',
                isPrimary: true
              }
            ],
            isMockData: true
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [session, maxRetries]);

  // 初期ロード
  useEffect(() => {
    console.log('[useEffect] status:', status, 'already fetched:', profileFetchedRef.current);
    
    // すでにフェッチ済みかstatusがloadingの場合は早期リターン
    if (profileFetchedRef.current || status === 'loading') {
      console.log('[useEffect] Skipping profile fetch - already fetched or loading');
      return;
    }
    
    console.log('[useEffect] プロフィール読み込み開始...');
    let isMounted = true;
    
    const loadProfile = async () => {
      if (!isMounted) return;
      
      try {
        console.log('[useEffect] Calling fetchProfile...');
        await fetchProfile();
        if (isMounted) {
          profileFetchedRef.current = true;
          console.log('[useEffect] fetchProfile completed and marked as fetched');
        }
      } catch (err) {
        console.error('[useEffect] プロファイル読み込みエラー:', err);
        if (isMounted) {
          // エラー時はフェッチフラグをリセット
          profileFetchedRef.current = false;
        }
      }
    };
    
    // 初期ロード実行
    loadProfile();
    
    // クリーンアップ関数
    return () => {
      console.log('[useEffect] Cleanup - component unmounting');
      isMounted = false;
    };
  }, [fetchProfile, status]); // retryCountを依存配列から削除
  
  // プロフィール更新
  const updateProfile = useCallback(async (data: Partial<ProfileUser>) => {
    if (!profile) return false;
    
    try {
      setSaveStatus('saving');
      const response = await axios.patch('/api/profile', data);
      setProfile(prev => prev ? { ...prev, ...response.data } : response.data);
      setSaveStatus('saved');
      
      // 一定時間後に保存状態をリセット
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      
      // エラーオブジェクトを作成
      const profileError: ProfileError = {
        type: ProfileErrorType.UNKNOWN,
        message: 'プロファイルの更新中にエラーが発生しました',
        timestamp: Date.now(),
        retryable: true
      };
      
      setError(profileError);
      
      toast.error(`プロファイルの更新に失敗しました: ${error.message}`);
      setSaveStatus('error');
      return false;
    }
  }, [profile]);
  
  // 自動保存のキャンセル
  const cancelSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    pendingChangesRef.current = {};
    setSaveStatus('idle');
  }, []);
  
  // フィールドの自動保存 (単一フィールド)
  const autoSaveField = useCallback((fieldName: string, value: any) => {
    // 保存中のタイマーがあればキャンセル
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // 変更を保留中のオブジェクトに追加
    pendingChangesRef.current = {
      ...pendingChangesRef.current,
      [fieldName]: value
    };
    
    setSaveStatus('saving');
    
    // 0.8秒後に保存を実行
    saveTimeoutRef.current = setTimeout(async () => {
      const changes = { ...pendingChangesRef.current };
      pendingChangesRef.current = {};
      
      try {
        await updateProfile(changes);
        setSaveStatus('saved');
        
        // 保存成功表示を一定時間後に消す
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (error) {
        console.error('自動保存エラー:', error);
        
        // エラーオブジェクトを作成
        const profileError: ProfileError = {
          type: ProfileErrorType.UNKNOWN,
          message: '自動保存中にエラーが発生しました',
          timestamp: Date.now(),
          retryable: true
        };
        
        setError(profileError);
        
        setSaveStatus('error');
      }
    }, 800);
  }, [updateProfile]);
  
  // 複数フィールドの一括自動保存
  const autoSaveFields = useCallback((fieldsData: Record<string, any>) => {
    // 保存中のタイマーがあればキャンセル
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // 変更を保留中のオブジェクトに追加
    pendingChangesRef.current = {
      ...pendingChangesRef.current,
      ...fieldsData
    };
    
    setSaveStatus('saving');
    
    // 0.8秒後に保存を実行
    saveTimeoutRef.current = setTimeout(async () => {
      const changes = { ...pendingChangesRef.current };
      pendingChangesRef.current = {};
      
      try {
        await updateProfile(changes);
        setSaveStatus('saved');
        
        // 保存成功表示を一定時間後に消す
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (error) {
        console.error('自動保存エラー:', error);
        
        // エラーオブジェクトを作成
        const profileError: ProfileError = {
          type: ProfileErrorType.UNKNOWN,
          message: '自動保存中にエラーが発生しました',
          timestamp: Date.now(),
          retryable: true
        };
        
        setError(profileError);
        
        setSaveStatus('error');
      }
    }, 800);
  }, [updateProfile]);
  
  // パーソナリティテスト結果の保存
  const savePersonalityTest = useCallback(async (personalityType: string, personalityTraits: Record<string, number>) => {
    return await updateProfile({
      personalityType,
      personalityTraits,
      personalityTestCompleted: true
    });
  }, [updateProfile]);
  
  // マッチング設定の更新
  const updateMatchingPreferences = useCallback(async (matchingPreferences: ProfileUser['matchingPreferences']) => {
    return await updateProfile({ matchingPreferences });
  }, [updateProfile]);
  
  // 複数フィールドの更新（エイリアス）
  const updateMultipleFields = useCallback((fieldsData: Record<string, any>) => {
    console.log(`📝 複数フィールド更新API: ${Object.keys(fieldsData).join(', ')}`);
    autoSaveFields(fieldsData);
  }, [autoSaveFields]);
  
  // メディア項目の更新
  const updateMediaItems = useCallback(async (mediaItems: ProfileUser['mediaItems']) => {
    return await updateProfile({ mediaItems });
  }, [updateProfile]);
  
  // アピールプロフィールの更新
  const updateAppealProfile = useCallback(async (data: Partial<ProfileUser['appealProfile']>) => {
    if (!profile) return false;
    
    // 現在のappealProfileデータを取得
    const currentAppealProfile = profile.appealProfile || {};
    
    // 新しいデータをマージ
    const updatedAppealProfile = {
      ...currentAppealProfile,
      ...data
    };
    
    // プロフィール全体を更新
    return await updateProfile({ appealProfile: updatedAppealProfile });
  }, [profile, updateProfile]);
  
  // アピールプロフィールの特定セクションを更新
  const updateAppealProfileSection = useCallback(async (sectionName: string, sectionData: any) => {
    if (!profile) return false;
    
    // 現在のappealProfileデータを取得
    const currentAppealProfile = profile.appealProfile || {};
    
    // セクションを更新
    const updatedAppealProfile = {
      ...currentAppealProfile,
      [sectionName]: sectionData
    };
    
    // プロフィール全体を更新
    return await updateProfile({ appealProfile: updatedAppealProfile });
  }, [profile, updateProfile]);

  // プロフィール情報更新（単一フィールド）
  const updateField = useCallback((fieldName: string, value: any) => {
    console.log(`📝 フィールド更新API: ${fieldName} = ${JSON.stringify(value).substring(0, 100)}`);
    autoSaveField(fieldName, value);
  }, [autoSaveField]);
  
  return {
    profile,
    loading,
    error,
    completionPercentage,
    missingItems,
    fetchProfile,
    updateProfile,
    savePersonalityTest,
    updateMatchingPreferences,
    updateMediaItems,
    updateAppealProfile,
    updateAppealProfileSection,
    // 自動保存関連の機能
    autoSaveField,
    autoSaveFields,
    updateField,  // エイリアス：フィールド単位の更新
    updateMultipleFields,  // エイリアス：複数フィールドの更新
    cancelSave,
    saveStatus
  };
}
