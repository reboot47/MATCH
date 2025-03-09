import { TagData } from '../components/tags/TagCard';

// 人気のタグ
export const popularTags: TagData[] = [
  {
    id: 'golf',
    name: 'ゴルフ好きです',
    description: '一緒にゴルフ回りましょう',
    backgroundColor: 'bg-gradient-to-r from-green-400 to-green-600',
    popularity: 10
  },
  {
    id: 'age-gap',
    name: '年上好き',
    description: '頼りになる年上が好き',
    backgroundColor: 'bg-gradient-to-r from-blue-400 to-indigo-600',
    popularity: 8
  },
  {
    id: 'cooking',
    name: '料理好き',
    description: '手料理を振る舞いたい',
    backgroundColor: 'bg-gradient-to-r from-orange-400 to-red-500',
    popularity: 7
  },
  {
    id: 'travel',
    name: '旅行好き',
    description: '一緒に旅行したい',
    backgroundColor: 'bg-gradient-to-r from-teal-400 to-cyan-500',
    popularity: 9
  }
];

// カテゴリータグ
export const categoryTags: TagData[] = [
  {
    id: 'tea',
    name: 'まずはお茶から',
    description: 'カジュアルに会いたい',
    backgroundColor: 'bg-gradient-to-r from-amber-400 to-amber-600',
    popularity: 6
  },
  {
    id: 'serious',
    name: '真剣交際希望',
    description: '本気で探しています',
    backgroundColor: 'bg-gradient-to-r from-pink-400 to-rose-600',
    popularity: 5
  },
  {
    id: 'talking',
    name: 'おしゃべり好き',
    description: '楽しく会話しましょう',
    backgroundColor: 'bg-gradient-to-r from-purple-400 to-violet-600',
    popularity: 7
  },
  {
    id: 'outdoor',
    name: 'アウトドア派',
    description: '自然の中で過ごすのが好き',
    backgroundColor: 'bg-gradient-to-r from-lime-400 to-green-600',
    popularity: 6
  }
];

// 興味タグ
export const interestTags: TagData[] = [
  {
    id: 'music',
    name: '音楽好き',
    description: 'ライブに行くのが好き',
    backgroundColor: 'bg-gradient-to-r from-red-400 to-red-600',
    popularity: 7
  },
  {
    id: 'movie',
    name: '映画好き',
    description: '休日は映画鑑賞',
    backgroundColor: 'bg-gradient-to-r from-gray-700 to-gray-900',
    textColor: 'text-white',
    popularity: 6
  },
  {
    id: 'pet',
    name: '動物好き',
    description: 'ペットと暮らしたい',
    backgroundColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    popularity: 8
  },
  {
    id: 'sports',
    name: 'スポーツ観戦',
    description: '一緒に応援しよう',
    backgroundColor: 'bg-gradient-to-r from-blue-500 to-blue-700',
    popularity: 5
  }
];

// すべてのタグを結合
export const allTags: TagData[] = [
  ...popularTags, 
  ...categoryTags, 
  ...interestTags
];

// タグIDからタグを検索
export const getTagById = (id: string): TagData | undefined => {
  return allTags.find(tag => tag.id === id);
};

// 人気度でタグをソート
export const getTagsByPopularity = (limit?: number): TagData[] => {
  const sorted = [...allTags].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  return limit ? sorted.slice(0, limit) : sorted;
};
