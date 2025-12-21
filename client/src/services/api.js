
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050", 
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("cityconnect_user");
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.id) config.headers["x-user-id"] = user.id;
  }
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
    
      localStorage.removeItem("cityconnect_user");
    }
    return Promise.reject(err);
  }
);

export default api;