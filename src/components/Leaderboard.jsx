import { useEffect, useState } from "react";
import { Link } from "react-router";
import { API_BASE_URL } from "../config";
import BackButton from "./BackButton";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=50`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load leaderboard.");
        }

        if (!cancelled) setRows(data?.leaderboard || []);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <BackButton to="/" label="Back" />
        <h1 className="text-3xl font-bold text-blue-400">Leaderboard</h1>
        <div className="w-16" />
      </div>

      <div className="overflow-hidden rounded bg-gray-800 shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-300">Loading rankings...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-300">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-300">No ranked games yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3 text-right">ELO</th>
                  <th className="px-4 py-3 text-right">Games</th>
                  <th className="px-4 py-3 text-right">Wins</th>
                  <th className="px-4 py-3 text-right">Losses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rows.map((player) => (
                  <tr key={player.userId} className="hover:bg-gray-700">
                    <td className="px-4 py-3 font-semibold text-blue-300">
                      {player.rank}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      <Link
                        to={`/profile/${player.userId}`}
                        className="hover:text-blue-300 hover:underline"
                      >
                        {player.username}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-blue-300">
                      {player.rating}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {player.gamesPlayed}
                    </td>
                    <td className="px-4 py-3 text-right text-green-300">
                      {player.wins}
                    </td>
                    <td className="px-4 py-3 text-right text-red-300">
                      {player.losses}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
