'use client';

import { useEffect } from 'react';

import { initializeFirebaseAppCheck } from '@/lib/appCheck';

export default function AppCheckProvider() {
  useEffect(() => {
    initializeFirebaseAppCheck();
  }, []);

  return null;
}