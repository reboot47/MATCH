'use client';

import React from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useUser } from '@/components/UserContext';

interface BoostOption {
  id: string;
  name: string;
  duration: number;
  points: number;
  flames: number;
  isRecommended?: boolean;
}

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: BoostOption) => void;
}

export default function BoostModal({ isOpen, onClose, onSelect }: BoostModalProps) {
  const { user, isGenderMale } = useUser();
  const isMale = isGenderMale();
  
  // 男性ユーザー用のブーストオプション（課金側）
  const maleBoostOptions: BoostOption[] = [
    {
      id: 'hyper',
      name: 'ハイパーブースト',
      duration: 60,
      points: 50,
      flames: 4,
      isRecommended: true
    },
    {
      id: 'super',
      name: 'スーパーブースト',
      duration: 30,
      points: 40,
      flames: 3
    },
    {
      id: 'high',
      name: 'ハイブースト',
      duration: 15,
      points: 30,
      flames: 2
    },
    {
      id: 'normal',
      name: 'ブースト',
      duration: 0,
      points: 20,
      flames: 1
    }
  ];
  
  // 女性ユーザー用のブーストオプション（無料・特典側）
  const femaleBoostOptions: BoostOption[] = [
    {
      id: 'hyper',
      name: 'ハイパーブースト',
      duration: 60,
      points: 0, // 女性は無料
      flames: 5,
      isRecommended: true
    },
    {
      id: 'super',
      name: 'スーパーブースト',
      duration: 45,
      points: 0, // 女性は無料
      flames: 4
    },
    {
      id: 'high',
      name: 'ハイブースト',
      duration: 30,
      points: 0, // 女性は無料
      flames: 3
    },
    {
      id: 'normal',
      name: '通常ブースト',
      duration: 20,
      points: 0, // 女性は無料
      flames: 2
    }
  ];
  
  // 性別に基づいてブーストオプションを選択
  const boostOptions = isMale ? maleBoostOptions : femaleBoostOptions;

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* 閉じるボタン */}
        <button 
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-30 text-white"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        
        {/* グラデーション背景とロケットイラスト */}
        <div className="bg-gradient-to-b from-purple-400 via-pink-400 to-pink-300 p-6 pt-12 pb-6 text-white text-center">
          <div className="relative w-full h-32 mb-2">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="64" height="64">
                    <path d="M10.5 18.331C5.824 17.295 2 13.151 2 8c0 0 3 1 6.5 1 3.501 0 6.5-1 6.5-1 0 5.151-3.824 9.295-8.5 10.331zm8.56-3.699c.676-.166 1.485-.408 1.941-.647C20.772 14.301 21 14.238 21 13.9c0-.32-.1-.367-1.001-.78-.902-.412-.997-.425-1.499-.212-.311.133-.899.359-1.298.503-.644.232-.692.266-.679.468.007.144.065.335.128.425.063.089.344.223.624.297.28.074.575.186.656.25.081.063.104.144.052.179-.155.105-1.643-.308-1.858-.516-.244-.235-.252-1.141-.011-1.201.098-.024.693-.176 1.324-.337.804-.206 1.484-.312 2.003-.312.73 0 .811.033 1.139.47.389.518.415.887.072 1.019-.127.049-.231.114-.231.145 0 .031-.012.076-.026.099-.014.023.134.136.328.25.324.192.357.24.357.52 0 .293-.028.322-.556.587-.31.156-.901.355-1.312.441-.411.086-1.12.206-1.575.266-.687.091-.821.087-.912-.025-.061-.075-.111-.24-.111-.368 0-.186.068-.259.346-.37.191-.076.544-.158.785-.182.241-.024.439-.088.439-.142 0-.054-.207-.098-.46-.097-.619.001-1.239-.164-1.239-.33 0-.218.177-.359.515-.409zm-4.995-14.51c-.256.257-.565.779-.683 1.159-.261.84-.264 2.051-.007 3.048.214.829.228.832.844.21.334-.337.687-.862.784-1.166.225-.706.216-1.797-.021-2.607-.103-.354-.358-.872-.566-1.146-.368-.486-.376-.487-.352-.028.064 1.24-1.851 4.348-3.479 5.635-.397.314-.914.763-1.15.999-.414.414-.414.418.03 1.294.249.491.493.893.541.893.049 0 .568-.402 1.154-.893.586-.492 1.534-1.083 2.107-1.314 1.191-.479 2.606-.512 2.763-.065.059.168.07.315.025.327-.046.011-.345.086-.664.166-.705.176-1.997.814-2.69 1.329-1.341 1.001-2.356 2.917-2.139 4.044.078.404.158.52.546.79.259.181.472.363.472.404 0 .092-1.9 1.067-2.934 1.507-3.386 1.441-5.41 1.141-6.475-.962-.749-1.479-.735-3.312.039-5.271.289-.734.452-1.015.832-1.444 1.45-1.636 2.247-3.594 2.315-5.69.013-.38.059-.691.104-.691.045 0 .212.144.371.32.335.368.861.41 1.895.15.413-.104 1.103-.206 1.531-.227.754-.036.824-.02 1.174.272.486.406.539.599.103.373-.178-.092-.572-.168-.875-.168-.495 0-.56.023-.56.202 0 .344.125.384 1.098.349.495-.017 1.151-.094 1.459-.17.552-.136.543-.131.543-.386 0-.142-.039-.259-.087-.259-.048 0-.308.048-.577.108-.269.059-.67.092-.89.074-.398-.033-.4-.034-.4-.459 0-.418-.005-.427-.43-.494-.236-.037-.604-.15-.817-.252-.372-.179-.374-.185-.069-.175.175.006.531.083.792.172.26.089.578.162.706.162.263 0 .35-.161.224-.414-.093-.187.062-.371.401-.478.277-.087.401.161.43.86.014.344.04.405.135.313.096-.093.033-.568-.197-1.479-.225-.891-.435-1.319-.724-1.473-.19-.101-.19-.102-.036-.104.224-.004.713.458.979.924.116.203.247.369.292.369.045 0 .181-.123.302-.272zm1.088 8.521c-.239.076-.64.164-.89.195-.45.056-.45.057-.095.493-.036.339-.026.437.041.437.05 0 .204-.073.342-.163.138-.09.386-.188.551-.219.302-.058.301-.059.301-.522v-.465l-.25.244z" />
                  </svg>
                </div>
                {/* キラキラエフェクト */}
                <div className="absolute -top-4 -left-4">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute -top-1 left-8">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-5 -right-6">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-12 left-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            {/* 雲のエフェクト */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" fill="white">
                <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,229.3C672,256,768,288,864,277.3C960,267,1056,213,1152,181.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-1">ブースト機能で</h2>
          <p className="text-xl font-bold mb-1">異性のプロフィール一覧に</p>
          <p className="text-xl font-bold mb-3">あなたを上位表示！</p>
          {!isMale && (
            <p className="text-sm text-pink-600 bg-pink-100 px-3 py-1 rounded-full inline-block">女性ユーザー特典：無料でブースト可能！</p>
          )}
        </div>
        
        {/* ブーストオプション */}
        <div className="bg-white p-4">
          {boostOptions.map((option) => (
            <div key={option.id} className="mb-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    {[...Array(option.flames)].map((_, i) => (
                      <div key={i} className="text-pink-500 mr-1">🔥</div>
                    ))}
                    <span className="ml-1 text-pink-500 font-bold">{option.name}</span>
                    {option.isRecommended && (
                      <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                        おすすめ
                      </span>
                    )}
                  </div>
                  {option.duration > 0 && (
                    <div className="text-xs text-pink-400 bg-pink-100 rounded-full px-3 py-0.5 inline-block mt-1">
                      +{option.duration}分 フルパワーモード
                    </div>
                  )}
                </div>
                <button
                  className="bg-white border border-pink-500 text-pink-500 rounded-full px-4 py-2 font-bold hover:bg-pink-50 transition"
                  onClick={() => onSelect(option)}
                >
                  {isMale ? `${option.points}pt` : '無料'}
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-center mt-4">
            <button className="text-gray-500 text-sm underline">
              詳しく見る
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
