import { useState } from "react";
import { useOutletContext } from "react-router";
import BackButton from "./BackButton";

const AISetup = () => {
  const { lobbyControlsData, setLobbyControlsData, startAIGame } = useOutletContext();
  const [aiSettings, setAiSettings] = useState({
    aiCount: 1,
    difficulty: "standard",
    autoSort: true,
    timerEnabled: false
  });

  const handleSubmit = () => {
    startAIGame({
      ...lobbyControlsData,
      ...aiSettings
    });
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          {/* Small screens: stacked */}
          <div className="flex flex-col items-start sm:hidden space-y-2">
            <BackButton to="/" label="Back" />
            <h2 className="text-2xl font-semibold text-blue-400">Play with AI</h2>
          </div>

          {/* Medium+ screens: overlay */}
          <div className="relative h-10 hidden sm:block">
            <div className="absolute left-0 top-0">
              <BackButton to="/" label="Back" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-400 pb-2 text-center absolute inset-0 flex items-center justify-center pointer-events-none">
              Play with AI
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-md font-medium text-gray-300 mb-1">
              Your Username
            </label>
            <input
              id="username"
              type="text"
              value={lobbyControlsData.username}
              onChange={(e) => setLobbyControlsData({ ...lobbyControlsData, username: e.target.value })}
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-md font-medium text-gray-300 mb-1">
                Amount
              </label>
              <select
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={aiSettings.aiCount}
                onChange={(e) => setAiSettings({ ...aiSettings, aiCount: parseInt(e.target.value) })}
              >
                <option value={1}>1 AI opponent</option>
                <option value={2}>2 AI opponents</option>
                <option value={3}>3 AI opponents</option>
              </select>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-300 mb-1">
                Difficulty Level
              </label>
              <select
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={aiSettings.difficulty}
                onChange={(e) => setAiSettings({ ...aiSettings, difficulty: e.target.value })}
              >
                <option value="standard">Standard</option>
                <option value="llm">LLM</option>
              </select>
            </div>
          </div>
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200 mt-4"
            onClick={handleSubmit}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISetup;