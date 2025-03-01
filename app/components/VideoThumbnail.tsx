import { useState, useEffect, useRef } from 'react';
import { FaVideo, FaPlay } from 'react-icons/fa';

interface VideoThumbnailProps {
  url: string;
  thumbnailUrl?: string;
  className?: string;
  clickToPlay?: boolean;
  showPlayIcon?: boolean;
}

export default function VideoThumbnail({ 
  url, 
  thumbnailUrl, 
  className = '', 
  clickToPlay = false,
  showPlayIcon = true
}: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [localThumbnail, setLocalThumbnail] = useState<string | null>(null);
  const [effectivelyPlaying, setEffectivelyPlaying] = useState(false);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!videoRef.current) return;

      try {
        let videoSrc = url;
        if (url.toLowerCase().endsWith('.mov')) {
          videoSrc = url.replace(/\.mov$/i, '.mp4');
          console.log('URL変換: MOV → MP4', videoSrc);
        }

        await new Promise<void>((resolve, reject) => {
          const handleLoad = () => {
            console.log('動画メタデータロード成功');
            resolve();
          };

          const handleError = (e: any) => {
            console.error('動画メタデータロードエラー:', e);
            reject(e);
          };

          videoRef.current!.onloadedmetadata = handleLoad;
          videoRef.current!.onerror = handleError;
          videoRef.current!.load();

          let timeoutId = setTimeout(() => {
            console.warn('動画メタデータロードタイムアウト - サムネイル生成を続行');
            resolve();
          }, 15000);

          return () => clearTimeout(timeoutId);
        });

        if (videoRef.current) {
          videoRef.current.currentTime = 1.0;

          await new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onseeked = () => resolve();
            } else {
              resolve();
            }
          });

          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg');
            setLocalThumbnail(thumbnail);
            console.log('サムネイル生成成功');
          }

          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          } else {
            console.warn('videoRef.current is null, cannot set currentTime');
            setError(true);
          }
        } else {
          console.warn('videoRef.current is null, cannot set currentTime');
          setError(true);
        }
      } catch (e) {
        console.error('サムネイル生成エラー:', e);
        setError(true);
      }
    };

    generateThumbnail();
  }, [url]);

  const playVideo = () => {
    if (!videoRef.current) return;

    console.log('動画再生開始:', url);

    try {
      if (videoRef.current.childElementCount === 0) {
        const mp4Source = document.createElement('source');
        mp4Source.src = url.replace(/\.[^/.]+$/, '.mp4');
        mp4Source.type = 'video/mp4';

        const originalSource = document.createElement('source');
        originalSource.src = url;
        originalSource.type = url.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4';

        videoRef.current.innerHTML = '';
        videoRef.current.appendChild(mp4Source);
        videoRef.current.appendChild(originalSource);
      }

      videoRef.current.load();

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('動画再生成功');
            setIsPlaying(true);
            setEffectivelyPlaying(true);
            setError(false);
          })
          .catch(e => {
            console.error('動画再生エラー:', e);
            setError(true);
            setEffectivelyPlaying(false);
            if (localThumbnail || thumbnailUrl) {
              console.log('サムネイルで代替表示');
            }
          });
      }
    } catch (e) {
      console.error('動画再生例外:', e);
      setError(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current && isPlaying) {
      try {
        videoRef.current.pause();
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
        setIsPlaying(false);
      } catch (e) {
        console.error('動画停止エラー:', e);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!clickToPlay) {
      playVideo();
    }
  };

  const handleMouseLeave = () => {
    if (!clickToPlay) {
      pauseVideo();
    }
  };

  const handleClick = () => {
    if (clickToPlay) {
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    }
  };

  const effectiveThumbnail = localThumbnail || (!imageError && thumbnailUrl) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHBhdGggZD0iTTE2MCwxMzAgbDgwLDUwIC04MCw1MCB6IiBmaWxsPSIjYjBiMGIwIi8+PC9zdmc+';

  const handleImageError = () => {
    console.log('サムネイル画像読み込みエラー:', thumbnailUrl);
    setImageError(true);
  };

  return (
    <div 
      className={`relative w-full h-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <video 
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${isPlaying ? 'block' : 'hidden'}`}
        muted
        loop
        playsInline
        preload="auto"
        onError={(e) => {
          console.error('動画読み込みエラー:', e);
          setError(true);
          setEffectivelyPlaying(false);
        }}
        onPlaying={() => {
          setEffectivelyPlaying(true);
          setError(false);
        }}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => {
              console.error('ループ再生エラー:', e);
            });
          }
        }}
      >
        <source src={url.replace(/\.mov$/i, '.mp4')} type="video/mp4" />
        <source src={url} type={url.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
        動画の再生に対応したブラウザが必要です
      </video>
      
      {!isPlaying && (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gray-200"></div>
          <img 
            src={effectiveThumbnail}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            {showPlayIcon && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  {clickToPlay ? <FaPlay className="text-white text-xl" /> : <FaVideo className="text-white text-xl" />}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && !effectivelyPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-1 text-xs">
          再生エラー
        </div>
      )}
    </div>
  );
}
