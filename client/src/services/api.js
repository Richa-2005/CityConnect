import axios from "axios";

const api = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const raw =
    localStorage.getItem("cityconnect_user") ||
    localStorage.getItem("cc_user") ||
    "null";

  let user = null;
  try { user = JSON.parse(raw); } catch { user = null; }

  if (user?.id) config.headers["x-user-id"] = user.id;

  return config;
});



export default api;