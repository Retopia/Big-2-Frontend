// socket.js
import { io } from "socket.io-client";
import { API_BASE_URL } from "./config";

// More robust singleton pattern
const SOCKET_KEY = '__big2Socket_instance';
const CONNECTION_KEY = '__big2Socket_connected';

function createSocket() {
  const socket = io(API_BASE_URL, {
    withCredentials: true,
    autoConnect: false
  });

  // Add connection tracking
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    globalThis[CONNECTION_KEY] = true;
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', socket.id, reason);
    globalThis[CONNECTION_KEY] = false;
  });

  return socket;
}

// Get or create singleton
function getSocket() {
  if (!globalThis[SOCKET_KEY]) {
    console.log('🔌 Creating new socket instance');
    globalThis[SOCKET_KEY] = createSocket();
  }
  return globalThis[SOCKET_KEY];
}

const socket = getSocket();

// Enhanced connect method that's more defensive
socket.safeConnect = function() {
  // Check if already connected or connecting
  if (this.connected) {
    console.log('🔄 Socket already connected, skipping');
    return;
  }
  
  if (this.connecting) {
    console.log('🔄 Socket already connecting, skipping');
    return;
  }

  console.log('🚀 Initiating socket connection');
  this.connect();
};

// Handle HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    console.log('🧹 HMR cleanup: disconnecting socket');
    if (globalThis[SOCKET_KEY]) {
      globalThis[SOCKET_KEY].disconnect();
      delete globalThis[SOCKET_KEY];
      delete globalThis[CONNECTION_KEY];
    }
  });
}

export default socket;
