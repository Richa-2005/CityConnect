import api from "./api";

export const complaintsAPI = {
  listPublic: (sort = "new") =>
    api.get("/complaints", { params: { sort } }).then((r) => r.data),

  create: (payload) =>
    api.post("/complaints", payload).then((r) => r.data),

  vote: (id) =>
    api.post(`/complaints/${id}/vote`).then((r) => r.data),

  govList: (sort = "new") =>
    api.get("/complaints/gov/list", { params: { sort } }).then((r) => r.data),

  govUpdateStatus: (id, status) =>
    api.patch(`/complaints/gov/${id}`, { status }).then((r) => r.data),
};