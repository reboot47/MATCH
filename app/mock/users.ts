// モックユーザーデータ

export interface MockUser {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  bio: string;
  profileImage: string;
  isOnline: boolean;
  lastActive?: string;
  likes: number;
  matchRate?: number;
  message?: string;
  boostMultiplier?: number;
  isVerified: boolean;
  videoThumbnail?: string; // 動画サムネイル用のフィールドを追加
  appearance?: {
    height?: number;
    bodyType?: string;
    lookType?: string;
  };
  basicProfile?: {
    occupation?: string;
    dream?: string;
    meetingArea?: string;
    personality?: string;
  };
  interests?: string[];
  additionalImages?: string[];
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user1',
    name: 'すぅちゃん',
    age: 27,
    gender: 'female',
    location: '大阪府',
    bio: `初めて登録しました！💕
初心者なのでお手柔らかに😊笑
色んな人とお話したいです！
カフェでも飲みでも♪
まずは顔合わせから希望です♡`,
    profileImage: '/images/avatar2.jpg', // 実際に存在する画像に変更
    videoThumbnail: '/images/dummy/thumbnails/1.jpg', // 実際に存在するサムネイル画像に変更
    isOnline: true,
    lastActive: '3分前',
    likes: 82,
    matchRate: 85,
    message: '会ってお話ししましょよ〜😉💕',
    boostMultiplier: 2,
    isVerified: true,
    appearance: {
      height: 163,
      bodyType: 'グラマー',
      lookType: 'ギャル系、綺麗系'
    },
    basicProfile: {
      occupation: '事務員',
      dream: 'セレブ',
      meetingArea: '気が合えば会いたい',
      personality: '素直、明るい、楽観的'
    },
    interests: ['カフェ巡り', '旅行', 'ショッピング'],
    additionalImages: [
      '/images/avatar1.jpg',
      '/images/avatar3.jpg'
    ] // 実際に存在する画像に変更
  },
  {
    id: 'user2',
    name: 'まりな',
    age: 24,
    gender: 'female',
    location: '東京都',
    bio: '初めまして！まりなです。趣味は料理と音楽です。素敵な出会いがあればいいなと思っています。',
    profileImage: '/images/avatar3.jpg', // 実際に存在する画像に変更
    isOnline: false,
    lastActive: '1時間前',
    likes: 64,
    matchRate: 72,
    message: 'こんにちは！メッセージください♪',
    isVerified: true,
    appearance: {
      height: 158,
      bodyType: 'スレンダー',
      lookType: '清楚系'
    },
    interests: ['料理', '音楽鑑賞', 'カフェ巡り']
  },
  {
    id: 'user3',
    name: 'たくま',
    age: 30,
    gender: 'male',
    location: '東京都',
    bio: '仕事は企画職をしています。休日はドライブや映画鑑賞が趣味です。一緒に楽しい時間を過ごせる方を探しています。',
    profileImage: '/images/profile/user1.jpg', // 実際に存在する画像に変更
    isOnline: true,
    likes: 42,
    matchRate: 68,
    isVerified: true,
    appearance: {
      height: 178,
      bodyType: '普通',
      lookType: 'ビジネス系'
    },
    interests: ['ドライブ', '映画', 'グルメ巡り']
  },
  {
    id: 'user4',
    name: 'あやの',
    age: 26,
    gender: 'female',
    location: '神奈川県',
    bio: 'IT企業で働いています。趣味は旅行とヨガです。共通の趣味がある人とお話できたら嬉しいです☺️',
    profileImage: '/images/avatar1.jpg', // 実際に存在する画像に変更
    isOnline: true,
    likes: 78,
    matchRate: 91,
    boostMultiplier: 2,
    isVerified: true,
    appearance: {
      height: 165,
      bodyType: 'スレンダー',
      lookType: 'ナチュラル系'
    },
    interests: ['ヨガ', '旅行', '読書']
  },
  {
    id: 'user5',
    name: 'けんた',
    age: 29,
    gender: 'male',
    location: '大阪府',
    bio: '大阪在住のエンジニアです。休日は山登りやサーフィンなどアウトドアが好きです。明るい性格の方と仲良くなりたいです！',
    profileImage: '/images/profile/user3.jpg', // 実際に存在する画像に変更
    isOnline: false,
    lastActive: '3時間前',
    likes: 38,
    matchRate: 75,
    isVerified: true,
    appearance: {
      height: 182,
      bodyType: '筋肉質',
      lookType: 'アウトドア系'
    },
    interests: ['山登り', 'サーフィン', 'キャンプ']
  }
];

// ユーザーIDで検索するヘルパー関数
export const findUserById = (id: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user.id === id);
};

// おすすめユーザーを取得するヘルパー関数（性別でフィルタリング）
export const getRecommendedUsers = (gender: 'male' | 'female'): MockUser[] => {
  // 異性のユーザーのみを返す
  return MOCK_USERS.filter(user => user.gender !== gender);
};
