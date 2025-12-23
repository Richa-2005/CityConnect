import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050",
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

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // ✅ during dev: don’t auto-wipe login on any 401
//     // if (err?.response?.status === 401) {
//     //   localStorage.removeItem("cityconnect_user");
//     //   localStorage.removeItem("cc_user");
//     // }
//     return Promise.reject(err);
//   }
// );

export default api;