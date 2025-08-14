import { useEffect } from "react";
import { useParams, useOutletContext } from "react-router";
import { GameDisplay } from "./GameComponents";

function PreStartDisplay({ players, isCreator, onGameStart, onRoomLeave, onAddAI, onRemovePlayer }) {
  return (
    <div className="flex flex-col space-y-6">
      <PlayerList players={players} isCreator={isCreator} onRemovePlayer={onRemovePlayer} />
      
      <div className="flex flex-wrap gap-4 justify-center">
        {isCreator && (
          <button 
            onClick={onAddAI}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md"
          >
            Add AI Player
          </button>
        )}
        
        {isCreator && (
          <button 
            onClick={onGameStart}
            disabled={players.length < 2}
            className={`font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md ${
              players.length < 2 
                ? "bg-gray-500 cursor-not-allowed text-gray-300" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Start Game
          </button>
        )}
        
        <LeaveRoomButton onRoomLeave={onRoomLeave} />
      </div>
      
      {isCreator && players.length < 2 && (
        <p className="text-yellow-400 text-center font-medium">
          You need at least 2 players to start the game
        </p>
      )}
    </div>
  );
}

function LeaveRoomButton({ onRoomLeave }) {
  return (
    <button 
      onClick={onRoomLeave}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md"
    >
      Leave Room
    </button>
  );
}

function PlayerList({ players, isCreator, onRemovePlayer }) {
  const username = localStorage.getItem("username");

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-400">
        Players in Room ({players.length}/4)
      </h2>
      
      <ul className="space-y-3">
        {players.map((player, index) => (
          <li 
            key={index}
            className="flex justify-between items-center bg-gray-700 rounded-lg p-3 hover:bg-gray-650"
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${player === username ? "bg-green-500" : "bg-blue-500"}`}></div>
              <span className={player === username ? "font-medium" : ""}>
                {player} {player === username && "(You)"}
              </span>
            </div>
            
            {isCreator && player !== username && (
              <button 
                onClick={() => onRemovePlayer(player)}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-200"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      
      {players.length < 4 && (
        <div className="mt-4 p-3 border border-dashed border-gray-600 rounded-lg text-center text-gray-400">
          Waiting for more players to join...
        </div>
      )}
    </div>
  );
}

function GameRoom() {
  // Get roomName from URL params
  const { roomName } = useParams();
  
  // Get shared state from App component
  const { 
    players, 
    gameStarted, 
    isCreator, 
    startGame, 
    leaveRoom, 
    addAI, 
    removePlayer, 
    gameState, 
    socket
  } = useOutletContext();

  useEffect(() => {
    if (roomName) {
      localStorage.setItem("roomName", roomName);
    }
  }, [roomName]);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-6 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Big 2 Live</h1>
          <p className="text-gray-400">Room: <span className="font-medium text-white">{roomName}</span></p>
        </header>
        
        <main>
          {gameStarted ? (
            <GameDisplay 
              gameState={gameState}
              socket={socket}
            />
          ) : (
            <PreStartDisplay
              players={players}
              isCreator={isCreator}
              onGameStart={startGame}
              onRoomLeave={leaveRoom}
              onAddAI={addAI}
              onRemovePlayer={removePlayer}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default GameRoom;