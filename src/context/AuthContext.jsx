import { useCallback, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import { AuthContext } from "./authContextValue";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "../utils/sessionIdentity";

async function authRequest(path, { method = "GET", body, token } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Account request failed.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getAuthToken()));
  const [authError, setAuthError] = useState("");

  const refreshUser = useCallback(async () => {
    const currentToken = getAuthToken();
    setToken(currentToken);

    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    try {
      const data = await authRequest("/api/auth/me", { token: currentToken });
      setUser(data.user || null);
      setAuthError("");
      return data.user || null;
    } catch (error) {
      if (error.status === 401) {
        clearAuthToken();
        setToken("");
        setUser(null);
      } else {
        setAuthError(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async ({ email, password }) => {
    const data = await authRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setAuthError("");
    return data.user;
  }, []);

  const register = useCallback(async ({ email, username, password }) => {
    const data = await authRequest("/api/auth/register", {
      method: "POST",
      body: { email, username, password },
    });
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setAuthError("");
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    const currentToken = getAuthToken();
    clearAuthToken();
    setToken("");
    setUser(null);

    if (currentToken) {
      try {
        await authRequest("/api/auth/logout", {
          method: "POST",
          token: currentToken,
        });
      } catch {
        // Local logout should still complete if the server session is already gone.
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      authError,
      loading,
      login,
      logout,
      refreshUser,
      register,
      token,
      user,
    }),
    [authError, loading, login, logout, refreshUser, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
