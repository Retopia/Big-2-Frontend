import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import './index.css';

import WelcomeScreen from './components/WelcomeScreen';
import MultiplayerSetup from './components/MultiplayerSetup';
import AISetup from './components/AISetup';
import GameRules from './components/GameRules';
import GameRoom from './components/GameRoom';
import Changelog from './components/Changelog';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';

// Create router
const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminPanel />
  },
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
        path: '/changelog',
        element: <Changelog />
      },
      {
        path: '/contact',
        element: <Contact />
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
