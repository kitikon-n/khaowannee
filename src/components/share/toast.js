import toast from 'react-hot-toast';

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
  }
};
