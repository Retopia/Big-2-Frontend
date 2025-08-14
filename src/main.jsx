import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import './index.css';

import WelcomeScreen from './components/WelcomeScreen';
import MultiplayerSetup from './components/MultiplayerSetup';
import AISetup from './components/AISetup';
import GameRules from './components/GameRules';
import GameRoom from './components/GameRoom';

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <WelcomeScreen />
      },
      {
        path: '/play/multiplayer',
        element: <MultiplayerSetup />
      },
      {
        path: '/play/ai',
        element: <AISetup />
      },
      {
        path: '/rules',
        element: <GameRules />
      },
      {
        path: '/room/:roomName',
        element: <GameRoom />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);