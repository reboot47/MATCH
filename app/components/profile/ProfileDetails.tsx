"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaQuoteLeft,
  FaBriefcase, 
  FaHeart
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
}

interface ProfileDetailsProps {
  user: any;
  editable: boolean;
  onSave?: (updatedData: any) => Promise<boolean>;
  showInterestsOnly?: boolean;
}

// プロフィールセクションコンポーネント
const ProfileSection = ({ title, icon, fields, isEditing, onFieldChange }: ProfileSectionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, fieldName: string) => {
    onFieldChange(fieldName, e.target.value);
  };

  return (
    <div className="border-b pb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-[#66cdaa]">{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((field, index) => (
          <div key={index} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            
            {isEditing ? (
              field.type === 'text' || field.type === 'number' ? (
                <input
                  type={field.type}
                  value={field.value || ''}
                  onChange={(e) => handleChange(e, field.name)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#66cdaa] focus:border-[#66cdaa]"
                />
              ) : field.type === 'select' ? (
                <select
                  value={field.value || ''}
                  onChange={(e) => handleChange(e, field.name)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#66cdaa] focus:border-[#66cdaa]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#66cdaa] focus:border-[#66cdaa]"
                />
              )
            ) : (
              <div className="text-gray-800">
                {field.type === 'select' && field.options ? (
                  field.options.find(o => o.value === field.value)?.label || '未設定'
                ) : (
                  field.value ? (
                    <>
                      {field.value}
                      {field.suffix && <span className="text-gray-500 ml-1">{field.suffix}</span>}
                    </>
                  ) : '未設定'
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProfileDetails({ user, editable, onSave, showInterestsOnly = false }: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(user || {});
  
  const handleFieldChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = async () => {
    if (onSave) {
      const success = await onSave(formData);
      if (success) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
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
          <h2 className="text-xl font-bold">興味・趣味</h2>
          {editable && (
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-2 rounded-md ${
                isEditing ? 'bg-[#66cdaa] text-white' : 'border border-[#66cdaa] text-[#66cdaa]'
              } hover:opacity-90 transition-opacity`}
            >
              {isEditing ? '保存' : '編集'}
            </button>
          )}
        </div>
        
        <ProfileSection 
          title="興味・趣味" 
          icon={<FaHeart />}
          fields={[
            { 
              label: '興味・趣味', 
              name: 'interests',
              value: Array.isArray(formData?.interests) ? formData.interests.join(', ') : formData?.interests, 
              editable: true, 
              type: 'textarea' 
            }
          ]}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />
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
        <h2 className="text-xl font-bold">基本プロフィール</h2>
        {editable && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-md ${
              isEditing ? 'bg-[#66cdaa] text-white' : 'border border-[#66cdaa] text-[#66cdaa]'
            } hover:opacity-90 transition-opacity`}
          >
            {isEditing ? '保存' : '編集'}
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* 基本情報 */}
        <ProfileSection 
          title="基本情報" 
          icon={<FaUser />}
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
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />
        
        {/* 自己紹介 */}
        <ProfileSection 
          title="自己紹介" 
          icon={<FaQuoteLeft />}
          fields={[
            { label: '自己紹介', name: 'bio', value: formData?.bio, editable: true, type: 'textarea' }
          ]}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />
        
        {/* 仕事と学歴 */}
        <ProfileSection 
          title="仕事と学歴" 
          icon={<FaBriefcase />}
          fields={[
            { label: '職業', name: 'occupation', value: formData?.occupation, editable: true, type: 'text' },
            { label: '会社/組織', name: 'company', value: formData?.company, editable: true, type: 'text' },
            { label: '学歴', name: 'education', value: formData?.education, editable: true, type: 'text' }
          ]}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />
        
        {/* ライフスタイル */}
        <ProfileSection 
          title="ライフスタイル" 
          icon={<FaHeart />}
          fields={[
            { label: '身長', name: 'height', value: formData?.height, editable: true, type: 'number', suffix: 'cm' },
            { label: '飲酒', name: 'drinking', value: formData?.drinking, editable: true, type: 'select',
              options: [
                { value: 'never', label: '飲まない' },
                { value: 'rarely', label: 'たまに' },
                { value: 'socially', label: '社交的に' },
                { value: 'regularly', label: '定期的に' }
              ]
            },
            { label: '喫煙', name: 'smoking', value: formData?.smoking, editable: true, type: 'select',
              options: [
                { value: 'never', label: '吸わない' },
                { value: 'socially', label: '社交的に' },
                { value: 'regularly', label: '定期的に' }
              ]
            },
            { label: '子供', name: 'children', value: formData?.children, editable: true, type: 'select',
              options: [
                { value: 'no', label: 'いない' },
                { value: 'yes', label: 'いる' },
                { value: 'someday', label: 'いつか欲しい' },
                { value: 'never', label: '欲しくない' }
              ]
            }
          ]}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />
      </div>
    </motion.div>
  );
}
