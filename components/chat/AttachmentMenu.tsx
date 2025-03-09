import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, MapPin, X, Image, Paperclip, Smile } from 'lucide-react';

// 型定義のインポート
interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  mapUrl?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
}

export type AttachmentType = 'camera' | 'audio' | 'location' | 'image' | null;

interface AttachmentMenuProps {
  onAttach: (type: AttachmentType, data?: any) => void;
  onClose: () => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ onAttach, onClose }) => {
  const [activeAttachment, setActiveAttachment] = useState<AttachmentType>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // カメラ、マイク、位置情報のアクセス状態
  const [cameraAccessGranted, setCameraAccessGranted] = useState<boolean>(false);
  const [micAccessGranted, setMicAccessGranted] = useState<boolean>(false);
  const [locationAccessGranted, setLocationAccessGranted] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

  // 位置情報の状態
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  const handleAttachmentSelect = (type: AttachmentType) => {
    setActiveAttachment(type);
    
    // 各タイプごとの初期処理
    if (type === 'camera') {
      requestCameraAccess();
    } else if (type === 'audio') {
      requestMicAccess();
    } else if (type === 'location') {
      requestLocationAccess();
    } else if (type === 'image' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBack = () => {
    setActiveAttachment(null);
  };

  // カメラアクセスをリクエスト
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraAccessGranted(true);
      // ストリームを停止（テスト目的のみ）
      stream.getTracks().forEach(track => track.stop());
      
      // カメラアクセスが許可されたらすぐにカメラデータを送信
      const mockCameraData = {
        imageUrl: 'https://via.placeholder.com/400x300?text=Camera+Image',
        timestamp: new Date().toISOString()
      };
      onAttach('camera', mockCameraData);
      onClose();
    } catch (err) {
      console.error('カメラへのアクセスが拒否されました:', err);
      alert('カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。');
    }
  };

  // マイクアクセスをリクエスト
  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicAccessGranted(true);
      // ストリームを停止（テスト目的のみ）
      stream.getTracks().forEach(track => track.stop());
      
      // マイクアクセスが許可されたらすぐに音声データを送信
      const mockAudioData = {
        audioUrl: 'https://example.com/mock-audio.mp3',
        duration: 5.2,
        timestamp: new Date().toISOString()
      };
      onAttach('audio', mockAudioData);
      onClose();
    } catch (err) {
      console.error('マイクへのアクセスが拒否されました:', err);
      alert('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。');
    }
  };

  // 位置情報アクセスをリクエスト
  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          setLocationAccessGranted(true);
          
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: '位置情報を取得しました', // 実際には逆ジオコーディングAPIで住所を取得
            mapUrl: `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`
          };
          
          setCurrentLocation(locationData);
          
          // 位置情報が取得できたらすぐに送信
          onAttach('location', locationData);
          onClose();
        },
        (error) => {
          setIsGettingLocation(false);
          console.error('位置情報の取得に失敗しました:', error);
          alert('位置情報の取得に失敗しました。ブラウザの設定を確認してください。');
        }
      );
    } else {
      alert('お使いのブラウザは位置情報に対応していません。');
    }
  };

  // 画像が選択された時の処理
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = {
          file: file,
          preview: reader.result,
          name: file.name,
          size: file.size,
          type: file.type
        };
        onAttach('image', imageData);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute bottom-16 left-0 w-full bg-white rounded-t-xl shadow-lg z-50 overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="text-sm font-medium text-gray-700">
          {activeAttachment ? getAttachmentTitle(activeAttachment) : '添付ファイルの選択'}
        </h3>
        <button 
          onClick={activeAttachment ? handleBack : onClose}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        <AttachmentButton 
          icon={<Camera size={24} />} 
          label="カメラ" 
          onClick={() => handleAttachmentSelect('camera')} 
          color="bg-red-100 text-red-500"
        />
        <AttachmentButton 
          icon={<Image size={24} />} 
          label="画像" 
          onClick={() => handleAttachmentSelect('image')} 
          color="bg-blue-100 text-blue-500"
        />
        <AttachmentButton 
          icon={<Mic size={24} />} 
          label="音声" 
          onClick={() => handleAttachmentSelect('audio')} 
          color="bg-purple-100 text-purple-500"
        />
        <AttachmentButton 
          icon={<MapPin size={24} />} 
          label="位置情報" 
          onClick={() => handleAttachmentSelect('location')} 
          color="bg-green-100 text-green-500"
        />
        <AttachmentButton 
          icon={<Paperclip size={24} />} 
          label="ファイル" 
          onClick={() => {}} 
          color="bg-gray-100 text-gray-500"
          disabled
        />
        <AttachmentButton 
          icon={<Smile size={24} />} 
          label="スタンプ" 
          onClick={() => {}} 
          color="bg-yellow-100 text-yellow-500"
          disabled
        />
      </div>
      
      {/* 非表示のファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />
      
      {/* アクセス状態表示 - デバッグ用 */}
      {isGettingLocation && (
        <div className="p-3 bg-yellow-50">
          <p className="text-center text-yellow-700 text-sm">位置情報を取得中...</p>
        </div>
      )}
    </div>
  );
};

// ヘルパー関数: アタッチメントタイプに応じたタイトルを取得
const getAttachmentTitle = (type: AttachmentType): string => {
  switch (type) {
    case 'camera': return 'カメラ';
    case 'audio': return '音声録音';
    case 'location': return '位置情報';
    case 'image': return '画像選択';
    default: return '添付ファイル';
  }
};

// アタッチメントボタンコンポーネント
interface AttachmentButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  color,
  disabled = false
}) => {
  return (
    <button 
      className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} transition-transform transform hover:scale-105 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default AttachmentMenu;
