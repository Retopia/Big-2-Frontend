import { useEffect } from "react";
import { GameDisplay } from "./GameComponents";

function PreStartDisplay({ players, isCreator, onGameStart, onRoomLeave, onAddAI, onRemovePlayer }) {
  return (
    <>
      <PlayerList players={players} isCreator={isCreator} onRemovePlayer={onRemovePlayer} />
      {isCreator && <button onClick={onAddAI}>Add AI</button>}
      {isCreator && <button onClick={onGameStart}>Start Game</button>}
      <LeaveRoomButton onRoomLeave={onRoomLeave} />
    </>
  );
}

function LeaveRoomButton({ onRoomLeave }) {
  return <button onClick={onRoomLeave}>Leave Room</button>;
}

function PlayerList({ players, isCreator, onRemovePlayer }) {
  const username = sessionStorage.getItem("username");

  return (
    <>
      <h1>Current Players in Room ({players.length}/4)</h1>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player}{" "}
            {isCreator && player !== username && (
              <button onClick={() => onRemovePlayer(player)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function GameRoom({ 
  players, 
  gameStarted, 
  isCreator, 
  onGameStart, 
  onRoomLeave, 
  onAddAI, 
  removePlayer,
  gameState,
  socket,
  roomName
}) {
  useEffect(() => {
    if (roomName) {
      sessionStorage.setItem("roomName", roomName);
    }
  }, [roomName]);

  return gameStarted ? (
    <GameDisplay 
      gameState={gameState}
      socket={socket}
    />
  ) : (
    <PreStartDisplay
      players={players}
      isCreator={isCreator}
      onGameStart={onGameStart}
      onRoomLeave={onRoomLeave}
      onAddAI={onAddAI}
      onRemovePlayer={removePlayer}
    />
  );
}

export default GameRoom;
