import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import { GameDisplay } from "./GameComponents";
import { decodeRoomNameFromPath } from "../utils/nameValidation";

function AddAIModal({ isOpen, onClose, onConfirm }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("standard");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedDifficulty);
    onClose();
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Add AI Player</h2>
        <p className="text-gray-300 mb-6">Select the AI type for your opponent:</p>
        
        <div className="space-y-3 mb-6">
          <label className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition">
            <input
              type="radio"
              name="difficulty"
              value="standard"
              checked={selectedDifficulty === "standard"}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-4 h-4 text-indigo-600"
            />
            <div className="ml-3">
              <div className="font-medium text-white">Standard AI</div>
              <div className="text-sm text-gray-400">Rule-based algorithm, fast and predictable</div>
            </div>
          </label>
          
          <label className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition">
            <input
              type="radio"
              name="difficulty"
              value="llm"
              checked={selectedDifficulty === "llm"}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-4 h-4 text-indigo-600"
            />
            <div className="ml-3">
              <div className="font-medium text-white">LLM AI</div>
              <div className="text-sm text-gray-400">Powered by a small Large Language Model</div>
            </div>
          </label>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Add AI
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PreStartDisplay({ players, isCreator, onGameStart, onRoomLeave, onAddAI, onRemovePlayer }) {
  const [showAIModal, setShowAIModal] = useState(false);
  
  console.log("is creator:", isCreator);
  
  const handleAddAI = (difficulty) => {
    onAddAI(difficulty);
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <PlayerList players={players} isCreator={isCreator} onRemovePlayer={onRemovePlayer} />
      
      <div className="flex flex-wrap gap-4 justify-center">
        {isCreator && (
          <button 
            onClick={() => setShowAIModal(true)}
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
      
      <AddAIModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onConfirm={handleAddAI}
      />
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
                <span className="hidden sm:inline">Remove</span>
                <span className="sm:hidden">✕</span>
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
  const { roomName: roomNameParam } = useParams();
  const roomName = decodeRoomNameFromPath(roomNameParam || "");
  
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
