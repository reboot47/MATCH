"use client";

import React from 'react';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';

const AgeVerificationBadge: React.FC = () => {
  return (
    <Link 
      href="/verification/age" 
      className="flex items-center justify-center text-gray-400 text-sm mt-1 mb-3"
    >
      年齢未確認 <HiChevronRight className="ml-1" />
    </Link>
  );
};

export default AgeVerificationBadge;
