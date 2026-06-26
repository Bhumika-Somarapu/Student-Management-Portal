import axios from "axios";

// Axios instance with base URL and timeout
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ─── Response interceptor: centralized error handling ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      (error.code === "ECONNABORTED" ? "Request timed out" : null) ||
      (error.message === "Network Error" ? "Cannot connect to server" : null) ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ─── Task API functions ───────────────────────────────────────────────────────
export const getTasks = (params = {}) =>
  api.get("/tasks", { params }).then((r) => r.data.data);

export const getStats = () =>
  api.get("/tasks/stats").then((r) => r.data.data);

export const createTask = (data) =>
  api.post("/tasks", data).then((r) => r.data.data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then((r) => r.data.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((r) => r.data);

export default api;
