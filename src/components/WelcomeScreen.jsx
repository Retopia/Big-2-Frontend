import { useNavigate } from "react-router";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center pt-16 sm:pt-0">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-blue-400 mb-6">Big 2 Live</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Play the classic Big 2 card game (also known as Deuces, Pusoy Dos, or Chinese Poker)
          online with friends or against AI opponents.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div
          className="bg-blue-900 p-8 rounded-lg text-center hover:bg-blue-800 transition cursor-pointer transform hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/play/multiplayer')}
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold mb-2">Play with Friends</h3>
          <p className="text-gray-300">Create or join a room to play with friends online</p>
        </div>

        <div
          className="bg-indigo-900 p-8 rounded-lg text-center hover:bg-indigo-800 transition cursor-pointer transform hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/play/ai')}
        >
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold mb-2">Play with AI</h3>
          <p className="text-gray-300">Practice your skills against computer opponents</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button
          className="text-blue-400 hover:text-blue-300 font-medium text-lg"
          onClick={() => navigate('/rules')}
        >
          Learn how to play →
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;