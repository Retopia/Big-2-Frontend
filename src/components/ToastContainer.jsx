// components/ToastContainer.jsx
import React from 'react';
import { Toast } from './Toast';

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center w-full max-w-md">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          duration={toast.duration} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};