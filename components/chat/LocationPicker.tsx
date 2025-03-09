import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Send, LocateFixed } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address?: string;
    mapUrl?: string;
  }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  // 状態管理
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // 現在地を取得する関数
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          // 住所を逆ジオコーディングで取得
          fetchAddressFromCoords(latitude, longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("位置情報を取得できませんでした。設定を確認してください。");
          setIsLocating(false);
        }
      );
    } else {
      alert("お使いのブラウザは位置情報に対応していません。");
    }
  }, []);

  // コンポーネントマウント時に現在地を取得
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // 座標から住所を取得する関数（モックデータを使用）
  const fetchAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      // 実際のAPIを呼び出す代わりに、東京タワー周辺の場合は東京タワーの住所を返す
      if (Math.abs(latitude - 35.6586) < 0.01 && Math.abs(longitude - 139.7454) < 0.01) {
        setLocationAddress("東京都港区芝公園４丁目２ー８ 東京タワー");
      } 
      // 渋谷スクランブル交差点周辺
      else if (Math.abs(latitude - 35.6595) < 0.01 && Math.abs(longitude - 139.7004) < 0.01) {
        setLocationAddress("東京都渋谷区道玄坂２丁目２ー１ スクランブル交差点");
      }
      // 秋葉原駅周辺
      else if (Math.abs(latitude - 35.6986) < 0.01 && Math.abs(longitude - 139.7726) < 0.01) {
        setLocationAddress("東京都千代田区外神田１丁目 秋葉原駅");
      }
      // その他の場所には一般的な表記を使用
      else {
        setLocationAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)} 周辺`);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocationAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)} 周辺`);
    }
  };

  // 選択した位置情報を送信する関数
  const handleSendLocation = () => {
    if (location) {
      setIsSending(true);
      setTimeout(() => {
        onLocationSelect({
          ...location,
          address: locationAddress || '',
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
        });
        setIsSending(false);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 地図表示の代わりに、シンプルな位置情報表示 */}
      <div className="h-72 relative mb-3 rounded-lg overflow-hidden bg-gray-200 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-4">
          <MapPin size={48} className="text-primary-500 mx-auto mb-2" />
          <h3 className="font-semibold text-lg">現在地を共有</h3>
          <p className="text-sm text-gray-600">
            {isLocating ? '位置情報を取得中...' : '位置情報が取得されました'}
          </p>
        </div>
        
        {location && (
          <div className="bg-white rounded-lg p-3 w-full shadow-md">
            <p className="font-medium text-sm">共有する位置情報:</p>
            <p className="text-sm">{locationAddress || '住所を読み込み中...'}</p>
            <p className="text-xs text-gray-500 mt-1">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          </div>
        )}
        
        {/* 現在位置再取得ボタン */}
        <button 
          className="mt-4 bg-white rounded-full p-2 shadow-md flex items-center justify-center"
          onClick={getUserLocation}
          disabled={isLocating}
        >
          <LocateFixed size={18} className="text-primary-500 mr-1" />
          <span className="text-sm">{isLocating ? '取得中...' : '現在地を更新'}</span>
        </button>
      </div>

      {/* 位置情報の詳細と送信ボタン */}
      <div className="bg-gray-100 rounded-lg p-3 mb-3">
        <div className="flex items-start">
          <MapPin size={20} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">共有する場所:</p>
            <p className="text-sm text-gray-600">
              {locationAddress || '住所を読み込み中...'}
            </p>
            {location && (
              <p className="text-xs text-gray-500 mt-1">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-500 underline"
                >
                  Googleマップで開く
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSendLocation}
        disabled={!location || isSending}
      >
        {isSending ? (
          <span>送信中...</span>
        ) : (
          <>
            <Send size={18} className="mr-2" />
            <span>位置情報を送信</span>
          </>
        )}
      </button>
    </div>
  );
};

export default LocationPicker;
