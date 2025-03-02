"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiOutlineAdjustments } from "react-icons/hi";

interface SearchSettingsProps {
  initialSettings: {
    gender?: string;
    minAge?: number;
    maxAge?: number;
    location?: string;
    distance?: number;
  };
  onApply: (settings: any) => void;
}

export default function SearchSettings({ initialSettings, onApply }: SearchSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings({
      ...settings,
      [name]: type === "number" ? Number(value) : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(settings);
    setIsOpen(false);
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ios-btn flex items-center space-x-1 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-sm"
      >
        <HiOutlineAdjustments className="w-5 h-5" />
        <span className="text-sm">検索条件</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 rounded-t-2xl p-6 z-50 ios-modal max-h-[90vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">検索条件</h2>
                <button onClick={() => setIsOpen(false)} className="ios-btn text-gray-500">
                  <HiX className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* 性別設定 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      性別
                    </label>
                    <div className="flex space-x-4">
                      {["男性", "女性", "その他"].map((gender) => (
                        <label 
                          key={gender} 
                          className={`flex-1 flex items-center justify-center border ${
                            settings.gender === gender 
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300" 
                              : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          } rounded-lg py-3 ios-btn`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={settings.gender === gender}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span>{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* 年齢範囲 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      年齢範囲: {settings.minAge || 18} - {settings.maxAge || 65}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          最小年齢
                        </label>
                        <input
                          type="range"
                          name="minAge"
                          min="18"
                          max="65"
                          value={settings.minAge || 18}
                          onChange={handleChange}
                          className="w-full accent-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          最大年齢
                        </label>
                        <input
                          type="range"
                          name="maxAge"
                          min="18"
                          max="65"
                          value={settings.maxAge || 65}
                          onChange={handleChange}
                          className="w-full accent-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 場所 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      場所
                    </label>
                    <select
                      name="location"
                      value={settings.location || ""}
                      onChange={handleChange}
                      className="w-full ios-input bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">どこでも</option>
                      <option value="東京">東京</option>
                      <option value="大阪">大阪</option>
                      <option value="名古屋">名古屋</option>
                      <option value="福岡">福岡</option>
                      <option value="札幌">札幌</option>
                    </select>
                  </div>
                  
                  {/* 距離 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      最大距離: {settings.distance || 50}km
                    </label>
                    <input
                      type="range"
                      name="distance"
                      min="1"
                      max="100"
                      value={settings.distance || 50}
                      onChange={handleChange}
                      className="w-full accent-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl ios-btn"
                  >
                    適用する
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-xl ios-btn"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
