import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import BackButton from "./BackButton";

const ANNOUNCEMENT_TYPES = ["info", "success", "warning", "error"];

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "Request failed.");
  }
  return payload;
}

function AdminPanel() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [rooms, setRooms] = useState([]);
  const [players, setPlayers] = useState([]);
  const [aiConfig, setAiConfig] = useState({
    llmModel: "",
    defaultLlmModel: "",
    hasOpenRouterKey: false,
  });
  const [modelInput, setModelInput] = useState("");
  const [announcement, setAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    message: "",
    type: "info",
    durationMs: 30000,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const roomCount = rooms.length;
  const playerCount = players.length;
  const playingCount = useMemo(
    () => rooms.filter((room) => room.status === "playing").length,
    [rooms]
  );

  function resetMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function checkSession() {
    try {
      const session = await apiRequest("/admin/api/session");
      setAuthenticated(Boolean(session.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setSessionChecked(true);
    }
  }

  async function loadDashboard() {
    setLoading(true);
    try {
      const [roomsData, playersData, aiData, announcementData] = await Promise.all([
        apiRequest("/admin/api/rooms"),
        apiRequest("/admin/api/players"),
        apiRequest("/admin/api/ai"),
        apiRequest("/admin/api/announcement"),
      ]);

      setRooms(roomsData.rooms || []);
      setPlayers(playersData.players || []);
      setAiConfig(aiData);
      setModelInput(aiData.llmModel || "");
      setAnnouncement(announcementData.announcement || null);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      await apiRequest("/admin/api/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setAuthenticated(true);
      setPassword("");
      setSuccessMessage("Logged in.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    resetMessages();
    setLoading(true);
    try {
      await apiRequest("/admin/api/logout", { method: "POST" });
      setAuthenticated(false);
      setRooms([]);
      setPlayers([]);
      setAnnouncement(null);
      setSuccessMessage("Logged out.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCloseRoom(roomName) {
    resetMessages();
    if (!window.confirm(`Close room "${roomName}"?`)) return;

    setLoading(true);
    try {
      await apiRequest("/admin/api/rooms/close", {
        method: "POST",
        body: JSON.stringify({
          roomName,
          reason: "Room closed by admin for maintenance.",
        }),
      });
      setSuccessMessage(`Closed room: ${roomName}`);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveModel() {
    resetMessages();
    setLoading(true);
    try {
      const data = await apiRequest("/admin/api/ai/model", {
        method: "POST",
        body: JSON.stringify({ model: modelInput }),
      });
      setAiConfig((prev) => ({ ...prev, llmModel: data.llmModel }));
      setSuccessMessage(`LLM model set to: ${data.llmModel}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishAnnouncement(event) {
    event.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const data = await apiRequest("/admin/api/announcement", {
        method: "POST",
        body: JSON.stringify(announcementForm),
      });
      setAnnouncement(data.announcement);
      setSuccessMessage("Announcement sent.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearAnnouncement() {
    resetMessages();
    setLoading(true);

    try {
      await apiRequest("/admin/api/announcement", { method: "DELETE" });
      setAnnouncement(null);
      setSuccessMessage("Announcement cleared.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    loadDashboard();
    const interval = setInterval(loadDashboard, 5000);
    return () => clearInterval(interval);
  }, [authenticated]);

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Checking admin session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <BackButton to="/" label="Back" />
          </div>
          <h1 className="text-2xl font-bold text-blue-400 mb-4">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-gray-300 mb-1">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          {errorMessage && <p className="text-red-400 mt-4">{errorMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackButton to="/" label="Back" />
            <h1 className="text-3xl font-bold text-blue-400">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition disabled:opacity-60"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition disabled:opacity-60"
            >
              Logout
            </button>
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={`rounded-lg px-4 py-3 ${
              errorMessage ? "bg-red-900/40 border border-red-700" : "bg-green-900/40 border border-green-700"
            }`}
          >
            {errorMessage || successMessage}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400">Rooms</p>
            <p className="text-3xl font-bold">{roomCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400">Players</p>
            <p className="text-3xl font-bold">{playerCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400">Active Games</p>
            <p className="text-3xl font-bold">{playingCount}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-3">
          <h2 className="text-xl font-semibold text-blue-300">LLM Model</h2>
          <p className="text-sm text-gray-400">
            Current: <span className="text-white font-medium">{aiConfig.llmModel || "-"}</span>
          </p>
          <p className="text-sm text-gray-400">
            Default: <span className="text-white font-medium">{aiConfig.defaultLlmModel || "-"}</span>
          </p>
          <p className="text-sm text-gray-400">
            OpenRouter key:{" "}
            <span className={aiConfig.hasOpenRouterKey ? "text-green-400" : "text-red-400"}>
              {aiConfig.hasOpenRouterKey ? "Configured" : "Missing"}
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={modelInput}
              onChange={(event) => setModelInput(event.target.value)}
              className="flex-1 px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example: x-ai/grok-4-fast"
            />
            <button
              onClick={handleSaveModel}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded transition disabled:opacity-60"
            >
              Save Model
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
          <h2 className="text-xl font-semibold text-blue-300">Announcements</h2>
          {announcement ? (
            <div className="bg-gray-700 rounded p-3 border border-gray-600">
              <p className="text-sm text-gray-300">Active ({announcement.type})</p>
              <p className="text-white">{announcement.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                Expires: {new Date(announcement.expiresAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">No active announcement.</p>
          )}

          <form onSubmit={handlePublishAnnouncement} className="space-y-3">
            <textarea
              value={announcementForm.message}
              onChange={(event) =>
                setAnnouncementForm((prev) => ({ ...prev, message: event.target.value }))
              }
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type announcement..."
              rows={3}
              maxLength={280}
            />
            <div className="grid sm:grid-cols-3 gap-3">
              <select
                value={announcementForm.type}
                onChange={(event) =>
                  setAnnouncementForm((prev) => ({ ...prev, type: event.target.value }))
                }
                className="px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
              >
                {ANNOUNCEMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1000}
                max={300000}
                step={1000}
                value={announcementForm.durationMs}
                onChange={(event) =>
                  setAnnouncementForm((prev) => ({
                    ...prev,
                    durationMs: Number.parseInt(event.target.value, 10) || 30000,
                  }))
                }
                className="px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition disabled:opacity-60"
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={handleClearAnnouncement}
                  disabled={loading}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition disabled:opacity-60"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">Rooms</h2>
          {rooms.length === 0 ? (
            <p className="text-gray-400">No active rooms.</p>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-gray-700 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
                >
                  <div>
                    <p className="text-white font-medium">{room.name}</p>
                    <p className="text-sm text-gray-300">
                      {room.playerCount} players • status: {room.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      {room.players.map((player) => player.name).join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCloseRoom(room.name)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition disabled:opacity-60"
                  >
                    Close Room
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">Players</h2>
          {players.length === 0 ? (
            <p className="text-gray-400">No connected players.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-300 border-b border-gray-700">
                    <th className="py-2 pr-3">Username</th>
                    <th className="py-2 pr-3">Socket ID</th>
                    <th className="py-2 pr-3">Room</th>
                    <th className="py-2 pr-3">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr
                      key={`${player.name}_${player.socketId || "ai"}_${index}`}
                      className="border-b border-gray-700/50"
                    >
                      <td className="py-2 pr-3 text-white">{player.name}</td>
                      <td className="py-2 pr-3 font-mono text-xs text-gray-300">
                        {player.socketId || "-"}
                      </td>
                      <td className="py-2 pr-3 text-gray-300">
                        {player.roomName || "Lobby"}
                      </td>
                      <td className="py-2 pr-3 text-gray-300">
                        {player.isAI ? `AI (${player.difficulty || "standard"})` : "Human"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
