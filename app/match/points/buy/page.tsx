'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext';
import { 
  CreditCard, Zap, ChevronRight, Star, Gift, AlertCircle, 
  ShieldCheck, CheckCircle2, Package, Crown, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

// ポイントパッケージの定義
const pointPackages = [
  {
    id: 'basic',
    name: 'ベーシック',
    points: 500,
    price: 980,
    popular: false,
    description: '基本的な機能を使うのに十分なポイント',
    features: [
      'いいね！を送信',
      'マッチング後のメッセージ',
      'プロフィール閲覧'
    ]
  },
  {
    id: 'standard',
    name: 'スタンダード',
    points: 1200,
    price: 1980,
    popular: true,
    description: '積極的に出会いを探したい方におすすめ',
    features: [
      'すべての基本機能',
      'スーパーいいね！× 5',
      'プロフィールブースト × 1',
      '20%ポイント増量'
    ]
  },
  {
    id: 'premium',
    name: 'プレミアム',
    points: 3000,
    price: 3980,
    popular: false,
    description: '最大限にアプリを活用したい方に',
    features: [
      'すべての機能が使い放題',
      'スーパーいいね！× 15',
      'プロフィールブースト × 3',
      '50%ポイント増量'
    ]
  }
];

// サブスクリプションプランの定義
const subscriptionPlans = [
  {
    id: 'basic_sub',
    name: 'ベーシック',
    points: 600,
    price: 1200,
    perMonth: true,
    popular: false,
    description: '月々のポイント付与と基本機能',
    features: [
      '毎月600ポイント付与',
      'いいね！の上限解除',
      '既読機能'
    ],
    icon: <Star className="text-yellow-400" size={20} />
  },
  {
    id: 'premium_sub',
    name: 'プレミアム',
    points: 1500,
    price: 2980,
    perMonth: true,
    popular: true,
    description: '本気で出会いを求める方に',
    features: [
      '毎月1500ポイント付与',
      'すべての機能が使い放題',
      'プロフィール優先表示',
      'プライベートモード',
      '広告非表示'
    ],
    icon: <Crown className="text-purple-500" size={20} />
  },
  {
    id: 'vip_sub',
    name: 'VIP',
    points: 3000,
    price: 4980,
    perMonth: true,
    popular: false,
    description: '最高級の出会い体験',
    features: [
      '毎月3000ポイント付与',
      'VIP限定マッチング',
      'プレミアムサポート',
      'AIマッチング最適化',
      'イベント優先招待'
    ],
    icon: <Shield className="text-blue-500" size={20} />
  }
];

export default function BuyPointsPage() {
  const { user, points, addPoints } = useUser();
  const [selectedTab, setSelectedTab] = useState<'points' | 'subscription'>('points');
  const [purchasingPackage, setPurchasingPackage] = useState<string | null>(null);

  // 購入処理のシミュレーション
  const handlePurchase = async (packageId: string, amount: number) => {
    setPurchasingPackage(packageId);
    
    try {
      // 実際の決済処理はここで行う
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ポイント追加
      await addPoints(amount, `${packageId}パッケージ購入`);
      
      alert(`${amount}ポイントを購入しました！`);
    } catch (error) {
      alert('購入処理に失敗しました。もう一度お試しください。');
    } finally {
      setPurchasingPackage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-20 px-4">
      <header className="py-6">
        <h1 className="text-2xl font-bold text-center">ポイント購入</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Zap size={24} className="text-primary" />
          <span className="text-xl font-semibold">{points?.balance || 0} ポイント</span>
        </div>
        <p className="text-center text-gray-500 mt-2">
          ポイントを使って特別な機能を利用できます
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              selectedTab === 'points' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setSelectedTab('points')}
          >
            ポイント購入
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              selectedTab === 'subscription' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
            onClick={() => setSelectedTab('subscription')}
          >
            サブスクリプション
          </button>
        </div>

        <div className="p-4">
          {selectedTab === 'points' ? (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">ポイントパッケージ</h2>
                <p className="text-sm text-gray-500">
                  一度に購入するだけで、すぐに利用できます
                </p>
              </div>

              {pointPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  className={`border rounded-lg p-4 ${
                    pkg.popular ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {pkg.popular && (
                    <div className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">
                      人気
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{pkg.name}</h3>
                    <div className="flex items-center">
                      <Zap size={16} className="text-primary mr-1" />
                      <span className="font-bold">{pkg.points}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                  <ul className="space-y-1 mb-4">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle2 size={16} className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold text-xl">¥{pkg.price.toLocaleString()}</div>
                    <button
                      className={`px-4 py-2 rounded-full text-white font-medium ${
                        purchasingPackage === pkg.id
                          ? 'bg-gray-400'
                          : 'bg-primary hover:bg-primary-dark'
                      }`}
                      onClick={() => handlePurchase(pkg.id, pkg.points)}
                      disabled={purchasingPackage === pkg.id}
                    >
                      {purchasingPackage === pkg.id ? '処理中...' : '購入する'}
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start">
                  <ShieldCheck className="text-blue-500 mr-2 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-blue-800">安全な決済</h3>
                    <p className="text-sm text-blue-700">
                      すべての支払いは安全に処理され、個人情報は保護されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">サブスクリプションプラン</h2>
                <p className="text-sm text-gray-500">
                  毎月自動更新でポイントと特別な機能が使えます
                </p>
              </div>

              {subscriptionPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  className={`border rounded-lg p-4 ${
                    plan.popular ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">
                      人気
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      {plan.icon}
                      <h3 className="font-bold text-lg ml-1">{plan.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <Zap size={16} className="text-primary mr-1" />
                      <span className="font-bold">{plan.points}/月</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                  <ul className="space-y-1 mb-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle2 size={16} className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="font-bold text-xl">¥{plan.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm">/月</span>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-full text-white font-medium ${
                        purchasingPackage === plan.id
                          ? 'bg-gray-400'
                          : 'bg-primary hover:bg-primary-dark'
                      }`}
                      onClick={() => handlePurchase(plan.id, plan.points)}
                      disabled={purchasingPackage === plan.id}
                    >
                      {purchasingPackage === plan.id ? '処理中...' : '登録する'}
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start">
                  <AlertCircle className="text-gray-500 mr-2 mt-0.5" size={20} />
                  <div className="text-sm text-gray-600">
                    <p>サブスクリプションはいつでもキャンセルできます。</p>
                    <p>次回の更新日の前日までにキャンセルしない限り、自動的に更新されます。</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold mb-3">ポイントの使い方</h2>
        <ul className="space-y-3">
          <li className="flex items-center p-2 border-b border-gray-100">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Heart className="text-primary" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">スーパーいいね！</h3>
              <p className="text-sm text-gray-500">相手に目立つ形で関心を伝えられます</p>
            </div>
            <div className="text-primary font-medium">50 pts</div>
          </li>
          <li className="flex items-center p-2 border-b border-gray-100">
            <div className="bg-blue-50 p-2 rounded-full mr-3">
              <Zap className="text-blue-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">プロフィールブースト</h3>
              <p className="text-sm text-gray-500">30分間、検索上位に表示されます</p>
            </div>
            <div className="text-primary font-medium">100 pts</div>
          </li>
          <li className="flex items-center p-2 border-b border-gray-100">
            <div className="bg-purple-50 p-2 rounded-full mr-3">
              <Gift className="text-purple-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">バーチャルギフト</h3>
              <p className="text-sm text-gray-500">相手にギフトを送ることができます</p>
            </div>
            <div className="text-primary font-medium">30+ pts</div>
          </li>
          <li className="flex items-center p-2">
            <div className="bg-green-50 p-2 rounded-full mr-3">
              <Package className="text-green-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">メッセージ送信</h3>
              <p className="text-sm text-gray-500">マッチング相手にメッセージを送信</p>
            </div>
            <div className="text-primary font-medium">5 pts</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
