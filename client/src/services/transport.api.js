import api from "./api";

export const transportAPI = {
  stops: async (q = "") => {
    const res = await api.get(`/transport/stops${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    return res.data;
  },

  path: async (from, to) => {
    const res = await api.get(`/transport/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    return res.data;
  }
};