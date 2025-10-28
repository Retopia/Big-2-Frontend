import { useState } from "react";
import BackButton from "./BackButton";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "prestonltang@nyu.edu";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <BackButton onClick={() => console.log("Navigate back")} />

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Contact</h1>
          <p className="text-gray-400">Get in touch or report issues</p>
        </div>

        <div className="space-y-6">
          {/* Email Card - More prominent */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-6 border border-blue-700/50 hover:border-blue-600/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Email Us</h3>
                  <p className="text-gray-300 text-sm">
                    Send feedback or questions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${email}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition text-center"
              >
                Send Email
              </a>
              <button
                onClick={copyEmail}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition"
                title="Copy email address"
              >
                {copied ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <p className="text-gray-400 text-sm mt-3 text-center">My Email is: {email}</p>
          </div>

          {/* Bug Reporting Info - More compact */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-900/40 rounded-lg flex items-center justify-center mr-4 mt-1">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Reporting Bugs
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  When reporting issues, please include:
                </p>
                <ul className="text-gray-400 text-sm space-y-1.5">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>What you were doing when the bug occurred</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>Your browser and device information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>Steps to reproduce the issue</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
