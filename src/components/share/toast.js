import toast from 'react-hot-toast';
import { NewsToast } from './NewsToast';
import React from 'react';

export const showToast = {
  success: (message) => {
    toast.success(message);
  },

  error: (message) => {
    toast.error(message);
  },

  loading: (message) => {
    return toast.loading(message);
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'กำลังดำเนินการ...',
      success: messages.success || 'สำเร็จ!',
      error: messages.error || 'เกิดข้อผิดพลาด!',
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  custom: (message, options = {}) => {
    toast(message, options);
  },
  // ใช้ React.createElement แทน JSX
  news: (news, options = {}) => {
    return toast.custom(
      (t) => React.createElement(NewsToast, {
        news: news,
        toastId: t.id
      }),
      {
        duration: 8000,
        position: 'top-right',
        ...options,
      }
    );
  },

  multipleNews: (newsArray, options = {}) => {
    newsArray.forEach((news, index) => {
      setTimeout(() => {
        showToast.news(news, options);
      }, index * 300);
    });
  }
};
