import { useEffect, useState } from "react";
import { Link } from "react-router";
import { API_BASE_URL } from "../config";
import BackButton from "./BackButton";

const PAGE_SIZE = 50;

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load leaderboard.");
        }

        if (!cancelled) {
          setRows(data?.leaderboard || []);
          setTotal(data?.total || 0);
        }
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
  }, [page]);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

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

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0 || loading}
            className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages} ({total} players)
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1 || loading}
            className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
