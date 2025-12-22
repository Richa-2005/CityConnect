import api from "./api";

export const projectsAPI = {
  list(params = {}) {
    return api.get("/projects", { params }).then(r => r.data);
  },

  create(payload) {
    return api.post("/projects/gov", payload).then(r => r.data);
  },

  update(id, payload) {
    return api.patch(`/projects/gov/${id}`, payload).then(r => r.data);
  }
};