// アピール動画データモデル
export interface AppealVideo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // 秒単位
  views: number;
  createdAt: string;
  tags: string[];
}

// モックアピール動画データ
export const mockAppealVideos: AppealVideo[] = [
  {
    id: 'vid1',
    userId: 'user123',
    title: '趣味のゴルフについて',
    description: 'ゴルフが趣味で週末によくラウンドしています。一緒に行ける方募集中！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1470&auto=format&fit=crop',
    videoUrl: '/videos/appeal1.mp4',
    duration: 45,
    views: 152,
    createdAt: '2025-03-01T10:30:00Z',
    tags: ['ゴルフ', 'スポーツ', '趣味']
  },
  {
    id: 'vid2',
    userId: 'user456',
    title: '料理が得意です',
    description: '自炊が好きで毎日料理しています。特に和食が得意です！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1374&auto=format&fit=crop',
    videoUrl: '/videos/appeal2.mp4',
    duration: 62,
    views: 89,
    createdAt: '2025-03-02T15:45:00Z',
    tags: ['料理', '家庭的', '和食']
  },
  {
    id: 'vid3',
    userId: 'user789',
    title: '旅行好きです',
    description: '国内外問わず旅行が大好きです。これまでに15カ国訪れました！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1470&auto=format&fit=crop',
    videoUrl: '/videos/appeal3.mp4',
    duration: 38,
    views: 204,
    createdAt: '2025-03-03T09:15:00Z',
    tags: ['旅行', '海外', 'アウトドア']
  },
  {
    id: 'vid4',
    userId: 'user101',
    title: 'カフェ巡りが趣味です',
    description: '週末は新しいカフェを探して巡るのが趣味です。おすすめの場所教えてください！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=1471&auto=format&fit=crop',
    videoUrl: '/videos/appeal4.mp4',
    duration: 52,
    views: 127,
    createdAt: '2025-03-04T14:20:00Z',
    tags: ['カフェ', 'コーヒー', 'おしゃれ']
  },
  {
    id: 'vid5',
    userId: 'user202',
    title: 'ピアノ演奏しています',
    description: '子供の頃からピアノを習っていて、今でも趣味で弾いています。クラシックが好きです。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1470&auto=format&fit=crop',
    videoUrl: '/videos/appeal5.mp4',
    duration: 70,
    views: 163,
    createdAt: '2025-03-05T11:10:00Z',
    tags: ['音楽', 'ピアノ', 'クラシック']
  },
  {
    id: 'vid6',
    userId: 'user303',
    title: 'ヨガインストラクターです',
    description: '普段はヨガインストラクターとして活動しています。健康的な生活が大切です！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1470&auto=format&fit=crop',
    videoUrl: '/videos/appeal6.mp4',
    duration: 55,
    views: 218,
    createdAt: '2025-03-06T16:30:00Z',
    tags: ['ヨガ', '健康', 'フィットネス']
  },
  {
    id: 'vid7',
    userId: 'user404',
    title: 'カメラが趣味です',
    description: '写真を撮るのが好きで、特に風景写真を撮っています。カメラについて話したいです！',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1470&auto=format&fit=crop',
    videoUrl: '/videos/appeal7.mp4',
    duration: 48,
    views: 95,
    createdAt: '2025-03-07T13:25:00Z',
    tags: ['カメラ', '写真', '趣味']
  },
  {
    id: 'vid8',
    userId: 'user505',
    title: '登山が好きです',
    description: '月に1回は山に登っています。富士山にも登りました！一緒に登山する人募集中。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1374&auto=format&fit=crop',
    videoUrl: '/videos/appeal8.mp4',
    duration: 65,
    views: 132,
    createdAt: '2025-03-08T10:45:00Z',
    tags: ['登山', 'アウトドア', '自然']
  }
];

// 人気順にソートしたアピール動画を取得
export const getPopularAppealVideos = (limit?: number): AppealVideo[] => {
  const sorted = [...mockAppealVideos].sort((a, b) => b.views - a.views);
  return limit ? sorted.slice(0, limit) : sorted;
};

// 最新順にソートしたアピール動画を取得
export const getLatestAppealVideos = (limit?: number): AppealVideo[] => {
  const sorted = [...mockAppealVideos].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
};

// タグでフィルタリングしたアピール動画を取得
export const getAppealVideosByTag = (tag: string): AppealVideo[] => {
  return mockAppealVideos.filter(video => video.tags.includes(tag));
};

// IDでアピール動画を取得
export const getAppealVideoById = (id: string): AppealVideo | undefined => {
  return mockAppealVideos.find(video => video.id === id);
};
