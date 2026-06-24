import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ToastContainer } from "./components/ToastContainer";
import { useToast } from "./hooks/useToast";
import { JsonLd } from "./components/JsonLd";
import AppHeader from "./components/AppHeader";
import { useSocket } from "./hooks/useSocket";
import { useAuth } from "./context/useAuth";
import { setGuestSessionId } from "./utils/sessionIdentity";
import {
  decodeRoomNameFromPath,
  encodeRoomNameForPath,
  normalizeNameInput,
  validatePlayerName,
  validateRoomName,
} from "./utils/nameValidation";

function getRoomNameFromPath(pathname) {
  if (!pathname.startsWith("/room/")) return "";
  const encodedRoomName = pathname.slice("/room/".length);
  return decodeRoomNameFromPath(encodedRoomName);
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const { refreshUser, token: authToken, user } = useAuth();
  console.log("🏗️ App component mounting/rendering");
  const [players, setPlayers] = useState([]);
  const [playerDetails, setPlayerDetails] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [creatorID, setCreatorID] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [lobbyControlsData, setLobbyControlsData] = useState({
    username: "",
    roomName: "",
    ranked: false,
  });
  const [aiDifficulty, setAiDifficulty] = useState("standard");
  const [turnTimer, setTurnTimer] = useState(null);
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
      const roomName = getRoomNameFromPath(location.pathname);
      setLobbyControlsData((prev) => ({ ...prev, roomName }));
    }
  }, [location]);

  useEffect(() => {
    const titlesByPath = {
      "/": "Play Big 2 Card Game Online | Big 2 Live",
      "/play/multiplayer": "Play Big 2 with Friends Online | Big 2 Live",
      "/play/ai": "Play Big 2 vs AI Opponents | Big 2 Live",
      "/rules": "How to Play Big 2 — Rules & Strategy | Big 2 Live",
      "/leaderboard": "Big 2 Ranked ELO Leaderboard | Big 2 Live",
      "/changelog": "Changelog | Big 2 Live",
      "/contact": "Contact | Big 2 Live",
    };

    if (inRoom) {
      document.title = `Playing in ${lobbyControlsData.roomName} | Big 2 Live`;
    } else if (location.pathname.startsWith("/profile/")) {
      document.title = "Player Profile | Big 2 Live";
    } else {
      document.title =
        titlesByPath[location.pathname] || "Play Big 2 Card Game Online | Big 2 Live";
    }
  }, [inRoom, lobbyControlsData.roomName, location.pathname]);

  useEffect(() => {
    const handleConnect = () => {
      console.log("connected");
      socket.refreshAuth?.();
      const storedUsername = localStorage.getItem("username");
      const preferredUsername = user?.username || storedUsername;
      if (preferredUsername) {
        socket.emit("joinOrReconnect", { username: preferredUsername });
        setLobbyControlsData((prev) => ({ ...prev, username: preferredUsername }));
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

    socket.on("sessionAssigned", (data) => {
      setParticipantId(data.participantId || null);
      if (data.guestSessionId) {
        setGuestSessionId(data.guestSessionId);
      }
    });

    socket.on("roomUpdate", (data) => {
      console.log("Room Update", data);
      setPlayers(data.players);
      setPlayerDetails(data.playerDetails || []);
      setCreatorID(data.creatorID);
    });

    socket.on("forceLeave", () => {
      addToast("You have been removed from the room.", "error");
      setInRoom(false);
      setTurnTimer(null);
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
      setInRoom(false);
      setTurnTimer(null);
      navigate(error.code === "AUTH_REQUIRED" ? "/" : "/play/multiplayer");
    });

    socket.on("joinAIGameError", (error) => {
      addToast(error.message, "error");
      navigate("/play/ai");
    });

    socket.on("gameStateUpdate", (gameState) => setGameState(gameState));

    // Turn clock: translate the server deadline into local-clock time so the
    // countdown is immune to client/server clock skew.
    socket.on("turnTimer", (data) => {
      if (!data || typeof data.deadline !== "number") return;
      const remaining = data.deadline - (data.serverNow ?? Date.now());
      setTurnTimer({
        currentPlayer: data.currentPlayer,
        deadline: Date.now() + Math.max(0, remaining),
      });
    });

    socket.on("turnTimerCleared", () => setTurnTimer(null));

    socket.on("gameEnded", (result) => {
      addToast(`Game over! Winner: ${result.winner}`, "success", 5000);
      setGameStarted(false);
      setTurnTimer(null);
      if (authToken) refreshUser();
    });

    socket.on("announcement", (data) => {
      if (!data?.message) return;
      const duration =
        typeof data.expiresAt === "number"
          ? Math.max(1500, Math.min(data.expiresAt - Date.now(), 30000))
          : 5000;
      addToast(`Announcement: ${data.message}`, data.type || "info", duration);
    });

    socket.emit("requestRoomList");

    return () => {
      socket.off("connect", handleConnect);
      socket.off("assignUsername");
      socket.off("sessionAssigned");
      socket.off("roomUpdate");
      socket.off("roomList");
      socket.off("gameStarted");
      socket.off("gameError");
      socket.off("joinError");
      socket.off("joinAIGameError");
      socket.off("forceLeave");
      socket.off("gameStateUpdate");
      socket.off("turnTimer");
      socket.off("turnTimerCleared");
      socket.off("gameEnded");
      socket.off("announcement");
    };
  }, [addToast, authToken, navigate, refreshUser, socket, user]);

  // Re-handshake the socket only when auth actually changes (login/logout) so the
  // server picks up the new token. Toggling inRoom must NOT trigger a reconnect —
  // that caused a lobby flicker every time the player left a room.
  const prevAuthTokenRef = useRef(authToken);
  useEffect(() => {
    socket.refreshAuth?.();
    if (prevAuthTokenRef.current === authToken) return;
    prevAuthTokenRef.current = authToken;
    if (socket.connected && !inRoom) {
      socket.disconnect();
      socket.connect();
    }
  }, [authToken, inRoom, socket]);

  function joinRoom(formData) {
    const roomValidation = validateRoomName(formData.roomName);
    if (!roomValidation.ok) {
      addToast(roomValidation.error, "warning");
      return;
    }

    const playerValidation = validatePlayerName(formData.username);
    if (!playerValidation.ok) {
      addToast(playerValidation.error, "warning");
      return;
    }

    const roomName = roomValidation.value;
    const username = playerValidation.value;

    setLobbyControlsData({
      username,
      roomName,
      ranked: Boolean(formData.ranked),
    });
    setInRoom(true);
    // Optimistically set creatorID so UI instantly treats this client as owner
    setCreatorID(participantId || socket.id);

    localStorage.setItem("roomName", roomName);
    localStorage.setItem("username", username);

    socket.emit("joinRoom", {
      roomName,
      playerName: username,
      rated: Boolean(formData.ranked),
    });

    // Navigate to the room
    navigate(`/room/${encodeRoomNameForPath(roomName)}`);
  }

  function joinRoomFromInvite(roomName) {
    const roomValidation = validateRoomName(roomName);
    if (!roomValidation.ok) {
      addToast(roomValidation.error, "warning");
      return;
    }

    const playerValidation = validatePlayerName(lobbyControlsData.username);
    if (!playerValidation.ok) {
      return;
    }

    const normalizedRoomName = roomValidation.value;
    const username = playerValidation.value;

    setLobbyControlsData((prev) => ({
      ...prev,
      username,
      roomName: normalizedRoomName,
    }));
    setInRoom(true);

    localStorage.setItem("roomName", normalizedRoomName);
    localStorage.setItem("username", username);

    socket.emit("joinRoom", {
      roomName: normalizedRoomName,
      playerName: username,
    });
  }

  function leaveRoom() {
    setInRoom(false);
    socket.emit("leaveRoom");
    navigate("/");
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
    const roomName = normalizeNameInput(`AI-Game-${Math.floor(Math.random() * 10000)}`);
    const playerValidation = validatePlayerName(formData.username);
    const aiCount = formData.aiCount || 3;
    const difficulty = formData.difficulty || "standard";

    if (!playerValidation.ok) {
      addToast(playerValidation.error, "warning");
      return;
    }

    const username = playerValidation.value;

    setLobbyControlsData({ username, roomName });
    setInRoom(true);
    setCreatorID(participantId || socket.id); // immediate ownership flag

    localStorage.setItem("roomName", roomName);
    localStorage.setItem("username", username);

    socket.emit("startAIGame", {
      roomName,
      playerName: username,
      aiCount,
      difficulty,
    });

    // Navigate to the room
    navigate(`/room/${encodeRoomNameForPath(roomName)}`);
  }

  // Make app state available to child components
  const appState = {
    socket,
    players,
    playerDetails,
    rooms,
    inRoom,
    gameStarted,
    creatorID,
    lobbyControlsData,
    gameState,
    turnTimer,
    participantId,
    // Compare against participantId once assigned, but fall back to socket.id during the
    // brief window before `sessionAssigned` arrives so the creator never loses host
    // controls (Start Game / Add AI) right after creating a room.
    isCreator: creatorID != null && creatorID === (participantId || socket.id),
    aiDifficulty,
    setAiDifficulty,
    setLobbyControlsData,
    joinRoom,
    joinRoomFromInvite,
    leaveRoom,
    startGame,
    addAI,
    removePlayer,
    startAIGame,
    addToast,
  };

  console.log("participant id, creatorid, isCreator:", participantId, creatorID, participantId === creatorID);

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
        <AppHeader />
        <main
          className={
            "container mx-auto px-4 flex-grow flex justify-center " +
            (inRoom ? "items-start py-6" : "items-center")
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
            {/* Mobile: Stack vertically, Desktop: Horizontal */}
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:justify-center md:items-center text-sm md:text-base">
              <span>&copy; 2025 Big 2 Live</span>
              <span className="hidden md:inline mx-2">|</span>
              <a href="https://prestontang.dev" className="hover:text-blue-400 transition">
                Created By Retopia
              </a>
              <span className="hidden md:inline mx-2">|</span>
              <a href="/changelog" className="hover:text-blue-400 transition">
                Changelog
              </a>
              <span className="hidden md:inline mx-2">|</span>
              <a href="/contact" className="hover:text-blue-400 transition">
                Contact Me
              </a>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}

export default App;
