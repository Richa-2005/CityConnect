import api from "./api";

export const alertsAPI = {
  list: (active = true) =>
    api.get("/alerts", { params: { active } }).then(r => r.data),

  listAll: () =>
    api.get("/alerts").then(r => r.data),

  create: (payload) =>
    api.post("/alerts", payload).then(r => r.data),

  update: (id, payload) =>
    api.patch(`/alerts/${id}`, payload).then(r => r.data),

  remove: (id) =>
    api.delete(`/alerts/${id}`).then(r => r.data)
};