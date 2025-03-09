'use client';

import React from 'react';
import Link from 'next/link';
import { BsCalendar } from 'react-icons/bs';

interface AppointmentButtonProps {
  chatId: string;
  onOpenAppointment: () => void;
}

export const AppointmentButton: React.FC<AppointmentButtonProps> = ({ 
  chatId,
  onOpenAppointment
}) => {
  return (
    <button
      onClick={onOpenAppointment}
      className="flex items-center justify-center text-teal-600 focus:outline-none"
      aria-label="約束を作成"
    >
      <BsCalendar size={20} />
    </button>
  );
};
