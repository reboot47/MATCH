import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface ProfileCompletionCardProps {
  percentage: number;
}

export default function ProfileCompletionCard({ percentage }: ProfileCompletionCardProps) {
  // 完成度に基づく色とメッセージ
  const getColorClass = () => {
    if (percentage < 30) return 'text-red-500 bg-red-50';
    if (percentage < 70) return 'text-amber-500 bg-amber-50';
    return 'text-green-500 bg-green-50';
  };

  const getMessage = () => {
    if (percentage < 30) return 'あなたのプロフィールはまだ不十分です。写真や詳細情報を追加しましょう。';
    if (percentage < 70) return 'プロフィールの充実度は平均的です。もう少し詳細を追加するとマッチング率が上がります。';
    if (percentage < 100) return 'プロフィールの完成度は高いです。あと少しで100%達成です！';
    return 'おめでとうございます！プロフィールは完璧です。';
  };

  return (
    <div className={`p-4 rounded-lg ${getColorClass()} mb-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">プロフィール完成度</h3>
        <span className="font-bold">{percentage}%</span>
      </div>
      
      <div className="w-full bg-white rounded-full h-2.5 mb-3">
        <div 
          className={`h-2.5 rounded-full ${percentage < 30 ? 'bg-red-500' : percentage < 70 ? 'bg-amber-500' : 'bg-green-500'}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-sm">{getMessage()}</p>
      
      {percentage < 100 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium">次のステップ:</p>
          <div className="space-y-1">
            {percentage < 40 && (
              <div className="flex items-center text-xs">
                <FaCheckCircle className="mr-1.5 text-gray-400" /> 
                <span>写真を追加する (必須)</span>
              </div>
            )}
            {percentage < 60 && (
              <div className="flex items-center text-xs">
                <FaCheckCircle className="mr-1.5 text-gray-400" /> 
                <span>性格診断を完了する</span>
              </div>
            )}
            {percentage < 80 && (
              <div className="flex items-center text-xs">
                <FaCheckCircle className="mr-1.5 text-gray-400" /> 
                <span>興味・趣味を5つ以上追加する</span>
              </div>
            )}
            {percentage < 100 && (
              <div className="flex items-center text-xs">
                <FaCheckCircle className="mr-1.5 text-gray-400" /> 
                <span>マッチング設定を完了する</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
