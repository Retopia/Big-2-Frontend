// useSocket.js
import { useEffect, useRef } from 'react';
import socket from '../socket';

export const useSocket = () => {
  const connectionAttempted = useRef(false);

  useEffect(() => {
    // Only attempt connection once per component lifecycle
    if (!connectionAttempted.current) {
      console.log('🎯 useSocket: Attempting connection');
      socket.safeConnect();
      connectionAttempted.current = true;
    }

    // Cleanup function
    return () => {
      console.log('🧽 useSocket: Component cleanup');
      // Don't disconnect here - let the socket persist
    };
  }, []); // Empty dependency array is crucial

  return socket;
};