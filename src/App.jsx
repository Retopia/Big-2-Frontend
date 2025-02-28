import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LobbyControls from "./components/LobbyControls";
import RoomList from "./components/RoomList";
import GameRoom from "./components/GameRoom";

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://api.big2.prestontang.dev",
  { withCredentials: true }
);


function App() {
  const [players, setPlayers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [creatorID, setcreatorID] = useState(null);
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
      setcreatorID(data.creatorID);
    });

    socket.on("forceLeave", (data) => {
      alert("You have been removed from the room.");
      setInRoom(false);
    })

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
      socket.off("assignUsername")
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

    setLobbyControlsData(prev => ({ ...prev, roomName: formData.roomName }));
    setInRoom(true);

    sessionStorage.setItem("roomName", formData.roomName);

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

  console.log(socket.id + " " + creatorID);

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
    <div>
      <h1>Big 2 Live</h1>
      <LobbyControls onRoomJoin={joinRoom} formData={lobbyControlsData} setFormData={setLobbyControlsData} />
      <RoomList rooms={rooms} onRoomJoin={joinRoom} formData={lobbyControlsData} />
    </div>
  );
}

export default App;
