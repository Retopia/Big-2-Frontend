// hooks/useToast.js
import { useState, useCallback, useRef } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef({});
  
  // Strictly limit the maximum number of toasts to prevent screen clutter
  const MAX_TOASTS = 3;

  const addToast = useCallback((message, type = 'info', duration = 2000) => {
    const id = Date.now();
    
    // Remove oldest toast if at capacity
    setToasts(prevToasts => {
      let newToasts = [...prevToasts];
      
      if (newToasts.length >= MAX_TOASTS) {
        // Find the oldest toast and remove it
        const oldestToast = newToasts.reduce((oldest, current) => 
          oldest.id < current.id ? oldest : current
        );
        
        // Clear any existing timers for the toast being removed
        if (toastTimers.current[oldestToast.id]) {
          clearTimeout(toastTimers.current[oldestToast.id]);
          delete toastTimers.current[oldestToast.id];
        }
        
        newToasts = newToasts.filter(toast => toast.id !== oldestToast.id);
      }
      
      return [...newToasts, { id, message, type, duration }];
    });
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    
    // Clear any existing timers for this toast
    if (toastTimers.current[id]) {
      clearTimeout(toastTimers.current[id]);
      delete toastTimers.current[id];
    }
  }, []);

  // Provide a method to remove all toasts at once
  const clearAllToasts = useCallback(() => {
    setToasts([]);
    
    // Clear all timers
    Object.keys(toastTimers.current).forEach(id => {
      clearTimeout(toastTimers.current[id]);
    });
    toastTimers.current = {};
  }, []);

  return { toasts, addToast, removeToast, clearAllToasts };
};