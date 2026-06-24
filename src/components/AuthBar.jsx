import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/useAuth";
import { PLAYER_NAME_MAX_LENGTH } from "../utils/nameValidation";

export default function AuthBar() {
  const { authError, loading, login, logout, register, user } = useAuth();
  const [mode, setMode] = useState("closed");
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const isRegistering = mode === "register";

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await register(form);
      } else {
        await login(form);
      }
      setForm({ email: "", username: "", password: "" });
      setMode("closed");
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  if (loading) {
    return (
      <div className="rounded bg-gray-800 px-3 py-2 text-sm text-gray-300">
        Account...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 rounded bg-gray-800 px-3 py-2 text-sm">
        <Link to={`/profile/${user.id}`} className="text-right leading-tight">
          <div className="font-medium text-white hover:text-blue-300">
            {user.username}
          </div>
          <div className="text-xs text-blue-300">ELO {user.rating}</div>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded bg-gray-700 px-3 py-1.5 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="relative rounded bg-gray-800 p-2 text-sm">
      {mode === "closed" ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className="rounded bg-gray-700 px-3 py-1.5 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="absolute right-0 top-full z-40 mt-2 w-72 space-y-2 rounded bg-gray-800 p-3 shadow-xl ring-1 ring-gray-700"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-blue-300">
              {isRegistering ? "Register" : "Log in"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setMode("closed");
                setError("");
              }}
              className="rounded px-2 py-1 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Close
            </button>
          </div>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email"
            className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isRegistering && (
            <input
              type="text"
              autoComplete="username"
              maxLength={PLAYER_NAME_MAX_LENGTH}
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder="Username"
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Password"
            className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(error || authError) && (
            <p className="text-sm text-red-300">{error || authError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isRegistering ? "Create account" : "Log in"}
          </button>
        </form>
      )}
    </div>
  );
}
