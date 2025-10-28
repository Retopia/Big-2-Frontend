import { useNavigate } from "react-router";
import BackButton from "./BackButton";

export default function Changelog() {
  const navigate = useNavigate();

  const updates = [
    {
      title: "UI Enhancements and Gameplay Improvements",
      date: "October 28, 2025",
      changes: [
        "Table area now shows last played hand and current player's turn",
        "Added hover animation when selecting cards",
        "Reduced overall height of Game Controls for better visibility",
        "Added LLM AI difficulty for more challenging gameplay",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <BackButton onClick={() => navigate("/")} />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Changelog</h1>
          <p className="text-gray-400">Track updates and new features</p>
        </div>

        <div className="space-y-6">
          {updates.map((update, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="mb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <h2 className="text-xl font-bold text-blue-400">
                    {update.title}
                  </h2>
                  <span className="text-sm text-gray-400">{update.date}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {update.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span className="text-gray-300">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            More updates coming soon! Follow development on{" "}
            <a
              href="https://github.com/Retopia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
