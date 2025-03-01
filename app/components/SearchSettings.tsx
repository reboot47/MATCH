'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSliders, FiCheck } from 'react-icons/fi';

// 検索設定の型定義
export type SearchParams = {
  keyword: string;
  minAge: number | null;
  maxAge: number | null;
  minHeight: number | null;
  maxHeight: number | null;
  hasPhoto: boolean;
  hasVideo: boolean;
  drinking: string | null;
  smoking: string | null;
  gender: string | null;
  job: string | null;
  ignoreAge: boolean;
  ignoreHeight: boolean;
  ignorePhotoVideo: boolean;
  ignoreDrinking: boolean;
  ignoreSmoking: boolean;
  ignoreGender: boolean;
  selectedAppealTags?: string[];
};

// デフォルト値
export const defaultSearchParams: SearchParams = {
  keyword: '',
  minAge: 18,
  maxAge: 65,
  minHeight: 140,
  maxHeight: 200,
  hasPhoto: false,
  hasVideo: false,
  drinking: null,
  smoking: null,
  gender: null,
  job: null,
  ignoreAge: false,
  ignoreHeight: false,
  ignorePhotoVideo: false,
  ignoreDrinking: false,
  ignoreSmoking: false,
  ignoreGender: false,
  selectedAppealTags: []
};

interface SearchSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (params: SearchParams) => void;
  initialParams?: SearchParams;
}

const SearchSettings: React.FC<SearchSettingsProps> = ({
  isOpen,
  onClose,
  onApply,
  initialParams = defaultSearchParams
}) => {
  const [searchParams, setSearchParams] = useState<SearchParams>(initialParams);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (key: keyof SearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(searchParams);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full bg-white rounded-t-2xl h-[90vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <button onClick={onClose}>
            <FiX size={24} className="text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">検索条件</h3>
          <div className="w-6"></div>
        </div>

        <div className="p-4 pb-32">
          {/* フリーワード */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">フリーワード</h4>
            <div className="border border-gray-300 rounded-md p-1">
              <input
                type="text"
                value={searchParams.keyword}
                onChange={e => handleChange('keyword', e.target.value)}
                placeholder="キーワードで検索"
                className="w-full p-2 outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">名前・自己紹介・趣味などから検索できます</p>
          </div>

          {/* 写真と動画 */}
          <div className="mb-6">
            <div className="section-header">
              <h3>写真と動画</h3>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="ignorePhotoVideo"
                  checked={searchParams.ignorePhotoVideo}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    console.log('設定しない（写真と動画）:', checked);
                    setSearchParams({
                      ...searchParams,
                      ignorePhotoVideo: checked
                    });
                  }}
                  className="mr-2 accent-teal-500" 
                />
                <label htmlFor="ignorePhotoVideo" className="text-sm">
                  設定しない
                </label>
              </div>
            </div>
            <div className={`section-content ${searchParams.ignorePhotoVideo ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="hasPhoto"
                    checked={searchParams.hasPhoto}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      console.log('写真あり:', checked);
                      setSearchParams({
                        ...searchParams,
                        hasPhoto: checked
                      });
                    }}
                    className="mr-2 accent-teal-500" 
                  />
                  <label htmlFor="hasPhoto">写真あり</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="hasVideo"
                    checked={searchParams.hasVideo}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      console.log('動画あり:', checked);
                      setSearchParams({
                        ...searchParams,
                        hasVideo: checked
                      });
                    }}
                    className="mr-2 accent-teal-500" 
                  />
                  <label htmlFor="hasVideo">動画あり</label>
                </div>
              </div>
            </div>
          </div>

          {/* 年齢 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">年齢プロフィール</h4>
              <div 
                className={`flex items-center cursor-pointer ${searchParams.ignoreAge ? 'text-teal-500' : 'text-gray-500'}`}
                onClick={() => handleChange('ignoreAge', !searchParams.ignoreAge)}
              >
                <div className={`w-5 h-5 rounded border mr-1 flex items-center justify-center ${searchParams.ignoreAge ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                  {searchParams.ignoreAge && <FiCheck className="text-teal-500" size={14} />}
                </div>
                <span className="text-xs">設定しない</span>
              </div>
            </div>
            <div className={`${searchParams.ignoreAge ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{searchParams.minAge}歳</span>
                <span className="text-sm">{searchParams.maxAge}歳</span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={searchParams.minAge || 18}
                  onChange={e => handleChange('minAge', parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                  disabled={searchParams.ignoreAge}
                />
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={searchParams.maxAge || 65}
                  onChange={e => handleChange('maxAge', parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                  disabled={searchParams.ignoreAge}
                />
              </div>
            </div>
          </div>

          {/* 身長 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">身長・体型</h4>
              <div 
                className={`flex items-center cursor-pointer ${searchParams.ignoreHeight ? 'text-teal-500' : 'text-gray-500'}`}
                onClick={() => handleChange('ignoreHeight', !searchParams.ignoreHeight)}
              >
                <div className={`w-5 h-5 rounded border mr-1 flex items-center justify-center ${searchParams.ignoreHeight ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                  {searchParams.ignoreHeight && <FiCheck className="text-teal-500" size={14} />}
                </div>
                <span className="text-xs">設定しない</span>
              </div>
            </div>
            <div className={`${searchParams.ignoreHeight ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{searchParams.minHeight}cm</span>
                <span className="text-sm">{searchParams.maxHeight}cm</span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={searchParams.minHeight || 140}
                  onChange={e => handleChange('minHeight', parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                  disabled={searchParams.ignoreHeight}
                />
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={searchParams.maxHeight || 200}
                  onChange={e => handleChange('maxHeight', parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                  disabled={searchParams.ignoreHeight}
                />
              </div>
            </div>
          </div>

          {/* お酒 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">お酒</h4>
              <div 
                className={`flex items-center cursor-pointer ${searchParams.ignoreDrinking ? 'text-teal-500' : 'text-gray-500'}`}
                onClick={() => handleChange('ignoreDrinking', !searchParams.ignoreDrinking)}
              >
                <div className={`w-5 h-5 rounded border mr-1 flex items-center justify-center ${searchParams.ignoreDrinking ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                  {searchParams.ignoreDrinking && <FiCheck className="text-teal-500" size={14} />}
                </div>
                <span className="text-xs">設定しない</span>
              </div>
            </div>
            <div className={`grid grid-cols-3 gap-2 ${searchParams.ignoreDrinking ? 'opacity-50 pointer-events-none' : ''}`}>
              {['よく飲む', 'たまに飲む', '飲まない'].map(option => (
                <div
                  key={option}
                  className={`border rounded-lg p-2 text-center cursor-pointer ${
                    searchParams.drinking === option ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                  }`}
                  onClick={() => handleChange('drinking', searchParams.drinking === option ? null : option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {/* タバコ */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">タバコ</h4>
              <div 
                className={`flex items-center cursor-pointer ${searchParams.ignoreSmoking ? 'text-teal-500' : 'text-gray-500'}`}
                onClick={() => handleChange('ignoreSmoking', !searchParams.ignoreSmoking)}
              >
                <div className={`w-5 h-5 rounded border mr-1 flex items-center justify-center ${searchParams.ignoreSmoking ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                  {searchParams.ignoreSmoking && <FiCheck className="text-teal-500" size={14} />}
                </div>
                <span className="text-xs">設定しない</span>
              </div>
            </div>
            <div className={`grid grid-cols-3 gap-2 ${searchParams.ignoreSmoking ? 'opacity-50 pointer-events-none' : ''}`}>
              {['吸う', 'たまに吸う', '吸わない'].map(option => (
                <div
                  key={option}
                  className={`border rounded-lg p-2 text-center cursor-pointer ${
                    searchParams.smoking === option ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                  }`}
                  onClick={() => handleChange('smoking', searchParams.smoking === option ? null : option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {/* 性別 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">性別</h4>
              <div 
                className={`flex items-center cursor-pointer ${searchParams.ignoreGender ? 'text-teal-500' : 'text-gray-500'}`}
                onClick={() => handleChange('ignoreGender', !searchParams.ignoreGender)}
              >
                <div className={`w-5 h-5 rounded border mr-1 flex items-center justify-center ${searchParams.ignoreGender ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                  {searchParams.ignoreGender && <FiCheck className="text-teal-500" size={14} />}
                </div>
                <span className="text-xs">設定しない</span>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-2 ${searchParams.ignoreGender ? 'opacity-50 pointer-events-none' : ''}`}>
              {['男性', '女性'].map(option => (
                <div
                  key={option}
                  className={`border rounded-lg p-2 text-center cursor-pointer ${
                    searchParams.gender === option ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                  }`}
                  onClick={() => handleChange('gender', searchParams.gender === option ? null : option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {/* 職業 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">職業</h4>
            <div className="border border-gray-300 rounded-md p-1">
              <select
                value={searchParams.job || ''}
                onChange={e => handleChange('job', e.target.value || null)}
                className="w-full p-2 outline-none bg-white"
              >
                <option value="">すべての職業</option>
                <option value="会社員">会社員</option>
                <option value="公務員">公務員</option>
                <option value="自営業">自営業</option>
                <option value="経営者">経営者</option>
                <option value="フリーランス">フリーランス</option>
                <option value="クリエイター">クリエイター</option>
                <option value="エンジニア">エンジニア</option>
                <option value="デザイナー">デザイナー</option>
                <option value="マーケター">マーケター</option>
                <option value="営業職">営業職</option>
                <option value="医療従事者">医療従事者</option>
                <option value="教育関係">教育関係</option>
                <option value="金融関係">金融関係</option>
                <option value="芸能関係">芸能関係</option>
                <option value="スポーツ関係">スポーツ関係</option>
                <option value="サービス業">サービス業</option>
                <option value="学生">学生</option>
                <option value="専業主婦/主夫">専業主婦/主夫</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>
        </div>

        {/* 確定ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={handleApply}
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          >
            <FiSliders className="mr-2" />
            この条件で検索する
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchSettings;
