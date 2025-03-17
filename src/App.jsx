import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LobbyControls from "./components/LobbyControls";
import RoomList from "./components/RoomList";
import GameRoom from "./components/GameRoom";
import GameRules, { faqItems } from "./components/GameRules";
import { ToastContainer } from "./components/ToastContainer";
import { useToast } from "./hooks/useToast";
import { JsonLd } from './components/JsonLd';

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:3002"
    : "https://api.big2.prestontang.dev",
  { withCredentials: true }
);

function App() {
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
    });

    socket.on("roomList", (data) => setRooms(data.rooms || []));

    socket.on("gameStarted", () => {
      setGameStarted(true);
      addToast("Game has started! Good luck!", "success");
    });

    socket.on("gameError", (error) => {
      addToast(error.message, "error");
    });

    socket.on("joinError", (error) => {
      addToast(error.message, "error");
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
  }, [addToast]);

  function joinRoom(formData) {
    if (!formData.roomName.trim()) {
      addToast("Room name cannot be empty!", "warning");
      return;
    }
    if (!formData.username.trim()) {
      addToast("Username cannot be empty!", "warning");
      return;
    }

    setLobbyControlsData({ username: formData.username, roomName: formData.roomName });
    setInRoom(true);

    sessionStorage.setItem("roomName", formData.roomName);
    sessionStorage.setItem("username", formData.username);

    socket.emit("joinRoom", { roomName: formData.roomName, playerName: formData.username });
    // addToast(`Joining room: ${formData.roomName}`, "info");
  }

  function leaveRoom() {
    setInRoom(false);
    socket.emit("leaveRoom");
    // addToast("You have left the room", "info");
  }

  function startGame() {
    socket.emit("startGame", { roomName: lobbyControlsData.roomName });
  }

  function addAI() {
    socket.emit("addAI", { roomName: lobbyControlsData.roomName });
    // addToast("AI player added to the game", "info");
  }

  function removePlayer(playerName) {
    socket.emit("removePlayer", { roomName: lobbyControlsData.roomName, playerName });
    addToast(`Player ${playerName} has been removed`, "warning");
  }

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

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }}
      />
      {/* Toast Container - will display all notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {inRoom ? (
        <GameRoom
          players={players}
          gameStarted={gameStarted}
          isCreator={socket.id === creatorID}
          onGameStart={startGame}
          onRoomLeave={leaveRoom}
          onAddAI={addAI}
          onRemovePlayer={removePlayer}
          gameState={gameState}
          socket={socket}
          roomName={lobbyControlsData.roomName}
        />
      ) : (
        <div className="min-h-screen bg-gray-900 text-white">
          <header className="bg-gray-800 py-6 px-4 shadow-md">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold text-center text-blue-400">Big 2 Live</h1>
              <p className="text-center text-gray-400 mt-2">The classic card game online</p>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <LobbyControls
                  onRoomJoin={joinRoom}
                  formData={lobbyControlsData}
                  setFormData={setLobbyControlsData}
                  rooms={rooms}
                />

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Available Rooms</h2>
                  <RoomList
                    rooms={rooms}
                    onRoomJoin={joinRoom}
                    formData={lobbyControlsData}
                  />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <GameRules />
              </div>
            </div>
          </main>

          <footer className="bg-gray-800 py-4 mt-12 text-center text-gray-400">
            <p>&copy; 2025 Big 2 Live | Created with ♥</p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;