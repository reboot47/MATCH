// 既存の型定義に追加

// パーソナルストーリー
export interface PersonalStory {
  id: string;
  question: string;
  answer: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
}

// スキル・才能
export interface Skill {
  id: string;
  category: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'professional';
  description?: string;
  mediaUrls?: string[];
}

// バケットリスト
export interface BucketListItem {
  id: string;
  category: 'travel' | 'experience' | 'achievement' | 'learning' | 'other';
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  targetDate?: Date;
  isCompleted: boolean;
  mediaUrl?: string;
}

// ビデオ自己紹介
export interface IntroductionVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
  prompt?: string;
  transcript?: string;
  keywords?: string[];
  duration: number;
  createdAt: Date;
}

// イベント参加履歴
export interface EventHistory {
  id: string;
  title: string;
  category: string;
  date: Date;
  location?: string;
  description?: string;
  participants?: string;
  imageUrl?: string;
  createdAt: Date;
}

// Q&A回答
export interface QandA {
  id: string;
  question: string;
  answer: string;
  isCustomQuestion?: boolean;
  createdAt: Date;
}

// 価値観マップ
export interface ValueItem {
  importance: number; // 1-5
  description?: string;
}

export interface ValueCategory {
  values: {
    [key: string]: ValueItem;
  };
}

export interface ValueMap {
  categories: {
    [key: string]: ValueCategory;
  };
}

// アピールプロフィール全体
export interface AppealProfile {
  personalStories?: PersonalStory[];
  skills?: Skill[];
  bucketList?: BucketListItem[];
  introVideo?: IntroductionVideo;
  eventHistory?: EventHistory[];
  qAndA?: QandA[];
  valueMap?: ValueMap;
}

// 既存のProfileUserインターフェースに追加するフィールド
// export interface ProfileUser {
//   ...
//   appealProfile?: AppealProfile;
// }
