import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { FaSpinner } from 'react-icons/fa';
import { DraggablePhotoCard } from './DraggablePhotoCard';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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

interface PhotosGridProps {
  photos: Photo[];
  isSortMode: boolean;
  onPhotosReordered: (photos: Photo[]) => void;
  onDelete?: (photo: Photo) => void;
  onSetMain?: (photo: Photo) => void;
}

export function PhotosGrid({ photos, isSortMode, onPhotosReordered, onDelete, onSetMain }: PhotosGridProps) {
  const [isSorting, setIsSorting] = useState(false);
  const [sortablePhotos, setSortablePhotos] = useState<Photo[]>(photos);

  // 並べ替え用のセンサー
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px以上動かすとドラッグ開始
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 写真が更新されたらソート可能な写真の配列も更新
  useState(() => {
    setSortablePhotos(photos);
  }, [photos]);

  // 並べ替え完了時の処理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // 新しい配列を作成
      const oldIndex = sortablePhotos.findIndex(p => p.id === active.id);
      const newIndex = sortablePhotos.findIndex(p => p.id === over.id);
      
      const newOrder = arrayMove(sortablePhotos, oldIndex, newIndex);
      setSortablePhotos(newOrder);
      
      // 並べ替え順序をサーバーに保存
      try {
        setIsSorting(true);
        
        await axios.post('/api/users/photos/reorder', {
          photos: newOrder.map((photo, index) => ({
            id: photo.id,
            displayOrder: index
          }))
        });
        
        // 親コンポーネントに更新を通知
        onPhotosReordered(newOrder);
        
        toast.success('写真・動画の順番を保存しました');
      } catch (error) {
        console.error('並べ替え保存エラー:', error);
        toast.error('並べ替えの保存に失敗しました');
        // エラー時は元の順序に戻す
        setSortablePhotos(photos);
      } finally {
        setIsSorting(false);
      }
    }
  };

  return (
    <div className="relative">
      {isSorting && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      )}
      
      {isSortMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortablePhotos.map(p => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sortablePhotos.map((photo) => (
                <DraggablePhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  isSortMode={true} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <DraggablePhotoCard 
              key={photo.id} 
              photo={photo} 
              isSortMode={false} 
              onDelete={onDelete}
              onSetMain={onSetMain}
            />
          ))}
        </div>
      )}
    </div>
  );
}
