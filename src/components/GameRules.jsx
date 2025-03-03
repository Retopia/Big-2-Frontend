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

  // FAQ items
  const faqItems = [
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
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-400">How to Play Big 2</h2>
      
      <div>
        <p>Big 2 (also known as Deuces, Pusoy Dos, or Chinese Poker) is a popular card game where the objective is to be the first to get rid of all your cards.</p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-blue-300 mb-2">Basic Rules</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-300">
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
        <h3 className="text-lg font-medium text-blue-300 mb-2">Card Combinations</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {combinations.map((combo, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded text-center hover:bg-gray-650">
              <h4 className="font-medium text-blue-300 mb-1">{combo.name}</h4>
              <p className="text-sm text-gray-300">{combo.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-blue-300 mb-2">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded">
              <p className="font-medium text-yellow-400 mb-1">{item.question}</p>
              <p className="text-sm text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameRules;