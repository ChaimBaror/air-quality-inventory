'use client';

import { Toaster } from 'react-hot-toast';

/**
 * Toast Provider Component
 * Wrap your app with this to enable toast notifications
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '500px',
        },
      }}
    />
  );
}

