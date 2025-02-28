import { useState } from 'react';
import Image from 'next/image';
import { FaImage, FaVideo, FaTimes, FaStar, FaRegStar, FaBars } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { VideoThumbnail } from './VideoThumbnail';

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
  type?: 'image' | 'video';
  thumbnailUrl?: string;
  displayOrder?: number;
  deleting?: boolean;
  updating?: boolean;
}

interface DraggablePhotoCardProps {
  photo: Photo;
  isSortMode: boolean;
  onDelete?: (photo: Photo) => void;
  onSetMain?: (photo: Photo) => void;
}

export function DraggablePhotoCard({ photo, isSortMode, onDelete, onSetMain }: DraggablePhotoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: photo.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 1 : 0,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-lg overflow-hidden aspect-square ${isSortMode ? 'cursor-move' : ''}`}
    >
      {isSortMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30"
        >
          <FaBars className="text-white text-2xl" />
        </div>
      )}
      
      {photo.type === 'video' ? (
        <VideoThumbnail 
          url={photo.url} 
          thumbnailUrl={photo.thumbnailUrl}
          className="h-full"
        />
      ) : (
        <div className="w-full h-full relative">
          <Image
            src={photo.url}
            alt="写真"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      
      {/* メイン写真の表示 */}
      {photo.isMain && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded-full">
          メイン
        </div>
      )}
      
      {/* 写真タイプの表示 */}
      <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full">
        {photo.type === 'video' ? <FaVideo /> : <FaImage />}
      </div>
      
      {!isSortMode && (
        <>
          {/* 削除ボタン */}
          {onDelete && (
            <button
              onClick={() => onDelete(photo)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              disabled={photo.deleting}
            >
              {photo.deleting ? <FaSpinner className="animate-spin" /> : <FaTimes />}
            </button>
          )}
          
          {/* メイン写真設定ボタン（メイン写真でない場合かつ動画でない場合のみ表示） */}
          {!photo.isMain && photo.type !== 'video' && onSetMain && (
            <button
              onClick={() => onSetMain(photo)}
              className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-md hover:bg-blue-600 transition-colors"
              disabled={photo.updating}
            >
              {photo.updating ? <FaSpinner className="animate-spin" /> : "メインにする"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
