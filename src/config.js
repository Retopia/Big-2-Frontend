const defaultApiBaseUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3002"
    : "https://api-big2.retopia.dev";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;
