import { Link, useLocation } from "react-router";
import AuthBar from "./AuthBar";

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`rounded px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default function AppHeader() {
  const location = useLocation();
  // Inside a room we collapse to brand + auth only. The nav links are escape hatches
  // that would drop a player out of an active game on a stray tap.
  const inRoom = location.pathname.startsWith("/room/");

  return (
    <header className="border-b border-gray-800 bg-gray-900/95">
      <div className="container mx-auto flex flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-lg font-bold text-blue-400">
            Big 2 Live
          </Link>
          {!inRoom && (
            <nav className="flex items-center gap-1">
              <NavLink to="/play/multiplayer">Play</NavLink>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
              <NavLink to="/rules">Rules</NavLink>
            </nav>
          )}
        </div>
        <AuthBar />
      </div>
    </header>
  );
}
