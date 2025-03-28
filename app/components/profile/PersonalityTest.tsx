"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaRedo, FaSave, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface PersonalityTestProps {
  personalityType?: string;
  personalityTraits?: Record<string, number>;
  onSave: (type: string, traits: Record<string, number>) => Promise<boolean>;
  isUpdating?: boolean;
}

export default function PersonalityTest({ 
  personalityType, 
  personalityTraits = {},
  onSave,
  isUpdating = false
}: PersonalityTestProps) {
  const [retakeTest, setRetakeTest] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  // 16パーソナリティタイプに基づく簡易版質問
  const questions = [
    { id: 'q1', text: '新しい人と会うのが好きだ', category: 'extraversion' },
    { id: 'q2', text: '綿密な計画を立てるのが好きだ', category: 'judging' },
    { id: 'q3', text: '抽象的な考えや理論に興味がある', category: 'intuition' },
    { id: 'q4', text: '他者の感情に共感しやすい', category: 'feeling' },
    { id: 'q5', text: '長時間一人でいても問題ない', category: 'introversion' },
    { id: 'q6', text: '予定の変更に柔軟に対応できる', category: 'perceiving' },
    { id: 'q7', text: '具体的な事実や詳細に注目する', category: 'sensing' },
    { id: 'q8', text: '論理的分析を重視する', category: 'thinking' },
  ];

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculatePersonality = async () => {
    // すべての質問に回答したか確認
    if (Object.keys(answers).length < questions.length) {
      toast.error('すべての質問に回答してください');
      return;
    }

    setLoading(true);

    // 各特性のスコアを計算
    const traits = {
      extraversion: (answers['q1'] + (6 - answers['q5'])) / 2, // 外向性
      intuition: (answers['q3'] + (6 - answers['q7'])) / 2, // 直感
      thinking: (answers['q8'] + (6 - answers['q4'])) / 2, // 思考
      judging: (answers['q2'] + (6 - answers['q6'])) / 2, // 判断
    };

    // 各特性を二分法で分類
    const type = [
      traits.extraversion > 3 ? 'E' : 'I', // 外向型 vs 内向型
      traits.intuition > 3 ? 'N' : 'S', // 直感型 vs 感覚型
      traits.thinking > 3 ? 'T' : 'F', // 思考型 vs 感情型
      traits.judging > 3 ? 'J' : 'P'  // 判断型 vs 知覚型
    ].join('');

    try {
      // 結果を保存
      await onSave(type, {
        extraversion: traits.extraversion * 20, // 0-100スケールに変換
        intuition: traits.intuition * 20,
        thinking: traits.thinking * 20,
        judging: traits.judging * 20
      });
      toast.success('性格診断結果を保存しました！');
      setRetakeTest(false); // テスト表示を閉じる
    } catch (error) {
      console.error('Failed to save personality test results:', error);
      toast.error('保存に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 性格タイプの名前を取得
  const getPersonalityName = (type: string) => {
    const typeMap: Record<string, string> = {
      'ESTJ': '管理者型',
      'ESTP': '起業家型',
      'ESFJ': '領事官型',
      'ESFP': 'エンターテイナー型',
      'ENTJ': '指揮官型',
      'ENTP': '討論者型',
      'ENFJ': '主人公型',
      'ENFP': '広報運動家型',
      'ISTJ': '管理者型',
      'ISTP': '巨匠型',
      'ISFJ': '擁護者型',
      'ISFP': '冒険家型',
      'INTJ': '建築家型',
      'INTP': '論理学者型',
      'INFJ': '提唱者型',
      'INFP': '仲介者型'
    };
    return typeMap[type] || '分析中...';
  };

  // 性格タイプの説明を取得
  const getPersonalityDescription = (type: string) => {
    const descMap: Record<string, string> = {
      'ESTJ': '実践的で事実重視、具体的なアプローチを好みます。責任感が強く、組織的です。',
      'ESTP': '行動力があり、リスクを恐れず、目の前の問題を解決することを好みます。',
      'ESFJ': '協力的で思いやりがあり、他者のニーズに敏感です。調和を重視します。',
      'ESFP': '自発的で活発、社交的で人生を楽しむことを大切にします。',
      'ENTJ': '論理的で決断力があり、長期的な計画を立てるのが得意です。',
      'ENTP': '創造的で知的好奇心が強く、新しいアイデアを探求することを好みます。',
      'ENFJ': 'カリスマ性があり、人々を導き、インスピレーションを与えることを好みます。',
      'ENFP': '熱意があり想像力豊かで、可能性を追求します。人間関係を大切にします。',
      'ISTJ': '実直で責任感が強く、伝統を尊重します。秩序を重視します。',
      'ISTP': '論理的で実践的、問題解決に優れています。自立心があります。',
      'ISFJ': '思いやりがあり献身的で、他者のニーズに敏感です。詳細に注意を払います。',
      'ISFP': '芸術的で感受性が強く、自分の価値観に基づいて行動します。',
      'INTJ': '独立心が強く、システム思考に優れています。常に改善を求めます。',
      'INTP': '論理的で客観的、理論的な分析を好みます。知的好奇心が強いです。',
      'INFJ': '理想主義的で深い洞察力を持ち、強い信念に基づいて行動します。',
      'INFP': '理想主義的で感受性が強く、自分の価値観に忠実です。創造性に優れています。'
    };
    return descMap[type] || 'あなたの性格タイプを分析中です...';
  };
  
  // トレイトの名前をラベルに変換
  const getTraitLabel = (trait: string) => {
    const traitMap: Record<string, string> = {
      'extraversion': '外向性',
      'intuition': '直感力',
      'thinking': '論理性',
      'judging': '計画性'
    };
    return traitMap[trait] || trait;
  };

  // トレイトのペアを取得
  const getTraitPair = (trait: string) => {
    const pairMap: Record<string, [string, string]> = {
      'extraversion': ['内向的', '外向的'],
      'intuition': ['現実的', '直感的'],
      'thinking': ['感情的', '論理的'],
      'judging': ['柔軟性', '計画性']
    };
    return pairMap[trait] || ['低', '高'];
  };

  // 結果表示のアニメーションバリアント
  const resultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // 質問表示のアニメーションバリアント
  const questionVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <FaChartLine className="mr-2 text-teal-500" /> 
        あなたの性格診断
      </h2>
      
      {personalityType && !retakeTest ? (
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="text-4xl font-bold text-teal-600 bg-teal-50 h-20 w-20 flex items-center justify-center rounded-lg">
              {personalityType}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{getPersonalityName(personalityType)}</h3>
              <p className="text-gray-600">{getPersonalityDescription(personalityType)}</p>
            </div>
          </div>
          
          {personalityTraits && Object.keys(personalityTraits).length > 0 && (
            <div className="mb-6 space-y-4">
              {Object.entries(personalityTraits).map(([trait, value]) => (
                <div key={trait}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{getTraitLabel(trait)}</span>
                    <span className="text-sm text-gray-500">{Math.round(Number(value))}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 w-20 md:w-24">{getTraitPair(trait)[0]}</span>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-2 bg-teal-500 rounded-full" 
                        ></motion.div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-20 md:w-24 text-right">{getTraitPair(trait)[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <motion.button 
            onClick={() => setRetakeTest(true)}
            className="flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-md hover:bg-teal-200 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo /> 診断をやり直す
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <p className="text-gray-600">
            以下の質問に答えて、あなたの性格タイプを診断しましょう。
            各質問に対して、あなたにどれくらい当てはまるかを1〜5で評価してください。
          </p>
          
          {questions.map((q, index) => (
            <motion.div 
              key={q.id} 
              className="border-b pb-4"
              custom={index}
              variants={questionVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="mb-2 font-medium">{q.text}</p>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 w-full md:w-auto flex items-center justify-between">
                  <span className="text-xs text-gray-500 w-20 text-left">全く<br className="md:hidden"/>当てはまらない</span>
                  <div className="flex gap-2 md:gap-3 mx-2">
                    {[1, 2, 3, 4, 5].map(value => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(q.id, value)}
                        className={`w-10 h-10 rounded-full font-medium transition-colors ${
                          answers[q.id] === value 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">非常に<br className="md:hidden"/>当てはまる</span>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="flex justify-end">
            {retakeTest && (
              <button
                onClick={() => setRetakeTest(false)}
                className="mr-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                キャンセル
              </button>
            )}
            
            <motion.button
              onClick={calculatePersonality}
              disabled={loading || isUpdating || Object.keys(answers).length < questions.length}
              className={`flex items-center gap-2 bg-teal-500 text-white px-5 py-2 rounded-md transition
                ${(loading || isUpdating || Object.keys(answers).length < questions.length) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading || isUpdating ? (
                <>
                  <FaSpinner className="animate-spin" /> 処理中...
                </>
              ) : (
                <>
                  <FaSave /> 結果を保存
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
