// components/Toast.jsx
import { useState, useEffect } from 'react';

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  
  // Handle automatic dismissal
  useEffect(() => {
    let timer;
    let startTime;
    let remainingTime = timeRemaining;
    
    const tick = () => {
      if (!isPaused) {
        const elapsedTime = Date.now() - startTime;
        const newRemainingTime = Math.max(0, remainingTime - elapsedTime);
        setTimeRemaining(newRemainingTime);
        
        if (newRemainingTime <= 0) {
          closeToast();
        } else {
          startTime = Date.now();
          remainingTime = newRemainingTime;
          timer = setTimeout(tick, 100); // Update every 100ms for smooth progress
        }
      }
    };
    
    startTime = Date.now();
    timer = setTimeout(tick, 100);
    
    return () => clearTimeout(timer);
  }, [isPaused]);
  
  // Handle toast closing with animation
  const closeToast = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for fade out animation before removing
  };

  // Calculate progress bar width as percentage
  const progressWidth = `${Math.max(0, (timeRemaining / duration) * 100)}%`;
  
  // Define color schemes based on toast type
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };
  
  const progressColors = {
    success: 'bg-green-300',
    error: 'bg-red-300',
    warning: 'bg-yellow-300',
    info: 'bg-blue-300',
  };

  return (
    <div 
      className={`
        ${bgColors[type]} 
        rounded-md shadow-lg p-4 mb-3 transform transition-all duration-300 w-full
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        border-2 border-white relative cursor-pointer
      `}
      onClick={closeToast}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          {type === 'success' && (
            <svg className="w-7 h-7 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === 'error' && (
            <svg className="w-7 h-7 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-7 h-7 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-7 h-7 mr-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <p className="text-white text-lg font-medium">{message}</p>
        </div>
        
        <svg className="w-6 h-6 text-white ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 rounded-b-md bg-white bg-opacity-30 w-full">
        <div 
          className={`h-1 ${progressColors[type]} rounded-b-md transition-all`} 
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
};