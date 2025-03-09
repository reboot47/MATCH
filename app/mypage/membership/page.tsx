"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiCheck, HiX, HiChevronRight } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';
import Link from 'next/link';

interface VerificationStatus {
  ageVerification: boolean;
  identityVerification: boolean;
  incomeVerification: boolean;
}

interface MembershipOption {
  id: string;
  name: string;
  description: string;
  active: boolean;
  purchased: boolean;
  actionText: string;
  actionLink: string;
}

export default function MembershipStatusPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;

  const [isLoading, setIsLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('スタンダード会員');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    ageVerification: true,
    identityVerification: false,
    incomeVerification: false
  });
  
  const [membershipOptions, setMembershipOptions] = useState<MembershipOption[]>([]);

  useEffect(() => {
    // 実際のアプリではAPIから会員ステータスを取得
    const fetchMembershipStatus = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 800));

        // 会員ステータスのモックデータ
        setCurrentPlan('スタンダード会員');
        
        // 認証状態のモックデータ
        setVerificationStatus({
          ageVerification: true,
          identityVerification: false,
          incomeVerification: false
        });

        // 会員オプションのモックデータ
        setMembershipOptions([
          {
            id: 'standard',
            name: 'スタンダードプラン',
            description: 'スタンダード会員はメッセージの送受信が3通目から有料となります。お得に利用するため、月額課金のプラン購入（いいね！使い放題）をおすすめします。',
            active: true,
            purchased: true,
            actionText: '',
            actionLink: ''
          },
          {
            id: 'gold',
            name: 'ゴールドオプション',
            description: '女性へのレビュー閲覧／高度な検索機能／メッセージ既読機能の使用など、より高機能な仕様を多数ご利用いただけるようになります。',
            active: false,
            purchased: false,
            actionText: '申し込む',
            actionLink: '/payment/gold'
          },
          {
            id: 'vip',
            name: 'VIPオプション',
            description: '最上位プランです。お相手からの印象を大きく高める、認証マークの取得や毎月の特典、シークレットパーティの招待などがあります。',
            active: false,
            purchased: false,
            actionText: '申し込む',
            actionLink: '/payment/vip'
          },
          {
            id: 'peters',
            name: 'peters club',
            description: '特別なご要望があれば、直接1対1で専属の担当者がお客様の理想のパートナーを探すお手伝いをする完全マッチングコンシェルジュサービス。',
            active: false,
            purchased: false,
            actionText: '申し込む',
            actionLink: '/payment/peters-club'
          }
        ]);
      } catch (error) {
        console.error('会員ステータスの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipStatus();
  }, []);

  const renderMembershipLevelBar = () => {
    return (
      <div className="mt-4 mb-6 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">現在</span>
          <span className="text-xs text-gray-500"></span>
        </div>
        <div className="relative">
          {/* メンバーシップレベルのバー */}
          <div className="grid grid-cols-3 h-8 overflow-hidden rounded-md">
            <div className={`flex items-center justify-center text-white text-xs font-medium ${
              currentPlan === 'スタンダード会員' ? 'bg-teal-500' : 'bg-gray-200'
            }`}>
              スタンダード
            </div>
            <div className={`flex items-center justify-center text-white text-xs font-medium ${
              currentPlan === 'ゴールド会員' ? 'bg-amber-500' : 'bg-gray-200'
            }`}>
              ゴールド
            </div>
            <div className={`flex items-center justify-center text-white text-xs font-medium ${
              currentPlan === 'VIP会員' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              VIP
            </div>
          </div>
          
          {/* アイコン表示 */}
          <div className="absolute top-full left-1/6 transform -translate-x-1/2 -mt-1">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
              currentPlan === 'スタンダード会員' ? 'bg-teal-500' : 'bg-gray-200'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVerificationItem = (
    title: string, 
    description: string, 
    isVerified: boolean, 
    actionLink?: string, 
    actionText?: string
  ) => {
    return (
      <div className={`p-4 rounded-md shadow-sm mb-3 ${
        isVerified ? 'border border-teal-200 bg-white' : 'bg-gray-100'
      }`}>
        <div className="flex items-start">
          <div className={`rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 ${
            isVerified ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            {isVerified ? <HiCheck size={16} /> : <div className="h-3 w-3 rounded-full bg-gray-400"></div>}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800">{title}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                isVerified ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
              }`}>
                {isVerified ? '完了' : '未完了'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            
            {!isVerified && actionLink && (
              <div className="mt-2">
                <Link href={actionLink} className="text-teal-500 text-sm flex items-center">
                  {actionText || '登録する'} <HiChevronRight className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMembershipOption = (option: MembershipOption) => {
    return (
      <div className={`p-4 rounded-md shadow-sm mb-3 ${
        option.active ? 'border border-teal-200 bg-white' : 'bg-gray-100'
      }`}>
        <div className="flex items-start">
          <div className={`rounded-full h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0 ${
            option.active ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            {option.active ? <HiCheck size={16} /> : <div className="h-3 w-3 rounded-full bg-gray-400"></div>}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800">{option.name}</h3>
              {option.purchased ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  現在のプラン
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-100 text-red-800">
                  未購入
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            
            {!option.purchased && option.actionLink && (
              <div className="mt-2">
                <Link href={option.actionLink} className="text-teal-500 text-sm flex items-center">
                  {option.actionText} <HiChevronRight className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="mr-4 text-gray-600"
          aria-label="戻る"
        >
          <HiChevronLeft size={24} />
        </button>
        <h1 className="text-center flex-grow font-medium text-lg">会員ステータス</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="max-w-md mx-auto mt-4">
            {/* 現在の会員ステータス */}
            <div className="bg-white rounded-md shadow-sm p-4 mb-4">
              <div className="text-sm text-gray-500">現在の会員ステータス</div>
              <div className="text-lg font-medium text-teal-600">{currentPlan}</div>
            </div>

            {/* 会員レベルバー */}
            {renderMembershipLevelBar()}

            {/* 認証状態セクション */}
            <div className="mt-6">
              {renderVerificationItem(
                '年齢確認',
                '同意を得た場合、年齢確認のため2点メッセージのやり取りをご利用いただく前に、年齢確認が必要です。',
                verificationStatus.ageVerification
              )}
              
              {renderVerificationItem(
                '本人確認',
                'あなたが写真本人であることを証明します。本人確認バッジが付与されます。',
                verificationStatus.identityVerification,
                '/verification/identity',
                '本人確認する'
              )}
              
              {renderVerificationItem(
                '所得証明',
                '一定の収入と安定収入を証明することで、多くのお相手から信頼を得ることができるため、所得証明が役立ちます。',
                verificationStatus.incomeVerification,
                '/verification/income',
                '所得証明する'
              )}
            </div>

            {/* 会員オプションセクション */}
            <div className="mt-6">
              {membershipOptions.map((option) => (
                renderMembershipOption(option)
              ))}
            </div>

            {/* 料金プランについての情報リンク */}
            <div className="mt-6 text-center">
              <Link href="/pricing" className="text-sm text-teal-500">
                料金プランの詳細について
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
