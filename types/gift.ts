export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'chat' | 'video' | 'live' | 'all';  // ビデオ通話やライブ配信でも使用可能
  animation?: string;  // アニメーションのURL
  sound?: string;     // 効果音のURL
  displayDuration?: number;  // 表示時間（ミリ秒）
}

export interface GiftHistory {
  id: string;
  giftId: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  context: {
    type: 'chat' | 'video' | 'live';
    roomId: string;
  };
  message?: string;  // ギフトと一緒に送るメッセージ
}

export interface GiftTransaction {
  id: string;
  giftHistoryId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'points' | 'coins' | 'subscription';
  timestamp: string;
}
