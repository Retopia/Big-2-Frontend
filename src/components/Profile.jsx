import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_BASE_URL } from "../config";
import BackButton from "./BackButton";

function StatCard({ label, value, accent = "text-white" }) {
  return (
    <div className="rounded bg-gray-900 px-4 py-3 text-center">
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
    </div>
  );
}

// Lightweight inline SVG sparkline of rating over the recent matches (no deps).
function RatingSparkline({ points }) {
  if (points.length < 2) return null;

  const width = 320;
  const height = 64;
  const pad = 4;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  const coords = points.map((value, index) => {
    const x = pad + (index / (points.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (value - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const up = points[points.length - 1] >= points[0];

  return (
    <div className="rounded bg-gray-900 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
        <span>Rating trend (recent ranked games)</span>
        <span className={up ? "text-green-300" : "text-red-300"}>
          {min} – {max}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-16 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={coords.join(" ")}
          fill="none"
          stroke={up ? "#86efac" : "#fca5a5"}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Profile() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users/${encodeURIComponent(userId)}/profile`
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.message || "Unable to load profile.");
        }

        if (!cancelled) setData(payload);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const user = data?.user;
  const matches = data?.recentMatches || [];
  // Oldest → newest rating progression for the sparkline.
  const ratingPoints = [...matches]
    .reverse()
    .map((match) => match.ratingAfter)
    .filter((value) => typeof value === "number");
  const winRate =
    user && user.gamesPlayed > 0
      ? Math.round((user.wins / user.gamesPlayed) * 100)
      : 0;

  return (
    <div className="mx-auto w-full max-w-4xl py-10">
      <div className="mb-6">
        <BackButton to="/leaderboard" label="Back to leaderboard" />
      </div>

      {loading ? (
        <div className="rounded bg-gray-800 p-8 text-center text-gray-300 shadow-lg">
          Loading profile...
        </div>
      ) : error ? (
        <div className="rounded bg-gray-800 p-8 text-center text-red-300 shadow-lg">
          {error}
        </div>
      ) : !user ? (
        <div className="rounded bg-gray-800 p-8 text-center text-gray-300 shadow-lg">
          Player not found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded bg-gray-800 p-6 shadow-lg">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h1 className="text-3xl font-bold text-blue-400">
                  {user.username}
                </h1>
                <p className="text-sm text-gray-400">
                  {user.rank ? `Rank #${user.rank}` : "Unranked"} · Member since{" "}
                  {formatDate(user.memberSince)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-300">
                  {user.rating}
                </div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  ELO
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Games" value={user.gamesPlayed} />
              <StatCard label="Wins" value={user.wins} accent="text-green-300" />
              <StatCard label="Losses" value={user.losses} accent="text-red-300" />
              <StatCard label="Win rate" value={`${winRate}%`} accent="text-blue-300" />
            </div>
          </div>

          {ratingPoints.length >= 2 && (
            <RatingSparkline points={ratingPoints} />
          )}

          <div className="overflow-hidden rounded bg-gray-800 shadow-lg">
            <h2 className="border-b border-gray-700 px-6 py-4 text-lg font-semibold text-blue-300">
              Recent ranked matches
            </h2>
            {matches.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No ranked matches yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900 text-xs uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3 text-center">Players</th>
                      <th className="px-4 py-3 text-center">Result</th>
                      <th className="px-4 py-3 text-right">Change</th>
                      <th className="px-4 py-3 text-right">ELO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {matches.map((match) => (
                      <tr key={match.matchId} className="hover:bg-gray-700">
                        <td className="px-4 py-3 text-gray-300">
                          {formatDate(match.playedAt)}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {match.roomName}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-300">
                          {match.playerCount}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-semibold ${
                              match.won
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {match.won ? "Win" : "Loss"}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-medium ${
                            (match.ratingDelta || 0) >= 0
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {match.ratingDelta == null
                            ? "—"
                            : `${match.ratingDelta >= 0 ? "+" : ""}${match.ratingDelta}`}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-300">
                          {match.ratingAfter ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
