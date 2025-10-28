import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ToastContainer } from "./components/ToastContainer";
import { useToast } from "./hooks/useToast";
import { JsonLd } from "./components/JsonLd";
import { useSocket } from "./hooks/useSocket";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  console.log("🏗️ App component mounting/rendering");
  const [players, setPlayers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [creatorID, setCreatorID] = useState(null);
  const [lobbyControlsData, setLobbyControlsData] = useState({
    username: "",
    roomName: "",
  });
  const [aiDifficulty, setAiDifficulty] = useState("standard");
  const [gameState, setGameState] = useState({
    hand: [],
    lastPlayedHand: [],
    currentPlayer: "",
    players: [],
    round: 1,
  });

  // Initialize toast hook
  const { toasts, addToast, removeToast } = useToast();

  // Check if we're in a room based on the URL
  useEffect(() => {
    const isInRoom = location.pathname.startsWith("/room/");
    setInRoom(isInRoom);

    if (isInRoom) {
      const roomName = location.pathname.split("/").pop();
      setLobbyControlsData((prev) => ({ ...prev, roomName }));
    }
  }, [location]);

  useEffect(() => {
    document.title = inRoom
      ? `Playing in ${lobbyControlsData.roomName} | Big 2 Live`
      : "Play Big 2 Card Game Online | Big 2 Live";
  }, [inRoom, lobbyControlsData.roomName]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    const handleConnect = () => {
      console.log("connected");
      if (storedUsername) {
        socket.emit("joinOrReconnect", { username: storedUsername });
        setLobbyControlsData((prev) => ({ ...prev, username: storedUsername }));
      } else {
        socket.emit("requestRandomUsername");
      }
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("assignUsername", (data) => {
      console.log("Assigning username", data.username);
      localStorage.setItem("username", data.username);
      setLobbyControlsData((prev) => ({ ...prev, username: data.username }));
    });

    socket.on("roomUpdate", (data) => {
      console.log("Room Update", data);
      setPlayers(data.players);
      setCreatorID(data.creatorID);
    });

    socket.on("forceLeave", () => {
      addToast("You have been removed from the room.", "error");
      setInRoom(false);
      navigate("/");
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
      navigate("/play/multiplayer");
    });

    socket.on("joinAIGameError", (error) => {
      addToast(error.message, "error");
      navigate("/play/ai");
    });

    socket.on("gameStateUpdate", (gameState) => setGameState(gameState));

    socket.on("gameEnded", (result) => {
      addToast(`Game over! Winner: ${result.winner}`, "success", 5000);
      setGameStarted(false);
    });

    socket.emit("requestRoomList");

    return () => {
      socket.off("connect", handleConnect);
      socket.off("assignUsername");
      socket.off("roomUpdate");
      socket.off("roomList");
      socket.off("gameStarted");
      socket.off("gameError");
      socket.off("joinError");
      socket.off("joinAIGameError");
      socket.off("forceLeave");
      socket.off("gameStateUpdate");
      socket.off("gameEnded");
    };
  }, [addToast, navigate, socket]);

  function joinRoom(formData) {
    if (!formData.roomName?.trim()) {
      addToast("Room name cannot be empty!", "warning");
      return;
    }
    if (!formData.username?.trim()) {
      addToast("Username cannot be empty!", "warning");
      return;
    }

    setLobbyControlsData({
      username: formData.username,
      roomName: formData.roomName,
    });
    setInRoom(true);
    // Optimistically set creatorID so UI instantly treats this client as owner
    setCreatorID(socket.id);

    localStorage.setItem("roomName", formData.roomName);
    localStorage.setItem("username", formData.username);

    socket.emit("joinRoom", {
      roomName: formData.roomName,
      playerName: formData.username,
    });

    // Navigate to the room
    navigate(`/room/${formData.roomName}`);
  }

  function leaveRoom() {
    setInRoom(false);
    socket.emit("leaveRoom");
    navigate("/");
  }

  function sendUsername() {
    socket.emit("updateUsername", { username: lobbyControlsData.username });
  }

  function startGame() {
    socket.emit("startGame", { roomName: lobbyControlsData.roomName });
  }

  function addAI(difficulty = aiDifficulty) {
    socket.emit("addAI", { roomName: lobbyControlsData.roomName, difficulty });
  }

  function removePlayer(playerName) {
    socket.emit("removePlayer", {
      roomName: lobbyControlsData.roomName,
      playerName,
    });
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
    setCreatorID(socket.id); // immediate ownership flag

    localStorage.setItem("roomName", roomName);
    localStorage.setItem("username", username);

    sendUsername();

    socket.emit("startAIGame", {
      roomName,
      playerName: username,
      aiCount,
      difficulty,
    });

    // Navigate to the room
    navigate(`/room/${roomName}`);
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
    aiDifficulty,
    setAiDifficulty,
    setLobbyControlsData,
    joinRoom,
    leaveRoom,
    startGame,
    addAI,
    removePlayer,
    startAIGame,
    addToast,
  };

  console.log("socket id, creatorid, isCreator:", socket.id, creatorID, socket.id === creatorID);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Big 2 Live",
          applicationCategory: "GameApplication",
          operatingSystem: "Web Browser",
          description:
            "Play Big 2 (Pusoy Dos, Chinese Poker) online for free with friends or AI opponents.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />

      {/* Toast Container - will display all notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <main
          className={
            "container mx-auto px-4 flex-grow flex items-center justify-center"
          }
        >
          <div className={"w-full"}>
            {/* This is where child routes will be rendered */}
            <Outlet context={appState} />
          </div>
        </main>

        {/* Footer will stay at bottom due to flex layout */}
        {location.pathname === "/" && !inRoom && (
          <footer className="bg-gray-800 py-4 text-center text-gray-400 mt-auto">
            <p className="text-base">
              <span>&copy; 2025 Big 2 Live</span>
              <span className="mx-2">|</span>
              <a href="https://prestontang.dev" className="hover:text-blue-400 transition">
                Created By Retopia
              </a>
              <span className="mx-2">|</span>
              <a href="/changelog" className="hover:text-blue-400 transition">
                Changelog
              </a>
              <span className="mx-2">|</span>
              <a href="/contact" className="hover:text-blue-400 transition">
                Contact Me
              </a>
            </p>
          </footer>
        )}
      </div>
    </>
  );
}

export default App;
