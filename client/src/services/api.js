
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050", 
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("cc_user") || "null");
  if (user?.id) config.headers["x-user-id"] = user.id;
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
    
      localStorage.removeItem("cc_user");
    }
    return Promise.reject(err);
  }
);

export default api;