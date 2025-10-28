import { useState } from "react";
import BackButton from "./BackButton";

const GameRules = () => {
  const [activeSection, setActiveSection] = useState('basic');

  return (
    <div className="py-6 sm:py-12 px-1.5 sm:px-0">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
        <div className="mb-2">
          {/* Small screens: stacked */}
          <div className="flex flex-col items-start sm:hidden space-y-2">
            <BackButton to="/" label="Back" />
            <h2 className="text-2xl font-semibold text-blue-400">How to Play Big 2</h2>
          </div>

          {/* Medium+ screens: overlay */}
          <div className="relative h-10 hidden sm:block">
            <div className="absolute left-0 top-0">
              <BackButton to="/" label="Back" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-400 pb-2 text-center absolute inset-0 flex items-center justify-center pointer-events-none">
              How to Play Big 2
            </h2>
          </div>
        </div>

        {/* Mobile View: Dropdown */}
        <div className="sm:hidden mb-4">
          <label htmlFor="section" className="text-sm text-gray-400 mb-1 block">Select a section:</label>
          <select
            id="section"
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2"
          >
            <option value="basic">Basic Rules</option>
            <option value="combinations">Card Combinations</option>
            <option value="strategy">Strategy</option>
            <option value="faq">FAQ</option>
          </select>
        </div>

        <div className="hidden sm:flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 ${activeSection === 'basic' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveSection('basic')}
          >
            Basic Rules
          </button>
          <button
            className={`py-2 px-4 ${activeSection === 'combinations' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveSection('combinations')}
          >
            Card Combinations
          </button>
          <button
            className={`py-2 px-4 ${activeSection === 'strategy' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveSection('strategy')}
          >
            Strategy
          </button>
          <button
            className={`py-2 px-4 ${activeSection === 'faq' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveSection('faq')}
          >
            FAQ
          </button>
        </div>

        {activeSection === 'basic' && (
          <div>
            <p className="mb-4">Big 2 (also known as Deuces, Pusoy Dos, or Chinese Poker) is a popular card game where the objective is to be the first to get rid of all your cards.</p>

            <h3 className="text-lg font-medium text-blue-300 mb-2">Basic Rules</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-4">
              <li>The game is typically played with 4 players using a standard 52-card deck.</li>
              <li>Card rankings (from low to high): 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2.</li>
              <li>Suit rankings (from low to high): ♦ Diamonds, ♣ Clubs, ♥ Hearts, ♠ Spades.</li>
              <li>Player with the 3 of Diamonds starts the first round.</li>
              <li>Players must play a higher-ranked combination than the previous player or pass.</li>
              <li>When all other players pass, the last player who played starts a new round.</li>
              <li>The first player to get rid of all their cards wins!</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg">
              <h4 className="font-medium text-blue-300 mb-2">Quick Start Guide</h4>
              <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                <li>Create a room or join an existing one</li>
                <li>Wait for other players or add AI opponents</li>
                <li>When it's your turn, select valid cards and click "Play"</li>
                <li>Try to be the first to play all your cards!</li>
              </ol>
            </div>
          </div>
        )}

        {activeSection === 'combinations' && (
          <div>
            <p className="mb-4">Big 2 allows various card combinations, each with specific ranking rules:</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Singles</h4>
                <p className="text-gray-300">A single card. Higher ranks beat lower ranks.</p>
                <p className="text-sm text-gray-400 mt-2">Example: 2♠ beats A♥, which beats K♦</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Pairs</h4>
                <p className="text-gray-300">Two cards of the same rank.</p>
                <p className="text-sm text-gray-400 mt-2">Example: 8♠8♥ beats 7♠7♥</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Three of a Kind</h4>
                <p className="text-gray-300">Three cards of the same rank.</p>
                <p className="text-sm text-gray-400 mt-2">Example: Q♠Q♥Q♦ beats J♠J♥J♦</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Straight</h4>
                <p className="text-gray-300">Five cards in sequence (suits don't matter).</p>
                <p className="text-sm text-gray-400 mt-2">Example: 3-4-5-6-7 (compared by highest card)</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Flush</h4>
                <p className="text-gray-300">Five cards of the same suit.</p>
                <p className="text-sm text-gray-400 mt-2">Example: 3♠7♠9♠J♠K♠ (compared by highest card)</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Full House</h4>
                <p className="text-gray-300">Three of a kind plus a pair.</p>
                <p className="text-sm text-gray-400 mt-2">Example: K-K-K-5-5 beats Q-Q-Q-A-A</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Four of a Kind</h4>
                <p className="text-gray-300">Four cards of the same rank plus any card.</p>
                <p className="text-sm text-gray-400 mt-2">Example: 9-9-9-9-3 beats 8-8-8-8-A</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-blue-300 mb-2">Straight Flush</h4>
                <p className="text-gray-300">Five cards in sequence of the same suit.</p>
                <p className="text-sm text-gray-400 mt-2">Example: 4♥5♥6♥7♥8♥ beats 3♠4♠5♠6♠7♠</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'strategy' && (
          <div>
            <p className="mb-4">Improve your Big 2 game with these proven strategies:</p>

            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-yellow-400 mb-2">Control the Game with 2s</h4>
                <p className="text-gray-300">The four 2s are the highest single cards. Try to save them for when you need to take control of a round.</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-yellow-400 mb-2">Save Strong Combinations</h4>
                <p className="text-gray-300">If you have powerful combinations like straight flushes or four of a kind, save them until you can play them without being beaten.</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-yellow-400 mb-2">Watch Your Opponents</h4>
                <p className="text-gray-300">Keep track of what cards have been played to predict what your opponents might have left.</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-medium text-yellow-400 mb-2">Break Up Weak Combinations</h4>
                <p className="text-gray-300">Sometimes it's better to break up a weak flush or straight to retain control with singles or pairs.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'faq' && (
          <div>
            <p className="mb-4">Common questions about Big 2:</p>

            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded">
                <p className="font-medium text-yellow-400 mb-1">What if I can't beat the last combination played?</p>
                <p className="text-gray-300">You must pass your turn. If all players pass, the last player who played a combination starts a new round.</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <p className="font-medium text-yellow-400 mb-1">Can I play any combination on my turn?</p>
                <p className="text-gray-300">You must follow the combination type that was played. If singles were played, you must play singles. If pairs were played, you must play pairs, etc.</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <p className="font-medium text-yellow-400 mb-1">What if I'm the first to play in a round?</p>
                <p className="text-gray-300">You can play any valid combination you want, and the next players must follow that combination type.</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <p className="font-medium text-yellow-400 mb-1">What is the ranking of cards in Big 2?</p>
                <p className="text-gray-300">Cards are ranked from lowest to highest as follows: 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2. This differs from many other card games where Ace is the highest card.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRules;