'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HiX } from 'react-icons/hi';
import { BsCalendar, BsClock } from 'react-icons/bs';

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string;
  partnerName: string;
  partnerImage: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  partnerId,
  partnerName,
  partnerImage
}) => {
  const router = useRouter();
  const [appointmentDates, setAppointmentDates] = useState<Array<{ date: string | null; time: string | null }>>([
    { date: null, time: null },
    { date: null, time: null },
    { date: null, time: null }
  ]);

  const handleDateChange = (index: number, date: string) => {
    const newDates = [...appointmentDates];
    newDates[index].date = date;
    setAppointmentDates(newDates);
  };

  const handleTimeChange = (index: number, time: string) => {
    const newDates = [...appointmentDates];
    newDates[index].time = time;
    setAppointmentDates(newDates);
  };

  const handleAddDate = () => {
    if (appointmentDates.length < 10) {
      setAppointmentDates([...appointmentDates, { date: null, time: null }]);
    }
  };

  const handleRemoveDate = (index: number) => {
    const newDates = [...appointmentDates];
    newDates.splice(index, 1);
    setAppointmentDates(newDates);
  };

  const handleSubmit = async () => {
    // 実際のアプリではAPIリクエストを行う
    console.log('約束候補日:', appointmentDates.filter(d => d.date && d.time));
    
    // 送信後、モーダルを閉じる
    onClose();
    
    // 実際のアプリでは、チャットにシステムメッセージを表示するなどの処理を行う
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="p-4 border-b flex items-center">
          <button 
            onClick={onClose}
            className="mr-2 text-gray-600"
            aria-label="閉じる"
          >
            <HiX size={24} />
          </button>
          <h2 className="font-medium text-lg">約束機能</h2>
        </div>

        {/* コンテンツ */}
        <div className="p-4 overflow-y-auto flex-grow">
          <h3 className="text-lg font-medium mb-3">デート候補日を入力しましょう！</h3>
          <p className="text-sm text-gray-600 mb-4">候補日時は最大10個まで設定できます！</p>

          {appointmentDates.map((dateTime, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">候補日時{index + 1}</p>
                {index > 0 && (
                  <button 
                    onClick={() => handleRemoveDate(index)}
                    className="text-red-500 text-sm"
                  >
                    削除
                  </button>
                )}
              </div>
              
              <div className="flex items-center border rounded-md mb-2">
                <div className="px-3 py-2 text-gray-500">
                  <BsCalendar />
                </div>
                <input
                  type="date"
                  className="flex-1 p-2 outline-none"
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  placeholder="日付"
                />
              </div>

              <div className="flex items-center border rounded-md">
                <div className="px-3 py-2 text-gray-500">
                  <BsClock />
                </div>
                <input
                  type="time"
                  className="flex-1 p-2 outline-none"
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  placeholder="時間"
                />
              </div>
            </div>
          ))}

          {appointmentDates.length < 10 && (
            <button
              onClick={handleAddDate}
              className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 flex items-center justify-center"
            >
              <span className="mr-2">+</span> 候補日時を追加
            </button>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-teal-600 text-white rounded-md font-medium"
          >
            デート候補日を送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
