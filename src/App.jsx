import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LobbyControls from "./components/LobbyControls";
import RoomList from "./components/RoomList";
import GameRoom from "./components/GameRoom";
import GameRules from "./components/GameRules";

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
    playedCards: [],
    currentPlayer: "",
    players: [],
    round: 1
  });

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
      alert("You have been removed from the room.");
      setInRoom(false);
    });

    socket.on("roomList", (data) => setRooms(data.rooms || []));
    socket.on("gameStarted", () => setGameStarted(true));
    socket.on("gameError", (error) => alert(error.message));
    socket.on("joinError", (error) => alert(error.message));
    socket.on("gameStateUpdate", (gameState) => setGameState(gameState));
    socket.on("gameEnded", (result) => {
      alert(`Game over! Winner: ${result.winner}`);
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
  }, []);

  function joinRoom(formData) {
    if (!formData.roomName.trim()) return alert("Room name cannot be empty!");
    if (!formData.username.trim()) return alert("Username cannot be empty!");

    setLobbyControlsData({ username: formData.username, roomName: formData.roomName });
    setInRoom(true);

    sessionStorage.setItem("roomName", formData.roomName);
    sessionStorage.setItem("username", formData.username);

    socket.emit("joinRoom", { roomName: formData.roomName, playerName: formData.username });
  }

  function leaveRoom() {
    setInRoom(false);
    socket.emit("leaveRoom");
  }

  function startGame() {
    socket.emit("startGame", { roomName: lobbyControlsData.roomName });
  }

  function addAI() {
    socket.emit("addAI", { roomName: lobbyControlsData.roomName });
  }

  function removePlayer(playerName) {
    socket.emit("removePlayer", { roomName: lobbyControlsData.roomName, playerName });
  }

  return inRoom ? (
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
  );
}

export default App;