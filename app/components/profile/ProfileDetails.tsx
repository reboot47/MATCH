"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaQuoteLeft,
  FaBriefcase, 
  FaHeart,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

interface ProfileField {
  label: string;
  value: any;
  name: string; 
  editable: boolean;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  suffix?: string;
}

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  fields: ProfileField[];
  isEditing: boolean;
  onFieldChange: (name: string, value: any) => void;
  autoSave?: boolean;
}

interface ProfileDetailsProps {
  user: any;
  editable: boolean;
  onSave?: (updatedData: any) => Promise<boolean>;
  showInterestsOnly?: boolean;
  autoSave?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onAutoSave?: (name: string, value: any) => void;
  onAutoSaveMultiple?: (fields: any) => void;
}

// 保存状態表示コンポーネント
const SaveStatusIndicator = ({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) => {
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`text-sm flex items-center gap-2 ml-auto px-3 py-1 rounded-md ${
            status === 'saving' ? 'bg-teal-50 text-teal-600' :
            status === 'saved' ? 'bg-green-50 text-green-600' :
            status === 'error' ? 'bg-red-50 text-red-600' : ''
          }`}
        >
          {status === 'saving' && (
            <>
              <FaSpinner className="animate-spin" />
              <span>保存中...</span>
            </>
          )}
          {status === 'saved' && (
            <>
              <FaCheck />
              <span>保存しました</span>
            </>
          )}
          {status === 'error' && (
            <>
              <FaExclamationTriangle />
              <span>保存に失敗しました</span>
              <span className="text-xs ml-1">(データの形式を確認してください)</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// プロフィールセクションコンポーネント
const ProfileSection = ({ title, icon, fields, isEditing, onFieldChange, autoSave = false }: ProfileSectionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, fieldName: string) => {
    console.log('ProfileDetails handleChange called:', fieldName, e.target.value, 'type:', fields.find(field => field.name === fieldName)?.type);
    onFieldChange(fieldName, e.target.value);
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:mb-0">
      <div className="flex items-center gap-2 mb-5">
        <div className="text-teal-600">{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {fields.map((field, index) => (
          <div key={index} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            
            {isEditing ? (
              field.type === 'text' ? (
                <input
                  type="text"
                  value={field.value || ''}
                  onChange={(e) => handleChange(e, field.name)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                />
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  min="0"
                  step="1"
                  pattern="\d*"
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => {
                    console.log(`ProfileSection number input: ${field.name}, value=${e.target.value}, rawValue=${e.target.valueAsNumber}`);
                    
                    // 空の入力の場合は null を送信
                    const valueToSend = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    console.log(`ProfileSection number valueToSend: ${valueToSend}`);
                    
                    onFieldChange(field.name, valueToSend);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => {
                    console.log(`ProfileSection select input: ${field.name}, value=${e.target.value}`);
                    // 空の値の場合はnullに変換
                    const valueToSend = e.target.value === '' ? null : e.target.value;
                    onFieldChange(field.name, valueToSend);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-white"
                >
                  <option value="">選択してください</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  value={field.value || ''}
                  onChange={(e) => handleChange(e, field.name)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                />
              )
            ) : (
              <div className="text-gray-800 py-2 px-1">
                {field.type === 'select' && field.options ? (
                  field.options.find(o => o.value === field.value)?.label || '未設定'
                ) : (
                  field.value ? (
                    <>
                      {field.value}
                      {field.suffix && <span className="text-gray-500 ml-1">{field.suffix}</span>}
                    </>
                  ) : <span className="text-gray-400 italic">未設定</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProfileDetails({ 
  user, 
  editable, 
  onSave, 
  showInterestsOnly = false,
  autoSave = false,
  saveStatus = 'idle',
  onAutoSave,
  onAutoSaveMultiple
}: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(user || {});
  const [isSaving, setIsSaving] = useState(false);
  const saveTimers = useRef({});

  // ユーザーデータが変更されたときに状態を更新
  useEffect(() => {
    setFormData(user || {});
  }, [user]);

  // 年齢入力ハンドラー（数値型に変換）
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`ProfileDetails handleAgeChange: value=${value}, type=${typeof value}`);
    
    // 空の入力または数値のみを許可
    if (value === '' || /^\d+$/.test(value)) {
      // 数値に変換（空文字列は変換しない）
      const numValue = value === '' ? '' : parseInt(value, 10);
      handleFieldChange('age', numValue);
    }
  };

  // フィールド値変更ハンドラー
  const handleFieldChange = (name: string, value: any) => {
    console.log(`ProfileDetails handleFieldChange: field=${name}, value=${value}, autoSave=${autoSave}, hasOnAutoSave=${!!onAutoSave}`);
    
    // interestsフィールドの特別処理（カンマ区切りの文字列を配列に変換）
    let processedValue = value;
    if (name === 'interests' && typeof value === 'string') {
      processedValue = value.split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
    }
    
    const newFormData = {
      ...formData,
      [name]: processedValue
    };
    
    setFormData(newFormData);
    
    // 自動保存モードの場合、変更を即時保存
    if (autoSave && onAutoSave) {
      console.log(`ProfileDetails: calling onAutoSave for field ${name} with value=${JSON.stringify(processedValue).substring(0, 100)}`);
      
      // 保存前に遅延タイマーで同じフィールドの複数回の更新を防止
      if (saveTimers.current[name]) {
        clearTimeout(saveTimers.current[name]);
      }
      
      saveTimers.current[name] = setTimeout(() => {
        console.log(`ProfileDetails: delayed onAutoSave for field ${name} now executing`);
        onAutoSave(name, processedValue);
        delete saveTimers.current[name];
      }, 300); // 300ms遅延
    }
  };
  
  // フォームデータをAPI送信用にクリーンアップ
  const cleanupFormData = (data: any) => {
    const cleanData = { ...data };
    
    // 数値フィールドを処理
    if (cleanData.age !== undefined && cleanData.age !== null) {
      const parsed = parseInt(cleanData.age, 10);
      cleanData.age = isNaN(parsed) ? null : parsed;
    }
    
    // 空文字列をnullに変換
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '') {
        cleanData[key] = null;
      }
    });
    
    return cleanData;
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        // データクリーンアップを追加
        const cleanedData = cleanupFormData(formData);
        console.log('保存前のデータクリーンアップ:', {
          前: Object.fromEntries(
            Object.entries(formData).map(([k, v]) => [k, `${v} (${typeof v})`])
          ),
          後: Object.fromEntries(
            Object.entries(cleanedData).map(([k, v]) => [k, `${v} (${typeof v})`])
          )
        });
        
        // クリーンアップしたデータで保存
        const success = await onSave(cleanedData);
        
        if (success) {
          setIsEditing(false);
          // toast.success('プロフィールを更新しました');
        } else {
          // toast.error('プロフィールの更新に失敗しました');
        }
      } catch (err) {
        console.error('プロフィール保存エラー:', err);
        // toast.error('保存処理中にエラーが発生しました');
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  const AutoSaveInfo = () => {
    return (
      <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-6 text-sm">
        <div className="flex items-start gap-2">
          <FaInfoCircle className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">自動保存モードについて</p>
            <p>変更はすぐに保存されます。数値フィールド（年齢など）は数字のみ入力可能です。</p>
          </div>
        </div>
      </div>
    );
  };

  // 特定のセクションのみを表示（興味のみ表示モード）
  if (showInterestsOnly) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">興味・趣味</h2>
          {editable && !autoSave && (
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
              className={`px-4 py-2 rounded-md flex items-center ${
                isEditing 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
              } transition-colors`}
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  保存中...
                </>
              ) : (
                isEditing ? '保存' : '編集'
              )}
            </button>
          )}
          
          {/* 自動保存モードでは常に編集状態 */}
          {editable && autoSave && (
            <SaveStatusIndicator status={saveStatus} />
          )}
        </div>
        
        {autoSave && <AutoSaveInfo />}
        
        <ProfileSection 
          title="興味・趣味" 
          icon={<FaHeart className="w-5 h-5 text-teal-600" />}
          fields={[
            { 
              label: '興味・趣味（カンマ区切りで入力）', 
              name: 'interests',
              value: Array.isArray(formData?.interests) ? formData.interests.join(', ') : formData?.interests, 
              editable: true, 
              type: 'textarea' 
            }
          ]}
          isEditing={isEditing || autoSave}
          onFieldChange={handleFieldChange}
          autoSave={autoSave}
        />

        {/* 趣味の表示方法のヒント */}
        {(isEditing || autoSave) && (
          <div className="mt-4 bg-teal-50 rounded-md p-3 text-sm text-teal-800">
            <p><strong>ヒント:</strong> 興味・趣味は「旅行, 読書, 料理」のようにカンマ区切りで入力してください。マッチングの際に共通の趣味として活用されます。</p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">基本プロフィール</h2>
        {editable && !autoSave && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md flex items-center ${
              isEditing 
                ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
            } transition-colors`}
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                保存中...
              </>
            ) : (
              isEditing ? '保存' : '編集'
            )}
          </button>
        )}
        
        {/* 自動保存モードでは保存状態を表示 */}
        {editable && autoSave && (
          <SaveStatusIndicator status={saveStatus} />
        )}
      </div>
      
      {/* 自動保存モードの説明 */}
      {autoSave && <AutoSaveInfo />}
      
      <div className="space-y-6">
        {/* 基本情報 */}
        <ProfileSection 
          title="基本情報" 
          icon={<FaUser className="w-5 h-5 text-teal-600" />}
          fields={[
            { label: '名前', name: 'name', value: formData?.name, editable: true, type: 'text' },
            { label: '年齢', name: 'age', value: formData?.age, editable: true, type: 'number' },
            { label: '性別', name: 'gender', value: formData?.gender, editable: true, type: 'select', 
              options: [
                { value: 'male', label: '男性' },
                { value: 'female', label: '女性' },
                { value: 'other', label: 'その他' }
              ] 
            },
            { label: '居住地', name: 'location', value: formData?.location, editable: true, type: 'text' }
          ]}
          isEditing={isEditing || autoSave}
          onFieldChange={(name, value) => name === 'age' ? handleAgeChange({ target: { value } } as any) : handleFieldChange(name, value)}
          autoSave={autoSave}
        />
        
        {/* 自己紹介 */}
        <ProfileSection 
          title="自己紹介" 
          icon={<FaQuoteLeft className="w-5 h-5 text-teal-600" />}
          fields={[
            { label: '自己紹介', name: 'bio', value: formData?.bio, editable: true, type: 'textarea' }
          ]}
          isEditing={isEditing || autoSave}
          onFieldChange={handleFieldChange}
          autoSave={autoSave}
        />
        
        {/* 職業・学歴 */}
        <ProfileSection 
          title="職業・学歴" 
          icon={<FaBriefcase className="w-5 h-5 text-teal-600" />}
          fields={[
            { label: '職業', name: 'occupation', value: formData?.occupation, editable: true, type: 'text' },
            { label: '会社/組織', name: 'company', value: formData?.company, editable: true, type: 'text' },
            { label: '学歴', name: 'education', value: formData?.education, editable: true, type: 'text' }
          ]}
          isEditing={isEditing || autoSave}
          onFieldChange={handleFieldChange}
          autoSave={autoSave}
        />
        
        {/* 詳細情報 */}
        <ProfileSection 
          title="詳細情報" 
          icon={<FaInfoCircle className="w-5 h-5 text-teal-600" />}
          fields={[
            { label: '身長', name: 'height', value: formData?.height, editable: true, type: 'number', suffix: 'cm' },
            { label: '飲酒', name: 'drinking', value: formData?.drinking, editable: true, type: 'select', 
              options: [
                { value: 'never', label: '飲まない' },
                { value: 'sometimes', label: 'たまに飲む' },
                { value: 'often', label: 'よく飲む' }
              ]
            },
            { label: '喫煙', name: 'smoking', value: formData?.smoking, editable: true, type: 'select', 
              options: [
                { value: 'never', label: '吸わない' },
                { value: 'sometimes', label: 'たまに吸う' },
                { value: 'often', label: 'よく吸う' }
              ]
            },
            { label: '子供', name: 'children', value: formData?.children, editable: true, type: 'select',
              options: [
                { value: '0', label: 'いない' },
                { value: '1', label: '1人' },
                { value: '2', label: '2人' },
                { value: '3', label: '3人' },
                { value: '4', label: '4人以上' }
              ]
            }
          ]}
          isEditing={isEditing || autoSave}
          onFieldChange={(name, value) => handleFieldChange(name, value)}
          autoSave={autoSave}
        />
        
        {/* 興味・趣味 */}
        <ProfileSection 
          title="興味・趣味" 
          icon={<FaHeart className="w-5 h-5 text-teal-600" />}
          fields={[
            { 
              label: '興味・趣味（カンマ区切りで入力）', 
              name: 'interests',
              value: Array.isArray(formData?.interests) ? formData.interests.join(', ') : formData?.interests, 
              editable: true, 
              type: 'textarea' 
            }
          ]}
          isEditing={isEditing || autoSave}
          onFieldChange={handleFieldChange}
          autoSave={autoSave}
        />

        {/* プロフィール記入のヒント */}
        {(isEditing || autoSave) && (
          <div className="mt-6 bg-teal-50 rounded-md p-4 text-sm text-teal-800">
            <h4 className="font-semibold mb-2">プロフィール記入のヒント:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>自己紹介は具体的に書くと、より多くの人があなたに興味を持ちます</li>
              <li>趣味や興味は詳細に記入すると、共通点を持つ相手とマッチングしやすくなります</li>
              <li>職業や学歴などの情報も、相手にあなたのことを知ってもらうために重要です</li>
              <li>写真や動画と合わせて、バランスの取れたプロフィールを作成しましょう</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
