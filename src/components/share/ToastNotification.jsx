import { Toaster } from 'react-hot-toast';

export default function ToastNotification() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: '#fff',
          color: '#363636',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
        // Success style
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #86efac',
          },
        },
        // Error style
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
          },
        },
        // Loading style
        loading: {
          style: {
            background: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #93c5fd',
          },
        },
      }}
    />
  );
}