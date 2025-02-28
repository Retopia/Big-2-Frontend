import { useState } from "react";

// Card component to represent a single card
function Card({ suit, value, faceUp = true }) {
  const cardStyle = {
    width: '80px',
    height: '120px',
    border: '1px solid black',
    borderRadius: '8px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5px',
    backgroundColor: faceUp ? 'white' : '#2c3e50',
    color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
    cursor: 'pointer',
    position: 'relative',
    userSelect: 'none'
  };

  return (
    <div style={cardStyle}>
      {faceUp ? (
        <>
          <div style={{ position: 'absolute', top: '5px', left: '5px' }}>{value}</div>
          <div style={{ fontSize: '38px' }}>{suit}</div>
          <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>{value}</div>
        </>
      ) : (
        <div>🂠</div>
      )}
    </div>
  );
}

// PlayerHand shows cards in the current player's hand
function PlayerHand({ cards, onCardPlay }) {
  return (
    <div>
      <h3>Your Hand:</h3>
      <div>
        {cards.map((card, index) => (
          <div key={index} onClick={() => onCardPlay(index)}>
            <Card suit={card.suit} value={card.value} faceUp={true} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OpponentHand({ playerName, cardCount, isActive }) {
  const cardPlaceholders = Array(cardCount).fill(null);

  return (
    <div>
      <h3>{playerName}{isActive ? ' (Active)' : ''}</h3>
      <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
        {cardPlaceholders.map((_, index) => (
          <div key={index} style={{ margin: '0 -20px 0 0' }}>
            <Card faceUp={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Table represents the play area where cards are placed
function Table({ playedCards, currentTurn }) {
  const username = sessionStorage.getItem("username");
  const isYourTurn = currentTurn === username;

  return (
    <div>
      <div>
        <h2>
          Turn: {currentTurn}
          {isYourTurn && " (Your Turn)"}
        </h2>
      </div>

      <div>
        {playedCards.map((card, index) => (
          <Card key={index} suit={card.suit} value={card.value} />
        ))}
      </div>
    </div>
  );
}

// Now update the GameDisplay component to use all these pieces
function GameDisplay({ gameState, socket }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const username = sessionStorage.getItem("username");
  const roomName = sessionStorage.getItem("roomName") || "";

  const getCardValue = (card) => {
    let value;
    switch (card.value) {
      case '2': value = 15; break;
      case 'A': value = 14; break;
      case 'K': value = 13; break;
      case 'Q': value = 12; break;
      case 'J': value = 11; break;
      default: value = parseInt(card.value); break;
    }

    // Add suit weight (Club < Diamond < Heart < Spade)
    switch (card.suit) {
      case '♣': value += 0.1; break;
      case '♦': value += 0.2; break;
      case '♥': value += 0.3; break;
      case '♠': value += 0.4; break;
    }

    return value;
  };

  const sortedHand = [...(gameState.hand || [])].sort((a, b) =>
    getCardValue(a) - getCardValue(b)
  );

  // Function to handle card selection
  const handleCardSelect = (card) => {
    if (selectedCards.some(c => c.suit === card.suit && c.value === card.value)) {
      setSelectedCards(selectedCards.filter(c =>
        !(c.suit === card.suit && c.value === card.value)
      ));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  // Function to play selected cards
  const playCards = () => {
    console.log(selectedCards)
    socket.emit("processMove", {
      roomName,
      cards: selectedCards
    });
    setSelectedCards([]);
  };

  // Function to pass turn
  const passTurn = () => {
    socket.emit("processMove", {
      roomName,
      cards: [] // Empty array means pass
    });
  };

  // Determine if it's the current player's turn
  const isMyTurn = gameState.currentPlayer === username;

  // Can only pass if it's not the first play (there are cards on the table)
  const canPass = isMyTurn && gameState.playedCards && gameState.playedCards.length > 0;

  console.log(gameState)

  return (
    <div>
      <div>
        <h1>Big 2</h1>
        {/* Show round info if needed */}
        <p>Round: {gameState.round || 1}</p>
      </div>

      <div>
        {/* Render opponent hands */}
        {gameState.players
          .filter(p => p.name !== username)
          .map((player, index) => (
            <OpponentHand
              key={index}
              playerName={player.name}
              cardCount={player.cardCount || 0}
              isActive={player.isCurrentPlayer}
            />
          ))}
      </div>

      <Table
        playedCards={gameState.playedCards || []}
        currentTurn={gameState.currentPlayer || ""}
      />

      <div>
        {/* Player's hand with card selection */}
        <div>
          <h3>Your Hand:</h3>
          <div>
            {sortedHand.map((card, index) => {
              const isSelected = selectedCards.some(
                c => c.suit === card.suit && c.value === card.value
              );

              return (
                <div
                  key={index}
                  onClick={() => isMyTurn && handleCardSelect(card)}
                  style={{
                    display: 'inline-block',
                    transform: isSelected ? 'translateY(-20px)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                >
                  <Card
                    suit={card.suit}
                    value={card.value}
                    faceUp={true}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Game controls */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={playCards}
            disabled={!isMyTurn || selectedCards.length === 0}
          >
            Play Selected Cards
          </button>

          <button
            onClick={passTurn}
            disabled={!canPass}
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  );
}

export { Card, PlayerHand, OpponentHand, Table, GameDisplay };