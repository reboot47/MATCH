"use client";

import React, { useState } from 'react';
import { SafeImage } from '../common/SafeImage';
import GiftImage from '../common/GiftImage';
import MapImage from '../common/MapImage';

/**
 * 画像コンポーネントのテスト用ページ
 */
const ImageTest: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);

  // 正常系と異常系のテストケース
  const testCases = [
    // 正常系テストケース
    { 
      id: 'valid-local', 
      description: 'ローカル画像（正常）', 
      component: 'SafeImage',
      src: '/images/gifts/heart.svg', 
      fallbackSrc: '/images/placeholder.svg',
      expected: '成功'
    },
    { 
      id: 'valid-gift', 
      description: 'ギフト画像（正常）', 
      component: 'GiftImage',
      src: 'heart', 
      expected: '成功'
    },
    { 
      id: 'valid-map', 
      description: '地図画像（正常）', 
      component: 'MapImage',
      latitude: 35.6895, 
      longitude: 139.6917,
      expected: '成功'
    },
    
    // 異常系テストケース - SafeImage
    { 
      id: 'invalid-url', 
      description: '無効なURL', 
      component: 'SafeImage',
      src: 'https://invalid-domain-12345.xyz/image.jpg', 
      fallbackSrc: '/images/placeholder.svg',
      expected: 'エラー → フォールバック表示'
    },
    { 
      id: 'empty-src', 
      description: '空のsrc', 
      component: 'SafeImage',
      src: '', 
      fallbackSrc: '/images/placeholder.svg',
      expected: 'フォールバック表示'
    },
    { 
      id: 'null-src', 
      description: 'null src', 
      component: 'SafeImage',
      src: null, 
      fallbackSrc: '/images/placeholder.svg',
      expected: 'フォールバック表示'
    },
    
    // 異常系テストケース - GiftImage
    { 
      id: 'unknown-gift', 
      description: '未知のギフト名', 
      component: 'GiftImage',
      src: 'unknown-gift-12345', 
      expected: 'フォールバック表示'
    },
    { 
      id: 'empty-gift', 
      description: '空のギフト名', 
      component: 'GiftImage',
      src: '', 
      expected: 'フォールバック表示'
    },
    
    // 異常系テストケース - MapImage
    { 
      id: 'invalid-coords', 
      description: '無効な座標', 
      component: 'MapImage',
      latitude: NaN, 
      longitude: NaN,
      expected: 'エラー表示'
    },
    { 
      id: 'empty-coords', 
      description: '空の座標', 
      component: 'MapImage',
      latitude: '', 
      longitude: '',
      expected: 'エラー表示'
    }
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">画像コンポーネントテスト</h1>
        <div className="flex items-center">
          <label className="flex items-center mr-4">
            <input
              type="checkbox"
              checked={debugMode}
              onChange={() => setDebugMode(!debugMode)}
              className="mr-2"
            />
            デバッグモード
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCases.map(test => (
          <div key={test.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">{test.description}</h3>
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                {test.component}
              </span>
            </div>
            
            <div className="h-48 bg-gray-50 flex items-center justify-center rounded border mb-2">
              {test.component === 'SafeImage' && (
                <SafeImage
                  src={test.src}
                  fallbackSrc={test.fallbackSrc}
                  alt={`テスト: ${test.description}`}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              )}
              
              {test.component === 'GiftImage' && (
                <GiftImage
                  src={test.src}
                  alt={`テスト: ${test.description}`}
                  giftName={test.description}
                  width={100}
                  height={100}
                  showLineStyle={true}
                />
              )}
              
              {test.component === 'MapImage' && (
                <MapImage
                  latitude={test.latitude || 0}
                  longitude={test.longitude || 0}
                  name={`テスト: ${test.description}`}
                  width={200}
                  height={150}
                />
              )}
            </div>
            
            {debugMode && (
              <div className="mt-2 text-sm">
                <div className="bg-gray-100 p-2 rounded text-gray-700 font-mono text-xs">
                  <pre>{JSON.stringify(
                    {
                      ...test,
                      component: undefined,
                      expected: undefined
                    }, 
                    null, 2
                  )}</pre>
                </div>
                <div className="mt-1 text-gray-500">
                  期待結果: <span className="font-medium">{test.expected}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
