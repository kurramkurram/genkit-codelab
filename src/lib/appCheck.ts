'use client';

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  getToken,
} from 'firebase/app-check';

import { app } from './firebase';

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

if (process.env.NODE_ENV === 'development') {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY!,
  ),
  isTokenAutoRefreshEnabled: true,
});

getToken(appCheck, false)
  .catch((error) => {
    console.error('Failed to acquire App Check token:', error);
  });