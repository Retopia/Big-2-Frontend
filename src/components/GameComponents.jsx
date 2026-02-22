import { useState } from "react";
import { normalizeNameInput } from "../utils/nameValidation";

const getCardValue = (card) => {
  let value;
  switch (card.value) {
    case "2":
      value = 15;
      break;
    case "A":
      value = 14;
      break;
    case "K":
      value = 13;
      break;
    case "Q":
      value = 12;
      break;
    case "J":
      value = 11;
      break;
    default:
      value = parseInt(card.value);
      break;
  }

  // Add suit weight (Diamond < Club < Heart < Spade)
  switch (card.suit) {
    case "♦":
      value += 0.1;
      break;
    case "♣":
      value += 0.2;
      break;
    case "♥":
      value += 0.3;
      break;
    case "♠":
      value += 0.4;
      break;
  }

  return value;
};

const getSuitValue = (card) => {
  // First by suit (Club < Diamond < Heart < Spade)
  let suitValue;
  switch (card.suit) {
    case "♣":
      suitValue = 1;
      break;
    case "♦":
      suitValue = 2;
      break;
    case "♥":
      suitValue = 3;
      break;
    case "♠":
      suitValue = 4;
      break;
    default:
      suitValue = 0;
  }

  // Then by card value
  let cardValue;
  switch (card.value) {
    case "2":
      cardValue = 15;
      break;
    case "A":
      cardValue = 14;
      break;
    case "K":
      cardValue = 13;
      break;
    case "Q":
      cardValue = 12;
      break;
    case "J":
      cardValue = 11;
      break;
    default:
      cardValue = parseInt(card.value);
      break;
  }

  return suitValue * 100 + cardValue; // Multiply suit by 100 to prioritize suit grouping
};

// Helper function to get proper card representation (A, K, Q, J instead of text)
const getCardDisplay = (value) => {
  switch (value) {
    case "A":
      return "A";
    case "K":
      return "K";
    case "Q":
      return "Q";
    case "J":
      return "J";
    default:
      return value;
  }
};

// Card component to represent a single card
function Card({ suit, value, faceUp = true, isSelected = false }) {
  // Determine card color based on suit
  const textColor =
    suit === "♥" || suit === "♦" ? "text-red-600" : "text-gray-900";
  const displayValue = getCardDisplay(value);

  return (
    <div
      className={`w-16 h-24 inline-flex justify-center items-center mx-1 rounded-lg 
      ${faceUp ? "bg-white" : "bg-blue-800"} 
      ${isSelected ? "shadow-lg ring-3 ring-yellow-400" : "shadow"} 
      select-none relative`}
    >
      {faceUp ? (
        <div
          className={`w-full h-full flex flex-col justify-between p-1 ${textColor}`}
        >
          <div className="text-md font-bold leading-none">{displayValue}</div>
          <div className="text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {suit}
          </div>
          <div className="text-md font-bold self-end leading-none">
            {displayValue}
          </div>
        </div>
      ) : (
        <div className="text-3xl text-gray-100">🂠</div>
      )}
    </div>
  );
}

// PlayerHand shows cards in the current player's hand
function PlayerHand({ cards, onCardPlay }) {
  return (
    <div className="my-4">
      <h3 className="text-lg font-medium mb-2">Your Hand:</h3>
      <div className="flex flex-wrap justify-center">
        {cards.map((card, index) => (
          <div key={index} onClick={() => onCardPlay(index)} className="m-1">
            <Card suit={card.suit} value={card.value} faceUp={true} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OpponentHand({ playerName, cardCount, isActive }) {
  return (
    <div
      className={`mb-2 p-3 rounded-lg transition-colors duration-200
      ${isActive ? "bg-gray-700 ring-2 ring-yellow-400" : "bg-gray-800"}`}
    >
      <div className="flex items-center justify-between">
        {/* Player name and active status */}
        <div className="flex items-center">
          {isActive && (
            <div className="h-2.5 w-2.5 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
          )}
          <h3
            className={`text-md font-medium ${
              isActive ? "text-yellow-400" : "text-white"
            }`}
          >
            {playerName}
            {isActive && (
              <span className="text-sm ml-1.5 text-yellow-300">(Active)</span>
            )}
          </h3>
        </div>

        {/* Card visualization pushed to far right (before count) - hidden on mobile */}
        <div className="hidden md:flex items-center justify-end ml-auto mr-6">
          {cardCount > 0 && (
            <div className="relative h-4 flex">
              {/* Generate small visual indicators for cards */}
              {[...Array(Math.min(cardCount, 17))].map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-1.5 bg-blue-800 rounded-sm shadow-sm ml-0.5"
                />
              ))}
            </div>
          )}
        </div>

        {/* Card count on right */}
        <div className="bg-gray-900 px-2.5 py-1 rounded-lg flex items-center text-sm shrink-0">
          <span className="text-gray-300 font-medium">{cardCount}</span>
          <span className="ml-1 text-gray-400">cards</span>
        </div>
      </div>
    </div>
  );
}

//   represents the play area where cards are placed
function Table({ lastPlayedHand, currentTurn, lastPlayedBy }) {
  const username = localStorage.getItem("username");
  const isYourTurn = currentTurn === username;

  const sortedLastPlayedHand = [...(lastPlayedHand || [])].sort((a, b) =>
      getCardValue(a) - getCardValue(b)
  );

  return (
    <div className="my-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-2 gap-2">
        <h2 className="text-sm font-semibold">
          <span className={isYourTurn ? "text-yellow-400" : "text-blue-300"}>
            {(currentTurn || "—")}&apos;s Turn
          </span>
        </h2>
        {isYourTurn && (
            <span className="text-xs bg-yellow-500 text-gray-900 px-2 py-1 rounded font-semibold animate-pulse">
              YOUR TURN
            </span>
        )}
      </div>

      <div className="min-h-32 flex flex-col justify-center items-center p-3 bg-gray-700 rounded-lg">
        {lastPlayedHand.length === 0 ? (
          <p className="text-gray-400 italic">No cards played yet</p>
        ) : (
          <>
            <div className="flex flex-wrap justify-center">
              {sortedLastPlayedHand.map((card, index) => (
                <Card key={index} suit={card.suit} value={card.value} />
              ))}
            </div>
            {lastPlayedBy && (
              <p className="mt-2 text-xs text-gray-200 tracking-wide">
                Played by <span className="text-blue-400 font-medium">{lastPlayedBy}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Now update the GameDisplay component to use all these pieces
function GameDisplay({ gameState, socket }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [sortBySuit, setSortBySuit] = useState(false);
  const username = localStorage.getItem("username");
  const roomName = normalizeNameInput(localStorage.getItem("roomName") || "");

  const sortedHand = [...(gameState.hand || [])].sort((a, b) =>
    sortBySuit
      ? getSuitValue(a) - getSuitValue(b)
      : getCardValue(a) - getCardValue(b)
  );

  // Function to handle card selection
  const handleCardSelect = (card) => {
    if (
      selectedCards.some((c) => c.suit === card.suit && c.value === card.value)
    ) {
      setSelectedCards(
        selectedCards.filter(
          (c) => !(c.suit === card.suit && c.value === card.value)
        )
      );
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  // Function to play selected cards
  const playCards = () => {
    socket.emit("processMove", {
      roomName,
      cards: selectedCards,
    });
    setSelectedCards([]);
  };

  // Function to pass turn
  const passTurn = () => {
    socket.emit("processMove", {
      roomName,
      cards: [], // Empty array means pass
    });
  };

  // Determine if it's the current player's turn
  const isMyTurn = gameState.currentPlayer === username;

  // Can only pass if it's not the first play (there are cards on the table)
  const canPass =
    isMyTurn && gameState.lastPlayedHand && gameState.lastPlayedHand.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">Big 2</h1>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center bg-gray-800 rounded-full px-3 py-1.5">
            <span className="text-sm text-gray-300 mr-2">Sort:</span>
            <div
              className="relative flex items-center justify-between bg-gray-700 w-20 h-7 rounded-full p-1 cursor-pointer"
              onClick={() => setSortBySuit(!sortBySuit)}
            >
              <span
                className={`inline-block text-xs z-10 pl-1.5 ${
                  sortBySuit ? "text-gray-400" : "text-white font-medium"
                }`}
              >
                Value
              </span>
              <span
                className={`inline-block text-xs z-10 pr-1.5 ${
                  sortBySuit ? "text-white font-medium" : "text-gray-400"
                }`}
              >
                Suit
              </span>
              <span
                className={`absolute h-5 w-10 rounded-full bg-blue-600 transform transition-transform duration-200 ${
                  sortBySuit ? "translate-x-9" : "translate-x-0"
                }`}
              ></span>
            </div>
          </div>
          <div className="bg-gray-800 px-4 py-1.5 rounded-full flex justify-center items-center">
            <p className="font-medium text-sm text-center">
              Round:{" "}
              <span className="text-blue-400">{gameState.round || 1}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {/* Render opponent hands */}
        {gameState.players
          .filter((p) => p.name !== username)
          .map((player, index) => (
            <OpponentHand
              key={index}
              playerName={player.name}
              cardCount={player.cardCount || 0}
              isActive={player.name === gameState.currentPlayer}
            />
          ))}
      </div>

      <Table
        lastPlayedHand={gameState.lastPlayedHand || []}
        currentTurn={gameState.currentPlayer || ""}
        lastPlayedBy={gameState.lastPlayedBy || null}
      />

      <div className="mt-6">
        {/* Player's hand with card selection */}
        <div>
          <h3 className="text-xl font-medium mb-3 text-blue-400">Your Hand</h3>
          <div className="flex flex-wrap justify-center">
            {sortedHand.map((card, index) => {
              const isSelected = selectedCards.some(
                (c) => c.suit === card.suit && c.value === card.value
              );

              return (
                <div
                  key={index}
                  onClick={() => isMyTurn && handleCardSelect(card)}
                  className={`transform transition-transform duration-200 cursor-pointer m-1 
                    ${
                      isSelected
                        ? "-translate-y-4 shadow-2xl ring-yellow-400"
                        : "hover:-translate-y-2"
                    }
                    ${!isMyTurn ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <Card
                    suit={card.suit}
                    value={card.value}
                    faceUp={true}
                    isSelected={isSelected}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Game controls */}
        <div className="mt-4 flex justify-center space-x-4 mb-4">
          <button
            onClick={playCards}
            disabled={!isMyTurn || selectedCards.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition duration-200 
              ${
                !isMyTurn || selectedCards.length === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
          >
            Play ({selectedCards.length})
          </button>

          <button
            onClick={passTurn}
            disabled={!canPass}
            className={`px-6 py-2 rounded-lg font-medium transition duration-200 
              ${
                !canPass
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  );
}

export { Card, PlayerHand, OpponentHand, Table, GameDisplay };
