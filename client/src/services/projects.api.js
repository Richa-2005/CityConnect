import api from "./api";

export const projectsAPI = {
  list: (params = {}) =>
    api.get("/projects", { params }).then((r) => r.data),

  getOne: (id) =>
    api.get(`/projects/${id}`).then((r) => r.data),

  govCreate: (payload) =>
    api.post("/projects/gov", payload).then((r) => r.data),

  govUpdate: (id, payload) =>
    api.patch(`/projects/gov/${id}`, payload).then((r) => r.data),
};