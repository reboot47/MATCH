// 自動応答テンプレート用のカテゴリ
export const TEMPLATE_CATEGORIES = [
  { id: 'greeting', name: '挨拶' },
  { id: 'question', name: '質問' },
  { id: 'invitation', name: '誘い' },
  { id: 'follow_up', name: 'フォローアップ' },
  { id: 'compliment', name: '褒め言葉' },
  { id: 'emoji', name: '絵文字・スタンプ' },
  { id: 'other', name: 'その他' },
];

// 自動応答ルール用の条件タイプ
export const RULE_CONDITION_TYPES = [
  { id: 'match_new', name: '新規マッチ', description: 'ユーザーと新しくマッチした時に送信' },
  { id: 'message_received', name: 'メッセージ受信', description: 'ユーザーからメッセージを受け取った時に送信' },
  { id: 'time_elapsed', name: '時間経過', description: '特定の時間が経過した時に送信' },
  { id: 'user_profile', name: 'ユーザープロフィール', description: 'ユーザープロフィールに基づいて送信' },
  { id: 'no_response', name: '無応答', description: 'ユーザーからの応答がない場合に送信' },
];

// 自動応答ルール用の演算子
export const RULE_OPERATORS = [
  { id: 'equals', name: '一致', applicableTypes: ['message_received', 'user_profile'] },
  { id: 'contains', name: '含む', applicableTypes: ['message_received', 'user_profile'] },
  { id: 'regex', name: '正規表現', applicableTypes: ['message_received', 'user_profile'] },
  { id: 'greater_than', name: 'より大きい', applicableTypes: ['time_elapsed'] },
  { id: 'less_than', name: 'より小さい', applicableTypes: ['time_elapsed'] },
];

// テンプレート内で使用可能な変数
export const TEMPLATE_VARIABLES = [
  // ユーザー情報
  { name: '{{user_name}}', description: 'ユーザー名', category: 'user', examples: ['田中さん', '佐藤さん'] },
  { name: '{{user_age}}', description: 'ユーザーの年齢', category: 'user', examples: ['25', '30'] },
  { name: '{{user_location}}', description: 'ユーザーの場所', category: 'user', examples: ['東京', '大阪'] },
  { name: '{{user_hobby}}', description: 'ユーザーの趣味', category: 'user', examples: ['映画鑑賞', '料理'] },
  { name: '{{user_job}}', description: 'ユーザーの職業', category: 'user', examples: ['会社員', 'エンジニア'] },
  
  // マッチ情報
  { name: '{{match_time}}', description: 'マッチした時間', category: 'match', examples: ['12:30', '18:45'] },
  { name: '{{match_date}}', description: 'マッチした日付', category: 'match', examples: ['10月5日', '先週'] },
  { name: '{{days_matched}}', description: 'マッチしてからの日数', category: 'match', examples: ['3日', '1週間'] },
  
  // その他
  { name: '{{current_time}}', description: '現在の時間', category: 'misc', examples: ['朝', '夕方', '夜'] },
  { name: '{{current_day}}', description: '現在の曜日', category: 'misc', examples: ['月曜日', '週末'] },
  { name: '{{food_type}}', description: '食べ物の種類', category: 'misc', examples: ['イタリアン', '和食'] },
  { name: '{{location}}', description: '場所', category: 'misc', examples: ['渋谷', '新宿'] },
  { name: '{{hobby}}', description: '趣味', category: 'misc', examples: ['映画鑑賞', 'カフェ巡り'] },
];
