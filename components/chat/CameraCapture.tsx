import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const videoConstraints = {
    width: 350,
    height: 350,
    facingMode: facingMode,
  };

  return (
    <div className="flex flex-col items-center p-2">
      {!capturedImage ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg w-full aspect-square object-cover"
          />
          <div className="flex justify-center space-x-4 mt-3">
            <button 
              onClick={switchCamera}
              className="p-2 bg-gray-100 rounded-full"
            >
              <RotateCcw size={24} className="text-gray-600" />
            </button>
            <button 
              onClick={capture}
              className="p-3 bg-primary-500 rounded-full"
            >
              <Camera size={24} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full">
            <img 
              src={capturedImage}
              alt="Captured"
              className="rounded-lg w-full aspect-square object-cover"
            />
          </div>
          <div className="flex justify-center space-x-4 mt-3">
            <button 
              onClick={retake} 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              撮り直す
            </button>
            <button 
              onClick={confirmImage}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm"
            >
              使用する
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
