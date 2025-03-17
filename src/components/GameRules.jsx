import React from 'react';

// Expanded FAQ items for better SEO
export const faqItems = [
  {
    question: "What if I can't beat the last combination played?",
    answer: "You must pass your turn. If all players pass, the last player who played a combination starts a new round."
  },
  {
    question: "Can I play any combination on my turn?",
    answer: "You must follow the combination type that was played. If singles were played, you must play singles. If pairs were played, you must play pairs, etc."
  },
  {
    question: "What if I'm the first to play in a round?",
    answer: "You can play any valid combination you want, and the next players must follow that combination type."
  },
  {
    question: "What is the ranking of cards in Big 2?",
    answer: "Cards are ranked from lowest to highest as follows: 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2. This differs from many other card games where Ace is the highest card."
  },
  {
    question: "Do suits matter in Big 2?",
    answer: "Yes, suits matter when comparing cards of the same rank. The suit order from lowest to highest is: Diamonds (♦), Clubs (♣), Hearts (♥), Spades (♠)."
  },
  {
    question: "How many cards does each player receive?",
    answer: "In a standard 4-player game, each player receives 13 cards (the deck is divided equally among all players)."
  }
];

function GameRules() {
  // Card combination definitions
  const combinations = [
    { name: "Singles", description: "Play one card. Higher ranks beat lower ranks." },
    { name: "Pairs", description: "Two cards of the same rank." },
    { name: "Three of a Kind", description: "Three cards of the same rank." },
    { name: "Straight", description: "Five cards in sequence (suits don't matter)." },
    { name: "Flush", description: "Five cards of the same suit." },
    { name: "Full House", description: "Three of a kind plus a pair." },
    { name: "Four of a Kind", description: "Four cards of the same rank plus any card." },
    { name: "Straight Flush", description: "Five cards in sequence of the same suit." }
  ];

  // Add more detailed strategy section for additional keyword-rich content
  const strategies = [
    {
      title: "Control the Game with 2s",
      description: "The four 2s are the highest single cards. Try to save them for when you need to take control of a round."
    },
    {
      title: "Save Strong Combinations",
      description: "If you have powerful combinations like straight flushes or four of a kind, save them until you can play them without being beaten."
    },
    {
      title: "Watch Your Opponents",
      description: "Keep track of what cards have been played to predict what your opponents might have left."
    },
    {
      title: "Break Up Weak Combinations",
      description: "Sometimes it's better to break up a weak flush or straight to retain control with singles or pairs."
    }
  ];

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400" id="game-rules">How to Play Big 2</h2>

        <div>
          <p className="mb-2">Big 2 (also known as Deuces, Pusoy Dos, or Chinese Poker) is a popular card game where the objective is to be the first to get rid of all your cards.</p>
          <p>Originating in China and gaining popularity across Asia and worldwide, Big 2 combines elements of strategy, memory, and careful planning.</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-blue-300 mb-2" id="basic-rules">Basic Rules</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>The game is typically played with 4 players using a standard 52-card deck.</li>
            <li>Card rankings (from low to high): 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2.</li>
            <li>Suit rankings (from low to high): ♦ Diamonds, ♣ Clubs, ♥ Hearts, ♠ Spades.</li>
            <li>Player with the 3 of Diamonds starts the first round.</li>
            <li>Players must play a higher-ranked combination than the previous player or pass.</li>
            <li>When all other players pass, the last player who played starts a new round.</li>
            <li>The first player to get rid of all their cards wins!</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-blue-300 mb-2" id="card-combinations">Card Combinations</h3>
          <p className="mb-3 text-gray-300">Big 2 allows various card combinations, each with specific ranking rules:</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {combinations.map((combo, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded text-center hover:bg-gray-650">
                <h4 className="font-medium text-blue-300 mb-1">{combo.name}</h4>
                <p className="text-sm text-gray-300">{combo.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* New Strategy Section for SEO-rich content */}
        <div>
          <h3 className="text-lg font-medium text-blue-300 mb-2" id="strategy-tips">Strategy Tips</h3>
          <p className="mb-3 text-gray-300">Improve your Big 2 game with these proven strategies:</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {strategies.map((strategy, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded hover:bg-gray-650">
                <h4 className="font-medium text-yellow-400 mb-1">{strategy.title}</h4>
                <p className="text-sm text-gray-300">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-blue-300 mb-2" id="frequently-asked-questions">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <p className="font-medium text-yellow-400 mb-1">{item.question}</p>
                <p className="text-sm text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional History Section for More Keywords */}
        <div>
          <h3 className="text-lg font-medium text-blue-300 mb-2" id="game-history">History of Big 2</h3>
          <p className="text-gray-300">
            Big 2 originated in China and has spread across Asia and beyond. Known as "Choh Dai Di" in Cantonese,
            "Deuces" in some English-speaking regions, and "Pusoy Dos" in the Philippines, this game has evolved
            with slightly different rules across cultures. The name "Big 2" comes from the fact that the 2 cards
            are the highest-ranking singles in the game, unlike most card games where Ace is highest.
          </p>
        </div>
      </div>
    </>
  );
}

export default GameRules;