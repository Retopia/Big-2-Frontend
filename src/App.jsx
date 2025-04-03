import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ToastContainer } from "./components/ToastContainer";
import { useToast } from "./hooks/useToast";
import { JsonLd } from './components/JsonLd';

// Create the socket connection
const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:3002"
    : "https://api.big2.prestontang.dev",
  { withCredentials: true }
);

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [creatorID, setCreatorID] = useState(null);
  const [lobbyControlsData, setLobbyControlsData] = useState({
    username: "",
    roomName: "",
  });
  const [gameState, setGameState] = useState({
    hand: [],
    lastPlayedHand: [],
    currentPlayer: "",
    players: [],
    round: 1
  });

  // Initialize toast hook
  const { toasts, addToast, removeToast } = useToast();

  // Check if we're in a room based on the URL
  useEffect(() => {
    const isInRoom = location.pathname.startsWith('/room/');
    setInRoom(isInRoom);

    if (isInRoom) {
      const roomName = location.pathname.split('/').pop();
      setLobbyControlsData(prev => ({ ...prev, roomName }));
    }
  }, [location]);

  useEffect(() => {
    document.title = inRoom
      ? `Playing in ${lobbyControlsData.roomName} | Big 2 Live`
      : 'Play Big 2 Card Game Online | Big 2 Live';
  }, [inRoom, lobbyControlsData.roomName]);

  useEffect(() => {
    socket.on("assignUsername", (data) => {
      sessionStorage.setItem("username", data.username);
      setLobbyControlsData(prev => ({ ...prev, username: data.username }));
    });

    socket.on("roomUpdate", (data) => {
      setPlayers(data.players);
      setCreatorID(data.creatorID);
    });

    socket.on("forceLeave", () => {
      addToast("You have been removed from the room.", "error");
      setInRoom(false);
      navigate('/');
    });

    socket.on("roomList", (data) => setRooms(data.rooms || []));

    socket.on("gameStarted", () => {
      setGameStarted(true);
    });

    socket.on("gameError", (error) => {
      addToast(error.message, "error");
    });

    socket.on("joinError", (error) => {
      addToast(error.message, "error");
      navigate('/play/multiplayer');
    });

    socket.on("gameStateUpdate", (gameState) => setGameState(gameState));

    socket.on("gameEnded", (result) => {
      addToast(`Game over! Winner: ${result.winner}`, "success", 5000);
      setGameStarted(false);
    });

    socket.emit("requestRoomList");

    return () => {
      socket.off("assignUsername");
      socket.off("roomUpdate");
      socket.off("roomList");
      socket.off("gameStarted");
      socket.off("gameError");
      socket.off("joinError");
      socket.off("forceLeave");
      socket.off("gameStateUpdate");
      socket.off("gameEnded");
    };
  }, [addToast, navigate]);

  function joinRoom(formData) {
    if (!formData.roomName?.trim()) {
      addToast("Room name cannot be empty!", "warning");
      return;
    }
    if (!formData.username?.trim()) {
      addToast("Username cannot be empty!", "warning");
      return;
    }

    setLobbyControlsData({ username: formData.username, roomName: formData.roomName });
    setInRoom(true);

    sessionStorage.setItem("roomName", formData.roomName);
    sessionStorage.setItem("username", formData.username);

    socket.emit("joinRoom", { roomName: formData.roomName, playerName: formData.username });

    // Navigate to the room
    navigate(`/room/${formData.roomName}`);
  }

  function leaveRoom() {
    setInRoom(false);
    socket.emit("leaveRoom");
    navigate('/');
  }

  function startGame() {
    socket.emit("startGame", { roomName: lobbyControlsData.roomName });
  }

  function addAI() {
    socket.emit("addAI", { roomName: lobbyControlsData.roomName });
  }

  function removePlayer(playerName) {
    socket.emit("removePlayer", { roomName: lobbyControlsData.roomName, playerName });
    addToast(`Player ${playerName} has been removed`, "warning");
  }

  function startAIGame(formData) {
    // Create a special AI room
    const roomName = `AI-Game-${Math.floor(Math.random() * 10000)}`;
    const username = formData.username;
    const aiCount = formData.aiCount || 3;
    const difficulty = formData.difficulty || "medium";

    if (!username?.trim()) {
      addToast("Username cannot be empty!", "warning");
      return;
    }

    setLobbyControlsData({ username, roomName });
    setInRoom(true);

    sessionStorage.setItem("roomName", roomName);
    sessionStorage.setItem("username", username);

    // Join the AI room
    socket.emit("joinRoom", { roomName, playerName: username });

    // Navigate to the room
    navigate(`/room/${roomName}`);

    // Add AI players based on count
    setTimeout(() => {
      for (let i = 0; i < aiCount; i++) {
        socket.emit("addAI", { roomName, difficulty });
      }

      // Automatically start the game after a short delay
      setTimeout(() => {
        socket.emit("startGame", { roomName });
      }, 1000);
    }, 500);
  }

  // Make app state available to child components
  const appState = {
    socket,
    players,
    rooms,
    inRoom,
    gameStarted,
    creatorID,
    lobbyControlsData,
    gameState,
    isCreator: socket.id === creatorID,
    setLobbyControlsData,
    joinRoom,
    leaveRoom,
    startGame,
    addAI,
    removePlayer,
    startAIGame,
    addToast
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Big 2 Live",
          "applicationCategory": "GameApplication",
          "operatingSystem": "Web Browser",
          "description": "Play Big 2 (Pusoy Dos, Chinese Poker) online for free with friends or AI opponents.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />

      {/* Toast Container - will display all notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <main className={"container mx-auto px-4 flex-grow flex items-center justify-center"}>
          <div className={'w-full'}>
            {/* This is where child routes will be rendered */}
            <Outlet context={appState} />
          </div>
        </main>

        {/* Footer will stay at bottom due to flex layout */}
        {location.pathname === '/' && !inRoom && (
          <footer className="bg-gray-800 py-4 text-center text-gray-400 mt-auto">
            <p>&copy; 2025 Big 2 Live | Created by Retopia</p>
          </footer>
        )}
      </div>
    </>
  );
}

export default App;